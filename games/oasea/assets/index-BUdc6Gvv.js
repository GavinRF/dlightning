import{a as ve,c as et,d as ti,U as oi,B as ai,V as b,e as dr,f as Do,T as Mo,Q as It,g as xs,h as pe,R as hr,i as fr,j as ee,P as bn,k as ni,l as Jo,m as mr,n as oe,o as pr,p as gr,W as nn,q as sn,r as rn,L as Qe,O as Mn,D as ot,b as qa,s as Qt,S as ss,t as ca,u as vr,v as yr,G as Vt,w as wr,x as Sr,y as is,N as si,z as rs,A as br,E as Tn,H as ii,I as Mr,J as qo,K as ri,X as pt,Y as Lt,Z as Qo,_ as Tr,$ as xr,a0 as ls,a1 as Rt,a2 as xn,a3 as Dn,a4 as li,a5 as Dr,a6 as Er,a7 as ci,a8 as Pr,a9 as _r,aa as Cr,ab as ui,ac as Ar,ad as Ir,ae as ln,af as Lr,ag as Ya,M as Et,ah as Rr,ai as Or,aj as Fr,ak as kr,al as Hr,am as di,an as zr,ao as Nr,ap as Br,aq as Wr,ar as hi,as as Vr,at as Ds,au as Es,av as Ps,aw as _s,ax as Cs,ay as Ur,az as Xr,aA as Gr,aB as jr,aC as cs,aD as We,aE as Zr,C as us,aF as qr,aG as Yr,aH as uo,aI as Kr,aJ as $r,aK as Jr,aL as Qr,aM as el,aN as tl}from"./three-a87GWk7o.js";import{B as Ka,T as ol,V as Je,C as al,a as nl,S as ds,W as sl,M as fi,b as il,c as rl}from"./physics-Cb4MsTzb.js";import{c as ll,_ as Ut}from"./supabase-D6xm0ZbH.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();class $a extends ve{constructor(){const e=$a.SkyShader,t=new et({name:e.name,uniforms:oi.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:ti,depthWrite:!1});super(new ai(1,1,1),t),this.isSky=!0}}$a.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new b},up:{value:new b(0,1,0)}},vertexShader:`
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

		}`};const As={type:"change"},hs={type:"start"},mi={type:"end"},fa=new hr,Is=new fr,cl=Math.cos(70*ee.DEG2RAD),ye=new b,ke=2*Math.PI,$={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},cn=1e-6;class ul extends dr{constructor(e,t=null){super(e,t),this.state=$.NONE,this.target=new b,this.cursor=new b,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Do.ROTATE,MIDDLE:Do.DOLLY,RIGHT:Do.PAN},this.touches={ONE:Mo.ROTATE,TWO:Mo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new b,this._lastQuaternion=new It,this._lastTargetPosition=new b,this._quat=new It().setFromUnitVectors(e.up,new b(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new xs,this._sphericalDelta=new xs,this._scale=1,this._panOffset=new b,this._rotateStart=new pe,this._rotateEnd=new pe,this._rotateDelta=new pe,this._panStart=new pe,this._panEnd=new pe,this._panDelta=new pe,this._dollyStart=new pe,this._dollyEnd=new pe,this._dollyDelta=new pe,this._dollyDirection=new b,this._mouse=new pe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=hl.bind(this),this._onPointerDown=dl.bind(this),this._onPointerUp=fl.bind(this),this._onContextMenu=Sl.bind(this),this._onMouseWheel=gl.bind(this),this._onKeyDown=vl.bind(this),this._onTouchStart=yl.bind(this),this._onTouchMove=wl.bind(this),this._onMouseDown=ml.bind(this),this._onMouseMove=pl.bind(this),this._interceptControlDown=bl.bind(this),this._interceptControlUp=Ml.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(As),this.update(),this.state=$.NONE}update(e=null){const t=this.object.position;ye.copy(t).sub(this.target),ye.applyQuaternion(this._quat),this._spherical.setFromVector3(ye),this.autoRotate&&this.state===$.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let o=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(o)&&isFinite(a)&&(o<-Math.PI?o+=ke:o>Math.PI&&(o-=ke),a<-Math.PI?a+=ke:a>Math.PI&&(a-=ke),o<=a?this._spherical.theta=Math.max(o,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(o+a)/2?Math.max(o,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let i=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const s=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),i=s!=this._spherical.radius}if(ye.setFromSpherical(this._spherical),ye.applyQuaternion(this._quatInverse),t.copy(this.target).add(ye),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let s=null;if(this.object.isPerspectiveCamera){const l=ye.length();s=this._clampDistance(l*this._scale);const r=l-s;this.object.position.addScaledVector(this._dollyDirection,r),this.object.updateMatrixWorld(),i=!!r}else if(this.object.isOrthographicCamera){const l=new b(this._mouse.x,this._mouse.y,0);l.unproject(this.object);const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),i=r!==this.object.zoom;const u=new b(this._mouse.x,this._mouse.y,0);u.unproject(this.object),this.object.position.sub(u).add(l),this.object.updateMatrixWorld(),s=ye.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;s!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position):(fa.origin.copy(this.object.position),fa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(fa.direction))<cl?this.object.lookAt(this.target):(Is.setFromNormalAndCoplanarPoint(this.object.up,this.target),fa.intersectPlane(Is,this.target))))}else if(this.object.isOrthographicCamera){const s=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),s!==this.object.zoom&&(this.object.updateProjectionMatrix(),i=!0)}return this._scale=1,this._performCursorZoom=!1,i||this._lastPosition.distanceToSquared(this.object.position)>cn||8*(1-this._lastQuaternion.dot(this.object.quaternion))>cn||this._lastTargetPosition.distanceToSquared(this.target)>cn?(this.dispatchEvent(As),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?ke/60*this.autoRotateSpeed*e:ke/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){ye.setFromMatrixColumn(t,0),ye.multiplyScalar(-e),this._panOffset.add(ye)}_panUp(e,t){this.screenSpacePanning===!0?ye.setFromMatrixColumn(t,1):(ye.setFromMatrixColumn(t,0),ye.crossVectors(this.object.up,ye)),ye.multiplyScalar(e),this._panOffset.add(ye)}_pan(e,t){const o=this.domElement;if(this.object.isPerspectiveCamera){const a=this.object.position;ye.copy(a).sub(this.target);let i=ye.length();i*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*i/o.clientHeight,this.object.matrix),this._panUp(2*t*i/o.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/o.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/o.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const o=this.domElement.getBoundingClientRect(),a=e-o.left,i=t-o.top,s=o.width,l=o.height;this._mouse.x=a/s*2-1,this._mouse.y=-(i/l)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ke*this._rotateDelta.x/t.clientHeight),this._rotateUp(ke*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-ke*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._rotateStart.set(o,a)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panStart.set(o,a)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),o=e.pageX-t.x,a=e.pageY-t.y,i=Math.sqrt(o*o+a*a);this._dollyStart.set(0,i)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const o=this._getSecondPointerPosition(e),a=.5*(e.pageX+o.x),i=.5*(e.pageY+o.y);this._rotateEnd.set(a,i)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(ke*this._rotateDelta.x/t.clientHeight),this._rotateUp(ke*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panEnd.set(o,a)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),o=e.pageX-t.x,a=e.pageY-t.y,i=Math.sqrt(o*o+a*a);this._dollyEnd.set(0,i),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const s=(e.pageX+t.x)*.5,l=(e.pageY+t.y)*.5;this._updateZoomParameters(s,l)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new pe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,o={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:o.deltaY*=16;break;case 2:o.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(o.deltaY*=10),o}}function dl(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function hl(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function fl(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(mi),this.state=$.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function ml(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Do.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=$.DOLLY;break;case Do.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=$.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=$.ROTATE}break;case Do.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=$.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=$.PAN}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(hs)}function pl(n){switch(this.state){case $.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case $.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case $.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function gl(n){this.enabled===!1||this.enableZoom===!1||this.state!==$.NONE||(n.preventDefault(),this.dispatchEvent(hs),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(mi))}function vl(n){this.enabled!==!1&&this._handleKeyDown(n)}function yl(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Mo.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=$.TOUCH_ROTATE;break;case Mo.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=$.TOUCH_PAN;break;default:this.state=$.NONE}break;case 2:switch(this.touches.TWO){case Mo.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=$.TOUCH_DOLLY_PAN;break;case Mo.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=$.TOUCH_DOLLY_ROTATE;break;default:this.state=$.NONE}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(hs)}function wl(n){switch(this._trackPointer(n),this.state){case $.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case $.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case $.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case $.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=$.NONE}}function Sl(n){this.enabled!==!1&&n.preventDefault()}function bl(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ml(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const{lerp:qt}=ee,_e=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];for(let n=0;n<256;n++)_e[256+n]=_e[n];function un(n){return n*n*n*(n*(n*6-15)+10)}function kt(n,e,t,o){const a=n&15,i=a<8?e:t,s=a<4?t:a==12||a==14?e:o;return((a&1)==0?i:-i)+((a&2)==0?s:-s)}class Tl{noise(e,t,o){const a=Math.floor(e),i=Math.floor(t),s=Math.floor(o),l=a&255,r=i&255,u=s&255;e-=a,t-=i,o-=s;const c=e-1,d=t-1,h=o-1,p=un(e),f=un(t),g=un(o),v=_e[l]+r,w=_e[v]+u,M=_e[v+1]+u,y=_e[l+1]+r,S=_e[y]+u,T=_e[y+1]+u;return qt(qt(qt(kt(_e[w],e,t,o),kt(_e[S],c,t,o),p),qt(kt(_e[M],e,d,o),kt(_e[T],c,d,o),p),f),qt(qt(kt(_e[w+1],e,t,h),kt(_e[S+1],c,t,h),p),qt(kt(_e[M+1],e,d,h),kt(_e[T+1],c,d,h),p),f),g)}}function pi(n={}){const{segments:e=34,normalMapPath:t="sand-normal.jpg",physicsWorld:o,groundMaterial:a,shape:i={},waterLevel:s=-2.87}=n,l=i.size||18,r={scaleX:i.scaleX||1,scaleY:i.scaleY||1,tilt:i.tilt||{angle:0,amount:0},bay:i.bay||{angle:0,depth:0,width:0},irregularity:i.irregularity||1,distortion:i.distortion||{frequency:.5,amplitude:.3,randomness:.2},turbulence:i.turbulence||null,islandRadius:i.islandRadius||l*.365},u=r.islandRadius,c=u+u*0,d=u+u*.26,h=u+u*.75,p=5.8,f=-4.6,g=512,v=new bn(l,l,e,e),w=v.attributes.position;function M(x,O){const F=Math.atan2(O,x),V=Math.sqrt(x*x+O*O),q=Math.sin(F*3+V*.5)*.4,G=Math.sin(F*5-V*.3)*.25,te=Math.sin(F*7+V*.7)*.2;return(q+G+te)*r.irregularity}function y(x,O){const F=x/r.scaleX,V=O/r.scaleY;let q=Math.sqrt(F*F+V*V);if(r.bay.depth>0){const G=Math.atan2(O,x),te=r.bay.angle,Q=r.bay.width;let N=Math.abs(G-te);if(N>Math.PI&&(N=2*Math.PI-N),N<Q){const X=Math.cos(N/Q*Math.PI/2);q+=r.bay.depth*X}}return q}function S(x,O){if(r.tilt.amount===0)return 0;const F=Math.atan2(O,x),V=r.tilt.angle;return Math.cos(F-V)*r.tilt.amount}function T(x,O){if(!r.turbulence)return 0;const{strength:F=3,scale:V=.3,octaves:q=3}=r.turbulence;let G=0,te=F,Q=V,N=0;for(let X=0;X<q;X++){const Z=Math.sin(x*Q+X*10)*Math.cos(O*Q+X*5),ne=Math.sin((x+O)*Q*1.3+X*7),P=Math.cos((x-O)*Q*.7+X*3),ue=(Z+ne*.5+P*.3)*te;G+=ue,N+=te,te*=.5,Q*=2}return G/N*F}for(let x=0;x<w.count;x++){const O=w.getX(x),F=w.getY(x),V=w.getZ(x),q=y(O,F),G=M(O,F)*1.5,te=u+G,Q=c+G*.8,N=d+G*.6,X=h+G*.4,Z=r.distortion,ne=.51+Math.sin(O*Z.frequency)*Math.cos(F*Z.frequency*1.04)*Z.amplitude+Math.random()*Z.randomness;let P;if(q<te)P=ne;else if(q<Q){const Pe=(q-te)/(Q-te),Ge=Pe*Pe*(3-2*Pe);P=ne*(1-Ge*.4)}else if(q<N){const Pe=(q-Q)/(N-Q),Ge=Pe*Pe*(3-2*Pe);P=ne*.6-Ge*3.5}else if(q<X){const Pe=ne*.6-3.5,Ge=(q-N)/(X-N),Vo=Ge*Ge*(3-2*Ge);P=Pe-Vo*(63+Pe)}else P=-63;P+=S(O,F),q<N&&(P+=T(O,F));const ue=l/2,de=Math.abs(O)/ue,he=Math.abs(F)/ue,fe=Math.max(de,he),wt=.85,Wo=1;if(fe>wt&&P>s-2){const Pe=(fe-wt)/(Wo-wt),Ge=Pe*Pe*(3-2*Pe),Vo=s-2;P=Math.min(P,P*(1-Ge)+Vo*Ge)}w.setZ(x,V+P)}w.needsUpdate=!0,v.computeVertexNormals();function A(x){const F=x.attributes.position,V=x.attributes.uv,q=x.index,G=e+1,te=[],Q=[],N=[];for(let P=0;P<F.count;P++)te.push(F.getX(P),F.getY(P),F.getZ(P)),Q.push(V.getX(P),V.getY(P));for(let P=0;P<q.count;P++)N.push(q.getX(P));const X=F.count;for(let P=0;P<F.count;P++)te.push(F.getX(P),F.getY(P),-63),Q.push(V.getX(P),V.getY(P));function Z(P,ue){return P*G+ue}for(let P=0;P<e;P++){const ue=Z(0,P),de=Z(0,P+1),he=ue+X,fe=de+X;N.push(ue,de,he),N.push(de,fe,he)}for(let P=0;P<e;P++){const ue=Z(e,P),de=Z(e,P+1),he=ue+X,fe=de+X;N.push(ue,he,de),N.push(de,he,fe)}for(let P=0;P<e;P++){const ue=Z(P,0),de=Z(P+1,0),he=ue+X,fe=de+X;N.push(ue,he,de),N.push(de,he,fe)}for(let P=0;P<e;P++){const ue=Z(P,e),de=Z(P+1,e),he=ue+X,fe=de+X;N.push(ue,de,he),N.push(de,fe,he)}const ne=new qa;return ne.setAttribute("position",new Qt(new Float32Array(te),3)),ne.setAttribute("uv",new Qt(new Float32Array(Q),2)),ne.setIndex(N),ne.computeVertexNormals(),ne}const I=A(v);v.dispose();const C=I,k=C.attributes.position;function L(x,O){const F=y(x,O),V=M(x,O)*1.5,q=u+V,G=c+V*.8,te=d+V*.6,Q=h+V*.4,N=.51+Math.sin(x*.5)*Math.cos(O*.52)*.3;let X;if(F<q)X=N;else if(F<G){const Z=(F-q)/(G-q),ne=Z*Z*(3-2*Z);X=N*(1-ne*.4)}else if(F<te){const Z=(F-G)/(te-G),ne=Z*Z*(3-2*Z);X=N*.6-ne*3.5}else if(F<Q){const Z=N*.6-3.5,ne=(F-te)/(Q-te),P=ne*ne*(3-2*ne);X=Z-P*(63+Z)}else X=-63;return X+=S(x,O),X}function B(){const x=(Math.random()-.5)*(l*.8),O=(Math.random()-.5)*(l*.8);return{x,z:O}}function le(){const x=[],O=[];for(let V=0;V<k.count;V++)x.push(k.getX(V),k.getY(V),k.getZ(V));const F=C.index;for(let V=0;V<F.count;V++)O.push(F.getX(V));return new ol(x,O)}const Y=le(),K=new Ka({mass:0,material:a});K.addShape(Y),K.quaternion.setFromEuler(-Math.PI/2,0,0),o.addBody(K);function Fe(){o.removeBody(K);const x=le();K.shapes=[x],K.updateBoundingRadius(),K.updateAABB(),o.addBody(K)}let ae=null;function ce(x,O){const q=k.count/2;for(let G=0;G<q;G++){const te=k.getX(G),Q=k.getY(G),N=te-x.x,X=Q-x.y,Z=N*N+X*X;if(Z<4){const P=1-Math.sqrt(Z)/2,de=k.getZ(G)+O*P*.02,he=Math.max(f,Math.min(p,de));k.setZ(G,he)}}k.needsUpdate=!0,C.computeVertexNormals(),C.computeBoundingBox(),ae&&mo(ae)}const $e=new ni().load(t);$e.wrapS=Jo,$e.wrapT=Jo,$e.repeat.set(16,16);const Xe=new et({uniforms:oi.merge([mr.lights,{normalMap:{value:$e},midLowColor:{value:new b(.9,.6,.2)},midColor:{value:new b(1,.8,.3)},midHighColor:{value:new b(1,.6,.4)},uFogColor:{value:new oe(943004)},uFogStart:{value:-18.87},uFogEnd:{value:-2.87},depthTest:!0,uTime:{value:0},uWaterLevel:{value:s},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uFoamDepth:{value:.35},uFoamEnabled:{value:!1},uWaterMeshOffset:{value:new pe(0,0)},uWaterMeshPosition:{value:new pe(0,0)},uWaterCurvature:{value:2e-5},uWetnessMap:{value:null},uWetnessMapSize:{value:g},uUseWetnessMap:{value:!1}}]),lights:!0,vertexShader:`
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
    `,transparent:!0,depthWrite:!0}),vt=new ve(C,Xe);vt.rotation.x=-Math.PI/2,vt.castShadow=!0,vt.receiveShadow=!0,vt.renderOrder=.5,vt.customDepthMaterial=new pr({depthPacking:gr});const ho=512,Gt=new nn(ho,ho,{minFilter:Qe,magFilter:Qe,format:rn,type:sn}),Ot=new Mn(-l/2,l/2,l/2,-l/2,.1,100);Ot.position.set(0,50,0),Ot.lookAt(0,0,0),Ot.updateProjectionMatrix();const jt=new et({vertexShader:`
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
    `,uniforms:{uMinHeight:{value:f},uMaxHeight:{value:p}},side:ot}),fo=new ve(C,jt);fo.rotation.x=-Math.PI/2;function mo(x){if(!x){console.warn("updateHeightmapTexture: renderer not provided");return}const O=x.getRenderTarget();x.setRenderTarget(Gt),x.render(fo,Ot),x.setRenderTarget(O)}const ha=new nn(g,g,{minFilter:Qe,magFilter:Qe,format:rn,type:sn}),Ie=new nn(g,g,{minFilter:Qe,magFilter:Qe,format:rn,type:sn});let yt=ha,J=Ie;const at=new bn(2,2),Ft=new Mn(-1,1,1,-1,0,1),Le=new et({uniforms:{uHeightmap:{value:Gt.texture},uPreviousWetness:{value:null},uWaterLevel:{value:s},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uTime:{value:0},uDecayRate:{value:.98},uMinHeight:{value:f},uMaxHeight:{value:p},uTerrainSize:{value:l},uMeshOffset:{value:new pe(0,0)},uCurvature:{value:2e-5}},vertexShader:`
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
    `}),Bo=new ve(at,Le);function po(x,O,F){if(!x||!O)return;Le.uniforms.uWaterLevel.value=O.uniforms.uWaterLevel?.value??s,Le.uniforms.uWaveAmplitude.value=O.uniforms.uWaveAmplitude?.value??.26,Le.uniforms.uWaveFrequency.value=O.uniforms.uWaveFrequency?.value??4.2,Le.uniforms.uWaveHeightMultiplier.value=O.uniforms.uWaveHeightMultiplier?.value??4.13,Le.uniforms.uMeshOffset.value.copy(O.uniforms.uMeshOffset?.value??new pe(0,0)),Le.uniforms.uCurvature.value=O.uniforms.uCurvature?.value??2e-5,Le.uniforms.uTime.value=F,Le.uniforms.uPreviousWetness.value=J.texture;const V=x.getRenderTarget();x.setRenderTarget(yt),x.render(Bo,Ft),x.setRenderTarget(V);const q=yt;yt=J,J=q}return{mesh:vt,geometry:C,material:Xe,body:K,size:l,getHeightAt:L,randomPosition:B,sculpt:ce,updatePhysics:Fe,simpleNoise:M,config:{size:l,segments:e,islandRadius:u,falloffStart:c,falloffEnd:d,fanOutEnd:h,maxHeight:p,minDepth:f},setColors(x={}){x.midLow&&Xe.uniforms.midLowColor.value.copy(x.midLow),x.mid&&Xe.uniforms.midColor.value.copy(x.mid),x.midHigh&&Xe.uniforms.midHighColor.value.copy(x.midHigh)},heightmap:{renderTarget:Gt,texture:Gt.texture,camera:Ot,mesh:fo,update:mo,size:ho,worldSize:l,minHeight:f,maxHeight:p},setRenderer(x){ae=x,x&&mo(x)},wetnessMap:{texture:()=>J.texture,update:po,size:g,worldSize:l,setDecayRate(x){Le.uniforms.uDecayRate.value=x}}}}function xl(n,e,t,o=0,a=0){const r=n-o,u=e-a;function c(v,w){const M=v*3127.1+w*31.7;return Math.sin(M)*43758.5453%1}function d(v,w){const M=Math.floor(v),y=Math.floor(w),S=v-M,T=w-y,A=S*S*S*(S*(S*6-15)+10),I=T*T*T*(T*(T*6-15)+10),C=c(M,y),k=c(M+1,y),L=c(M,y+1),B=c(M+1,y+1),le=C*(1-A)+k*A,Y=L*(1-A)+B*A;return le*(1-I)+Y*I}function h(v,w){let M=.212,y=.26,S=4.2;for(let T=0;T<2;T++)M+=y*d(v*S,w*S),S*=2.4,y*=.09;return M}const p=h(r*.15+t*.08,u*.15+t*.15),f=h(r*.08-t*.08,u*.08-t*.12);return(p*.5+f*.5-.5)*4.13}function gi(n={}){const{terrainSize:e,waterLevel:t=-2.87}=n,o=1100,a=new bn(o,o,65,65),i=o-550,s=new et({transparent:!0,side:ot,depthWrite:!1,uniforms:{uTime:{value:0},uWaterColor:{value:new oe(43212)},uShallowColor:{value:new oe(6740463)},uShineColor:{value:new oe(14531583)},fogColor:{value:new oe(10541296)},fogNear:{value:180},fogFar:{value:400},uCurvature:{value:2e-5},uClipRadius:{value:i},uWaveAmplitude:{value:.286},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uMeshOffset:{value:new pe(0,0)},uTerrainWidthX:{value:18},uTerrainWidthZ:{value:18},uTerrainHeight:{value:.15},uFoamEnabled:{value:!0},uWaterLevel:{value:t},uTerrainScaleX:{value:1},uTerrainScaleY:{value:1},uTerrainIrregularity:{value:1},uTerrainBayAngle:{value:0},uTerrainBayDepth:{value:0},uTerrainBayWidth:{value:0},uIslandGroupOffset:{value:new pe(0,0)},uFoamHeightOffset:{value:-.363},uUseHeightmap:{value:!1},uTerrainHeightmap:{value:null},uHeightmapWorldSize:{value:18},uHeightmapMinHeight:{value:-4.6},uHeightmapMaxHeight:{value:5.8}},vertexShader:`
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
    `}),l=new ve(a,s);l.rotation.x=-Math.PI/2,l.position.y=t,l.receiveShadow=!0,l.renderOrder=1;const r=new ss(i,26,8,0,Math.PI*2,Math.PI/2,Math.PI/2),u=new et({side:ti,transparent:!0,depthWrite:!0,uniforms:{uDeepColor:{value:new oe(9549)},uShallowColor:{value:new oe(4500687)},fogColor:{value:new oe(10541296)},fogNear:{value:260},fogFar:{value:420}},vertexShader:`
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
    `}),c=new ve(r,u);return c.position.y=40.88,c.renderOrder=0,{mesh:l,hemisphereMesh:c,material:s,update(d){s.uniforms.uTime.value=d},setColors(d={}){d.water!==void 0&&s.uniforms.uWaterColor.value.set(d.water),d.shallow!==void 0&&s.uniforms.uShallowColor.value.set(d.shallow),d.shine!==void 0&&s.uniforms.uShineColor.value.set(d.shine)},setWaveChoppiness(d,h){d!==void 0&&(s.uniforms.uWaveHeightMultiplier.value=d),h!==void 0&&(s.uniforms.uWaveAmplitude.value=h)}}}function vi(n={}){const{scene:e,waterLevel:t=-2.87,maxRipples:o=50}=n,a=[],i=[];let s=0;const l=new ca(.1,.2,32),r=()=>new et({transparent:!0,side:ot,depthWrite:!1,uniforms:{uProgress:{value:0},uRadius:{value:1},uColor:{value:new oe(16777215)}},vertexShader:`
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
      `});for(let h=0;h<o;h++){const p=r(),f=new ve(l,p);f.rotation.x=-Math.PI/2,f.visible=!1,f.renderOrder=2,e.add(f),i.push(f)}function u(h,p,f={}){const{size:g=1,speed:v=1,color:w=new oe(16777215),y:M=null}=f;let y=i[s];if(s=(s+1)%o,!y)return;if(y.visible){const I=a.findIndex(C=>C.mesh===y);I!==-1&&a.splice(I,1)}const S=M!==null?M:t-.685;y.position.set(h,S,p),y.visible=!0,y.material.uniforms.uProgress.value=.0182,y.material.uniforms.uRadius.value=g,y.material.uniforms.uColor.value.copy(w);const T=2*g;y.scale.set(T,T,1);const A={mesh:y,progress:.114,speed:v*.4,maxScale:T*3.5,baseScale:T};a.push(A)}function c(h){for(let p=a.length-1;p>=0;p--){const f=a[p];f.progress+=h*f.speed,f.mesh.material.uniforms.uProgress.value=f.progress;const g=f.baseScale+(f.maxScale-f.baseScale)*f.progress;f.mesh.scale.set(g,g,1),f.progress>=1&&(f.mesh.visible=!1,a.splice(p,1))}}function d(){i.forEach(h=>{e.remove(h),h.material.dispose()}),l.dispose(),a.length=0,i.length=0}return{spawnRipple:u,update:c,dispose:d}}function Dl(){const e=new Uint8Array(2097152);let t=0;const o=.05,a=new Tl,i=new b;for(let l=0;l<128;l++)for(let r=0;r<128;r++)for(let u=0;u<128;u++){const c=1-i.set(u,r,l).subScalar(64).divideScalar(128).length();e[t]=(168+127.6*a.noise(u*o/1.53,r*o,l*o/1.51))*c*c,t++}const s=new vr(e,128,128,128);return s.format=yr,s.minFilter=Qe,s.magFilter=Qe,s.unpackAlignment=1,s.needsUpdate=!0,s}function Yo(n={}){const{startX:e,startZ:t,endX:o,endZ:a,cloudHeight:i=13.2,cloudTexture:s,baseOpacity:l=.43,rainCount:r=100}=n,u=new Vt,c=`
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
  `,h=new ai(15,8,15),p=new wr({glslVersion:Sr,uniforms:{base:{value:new oe(7965344)},map:{value:s},cameraPos:{value:new b},threshold:{value:.25},opacity:{value:0},range:{value:.08},steps:{value:40},frame:{value:0},textureRotation:{value:0}},vertexShader:c,fragmentShader:d,side:ot,transparent:!0,depthWrite:!1,depthTest:!1}),f=new ve(h,p);f.position.y=i,f.scale.set(11.11,6.12,8.3),f.visible=!1,f.renderOrder=6,u.add(f);const g=new qa,v=new Float32Array(r*3),w=[],M=.8,y=.3;for(let A=0;A<r;A++){const I=Math.random()*Math.PI*2,C=Math.random()*3.2;v[A*3]=Math.cos(I)*C,v[A*3+1]=i-Math.random()*4,v[A*3+2]=Math.sin(I)*C,w.push({initialY:v[A*3+1],initialX:v[A*3],initialZ:v[A*3+2],speed:2+Math.random()*3})}g.setAttribute("position",new Qt(v,3));const S=new is({color:7258367,size:.18,transparent:!0,opacity:0,blending:si,depthWrite:!1,depthTest:!0}),T=new rs(g,S);return T.renderOrder=5,u.add(T),u.position.set(e,0,t),u.userData={cloud:f,cloudMaterial:p,rainParticles:T,rainVelocities:w,windDriftX:M,windDriftZ:y,creationTime:Date.now(),startPos:{x:e,z:t},endPos:{x:o,z:a},baseOpacity:l,drizzleSound:null},u}function En(n,e,t=0){const{cloudMaterial:o}=n.userData;o.uniforms.cameraPos.value.copy(e.position),o.uniforms.frame.value++,o.uniforms.textureRotation.value+=t*.3;const a=o.uniforms.frame.value*.02;o.uniforms.steps.value=50+Math.sin(a)*15}function Pn(n,e){const{rainParticles:t,rainVelocities:o,windDriftX:a,windDriftZ:i}=n.userData;if(t.material.opacity<.01)return;const s=t.geometry.attributes.position.array;for(let l=0;l<o.length;l++){const r=o[l];s[l*3+1]-=r.speed*e,s[l*3]+=a*e,s[l*3+2]+=i*e,s[l*3+1]<.1&&(s[l*3+1]=r.initialY,s[l*3]=r.initialX,s[l*3+2]=r.initialZ)}t.geometry.attributes.position.needsUpdate=!0}function Ta(n,e){const{rainParticles:t}=n.userData;t.material.opacity=Math.max(0,Math.min(1,e))}function Ls(n,e){if(e===br)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===Tn||e===ii){let t=n.getIndex();if(t===null){const s=[],l=n.getAttribute("position");if(l!==void 0){for(let r=0;r<l.count;r++)s.push(r);n.setIndex(s),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}const o=t.count-2,a=[];if(e===Tn)for(let s=1;s<=o;s++)a.push(t.getX(0)),a.push(t.getX(s)),a.push(t.getX(s+1));else for(let s=0;s<o;s++)s%2===0?(a.push(t.getX(s)),a.push(t.getX(s+1)),a.push(t.getX(s+2))):(a.push(t.getX(s+2)),a.push(t.getX(s+1)),a.push(t.getX(s)));a.length/3!==o&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const i=n.clone();return i.setIndex(a),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}class Ke extends Mr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Al(t)}),this.register(function(t){return new Il(t)}),this.register(function(t){return new Bl(t)}),this.register(function(t){return new Wl(t)}),this.register(function(t){return new Vl(t)}),this.register(function(t){return new Rl(t)}),this.register(function(t){return new Ol(t)}),this.register(function(t){return new Fl(t)}),this.register(function(t){return new kl(t)}),this.register(function(t){return new Cl(t)}),this.register(function(t){return new Hl(t)}),this.register(function(t){return new Ll(t)}),this.register(function(t){return new Nl(t)}),this.register(function(t){return new zl(t)}),this.register(function(t){return new Pl(t)}),this.register(function(t){return new Ul(t)}),this.register(function(t){return new Xl(t)})}load(e,t,o,a){const i=this;let s;if(this.resourcePath!=="")s=this.resourcePath;else if(this.path!==""){const u=qo.extractUrlBase(e);s=qo.resolveURL(u,this.path)}else s=qo.extractUrlBase(e);this.manager.itemStart(e);const l=function(u){a?a(u):console.error(u),i.manager.itemError(e),i.manager.itemEnd(e)},r=new ri(this.manager);r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,function(u){try{i.parse(u,s,function(c){t(c),i.manager.itemEnd(e)},l)}catch(c){l(c)}},o,l)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,o,a){let i;const s={},l={},r=new TextDecoder;if(typeof e=="string")i=JSON.parse(e);else if(e instanceof ArrayBuffer)if(r.decode(new Uint8Array(e,0,4))===yi){try{s[U.KHR_BINARY_GLTF]=new Gl(e)}catch(d){a&&a(d);return}i=JSON.parse(s[U.KHR_BINARY_GLTF].content)}else i=JSON.parse(r.decode(e));else i=e;if(i.asset===void 0||i.asset.version[0]<2){a&&a(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const u=new nc(i,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});u.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){const d=this.pluginCallbacks[c](u);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),l[d.name]=d,s[d.name]=!0}if(i.extensionsUsed)for(let c=0;c<i.extensionsUsed.length;++c){const d=i.extensionsUsed[c],h=i.extensionsRequired||[];switch(d){case U.KHR_MATERIALS_UNLIT:s[d]=new _l;break;case U.KHR_DRACO_MESH_COMPRESSION:s[d]=new jl(i,this.dracoLoader);break;case U.KHR_TEXTURE_TRANSFORM:s[d]=new Zl;break;case U.KHR_MESH_QUANTIZATION:s[d]=new ql;break;default:h.indexOf(d)>=0&&l[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}u.setExtensions(s),u.setPlugins(l),u.parse(o,a)}parseAsync(e,t){const o=this;return new Promise(function(a,i){o.parse(e,t,a,i)})}}function El(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}const U={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Pl{constructor(e){this.parser=e,this.name=U.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let o=0,a=t.length;o<a;o++){const i=t[o];i.extensions&&i.extensions[this.name]&&i.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,i.extensions[this.name].light)}}_loadLight(e){const t=this.parser,o="light:"+e;let a=t.cache.get(o);if(a)return a;const i=t.json,r=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e];let u;const c=new oe(16777215);r.color!==void 0&&c.setRGB(r.color[0],r.color[1],r.color[2],Lt);const d=r.range!==void 0?r.range:0;switch(r.type){case"directional":u=new ls(c),u.target.position.set(0,0,-1),u.add(u.target);break;case"point":u=new xr(c),u.distance=d;break;case"spot":u=new Tr(c),u.distance=d,r.spot=r.spot||{},r.spot.innerConeAngle=r.spot.innerConeAngle!==void 0?r.spot.innerConeAngle:0,r.spot.outerConeAngle=r.spot.outerConeAngle!==void 0?r.spot.outerConeAngle:Math.PI/4,u.angle=r.spot.outerConeAngle,u.penumbra=1-r.spot.innerConeAngle/r.spot.outerConeAngle,u.target.position.set(0,0,-1),u.add(u.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+r.type)}return u.position.set(0,0,0),nt(u,r),r.intensity!==void 0&&(u.intensity=r.intensity),u.name=t.createUniqueName(r.name||"light_"+e),a=Promise.resolve(u),t.cache.add(o,a),a}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,o=this.parser,i=o.json.nodes[e],l=(i.extensions&&i.extensions[this.name]||{}).light;return l===void 0?null:this._loadLight(l).then(function(r){return o._getNodeRef(t.cache,l,r)})}}class _l{constructor(){this.name=U.KHR_MATERIALS_UNLIT}getMaterialType(){return Et}extendParams(e,t,o){const a=[];e.color=new oe(1,1,1),e.opacity=1;const i=t.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){const s=i.baseColorFactor;e.color.setRGB(s[0],s[1],s[2],Lt),e.opacity=s[3]}i.baseColorTexture!==void 0&&a.push(o.assignTexture(e,"map",i.baseColorTexture,Qo))}return Promise.all(a)}}class Cl{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const a=this.parser.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=a.extensions[this.name].emissiveStrength;return i!==void 0&&(t.emissiveIntensity=i),Promise.resolve()}}class Al{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[],s=a.extensions[this.name];if(s.clearcoatFactor!==void 0&&(t.clearcoat=s.clearcoatFactor),s.clearcoatTexture!==void 0&&i.push(o.assignTexture(t,"clearcoatMap",s.clearcoatTexture)),s.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=s.clearcoatRoughnessFactor),s.clearcoatRoughnessTexture!==void 0&&i.push(o.assignTexture(t,"clearcoatRoughnessMap",s.clearcoatRoughnessTexture)),s.clearcoatNormalTexture!==void 0&&(i.push(o.assignTexture(t,"clearcoatNormalMap",s.clearcoatNormalTexture)),s.clearcoatNormalTexture.scale!==void 0)){const l=s.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new pe(l,l)}return Promise.all(i)}}class Il{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_DISPERSION}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const a=this.parser.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=a.extensions[this.name];return t.dispersion=i.dispersion!==void 0?i.dispersion:0,Promise.resolve()}}class Ll{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[],s=a.extensions[this.name];return s.iridescenceFactor!==void 0&&(t.iridescence=s.iridescenceFactor),s.iridescenceTexture!==void 0&&i.push(o.assignTexture(t,"iridescenceMap",s.iridescenceTexture)),s.iridescenceIor!==void 0&&(t.iridescenceIOR=s.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),s.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=s.iridescenceThicknessMinimum),s.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=s.iridescenceThicknessMaximum),s.iridescenceThicknessTexture!==void 0&&i.push(o.assignTexture(t,"iridescenceThicknessMap",s.iridescenceThicknessTexture)),Promise.all(i)}}class Rl{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_SHEEN}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[];t.sheenColor=new oe(0,0,0),t.sheenRoughness=0,t.sheen=1;const s=a.extensions[this.name];if(s.sheenColorFactor!==void 0){const l=s.sheenColorFactor;t.sheenColor.setRGB(l[0],l[1],l[2],Lt)}return s.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=s.sheenRoughnessFactor),s.sheenColorTexture!==void 0&&i.push(o.assignTexture(t,"sheenColorMap",s.sheenColorTexture,Qo)),s.sheenRoughnessTexture!==void 0&&i.push(o.assignTexture(t,"sheenRoughnessMap",s.sheenRoughnessTexture)),Promise.all(i)}}class Ol{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[],s=a.extensions[this.name];return s.transmissionFactor!==void 0&&(t.transmission=s.transmissionFactor),s.transmissionTexture!==void 0&&i.push(o.assignTexture(t,"transmissionMap",s.transmissionTexture)),Promise.all(i)}}class Fl{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_VOLUME}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[],s=a.extensions[this.name];t.thickness=s.thicknessFactor!==void 0?s.thicknessFactor:0,s.thicknessTexture!==void 0&&i.push(o.assignTexture(t,"thicknessMap",s.thicknessTexture)),t.attenuationDistance=s.attenuationDistance||1/0;const l=s.attenuationColor||[1,1,1];return t.attenuationColor=new oe().setRGB(l[0],l[1],l[2],Lt),Promise.all(i)}}class kl{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_IOR}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const a=this.parser.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=a.extensions[this.name];return t.ior=i.ior!==void 0?i.ior:1.5,Promise.resolve()}}class Hl{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_SPECULAR}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[],s=a.extensions[this.name];t.specularIntensity=s.specularFactor!==void 0?s.specularFactor:1,s.specularTexture!==void 0&&i.push(o.assignTexture(t,"specularIntensityMap",s.specularTexture));const l=s.specularColorFactor||[1,1,1];return t.specularColor=new oe().setRGB(l[0],l[1],l[2],Lt),s.specularColorTexture!==void 0&&i.push(o.assignTexture(t,"specularColorMap",s.specularColorTexture,Qo)),Promise.all(i)}}class zl{constructor(e){this.parser=e,this.name=U.EXT_MATERIALS_BUMP}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[],s=a.extensions[this.name];return t.bumpScale=s.bumpFactor!==void 0?s.bumpFactor:1,s.bumpTexture!==void 0&&i.push(o.assignTexture(t,"bumpMap",s.bumpTexture)),Promise.all(i)}}class Nl{constructor(e){this.parser=e,this.name=U.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:pt}extendMaterialParams(e,t){const o=this.parser,a=o.json.materials[e];if(!a.extensions||!a.extensions[this.name])return Promise.resolve();const i=[],s=a.extensions[this.name];return s.anisotropyStrength!==void 0&&(t.anisotropy=s.anisotropyStrength),s.anisotropyRotation!==void 0&&(t.anisotropyRotation=s.anisotropyRotation),s.anisotropyTexture!==void 0&&i.push(o.assignTexture(t,"anisotropyMap",s.anisotropyTexture)),Promise.all(i)}}class Bl{constructor(e){this.parser=e,this.name=U.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,o=t.json,a=o.textures[e];if(!a.extensions||!a.extensions[this.name])return null;const i=a.extensions[this.name],s=t.options.ktx2Loader;if(!s){if(o.extensionsRequired&&o.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,i.source,s)}}class Wl{constructor(e){this.parser=e,this.name=U.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,o=this.parser,a=o.json,i=a.textures[e];if(!i.extensions||!i.extensions[t])return null;const s=i.extensions[t],l=a.images[s.source];let r=o.textureLoader;if(l.uri){const u=o.options.manager.getHandler(l.uri);u!==null&&(r=u)}return o.loadTextureImage(e,s.source,r)}}class Vl{constructor(e){this.parser=e,this.name=U.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,o=this.parser,a=o.json,i=a.textures[e];if(!i.extensions||!i.extensions[t])return null;const s=i.extensions[t],l=a.images[s.source];let r=o.textureLoader;if(l.uri){const u=o.options.manager.getHandler(l.uri);u!==null&&(r=u)}return o.loadTextureImage(e,s.source,r)}}class Ul{constructor(e){this.name=U.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,o=t.bufferViews[e];if(o.extensions&&o.extensions[this.name]){const a=o.extensions[this.name],i=this.parser.getDependency("buffer",a.buffer),s=this.parser.options.meshoptDecoder;if(!s||!s.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return i.then(function(l){const r=a.byteOffset||0,u=a.byteLength||0,c=a.count,d=a.byteStride,h=new Uint8Array(l,r,u);return s.decodeGltfBufferAsync?s.decodeGltfBufferAsync(c,d,h,a.mode,a.filter).then(function(p){return p.buffer}):s.ready.then(function(){const p=new ArrayBuffer(c*d);return s.decodeGltfBuffer(new Uint8Array(p),c,d,h,a.mode,a.filter),p})})}else return null}}class Xl{constructor(e){this.name=U.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,o=t.nodes[e];if(!o.extensions||!o.extensions[this.name]||o.mesh===void 0)return null;const a=t.meshes[o.mesh];for(const u of a.primitives)if(u.mode!==je.TRIANGLES&&u.mode!==je.TRIANGLE_STRIP&&u.mode!==je.TRIANGLE_FAN&&u.mode!==void 0)return null;const s=o.extensions[this.name].attributes,l=[],r={};for(const u in s)l.push(this.parser.getDependency("accessor",s[u]).then(c=>(r[u]=c,r[u])));return l.length<1?null:(l.push(this.parser.createNodeMesh(e)),Promise.all(l).then(u=>{const c=u.pop(),d=c.isGroup?c.children:[c],h=u[0].count,p=[];for(const f of d){const g=new Rt,v=new b,w=new It,M=new b(1,1,1),y=new xn(f.geometry,f.material,h);for(let S=0;S<h;S++)r.TRANSLATION&&v.fromBufferAttribute(r.TRANSLATION,S),r.ROTATION&&w.fromBufferAttribute(r.ROTATION,S),r.SCALE&&M.fromBufferAttribute(r.SCALE,S),y.setMatrixAt(S,g.compose(v,w,M));for(const S in r)if(S==="_COLOR_0"){const T=r[S];y.instanceColor=new Dn(T.array,T.itemSize,T.normalized)}else S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"&&f.geometry.setAttribute(S,r[S]);li.prototype.copy.call(y,f),this.parser.assignFinalMaterial(y),p.push(y)}return c.isGroup?(c.clear(),c.add(...p),c):p[0]}))}}const yi="glTF",Uo=12,Rs={JSON:1313821514,BIN:5130562};class Gl{constructor(e){this.name=U.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Uo),o=new TextDecoder;if(this.header={magic:o.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==yi)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const a=this.header.length-Uo,i=new DataView(e,Uo);let s=0;for(;s<a;){const l=i.getUint32(s,!0);s+=4;const r=i.getUint32(s,!0);if(s+=4,r===Rs.JSON){const u=new Uint8Array(e,Uo+s,l);this.content=o.decode(u)}else if(r===Rs.BIN){const u=Uo+s;this.body=e.slice(u,u+l)}s+=l}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class jl{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=U.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const o=this.json,a=this.dracoLoader,i=e.extensions[this.name].bufferView,s=e.extensions[this.name].attributes,l={},r={},u={};for(const c in s){const d=_n[c]||c.toLowerCase();l[d]=s[c]}for(const c in e.attributes){const d=_n[c]||c.toLowerCase();if(s[c]!==void 0){const h=o.accessors[e.attributes[c]],p=Eo[h.componentType];u[d]=p.name,r[d]=h.normalized===!0}}return t.getDependency("bufferView",i).then(function(c){return new Promise(function(d,h){a.decodeDracoFile(c,function(p){for(const f in p.attributes){const g=p.attributes[f],v=r[f];v!==void 0&&(g.normalized=v)}d(p)},l,u,Lt,h)})})}}class Zl{constructor(){this.name=U.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class ql{constructor(){this.name=U.KHR_MESH_QUANTIZATION}}class wi extends Xr{constructor(e,t,o,a){super(e,t,o,a)}copySampleValue_(e){const t=this.resultBuffer,o=this.sampleValues,a=this.valueSize,i=e*a*3+a;for(let s=0;s!==a;s++)t[s]=o[i+s];return t}interpolate_(e,t,o,a){const i=this.resultBuffer,s=this.sampleValues,l=this.valueSize,r=l*2,u=l*3,c=a-t,d=(o-t)/c,h=d*d,p=h*d,f=e*u,g=f-u,v=-2*p+3*h,w=p-h,M=1-v,y=w-h+d;for(let S=0;S!==l;S++){const T=s[g+S+l],A=s[g+S+r]*c,I=s[f+S+l],C=s[f+S]*c;i[S]=M*T+y*A+v*I+w*C}return i}}const Yl=new It;class Kl extends wi{interpolate_(e,t,o,a){const i=super.interpolate_(e,t,o,a);return Yl.fromArray(i).normalize().toArray(i),i}}const je={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Eo={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Os={9728:ui,9729:Qe,9984:Cr,9985:_r,9986:Pr,9987:ci},Fs={33071:Ir,33648:Ar,10497:Jo},dn={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},_n={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ht={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},$l={CUBICSPLINE:void 0,LINEAR:hi,STEP:Wr},hn={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Jl(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new Ya({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ur})),n.DefaultMaterial}function Yt(n,e,t){for(const o in t.extensions)n[o]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[o]=t.extensions[o])}function nt(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ql(n,e,t){let o=!1,a=!1,i=!1;for(let u=0,c=e.length;u<c;u++){const d=e[u];if(d.POSITION!==void 0&&(o=!0),d.NORMAL!==void 0&&(a=!0),d.COLOR_0!==void 0&&(i=!0),o&&a&&i)break}if(!o&&!a&&!i)return Promise.resolve(n);const s=[],l=[],r=[];for(let u=0,c=e.length;u<c;u++){const d=e[u];if(o){const h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):n.attributes.position;s.push(h)}if(a){const h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):n.attributes.normal;l.push(h)}if(i){const h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):n.attributes.color;r.push(h)}}return Promise.all([Promise.all(s),Promise.all(l),Promise.all(r)]).then(function(u){const c=u[0],d=u[1],h=u[2];return o&&(n.morphAttributes.position=c),a&&(n.morphAttributes.normal=d),i&&(n.morphAttributes.color=h),n.morphTargetsRelative=!0,n})}function ec(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,o=e.weights.length;t<o;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let o=0,a=t.length;o<a;o++)n.morphTargetDictionary[t[o]]=o}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function tc(n){let e;const t=n.extensions&&n.extensions[U.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+fn(t.attributes):e=n.indices+":"+fn(n.attributes)+":"+n.mode,n.targets!==void 0)for(let o=0,a=n.targets.length;o<a;o++)e+=":"+fn(n.targets[o]);return e}function fn(n){let e="";const t=Object.keys(n).sort();for(let o=0,a=t.length;o<a;o++)e+=t[o]+":"+n[t[o]]+";";return e}function Cn(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function oc(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const ac=new Rt;class nc{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new El,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let o=!1,a=-1,i=!1,s=-1;if(typeof navigator<"u"){const l=navigator.userAgent;o=/^((?!chrome|android).)*safari/i.test(l)===!0;const r=l.match(/Version\/(\d+)/);a=o&&r?parseInt(r[1],10):-1,i=l.indexOf("Firefox")>-1,s=i?l.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||o&&a<17||i&&s<98?this.textureLoader=new ni(this.options.manager):this.textureLoader=new Dr(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ri(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const o=this,a=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(s){return s._markDefs&&s._markDefs()}),Promise.all(this._invokeAll(function(s){return s.beforeRoot&&s.beforeRoot()})).then(function(){return Promise.all([o.getDependencies("scene"),o.getDependencies("animation"),o.getDependencies("camera")])}).then(function(s){const l={scene:s[0][a.scene||0],scenes:s[0],animations:s[1],cameras:s[2],asset:a.asset,parser:o,userData:{}};return Yt(i,l,a),nt(l,a),Promise.all(o._invokeAll(function(r){return r.afterRoot&&r.afterRoot(l)})).then(function(){for(const r of l.scenes)r.updateMatrixWorld();e(l)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],o=this.json.meshes||[];for(let a=0,i=t.length;a<i;a++){const s=t[a].joints;for(let l=0,r=s.length;l<r;l++)e[s[l]].isBone=!0}for(let a=0,i=e.length;a<i;a++){const s=e[a];s.mesh!==void 0&&(this._addNodeRef(this.meshCache,s.mesh),s.skin!==void 0&&(o[s.mesh].isSkinnedMesh=!0)),s.camera!==void 0&&this._addNodeRef(this.cameraCache,s.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,o){if(e.refs[t]<=1)return o;const a=o.clone(),i=(s,l)=>{const r=this.associations.get(s);r!=null&&this.associations.set(l,r);for(const[u,c]of s.children.entries())i(c,l.children[u])};return i(o,a),a.name+="_instance_"+e.uses[t]++,a}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let o=0;o<t.length;o++){const a=e(t[o]);if(a)return a}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const o=[];for(let a=0;a<t.length;a++){const i=e(t[a]);i&&o.push(i)}return o}getDependency(e,t){const o=e+":"+t;let a=this.cache.get(o);if(!a){switch(e){case"scene":a=this.loadScene(t);break;case"node":a=this._invokeOne(function(i){return i.loadNode&&i.loadNode(t)});break;case"mesh":a=this._invokeOne(function(i){return i.loadMesh&&i.loadMesh(t)});break;case"accessor":a=this.loadAccessor(t);break;case"bufferView":a=this._invokeOne(function(i){return i.loadBufferView&&i.loadBufferView(t)});break;case"buffer":a=this.loadBuffer(t);break;case"material":a=this._invokeOne(function(i){return i.loadMaterial&&i.loadMaterial(t)});break;case"texture":a=this._invokeOne(function(i){return i.loadTexture&&i.loadTexture(t)});break;case"skin":a=this.loadSkin(t);break;case"animation":a=this._invokeOne(function(i){return i.loadAnimation&&i.loadAnimation(t)});break;case"camera":a=this.loadCamera(t);break;default:if(a=this._invokeOne(function(i){return i!=this&&i.getDependency&&i.getDependency(e,t)}),!a)throw new Error("Unknown type: "+e);break}this.cache.add(o,a)}return a}getDependencies(e){let t=this.cache.get(e);if(!t){const o=this,a=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(a.map(function(i,s){return o.getDependency(e,s)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],o=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[U.KHR_BINARY_GLTF].body);const a=this.options;return new Promise(function(i,s){o.load(qo.resolveURL(t.uri,a.path),i,void 0,function(){s(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(o){const a=t.byteLength||0,i=t.byteOffset||0;return o.slice(i,i+a)})}loadAccessor(e){const t=this,o=this.json,a=this.json.accessors[e];if(a.bufferView===void 0&&a.sparse===void 0){const s=dn[a.type],l=Eo[a.componentType],r=a.normalized===!0,u=new l(a.count*s);return Promise.resolve(new Qt(u,s,r))}const i=[];return a.bufferView!==void 0?i.push(this.getDependency("bufferView",a.bufferView)):i.push(null),a.sparse!==void 0&&(i.push(this.getDependency("bufferView",a.sparse.indices.bufferView)),i.push(this.getDependency("bufferView",a.sparse.values.bufferView))),Promise.all(i).then(function(s){const l=s[0],r=dn[a.type],u=Eo[a.componentType],c=u.BYTES_PER_ELEMENT,d=c*r,h=a.byteOffset||0,p=a.bufferView!==void 0?o.bufferViews[a.bufferView].byteStride:void 0,f=a.normalized===!0;let g,v;if(p&&p!==d){const w=Math.floor(h/p),M="InterleavedBuffer:"+a.bufferView+":"+a.componentType+":"+w+":"+a.count;let y=t.cache.get(M);y||(g=new u(l,w*p,a.count*p/c),y=new Er(g,p/c),t.cache.add(M,y)),v=new Vr(y,r,h%p/c,f)}else l===null?g=new u(a.count*r):g=new u(l,h,a.count*r),v=new Qt(g,r,f);if(a.sparse!==void 0){const w=dn.SCALAR,M=Eo[a.sparse.indices.componentType],y=a.sparse.indices.byteOffset||0,S=a.sparse.values.byteOffset||0,T=new M(s[1],y,a.sparse.count*w),A=new u(s[2],S,a.sparse.count*r);l!==null&&(v=new Qt(v.array.slice(),v.itemSize,v.normalized)),v.normalized=!1;for(let I=0,C=T.length;I<C;I++){const k=T[I];if(v.setX(k,A[I*r]),r>=2&&v.setY(k,A[I*r+1]),r>=3&&v.setZ(k,A[I*r+2]),r>=4&&v.setW(k,A[I*r+3]),r>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}v.normalized=f}return v})}loadTexture(e){const t=this.json,o=this.options,i=t.textures[e].source,s=t.images[i];let l=this.textureLoader;if(s.uri){const r=o.manager.getHandler(s.uri);r!==null&&(l=r)}return this.loadTextureImage(e,i,l)}loadTextureImage(e,t,o){const a=this,i=this.json,s=i.textures[e],l=i.images[t],r=(l.uri||l.bufferView)+":"+s.sampler;if(this.textureCache[r])return this.textureCache[r];const u=this.loadImageSource(t,o).then(function(c){c.flipY=!1,c.name=s.name||l.name||"",c.name===""&&typeof l.uri=="string"&&l.uri.startsWith("data:image/")===!1&&(c.name=l.uri);const h=(i.samplers||{})[s.sampler]||{};return c.magFilter=Os[h.magFilter]||Qe,c.minFilter=Os[h.minFilter]||ci,c.wrapS=Fs[h.wrapS]||Jo,c.wrapT=Fs[h.wrapT]||Jo,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==ui&&c.minFilter!==Qe,a.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[r]=u,u}loadImageSource(e,t){const o=this,a=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const s=a.images[e],l=self.URL||self.webkitURL;let r=s.uri||"",u=!1;if(s.bufferView!==void 0)r=o.getDependency("bufferView",s.bufferView).then(function(d){u=!0;const h=new Blob([d],{type:s.mimeType});return r=l.createObjectURL(h),r});else if(s.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const c=Promise.resolve(r).then(function(d){return new Promise(function(h,p){let f=h;t.isImageBitmapLoader===!0&&(f=function(g){const v=new Ds(g);v.needsUpdate=!0,h(v)}),t.load(qo.resolveURL(d,i.path),f,void 0,p)})}).then(function(d){return u===!0&&l.revokeObjectURL(r),nt(d,s),d.userData.mimeType=s.mimeType||oc(s.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",r),d});return this.sourceCache[e]=c,c}assignTexture(e,t,o,a){const i=this;return this.getDependency("texture",o.index).then(function(s){if(!s)return null;if(o.texCoord!==void 0&&o.texCoord>0&&(s=s.clone(),s.channel=o.texCoord),i.extensions[U.KHR_TEXTURE_TRANSFORM]){const l=o.extensions!==void 0?o.extensions[U.KHR_TEXTURE_TRANSFORM]:void 0;if(l){const r=i.associations.get(s);s=i.extensions[U.KHR_TEXTURE_TRANSFORM].extendTexture(s,l),i.associations.set(s,r)}}return a!==void 0&&(s.colorSpace=a),e[t]=s,s})}assignFinalMaterial(e){const t=e.geometry;let o=e.material;const a=t.attributes.tangent===void 0,i=t.attributes.color!==void 0,s=t.attributes.normal===void 0;if(e.isPoints){const l="PointsMaterial:"+o.uuid;let r=this.cache.get(l);r||(r=new is,ln.prototype.copy.call(r,o),r.color.copy(o.color),r.map=o.map,r.sizeAttenuation=!1,this.cache.add(l,r)),o=r}else if(e.isLine){const l="LineBasicMaterial:"+o.uuid;let r=this.cache.get(l);r||(r=new Lr,ln.prototype.copy.call(r,o),r.color.copy(o.color),r.map=o.map,this.cache.add(l,r)),o=r}if(a||i||s){let l="ClonedMaterial:"+o.uuid+":";a&&(l+="derivative-tangents:"),i&&(l+="vertex-colors:"),s&&(l+="flat-shading:");let r=this.cache.get(l);r||(r=o.clone(),i&&(r.vertexColors=!0),s&&(r.flatShading=!0),a&&(r.normalScale&&(r.normalScale.y*=-1),r.clearcoatNormalScale&&(r.clearcoatNormalScale.y*=-1)),this.cache.add(l,r),this.associations.set(r,this.associations.get(o))),o=r}e.material=o}getMaterialType(){return Ya}loadMaterial(e){const t=this,o=this.json,a=this.extensions,i=o.materials[e];let s;const l={},r=i.extensions||{},u=[];if(r[U.KHR_MATERIALS_UNLIT]){const d=a[U.KHR_MATERIALS_UNLIT];s=d.getMaterialType(),u.push(d.extendParams(l,i,t))}else{const d=i.pbrMetallicRoughness||{};if(l.color=new oe(1,1,1),l.opacity=1,Array.isArray(d.baseColorFactor)){const h=d.baseColorFactor;l.color.setRGB(h[0],h[1],h[2],Lt),l.opacity=h[3]}d.baseColorTexture!==void 0&&u.push(t.assignTexture(l,"map",d.baseColorTexture,Qo)),l.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,l.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(u.push(t.assignTexture(l,"metalnessMap",d.metallicRoughnessTexture)),u.push(t.assignTexture(l,"roughnessMap",d.metallicRoughnessTexture))),s=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),u.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,l)})))}i.doubleSided===!0&&(l.side=ot);const c=i.alphaMode||hn.OPAQUE;if(c===hn.BLEND?(l.transparent=!0,l.depthWrite=!1):(l.transparent=!1,c===hn.MASK&&(l.alphaTest=i.alphaCutoff!==void 0?i.alphaCutoff:.5)),i.normalTexture!==void 0&&s!==Et&&(u.push(t.assignTexture(l,"normalMap",i.normalTexture)),l.normalScale=new pe(1,1),i.normalTexture.scale!==void 0)){const d=i.normalTexture.scale;l.normalScale.set(d,d)}if(i.occlusionTexture!==void 0&&s!==Et&&(u.push(t.assignTexture(l,"aoMap",i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(l.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&s!==Et){const d=i.emissiveFactor;l.emissive=new oe().setRGB(d[0],d[1],d[2],Lt)}return i.emissiveTexture!==void 0&&s!==Et&&u.push(t.assignTexture(l,"emissiveMap",i.emissiveTexture,Qo)),Promise.all(u).then(function(){const d=new s(l);return i.name&&(d.name=i.name),nt(d,i),t.associations.set(d,{materials:e}),i.extensions&&Yt(a,d,i),d})}createUniqueName(e){const t=Rr.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,o=this.extensions,a=this.primitiveCache;function i(l){return o[U.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(l,t).then(function(r){return ks(r,l,t)})}const s=[];for(let l=0,r=e.length;l<r;l++){const u=e[l],c=tc(u),d=a[c];if(d)s.push(d.promise);else{let h;u.extensions&&u.extensions[U.KHR_DRACO_MESH_COMPRESSION]?h=i(u):h=ks(new qa,u,t),a[c]={primitive:u,promise:h},s.push(h)}}return Promise.all(s)}loadMesh(e){const t=this,o=this.json,a=this.extensions,i=o.meshes[e],s=i.primitives,l=[];for(let r=0,u=s.length;r<u;r++){const c=s[r].material===void 0?Jl(this.cache):this.getDependency("material",s[r].material);l.push(c)}return l.push(t.loadGeometries(s)),Promise.all(l).then(function(r){const u=r.slice(0,r.length-1),c=r[r.length-1],d=[];for(let p=0,f=c.length;p<f;p++){const g=c[p],v=s[p];let w;const M=u[p];if(v.mode===je.TRIANGLES||v.mode===je.TRIANGLE_STRIP||v.mode===je.TRIANGLE_FAN||v.mode===void 0)w=i.isSkinnedMesh===!0?new Or(g,M):new ve(g,M),w.isSkinnedMesh===!0&&w.normalizeSkinWeights(),v.mode===je.TRIANGLE_STRIP?w.geometry=Ls(w.geometry,ii):v.mode===je.TRIANGLE_FAN&&(w.geometry=Ls(w.geometry,Tn));else if(v.mode===je.LINES)w=new Fr(g,M);else if(v.mode===je.LINE_STRIP)w=new kr(g,M);else if(v.mode===je.LINE_LOOP)w=new Hr(g,M);else if(v.mode===je.POINTS)w=new rs(g,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+v.mode);Object.keys(w.geometry.morphAttributes).length>0&&ec(w,i),w.name=t.createUniqueName(i.name||"mesh_"+e),nt(w,i),v.extensions&&Yt(a,w,v),t.assignFinalMaterial(w),d.push(w)}for(let p=0,f=d.length;p<f;p++)t.associations.set(d[p],{meshes:e,primitives:p});if(d.length===1)return i.extensions&&Yt(a,d[0],i),d[0];const h=new Vt;i.extensions&&Yt(a,h,i),t.associations.set(h,{meshes:e});for(let p=0,f=d.length;p<f;p++)h.add(d[p]);return h})}loadCamera(e){let t;const o=this.json.cameras[e],a=o[o.type];if(!a){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return o.type==="perspective"?t=new di(ee.radToDeg(a.yfov),a.aspectRatio||1,a.znear||1,a.zfar||2e6):o.type==="orthographic"&&(t=new Mn(-a.xmag,a.xmag,a.ymag,-a.ymag,a.znear,a.zfar)),o.name&&(t.name=this.createUniqueName(o.name)),nt(t,o),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],o=[];for(let a=0,i=t.joints.length;a<i;a++)o.push(this._loadNodeShallow(t.joints[a]));return t.inverseBindMatrices!==void 0?o.push(this.getDependency("accessor",t.inverseBindMatrices)):o.push(null),Promise.all(o).then(function(a){const i=a.pop(),s=a,l=[],r=[];for(let u=0,c=s.length;u<c;u++){const d=s[u];if(d){l.push(d);const h=new Rt;i!==null&&h.fromArray(i.array,u*16),r.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[u])}return new zr(l,r)})}loadAnimation(e){const t=this.json,o=this,a=t.animations[e],i=a.name?a.name:"animation_"+e,s=[],l=[],r=[],u=[],c=[];for(let d=0,h=a.channels.length;d<h;d++){const p=a.channels[d],f=a.samplers[p.sampler],g=p.target,v=g.node,w=a.parameters!==void 0?a.parameters[f.input]:f.input,M=a.parameters!==void 0?a.parameters[f.output]:f.output;g.node!==void 0&&(s.push(this.getDependency("node",v)),l.push(this.getDependency("accessor",w)),r.push(this.getDependency("accessor",M)),u.push(f),c.push(g))}return Promise.all([Promise.all(s),Promise.all(l),Promise.all(r),Promise.all(u),Promise.all(c)]).then(function(d){const h=d[0],p=d[1],f=d[2],g=d[3],v=d[4],w=[];for(let y=0,S=h.length;y<S;y++){const T=h[y],A=p[y],I=f[y],C=g[y],k=v[y];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const L=o._createAnimationTracks(T,A,I,C,k);if(L)for(let B=0;B<L.length;B++)w.push(L[B])}const M=new Nr(i,void 0,w);return nt(M,a),M})}createNodeMesh(e){const t=this.json,o=this,a=t.nodes[e];return a.mesh===void 0?null:o.getDependency("mesh",a.mesh).then(function(i){const s=o._getNodeRef(o.meshCache,a.mesh,i);return a.weights!==void 0&&s.traverse(function(l){if(l.isMesh)for(let r=0,u=a.weights.length;r<u;r++)l.morphTargetInfluences[r]=a.weights[r]}),s})}loadNode(e){const t=this.json,o=this,a=t.nodes[e],i=o._loadNodeShallow(e),s=[],l=a.children||[];for(let u=0,c=l.length;u<c;u++)s.push(o.getDependency("node",l[u]));const r=a.skin===void 0?Promise.resolve(null):o.getDependency("skin",a.skin);return Promise.all([i,Promise.all(s),r]).then(function(u){const c=u[0],d=u[1],h=u[2];h!==null&&c.traverse(function(p){p.isSkinnedMesh&&p.bind(h,ac)});for(let p=0,f=d.length;p<f;p++)c.add(d[p]);return c})}_loadNodeShallow(e){const t=this.json,o=this.extensions,a=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const i=t.nodes[e],s=i.name?a.createUniqueName(i.name):"",l=[],r=a._invokeOne(function(u){return u.createNodeMesh&&u.createNodeMesh(e)});return r&&l.push(r),i.camera!==void 0&&l.push(a.getDependency("camera",i.camera).then(function(u){return a._getNodeRef(a.cameraCache,i.camera,u)})),a._invokeAll(function(u){return u.createNodeAttachment&&u.createNodeAttachment(e)}).forEach(function(u){l.push(u)}),this.nodeCache[e]=Promise.all(l).then(function(u){let c;if(i.isBone===!0?c=new Br:u.length>1?c=new Vt:u.length===1?c=u[0]:c=new li,c!==u[0])for(let d=0,h=u.length;d<h;d++)c.add(u[d]);if(i.name&&(c.userData.name=i.name,c.name=s),nt(c,i),i.extensions&&Yt(o,c,i),i.matrix!==void 0){const d=new Rt;d.fromArray(i.matrix),c.applyMatrix4(d)}else i.translation!==void 0&&c.position.fromArray(i.translation),i.rotation!==void 0&&c.quaternion.fromArray(i.rotation),i.scale!==void 0&&c.scale.fromArray(i.scale);if(!a.associations.has(c))a.associations.set(c,{});else if(i.mesh!==void 0&&a.meshCache.refs[i.mesh]>1){const d=a.associations.get(c);a.associations.set(c,{...d})}return a.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){const t=this.extensions,o=this.json.scenes[e],a=this,i=new Vt;o.name&&(i.name=a.createUniqueName(o.name)),nt(i,o),o.extensions&&Yt(t,i,o);const s=o.nodes||[],l=[];for(let r=0,u=s.length;r<u;r++)l.push(a.getDependency("node",s[r]));return Promise.all(l).then(function(r){for(let c=0,d=r.length;c<d;c++)i.add(r[c]);const u=c=>{const d=new Map;for(const[h,p]of a.associations)(h instanceof ln||h instanceof Ds)&&d.set(h,p);return c.traverse(h=>{const p=a.associations.get(h);p!=null&&d.set(h,p)}),d};return a.associations=u(i),i})}_createAnimationTracks(e,t,o,a,i){const s=[],l=e.name?e.name:e.uuid,r=[];Ht[i.path]===Ht.weights?e.traverse(function(h){h.morphTargetInfluences&&r.push(h.name?h.name:h.uuid)}):r.push(l);let u;switch(Ht[i.path]){case Ht.weights:u=Ps;break;case Ht.rotation:u=_s;break;case Ht.translation:case Ht.scale:u=Es;break;default:switch(o.itemSize){case 1:u=Ps;break;case 2:case 3:default:u=Es;break}break}const c=a.interpolation!==void 0?$l[a.interpolation]:hi,d=this._getArrayFromAccessor(o);for(let h=0,p=r.length;h<p;h++){const f=new u(r[h]+"."+Ht[i.path],t.array,d,c);a.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(f),s.push(f)}return s}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const o=Cn(t.constructor),a=new Float32Array(t.length);for(let i=0,s=t.length;i<s;i++)a[i]=t[i]*o;t=a}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(o){const a=this instanceof _s?Kl:wi;return new a(this.times,this.values,this.getValueSize()/3,o)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function sc(n,e,t){const o=e.attributes,a=new Gr;if(o.POSITION!==void 0){const l=t.json.accessors[o.POSITION],r=l.min,u=l.max;if(r!==void 0&&u!==void 0){if(a.set(new b(r[0],r[1],r[2]),new b(u[0],u[1],u[2])),l.normalized){const c=Cn(Eo[l.componentType]);a.min.multiplyScalar(c),a.max.multiplyScalar(c)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const i=e.targets;if(i!==void 0){const l=new b,r=new b;for(let u=0,c=i.length;u<c;u++){const d=i[u];if(d.POSITION!==void 0){const h=t.json.accessors[d.POSITION],p=h.min,f=h.max;if(p!==void 0&&f!==void 0){if(r.setX(Math.max(Math.abs(p[0]),Math.abs(f[0]))),r.setY(Math.max(Math.abs(p[1]),Math.abs(f[1]))),r.setZ(Math.max(Math.abs(p[2]),Math.abs(f[2]))),h.normalized){const g=Cn(Eo[h.componentType]);r.multiplyScalar(g)}l.max(r)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}a.expandByVector(l)}n.boundingBox=a;const s=new jr;a.getCenter(s.center),s.radius=a.min.distanceTo(a.max)/2,n.boundingSphere=s}function ks(n,e,t){const o=e.attributes,a=[];function i(s,l){return t.getDependency("accessor",s).then(function(r){n.setAttribute(l,r)})}for(const s in o){const l=_n[s]||s.toLowerCase();l in n.attributes||a.push(i(o[s],l))}if(e.indices!==void 0&&!n.index){const s=t.getDependency("accessor",e.indices).then(function(l){n.setIndex(l)});a.push(s)}return Cs.workingColorSpace!==Lt&&"COLOR_0"in o&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Cs.workingColorSpace}" not supported.`),nt(n,e),sc(n,e,t),Promise.all(a).then(function(){return e.targets!==void 0?Ql(n,e.targets,t):n})}const ic=Object.freeze(Object.defineProperty({__proto__:null,GLTFLoader:Ke},Symbol.toStringTag,{value:"Module"}));function no(n){const e=new Map,t=new Map,o=n.clone();return Si(n,o,function(a,i){e.set(i,a),t.set(a,i)}),o.traverse(function(a){if(!a.isSkinnedMesh)return;const i=a,s=e.get(a),l=s.skeleton.bones;i.skeleton=s.skeleton.clone(),i.bindMatrix.copy(s.bindMatrix),i.skeleton.bones=l.map(function(r){return t.get(r)}),i.bind(i.skeleton,i.bindMatrix)}),o}function Si(n,e,t){t(n,e);for(let o=0;o<n.children.length;o++)Si(n.children[o],e.children[o],t)}const qe={center:{x:13.5,y:-4.064,z:-1},radius:34,speed:.148,currentTime:0};function An(n){const e=qe.radius,t=1/(1+Math.sin(n)*Math.sin(n)),o=qe.center.x+e*t*Math.cos(n),a=qe.center.z+e*t*Math.sin(n)*Math.cos(n),i=qe.center.y;return{x:o,y:i,z:a}}let bt=null,xa=null;function bi(n,e,t){new Ke().load("./models/shark.glb",a=>{bt=a.scene;const i=An(0);bt.position.set(i.x,i.y,i.z),bt.scale.set(.16,.17,.18),bt.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),n.add(bt),a.animations&&a.animations.length>0&&(xa=new We(bt),a.animations.forEach(s=>{xa.clipAction(s).play()}))},void 0,a=>{console.error("Error loading shark model:",a)})}function rc(n){if(!bt)return;qe.currentTime+=n*qe.speed;const e=An(qe.currentTime),t=An(qe.currentTime+.01),o=new b(t.x-e.x,t.y-e.y,t.z-e.z).normalize();bt.position.set(e.x,e.y,e.z);const a=Math.atan2(o.x,o.z);bt.rotation.y=a,xa&&xa.update(n)}let Da=null;const ya=[],Mi=[],In=[],lc=106,cc=2,$t=280,Ti=1.85,uc=28.2,xi=30,dc=8,hc=6,Hs=18;let wa=0;const fc=5;function Di(n,e,t){new Ke().load("./models/manta-ray.glb",a=>{Da=a.scene,In.push(...a.animations);for(let i=0;i<xi;i++)Ei(n,!0,i);wa=0},void 0,a=>{console.error("Error loading manta ray model:",a)})}function Ei(n,e=!1,t=0){if(!Da)return;const o=no(Da);o.traverse(s=>{s.isMesh&&(s.castShadow=!1,s.receiveShadow=!1)});const a=ee.randFloat(.12,.18);o.scale.set(a,a,a),o.rotation.y=Math.PI/2;let i;if(e){const s=t/xi;i=-$t/2+s*$t}else i=-$t/2-Math.random()*20;if(o.position.set(i,qe.center.y-.5+ee.randFloatSpread(Ti),qe.center.z+ee.randFloatSpread(30)),o.userData.baseY=o.position.y,o.userData.baseZ=o.position.z,o.userData.offset=Math.random()*10,o.userData.speed=cc*ee.randFloat(.8,1.2),o.userData.avoidanceSide=o.position.z>=0?1:-1,e&&(o.userData.fadeTime=0,o.userData.isFading=!0,o.traverse(s=>{s.isMesh&&s.material&&(s.material.transparent=!0,s.material.opacity=0)})),n.add(o),ya.push(o),In.length>0){const s=new We(o);In.forEach(l=>s.clipAction(l).play()),Mi.push(s)}}function mc(n){Ei(n,!1,0)}function pc(n,e){if(Da){wa+=n,ya.length<lc&&wa>uc*Math.random()&&(mc(e),wa=0);for(let t=0;t<ya.length;t++){const o=ya[t],a=o.userData.speed;if(o.userData.isFading){o.userData.fadeTime+=n;const r=Math.min(o.userData.fadeTime/dc,1);o.traverse(u=>{u.isMesh&&u.material&&(u.material.opacity=r)}),r>=1&&(o.userData.isFading=!1)}o.position.x+=a*n;const i=Math.abs(o.position.x);if(i<Hs){const r=1-i/Hs,c=r*r*(3-2*r)*hc*o.userData.avoidanceSide;o.position.z=o.userData.baseZ+c;const d=6*r*(1-r),h=o.position.x<0?1:-1,p=d*.4*o.userData.avoidanceSide*h;o.rotation.z=p}else o.position.z=o.userData.baseZ,o.rotation.z=0;o.position.x>$t/2+20&&(o.position.x=-$t/2-Math.random()*20,o.position.y=qe.center.y-.5+ee.randFloatSpread(Ti),o.position.z=qe.center.z+ee.randFloatSpread(30),o.userData.baseY=o.position.y,o.userData.baseZ=o.position.z,o.userData.avoidanceSide=o.position.z>=0?1:-1);const s=(o.position.x+$t/2)/$t,l=1-Math.sin(s*Math.PI);o.position.y=o.userData.baseY+Math.sin(performance.now()*.001+o.userData.offset)*.2-l*fc}Mi.forEach(t=>t.update(n))}}let Sa=null;const Ea=[],Ln=[],Ko=new cs([new b(80,-8,0),new b(0,-10,60),new b(-120,-14,0),new b(0,-12,-20),new b(80,-8,0)],!0,"centripetal",.8),gc=.0032;Ko.getLengths()[Ko.getLengths().length-1];function Pi(n,e,t){new Ke().load("./models/whale.glb",a=>{Sa=a.scene;const i=a.animations,s=no(Sa);if(s.scale.set(.825,.825,.825),s.userData.pathProgress=Math.random(),s.userData.speed=gc*ee.randFloat(.9,1.1),s.userData.lookAhead=.41,s.userData.pathOffset=0,s.userData.baseYOffset=0,s.userData.baseXOffset=0,s.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),n.add(s),Ea.push(s),i.length>0){const r=new We(s);i.forEach(u=>r.clipAction(u).play()),Ln.push(r)}const l=no(Sa);if(l.scale.set(.42,.42,.42),l.userData.pathProgress=s.userData.pathProgress-.01,l.userData.pathProgress>1&&(l.userData.pathProgress-=1),l.userData.speed=s.userData.speed,l.userData.lookAhead=.41,l.userData.pathOffset=-3.215,l.userData.baseYOffset=-3.2862,l.userData.baseXOffset=8.2261,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),n.add(l),Ea.push(l),i.length>0){const r=new We(l);i.forEach(u=>{r.clipAction(u).startAt(Math.random()*u.duration).play()}),Ln.push(r)}},void 0,a=>{console.error("Error loading whale model:",a)})}function vc(n,e){if(!Sa)return;const t=new b;new b(0,1,0),new b;const o=new It;for(let a=0;a<Ea.length;a++){const i=Ea[a];i.userData.pathProgress+=i.userData.speed*n,i.userData.pathProgress>1&&(i.userData.pathProgress-=1);const s=Ko.getPointAt(i.userData.pathProgress);i.position.copy(s),i.position.y+=i.userData.baseYOffset,i.position.x+=i.userData.baseXOffset;const l=Ko.getPointAt((i.userData.pathProgress+i.userData.lookAhead)%1);i.lookAt(l),Ko.getTangentAt(i.userData.pathProgress,t);const r=new b(0,0,1);o.setFromUnitVectors(r,t.normalize()),i.quaternion.copy(o)}Ln.forEach(a=>a.update(n))}let zs=null;const Pa=[],_i=[],Xo=new cs([new b(45,-7,22),new b(18,-5,38),new b(-22,-6,33),new b(-55,-8,-11),new b(-25,-7,-46),new b(19,-6,-36),new b(45,-7,22)],!0,"centripetal",.7),yc=.023,wc=Xo.getLength();function Ci(n,e,t){new Ke().load("./models/dolphin.glb",a=>{zs=a.scene;const i=a.animations;for(let s=0;s<7;s++){const l=no(zs);if(l.scale.setScalar(.31+Math.random()*.041),s===0&&(l.userData.pathProgress=0),l.userData.speed=yc*ee.randFloat(.95,1.05),l.userData.lookAhead=.35,l.userData.sineAmp=3.65,l.userData.sineFreq=2.8+Math.random()*.4,l.userData.roll=0,l.userData.spinTimer=Math.random()*6,l.userData.spinDuration=.55,l.userData.spinSpeed=0,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),n.add(l),Pa.push(l),i.length>0){const r=new We(l);i.forEach(u=>r.clipAction(u).play()),_i.push(r)}}e&&e(Pa)},void 0,a=>{console.error("Error loading dolphin model:",a)})}function Sc(n){const e=new b,t=new b(0,1,0),o=6,a=4,i=.18;Pa.forEach((s,l)=>{l===0&&(s.userData.pathProgress+=s.userData.speed*n);let r;if(l===0){r=s.userData.pathProgress%1,r<0&&(r+=1);const u=Xo.getPointAt(r),c=Math.sin(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.65);if(u.y+=c,u.y>-.2){const g=(u.y+.2)/3;u.y-=4*g*g}s.position.copy(u);const d=(s.userData.pathProgress+.08)%1,h=Xo.getPointAt(d);e.subVectors(h,u).normalize(),s.lookAt(u.clone().add(e));const p=Math.cos(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.65*Math.PI*2*s.userData.sineFreq*2.2),f=-Math.atan(p*.006);s.rotateX(f)}else{s.userData.podOffset===void 0&&(s.userData.podOffset=ee.randFloat(-4,a)),s.userData.podSide===void 0&&(s.userData.podSide=ee.randFloat(-o,o));let u=Pa[0].userData.pathProgress+s.userData.podOffset/wc;s.userData.pathProgress===void 0&&(s.userData.pathProgress=u);const c=u-s.userData.pathProgress;s.userData.pathProgress+=c*i,r=s.userData.pathProgress%1,r<0&&(r+=1);const d=Xo.getPointAt(r),h=(s.userData.pathProgress+.08)%1,p=Xo.getPointAt(h);e.subVectors(p,d).normalize();const f=new b().crossVectors(e,t).normalize();d.add(f.multiplyScalar(s.userData.podSide));const g=Math.sin(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.85);if(d.y+=g,d.y>-.2){const M=(d.y+.2)/3;d.y-=4*M*M}s.position.copy(d),s.lookAt(d.clone().add(e));const v=Math.cos(s.userData.pathProgress*Math.PI*2*s.userData.sineFreq*2.2)*(s.userData.sineAmp*.85*Math.PI*2*s.userData.sineFreq*2.2),w=-Math.atan(v*.006);s.rotateX(w)}s.userData.spinTimer-=n,s.userData.spinTimer<=0&&s.userData.spinSpeed===0&&(s.userData.spinSpeed=(5+Math.random()*3)*(Math.random()>.5?1:-1),s.userData.spinTimer=s.userData.spinDuration),s.userData.spinTimer<=0&&(s.userData.spinSpeed=0,s.userData.spinTimer=3+Math.random()*4),s.userData.roll+=s.userData.spinSpeed*n,s.rotation.z=s.userData.roll}),_i.forEach(s=>s.update(n))}let Rn=null;const Ai=[],Ii=[],On=new cs([new b(-400,-3.28,-150),new b(-200,-1.612,50),new b(20,-1.498,180),new b(200,-1.612,50),new b(400,-3.28,-150)],!1,"centripetal",.95),bc=.00297;On.getLength();function Li(n,e,t){new Ke().load("./models/container-ship.glb",a=>{Rn=a.scene;const i=a.animations,s=no(Rn);if(s.scale.setScalar(16.2),s.userData.pathProgress=0,s.userData.speed=bc*ee.randFloat(.9,1.1),s.userData.lookAhead=.02,s.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),n.add(s),Ai.push(s),i.length>0){const l=new We(s);i.forEach(r=>l.clipAction(r).play()),Ii.push(l)}},void 0,a=>{console.error("Error loading container-ship model:",a)})}function Mc(n){Rn&&(new b,new b(0,1,0),Ai.forEach(e=>{e.userData.pathProgress+=e.userData.speed*n,e.userData.pathProgress=ee.clamp(e.userData.pathProgress,0,1);const t=On.getPointAt(e.userData.pathProgress);e.position.copy(t);const o=On.getPointAt(Math.min(e.userData.pathProgress+e.userData.lookAhead,1));e.lookAt(o)}),Ii.forEach(e=>e.update(n)))}const Nt={center:{x:93.5,y:-2.874,z:-61},radius:34,speed:.148,currentTime:0};function Fn(n){const e=Nt.radius,t=1/(1+Math.sin(n)*Math.sin(n)),o=Nt.center.x+e*t*Math.cos(n),a=Nt.center.z+e*t*Math.sin(n)*Math.cos(n),i=Nt.center.y;return{x:o,y:i,z:a}}let Mt=null,_a=null;function Ri(n,e,t){new Ke().load("./models/sailboat.glb",a=>{Mt=a.scene;const i=Fn(0);Mt.position.set(i.x,i.y,i.z),Mt.scale.set(.12,.13,.09),Mt.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),n.add(Mt),a.animations&&a.animations.length>0&&(_a=new We(Mt),a.animations.forEach(s=>{_a.clipAction(s).play()}))},void 0,a=>{console.error("Error loading sailBoat model:",a)})}function Tc(n){if(!Mt)return;Nt.currentTime+=n*Nt.speed;const e=Fn(Nt.currentTime),t=Fn(Nt.currentTime+.01),o=new b(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Mt.position.set(e.x,e.y,e.z);const a=Math.atan2(o.x,o.z);Mt.rotation.y=a,_a&&_a.update(n)}let Ns=null,vo=null;function Oi(n,e,t,o,a){new Ke().load("./models/mayan-temple.glb",s=>{Ns=s.scene;const l=no(Ns);if(l.scale.setScalar(5.6),l.position.set(.684,-1.82,.14),l.rotation.y=Math.PI*.1,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),n.add(l),e){const d=[new Je(-4.68,0,-4.68),new Je(4.68,0,-4.68),new Je(4.68,0,4.68),new Je(-4.68,0,4.68),new Je(-1.64,3.69,-1.64),new Je(1.64,3.69,-1.64),new Je(1.64,3.69,1.64),new Je(-1.64,3.69,1.64)],h=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]],p=new al({vertices:d,faces:h}),f=1.2,g=.8,v=1.2,w=new nl(new Je(f,g,v));vo=new Ka({mass:0,material:t}),vo.addShape(p);const M=new Je(0,3.69+g,0);vo.addShape(w,M),vo.position.set(l.position.x,l.position.y+3.69-5.98,l.position.z),vo.quaternion.setFromEuler(0,l.rotation.y,0),e.addBody(vo)}},void 0,s=>{console.error("Error loading Mayan-temple model:",s)})}const Dt={center:{x:0,y:-6.5,z:0},radius:18,speed:.08,currentTime:0};function kn(n){const e=Dt.center.x+Dt.radius*Math.cos(n),t=Dt.center.z+Dt.radius*Math.sin(n),o=Dt.center.y;return{x:e,y:o,z:t}}let Tt=null,Ca=null;function Fi(n,e,t){new Ke().load("./models/whale_shark.glb",a=>{Tt=a.scene;const i=kn(0);Tt.position.set(i.x,i.y,i.z),Tt.scale.set(.58,.58,.58),Tt.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!0)}),n.add(Tt),a.animations&&a.animations.length>0&&(Ca=new We(Tt),a.animations.forEach(s=>{Ca.clipAction(s).play()}))},void 0,a=>{console.error("Error loading whale shark model:",a)})}function xc(n){if(!Tt)return;Ca&&Ca.update(n),Dt.currentTime+=n*Dt.speed;const e=kn(Dt.currentTime),t=kn(Dt.currentTime+.05),o=new b(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Tt.position.set(e.x,e.y,e.z);const a=Math.atan2(o.x,o.z);Tt.rotation.y=a-Math.PI/2}let zt=null,Aa=null,Bs=0;function ki(n,e,t){new Ke().load("./models/seagulls-spiral.glb",a=>{zt=a.scene,zt.position.set(0,5.6,0),zt.scale.set(.142,.142,.142),zt.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!1)}),n.add(zt),a.animations&&a.animations.length>0&&(Aa=new We(zt),a.animations.forEach(i=>{const s=Aa.clipAction(i);s.timeScale=.65,s.play()}))},void 0,a=>{console.error("Error loading seagulls model:",a)})}function Dc(n){if(!zt)return;Aa&&Aa.update(n),Bs+=n;const o=Math.sin(Bs*.24)*1.5;zt.position.y=8+o}const Ia=[];let Hi={};const Ec=-10,Pc=2.5,_c=4,Cc={separationDistance:.8,separationForce:.8,alignmentDistance:2,alignmentForce:.3,cohesionDistance:3,cohesionForce:.2,maxSpeed:2,minSpeed:.5,maxForce:.05,avoidanceDistance:5,containmentRadius:20,containmentForce:.3,swimDepth:-3,depthVariation:1.5,wanderStrength:.02,damping:.98};function La(n,e,t,o){const a=new Ke,i={modelPath:e.modelPath,count:e.count||20,spawnArea:e.spawnArea||{centerX:0,centerZ:0,radiusX:15,radiusZ:15},behavior:{...Cc,...e.behavior||{}},scale:e.scale||{min:.15,max:.25},waterLevel:e.waterLevel||-1.814,levels:e.levels||[1],fish:[],mixers:[],isHiding:!1,hideProgress:0};a.load(e.modelPath,s=>{const l=s.scene,r=s.animations;Hi[e.modelPath]=l,i.waterLevel=e.waterLevel;for(let u=0;u<i.count;u++){const c=no(l),d=ee.randFloat(i.scale.min,i.scale.max);c.scale.setScalar(d);const h=i.spawnArea.centerX+ee.randFloatSpread(i.spawnArea.radiusX),p=i.spawnArea.centerZ+ee.randFloatSpread(i.spawnArea.radiusZ),f=i.behavior.swimDepth+ee.randFloatSpread(i.behavior.depthVariation);c.position.set(h,f,p);const g=Math.random()*Math.PI*2,v=ee.randFloat(i.behavior.minSpeed,i.behavior.maxSpeed);c.userData.velocity=new b(Math.cos(g)*v,0,Math.sin(g)*v),c.userData.acceleration=new b(0,0,0),c.userData.wanderAngle=Math.random()*Math.PI*2,c.userData.originalPosition=new b(h,f,p);const w=Math.random()*Math.PI*2,M=Math.random()*Pc;if(c.userData.hideTarget=new b(Math.cos(w)*M,Ec,Math.sin(w)*M),c.traverse(y=>{y.isMesh&&(y.castShadow=!0,y.receiveShadow=!1)}),n.add(c),i.fish.push(c),r.length>0){const y=new We(c);r.forEach(S=>{y.clipAction(S).startAt(Math.random()*S.duration).play()}),i.mixers.push(y)}}Ia.push(i),t&&t(i)},void 0,s=>{console.error("Error loading fish model:",e.modelPath,s)})}function yo(n,e,t){e.clampLength(0,t),n.userData.acceleration.add(e)}const Me=new b,lt=new b;function Ac(n,e,t){const o=new b;let a=0;const i=t.separationDistance*t.separationDistance;for(let s=0;s<e.length;s++){const l=e[s];if(l===n)continue;const r=n.position.x-l.position.x,u=n.position.y-l.position.y,c=n.position.z-l.position.z,d=r*r+u*u+c*c;if(d>.001&&d<i){const h=Math.sqrt(d);Me.set(r,u,c),Me.normalize(),Me.divideScalar(h),o.add(Me),a++}}return a>0&&(o.divideScalar(a),o.normalize(),o.multiplyScalar(t.maxSpeed),o.sub(n.userData.velocity),o.multiplyScalar(t.separationForce)),o}function Ic(n,e,t){const o=new b;let a=0;const i=t.alignmentDistance*t.alignmentDistance;for(let s=0;s<e.length;s++){const l=e[s];if(l===n)continue;const r=n.position.x-l.position.x,u=n.position.y-l.position.y,c=n.position.z-l.position.z,d=r*r+u*u+c*c;d>.001&&d<i&&(o.add(l.userData.velocity),a++)}return a>0?(o.divideScalar(a),o.normalize(),o.multiplyScalar(t.maxSpeed),lt.subVectors(o,n.userData.velocity),lt.multiplyScalar(t.alignmentForce),lt.clone()):o}function Lc(n,e,t){const o=new b;let a=0;const i=t.cohesionDistance*t.cohesionDistance;for(let s=0;s<e.length;s++){const l=e[s];if(l===n)continue;const r=n.position.x-l.position.x,u=n.position.y-l.position.y,c=n.position.z-l.position.z,d=r*r+u*u+c*c;d>.001&&d<i&&(o.add(l.position),a++)}return a>0?(o.divideScalar(a),Me.subVectors(o,n.position),Me.normalize(),Me.multiplyScalar(t.maxSpeed),lt.subVectors(Me,n.userData.velocity),lt.multiplyScalar(t.cohesionForce),lt.clone()):o}function Rc(n,e){const t=new b,o=Math.sqrt(n.position.x*n.position.x+n.position.z*n.position.z);if(o<e.avoidanceDistance){t.set(n.position.x,0,n.position.z),t.normalize(),t.multiplyScalar(e.maxSpeed),t.sub(n.userData.velocity);const a=1-o/e.avoidanceDistance;t.multiplyScalar(a*1.5)}return t}function Oc(n,e,t){const o=new b,a=n.position.x-e.centerX,i=n.position.z-e.centerZ,s=Math.sqrt(a*a+i*i);if(s>t.containmentRadius){o.set(-a,0,-i),o.normalize(),o.multiplyScalar(t.maxSpeed),o.sub(n.userData.velocity);const l=s-t.containmentRadius,r=Math.min(l/10,1);o.multiplyScalar(r*t.containmentForce)}return o}function Fc(n,e,t){n.userData.wanderAngle+=ee.randFloatSpread(.2)*t;const o=new b(Math.cos(n.userData.wanderAngle),Math.sin(n.userData.wanderAngle*.3)*.2,Math.sin(n.userData.wanderAngle));return o.multiplyScalar(e.wanderStrength),o}let Ws=0;function kc(n,e=!1){const t=Math.min(n,.1);Ia.forEach(o=>{const a=o.behavior;if(e&&!o.isHiding?(o.isHiding=!0,console.log("🐟 Fish detected storm, preparing to hide...")):!e&&o.isHiding&&o.hideProgress>=.9&&(o.isHiding=!1,console.log("🐟 Storm over, fish returning...")),o.isHiding?o.hideProgress=Math.min(1,o.hideProgress+t*.7):o.hideProgress=Math.max(0,o.hideProgress-t*.15),o.hideProgress>=.7&&o.isHiding){o.fish[0]&&o.fish[0].visible&&o.fish.forEach(s=>{s.visible=!1});return}o.hideProgress<.7&&o.fish[0]&&!o.fish[0].visible&&o.fish.forEach(s=>{s.visible=!0}),Ws++;const i=Ws%2===0;o.fish.forEach((s,l)=>{if(o.hideProgress>.05&&o.isHiding){if(Me.copy(s.userData.hideTarget).sub(s.position),Me.length()>.1){const g=Me.x,v=Me.z,w=Me.y;Me.normalize().multiplyScalar(_c*t),s.position.add(Me);let y=Math.atan2(g,v)-s.rotation.y;y>Math.PI&&(y-=Math.PI*2),y<-Math.PI&&(y+=Math.PI*2),s.rotation.y+=y*.15,s.rotation.x=-w*.3}o.mixers[l]&&o.mixers[l].update(t*.5);return}if(!o.isHiding&&o.hideProgress>0&&o.hideProgress<.2){const f=new b(o.spawnArea.centerX-s.position.x,a.swimDepth-s.position.y,o.spawnArea.centerZ-s.position.z);f.normalize().multiplyScalar(a.maxSpeed*.5),s.userData.velocity.copy(f)}if(i){s.userData.acceleration.set(0,0,0);const f=Ac(s,o.fish,a),g=Ic(s,o.fish,a),v=Lc(s,o.fish,a),w=Rc(s,a),M=Oc(s,o.spawnArea,a),y=Fc(s,a,t);yo(s,f,a.maxForce*1.5),yo(s,g,a.maxForce),yo(s,v,a.maxForce),yo(s,w,a.maxForce*2),yo(s,M,a.maxForce*3),yo(s,y,a.maxForce*.3)}if(i){s.userData.velocity.add(s.userData.acceleration),s.userData.velocity.multiplyScalar(a.damping);const f=s.userData.velocity.length();f>a.maxSpeed?s.userData.velocity.normalize().multiplyScalar(a.maxSpeed):f<a.minSpeed&&s.userData.velocity.normalize().multiplyScalar(a.minSpeed)}Me.copy(s.userData.velocity).multiplyScalar(t),s.position.add(Me);const r=o.waterLevel||-1.814,u=.3;s.position.y>r-u&&(s.position.y=r-u,s.userData.velocity.y=Math.min(0,s.userData.velocity.y));const d=a.swimDepth-s.position.y;if(Math.abs(d)/(a.depthVariation*2)>.04&&(s.userData.velocity.y+=d*.01*t*60),s.userData.velocity.lengthSq()>.01){lt.copy(s.userData.velocity).normalize();let g=Math.atan2(lt.x,lt.z)-s.rotation.y;g>Math.PI&&(g-=Math.PI*2),g<-Math.PI&&(g+=Math.PI*2),s.rotation.y+=g*.1;const v=-lt.y*.25;s.rotation.x+=(v-s.rotation.x)*.1}o.mixers[l]&&o.mixers[l].update(t)})})}function Hc(n){Ia.forEach(e=>{e.fish.forEach(t=>{n.remove(t),t.traverse(o=>{o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(a=>a.dispose()):o.material.dispose())})}),e.mixers.forEach(t=>t.stopAllAction())}),Ia.length=0,Hi={}}const fs=new et({uniforms:{uTime:{value:0}},transparent:!0,side:ot,depthWrite:!1,vertexShader:`
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
  `}),ea=[];let Ja=0;const ms={cache:new Map,get(n){const e=Math.round(n*100)/100;if(!this.cache.has(e)){let t;e<.15?t=16:e<.25?t=24:e<.4?t=32:t=48,this.cache.set(e,new ss(e,t,t))}return this.cache.get(e)},dispose(){this.cache.forEach(n=>n.dispose()),this.cache.clear()}},se={enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:12,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.5,fadeInDuration:2800,fadeOutDuration:2800};function zi(n){Object.assign(se,n),console.log("Spawn config updated for level:",se)}function zc(n,e,t){return function(a,i){const s=se.minRadius+Math.random()*(se.maxRadius-se.minRadius),l=new ve(ms.get(s),fs);l.position.set(a,se.spawnHeight,i),l.castShadow=!0,l.receiveShadow=!0,l.renderOrder=3,n.add(l);const r=new ds(s),u=s*s*s*30.5,c=new Ka({mass:u,material:t,linearDamping:.3,angularDamping:.3});c.addShape(r),c.position.set(a,se.spawnHeight,i),e.addBody(c),Ja+=u;const d={mesh:l,body:c,radius:s,active:!0,hasSpawnedRipple:!1};return ea.push(d),d}}function Nc(n){fs.uniforms.uTime.value+=n}function ma(){return Ja}function Bc(n){Ja+=n}function Wc(){Ja=0}const ps=new Audio("./sounds/tropical-island-waves.mp3");ps.loop=!0;ps.volume=.45;let Ni=!1,ft=!1;const Hn=[new Audio("./sounds/stone-debris.wav"),new Audio("./sounds/stones-falling-down.wav"),new Audio("./sounds/stones-short-debris.wav")];Hn.forEach(n=>{n.volume=.3});let Bt=null,Ra=!1;const ta=new Audio("./sounds/correct-answer.wav");ta.volume=.4;const oa=new Audio("./sounds/winning-chimes.wav");oa.volume=.5;const Ne={small:new Audio("./sounds/water-drip-small.wav"),medium:new Audio("./sounds/water-drop.mp3"),large:new Audio("./sounds/water-drip-large.wav"),bubble:new Audio("./sounds/water-bubble.wav")};Ne.small.volume=.4;Ne.medium.volume=.5;Ne.large.volume=.6;Ne.bubble.volume=.3;const Oa=new Audio("./sounds/drizzle.mp3");Oa.loop=!0;Oa.volume=.45;let aa=[];const zn=new Audio("./sounds/woosh.wav");zn.volume=.5;const we=new Audio("./sounds/jungle-day.mp3");we.loop=!0;we.volume=0;let Oe=null;function Ao(){return ps}function gs(){return Ni}function Fa(n){Ni=n}function Bi(){return ft}function Vs(n){ft=n}function Vc(n){if(ft)return;const e=[],t=Math.random();if(n<.8)t<.5?e.push(Ne.small):t<.8?e.push(Ne.medium):e.push(Ne.bubble);else if(n<1.3)t<.4?e.push(Ne.medium):t<.8?e.push(Ne.large):e.push(Ne.bubble);else if(t<.6?e.push(Ne.large):e.push(Ne.bubble),t>.7){const i=Ne.medium.cloneNode();i.volume=.3,i.currentTime=0,i.play().catch(s=>console.log("Water splash extra sound failed:",s))}const o=e[0],a=o.cloneNode();a.volume=o.volume,a.currentTime=0,a.playbackRate=.9+Math.random()*.2,a.play().catch(i=>console.log("Water splash sound failed:",i))}function Wi(){if(ft)return;const n=Math.floor(Math.random()*Hn.length);Bt=Hn[n],Bt.currentTime=0,Bt.play().catch(e=>console.log("Sculpt sound failed:",e)),Bt.onended=()=>{Ra&&!ft&&Wi()}}function Uc(){Bt&&(Bt.pause(),Bt.onended=null,Bt=null)}function Vi(){Ra||(Ra=!0,Wi())}function Qa(){Ra=!1,Uc()}function Xc(){ft||(ta.currentTime=0,ta.play().catch(n=>console.log("Quick-lock sound failed:",n)))}function Gc(){ft||(oa.currentTime=0,oa.play().catch(n=>console.log("Winning chimes sound failed:",n)))}function jc(){ft||(zn.currentTime=0,zn.play().catch(n=>console.log("Woosh sound failed:",n)))}function Ui(){if(ft)return null;const n=Oa.cloneNode();return n.volume=Oa.volume,n.loop=!0,n.play().catch(e=>console.log("Drizzle sound failed:",e)),aa.push(n),n}function Xi(n){if(!n)return;const e=setInterval(()=>{if(n.volume>.05)n.volume=Math.max(0,n.volume-.05);else{n.pause(),n.currentTime=0,clearInterval(e);const t=aa.indexOf(n);t>-1&&aa.splice(t,1)}},50)}function Zc(){if(ft)return;Oe&&(clearInterval(Oe),Oe=null),we.currentTime=0,we.volume=0,we.play().catch(i=>console.log("Jungle day sound failed:",i));const n=.5,e=2e3,t=40,o=e/t,a=n/t;Oe=setInterval(()=>{we.volume<n-a?we.volume=Math.min(n,we.volume+a):(we.volume=n,clearInterval(Oe),Oe=null)},o)}function qc(){Oe&&(clearInterval(Oe),Oe=null);const n=1500,e=30,t=n/e,a=we.volume/e;Oe=setInterval(()=>{we.volume>a?we.volume=Math.max(0,we.volume-a):(we.volume=0,we.pause(),we.currentTime=0,clearInterval(Oe),Oe=null)},t)}function vs(){Qa(),ta.pause(),ta.currentTime=0,oa.pause(),oa.currentTime=0,aa.forEach(n=>{n.pause(),n.currentTime=0}),aa=[],Oe&&(clearInterval(Oe),Oe=null),we.pause(),we.currentTime=0,we.volume=0}const m={startDelay:8500,duration:14800,dropInterval:180,ballsDropped:0,isActive:!1,startTime:0,steadyStateReached:!1,steadyStateValues:null,cloudUpdateFrameCounter:0,startTimeoutId:null,dropIntervalId:null};function Nn(n,e=!0){const{scene:t,world:o,ballMaterial:a,randomTerrainPosition:i,createCloudIndicator:s,sharedCloudTexture:l,sky:r,renderer:u,water:c}=n,d=45;m.startTimeoutId=setTimeout(()=>{m.isActive=!0,m.startTime=Date.now(),m.ballsDropped=0;const h=i(),p=s({startX:h.x,startZ:h.z,endX:h.x,endZ:h.z,cloudTexture:l,rainCount:50,cloudHeight:31.88}),f=p.userData.cloud,g=p.userData.cloudMaterial;f.scale.set(125,32,128),f.rotation.y=Math.random()*Math.PI*2;const v=.22,w=.344;g.uniforms.base.value.setRGB(121/255*.5,138/255*.55,160/255*.65),g.uniforms.threshold.value=w,f.renderOrder=10,t.add(p);const M=Ui();p.userData.drizzleSound=M,m.cloudData={group:p,startTime:Date.now(),rotationSpeed:.0013,baseOpacity:v},m.originalSkyValues={turbidity:r.material.uniforms.turbidity.value,rayleigh:r.material.uniforms.rayleigh.value,mieCoefficient:r.material.uniforms.mieCoefficient.value,exposure:u.toneMappingExposure},m.originalWaterValues={heightMultiplier:c.material.uniforms.uWaveHeightMultiplier.value,amplitude:c.material.uniforms.uWaveAmplitude.value,waterLevel:c.mesh.position.y},m.originalHemisphereColors={deepColor:c.hemisphereMesh.material.uniforms.uDeepColor.value.clone(),shallowColor:c.hemisphereMesh.material.uniforms.uShallowColor.value.clone()},m.water=c;const y=new Audio("sounds/thunderstorm.mp3");m.thunderSound=y,m.lightningTriggered=!1,m.lightningStarted=!1;const S=document.createElement("div");S.id="lightning-flash",S.style.position="fixed",S.style.top="0",S.style.left="0",S.style.width="100%",S.style.height="100%",S.style.backgroundColor="white",S.style.opacity="0",S.style.pointerEvents="none",S.style.zIndex="1000",document.body.appendChild(S),m.lightningFlash=S,m.dropIntervalId=setInterval(()=>{if(m.ballsDropped>=d){clearInterval(m.dropIntervalId),m.dropIntervalId=null;return}const T=i(),A=.12+Math.random()*.1,I=new ve(ms.get(A),fs);I.position.set(T.x,se.spawnHeight,T.z),I.castShadow=!0,I.receiveShadow=!1,I.renderOrder=3,t.add(I);const C=new ds(A),k=A*A*A,L=new Ka({mass:k,material:a,linearDamping:0,angularDamping:0});L.addShape(C),L.position.set(T.x,se.spawnHeight,T.z),o.addBody(L),e&&Bc(k),ea.push({mesh:I,body:L,radius:A,active:!0,hasSpawnedRipple:!1}),m.ballsDropped++},m.dropInterval)},m.startDelay)}function Us(n,e){if(!m.lightningTriggered&&n>2500&&n<3500){m.lightningStarted||(m.lightningStarted=!0,m.lightningStartTime=e,m.thunderSound&&!Bi()&&(m.thunderSound.currentTime=0,m.thunderSound.play().catch(a=>console.log("Thunder audio failed:",a))));const t=e-m.lightningStartTime;let o=0;return t<80?o=.9*(1-t/80):t>=180&&t<280?o=.85*(1-(t-180)/100):t>=280&&(m.lightningTriggered=!0,o=0),m.lightningFlash&&(m.lightningFlash.style.opacity=o.toString()),!0}return!1}function Gi(){if(m.lightningFlash){const n=document.getElementById("lightning-flash");n&&document.body.removeChild(n),m.lightningFlash=null}}function Yc(){m.isActive=!1,m.ballsDropped=0,m.startTime=0,m.lightningTriggered=!1,m.lightningStarted=!1,m.steadyStateReached=!1,m.steadyStateValues=null,m.cloudUpdateFrameCounter=0,m.startTimeoutId!==null&&(clearTimeout(m.startTimeoutId),m.startTimeoutId=null),m.dropIntervalId!==null&&(clearInterval(m.dropIntervalId),m.dropIntervalId=null),m.thunderSound&&(m.thunderSound.pause(),m.thunderSound.currentTime=0),Gi(),delete m.originalSkyValues,m.originalWaterValues&&m.water&&(m.water.setWaveChoppiness(m.originalWaterValues.heightMultiplier,m.originalWaterValues.amplitude),m.water.mesh.position.y=m.originalWaterValues.waterLevel),m.originalHemisphereColors&&m.water&&(m.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(m.originalHemisphereColors.deepColor),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(m.originalHemisphereColors.shallowColor)),delete m.originalWaterValues,delete m.originalHemisphereColors,delete m.water}function Kc(n){const{gameStarted:e,scene:t,camera:o,dt:a,sky:i,renderer:s,updateCloud:l,updateRainParticles:r,setRainOpacity:u}=n;if(!e||!m.isActive||!m.cloudData)return!1;const c=Date.now(),d=c-m.startTime,h=m.cloudData,p=c-h.startTime,{cloud:f,cloudMaterial:g}=h.group.userData;f.visible||(f.visible=!0),m.cloudUpdateFrameCounter++,m.cloudUpdateFrameCounter>=1.22&&(l(h.group,o,a),m.cloudUpdateFrameCounter=0),f.rotation.y+=h.rotationSpeed;const v=4e3,w=3800,M=m.duration-2500,y=m.duration-2e3,S=d<w,T=d>y,A=!S&&!T;let I=h.baseOpacity;if(p<v){const C=p/v,k=C*C*C;I*=k}else if(d>M){const C=(d-(m.duration-1500))/1500;I*=Math.max(0,1-C)}if(g.uniforms.opacity.value=Math.max(0,I),A&&m.steadyStateReached)return r(h.group,a),u(h.group,I*.6),d>=2500&&d<=3500&&Us(d,c),!0;if(m.originalSkyValues){Us(d,c);const C=0,k=.025,L=.01,B=.53;if(S){const le=d/w,Y=le*le;i.material.uniforms.turbidity.value=m.originalSkyValues.turbidity+(C-m.originalSkyValues.turbidity)*Y,i.material.uniforms.rayleigh.value=m.originalSkyValues.rayleigh+(k-m.originalSkyValues.rayleigh)*Y,i.material.uniforms.mieCoefficient.value=m.originalSkyValues.mieCoefficient+(L-m.originalSkyValues.mieCoefficient)*Y,s.toneMappingExposure=m.originalSkyValues.exposure+(B-m.originalSkyValues.exposure)*Y}else if(T){const le=(d-y)/2e3,Y=1-Math.pow(1-le,2),K=m.originalSkyValues.turbidity+(C-m.originalSkyValues.turbidity)*(1-Y),Fe=m.originalSkyValues.rayleigh+(k-m.originalSkyValues.rayleigh)*(1-Y),ae=m.originalSkyValues.mieCoefficient+(L-m.originalSkyValues.mieCoefficient)*(1-Y),ce=m.originalSkyValues.exposure+(B-m.originalSkyValues.exposure)*(1-Y);i.material.uniforms.turbidity.value=K,i.material.uniforms.rayleigh.value=Fe,i.material.uniforms.mieCoefficient.value=ae,s.toneMappingExposure=ce}else m.steadyStateReached||(m.steadyStateReached=!0,i.material.uniforms.turbidity.value=C,i.material.uniforms.rayleigh.value=k,i.material.uniforms.mieCoefficient.value=L,s.toneMappingExposure=B)}if(m.originalHemisphereColors&&m.water){const C=new oe(4128),k=new oe(2245717);if(S){const L=d/w,B=L*L;m.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(m.originalHemisphereColors.deepColor,C,B),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(m.originalHemisphereColors.shallowColor,k,B)}else if(T){const L=(d-y)/2e3,B=1-Math.pow(1-L,2);m.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(C,m.originalHemisphereColors.deepColor,B),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(k,m.originalHemisphereColors.shallowColor,B)}else m.steadyStateReached||(m.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(C),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(k))}if(m.originalWaterValues&&m.water){const k=m.duration-y,L=11.125,B=.55,le=.96;if(S){const Y=Math.min(d/3e3,1),K=Y*Y,Fe=m.originalWaterValues.heightMultiplier+(L-m.originalWaterValues.heightMultiplier)*K,ae=m.originalWaterValues.amplitude+(B-m.originalWaterValues.amplitude)*K,ce=m.originalWaterValues.waterLevel-le*K;m.water.mesh.position.y=ce,m.water.setWaveChoppiness(Fe,ae)}else if(T){const Y=Math.min((d-y)/k,1),K=1-Math.pow(1-Y,2),Fe=L+(m.originalWaterValues.heightMultiplier-L)*K,ae=B+(m.originalWaterValues.amplitude-B)*K,ce=m.originalWaterValues.waterLevel-le+le*K;m.water.mesh.position.y=ce,m.water.setWaveChoppiness(Fe,ae)}else if(!m.steadyStateReached){const Y=m.originalWaterValues.waterLevel-le;m.water.mesh.position.y=Y,m.water.setWaveChoppiness(L,B)}}return r(h.group,a),u(h.group,I*.6),d>m.duration?(m.isActive=!1,h.group&&(h.group.userData.drizzleSound&&Xi(h.group.userData.drizzleSound),t.remove(h.group),h.group.traverse(C=>{C.geometry&&C.geometry.dispose(),C.material&&C.material.dispose()})),m.cloudData=null,m.originalSkyValues&&(i.material.uniforms.turbidity.value=m.originalSkyValues.turbidity,i.material.uniforms.rayleigh.value=m.originalSkyValues.rayleigh,i.material.uniforms.mieCoefficient.value=m.originalSkyValues.mieCoefficient,s.toneMappingExposure=m.originalSkyValues.exposure,m.originalSkyValues=null),m.originalWaterValues&&m.water&&(m.water.setWaveChoppiness(m.originalWaterValues.heightMultiplier,m.originalWaterValues.amplitude),m.water.mesh.position.y=m.originalWaterValues.waterLevel,m.originalWaterValues=null),m.originalHemisphereColors&&m.water&&(m.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(m.originalHemisphereColors.deepColor),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(m.originalHemisphereColors.shallowColor),m.originalHemisphereColors=null,m.water=null),Gi(),!1):!0}const ka=[{id:1,name:"Desert Isle Revival",description:"A gentle introduction to island restoration",story:"Nothing stirred but heat and the sea",terrainShape:{size:14,scaleX:1,scaleY:1,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:1,distortion:{frequency:0,amplitude:0,randomness:0}},waterLevel:-1.747,winPercentage:.32,spawn:{enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:16,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.45,fadeInDuration:2800,fadeOutDuration:2800},difficulty:1,rewards:{stars:3,points:1e3}},{id:2,name:"Sun-Scored Sands",description:"The water comes faster now",story:"The islands held their arid breath",terrainShape:{size:14.43,scaleX:1.24,scaleY:.82,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:.3,distortion:{frequency:.04,amplitude:.14,randomness:.032},turbulence:{strength:.465,scale:.1269,octaves:.98}},waterLevel:-2.07,winPercentage:.48,spawn:{enabled:!0,interval:6500,cloudDuration:5500,dropletsPerCloud:14,dropletInterval:380,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.8,fadeInDuration:2500,fadeOutDuration:2500},difficulty:2,rewards:{stars:3,points:1500}},{id:3,name:"Ancient Challenge",description:"Less water to work with",story:"Drops like fists bruised the dust",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:Math.PI/4,amount:1.4},bay:{angle:0,depth:0,width:0},irregularity:1.15},waterLevel:-2.385,winPercentage:.52,spawn:{enabled:!0,interval:6e3,cloudDuration:5e3,dropletsPerCloud:15,dropletInterval:350,minRadius:.1,maxRadius:.16,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:2300,fadeOutDuration:2300},difficulty:3,rewards:{stars:3,points:2e3}},{id:4,name:"Hollow Basin",description:"Every drop counts",story:"Stone refused to drink",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:0,amount:.103},bay:{angle:6,depth:2.2,width:Math.PI/2.5},irregularity:1.426,distortion:{frequency:.4444,amplitude:3.28,randomness:.218},turbulence:{strength:5.422,scale:.0032,octaves:.2642}},waterLevel:-2.02,winPercentage:.58,spawn:{enabled:!0,interval:5e3,cloudDuration:4500,dropletsPerCloud:16,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3.3,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:4,rewards:{stars:3,points:2500}},{id:5,name:"Drinking Stone",description:"The final test of water mastery",story:"Lips carved into land's edge",terrainShape:{size:15.62,scaleX:1.2,scaleY:.9,tilt:{angle:Math.PI/6,amount:.7},bay:{angle:Math.PI,depth:1.5,width:Math.PI/3},irregularity:2},waterLevel:-1.8,winPercentage:.42,spawn:{enabled:!0,interval:4500,cloudDuration:4e3,dropletsPerCloud:18,dropletInterval:300,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1800,fadeOutDuration:1800},difficulty:5,rewards:{stars:3,points:3e3}},{id:6,name:"Mirage Archipelago",description:"A fragmented paradise - precision is everything",story:"Storm turned to slow soaking swale",terrainShape:{size:14.83,scaleX:1.028,scaleY:.98,tilt:{angle:Math.PI/5.23,amount:.85*2.123},bay:{angle:Math.PI/2,depth:1.8,width:Math.PI/2.8},irregularity:2.27},waterLevel:-1.189,winPercentage:.58,spawn:{enabled:!0,interval:3800,cloudDuration:3500,dropletsPerCloud:22,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:6,rewards:{stars:3,points:4e3}},{id:7,name:"Vapor Crucible",description:"The sun steals water while you work",story:"The land tasted water and ground softened",terrainShape:{scaleX:1,scaleY:.96,tilt:{angle:Math.PI/4,amount:.29},bay:{angle:20,depth:-1,width:20},irregularity:2.8328,distortion:{frequency:.64,amplitude:.24,randomness:.2},turbulence:{strength:1.965,scale:.269,octaves:.98}},waterLevel:-3.66,winPercentage:.6,evaporationRate:.18,spawn:{enabled:!0,interval:7e3,cloudDuration:5e3,dropletsPerCloud:10,dropletInterval:500,minRadius:.11,maxRadius:.18,spawnHeight:10.2,cloudSpeed:2.2,fadeInDuration:3e3,fadeOutDuration:2e3},difficulty:7,rewards:{stars:3,points:4500}},{id:8,name:"Split-Decision Atoll",description:"Clouds divide the moment they reach the island",story:"Earth cupped the rain like a secret",terrainShape:{scaleX:1.3,scaleY:.89,tilt:{angle:0,amount:0},bay:{angle:Math.PI,depth:1.2,width:Math.PI/2},irregularity:2.63},waterLevel:.18,winPercentage:.53,spawn:{enabled:!0,interval:5500,cloudDuration:4e3,dropletsPerCloud:14,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:1800,fadeOutDuration:1800,splitClouds:!0,splitDelay:800},difficulty:8,rewards:{stars:3,points:5e3}},{id:9,name:"Glass Dunes",description:"Rolling hills of slippery crystal sand - drops race through valleys",story:"Droplets slipped beneath to find dark places, waiting",terrainShape:{size:14.63,islandRadius:6.42,scaleX:.91,scaleY:.91,tilt:{angle:Math.PI/6,amount:1.2},bay:{angle:Math.PI/3,depth:1.5,width:Math.PI/4},irregularity:.8,distortion:{frequency:1.3,amplitude:.6,randomness:.21}},waterLevel:-2.75,winPercentage:.7,terrainFriction:.12,spawn:{enabled:!0,interval:5e3,cloudDuration:4200,dropletsPerCloud:17,dropletInterval:280,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.4,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:9,rewards:{stars:3,points:5500}},{id:10,name:"Tide-Turned Throat",description:"A narrow channel that reverses flow every 20 s",story:"Roots respond to the aquifer's sigh",terrainShape:{scaleX:.62,scaleY:1.8,tilt:{angle:Math.PI/2,amount:.6},bay:{angle:Math.PI/2,depth:2.8,width:Math.PI/6},irregularity:1.2},waterLevel:-1.814,winPercentage:.56,tideCycle:2e4,tideForce:.4,spawn:{enabled:!0,interval:4800,cloudDuration:3800,dropletsPerCloud:19,dropletInterval:260,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.6,fadeInDuration:1700,fadeOutDuration:1700},difficulty:10,rewards:{stars:3,points:6e3}},{id:11,name:"Adrift",description:"lost at sea",story:"Emerald hues of past fortunes sprung",terrainShape:{scaleX:1.25,scaleY:.85,tilt:{angle:Math.PI/4,amount:1.1},bay:{angle:3*Math.PI/4,depth:1.4,width:Math.PI/3},irregularity:1.8,distortion:{frequency:22.2,amplitude:.31,randomness:.03}},waterLevel:-2.3,winPercentage:.66,spawn:{enabled:!0,interval:4300,cloudDuration:3600,dropletsPerCloud:20,dropletInterval:240,minRadius:.07,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.8,fadeInDuration:1600,fadeOutDuration:1600},difficulty:11,rewards:{stars:3,points:7e3}},{id:12,name:"Island Omega",description:"All previous twists combined—and the goal moves",story:"What you channel, you also become",terrainShape:{scaleX:1,scaleY:1,tilt:{angle:Math.PI/5,amount:.63},bay:{angle:Math.PI/3,depth:2,width:Math.PI/2.5*.23},irregularity:3.427,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:.22,scale:.32,octaves:.2642}},waterLevel:-2.1,winPercentage:.7,dynamicTarget:!0,targetCycle:15e3,evaporationRate:.12,splitClouds:!0,splitDelay:600,terrainFriction:.35,spawn:{enabled:!0,interval:3500,cloudDuration:3200,dropletsPerCloud:24,dropletInterval:200,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4.2,fadeInDuration:1400,fadeOutDuration:1400},difficulty:12,rewards:{stars:3,points:1e4}},{id:13,name:"Shattered Archipelago",description:"A scattered chain of islands—turbulence has broken the land",story:"The ocean returned what had been lost",terrainShape:{size:19.43,islandRadius:8.12,scaleX:1,scaleY:1,tilt:{angle:14,amount:.141},bay:{angle:0,depth:0,width:0},irregularity:1.82,distortion:{frequency:.048,amplitude:4.44,randomness:.15},turbulence:{strength:2.6965,scale:.369,octaves:1.98}},waterLevel:-2,winPercentage:.75,multipleTargets:2,spawn:{enabled:!0,interval:4200,cloudDuration:3800,dropletsPerCloud:18,dropletInterval:270,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1700,fadeOutDuration:1700},difficulty:13,rewards:{stars:3,points:12e3}},{id:14,name:"Jagged Atoll",description:"Craggy peaks rise from the depths—navigate the chaos",story:"Clouds pause, listening for song",terrainShape:{size:19.012,islandRadius:8.16,scaleX:1.12,scaleY:.965,tilt:{angle:52,amount:.68},bay:{angle:Math.PI/4,depth:1.2,width:Math.PI/3},irregularity:1.785,distortion:{frequency:.46,amplitude:.52,randomness:.22},turbulence:{strength:3.42,scale:.343,octaves:2.41}},waterLevel:-1.8,winPercentage:.74,multipleTargets:2,spawn:{enabled:!0,interval:3900,cloudDuration:3500,dropletsPerCloud:20,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.7,fadeInDuration:1600,fadeOutDuration:1600},difficulty:14,rewards:{stars:3,points:14e3}},{id:15,name:"Chaos Reef",description:"The ocean has shattered reality—only skill remains",story:"Rain resumes its ancient rhythm",terrainShape:{size:21.62,islandRadius:9.464,scaleX:.98,scaleY:1.02,tilt:{angle:68,amount:.242},bay:{angle:Math.PI/1.25,depth:2.11,width:Math.PI/12.2},irregularity:5.31,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:3.822,scale:.232,octaves:.642}},waterLevel:-1.5,winPercentage:.076,multipleTargets:3,spawn:{enabled:!0,interval:3600,cloudDuration:3200,dropletsPerCloud:22,dropletInterval:230,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:15,rewards:{stars:3,points:16e3}}];function ys(n){return ka.find(e=>e.id===n)||ka[0]}function bo(){return ka.length}const ws=Object.freeze(Object.defineProperty({__proto__:null,LEVELS:ka,getLevelById:ys,getTotalLevels:bo},Symbol.toStringTag,{value:"Module"})),ji={url:"https://bvbzhpcxrutiriqndcfy.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YnpocGN4cnV0aXJpcW5kY2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDM4MDIsImV4cCI6MjA3Nzc3OTgwMn0.vjforq20xOL5jTMbaAOgesSCl8UJj6fN03CevS5gc_A"};class $c{constructor(e,t){this.supabase=ll(e,t),this.STATS_CACHE_KEY="oasea_stats_cache"}async getAllScores(){try{const{data:e,error:t}=await this.supabase.from("scores").select("*").order("created_at",{ascending:!1});if(t)throw t;return e.map(o=>({id:o.id,levelId:o.level_id,playerName:o.player_name,basePoints:o.base_points,bonusPoints:o.bonus_points,timeBonus:o.time_bonus,totalScore:o.total_score,waterPercentage:parseFloat(o.water_percentage),completionTimeMs:o.completion_time_ms,timestamp:new Date(o.created_at).getTime(),date:o.date}))}catch(e){return console.error("Error fetching scores from Supabase:",e),[]}}async saveScore(e){try{const{error:t}=await this.supabase.from("scores").insert({player_name:e.playerName,level_id:e.levelId,base_points:e.basePoints,bonus_points:e.bonusPoints,time_bonus:e.timeBonus,total_score:e.totalScore,water_percentage:e.waterPercentage,completion_time_ms:e.completionTimeMs,date:e.date});if(t)throw t;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){throw console.error("Error saving score to Supabase:",t),t}}async getCachedStats(){const e=localStorage.getItem(this.STATS_CACHE_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_CACHE_KEY,JSON.stringify(e))}async clearScoresBefore(e){try{const t=new Date(e).toISOString().split("T")[0],{error:o}=await this.supabase.from("scores").delete().lt("date",t);if(o)throw o;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){console.error("Error clearing old scores:",t)}}async clearAllScores(){try{const{error:e}=await this.supabase.from("scores").delete().neq("id",0);if(e)throw e;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(e){console.error("Error clearing all scores:",e)}}}class Jc{constructor(){this.SCORES_KEY="oasea_scores",this.STATS_KEY="oasea_stats"}async getAllScores(){const e=localStorage.getItem(this.SCORES_KEY);return e?JSON.parse(e):[]}async saveScore(e){const t=await this.getAllScores();t.push(e),localStorage.setItem(this.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.STATS_KEY)}async getCachedStats(){const e=localStorage.getItem(this.STATS_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_KEY,JSON.stringify(e))}async clearScoresBefore(e){const o=(await this.getAllScores()).filter(a=>a.timestamp>=e);localStorage.setItem(this.SCORES_KEY,JSON.stringify(o)),localStorage.removeItem(this.STATS_KEY)}async clearAllScores(){localStorage.removeItem(this.SCORES_KEY),localStorage.removeItem(this.STATS_KEY)}}class Ss{constructor(e=null){this.storage=e||new Jc}calculateScore(e,t,o,a=""){const i=ys(e),s=i.rewards.points,l=this.calculateBonusPoints(i,t,s),r=this.calculateTimeBonus(i,o,s),u=s+l+r;return{levelId:e,playerName:a.trim(),basePoints:s,bonusPoints:l,timeBonus:r,totalScore:u,waterPercentage:t,completionTimeMs:o,timestamp:Date.now(),date:this.getTodayDateString()}}calculateBonusPoints(e,t,o){const a=t-e.winPercentage;if(a<=0)return 0;const s=Math.floor(a*o*1.5);return Math.max(0,s)}calculateTimeBonus(e,t,o){const i=e.difficulty*9e4-t;if(i<=0)return 0;const s=Math.max(1,Math.floor(o/1e3)),r=Math.floor(i/1e3)*s;return Math.max(0,r)}async saveScore(e){await this.storage.saveScore(e)}async getTopScoresToday(e=10){const t=await this.storage.getAllScores(),o=this.getTodayDateString();return t.filter(a=>a.date===o).filter(a=>this.isValidScore(a)).sort((a,i)=>this.compareScores(a,i)).slice(0,e)}async getTopScoresAllTime(e=10){return(await this.storage.getAllScores()).filter(o=>this.isValidScore(o)).sort((o,a)=>this.compareScores(o,a)).slice(0,e)}async getTopScoresForLevel(e,t=10){return(await this.storage.getAllScores()).filter(a=>a.levelId===e).filter(a=>this.isValidScore(a)).sort((a,i)=>this.compareScores(a,i)).slice(0,t)}isValidScore(e){return e.waterPercentage>.01&&e.completionTimeMs>0&&e.totalScore>0}compareScores(e,t){const o=this.isValidScore(e),a=this.isValidScore(t);return o&&!a?-1:!o&&a?1:!o&&!a?0:t.totalScore-e.totalScore}async getLevelStats(e){const o=(await this.storage.getAllScores()).filter(r=>r.levelId===e).filter(r=>this.isValidScore(r));if(o.length===0)return{timesCompleted:0,bestScore:0,bestTime:null,avgScore:0,avgTime:0};const a=Math.max(...o.map(r=>r.totalScore)),i=Math.min(...o.map(r=>r.completionTimeMs)),s=Math.floor(o.reduce((r,u)=>r+u.totalScore,0)/o.length),l=Math.floor(o.reduce((r,u)=>r+u.completionTimeMs,0)/o.length);return{timesCompleted:o.length,bestScore:a,bestTime:i,avgScore:s,avgTime:l}}async getTotalStats(){const e=await this.storage.getCachedStats();if(e&&Date.now()-e.timestamp<6e4)return e.stats;const o=(await this.storage.getAllScores()).filter(r=>this.isValidScore(r));let a=null;if(o.length>0){const r={};o.forEach(c=>{r[c.levelId]=(r[c.levelId]||0)+1});const u=Math.max(...Object.values(r));a=parseInt(Object.keys(r).find(c=>r[c]===u))}const i=o.length>0?o.reduce((r,u)=>r+u.waterPercentage,0)/o.length:0,s=o.length>0?Math.min(...o.map(r=>r.completionTimeMs)):0,l={totalScore:o.reduce((r,u)=>r+u.totalScore,0),levelsCompleted:new Set(o.map(r=>r.levelId)).size,totalPlayTime:o.reduce((r,u)=>r+u.completionTimeMs,0),avgScore:o.length>0?Math.floor(o.reduce((r,u)=>r+u.totalScore,0)/o.length):0,bestSingleScore:o.length>0?Math.max(...o.map(r=>r.totalScore)):0,fastestTime:s,avgWaterPercentage:i,favoriteIsland:a};return await this.storage.setCachedStats({stats:l,timestamp:Date.now()}),l}async getPersonalBest(e){const t=await this.getTopScoresForLevel(e,1);return t.length>0?t[0]:null}async isNewPersonalBest(e,t){const o=await this.getPersonalBest(e);return!o||t>o.totalScore}async cleanupOldScores(e=90){const t=Date.now()-e*24*60*60*1e3;await this.storage.clearScoresBefore(t)}async resetAllScores(){await this.storage.clearAllScores()}async cleanupInvalidScores(){const e=await this.storage.getAllScores(),t=e.filter(a=>this.isValidScore(a)),o=e.length-t.length;return o>0&&(localStorage.setItem(this.storage.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.storage.STATS_KEY),console.log(`Cleaned up ${o} invalid score(s)`)),o}getTodayDateString(){return new Date().toISOString().split("T")[0]}static formatTime(e){const t=Math.floor(e/1e3),o=Math.floor(t/60),a=t%60;return o>0?`${o}:${a.toString().padStart(2,"0")}`:`${t}s`}static formatScore(e){return e.toLocaleString()}}let Zi;const Qc=ji.url,eu=ji.anonKey;console.log("📊 Using Supabase for score storage (from config file)"),Zi=new $c(Qc,eu);const eo=new Ss(Zi);typeof window<"u"&&(window.cleanupInvalidScores=async()=>{const n=await eo.cleanupInvalidScores();return console.log(`✓ Cleaned up ${n} invalid score(s)`),n},window.viewAllScores=async()=>{const n=await eo.storage.getAllScores();return console.table(n.map(e=>({player:e.playerName||"Anonymous",level:e.levelId,score:e.totalScore,water:`${Math.round(e.waterPercentage*100)}%`,time:Ss.formatTime(e.completionTimeMs),date:e.date,valid:eo.isValidScore(e)?"✓":"✗"}))),n},console.log("📊 Score system loaded! Try these commands:"),console.log("  cleanupInvalidScores() - Remove test data"),console.log("  viewAllScores() - View all scores in a table"));const en=Object.freeze(Object.defineProperty({__proto__:null,ScoreSystem:Ss,scoreSystem:eo},Symbol.toStringTag,{value:"Module"}));class tu{constructor(){this.currentLevelId=parseInt(localStorage.getItem("currentLevelId"))||1,this.completedLevels=JSON.parse(localStorage.getItem("completedLevels")||"[]"),this.currentLevelId>bo()&&(this.currentLevelId=bo()),this.levelStartTime=null,this.levelElapsedTime=0}getCurrentLevel(){return ys(this.currentLevelId)}getCurrentLevelId(){return this.currentLevelId}nextLevel(){return this.currentLevelId>=bo()?null:(this.currentLevelId++,this.saveCurrentLevel(),this.getCurrentLevel())}startLevelTimer(){this.levelStartTime=Date.now(),this.levelElapsedTime=0}stopLevelTimer(){return this.levelStartTime?(this.levelElapsedTime=Date.now()-this.levelStartTime,this.levelElapsedTime):0}getCurrentElapsedTime(){return this.levelStartTime?Date.now()-this.levelStartTime:0}resetLevelTimer(){this.levelStartTime=null,this.levelElapsedTime=0}async completeLevel(e=3,t=0){const o=this.stopLevelTimer();if(t<=.01||o<=0)return console.warn("Invalid game completion - not saving score"),{basePoints:0,bonusPoints:0,timeBonus:0,totalScore:0,waterPercentage:0,completionTimeMs:0,isPersonalBest:!1,valid:!1};const a=this.completedLevels.findIndex(u=>u.levelId===this.currentLevelId),i={levelId:this.currentLevelId,timestamp:Date.now(),stars:e,completed:!0};a>=0?e>this.completedLevels[a].stars&&(this.completedLevels[a]=i):this.completedLevels.push(i),this.saveCompletedLevels();const s=localStorage.getItem("oasea_player_name")||"",l=eo.calculateScore(this.currentLevelId,t,o,s);await eo.saveScore(l);const r=await eo.isNewPersonalBest(this.currentLevelId,l.totalScore);return{...l,isPersonalBest:r,valid:!0}}isLevelCompleted(e){return this.completedLevels.some(t=>t.levelId===e)}isLastLevel(){return this.currentLevelId>=bo()}resetProgress(){this.currentLevelId=1,this.completedLevels=[],this.saveCurrentLevel(),this.saveCompletedLevels()}saveCurrentLevel(){localStorage.setItem("currentLevelId",this.currentLevelId.toString())}saveCompletedLevels(){localStorage.setItem("completedLevels",JSON.stringify(this.completedLevels))}getTotalStars(){return this.completedLevels.reduce((e,t)=>e+t.stars,0)}getMaxStars(){return bo()*3}}const At=new tu;function ou(n){return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}let Ce,Bn,Wn,ze,Te,Vn,Un,ct,Pt,Xn,xe,$o,Go,na,jo,Io,Gn,sa,jn,Zn,Lo,Wt,ba,xt,ut,tn,on,Ha;function au(n){ut=n.levelManager,tn=n.animateCameraToGameplay,on=n.startGame,Ha=n.transitionToNextLevel,Ce=document.getElementById("title-splash"),Bn=document.getElementById("title-play-button"),Wn=document.getElementById("instructions-button"),ze=document.getElementById("welcome-modal"),Te=document.getElementById("simple-play-overlay"),Vn=document.getElementById("simple-play-button"),Un=document.getElementById("play-button"),ct=document.getElementById("next-level-btn"),Pt=document.getElementById("sound"),Xn=document.getElementById("close-credits"),xe=document.getElementById("level-select-modal"),$o=document.getElementById("level-grid"),Go=document.getElementById("close-level-select"),na=document.getElementById("level-name"),jo=document.querySelector(".gameplay-gif"),Io=document.getElementById("score-modal"),Gn=document.getElementById("close-score"),sa=document.getElementById("leaderboard-modal"),jn=document.getElementById("leaderboard-btn"),Zn=document.getElementById("close-leaderboard"),Lo=document.getElementById("name-prompt-modal"),Wt=document.getElementById("player-name-input"),ba=document.getElementById("save-name-btn"),xt=document.getElementById("score-player-name"),du(),mu(),pu(),gu(),vu(),yu(),wu(),Su(),xu(),_u(),Ru(),Pu()}function qi(n,e=!1){n.id===1?(Ce&&(Ce.style.display="flex"),ze&&(ze.style.display="none"),Te&&(Te.style.display="none")):(e?(Ce&&(Ce.style.display="none"),Te&&(Te.style.display="none",Te.style.pointerEvents="auto",Te.style.animation="")):(Ce&&(Ce.style.display="flex"),Te&&(Te.style.display="none")),ze&&(ze.style.display="none"))}function Yi(n){na&&(na.textContent=`Island ${n.id}: ${n.name}`)}function Ki(n){const e=document.getElementById("goal-marker");if(e){const t=n*100;e.style.bottom=`${t}%`}}function nu(){ct&&(ut.isLastLevel()?ct.innerHTML='<span class="material-icons">eco</span>Credits':ct.innerHTML='<span class="material-icons">arrow_forward</span>Next Island',ct.style.display="flex")}function $i(){ct&&(ct.style.display="none")}function su(){Te&&(Te.style.display="flex")}function iu(){Te&&(Te.style.display="none")}function ru(){ze&&(ze.style.display="none")}function lu(n){const e=document.getElementById("progress-fill"),t=document.getElementById("progress-text");e&&(e.style.height=n+"%"),t&&(t.textContent=Math.floor(n)+"%")}function cu(){const n=document.getElementById("progress-fill");n&&n.classList.add("complete")}function Ji(){const n=document.getElementById("progress-fill"),e=document.getElementById("progress-text"),t=document.getElementById("progress-container");n&&(n.style.height="0%",n.classList.remove("complete")),e&&(e.textContent="0%"),t&&(t.style.background="linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",t.classList.remove("pulse"))}function uu(){const n=document.getElementById("progress-container"),e=document.getElementById("progress-fill");n&&e&&(n.classList.remove("pulse"),e.classList.remove("pulse"),n.offsetWidth,e.offsetWidth,n.classList.add("pulse"),e.classList.add("pulse"),setTimeout(()=>{n.classList.remove("pulse"),e.classList.remove("pulse")},600))}function Qi(){const n=document.getElementById("win-modal");n&&(n.style.display="none")}function du(){Pt&&Pt.addEventListener("click",()=>{const n=Ao();Bi()?(Vs(!1),n.play().then(()=>{Fa(!0),Pt.querySelector(".material-icons").textContent=""}).catch(t=>console.log("Failed to play audio:",t))):(Vs(!0),n.pause(),vs(),Fa(!1),Pt.querySelector(".material-icons").textContent="")})}function hu(){Ce&&(Ce.style.animation="fadeOut 0.5s ease",setTimeout(()=>{Ce.style.display="none"},500)),tn(),on(),gs()||Ao().play().then(()=>{Fa(!0),Pt&&(Pt.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function fu(){ze&&(ze.style.animation="fadeOut 0.5s ease",setTimeout(()=>{ze.style.display="none",ze.classList.add("hidden")},500)),tn(),on(),gs()||Ao().play().then(()=>{Fa(!0),Pt&&(Pt.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function mu(){Bn&&Bn.addEventListener("click",()=>{hu()})}function pu(){Wn&&Wn.addEventListener("click",()=>{Ce&&(Ce.style.display="none"),ze&&(ze.style.animation="fadeIn 0.5s ease",ze.style.display="flex")})}function gu(){Un&&Un.addEventListener("click",()=>{fu()})}function vu(){Vn&&Vn.addEventListener("click",()=>{Te&&(Te.style.pointerEvents="none",Te.style.animation="fadeOut 0.5s ease",setTimeout(()=>{Te.style.display="none"},500)),tn(),on()})}function yu(){ct&&ct.addEventListener("click",()=>{if(ct.style.display="none",tr(),ut.completeLevel(3),!ut.nextLevel()){const e=document.getElementById("credits-modal");e.style.animation="fadeIn 0.5s ease",e.style.display="flex";return}Ha()})}function wu(){Xn&&Xn.addEventListener("click",()=>{const n=document.getElementById("credits-modal");n&&(n.style.animation="fadeOut 0.5s ease",setTimeout(()=>{n.style.display="none"},500))})}function Su(){na&&na.parentElement.addEventListener("click",()=>{bu()}),Go&&Go.addEventListener("click",()=>{xe&&(xe.style.animation="fadeOut 0.5s ease",setTimeout(()=>{xe.classList.add("hidden"),xe.style.display="none",xe.style.animation=""},500))}),xe&&xe.addEventListener("click",n=>{n.target===xe&&Go&&Go.click()})}function bu(){!xe||!$o||(Mu(),xe.classList.remove("hidden"),xe.style.display="flex")}function Mu(){$o&&Ut(async()=>{const{LEVELS:n}=await Promise.resolve().then(()=>ws);return{LEVELS:n}},void 0).then(({LEVELS:n})=>{$o.innerHTML="";const e=ut.getCurrentLevel();n.forEach(t=>{const o=ut.isLevelCompleted(t.id),a=t.id===e.id,i=t.id>1&&!ut.isLevelCompleted(t.id-1),s=document.createElement("div");s.className="level-card",i&&s.classList.add("locked"),a&&s.classList.add("current");const l=ut.completedLevels.find(u=>u.levelId===t.id),r=l?l.stars:0;s.innerHTML=`
        ${i?'<span class="material-icons lock-icon">lock</span>':""}
        <div class="level-number">${t.id}</div>
        <div class="level-title">${t.name}</div>
        <div class="level-stars">
          ${o?"★".repeat(r)+"☆".repeat(3-r):"☆☆☆"}
        </div>
      `,i||s.addEventListener("click",()=>{Tu(t.id)}),$o.appendChild(s)})})}function Tu(n){ut.currentLevelId=n,ut.saveCurrentLevel(),Ce&&Ce.style.display!=="none"&&(Ce.style.animation="fadeOut 0.3s ease",setTimeout(()=>{Ce.style.display="none"},300)),xe?(xe.style.animation="fadeOut 0.3s ease",setTimeout(()=>{xe.classList.add("hidden"),xe.style.display="none",xe.style.animation="",Ha()},300)):Ha()}function xu(){jo&&(jo.addEventListener("load",()=>{jo.classList.add("loaded");const n=document.querySelector(".gif-placeholder");n&&(n.style.display="none")}),jo.addEventListener("error",()=>{console.log("Gameplay GIF not found - placeholder will be shown")}))}function er(){return localStorage.getItem("oasea_player_name")||""}function Du(n){return n.replace(/<[^>]*>/g,"").trim().slice(0,20)}function qn(n){const e=Du(n);localStorage.setItem("oasea_player_name",e)}function Xs(){return!localStorage.getItem("oasea_player_name_set")}function Eu(){localStorage.setItem("oasea_player_name_set","true")}function Pu(){ba&&Wt&&(ba.addEventListener("click",()=>{const n=Wt.value.trim();n&&(qn(n),Eu(),Au())}),Wt.addEventListener("keypress",n=>{n.key==="Enter"&&ba.click()}))}function _u(){Gn&&Gn.addEventListener("click",tr),xt&&(xt.addEventListener("change",()=>{const n=xt.value.trim();n&&qn(n)}),xt.addEventListener("keypress",n=>{if(n.key==="Enter"){const e=xt.value.trim();e&&(qn(e),xt.blur())}}))}function Cu(){Lo&&(Wt&&(Wt.value=er(),setTimeout(()=>{Wt.focus(),Wt.select()},100)),Lo.style.display="flex")}function Au(){Lo&&(Lo.style.display="none")}async function Iu(n){if(Io){if(Xs()){Cu();const e=setInterval(()=>{(!Xs()||Lo.style.display==="none")&&(clearInterval(e),Gs(n))},100);return}Gs(n)}}async function Gs(n){if(!Io)return;const{ScoreSystem:e,scoreSystem:t}=await Ut(async()=>{const{ScoreSystem:s,scoreSystem:l}=await Promise.resolve().then(()=>en);return{ScoreSystem:s,scoreSystem:l}},void 0);xt&&(xt.value=er()),document.getElementById("score-base").textContent=e.formatScore(n.basePoints),document.getElementById("score-bonus").textContent=e.formatScore(n.bonusPoints),document.getElementById("score-time").textContent=e.formatScore(n.timeBonus),document.getElementById("score-total").textContent=e.formatScore(n.totalScore);const o=await t.getTotalStats();document.getElementById("career-total").textContent=e.formatScore(o.totalScore);const a=Math.round(n.waterPercentage*100);document.getElementById("water-collected").textContent=`${a}%`,document.getElementById("completion-time").textContent=e.formatTime(n.completionTimeMs);const i=document.getElementById("personal-best-badge");i&&(i.style.display=n.isPersonalBest?"flex":"none"),Io.style.display="flex",Lu(n,o.totalScore)}function tr(){Io&&(Io.style.display="none")}function Lu(n,e){const o=Date.now();function a(){const i=Date.now()-o,s=Math.min(i/1e3,1),l=1-Math.pow(1-s,3),r=Math.floor(n.basePoints*l),u=Math.floor(n.bonusPoints*l),c=Math.floor(n.timeBonus*l),d=Math.floor(n.totalScore*l),h=Math.floor(e*l);document.getElementById("score-base").textContent=r.toLocaleString(),document.getElementById("score-bonus").textContent=u.toLocaleString(),document.getElementById("score-time").textContent=c.toLocaleString(),document.getElementById("score-total").textContent=d.toLocaleString(),document.getElementById("career-total").textContent=h.toLocaleString(),s<1&&requestAnimationFrame(a)}a()}function Ru(){jn&&jn.addEventListener("click",Ou),Zn&&Zn.addEventListener("click",Fu);const n=document.querySelectorAll(".tab-btn");n.forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;ku(t),n.forEach(o=>o.classList.remove("active")),e.classList.add("active")})})}async function Ou(){if(!sa)return;sa.style.display="flex";const n=document.querySelector(".tab-btn.active"),e=n?n.dataset.tab:"today";await or(e)}function Fu(){sa&&(sa.style.display="none")}async function ku(n){document.querySelectorAll(".leaderboard-tab-content").forEach(t=>{t.style.display="none"});const e=document.getElementById(`leaderboard-${n}`);if(e&&(e.style.display="block"),n==="today"){const t=document.getElementById("today-loading"),o=document.getElementById("today-scores");t&&(t.style.display="flex"),o&&(o.style.display="none")}else if(n==="alltime"){const t=document.getElementById("alltime-loading"),o=document.getElementById("alltime-scores");t&&(t.style.display="flex"),o&&(o.style.display="none")}else if(n==="stats"){const t=document.getElementById("stats-loading"),o=document.getElementById("stats-content");t&&(t.style.display="flex"),o&&(o.style.display="none")}await or(n)}async function or(n){const{scoreSystem:e,ScoreSystem:t}=await Ut(async()=>{const{scoreSystem:o,ScoreSystem:a}=await Promise.resolve().then(()=>en);return{scoreSystem:o,ScoreSystem:a}},void 0);if(n==="today"){const o=await e.getTopScoresToday(10);js("today-scores",o)}else if(n==="alltime"){const o=await e.getTopScoresAllTime(10);js("alltime-scores",o)}else if(n==="stats"){const o=await e.getTotalStats();Hu(o)}}function js(n,e){const t=document.getElementById(n);t&&Ut(async()=>{const{ScoreSystem:o}=await Promise.resolve().then(()=>en);return{ScoreSystem:o}},void 0).then(({ScoreSystem:o})=>{Ut(async()=>{const{getLevelById:a}=await Promise.resolve().then(()=>ws);return{getLevelById:a}},void 0).then(({getLevelById:a})=>{if(e.length===0?t.innerHTML='<p class="no-scores">No scores yet. Complete a level to see your scores here!</p>':t.innerHTML=e.map((i,s)=>{const l=a(i.levelId),r=ou(i.playerName||"Anonymous");return`
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
          `}).join(""),n==="today-scores"){const i=document.getElementById("today-loading");i&&(i.style.display="none"),t.style.display="block"}else if(n==="alltime-scores"){const i=document.getElementById("alltime-loading");i&&(i.style.display="none"),t.style.display="block"}})})}function Hu(n){Ut(async()=>{const{ScoreSystem:e}=await Promise.resolve().then(()=>en);return{ScoreSystem:e}},void 0).then(({ScoreSystem:e})=>{Ut(async()=>{const{getLevelById:t}=await Promise.resolve().then(()=>ws);return{getLevelById:t}},void 0).then(({getLevelById:t})=>{document.getElementById("total-score-stat").textContent=e.formatScore(n.totalScore),document.getElementById("best-single-stat").textContent=e.formatScore(n.bestSingleScore),document.getElementById("levels-completed-stat").textContent=n.levelsCompleted;const o=document.getElementById("favorite-island-stat");if(n.favoriteIsland){const s=t(n.favoriteIsland);o.textContent=`${n.favoriteIsland}: ${s.name}`}else o.textContent="—";document.getElementById("total-time-stat").textContent=e.formatTime(n.totalPlayTime),document.getElementById("fastest-time-stat").textContent=n.fastestTime>0?e.formatTime(n.fastestTime):"—",document.getElementById("avg-score-stat").textContent=e.formatScore(n.avgScore),document.getElementById("avg-water-stat").textContent=n.avgWaterPercentage>0?`${Math.round(n.avgWaterPercentage*100)}%`:"0%";const a=document.getElementById("stats-loading"),i=document.getElementById("stats-content");a&&(a.style.display="none"),i&&(i.style.display="grid")})})}const ia=8,zu=4.3,Yn=80,Kn=90,$n=500;let so=[],io=[],_t=[],Xt=[],ua=[],to=[],Ze=[],it=0,re=null,za=null,ie=null,Po=null,He=[];function Nu(){const n=new Zr(.2,16),e=new et({transparent:!0,depthWrite:!1,blending:si,uniforms:{color:{value:new oe(8545340)}},vertexShader:`
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
    `});re=new xn(n,e,Yn),re.renderOrder=1,za=new Float32Array(Yn),re.geometry.setAttribute("instanceOpacity",new Dn(za,1)),re.count=0;const t=new ss(.05,8,8),o=new et({transparent:!0,depthWrite:!1,uniforms:{color:{value:new oe(8965375)}},vertexShader:`
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
    `});ie=new xn(t,o,$n),ie.renderOrder=2,Po=new Float32Array($n),ie.geometry.setAttribute("instanceOpacity",new Dn(Po,1)),ie.count=0,so=[],io=[],_t=[],Xt=[],ua=[],to=[],Ze=[],He=[],it=0}function ar(n,e,t){const o=e.length;for(let a=0;a<o;a++){const i=e[a],{beamMesh:s,beamMaterial:l}=Bu(i);n.add(s),so.push(s),io.push(l);const r=Wu(i,t);n.add(r),_t.push(r);const{particles:u,particleVelocities:c}=Vu(i);n.add(u),Xt.push(u),ua.push(c)}re&&!re.parent&&n.add(re),ie&&!ie.parent&&n.add(ie)}function Bu(n){const e=new us(1.5,1.5,ia,32,1,!0),t=new et({transparent:!0,side:ot,depthWrite:!1,depthTest:!0,vertexShader:`
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
    `,uniforms:{uTime:{value:0},uColor:{value:new b(1,1,0)},uPulseIntensity:{value:0}}}),o=new ve(e,t);return o.position.set(n.x,ia/2,n.z),o.renderOrder=5,{beamMesh:o,beamMaterial:t}}function Wu(n,e){const o=Yo({startX:n.x,startZ:n.z,endX:n.x,endZ:n.z,cloudTexture:e,rainCount:200,cloudHeight:14}),a=o.userData.cloud,i=o.userData.cloudMaterial;return a.scale.set(1.26,.42,1.6),i.uniforms.base.value.setRGB(.8,.9,1),i.uniforms.threshold.value=.25,i.uniforms.opacity.value=0,a.visible=!0,a.renderOrder=10,i.depthTest=!1,o}function Vu(n){const e=new qa,t=new Float32Array(Kn*3),o=[];for(let s=0;s<Kn;s++){const l=Math.random()*Math.PI*2,r=Math.random()*1.3;t[s*3]=Math.cos(l)*r,t[s*3+1]=Math.random()*ia,t[s*3+2]=Math.sin(l)*r,o.push({y:.5+Math.random()*1,angle:l,radius:r,angleSpeed:(Math.random()-.5)*.5})}e.setAttribute("position",new Qt(t,3));const a=new is({color:16776960,size:.1,transparent:!0,opacity:.6,blending:qr,depthWrite:!1}),i=new rs(e,a);return i.position.set(n.x,0,n.z),{particles:i,particleVelocities:o}}function Uu(n,e){const t=Math.sin(Date.now()*.003)*.1+.9,o=so.length;for(let a=0;a<o;a++){e&&e[a]&&(e[a].emissiveIntensity=t*.5),io[a].uniforms.uTime.value+=n,it>0&&(it-=n*zu,it=Math.max(0,it)),io[a].uniforms.uPulseIntensity.value=it;const i=1+it*.04;so[a].scale.set(i,1,i)}}function Xu(n){const e=Xt.length;for(let t=0;t<e;t++){const o=Xt[t].geometry,a=ua[t],i=o.attributes.position.array;for(let s=0;s<Kn;s++){const l=a[s];i[s*3+1]+=l.y*n,l.angle+=l.angleSpeed*n,i[s*3]=Math.cos(l.angle)*l.radius,i[s*3+2]=Math.sin(l.angle)*l.radius,i[s*3+1]>ia&&(i[s*3+1]=0)}o.attributes.position.needsUpdate=!0}}function Gu(n,e,t,o,a,i){const s=e.length;n.forEach(l=>{let r=1/0,u=-1;for(let c=0;c<s;c++){const d=Math.sqrt(Math.pow(l.body.position.x-e[c].x,2)+Math.pow(l.body.position.z-e[c].z,2));d<r&&(r=d,u=c)}r<1.5&&!o.has(l)&&(o.add(l),a(),it=1,i(),t.removeBody(l.body),to.push({ball:l,targetIndex:u,startY:l.body.position.y,targetY:ia,progress:0,originalScale:1,particleEmitter:{particles:[],lastEmitTime:0}}))})}function ju(n,e,t){for(let o=to.length-1;o>=0;o--){const a=to[o],i=a.ball,s=t[a.targetIndex];a.progress+=e*.3;const l=Math.min(a.progress,1),r=l*l*(3-2*l);i.body.position.y=a.startY+(a.targetY-a.startY)*r,i.body.position.x+=(s.x-i.body.position.x)*e*2,i.body.position.z+=(s.z-i.body.position.z)*e*2,i.mesh.position.copy(i.body.position);const u=.6;if(l>u){const h=1-(l-u)/(1-u);i.mesh.scale.set(h,h,h)}const c=Date.now();if(c-a.particleEmitter.lastEmitTime>30&&ie&&He.length<$n){const d=Math.random()*Math.PI*2,h=Math.random()*i.radius*.8,p=new b(i.body.position.x+Math.cos(d)*h,i.body.position.y+(Math.random()-.5)*i.radius,i.body.position.z+Math.sin(d)*h),f=He.length,g={instanceIndex:f,position:p,velocity:{x:(Math.random()-.5)*.5,y:1+Math.random()*.5,z:(Math.random()-.5)*.5},life:0,maxLife:.8,initialScale:1};He.push(g),a.particleEmitter.particles.push(g);const v=new Rt;v.compose(p,new It,new b(1,1,1)),ie.setMatrixAt(f,v),Po[f]=.6,ie.count=He.length,ie.instanceMatrix.needsUpdate=!0,ie.geometry.attributes.instanceOpacity.needsUpdate=!0,a.particleEmitter.lastEmitTime=c}l>=1&&(n.remove(i.mesh),i.active=!1,a.particleEmitter.particles=[],to.splice(o,1))}Zu(e)}function Zu(n){if(!ie||He.length===0)return;let e=!1,t=!1;for(let o=He.length-1;o>=0;o--){const a=He[o];a.life+=n,a.position.x+=a.velocity.x*n,a.position.y+=a.velocity.y*n,a.position.z+=a.velocity.z*n;const i=a.life/a.maxLife,s=.6*(1-i),l=a.initialScale*(1-i*.5),r=new Rt;if(r.compose(a.position,new It,new b(l,l,l)),ie.setMatrixAt(a.instanceIndex,r),e=!0,Po[a.instanceIndex]=s,t=!0,a.life>=a.maxLife){He.splice(o,1);for(let u=o;u<He.length;u++){He[u].instanceIndex=u;const c=new Rt;ie.getMatrixAt(u+1,c),ie.setMatrixAt(u,c),Po[u]=Po[u+1]}ie.count=He.length}}e&&(ie.instanceMatrix.needsUpdate=!0),t&&(ie.geometry.attributes.instanceOpacity.needsUpdate=!0)}function qu(n,e,t,o,a){const i=_t.length;for(let r=0;r<i;r++){const u=_t[r],c=u.userData.cloud;u.userData.cloudMaterial,En(u,n,e),c.rotation.y+=e*.1}const s=1600,l=t?Date.now()-o:0;if(t&&l>=s)for(let d=0;d<i;d++){const h=_t[d],p=h.userData.cloud,f=h.userData.cloudMaterial,g=p.scale.x,v=g+(8-g)*e*1.5;p.scale.set(v,v*.6,v);const w=f.uniforms.opacity.value,M=isNaN(w)?.3:w+(.3-w)*e*1.5;f.uniforms.opacity.value=M,Pn(h,e),Ta(h,.6)}else for(let r=0;r<i;r++){const u=_t[r],c=u.userData.cloudMaterial;c.uniforms.opacity.value=0,Ta(u,0)}if(t&&a)for(let r=0;r<i;r++)io[r].uniforms.uColor.value.set(0,1,.3),Xt[r].material.color.setHex(65416)}function Yu(n,e,t){if(!re){console.error("Trail system not initialized");return}if(e.lastTrailTime&&Date.now()-e.lastTrailTime<50)return;let o;Ze.length>=Yn?o=Ze.shift().instanceIndex:o=Ze.length;const a=new Rt,i=e.radius*2.5,s=new b(e.body.position.x,t+.02,e.body.position.z),l=new It().setFromEuler(new Yr(-Math.PI/2,0,0)),r=new b(i,i,1);a.compose(s,l,r),re.setMatrixAt(o,a),re.instanceMatrix.needsUpdate=!0,za[o]=.008,re.geometry.attributes.instanceOpacity.needsUpdate=!0,re.count=Math.max(re.count,Ze.length+1),Ze.push({instanceIndex:o,opacity:.003,age:0,maxAge:3+Math.random()*2,scale:i}),e.lastTrailTime=Date.now()}function Ku(n){if(!re)return;let e=!1,t=!1;for(let o=Ze.length-1;o>=0;o--){const a=Ze[o];a.age+=n;const i=a.age/a.maxAge;a.opacity=(.5-i)*.235,za[a.instanceIndex]=a.opacity,t=!0;const s=1-i*.43,l=a.scale*s,r=new Rt;re.getMatrixAt(a.instanceIndex,r);const u=new b,c=new It,d=new b;r.decompose(u,c,d),d.x=l,d.y=l,r.compose(u,c,d),re.setMatrixAt(a.instanceIndex,r),e=!0,a.age>=a.maxAge&&(Ze.splice(o,1),re.count=Ze.length)}e&&(re.instanceMatrix.needsUpdate=!0),t&&(re.geometry.attributes.instanceOpacity.needsUpdate=!0)}function $u(n){[...so].forEach(e=>{n.remove(e),e.geometry.dispose(),e.material.dispose()}),so.length=0,io.length=0,[..._t].forEach(e=>{n.remove(e),e.userData.cloud&&(e.userData.cloud.geometry.dispose(),e.userData.cloud.material.dispose())}),_t.length=0,[...Xt].forEach(e=>{n.remove(e),e.geometry.dispose(),e.material.dispose()}),Xt.length=0,ua.length=0,Ze.length=0,re&&(re.count=0),He.length=0,ie&&(ie.count=0),to.length=0,it=0}function Ju(){so=[],io=[],_t=[],Xt=[],ua=[],to=[],Ze=[],He=[],re&&(re.count=0),ie&&(ie.count=0),it=0}const dt=new uo,Be=new pe;let gt=!1,bs=!1,Ms=!1,Ro=0,Zo=0,Ee=null,E=null,ra=.88,Oo={x:0,y:0},an=0,Ma=0;const nr=10,Qu=300;let mt=null,Fo=null,zo=null,tt=null,ro=null,ko=null,Ho=null;function Ve(){return bs||Ms||Ro>=2}function sr(n){if(!n)return!1;let e=n;for(;e&&e!==document.body;){const t=e.tagName?.toLowerCase();if(t==="button"||t==="input"||t==="select"||t==="textarea"||t==="a"||e.onclick||e.getAttribute("role")==="button"||e.classList?.contains("ui-element")||e.classList?.contains("modal"))return!0;const o=e.id;if(o&&(o.includes("btn")||o.includes("button")||o.includes("modal")||o.includes("overlay")||o.includes("menu")||o.includes("ui")))return!0;e=e.parentElement}return!1}function ed(n){if(sr(n.target))return;n.button===2&&(Ms=!0),Oo={x:n.clientX,y:n.clientY},an=Date.now(),Be.x=n.clientX/window.innerWidth*2-1,Be.y=-(n.clientY/window.innerHeight)*2+1,dt.setFromCamera(Be,Fo);const e=dt.intersectObject(tt);if(e.length>0){const t=e[0].point;if(t.y<ro-ra)return;const o=t.clone(),a=o.clone();if(tt.worldToLocal(a),Ee={world:o,local:a},gt=!0,zo.enabled=!1,document.body.style.cursor=Ve()?"s-resize":"n-resize",!E){const s=new ca(1.1,2.2,46),l=new Et({color:Ve()?16729156:4474111,transparent:!0,opacity:.4,side:ot,depthWrite:!1});E=new ve(s,l),E.rotation.x=-Math.PI/2,E.renderOrder=3,mt.add(E)}E.material.color.setHex(Ve()?16729156:4474111),E.visible=!0,E.position.copy(o),E.position.y+=.05,Vi()}}function td(n){n.button===2&&(Ms=!1);const e={x:n.clientX,y:n.clientY},t=Math.sqrt(Math.pow(e.x-Oo.x,2)+Math.pow(e.y-Oo.y,2)),o=Date.now()-an;if(t<nr&&o<500&&Ee){const a=Ve()?-.8:.8;ko(Ee.local,a),Ho()}gt=!1,Ee=null,document.body.style.cursor="default",zo.enabled=!0,Qa(),E&&(mt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null)}function od(n){Be.x=n.clientX/window.innerWidth*2-1,Be.y=-(n.clientY/window.innerHeight)*2+1,dt.setFromCamera(Be,Fo);const e=dt.intersectObject(tt);if(e.length>0&&e[0].point.y>=ro-ra?document.body.style.cursor=Ve()?"s-resize":"n-resize":document.body.style.cursor="default",gt){dt.setFromCamera(Be,Fo);const t=dt.intersectObject(tt);if(t.length>0){const o=t[0].point.clone();if(o.y<ro-ra){Ee=null,E&&(E.visible=!1);return}const a=o.clone();if(tt.worldToLocal(a),Ee={world:o,local:a},!E){const s=new ca(1.1,2.2,46),l=new Et({color:Ve()?16729156:4474111,transparent:!0,opacity:.4,side:ot,depthWrite:!1});E=new ve(s,l),E.rotation.x=-Math.PI/2,E.renderOrder=3,mt.add(E)}E.material.color.setHex(Ve()?16729156:4474111),E.visible=!0,E.position.copy(o),E.position.y+=.05}}}function ad(n){n.key==="Shift"&&(bs=!0,document.body.style.cursor="s-resize",E&&E.material.color.setHex(16729156))}function nd(n){n.key==="Shift"&&(bs=!1,document.body.style.cursor=gt?"n-resize":"default",E&&E.material.color.setHex(4474111))}function sd(n){if(sr(n.target))return;Ro=n.touches.length;const e=n.touches[0];Oo={x:e.clientX,y:e.clientY},an=Date.now(),Be.x=e.clientX/window.innerWidth*2-1,Be.y=-(e.clientY/window.innerHeight)*2+1,dt.setFromCamera(Be,Fo);const t=dt.intersectObject(tt);if(t.length>0){const o=t[0].point;if(o.y<ro-ra)return;const a=o.clone(),i=a.clone();if(tt.worldToLocal(i),Ee={world:a,local:i},gt=!0,zo.enabled=!1,document.body.style.cursor=Ve()?"s-resize":"n-resize",!E){const l=new ca(1.1,2.2,46),r=new Et({color:Ve()?16729156:4474111,transparent:!0,opacity:.4,side:ot,depthWrite:!1});E=new ve(l,r),E.rotation.x=-Math.PI/2,E.renderOrder=3,mt.add(E)}E.material.color.setHex(Ve()?16729156:4474111),E.visible=!0,E.position.copy(a),E.position.y+=.05,Vi(),n.preventDefault()}}function id(n){Ro=n.touches.length;const e=n.touches[0];if(Be.x=e.clientX/window.innerWidth*2-1,Be.y=-(e.clientY/window.innerHeight)*2+1,gt){dt.setFromCamera(Be,Fo);const t=dt.intersectObject(tt);if(t.length>0){const o=t[0].point.clone();if(o.y<ro-ra){Ee=null,E&&(E.visible=!1);return}const a=o.clone();if(tt.worldToLocal(a),Ee={world:o,local:a},!E){const s=new ca(1.1,2.2,46),l=new Et({color:Ve()?16729156:4474111,transparent:!0,opacity:.4,side:ot,depthWrite:!1});E=new ve(s,l),E.rotation.x=-Math.PI/2,E.renderOrder=3,mt.add(E)}E.material.color.setHex(Ve()?16729156:4474111),E.visible=!0,E.position.copy(o),E.position.y+=.05}n.preventDefault()}}function rd(n){const e=n.changedTouches[0],t={x:e.clientX,y:e.clientY},o=Math.sqrt(Math.pow(t.x-Oo.x,2)+Math.pow(t.y-Oo.y,2)),a=Date.now()-an;o<nr&&a<500&&Ee&&(Date.now()-Ma<Qu?(ko(Ee.local,-.8),Ho(),Ma=0):(ko(Ee.local,.8),Ho(),Ma=Date.now())),Ro=n.touches.length,Ro===0&&(gt=!1,Ee=null,zo.enabled=!0,document.body.style.cursor="default",Qa(),E&&(mt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null))}function ld(){Ro=0,gt=!1,Ee=null,zo.enabled=!0,Ma=0,document.body.style.cursor="default",Qa(),E&&(mt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null)}function cd(n){n.preventDefault()}function ud(n){mt=n.scene,Fo=n.camera,zo=n.controls,tt=n.terrainMesh,ro=n.waterLevel,ko=n.sculptTerrain,Ho=n.updateTrimesh,window.addEventListener("mousedown",ed),window.addEventListener("mouseup",td),window.addEventListener("mousemove",od),window.addEventListener("contextmenu",cd),window.addEventListener("keydown",ad),window.addEventListener("keyup",nd),window.addEventListener("touchstart",sd,{passive:!1}),window.addEventListener("touchmove",id,{passive:!1}),window.addEventListener("touchend",rd),window.addEventListener("touchcancel",ld)}function dd(){if(gt&&Ee){const n=Date.now();if(n-Zo>16){const e=Ve()?-4.88:4.98;if(ko(Ee.local,e),n-Zo>10)return Ho(),Zo=n,!0;Zo=n}}return!1}function hd(n){n.terrainMesh!==void 0&&(tt=n.terrainMesh),n.waterLevel!==void 0&&(ro=n.waterLevel),n.sculptTerrain!==void 0&&(ko=n.sculptTerrain),n.updateTrimesh!==void 0&&(Ho=n.updateTrimesh)}function fd(){E&&mt&&(mt.remove(E),E.geometry.dispose(),E.material.dispose(),E=null),gt=!1,Ee=null,Zo=0}const la=[];let mn=0;const _o=[];function md(n){const e=new b(.9,.6,.2),t=new b(1,.8,.3),o=new b(1,.6,.4),a=new b(.502,.749,.4),i=new b(.4,.6,.302),s=new b(.6,.85,.5),l=Date.now(),r=1500,u=300,c=()=>{const d=Date.now()-l,h=Math.min(d/r,1),p=1-Math.pow(1-h,3);if(n.uniforms.midLowColor.value.lerpVectors(e,a,p),d>u){const f=Math.min((d-u)/r,1),g=1-Math.pow(1-f,3);n.uniforms.midColor.value.lerpVectors(t,i,g)}if(d>u*2){const f=Math.min((d-u*2)/r,1),g=1-Math.pow(1-f,3);n.uniforms.midHighColor.value.lerpVectors(o,s,g)}d<r+u*2&&requestAnimationFrame(c)};requestAnimationFrame(c)}function pd(n,e,t,o=1.5,a=[]){const i=[],s=n*20,l={min:.3,max:2.2};let r=0;for(;i.length<n&&r<s;){r++;const u=(Math.random()-.5)*e*.8,c=(Math.random()-.5)*e*.8,d=new b(u,20,c),h=new b(0,-1,0),f=new uo(d,h).intersectObject(t);if(f.length===0)continue;const g=f[0].point.y;if(g<l.min||g>l.max)continue;let v=!1;const w=[...a,...i];for(const M of w)if(Math.sqrt(Math.pow(u-M.x,2)+Math.pow(c-M.z,2))<o){v=!0;break}v||i.push({x:u,z:c})}return i}function ir(n){const{scene:e,modelCache:t,terrainMesh:o,modelPath:a,positions:i,baseScale:s,scaleVariation:l,staggerDelay:r,growDuration:u,verticalOffset:c=-.15,startDelay:d=0}=n;if(i.length===0){console.warn(`No positions generated for ${a}, skipping model load`);return}if(!t[a]){console.warn(`Model ${a} not preloaded yet, waiting...`),setTimeout(()=>ir(n),100);return}console.log(`Using cached model: ${a} for ${i.length} positions`);const h=t[a];i.forEach((p,f)=>{const g=new Vt;h.forEach(ae=>{const ce=new ve(ae.geometry,ae.material);ce.position.copy(ae.position),ce.rotation.copy(ae.rotation),ce.scale.copy(ae.scale),ce.castShadow=ae.castShadow,ce.receiveShadow=ae.receiveShadow,g.add(ce)});const v=new b(p.x,20,p.z),w=new b(0,-1,0),y=new uo(v,w).intersectObject(o);if(y.length===0){console.warn("Tree position not on terrain:",p);return}const S=y[0],T=S.point.y,I=S.face.normal.clone().clone().applyMatrix3(new Kr().getNormalMatrix(o.matrixWorld)).normalize();g.rotation.y=Math.random()*Math.PI*2;const C=Math.atan2(p.z,p.x),k=new b(0,1,0),L=Math.acos(Math.max(-1,Math.min(1,k.dot(I)))),B=Math.PI/9,le=Math.min(L*.6,B);g.rotation.x=Math.sin(C)*le,g.rotation.z=-Math.cos(C)*le,g.position.set(p.x,T+c,p.z),g.scale.set(0,0,0),e.add(g),g.userData.swayOffset=Math.random()*Math.PI*2,g.userData.swaySpeed=.8+Math.random()*.4,g.userData.swayAmount=.03+Math.random()*.02,g.userData.baseRotation={x:g.rotation.x,z:g.rotation.z},la.push(g);const Y=Date.now()+d+f*r,K=s+Math.random()*l,Fe=()=>{const ae=Date.now()-Y;if(ae<0){requestAnimationFrame(Fe);return}const ce=Math.min(ae/u,1),$e=(1-Math.pow(1-ce,3))*K;g.scale.set($e,$e,$e),ce<1&&requestAnimationFrame(Fe)};requestAnimationFrame(Fe)})}function gd(n,e,t){const o=[],a=n*25,i=.3,s={min:.3,max:2.2},l=Math.floor(n/6),r=[];for(let c=0;c<l;c++){const d=(Math.random()-.5)*e*.8,h=(Math.random()-.5)*e*.8;r.push({x:d,z:h,radius:1.5+Math.random()*1.5})}let u=0;for(;o.length<n&&u<a;){u++;let c,d;if(Math.random()<.7&&r.length>0){const M=r[Math.floor(Math.random()*r.length)],y=Math.random()*Math.PI*2,S=Math.random()*M.radius;c=M.x+Math.cos(y)*S,d=M.z+Math.sin(y)*S}else c=(Math.random()-.5)*e*.8,d=(Math.random()-.5)*e*.8;const h=new b(c,20,d),p=new b(0,-1,0),g=new uo(h,p).intersectObject(t);if(g.length===0)continue;const v=g[0].point.y;if(v<s.min||v>s.max)continue;let w=!1;for(const M of o)if(Math.sqrt(Math.pow(c-M.x,2)+Math.pow(d-M.z,2))<i){w=!0;break}w||o.push({x:c,z:d})}return o}function Zs(n){const{scene:e,modelCache:t,terrainMesh:o,grassModelPath:a,grassTuftPositions:i,batchIndex:s}=n,l=t[a];i.forEach((r,u)=>{const c=new Vt;l.forEach(y=>{const S=new ve(y.geometry,y.material);S.position.copy(y.position),S.rotation.copy(y.rotation),S.scale.copy(y.scale),S.castShadow=y.castShadow,S.receiveShadow=y.receiveShadow,c.add(S)});const d=new b(r.x,20,r.z),h=new b(0,-1,0),f=new uo(d,h).intersectObject(o);if(f.length===0){console.warn("Grass tuft position not on terrain:",r);return}const g=f[0].point.y;c.rotation.y=Math.random()*Math.PI*2,c.position.set(r.x,g-.05,r.z),c.scale.set(0,0,0),e.add(c);const v=Date.now()+u*80+500,w=.228+Math.random()*.188,M=()=>{const y=Date.now()-v;if(y<0){requestAnimationFrame(M);return}const T=Math.min(y/800,1),I=(1-Math.pow(1-T,3))*w;c.scale.set(I,I,I),T<1&&requestAnimationFrame(M)};requestAnimationFrame(M)})}function vd(n){const{scene:e,terrainMaterial:t,terrainMesh:o,terrainSize:a,modelCache:i}=n;Zc(),md(t);const s=[{modelPath:"./models/palm_tree.glb",count:24,minSpacing:1.12,baseScale:.00184,scaleVariation:949e-6,staggerDelay:150,growDuration:1e3,verticalOffset:-.15,startDelay:0},{modelPath:"./models/ivory-cane-palm.glb",count:20,minSpacing:.43,baseScale:.054689,scaleVariation:.04377,staggerDelay:130,growDuration:1100,verticalOffset:-.0812,startDelay:400},{modelPath:"./models/olive-palm.glb",count:6,minSpacing:.73,baseScale:.18,scaleVariation:.077,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/lady-palm.glb",count:5,minSpacing:.69,baseScale:.048,scaleVariation:.042,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/bismarck-palm.glb",count:5,minSpacing:.29,baseScale:.078,scaleVariation:.062,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450}],l=[],r=80;s.forEach((f,g)=>{setTimeout(()=>{const v=pd(f.count,a,o,f.minSpacing,l);console.log(`Generated ${v.length} positions for ${f.modelPath} (requested ${f.count})`),l.push(...v),ir({scene:e,modelCache:i,terrainMesh:o,modelPath:f.modelPath,positions:v,baseScale:f.baseScale,scaleVariation:f.scaleVariation,staggerDelay:f.staggerDelay,growDuration:f.growDuration,verticalOffset:f.verticalOffset,startDelay:f.startDelay})},g*r)});const u="./models/tall-grass.glb",c=15,d=4,h=60,p=[];for(let f=0;f<d;f++)setTimeout(()=>{const g=gd(c,a,o);p.push(...g),console.log(`Generated grass batch ${f+1}/${d}: ${g.length} positions`),i[u]?Zs({scene:e,modelCache:i,terrainMesh:o,grassModelPath:u,grassTuftPositions:g,batchIndex:f}):(console.warn("Grass model not preloaded yet, waiting..."),setTimeout(()=>{i[u]&&Zs({scene:e,modelCache:i,terrainMesh:o,grassModelPath:u,grassTuftPositions:g,batchIndex:f})},90))},400+f*h);setTimeout(()=>{wd(e)},2e3)}function yd(n){if(la.length===0||(mn++,mn<2))return;mn=0;const e=Math.sin(n*.9);la.forEach(t=>{if(t.scale.x===0)return;const{swayOffset:o,swaySpeed:a,swayAmount:i,baseRotation:s}=t.userData,l=Math.sin(n*a+o)*e*i;t.rotation.x=s.x+l,t.rotation.z=s.z+l*.7})}async function wd(n){const{GLTFLoader:e}=await Ut(async()=>{const{GLTFLoader:s}=await Promise.resolve().then(()=>ic);return{GLTFLoader:s}},void 0),t=new e,o=Math.random()<.6?1:0,a=Math.floor(Math.random()*3),i=Math.floor(Math.random()*4);console.log(`Spawning win seagulls: ${o} flock, ${a} spirals, ${i} singles`),o>0&&t.load("./models/seagulls-flock.glb",s=>{const l=s.scene;if(l.position.set(0,6.28,0),l.scale.set(.026,.026,.026),l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!1)}),n.add(l),s.animations&&s.animations.length>0){const r=new We(l);s.animations.forEach(u=>{const c=r.clipAction(u);c.timeScale=.5,c.play()}),l.userData.mixer=r}l.userData.type="flock",l.userData.bobTime=Math.random()*Math.PI*2,l.userData.bobSpeed=.3,l.userData.bobAmount=1.8,_o.push(l)});for(let s=0;s<a;s++)t.load("./models/seagulls-spiral.glb",l=>{const r=l.scene,u=(Math.random()-.5)*8,c=(Math.random()-.5)*8,d=5+Math.random()*3;if(r.position.set(u,d,c),r.scale.set(.14,.14,.14),r.traverse(h=>{h.isMesh&&(h.castShadow=!0,h.receiveShadow=!1)}),n.add(r),l.animations&&l.animations.length>0){const h=new We(r);l.animations.forEach(p=>{const f=h.clipAction(p);f.timeScale=.55+Math.random()*.2,f.play()}),r.userData.mixer=h}r.userData.type="spiral",r.userData.bobTime=Math.random()*Math.PI*2,r.userData.bobSpeed=.25,r.userData.bobAmount=1.2,_o.push(r)});for(let s=0;s<i;s++)t.load("./models/seagull-1.glb",l=>{const r=l.scene,u=(Math.random()-.5)*12,c=(Math.random()-.5)*12,d=4.2+Math.random()*4.2;if(r.position.set(u,d,c),r.scale.set(.028,.028,.028),r.traverse(h=>{h.isMesh&&(h.castShadow=!0,h.receiveShadow=!1)}),n.add(r),l.animations&&l.animations.length>0){const h=new We(r);l.animations.forEach(p=>{const f=h.clipAction(p);f.timeScale=.6+Math.random()*.3,f.play();const g=Math.random()*p.duration;f.time=g}),r.userData.mixer=h}r.userData.type="single",r.userData.bobTime=Math.random()*Math.PI*2,r.userData.bobSpeed=.35+Math.random()*.1,r.userData.bobAmount=.8,_o.push(r)})}function Sd(n){_o.forEach(e=>{e.userData.mixer&&e.userData.mixer.update(n),e.userData.bobTime+=n*e.userData.bobSpeed;const t=Math.sin(e.userData.bobTime)*e.userData.bobAmount;e.userData.baseHeight||(e.userData.baseHeight=e.position.y),e.position.y=e.userData.baseHeight+t})}function bd(){_o.forEach(n=>{n.parent&&n.parent.remove(n),n.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),_o.length=0}function Md(){la.forEach(n=>{n.parent&&n.parent.remove(n),n.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),la.length=0}const Td=new Ke,rr={};function wo(n){return new Promise((e,t)=>{Td.load(n,o=>{const a=[];o.scene.traverse(i=>{i.isMesh&&a.push({geometry:i.geometry,material:i.material,position:i.position.clone(),rotation:i.rotation.clone(),scale:i.scale.clone(),castShadow:!0,receiveShadow:!0})}),rr[n]=a,console.log(`Preloaded model: ${n}`),e(a)},void 0,o=>{console.error(`Failed to preload model ${n}:`,o),t(o)})})}let pa=!1,qs=!1;function xd(){return pa||qs?Promise.resolve():(pa=!0,console.log("🌴 Lazy loading win celebration models..."),Promise.all([wo("./models/palm_tree.glb"),wo("./models/ivory-cane-palm.glb"),wo("./models/olive-palm.glb"),wo("./models/tall-grass.glb"),wo("./models/lady-palm.glb"),wo("./models/bismarck-palm.glb")]).then(()=>{qs=!0,pa=!1,console.log("✅ Win celebration models loaded!")}).catch(n=>{pa=!1,console.error("Error preloading models:",n)}))}function Dd(){return rr}window.addEventListener("resize",()=>{W.aspect=window.innerWidth/window.innerHeight,W.updateProjectionMatrix(),De.setSize(window.innerWidth,window.innerHeight)});const D=new Jr;D.background=new oe(1118719);const W=new di(65,window.innerWidth/window.innerHeight,.1,5e3),oo={introEnd:{x:0,y:.82,z:32},introMid:{x:0,y:3.24,z:16},birdsEye:{x:0,y:42,z:0},gameplay:{x:0,y:5.42,z:16.42}};W.position.set(oo.introEnd.x,oo.introEnd.y,oo.introEnd.z);W.lookAt(0,0,0);const De=new $r({antialias:!0});De.setSize(window.innerWidth,window.innerHeight);De.shadowMap.enabled=!0;De.shadowMap.type=Qr;document.body.appendChild(De.domElement);const Ed=Dd(),Se=new ul(W,De.domElement);Se.enableDamping=!0;Se.dampingFactor=.05;Se.minDistance=8.4;Se.maxDistance=75;Se.maxPolarAngle=Math.PI/1.9;Se.enabled=!1;let Jn=!1;const Pd=1800;let Na=!1,Ae=new Vt;D.add(Ae);function _d(){Jn=!0;const n=Date.now(),e=4100,t=[{...oo.birdsEye},{...oo.introMid},{...oo.introEnd}];function o(){const a=Date.now()-n,i=Math.min(a/e,1),s=i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;let l,r,u;s<.5?(l=s*2,r=t[0],u=t[1]):(l=(s-.5)*2,r=t[1],u=t[2]);const c=l<.5?2*l*l:1-Math.pow(-2*l+2,2)/2;W.position.x=r.x+(u.x-r.x)*c,W.position.y=r.y+(u.y-r.y)*c,W.position.z=r.z+(u.z-r.z)*c,W.lookAt(0,0,0),i<1?requestAnimationFrame(o):Jn=!1}o()}function Cd(){const n=Date.now(),e={x:W.position.x,y:W.position.y,z:W.position.z},t={...oo.gameplay};function o(){const a=Date.now()-n,i=Math.min(a/Pd,1),s=1-Math.pow(1-i,3);W.position.x=e.x+(t.x-e.x)*s,W.position.y=e.y+(t.y-e.y)*s,W.position.z=e.z+(t.z-e.z)*s,W.lookAt(0,0,0),i<1?requestAnimationFrame(o):Se.enabled=!0}o()}const Ad=new el(16777215,.486);D.add(Ad);const Ue=new ls(16777215,1.63);Ue.position.set(5,10,5);Ue.castShadow=!0;Ue.shadow.mapSize.width=2048;Ue.shadow.mapSize.height=2048;Ue.shadow.camera.near=.8;Ue.shadow.camera.far=60;Ue.shadow.camera.left=-15;Ue.shadow.camera.right=15;Ue.shadow.camera.top=15;Ue.shadow.camera.bottom=-15;Ue.shadow.bias=8e-4;Ue.shadow.normalBias=.02;D.add(Ue);let Ye,pn;function Id(){Ye=new $a,Ye.scale.setScalar(285e4),D.add(Ye),pn=new b;const n=Ye.material.uniforms;n.turbidity.value=1.21,n.rayleigh.value=.68,n.mieCoefficient.value=.002,n.mieDirectionalG.value=1.97;const e=ee.degToRad(84),t=ee.degToRad(68);pn.setFromSphericalCoords(1,e,t),n.sunPosition.value.copy(pn),De.toneMappingExposure=.5}Id();const lr=new ls(16754022,.4);lr.position.set(-5,4,-5);D.add(lr);const be=new sl({gravity:new Je(0,-9.82,0)}),Ts=new fi("ground"),lo=new fi("ball"),Ld=new il(Ts,lo,{friction:.062,restitution:.3,contactEquationStiffness:1e6,contactEquationRelaxation:3,frictionEquationStiffness:1e6,frictionEquationRegularizationTime:3});be.addContactMaterial(Ld);new rl(D,be,{color:65280,scale:1});let _=At.getCurrentLevel();console.log(`Starting Level ${_.id}: ${_.name}`);let R=pi({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:be,groundMaterial:Ts,shape:_.terrainShape,waterLevel:_.waterLevel});Ae.add(R.mesh);let Ba=R.size,ao=R.mesh,Wa=R.geometry,Re=R.material,cr=R.body;Wa.attributes.position;R.config.falloffStart;R.config.falloffEnd;R.getHeightAt;let Ct=R.randomPosition,Qn=R.sculpt,es=R.updatePhysics;R.simpleNoise;zi(_.spawn);R.setRenderer(De);Re.uniforms.uUseWetnessMap.value=!0;Re.uniforms.uWetnessMap.value=R.wetnessMap.texture();let ge=_.waterLevel,H=gi({terrainSize:Ba,waterLevel:ge});D.add(H.mesh);D.add(H.hemisphereMesh);H.material.uniforms.uUseHeightmap.value=!0;H.material.uniforms.uTerrainHeightmap.value=R.heightmap.texture;H.material.uniforms.uHeightmapWorldSize.value=R.heightmap.worldSize;H.material.uniforms.uHeightmapMinHeight.value=R.heightmap.minHeight;H.material.uniforms.uHeightmapMaxHeight.value=R.heightmap.maxHeight;let ur=H.mesh,z=H.material;z.uniforms.uTerrainWidthX.value=R.config.islandRadius;z.uniforms.uTerrainWidthZ.value=R.config.islandRadius;z.uniforms.uTerrainHeight.value=.5;const No=_.terrainShape||{};z.uniforms.uTerrainScaleX.value=No.scaleX||1;z.uniforms.uTerrainScaleY.value=No.scaleY||1;z.uniforms.uTerrainIrregularity.value=No.irregularity||1;z.uniforms.uTerrainBayAngle.value=No.bay?.angle||0;z.uniforms.uTerrainBayDepth.value=No.bay?.depth||0;z.uniforms.uTerrainBayWidth.value=No.bay?.width||0;z.uniforms.uIslandGroupOffset.value.set(Ae.position.x,Ae.position.z);let Va=vi({scene:D,waterLevel:ge,maxRipples:68});ud({scene:D,camera:W,controls:Se,terrainMesh:ao,waterLevel:ge,sculptTerrain:Qn,updateTrimesh:es});let j={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1};_.id>=1&&_.id<2&&(bi(D),j.shark=!0);_.id>=2&&_.id<3&&(Di(D),j.mantaRays=!0);_.id>=3&&_.id<4&&(Ci(D,n=>console.log("dolphins ready",n)),j.dolphins=!0);_.id>=4&&_.id<6&&(Pi(D),j.whales=!0);_.id===5&&_.id<7&&(Li(D),j.ship=!0);_.id===6&&_.id<7&&(Ri(D),j.sailBoat=!0);_.id===3&&_.id<4&&(Oi(D,be,lo),j.temple=!0);_.id===10&&(Fi(D),j.whaleShark=!0);_.id===14&&(ki(D),j.seagulls=!0);_.id>=1&&La(D,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:ge,behavior:{swimDepth:ge+-3.6865,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.022,max:.033},levels:[1,2,3,4,5,6,7,8,9,10]},e=>{console.log("Blue fish school loaded:",e.fish.length,"fish"),j.fishSchools=!0});[1,4,11].includes(_.id)&&La(D,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:ge,behavior:{swimDepth:ge+-3.1865,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},e=>{console.log("Clownfish school loaded:",e.fish.length,"fish"),j.fishSchools=!0});const Co=Dl(),Rd=zc(D,be,lo);function Od(){Jt=!0,xo=Date.now(),Ga=!1,ja=!1,At.startLevelTimer(),xd(),m.savedWinPercentage=st,st=1.01,Nn({scene:D,world:be,ballMaterial:lo,randomTerrainPosition:Ct,createCloudIndicator:Yo,sharedCloudTexture:Co,sky:Ye,renderer:De,water:H}),Xa=Date.now()+m.startDelay+m.duration+8e3}au({levelManager:At,animateCameraToGameplay:Cd,startGame:Od,transitionToNextLevel:Bd});Yi(_);Ki(_.winPercentage);qi(_);let Ua=_.multipleTargets||1,ht=[],co=[],rt=[];const Fd=5;function kd(n,e,t){for(const o of e){const a=n.x-o.x,i=n.z-o.z;if(Math.sqrt(a*a+i*i)<t)return!1}return!0}for(let n=0;n<Ua;n++){let e,t=0;const o=50;do e=Ct(),t++;while(!kd(e,ht,Fd)&&t<o);ht.push(e);const a=new us(1.5,1.5,.2,32),i=new Ya({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.63,roughness:.7,transparent:!0,opacity:.246,depthWrite:!1}),s=new ve(a,i);s.position.set(e.x,.1,e.z),s.renderOrder=2,Ae.add(s),co.push(s),rt.push(i)}Nu();ar(D,ht,Co);let Jt=!1,St=!1,ts=0,os=!1,Kt=new Set,st=_.winPercentage,Xa=0,me=null,To=!1,Ys=0,gn=null,vn=null,yn=0,wn=0,xo=0,Ga=!1,ja=!1;function Hd(){Jt=!1,St=!1,D.remove(ao),Wa.dispose(),Re.dispose(),be.removeBody(cr),D.remove(ur),D.remove(H.hemisphereMesh),z.dispose(),H.mesh.geometry.dispose(),H.hemisphereMesh.geometry.dispose(),H.hemisphereMesh.material.dispose(),Va.dispose(),[...ea].forEach(e=>{D.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose(),be.removeBody(e.body)}),ea.length=0,Wc(),[...co].forEach(e=>{D.remove(e),e.geometry.dispose(),e.material.dispose()}),co.length=0,rt.length=0,ht.length=0,$u(D),me&&(D.remove(me),me.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),me=null),m.cloudData&&(m.cloudData.group&&(D.remove(m.cloudData.group),m.cloudData.group.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})),m.cloudData=null),Yc(),Ye&&(Ye.material.uniforms.turbidity.value=1.21,Ye.material.uniforms.rayleigh.value=.68,Ye.material.uniforms.mieCoefficient.value=.002,De.toneMappingExposure=.5),fd(),D.remove(Ae),Ae.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())});const n=[];D.children.forEach(e=>{e.isLight||e.isSky||e.isCamera||n.push(e)}),n.forEach(e=>{D.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),Kt.clear(),To=!1,Qi(),$i(),Ji(),vs(),Md(),bd(),Hc(D),console.log("Level cleanup complete")}function zd(n){console.log(`Loading Level ${n}...`),Ae=new Vt,D.add(Ae),At.currentLevelId=n,At.saveCurrentLevel(),_=At.getCurrentLevel(),R=pi({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:be,groundMaterial:Ts,shape:_.terrainShape,waterLevel:_.waterLevel}),Ae.add(R.mesh),Ba=R.size,ao=R.mesh,Wa=R.geometry,Re=R.material,cr=R.body,Wa.attributes.position,R.config.falloffStart,R.config.falloffEnd,R.getHeightAt,Ct=R.randomPosition,Qn=R.sculpt,es=R.updatePhysics,R.simpleNoise,zi(_.spawn),R.setRenderer(De),Re.uniforms.uUseWetnessMap.value=!0,Re.uniforms.uWetnessMap.value=R.wetnessMap.texture(),Yi(_),Ki(_.winPercentage),ge=_.waterLevel,H=gi({terrainSize:Ba,waterLevel:ge}),D.add(H.mesh),D.add(H.hemisphereMesh),ur=H.mesh,z=H.material,z.uniforms.uUseHeightmap.value=!0,z.uniforms.uTerrainHeightmap.value=R.heightmap.texture,z.uniforms.uHeightmapWorldSize.value=R.heightmap.worldSize,z.uniforms.uHeightmapMinHeight.value=R.heightmap.minHeight,z.uniforms.uHeightmapMaxHeight.value=R.heightmap.maxHeight,z.uniforms.uTerrainWidthX.value=R.config.islandRadius,z.uniforms.uTerrainWidthZ.value=R.config.islandRadius,z.uniforms.uTerrainHeight.value=.5;const e=_.terrainShape||{};z.uniforms.uTerrainScaleX.value=e.scaleX||1,z.uniforms.uTerrainScaleY.value=e.scaleY||1,z.uniforms.uTerrainIrregularity.value=e.irregularity||1,z.uniforms.uTerrainBayAngle.value=e.bay?.angle||0,z.uniforms.uTerrainBayDepth.value=e.bay?.depth||0,z.uniforms.uTerrainBayWidth.value=e.bay?.width||0,z.uniforms.uIslandGroupOffset.value.set(Ae.position.x,Ae.position.z),Va=vi({scene:D,waterLevel:ge,maxRipples:68}),hd({terrainMesh:ao,waterLevel:ge,sculptTerrain:Qn,updateTrimesh:es}),j={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1},_.id>=1&&_.id<2&&(bi(D),j.shark=!0),_.id>=2&&_.id<3&&(Di(D),j.mantaRays=!0),_.id>=3&&_.id<4&&(Ci(D),j.dolphins=!0),_.id>=4&&_.id<5&&(Pi(D),j.whales=!0),_.id>=5&&_.id<6&&(Li(D),j.ship=!0),_.id>=6&&_.id<7&&(Ri(D),j.sailBoat=!0),_.id>=3&&_.id<4&&(Oi(D,be,lo),j.temple=!0),_.id===10&&(Fi(D),j.whaleShark=!0),_.id===14&&(ki(D),j.seagulls=!0),_.id>=1&&La(D,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:ge,behavior:{swimDepth:ge+-3.4285,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.022,max:.033},levels:[1,2,3,4,5,6,7,8,9,10]},()=>{j.fishSchools=!0}),[1,4,11].includes(_.id)&&La(D,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:ge,behavior:{swimDepth:ge+-3.18685,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},()=>{j.fishSchools=!0}),Ua=_.multipleTargets||1,ht=[],co=[],rt=[],Ju();function t(a,i,s){for(const l of i){const r=a.x-l.x,u=a.z-l.z;if(r*r+u*u<s*s)return!1}return!0}for(let a=0;a<Ua;a++){let i=Ct(),s=0;const l=50;for(;!t(i,ht,5)&&s<l;)i=Ct(),s++;ht.push(i);const r=new us(1.5,1.5,.2,32),u=new Ya({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.3,roughness:.7,transparent:!0,opacity:.6,depthWrite:!1}),c=new ve(r,u);c.position.set(i.x,.1,i.z),c.renderOrder=2,Ae.add(c),co.push(c),rt.push(u)}ar(D,ht,Co),Jt=!1,St=!1,ts=0,os=!1,Kt=new Set,st=_.winPercentage,Xa=0,To=!1,xo=0,Ga=!1,ja=!1,Se.enabled=!1,Qi();const o=document.getElementById("level-select-modal");o&&(o.classList.add("hidden"),o.style.display="none",o.style.animation=""),Ji(),qi(_,!0),console.log(`Level ${n} loaded successfully!`)}const So=Array.from({length:10},()=>new b),Nd=Se.maxDistance;function Bd(){if(Na)return;Na=!0,qc(),jc();const n=At.currentLevelId;iu(),ru(),$i(),Se.enabled=!1,Se.maxDistance=1/0;const e=694,t=new b;W.getWorldDirection(t);const a=Math.atan2(t.z,t.x)+Math.PI,i=ee.degToRad(25),s=a-i,l=a+i;let r,u=0;do{r=Math.random()*Math.PI*2,u++;const Ie=(r+Math.PI*2)%(Math.PI*2),yt=(s+Math.PI*2)%(Math.PI*2),J=(l+Math.PI*2)%(Math.PI*2);if(yt<J){if(Ie<yt||Ie>J)break}else if(Ie<yt&&Ie>J)break}while(u<100);const c=new b(Math.cos(r)*e,0,Math.sin(r)*e),d=W.position.clone(),h=Se.target.clone(),p=W.fov,f=new b(H.mesh.position.x,H.mesh.position.y,H.mesh.position.z);W.rotation.x,W.rotation.y,W.rotation.z;const g=Ao(),v=g.playbackRate||1,w=Math.atan2(c.z-d.z,c.x-d.x),M=468,y=e*.38,S=26,T=4.82,A=460,I=So[4].set(c.x-Math.cos(w)*A,c.y+T,c.z-Math.sin(w)*A),C=So[5].set(d.x+Math.cos(w)*y,M,d.z+Math.sin(w)*y),k=So[6].set(c.x-Math.cos(w)*S,c.y+T,c.z-Math.sin(w)*S),L=Math.atan2(c.z-f.z,c.x-f.x),B=So[7].set(f.x+Math.cos(L)*y,M,f.z+Math.sin(L)*y),le=So[8].set(c.x,f.y,c.z),Y=5600,K=.36;let Fe=0,ae=performance.now();const ce=Ie=>Ie<.5?4*Ie*Ie*Ie:1-Math.pow(-2*Ie+2,3)/2;let da=!1,$e=!1;const Xe=document.getElementById("level-story-overlay"),vt=document.getElementById("level-story-text"),ho=At.getCurrentLevel();Xe&&vt&&ho.story&&(vt.textContent=ho.story,Xe.style.display="block");let Gt=!1,Ot=!1;const jt=So[9],fo=new b,mo=new b;new b;function ha(Ie){const yt=Math.min(.033,(Ie-ae)/1e3);ae=Ie,Fe+=yt*1e3;const J=Math.min(Fe/Y,1),at=ce(J),Ft=1-at,Le=at*at,Bo=Le*at,po=Ft*Ft,x=po*Ft,O=1+J*.048;g.playbackRate=v*O,W.position.set(x*d.x+3*po*at*C.x+3*Ft*Le*I.x+Bo*k.x,x*d.y+3*po*at*C.y+3*Ft*Le*I.y+Bo*k.y,x*d.z+3*po*at*C.z+3*Ft*Le*I.z+Bo*k.z);const F=65;W.fov=ee.lerp(p,F,at),W.updateProjectionMatrix(),J>=.05&&!$e&&($e=!0,z.uniforms.uFoamEnabled.value=!1);const V=.22,q=.62;!Gt&&J>=V&&Xe&&(Gt=!0,Xe.classList.add("visible")),!Ot&&J>=q&&Xe&&(Ot=!0,Xe.classList.remove("visible"));const G={panOut:.03,panIn:.92,lockNew:1};if(J<G.panOut)jt.copy(h);else if(J<G.panIn){const fe=(J-G.panOut)/(G.panIn-G.panOut),wt=ce(fe);fo.set(Math.cos(w),0,Math.sin(w)).multiplyScalar(y*2),mo.copy(W.position).add(fo).setY(W.position.y-96),jt.lerpVectors(h,mo,wt)}else{const fe=(J-G.panIn)/(G.lockNew-G.panIn),wt=ce(fe);jt.lerpVectors(jt,c,wt)}Se.target.copy(jt),Se.update();const te=W.rotation.z,Q=.15;let N=0;if(J<.2){const fe=J/.2;N=Q*fe}else if(J<.35)N=Q;else if(J<.55){const fe=(J-.35)/.2;N=Q*(1-fe)}else N=0;W.rotation.z=te+N,J>=K&&!da&&(da=!0,Hd(),zd(n),Ae.position.copy(c));const X=.086,Z=.192,ne=1.16,P=.664;let ue=f.x,de=f.z;if(J>X){const fe=(J-X)/(1-X),wt=Math.max(fe-Z,0),Wo=Math.min(wt/P,3),Pe=Wo*Wo*(3-2*Wo),Ge=1+(ne-1)*Pe,Vo=Math.min(fe*Ge,1),Zt=ce(Vo),go=1-Zt;ue=go*go*f.x+2*go*Zt*B.x+Zt*Zt*le.x,de=go*go*f.z+2*go*Zt*B.z+Zt*Zt*le.z}if(H.mesh.position.set(ue,H.mesh.position.y,de),H.hemisphereMesh.position.set(H.mesh.position.x,40.88,H.mesh.position.z),H.material.uniforms.uMeshOffset.value.set(H.mesh.position.x,H.mesh.position.z),J<1){requestAnimationFrame(ha);return}const he=c.clone().negate();Ae.position.add(he),H.mesh.position.add(he),H.material.uniforms.uMeshOffset.value.set(H.mesh.position.x,H.mesh.position.z),H.hemisphereMesh.position.x+=he.x,H.hemisphereMesh.position.z+=he.z,W.position.add(he),Se.target.copy(c).add(he),Se.update(),g.playbackRate=v,Wd()}requestAnimationFrame(ha)}function Wd(){Se.maxDistance=Nd,Na=!1,z.uniforms.uFoamEnabled.value=!0;const n=document.getElementById("level-story-overlay");n&&(n.classList.remove("visible"),n.style.display="none"),_.id>1&&su(),console.log("Transition complete – welcome to the new island!")}let as=!1,Sn=!1;document.addEventListener("visibilitychange",()=>{if(document.hidden){as=!0,Za.stop();const n=Ao();Sn=!n.paused,Sn&&n.pause(),vs()}else{as=!1,Za.start();const n=Ao();Sn&&gs()&&n.play().catch(e=>console.log("Failed to resume background music:",e))}});const Za=new tl,Ks=new uo,$s=new uo,ga=new b,va=new b,Js=new b,Qs=new b;let ei=0;function ns(){if(as){De.render(D,W),requestAnimationFrame(ns);return}const n=Za.getDelta();be.step(1/60,n,3),!Na&&!Jn&&Se.update(),dd();const e=ea.filter(c=>c.active);e.forEach(c=>{const d=c.body.position.x,h=c.body.position.z,p=c.body.position.y;if(!c.hasSpawnedRipple){const g=p-c.radius,v=c.body.velocity.y;if(v<0&&g<=ge-.685){const M=(ge-g)/Math.abs(v),y=.142,S=d-c.body.velocity.x*M+c.body.velocity.x*y,T=h-c.body.velocity.z*M+c.body.velocity.z*y,A=z.uniforms.uTime.value,I=xl(S,T,A),C=ge+I-.05;Va.spawnRipple(S,T,{size:c.radius*3,speed:1,color:new oe(11197951),y:C}),Vc(c.radius),c.hasSpawnedRipple=!0}}if(p-c.radius<ge-.88){c.active=!1,D.remove(c.mesh),be.removeBody(c.body),Kt.has(c)&&Kt.delete(c);return}ga.set(d,20,h),va.set(0,-1,0),Ks.set(ga,va);const f=Ks.intersectObject(ao);if(f.length>0){const g=f[0].point.y;p-c.radius<g-.55&&(c.body.position.y=g+c.radius+.2,c.body.velocity.y=Math.max(0,c.body.velocity.y))}}),Nc(n),e.forEach((c,d)=>{c.mesh.position.copy(c.body.position);const h=c.body.position.y-c.radius;ga.set(c.body.position.x,20,c.body.position.z),va.set(0,-1,0),$s.set(ga,va);const p=$s.intersectObject(ao);let f=!1,g=-100;p.length>0&&(g=p[0].point.y,f=h<=g+.3&&g>ge+.5);const v=c.body.velocity,w=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);f&&w>.3&&Yu(D,c,g);for(let M=d+1;M<e.length;M++){const y=e[M];if(!y.active)continue;const S=c.body.position.x-y.body.position.x,T=c.body.position.z-y.body.position.z;if(S*S+T*T>1)continue;const I=c.body.position.y-y.body.position.y,C=Math.sqrt(S*S+I*I+T*T),k=c.radius+y.radius;if(C<k){const L=c.radius>=y.radius?c:y,B=c.radius>=y.radius?y:c,le=c.radius**3+y.radius**3,Y=Math.pow(le,1/3),K=L.body.mass+B.body.mass;L.body.velocity.x=(L.body.velocity.x*L.body.mass+B.body.velocity.x*B.body.mass)/K,L.body.velocity.y=(L.body.velocity.y*L.body.mass+B.body.velocity.y*B.body.mass)/K,L.body.velocity.z=(L.body.velocity.z*L.body.mass+B.body.velocity.z*B.body.mass)/K,L.radius=Y,L.body.mass=K,be.removeBody(L.body),L.body.shapes=[new ds(Y)],L.body.updateBoundingRadius(),be.addBody(L.body),L.mesh.geometry=ms.get(Y),B.active=!1,D.remove(B.mesh),be.removeBody(B.body)}}});const t=3,o=t*t,a=1.5;for(let c=0;c<e.length;c++)for(let d=c+1;d<e.length;d++){const h=e[c],p=e[d],f=p.body.position.x-h.body.position.x,g=p.body.position.z-h.body.position.z;if(f*f+g*g>o)continue;const w=p.body.position.y-h.body.position.y,M=Math.sqrt(f*f+w*w+g*g);if(M<t&&M>.1){const y=f/M,S=w/M,T=g/M,A=a*(1-M/t);h.body.velocity.x+=y*A*n,h.body.velocity.y+=S*A*n,h.body.velocity.z+=T*A*n,p.body.velocity.x-=y*A*n,p.body.velocity.y-=S*A*n,p.body.velocity.z-=T*A*n}}for(let c=0;c<co.length;c++)co[c].rotation.y+=n*.5;Uu(n,rt),Xu(n),H.update(z.uniforms.uTime.value+n),ei++,ei%2===0&&(R.wetnessMap.update(De,z,z.uniforms.uTime.value),Re.uniforms.uWetnessMap.value=R.wetnessMap.texture()),Re.uniforms.uTime.value=z.uniforms.uTime.value,Re.uniforms.uWaveAmplitude.value=z.uniforms.uWaveAmplitude.value,Re.uniforms.uWaveFrequency.value=z.uniforms.uWaveFrequency.value,Re.uniforms.uWaveHeightMultiplier.value=z.uniforms.uWaveHeightMultiplier.value,Re.uniforms.uWaterCurvature.value=z.uniforms.uCurvature.value;const i=Ae.position;Re.uniforms.uWaterMeshOffset.value.set(z.uniforms.uMeshOffset.value.x-i.x,z.uniforms.uMeshOffset.value.y-i.z),Re.uniforms.uWaterMeshPosition.value.set(H.mesh.position.x-i.x,H.mesh.position.z-i.z),z.uniforms.uIslandGroupOffset.value.set(i.x,i.z),Va.update(n),j.shark&&rc(n),j.mantaRays&&pc(n,D),j.dolphins&&Sc(n),j.whales&&vc(n),j.ship&&Mc(n),j.sailBoat&&Tc(n),j.whaleShark&&xc(n),j.seagulls&&Dc(n),j.fishSchools&&kc(n,m.isActive),Gu(e,ht,be,Kt,Xc,uu),ju(D,n,ht);let s=0;Kt.size>0&&Kt.forEach(c=>{s+=c.body.mass});const l=Math.min(s/ma()*100,100);if(lu(l),qu(W,n,St,ts,rt),!St&&ma()>0&&s>=ma()*st){St=!0,ts=Date.now(),setTimeout(()=>{const c=s/ma();console.log(`Final water collected: ${Math.round(c*100)}% (win at ${Math.round(st*100)}%)`),At.completeLevel(3,c).then(d=>{console.log("Level completed! Score:",d),d.valid!==!1&&Iu(d)})},2e3),Gc(),cu();for(let c=0;c<Ua;c++)rt[c]&&(rt[c].color.setHex(255),rt[c].emissive.setHex(255),rt[c].emissiveIntensity=1);nu(),vd({scene:D,terrainMaterial:Re,terrainMesh:ao,terrainSize:Ba,modelCache:Ed}),os=!0}Ku(n),os&&(yd(Za.getElapsedTime()),Sd(n));const r=m.isActive;Kc({gameStarted:Jt,scene:D,camera:W,dt:n,sky:Ye,renderer:De,updateCloud:En,updateRainParticles:Pn,setRainOpacity:Ta}),r&&!m.isActive&&m.savedWinPercentage!==void 0&&(st=m.savedWinPercentage,delete m.savedWinPercentage,console.log("Storm ended - win condition restored!"));const u=Date.now();if(Jt&&!St&&!Ga&&xo>0&&u-xo>=12e4&&(m.isActive||(console.log("🌩️ Second storm incoming!"),Ga=!0,m.savedWinPercentage=st,st=1.01,Nn({scene:D,world:be,ballMaterial:lo,randomTerrainPosition:Ct,createCloudIndicator:Yo,sharedCloudTexture:Co,sky:Ye,renderer:De,water:H},!0))),Jt&&!St&&!ja&&xo>0&&u-xo>=21e4&&(m.isActive||(console.log("🌩️ Third storm incoming!"),ja=!0,m.savedWinPercentage=st,st=1.01,Nn({scene:D,world:be,ballMaterial:lo,randomTerrainPosition:Ct,createCloudIndicator:Yo,sharedCloudTexture:Co,sky:Ye,renderer:De,water:H},!1))),Jt&&se.enabled&&!St&&!To&&u>=Xa&&(To=!0,Ys=u,wn=0,yn=u,gn=Ct(),vn=Ct(),me=Yo({startX:gn.x,startZ:gn.z,endX:vn.x,endZ:vn.z,cloudTexture:Co}),D.add(me),me.userData.drizzleSound=Ui()),To&&me){const c=u-Ys,d=Math.min(c/se.cloudDuration,1),{cloud:h,cloudMaterial:p,startPos:f,endPos:g,baseOpacity:v}=me.userData,w=f.x+(g.x-f.x)*d,M=f.z+(g.z-f.z)*d;me.position.x=w,me.position.z=M,h.visible||(h.visible=!0),h.getWorldPosition(Js);const y=W.position.distanceTo(Js);if(m.isActive&&m.cloudData){const T=m.cloudData.group.userData.cloud;T.getWorldPosition(Qs),W.position.distanceTo(Qs)>y?(T.renderOrder=10,h.renderOrder=11):(h.renderOrder=10,T.renderOrder=11)}else h.renderOrder=10;En(me,W,n),h.rotation.y=-performance.now()/7500;let S;if(c<se.fadeInDuration){const T=Math.max(0,c/se.fadeInDuration);S=v*T}else if(c>se.cloudDuration-se.fadeOutDuration){const T=(c-(se.cloudDuration-se.fadeOutDuration))/se.fadeOutDuration;S=v*Math.max(0,1-T)}else S=v;p.uniforms.opacity.value=Math.max(0,S),Pn(me,n),Ta(me,S*.6),!St&&wn<se.dropletsPerCloud&&u-yn>=se.dropletInterval&&c>se.fadeInDuration&&(Rd(me.position.x,me.position.z),wn++,yn=u),c>=se.cloudDuration&&(me.userData.drizzleSound&&Xi(me.userData.drizzleSound),D.remove(me),me.traverse(T=>{T.geometry&&T.geometry.dispose(),T.material&&T.material.dispose()}),me=null,To=!1,Xa=u+se.interval)}De.render(D,W),requestAnimationFrame(ns)}function Vd(){const n=document.getElementById("page-loading-screen");n&&setTimeout(()=>{n.classList.add("hidden"),setTimeout(()=>{n.remove()},500)},100)}Vd();_d();ns();
