import{a as we,c as st,d as mi,U as pi,B as gi,V as w,e as Tr,f as Lo,T as Co,Q as kt,g as ks,h as Se,R as Mr,i as xr,j as ae,P as Bn,k as vi,l as ha,m as Dr,n as ie,o as Er,p as Pr,W as Mn,q as xn,r as Dn,L as nt,O as Wn,D as rt,b as un,s as no,S as bs,t as xa,u as _r,v as Ar,G as Zt,w as Cr,x as Ir,y as Ts,N as yi,z as Ms,A as Lr,E as Vn,H as wi,I as Rr,J as ra,K as Si,X as wt,Y as Ht,Z as fa,_ as Or,$ as Fr,a0 as xs,a1 as zt,a2 as Un,a3 as Xn,a4 as bi,a5 as kr,a6 as Hr,a7 as Ti,a8 as zr,a9 as Nr,aa as Br,ab as Mi,ac as Wr,ad as Vr,ae as En,af as Ur,ag as dn,M as Ct,ah as Xr,ai as Gr,aj as jr,ak as Zr,al as qr,am as xi,an as Yr,ao as Kr,ap as $r,aq as Jr,ar as Di,as as Qr,at as Hs,au as zs,av as Ns,aw as Bs,ax as Ws,ay as el,az as tl,aA as ol,aB as al,aC as hn,aD as We,aE as nl,C as Ds,aF as sl,aG as il,aH as wo,aI as rl,aJ as ll,aK as cl,aL as ul,aM as dl,aN as hl}from"./three-a87GWk7o.js";import{B as Da,T as fl,V as at,C as ml,a as pl,S as fn,W as gl,M as Ei,b as vl,c as yl}from"./physics-Cb4MsTzb.js";import{c as wl,_ as qt}from"./supabase-D6xm0ZbH.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();class mn extends we{constructor(){const e=mn.SkyShader,t=new st({name:e.name,uniforms:pi.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:mi,depthWrite:!1});super(new gi(1,1,1),t),this.isSky=!0}}mn.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new w},up:{value:new w(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};const Vs={type:"change"},Es={type:"start"},Pi={type:"end"},_a=new Mr,Us=new xr,Sl=Math.cos(70*ae.DEG2RAD),Me=new w,Ne=2*Math.PI,$={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Pn=1e-6;class bl extends Tr{constructor(e,t=null){super(e,t),this.state=$.NONE,this.target=new w,this.cursor=new w,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Lo.ROTATE,MIDDLE:Lo.DOLLY,RIGHT:Lo.PAN},this.touches={ONE:Co.ROTATE,TWO:Co.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new w,this._lastQuaternion=new kt,this._lastTargetPosition=new w,this._quat=new kt().setFromUnitVectors(e.up,new w(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ks,this._sphericalDelta=new ks,this._scale=1,this._panOffset=new w,this._rotateStart=new Se,this._rotateEnd=new Se,this._rotateDelta=new Se,this._panStart=new Se,this._panEnd=new Se,this._panDelta=new Se,this._dollyStart=new Se,this._dollyEnd=new Se,this._dollyDelta=new Se,this._dollyDirection=new w,this._mouse=new Se,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ml.bind(this),this._onPointerDown=Tl.bind(this),this._onPointerUp=xl.bind(this),this._onContextMenu=Il.bind(this),this._onMouseWheel=Pl.bind(this),this._onKeyDown=_l.bind(this),this._onTouchStart=Al.bind(this),this._onTouchMove=Cl.bind(this),this._onMouseDown=Dl.bind(this),this._onMouseMove=El.bind(this),this._interceptControlDown=Ll.bind(this),this._interceptControlUp=Rl.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Vs),this.update(),this.state=$.NONE}update(e=null){const t=this.object.position;Me.copy(t).sub(this.target),Me.applyQuaternion(this._quat),this._spherical.setFromVector3(Me),this.autoRotate&&this.state===$.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let o=this.minAzimuthAngle,n=this.maxAzimuthAngle;isFinite(o)&&isFinite(n)&&(o<-Math.PI?o+=Ne:o>Math.PI&&(o-=Ne),n<-Math.PI?n+=Ne:n>Math.PI&&(n-=Ne),o<=n?this._spherical.theta=Math.max(o,Math.min(n,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(o+n)/2?Math.max(o,this._spherical.theta):Math.min(n,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const s=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=s!=this._spherical.radius}if(Me.setFromSpherical(this._spherical),Me.applyQuaternion(this._quatInverse),t.copy(this.target).add(Me),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let s=null;if(this.object.isPerspectiveCamera){const l=Me.length();s=this._clampDistance(l*this._scale);const r=l-s;this.object.position.addScaledVector(this._dollyDirection,r),this.object.updateMatrixWorld(),i=!!r}else if(this.object.isOrthographicCamera){const l=new w(this._mouse.x,this._mouse.y,0);l.unproject(this.object);const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=r!==this.object.zoom;const u=new w(this._mouse.x,this._mouse.y,0);u.unproject(this.object),this.object.position.sub(u).add(l),this.object.updateMatrixWorld(),s=Me.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;s!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position):(_a.origin.copy(this.object.position),_a.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(_a.direction))<Sl?this.object.lookAt(this.target):(Us.setFromNormalAndCoplanarPoint(this.object.up,this.target),_a.intersectPlane(Us,this.target))))}else if(this.object.isOrthographicCamera){const s=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),s!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>Pn||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Pn||this._lastTargetPosition.distanceToSquared(this.target)>Pn?(this.dispatchEvent(Vs),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Ne/60*this.autoRotateSpeed*e:Ne/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Me.setFromMatrixColumn(t,0),Me.multiplyScalar(-e),this._panOffset.add(Me)}_panUp(e,t){this.screenSpacePanning===!0?Me.setFromMatrixColumn(t,1):(Me.setFromMatrixColumn(t,0),Me.crossVectors(this.object.up,Me)),Me.multiplyScalar(e),this._panOffset.add(Me)}_pan(e,t){const o=this.domElement;if(this.object.isPerspectiveCamera){const n=this.object.position;Me.copy(n).sub(this.target);let i=Me.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/o.clientHeight,this.object.matrix),this._panUp(2*t*i/o.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/o.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/o.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const o=this.domElement.getBoundingClientRect(),n=e-o.left,i=t-o.top,s=o.width,l=o.height;this._mouse.x=n/s*2-1,this._mouse.y=-(i/l)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ne*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ne*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Ne*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Ne*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Ne*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Ne*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._rotateStart.set(o,n)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panStart.set(o,n)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),o=e.pageX-t.x,n=e.pageY-t.y,i=Math.sqrt(o*o+n*n);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const o=this._getSecondPointerPosition(e),n=.5*(e.pageX+o.x),i=.5*(e.pageY+o.y);this._rotateEnd.set(n,i)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ne*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ne*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panEnd.set(o,n)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),o=e.pageX-t.x,n=e.pageY-t.y,i=Math.sqrt(o*o+n*n);this._dollyEnd.set(0,i),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const s=(e.pageX+t.x)*.5,l=(e.pageY+t.y)*.5;this._updateZoomParameters(s,l)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Se,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,o={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:o.deltaY*=16;break;case 2:o.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(o.deltaY*=10),o}}function Tl(a){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(a.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(a)&&(this._addPointer(a),a.pointerType==="touch"?this._onTouchStart(a):this._onMouseDown(a)))}function Ml(a){this.enabled!==!1&&(a.pointerType==="touch"?this._onTouchMove(a):this._onMouseMove(a))}function xl(a){switch(this._removePointer(a),this._pointers.length){case 0:this.domElement.releasePointerCapture(a.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Pi),this.state=$.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Dl(a){let e;switch(a.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Lo.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(a),this.state=$.DOLLY;break;case Lo.ROTATE:if(a.ctrlKey||a.metaKey||a.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(a),this.state=$.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(a),this.state=$.ROTATE}break;case Lo.PAN:if(a.ctrlKey||a.metaKey||a.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(a),this.state=$.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(a),this.state=$.PAN}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(Es)}function El(a){switch(this.state){case $.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(a);break;case $.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(a);break;case $.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(a);break}}function Pl(a){this.enabled===!1||this.enableZoom===!1||this.state!==$.NONE||(a.preventDefault(),this.dispatchEvent(Es),this._handleMouseWheel(this._customWheelEvent(a)),this.dispatchEvent(Pi))}function _l(a){this.enabled!==!1&&this._handleKeyDown(a)}function Al(a){switch(this._trackPointer(a),this._pointers.length){case 1:switch(this.touches.ONE){case Co.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(a),this.state=$.TOUCH_ROTATE;break;case Co.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(a),this.state=$.TOUCH_PAN;break;default:this.state=$.NONE}break;case 2:switch(this.touches.TWO){case Co.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(a),this.state=$.TOUCH_DOLLY_PAN;break;case Co.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(a),this.state=$.TOUCH_DOLLY_ROTATE;break;default:this.state=$.NONE}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(Es)}function Cl(a){switch(this._trackPointer(a),this.state){case $.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(a),this.update();break;case $.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(a),this.update();break;case $.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(a),this.update();break;case $.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(a),this.update();break;default:this.state=$.NONE}}function Il(a){this.enabled!==!1&&a.preventDefault()}function Ll(a){a.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Rl(a){a.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const{lerp:Qt}=ae,Oe=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];for(let a=0;a<256;a++)Oe[256+a]=Oe[a];function _n(a){return a*a*a*(a*(a*6-15)+10)}function Wt(a,e,t,o){const n=a&15,i=n<8?e:t,s=n<4?t:n==12||n==14?e:o;return((n&1)==0?i:-i)+((n&2)==0?s:-s)}class Ol{noise(e,t,o){const n=Math.floor(e),i=Math.floor(t),s=Math.floor(o),l=n&255,r=i&255,u=s&255;e-=n,t-=i,o-=s;const c=e-1,d=t-1,h=o-1,p=_n(e),m=_n(t),g=_n(o),v=Oe[l]+r,S=Oe[v]+u,T=Oe[v+1]+u,y=Oe[l+1]+r,b=Oe[y]+u,M=Oe[y+1]+u;return Qt(Qt(Qt(Wt(Oe[S],e,t,o),Wt(Oe[b],c,t,o),p),Qt(Wt(Oe[T],e,d,o),Wt(Oe[M],c,d,o),p),m),Qt(Qt(Wt(Oe[S+1],e,t,h),Wt(Oe[b+1],c,t,h),p),Qt(Wt(Oe[T+1],e,d,h),Wt(Oe[M+1],c,d,h),p),m),g)}}function _i(a={}){const{segments:e=34,normalMapPath:t="sand-normal.jpg",physicsWorld:o,groundMaterial:n,shape:i={},waterLevel:s=-2.87}=a,l=i.size||18,r={scaleX:i.scaleX||1,scaleY:i.scaleY||1,tilt:i.tilt||{angle:0,amount:0},bay:i.bay||{angle:0,depth:0,width:0},irregularity:i.irregularity||1,distortion:i.distortion||{frequency:.5,amplitude:.3,randomness:.2},turbulence:i.turbulence||null,islandRadius:i.islandRadius||l*.365},u=r.islandRadius,c=u+u*0,d=u+u*.26,h=u+u*.75,p=5.8,m=-4.6,g=512,v=new Bn(l,l,e,e),S=v.attributes.position;function T(D,O){const F=Math.atan2(O,D),U=Math.sqrt(D*D+O*O),q=Math.sin(F*3+U*.5)*.4,j=Math.sin(F*5-U*.3)*.25,ne=Math.sin(F*7+U*.7)*.2;return(q+j+ne)*r.irregularity}function y(D,O){const F=D/r.scaleX,U=O/r.scaleY;let q=Math.sqrt(F*F+U*U);if(r.bay.depth>0){const j=Math.atan2(O,D),ne=r.bay.angle,Q=r.bay.width;let B=Math.abs(j-ne);if(B>Math.PI&&(B=2*Math.PI-B),B<Q){const G=Math.cos(B/Q*Math.PI/2);q+=r.bay.depth*G}}return q}function b(D,O){if(r.tilt.amount===0)return 0;const F=Math.atan2(O,D),U=r.tilt.angle;return Math.cos(F-U)*r.tilt.amount}function M(D,O){if(!r.turbulence)return 0;const{strength:F=3,scale:U=.3,octaves:q=3}=r.turbulence;let j=0,ne=F,Q=U,B=0;for(let G=0;G<q;G++){const Z=Math.sin(D*Q+G*10)*Math.cos(O*Q+G*5),le=Math.sin((D+O)*Q*1.3+G*7),_=Math.cos((D-O)*Q*.7+G*3),fe=(Z+le*.5+_*.3)*ne;j+=fe,B+=ne,ne*=.5,Q*=2}return j/B*F}for(let D=0;D<S.count;D++){const O=S.getX(D),F=S.getY(D),U=S.getZ(D),q=y(O,F),j=T(O,F)*1.5,ne=u+j,Q=c+j*.8,B=d+j*.6,G=h+j*.4,Z=r.distortion,le=.51+Math.sin(O*Z.frequency)*Math.cos(F*Z.frequency*1.04)*Z.amplitude+Math.random()*Z.randomness;let _;if(q<ne)_=le;else if(q<Q){const Re=(q-ne)/(Q-ne),Qe=Re*Re*(3-2*Re);_=le*(1-Qe*.4)}else if(q<B){const Re=(q-Q)/(B-Q),Qe=Re*Re*(3-2*Re);_=le*.6-Qe*3.5}else if(q<G){const Re=le*.6-3.5,Qe=(q-B)/(G-B),ta=Qe*Qe*(3-2*Qe);_=Re-ta*(63+Re)}else _=-63;_+=b(O,F),q<B&&(_+=M(O,F));const fe=l/2,me=Math.abs(O)/fe,pe=Math.abs(F)/fe,ge=Math.max(me,pe),Dt=.85,ea=1;if(ge>Dt&&_>s-2){const Re=(ge-Dt)/(ea-Dt),Qe=Re*Re*(3-2*Re),ta=s-2;_=Math.min(_,_*(1-Qe)+ta*Qe)}S.setZ(D,U+_)}S.needsUpdate=!0,v.computeVertexNormals();function C(D){const F=D.attributes.position,U=D.attributes.uv,q=D.index,j=e+1,ne=[],Q=[],B=[];for(let _=0;_<F.count;_++)ne.push(F.getX(_),F.getY(_),F.getZ(_)),Q.push(U.getX(_),U.getY(_));for(let _=0;_<q.count;_++)B.push(q.getX(_));const G=F.count;for(let _=0;_<F.count;_++)ne.push(F.getX(_),F.getY(_),-63),Q.push(U.getX(_),U.getY(_));function Z(_,fe){return _*j+fe}for(let _=0;_<e;_++){const fe=Z(0,_),me=Z(0,_+1),pe=fe+G,ge=me+G;B.push(fe,me,pe),B.push(me,ge,pe)}for(let _=0;_<e;_++){const fe=Z(e,_),me=Z(e,_+1),pe=fe+G,ge=me+G;B.push(fe,pe,me),B.push(me,pe,ge)}for(let _=0;_<e;_++){const fe=Z(_,0),me=Z(_+1,0),pe=fe+G,ge=me+G;B.push(fe,pe,me),B.push(me,pe,ge)}for(let _=0;_<e;_++){const fe=Z(_,e),me=Z(_+1,e),pe=fe+G,ge=me+G;B.push(fe,me,pe),B.push(me,ge,pe)}const le=new un;return le.setAttribute("position",new no(new Float32Array(ne),3)),le.setAttribute("uv",new no(new Float32Array(Q),2)),le.setIndex(B),le.computeVertexNormals(),le}const I=C(v);v.dispose();const A=I,H=A.attributes.position;function L(D,O){const F=y(D,O),U=T(D,O)*1.5,q=u+U,j=c+U*.8,ne=d+U*.6,Q=h+U*.4,B=.51+Math.sin(D*.5)*Math.cos(O*.52)*.3;let G;if(F<q)G=B;else if(F<j){const Z=(F-q)/(j-q),le=Z*Z*(3-2*Z);G=B*(1-le*.4)}else if(F<ne){const Z=(F-j)/(ne-j),le=Z*Z*(3-2*Z);G=B*.6-le*3.5}else if(F<Q){const Z=B*.6-3.5,le=(F-ne)/(Q-ne),_=le*le*(3-2*le);G=Z-_*(63+Z)}else G=-63;return G+=b(D,O),G}function W(){const D=(Math.random()-.5)*(l*.8),O=(Math.random()-.5)*(l*.8);return{x:D,z:O}}function de(){const D=[],O=[];for(let U=0;U<H.count;U++)D.push(H.getX(U),H.getY(U),H.getZ(U));const F=A.index;for(let U=0;U<F.count;U++)O.push(F.getX(U));return new fl(D,O)}const Y=de(),K=new Da({mass:0,material:n});K.addShape(Y),K.quaternion.setFromEuler(-Math.PI/2,0,0),o.addBody(K);function ze(){o.removeBody(K);const D=de();K.shapes=[D],K.updateBoundingRadius(),K.updateAABB(),o.addBody(K)}let re=null;function he(D,O){const q=H.count/2;for(let j=0;j<q;j++){const ne=H.getX(j),Q=H.getY(j),B=ne-D.x,G=Q-D.y,Z=B*B+G*G;if(Z<4){const _=1-Math.sqrt(Z)/2,me=H.getZ(j)+O*_*.02,pe=Math.max(m,Math.min(p,me));H.setZ(j,pe)}}H.needsUpdate=!0,A.computeVertexNormals(),A.computeBoundingBox(),re&&bo(re)}const ot=new vi().load(t);ot.wrapS=ha,ot.wrapT=ha,ot.repeat.set(16,16);const $e=new st({uniforms:pi.merge([Dr.lights,{normalMap:{value:ot},midLowColor:{value:new w(.9,.6,.2)},midColor:{value:new w(1,.8,.3)},midHighColor:{value:new w(1,.6,.4)},uFogColor:{value:new ie(943004)},uFogStart:{value:-18.87},uFogEnd:{value:-2.87},depthTest:!0,uTime:{value:0},uWaterLevel:{value:s},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uFoamDepth:{value:.35},uFoamEnabled:{value:!1},uWaterMeshOffset:{value:new Se(0,0)},uWaterMeshPosition:{value:new Se(0,0)},uWaterCurvature:{value:2e-5},uWetnessMap:{value:null},uWetnessMapSize:{value:g},uUseWetnessMap:{value:!1}}]),lights:!0,vertexShader:`
      #include <common>
      #include <shadowmap_pars_vertex>

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying vec3 vTangent;
      varying vec3 vBitangent;

      void main() {
        vPosition = position;
        vec3 transformedNormal = normalize(normalMatrix * normal);
        vNormal = transformedNormal;

        vec3 transformed = position;
        vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
        vWorldPosition = worldPosition.xyz;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vUv = uv;

        // Calculate tangent space for normal mapping
        vec3 c1 = cross(normal, vec3(0.0, 3.0, 1.0));
        vec3 c2 = cross(normal, vec3(0.0, 1.0, 0.0));
        vec3 tangent = length(c1) > length(c2) ? c1 : c2;
        vTangent = normalize(normalMatrix * tangent);
        vBitangent = cross(vNormal, vTangent);

        gl_Position = projectionMatrix * mvPosition;

        #include <shadowmap_vertex>
      }
    `,fragmentShader:`
      #include <common>
      #include <packing>
      #include <shadowmap_pars_fragment>

      uniform sampler2D normalMap;
      uniform vec3 midLowColor;
      uniform vec3 midColor;
      uniform vec3 midHighColor;
      uniform vec3 uFogColor;
      uniform float uFogStart;
      uniform float uFogEnd;
      // Foam uniforms
      uniform float uTime;
      uniform float uWaterLevel;
      uniform float uWaveAmplitude;
      uniform float uWaveFrequency;
      uniform float uWaveHeightMultiplier;
      uniform float uFoamDepth;
      uniform bool uFoamEnabled;
      uniform vec2 uWaterMeshOffset;      // For wave calculations
      uniform vec2 uWaterMeshPosition;    // For curvature calculations
      uniform float uWaterCurvature;
      // Wetness map uniforms
      uniform sampler2D uWetnessMap;
      uniform float uWetnessMapSize;
      uniform bool uUseWetnessMap;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying vec3 vTangent;
      varying vec3 vBitangent;

      // Hash function for noise (EXACT match to water shader)
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(3127.1, 31.7))) * 43758.5453);
      }

      // Hash function that returns vec2 for foam pattern
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453);
      }

      // Smooth noise with quintic interpolation (EXACT match to water shader)
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        // Quintic interpolation (Ken Perlin's improved smoothstep)
        f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // Fractal Brownian Motion for smoother waves (EXACT match to water shader)
      float fbmWaves(vec2 p) {
        float value = 0.212;
        float amplitude = uWaveAmplitude;
        float frequency = uWaveFrequency;

        for(int i = 0; i < 2; i++) {
          value += amplitude * smoothNoise(p * frequency);
          frequency *= 2.4;
          amplitude *= 0.09;
        }
        return value;
      }

      // Wave height calculation (EXACT match to water shader)
      float getWaveHeight(vec2 worldXZ) {
        float wave1 = fbmWaves(worldXZ * 0.15 + vec2(uTime * 0.08, uTime * 0.15));
        float wave2 = fbmWaves(worldXZ * 0.08 - vec2(uTime * 0.08, uTime * 0.12));
        return (wave1 * 0.5 + wave2 * 0.5) - 0.5;
      }

      // Voronoi-style foam texture with larger bubbles
      float foamPattern(vec2 uv, float scale) {
        vec2 p = uv * scale; // Variable scale for different foam sizes
        vec2 f = fract(p);
        vec2 i = floor(p);

        float minDist = 1.0;
        float secondMinDist = 1.0;

        // Check neighboring cells for closest point
        for(int y = -1; y <= 1; y++) {
          for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = hash2(i + neighbor);
            vec2 diff = neighbor + point - f;
            float dist = length(diff);

            if(dist < minDist) {
              secondMinDist = minDist;
              minDist = dist;
            } else if(dist < secondMinDist) {
              secondMinDist = dist;
            }
          }
        }

        // Create larger foam bubbles with more variation
        float bubble = 1.0 - smoothstep(0.05, 0.5, minDist);

        // Add bubble edges (thinner lines between bubbles)
        float edges = smoothstep(0.0, 0.1, secondMinDist - minDist);

        return bubble * edges;
      }

      // Multi-octave foam for realistic look with larger bubbles
      float generateFoam(vec2 worldXZ, float foamStrength, float waveHeight) {
        // Larger, more prominent foam bubbles with flowing animation
        // Animated foam layers with different scales and directional flow
        vec2 uv1 = worldXZ * 0.15 + vec2(uTime * 0.08, uTime * 0.05);   // Large bubbles, flowing
        vec2 uv2 = worldXZ * 0.3 - vec2(uTime * 0.06, uTime * 0.07);    // Medium bubbles, counter-flow
        vec2 uv3 = worldXZ * 0.5 + vec2(uTime * 0.04, -uTime * 0.08);   // Small bubbles, swirling

        // Layer multiple foam patterns with larger scales (2.0-4.0 instead of 8.0)
        float foam1 = foamPattern(uv1, 2.0) * 0.6;  // Large, prominent bubbles
        float foam2 = foamPattern(uv2, 3.0) * 0.3;  // Medium detail
        float foam3 = foamPattern(uv3, 4.0) * 0.1;  // Fine detail

        float totalFoam = foam1 + foam2 + foam3;

        // Add streaky variation (foam stretches along water flow)
        float streaks = smoothNoise(worldXZ * vec2(0.5, 2.0) + uTime * 0.08);
        totalFoam += streaks * 0.15;

        // More foam at wave crests (waveHeight is normalized -0.5 to 0.5)
        float crestBoost = smoothstep(-0.2, 0.3, waveHeight) * 0.4;
        totalFoam += crestBoost;

        // Modulate by foam strength (fades away from water line)
        return clamp(totalFoam * foamStrength, 0.0, 1.0);
      }

      void main() {
        // Sample the normal map
        vec3 normalMapSample = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;

        // Transform normal from tangent space to world space
        mat3 tbn = mat3(vTangent, vBitangent, vNormal);
        vec3 perturbedNormal = normalize(tbn * normalMapSample);

        // Height-based color grading - sunset/warm palette
        float height = vPosition.z;
        vec3 deepColor = vec3(0.224, 0.157, 0.271); // 392845
        vec3 oceanMidColor = vec3(0.102, 0.078, 0.220); // 1A1438
        vec3 oceanDeepColor = vec3(0.008, 0.024, 0.169); // 02062B
        vec3 shallowColor = vec3(0.702, 0.020, 0.102); // B3051A
        vec3 lowColor = vec3(0.859, 0.259, 0.0); // DB4200
        // midLowColor, midColor, and midHighColor are now uniforms
        vec3 highColor = vec3(1.0, 0.4, 0.5); // FF6680
        vec3 peakColor = vec3(1.0, 0.859, 0.933); // FFDBEE

        vec3 color;
        float alpha = 1.0;

        if (height < -19.0) {
            color = oceanDeepColor; alpha = smoothstep(-28.0, -19.0, height);
        }
        else if (height < -10.0) {
            color = mix(oceanDeepColor, oceanMidColor, smoothstep(-16.0, -10.0, height));
        } 
        else if (height < -4.0) {
            color = mix(oceanMidColor, deepColor, (height + 10.0) / 6.0);
        } 
        else if (height < -3.0) {
            color = mix(deepColor, shallowColor, (height + 4.0) / 1.0);
        }  
        else if (height < -1.0) {
            color = mix(shallowColor, lowColor, (height + 3.0) / 2.0);
        } 
        else if (height < 0.5) {
            color = mix(lowColor, midLowColor, (height + 1.0) / 1.5);
        }  
        else if (height < 1.5) {
            color = mix(midLowColor, midColor, (height - 0.5) / 1.0);
        } 
        else if (height < 2.5) {
            color = color = mix(midColor, midHighColor, (height - 1.5) / 1.0);
        } 
        else if (height < 3.5) {
            color = mix(midHighColor, highColor, (height - 2.5) / 1.0);
        } 
        else {
            color = mix(highColor, peakColor, min((height - 3.5) / 2.0, 1.0));
        }

        // Simple lighting with normal map applied
        vec3 lightDir = normalize(vec3(1.0, 2.8, 1.0));
        float diff = max(dot(perturbedNormal, lightDir), 0.65);
        color *= diff;

        // Apply shadows
        #if ( 1 > 0 )
          float shadow = 1.0;
          #ifdef USE_SHADOWMAP
            DirectionalLightShadow directionalLight;
            directionalLight = directionalLightShadows[0];
            shadow = getShadow( directionalShadowMap[0], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[0] );
          #endif
          // Soften shadow - lighter shadows for a sunny beach atmosphere
          color *= mix(0.8, 0.9, shadow);
        #endif

        // View-dependent sparkles reflecting the light
        vec3 viewDir = normalize(vViewPosition);

        // Add sparkles at procedural positions
        vec2 sparkleCoord = vWorldPosition.xz * 2.0;
        vec2 sparkleCell = floor(sparkleCoord);
        vec2 sparkleFract = fract(sparkleCoord);

        // Random sparkle positions and orientations
        float sparkleHash = hash(sparkleCell);
        vec2 sparklePos = vec2(hash(sparkleCell + vec2(1.0, 0.0)), hash(sparkleCell + vec2(0.0, 1.0)));

        // Distance to sparkle center
        float distToSparkle = length(sparkleFract - sparklePos);

        // Only create sparkle if hash value is high enough (controls density)
        if (sparkleHash > 0.14) {
          // Create random micro-facet normal for this sparkle, based on perturbed normal
          vec3 sparkleNormal = perturbedNormal;
          // Perturb normal based on hash
          float normalOffset1 = hash(sparkleCell + vec2(1.3, 3.0)) * 2.0 - 1.0;
          float normalOffset2 = hash(sparkleCell + vec2(3.1, 4.2)) * 1.54 - 1.0;
          sparkleNormal.x += normalOffset1 * 0.8;
          sparkleNormal.z += normalOffset2 * 0.8;
          sparkleNormal = normalize(sparkleNormal);

          // Calculate reflection of light off this micro-facet
          vec3 halfDir = normalize(lightDir + viewDir);
          float specular = pow(max(dot(sparkleNormal, halfDir), 0.2), 128.0);

          // Sharp, bright sparkle when view angle aligns with reflection
          float sparkle = 1.1 - smoothstep(0.0, 0.08, distToSparkle);
          sparkle = pow(sparkle, 3.2) * specular;

          // Add bright white/yellow sparkle
          vec3 sparkleColor = vec3(1.0, 0.95, 0.8) * 2.0;
          color += sparkleColor * sparkle;
        }

        // Apply depth-based fog: strongest at bottom, fades upward
        // Fog is at 1.0 at uFogStart (deep) and 0.0 at uFogEnd (water surface)
        float depthFogFactor = 1.0 - smoothstep(uFogStart, uFogEnd, vWorldPosition.y);
        color = mix(color, uFogColor, depthFogFactor * 0.85); // 0.85 controls fog intensity

        // Wetness Effect - dynamic wetness from water contact (only above water)
        if(uUseWetnessMap) {
          // Soft transition: fade wetness below water line
          // Start fading at 0.3 units below water, fully gone at 0.8 units below
          float wetnessFade = smoothstep(uWaterLevel - 2.8, uWaterLevel - 0.63, vWorldPosition.y);

          if(wetnessFade > 0.01) {
            // Calculate UV coordinates for wetness map sampling
            // vPosition is terrain-local coordinates (before rotation)
            // Convert to UV space (0-1 range)
            vec2 wetnessUV = (vPosition.xy / ${l.toFixed(1)}) + 0.5;

            // Sample wetness map
            float wetness = texture2D(uWetnessMap, wetnessUV).r * wetnessFade;

            if(wetness > 0.01) {
              // Darken wet areas (wet sand is darker)
              float darkening = 1.0 - (wetness * 0.4); // 40% darker when fully wet
              color *= darkening;

              // Increase saturation slightly for wet areas (wet sand is more vibrant)
              float luminance = dot(color, vec3(0.299, 0.587, 0.114));
              vec3 saturatedColor = mix(vec3(luminance), color, 1.0 + wetness * 0.3);
              color = saturatedColor;

              // Add specular highlights to wet areas (wet surfaces are shinier)
              vec3 halfDir = normalize(lightDir + viewDir);
              float wetSpecular = pow(max(dot(perturbedNormal, halfDir), 0.0), 64.0) * wetness;
              vec3 wetSpecularColor = vec3(1.0, 1.0, 0.95) * 0.4;
              color += wetSpecularColor * wetSpecular;
            }
          }
        }

        // Foam Effect - procedural foam texture at water level (OPTIONAL - can be disabled)
        if(uFoamEnabled) {
          // Separate coordinates for waves (with offset) and curvature (mesh-relative)

          // Wave coordinates: account for mesh offset (fixed in world space)
          vec2 waveCoords = vWorldPosition.xz - uWaterMeshOffset;
          float elevation = getWaveHeight(waveCoords);

          // Curvature: distance from water mesh center (NOT offset-adjusted)
          vec2 meshRelativePos = vWorldPosition.xz - uWaterMeshPosition;
          float distFromWaterCenter = length(meshRelativePos);
          float curveBend = distFromWaterCenter * distFromWaterCenter * uWaterCurvature;

          float currentWaterHeight = uWaterLevel + (elevation * uWaveHeightMultiplier) - curveBend;

          // Calculate distance from water line (normalized)
          float distFromWater = abs(vWorldPosition.y - currentWaterHeight);

          // Dynamic foam depth with noise-based variation
          // Add spatial noise for thick/thin variation along the waterline
          float depthNoise = smoothNoise(waveCoords * 0.3 + uTime * 0.02);
          float heightVariation = 0.15 + depthNoise * 2.0; // Ranges from 0.5 to 2.0

          // Combine wave elevation with noise for dramatic height changes
          float dynamicFoamDepth = uFoamDepth * (1.22 + elevation * 0.38) * heightVariation;

          // Foam strength fades with distance from water line
          float foamStrength = 1.0 - smoothstep(0.0, dynamicFoamDepth, distFromWater);

          // Only show foam just above and below water line (with dynamic depth)
          float foamMask = smoothstep(currentWaterHeight + dynamicFoamDepth, currentWaterHeight, vWorldPosition.y) *
                           (1.0 - smoothstep(currentWaterHeight, currentWaterHeight - dynamicFoamDepth * 0.5, vWorldPosition.y));

          // Generate procedural foam texture (pass wave height for crest enhancement)
          float foam = generateFoam(waveCoords, foamStrength, elevation) * foamMask;

          // Blue gradient EXTENDS beyond the foam band
          float depthBelowWater = max(0.0, currentWaterHeight - vWorldPosition.y);

          // Extended blue gradient depth (goes deeper than foam)
          float blueGradientDepth = dynamicFoamDepth * 2.0; // Extends 2x beyond foam depth

          // Normalize depth for blue gradient
          float normalizedDepth = clamp(depthBelowWater / blueGradientDepth, 0.0, 1.0);

          // Blue gradient strength (fades out with depth)
          float blueStrength = smoothstep(0.0, 1.0, normalizedDepth) * (1.0 - normalizedDepth);

          // Create blue gradient mask (separate from foam)
          float blueGradientMask = smoothstep(blueGradientDepth, 0.0, depthBelowWater);

          // Subtle cyan-blue gradient
          vec3 underwaterBlue = vec3(0.3, 0.6, 0.9) * 1.8;

          // Apply blue gradient to base color (BEFORE foam)
          color = mix(color, underwaterBlue, blueGradientMask * blueStrength);

          // Foam color that blends with terrain (less bright, more natural)
          // Mix white with underlying terrain color for better integration
          vec3 pureWhite = vec3(1.0, 1.0, 1.0) * 1.8; // Softer white
          vec3 foamColor = mix(color, pureWhite, 0.7); // 70% white, 30% terrain color

          // Apply foam on top (with terrain-blended color)
          color = mix(color, foamColor, clamp(foam * 0.85, 0.0, 1.0)); // Slightly transparent foam
        }

        gl_FragColor = vec4(color, alpha);
      }
    `,transparent:!0,depthWrite:!0}),bt=new we(A,$e);bt.rotation.x=-Math.PI/2,bt.castShadow=!0,bt.receiveShadow=!0,bt.renderOrder=.5,bt.customDepthMaterial=new Er({depthPacking:Pr});const So=512,Tt=new Mn(So,So,{minFilter:nt,magFilter:nt,format:Dn,type:xn}),Nt=new Wn(-l/2,l/2,l/2,-l/2,.1,100);Nt.position.set(0,50,0),Nt.lookAt(0,0,0),Nt.updateProjectionMatrix();const $t=new st({vertexShader:`
      varying float vHeight;

      void main() {
        vHeight = position.z; // Z is height in terrain-local space
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying float vHeight;
      uniform float uMinHeight;
      uniform float uMaxHeight;

      void main() {
        // Normalize height to 0-1 range
        float normalizedHeight = (vHeight - uMinHeight) / (uMaxHeight - uMinHeight);

        // Encode as grayscale (R=G=B=height)
        gl_FragColor = vec4(vec3(normalizedHeight), 1.0);
      }
    `,uniforms:{uMinHeight:{value:m},uMaxHeight:{value:p}},side:rt}),Mt=new we(A,$t);Mt.rotation.x=-Math.PI/2;function bo(D){if(!D){console.warn("updateHeightmapTexture: renderer not provided");return}const O=D.getRenderTarget();D.setRenderTarget(Tt),D.render(Mt,Nt),D.setRenderTarget(O)}const To=new Mn(g,g,{minFilter:nt,magFilter:nt,format:Dn,type:xn}),_e=new Mn(g,g,{minFilter:nt,magFilter:nt,format:Dn,type:xn});let xt=To,J=_e;const Je=new Bn(2,2),Bt=new Wn(-1,1,1,-1,0,1),Ae=new st({uniforms:{uHeightmap:{value:Tt.texture},uPreviousWetness:{value:null},uWaterLevel:{value:s},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uTime:{value:0},uDecayRate:{value:.98},uMinHeight:{value:m},uMaxHeight:{value:p},uTerrainSize:{value:l},uMeshOffset:{value:new Se(0,0)},uCurvature:{value:2e-5}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform sampler2D uHeightmap;
      uniform sampler2D uPreviousWetness;
      uniform float uWaterLevel;
      uniform float uWaveAmplitude;
      uniform float uWaveFrequency;
      uniform float uWaveHeightMultiplier;
      uniform float uTime;
      uniform float uDecayRate;
      uniform float uMinHeight;
      uniform float uMaxHeight;
      uniform float uTerrainSize;
      uniform vec2 uMeshOffset;
      uniform float uCurvature;
      varying vec2 vUv;

      // Hash function for noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(3127.1, 31.7))) * 43758.5453);
      }

      // Smooth noise
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // FBM for waves
      float fbmWaves(vec2 p) {
        float value = 0.212;
        float amplitude = uWaveAmplitude;
        float frequency = uWaveFrequency;
        for(int i = 0; i < 2; i++) {
          value += amplitude * smoothNoise(p * frequency);
          frequency *= 2.4;
          amplitude *= 0.09;
        }
        return value;
      }

      // Wave height calculation (matches water shader)
      float getWaveHeight(vec2 worldXZ) {
        float wave1 = fbmWaves(worldXZ * 0.15 + vec2(uTime * 0.08, uTime * 0.15));
        float wave2 = fbmWaves(worldXZ * 0.08 - vec2(uTime * 0.08, uTime * 0.12));
        return (wave1 * 0.5 + wave2 * 0.5) - 0.5;
      }

      void main() {
        // Convert UV to world coordinates (terrain-local)
        vec2 worldXZ = (vUv - 0.5) * uTerrainSize;

        // Sample terrain height from heightmap
        float normalizedHeight = texture2D(uHeightmap, vUv).r;
        float terrainHeight = mix(uMinHeight, uMaxHeight, normalizedHeight);

        // Calculate water surface height at this position
        vec2 waveCoords = worldXZ - uMeshOffset;
        float waveElevation = getWaveHeight(waveCoords);

        // Curvature effect (water bends down from center)
        float distFromCenter = length(worldXZ);
        float curveBend = distFromCenter * distFromCenter * uCurvature;

        float waterSurfaceHeight = uWaterLevel + (waveElevation * uWaveHeightMultiplier) - curveBend;

        // Calculate how much water is above terrain
        float waterDepth = waterSurfaceHeight - terrainHeight;

        // Wetness strength based on water contact
        // Positive waterDepth = water above terrain = wet
        // Add slight tolerance so areas just above water get wet too (splashing effect)
        float newWetness = smoothstep(-0.2, 0.5, waterDepth);

        // Sample previous wetness for temporal persistence
        float previousWetness = texture2D(uPreviousWetness, vUv).r;

        // Decay previous wetness over time
        float decayedWetness = previousWetness * uDecayRate;

        // Take maximum of new wetness and decayed previous wetness
        // This means: if water touches, immediately wet; if not, gradually dry
        float finalWetness = max(newWetness, decayedWetness);

        gl_FragColor = vec4(finalWetness, finalWetness, finalWetness, 1.0);
      }
    `}),Qo=new we(Je,Ae);function Mo(D,O,F){if(!D||!O)return;Ae.uniforms.uWaterLevel.value=O.uniforms.uWaterLevel?.value??s,Ae.uniforms.uWaveAmplitude.value=O.uniforms.uWaveAmplitude?.value??.26,Ae.uniforms.uWaveFrequency.value=O.uniforms.uWaveFrequency?.value??4.2,Ae.uniforms.uWaveHeightMultiplier.value=O.uniforms.uWaveHeightMultiplier?.value??4.13,Ae.uniforms.uMeshOffset.value.copy(O.uniforms.uMeshOffset?.value??new Se(0,0)),Ae.uniforms.uCurvature.value=O.uniforms.uCurvature?.value??2e-5,Ae.uniforms.uTime.value=F,Ae.uniforms.uPreviousWetness.value=J.texture;const U=D.getRenderTarget();D.setRenderTarget(xt),D.render(Qo,Bt),D.setRenderTarget(U);const q=xt;xt=J,J=q}return{mesh:bt,geometry:A,material:$e,body:K,size:l,getHeightAt:L,randomPosition:W,sculpt:he,updatePhysics:ze,simpleNoise:T,config:{size:l,segments:e,islandRadius:u,falloffStart:c,falloffEnd:d,fanOutEnd:h,maxHeight:p,minDepth:m},setColors(D={}){D.midLow&&$e.uniforms.midLowColor.value.copy(D.midLow),D.mid&&$e.uniforms.midColor.value.copy(D.mid),D.midHigh&&$e.uniforms.midHighColor.value.copy(D.midHigh)},heightmap:{renderTarget:Tt,texture:Tt.texture,camera:Nt,mesh:Mt,update:bo,size:So,worldSize:l,minHeight:m,maxHeight:p},setRenderer(D){re=D,D&&bo(D)},wetnessMap:{texture:()=>J.texture,update:Mo,size:g,worldSize:l,setDecayRate(D){Ae.uniforms.uDecayRate.value=D},dispose(){To.dispose(),_e.dispose(),Ae.dispose(),Je.dispose()}},dispose(){Tt&&Tt.dispose(),Mt&&(Mt.geometry.dispose(),Mt.material.dispose()),To.dispose(),_e.dispose(),Ae.dispose(),Je.dispose()}}}function Fl(a,e,t,o=0,n=0){const r=a-o,u=e-n;function c(v,S){const T=v*3127.1+S*31.7;return Math.sin(T)*43758.5453%1}function d(v,S){const T=Math.floor(v),y=Math.floor(S),b=v-T,M=S-y,C=b*b*b*(b*(b*6-15)+10),I=M*M*M*(M*(M*6-15)+10),A=c(T,y),H=c(T+1,y),L=c(T,y+1),W=c(T+1,y+1),de=A*(1-C)+H*C,Y=L*(1-C)+W*C;return de*(1-I)+Y*I}function h(v,S){let T=.212,y=.26,b=4.2;for(let M=0;M<2;M++)T+=y*d(v*b,S*b),b*=2.4,y*=.09;return T}const p=h(r*.15+t*.08,u*.15+t*.15),m=h(r*.08-t*.08,u*.08-t*.12);return(p*.5+m*.5-.5)*4.13}function Ai(a={}){const{terrainSize:e,waterLevel:t=-2.87}=a,o=1100,n=new Bn(o,o,65,65),i=o-550,s=new st({transparent:!0,side:rt,depthWrite:!1,uniforms:{uTime:{value:0},uWaterColor:{value:new ie(43212)},uShallowColor:{value:new ie(6740463)},uShineColor:{value:new ie(14531583)},fogColor:{value:new ie(10541296)},fogNear:{value:180},fogFar:{value:400},uCurvature:{value:2e-5},uClipRadius:{value:i},uWaveAmplitude:{value:.286},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uMeshOffset:{value:new Se(0,0)},uTerrainWidthX:{value:18},uTerrainWidthZ:{value:18},uTerrainHeight:{value:.15},uFoamEnabled:{value:!0},uWaterLevel:{value:t},uTerrainScaleX:{value:1},uTerrainScaleY:{value:1},uTerrainIrregularity:{value:1},uTerrainBayAngle:{value:0},uTerrainBayDepth:{value:0},uTerrainBayWidth:{value:0},uIslandGroupOffset:{value:new Se(0,0)},uFoamHeightOffset:{value:-.363},uUseHeightmap:{value:!1},uTerrainHeightmap:{value:null},uHeightmapWorldSize:{value:18},uHeightmapMinHeight:{value:-4.6},uHeightmapMaxHeight:{value:5.8}},vertexShader:`
      precision mediump float;

      uniform float uTime;
      uniform float uCurvature;
      uniform float uWaveAmplitude;
      uniform float uWaveFrequency;
      uniform float uWaveHeightMultiplier;
      uniform vec2 uMeshOffset;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec2 vOriginalWorldXZ; // Original world XZ before mesh offset
      varying vec3 vViewPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying float vFogDepth;

      // Hash function for noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(3127.1, 31.7))) * 43758.5453);
      }

      // Smooth noise with quintic interpolation for ultra-smooth results
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        // Quintic interpolation (Ken Perlin's improved smoothstep)
        f = f * f * f *(f * (f * 6.0 - 15.0) + 10.0);

        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // Fractal Brownian Motion for smoother waves
      float fbmWaves(vec2 p) {
        float value = .212;    // like overall height
        float amplitude = uWaveAmplitude; // height of waves + water level; 0.46 is calm, higher is choppy
        float frequency = uWaveFrequency; // number of waves; 2.2 is calm, higher is more turbulent

        for(int i = 0; i < 2; i++) {
          value += amplitude * smoothNoise(p * frequency);
          frequency *= 2.4; // speed of wave "shimmer" 2.1 is slow and smooth
          amplitude *= .09;  // less aggressive decay keeps waves organic with 2 octaves
        }
        return value;
      }

      // Function to calculate wave height at interval positions
      // pretty well dialed in
      float getWaveHeight(vec2 worldXZ) {
        float wave1 = fbmWaves(worldXZ * 0.15 + vec2(uTime * 0.08, uTime * 0.15));
        float wave2 = fbmWaves(worldXZ * 0.08 - vec2(uTime * 0.08, uTime * 0.12)); //wave speed
        return (wave1 * 0.5 + wave2 * 0.5) - 0.5;
      }

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Calculate original world XZ position (fixed in world space, not affected by mesh movement)
        vec2 originalWorldXZ = (modelMatrix * vec4(position, 1.0)).xz - uMeshOffset;
        vOriginalWorldXZ = originalWorldXZ;

        // Apply spherical curvature to bend edges downward from center
        float distFromCenter = length(pos.xy); // Distance in XY plane (horizontal)
        float curveBend = distFromCenter * distFromCenter * uCurvature; // Quadratic falloff
        pos.z -= curveBend; // Bend downward (negative Z since plane is rotated)

        // Use original world position for consistent waves
        vec2 worldXZ = originalWorldXZ;

        // Calculate wave displacement
        float elevation = getWaveHeight(worldXZ);
        pos.z += elevation * uWaveHeightMultiplier; // Wave height multiplier for choppiness

        // Calculate normal by sampling nearby points (finite differences)
        float offset = 0.1;
        float hL = getWaveHeight(worldXZ - vec2(offset, 40.0)) * 1.32;
        float hR = getWaveHeight(worldXZ + vec2(offset, 230.0)) * 1.15;
        float hD = getWaveHeight(worldXZ - vec2(3.0, offset)) * 1.32;
        float hU = getWaveHeight(worldXZ + vec2(2.0, offset)) * 1.637;

        // Compute tangent vectors
        vec3 tangentX = vec3(offset * 12.3, 13.0, hR - hL);
        vec3 tangentY = vec3(0.5, offset * 12.0, hU - hD);

        // Normal is cross product of tangents
        vec3 calculatedNormal = normalize(cross(tangentY, tangentX));

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPos.xyz;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1); // scale, like zoom
        vViewPosition = -mvPosition.xyz;
        vPosition = pos;

        // Transform calculated normal to view space
        vNormal = normalize(normalMatrix * calculatedNormal);

        // Calculate fog depth for distance-based fog
        vFogDepth = -mvPosition.z;

        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      precision mediump float;

      uniform float uTime;
      uniform vec3 uWaterColor;
      uniform vec3 uShallowColor;
      uniform vec3 uShineColor;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      uniform float uClipRadius;
      uniform vec2 uMeshOffset;
      uniform float uTerrainWidthX;
      uniform float uTerrainWidthZ;
      uniform float uTerrainHeight;
      uniform bool uFoamEnabled;
      uniform float uWaterLevel;
      // Terrain shape uniforms
      uniform float uTerrainScaleX;
      uniform float uTerrainScaleY;
      uniform float uTerrainIrregularity;
      uniform float uTerrainBayAngle;
      uniform float uTerrainBayDepth;
      uniform float uTerrainBayWidth;
      uniform vec2 uIslandGroupOffset;
      uniform float uFoamHeightOffset;
      // Heightmap texture uniforms
      uniform bool uUseHeightmap;
      uniform sampler2D uTerrainHeightmap;
      uniform float uHeightmapWorldSize;
      uniform float uHeightmapMinHeight;
      uniform float uHeightmapMaxHeight;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec2 vOriginalWorldXZ; // Original world XZ before mesh offset
      varying vec3 vViewPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying float vFogDepth;

      // Hash function for noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(27.1, 11.7))) * 58.5453); // no need to mess with this
      }

      // Smooth noise with better interpolation
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        // Quintic interpolation for smoother results
        f = f * f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // no need to mess with this

        float a = hash(i);
        float b = hash(i + vec2(1.30, 3.0));
        float c = hash(i + vec2(0.0, 1.4));
        float d = hash(i + vec2(41.3, 4.0));

        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // Hash function that returns vec2 for foam pattern
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453);
      }

      // Foam bubble pattern
      float foamPattern(vec2 uv, float scale) {
        vec2 p = uv * scale;
        vec2 f = fract(p);
        vec2 i = floor(p);

        float minDist = 1.40;
        for(int y = -1; y <= 1; y++) {
          for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = hash2(i + neighbor);
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            minDist = min(minDist, dist);
          }
        }

        return 1.0 - smoothstep(0.05, 1.15, minDist); // this is actually the foam radius
      }

      // Simple noise for organic island shape (matches terrain.js)
      float simpleNoise(vec2 pos) {
        float angle = atan(pos.y, pos.x);
        float dist = length(pos);

        // Multiple sine waves at different frequencies for organic variation
        float noise1 = sin(angle * 2.2 + dist * 0.5) * 0.4;
        float noise2 = sin(angle * 5.0 - dist * 0.3) * 0.25;
        float noise3 = sin(angle * 7.0 + dist * 0.7) * 0.2;

        return (noise1 + noise2 + noise3) * uTerrainIrregularity;
      }

      // Calculate shaped distance from center (accounts for elongation and bay)
      float getShapedDistance(vec2 pos) {
        // Apply elongation scaling
        float scaledX = pos.x / uTerrainScaleX;
        float scaledY = pos.y / uTerrainScaleY;
        float dist = length(vec2(scaledX, scaledY));

        // Apply bay indentation
        if(uTerrainBayDepth > 0.0) {
          float angle = atan(pos.y, pos.x);
          float bayAngle = uTerrainBayAngle;
          float bayWidth = uTerrainBayWidth;

          // Calculate angle difference (wrap around)
          float angleDiff = abs(angle - bayAngle);
          if(angleDiff > 3.14159) angleDiff = 6.28318 - angleDiff;

          // If within bay width, push the distance inward
          if(angleDiff < bayWidth) {
            float bayInfluence = cos(angleDiff / bayWidth * 3.14159 / 2.0);
            dist += uTerrainBayDepth * bayInfluence;
          }
        }

        return dist;
      }

      // Get actual terrain height from heightmap texture (in world space Y coordinates)
      float getTerrainHeightFromHeightmap(vec2 terrainLocalXZ) {
        // Convert terrain-local XZ coordinates to heightmap UV (0-1 range)
        // Terrain ranges from -size/2 to +size/2, we need to map to 0-1
        vec2 uv = (terrainLocalXZ / uHeightmapWorldSize) + 0.5;

        // Sample heightmap texture (returns normalized height 0-1)
        float normalizedHeight = texture2D(uTerrainHeightmap, uv).r;

        // Denormalize to actual world height
        float actualHeight = mix(uHeightmapMinHeight, uHeightmapMaxHeight, normalizedHeight);

        return actualHeight;
      }

      // Fallback: Approximate terrain height for foam detection (used if heightmap not available)
      float approximateTerrainHeight(vec2 worldXZ) {
        float distFromCenter = getShapedDistance(worldXZ);

        // Calculate distance from rectangular bounds
        float distX = abs(worldXZ.x) / uTerrainWidthX;
        float distZ = abs(worldXZ.y) / uTerrainWidthZ;
        float maxDist = max(distX, distZ);

        // Add organic variation to island bounds
        float organicVariation = simpleNoise(worldXZ) * 1.5;
        float modifiedBoundary = 1.0 + (organicVariation / max(uTerrainWidthX, uTerrainWidthZ));
        float modifiedFalloffStart = modifiedBoundary * 1.0;  // Start of slope
        float modifiedFalloffEnd = modifiedBoundary * 2.26;   // End of slope (the "skirt")

        if(maxDist < modifiedFalloffStart) {
          // Center plateau - relatively flat at terrain height
          return uTerrainHeight;
        } else if(maxDist < modifiedFalloffEnd) {
          // Slope zone - terrain drops from uTerrainHeight to below water
          float t = (maxDist - modifiedFalloffStart) / (modifiedFalloffEnd - modifiedFalloffStart);
          float smoothT = t * t * (3.0 - 2.0 * t); // Smoothstep
          // Slope from uTerrainHeight down to -3.5
          return mix(uTerrainHeight, -3.5, smoothT);
        }
        return -10.0; // Deep underwater
      }


      void main() {
        // Clip water outside hemisphere radius
        float radialDist = length(vPosition.xy);
        if (radialDist > uClipRadius) {
          discard;
        }

        vec3 lightDir = normalize(vec3(5.42, 140.0, 5.0));
        vec3 viewDir = normalize(vViewPosition);

        // Distance from center for depth effect -
        // makes the ater more deep blue as number goes up
        float distFromCenter = length(vUv - vec2(3.75, 128.5));

        // Use the normals calculated from wave geometry
        vec3 normal = normalize(vNormal);

        // Add subtle high-frequency detail to normals - use original world XZ position
        vec2 detailCoord = vOriginalWorldXZ * 23.2 + vec2(uTime * 0.03, uTime * 0.04);
        float detail = smoothNoise(detailCoord) * 8.0 - .30; //sharpens the highlight
        normal = normalize(normal + vec3(detail * 0.12, 0.0, detail * 0.12));

        // Shallow water near center (island), deeper at edges - tropical gradient
        vec3 baseColor = mix(uShallowColor, uWaterColor, smoothstep(0.1 , 10.4, distFromCenter));

        // Subtle color variation from noise - OFF
        // float colorNoise = smoothNoise(vWorldPosition.xz * 1.25 + uTime * 1.015);
        // baseColor = mix(baseColor, uShallowColor * .91, colorNoise * 0.2);

        // Softer diffuse lighting for tropical look
        float diffuse = max(dot(normal, lightDir), 0.64) * .64 + 0.66;
        vec3 color = baseColor * diffuse;

        // Subsurface scattering - light passing through water
        float backLight = max(0.0, dot(-lightDir, normal));
        color += uShallowColor * pow(backLight, 2.0) * 0.6;

        // Bright specular highlights
        vec3 halfDir = normalize(lightDir + viewDir);
        float specular = pow(max(dot(normal, halfDir), 0.30), 320.0);

        // // Medium shine
        // float shine = pow(max(dot(normal, halfDir), 0.0), 39.0);

        // Soft broad shine
        float softShine = pow(max(dot(normal, halfDir), 0.0), 8.0);

        // Combine shine effects for intensity
        color += uShineColor * specular * 1.76; // highlight top of wave
        // color += uShineColor * shine * 0.4; // middle of wave (off)
        color += uShineColor * softShine * 0.12; // overall

        // animated shine streaks, these are twinkling tiny moving in unison - use original world XZ position
        float streaks = smoothNoise(vOriginalWorldXZ * 8.3 + vec2(uTime * 0.706, uTime * 4.09));
        color += uShineColor * pow(streaks, 55.0) * 4.15;

        // // Gentle fresnel for tropical look
        // float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 3.0);
        // color += vec3(0.8, 0.95, 1.3) * fresnel * 0.3;

        // Transparency
        float alpha = .428;

        // Apply distance fog for infinite ocean effect
        float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
        color = mix(color, fogColor, fogFactor);

        // Foam rendering where water meets terrain
        if(uFoamEnabled) {
          // Transform water world coordinates to terrain-local coordinates
          // (terrain is inside islandGroup, water is in scene)
          vec2 terrainLocalXZ = vOriginalWorldXZ - uIslandGroupOffset;

          // IMPORTANT: The plane is rotated -90° around X axis, which flips the Z coordinate
          // Terrain uses geometry (x,y) which becomes world (x,-z) after rotation
          // So we need to negate Z to match terrain's coordinate system
          terrainLocalXZ.y = -terrainLocalXZ.y;

          // First check: rectangular bounds check for island edges
          float absX = abs(terrainLocalXZ.x);
          float absZ = abs(terrainLocalXZ.y);
          float maxFoamWidthX = uTerrainWidthX * 1.042; // Extended bounds for full coverage
          float maxFoamWidthZ = uTerrainWidthZ * 1.042;

          if(absX < maxFoamWidthX && absZ < maxFoamWidthZ) {
            // Calculate soft edge fadeout - foam fades naturally near boundaries
            // This prevents hard edges when foam extends beyond actual terrain
            float edgeFadeStart = 0.95; // Start fading at 85% of max foam width
            float edgeDistX = absX / maxFoamWidthX;
            float edgeDistZ = absZ / maxFoamWidthZ;
            float maxEdgeDist = max(edgeDistX, edgeDistZ);
            float edgeFade = 1.0 - smoothstep(edgeFadeStart, 1.0, maxEdgeDist);
            // Get actual terrain height from heightmap texture (using terrain-local coords)
            // Falls back to approximation if heightmap texture is not available OR position is outside heightmap range
            float terrainHeight;

            // Check if position is within heightmap coverage area
            float halfHeightmapSize = uHeightmapWorldSize / 2.0;
            bool withinHeightmap = absX < halfHeightmapSize && absZ < halfHeightmapSize;

            if(uUseHeightmap && withinHeightmap) {
              terrainHeight = getTerrainHeightFromHeightmap(terrainLocalXZ);
            } else {
              terrainHeight = approximateTerrainHeight(terrainLocalXZ);
            }

            // Second check: only render foam where terrain is near water level
            // This prevents foam on deep underwater slopes within the distance check
            float terrainDepth = terrainHeight - uWaterLevel;
            bool isNearWaterLevel = terrainDepth > -2.5 && terrainDepth < 1.5;

            if(isNearWaterLevel) {
              // Apply height offset to push foam higher on shore (positive = foam appears higher)
              terrainHeight += uFoamHeightOffset;

              // Water surface height at this position (accounting for waves in vertex shader)
              float waterSurfaceHeight = vWorldPosition.y;

              // Distance between water surface and terrain (positive = water above terrain)
              float distToTerrain = waterSurfaceHeight - terrainHeight;

              // Dynamic foam width with smooth noise layers for natural variation
              // Large-scale variation: creates gentle wide/narrow sections around shoreline
              float widthNoise1 = smoothNoise(terrainLocalXZ * 0.2 + uTime * 0.01);
              // Medium-scale: adds subtle variation
              float widthNoise2 = smoothNoise(terrainLocalXZ * 0.5 + uTime * 0.015);

              // Combine noise layers with smoother blending
              float widthMultiplier = widthNoise1 * 0.7 + widthNoise2 * 0.3;
              // Smoother mapping to narrower range for gentler transitions
              float foamDepth = 0.6 + widthMultiplier * 0.8;

              // Foam appears when water is slightly above terrain (0 to foamDepth)
              // and fades when terrain pokes through water (0 to -0.5)
              float foamMask = smoothstep(foamDepth, 0.0, distToTerrain) *
                               smoothstep(-0.5, 0.21, distToTerrain);

              // Apply edge fadeout for natural boundaries
              foamMask *= edgeFade;

              if(foamMask > 0.01) {
                // Generate flowing foam bubbles with multi-directional movement
                vec2 uv1 = terrainLocalXZ * 2.2 + vec2(uTime * 0.08, uTime * 0.05);    // Large bubbles flowing
                vec2 uv2 = terrainLocalXZ * 1.35 - vec2(uTime * 0.06, uTime * 0.07);   // Medium counter-flow
                vec2 uv3 = terrainLocalXZ * 3.0 + vec2(uTime * 0.04, -uTime * 0.09);   // Small swirling

                float foam1 = foamPattern(uv1, 4.5) * 0.76;   // Large prominent bubbles
                float foam2 = foamPattern(uv2, 3.5) * 0.4;    // Medium detail
                float foam3 = foamPattern(uv3, 5.5) * 0.25;   // Fine detail for depth
                float foamBubbles = (foam1 + foam2 + foam3) * foamMask;

                // Add flowing streaks for more natural movement
                float flowStreaks = smoothNoise(terrainLocalXZ * 1.5 + vec2(uTime * 0.1, uTime * 0.06));
                foamBubbles += flowStreaks * foamMask * 0.2;

                // Foam color - brighter white with slight blue tint
                vec3 foamColor = vec3(0.98, 0.99, 1.0) * 2.2;

                // Blend foam with water color - more opaque for visibility
                color = mix(color, foamColor, foamBubbles * 0.6);

                // Increase alpha where foam is for better visibility
                alpha = mix(alpha, 0.85, foamBubbles * 0.6);
              }
            } // End water level check
          } // End distance check
        }

        gl_FragColor = vec4(color, alpha);
      }
    `}),l=new we(n,s);l.rotation.x=-Math.PI/2,l.position.y=t,l.receiveShadow=!0,l.renderOrder=1;const r=new bs(i,26,8,0,Math.PI*2,Math.PI/2,Math.PI/2),u=new st({side:mi,transparent:!0,depthWrite:!0,uniforms:{uDeepColor:{value:new ie(9549)},uShallowColor:{value:new ie(4500687)},fogColor:{value:new ie(10541296)},fogNear:{value:260},fogFar:{value:420}},vertexShader:`
      varying vec3 vPosition;
      varying float vFogDepth;
      varying float vVerticalPos;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vPosition = position;
        vVerticalPos = position.y; // Y position for vertical fade
        vNormal = normalize(normalMatrix * normal);

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vFogDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 uDeepColor;
      uniform vec3 uShallowColor;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      varying vec3 vPosition;
      varying float vFogDepth;
      varying float vVerticalPos;
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        // Check if we're looking at the hemisphere from outside
        // If viewing from outside, discard the fragment (make it invisible)
        vec3 viewDir = normalize(vViewPosition);
        float facing = dot(viewDir, vNormal);

        // If facing > 0, we're looking at the back face from outside - discard it
        if (facing > 0.0) {
          discard;
        }

        // Radial gradient: darker at center, lighter at edges
        float distFromCenter = length(vPosition.xz) / ${i.toFixed(1)};
        vec3 color = mix(uDeepColor, uShallowColor, distFromCenter);

        // Normalize vertical position: 0 at bottom, 1 at top
        float normalizedHeight = (vVerticalPos + ${i.toFixed(1)}) / ${i.toFixed(1)};

        // Fade to fog color starting closer to surface
        float heightFade = smoothstep(0.75, 0.9, normalizedHeight);
        color = mix(color, fogColor, heightFade);

        // Fade to transparent at the very top to avoid hard line
        float alpha = mix(0.95, 0.0, smoothstep(0.9, 1.0, normalizedHeight));

        gl_FragColor = vec4(color, alpha);
      }
    `}),c=new we(r,u);return c.position.y=40.88,c.renderOrder=0,{mesh:l,hemisphereMesh:c,material:s,update(d){s.uniforms.uTime.value=d},setColors(d={}){d.water!==void 0&&s.uniforms.uWaterColor.value.set(d.water),d.shallow!==void 0&&s.uniforms.uShallowColor.value.set(d.shallow),d.shine!==void 0&&s.uniforms.uShineColor.value.set(d.shine)},setWaveChoppiness(d,h){d!==void 0&&(s.uniforms.uWaveHeightMultiplier.value=d),h!==void 0&&(s.uniforms.uWaveAmplitude.value=h)}}}function Ci(a={}){const{scene:e,waterLevel:t=-2.87,maxRipples:o=50}=a,n=[],i=[];let s=0;const l=new xa(.1,.2,32),r=()=>new st({transparent:!0,side:rt,depthWrite:!1,uniforms:{uProgress:{value:0},uRadius:{value:1},uColor:{value:new ie(16777215)}},vertexShader:`
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uProgress;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          // Calculate distance from center
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center) * 2.0;

          // Create expanding ring
          float ringWidth = 0.15;
          float ring = smoothstep(uProgress - ringWidth, uProgress, dist) *
                       (1.0 - smoothstep(uProgress, uProgress + ringWidth, dist));

          // Fade out as it expands
          float alpha = ring * (1.0 - uProgress) * 0.7;

          // Add subtle inner glow
          float innerGlow = exp(-dist * 3.0) * (1.0 - uProgress) * 0.3;

          // Add initial splash flash for immediate visibility on impact
          // Much wider and brighter for dramatic impact effect
          float splash = exp(-dist * 2.5) * (1.0 - smoothstep(0.0, 0.5, uProgress)) * 5.0;

          float finalAlpha = alpha + innerGlow + splash;

          gl_FragColor = vec4(uColor, finalAlpha);
        }
      `});for(let h=0;h<o;h++){const p=r(),m=new we(l,p);m.rotation.x=-Math.PI/2,m.visible=!1,m.renderOrder=2,e.add(m),i.push(m)}function u(h,p,m={}){const{size:g=1,speed:v=1,color:S=new ie(16777215),y:T=null}=m;let y=i[s];if(s=(s+1)%o,!y)return;if(y.visible){const I=n.findIndex(A=>A.mesh===y);I!==-1&&n.splice(I,1)}const b=T!==null?T:t-.685;y.position.set(h,b,p),y.visible=!0,y.material.uniforms.uProgress.value=.0182,y.material.uniforms.uRadius.value=g,y.material.uniforms.uColor.value.copy(S);const M=2*g;y.scale.set(M,M,1);const C={mesh:y,progress:.114,speed:v*.4,maxScale:M*3.5,baseScale:M};n.push(C)}function c(h){for(let p=n.length-1;p>=0;p--){const m=n[p];m.progress+=h*m.speed,m.mesh.material.uniforms.uProgress.value=m.progress;const g=m.baseScale+(m.maxScale-m.baseScale)*m.progress;m.mesh.scale.set(g,g,1),m.progress>=1&&(m.mesh.visible=!1,n.splice(p,1))}}function d(){i.forEach(h=>{e.remove(h),h.material.dispose()}),l.dispose(),n.length=0,i.length=0}return{spawnRipple:u,update:c,dispose:d}}function kl(){const e=new Uint8Array(2097152);let t=0;const o=.05,n=new Ol,i=new w;for(let l=0;l<128;l++)for(let r=0;r<128;r++)for(let u=0;u<128;u++){const c=1-i.set(u,r,l).subScalar(64).divideScalar(128).length();e[t]=(168+127.6*n.noise(u*o/1.53,r*o,l*o/1.51))*c*c,t++}const s=new _r(e,128,128,128);return s.format=Ar,s.minFilter=nt,s.magFilter=nt,s.unpackAlignment=1,s.needsUpdate=!0,s}function Ro(a={}){const{startX:e,startZ:t,endX:o,endZ:n,cloudHeight:i=13.2,cloudTexture:s,baseOpacity:l=.43,rainCount:r=100}=a,u=new Zt,c=`
    in vec3 position;

    uniform mat4 modelMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 cameraPos;

    out vec3 vOrigin;
    out vec3 vDirection;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      vOrigin = vec3(inverse(modelMatrix) * vec4(cameraPos, 1.0)).xyz;
      vDirection = position - vOrigin;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,d=`
    precision highp float;
    precision highp sampler3D;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    in vec3 vOrigin;
    in vec3 vDirection;

    out vec4 color;

    uniform vec3 base;
    uniform sampler3D map;

    uniform float threshold;
    uniform float range;
    uniform float opacity;
    uniform float steps;
    uniform float frame;
    uniform float textureRotation;

    uint wang_hash(uint seed) {
      seed = (seed ^ 61u) ^ (seed >> 16u);
      seed *= 9u;
      seed = seed ^ (seed >> 4u);
      seed *= 0x27d4eb2du;
      seed = seed ^ (seed >> 15u);
      return seed;
    }

    float randomFloat(inout uint seed) {
      return float(wang_hash(seed)) / 4294967296.;
    }

    vec2 hitBox(vec3 orig, vec3 dir) {
      const vec3 box_min = vec3(-0.5);
      const vec3 box_max = vec3(0.5);
      vec3 inv_dir = 1.0 / dir;
      vec3 tmin_tmp = (box_min - orig) * inv_dir;
      vec3 tmax_tmp = (box_max - orig) * inv_dir;
      vec3 tmin = min(tmin_tmp, tmax_tmp);
      vec3 tmax = max(tmin_tmp, tmax_tmp);
      float t0 = max(tmin.x, max(tmin.y, tmin.z));
      float t1 = min(tmax.x, min(tmax.y, tmax.z));
      return vec2(t0, t1);
    }

    // Rotate a point around the X axis
    vec3 rotateX(vec3 p, float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
    }

    float sample1(vec3 p) {
      // Apply rotation to texture coordinates before sampling
      vec3 rotatedP = rotateX(p - 0.5, textureRotation) + 0.5;
      return texture(map, rotatedP).r;
    }

    float shading(vec3 coord) {
      float step = 0.01;
      return sample1(coord + vec3(-step)) - sample1(coord + vec3(step));
    }

    vec4 linearToSRGB(in vec4 value) {
      return vec4(mix(pow(value.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), value.rgb * 12.92, vec3(lessThanEqual(value.rgb, vec3(0.0031308)))), value.a);
    }

    void main() {
      vec3 rayDir = normalize(vDirection);
      vec2 bounds = hitBox(vOrigin, rayDir);

      if (bounds.x > bounds.y) discard;

      bounds.x = max(bounds.x, 0.0);

      vec3 p = vOrigin + bounds.x * rayDir;
      vec3 inc = 1.0 / abs(rayDir);
      float delta = min(inc.x, min(inc.y, inc.z));
      delta /= steps;

      // Jitter
      uint seed = uint(gl_FragCoord.x) * uint(1973) + uint(gl_FragCoord.y) * uint(9277) + uint(frame) * uint(26699);
      vec3 size = vec3(textureSize(map, 0));
      float randNum = randomFloat(seed) * 2.0 - 1.0;
      p += rayDir * randNum * (1.0 / size);

      vec4 ac = vec4(base, 0.0);

      for (float t = bounds.x; t < bounds.y; t += delta) {
        float d = sample1(p + 0.5);

        d = smoothstep(threshold - range, threshold + range, d) * opacity;

        float col = shading(p + 0.5) * 3.0 + ((p.x + p.y) * 0.25) + 0.2;

        ac.rgb += (1.0 - ac.a) * d * col;
        ac.a += (1.0 - ac.a) * d;

        if (ac.a >= 0.95) break;

        p += rayDir * delta;
      }

      color = linearToSRGB(ac);

      if (color.a == 0.0) discard;
    }
  `,h=new gi(15,8,15),p=new Cr({glslVersion:Ir,uniforms:{base:{value:new ie(7965344)},map:{value:s},cameraPos:{value:new w},threshold:{value:.25},opacity:{value:0},range:{value:.08},steps:{value:40},frame:{value:0},textureRotation:{value:0}},vertexShader:c,fragmentShader:d,side:rt,transparent:!0,depthWrite:!1,depthTest:!1}),m=new we(h,p);m.position.y=i,m.scale.set(11.11,6.12,8.3),m.visible=!1,m.renderOrder=6,u.add(m);const g=new un,v=new Float32Array(r*3),S=[],T=.8,y=.3;for(let C=0;C<r;C++){const I=Math.random()*Math.PI*2,A=Math.random()*3.2;v[C*3]=Math.cos(I)*A,v[C*3+1]=i-Math.random()*4,v[C*3+2]=Math.sin(I)*A,S.push({initialY:v[C*3+1],initialX:v[C*3],initialZ:v[C*3+2],speed:2+Math.random()*3})}g.setAttribute("position",new no(v,3));const b=new Ts({color:7258367,size:.18,transparent:!0,opacity:0,blending:yi,depthWrite:!1,depthTest:!0}),M=new Ms(g,b);return M.renderOrder=5,u.add(M),u.position.set(e,0,t),u.userData={cloud:m,cloudMaterial:p,rainParticles:M,rainVelocities:S,windDriftX:T,windDriftZ:y,creationTime:Date.now(),startPos:{x:e,z:t},endPos:{x:o,z:n},baseOpacity:l,drizzleSound:null},u}function Gn(a,e,t=0){const{cloudMaterial:o}=a.userData;o.uniforms.cameraPos.value.copy(e.position),o.uniforms.frame.value++,o.uniforms.textureRotation.value+=t*.3;const n=o.uniforms.frame.value*.02;o.uniforms.steps.value=50+Math.sin(n)*15}function jn(a,e){const{rainParticles:t,rainVelocities:o,windDriftX:n,windDriftZ:i}=a.userData;if(t.material.opacity<.01)return;const s=t.geometry.attributes.position.array;for(let l=0;l<o.length;l++){const r=o[l];s[l*3+1]-=r.speed*e,s[l*3]+=n*e,s[l*3+2]+=i*e,s[l*3+1]<.1&&(s[l*3+1]=r.initialY,s[l*3]=r.initialX,s[l*3+2]=r.initialZ)}t.geometry.attributes.position.needsUpdate=!0}function Fa(a,e){const{rainParticles:t}=a.userData;t.material.opacity=Math.max(0,Math.min(1,e))}function Xs(a,e){if(e===Lr)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),a;if(e===Vn||e===wi){let t=a.getIndex();if(t===null){const s=[],l=a.getAttribute("position");if(l!==void 0){for(let r=0;r<l.count;r++)s.push(r);a.setIndex(s),t=a.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),a}const o=t.count-2,n=[];if(e===Vn)for(let s=1;s<=o;s++)n.push(t.getX(0)),n.push(t.getX(s)),n.push(t.getX(s+1));else for(let s=0;s<o;s++)s%2===0?(n.push(t.getX(s)),n.push(t.getX(s+1)),n.push(t.getX(s+2))):(n.push(t.getX(s+2)),n.push(t.getX(s+1)),n.push(t.getX(s)));n.length/3!==o&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const i=a.clone();return i.setIndex(n),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),a}class Ye extends Rr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Wl(t)}),this.register(function(t){return new Vl(t)}),this.register(function(t){return new $l(t)}),this.register(function(t){return new Jl(t)}),this.register(function(t){return new Ql(t)}),this.register(function(t){return new Xl(t)}),this.register(function(t){return new Gl(t)}),this.register(function(t){return new jl(t)}),this.register(function(t){return new Zl(t)}),this.register(function(t){return new Bl(t)}),this.register(function(t){return new ql(t)}),this.register(function(t){return new Ul(t)}),this.register(function(t){return new Kl(t)}),this.register(function(t){return new Yl(t)}),this.register(function(t){return new zl(t)}),this.register(function(t){return new ec(t)}),this.register(function(t){return new tc(t)})}load(e,t,o,n){const i=this;let s;if(this.resourcePath!=="")s=this.resourcePath;else if(this.path!==""){const u=ra.extractUrlBase(e);s=ra.resolveURL(u,this.path)}else s=ra.extractUrlBase(e);this.manager.itemStart(e);const l=function(u){n?n(u):console.error(u),i.manager.itemError(e),i.manager.itemEnd(e)},r=new Si(this.manager);r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,function(u){try{i.parse(u,s,function(c){t(c),i.manager.itemEnd(e)},l)}catch(c){l(c)}},o,l)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,o,n){let i;const s={},l={},r=new TextDecoder;if(typeof e=="string")i=JSON.parse(e);else if(e instanceof ArrayBuffer)if(r.decode(new Uint8Array(e,0,4))===Ii){try{s[X.KHR_BINARY_GLTF]=new oc(e)}catch(d){n&&n(d);return}i=JSON.parse(s[X.KHR_BINARY_GLTF].content)}else i=JSON.parse(r.decode(e));else i=e;if(i.asset===void 0||i.asset.version[0]<2){n&&n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const u=new pc(i,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});u.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){const d=this.pluginCallbacks[c](u);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),l[d.name]=d,s[d.name]=!0}if(i.extensionsUsed)for(let c=0;c<i.extensionsUsed.length;++c){const d=i.extensionsUsed[c],h=i.extensionsRequired||[];switch(d){case X.KHR_MATERIALS_UNLIT:s[d]=new Nl;break;case X.KHR_DRACO_MESH_COMPRESSION:s[d]=new ac(i,this.dracoLoader);break;case X.KHR_TEXTURE_TRANSFORM:s[d]=new nc;break;case X.KHR_MESH_QUANTIZATION:s[d]=new sc;break;default:h.indexOf(d)>=0&&l[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}u.setExtensions(s),u.setPlugins(l),u.parse(o,n)}parseAsync(e,t){const o=this;return new Promise(function(n,i){o.parse(e,t,n,i)})}}function Hl(){let a={};return{get:function(e){return a[e]},add:function(e,t){a[e]=t},remove:function(e){delete a[e]},removeAll:function(){a={}}}}const X={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class zl{constructor(e){this.parser=e,this.name=X.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let o=0,n=t.length;o<n;o++){const i=t[o];i.extensions&&i.extensions[this.name]&&i.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,i.extensions[this.name].light)}}_loadLight(e){const t=this.parser,o="light:"+e;let n=t.cache.get(o);if(n)return n;const i=t.json,r=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e];let u;const c=new ie(16777215);r.color!==void 0&&c.setRGB(r.color[0],r.color[1],r.color[2],Ht);const d=r.range!==void 0?r.range:0;switch(r.type){case"directional":u=new xs(c),u.target.position.set(0,0,-1),u.add(u.target);break;case"point":u=new Fr(c),u.distance=d;break;case"spot":u=new Or(c),u.distance=d,r.spot=r.spot||{},r.spot.innerConeAngle=r.spot.innerConeAngle!==void 0?r.spot.innerConeAngle:0,r.spot.outerConeAngle=r.spot.outerConeAngle!==void 0?r.spot.outerConeAngle:Math.PI/4,u.angle=r.spot.outerConeAngle,u.penumbra=1-r.spot.innerConeAngle/r.spot.outerConeAngle,u.target.position.set(0,0,-1),u.add(u.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+r.type)}return u.position.set(0,0,0),lt(u,r),r.intensity!==void 0&&(u.intensity=r.intensity),u.name=t.createUniqueName(r.name||"light_"+e),n=Promise.resolve(u),t.cache.add(o,n),n}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,o=this.parser,i=o.json.nodes[e],l=(i.extensions&&i.extensions[this.name]||{}).light;return l===void 0?null:this._loadLight(l).then(function(r){return o._getNodeRef(t.cache,l,r)})}}class Nl{constructor(){this.name=X.KHR_MATERIALS_UNLIT}getMaterialType(){return Ct}extendParams(e,t,o){const n=[];e.color=new ie(1,1,1),e.opacity=1;const i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){const s=i.baseColorFactor;e.color.setRGB(s[0],s[1],s[2],Ht),e.opacity=s[3]}i.baseColorTexture!==void 0&&n.push(o.assignTexture(e,"map",i.baseColorTexture,fa))}return Promise.all(n)}}class Bl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=n.extensions[this.name].emissiveStrength;return i!==void 0&&(t.emissiveIntensity=i),Promise.resolve()}}class Wl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[],s=n.extensions[this.name];if(s.clearcoatFactor!==void 0&&(t.clearcoat=s.clearcoatFactor),s.clearcoatTexture!==void 0&&i.push(o.assignTexture(t,"clearcoatMap",s.clearcoatTexture)),s.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=s.clearcoatRoughnessFactor),s.clearcoatRoughnessTexture!==void 0&&i.push(o.assignTexture(t,"clearcoatRoughnessMap",s.clearcoatRoughnessTexture)),s.clearcoatNormalTexture!==void 0&&(i.push(o.assignTexture(t,"clearcoatNormalMap",s.clearcoatNormalTexture)),s.clearcoatNormalTexture.scale!==void 0)){const l=s.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Se(l,l)}return Promise.all(i)}}class Vl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_DISPERSION}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=n.extensions[this.name];return t.dispersion=i.dispersion!==void 0?i.dispersion:0,Promise.resolve()}}class Ul{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[],s=n.extensions[this.name];return s.iridescenceFactor!==void 0&&(t.iridescence=s.iridescenceFactor),s.iridescenceTexture!==void 0&&i.push(o.assignTexture(t,"iridescenceMap",s.iridescenceTexture)),s.iridescenceIor!==void 0&&(t.iridescenceIOR=s.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),s.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=s.iridescenceThicknessMinimum),s.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=s.iridescenceThicknessMaximum),s.iridescenceThicknessTexture!==void 0&&i.push(o.assignTexture(t,"iridescenceThicknessMap",s.iridescenceThicknessTexture)),Promise.all(i)}}class Xl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_SHEEN}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[];t.sheenColor=new ie(0,0,0),t.sheenRoughness=0,t.sheen=1;const s=n.extensions[this.name];if(s.sheenColorFactor!==void 0){const l=s.sheenColorFactor;t.sheenColor.setRGB(l[0],l[1],l[2],Ht)}return s.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=s.sheenRoughnessFactor),s.sheenColorTexture!==void 0&&i.push(o.assignTexture(t,"sheenColorMap",s.sheenColorTexture,fa)),s.sheenRoughnessTexture!==void 0&&i.push(o.assignTexture(t,"sheenRoughnessMap",s.sheenRoughnessTexture)),Promise.all(i)}}class Gl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[],s=n.extensions[this.name];return s.transmissionFactor!==void 0&&(t.transmission=s.transmissionFactor),s.transmissionTexture!==void 0&&i.push(o.assignTexture(t,"transmissionMap",s.transmissionTexture)),Promise.all(i)}}class jl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_VOLUME}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[],s=n.extensions[this.name];t.thickness=s.thicknessFactor!==void 0?s.thicknessFactor:0,s.thicknessTexture!==void 0&&i.push(o.assignTexture(t,"thicknessMap",s.thicknessTexture)),t.attenuationDistance=s.attenuationDistance||1/0;const l=s.attenuationColor||[1,1,1];return t.attenuationColor=new ie().setRGB(l[0],l[1],l[2],Ht),Promise.all(i)}}class Zl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_IOR}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=n.extensions[this.name];return t.ior=i.ior!==void 0?i.ior:1.5,Promise.resolve()}}class ql{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_SPECULAR}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[],s=n.extensions[this.name];t.specularIntensity=s.specularFactor!==void 0?s.specularFactor:1,s.specularTexture!==void 0&&i.push(o.assignTexture(t,"specularIntensityMap",s.specularTexture));const l=s.specularColorFactor||[1,1,1];return t.specularColor=new ie().setRGB(l[0],l[1],l[2],Ht),s.specularColorTexture!==void 0&&i.push(o.assignTexture(t,"specularColorMap",s.specularColorTexture,fa)),Promise.all(i)}}class Yl{constructor(e){this.parser=e,this.name=X.EXT_MATERIALS_BUMP}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[],s=n.extensions[this.name];return t.bumpScale=s.bumpFactor!==void 0?s.bumpFactor:1,s.bumpTexture!==void 0&&i.push(o.assignTexture(t,"bumpMap",s.bumpTexture)),Promise.all(i)}}class Kl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:wt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const i=[],s=n.extensions[this.name];return s.anisotropyStrength!==void 0&&(t.anisotropy=s.anisotropyStrength),s.anisotropyRotation!==void 0&&(t.anisotropyRotation=s.anisotropyRotation),s.anisotropyTexture!==void 0&&i.push(o.assignTexture(t,"anisotropyMap",s.anisotropyTexture)),Promise.all(i)}}class $l{constructor(e){this.parser=e,this.name=X.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,o=t.json,n=o.textures[e];if(!n.extensions||!n.extensions[this.name])return null;const i=n.extensions[this.name],s=t.options.ktx2Loader;if(!s){if(o.extensionsRequired&&o.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,i.source,s)}}class Jl{constructor(e){this.parser=e,this.name=X.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,o=this.parser,n=o.json,i=n.textures[e];if(!i.extensions||!i.extensions[t])return null;const s=i.extensions[t],l=n.images[s.source];let r=o.textureLoader;if(l.uri){const u=o.options.manager.getHandler(l.uri);u!==null&&(r=u)}return o.loadTextureImage(e,s.source,r)}}class Ql{constructor(e){this.parser=e,this.name=X.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,o=this.parser,n=o.json,i=n.textures[e];if(!i.extensions||!i.extensions[t])return null;const s=i.extensions[t],l=n.images[s.source];let r=o.textureLoader;if(l.uri){const u=o.options.manager.getHandler(l.uri);u!==null&&(r=u)}return o.loadTextureImage(e,s.source,r)}}class ec{constructor(e){this.name=X.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,o=t.bufferViews[e];if(o.extensions&&o.extensions[this.name]){const n=o.extensions[this.name],i=this.parser.getDependency("buffer",n.buffer),s=this.parser.options.meshoptDecoder;if(!s||!s.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return i.then(function(l){const r=n.byteOffset||0,u=n.byteLength||0,c=n.count,d=n.byteStride,h=new Uint8Array(l,r,u);return s.decodeGltfBufferAsync?s.decodeGltfBufferAsync(c,d,h,n.mode,n.filter).then(function(p){return p.buffer}):s.ready.then(function(){const p=new ArrayBuffer(c*d);return s.decodeGltfBuffer(new Uint8Array(p),c,d,h,n.mode,n.filter),p})})}else return null}}class tc{constructor(e){this.name=X.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,o=t.nodes[e];if(!o.extensions||!o.extensions[this.name]||o.mesh===void 0)return null;const n=t.meshes[o.mesh];for(const u of n.primitives)if(u.mode!==et.TRIANGLES&&u.mode!==et.TRIANGLE_STRIP&&u.mode!==et.TRIANGLE_FAN&&u.mode!==void 0)return null;const s=o.extensions[this.name].attributes,l=[],r={};for(const u in s)l.push(this.parser.getDependency("accessor",s[u]).then(c=>(r[u]=c,r[u])));return l.length<1?null:(l.push(this.parser.createNodeMesh(e)),Promise.all(l).then(u=>{const c=u.pop(),d=c.isGroup?c.children:[c],h=u[0].count,p=[];for(const m of d){const g=new zt,v=new w,S=new kt,T=new w(1,1,1),y=new Un(m.geometry,m.material,h);for(let b=0;b<h;b++)r.TRANSLATION&&v.fromBufferAttribute(r.TRANSLATION,b),r.ROTATION&&S.fromBufferAttribute(r.ROTATION,b),r.SCALE&&T.fromBufferAttribute(r.SCALE,b),y.setMatrixAt(b,g.compose(v,S,T));for(const b in r)if(b==="_COLOR_0"){const M=r[b];y.instanceColor=new Xn(M.array,M.itemSize,M.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&m.geometry.setAttribute(b,r[b]);bi.prototype.copy.call(y,m),this.parser.assignFinalMaterial(y),p.push(y)}return c.isGroup?(c.clear(),c.add(...p),c):p[0]}))}}const Ii="glTF",oa=12,Gs={JSON:1313821514,BIN:5130562};class oc{constructor(e){this.name=X.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,oa),o=new TextDecoder;if(this.header={magic:o.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Ii)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const n=this.header.length-oa,i=new DataView(e,oa);let s=0;for(;s<n;){const l=i.getUint32(s,!0);s+=4;const r=i.getUint32(s,!0);if(s+=4,r===Gs.JSON){const u=new Uint8Array(e,oa+s,l);this.content=o.decode(u)}else if(r===Gs.BIN){const u=oa+s;this.body=e.slice(u,u+l)}s+=l}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class ac{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=X.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const o=this.json,n=this.dracoLoader,i=e.extensions[this.name].bufferView,s=e.extensions[this.name].attributes,l={},r={},u={};for(const c in s){const d=Zn[c]||c.toLowerCase();l[d]=s[c]}for(const c in e.attributes){const d=Zn[c]||c.toLowerCase();if(s[c]!==void 0){const h=o.accessors[e.attributes[c]],p=Oo[h.componentType];u[d]=p.name,r[d]=h.normalized===!0}}return t.getDependency("bufferView",i).then(function(c){return new Promise(function(d,h){n.decodeDracoFile(c,function(p){for(const m in p.attributes){const g=p.attributes[m],v=r[m];v!==void 0&&(g.normalized=v)}d(p)},l,u,Ht,h)})})}}class nc{constructor(){this.name=X.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class sc{constructor(){this.name=X.KHR_MESH_QUANTIZATION}}class Li extends tl{constructor(e,t,o,n){super(e,t,o,n)}copySampleValue_(e){const t=this.resultBuffer,o=this.sampleValues,n=this.valueSize,i=e*n*3+n;for(let s=0;s!==n;s++)t[s]=o[i+s];return t}interpolate_(e,t,o,n){const i=this.resultBuffer,s=this.sampleValues,l=this.valueSize,r=l*2,u=l*3,c=n-t,d=(o-t)/c,h=d*d,p=h*d,m=e*u,g=m-u,v=-2*p+3*h,S=p-h,T=1-v,y=S-h+d;for(let b=0;b!==l;b++){const M=s[g+b+l],C=s[g+b+r]*c,I=s[m+b+l],A=s[m+b]*c;i[b]=T*M+y*C+v*I+S*A}return i}}const ic=new kt;class rc extends Li{interpolate_(e,t,o,n){const i=super.interpolate_(e,t,o,n);return ic.fromArray(i).normalize().toArray(i),i}}const et={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Oo={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},js={9728:Mi,9729:nt,9984:Br,9985:Nr,9986:zr,9987:Ti},Zs={33071:Vr,33648:Wr,10497:ha},An={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Zn={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Vt={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},lc={CUBICSPLINE:void 0,LINEAR:Di,STEP:Jr},Cn={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function cc(a){return a.DefaultMaterial===void 0&&(a.DefaultMaterial=new dn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:el})),a.DefaultMaterial}function eo(a,e,t){for(const o in t.extensions)a[o]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[o]=t.extensions[o])}function lt(a,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(a.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function uc(a,e,t){let o=!1,n=!1,i=!1;for(let u=0,c=e.length;u<c;u++){const d=e[u];if(d.POSITION!==void 0&&(o=!0),d.NORMAL!==void 0&&(n=!0),d.COLOR_0!==void 0&&(i=!0),o&&n&&i)break}if(!o&&!n&&!i)return Promise.resolve(a);const s=[],l=[],r=[];for(let u=0,c=e.length;u<c;u++){const d=e[u];if(o){const h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):a.attributes.position;s.push(h)}if(n){const h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):a.attributes.normal;l.push(h)}if(i){const h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):a.attributes.color;r.push(h)}}return Promise.all([Promise.all(s),Promise.all(l),Promise.all(r)]).then(function(u){const c=u[0],d=u[1],h=u[2];return o&&(a.morphAttributes.position=c),n&&(a.morphAttributes.normal=d),i&&(a.morphAttributes.color=h),a.morphTargetsRelative=!0,a})}function dc(a,e){if(a.updateMorphTargets(),e.weights!==void 0)for(let t=0,o=e.weights.length;t<o;t++)a.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(a.morphTargetInfluences.length===t.length){a.morphTargetDictionary={};for(let o=0,n=t.length;o<n;o++)a.morphTargetDictionary[t[o]]=o}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function hc(a){let e;const t=a.extensions&&a.extensions[X.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+In(t.attributes):e=a.indices+":"+In(a.attributes)+":"+a.mode,a.targets!==void 0)for(let o=0,n=a.targets.length;o<n;o++)e+=":"+In(a.targets[o]);return e}function In(a){let e="";const t=Object.keys(a).sort();for(let o=0,n=t.length;o<n;o++)e+=t[o]+":"+a[t[o]]+";";return e}function qn(a){switch(a){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function fc(a){return a.search(/\.jpe?g($|\?)/i)>0||a.search(/^data\:image\/jpeg/)===0?"image/jpeg":a.search(/\.webp($|\?)/i)>0||a.search(/^data\:image\/webp/)===0?"image/webp":a.search(/\.ktx2($|\?)/i)>0||a.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const mc=new zt;class pc{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Hl,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let o=!1,n=-1,i=!1,s=-1;if(typeof navigator<"u"){const l=navigator.userAgent;o=/^((?!chrome|android).)*safari/i.test(l)===!0;const r=l.match(/Version\/(\d+)/);n=o&&r?parseInt(r[1],10):-1,i=l.indexOf("Firefox")>-1,s=i?l.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||o&&n<17||i&&s<98?this.textureLoader=new vi(this.options.manager):this.textureLoader=new kr(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Si(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const o=this,n=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(s){return s._markDefs&&s._markDefs()}),Promise.all(this._invokeAll(function(s){return s.beforeRoot&&s.beforeRoot()})).then(function(){return Promise.all([o.getDependencies("scene"),o.getDependencies("animation"),o.getDependencies("camera")])}).then(function(s){const l={scene:s[0][n.scene||0],scenes:s[0],animations:s[1],cameras:s[2],asset:n.asset,parser:o,userData:{}};return eo(i,l,n),lt(l,n),Promise.all(o._invokeAll(function(r){return r.afterRoot&&r.afterRoot(l)})).then(function(){for(const r of l.scenes)r.updateMatrixWorld();e(l)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],o=this.json.meshes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n].joints;for(let l=0,r=s.length;l<r;l++)e[s[l]].isBone=!0}for(let n=0,i=e.length;n<i;n++){const s=e[n];s.mesh!==void 0&&(this._addNodeRef(this.meshCache,s.mesh),s.skin!==void 0&&(o[s.mesh].isSkinnedMesh=!0)),s.camera!==void 0&&this._addNodeRef(this.cameraCache,s.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,o){if(e.refs[t]<=1)return o;const n=o.clone(),i=(s,l)=>{const r=this.associations.get(s);r!=null&&this.associations.set(l,r);for(const[u,c]of s.children.entries())i(c,l.children[u])};return i(o,n),n.name+="_instance_"+e.uses[t]++,n}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let o=0;o<t.length;o++){const n=e(t[o]);if(n)return n}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const o=[];for(let n=0;n<t.length;n++){const i=e(t[n]);i&&o.push(i)}return o}getDependency(e,t){const o=e+":"+t;let n=this.cache.get(o);if(!n){switch(e){case"scene":n=this.loadScene(t);break;case"node":n=this._invokeOne(function(i){return i.loadNode&&i.loadNode(t)});break;case"mesh":n=this._invokeOne(function(i){return i.loadMesh&&i.loadMesh(t)});break;case"accessor":n=this.loadAccessor(t);break;case"bufferView":n=this._invokeOne(function(i){return i.loadBufferView&&i.loadBufferView(t)});break;case"buffer":n=this.loadBuffer(t);break;case"material":n=this._invokeOne(function(i){return i.loadMaterial&&i.loadMaterial(t)});break;case"texture":n=this._invokeOne(function(i){return i.loadTexture&&i.loadTexture(t)});break;case"skin":n=this.loadSkin(t);break;case"animation":n=this._invokeOne(function(i){return i.loadAnimation&&i.loadAnimation(t)});break;case"camera":n=this.loadCamera(t);break;default:if(n=this._invokeOne(function(i){return i!=this&&i.getDependency&&i.getDependency(e,t)}),!n)throw new Error("Unknown type: "+e);break}this.cache.add(o,n)}return n}getDependencies(e){let t=this.cache.get(e);if(!t){const o=this,n=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(n.map(function(i,s){return o.getDependency(e,s)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],o=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[X.KHR_BINARY_GLTF].body);const n=this.options;return new Promise(function(i,s){o.load(ra.resolveURL(t.uri,n.path),i,void 0,function(){s(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(o){const n=t.byteLength||0,i=t.byteOffset||0;return o.slice(i,i+n)})}loadAccessor(e){const t=this,o=this.json,n=this.json.accessors[e];if(n.bufferView===void 0&&n.sparse===void 0){const s=An[n.type],l=Oo[n.componentType],r=n.normalized===!0,u=new l(n.count*s);return Promise.resolve(new no(u,s,r))}const i=[];return n.bufferView!==void 0?i.push(this.getDependency("bufferView",n.bufferView)):i.push(null),n.sparse!==void 0&&(i.push(this.getDependency("bufferView",n.sparse.indices.bufferView)),i.push(this.getDependency("bufferView",n.sparse.values.bufferView))),Promise.all(i).then(function(s){const l=s[0],r=An[n.type],u=Oo[n.componentType],c=u.BYTES_PER_ELEMENT,d=c*r,h=n.byteOffset||0,p=n.bufferView!==void 0?o.bufferViews[n.bufferView].byteStride:void 0,m=n.normalized===!0;let g,v;if(p&&p!==d){const S=Math.floor(h/p),T="InterleavedBuffer:"+n.bufferView+":"+n.componentType+":"+S+":"+n.count;let y=t.cache.get(T);y||(g=new u(l,S*p,n.count*p/c),y=new Hr(g,p/c),t.cache.add(T,y)),v=new Qr(y,r,h%p/c,m)}else l===null?g=new u(n.count*r):g=new u(l,h,n.count*r),v=new no(g,r,m);if(n.sparse!==void 0){const S=An.SCALAR,T=Oo[n.sparse.indices.componentType],y=n.sparse.indices.byteOffset||0,b=n.sparse.values.byteOffset||0,M=new T(s[1],y,n.sparse.count*S),C=new u(s[2],b,n.sparse.count*r);l!==null&&(v=new no(v.array.slice(),v.itemSize,v.normalized)),v.normalized=!1;for(let I=0,A=M.length;I<A;I++){const H=M[I];if(v.setX(H,C[I*r]),r>=2&&v.setY(H,C[I*r+1]),r>=3&&v.setZ(H,C[I*r+2]),r>=4&&v.setW(H,C[I*r+3]),r>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}v.normalized=m}return v})}loadTexture(e){const t=this.json,o=this.options,i=t.textures[e].source,s=t.images[i];let l=this.textureLoader;if(s.uri){const r=o.manager.getHandler(s.uri);r!==null&&(l=r)}return this.loadTextureImage(e,i,l)}loadTextureImage(e,t,o){const n=this,i=this.json,s=i.textures[e],l=i.images[t],r=(l.uri||l.bufferView)+":"+s.sampler;if(this.textureCache[r])return this.textureCache[r];const u=this.loadImageSource(t,o).then(function(c){c.flipY=!1,c.name=s.name||l.name||"",c.name===""&&typeof l.uri=="string"&&l.uri.startsWith("data:image/")===!1&&(c.name=l.uri);const h=(i.samplers||{})[s.sampler]||{};return c.magFilter=js[h.magFilter]||nt,c.minFilter=js[h.minFilter]||Ti,c.wrapS=Zs[h.wrapS]||ha,c.wrapT=Zs[h.wrapT]||ha,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==Mi&&c.minFilter!==nt,n.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[r]=u,u}loadImageSource(e,t){const o=this,n=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const s=n.images[e],l=self.URL||self.webkitURL;let r=s.uri||"",u=!1;if(s.bufferView!==void 0)r=o.getDependency("bufferView",s.bufferView).then(function(d){u=!0;const h=new Blob([d],{type:s.mimeType});return r=l.createObjectURL(h),r});else if(s.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const c=Promise.resolve(r).then(function(d){return new Promise(function(h,p){let m=h;t.isImageBitmapLoader===!0&&(m=function(g){const v=new Hs(g);v.needsUpdate=!0,h(v)}),t.load(ra.resolveURL(d,i.path),m,void 0,p)})}).then(function(d){return u===!0&&l.revokeObjectURL(r),lt(d,s),d.userData.mimeType=s.mimeType||fc(s.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",r),d});return this.sourceCache[e]=c,c}assignTexture(e,t,o,n){const i=this;return this.getDependency("texture",o.index).then(function(s){if(!s)return null;if(o.texCoord!==void 0&&o.texCoord>0&&(s=s.clone(),s.channel=o.texCoord),i.extensions[X.KHR_TEXTURE_TRANSFORM]){const l=o.extensions!==void 0?o.extensions[X.KHR_TEXTURE_TRANSFORM]:void 0;if(l){const r=i.associations.get(s);s=i.extensions[X.KHR_TEXTURE_TRANSFORM].extendTexture(s,l),i.associations.set(s,r)}}return n!==void 0&&(s.colorSpace=n),e[t]=s,s})}assignFinalMaterial(e){const t=e.geometry;let o=e.material;const n=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,s=t.attributes.normal===void 0;if(e.isPoints){const l="PointsMaterial:"+o.uuid;let r=this.cache.get(l);r||(r=new Ts,En.prototype.copy.call(r,o),r.color.copy(o.color),r.map=o.map,r.sizeAttenuation=!1,this.cache.add(l,r)),o=r}else if(e.isLine){const l="LineBasicMaterial:"+o.uuid;let r=this.cache.get(l);r||(r=new Ur,En.prototype.copy.call(r,o),r.color.copy(o.color),r.map=o.map,this.cache.add(l,r)),o=r}if(n||i||s){let l="ClonedMaterial:"+o.uuid+":";n&&(l+="derivative-tangents:"),i&&(l+="vertex-colors:"),s&&(l+="flat-shading:");let r=this.cache.get(l);r||(r=o.clone(),i&&(r.vertexColors=!0),s&&(r.flatShading=!0),n&&(r.normalScale&&(r.normalScale.y*=-1),r.clearcoatNormalScale&&(r.clearcoatNormalScale.y*=-1)),this.cache.add(l,r),this.associations.set(r,this.associations.get(o))),o=r}e.material=o}getMaterialType(){return dn}loadMaterial(e){const t=this,o=this.json,n=this.extensions,i=o.materials[e];let s;const l={},r=i.extensions||{},u=[];if(r[X.KHR_MATERIALS_UNLIT]){const d=n[X.KHR_MATERIALS_UNLIT];s=d.getMaterialType(),u.push(d.extendParams(l,i,t))}else{const d=i.pbrMetallicRoughness||{};if(l.color=new ie(1,1,1),l.opacity=1,Array.isArray(d.baseColorFactor)){const h=d.baseColorFactor;l.color.setRGB(h[0],h[1],h[2],Ht),l.opacity=h[3]}d.baseColorTexture!==void 0&&u.push(t.assignTexture(l,"map",d.baseColorTexture,fa)),l.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,l.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(u.push(t.assignTexture(l,"metalnessMap",d.metallicRoughnessTexture)),u.push(t.assignTexture(l,"roughnessMap",d.metallicRoughnessTexture))),s=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),u.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,l)})))}i.doubleSided===!0&&(l.side=rt);const c=i.alphaMode||Cn.OPAQUE;if(c===Cn.BLEND?(l.transparent=!0,l.depthWrite=!1):(l.transparent=!1,c===Cn.MASK&&(l.alphaTest=i.alphaCutoff!==void 0?i.alphaCutoff:.5)),i.normalTexture!==void 0&&s!==Ct&&(u.push(t.assignTexture(l,"normalMap",i.normalTexture)),l.normalScale=new Se(1,1),i.normalTexture.scale!==void 0)){const d=i.normalTexture.scale;l.normalScale.set(d,d)}if(i.occlusionTexture!==void 0&&s!==Ct&&(u.push(t.assignTexture(l,"aoMap",i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(l.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&s!==Ct){const d=i.emissiveFactor;l.emissive=new ie().setRGB(d[0],d[1],d[2],Ht)}return i.emissiveTexture!==void 0&&s!==Ct&&u.push(t.assignTexture(l,"emissiveMap",i.emissiveTexture,fa)),Promise.all(u).then(function(){const d=new s(l);return i.name&&(d.name=i.name),lt(d,i),t.associations.set(d,{materials:e}),i.extensions&&eo(n,d,i),d})}createUniqueName(e){const t=Xr.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,o=this.extensions,n=this.primitiveCache;function i(l){return o[X.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(l,t).then(function(r){return qs(r,l,t)})}const s=[];for(let l=0,r=e.length;l<r;l++){const u=e[l],c=hc(u),d=n[c];if(d)s.push(d.promise);else{let h;u.extensions&&u.extensions[X.KHR_DRACO_MESH_COMPRESSION]?h=i(u):h=qs(new un,u,t),n[c]={primitive:u,promise:h},s.push(h)}}return Promise.all(s)}loadMesh(e){const t=this,o=this.json,n=this.extensions,i=o.meshes[e],s=i.primitives,l=[];for(let r=0,u=s.length;r<u;r++){const c=s[r].material===void 0?cc(this.cache):this.getDependency("material",s[r].material);l.push(c)}return l.push(t.loadGeometries(s)),Promise.all(l).then(function(r){const u=r.slice(0,r.length-1),c=r[r.length-1],d=[];for(let p=0,m=c.length;p<m;p++){const g=c[p],v=s[p];let S;const T=u[p];if(v.mode===et.TRIANGLES||v.mode===et.TRIANGLE_STRIP||v.mode===et.TRIANGLE_FAN||v.mode===void 0)S=i.isSkinnedMesh===!0?new Gr(g,T):new we(g,T),S.isSkinnedMesh===!0&&S.normalizeSkinWeights(),v.mode===et.TRIANGLE_STRIP?S.geometry=Xs(S.geometry,wi):v.mode===et.TRIANGLE_FAN&&(S.geometry=Xs(S.geometry,Vn));else if(v.mode===et.LINES)S=new jr(g,T);else if(v.mode===et.LINE_STRIP)S=new Zr(g,T);else if(v.mode===et.LINE_LOOP)S=new qr(g,T);else if(v.mode===et.POINTS)S=new Ms(g,T);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+v.mode);Object.keys(S.geometry.morphAttributes).length>0&&dc(S,i),S.name=t.createUniqueName(i.name||"mesh_"+e),lt(S,i),v.extensions&&eo(n,S,v),t.assignFinalMaterial(S),d.push(S)}for(let p=0,m=d.length;p<m;p++)t.associations.set(d[p],{meshes:e,primitives:p});if(d.length===1)return i.extensions&&eo(n,d[0],i),d[0];const h=new Zt;i.extensions&&eo(n,h,i),t.associations.set(h,{meshes:e});for(let p=0,m=d.length;p<m;p++)h.add(d[p]);return h})}loadCamera(e){let t;const o=this.json.cameras[e],n=o[o.type];if(!n){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return o.type==="perspective"?t=new xi(ae.radToDeg(n.yfov),n.aspectRatio||1,n.znear||1,n.zfar||2e6):o.type==="orthographic"&&(t=new Wn(-n.xmag,n.xmag,n.ymag,-n.ymag,n.znear,n.zfar)),o.name&&(t.name=this.createUniqueName(o.name)),lt(t,o),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],o=[];for(let n=0,i=t.joints.length;n<i;n++)o.push(this._loadNodeShallow(t.joints[n]));return t.inverseBindMatrices!==void 0?o.push(this.getDependency("accessor",t.inverseBindMatrices)):o.push(null),Promise.all(o).then(function(n){const i=n.pop(),s=n,l=[],r=[];for(let u=0,c=s.length;u<c;u++){const d=s[u];if(d){l.push(d);const h=new zt;i!==null&&h.fromArray(i.array,u*16),r.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[u])}return new Yr(l,r)})}loadAnimation(e){const t=this.json,o=this,n=t.animations[e],i=n.name?n.name:"animation_"+e,s=[],l=[],r=[],u=[],c=[];for(let d=0,h=n.channels.length;d<h;d++){const p=n.channels[d],m=n.samplers[p.sampler],g=p.target,v=g.node,S=n.parameters!==void 0?n.parameters[m.input]:m.input,T=n.parameters!==void 0?n.parameters[m.output]:m.output;g.node!==void 0&&(s.push(this.getDependency("node",v)),l.push(this.getDependency("accessor",S)),r.push(this.getDependency("accessor",T)),u.push(m),c.push(g))}return Promise.all([Promise.all(s),Promise.all(l),Promise.all(r),Promise.all(u),Promise.all(c)]).then(function(d){const h=d[0],p=d[1],m=d[2],g=d[3],v=d[4],S=[];for(let y=0,b=h.length;y<b;y++){const M=h[y],C=p[y],I=m[y],A=g[y],H=v[y];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();const L=o._createAnimationTracks(M,C,I,A,H);if(L)for(let W=0;W<L.length;W++)S.push(L[W])}const T=new Kr(i,void 0,S);return lt(T,n),T})}createNodeMesh(e){const t=this.json,o=this,n=t.nodes[e];return n.mesh===void 0?null:o.getDependency("mesh",n.mesh).then(function(i){const s=o._getNodeRef(o.meshCache,n.mesh,i);return n.weights!==void 0&&s.traverse(function(l){if(l.isMesh)for(let r=0,u=n.weights.length;r<u;r++)l.morphTargetInfluences[r]=n.weights[r]}),s})}loadNode(e){const t=this.json,o=this,n=t.nodes[e],i=o._loadNodeShallow(e),s=[],l=n.children||[];for(let u=0,c=l.length;u<c;u++)s.push(o.getDependency("node",l[u]));const r=n.skin===void 0?Promise.resolve(null):o.getDependency("skin",n.skin);return Promise.all([i,Promise.all(s),r]).then(function(u){const c=u[0],d=u[1],h=u[2];h!==null&&c.traverse(function(p){p.isSkinnedMesh&&p.bind(h,mc)});for(let p=0,m=d.length;p<m;p++)c.add(d[p]);return c})}_loadNodeShallow(e){const t=this.json,o=this.extensions,n=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const i=t.nodes[e],s=i.name?n.createUniqueName(i.name):"",l=[],r=n._invokeOne(function(u){return u.createNodeMesh&&u.createNodeMesh(e)});return r&&l.push(r),i.camera!==void 0&&l.push(n.getDependency("camera",i.camera).then(function(u){return n._getNodeRef(n.cameraCache,i.camera,u)})),n._invokeAll(function(u){return u.createNodeAttachment&&u.createNodeAttachment(e)}).forEach(function(u){l.push(u)}),this.nodeCache[e]=Promise.all(l).then(function(u){let c;if(i.isBone===!0?c=new $r:u.length>1?c=new Zt:u.length===1?c=u[0]:c=new bi,c!==u[0])for(let d=0,h=u.length;d<h;d++)c.add(u[d]);if(i.name&&(c.userData.name=i.name,c.name=s),lt(c,i),i.extensions&&eo(o,c,i),i.matrix!==void 0){const d=new zt;d.fromArray(i.matrix),c.applyMatrix4(d)}else i.translation!==void 0&&c.position.fromArray(i.translation),i.rotation!==void 0&&c.quaternion.fromArray(i.rotation),i.scale!==void 0&&c.scale.fromArray(i.scale);if(!n.associations.has(c))n.associations.set(c,{});else if(i.mesh!==void 0&&n.meshCache.refs[i.mesh]>1){const d=n.associations.get(c);n.associations.set(c,{...d})}return n.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){const t=this.extensions,o=this.json.scenes[e],n=this,i=new Zt;o.name&&(i.name=n.createUniqueName(o.name)),lt(i,o),o.extensions&&eo(t,i,o);const s=o.nodes||[],l=[];for(let r=0,u=s.length;r<u;r++)l.push(n.getDependency("node",s[r]));return Promise.all(l).then(function(r){for(let c=0,d=r.length;c<d;c++)i.add(r[c]);const u=c=>{const d=new Map;for(const[h,p]of n.associations)(h instanceof En||h instanceof Hs)&&d.set(h,p);return c.traverse(h=>{const p=n.associations.get(h);p!=null&&d.set(h,p)}),d};return n.associations=u(i),i})}_createAnimationTracks(e,t,o,n,i){const s=[],l=e.name?e.name:e.uuid,r=[];Vt[i.path]===Vt.weights?e.traverse(function(h){h.morphTargetInfluences&&r.push(h.name?h.name:h.uuid)}):r.push(l);let u;switch(Vt[i.path]){case Vt.weights:u=Ns;break;case Vt.rotation:u=Bs;break;case Vt.translation:case Vt.scale:u=zs;break;default:switch(o.itemSize){case 1:u=Ns;break;case 2:case 3:default:u=zs;break}break}const c=n.interpolation!==void 0?lc[n.interpolation]:Di,d=this._getArrayFromAccessor(o);for(let h=0,p=r.length;h<p;h++){const m=new u(r[h]+"."+Vt[i.path],t.array,d,c);n.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),s.push(m)}return s}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const o=qn(t.constructor),n=new Float32Array(t.length);for(let i=0,s=t.length;i<s;i++)n[i]=t[i]*o;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(o){const n=this instanceof Bs?rc:Li;return new n(this.times,this.values,this.getValueSize()/3,o)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function gc(a,e,t){const o=e.attributes,n=new ol;if(o.POSITION!==void 0){const l=t.json.accessors[o.POSITION],r=l.min,u=l.max;if(r!==void 0&&u!==void 0){if(n.set(new w(r[0],r[1],r[2]),new w(u[0],u[1],u[2])),l.normalized){const c=qn(Oo[l.componentType]);n.min.multiplyScalar(c),n.max.multiplyScalar(c)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const i=e.targets;if(i!==void 0){const l=new w,r=new w;for(let u=0,c=i.length;u<c;u++){const d=i[u];if(d.POSITION!==void 0){const h=t.json.accessors[d.POSITION],p=h.min,m=h.max;if(p!==void 0&&m!==void 0){if(r.setX(Math.max(Math.abs(p[0]),Math.abs(m[0]))),r.setY(Math.max(Math.abs(p[1]),Math.abs(m[1]))),r.setZ(Math.max(Math.abs(p[2]),Math.abs(m[2]))),h.normalized){const g=qn(Oo[h.componentType]);r.multiplyScalar(g)}l.max(r)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}n.expandByVector(l)}a.boundingBox=n;const s=new al;n.getCenter(s.center),s.radius=n.min.distanceTo(n.max)/2,a.boundingSphere=s}function qs(a,e,t){const o=e.attributes,n=[];function i(s,l){return t.getDependency("accessor",s).then(function(r){a.setAttribute(l,r)})}for(const s in o){const l=Zn[s]||s.toLowerCase();l in a.attributes||n.push(i(o[s],l))}if(e.indices!==void 0&&!a.index){const s=t.getDependency("accessor",e.indices).then(function(l){a.setIndex(l)});n.push(s)}return Ws.workingColorSpace!==Ht&&"COLOR_0"in o&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ws.workingColorSpace}" not supported.`),lt(a,e),gc(a,e,t),Promise.all(n).then(function(){return e.targets!==void 0?uc(a,e.targets,t):a})}const vc=Object.freeze(Object.defineProperty({__proto__:null,GLTFLoader:Ye},Symbol.toStringTag,{value:"Module"}));function mo(a){const e=new Map,t=new Map,o=a.clone();return Ri(a,o,function(n,i){e.set(i,n),t.set(n,i)}),o.traverse(function(n){if(!n.isSkinnedMesh)return;const i=n,s=e.get(n),l=s.skeleton.bones;i.skeleton=s.skeleton.clone(),i.bindMatrix.copy(s.bindMatrix),i.skeleton.bones=l.map(function(r){return t.get(r)}),i.bind(i.skeleton,i.bindMatrix)}),o}function Ri(a,e,t){t(a,e);for(let o=0;o<a.children.length;o++)Ri(a.children[o],e.children[o],t)}const Ge={center:{x:13.5,y:-4.064,z:-1},radius:34,speed:.148,currentTime:0};function Yn(a){const e=Ge.radius,t=1/(1+Math.sin(a)*Math.sin(a)),o=Ge.center.x+e*t*Math.cos(a),n=Ge.center.z+e*t*Math.sin(a)*Math.cos(a),i=Ge.center.y;return{x:o,y:i,z:n}}let Ue=null,so=null;function Oi(a,e,t){new Ye().load("./models/shark.glb",n=>{Ue=n.scene;const i=Yn(0);Ue.position.set(i.x,i.y,i.z),Ue.scale.set(.16,.17,.18),Ue.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),a.add(Ue),n.animations&&n.animations.length>0&&(so=new We(Ue),n.animations.forEach(s=>{so.clipAction(s).play()}))},void 0,n=>{console.error("Error loading shark model:",n)})}function yc(a){if(!Ue)return;Ge.currentTime+=a*Ge.speed;const e=Yn(Ge.currentTime),t=Yn(Ge.currentTime+.01),o=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Ue.position.set(e.x,e.y,e.z);const n=Math.atan2(o.x,o.z);Ue.rotation.y=n,so&&so.update(a)}function wc(a){Ue&&(a.remove(Ue),Ue.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),Ue=null),so&&(so.stopAllAction(),so=null),Ge.currentTime=0}let ma=null;const Fo=[],ka=[],Ha=[],Sc=106,bc=2,oo=280,Fi=1.85,Tc=28.2,ki=30,Mc=8,xc=6,Ys=18;let la=0;const Dc=5;function Hi(a,e,t){new Ye().load("./models/manta-ray.glb",n=>{ma=n.scene,Ha.push(...n.animations);for(let i=0;i<ki;i++)zi(a,!0,i);la=0},void 0,n=>{console.error("Error loading manta ray model:",n)})}function zi(a,e=!1,t=0){if(!ma)return;const o=mo(ma);o.traverse(s=>{s.isMesh&&(s.castShadow=!1,s.receiveShadow=!1)});const n=ae.randFloat(.12,.18);o.scale.set(n,n,n),o.rotation.y=Math.PI/2;let i;if(e){const s=t/ki;i=-oo/2+s*oo}else i=-oo/2-Math.random()*20;if(o.position.set(i,Ge.center.y-.5+ae.randFloatSpread(Fi),Ge.center.z+ae.randFloatSpread(30)),o.userData.baseY=o.position.y,o.userData.baseZ=o.position.z,o.userData.offset=Math.random()*10,o.userData.speed=bc*ae.randFloat(.8,1.2),o.userData.avoidanceSide=o.position.z>=0?1:-1,e&&(o.userData.fadeTime=0,o.userData.isFading=!0,o.traverse(s=>{s.isMesh&&s.material&&(s.material.transparent=!0,s.material.opacity=0)})),a.add(o),Fo.push(o),Ha.length>0){const s=new We(o);Ha.forEach(l=>s.clipAction(l).play()),ka.push(s)}}function Ec(a){zi(a,!1,0)}function Pc(a,e){if(ma){la+=a,Fo.length<Sc&&la>Tc*Math.random()&&(Ec(e),la=0);for(let t=0;t<Fo.length;t++){const o=Fo[t],n=o.userData.speed;if(o.userData.isFading){o.userData.fadeTime+=a;const r=Math.min(o.userData.fadeTime/Mc,1);o.traverse(u=>{u.isMesh&&u.material&&(u.material.opacity=r)}),r>=1&&(o.userData.isFading=!1)}o.position.x+=n*a;const i=Math.abs(o.position.x);if(i<Ys){const r=1-i/Ys,c=r*r*(3-2*r)*xc*o.userData.avoidanceSide;o.position.z=o.userData.baseZ+c;const d=6*r*(1-r),h=o.position.x<0?1:-1,p=d*.4*o.userData.avoidanceSide*h;o.rotation.z=p}else o.position.z=o.userData.baseZ,o.rotation.z=0;o.position.x>oo/2+20&&(o.position.x=-oo/2-Math.random()*20,o.position.y=Ge.center.y-.5+ae.randFloatSpread(Fi),o.position.z=Ge.center.z+ae.randFloatSpread(30),o.userData.baseY=o.position.y,o.userData.baseZ=o.position.z,o.userData.avoidanceSide=o.position.z>=0?1:-1);const s=(o.position.x+oo/2)/oo,l=1-Math.sin(s*Math.PI);o.position.y=o.userData.baseY+Math.sin(performance.now()*.001+o.userData.offset)*.2-l*Dc}ka.forEach(t=>t.update(a))}}function _c(a){Fo.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),ka.forEach(e=>e.stopAllAction()),Fo.length=0,ka.length=0,Ha.length=0,ma=null,la=0}let ca=null;const zo=[],pa=[],ua=new hn([new w(80,-8,0),new w(0,-10,60),new w(-120,-14,0),new w(0,-12,-20),new w(80,-8,0)],!0,"centripetal",.8),Ac=.0032;ua.getLengths()[ua.getLengths().length-1];function Ni(a,e,t){new Ye().load("./models/whale.glb",n=>{ca=n.scene;const i=n.animations,s=mo(ca);if(s.scale.set(.825,.825,.825),s.userData.pathProgress=Math.random(),s.userData.speed=Ac*ae.randFloat(.9,1.1),s.userData.lookAhead=.41,s.userData.pathOffset=0,s.userData.baseYOffset=0,s.userData.baseXOffset=0,s.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(s),zo.push(s),i.length>0){const r=new We(s);i.forEach(u=>r.clipAction(u).play()),pa.push(r)}const l=mo(ca);if(l.scale.set(.42,.42,.42),l.userData.pathProgress=s.userData.pathProgress-.01,l.userData.pathProgress>1&&(l.userData.pathProgress-=1),l.userData.speed=s.userData.speed,l.userData.lookAhead=.41,l.userData.pathOffset=-3.215,l.userData.baseYOffset=-3.2862,l.userData.baseXOffset=8.2261,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(l),zo.push(l),i.length>0){const r=new We(l);i.forEach(u=>{r.clipAction(u).startAt(Math.random()*u.duration).play()}),pa.push(r)}},void 0,n=>{console.error("Error loading whale model:",n)})}function Cc(a,e){if(!ca)return;const t=new w;new w(0,1,0),new w;const o=new kt;for(let n=0;n<zo.length;n++){const i=zo[n];i.userData.pathProgress+=i.userData.speed*a,i.userData.pathProgress>1&&(i.userData.pathProgress-=1);const s=ua.getPointAt(i.userData.pathProgress);i.position.copy(s),i.position.y+=i.userData.baseYOffset,i.position.x+=i.userData.baseXOffset;const l=ua.getPointAt((i.userData.pathProgress+i.userData.lookAhead)%1);i.lookAt(l),ua.getTangentAt(i.userData.pathProgress,t);const r=new w(0,0,1);o.setFromUnitVectors(r,t.normalize()),i.quaternion.copy(o)}pa.forEach(n=>n.update(a))}function Ic(a){zo.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),pa.forEach(e=>e.stopAllAction()),zo.length=0,pa.length=0,ca=null}let Kn=null;const No=[],za=[],aa=new hn([new w(45,-7,22),new w(18,-5,38),new w(-22,-6,33),new w(-55,-8,-11),new w(-25,-7,-46),new w(19,-6,-36),new w(45,-7,22)],!0,"centripetal",.7),Lc=.023,Rc=aa.getLength();function Bi(a,e,t){new Ye().load("./models/dolphin.glb",n=>{Kn=n.scene;const i=n.animations;for(let s=0;s<7;s++){const l=mo(Kn);if(l.scale.setScalar(.26+Math.random()*.035),s===0&&(l.userData.pathProgress=0),l.userData.speed=Lc*ae.randFloat(.95,1.05),l.userData.lookAhead=.35,l.userData.sineAmp=3.65,l.userData.sineFreq=2.8+Math.random()*.4,l.userData.roll=0,l.userData.spinTimer=Math.random()*6,l.userData.spinDuration=.55,l.userData.spinSpeed=0,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(l),No.push(l),i.length>0){const r=new We(l);i.forEach(u=>r.clipAction(u).play()),za.push(r)}}e&&e(No)},void 0,n=>{console.error("Error loading dolphin model:",n)})}function Oc(a){const e=new w,t=new w(0,1,0),o=6,n=4,i=.18;No.forEach((s,l)=>{l===0&&(s.userData.pathProgress+=s.userData.speed*a);let r;if(l===0){r=s.userData.pathProgress%1,r<0&&(r+=1);const u=aa.getPointAt(r),c=Math.sin(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.65);if(u.y+=c,u.y>-.2){const g=(u.y+.2)/3;u.y-=4*g*g}s.position.copy(u);const d=(s.userData.pathProgress+.08)%1,h=aa.getPointAt(d);e.subVectors(h,u).normalize(),s.lookAt(u.clone().add(e));const p=Math.cos(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.65*Math.PI*2*s.userData.sineFreq*2.2),m=-Math.atan(p*.006);s.rotateX(m)}else{s.userData.podOffset===void 0&&(s.userData.podOffset=ae.randFloat(-4,n)),s.userData.podSide===void 0&&(s.userData.podSide=ae.randFloat(-o,o));let u=No[0].userData.pathProgress+s.userData.podOffset/Rc;s.userData.pathProgress===void 0&&(s.userData.pathProgress=u);const c=u-s.userData.pathProgress;s.userData.pathProgress+=c*i,r=s.userData.pathProgress%1,r<0&&(r+=1);const d=aa.getPointAt(r),h=(s.userData.pathProgress+.08)%1,p=aa.getPointAt(h);e.subVectors(p,d).normalize();const m=new w().crossVectors(e,t).normalize();d.add(m.multiplyScalar(s.userData.podSide));const g=Math.sin(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.85);if(d.y+=g,d.y>-.2){const T=(d.y+.2)/3;d.y-=4*T*T}s.position.copy(d),s.lookAt(d.clone().add(e));const v=Math.cos(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.85*Math.PI*2*s.userData.sineFreq*2.2),S=-Math.atan(v*.006);s.rotateX(S)}s.userData.spinTimer-=a,s.userData.spinTimer<=0&&s.userData.spinSpeed===0&&(s.userData.spinSpeed=(5+Math.random()*3)*(Math.random()>.5?1:-1),s.userData.spinTimer=s.userData.spinDuration),s.userData.spinTimer<=0&&(s.userData.spinSpeed=0,s.userData.spinTimer=3+Math.random()*4),s.userData.roll+=s.userData.spinSpeed*a,s.rotation.z=s.userData.roll}),za.forEach(s=>s.update(a))}function Fc(a){No.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),za.forEach(e=>e.stopAllAction()),No.length=0,za.length=0,Kn=null}let Na=null;const Ba=[],Wa=[],$n=new hn([new w(-400,-3.28,-150),new w(-200,-1.612,50),new w(20,-1.498,180),new w(200,-1.612,50),new w(400,-3.28,-150)],!1,"centripetal",.95),kc=.00297;$n.getLength();function Wi(a,e,t){new Ye().load("./models/container-ship.glb",n=>{Na=n.scene;const i=n.animations,s=mo(Na);if(s.scale.setScalar(16.2),s.userData.pathProgress=0,s.userData.speed=kc*ae.randFloat(.9,1.1),s.userData.lookAhead=.02,s.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),a.add(s),Ba.push(s),i.length>0){const l=new We(s);i.forEach(r=>l.clipAction(r).play()),Wa.push(l)}},void 0,n=>{console.error("Error loading container-ship model:",n)})}function Hc(a){Na&&(new w,new w(0,1,0),Ba.forEach(e=>{e.userData.pathProgress+=e.userData.speed*a,e.userData.pathProgress=ae.clamp(e.userData.pathProgress,0,1);const t=$n.getPointAt(e.userData.pathProgress);e.position.copy(t);const o=$n.getPointAt(Math.min(e.userData.pathProgress+e.userData.lookAhead,1));e.lookAt(o)}),Wa.forEach(e=>e.update(a)))}function zc(a){Ba.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),Wa.forEach(e=>e.stopAllAction()),Ba.length=0,Wa.length=0,Na=null}const It={center:{x:93.5,y:-2.874,z:-61},radius:34,speed:.148,currentTime:0};function Jn(a){const e=It.radius,t=1/(1+Math.sin(a)*Math.sin(a)),o=It.center.x+e*t*Math.cos(a),n=It.center.z+e*t*Math.sin(a)*Math.cos(a),i=It.center.y;return{x:o,y:i,z:n}}let Xe=null,io=null;function Vi(a,e,t){new Ye().load("./models/sailboat.glb",n=>{Xe=n.scene;const i=Jn(0);Xe.position.set(i.x,i.y,i.z),Xe.scale.set(.12,.13,.09),Xe.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),a.add(Xe),n.animations&&n.animations.length>0&&(io=new We(Xe),n.animations.forEach(s=>{io.clipAction(s).play()}))},void 0,n=>{console.error("Error loading sailBoat model:",n)})}function Nc(a){if(!Xe)return;It.currentTime+=a*It.speed;const e=Jn(It.currentTime),t=Jn(It.currentTime+.01),o=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Xe.position.set(e.x,e.y,e.z);const n=Math.atan2(o.x,o.z);Xe.rotation.y=n,io&&io.update(a)}function Bc(a){Xe&&(a.remove(Xe),Xe.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),Xe=null),io&&(io.stopAllAction(),io=null),It.currentTime=0}let Ks=null,Do=null;function Ui(a,e,t,o,n){new Ye().load("./models/mayan-temple.glb",s=>{Ks=s.scene;const l=mo(Ks);if(l.scale.setScalar(5.6),l.position.set(.684,-1.82,.14),l.rotation.y=Math.PI*.1,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(l),e){const d=[new at(-4.68,0,-4.68),new at(4.68,0,-4.68),new at(4.68,0,4.68),new at(-4.68,0,4.68),new at(-1.64,3.69,-1.64),new at(1.64,3.69,-1.64),new at(1.64,3.69,1.64),new at(-1.64,3.69,1.64)],h=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]],p=new ml({vertices:d,faces:h}),m=1.2,g=.8,v=1.2,S=new pl(new at(m,g,v));Do=new Da({mass:0,material:t}),Do.addShape(p);const T=new at(0,3.69+g,0);Do.addShape(S,T),Do.position.set(l.position.x,l.position.y+3.69-5.98,l.position.z),Do.quaternion.setFromEuler(0,l.rotation.y,0),e.addBody(Do)}},void 0,s=>{console.error("Error loading Mayan-temple model:",s)})}const At={center:{x:0,y:-6.5,z:0},radius:18,speed:.08,currentTime:0};function Qn(a){const e=At.center.x+At.radius*Math.cos(a),t=At.center.z+At.radius*Math.sin(a),o=At.center.y;return{x:e,y:o,z:t}}let Pt=null,Va=null;function Xi(a,e,t){new Ye().load("./models/whale_shark.glb",n=>{Pt=n.scene;const i=Qn(0);Pt.position.set(i.x,i.y,i.z),Pt.scale.set(.58,.58,.58),Pt.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),a.add(Pt),n.animations&&n.animations.length>0&&(Va=new We(Pt),n.animations.forEach(s=>{Va.clipAction(s).play()}))},void 0,n=>{console.error("Error loading whale shark model:",n)})}function Wc(a){if(!Pt)return;Va&&Va.update(a),At.currentTime+=a*At.speed;const e=Qn(At.currentTime),t=Qn(At.currentTime+.05),o=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Pt.position.set(e.x,e.y,e.z);const n=Math.atan2(o.x,o.z);Pt.rotation.y=n-Math.PI/2}let Ut=null,Ua=null,$s=0;function Gi(a,e,t){new Ye().load("./models/seagulls-spiral.glb",n=>{Ut=n.scene,Ut.position.set(0,5.6,0),Ut.scale.set(.142,.142,.142),Ut.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!1)}),a.add(Ut),n.animations&&n.animations.length>0&&(Ua=new We(Ut),n.animations.forEach(i=>{const s=Ua.clipAction(i);s.timeScale=.65,s.play()}))},void 0,n=>{console.error("Error loading seagulls model:",n)})}function Vc(a){if(!Ut)return;Ua&&Ua.update(a),$s+=a;const o=Math.sin($s*.24)*1.5;Ut.position.y=8+o}const Xa=[];let ji={};const Uc=-10,Xc=2.5,Gc=4,jc={separationDistance:.8,separationForce:.8,alignmentDistance:2,alignmentForce:.3,cohesionDistance:3,cohesionForce:.2,maxSpeed:2,minSpeed:.5,maxForce:.05,avoidanceDistance:5,containmentRadius:20,containmentForce:.3,swimDepth:-3,depthVariation:1.5,wanderStrength:.02,damping:.98};function Ga(a,e,t,o){const n=new Ye,i={modelPath:e.modelPath,count:e.count||20,spawnArea:e.spawnArea||{centerX:0,centerZ:0,radiusX:15,radiusZ:15},behavior:{...jc,...e.behavior||{}},scale:e.scale||{min:.15,max:.25},waterLevel:e.waterLevel||-1.814,levels:e.levels||[1],fish:[],mixers:[],isHiding:!1,hideProgress:0};n.load(e.modelPath,s=>{const l=s.scene,r=s.animations;ji[e.modelPath]=l,i.waterLevel=e.waterLevel;for(let u=0;u<i.count;u++){const c=mo(l),d=ae.randFloat(i.scale.min,i.scale.max);c.scale.setScalar(d);const h=i.spawnArea.centerX+ae.randFloatSpread(i.spawnArea.radiusX),p=i.spawnArea.centerZ+ae.randFloatSpread(i.spawnArea.radiusZ),m=i.behavior.swimDepth+ae.randFloatSpread(i.behavior.depthVariation);c.position.set(h,m,p);const g=Math.random()*Math.PI*2,v=ae.randFloat(i.behavior.minSpeed,i.behavior.maxSpeed);c.userData.velocity=new w(Math.cos(g)*v,0,Math.sin(g)*v),c.userData.acceleration=new w(0,0,0),c.userData.wanderAngle=Math.random()*Math.PI*2,c.userData.originalPosition=new w(h,m,p);const S=Math.random()*Math.PI*2,T=Math.random()*Xc;if(c.userData.hideTarget=new w(Math.cos(S)*T,Uc,Math.sin(S)*T),c.traverse(y=>{y.isMesh&&(y.castShadow=!0,y.receiveShadow=!1)}),a.add(c),i.fish.push(c),r.length>0){const y=new We(c);r.forEach(b=>{y.clipAction(b).startAt(Math.random()*b.duration).play()}),i.mixers.push(y)}}Xa.push(i),t&&t(i)},void 0,s=>{console.error("Error loading fish model:",e.modelPath,s)})}function Eo(a,e,t){e.clampLength(0,t),a.userData.acceleration.add(e)}const Ce=new w,ht=new w;function Zc(a,e,t){const o=new w;let n=0;const i=t.separationDistance*t.separationDistance;for(let s=0;s<e.length;s++){const l=e[s];if(l===a)continue;const r=a.position.x-l.position.x,u=a.position.y-l.position.y,c=a.position.z-l.position.z,d=r*r+u*u+c*c;if(d>.001&&d<i){const h=Math.sqrt(d);Ce.set(r,u,c),Ce.normalize(),Ce.divideScalar(h),o.add(Ce),n++}}return n>0&&(o.divideScalar(n),o.normalize(),o.multiplyScalar(t.maxSpeed),o.sub(a.userData.velocity),o.multiplyScalar(t.separationForce)),o}function qc(a,e,t){const o=new w;let n=0;const i=t.alignmentDistance*t.alignmentDistance;for(let s=0;s<e.length;s++){const l=e[s];if(l===a)continue;const r=a.position.x-l.position.x,u=a.position.y-l.position.y,c=a.position.z-l.position.z,d=r*r+u*u+c*c;d>.001&&d<i&&(o.add(l.userData.velocity),n++)}return n>0?(o.divideScalar(n),o.normalize(),o.multiplyScalar(t.maxSpeed),ht.subVectors(o,a.userData.velocity),ht.multiplyScalar(t.alignmentForce),ht.clone()):o}function Yc(a,e,t){const o=new w;let n=0;const i=t.cohesionDistance*t.cohesionDistance;for(let s=0;s<e.length;s++){const l=e[s];if(l===a)continue;const r=a.position.x-l.position.x,u=a.position.y-l.position.y,c=a.position.z-l.position.z,d=r*r+u*u+c*c;d>.001&&d<i&&(o.add(l.position),n++)}return n>0?(o.divideScalar(n),Ce.subVectors(o,a.position),Ce.normalize(),Ce.multiplyScalar(t.maxSpeed),ht.subVectors(Ce,a.userData.velocity),ht.multiplyScalar(t.cohesionForce),ht.clone()):o}function Kc(a,e){const t=new w,o=Math.sqrt(a.position.x*a.position.x+a.position.z*a.position.z);if(o<e.avoidanceDistance){t.set(a.position.x,0,a.position.z),t.normalize(),t.multiplyScalar(e.maxSpeed),t.sub(a.userData.velocity);const n=1-o/e.avoidanceDistance;t.multiplyScalar(n*1.5)}return t}function $c(a,e,t){const o=new w,n=a.position.x-e.centerX,i=a.position.z-e.centerZ,s=Math.sqrt(n*n+i*i);if(s>t.containmentRadius){o.set(-n,0,-i),o.normalize(),o.multiplyScalar(t.maxSpeed),o.sub(a.userData.velocity);const l=s-t.containmentRadius,r=Math.min(l/10,1);o.multiplyScalar(r*t.containmentForce)}return o}function Jc(a,e,t){a.userData.wanderAngle+=ae.randFloatSpread(.2)*t;const o=new w(Math.cos(a.userData.wanderAngle),Math.sin(a.userData.wanderAngle*.3)*.2,Math.sin(a.userData.wanderAngle));return o.multiplyScalar(e.wanderStrength),o}let Js=0;function Qc(a,e=!1){const t=Math.min(a,.1);Xa.forEach(o=>{const n=o.behavior;if(e&&!o.isHiding?(o.isHiding=!0,console.log("🐟 Fish detected storm, preparing to hide...")):!e&&o.isHiding&&o.hideProgress>=.9&&(o.isHiding=!1,console.log("🐟 Storm over, fish returning...")),o.isHiding?o.hideProgress=Math.min(1,o.hideProgress+t*.7):o.hideProgress=Math.max(0,o.hideProgress-t*.15),o.hideProgress>=.7&&o.isHiding){o.fish[0]&&o.fish[0].visible&&o.fish.forEach(s=>{s.visible=!1});return}o.hideProgress<.7&&o.fish[0]&&!o.fish[0].visible&&o.fish.forEach(s=>{s.visible=!0}),Js++;const i=Js%2===0;o.fish.forEach((s,l)=>{if(o.hideProgress>.05&&o.isHiding){if(Ce.copy(s.userData.hideTarget).sub(s.position),Ce.length()>.1){const g=Ce.x,v=Ce.z,S=Ce.y;Ce.normalize().multiplyScalar(Gc*t),s.position.add(Ce);let y=Math.atan2(g,v)-s.rotation.y;y>Math.PI&&(y-=Math.PI*2),y<-Math.PI&&(y+=Math.PI*2),s.rotation.y+=y*.15,s.rotation.x=-S*.3}o.mixers[l]&&o.mixers[l].update(t*.5);return}if(!o.isHiding&&o.hideProgress>0&&o.hideProgress<.2){const m=new w(o.spawnArea.centerX-s.position.x,n.swimDepth-s.position.y,o.spawnArea.centerZ-s.position.z);m.normalize().multiplyScalar(n.maxSpeed*.5),s.userData.velocity.copy(m)}if(i){s.userData.acceleration.set(0,0,0);const m=Zc(s,o.fish,n),g=qc(s,o.fish,n),v=Yc(s,o.fish,n),S=Kc(s,n),T=$c(s,o.spawnArea,n),y=Jc(s,n,t);Eo(s,m,n.maxForce*1.5),Eo(s,g,n.maxForce),Eo(s,v,n.maxForce),Eo(s,S,n.maxForce*2),Eo(s,T,n.maxForce*3),Eo(s,y,n.maxForce*.3)}if(i){s.userData.velocity.add(s.userData.acceleration),s.userData.velocity.multiplyScalar(n.damping);const m=s.userData.velocity.length();m>n.maxSpeed?s.userData.velocity.normalize().multiplyScalar(n.maxSpeed):m<n.minSpeed&&s.userData.velocity.normalize().multiplyScalar(n.minSpeed)}Ce.copy(s.userData.velocity).multiplyScalar(t),s.position.add(Ce);const r=o.waterLevel||-1.814,u=.3;s.position.y>r-u&&(s.position.y=r-u,s.userData.velocity.y=Math.min(0,s.userData.velocity.y));const d=n.swimDepth-s.position.y;if(Math.abs(d)/(n.depthVariation*2)>.04&&(s.userData.velocity.y+=d*.01*t*60),s.userData.velocity.lengthSq()>.01){ht.copy(s.userData.velocity).normalize();let g=Math.atan2(ht.x,ht.z)-s.rotation.y;g>Math.PI&&(g-=Math.PI*2),g<-Math.PI&&(g+=Math.PI*2),s.rotation.y+=g*.1;const v=-ht.y*.25;s.rotation.x+=(v-s.rotation.x)*.1}o.mixers[l]&&o.mixers[l].update(t)})})}function eu(a){Xa.forEach(e=>{e.fish.forEach(t=>{a.remove(t),t.traverse(o=>{o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(n=>n.dispose()):o.material.dispose())})}),e.mixers.forEach(t=>t.stopAllAction())}),Xa.length=0,ji={}}let ye=null,ro=null;const ja=new hn([new w(45,-12,30),new w(30,-14,50),new w(0,-15,60),new w(-30,-14,50),new w(-50,-12,20),new w(-55,-10,-10),new w(-45,-9,-35),new w(-20,-8,-45),new w(45,-12,30)],!0,"centripetal",.5),tu=.035;ja.getLength();let se={isBreaching:!1,timeSinceLastBreach:0,breachProgress:0,nextBreachTime:15+Math.random()*20,breachDuration:3.5,breachStartProgress:0,targetBreachHeight:2.25};function Zi(a,e,t){new Ye().load("./models/sail-fish.glb",n=>{ye=n.scene;const i=ja.getPointAt(0);ye.position.copy(i),ye.scale.set(1.23,1.23,1.23),ye.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),a.add(ye),n.animations&&n.animations.length>0&&(ro=new We(ye),n.animations.forEach(s=>{ro.clipAction(s).play()})),n.scene,se.timeSinceLastBreach=0,se.isBreaching=!1,se.nextBreachTime=15+Math.random()*20},void 0,n=>{console.error("Error loading sailfish model:",n)})}function ou(a){if(!ye)return;se.isBreaching||(se.timeSinceLastBreach+=a,se.timeSinceLastBreach>=se.nextBreachTime&&(se.isBreaching=!0,se.breachProgress=0,se.breachStartProgress=ye.userData.pathProgress||0,se.timeSinceLastBreach=0,se.nextBreachTime=15+Math.random()*20)),se.isBreaching&&(se.breachProgress+=a/se.breachDuration,se.breachProgress>=1&&(se.isBreaching=!1,se.breachProgress=0)),ye.userData.pathProgress||(ye.userData.pathProgress=0),ye.userData.pathProgress+=tu*a,ye.userData.pathProgress%=1;const e=ja.getPointAt(ye.userData.pathProgress);let t=0;se.isBreaching&&(t=Math.sin(se.breachProgress*Math.PI)*(se.targetBreachHeight-e.y)),ye.position.set(e.x,e.y+t,e.z);const o=(ye.userData.pathProgress+.02)%1,n=ja.getPointAt(o),i=new w().subVectors(n,e).normalize();if(se.isBreaching){const l=Math.cos(se.breachProgress*Math.PI);i.y+=l*.5,i.normalize()}const s=ye.position.clone().add(i);ye.lookAt(s),ro&&ro.update(a)}function au(a){ye&&(a.remove(ye),ye.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),ye=null),ro&&(ro.stopAllAction(),ro=null),se={isBreaching:!1,timeSinceLastBreach:0,breachProgress:0,nextBreachTime:15+Math.random()*20,breachDuration:3.5,breachStartProgress:0,breachStartY:0,targetBreachHeight:2.5}}const pn=new st({uniforms:{uTime:{value:0}},transparent:!0,side:rt,depthWrite:!1,vertexShader:`
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;

    void main() {
      vec3 pos = position;
      vPos = pos;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,fragmentShader:`
    uniform float uTime;
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(vec3(5.0, 10.0, 5.0));

      // Calculate depth - how far from center to surface
      float distFromCenter = length(vPos);

      // View-dependent depth (simulates thickness)
      float viewAngle = abs(dot(viewDir, normal));
      float thickness = (1.0 - viewAngle) * 2.0;

      // Fresnel effect for rim glow
      float fresnel = pow(1.0 - viewAngle, 3.0);

      // Richer color palette with more saturation
      vec3 deepCore = vec3(0.05, 0.2, 0.8);
      vec3 coreColor = vec3(0.2, 0.5, 1.0);
      vec3 midColor = vec3(0.3, 0.7, 1.0);
      vec3 brightColor = vec3(0.5, 0.85, 1.0);
      vec3 glowColor = vec3(0.7, 0.95, 1.0);

      // Depth-based color
      float depthFactor = smoothstep(0.0, 1.0, distFromCenter);
      vec3 baseColor = mix(deepCore, coreColor, depthFactor);
      baseColor = mix(baseColor, midColor, pow(depthFactor, 0.7));

      // Add thickness/depth coloring
      vec3 color = mix(baseColor, brightColor, thickness * 0.3);

      // Diffuse lighting
      float diffuse = max(dot(normal, lightDir), 0.0) * 0.6 + 0.4;
      color *= diffuse;

      // Subsurface scattering
      float backLight = max(dot(normal, -lightDir), 0.0);
      float subsurface = pow(backLight, 2.0) * thickness;
      vec3 transmittedColor = vec3(0.4, 0.7, 1.0);
      color += transmittedColor * subsurface * 0.8;

      // Specular highlight
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 25.0);
      color += glowColor * spec * 0.6;

      // Strong rim lighting for volume
      color += brightColor * fresnel * 0.5;

      // Internal glow from center
      float centerGlow = pow(1.0 - depthFactor, 2.5);
      color += coreColor * centerGlow * 0.4;

      // Depth-based alpha for volume effect
      float alpha = 0.42 + thickness * 0.2 + fresnel * 0.15;

      gl_FragColor = vec4(color, alpha);
    }
  `}),Bo=[];let gn=0;const vn={cache:new Map,get(a){const e=Math.round(a*100)/100;if(!this.cache.has(e)){let t;e<.15?t=16:e<.25?t=24:e<.4?t=32:t=48,this.cache.set(e,new bs(e,t,t))}return this.cache.get(e)},dispose(){this.cache.forEach(a=>a.dispose()),this.cache.clear()}},te={enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:12,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.5,fadeInDuration:2800,fadeOutDuration:2800};function qi(a){Object.assign(te,a),console.log("Spawn config updated for level:",te)}function nu(a,e,t){return function(n,i){const s=te.minRadius+Math.random()*(te.maxRadius-te.minRadius),l=new we(vn.get(s),pn);l.position.set(n,te.spawnHeight,i),l.castShadow=!0,l.receiveShadow=!0,l.renderOrder=3,a.add(l);const r=new fn(s),u=s*s*s*30.5,c=new Da({mass:u,material:t,linearDamping:.3,angularDamping:.3});c.addShape(r),c.position.set(n,te.spawnHeight,i),e.addBody(c),gn+=u;const d={mesh:l,body:c,radius:s,active:!0,hasSpawnedRipple:!1};return Bo.push(d),d}}function su(a){pn.uniforms.uTime.value+=a}function Aa(){return gn}function Yi(a){gn+=a}function iu(){gn=0}const Ps=new Audio("./sounds/tropical-island-waves.mp3");Ps.loop=!0;Ps.volume=.45;let Ki=!1,vt=!1;const es=[new Audio("./sounds/stone-debris.wav"),new Audio("./sounds/stones-falling-down.wav"),new Audio("./sounds/stones-short-debris.wav")];es.forEach(a=>{a.volume=.3});let Xt=null,Za=!1;const ga=new Audio("./sounds/correct-answer.wav");ga.volume=.4;const va=new Audio("./sounds/winning-chimes.wav");va.volume=.5;const Ve={small:new Audio("./sounds/water-drip-small.wav"),medium:new Audio("./sounds/water-drop.mp3"),large:new Audio("./sounds/water-drip-large.wav"),bubble:new Audio("./sounds/water-bubble.wav")};Ve.small.volume=.4;Ve.medium.volume=.5;Ve.large.volume=.6;Ve.bubble.volume=.3;const qa=new Audio("./sounds/drizzle.mp3");qa.loop=!0;qa.volume=.45;let ya=[];const ts=new Audio("./sounds/woosh.wav");ts.volume=.5;const Te=new Audio("./sounds/jungle-day.mp3");Te.loop=!0;Te.volume=0;let He=null;function Wo(){return Ps}function _s(){return Ki}function Ya(a){Ki=a}function $i(){return vt}function Qs(a){vt=a}function ru(a){if(vt)return;const e=[],t=Math.random();if(a<.8)t<.5?e.push(Ve.small):t<.8?e.push(Ve.medium):e.push(Ve.bubble);else if(a<1.3)t<.4?e.push(Ve.medium):t<.8?e.push(Ve.large):e.push(Ve.bubble);else if(t<.6?e.push(Ve.large):e.push(Ve.bubble),t>.7){const i=Ve.medium.cloneNode();i.volume=.3,i.currentTime=0,i.play().catch(s=>console.log("Water splash extra sound failed:",s))}const o=e[0],n=o.cloneNode();n.volume=o.volume,n.currentTime=0,n.playbackRate=.9+Math.random()*.2,n.play().catch(i=>console.log("Water splash sound failed:",i))}function Ji(){if(vt)return;const a=Math.floor(Math.random()*es.length);Xt=es[a],Xt.currentTime=0,Xt.play().catch(e=>console.log("Sculpt sound failed:",e)),Xt.onended=()=>{Za&&!vt&&Ji()}}function lu(){Xt&&(Xt.pause(),Xt.onended=null,Xt=null)}function Qi(){Za||(Za=!0,Ji())}function yn(){Za=!1,lu()}function cu(){vt||(ga.currentTime=0,ga.play().catch(a=>console.log("Quick-lock sound failed:",a)))}function uu(){vt||(va.currentTime=0,va.play().catch(a=>console.log("Winning chimes sound failed:",a)))}function du(){vt||(ts.currentTime=0,ts.play().catch(a=>console.log("Woosh sound failed:",a)))}function er(){if(vt)return null;const a=qa.cloneNode();return a.volume=qa.volume,a.loop=!0,a.play().catch(e=>console.log("Drizzle sound failed:",e)),ya.push(a),a}function tr(a){if(!a)return;const e=setInterval(()=>{if(a.volume>.05)a.volume=Math.max(0,a.volume-.05);else{a.pause(),a.currentTime=0,clearInterval(e);const t=ya.indexOf(a);t>-1&&ya.splice(t,1)}},50)}function hu(){if(vt)return;He&&(clearInterval(He),He=null),Te.currentTime=0,Te.volume=0,Te.play().catch(i=>console.log("Jungle day sound failed:",i));const a=.5,e=2e3,t=40,o=e/t,n=a/t;He=setInterval(()=>{Te.volume<a-n?Te.volume=Math.min(a,Te.volume+n):(Te.volume=a,clearInterval(He),He=null)},o)}function fu(){He&&(clearInterval(He),He=null);const a=1500,e=30,t=a/e,n=Te.volume/e;He=setInterval(()=>{Te.volume>n?Te.volume=Math.max(0,Te.volume-n):(Te.volume=0,Te.pause(),Te.currentTime=0,clearInterval(He),He=null)},t)}function As(){yn(),ga.pause(),ga.currentTime=0,va.pause(),va.currentTime=0,ya.forEach(a=>{a.pause(),a.currentTime=0}),ya=[],He&&(clearInterval(He),He=null),Te.pause(),Te.currentTime=0,Te.volume=0}function ei(){return Te}const f={startDelay:8500,duration:14800,dropInterval:180,ballsDropped:0,isActive:!1,startTime:0,steadyStateReached:!1,steadyStateValues:null,cloudUpdateFrameCounter:0,startTimeoutId:null,dropIntervalId:null,isPaused:!1,pauseTimeoutRemaining:0,pauseTime:0,stormScheduledTime:0};function Ka(a,e=!0){const{scene:t,world:o,ballMaterial:n,randomTerrainPosition:i,createCloudIndicator:s,sharedCloudTexture:l,sky:r,renderer:u,water:c}=a,d=45;f.stormScheduledTime=Date.now(),f.startTimeoutId=setTimeout(()=>{f.isActive=!0,f.startTime=Date.now(),f.ballsDropped=0;const h=i(),p=s({startX:h.x,startZ:h.z,endX:h.x,endZ:h.z,cloudTexture:l,rainCount:50,cloudHeight:31.88}),m=p.userData.cloud,g=p.userData.cloudMaterial;m.scale.set(125,32,128),m.rotation.y=Math.random()*Math.PI*2;const v=.22,S=.344;g.uniforms.base.value.setRGB(121/255*.5,138/255*.55,160/255*.65),g.uniforms.threshold.value=S,m.renderOrder=10,t.add(p);const T=er();p.userData.drizzleSound=T,f.cloudData={group:p,startTime:Date.now(),rotationSpeed:.0013,baseOpacity:v},f.originalSkyValues={turbidity:r.material.uniforms.turbidity.value,rayleigh:r.material.uniforms.rayleigh.value,mieCoefficient:r.material.uniforms.mieCoefficient.value,exposure:u.toneMappingExposure},f.originalWaterValues={heightMultiplier:c.material.uniforms.uWaveHeightMultiplier.value,amplitude:c.material.uniforms.uWaveAmplitude.value,waterLevel:c.mesh.position.y},f.originalHemisphereColors={deepColor:c.hemisphereMesh.material.uniforms.uDeepColor.value.clone(),shallowColor:c.hemisphereMesh.material.uniforms.uShallowColor.value.clone()},f.water=c;const y=new Audio("sounds/thunderstorm.mp3");f.thunderSound=y,f.lightningTriggered=!1,f.lightningStarted=!1;const b=document.createElement("div");b.id="lightning-flash",b.style.position="fixed",b.style.top="0",b.style.left="0",b.style.width="100%",b.style.height="100%",b.style.backgroundColor="white",b.style.opacity="0",b.style.pointerEvents="none",b.style.zIndex="1000",document.body.appendChild(b),f.lightningFlash=b,f.dropIntervalId=setInterval(()=>{if(f.ballsDropped>=d){clearInterval(f.dropIntervalId),f.dropIntervalId=null;return}const M=i(),C=.12+Math.random()*.1,I=new we(vn.get(C),pn);I.position.set(M.x,te.spawnHeight,M.z),I.castShadow=!0,I.receiveShadow=!1,I.renderOrder=3,t.add(I);const A=new fn(C),H=C*C*C,L=new Da({mass:H,material:n,linearDamping:0,angularDamping:0});L.addShape(A),L.position.set(M.x,te.spawnHeight,M.z),o.addBody(L),e&&Yi(H),Bo.push({mesh:I,body:L,radius:C,active:!0,hasSpawnedRipple:!1}),f.ballsDropped++},f.dropInterval)},f.startDelay)}function ti(a,e){if(!f.lightningTriggered&&a>2500&&a<3500){f.lightningStarted||(f.lightningStarted=!0,f.lightningStartTime=e,f.thunderSound&&!$i()&&(f.thunderSound.currentTime=0,f.thunderSound.play().catch(n=>console.log("Thunder audio failed:",n))));const t=e-f.lightningStartTime;let o=0;return t<80?o=.9*(1-t/80):t>=180&&t<280?o=.85*(1-(t-180)/100):t>=280&&(f.lightningTriggered=!0,o=0),f.lightningFlash&&(f.lightningFlash.style.opacity=o.toString()),!0}return!1}function or(){if(f.lightningFlash){const a=document.getElementById("lightning-flash");a&&document.body.removeChild(a),f.lightningFlash=null}}function mu(){if(!f.isPaused){if(f.isPaused=!0,f.pauseTime=Date.now(),f.startTimeoutId!==null&&!f.isActive){const a=Date.now()-f.stormScheduledTime;f.pauseTimeoutRemaining=Math.max(0,f.startDelay-a),clearTimeout(f.startTimeoutId),f.startTimeoutId=null}f.dropIntervalId!==null&&(clearInterval(f.dropIntervalId),f.dropIntervalId=null)}}function pu(a,e){if(!f.isPaused)return;const t=Date.now()-f.pauseTime;if(f.isPaused=!1,f.startTime>0&&(f.startTime+=t),f.cloudData&&f.cloudData.startTime>0&&(f.cloudData.startTime+=t),f.lightningStartTime>0&&(f.lightningStartTime+=t),f.stormScheduledTime>0&&(f.stormScheduledTime+=t),f.pauseTimeoutRemaining>0&&!f.isActive&&(f.startTimeoutId=setTimeout(()=>{f.startTimeoutId=null,f.pauseTimeoutRemaining=0,Ka(a,e)},f.pauseTimeoutRemaining)),f.isActive&&f.ballsDropped<45){const{scene:o,world:n,ballMaterial:i,randomTerrainPosition:s}=a,l=45;f.dropIntervalId=setInterval(()=>{if(f.ballsDropped>=l){clearInterval(f.dropIntervalId),f.dropIntervalId=null;return}const r=s(),u=.12+Math.random()*.1,c=new we(vn.get(u),pn);c.position.set(r.x,te.spawnHeight,r.z),c.castShadow=!0,c.receiveShadow=!1,c.renderOrder=3,o.add(c);const d=new fn(u),h=u*u*u,p=new Da({mass:h,material:i,linearDamping:0,angularDamping:0});p.addShape(d),p.position.set(r.x,te.spawnHeight,r.z),n.addBody(p),Yi(h),Bo.push({mesh:c,body:p,radius:u,active:!0,hasSpawnedRipple:!1}),f.ballsDropped++},f.dropInterval)}}function gu(){f.isActive=!1,f.ballsDropped=0,f.startTime=0,f.lightningTriggered=!1,f.lightningStarted=!1,f.steadyStateReached=!1,f.steadyStateValues=null,f.cloudUpdateFrameCounter=0,f.startTimeoutId!==null&&(clearTimeout(f.startTimeoutId),f.startTimeoutId=null),f.dropIntervalId!==null&&(clearInterval(f.dropIntervalId),f.dropIntervalId=null),f.thunderSound&&(f.thunderSound.pause(),f.thunderSound.currentTime=0),or(),delete f.originalSkyValues,f.originalWaterValues&&f.water&&(f.water.setWaveChoppiness(f.originalWaterValues.heightMultiplier,f.originalWaterValues.amplitude),f.water.mesh.position.y=f.originalWaterValues.waterLevel),f.originalHemisphereColors&&f.water&&(f.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(f.originalHemisphereColors.deepColor),f.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(f.originalHemisphereColors.shallowColor)),delete f.originalWaterValues,delete f.originalHemisphereColors,delete f.water}function vu(a){const{gameStarted:e,scene:t,camera:o,dt:n,sky:i,renderer:s,updateCloud:l,updateRainParticles:r,setRainOpacity:u}=a;if(!e||!f.isActive||!f.cloudData)return!1;const c=Date.now(),d=c-f.startTime,h=f.cloudData,p=c-h.startTime,{cloud:m,cloudMaterial:g}=h.group.userData;m.visible||(m.visible=!0),f.cloudUpdateFrameCounter++,f.cloudUpdateFrameCounter>=1.22&&(l(h.group,o,n),f.cloudUpdateFrameCounter=0),m.rotation.y+=h.rotationSpeed;const v=4e3,S=3800,T=f.duration-2500,y=f.duration-2e3,b=d<S,M=d>y,C=!b&&!M;let I=h.baseOpacity;if(p<v){const A=p/v,H=A*A*A;I*=H}else if(d>T){const A=(d-(f.duration-1500))/1500;I*=Math.max(0,1-A)}if(g.uniforms.opacity.value=Math.max(0,I),C&&f.steadyStateReached)return r(h.group,n),u(h.group,I*.6),d>=2500&&d<=3500&&ti(d,c),!0;if(f.originalSkyValues){ti(d,c);const A=0,H=.025,L=.01,W=.53;if(b){const de=d/S,Y=de*de;i.material.uniforms.turbidity.value=f.originalSkyValues.turbidity+(A-f.originalSkyValues.turbidity)*Y,i.material.uniforms.rayleigh.value=f.originalSkyValues.rayleigh+(H-f.originalSkyValues.rayleigh)*Y,i.material.uniforms.mieCoefficient.value=f.originalSkyValues.mieCoefficient+(L-f.originalSkyValues.mieCoefficient)*Y,s.toneMappingExposure=f.originalSkyValues.exposure+(W-f.originalSkyValues.exposure)*Y}else if(M){const de=(d-y)/2e3,Y=1-Math.pow(1-de,2),K=f.originalSkyValues.turbidity+(A-f.originalSkyValues.turbidity)*(1-Y),ze=f.originalSkyValues.rayleigh+(H-f.originalSkyValues.rayleigh)*(1-Y),re=f.originalSkyValues.mieCoefficient+(L-f.originalSkyValues.mieCoefficient)*(1-Y),he=f.originalSkyValues.exposure+(W-f.originalSkyValues.exposure)*(1-Y);i.material.uniforms.turbidity.value=K,i.material.uniforms.rayleigh.value=ze,i.material.uniforms.mieCoefficient.value=re,s.toneMappingExposure=he}else f.steadyStateReached||(f.steadyStateReached=!0,i.material.uniforms.turbidity.value=A,i.material.uniforms.rayleigh.value=H,i.material.uniforms.mieCoefficient.value=L,s.toneMappingExposure=W)}if(f.originalHemisphereColors&&f.water){const A=new ie(4128),H=new ie(2245717);if(b){const L=d/S,W=L*L;f.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(f.originalHemisphereColors.deepColor,A,W),f.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(f.originalHemisphereColors.shallowColor,H,W)}else if(M){const L=(d-y)/2e3,W=1-Math.pow(1-L,2);f.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(A,f.originalHemisphereColors.deepColor,W),f.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(H,f.originalHemisphereColors.shallowColor,W)}else f.steadyStateReached||(f.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(A),f.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(H))}if(f.originalWaterValues&&f.water){const H=f.duration-y,L=11.125,W=.55,de=.96;if(b){const Y=Math.min(d/3e3,1),K=Y*Y,ze=f.originalWaterValues.heightMultiplier+(L-f.originalWaterValues.heightMultiplier)*K,re=f.originalWaterValues.amplitude+(W-f.originalWaterValues.amplitude)*K,he=f.originalWaterValues.waterLevel-de*K;f.water.mesh.position.y=he,f.water.setWaveChoppiness(ze,re)}else if(M){const Y=Math.min((d-y)/H,1),K=1-Math.pow(1-Y,2),ze=L+(f.originalWaterValues.heightMultiplier-L)*K,re=W+(f.originalWaterValues.amplitude-W)*K,he=f.originalWaterValues.waterLevel-de+de*K;f.water.mesh.position.y=he,f.water.setWaveChoppiness(ze,re)}else if(!f.steadyStateReached){const Y=f.originalWaterValues.waterLevel-de;f.water.mesh.position.y=Y,f.water.setWaveChoppiness(L,W)}}return r(h.group,n),u(h.group,I*.6),d>f.duration?(f.isActive=!1,h.group&&(h.group.userData.drizzleSound&&tr(h.group.userData.drizzleSound),t.remove(h.group),h.group.traverse(A=>{A.geometry&&A.geometry.dispose(),A.material&&A.material.dispose()})),f.cloudData=null,f.originalSkyValues&&(i.material.uniforms.turbidity.value=f.originalSkyValues.turbidity,i.material.uniforms.rayleigh.value=f.originalSkyValues.rayleigh,i.material.uniforms.mieCoefficient.value=f.originalSkyValues.mieCoefficient,s.toneMappingExposure=f.originalSkyValues.exposure,f.originalSkyValues=null),f.originalWaterValues&&f.water&&(f.water.setWaveChoppiness(f.originalWaterValues.heightMultiplier,f.originalWaterValues.amplitude),f.water.mesh.position.y=f.originalWaterValues.waterLevel,f.originalWaterValues=null),f.originalHemisphereColors&&f.water&&(f.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(f.originalHemisphereColors.deepColor),f.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(f.originalHemisphereColors.shallowColor),f.originalHemisphereColors=null,f.water=null),or(),!1):!0}const $a=[{id:1,name:"Desert Isle Revival",description:"A gentle introduction to island restoration",story:"Nothing stirred but heat and the sea",terrainShape:{size:14,scaleX:1,scaleY:1,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:1,distortion:{frequency:0,amplitude:0,randomness:0}},waterLevel:-1.747,winPercentage:.32,spawn:{enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:16,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.45,fadeInDuration:2800,fadeOutDuration:2800},difficulty:1,rewards:{stars:3,points:1e3}},{id:2,name:"Sun-Scored Sands",description:"The water comes faster now",story:"The islands held their arid breath",terrainShape:{size:14.43,scaleX:1.24,scaleY:.82,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:.3,distortion:{frequency:.04,amplitude:.14,randomness:.032},turbulence:{strength:.465,scale:.1269,octaves:.98}},waterLevel:-2.07,winPercentage:.48,spawn:{enabled:!0,interval:6500,cloudDuration:5500,dropletsPerCloud:14,dropletInterval:380,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.8,fadeInDuration:2500,fadeOutDuration:2500},difficulty:2,rewards:{stars:3,points:1500}},{id:3,name:"Ancient Challenge",description:"Less water to work with",story:"Drops like fists bruised the dust",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:Math.PI/4,amount:1.4},bay:{angle:0,depth:0,width:0},irregularity:1.15},waterLevel:-2.385,winPercentage:.52,spawn:{enabled:!0,interval:6e3,cloudDuration:5e3,dropletsPerCloud:15,dropletInterval:350,minRadius:.1,maxRadius:.16,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:2300,fadeOutDuration:2300},difficulty:3,rewards:{stars:3,points:2e3}},{id:4,name:"Hollow Basin",description:"Every drop counts",story:"Stone refused to drink",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:0,amount:.103},bay:{angle:6,depth:2.2,width:Math.PI/2.5},irregularity:1.426,distortion:{frequency:.4444,amplitude:3.28,randomness:.218},turbulence:{strength:5.422,scale:.0032,octaves:.2642}},waterLevel:-2.02,winPercentage:.58,spawn:{enabled:!0,interval:5e3,cloudDuration:4500,dropletsPerCloud:16,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3.3,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:4,rewards:{stars:3,points:2500}},{id:5,name:"Drinking Stone",description:"The final test of water mastery",story:"Lips carved into land's edge",terrainShape:{size:15.62,scaleX:1.2,scaleY:.9,tilt:{angle:Math.PI/6,amount:.7},bay:{angle:Math.PI,depth:1.5,width:Math.PI/3},irregularity:2},waterLevel:-1.8,winPercentage:.42,spawn:{enabled:!0,interval:4500,cloudDuration:4e3,dropletsPerCloud:18,dropletInterval:300,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1800,fadeOutDuration:1800},difficulty:5,rewards:{stars:3,points:3e3}},{id:6,name:"Mirage Archipelago",description:"A fragmented paradise - precision is everything",story:"Storm turned to slow soaking swale",terrainShape:{size:14.83,scaleX:1.028,scaleY:.98,tilt:{angle:Math.PI/5.23,amount:.85*2.123},bay:{angle:Math.PI/2,depth:1.8,width:Math.PI/2.8},irregularity:2.27},waterLevel:-1.189,winPercentage:.58,spawn:{enabled:!0,interval:3800,cloudDuration:3500,dropletsPerCloud:22,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:6,rewards:{stars:3,points:4e3}},{id:7,name:"Vapor Crucible",description:"The sun steals water while you work",story:"The land tasted water and ground softened",terrainShape:{scaleX:1,scaleY:.96,tilt:{angle:Math.PI/4,amount:.29},bay:{angle:20,depth:-1,width:20},irregularity:2.8328,distortion:{frequency:.64,amplitude:.24,randomness:.2},turbulence:{strength:1.965,scale:.269,octaves:.98}},waterLevel:-3.66,winPercentage:.6,evaporationRate:.18,spawn:{enabled:!0,interval:7e3,cloudDuration:5e3,dropletsPerCloud:10,dropletInterval:500,minRadius:.11,maxRadius:.18,spawnHeight:10.2,cloudSpeed:2.2,fadeInDuration:3e3,fadeOutDuration:2e3},difficulty:7,rewards:{stars:3,points:4500}},{id:8,name:"Split-Decision Atoll",description:"Clouds divide the moment they reach the island",story:"Earth cupped the rain like a secret",terrainShape:{scaleX:1.3,scaleY:.89,tilt:{angle:0,amount:0},bay:{angle:Math.PI,depth:1.2,width:Math.PI/2},irregularity:2.63},waterLevel:.18,winPercentage:.53,spawn:{enabled:!0,interval:5500,cloudDuration:4e3,dropletsPerCloud:14,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:1800,fadeOutDuration:1800,splitClouds:!0,splitDelay:800},difficulty:8,rewards:{stars:3,points:5e3}},{id:9,name:"Glass Dunes",description:"Rolling hills of slippery crystal sand - drops race through valleys",story:"Droplets slipped beneath to find dark places, waiting",terrainShape:{size:14.63,islandRadius:6.42,scaleX:.91,scaleY:.91,tilt:{angle:Math.PI/6,amount:1.2},bay:{angle:Math.PI/3,depth:1.5,width:Math.PI/4},irregularity:.8,distortion:{frequency:1.3,amplitude:.6,randomness:.21}},waterLevel:-2.75,winPercentage:.7,terrainFriction:.12,spawn:{enabled:!0,interval:5e3,cloudDuration:4200,dropletsPerCloud:17,dropletInterval:280,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.4,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:9,rewards:{stars:3,points:5500}},{id:10,name:"Tide-Turned Throat",description:"A narrow channel that reverses flow every 20 s",story:"Roots respond to the aquifer's sigh",terrainShape:{scaleX:.62,scaleY:1.8,tilt:{angle:Math.PI/2,amount:.6},bay:{angle:Math.PI/2,depth:2.8,width:Math.PI/6},irregularity:1.2},waterLevel:-1.814,winPercentage:.56,tideCycle:2e4,tideForce:.4,spawn:{enabled:!0,interval:4800,cloudDuration:3800,dropletsPerCloud:19,dropletInterval:260,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.6,fadeInDuration:1700,fadeOutDuration:1700},difficulty:10,rewards:{stars:3,points:6e3}},{id:11,name:"Adrift",description:"lost at sea",story:"Emerald hues of past fortunes sprung",terrainShape:{scaleX:1.25,scaleY:.85,tilt:{angle:Math.PI/4,amount:1.1},bay:{angle:3*Math.PI/4,depth:1.4,width:Math.PI/3},irregularity:1.8,distortion:{frequency:22.2,amplitude:.31,randomness:.03}},waterLevel:-2.3,winPercentage:.66,spawn:{enabled:!0,interval:4300,cloudDuration:3600,dropletsPerCloud:20,dropletInterval:240,minRadius:.07,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.8,fadeInDuration:1600,fadeOutDuration:1600},difficulty:11,rewards:{stars:3,points:7e3}},{id:12,name:"Island Omega",description:"All previous twists combined—and the goal moves",story:"What you channel, you also become",terrainShape:{scaleX:1,scaleY:1,tilt:{angle:Math.PI/5,amount:.63},bay:{angle:Math.PI/3,depth:2,width:Math.PI/2.5*.23},irregularity:3.427,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:.22,scale:.32,octaves:.2642}},waterLevel:-2.1,winPercentage:.7,dynamicTarget:!0,targetCycle:15e3,evaporationRate:.12,splitClouds:!0,splitDelay:600,terrainFriction:.35,spawn:{enabled:!0,interval:3500,cloudDuration:3200,dropletsPerCloud:24,dropletInterval:200,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4.2,fadeInDuration:1400,fadeOutDuration:1400},difficulty:12,rewards:{stars:3,points:1e4}},{id:13,name:"Shattered Archipelago",description:"A scattered chain of islands—turbulence has broken the land",story:"The ocean returned what had been lost",terrainShape:{size:19.43,islandRadius:8.12,scaleX:1,scaleY:1,tilt:{angle:14,amount:.141},bay:{angle:0,depth:0,width:0},irregularity:1.82,distortion:{frequency:.048,amplitude:4.44,randomness:.15},turbulence:{strength:2.6965,scale:.369,octaves:1.98}},waterLevel:-2,winPercentage:.75,multipleTargets:2,spawn:{enabled:!0,interval:4200,cloudDuration:3800,dropletsPerCloud:18,dropletInterval:270,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1700,fadeOutDuration:1700},difficulty:13,rewards:{stars:3,points:12e3}},{id:14,name:"Jagged Atoll",description:"Craggy peaks rise from the depths—navigate the chaos",story:"Clouds pause, listening for song",terrainShape:{size:19.012,islandRadius:8.16,scaleX:1.12,scaleY:.965,tilt:{angle:52,amount:.68},bay:{angle:Math.PI/4,depth:1.2,width:Math.PI/3},irregularity:1.785,distortion:{frequency:.46,amplitude:.52,randomness:.22},turbulence:{strength:3.42,scale:.343,octaves:2.41}},waterLevel:-1.8,winPercentage:.74,multipleTargets:2,spawn:{enabled:!0,interval:3900,cloudDuration:3500,dropletsPerCloud:20,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.7,fadeInDuration:1600,fadeOutDuration:1600},difficulty:14,rewards:{stars:3,points:14e3}},{id:15,name:"Chaos Reef",description:"The ocean has shattered reality—only skill remains",story:"Rain resumes its ancient rhythm",terrainShape:{size:21.62,islandRadius:9.464,scaleX:.98,scaleY:1.02,tilt:{angle:68,amount:.242},bay:{angle:Math.PI/1.25,depth:2.11,width:Math.PI/12.2},irregularity:5.31,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:3.822,scale:.232,octaves:.642}},waterLevel:-1.5,winPercentage:.076,multipleTargets:3,spawn:{enabled:!0,interval:3600,cloudDuration:3200,dropletsPerCloud:22,dropletInterval:230,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:15,rewards:{stars:3,points:16e3}}];function Cs(a){return $a.find(e=>e.id===a)||$a[0]}function Ao(){return $a.length}const Is=Object.freeze(Object.defineProperty({__proto__:null,LEVELS:$a,getLevelById:Cs,getTotalLevels:Ao},Symbol.toStringTag,{value:"Module"})),ar={url:"https://bvbzhpcxrutiriqndcfy.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YnpocGN4cnV0aXJpcW5kY2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDM4MDIsImV4cCI6MjA3Nzc3OTgwMn0.vjforq20xOL5jTMbaAOgesSCl8UJj6fN03CevS5gc_A"};class yu{constructor(e,t){this.supabase=wl(e,t),this.STATS_CACHE_KEY="oasea_stats_cache"}async getAllScores(){try{const{data:e,error:t}=await this.supabase.from("scores").select("*").order("created_at",{ascending:!1});if(t)throw t;return e.map(o=>({id:o.id,levelId:o.level_id,playerName:o.player_name,basePoints:o.base_points,bonusPoints:o.bonus_points,timeBonus:o.time_bonus,totalScore:o.total_score,waterPercentage:parseFloat(o.water_percentage),completionTimeMs:o.completion_time_ms,timestamp:new Date(o.created_at).getTime(),date:o.date}))}catch(e){return console.error("Error fetching scores from Supabase:",e),[]}}async saveScore(e){try{const{error:t}=await this.supabase.from("scores").insert({player_name:e.playerName,level_id:e.levelId,base_points:e.basePoints,bonus_points:e.bonusPoints,time_bonus:e.timeBonus,total_score:e.totalScore,water_percentage:e.waterPercentage,completion_time_ms:e.completionTimeMs,date:e.date});if(t)throw t;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){throw console.error("Error saving score to Supabase:",t),t}}async getCachedStats(){const e=localStorage.getItem(this.STATS_CACHE_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_CACHE_KEY,JSON.stringify(e))}async clearScoresBefore(e){try{const t=new Date(e).toISOString().split("T")[0],{error:o}=await this.supabase.from("scores").delete().lt("date",t);if(o)throw o;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){console.error("Error clearing old scores:",t)}}async clearAllScores(){try{const{error:e}=await this.supabase.from("scores").delete().neq("id",0);if(e)throw e;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(e){console.error("Error clearing all scores:",e)}}}class wu{constructor(){this.SCORES_KEY="oasea_scores",this.STATS_KEY="oasea_stats"}async getAllScores(){const e=localStorage.getItem(this.SCORES_KEY);return e?JSON.parse(e):[]}async saveScore(e){const t=await this.getAllScores();t.push(e),localStorage.setItem(this.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.STATS_KEY)}async getCachedStats(){const e=localStorage.getItem(this.STATS_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_KEY,JSON.stringify(e))}async clearScoresBefore(e){const o=(await this.getAllScores()).filter(n=>n.timestamp>=e);localStorage.setItem(this.SCORES_KEY,JSON.stringify(o)),localStorage.removeItem(this.STATS_KEY)}async clearAllScores(){localStorage.removeItem(this.SCORES_KEY),localStorage.removeItem(this.STATS_KEY)}}class Ls{constructor(e=null){this.storage=e||new wu}calculateScore(e,t,o,n="",i=0){const s=Cs(e),l=s.rewards.points,r=this.calculateBonusPoints(s,t,l),u=this.calculateTimeBonus(s,o,l),c=l+r+u;return{levelId:e,playerName:n.trim(),basePoints:l,bonusPoints:r,timeBonus:u,totalScore:c,waterPercentage:t,completionTimeMs:o,terrainEdits:i,timestamp:Date.now(),date:this.getTodayDateString()}}calculateBonusPoints(e,t,o){const n=t-e.winPercentage;if(n<=0)return 0;const s=Math.floor(n*o*1.5);return Math.max(0,s)}calculateTimeBonus(e,t,o){const i=e.difficulty*9e4-t;if(i<=0)return 0;const s=Math.max(1,Math.floor(o/1e3)),r=Math.floor(i/1e3)*s;return Math.max(0,r)}async saveScore(e){await this.storage.saveScore(e)}async getTopScoresToday(e=10){const t=await this.storage.getAllScores(),o=this.getTodayDateString();return t.filter(n=>n.date===o).filter(n=>this.isValidScore(n)).sort((n,i)=>this.compareScores(n,i)).slice(0,e)}async getTopScoresAllTime(e=10){return(await this.storage.getAllScores()).filter(o=>this.isValidScore(o)).sort((o,n)=>this.compareScores(o,n)).slice(0,e)}async getTopScoresForLevel(e,t=10){return(await this.storage.getAllScores()).filter(n=>n.levelId===e).filter(n=>this.isValidScore(n)).sort((n,i)=>this.compareScores(n,i)).slice(0,t)}isValidScore(e){return e.waterPercentage>.01&&e.completionTimeMs>0&&e.totalScore>0}compareScores(e,t){const o=this.isValidScore(e),n=this.isValidScore(t);return o&&!n?-1:!o&&n?1:!o&&!n?0:t.totalScore-e.totalScore}async getLevelStats(e){const o=(await this.storage.getAllScores()).filter(r=>r.levelId===e).filter(r=>this.isValidScore(r));if(o.length===0)return{timesCompleted:0,bestScore:0,bestTime:null,avgScore:0,avgTime:0};const n=Math.max(...o.map(r=>r.totalScore)),i=Math.min(...o.map(r=>r.completionTimeMs)),s=Math.floor(o.reduce((r,u)=>r+u.totalScore,0)/o.length),l=Math.floor(o.reduce((r,u)=>r+u.completionTimeMs,0)/o.length);return{timesCompleted:o.length,bestScore:n,bestTime:i,avgScore:s,avgTime:l}}async getTotalStats(){const e=await this.storage.getCachedStats();if(e&&Date.now()-e.timestamp<6e4)return e.stats;const o=(await this.storage.getAllScores()).filter(r=>this.isValidScore(r));let n=null;if(o.length>0){const r={};o.forEach(c=>{r[c.levelId]=(r[c.levelId]||0)+1});const u=Math.max(...Object.values(r));n=parseInt(Object.keys(r).find(c=>r[c]===u))}const i=o.length>0?o.reduce((r,u)=>r+u.waterPercentage,0)/o.length:0,s=o.length>0?Math.min(...o.map(r=>r.completionTimeMs)):0,l={totalScore:o.reduce((r,u)=>r+u.totalScore,0),levelsCompleted:new Set(o.map(r=>r.levelId)).size,totalPlayTime:o.reduce((r,u)=>r+u.completionTimeMs,0),avgScore:o.length>0?Math.floor(o.reduce((r,u)=>r+u.totalScore,0)/o.length):0,bestSingleScore:o.length>0?Math.max(...o.map(r=>r.totalScore)):0,fastestTime:s,avgWaterPercentage:i,favoriteIsland:n};return await this.storage.setCachedStats({stats:l,timestamp:Date.now()}),l}async getPersonalBest(e){const t=await this.getTopScoresForLevel(e,1);return t.length>0?t[0]:null}async isNewPersonalBest(e,t){const o=await this.getPersonalBest(e);return!o||t>o.totalScore}async cleanupOldScores(e=90){const t=Date.now()-e*24*60*60*1e3;await this.storage.clearScoresBefore(t)}async resetAllScores(){await this.storage.clearAllScores()}async cleanupInvalidScores(){const e=await this.storage.getAllScores(),t=e.filter(n=>this.isValidScore(n)),o=e.length-t.length;return o>0&&(localStorage.setItem(this.storage.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.storage.STATS_KEY),console.log(`Cleaned up ${o} invalid score(s)`)),o}getTodayDateString(){return new Date().toISOString().split("T")[0]}static formatTime(e){const t=Math.floor(e/1e3),o=Math.floor(t/60),n=t%60;return o>0?`${o}:${n.toString().padStart(2,"0")}`:`${t}s`}static formatScore(e){return e.toLocaleString()}}let nr;const Su=ar.url,bu=ar.anonKey;console.log("📊 Using Supabase for score storage (from config file)"),nr=new yu(Su,bu);const lo=new Ls(nr);typeof window<"u"&&(window.cleanupInvalidScores=async()=>{const a=await lo.cleanupInvalidScores();return console.log(`✓ Cleaned up ${a} invalid score(s)`),a},window.viewAllScores=async()=>{const a=await lo.storage.getAllScores();return console.table(a.map(e=>({player:e.playerName||"Anonymous",level:e.levelId,score:e.totalScore,water:`${Math.round(e.waterPercentage*100)}%`,time:Ls.formatTime(e.completionTimeMs),date:e.date,valid:lo.isValidScore(e)?"✓":"✗"}))),a},console.log("📊 Score system loaded! Try these commands:"),console.log("  cleanupInvalidScores() - Remove test data"),console.log("  viewAllScores() - View all scores in a table"));const wn=Object.freeze(Object.defineProperty({__proto__:null,ScoreSystem:Ls,scoreSystem:lo},Symbol.toStringTag,{value:"Module"}));class Tu{constructor(){this.currentLevelId=parseInt(localStorage.getItem("currentLevelId"))||1,this.completedLevels=JSON.parse(localStorage.getItem("completedLevels")||"[]"),this.currentLevelId>Ao()&&(this.currentLevelId=Ao()),this.levelStartTime=null,this.levelElapsedTime=0}getCurrentLevel(){return Cs(this.currentLevelId)}getCurrentLevelId(){return this.currentLevelId}nextLevel(){return this.currentLevelId>=Ao()?null:(this.currentLevelId++,this.saveCurrentLevel(),this.getCurrentLevel())}startLevelTimer(){this.levelStartTime=Date.now(),this.levelElapsedTime=0}stopLevelTimer(){return this.levelStartTime?(this.levelElapsedTime=Date.now()-this.levelStartTime,this.levelElapsedTime):0}getCurrentElapsedTime(){return this.levelStartTime?Date.now()-this.levelStartTime:0}resetLevelTimer(){this.levelStartTime=null,this.levelElapsedTime=0}async completeLevel(e=3,t=0,o=0){const n=this.stopLevelTimer();if(t<=.01||n<=0)return console.warn("Invalid game completion - not saving score"),{basePoints:0,bonusPoints:0,timeBonus:0,totalScore:0,waterPercentage:0,completionTimeMs:0,isPersonalBest:!1,valid:!1};const i=this.completedLevels.findIndex(c=>c.levelId===this.currentLevelId),s={levelId:this.currentLevelId,timestamp:Date.now(),stars:e,completed:!0};i>=0?e>this.completedLevels[i].stars&&(this.completedLevels[i]=s):this.completedLevels.push(s),this.saveCompletedLevels();const l=localStorage.getItem("oasea_player_name")||"",r=lo.calculateScore(this.currentLevelId,t,n,l,o);await lo.saveScore(r);const u=await lo.isNewPersonalBest(this.currentLevelId,r.totalScore);return{...r,isPersonalBest:u,valid:!0}}isLevelCompleted(e){return this.completedLevels.some(t=>t.levelId===e)}isLastLevel(){return this.currentLevelId>=Ao()}resetProgress(){this.currentLevelId=1,this.completedLevels=[],this.saveCurrentLevel(),this.saveCompletedLevels()}saveCurrentLevel(){localStorage.setItem("currentLevelId",this.currentLevelId.toString())}saveCompletedLevels(){localStorage.setItem("completedLevels",JSON.stringify(this.completedLevels))}getTotalStars(){return this.completedLevels.reduce((e,t)=>e+t.stars,0)}getMaxStars(){return Ao()*3}}const Ft=new Tu;function Mu(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}let ee,os,as,xe,Ie,ns,ss,ft,Lt,is,oe,da,na,wa,sa,Vo,rs,Sa,ls,cs,Uo,Gt,Ra,_t,mt,Sn,bn,Ja;function xu(a){mt=a.levelManager,Sn=a.animateCameraToGameplay,bn=a.startGame,Ja=a.transitionToNextLevel,ee=document.getElementById("title-splash"),os=document.getElementById("title-play-button"),as=document.getElementById("instructions-button"),xe=document.getElementById("welcome-modal"),Ie=document.getElementById("simple-play-overlay"),ns=document.getElementById("simple-play-button"),ss=document.getElementById("play-button"),ft=document.getElementById("next-level-btn"),Lt=document.getElementById("sound"),is=document.getElementById("close-credits"),oe=document.getElementById("level-select-modal"),da=document.getElementById("level-grid"),na=document.getElementById("close-level-select"),wa=document.getElementById("level-name"),sa=document.querySelector(".gameplay-gif"),Vo=document.getElementById("score-modal"),rs=document.getElementById("close-score"),Sa=document.getElementById("leaderboard-modal"),ls=document.getElementById("leaderboard-btn"),cs=document.getElementById("close-leaderboard"),Uo=document.getElementById("name-prompt-modal"),Gt=document.getElementById("player-name-input"),Ra=document.getElementById("save-name-btn"),_t=document.getElementById("score-player-name"),Lu(),Fu(),ku(),Hu(),zu(),Nu(),Bu(),Wu(),Gu(),Yu(),ed(),qu()}function sr(a,e=!1){a.id===1?(ee&&(ee.style.display="flex"),xe&&(xe.style.display="none"),Ie&&(Ie.style.display="none")):(e?(ee&&(ee.style.display="none"),Ie&&(Ie.style.display="none",Ie.style.pointerEvents="auto",Ie.style.animation="")):(ee&&(ee.style.display="flex"),Ie&&(Ie.style.display="none")),xe&&(xe.style.display="none"))}function ir(a){wa&&(wa.textContent=`Island ${a.id}: ${a.name}`)}function rr(a){const e=document.getElementById("goal-marker");if(e){const t=a*100;e.style.bottom=`${t}%`}}function Du(){ft&&(mt.isLastLevel()?(ft.innerHTML='<span class="material-icons">eco</span>Credits',sd()):ft.innerHTML='<span class="material-icons">arrow_forward</span>Next&nbsp;Island',ft.style.display="flex")}function lr(){ft&&(ft.style.display="none")}function Eu(){Ie&&(Ie.style.display="flex")}function Pu(){Ie&&(Ie.style.display="none")}function _u(){xe&&(xe.style.display="none")}function Au(a){const e=document.getElementById("progress-fill"),t=document.getElementById("progress-text");e&&(e.style.height=a+"%"),t&&(t.textContent=Math.floor(a)+"%")}function Cu(){const a=document.getElementById("progress-fill");a&&a.classList.add("complete")}function cr(){const a=document.getElementById("progress-fill"),e=document.getElementById("progress-text"),t=document.getElementById("progress-container");a&&(a.style.height="0%",a.classList.remove("complete")),e&&(e.textContent="0%"),t&&(t.style.background="linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",t.classList.remove("pulse"))}function Iu(){const a=document.getElementById("progress-container"),e=document.getElementById("progress-fill");a&&e&&(a.classList.remove("pulse"),e.classList.remove("pulse"),a.offsetWidth,e.offsetWidth,a.classList.add("pulse"),e.classList.add("pulse"),setTimeout(()=>{a.classList.remove("pulse"),e.classList.remove("pulse")},600))}function ur(){const a=document.getElementById("win-modal");a&&(a.style.display="none")}function Lu(){Lt&&Lt.addEventListener("click",()=>{const a=Wo();$i()?(Qs(!1),a.play().then(()=>{Ya(!0),Lt.querySelector(".material-icons").textContent=""}).catch(t=>console.log("Failed to play audio:",t))):(Qs(!0),a.pause(),As(),Ya(!1),Lt.querySelector(".material-icons").textContent="")})}function Ru(){ee&&(ee.style.pointerEvents="none",ee.style.animation="none",ee.offsetWidth,ee.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{ee.style.display="none",ee.style.animation="",ee.style.pointerEvents=""},500)),Sn(),bn(),_s()||Wo().play().then(()=>{Ya(!0),Lt&&(Lt.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function Ou(){xe&&(xe.style.pointerEvents="none",xe.style.animation="none",xe.offsetWidth,xe.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{xe.style.display="none",xe.classList.add("hidden"),xe.style.animation="",xe.style.pointerEvents=""},500)),Sn(),bn(),_s()||Wo().play().then(()=>{Ya(!0),Lt&&(Lt.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function Fu(){os&&os.addEventListener("click",()=>{Ru()})}function ku(){as&&as.addEventListener("click",()=>{ee&&(ee.style.display="none"),xe&&(xe.style.animation="fadeIn 0.5s ease",xe.style.display="flex")})}function Hu(){ss&&ss.addEventListener("click",()=>{Ou()})}function zu(){ns&&ns.addEventListener("click",()=>{Ie&&(Ie.style.pointerEvents="none",Ie.style.animation="fadeOut 0.5s ease",setTimeout(()=>{Ie.style.display="none"},500)),Sn(),bn()})}function Nu(){ft&&ft.addEventListener("click",()=>{if(ft.style.display="none",hr(),mt.completeLevel(3),!mt.nextLevel()){const e=document.getElementById("credits-modal");e&&(e.style.animation="fadeIn 0.5s ease",e.style.display="flex");return}Ja()})}function Bu(){is&&is.addEventListener("click",()=>{const a=document.getElementById("credits-modal");a&&(a.style.pointerEvents="none",a.style.animation="none",a.offsetWidth,a.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{a.style.display="none",a.style.animation="",a.style.pointerEvents=""},500))})}function Wu(){wa&&wa.parentElement.addEventListener("click",()=>{Vu()}),na&&na.addEventListener("click",()=>{oe&&(oe.style.pointerEvents="none",oe.style.animation="none",oe.offsetWidth,oe.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{oe.classList.add("hidden"),oe.style.display="none",oe.style.animation="",oe.style.pointerEvents=""},500))}),oe&&oe.addEventListener("click",a=>{a.target===oe&&na&&na.click()})}function Vu(){!oe||!da||(Uu(),oe.classList.remove("hidden"),oe.style.display="flex")}function Uu(){da&&qt(async()=>{const{LEVELS:a}=await Promise.resolve().then(()=>Is);return{LEVELS:a}},void 0).then(({LEVELS:a})=>{da.innerHTML="";const e=mt.getCurrentLevel();a.forEach(t=>{const o=mt.isLevelCompleted(t.id),n=t.id===e.id,i=t.id>1&&!mt.isLevelCompleted(t.id-1),s=document.createElement("div");s.className="level-card",i&&s.classList.add("locked"),n&&s.classList.add("current");const l=mt.completedLevels.find(u=>u.levelId===t.id),r=l?l.stars:0;s.innerHTML=`
        ${i?'<span class="material-icons lock-icon">lock</span>':""}
        <div class="level-number">${t.id}</div>
        <div class="level-title">${t.name}</div>
        <div class="level-stars">
          ${o?"★".repeat(r)+"☆".repeat(3-r):"☆☆☆"}
        </div>
      `,i||s.addEventListener("click",()=>{Xu(t.id)}),da.appendChild(s)})})}function Xu(a){mt.currentLevelId=a,mt.saveCurrentLevel(),ee&&ee.style.display!=="none"&&(ee.style.pointerEvents="none",ee.style.animation="none",ee.offsetWidth,ee.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{ee.style.display="none",ee.style.animation="",ee.style.pointerEvents=""},300)),oe?(oe.style.pointerEvents="none",oe.style.animation="none",oe.offsetWidth,oe.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{oe.classList.add("hidden"),oe.style.display="none",oe.style.animation="",oe.style.pointerEvents="",Ja()},300)):Ja()}function Gu(){sa&&(sa.addEventListener("load",()=>{sa.classList.add("loaded");const a=document.querySelector(".gif-placeholder");a&&(a.style.display="none")}),sa.addEventListener("error",()=>{console.log("Gameplay GIF not found - placeholder will be shown")}))}function dr(){return localStorage.getItem("oasea_player_name")||""}function ju(a){return a.replace(/<[^>]*>/g,"").trim().slice(0,20)}function us(a){const e=ju(a);localStorage.setItem("oasea_player_name",e)}function oi(){return!localStorage.getItem("oasea_player_name_set")}function Zu(){localStorage.setItem("oasea_player_name_set","true")}function qu(){Ra&&Gt&&(Ra.addEventListener("click",()=>{const a=Gt.value.trim();a&&(us(a),Zu(),$u())}),Gt.addEventListener("keypress",a=>{a.key==="Enter"&&Ra.click()}))}function Yu(){rs&&rs.addEventListener("click",hr),_t&&(_t.addEventListener("change",()=>{const a=_t.value.trim();a&&us(a)}),_t.addEventListener("keypress",a=>{if(a.key==="Enter"){const e=_t.value.trim();e&&(us(e),_t.blur())}}))}function Ku(){Uo&&(Gt&&(Gt.value=dr(),setTimeout(()=>{Gt.focus(),Gt.select()},100)),Uo.style.display="flex")}function $u(){Uo&&(Uo.style.display="none")}async function Ju(a){if(Vo){if(oi()){Ku();const e=setInterval(()=>{(!oi()||Uo.style.display==="none")&&(clearInterval(e),ai(a))},100);return}ai(a)}}async function ai(a){if(!Vo)return;const{ScoreSystem:e,scoreSystem:t}=await qt(async()=>{const{ScoreSystem:s,scoreSystem:l}=await Promise.resolve().then(()=>wn);return{ScoreSystem:s,scoreSystem:l}},void 0);_t&&(_t.value=dr()),document.getElementById("score-base").textContent=e.formatScore(a.basePoints),document.getElementById("score-bonus").textContent=e.formatScore(a.bonusPoints),document.getElementById("score-time").textContent=e.formatScore(a.timeBonus),document.getElementById("score-total").textContent=e.formatScore(a.totalScore);const o=await t.getTotalStats();document.getElementById("career-total").textContent=e.formatScore(o.totalScore);const n=Math.round(a.waterPercentage*100);document.getElementById("water-collected").textContent=`${n}%`,document.getElementById("completion-time").textContent=e.formatTime(a.completionTimeMs),document.getElementById("terrain-edits").textContent=a.terrainEdits||0;const i=document.getElementById("personal-best-badge");i&&(i.style.display=a.isPersonalBest?"flex":"none"),Vo.style.display="flex",Qu(a,o.totalScore)}function hr(){Vo&&(Vo.style.display="none")}function Qu(a,e){const o=Date.now();function n(){const i=Date.now()-o,s=Math.min(i/1e3,1),l=1-Math.pow(1-s,3),r=Math.floor(a.basePoints*l),u=Math.floor(a.bonusPoints*l),c=Math.floor(a.timeBonus*l),d=Math.floor(a.totalScore*l),h=Math.floor(e*l);document.getElementById("score-base").textContent=r.toLocaleString(),document.getElementById("score-bonus").textContent=u.toLocaleString(),document.getElementById("score-time").textContent=c.toLocaleString(),document.getElementById("score-total").textContent=d.toLocaleString(),document.getElementById("career-total").textContent=h.toLocaleString(),s<1&&requestAnimationFrame(n)}n()}function ed(){ls&&ls.addEventListener("click",td),cs&&cs.addEventListener("click",od);const a=document.querySelectorAll(".tab-btn");a.forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;ad(t),a.forEach(o=>o.classList.remove("active")),e.classList.add("active")})})}async function td(){if(!Sa)return;Sa.style.display="flex";const a=document.querySelector(".tab-btn.active"),e=a?a.dataset.tab:"today";await fr(e)}function od(){Sa&&(Sa.style.display="none")}async function ad(a){document.querySelectorAll(".leaderboard-tab-content").forEach(t=>{t.style.display="none"});const e=document.getElementById(`leaderboard-${a}`);if(e&&(e.style.display="block"),a==="today"){const t=document.getElementById("today-loading"),o=document.getElementById("today-scores");t&&(t.style.display="flex"),o&&(o.style.display="none")}else if(a==="alltime"){const t=document.getElementById("alltime-loading"),o=document.getElementById("alltime-scores");t&&(t.style.display="flex"),o&&(o.style.display="none")}else if(a==="stats"){const t=document.getElementById("stats-loading"),o=document.getElementById("stats-content");t&&(t.style.display="flex"),o&&(o.style.display="none")}await fr(a)}async function fr(a){const{scoreSystem:e,ScoreSystem:t}=await qt(async()=>{const{scoreSystem:o,ScoreSystem:n}=await Promise.resolve().then(()=>wn);return{scoreSystem:o,ScoreSystem:n}},void 0);if(a==="today"){const o=await e.getTopScoresToday(10);ni("today-scores",o)}else if(a==="alltime"){const o=await e.getTopScoresAllTime(10);ni("alltime-scores",o)}else if(a==="stats"){const o=await e.getTotalStats();nd(o)}}function ni(a,e){const t=document.getElementById(a);t&&qt(async()=>{const{ScoreSystem:o}=await Promise.resolve().then(()=>wn);return{ScoreSystem:o}},void 0).then(({ScoreSystem:o})=>{qt(async()=>{const{getLevelById:n}=await Promise.resolve().then(()=>Is);return{getLevelById:n}},void 0).then(({getLevelById:n})=>{if(e.length===0?t.innerHTML='<p class="no-scores">No scores yet. Complete a level to see your scores here!</p>':t.innerHTML=e.map((i,s)=>{const l=n(i.levelId),r=Mu(i.playerName||"Anonymous");return`
            <div class="score-item">
              <div class="score-rank">#${s+1}</div>
              <div class="score-info">
                <div class="score-player-name">${r}</div>
                <div class="score-level">Island ${i.levelId}: ${l.name}</div>
                <div class="score-details">
                  <span>${o.formatTime(i.completionTimeMs)}</span>
                  <span>${Math.round(i.waterPercentage*100)}% collected</span>
                </div>
              </div>
              <div class="score-points">${o.formatScore(i.totalScore)}</div>
            </div>
          `}).join(""),a==="today-scores"){const i=document.getElementById("today-loading");i&&(i.style.display="none"),t.style.display="block"}else if(a==="alltime-scores"){const i=document.getElementById("alltime-loading");i&&(i.style.display="none"),t.style.display="block"}})})}function nd(a){qt(async()=>{const{ScoreSystem:e}=await Promise.resolve().then(()=>wn);return{ScoreSystem:e}},void 0).then(({ScoreSystem:e})=>{qt(async()=>{const{getLevelById:t}=await Promise.resolve().then(()=>Is);return{getLevelById:t}},void 0).then(({getLevelById:t})=>{document.getElementById("total-score-stat").textContent=e.formatScore(a.totalScore),document.getElementById("best-single-stat").textContent=e.formatScore(a.bestSingleScore),document.getElementById("levels-completed-stat").textContent=a.levelsCompleted;const o=document.getElementById("favorite-island-stat");if(a.favoriteIsland){const s=t(a.favoriteIsland);o.textContent=`${a.favoriteIsland}: ${s.name}`}else o.textContent="—";document.getElementById("total-time-stat").textContent=e.formatTime(a.totalPlayTime),document.getElementById("fastest-time-stat").textContent=a.fastestTime>0?e.formatTime(a.fastestTime):"—",document.getElementById("avg-score-stat").textContent=e.formatScore(a.avgScore),document.getElementById("avg-water-stat").textContent=a.avgWaterPercentage>0?`${Math.round(a.avgWaterPercentage*100)}%`:"0%";const n=document.getElementById("stats-loading"),i=document.getElementById("stats-content");n&&(n.style.display="none"),i&&(i.style.display="grid")})})}function sd(){const a=document.getElementById("level-story-overlay"),e=document.getElementById("level-story-text");!a||!e||(e.innerHTML="You shaped valleys, drew water back to its heart, and watched the parched earth breathe again.<br><br>Treat our planet with care, guide water home, and life will find the way.",a.style.display="block",setTimeout(()=>{a.classList.add("visible")},100),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>{a.style.display="none"},500)},9864))}const ba=8,id=4.3,ds=80,hs=90,fs=500;let po=[],go=[],Rt=[],Yt=[],Ea=[],co=[],tt=[],ut=0,ue=null,Qa=null,ce=null,ko=null,Be=[];function rd(){const a=new nl(.2,16),e=new st({transparent:!0,depthWrite:!1,blending:yi,uniforms:{color:{value:new ie(8545340)}},vertexShader:`
      attribute float instanceOpacity;
      varying float vOpacity;

      void main() {
        vOpacity = instanceOpacity;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 color;
      varying float vOpacity;

      void main() {
        gl_FragColor = vec4(color, vOpacity);
      }
    `});ue=new Un(a,e,ds),ue.renderOrder=1,Qa=new Float32Array(ds),ue.geometry.setAttribute("instanceOpacity",new Xn(Qa,1)),ue.count=0;const t=new bs(.05,8,8),o=new st({transparent:!0,depthWrite:!1,uniforms:{color:{value:new ie(8965375)}},vertexShader:`
      attribute float instanceOpacity;
      varying float vOpacity;

      void main() {
        vOpacity = instanceOpacity;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 color;
      varying float vOpacity;

      void main() {
        gl_FragColor = vec4(color, vOpacity);
      }
    `});ce=new Un(t,o,fs),ce.renderOrder=2,ko=new Float32Array(fs),ce.geometry.setAttribute("instanceOpacity",new Xn(ko,1)),ce.count=0,po=[],go=[],Rt=[],Yt=[],Ea=[],co=[],tt=[],Be=[],ut=0}function mr(a,e,t){const o=e.length;for(let n=0;n<o;n++){const i=e[n],{beamMesh:s,beamMaterial:l}=ld(i);a.add(s),po.push(s),go.push(l);const r=cd(i,t);a.add(r),Rt.push(r);const{particles:u,particleVelocities:c}=ud(i);a.add(u),Yt.push(u),Ea.push(c)}ue&&!ue.parent&&a.add(ue),ce&&!ce.parent&&a.add(ce)}function ld(a){const e=new Ds(1.5,1.5,ba,32,1,!0),t=new st({transparent:!0,side:rt,depthWrite:!1,depthTest:!0,vertexShader:`
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uPulseIntensity;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        // Fade out at top
        float heightFade = 1.0 - vUv.y;

        // Base pulse effect
        float pulse = sin(uTime * 2.0 + vUv.y * 10.0) * 0.3 + 0.7;

        // Edge glow
        float edgeGlow = abs(sin(vUv.x * 3.14159));
        edgeGlow = pow(edgeGlow, 3.0);

        // Add triggered pulse effect
        float triggerPulse = uPulseIntensity * 2.0;

        vec3 color = uColor;
        float alpha = heightFade * pulse * edgeGlow * (0.4 + triggerPulse);

        // Boost color brightness during pulse
        color = color * (1.0 + triggerPulse * 0.5);

        gl_FragColor = vec4(color, alpha);
      }
    `,uniforms:{uTime:{value:0},uColor:{value:new w(1,1,0)},uPulseIntensity:{value:0}}}),o=new we(e,t);return o.position.set(a.x,ba/2,a.z),o.renderOrder=5,{beamMesh:o,beamMaterial:t}}function cd(a,e){const o=Ro({startX:a.x,startZ:a.z,endX:a.x,endZ:a.z,cloudTexture:e,rainCount:200,cloudHeight:14}),n=o.userData.cloud,i=o.userData.cloudMaterial;return n.scale.set(1.26,.42,1.6),i.uniforms.base.value.setRGB(.8,.9,1),i.uniforms.threshold.value=.25,i.uniforms.opacity.value=0,n.visible=!0,n.renderOrder=10,i.depthTest=!1,o}function ud(a){const e=new un,t=new Float32Array(hs*3),o=[];for(let s=0;s<hs;s++){const l=Math.random()*Math.PI*2,r=Math.random()*1.3;t[s*3]=Math.cos(l)*r,t[s*3+1]=Math.random()*ba,t[s*3+2]=Math.sin(l)*r,o.push({y:.5+Math.random()*1,angle:l,radius:r,angleSpeed:(Math.random()-.5)*.5})}e.setAttribute("position",new no(t,3));const n=new Ts({color:16776960,size:.1,transparent:!0,opacity:.6,blending:sl,depthWrite:!1}),i=new Ms(e,n);return i.position.set(a.x,0,a.z),{particles:i,particleVelocities:o}}function dd(a,e){const t=Math.sin(Date.now()*.003)*.1+.9,o=po.length;for(let n=0;n<o;n++){e&&e[n]&&(e[n].emissiveIntensity=t*.5),go[n].uniforms.uTime.value+=a,ut>0&&(ut-=a*id,ut=Math.max(0,ut)),go[n].uniforms.uPulseIntensity.value=ut;const i=1+ut*.04;po[n].scale.set(i,1,i)}}function hd(a){const e=Yt.length;for(let t=0;t<e;t++){const o=Yt[t].geometry,n=Ea[t],i=o.attributes.position.array;for(let s=0;s<hs;s++){const l=n[s];i[s*3+1]+=l.y*a,l.angle+=l.angleSpeed*a,i[s*3]=Math.cos(l.angle)*l.radius,i[s*3+2]=Math.sin(l.angle)*l.radius,i[s*3+1]>ba&&(i[s*3+1]=0)}o.attributes.position.needsUpdate=!0}}function fd(a,e,t,o,n,i){const s=e.length;a.forEach(l=>{let r=1/0,u=-1;for(let c=0;c<s;c++){const d=Math.sqrt(Math.pow(l.body.position.x-e[c].x,2)+Math.pow(l.body.position.z-e[c].z,2));d<r&&(r=d,u=c)}r<1.5&&!o.has(l)&&(o.add(l),n(),ut=1,i(),t.removeBody(l.body),co.push({ball:l,targetIndex:u,startY:l.body.position.y,targetY:ba,progress:0,originalScale:1,particleEmitter:{particles:[],lastEmitTime:0}}))})}function md(a,e,t){for(let o=co.length-1;o>=0;o--){const n=co[o],i=n.ball,s=t[n.targetIndex];n.progress+=e*.3;const l=Math.min(n.progress,1),r=l*l*(3-2*l);i.body.position.y=n.startY+(n.targetY-n.startY)*r,i.body.position.x+=(s.x-i.body.position.x)*e*2,i.body.position.z+=(s.z-i.body.position.z)*e*2,i.mesh.position.copy(i.body.position);const u=.6;if(l>u){const h=1-(l-u)/(1-u);i.mesh.scale.set(h,h,h)}const c=Date.now();if(c-n.particleEmitter.lastEmitTime>30&&ce&&Be.length<fs){const d=Math.random()*Math.PI*2,h=Math.random()*i.radius*.8,p=new w(i.body.position.x+Math.cos(d)*h,i.body.position.y+(Math.random()-.5)*i.radius,i.body.position.z+Math.sin(d)*h),m=Be.length,g={instanceIndex:m,position:p,velocity:{x:(Math.random()-.5)*.5,y:1+Math.random()*.5,z:(Math.random()-.5)*.5},life:0,maxLife:.8,initialScale:1};Be.push(g),n.particleEmitter.particles.push(g);const v=new zt;v.compose(p,new kt,new w(1,1,1)),ce.setMatrixAt(m,v),ko[m]=.6,ce.count=Be.length,ce.instanceMatrix.needsUpdate=!0,ce.geometry.attributes.instanceOpacity.needsUpdate=!0,n.particleEmitter.lastEmitTime=c}l>=1&&(a.remove(i.mesh),i.active=!1,n.particleEmitter.particles=[],co.splice(o,1))}pd(e)}function pd(a){if(!ce||Be.length===0)return;let e=!1,t=!1;for(let o=Be.length-1;o>=0;o--){const n=Be[o];n.life+=a,n.position.x+=n.velocity.x*a,n.position.y+=n.velocity.y*a,n.position.z+=n.velocity.z*a;const i=n.life/n.maxLife,s=.6*(1-i),l=n.initialScale*(1-i*.5),r=new zt;if(r.compose(n.position,new kt,new w(l,l,l)),ce.setMatrixAt(n.instanceIndex,r),e=!0,ko[n.instanceIndex]=s,t=!0,n.life>=n.maxLife){Be.splice(o,1);for(let u=o;u<Be.length;u++){Be[u].instanceIndex=u;const c=new zt;ce.getMatrixAt(u+1,c),ce.setMatrixAt(u,c),ko[u]=ko[u+1]}ce.count=Be.length}}e&&(ce.instanceMatrix.needsUpdate=!0),t&&(ce.geometry.attributes.instanceOpacity.needsUpdate=!0)}function gd(a,e,t,o,n){const i=Rt.length;for(let r=0;r<i;r++){const u=Rt[r],c=u.userData.cloud;u.userData.cloudMaterial,Gn(u,a,e),c.rotation.y+=e*.1}const s=1600,l=t?Date.now()-o:0;if(t&&l>=s)for(let d=0;d<i;d++){const h=Rt[d],p=h.userData.cloud,m=h.userData.cloudMaterial,g=p.scale.x,v=g+(8-g)*e*1.5;p.scale.set(v,v*.6,v);const S=m.uniforms.opacity.value,T=isNaN(S)?.3:S+(.3-S)*e*1.5;m.uniforms.opacity.value=T,jn(h,e),Fa(h,.6)}else for(let r=0;r<i;r++){const u=Rt[r],c=u.userData.cloudMaterial;c.uniforms.opacity.value=0,Fa(u,0)}if(t&&n)for(let r=0;r<i;r++)go[r].uniforms.uColor.value.set(0,1,.3),Yt[r].material.color.setHex(65416)}function vd(a,e,t){if(!ue){console.error("Trail system not initialized");return}if(e.lastTrailTime&&Date.now()-e.lastTrailTime<50)return;let o;tt.length>=ds?o=tt.shift().instanceIndex:o=tt.length;const n=new zt,i=e.radius*2.5,s=new w(e.body.position.x,t+.02,e.body.position.z),l=new kt().setFromEuler(new il(-Math.PI/2,0,0)),r=new w(i,i,1);n.compose(s,l,r),ue.setMatrixAt(o,n),ue.instanceMatrix.needsUpdate=!0,Qa[o]=.008,ue.geometry.attributes.instanceOpacity.needsUpdate=!0,ue.count=Math.max(ue.count,tt.length+1),tt.push({instanceIndex:o,opacity:.003,age:0,maxAge:3+Math.random()*2,scale:i}),e.lastTrailTime=Date.now()}function yd(a){if(!ue)return;let e=!1,t=!1;for(let o=tt.length-1;o>=0;o--){const n=tt[o];n.age+=a;const i=n.age/n.maxAge;n.opacity=(.5-i)*.235,Qa[n.instanceIndex]=n.opacity,t=!0;const s=1-i*.43,l=n.scale*s,r=new zt;ue.getMatrixAt(n.instanceIndex,r);const u=new w,c=new kt,d=new w;r.decompose(u,c,d),d.x=l,d.y=l,r.compose(u,c,d),ue.setMatrixAt(n.instanceIndex,r),e=!0,n.age>=n.maxAge&&(tt.splice(o,1),ue.count=tt.length)}e&&(ue.instanceMatrix.needsUpdate=!0),t&&(ue.geometry.attributes.instanceOpacity.needsUpdate=!0)}function wd(a){[...po].forEach(e=>{a.remove(e),e.geometry.dispose(),e.material.dispose()}),po.length=0,go.length=0,[...Rt].forEach(e=>{a.remove(e),e.userData.cloud&&(e.userData.cloud.geometry.dispose(),e.userData.cloud.material.dispose())}),Rt.length=0,[...Yt].forEach(e=>{a.remove(e),e.geometry.dispose(),e.material.dispose()}),Yt.length=0,Ea.length=0,tt.length=0,ue&&(ue.count=0),Be.length=0,ce&&(ce.count=0),co.length=0,ut=0}function Sd(){po=[],go=[],Rt=[],Yt=[],Ea=[],co=[],tt=[],Be=[],ue&&(ue.count=0),ce&&(ce.count=0),ut=0}const pt=new wo,je=new Se;let St=!1,Rs=!1,Os=!1,Xo=0,ia=0,Le=null,E=null,Ta=.88,Go=0,jo={x:0,y:0},Tn=0,Oa=0;const pr=10,bd=300;let yt=null,Zo=null,$o=null,it=null,vo=null,qo=null,Yo=null;function qe(){return Rs||Os||Xo>=2}function gr(a){if(!a)return!1;let e=a;for(;e&&e!==document.body;){const t=e.tagName?.toLowerCase();if(t==="button"||t==="input"||t==="select"||t==="textarea"||t==="a"||e.onclick||e.getAttribute("role")==="button"||e.classList?.contains("ui-element")||e.classList?.contains("modal"))return!0;const o=e.id;if(o&&(o.includes("btn")||o.includes("button")||o.includes("modal")||o.includes("overlay")||o.includes("menu")||o.includes("ui")))return!0;e=e.parentElement}return!1}function Td(a){if(gr(a.target))return;a.button===2&&(Os=!0),jo={x:a.clientX,y:a.clientY},Tn=Date.now(),je.x=a.clientX/window.innerWidth*2-1,je.y=-(a.clientY/window.innerHeight)*2+1,pt.setFromCamera(je,Zo);const e=pt.intersectObject(it);if(e.length>0){const t=e[0].point;if(t.y<vo-Ta)return;const o=t.clone(),n=o.clone();if(it.worldToLocal(n),Le={world:o,local:n},St=!0,$o.enabled=!1,document.body.style.cursor=qe()?"s-resize":"n-resize",!E){const s=new xa(1.1,2.2,46),l=new Ct({color:qe()?16729156:4474111,transparent:!0,opacity:.4,side:rt,depthWrite:!1});E=new we(s,l),E.rotation.x=-Math.PI/2,E.renderOrder=3,yt.add(E)}E.material.color.setHex(qe()?16729156:4474111),E.visible=!0,E.position.copy(o),E.position.y+=.05,Qi()}}function Md(a){a.button===2&&(Os=!1);const e={x:a.clientX,y:a.clientY},t=Math.sqrt(Math.pow(e.x-jo.x,2)+Math.pow(e.y-jo.y,2)),o=Date.now()-Tn;if(t<pr&&o<500&&Le){const n=qe()?-.8:.8;qo(Le.local,n),Yo(),Go++}St=!1,Le=null,document.body.style.cursor="default",$o.enabled=!0,yn(),E&&(yt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null)}function xd(a){je.x=a.clientX/window.innerWidth*2-1,je.y=-(a.clientY/window.innerHeight)*2+1,pt.setFromCamera(je,Zo);const e=pt.intersectObject(it);if(e.length>0&&e[0].point.y>=vo-Ta?document.body.style.cursor=qe()?"s-resize":"n-resize":document.body.style.cursor="default",St){pt.setFromCamera(je,Zo);const t=pt.intersectObject(it);if(t.length>0){const o=t[0].point.clone();if(o.y<vo-Ta){Le=null,E&&(E.visible=!1);return}const n=o.clone();if(it.worldToLocal(n),Le={world:o,local:n},!E){const s=new xa(1.1,2.2,46),l=new Ct({color:qe()?16729156:4474111,transparent:!0,opacity:.4,side:rt,depthWrite:!1});E=new we(s,l),E.rotation.x=-Math.PI/2,E.renderOrder=3,yt.add(E)}E.material.color.setHex(qe()?16729156:4474111),E.visible=!0,E.position.copy(o),E.position.y+=.05}}}function Dd(a){a.key==="Shift"&&(Rs=!0,document.body.style.cursor="s-resize",E&&E.material.color.setHex(16729156))}function Ed(a){a.key==="Shift"&&(Rs=!1,document.body.style.cursor=St?"n-resize":"default",E&&E.material.color.setHex(4474111))}function Pd(a){if(gr(a.target))return;Xo=a.touches.length;const e=a.touches[0];jo={x:e.clientX,y:e.clientY},Tn=Date.now(),je.x=e.clientX/window.innerWidth*2-1,je.y=-(e.clientY/window.innerHeight)*2+1,pt.setFromCamera(je,Zo);const t=pt.intersectObject(it);if(t.length>0){const o=t[0].point;if(o.y<vo-Ta)return;const n=o.clone(),i=n.clone();if(it.worldToLocal(i),Le={world:n,local:i},St=!0,$o.enabled=!1,document.body.style.cursor=qe()?"s-resize":"n-resize",!E){const l=new xa(1.1,2.2,46),r=new Ct({color:qe()?16729156:4474111,transparent:!0,opacity:.4,side:rt,depthWrite:!1});E=new we(l,r),E.rotation.x=-Math.PI/2,E.renderOrder=3,yt.add(E)}E.material.color.setHex(qe()?16729156:4474111),E.visible=!0,E.position.copy(n),E.position.y+=.05,Qi(),a.preventDefault()}}function _d(a){Xo=a.touches.length;const e=a.touches[0];if(je.x=e.clientX/window.innerWidth*2-1,je.y=-(e.clientY/window.innerHeight)*2+1,St){pt.setFromCamera(je,Zo);const t=pt.intersectObject(it);if(t.length>0){const o=t[0].point.clone();if(o.y<vo-Ta){Le=null,E&&(E.visible=!1);return}const n=o.clone();if(it.worldToLocal(n),Le={world:o,local:n},!E){const s=new xa(1.1,2.2,46),l=new Ct({color:qe()?16729156:4474111,transparent:!0,opacity:.4,side:rt,depthWrite:!1});E=new we(s,l),E.rotation.x=-Math.PI/2,E.renderOrder=3,yt.add(E)}E.material.color.setHex(qe()?16729156:4474111),E.visible=!0,E.position.copy(o),E.position.y+=.05}a.preventDefault()}}function Ad(a){const e=a.changedTouches[0],t={x:e.clientX,y:e.clientY},o=Math.sqrt(Math.pow(t.x-jo.x,2)+Math.pow(t.y-jo.y,2)),n=Date.now()-Tn;o<pr&&n<500&&Le&&(Date.now()-Oa<bd?(qo(Le.local,-.8),Yo(),Go++,Oa=0):(qo(Le.local,.8),Yo(),Go++,Oa=Date.now())),Xo=a.touches.length,Xo===0&&(St=!1,Le=null,$o.enabled=!0,document.body.style.cursor="default",yn(),E&&(yt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null))}function Cd(){Xo=0,St=!1,Le=null,$o.enabled=!0,Oa=0,document.body.style.cursor="default",yn(),E&&(yt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null)}function Id(a){a.preventDefault()}function Ld(a){yt=a.scene,Zo=a.camera,$o=a.controls,it=a.terrainMesh,vo=a.waterLevel,qo=a.sculptTerrain,Yo=a.updateTrimesh,window.addEventListener("mousedown",Td),window.addEventListener("mouseup",Md),window.addEventListener("mousemove",xd),window.addEventListener("contextmenu",Id),window.addEventListener("keydown",Dd),window.addEventListener("keyup",Ed),window.addEventListener("touchstart",Pd,{passive:!1}),window.addEventListener("touchmove",_d,{passive:!1}),window.addEventListener("touchend",Ad),window.addEventListener("touchcancel",Cd)}function Rd(){if(St&&Le){const a=Date.now();if(a-ia>16){const e=qe()?-4.88:4.98;if(qo(Le.local,e),Go++,a-ia>10)return Yo(),ia=a,!0;ia=a}}return!1}function Od(a){a.terrainMesh!==void 0&&(it=a.terrainMesh),a.waterLevel!==void 0&&(vo=a.waterLevel),a.sculptTerrain!==void 0&&(qo=a.sculptTerrain),a.updateTrimesh!==void 0&&(Yo=a.updateTrimesh)}function Fd(){E&&yt&&(yt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null),St=!1,Le=null,ia=0,Go=0}function kd(){return Go}const Ma=[];let Ln=0;const Ho=[];function Hd(a){const e=new w(.9,.6,.2),t=new w(1,.8,.3),o=new w(1,.6,.4),n=new w(.502,.749,.4),i=new w(.4,.6,.302),s=new w(.6,.85,.5),l=Date.now(),r=1500,u=300,c=()=>{const d=Date.now()-l,h=Math.min(d/r,1),p=1-Math.pow(1-h,3);if(a.uniforms.midLowColor.value.lerpVectors(e,n,p),d>u){const m=Math.min((d-u)/r,1),g=1-Math.pow(1-m,3);a.uniforms.midColor.value.lerpVectors(t,i,g)}if(d>u*2){const m=Math.min((d-u*2)/r,1),g=1-Math.pow(1-m,3);a.uniforms.midHighColor.value.lerpVectors(o,s,g)}d<r+u*2&&requestAnimationFrame(c)};requestAnimationFrame(c)}function zd(a,e,t,o=1.5,n=[]){const i=[],s=a*20,l={min:.3,max:2.2};let r=0;for(;i.length<a&&r<s;){r++;const u=(Math.random()-.5)*e*.8,c=(Math.random()-.5)*e*.8,d=new w(u,20,c),h=new w(0,-1,0),m=new wo(d,h).intersectObject(t);if(m.length===0)continue;const g=m[0].point.y;if(g<l.min||g>l.max)continue;let v=!1;const S=[...n,...i];for(const T of S)if(Math.sqrt(Math.pow(u-T.x,2)+Math.pow(c-T.z,2))<o){v=!0;break}v||i.push({x:u,z:c})}return i}function vr(a){const{scene:e,modelCache:t,terrainMesh:o,modelPath:n,positions:i,baseScale:s,scaleVariation:l,staggerDelay:r,growDuration:u,verticalOffset:c=-.15,startDelay:d=0}=a;if(i.length===0){console.warn(`No positions generated for ${n}, skipping model load`);return}if(!t[n]){console.warn(`Model ${n} not preloaded yet, waiting...`),setTimeout(()=>vr(a),100);return}console.log(`Using cached model: ${n} for ${i.length} positions`);const h=t[n];i.forEach((p,m)=>{const g=new Zt;h.forEach(re=>{const he=new we(re.geometry,re.material);he.position.copy(re.position),he.rotation.copy(re.rotation),he.scale.copy(re.scale),he.castShadow=re.castShadow,he.receiveShadow=re.receiveShadow,g.add(he)});const v=new w(p.x,20,p.z),S=new w(0,-1,0),y=new wo(v,S).intersectObject(o);if(y.length===0){console.warn("Tree position not on terrain:",p);return}const b=y[0],M=b.point.y,I=b.face.normal.clone().clone().applyMatrix3(new rl().getNormalMatrix(o.matrixWorld)).normalize();g.rotation.y=Math.random()*Math.PI*2;const A=Math.atan2(p.z,p.x),H=new w(0,1,0),L=Math.acos(Math.max(-1,Math.min(1,H.dot(I)))),W=Math.PI/9,de=Math.min(L*.6,W);g.rotation.x=Math.sin(A)*de,g.rotation.z=-Math.cos(A)*de,g.position.set(p.x,M+c,p.z),g.scale.set(0,0,0),e.add(g),g.userData.swayOffset=Math.random()*Math.PI*2,g.userData.swaySpeed=.8+Math.random()*.4,g.userData.swayAmount=.03+Math.random()*.02,g.userData.baseRotation={x:g.rotation.x,z:g.rotation.z},Ma.push(g);const Y=Date.now()+d+m*r,K=s+Math.random()*l,ze=()=>{const re=Date.now()-Y;if(re<0){requestAnimationFrame(ze);return}const he=Math.min(re/u,1),ot=(1-Math.pow(1-he,3))*K;g.scale.set(ot,ot,ot),he<1&&requestAnimationFrame(ze)};requestAnimationFrame(ze)})}function Nd(a,e,t){const o=[],n=a*25,i=.3,s={min:.3,max:2.2},l=Math.floor(a/6),r=[];for(let c=0;c<l;c++){const d=(Math.random()-.5)*e*.8,h=(Math.random()-.5)*e*.8;r.push({x:d,z:h,radius:1.5+Math.random()*1.5})}let u=0;for(;o.length<a&&u<n;){u++;let c,d;if(Math.random()<.7&&r.length>0){const T=r[Math.floor(Math.random()*r.length)],y=Math.random()*Math.PI*2,b=Math.random()*T.radius;c=T.x+Math.cos(y)*b,d=T.z+Math.sin(y)*b}else c=(Math.random()-.5)*e*.8,d=(Math.random()-.5)*e*.8;const h=new w(c,20,d),p=new w(0,-1,0),g=new wo(h,p).intersectObject(t);if(g.length===0)continue;const v=g[0].point.y;if(v<s.min||v>s.max)continue;let S=!1;for(const T of o)if(Math.sqrt(Math.pow(c-T.x,2)+Math.pow(d-T.z,2))<i){S=!0;break}S||o.push({x:c,z:d})}return o}function si(a){const{scene:e,modelCache:t,terrainMesh:o,grassModelPath:n,grassTuftPositions:i,batchIndex:s}=a,l=t[n];i.forEach((r,u)=>{const c=new Zt;l.forEach(y=>{const b=new we(y.geometry,y.material);b.position.copy(y.position),b.rotation.copy(y.rotation),b.scale.copy(y.scale),b.castShadow=y.castShadow,b.receiveShadow=y.receiveShadow,c.add(b)});const d=new w(r.x,20,r.z),h=new w(0,-1,0),m=new wo(d,h).intersectObject(o);if(m.length===0){console.warn("Grass tuft position not on terrain:",r);return}const g=m[0].point.y;c.rotation.y=Math.random()*Math.PI*2,c.position.set(r.x,g-.05,r.z),c.scale.set(0,0,0),e.add(c);const v=Date.now()+u*80+500,S=.228+Math.random()*.188,T=()=>{const y=Date.now()-v;if(y<0){requestAnimationFrame(T);return}const M=Math.min(y/800,1),I=(1-Math.pow(1-M,3))*S;c.scale.set(I,I,I),M<1&&requestAnimationFrame(T)};requestAnimationFrame(T)})}function Bd(a){const{scene:e,terrainMaterial:t,terrainMesh:o,terrainSize:n,modelCache:i}=a;hu(),Hd(t);const s=[{modelPath:"./models/palm_tree.glb",count:24,minSpacing:1.12,baseScale:.00184,scaleVariation:949e-6,staggerDelay:150,growDuration:1e3,verticalOffset:-.15,startDelay:0},{modelPath:"./models/ivory-cane-palm.glb",count:20,minSpacing:.43,baseScale:.054689,scaleVariation:.04377,staggerDelay:130,growDuration:1100,verticalOffset:-.0812,startDelay:400},{modelPath:"./models/olive-palm.glb",count:6,minSpacing:.73,baseScale:.18,scaleVariation:.077,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/lady-palm.glb",count:5,minSpacing:.69,baseScale:.048,scaleVariation:.042,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/bismarck-palm.glb",count:5,minSpacing:.29,baseScale:.078,scaleVariation:.062,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450}],l=[],r=80;s.forEach((m,g)=>{setTimeout(()=>{const v=zd(m.count,n,o,m.minSpacing,l);console.log(`Generated ${v.length} positions for ${m.modelPath} (requested ${m.count})`),l.push(...v),vr({scene:e,modelCache:i,terrainMesh:o,modelPath:m.modelPath,positions:v,baseScale:m.baseScale,scaleVariation:m.scaleVariation,staggerDelay:m.staggerDelay,growDuration:m.growDuration,verticalOffset:m.verticalOffset,startDelay:m.startDelay})},g*r)});const u="./models/tall-grass.glb",c=15,d=4,h=60,p=[];for(let m=0;m<d;m++)setTimeout(()=>{const g=Nd(c,n,o);p.push(...g),console.log(`Generated grass batch ${m+1}/${d}: ${g.length} positions`),i[u]?si({scene:e,modelCache:i,terrainMesh:o,grassModelPath:u,grassTuftPositions:g,batchIndex:m}):(console.warn("Grass model not preloaded yet, waiting..."),setTimeout(()=>{i[u]&&si({scene:e,modelCache:i,terrainMesh:o,grassModelPath:u,grassTuftPositions:g,batchIndex:m})},90))},400+m*h);setTimeout(()=>{Vd(e)},2e3)}function Wd(a){if(Ma.length===0||(Ln++,Ln<2))return;Ln=0;const e=Math.sin(a*.9);Ma.forEach(t=>{if(t.scale.x===0)return;const{swayOffset:o,swaySpeed:n,swayAmount:i,baseRotation:s}=t.userData,l=Math.sin(a*n+o)*e*i;t.rotation.x=s.x+l,t.rotation.z=s.z+l*.7})}async function Vd(a){const{GLTFLoader:e}=await qt(async()=>{const{GLTFLoader:s}=await Promise.resolve().then(()=>vc);return{GLTFLoader:s}},void 0),t=new e,o=Math.random()<.6?1:0,n=Math.floor(Math.random()*3),i=Math.floor(Math.random()*4);console.log(`Spawning win seagulls: ${o} flock, ${n} spirals, ${i} singles`),o>0&&t.load("./models/seagulls-flock.glb",s=>{const l=s.scene;if(l.position.set(0,6.28,0),l.scale.set(.026,.026,.026),l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!1)}),a.add(l),s.animations&&s.animations.length>0){const r=new We(l);s.animations.forEach(u=>{const c=r.clipAction(u);c.timeScale=.5,c.play()}),l.userData.mixer=r}l.userData.type="flock",l.userData.bobTime=Math.random()*Math.PI*2,l.userData.bobSpeed=.3,l.userData.bobAmount=1.8,Ho.push(l)});for(let s=0;s<n;s++)t.load("./models/seagulls-spiral.glb",l=>{const r=l.scene,u=(Math.random()-.5)*8,c=(Math.random()-.5)*8,d=5+Math.random()*3;if(r.position.set(u,d,c),r.scale.set(.14,.14,.14),r.traverse(h=>{h.isMesh&&(h.castShadow=!0,h.receiveShadow=!1)}),a.add(r),l.animations&&l.animations.length>0){const h=new We(r);l.animations.forEach(p=>{const m=h.clipAction(p);m.timeScale=.55+Math.random()*.2,m.play()}),r.userData.mixer=h}r.userData.type="spiral",r.userData.bobTime=Math.random()*Math.PI*2,r.userData.bobSpeed=.25,r.userData.bobAmount=1.2,Ho.push(r)});for(let s=0;s<i;s++)t.load("./models/seagull-1.glb",l=>{const r=l.scene,u=(Math.random()-.5)*12,c=(Math.random()-.5)*12,d=4.2+Math.random()*4.2;if(r.position.set(u,d,c),r.scale.set(.028,.028,.028),r.traverse(h=>{h.isMesh&&(h.castShadow=!0,h.receiveShadow=!1)}),a.add(r),l.animations&&l.animations.length>0){const h=new We(r);l.animations.forEach(p=>{const m=h.clipAction(p);m.timeScale=.6+Math.random()*.3,m.play();const g=Math.random()*p.duration;m.time=g}),r.userData.mixer=h}r.userData.type="single",r.userData.bobTime=Math.random()*Math.PI*2,r.userData.bobSpeed=.35+Math.random()*.1,r.userData.bobAmount=.8,Ho.push(r)})}function Ud(a){Ho.forEach(e=>{e.userData.mixer&&e.userData.mixer.update(a),e.userData.bobTime+=a*e.userData.bobSpeed;const t=Math.sin(e.userData.bobTime)*e.userData.bobAmount;e.userData.baseHeight||(e.userData.baseHeight=e.position.y),e.position.y=e.userData.baseHeight+t})}function Xd(){Ho.forEach(a=>{a.parent&&a.parent.remove(a),a.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),Ho.length=0}function Gd(){Ma.forEach(a=>{a.parent&&a.parent.remove(a),a.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),Ma.length=0}const jd=new Ye,yr={};function Po(a){return new Promise((e,t)=>{jd.load(a,o=>{const n=[];o.scene.traverse(i=>{i.isMesh&&n.push({geometry:i.geometry,material:i.material,position:i.position.clone(),rotation:i.rotation.clone(),scale:i.scale.clone(),castShadow:!0,receiveShadow:!0})}),yr[a]=n,console.log(`Preloaded model: ${a}`),e(n)},void 0,o=>{console.error(`Failed to preload model ${a}:`,o),t(o)})})}let Ca=!1,ii=!1;function Zd(){return Ca||ii?Promise.resolve():(Ca=!0,console.log("🌴 Lazy loading win celebration models..."),Promise.all([Po("./models/palm_tree.glb"),Po("./models/ivory-cane-palm.glb"),Po("./models/olive-palm.glb"),Po("./models/tall-grass.glb"),Po("./models/lady-palm.glb"),Po("./models/bismarck-palm.glb")]).then(()=>{ii=!0,Ca=!1,console.log("✅ Win celebration models loaded!")}).catch(a=>{Ca=!1,console.error("Error preloading models:",a)}))}function qd(){return yr}window.addEventListener("resize",()=>{V.aspect=window.innerWidth/window.innerHeight,V.updateProjectionMatrix(),Pe.setSize(window.innerWidth,window.innerHeight)});const x=new cl;x.background=new ie(1118719);const V=new xi(65,window.innerWidth/window.innerHeight,.1,5e3),uo={introEnd:{x:0,y:.82,z:32},introMid:{x:0,y:3.24,z:16},birdsEye:{x:0,y:42,z:0},gameplay:{x:0,y:5.42,z:20.42}};V.position.set(uo.introEnd.x,uo.introEnd.y,uo.introEnd.z);V.lookAt(0,0,0);const Pe=new ll({antialias:!0});Pe.setSize(window.innerWidth,window.innerHeight);Pe.shadowMap.enabled=!0;Pe.shadowMap.type=ul;document.body.appendChild(Pe.domElement);const Yd=qd(),Ee=new bl(V,Pe.domElement);Ee.enableDamping=!0;Ee.dampingFactor=.05;Ee.minDistance=8.4;Ee.maxDistance=75;Ee.maxPolarAngle=Math.PI/1.9;Ee.enabled=!1;let ms=!1;const Kd=1800;let en=!1,Fe=new Zt;x.add(Fe);function $d(){ms=!0;const a=Date.now(),e=4100,t=[{...uo.birdsEye},{...uo.introMid},{...uo.introEnd}];function o(){const n=Date.now()-a,i=Math.min(n/e,1),s=i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;let l,r,u;s<.5?(l=s*2,r=t[0],u=t[1]):(l=(s-.5)*2,r=t[1],u=t[2]);const c=l<.5?2*l*l:1-Math.pow(-2*l+2,2)/2;V.position.x=r.x+(u.x-r.x)*c,V.position.y=r.y+(u.y-r.y)*c,V.position.z=r.z+(u.z-r.z)*c,V.lookAt(0,0,0),i<1?requestAnimationFrame(o):ms=!1}o()}function Jd(){const a=Date.now(),e={x:V.position.x,y:V.position.y,z:V.position.z},t={...uo.gameplay};function o(){const n=Date.now()-a,i=Math.min(n/Kd,1),s=1-Math.pow(1-i,3);V.position.x=e.x+(t.x-e.x)*s,V.position.y=e.y+(t.y-e.y)*s,V.position.z=e.z+(t.z-e.z)*s,V.lookAt(0,0,0),i<1&&requestAnimationFrame(o)}o()}const Qd=new dl(16777215,.486);x.add(Qd);const Ke=new xs(16777215,1.63);Ke.position.set(5,10,5);Ke.castShadow=!0;Ke.shadow.mapSize.width=2048;Ke.shadow.mapSize.height=2048;Ke.shadow.camera.near=.8;Ke.shadow.camera.far=60;Ke.shadow.camera.left=-15;Ke.shadow.camera.right=15;Ke.shadow.camera.top=15;Ke.shadow.camera.bottom=-15;Ke.shadow.bias=8e-4;Ke.shadow.normalBias=.02;x.add(Ke);let Ze,Rn;function eh(){Ze=new mn,Ze.scale.setScalar(285e4),x.add(Ze),Rn=new w;const a=Ze.material.uniforms;a.turbidity.value=1.21,a.rayleigh.value=.68,a.mieCoefficient.value=.002,a.mieDirectionalG.value=1.97;const e=ae.degToRad(84),t=ae.degToRad(68);Rn.setFromSphericalCoords(1,e,t),a.sunPosition.value.copy(Rn),Pe.toneMappingExposure=.5}eh();const wr=new xs(16754022,.4);wr.position.set(-5,4,-5);x.add(wr);const De=new gl({gravity:new at(0,-9.82,0)}),Fs=new Ei("ground"),Kt=new Ei("ball"),th=new vl(Fs,Kt,{friction:.0022,restitution:.3,contactEquationStiffness:1e6,contactEquationRelaxation:3,frictionEquationStiffness:1e6,frictionEquationRegularizationTime:3});De.addContactMaterial(th);new yl(x,De,{color:65280,scale:1});let P=Ft.getCurrentLevel();console.log(`Starting Level ${P.id}: ${P.name}`);let R=_i({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:De,groundMaterial:Fs,shape:P.terrainShape,waterLevel:P.waterLevel});Fe.add(R.mesh);let tn=R.size,ho=R.mesh,on=R.geometry,ke=R.material,Sr=R.body;on.attributes.position;R.config.falloffStart;R.config.falloffEnd;R.getHeightAt;let Ot=R.randomPosition,ps=R.sculpt,gs=R.updatePhysics;R.simpleNoise;qi(P.spawn);R.setRenderer(Pe);ke.uniforms.uUseWetnessMap.value=!0;ke.uniforms.uWetnessMap.value=R.wetnessMap.texture();let be=P.waterLevel,z=Ai({terrainSize:tn,waterLevel:be});x.add(z.mesh);x.add(z.hemisphereMesh);z.material.uniforms.uUseHeightmap.value=!0;z.material.uniforms.uTerrainHeightmap.value=R.heightmap.texture;z.material.uniforms.uHeightmapWorldSize.value=R.heightmap.worldSize;z.material.uniforms.uHeightmapMinHeight.value=R.heightmap.minHeight;z.material.uniforms.uHeightmapMaxHeight.value=R.heightmap.maxHeight;let br=z.mesh,N=z.material;N.uniforms.uTerrainWidthX.value=R.config.islandRadius;N.uniforms.uTerrainWidthZ.value=R.config.islandRadius;N.uniforms.uTerrainHeight.value=.5;const Jo=P.terrainShape||{};N.uniforms.uTerrainScaleX.value=Jo.scaleX||1;N.uniforms.uTerrainScaleY.value=Jo.scaleY||1;N.uniforms.uTerrainIrregularity.value=Jo.irregularity||1;N.uniforms.uTerrainBayAngle.value=Jo.bay?.angle||0;N.uniforms.uTerrainBayDepth.value=Jo.bay?.depth||0;N.uniforms.uTerrainBayWidth.value=Jo.bay?.width||0;N.uniforms.uIslandGroupOffset.value.set(Fe.position.x,Fe.position.z);let an=Ci({scene:x,waterLevel:be,maxRipples:68});Ld({scene:x,camera:V,controls:Ee,terrainMesh:ho,waterLevel:be,sculptTerrain:ps,updateTrimesh:gs});let k={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1,sailfish:!1};P.id>=1&&P.id<2&&(Oi(x),k.shark=!0);P.id>=2&&P.id<3&&(Hi(x),k.mantaRays=!0);P.id>=3&&P.id<4&&(Bi(x,a=>console.log("dolphins ready",a)),k.dolphins=!0);P.id>=4&&P.id<6&&(Ni(x),k.whales=!0);P.id===5&&P.id<7&&(Wi(x),k.ship=!0);P.id===6&&P.id<7&&(Vi(x),k.sailBoat=!0);P.id===3&&P.id<4&&(Ui(x,De,Kt),k.temple=!0);P.id===8&&P.id<9&&(Zi(x),k.sailfish=!0);P.id===10&&(Xi(x),k.whaleShark=!0);P.id===14&&(Gi(x),k.seagulls=!0);P.id>=1&&Ga(x,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:be,behavior:{swimDepth:be+-3.6865,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.022,max:.033},levels:[1,2,3,4,5,6,7,8,9,10]},e=>{console.log("Blue fish school loaded:",e.fish.length,"fish"),k.fishSchools=!0});[1,4,11].includes(P.id)&&Ga(x,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:be,behavior:{swimDepth:be+-3.1865,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},e=>{console.log("Clownfish school loaded:",e.fish.length,"fish"),k.fishSchools=!0});const fo=kl(),oh=nu(x,De,Kt);function ah(){ao=!0,jt=Date.now(),rn=!1,ln=!1,Ft.startLevelTimer(),Zd(),f.savedWinPercentage=ct,ct=1.01,Ka({scene:x,world:De,ballMaterial:Kt,randomTerrainPosition:Ot,createCloudIndicator:Ro,sharedCloudTexture:fo,sky:Ze,renderer:Pe,water:z}),Ko=Date.now()+f.startDelay+f.duration+8e3}xu({levelManager:Ft,animateCameraToGameplay:Jd,startGame:ah,transitionToNextLevel:ch});ir(P);rr(P.winPercentage);sr(P);let nn=P.multipleTargets||1,gt=[],yo=[],dt=[];const nh=5;function sh(a,e,t){for(const o of e){const n=a.x-o.x,i=a.z-o.z;if(Math.sqrt(n*n+i*i)<t)return!1}return!0}for(let a=0;a<nn;a++){let e,t=0;const o=50;do e=Ot(),t++;while(!sh(e,gt,nh)&&t<o);gt.push(e);const n=new Ds(1.5,1.5,.2,32),i=new dn({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.63,roughness:.7,transparent:!0,opacity:.246,depthWrite:!1}),s=new we(n,i);s.position.set(e.x,.1,e.z),s.renderOrder=2,Fe.add(s),yo.push(s),dt.push(i)}rd();mr(x,gt,fo);let ao=!1,Et=!1,vs=0,ys=!1,to=new Set,ct=P.winPercentage,Ko=0,ve=null,Io=!1,sn=0,On=null,Fn=null,kn=0,Hn=0,jt=0,rn=!1,ln=!1;function ih(){ao=!1,Et=!1,x.remove(ho),on.dispose(),ke.dispose(),De.removeBody(Sr),R.dispose(),x.remove(br),x.remove(z.hemisphereMesh),N.dispose(),z.mesh.geometry.dispose(),z.hemisphereMesh.geometry.dispose(),z.hemisphereMesh.material.dispose(),an.dispose(),[...Bo].forEach(e=>{x.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose(),De.removeBody(e.body)}),Bo.length=0,iu(),[...yo].forEach(e=>{x.remove(e),e.geometry.dispose(),e.material.dispose()}),yo.length=0,dt.length=0,gt.length=0,wd(x),ve&&(x.remove(ve),ve.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),ve=null),f.cloudData&&(f.cloudData.group&&(x.remove(f.cloudData.group),f.cloudData.group.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})),f.cloudData=null),gu(),Ze&&(Ze.material.uniforms.turbidity.value=1.21,Ze.material.uniforms.rayleigh.value=.68,Ze.material.uniforms.mieCoefficient.value=.002,Pe.toneMappingExposure=.5),Fd(),x.remove(Fe),Fe.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())});const a=[];x.children.forEach(e=>{e.isLight||e.isSky||e.isCamera||a.push(e)}),a.forEach(e=>{x.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),to.clear(),Io=!1,ur(),lr(),cr(),As(),Gd(),Xd(),k.fishSchools&&eu(x),k.shark&&wc(x),k.mantaRays&&_c(x),k.whales&&Ic(x),k.dolphins&&Fc(x),k.ship&&zc(x),k.sailBoat&&Bc(x),k.sailfish&&au(x),console.log("Level cleanup complete")}function rh(a){console.log(`Loading Level ${a}...`),Fe=new Zt,x.add(Fe),Ft.currentLevelId=a,Ft.saveCurrentLevel(),P=Ft.getCurrentLevel(),R=_i({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:De,groundMaterial:Fs,shape:P.terrainShape,waterLevel:P.waterLevel}),Fe.add(R.mesh),tn=R.size,ho=R.mesh,on=R.geometry,ke=R.material,Sr=R.body,on.attributes.position,R.config.falloffStart,R.config.falloffEnd,R.getHeightAt,Ot=R.randomPosition,ps=R.sculpt,gs=R.updatePhysics,R.simpleNoise,qi(P.spawn),R.setRenderer(Pe),ke.uniforms.uUseWetnessMap.value=!0,ke.uniforms.uWetnessMap.value=R.wetnessMap.texture(),ir(P),rr(P.winPercentage),be=P.waterLevel,z=Ai({terrainSize:tn,waterLevel:be}),x.add(z.mesh),x.add(z.hemisphereMesh),br=z.mesh,N=z.material,N.uniforms.uUseHeightmap.value=!0,N.uniforms.uTerrainHeightmap.value=R.heightmap.texture,N.uniforms.uHeightmapWorldSize.value=R.heightmap.worldSize,N.uniforms.uHeightmapMinHeight.value=R.heightmap.minHeight,N.uniforms.uHeightmapMaxHeight.value=R.heightmap.maxHeight,N.uniforms.uTerrainWidthX.value=R.config.islandRadius,N.uniforms.uTerrainWidthZ.value=R.config.islandRadius,N.uniforms.uTerrainHeight.value=.5;const e=P.terrainShape||{};N.uniforms.uTerrainScaleX.value=e.scaleX||1,N.uniforms.uTerrainScaleY.value=e.scaleY||1,N.uniforms.uTerrainIrregularity.value=e.irregularity||1,N.uniforms.uTerrainBayAngle.value=e.bay?.angle||0,N.uniforms.uTerrainBayDepth.value=e.bay?.depth||0,N.uniforms.uTerrainBayWidth.value=e.bay?.width||0,N.uniforms.uIslandGroupOffset.value.set(Fe.position.x,Fe.position.z),an=Ci({scene:x,waterLevel:be,maxRipples:68}),Od({terrainMesh:ho,waterLevel:be,sculptTerrain:ps,updateTrimesh:gs}),k={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1,sailfish:!1},P.id>=1&&P.id<2&&(Oi(x),k.shark=!0),P.id>=2&&P.id<3&&(Hi(x),k.mantaRays=!0),P.id>=3&&P.id<4&&(Bi(x),k.dolphins=!0),P.id>=4&&P.id<5&&(Ni(x),k.whales=!0),P.id>=5&&P.id<6&&(Wi(x),k.ship=!0),P.id>=6&&P.id<7&&(Vi(x),k.sailBoat=!0),P.id>=3&&P.id<4&&(Ui(x,De,Kt),k.temple=!0),P.id===10&&(Xi(x),k.whaleShark=!0),P.id===14&&(Gi(x),k.seagulls=!0),P.id===8&&(Zi(x),k.sailfish=!0),P.id>=1&&Ga(x,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:be,behavior:{swimDepth:be+-3.4285,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.022,max:.033},levels:[1,2,3,4,5,6,7,8,9,10]},()=>{k.fishSchools=!0}),[1,4,11].includes(P.id)&&Ga(x,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:be,behavior:{swimDepth:be+-3.18685,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},()=>{k.fishSchools=!0}),nn=P.multipleTargets||1,gt=[],yo=[],dt=[],Sd();function t(n,i,s){for(const l of i){const r=n.x-l.x,u=n.z-l.z;if(r*r+u*u<s*s)return!1}return!0}for(let n=0;n<nn;n++){let i=Ot(),s=0;const l=50;for(;!t(i,gt,5)&&s<l;)i=Ot(),s++;gt.push(i);const r=new Ds(1.5,1.5,.2,32),u=new dn({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.3,roughness:.7,transparent:!0,opacity:.6,depthWrite:!1}),c=new we(r,u);c.position.set(i.x,.1,i.z),c.renderOrder=2,Fe.add(c),yo.push(c),dt.push(u)}mr(x,gt,fo),ao=!1,Et=!1,vs=0,ys=!1,to=new Set,ct=P.winPercentage,Ko=0,Io=!1,jt=0,rn=!1,ln=!1,Ee.enabled=!1,ur();const o=document.getElementById("level-select-modal");o&&(o.classList.add("hidden"),o.style.display="none",o.style.animation=""),cr(),sr(P,!0),console.log(`Level ${a} loaded successfully!`)}const _o=Array.from({length:10},()=>new w),lh=Ee.maxDistance;function ch(){if(en)return;en=!0,fu(),du();const a=Ft.currentLevelId;Pu(),_u(),lr(),Ee.enabled=!1,Ee.maxDistance=1/0;const e=694,t=new w;V.getWorldDirection(t);const n=Math.atan2(t.z,t.x)+Math.PI,i=ae.degToRad(25),s=n-i,l=n+i;let r,u=0;do{r=Math.random()*Math.PI*2,u++;const _e=(r+Math.PI*2)%(Math.PI*2),xt=(s+Math.PI*2)%(Math.PI*2),J=(l+Math.PI*2)%(Math.PI*2);if(xt<J){if(_e<xt||_e>J)break}else if(_e<xt&&_e>J)break}while(u<100);const c=new w(Math.cos(r)*e,0,Math.sin(r)*e),d=V.position.clone(),h=Ee.target.clone(),p=V.fov,m=new w(z.mesh.position.x,z.mesh.position.y,z.mesh.position.z);V.rotation.x,V.rotation.y,V.rotation.z;const g=Wo(),v=g.playbackRate||1,S=Math.atan2(c.z-d.z,c.x-d.x),T=468,y=e*.38,b=26,M=4.82,C=460,I=_o[4].set(c.x-Math.cos(S)*C,c.y+M,c.z-Math.sin(S)*C),A=_o[5].set(d.x+Math.cos(S)*y,T,d.z+Math.sin(S)*y),H=_o[6].set(c.x-Math.cos(S)*b,c.y+M,c.z-Math.sin(S)*b),L=Math.atan2(c.z-m.z,c.x-m.x),W=_o[7].set(m.x+Math.cos(L)*y,T,m.z+Math.sin(L)*y),de=_o[8].set(c.x,m.y,c.z),Y=5600,K=.36;let ze=0,re=performance.now();const he=_e=>_e<.5?4*_e*_e*_e:1-Math.pow(-2*_e+2,3)/2;let Pa=!1,ot=!1;const $e=document.getElementById("level-story-overlay"),bt=document.getElementById("level-story-text"),So=Ft.getCurrentLevel();$e&&bt&&So.story&&(bt.textContent=So.story,$e.style.display="block");let Tt=!1,Nt=!1;const $t=_o[9],Mt=new w,bo=new w;new w;function To(_e){const xt=Math.min(.033,(_e-re)/1e3);re=_e,ze+=xt*1e3;const J=Math.min(ze/Y,1),Je=he(J),Bt=1-Je,Ae=Je*Je,Qo=Ae*Je,Mo=Bt*Bt,D=Mo*Bt,O=1+J*.048;g.playbackRate=v*O,V.position.set(D*d.x+3*Mo*Je*A.x+3*Bt*Ae*I.x+Qo*H.x,D*d.y+3*Mo*Je*A.y+3*Bt*Ae*I.y+Qo*H.y,D*d.z+3*Mo*Je*A.z+3*Bt*Ae*I.z+Qo*H.z);const F=65;V.fov=ae.lerp(p,F,Je),V.updateProjectionMatrix(),J>=.05&&!ot&&(ot=!0,N.uniforms.uFoamEnabled.value=!1);const U=.22,q=.62;!Tt&&J>=U&&$e&&(Tt=!0,$e.classList.add("visible")),!Nt&&J>=q&&$e&&(Nt=!0,$e.classList.remove("visible"));const j={panOut:.03,panIn:.92,lockNew:1};if(J<j.panOut)$t.copy(h);else if(J<j.panIn){const ge=(J-j.panOut)/(j.panIn-j.panOut),Dt=he(ge);Mt.set(Math.cos(S),0,Math.sin(S)).multiplyScalar(y*2),bo.copy(V.position).add(Mt).setY(V.position.y-96),$t.lerpVectors(h,bo,Dt)}else{const ge=(J-j.panIn)/(j.lockNew-j.panIn),Dt=he(ge);$t.lerpVectors($t,c,Dt)}Ee.target.copy($t),Ee.update();const ne=V.rotation.z,Q=.15;let B=0;if(J<.2){const ge=J/.2;B=Q*ge}else if(J<.35)B=Q;else if(J<.55){const ge=(J-.35)/.2;B=Q*(1-ge)}else B=0;V.rotation.z=ne+B,J>=K&&!Pa&&(Pa=!0,ih(),rh(a),Fe.position.copy(c));const G=.086,Z=.192,le=1.16,_=.664;let fe=m.x,me=m.z;if(J>G){const ge=(J-G)/(1-G),Dt=Math.max(ge-Z,0),ea=Math.min(Dt/_,3),Re=ea*ea*(3-2*ea),Qe=1+(le-1)*Re,ta=Math.min(ge*Qe,1),Jt=he(ta),xo=1-Jt;fe=xo*xo*m.x+2*xo*Jt*W.x+Jt*Jt*de.x,me=xo*xo*m.z+2*xo*Jt*W.z+Jt*Jt*de.z}if(z.mesh.position.set(fe,z.mesh.position.y,me),z.hemisphereMesh.position.set(z.mesh.position.x,40.88,z.mesh.position.z),z.material.uniforms.uMeshOffset.value.set(z.mesh.position.x,z.mesh.position.z),J<1){requestAnimationFrame(To);return}const pe=c.clone().negate();Fe.position.add(pe),z.mesh.position.add(pe),z.material.uniforms.uMeshOffset.value.set(z.mesh.position.x,z.mesh.position.z),z.hemisphereMesh.position.x+=pe.x,z.hemisphereMesh.position.z+=pe.z,V.position.add(pe),Ee.target.copy(c).add(pe),Ee.update(),g.playbackRate=v,uh()}requestAnimationFrame(To)}function uh(){Ee.maxDistance=lh,en=!1,N.uniforms.uFoamEnabled.value=!0;const a=document.getElementById("level-story-overlay");a&&(a.classList.remove("visible"),a.style.display="none"),P.id>1&&Eu(),console.log("Transition complete – welcome to the new island!")}let ws=!1,zn=!1,Nn=!1,ri=0,li=0;document.addEventListener("visibilitychange",()=>{if(document.hidden){ws=!0,li=Date.now(),cn.stop();const a=ei();Nn=!a.paused,Nn&&(ri=a.volume);const e=Wo();zn=!e.paused,zn&&e.pause(),As(),mu()}else{ws=!1;const a=Date.now()-li;sn>0&&(sn+=a),Ko>0&&(Ko+=a),jt>0&&(jt+=a);const e={scene:x,world:De,ballMaterial:Kt,randomTerrainPosition:R.randomPosition,createCloudIndicator:Ro,sharedCloudTexture:fo,sky:Ze,renderer:Pe,water:z};pu(e,!0),cn.start();const t=Wo();if(zn&&_s()&&t.play().catch(o=>console.log("Failed to resume background music:",o)),Nn){const o=ei();o.volume=ri,o.play().catch(n=>console.log("Failed to resume jungle sound:",n))}}});const cn=new hl,ci=new wo,ui=new wo,Ia=new w,La=new w,di=new w,hi=new w;let fi=0;function Ss(){if(ws){Pe.render(x,V),requestAnimationFrame(Ss);return}const a=cn.getDelta();De.step(1/60,a,3),!en&&!ms&&Ee.update(),Rd();const e=Bo.filter(c=>c.active);e.forEach(c=>{const d=c.body.position.x,h=c.body.position.z,p=c.body.position.y;if(!c.hasSpawnedRipple){const g=p-c.radius,v=c.body.velocity.y;if(v<0&&g<=be-.685){const T=(be-g)/Math.abs(v),y=.142,b=d-c.body.velocity.x*T+c.body.velocity.x*y,M=h-c.body.velocity.z*T+c.body.velocity.z*y,C=N.uniforms.uTime.value,I=Fl(b,M,C),A=be+I-.05;an.spawnRipple(b,M,{size:c.radius*3,speed:1,color:new ie(11197951),y:A}),ru(c.radius),c.hasSpawnedRipple=!0}}if(p-c.radius<be-.88){c.active=!1,x.remove(c.mesh),De.removeBody(c.body),to.has(c)&&to.delete(c);return}Ia.set(d,20,h),La.set(0,-1,0),ci.set(Ia,La);const m=ci.intersectObject(ho);if(m.length>0){const g=m[0].point.y;p-c.radius<g-.55&&(c.body.position.y=g+c.radius+.2,c.body.velocity.y=Math.max(0,c.body.velocity.y))}}),su(a),e.forEach((c,d)=>{c.mesh.position.copy(c.body.position);const h=c.body.position.y-c.radius;Ia.set(c.body.position.x,20,c.body.position.z),La.set(0,-1,0),ui.set(Ia,La);const p=ui.intersectObject(ho);let m=!1,g=-100;p.length>0&&(g=p[0].point.y,m=h<=g+.3&&g>be+.5);const v=c.body.velocity,S=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);m&&S>.3&&vd(x,c,g);for(let T=d+1;T<e.length;T++){const y=e[T];if(!y.active)continue;const b=c.body.position.x-y.body.position.x,M=c.body.position.z-y.body.position.z;if(b*b+M*M>1)continue;const I=c.body.position.y-y.body.position.y,A=Math.sqrt(b*b+I*I+M*M),H=c.radius+y.radius;if(A<H){const L=c.radius>=y.radius?c:y,W=c.radius>=y.radius?y:c,de=c.radius**3+y.radius**3,Y=Math.pow(de,1/3),K=L.body.mass+W.body.mass;L.body.velocity.x=(L.body.velocity.x*L.body.mass+W.body.velocity.x*W.body.mass)/K,L.body.velocity.y=(L.body.velocity.y*L.body.mass+W.body.velocity.y*W.body.mass)/K,L.body.velocity.z=(L.body.velocity.z*L.body.mass+W.body.velocity.z*W.body.mass)/K,L.radius=Y,L.body.mass=K,De.removeBody(L.body),L.body.shapes=[new fn(Y)],L.body.updateBoundingRadius(),De.addBody(L.body),L.mesh.geometry=vn.get(Y),W.active=!1,x.remove(W.mesh),De.removeBody(W.body)}}});const t=3,o=t*t,n=1.5;for(let c=0;c<e.length;c++)for(let d=c+1;d<e.length;d++){const h=e[c],p=e[d],m=p.body.position.x-h.body.position.x,g=p.body.position.z-h.body.position.z;if(m*m+g*g>o)continue;const S=p.body.position.y-h.body.position.y,T=Math.sqrt(m*m+S*S+g*g);if(T<t&&T>.1){const y=m/T,b=S/T,M=g/T,C=n*(1-T/t);h.body.velocity.x+=y*C*a,h.body.velocity.y+=b*C*a,h.body.velocity.z+=M*C*a,p.body.velocity.x-=y*C*a,p.body.velocity.y-=b*C*a,p.body.velocity.z-=M*C*a}}for(let c=0;c<yo.length;c++)yo[c].rotation.y+=a*.5;dd(a,dt),hd(a),z.update(N.uniforms.uTime.value+a),fi++,fi%2===0&&(R.wetnessMap.update(Pe,N,N.uniforms.uTime.value),ke.uniforms.uWetnessMap.value=R.wetnessMap.texture()),ke.uniforms.uTime.value=N.uniforms.uTime.value,ke.uniforms.uWaveAmplitude.value=N.uniforms.uWaveAmplitude.value,ke.uniforms.uWaveFrequency.value=N.uniforms.uWaveFrequency.value,ke.uniforms.uWaveHeightMultiplier.value=N.uniforms.uWaveHeightMultiplier.value,ke.uniforms.uWaterCurvature.value=N.uniforms.uCurvature.value;const i=Fe.position;ke.uniforms.uWaterMeshOffset.value.set(N.uniforms.uMeshOffset.value.x-i.x,N.uniforms.uMeshOffset.value.y-i.z),ke.uniforms.uWaterMeshPosition.value.set(z.mesh.position.x-i.x,z.mesh.position.z-i.z),N.uniforms.uIslandGroupOffset.value.set(i.x,i.z),an.update(a),k.shark&&yc(a),k.mantaRays&&Pc(a,x),k.dolphins&&Oc(a),k.whales&&Cc(a),k.ship&&Hc(a),k.sailBoat&&Nc(a),k.whaleShark&&Wc(a),k.seagulls&&Vc(a),k.fishSchools&&Qc(a,f.isActive),k.sailfish&&ou(a),fd(e,gt,De,to,cu,Iu),md(x,a,gt);let s=0;to.size>0&&to.forEach(c=>{s+=c.body.mass});const l=Math.min(s/Aa()*100,100);if(Au(l),gd(V,a,Et,vs,dt),!Et&&Aa()>0&&s>=Aa()*ct){Et=!0,vs=Date.now(),setTimeout(()=>{const c=s/Aa();console.log(`Final water collected: ${Math.round(c*100)}% (win at ${Math.round(ct*100)}%)`);const d=kd();Ft.completeLevel(3,c,d).then(h=>{console.log("Level completed! Score:",h),h.valid!==!1&&Ju(h)})},2e3),uu(),Cu();for(let c=0;c<nn;c++)dt[c]&&(dt[c].color.setHex(255),dt[c].emissive.setHex(255),dt[c].emissiveIntensity=1);Du(),Bd({scene:x,terrainMaterial:ke,terrainMesh:ho,terrainSize:tn,modelCache:Yd}),ys=!0}yd(a),ys&&(Wd(cn.getElapsedTime()),Ud(a));const r=f.isActive;vu({gameStarted:ao,scene:x,camera:V,dt:a,sky:Ze,renderer:Pe,updateCloud:Gn,updateRainParticles:jn,setRainOpacity:Fa}),r&&!f.isActive&&f.savedWinPercentage!==void 0&&(ct=f.savedWinPercentage,delete f.savedWinPercentage,console.log("Storm ended - win condition restored!"));const u=Date.now();if(ao&&!Et&&!rn&&jt>0&&u-jt>=12e4&&(f.isActive||(console.log("🌩️ Second storm incoming!"),rn=!0,f.savedWinPercentage=ct,ct=1.01,Ka({scene:x,world:De,ballMaterial:Kt,randomTerrainPosition:Ot,createCloudIndicator:Ro,sharedCloudTexture:fo,sky:Ze,renderer:Pe,water:z},!0))),ao&&!Et&&!ln&&jt>0&&u-jt>=21e4&&(f.isActive||(console.log("🌩️ Third storm incoming!"),ln=!0,f.savedWinPercentage=ct,ct=1.01,Ka({scene:x,world:De,ballMaterial:Kt,randomTerrainPosition:Ot,createCloudIndicator:Ro,sharedCloudTexture:fo,sky:Ze,renderer:Pe,water:z},!1))),ao&&te.enabled&&!Et&&!Io&&u>=Ko&&(Io=!0,sn=u,Hn=0,kn=u,On=Ot(),Fn=Ot(),ve=Ro({startX:On.x,startZ:On.z,endX:Fn.x,endZ:Fn.z,cloudTexture:fo}),x.add(ve),ve.userData.drizzleSound=er()),Io&&ve){const c=u-sn,d=Math.min(c/te.cloudDuration,1),{cloud:h,cloudMaterial:p,startPos:m,endPos:g,baseOpacity:v}=ve.userData,S=m.x+(g.x-m.x)*d,T=m.z+(g.z-m.z)*d;ve.position.x=S,ve.position.z=T,h.visible||(h.visible=!0),h.getWorldPosition(di);const y=V.position.distanceTo(di);if(f.isActive&&f.cloudData){const M=f.cloudData.group.userData.cloud;M.getWorldPosition(hi),V.position.distanceTo(hi)>y?(M.renderOrder=10,h.renderOrder=11):(h.renderOrder=10,M.renderOrder=11)}else h.renderOrder=10;Gn(ve,V,a),h.rotation.y=-performance.now()/7500;let b;if(c<te.fadeInDuration){const M=Math.max(0,c/te.fadeInDuration);b=v*M}else if(c>te.cloudDuration-te.fadeOutDuration){const M=(c-(te.cloudDuration-te.fadeOutDuration))/te.fadeOutDuration;b=v*Math.max(0,1-M)}else b=v;p.uniforms.opacity.value=Math.max(0,b),jn(ve,a),Fa(ve,b*.6),!Et&&Hn<te.dropletsPerCloud&&u-kn>=te.dropletInterval&&c>te.fadeInDuration&&(oh(ve.position.x,ve.position.z),Hn++,kn=u),c>=te.cloudDuration&&(ve.userData.drizzleSound&&tr(ve.userData.drizzleSound),x.remove(ve),ve.traverse(M=>{M.geometry&&M.geometry.dispose(),M.material&&M.material.dispose()}),ve=null,Io=!1,Ko=u+te.interval)}Pe.render(x,V),requestAnimationFrame(Ss)}function dh(){const a=document.getElementById("page-loading-screen");a&&setTimeout(()=>{a.classList.add("hidden"),setTimeout(()=>{a.remove()},500)},100)}dh();$d();Ss();
