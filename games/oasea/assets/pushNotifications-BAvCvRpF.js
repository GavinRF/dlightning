// Push Notification Subscription Manager
// Handles Web Push opt-in/opt-out and Supabase subscription storage.

import { supabase } from './supabaseConfig.js';
import { getOrCreatePlayerId } from './scoreSystem.js';

// VAPID public key — matches private key stored in Supabase secrets.
// Set VITE_VAPID_PUBLIC_KEY in .env for local dev, or hardcode after generating keys.
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

const STORAGE_KEY = 'oasea_push_enabled'; // 'true' | 'false' | null

// Convert a URL-safe base64 string to Uint8Array (required by pushManager.subscribe)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

// Convert an ArrayBuffer to a plain base64 string
function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

/**
 * Returns true if this browser supports Web Push.
 * On iOS, push only works for PWAs installed to the Home Screen (iOS 16.4+).
 */
export function isPushSupported() {
  return 'Notification' in window && 'PushManager' in window && 'serviceWorker' in navigator;
}

/**
 * Returns the current browser notification permission.
 * @returns {'default'|'granted'|'denied'|'unsupported'}
 */
export function getNotificationPermission() {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Returns the player's saved push preference from localStorage.
 * @returns {'true'|'false'|null}
 */
export function getPushPreference() {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Subscribe the current browser to push notifications and store in Supabase.
 * @returns {{ success: boolean, reason?: string }}
 */
export async function subscribeToPush() {
  if (!VAPID_PUBLIC_KEY) {
    console.warn('Push: VITE_VAPID_PUBLIC_KEY is not set');
    return { success: false, reason: 'no_key' };
  }

  // 1. Request browser notification permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { success: false, reason: 'denied' };
  }

  // 2. Get the active service worker registration
  const registration = await navigator.serviceWorker.ready;

  // 3. Subscribe with the VAPID public key
  let subscription;
  try {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
  } catch (err) {
    console.error('Push subscribe error:', err);
    return { success: false, reason: 'subscribe_error' };
  }

  // 4. Extract keys
  const endpoint = subscription.endpoint;
  const p256dh   = arrayBufferToBase64(subscription.getKey('p256dh'));
  const auth     = arrayBufferToBase64(subscription.getKey('auth'));
  const playerId = getOrCreatePlayerId();

  // 5. Upsert into Supabase (endpoint is the unique key — handles re-subscription cleanly)
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { player_id: playerId, endpoint, p256dh, auth, is_active: true, last_used_at: new Date().toISOString() },
      { onConflict: 'endpoint' }
    );

  if (error) {
    console.error('Push DB upsert error:', error);
    return { success: false, reason: 'db_error' };
  }

  localStorage.setItem(STORAGE_KEY, 'true');
  return { success: true };
}

/**
 * Unsubscribe the current browser from push notifications.
 * Soft-deletes the DB row (is_active = false) so the row is retained for analytics.
 * @returns {{ success: boolean }}
 */
export async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Soft-delete in DB first, then unsubscribe browser
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('endpoint', subscription.endpoint);

      await subscription.unsubscribe();
    }
  } catch (err) {
    console.error('Push unsubscribe error:', err);
  }

  localStorage.setItem(STORAGE_KEY, 'false');
  return { success: true };
}

/**
 * Sync saved push preference with actual browser subscription state.
 * Call on app start: if the user had opted in but the browser subscription is gone
 * (e.g. they cleared site data), reset the saved preference so the UI stays correct.
 */
export async function syncPushSubscriptionState() {
  if (!isPushSupported()) return;
  if (getPushPreference() !== 'true') return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      // Browser no longer has a subscription — reset saved state
      localStorage.setItem(STORAGE_KEY, 'false');
    }
  } catch {
    // Silently ignore — state will self-correct next time the settings modal opens
  }
}
