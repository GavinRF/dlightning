import{T as o,R as y,L as E,a6 as b}from"./levelManager-DlJa85a7.js";import"./supabase-BPXRSdKH.js";import"./audioManager-3P7ETVi4.js";import"./three-8-mrVIKw.js";async function p(){if(!o)return console.warn("Supabase not configured"),null;try{const e=y(),{data:t,error:n}=await o.from("players").select("email, email_verified").eq("player_id",e).single();return n?(console.error("Error fetching player email:",n),null):t?.email||null}catch(e){return console.error("Error in getPlayerEmail:",e),null}}async function v(e){if(!o)return{success:!1,error:"Supabase not configured"};if(!e||!e.includes("@"))return{success:!1,error:"Invalid email address"};try{const t=y(),{data:n,error:a}=await o.rpc("set_player_email",{p_player_id:t,p_email:e.toLowerCase().trim()});return a?(console.error("Error setting email:",a),{success:!1,error:"Failed to set email"}):n===!1?{success:!1,error:"Email already in use by another account"}:{success:!0}}catch(t){return console.error("Error in setPlayerEmail:",t),{success:!1,error:"An error occurred"}}}async function h(e){try{const n=(await E.storage.getAllScores()).filter(r=>r.playerId===e);if(n.length===0){console.log("No scores found for this player");return}const a=new Map;n.forEach(r=>{if(!b(r.levelId)){const l=a.get(r.levelId),c=r.waterPercentage>=.9?3:r.waterPercentage>=.7?2:1;(!l||c>l.stars)&&a.set(r.levelId,{levelId:r.levelId,timestamp:r.timestamp,stars:c,completed:!0})}});const s=Array.from(a.values());if(localStorage.setItem("completedLevels",JSON.stringify(s)),s.length>0){const r=Math.max(...s.map(c=>c.levelId)),l=r>=21?21:r+1;localStorage.setItem("currentLevelId",l.toString()),console.log(`✅ Restored level progression: ${s.length} levels completed, current level: ${l}`)}else localStorage.setItem("currentLevelId","1"),console.log("✅ No regular levels completed, starting at level 1")}catch(t){console.error("Error restoring level progression:",t)}}async function I(e){if(!o)return{success:!1,error:"Supabase not configured"};if(!e||!e.includes("@"))return{success:!1,error:"Invalid email address"};try{const{data:t,error:n}=await o.functions.invoke("send-recovery-email",{body:{email:e.toLowerCase().trim()}});return n?(console.error("Error requesting recovery:",n),{success:!1,error:"Failed to send recovery email"}):{success:!0,message:t.message||"If that email is registered, you will receive a recovery link."}}catch(t){return console.error("Error in requestRecovery:",t),{success:!1,error:"An error occurred"}}}async function k(e){if(!o)return{success:!1,error:"Supabase not configured"};if(!e)return{success:!1,error:"Invalid recovery token"};try{const{data:t,error:n}=await o.functions.invoke("verify-recovery-token",{body:{token:e}});return n?(console.error("Error verifying token:",n),{success:!1,error:"Invalid or expired recovery token"}):t.success?(localStorage.setItem("oasea_player_id",t.player_id),t.display_name&&(localStorage.setItem("oasea_player_name",t.display_name),localStorage.setItem("oasea_player_name_set","true")),console.log("✅ Account recovered:",t.player_id),await h(t.player_id),{success:!0,playerId:t.player_id,displayName:t.display_name}):{success:!1,error:t.error||"Invalid recovery token"}}catch(t){return console.error("Error in verifyRecoveryToken:",t),{success:!1,error:"An error occurred"}}}function C(){const e=document.getElementById("stats-content");if(!e||document.getElementById("email-management-section"))return;const t=document.createElement("div");t.id="email-management-section",t.className="email-management-section",t.innerHTML=`
    <div class="stat-card email-card">
      <h5>Account Recovery</h5>
      <p style="font-size: 0.9em; opacity: 0.8; margin-bottom: 10px;">
        Save your email to recover your account.
      </p>
      <div id="email-status">
        <div class="email-loading">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `,e.insertBefore(t,e.firstChild),f()}async function f(){const e=document.getElementById("email-status");if(!e)return;const t=await p();t?(e.innerHTML=`
      <div class="email-set">
        <span class="material-icons" style="color: #4CAF50;">check_circle</span>
        <span style="margin-left: 8px;">${t}</span>
      </div>
      <button id="change-email-btn" class="secondary-btn">
        Change Email
      </button>
      <div style="margin-top: 15px; text-align: center;">
        <a href="#" id="stats-recovery-link" style="font-size: 0.85em; opacity: 0.7; text-decoration: none; color: inherit;">
          <span class="material-icons" style="font-size: 14px; vertical-align: middle;">restore</span>
          Recover a different account
        </a>
      </div>
    `,document.getElementById("change-email-btn")?.addEventListener("click",d),document.getElementById("stats-recovery-link")?.addEventListener("click",n=>{n.preventDefault(),i()})):(e.innerHTML=`
      <button id="add-email-btn" class="play-btn">
        <span class="material-icons">email</span>
        Add Email
      </button>
      <div style="margin-top: 15px; text-align: center;">
        <a href="#" id="stats-recovery-link" style="font-size: 0.85em; opacity: 0.7; text-decoration: none; color: inherit;">
          <span class="material-icons" style="font-size: 14px; vertical-align: middle;">restore</span>
          Recover account
        </a>
      </div>
    `,document.getElementById("add-email-btn")?.addEventListener("click",d),document.getElementById("stats-recovery-link")?.addEventListener("click",n=>{n.preventDefault(),i()}))}function d(){const e=document.getElementById("email-prompt-modal");if(!e)return L(),d();e.style.display="flex";const t=document.getElementById("email-input");t&&(t.value="",t.focus())}function L(){const e=document.createElement("div");e.id="email-prompt-modal",e.className="modal",e.style.display="none",e.innerHTML=`
    <div class="modal-content score-content">
      <h2>Save Your Account</h2>
      <p style="text-align: center; margin-bottom: 20px;">
        Enter your email to enable account recovery.<br>
        <small style="opacity: 0.7;">Your email is only used for account recovery.</small>
      </p>

      <div class="name-input-container">
        <input
          type="email"
          id="email-input"
          placeholder="your@email.com"
          autocomplete="email"
        />
      </div>

      <div id="email-error" class="error-message" style="display: none;"></div>

      <button id="save-email-btn" class="play-btn">
        <span class="material-icons">check</span>
        Save Email
      </button>

      <button id="cancel-email-btn" class="secondary-btn" style="margin-top: 10px;">
        Cancel
      </button>
    </div>
  `,document.body.appendChild(e),document.getElementById("save-email-btn")?.addEventListener("click",m),document.getElementById("cancel-email-btn")?.addEventListener("click",()=>{e.style.display="none"}),e.addEventListener("click",t=>{t.target===e&&(e.style.display="none")}),document.getElementById("email-input")?.addEventListener("keypress",t=>{t.key==="Enter"&&m()})}async function m(){const e=document.getElementById("email-input"),t=document.getElementById("email-error"),n=document.getElementById("save-email-btn");if(!e||!t||!n)return;const a=e.value.trim();if(!a||!a.includes("@")){t.textContent="Please enter a valid email address",t.style.display="block";return}n.disabled=!0,n.innerHTML='<span class="material-icons rotating">hourglass_empty</span> Saving...';const s=await v(a);s.success?(t.style.display="none",n.innerHTML='<span class="material-icons">check</span> Saved!',setTimeout(()=>{document.getElementById("email-prompt-modal").style.display="none",n.disabled=!1,n.innerHTML='<span class="material-icons">check</span> Save Email',f()},1500)):(t.textContent=s.error||"Failed to save email",t.style.display="block",n.disabled=!1,n.innerHTML='<span class="material-icons">check</span> Save Email')}function P(){const t=new URLSearchParams(window.location.search).get("token");t&&g(t),S()}async function g(e){const t=document.getElementById("recovery-modal");if(!t)return B(),g(e);t.style.display="flex";const n=document.getElementById("recovery-status");if(!n)return;n.innerHTML=`
    <div class="stats-loading-animation">
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="collection"></div>
    </div>
    <p>Recovering your account...</p>
  `;const a=await k(e);a.success?(n.innerHTML=`
      <div style="text-align: center;">
        <span class="material-icons" style="font-size: 64px; color: #4CAF50;">check_circle</span>
        <h2>Welcome Back${a.displayName?", "+a.displayName:""}!</h2>
        <p>Your account has been recovered successfully.</p>
        <button id="continue-btn" class="play-btn" style="margin-top: 20px;">
          <span class="material-icons">play_arrow</span>
          Continue Playing
        </button>
      </div>
    `,document.getElementById("continue-btn")?.addEventListener("click",()=>{t.style.display="none",window.history.replaceState({},document.title,window.location.pathname),window.location.reload()})):(n.innerHTML=`
      <div style="text-align: center;">
        <span class="material-icons" style="font-size: 64px; color: #f44336;">error</span>
        <h2>Recovery Failed</h2>
        <p>${a.error||"Invalid or expired recovery link."}</p>
        <button id="try-again-btn" class="secondary-btn" style="margin-top: 20px;">
          Request New Link
        </button>
      </div>
    `,document.getElementById("try-again-btn")?.addEventListener("click",()=>{t.style.display="none",i()}))}function B(){const e=document.createElement("div");e.id="recovery-modal",e.className="modal",e.style.display="none",e.innerHTML=`
    <div class="modal-content score-content">
      <h2>Account Recovery</h2>
      <div id="recovery-status">
        <!-- Populated dynamically -->
      </div>
    </div>
  `,document.body.appendChild(e)}function i(){const e=document.getElementById("recovery-request-modal");if(!e)return x(),i();e.style.display="flex";const t=document.getElementById("recovery-email-input");t&&(t.value="",t.focus());const n=document.getElementById("recovery-request-status");n&&(n.style.display="none")}function x(){const e=document.createElement("div");e.id="recovery-request-modal",e.className="modal",e.style.display="none",e.innerHTML=`
    <div class="modal-content score-content">
      <h2>Recover Your Account</h2>
      <p style="text-align: center; margin-bottom: 20px;">
        Enter the email you used to save your account.
      </p>

      <div class="name-input-container">
        <input
          type="email"
          id="recovery-email-input"
          placeholder="your@email.com"
          autocomplete="email"
        />
      </div>

      <div id="recovery-request-status" class="info-message" style="display: none;"></div>

      <button id="send-recovery-btn" class="play-btn">
        <span class="material-icons">email</span>
        Send Recovery Link
      </button>

      <button id="cancel-recovery-btn" class="secondary-btn" style="margin-top: 10px;">
        Cancel
      </button>
    </div>
  `,document.body.appendChild(e),document.getElementById("send-recovery-btn")?.addEventListener("click",u),document.getElementById("cancel-recovery-btn")?.addEventListener("click",()=>{e.style.display="none"}),e.addEventListener("click",t=>{t.target===e&&(e.style.display="none")}),document.getElementById("recovery-email-input")?.addEventListener("keypress",t=>{t.key==="Enter"&&u()})}async function u(){const e=document.getElementById("recovery-email-input"),t=document.getElementById("recovery-request-status"),n=document.getElementById("send-recovery-btn");if(!e||!t||!n)return;const a=e.value.trim();if(!a||!a.includes("@")){t.textContent="Please enter a valid email address",t.className="error-message",t.style.display="block";return}n.disabled=!0,n.innerHTML='<span class="material-icons rotating">hourglass_empty</span> Sending...';const s=await I(a);s.success?(t.textContent=s.message||"Check your email for a recovery link!",t.className="info-message",t.style.display="block",n.innerHTML='<span class="material-icons">check</span> Sent!',setTimeout(()=>{document.getElementById("recovery-request-modal").style.display="none",n.disabled=!1,n.innerHTML='<span class="material-icons">email</span> Send Recovery Link'},3e3)):(t.textContent=s.error||"Failed to send recovery email",t.className="error-message",t.style.display="block",n.disabled=!1,n.innerHTML='<span class="material-icons">email</span> Send Recovery Link')}function S(){const e=document.getElementById("splash-buttons");if(!e||document.getElementById("recovery-link")||localStorage.getItem("oasea_player_id")!==null)return;const n=document.createElement("button");n.id="recovery-link",n.className="secondary-btn",n.style.marginTop="10px",n.innerHTML=`
    <span class="material-icons" style="font-size: 16px;">restore</span>
    Recover Account
  `,n.addEventListener("click",i),e.appendChild(n)}function H(e=null){p().then(t=>{t||setTimeout(()=>{const n=document.getElementById("first-completion-email-modal");if(!n)w(),setTimeout(()=>{const a=document.getElementById("first-completion-email-modal");if(a.style.display="flex",e){const s=document.getElementById("first-completion-email-input");s&&(s.value=e)}},100);else if(n.style.display="flex",e){const a=document.getElementById("first-completion-email-input");a&&(a.value=e)}},1500)})}function w(){const e=document.createElement("div");e.id="first-completion-email-modal",e.className="modal",e.style.display="none",e.innerHTML=`
    <div class="modal-content score-content">
      <h2>Protect Your Purchase</h2>

      <p style="text-align: center; margin-bottom: 20px; font-size: 0.9em; opacity: 0.8;">
       Add an email to recover your purchase if you ever clear your browser data or switch devices.
      </p>

      <div class="name-input-container">
        <input
          type="email"
          id="first-completion-email-input"
          placeholder="your@email.com"
          autocomplete="email"
        />
      </div>

      <div id="first-completion-email-error" class="error-message" style="display: none;"></div>

      <button id="save-first-completion-email-btn" class="play-btn">
        <span class="material-icons">check</span>
        Save Email
      </button>

      <button id="skip-email-btn" class="secondary-btn" style="margin-top: 10px;">
        Skip for Now
      </button>
    </div>
  `,document.body.appendChild(e),document.getElementById("save-first-completion-email-btn")?.addEventListener("click",async()=>{const t=document.getElementById("first-completion-email-input"),n=document.getElementById("first-completion-email-error"),a=document.getElementById("save-first-completion-email-btn");if(!t||!n||!a)return;const s=t.value.trim();if(!s||!s.includes("@")){n.textContent="Please enter a valid email address",n.style.display="block";return}a.disabled=!0,a.innerHTML='<span class="material-icons rotating">hourglass_empty</span> Saving...';const r=await v(s);r.success?(n.style.display="none",a.innerHTML='<span class="material-icons">check</span> Saved!',setTimeout(()=>{e.style.display="none",a.disabled=!1,a.innerHTML='<span class="material-icons">check</span> Save Email'},1500)):(n.textContent=r.error||"Failed to save email",n.style.display="block",a.disabled=!1,a.innerHTML='<span class="material-icons">check</span> Save Email')}),document.getElementById("skip-email-btn")?.addEventListener("click",()=>{e.style.display="none"}),document.getElementById("first-completion-email-input")?.addEventListener("keypress",t=>{t.key==="Enter"&&document.getElementById("save-first-completion-email-btn")?.click()})}export{p as getPlayerEmail,C as initEmailManagementUI,P as initRecoveryFlow,I as requestRecovery,v as setPlayerEmail,H as showEmailPromptForPayingCustomer,k as verifyRecoveryToken};
