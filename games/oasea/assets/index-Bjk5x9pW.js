import{a as ge,c as lt,d as bi,U as Mi,B as Ti,V as w,e as Or,f as ko,T as Ro,Q as zt,g as Vs,h as Se,R as kr,i as Fr,j as ne,P as jn,k as xi,l as va,m as Hr,n as re,o as zr,p as Nr,W as _n,q as In,r as Cn,L as rt,O as Zn,D as dt,b as yn,s as ro,S as _s,t as Ia,u as Br,v as Wr,G as Kt,w as Vr,x as Ur,y as Is,N as Pi,z as Cs,A as Xr,E as qn,H as Ei,I as Gr,J as ha,K as Di,X as bt,Y as Nt,Z as ya,_ as jr,$ as Zr,a0 as As,a1 as Bt,a2 as Yn,a3 as Kn,a4 as _i,a5 as qr,a6 as Yr,a7 as Ii,a8 as Kr,a9 as $r,aa as Jr,ab as Ci,ac as Qr,ad as el,ae as An,af as tl,ag as wn,M as Lt,ah as ol,ai as al,aj as nl,ak as sl,al as il,am as Ai,an as rl,ao as ll,ap as cl,aq as ul,ar as Li,as as dl,at as Us,au as Xs,av as Gs,aw as js,ax as Zs,ay as hl,az as ml,aA as fl,aB as pl,aC as Sn,aD as Ve,aE as gl,C as Ls,aF as vl,aG as yl,aH as Mo,aI as wl,aJ as Sl,aK as bl,aL as Ml,aM as Tl,aN as xl}from"./three-a87GWk7o.js";import{B as ta,T as Pl,V as ot,C as El,a as Dl,S as Ca,W as _l,M as Ri,b as Il,c as Cl}from"./physics-Cb4MsTzb.js";import{c as Al,_ as St}from"./supabase-D6xm0ZbH.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();class bn extends ge{constructor(){const e=bn.SkyShader,t=new lt({name:e.name,uniforms:Mi.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:bi,depthWrite:!1});super(new Ti(1,1,1),t),this.isSky=!0}}bn.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new w},up:{value:new w(0,1,0)}},vertexShader:`
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

		}`};const qs={type:"change"},Rs={type:"start"},Oi={type:"end"},Fa=new kr,Ys=new Fr,Ll=Math.cos(70*ne.DEG2RAD),xe=new w,Be=2*Math.PI,$={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ln=1e-6;class Rl extends Or{constructor(e,t=null){super(e,t),this.state=$.NONE,this.target=new w,this.cursor=new w,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ko.ROTATE,MIDDLE:ko.DOLLY,RIGHT:ko.PAN},this.touches={ONE:Ro.ROTATE,TWO:Ro.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new w,this._lastQuaternion=new zt,this._lastTargetPosition=new w,this._quat=new zt().setFromUnitVectors(e.up,new w(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Vs,this._sphericalDelta=new Vs,this._scale=1,this._panOffset=new w,this._rotateStart=new Se,this._rotateEnd=new Se,this._rotateDelta=new Se,this._panStart=new Se,this._panEnd=new Se,this._panDelta=new Se,this._dollyStart=new Se,this._dollyEnd=new Se,this._dollyDelta=new Se,this._dollyDirection=new w,this._mouse=new Se,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=kl.bind(this),this._onPointerDown=Ol.bind(this),this._onPointerUp=Fl.bind(this),this._onContextMenu=Ul.bind(this),this._onMouseWheel=Nl.bind(this),this._onKeyDown=Bl.bind(this),this._onTouchStart=Wl.bind(this),this._onTouchMove=Vl.bind(this),this._onMouseDown=Hl.bind(this),this._onMouseMove=zl.bind(this),this._interceptControlDown=Xl.bind(this),this._interceptControlUp=Gl.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(qs),this.update(),this.state=$.NONE}update(e=null){const t=this.object.position;xe.copy(t).sub(this.target),xe.applyQuaternion(this._quat),this._spherical.setFromVector3(xe),this.autoRotate&&this.state===$.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let o=this.minAzimuthAngle,n=this.maxAzimuthAngle;isFinite(o)&&isFinite(n)&&(o<-Math.PI?o+=Be:o>Math.PI&&(o-=Be),n<-Math.PI?n+=Be:n>Math.PI&&(n-=Be),o<=n?this._spherical.theta=Math.max(o,Math.min(n,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(o+n)/2?Math.max(o,this._spherical.theta):Math.min(n,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const i=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=i!=this._spherical.radius}if(xe.setFromSpherical(this._spherical),xe.applyQuaternion(this._quatInverse),t.copy(this.target).add(xe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let i=null;if(this.object.isPerspectiveCamera){const l=xe.length();i=this._clampDistance(l*this._scale);const r=l-i;this.object.position.addScaledVector(this._dollyDirection,r),this.object.updateMatrixWorld(),s=!!r}else if(this.object.isOrthographicCamera){const l=new w(this._mouse.x,this._mouse.y,0);l.unproject(this.object);const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=r!==this.object.zoom;const u=new w(this._mouse.x,this._mouse.y,0);u.unproject(this.object),this.object.position.sub(u).add(l),this.object.updateMatrixWorld(),i=xe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;i!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(i).add(this.object.position):(Fa.origin.copy(this.object.position),Fa.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Fa.direction))<Ll?this.object.lookAt(this.target):(Ys.setFromNormalAndCoplanarPoint(this.object.up,this.target),Fa.intersectPlane(Ys,this.target))))}else if(this.object.isOrthographicCamera){const i=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),i!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Ln||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ln||this._lastTargetPosition.distanceToSquared(this.target)>Ln?(this.dispatchEvent(qs),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Be/60*this.autoRotateSpeed*e:Be/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){xe.setFromMatrixColumn(t,0),xe.multiplyScalar(-e),this._panOffset.add(xe)}_panUp(e,t){this.screenSpacePanning===!0?xe.setFromMatrixColumn(t,1):(xe.setFromMatrixColumn(t,0),xe.crossVectors(this.object.up,xe)),xe.multiplyScalar(e),this._panOffset.add(xe)}_pan(e,t){const o=this.domElement;if(this.object.isPerspectiveCamera){const n=this.object.position;xe.copy(n).sub(this.target);let s=xe.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/o.clientHeight,this.object.matrix),this._panUp(2*t*s/o.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/o.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/o.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const o=this.domElement.getBoundingClientRect(),n=e-o.left,s=t-o.top,i=o.width,l=o.height;this._mouse.x=n/i*2-1,this._mouse.y=-(s/l)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Be*this._rotateDelta.x/t.clientHeight),this._rotateUp(Be*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Be*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Be*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Be*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Be*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._rotateStart.set(o,n)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panStart.set(o,n)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),o=e.pageX-t.x,n=e.pageY-t.y,s=Math.sqrt(o*o+n*n);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const o=this._getSecondPointerPosition(e),n=.5*(e.pageX+o.x),s=.5*(e.pageY+o.y);this._rotateEnd.set(n,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Be*this._rotateDelta.x/t.clientHeight),this._rotateUp(Be*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),o=.5*(e.pageX+t.x),n=.5*(e.pageY+t.y);this._panEnd.set(o,n)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),o=e.pageX-t.x,n=e.pageY-t.y,s=Math.sqrt(o*o+n*n);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const i=(e.pageX+t.x)*.5,l=(e.pageY+t.y)*.5;this._updateZoomParameters(i,l)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Se,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,o={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:o.deltaY*=16;break;case 2:o.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(o.deltaY*=10),o}}function Ol(a){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(a.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(a)&&(this._addPointer(a),a.pointerType==="touch"?this._onTouchStart(a):this._onMouseDown(a)))}function kl(a){this.enabled!==!1&&(a.pointerType==="touch"?this._onTouchMove(a):this._onMouseMove(a))}function Fl(a){switch(this._removePointer(a),this._pointers.length){case 0:this.domElement.releasePointerCapture(a.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Oi),this.state=$.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Hl(a){let e;switch(a.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ko.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(a),this.state=$.DOLLY;break;case ko.ROTATE:if(a.ctrlKey||a.metaKey||a.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(a),this.state=$.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(a),this.state=$.ROTATE}break;case ko.PAN:if(a.ctrlKey||a.metaKey||a.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(a),this.state=$.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(a),this.state=$.PAN}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(Rs)}function zl(a){switch(this.state){case $.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(a);break;case $.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(a);break;case $.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(a);break}}function Nl(a){this.enabled===!1||this.enableZoom===!1||this.state!==$.NONE||(a.preventDefault(),this.dispatchEvent(Rs),this._handleMouseWheel(this._customWheelEvent(a)),this.dispatchEvent(Oi))}function Bl(a){this.enabled!==!1&&this._handleKeyDown(a)}function Wl(a){switch(this._trackPointer(a),this._pointers.length){case 1:switch(this.touches.ONE){case Ro.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(a),this.state=$.TOUCH_ROTATE;break;case Ro.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(a),this.state=$.TOUCH_PAN;break;default:this.state=$.NONE}break;case 2:switch(this.touches.TWO){case Ro.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(a),this.state=$.TOUCH_DOLLY_PAN;break;case Ro.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(a),this.state=$.TOUCH_DOLLY_ROTATE;break;default:this.state=$.NONE}break;default:this.state=$.NONE}this.state!==$.NONE&&this.dispatchEvent(Rs)}function Vl(a){switch(this._trackPointer(a),this.state){case $.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(a),this.update();break;case $.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(a),this.update();break;case $.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(a),this.update();break;case $.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(a),this.update();break;default:this.state=$.NONE}}function Ul(a){this.enabled!==!1&&a.preventDefault()}function Xl(a){a.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Gl(a){a.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const{lerp:to}=ne,ke=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];for(let a=0;a<256;a++)ke[256+a]=ke[a];function Rn(a){return a*a*a*(a*(a*6-15)+10)}function Xt(a,e,t,o){const n=a&15,s=n<8?e:t,i=n<4?t:n==12||n==14?e:o;return((n&1)==0?s:-s)+((n&2)==0?i:-i)}class jl{noise(e,t,o){const n=Math.floor(e),s=Math.floor(t),i=Math.floor(o),l=n&255,r=s&255,u=i&255;e-=n,t-=s,o-=i;const c=e-1,d=t-1,h=o-1,p=Rn(e),f=Rn(t),g=Rn(o),v=ke[l]+r,S=ke[v]+u,M=ke[v+1]+u,y=ke[l+1]+r,b=ke[y]+u,T=ke[y+1]+u;return to(to(to(Xt(ke[S],e,t,o),Xt(ke[b],c,t,o),p),to(Xt(ke[M],e,d,o),Xt(ke[T],c,d,o),p),f),to(to(Xt(ke[S+1],e,t,h),Xt(ke[b+1],c,t,h),p),to(Xt(ke[M+1],e,d,h),Xt(ke[T+1],c,d,h),p),f),g)}}function ki(a={}){const{segments:e=34,normalMapPath:t="sand-normal.jpg",physicsWorld:o,groundMaterial:n,shape:s={},waterLevel:i=-2.87}=a,l=s.size||18,r={scaleX:s.scaleX||1,scaleY:s.scaleY||1,tilt:s.tilt||{angle:0,amount:0},bay:s.bay||{angle:0,depth:0,width:0},irregularity:s.irregularity||1,distortion:s.distortion||{frequency:.5,amplitude:.3,randomness:.2},turbulence:s.turbulence||null,islandRadius:s.islandRadius||l*.365},u=r.islandRadius,c=u+u*0,d=u+u*.26,h=u+u*.75,p=5.8,f=-4.6,g=512,v=new jn(l,l,e,e),S=v.attributes.position;function M(P,O){const k=Math.atan2(O,P),U=Math.sqrt(P*P+O*O),q=Math.sin(k*3+U*.5)*.4,j=Math.sin(k*5-U*.3)*.25,se=Math.sin(k*7+U*.7)*.2;return(q+j+se)*r.irregularity}function y(P,O){const k=P/r.scaleX,U=O/r.scaleY;let q=Math.sqrt(k*k+U*U);if(r.bay.depth>0){const j=Math.atan2(O,P),se=r.bay.angle,Q=r.bay.width;let W=Math.abs(j-se);if(W>Math.PI&&(W=2*Math.PI-W),W<Q){const G=Math.cos(W/Q*Math.PI/2);q+=r.bay.depth*G}}return q}function b(P,O){if(r.tilt.amount===0)return 0;const k=Math.atan2(O,P),U=r.tilt.angle;return Math.cos(k-U)*r.tilt.amount}function T(P,O){if(!r.turbulence)return 0;const{strength:k=3,scale:U=.3,octaves:q=3}=r.turbulence;let j=0,se=k,Q=U,W=0;for(let G=0;G<q;G++){const Z=Math.sin(P*Q+G*10)*Math.cos(O*Q+G*5),le=Math.sin((P+O)*Q*1.3+G*7),_=Math.cos((P-O)*Q*.7+G*3),me=(Z+le*.5+_*.3)*se;j+=me,W+=se,se*=.5,Q*=2}return j/W*k}for(let P=0;P<S.count;P++){const O=S.getX(P),k=S.getY(P),U=S.getZ(P),q=y(O,k),j=M(O,k)*1.5,se=u+j,Q=c+j*.8,W=d+j*.6,G=h+j*.4,Z=r.distortion,le=.51+Math.sin(O*Z.frequency)*Math.cos(k*Z.frequency*1.04)*Z.amplitude+Math.random()*Z.randomness;let _;if(q<se)_=le;else if(q<Q){const Oe=(q-se)/(Q-se),tt=Oe*Oe*(3-2*Oe);_=le*(1-tt*.4)}else if(q<W){const Oe=(q-Q)/(W-Q),tt=Oe*Oe*(3-2*Oe);_=le*.6-tt*3.5}else if(q<G){const Oe=le*.6-3.5,tt=(q-W)/(G-W),ia=tt*tt*(3-2*tt);_=Oe-ia*(63+Oe)}else _=-63;_+=b(O,k),q<W&&(_+=T(O,k));const me=l/2,fe=Math.abs(O)/me,pe=Math.abs(k)/me,ve=Math.max(fe,pe),Dt=.85,sa=1;if(ve>Dt&&_>i-2){const Oe=(ve-Dt)/(sa-Dt),tt=Oe*Oe*(3-2*Oe),ia=i-2;_=Math.min(_,_*(1-tt)+ia*tt)}S.setZ(P,U+_)}S.needsUpdate=!0,v.computeVertexNormals();function A(P){const k=P.attributes.position,U=P.attributes.uv,q=P.index,j=e+1,se=[],Q=[],W=[];for(let _=0;_<k.count;_++)se.push(k.getX(_),k.getY(_),k.getZ(_)),Q.push(U.getX(_),U.getY(_));for(let _=0;_<q.count;_++)W.push(q.getX(_));const G=k.count;for(let _=0;_<k.count;_++)se.push(k.getX(_),k.getY(_),-63),Q.push(U.getX(_),U.getY(_));function Z(_,me){return _*j+me}for(let _=0;_<e;_++){const me=Z(0,_),fe=Z(0,_+1),pe=me+G,ve=fe+G;W.push(me,fe,pe),W.push(fe,ve,pe)}for(let _=0;_<e;_++){const me=Z(e,_),fe=Z(e,_+1),pe=me+G,ve=fe+G;W.push(me,pe,fe),W.push(fe,pe,ve)}for(let _=0;_<e;_++){const me=Z(_,0),fe=Z(_+1,0),pe=me+G,ve=fe+G;W.push(me,pe,fe),W.push(fe,pe,ve)}for(let _=0;_<e;_++){const me=Z(_,e),fe=Z(_+1,e),pe=me+G,ve=fe+G;W.push(me,fe,pe),W.push(fe,ve,pe)}const le=new yn;return le.setAttribute("position",new ro(new Float32Array(se),3)),le.setAttribute("uv",new ro(new Float32Array(Q),2)),le.setIndex(W),le.computeVertexNormals(),le}const L=A(v);v.dispose();const I=L,H=I.attributes.position;function C(P,O){const k=y(P,O),U=M(P,O)*1.5,q=u+U,j=c+U*.8,se=d+U*.6,Q=h+U*.4,W=.51+Math.sin(P*.5)*Math.cos(O*.52)*.3;let G;if(k<q)G=W;else if(k<j){const Z=(k-q)/(j-q),le=Z*Z*(3-2*Z);G=W*(1-le*.4)}else if(k<se){const Z=(k-j)/(se-j),le=Z*Z*(3-2*Z);G=W*.6-le*3.5}else if(k<Q){const Z=W*.6-3.5,le=(k-se)/(Q-se),_=le*le*(3-2*le);G=Z-_*(63+Z)}else G=-63;return G+=b(P,O),G}function B(){const P=(Math.random()-.5)*(l*.8),O=(Math.random()-.5)*(l*.8);return{x:P,z:O}}function de(){const P=[],O=[];for(let U=0;U<H.count;U++)P.push(H.getX(U),H.getY(U),H.getZ(U));const k=I.index;for(let U=0;U<k.count;U++)O.push(k.getX(U));return new Pl(P,O)}const Y=de(),K=new ta({mass:0,material:n});K.addShape(Y),K.quaternion.setFromEuler(-Math.PI/2,0,0),o.addBody(K);function Re(){o.removeBody(K);const P=de();K.shapes=[P],K.updateBoundingRadius(),K.updateAABB(),o.addBody(K)}let oe=null;function he(P,O){const q=H.count/2;for(let j=0;j<q;j++){const se=H.getX(j),Q=H.getY(j),W=se-P.x,G=Q-P.y,Z=W*W+G*G;if(Z<4){const _=1-Math.sqrt(Z)/2,fe=H.getZ(j)+O*_*.02,pe=Math.max(f,Math.min(p,fe));H.setZ(j,pe)}}H.needsUpdate=!0,I.computeVertexNormals(),I.computeBoundingBox(),oe&&xo(oe)}const it=new xi().load(t);it.wrapS=va,it.wrapT=va,it.repeat.set(16,16);const Qe=new lt({uniforms:Mi.merge([Hr.lights,{normalMap:{value:it},midLowColor:{value:new w(.9,.6,.2)},midColor:{value:new w(1,.8,.3)},midHighColor:{value:new w(1,.6,.4)},uFogColor:{value:new re(943004)},uFogStart:{value:-18.87},uFogEnd:{value:-2.87},depthTest:!0,uTime:{value:0},uWaterLevel:{value:i},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uFoamDepth:{value:.35},uFoamEnabled:{value:!1},uWaterMeshOffset:{value:new Se(0,0)},uWaterMeshPosition:{value:new Se(0,0)},uWaterCurvature:{value:2e-5},uWetnessMap:{value:null},uWetnessMapSize:{value:g},uUseWetnessMap:{value:!1}}]),lights:!0,vertexShader:`
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
    `,transparent:!0,depthWrite:!0}),Tt=new ge(I,Qe);Tt.rotation.x=-Math.PI/2,Tt.castShadow=!0,Tt.receiveShadow=!0,Tt.renderOrder=.5,Tt.customDepthMaterial=new zr({depthPacking:Nr});const To=512,xt=new _n(To,To,{minFilter:rt,magFilter:rt,format:Cn,type:In}),Vt=new Zn(-l/2,l/2,l/2,-l/2,.1,100);Vt.position.set(0,50,0),Vt.lookAt(0,0,0),Vt.updateProjectionMatrix();const Qt=new lt({vertexShader:`
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
    `,uniforms:{uMinHeight:{value:f},uMaxHeight:{value:p}},side:dt}),Pt=new ge(I,Qt);Pt.rotation.x=-Math.PI/2;function xo(P){if(!P){console.warn("updateHeightmapTexture: renderer not provided");return}const O=P.getRenderTarget();P.setRenderTarget(xt),P.render(Pt,Vt),P.setRenderTarget(O)}const Po=new _n(g,g,{minFilter:rt,magFilter:rt,format:Cn,type:In}),_e=new _n(g,g,{minFilter:rt,magFilter:rt,format:Cn,type:In});let Et=Po,J=_e;const et=new jn(2,2),Ut=new Zn(-1,1,1,-1,0,1),Ie=new lt({uniforms:{uHeightmap:{value:xt.texture},uPreviousWetness:{value:null},uWaterLevel:{value:i},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uTime:{value:0},uDecayRate:{value:.98},uMinHeight:{value:f},uMaxHeight:{value:p},uTerrainSize:{value:l},uMeshOffset:{value:new Se(0,0)},uCurvature:{value:2e-5}},vertexShader:`
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
    `}),na=new ge(et,Ie);function Eo(P,O,k){if(!P||!O)return;Ie.uniforms.uWaterLevel.value=O.uniforms.uWaterLevel?.value??i,Ie.uniforms.uWaveAmplitude.value=O.uniforms.uWaveAmplitude?.value??.26,Ie.uniforms.uWaveFrequency.value=O.uniforms.uWaveFrequency?.value??4.2,Ie.uniforms.uWaveHeightMultiplier.value=O.uniforms.uWaveHeightMultiplier?.value??4.13,Ie.uniforms.uMeshOffset.value.copy(O.uniforms.uMeshOffset?.value??new Se(0,0)),Ie.uniforms.uCurvature.value=O.uniforms.uCurvature?.value??2e-5,Ie.uniforms.uTime.value=k,Ie.uniforms.uPreviousWetness.value=J.texture;const U=P.getRenderTarget();P.setRenderTarget(Et),P.render(na,Ut),P.setRenderTarget(U);const q=Et;Et=J,J=q}return{mesh:Tt,geometry:I,material:Qe,body:K,size:l,getHeightAt:C,randomPosition:B,sculpt:he,updatePhysics:Re,simpleNoise:M,config:{size:l,segments:e,islandRadius:u,falloffStart:c,falloffEnd:d,fanOutEnd:h,maxHeight:p,minDepth:f},setColors(P={}){P.midLow&&Qe.uniforms.midLowColor.value.copy(P.midLow),P.mid&&Qe.uniforms.midColor.value.copy(P.mid),P.midHigh&&Qe.uniforms.midHighColor.value.copy(P.midHigh)},heightmap:{renderTarget:xt,texture:xt.texture,camera:Vt,mesh:Pt,update:xo,size:To,worldSize:l,minHeight:f,maxHeight:p},setRenderer(P){oe=P,P&&xo(P)},wetnessMap:{texture:()=>J.texture,update:Eo,size:g,worldSize:l,setDecayRate(P){Ie.uniforms.uDecayRate.value=P},dispose(){Po.dispose(),_e.dispose(),Ie.dispose(),et.dispose()}},dispose(){xt&&xt.dispose(),Pt&&(Pt.geometry.dispose(),Pt.material.dispose()),Po.dispose(),_e.dispose(),Ie.dispose(),et.dispose()}}}function Zl(a,e,t,o=0,n=0){const r=a-o,u=e-n;function c(v,S){const M=v*3127.1+S*31.7;return Math.sin(M)*43758.5453%1}function d(v,S){const M=Math.floor(v),y=Math.floor(S),b=v-M,T=S-y,A=b*b*b*(b*(b*6-15)+10),L=T*T*T*(T*(T*6-15)+10),I=c(M,y),H=c(M+1,y),C=c(M,y+1),B=c(M+1,y+1),de=I*(1-A)+H*A,Y=C*(1-A)+B*A;return de*(1-L)+Y*L}function h(v,S){let M=.212,y=.26,b=4.2;for(let T=0;T<2;T++)M+=y*d(v*b,S*b),b*=2.4,y*=.09;return M}const p=h(r*.15+t*.08,u*.15+t*.15),f=h(r*.08-t*.08,u*.08-t*.12);return(p*.5+f*.5-.5)*4.13}function Fi(a={}){const{terrainSize:e,waterLevel:t=-2.87}=a,o=1100,n=new jn(o,o,65,65),s=o-550,i=new lt({transparent:!0,side:dt,depthWrite:!1,uniforms:{uTime:{value:0},uWaterColor:{value:new re(43212)},uShallowColor:{value:new re(6740463)},uShineColor:{value:new re(14531583)},fogColor:{value:new re(10541296)},fogNear:{value:180},fogFar:{value:400},uCurvature:{value:2e-5},uClipRadius:{value:s},uWaveAmplitude:{value:.286},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uMeshOffset:{value:new Se(0,0)},uTerrainWidthX:{value:18},uTerrainWidthZ:{value:18},uTerrainHeight:{value:.15},uFoamEnabled:{value:!0},uWaterLevel:{value:t},uTerrainScaleX:{value:1},uTerrainScaleY:{value:1},uTerrainIrregularity:{value:1},uTerrainBayAngle:{value:0},uTerrainBayDepth:{value:0},uTerrainBayWidth:{value:0},uIslandGroupOffset:{value:new Se(0,0)},uFoamHeightOffset:{value:-.363},uUseHeightmap:{value:!1},uTerrainHeightmap:{value:null},uHeightmapWorldSize:{value:18},uHeightmapMinHeight:{value:-4.6},uHeightmapMaxHeight:{value:5.8}},vertexShader:`
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
    `}),l=new ge(n,i);l.rotation.x=-Math.PI/2,l.position.y=t,l.receiveShadow=!0,l.renderOrder=1;const r=new _s(s,26,8,0,Math.PI*2,Math.PI/2,Math.PI/2),u=new lt({side:bi,transparent:!0,depthWrite:!0,uniforms:{uDeepColor:{value:new re(9549)},uShallowColor:{value:new re(4500687)},fogColor:{value:new re(10541296)},fogNear:{value:260},fogFar:{value:420}},vertexShader:`
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
        float distFromCenter = length(vPosition.xz) / ${s.toFixed(1)};
        vec3 color = mix(uDeepColor, uShallowColor, distFromCenter);

        // Normalize vertical position: 0 at bottom, 1 at top
        float normalizedHeight = (vVerticalPos + ${s.toFixed(1)}) / ${s.toFixed(1)};

        // Fade to fog color starting closer to surface
        float heightFade = smoothstep(0.75, 0.9, normalizedHeight);
        color = mix(color, fogColor, heightFade);

        // Fade to transparent at the very top to avoid hard line
        float alpha = mix(0.95, 0.0, smoothstep(0.9, 1.0, normalizedHeight));

        gl_FragColor = vec4(color, alpha);
      }
    `}),c=new ge(r,u);return c.position.y=40.88,c.renderOrder=0,{mesh:l,hemisphereMesh:c,material:i,update(d){i.uniforms.uTime.value=d},setColors(d={}){d.water!==void 0&&i.uniforms.uWaterColor.value.set(d.water),d.shallow!==void 0&&i.uniforms.uShallowColor.value.set(d.shallow),d.shine!==void 0&&i.uniforms.uShineColor.value.set(d.shine)},setWaveChoppiness(d,h){d!==void 0&&(i.uniforms.uWaveHeightMultiplier.value=d),h!==void 0&&(i.uniforms.uWaveAmplitude.value=h)}}}function Hi(a={}){const{scene:e,waterLevel:t=-2.87,maxRipples:o=50}=a,n=[],s=[];let i=0;const l=new Ia(.1,.2,32),r=()=>new lt({transparent:!0,side:dt,depthWrite:!1,uniforms:{uProgress:{value:0},uRadius:{value:1},uColor:{value:new re(16777215)}},vertexShader:`
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
      `});for(let h=0;h<o;h++){const p=r(),f=new ge(l,p);f.rotation.x=-Math.PI/2,f.visible=!1,f.renderOrder=2,e.add(f),s.push(f)}function u(h,p,f={}){const{size:g=1,speed:v=1,color:S=new re(16777215),y:M=null}=f;let y=s[i];if(i=(i+1)%o,!y)return;if(y.visible){const L=n.findIndex(I=>I.mesh===y);L!==-1&&n.splice(L,1)}const b=M!==null?M:t-.685;y.position.set(h,b,p),y.visible=!0,y.material.uniforms.uProgress.value=.0182,y.material.uniforms.uRadius.value=g,y.material.uniforms.uColor.value.copy(S);const T=2*g;y.scale.set(T,T,1);const A={mesh:y,progress:.114,speed:v*.4,maxScale:T*3.5,baseScale:T};n.push(A)}function c(h){for(let p=n.length-1;p>=0;p--){const f=n[p];f.progress+=h*f.speed,f.mesh.material.uniforms.uProgress.value=f.progress;const g=f.baseScale+(f.maxScale-f.baseScale)*f.progress;f.mesh.scale.set(g,g,1),f.progress>=1&&(f.mesh.visible=!1,n.splice(p,1))}}function d(){s.forEach(h=>{e.remove(h),h.material.dispose()}),l.dispose(),n.length=0,s.length=0}return{spawnRipple:u,update:c,dispose:d}}function ql(){const e=new Uint8Array(2097152);let t=0;const o=.05,n=new jl,s=new w;for(let l=0;l<128;l++)for(let r=0;r<128;r++)for(let u=0;u<128;u++){const c=1-s.set(u,r,l).subScalar(64).divideScalar(128).length();e[t]=(168+127.6*n.noise(u*o/1.53,r*o,l*o/1.51))*c*c,t++}const i=new Br(e,128,128,128);return i.format=Wr,i.minFilter=rt,i.magFilter=rt,i.unpackAlignment=1,i.needsUpdate=!0,i}function Fo(a={}){const{startX:e,startZ:t,endX:o,endZ:n,cloudHeight:s=13.2,cloudTexture:i,baseOpacity:l=.43,rainCount:r=100}=a,u=new Kt,c=`
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
  `,h=new Ti(15,8,15),p=new Vr({glslVersion:Ur,uniforms:{base:{value:new re(7965344)},map:{value:i},cameraPos:{value:new w},threshold:{value:.25},opacity:{value:0},range:{value:.08},steps:{value:40},frame:{value:0},textureRotation:{value:0}},vertexShader:c,fragmentShader:d,side:dt,transparent:!0,depthWrite:!1,depthTest:!1}),f=new ge(h,p);f.position.y=s,f.scale.set(11.11,6.12,8.3),f.visible=!1,f.renderOrder=6,u.add(f);const g=new yn,v=new Float32Array(r*3),S=[],M=.8,y=.3;for(let A=0;A<r;A++){const L=Math.random()*Math.PI*2,I=Math.random()*3.2;v[A*3]=Math.cos(L)*I,v[A*3+1]=s-Math.random()*4,v[A*3+2]=Math.sin(L)*I,S.push({initialY:v[A*3+1],initialX:v[A*3],initialZ:v[A*3+2],speed:2+Math.random()*3})}g.setAttribute("position",new ro(v,3));const b=new Is({color:7258367,size:.18,transparent:!0,opacity:0,blending:Pi,depthWrite:!1,depthTest:!0}),T=new Cs(g,b);return T.renderOrder=5,u.add(T),u.position.set(e,0,t),u.userData={cloud:f,cloudMaterial:p,rainParticles:T,rainVelocities:S,windDriftX:M,windDriftZ:y,creationTime:Date.now(),startPos:{x:e,z:t},endPos:{x:o,z:n},baseOpacity:l,drizzleSound:null},u}function $n(a,e,t=0){const{cloudMaterial:o}=a.userData;o.uniforms.cameraPos.value.copy(e.position),o.uniforms.frame.value++,o.uniforms.textureRotation.value+=t*.3;const n=o.uniforms.frame.value*.02;o.uniforms.steps.value=50+Math.sin(n)*15}function Jn(a,e){const{rainParticles:t,rainVelocities:o,windDriftX:n,windDriftZ:s}=a.userData;if(t.material.opacity<.01)return;const i=t.geometry.attributes.position.array;for(let l=0;l<o.length;l++){const r=o[l];i[l*3+1]-=r.speed*e,i[l*3]+=n*e,i[l*3+2]+=s*e,i[l*3+1]<.1&&(i[l*3+1]=r.initialY,i[l*3]=r.initialX,i[l*3+2]=r.initialZ)}t.geometry.attributes.position.needsUpdate=!0}function Ua(a,e){const{rainParticles:t}=a.userData;t.material.opacity=Math.max(0,Math.min(1,e))}function Ks(a,e){if(e===Xr)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),a;if(e===qn||e===Ei){let t=a.getIndex();if(t===null){const i=[],l=a.getAttribute("position");if(l!==void 0){for(let r=0;r<l.count;r++)i.push(r);a.setIndex(i),t=a.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),a}const o=t.count-2,n=[];if(e===qn)for(let i=1;i<=o;i++)n.push(t.getX(0)),n.push(t.getX(i)),n.push(t.getX(i+1));else for(let i=0;i<o;i++)i%2===0?(n.push(t.getX(i)),n.push(t.getX(i+1)),n.push(t.getX(i+2))):(n.push(t.getX(i+2)),n.push(t.getX(i+1)),n.push(t.getX(i)));n.length/3!==o&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=a.clone();return s.setIndex(n),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),a}class $e extends Gr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ql(t)}),this.register(function(t){return new ec(t)}),this.register(function(t){return new cc(t)}),this.register(function(t){return new uc(t)}),this.register(function(t){return new dc(t)}),this.register(function(t){return new oc(t)}),this.register(function(t){return new ac(t)}),this.register(function(t){return new nc(t)}),this.register(function(t){return new sc(t)}),this.register(function(t){return new Jl(t)}),this.register(function(t){return new ic(t)}),this.register(function(t){return new tc(t)}),this.register(function(t){return new lc(t)}),this.register(function(t){return new rc(t)}),this.register(function(t){return new Kl(t)}),this.register(function(t){return new hc(t)}),this.register(function(t){return new mc(t)})}load(e,t,o,n){const s=this;let i;if(this.resourcePath!=="")i=this.resourcePath;else if(this.path!==""){const u=ha.extractUrlBase(e);i=ha.resolveURL(u,this.path)}else i=ha.extractUrlBase(e);this.manager.itemStart(e);const l=function(u){n?n(u):console.error(u),s.manager.itemError(e),s.manager.itemEnd(e)},r=new Di(this.manager);r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,function(u){try{s.parse(u,i,function(c){t(c),s.manager.itemEnd(e)},l)}catch(c){l(c)}},o,l)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,o,n){let s;const i={},l={},r=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(r.decode(new Uint8Array(e,0,4))===zi){try{i[X.KHR_BINARY_GLTF]=new fc(e)}catch(d){n&&n(d);return}s=JSON.parse(i[X.KHR_BINARY_GLTF].content)}else s=JSON.parse(r.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){n&&n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const u=new Dc(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});u.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){const d=this.pluginCallbacks[c](u);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),l[d.name]=d,i[d.name]=!0}if(s.extensionsUsed)for(let c=0;c<s.extensionsUsed.length;++c){const d=s.extensionsUsed[c],h=s.extensionsRequired||[];switch(d){case X.KHR_MATERIALS_UNLIT:i[d]=new $l;break;case X.KHR_DRACO_MESH_COMPRESSION:i[d]=new pc(s,this.dracoLoader);break;case X.KHR_TEXTURE_TRANSFORM:i[d]=new gc;break;case X.KHR_MESH_QUANTIZATION:i[d]=new vc;break;default:h.indexOf(d)>=0&&l[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}u.setExtensions(i),u.setPlugins(l),u.parse(o,n)}parseAsync(e,t){const o=this;return new Promise(function(n,s){o.parse(e,t,n,s)})}}function Yl(){let a={};return{get:function(e){return a[e]},add:function(e,t){a[e]=t},remove:function(e){delete a[e]},removeAll:function(){a={}}}}const X={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Kl{constructor(e){this.parser=e,this.name=X.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let o=0,n=t.length;o<n;o++){const s=t[o];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,o="light:"+e;let n=t.cache.get(o);if(n)return n;const s=t.json,r=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let u;const c=new re(16777215);r.color!==void 0&&c.setRGB(r.color[0],r.color[1],r.color[2],Nt);const d=r.range!==void 0?r.range:0;switch(r.type){case"directional":u=new As(c),u.target.position.set(0,0,-1),u.add(u.target);break;case"point":u=new Zr(c),u.distance=d;break;case"spot":u=new jr(c),u.distance=d,r.spot=r.spot||{},r.spot.innerConeAngle=r.spot.innerConeAngle!==void 0?r.spot.innerConeAngle:0,r.spot.outerConeAngle=r.spot.outerConeAngle!==void 0?r.spot.outerConeAngle:Math.PI/4,u.angle=r.spot.outerConeAngle,u.penumbra=1-r.spot.innerConeAngle/r.spot.outerConeAngle,u.target.position.set(0,0,-1),u.add(u.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+r.type)}return u.position.set(0,0,0),ht(u,r),r.intensity!==void 0&&(u.intensity=r.intensity),u.name=t.createUniqueName(r.name||"light_"+e),n=Promise.resolve(u),t.cache.add(o,n),n}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,o=this.parser,s=o.json.nodes[e],l=(s.extensions&&s.extensions[this.name]||{}).light;return l===void 0?null:this._loadLight(l).then(function(r){return o._getNodeRef(t.cache,l,r)})}}class $l{constructor(){this.name=X.KHR_MATERIALS_UNLIT}getMaterialType(){return Lt}extendParams(e,t,o){const n=[];e.color=new re(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const i=s.baseColorFactor;e.color.setRGB(i[0],i[1],i[2],Nt),e.opacity=i[3]}s.baseColorTexture!==void 0&&n.push(o.assignTexture(e,"map",s.baseColorTexture,ya))}return Promise.all(n)}}class Jl{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=n.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class Ql{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],i=n.extensions[this.name];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(o.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(o.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(o.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){const l=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Se(l,l)}return Promise.all(s)}}class ec{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_DISPERSION}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=n.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class tc{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],i=n.extensions[this.name];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(o.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(o.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}}class oc{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_SHEEN}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new re(0,0,0),t.sheenRoughness=0,t.sheen=1;const i=n.extensions[this.name];if(i.sheenColorFactor!==void 0){const l=i.sheenColorFactor;t.sheenColor.setRGB(l[0],l[1],l[2],Nt)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(o.assignTexture(t,"sheenColorMap",i.sheenColorTexture,ya)),i.sheenRoughnessTexture!==void 0&&s.push(o.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}}class ac{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],i=n.extensions[this.name];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(o.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}}class nc{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_VOLUME}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],i=n.extensions[this.name];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(o.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;const l=i.attenuationColor||[1,1,1];return t.attenuationColor=new re().setRGB(l[0],l[1],l[2],Nt),Promise.all(s)}}class sc{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_IOR}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const n=this.parser.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=n.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class ic{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_SPECULAR}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],i=n.extensions[this.name];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(o.assignTexture(t,"specularIntensityMap",i.specularTexture));const l=i.specularColorFactor||[1,1,1];return t.specularColor=new re().setRGB(l[0],l[1],l[2],Nt),i.specularColorTexture!==void 0&&s.push(o.assignTexture(t,"specularColorMap",i.specularColorTexture,ya)),Promise.all(s)}}class rc{constructor(e){this.parser=e,this.name=X.EXT_MATERIALS_BUMP}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],i=n.extensions[this.name];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(o.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}}class lc{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const o=this.parser.json.materials[e];return!o.extensions||!o.extensions[this.name]?null:bt}extendMaterialParams(e,t){const o=this.parser,n=o.json.materials[e];if(!n.extensions||!n.extensions[this.name])return Promise.resolve();const s=[],i=n.extensions[this.name];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(o.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}}class cc{constructor(e){this.parser=e,this.name=X.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,o=t.json,n=o.textures[e];if(!n.extensions||!n.extensions[this.name])return null;const s=n.extensions[this.name],i=t.options.ktx2Loader;if(!i){if(o.extensionsRequired&&o.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,i)}}class uc{constructor(e){this.parser=e,this.name=X.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,o=this.parser,n=o.json,s=n.textures[e];if(!s.extensions||!s.extensions[t])return null;const i=s.extensions[t],l=n.images[i.source];let r=o.textureLoader;if(l.uri){const u=o.options.manager.getHandler(l.uri);u!==null&&(r=u)}return o.loadTextureImage(e,i.source,r)}}class dc{constructor(e){this.parser=e,this.name=X.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,o=this.parser,n=o.json,s=n.textures[e];if(!s.extensions||!s.extensions[t])return null;const i=s.extensions[t],l=n.images[i.source];let r=o.textureLoader;if(l.uri){const u=o.options.manager.getHandler(l.uri);u!==null&&(r=u)}return o.loadTextureImage(e,i.source,r)}}class hc{constructor(e){this.name=X.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,o=t.bufferViews[e];if(o.extensions&&o.extensions[this.name]){const n=o.extensions[this.name],s=this.parser.getDependency("buffer",n.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(l){const r=n.byteOffset||0,u=n.byteLength||0,c=n.count,d=n.byteStride,h=new Uint8Array(l,r,u);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(c,d,h,n.mode,n.filter).then(function(p){return p.buffer}):i.ready.then(function(){const p=new ArrayBuffer(c*d);return i.decodeGltfBuffer(new Uint8Array(p),c,d,h,n.mode,n.filter),p})})}else return null}}class mc{constructor(e){this.name=X.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,o=t.nodes[e];if(!o.extensions||!o.extensions[this.name]||o.mesh===void 0)return null;const n=t.meshes[o.mesh];for(const u of n.primitives)if(u.mode!==at.TRIANGLES&&u.mode!==at.TRIANGLE_STRIP&&u.mode!==at.TRIANGLE_FAN&&u.mode!==void 0)return null;const i=o.extensions[this.name].attributes,l=[],r={};for(const u in i)l.push(this.parser.getDependency("accessor",i[u]).then(c=>(r[u]=c,r[u])));return l.length<1?null:(l.push(this.parser.createNodeMesh(e)),Promise.all(l).then(u=>{const c=u.pop(),d=c.isGroup?c.children:[c],h=u[0].count,p=[];for(const f of d){const g=new Bt,v=new w,S=new zt,M=new w(1,1,1),y=new Yn(f.geometry,f.material,h);for(let b=0;b<h;b++)r.TRANSLATION&&v.fromBufferAttribute(r.TRANSLATION,b),r.ROTATION&&S.fromBufferAttribute(r.ROTATION,b),r.SCALE&&M.fromBufferAttribute(r.SCALE,b),y.setMatrixAt(b,g.compose(v,S,M));for(const b in r)if(b==="_COLOR_0"){const T=r[b];y.instanceColor=new Kn(T.array,T.itemSize,T.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&f.geometry.setAttribute(b,r[b]);_i.prototype.copy.call(y,f),this.parser.assignFinalMaterial(y),p.push(y)}return c.isGroup?(c.clear(),c.add(...p),c):p[0]}))}}const zi="glTF",ra=12,$s={JSON:1313821514,BIN:5130562};class fc{constructor(e){this.name=X.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,ra),o=new TextDecoder;if(this.header={magic:o.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==zi)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const n=this.header.length-ra,s=new DataView(e,ra);let i=0;for(;i<n;){const l=s.getUint32(i,!0);i+=4;const r=s.getUint32(i,!0);if(i+=4,r===$s.JSON){const u=new Uint8Array(e,ra+i,l);this.content=o.decode(u)}else if(r===$s.BIN){const u=ra+i;this.body=e.slice(u,u+l)}i+=l}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class pc{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=X.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const o=this.json,n=this.dracoLoader,s=e.extensions[this.name].bufferView,i=e.extensions[this.name].attributes,l={},r={},u={};for(const c in i){const d=Qn[c]||c.toLowerCase();l[d]=i[c]}for(const c in e.attributes){const d=Qn[c]||c.toLowerCase();if(i[c]!==void 0){const h=o.accessors[e.attributes[c]],p=Ho[h.componentType];u[d]=p.name,r[d]=h.normalized===!0}}return t.getDependency("bufferView",s).then(function(c){return new Promise(function(d,h){n.decodeDracoFile(c,function(p){for(const f in p.attributes){const g=p.attributes[f],v=r[f];v!==void 0&&(g.normalized=v)}d(p)},l,u,Nt,h)})})}}class gc{constructor(){this.name=X.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class vc{constructor(){this.name=X.KHR_MESH_QUANTIZATION}}class Ni extends ml{constructor(e,t,o,n){super(e,t,o,n)}copySampleValue_(e){const t=this.resultBuffer,o=this.sampleValues,n=this.valueSize,s=e*n*3+n;for(let i=0;i!==n;i++)t[i]=o[s+i];return t}interpolate_(e,t,o,n){const s=this.resultBuffer,i=this.sampleValues,l=this.valueSize,r=l*2,u=l*3,c=n-t,d=(o-t)/c,h=d*d,p=h*d,f=e*u,g=f-u,v=-2*p+3*h,S=p-h,M=1-v,y=S-h+d;for(let b=0;b!==l;b++){const T=i[g+b+l],A=i[g+b+r]*c,L=i[f+b+l],I=i[f+b]*c;s[b]=M*T+y*A+v*L+S*I}return s}}const yc=new zt;class wc extends Ni{interpolate_(e,t,o,n){const s=super.interpolate_(e,t,o,n);return yc.fromArray(s).normalize().toArray(s),s}}const at={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ho={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Js={9728:Ci,9729:rt,9984:Jr,9985:$r,9986:Kr,9987:Ii},Qs={33071:el,33648:Qr,10497:va},On={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Qn={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Gt={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Sc={CUBICSPLINE:void 0,LINEAR:Li,STEP:ul},kn={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function bc(a){return a.DefaultMaterial===void 0&&(a.DefaultMaterial=new wn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:hl})),a.DefaultMaterial}function oo(a,e,t){for(const o in t.extensions)a[o]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[o]=t.extensions[o])}function ht(a,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(a.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Mc(a,e,t){let o=!1,n=!1,s=!1;for(let u=0,c=e.length;u<c;u++){const d=e[u];if(d.POSITION!==void 0&&(o=!0),d.NORMAL!==void 0&&(n=!0),d.COLOR_0!==void 0&&(s=!0),o&&n&&s)break}if(!o&&!n&&!s)return Promise.resolve(a);const i=[],l=[],r=[];for(let u=0,c=e.length;u<c;u++){const d=e[u];if(o){const h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):a.attributes.position;i.push(h)}if(n){const h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):a.attributes.normal;l.push(h)}if(s){const h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):a.attributes.color;r.push(h)}}return Promise.all([Promise.all(i),Promise.all(l),Promise.all(r)]).then(function(u){const c=u[0],d=u[1],h=u[2];return o&&(a.morphAttributes.position=c),n&&(a.morphAttributes.normal=d),s&&(a.morphAttributes.color=h),a.morphTargetsRelative=!0,a})}function Tc(a,e){if(a.updateMorphTargets(),e.weights!==void 0)for(let t=0,o=e.weights.length;t<o;t++)a.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(a.morphTargetInfluences.length===t.length){a.morphTargetDictionary={};for(let o=0,n=t.length;o<n;o++)a.morphTargetDictionary[t[o]]=o}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function xc(a){let e;const t=a.extensions&&a.extensions[X.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Fn(t.attributes):e=a.indices+":"+Fn(a.attributes)+":"+a.mode,a.targets!==void 0)for(let o=0,n=a.targets.length;o<n;o++)e+=":"+Fn(a.targets[o]);return e}function Fn(a){let e="";const t=Object.keys(a).sort();for(let o=0,n=t.length;o<n;o++)e+=t[o]+":"+a[t[o]]+";";return e}function es(a){switch(a){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Pc(a){return a.search(/\.jpe?g($|\?)/i)>0||a.search(/^data\:image\/jpeg/)===0?"image/jpeg":a.search(/\.webp($|\?)/i)>0||a.search(/^data\:image\/webp/)===0?"image/webp":a.search(/\.ktx2($|\?)/i)>0||a.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Ec=new Bt;class Dc{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Yl,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let o=!1,n=-1,s=!1,i=-1;if(typeof navigator<"u"){const l=navigator.userAgent;o=/^((?!chrome|android).)*safari/i.test(l)===!0;const r=l.match(/Version\/(\d+)/);n=o&&r?parseInt(r[1],10):-1,s=l.indexOf("Firefox")>-1,i=s?l.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||o&&n<17||s&&i<98?this.textureLoader=new xi(this.options.manager):this.textureLoader=new qr(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Di(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const o=this,n=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(i){return i._markDefs&&i._markDefs()}),Promise.all(this._invokeAll(function(i){return i.beforeRoot&&i.beforeRoot()})).then(function(){return Promise.all([o.getDependencies("scene"),o.getDependencies("animation"),o.getDependencies("camera")])}).then(function(i){const l={scene:i[0][n.scene||0],scenes:i[0],animations:i[1],cameras:i[2],asset:n.asset,parser:o,userData:{}};return oo(s,l,n),ht(l,n),Promise.all(o._invokeAll(function(r){return r.afterRoot&&r.afterRoot(l)})).then(function(){for(const r of l.scenes)r.updateMatrixWorld();e(l)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],o=this.json.meshes||[];for(let n=0,s=t.length;n<s;n++){const i=t[n].joints;for(let l=0,r=i.length;l<r;l++)e[i[l]].isBone=!0}for(let n=0,s=e.length;n<s;n++){const i=e[n];i.mesh!==void 0&&(this._addNodeRef(this.meshCache,i.mesh),i.skin!==void 0&&(o[i.mesh].isSkinnedMesh=!0)),i.camera!==void 0&&this._addNodeRef(this.cameraCache,i.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,o){if(e.refs[t]<=1)return o;const n=o.clone(),s=(i,l)=>{const r=this.associations.get(i);r!=null&&this.associations.set(l,r);for(const[u,c]of i.children.entries())s(c,l.children[u])};return s(o,n),n.name+="_instance_"+e.uses[t]++,n}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let o=0;o<t.length;o++){const n=e(t[o]);if(n)return n}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const o=[];for(let n=0;n<t.length;n++){const s=e(t[n]);s&&o.push(s)}return o}getDependency(e,t){const o=e+":"+t;let n=this.cache.get(o);if(!n){switch(e){case"scene":n=this.loadScene(t);break;case"node":n=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":n=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":n=this.loadAccessor(t);break;case"bufferView":n=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":n=this.loadBuffer(t);break;case"material":n=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":n=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":n=this.loadSkin(t);break;case"animation":n=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":n=this.loadCamera(t);break;default:if(n=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!n)throw new Error("Unknown type: "+e);break}this.cache.add(o,n)}return n}getDependencies(e){let t=this.cache.get(e);if(!t){const o=this,n=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(n.map(function(s,i){return o.getDependency(e,i)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],o=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[X.KHR_BINARY_GLTF].body);const n=this.options;return new Promise(function(s,i){o.load(ha.resolveURL(t.uri,n.path),s,void 0,function(){i(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(o){const n=t.byteLength||0,s=t.byteOffset||0;return o.slice(s,s+n)})}loadAccessor(e){const t=this,o=this.json,n=this.json.accessors[e];if(n.bufferView===void 0&&n.sparse===void 0){const i=On[n.type],l=Ho[n.componentType],r=n.normalized===!0,u=new l(n.count*i);return Promise.resolve(new ro(u,i,r))}const s=[];return n.bufferView!==void 0?s.push(this.getDependency("bufferView",n.bufferView)):s.push(null),n.sparse!==void 0&&(s.push(this.getDependency("bufferView",n.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",n.sparse.values.bufferView))),Promise.all(s).then(function(i){const l=i[0],r=On[n.type],u=Ho[n.componentType],c=u.BYTES_PER_ELEMENT,d=c*r,h=n.byteOffset||0,p=n.bufferView!==void 0?o.bufferViews[n.bufferView].byteStride:void 0,f=n.normalized===!0;let g,v;if(p&&p!==d){const S=Math.floor(h/p),M="InterleavedBuffer:"+n.bufferView+":"+n.componentType+":"+S+":"+n.count;let y=t.cache.get(M);y||(g=new u(l,S*p,n.count*p/c),y=new Yr(g,p/c),t.cache.add(M,y)),v=new dl(y,r,h%p/c,f)}else l===null?g=new u(n.count*r):g=new u(l,h,n.count*r),v=new ro(g,r,f);if(n.sparse!==void 0){const S=On.SCALAR,M=Ho[n.sparse.indices.componentType],y=n.sparse.indices.byteOffset||0,b=n.sparse.values.byteOffset||0,T=new M(i[1],y,n.sparse.count*S),A=new u(i[2],b,n.sparse.count*r);l!==null&&(v=new ro(v.array.slice(),v.itemSize,v.normalized)),v.normalized=!1;for(let L=0,I=T.length;L<I;L++){const H=T[L];if(v.setX(H,A[L*r]),r>=2&&v.setY(H,A[L*r+1]),r>=3&&v.setZ(H,A[L*r+2]),r>=4&&v.setW(H,A[L*r+3]),r>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}v.normalized=f}return v})}loadTexture(e){const t=this.json,o=this.options,s=t.textures[e].source,i=t.images[s];let l=this.textureLoader;if(i.uri){const r=o.manager.getHandler(i.uri);r!==null&&(l=r)}return this.loadTextureImage(e,s,l)}loadTextureImage(e,t,o){const n=this,s=this.json,i=s.textures[e],l=s.images[t],r=(l.uri||l.bufferView)+":"+i.sampler;if(this.textureCache[r])return this.textureCache[r];const u=this.loadImageSource(t,o).then(function(c){c.flipY=!1,c.name=i.name||l.name||"",c.name===""&&typeof l.uri=="string"&&l.uri.startsWith("data:image/")===!1&&(c.name=l.uri);const h=(s.samplers||{})[i.sampler]||{};return c.magFilter=Js[h.magFilter]||rt,c.minFilter=Js[h.minFilter]||Ii,c.wrapS=Qs[h.wrapS]||va,c.wrapT=Qs[h.wrapT]||va,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==Ci&&c.minFilter!==rt,n.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[r]=u,u}loadImageSource(e,t){const o=this,n=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const i=n.images[e],l=self.URL||self.webkitURL;let r=i.uri||"",u=!1;if(i.bufferView!==void 0)r=o.getDependency("bufferView",i.bufferView).then(function(d){u=!0;const h=new Blob([d],{type:i.mimeType});return r=l.createObjectURL(h),r});else if(i.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const c=Promise.resolve(r).then(function(d){return new Promise(function(h,p){let f=h;t.isImageBitmapLoader===!0&&(f=function(g){const v=new Us(g);v.needsUpdate=!0,h(v)}),t.load(ha.resolveURL(d,s.path),f,void 0,p)})}).then(function(d){return u===!0&&l.revokeObjectURL(r),ht(d,i),d.userData.mimeType=i.mimeType||Pc(i.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",r),d});return this.sourceCache[e]=c,c}assignTexture(e,t,o,n){const s=this;return this.getDependency("texture",o.index).then(function(i){if(!i)return null;if(o.texCoord!==void 0&&o.texCoord>0&&(i=i.clone(),i.channel=o.texCoord),s.extensions[X.KHR_TEXTURE_TRANSFORM]){const l=o.extensions!==void 0?o.extensions[X.KHR_TEXTURE_TRANSFORM]:void 0;if(l){const r=s.associations.get(i);i=s.extensions[X.KHR_TEXTURE_TRANSFORM].extendTexture(i,l),s.associations.set(i,r)}}return n!==void 0&&(i.colorSpace=n),e[t]=i,i})}assignFinalMaterial(e){const t=e.geometry;let o=e.material;const n=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,i=t.attributes.normal===void 0;if(e.isPoints){const l="PointsMaterial:"+o.uuid;let r=this.cache.get(l);r||(r=new Is,An.prototype.copy.call(r,o),r.color.copy(o.color),r.map=o.map,r.sizeAttenuation=!1,this.cache.add(l,r)),o=r}else if(e.isLine){const l="LineBasicMaterial:"+o.uuid;let r=this.cache.get(l);r||(r=new tl,An.prototype.copy.call(r,o),r.color.copy(o.color),r.map=o.map,this.cache.add(l,r)),o=r}if(n||s||i){let l="ClonedMaterial:"+o.uuid+":";n&&(l+="derivative-tangents:"),s&&(l+="vertex-colors:"),i&&(l+="flat-shading:");let r=this.cache.get(l);r||(r=o.clone(),s&&(r.vertexColors=!0),i&&(r.flatShading=!0),n&&(r.normalScale&&(r.normalScale.y*=-1),r.clearcoatNormalScale&&(r.clearcoatNormalScale.y*=-1)),this.cache.add(l,r),this.associations.set(r,this.associations.get(o))),o=r}e.material=o}getMaterialType(){return wn}loadMaterial(e){const t=this,o=this.json,n=this.extensions,s=o.materials[e];let i;const l={},r=s.extensions||{},u=[];if(r[X.KHR_MATERIALS_UNLIT]){const d=n[X.KHR_MATERIALS_UNLIT];i=d.getMaterialType(),u.push(d.extendParams(l,s,t))}else{const d=s.pbrMetallicRoughness||{};if(l.color=new re(1,1,1),l.opacity=1,Array.isArray(d.baseColorFactor)){const h=d.baseColorFactor;l.color.setRGB(h[0],h[1],h[2],Nt),l.opacity=h[3]}d.baseColorTexture!==void 0&&u.push(t.assignTexture(l,"map",d.baseColorTexture,ya)),l.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,l.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(u.push(t.assignTexture(l,"metalnessMap",d.metallicRoughnessTexture)),u.push(t.assignTexture(l,"roughnessMap",d.metallicRoughnessTexture))),i=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),u.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,l)})))}s.doubleSided===!0&&(l.side=dt);const c=s.alphaMode||kn.OPAQUE;if(c===kn.BLEND?(l.transparent=!0,l.depthWrite=!1):(l.transparent=!1,c===kn.MASK&&(l.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&i!==Lt&&(u.push(t.assignTexture(l,"normalMap",s.normalTexture)),l.normalScale=new Se(1,1),s.normalTexture.scale!==void 0)){const d=s.normalTexture.scale;l.normalScale.set(d,d)}if(s.occlusionTexture!==void 0&&i!==Lt&&(u.push(t.assignTexture(l,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(l.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&i!==Lt){const d=s.emissiveFactor;l.emissive=new re().setRGB(d[0],d[1],d[2],Nt)}return s.emissiveTexture!==void 0&&i!==Lt&&u.push(t.assignTexture(l,"emissiveMap",s.emissiveTexture,ya)),Promise.all(u).then(function(){const d=new i(l);return s.name&&(d.name=s.name),ht(d,s),t.associations.set(d,{materials:e}),s.extensions&&oo(n,d,s),d})}createUniqueName(e){const t=ol.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,o=this.extensions,n=this.primitiveCache;function s(l){return o[X.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(l,t).then(function(r){return ei(r,l,t)})}const i=[];for(let l=0,r=e.length;l<r;l++){const u=e[l],c=xc(u),d=n[c];if(d)i.push(d.promise);else{let h;u.extensions&&u.extensions[X.KHR_DRACO_MESH_COMPRESSION]?h=s(u):h=ei(new yn,u,t),n[c]={primitive:u,promise:h},i.push(h)}}return Promise.all(i)}loadMesh(e){const t=this,o=this.json,n=this.extensions,s=o.meshes[e],i=s.primitives,l=[];for(let r=0,u=i.length;r<u;r++){const c=i[r].material===void 0?bc(this.cache):this.getDependency("material",i[r].material);l.push(c)}return l.push(t.loadGeometries(i)),Promise.all(l).then(function(r){const u=r.slice(0,r.length-1),c=r[r.length-1],d=[];for(let p=0,f=c.length;p<f;p++){const g=c[p],v=i[p];let S;const M=u[p];if(v.mode===at.TRIANGLES||v.mode===at.TRIANGLE_STRIP||v.mode===at.TRIANGLE_FAN||v.mode===void 0)S=s.isSkinnedMesh===!0?new al(g,M):new ge(g,M),S.isSkinnedMesh===!0&&S.normalizeSkinWeights(),v.mode===at.TRIANGLE_STRIP?S.geometry=Ks(S.geometry,Ei):v.mode===at.TRIANGLE_FAN&&(S.geometry=Ks(S.geometry,qn));else if(v.mode===at.LINES)S=new nl(g,M);else if(v.mode===at.LINE_STRIP)S=new sl(g,M);else if(v.mode===at.LINE_LOOP)S=new il(g,M);else if(v.mode===at.POINTS)S=new Cs(g,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+v.mode);Object.keys(S.geometry.morphAttributes).length>0&&Tc(S,s),S.name=t.createUniqueName(s.name||"mesh_"+e),ht(S,s),v.extensions&&oo(n,S,v),t.assignFinalMaterial(S),d.push(S)}for(let p=0,f=d.length;p<f;p++)t.associations.set(d[p],{meshes:e,primitives:p});if(d.length===1)return s.extensions&&oo(n,d[0],s),d[0];const h=new Kt;s.extensions&&oo(n,h,s),t.associations.set(h,{meshes:e});for(let p=0,f=d.length;p<f;p++)h.add(d[p]);return h})}loadCamera(e){let t;const o=this.json.cameras[e],n=o[o.type];if(!n){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return o.type==="perspective"?t=new Ai(ne.radToDeg(n.yfov),n.aspectRatio||1,n.znear||1,n.zfar||2e6):o.type==="orthographic"&&(t=new Zn(-n.xmag,n.xmag,n.ymag,-n.ymag,n.znear,n.zfar)),o.name&&(t.name=this.createUniqueName(o.name)),ht(t,o),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],o=[];for(let n=0,s=t.joints.length;n<s;n++)o.push(this._loadNodeShallow(t.joints[n]));return t.inverseBindMatrices!==void 0?o.push(this.getDependency("accessor",t.inverseBindMatrices)):o.push(null),Promise.all(o).then(function(n){const s=n.pop(),i=n,l=[],r=[];for(let u=0,c=i.length;u<c;u++){const d=i[u];if(d){l.push(d);const h=new Bt;s!==null&&h.fromArray(s.array,u*16),r.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[u])}return new rl(l,r)})}loadAnimation(e){const t=this.json,o=this,n=t.animations[e],s=n.name?n.name:"animation_"+e,i=[],l=[],r=[],u=[],c=[];for(let d=0,h=n.channels.length;d<h;d++){const p=n.channels[d],f=n.samplers[p.sampler],g=p.target,v=g.node,S=n.parameters!==void 0?n.parameters[f.input]:f.input,M=n.parameters!==void 0?n.parameters[f.output]:f.output;g.node!==void 0&&(i.push(this.getDependency("node",v)),l.push(this.getDependency("accessor",S)),r.push(this.getDependency("accessor",M)),u.push(f),c.push(g))}return Promise.all([Promise.all(i),Promise.all(l),Promise.all(r),Promise.all(u),Promise.all(c)]).then(function(d){const h=d[0],p=d[1],f=d[2],g=d[3],v=d[4],S=[];for(let y=0,b=h.length;y<b;y++){const T=h[y],A=p[y],L=f[y],I=g[y],H=v[y];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const C=o._createAnimationTracks(T,A,L,I,H);if(C)for(let B=0;B<C.length;B++)S.push(C[B])}const M=new ll(s,void 0,S);return ht(M,n),M})}createNodeMesh(e){const t=this.json,o=this,n=t.nodes[e];return n.mesh===void 0?null:o.getDependency("mesh",n.mesh).then(function(s){const i=o._getNodeRef(o.meshCache,n.mesh,s);return n.weights!==void 0&&i.traverse(function(l){if(l.isMesh)for(let r=0,u=n.weights.length;r<u;r++)l.morphTargetInfluences[r]=n.weights[r]}),i})}loadNode(e){const t=this.json,o=this,n=t.nodes[e],s=o._loadNodeShallow(e),i=[],l=n.children||[];for(let u=0,c=l.length;u<c;u++)i.push(o.getDependency("node",l[u]));const r=n.skin===void 0?Promise.resolve(null):o.getDependency("skin",n.skin);return Promise.all([s,Promise.all(i),r]).then(function(u){const c=u[0],d=u[1],h=u[2];h!==null&&c.traverse(function(p){p.isSkinnedMesh&&p.bind(h,Ec)});for(let p=0,f=d.length;p<f;p++)c.add(d[p]);return c})}_loadNodeShallow(e){const t=this.json,o=this.extensions,n=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],i=s.name?n.createUniqueName(s.name):"",l=[],r=n._invokeOne(function(u){return u.createNodeMesh&&u.createNodeMesh(e)});return r&&l.push(r),s.camera!==void 0&&l.push(n.getDependency("camera",s.camera).then(function(u){return n._getNodeRef(n.cameraCache,s.camera,u)})),n._invokeAll(function(u){return u.createNodeAttachment&&u.createNodeAttachment(e)}).forEach(function(u){l.push(u)}),this.nodeCache[e]=Promise.all(l).then(function(u){let c;if(s.isBone===!0?c=new cl:u.length>1?c=new Kt:u.length===1?c=u[0]:c=new _i,c!==u[0])for(let d=0,h=u.length;d<h;d++)c.add(u[d]);if(s.name&&(c.userData.name=s.name,c.name=i),ht(c,s),s.extensions&&oo(o,c,s),s.matrix!==void 0){const d=new Bt;d.fromArray(s.matrix),c.applyMatrix4(d)}else s.translation!==void 0&&c.position.fromArray(s.translation),s.rotation!==void 0&&c.quaternion.fromArray(s.rotation),s.scale!==void 0&&c.scale.fromArray(s.scale);if(!n.associations.has(c))n.associations.set(c,{});else if(s.mesh!==void 0&&n.meshCache.refs[s.mesh]>1){const d=n.associations.get(c);n.associations.set(c,{...d})}return n.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){const t=this.extensions,o=this.json.scenes[e],n=this,s=new Kt;o.name&&(s.name=n.createUniqueName(o.name)),ht(s,o),o.extensions&&oo(t,s,o);const i=o.nodes||[],l=[];for(let r=0,u=i.length;r<u;r++)l.push(n.getDependency("node",i[r]));return Promise.all(l).then(function(r){for(let c=0,d=r.length;c<d;c++)s.add(r[c]);const u=c=>{const d=new Map;for(const[h,p]of n.associations)(h instanceof An||h instanceof Us)&&d.set(h,p);return c.traverse(h=>{const p=n.associations.get(h);p!=null&&d.set(h,p)}),d};return n.associations=u(s),s})}_createAnimationTracks(e,t,o,n,s){const i=[],l=e.name?e.name:e.uuid,r=[];Gt[s.path]===Gt.weights?e.traverse(function(h){h.morphTargetInfluences&&r.push(h.name?h.name:h.uuid)}):r.push(l);let u;switch(Gt[s.path]){case Gt.weights:u=Gs;break;case Gt.rotation:u=js;break;case Gt.translation:case Gt.scale:u=Xs;break;default:switch(o.itemSize){case 1:u=Gs;break;case 2:case 3:default:u=Xs;break}break}const c=n.interpolation!==void 0?Sc[n.interpolation]:Li,d=this._getArrayFromAccessor(o);for(let h=0,p=r.length;h<p;h++){const f=new u(r[h]+"."+Gt[s.path],t.array,d,c);n.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(f),i.push(f)}return i}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const o=es(t.constructor),n=new Float32Array(t.length);for(let s=0,i=t.length;s<i;s++)n[s]=t[s]*o;t=n}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(o){const n=this instanceof js?wc:Ni;return new n(this.times,this.values,this.getValueSize()/3,o)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function _c(a,e,t){const o=e.attributes,n=new fl;if(o.POSITION!==void 0){const l=t.json.accessors[o.POSITION],r=l.min,u=l.max;if(r!==void 0&&u!==void 0){if(n.set(new w(r[0],r[1],r[2]),new w(u[0],u[1],u[2])),l.normalized){const c=es(Ho[l.componentType]);n.min.multiplyScalar(c),n.max.multiplyScalar(c)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const l=new w,r=new w;for(let u=0,c=s.length;u<c;u++){const d=s[u];if(d.POSITION!==void 0){const h=t.json.accessors[d.POSITION],p=h.min,f=h.max;if(p!==void 0&&f!==void 0){if(r.setX(Math.max(Math.abs(p[0]),Math.abs(f[0]))),r.setY(Math.max(Math.abs(p[1]),Math.abs(f[1]))),r.setZ(Math.max(Math.abs(p[2]),Math.abs(f[2]))),h.normalized){const g=es(Ho[h.componentType]);r.multiplyScalar(g)}l.max(r)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}n.expandByVector(l)}a.boundingBox=n;const i=new pl;n.getCenter(i.center),i.radius=n.min.distanceTo(n.max)/2,a.boundingSphere=i}function ei(a,e,t){const o=e.attributes,n=[];function s(i,l){return t.getDependency("accessor",i).then(function(r){a.setAttribute(l,r)})}for(const i in o){const l=Qn[i]||i.toLowerCase();l in a.attributes||n.push(s(o[i],l))}if(e.indices!==void 0&&!a.index){const i=t.getDependency("accessor",e.indices).then(function(l){a.setIndex(l)});n.push(i)}return Zs.workingColorSpace!==Nt&&"COLOR_0"in o&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Zs.workingColorSpace}" not supported.`),ht(a,e),_c(a,e,t),Promise.all(n).then(function(){return e.targets!==void 0?Mc(a,e.targets,t):a})}const Ic=Object.freeze(Object.defineProperty({__proto__:null,GLTFLoader:$e},Symbol.toStringTag,{value:"Module"}));function vo(a){const e=new Map,t=new Map,o=a.clone();return Bi(a,o,function(n,s){e.set(s,n),t.set(n,s)}),o.traverse(function(n){if(!n.isSkinnedMesh)return;const s=n,i=e.get(n),l=i.skeleton.bones;s.skeleton=i.skeleton.clone(),s.bindMatrix.copy(i.bindMatrix),s.skeleton.bones=l.map(function(r){return t.get(r)}),s.bind(s.skeleton,s.bindMatrix)}),o}function Bi(a,e,t){t(a,e);for(let o=0;o<a.children.length;o++)Bi(a.children[o],e.children[o],t)}const Ze={center:{x:13.5,y:-4.064,z:-1},radius:34,speed:.148,currentTime:0};function ts(a){const e=Ze.radius,t=1/(1+Math.sin(a)*Math.sin(a)),o=Ze.center.x+e*t*Math.cos(a),n=Ze.center.z+e*t*Math.sin(a)*Math.cos(a),s=Ze.center.y;return{x:o,y:s,z:n}}let Xe=null,lo=null;function Wi(a,e,t){new $e().load("./models/shark.glb",n=>{Xe=n.scene;const s=ts(0);Xe.position.set(s.x,s.y,s.z),Xe.scale.set(.16,.17,.18),Xe.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(Xe),n.animations&&n.animations.length>0&&(lo=new Ve(Xe),n.animations.forEach(i=>{lo.clipAction(i).play()}))},void 0,n=>{console.error("Error loading shark model:",n)})}function Cc(a){if(!Xe)return;Ze.currentTime+=a*Ze.speed;const e=ts(Ze.currentTime),t=ts(Ze.currentTime+.01),o=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Xe.position.set(e.x,e.y,e.z);const n=Math.atan2(o.x,o.z);Xe.rotation.y=n,lo&&lo.update(a)}function Ac(a){Xe&&(a.remove(Xe),Xe.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),Xe=null),lo&&(lo.stopAllAction(),lo=null),Ze.currentTime=0}let wa=null;const zo=[],Xa=[],Ga=[],Lc=106,Rc=2,so=280,Vi=1.85,Oc=28.2,Ui=30,kc=8,Fc=6,ti=18;let ma=0;const Hc=5;function Xi(a,e,t){new $e().load("./models/manta-ray.glb",n=>{wa=n.scene,Ga.push(...n.animations);for(let s=0;s<Ui;s++)Gi(a,!0,s);ma=0},void 0,n=>{console.error("Error loading manta ray model:",n)})}function Gi(a,e=!1,t=0){if(!wa)return;const o=vo(wa);o.traverse(i=>{i.isMesh&&(i.castShadow=!1,i.receiveShadow=!1)});const n=ne.randFloat(.12,.18);o.scale.set(n,n,n),o.rotation.y=Math.PI/2;let s;if(e){const i=t/Ui;s=-so/2+i*so}else s=-so/2-Math.random()*20;if(o.position.set(s,Ze.center.y-.5+ne.randFloatSpread(Vi),Ze.center.z+ne.randFloatSpread(30)),o.userData.baseY=o.position.y,o.userData.baseZ=o.position.z,o.userData.offset=Math.random()*10,o.userData.speed=Rc*ne.randFloat(.8,1.2),o.userData.avoidanceSide=o.position.z>=0?1:-1,e&&(o.userData.fadeTime=0,o.userData.isFading=!0,o.traverse(i=>{i.isMesh&&i.material&&(i.material.transparent=!0,i.material.opacity=0)})),a.add(o),zo.push(o),Ga.length>0){const i=new Ve(o);Ga.forEach(l=>i.clipAction(l).play()),Xa.push(i)}}function zc(a){Gi(a,!1,0)}function Nc(a,e){if(wa){ma+=a,zo.length<Lc&&ma>Oc*Math.random()&&(zc(e),ma=0);for(let t=0;t<zo.length;t++){const o=zo[t],n=o.userData.speed;if(o.userData.isFading){o.userData.fadeTime+=a;const r=Math.min(o.userData.fadeTime/kc,1);o.traverse(u=>{u.isMesh&&u.material&&(u.material.opacity=r)}),r>=1&&(o.userData.isFading=!1)}o.position.x+=n*a;const s=Math.abs(o.position.x);if(s<ti){const r=1-s/ti,c=r*r*(3-2*r)*Fc*o.userData.avoidanceSide;o.position.z=o.userData.baseZ+c;const d=6*r*(1-r),h=o.position.x<0?1:-1,p=d*.4*o.userData.avoidanceSide*h;o.rotation.z=p}else o.position.z=o.userData.baseZ,o.rotation.z=0;o.position.x>so/2+20&&(o.position.x=-so/2-Math.random()*20,o.position.y=Ze.center.y-.5+ne.randFloatSpread(Vi),o.position.z=Ze.center.z+ne.randFloatSpread(30),o.userData.baseY=o.position.y,o.userData.baseZ=o.position.z,o.userData.avoidanceSide=o.position.z>=0?1:-1);const i=(o.position.x+so/2)/so,l=1-Math.sin(i*Math.PI);o.position.y=o.userData.baseY+Math.sin(performance.now()*.001+o.userData.offset)*.2-l*Hc}Xa.forEach(t=>t.update(a))}}function Bc(a){zo.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),Xa.forEach(e=>e.stopAllAction()),zo.length=0,Xa.length=0,Ga.length=0,wa=null,ma=0}let fa=null;const Wo=[],Sa=[],pa=new Sn([new w(80,-8,0),new w(0,-10,60),new w(-120,-14,0),new w(0,-12,-20),new w(80,-8,0)],!0,"centripetal",.8),Wc=.0032;pa.getLengths()[pa.getLengths().length-1];function ji(a,e,t){new $e().load("./models/whale.glb",n=>{fa=n.scene;const s=n.animations,i=vo(fa);if(i.scale.set(.825,.825,.825),i.userData.pathProgress=Math.random(),i.userData.speed=Wc*ne.randFloat(.9,1.1),i.userData.lookAhead=.41,i.userData.pathOffset=0,i.userData.baseYOffset=0,i.userData.baseXOffset=0,i.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(i),Wo.push(i),s.length>0){const r=new Ve(i);s.forEach(u=>r.clipAction(u).play()),Sa.push(r)}const l=vo(fa);if(l.scale.set(.42,.42,.42),l.userData.pathProgress=i.userData.pathProgress-.01,l.userData.pathProgress>1&&(l.userData.pathProgress-=1),l.userData.speed=i.userData.speed,l.userData.lookAhead=.41,l.userData.pathOffset=-3.215,l.userData.baseYOffset=-3.2862,l.userData.baseXOffset=8.2261,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(l),Wo.push(l),s.length>0){const r=new Ve(l);s.forEach(u=>{r.clipAction(u).startAt(Math.random()*u.duration).play()}),Sa.push(r)}},void 0,n=>{console.error("Error loading whale model:",n)})}function Vc(a,e){if(!fa)return;const t=new w;new w(0,1,0),new w;const o=new zt;for(let n=0;n<Wo.length;n++){const s=Wo[n];s.userData.pathProgress+=s.userData.speed*a,s.userData.pathProgress>1&&(s.userData.pathProgress-=1);const i=pa.getPointAt(s.userData.pathProgress);s.position.copy(i),s.position.y+=s.userData.baseYOffset,s.position.x+=s.userData.baseXOffset;const l=pa.getPointAt((s.userData.pathProgress+s.userData.lookAhead)%1);s.lookAt(l),pa.getTangentAt(s.userData.pathProgress,t);const r=new w(0,0,1);o.setFromUnitVectors(r,t.normalize()),s.quaternion.copy(o)}Sa.forEach(n=>n.update(a))}function Uc(a){Wo.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),Sa.forEach(e=>e.stopAllAction()),Wo.length=0,Sa.length=0,fa=null}let os=null;const Vo=[],ja=[],la=new Sn([new w(45,-7,22),new w(18,-5,38),new w(-22,-6,33),new w(-55,-8,-11),new w(-25,-7,-46),new w(19,-6,-36),new w(45,-7,22)],!0,"centripetal",.7),Xc=.023,Gc=la.getLength();function Zi(a,e,t){new $e().load("./models/dolphin.glb",n=>{os=n.scene;const s=n.animations;for(let i=0;i<7;i++){const l=vo(os);if(l.scale.setScalar(.26+Math.random()*.035),i===0&&(l.userData.pathProgress=0),l.userData.speed=Xc*ne.randFloat(.95,1.05),l.userData.lookAhead=.35,l.userData.sineAmp=3.65,l.userData.sineFreq=2.8+Math.random()*.4,l.userData.roll=0,l.userData.spinTimer=Math.random()*6,l.userData.spinDuration=.55,l.userData.spinSpeed=0,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(l),Vo.push(l),s.length>0){const r=new Ve(l);s.forEach(u=>r.clipAction(u).play()),ja.push(r)}}e&&e(Vo)},void 0,n=>{console.error("Error loading dolphin model:",n)})}function jc(a){const e=new w,t=new w(0,1,0),o=6,n=4,s=.18;Vo.forEach((i,l)=>{l===0&&(i.userData.pathProgress+=i.userData.speed*a);let r;if(l===0){r=i.userData.pathProgress%1,r<0&&(r+=1);const u=la.getPointAt(r),c=Math.sin(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.65);if(u.y+=c,u.y>-.2){const g=(u.y+.2)/3;u.y-=4*g*g}i.position.copy(u);const d=(i.userData.pathProgress+.08)%1,h=la.getPointAt(d);e.subVectors(h,u).normalize(),i.lookAt(u.clone().add(e));const p=Math.cos(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.65*Math.PI*2*i.userData.sineFreq*2.2),f=-Math.atan(p*.006);i.rotateX(f)}else{i.userData.podOffset===void 0&&(i.userData.podOffset=ne.randFloat(-4,n)),i.userData.podSide===void 0&&(i.userData.podSide=ne.randFloat(-o,o));let u=Vo[0].userData.pathProgress+i.userData.podOffset/Gc;i.userData.pathProgress===void 0&&(i.userData.pathProgress=u);const c=u-i.userData.pathProgress;i.userData.pathProgress+=c*s,r=i.userData.pathProgress%1,r<0&&(r+=1);const d=la.getPointAt(r),h=(i.userData.pathProgress+.08)%1,p=la.getPointAt(h);e.subVectors(p,d).normalize();const f=new w().crossVectors(e,t).normalize();d.add(f.multiplyScalar(i.userData.podSide));const g=Math.sin(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.85);if(d.y+=g,d.y>-.2){const M=(d.y+.2)/3;d.y-=4*M*M}i.position.copy(d),i.lookAt(d.clone().add(e));const v=Math.cos(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.85*Math.PI*2*i.userData.sineFreq*2.2),S=-Math.atan(v*.006);i.rotateX(S)}i.userData.spinTimer-=a,i.userData.spinTimer<=0&&i.userData.spinSpeed===0&&(i.userData.spinSpeed=(5+Math.random()*3)*(Math.random()>.5?1:-1),i.userData.spinTimer=i.userData.spinDuration),i.userData.spinTimer<=0&&(i.userData.spinSpeed=0,i.userData.spinTimer=3+Math.random()*4),i.userData.roll+=i.userData.spinSpeed*a,i.rotation.z=i.userData.roll}),ja.forEach(i=>i.update(a))}function Zc(a){Vo.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),ja.forEach(e=>e.stopAllAction()),Vo.length=0,ja.length=0,os=null}let Za=null;const qa=[],Ya=[],as=new Sn([new w(-400,-3.28,-150),new w(-200,-1.612,50),new w(20,-1.498,180),new w(200,-1.612,50),new w(400,-3.28,-150)],!1,"centripetal",.95),qc=.00297;as.getLength();function qi(a,e,t){new $e().load("./models/container-ship.glb",n=>{Za=n.scene;const s=n.animations,i=vo(Za);if(i.scale.setScalar(16.2),i.userData.pathProgress=0,i.userData.speed=qc*ne.randFloat(.9,1.1),i.userData.lookAhead=.02,i.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),a.add(i),qa.push(i),s.length>0){const l=new Ve(i);s.forEach(r=>l.clipAction(r).play()),Ya.push(l)}},void 0,n=>{console.error("Error loading container-ship model:",n)})}function Yc(a){Za&&(new w,new w(0,1,0),qa.forEach(e=>{e.userData.pathProgress+=e.userData.speed*a,e.userData.pathProgress=ne.clamp(e.userData.pathProgress,0,1);const t=as.getPointAt(e.userData.pathProgress);e.position.copy(t);const o=as.getPointAt(Math.min(e.userData.pathProgress+e.userData.lookAhead,1));e.lookAt(o)}),Ya.forEach(e=>e.update(a)))}function Kc(a){qa.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),Ya.forEach(e=>e.stopAllAction()),qa.length=0,Ya.length=0,Za=null}const Rt={center:{x:93.5,y:-2.874,z:-61},radius:34,speed:.148,currentTime:0};function ns(a){const e=Rt.radius,t=1/(1+Math.sin(a)*Math.sin(a)),o=Rt.center.x+e*t*Math.cos(a),n=Rt.center.z+e*t*Math.sin(a)*Math.cos(a),s=Rt.center.y;return{x:o,y:s,z:n}}let Ge=null,co=null;function Yi(a,e,t){new $e().load("./models/sailboat.glb",n=>{Ge=n.scene;const s=ns(0);Ge.position.set(s.x,s.y,s.z),Ge.scale.set(.12,.13,.09),Ge.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(Ge),n.animations&&n.animations.length>0&&(co=new Ve(Ge),n.animations.forEach(i=>{co.clipAction(i).play()}))},void 0,n=>{console.error("Error loading sailBoat model:",n)})}function $c(a){if(!Ge)return;Rt.currentTime+=a*Rt.speed;const e=ns(Rt.currentTime),t=ns(Rt.currentTime+.01),o=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Ge.position.set(e.x,e.y,e.z);const n=Math.atan2(o.x,o.z);Ge.rotation.y=n,co&&co.update(a)}function Jc(a){Ge&&(a.remove(Ge),Ge.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),Ge=null),co&&(co.stopAllAction(),co=null),Rt.currentTime=0}let oi=null,_o=null;function Ki(a,e,t,o,n){new $e().load("./models/mayan-temple.glb",i=>{oi=i.scene;const l=vo(oi);if(l.scale.setScalar(5.6),l.position.set(.684,-1.82,.14),l.rotation.y=Math.PI*.1,l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(l),e){const d=[new ot(-4.68,0,-4.68),new ot(4.68,0,-4.68),new ot(4.68,0,4.68),new ot(-4.68,0,4.68),new ot(-1.64,3.69,-1.64),new ot(1.64,3.69,-1.64),new ot(1.64,3.69,1.64),new ot(-1.64,3.69,1.64)],h=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]],p=new El({vertices:d,faces:h}),f=1.2,g=.8,v=1.2,S=new Dl(new ot(f,g,v));_o=new ta({mass:0,material:t}),_o.addShape(p);const M=new ot(0,3.69+g,0);_o.addShape(S,M),_o.position.set(l.position.x,l.position.y+3.69-5.98,l.position.z),_o.quaternion.setFromEuler(0,l.rotation.y,0),e.addBody(_o)}},void 0,i=>{console.error("Error loading Mayan-temple model:",i)})}const At={center:{x:0,y:-6.5,z:0},radius:18,speed:.08,currentTime:0};function ss(a){const e=At.center.x+At.radius*Math.cos(a),t=At.center.z+At.radius*Math.sin(a),o=At.center.y;return{x:e,y:o,z:t}}let It=null,Ka=null;function $i(a,e,t){new $e().load("./models/whale_shark.glb",n=>{It=n.scene;const s=ss(0);It.position.set(s.x,s.y,s.z),It.scale.set(.58,.58,.58),It.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(It),n.animations&&n.animations.length>0&&(Ka=new Ve(It),n.animations.forEach(i=>{Ka.clipAction(i).play()}))},void 0,n=>{console.error("Error loading whale shark model:",n)})}function Qc(a){if(!It)return;Ka&&Ka.update(a),At.currentTime+=a*At.speed;const e=ss(At.currentTime),t=ss(At.currentTime+.05),o=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();It.position.set(e.x,e.y,e.z);const n=Math.atan2(o.x,o.z);It.rotation.y=n-Math.PI/2}let jt=null,$a=null,ai=0;function Ji(a,e,t){new $e().load("./models/seagulls-spiral.glb",n=>{jt=n.scene,jt.position.set(0,5.6,0),jt.scale.set(.142,.142,.142),jt.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!1)}),a.add(jt),n.animations&&n.animations.length>0&&($a=new Ve(jt),n.animations.forEach(s=>{const i=$a.clipAction(s);i.timeScale=.65,i.play()}))},void 0,n=>{console.error("Error loading seagulls model:",n)})}function eu(a){if(!jt)return;$a&&$a.update(a),ai+=a;const o=Math.sin(ai*.24)*1.5;jt.position.y=8+o}const Ja=[];let Qi={};const tu=-10,ou=2.5,au=4,nu={separationDistance:.8,separationForce:.8,alignmentDistance:2,alignmentForce:.3,cohesionDistance:3,cohesionForce:.2,maxSpeed:2,minSpeed:.5,maxForce:.05,avoidanceDistance:5,containmentRadius:20,containmentForce:.3,swimDepth:-3,depthVariation:1.5,wanderStrength:.02,damping:.98};function Qa(a,e,t,o){const n=new $e,s={modelPath:e.modelPath,count:e.count||20,spawnArea:e.spawnArea||{centerX:0,centerZ:0,radiusX:15,radiusZ:15},behavior:{...nu,...e.behavior||{}},scale:e.scale||{min:.15,max:.25},waterLevel:e.waterLevel||-1.814,levels:e.levels||[1],fish:[],mixers:[],isHiding:!1,hideProgress:0};n.load(e.modelPath,i=>{const l=i.scene,r=i.animations;Qi[e.modelPath]=l,s.waterLevel=e.waterLevel;for(let u=0;u<s.count;u++){const c=vo(l),d=ne.randFloat(s.scale.min,s.scale.max);c.scale.setScalar(d);const h=s.spawnArea.centerX+ne.randFloatSpread(s.spawnArea.radiusX),p=s.spawnArea.centerZ+ne.randFloatSpread(s.spawnArea.radiusZ),f=s.behavior.swimDepth+ne.randFloatSpread(s.behavior.depthVariation);c.position.set(h,f,p);const g=Math.random()*Math.PI*2,v=ne.randFloat(s.behavior.minSpeed,s.behavior.maxSpeed);c.userData.velocity=new w(Math.cos(g)*v,0,Math.sin(g)*v),c.userData.acceleration=new w(0,0,0),c.userData.wanderAngle=Math.random()*Math.PI*2,c.userData.originalPosition=new w(h,f,p);const S=Math.random()*Math.PI*2,M=Math.random()*ou;if(c.userData.hideTarget=new w(Math.cos(S)*M,tu,Math.sin(S)*M),c.traverse(y=>{y.isMesh&&(y.castShadow=!0,y.receiveShadow=!1)}),a.add(c),s.fish.push(c),r.length>0){const y=new Ve(c);r.forEach(b=>{y.clipAction(b).startAt(Math.random()*b.duration).play()}),s.mixers.push(y)}}Ja.push(s),t&&t(s)},void 0,i=>{console.error("Error loading fish model:",e.modelPath,i)})}function Io(a,e,t){e.clampLength(0,t),a.userData.acceleration.add(e)}const Ce=new w,gt=new w;function su(a,e,t){const o=new w;let n=0;const s=t.separationDistance*t.separationDistance;for(let i=0;i<e.length;i++){const l=e[i];if(l===a)continue;const r=a.position.x-l.position.x,u=a.position.y-l.position.y,c=a.position.z-l.position.z,d=r*r+u*u+c*c;if(d>.001&&d<s){const h=Math.sqrt(d);Ce.set(r,u,c),Ce.normalize(),Ce.divideScalar(h),o.add(Ce),n++}}return n>0&&(o.divideScalar(n),o.normalize(),o.multiplyScalar(t.maxSpeed),o.sub(a.userData.velocity),o.multiplyScalar(t.separationForce)),o}function iu(a,e,t){const o=new w;let n=0;const s=t.alignmentDistance*t.alignmentDistance;for(let i=0;i<e.length;i++){const l=e[i];if(l===a)continue;const r=a.position.x-l.position.x,u=a.position.y-l.position.y,c=a.position.z-l.position.z,d=r*r+u*u+c*c;d>.001&&d<s&&(o.add(l.userData.velocity),n++)}return n>0?(o.divideScalar(n),o.normalize(),o.multiplyScalar(t.maxSpeed),gt.subVectors(o,a.userData.velocity),gt.multiplyScalar(t.alignmentForce),gt.clone()):o}function ru(a,e,t){const o=new w;let n=0;const s=t.cohesionDistance*t.cohesionDistance;for(let i=0;i<e.length;i++){const l=e[i];if(l===a)continue;const r=a.position.x-l.position.x,u=a.position.y-l.position.y,c=a.position.z-l.position.z,d=r*r+u*u+c*c;d>.001&&d<s&&(o.add(l.position),n++)}return n>0?(o.divideScalar(n),Ce.subVectors(o,a.position),Ce.normalize(),Ce.multiplyScalar(t.maxSpeed),gt.subVectors(Ce,a.userData.velocity),gt.multiplyScalar(t.cohesionForce),gt.clone()):o}function lu(a,e){const t=new w,o=Math.sqrt(a.position.x*a.position.x+a.position.z*a.position.z);if(o<e.avoidanceDistance){t.set(a.position.x,0,a.position.z),t.normalize(),t.multiplyScalar(e.maxSpeed),t.sub(a.userData.velocity);const n=1-o/e.avoidanceDistance;t.multiplyScalar(n*1.5)}return t}function cu(a,e,t){const o=new w,n=a.position.x-e.centerX,s=a.position.z-e.centerZ,i=Math.sqrt(n*n+s*s);if(i>t.containmentRadius){o.set(-n,0,-s),o.normalize(),o.multiplyScalar(t.maxSpeed),o.sub(a.userData.velocity);const l=i-t.containmentRadius,r=Math.min(l/10,1);o.multiplyScalar(r*t.containmentForce)}return o}function uu(a,e,t){a.userData.wanderAngle+=ne.randFloatSpread(.2)*t;const o=new w(Math.cos(a.userData.wanderAngle),Math.sin(a.userData.wanderAngle*.3)*.2,Math.sin(a.userData.wanderAngle));return o.multiplyScalar(e.wanderStrength),o}let ni=0;function du(a,e=!1){const t=Math.min(a,.1);Ja.forEach(o=>{const n=o.behavior;if(e&&!o.isHiding?(o.isHiding=!0,console.log("🐟 Fish detected storm, preparing to hide...")):!e&&o.isHiding&&o.hideProgress>=.9&&(o.isHiding=!1,console.log("🐟 Storm over, fish returning...")),o.isHiding?o.hideProgress=Math.min(1,o.hideProgress+t*.7):o.hideProgress=Math.max(0,o.hideProgress-t*.15),o.hideProgress>=.7&&o.isHiding){o.fish[0]&&o.fish[0].visible&&o.fish.forEach(i=>{i.visible=!1});return}o.hideProgress<.7&&o.fish[0]&&!o.fish[0].visible&&o.fish.forEach(i=>{i.visible=!0}),ni++;const s=ni%2===0;o.fish.forEach((i,l)=>{if(o.hideProgress>.05&&o.isHiding){if(Ce.copy(i.userData.hideTarget).sub(i.position),Ce.length()>.1){const g=Ce.x,v=Ce.z,S=Ce.y;Ce.normalize().multiplyScalar(au*t),i.position.add(Ce);let y=Math.atan2(g,v)-i.rotation.y;y>Math.PI&&(y-=Math.PI*2),y<-Math.PI&&(y+=Math.PI*2),i.rotation.y+=y*.15,i.rotation.x=-S*.3}o.mixers[l]&&o.mixers[l].update(t*.5);return}if(!o.isHiding&&o.hideProgress>0&&o.hideProgress<.2){const f=new w(o.spawnArea.centerX-i.position.x,n.swimDepth-i.position.y,o.spawnArea.centerZ-i.position.z);f.normalize().multiplyScalar(n.maxSpeed*.5),i.userData.velocity.copy(f)}if(s){i.userData.acceleration.set(0,0,0);const f=su(i,o.fish,n),g=iu(i,o.fish,n),v=ru(i,o.fish,n),S=lu(i,n),M=cu(i,o.spawnArea,n),y=uu(i,n,t);Io(i,f,n.maxForce*1.5),Io(i,g,n.maxForce),Io(i,v,n.maxForce),Io(i,S,n.maxForce*2),Io(i,M,n.maxForce*3),Io(i,y,n.maxForce*.3)}if(s){i.userData.velocity.add(i.userData.acceleration),i.userData.velocity.multiplyScalar(n.damping);const f=i.userData.velocity.length();f>n.maxSpeed?i.userData.velocity.normalize().multiplyScalar(n.maxSpeed):f<n.minSpeed&&i.userData.velocity.normalize().multiplyScalar(n.minSpeed)}Ce.copy(i.userData.velocity).multiplyScalar(t),i.position.add(Ce);const r=o.waterLevel||-1.814,u=.3;i.position.y>r-u&&(i.position.y=r-u,i.userData.velocity.y=Math.min(0,i.userData.velocity.y));const d=n.swimDepth-i.position.y;if(Math.abs(d)/(n.depthVariation*2)>.04&&(i.userData.velocity.y+=d*.01*t*60),i.userData.velocity.lengthSq()>.01){gt.copy(i.userData.velocity).normalize();let g=Math.atan2(gt.x,gt.z)-i.rotation.y;g>Math.PI&&(g-=Math.PI*2),g<-Math.PI&&(g+=Math.PI*2),i.rotation.y+=g*.1;const v=-gt.y*.25;i.rotation.x+=(v-i.rotation.x)*.1}o.mixers[l]&&o.mixers[l].update(t)})})}function hu(a){Ja.forEach(e=>{e.fish.forEach(t=>{a.remove(t),t.traverse(o=>{o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(n=>n.dispose()):o.material.dispose())})}),e.mixers.forEach(t=>t.stopAllAction())}),Ja.length=0,Qi={}}let we=null,uo=null;const en=new Sn([new w(35,-12,20),new w(20,-14,40),new w(0,-15,50),new w(-20,-14,40),new w(-40,-12,10),new w(-45,-10,-10),new w(-35,-9,-25),new w(-20,-8,-35),new w(35,-12,20)],!0,"centripetal",.5),mu=.035;en.getLength();let ie={isBreaching:!1,timeSinceLastBreach:0,breachProgress:0,nextBreachTime:15+Math.random()*20,breachDuration:3.5,breachStartProgress:0,targetBreachHeight:2.25};function er(a,e,t){new $e().load("./models/sail-fish.glb",n=>{we=n.scene;const s=en.getPointAt(0);we.position.copy(s),we.scale.set(1.23,1.23,1.23),we.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(we),n.animations&&n.animations.length>0&&(uo=new Ve(we),n.animations.forEach(i=>{uo.clipAction(i).play()})),n.scene,ie.timeSinceLastBreach=0,ie.isBreaching=!1,ie.nextBreachTime=15+Math.random()*20},void 0,n=>{console.error("Error loading sailfish model:",n)})}function fu(a){if(!we)return;ie.isBreaching||(ie.timeSinceLastBreach+=a,ie.timeSinceLastBreach>=ie.nextBreachTime&&(ie.isBreaching=!0,ie.breachProgress=0,ie.breachStartProgress=we.userData.pathProgress||0,ie.timeSinceLastBreach=0,ie.nextBreachTime=15+Math.random()*20)),ie.isBreaching&&(ie.breachProgress+=a/ie.breachDuration,ie.breachProgress>=1&&(ie.isBreaching=!1,ie.breachProgress=0)),we.userData.pathProgress||(we.userData.pathProgress=0),we.userData.pathProgress+=mu*a,we.userData.pathProgress%=1;const e=en.getPointAt(we.userData.pathProgress);let t=0;ie.isBreaching&&(t=Math.sin(ie.breachProgress*Math.PI)*(ie.targetBreachHeight-e.y)),we.position.set(e.x,e.y+t,e.z);const o=(we.userData.pathProgress+.02)%1,n=en.getPointAt(o),s=new w().subVectors(n,e).normalize();if(ie.isBreaching){const l=Math.cos(ie.breachProgress*Math.PI);s.y+=l*.5,s.normalize()}const i=we.position.clone().add(s);we.lookAt(i),uo&&uo.update(a)}function pu(a){we&&(a.remove(we),we.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),we=null),uo&&(uo.stopAllAction(),uo=null),ie={isBreaching:!1,timeSinceLastBreach:0,breachProgress:0,nextBreachTime:15+Math.random()*20,breachDuration:3.5,breachStartProgress:0,breachStartY:0,targetBreachHeight:2.5}}const Aa=new lt({uniforms:{uTime:{value:0}},transparent:!0,side:dt,depthWrite:!1,vertexShader:`
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
  `}),Ne=[];let Mn=0;const La={cache:new Map,get(a){const e=Math.round(a*100)/100;if(!this.cache.has(e)){let t;e<.15?t=16:e<.25?t=24:e<.4?t=32:t=48,this.cache.set(e,new _s(e,t,t))}return this.cache.get(e)},dispose(){this.cache.forEach(a=>a.dispose()),this.cache.clear()}},ee={enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:12,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.5,fadeInDuration:2800,fadeOutDuration:2800};function tr(a){Object.assign(ee,a),console.log("Spawn config updated for level:",ee)}function gu(a,e,t){return function(n,s){const i=ee.minRadius+Math.random()*(ee.maxRadius-ee.minRadius),l=new ge(La.get(i),Aa);l.position.set(n,ee.spawnHeight,s),l.castShadow=!0,l.receiveShadow=!0,l.renderOrder=3,a.add(l);const r=new Ca(i),u=i*i*i*30.5,c=new ta({mass:u,material:t,linearDamping:.3,angularDamping:.3});c.addShape(r),c.position.set(n,ee.spawnHeight,s),e.addBody(c),Mn+=u;const d={mesh:l,body:c,radius:i,active:!0,hasSpawnedRipple:!1,originalMass:u};return Ne.push(d),d}}function vu(a){Aa.uniforms.uTime.value+=a}function Ha(){return Mn}function or(a){Mn+=a}function yu(){Mn=0}const wu=.15,Hn=3,Su=.65;function ar(a,e,t,o){if(a.radius<wu)return!1;const n=a.radius*Su;if(n<ee.minRadius*.8)return!1;const s=a.mesh.position.clone(),i=a.body.velocity.clone(),l=a.originalMass;e.remove(a.mesh),t.removeBody(a.body),a.active=!1;const r=Ne.indexOf(a);r>-1&&Ne.splice(r,1);const u=Math.PI*2/Hn;for(let c=0;c<Hn;c++){const d=u*c+Math.random()*.3,h=new ge(La.get(n),Aa),p=a.radius*.3;h.position.set(s.x+Math.cos(d)*p,s.y,s.z+Math.sin(d)*p),h.castShadow=!0,h.receiveShadow=!0,h.renderOrder=3,e.add(h);const f=new Ca(n),g=n*n*n*30.5,v=new ta({mass:g,material:o,linearDamping:.3,angularDamping:.3});v.addShape(f),v.position.copy(h.position),v.velocity.copy(i);const S=new w(Math.cos(d),.02+Math.random()*.02,Math.sin(d)).normalize(),M=1.12+Math.random()*1.125;v.applyImpulse(new ot(S.x*M,S.y*M,S.z*M),v.position),t.addBody(v);const y={mesh:h,body:v,radius:n,active:!0,hasSpawnedRipple:!1,originalMass:l/Hn};Ne.push(y)}return!0}const Os=new Audio("./sounds/tropical-island-waves.mp3");Os.loop=!0;Os.volume=.45;let nr=!1,ut=!1;const is=[new Audio("./sounds/stone-debris.wav"),new Audio("./sounds/stones-falling-down.wav"),new Audio("./sounds/stones-short-debris.wav")];is.forEach(a=>{a.volume=.3});let Zt=null,tn=!1;const ba=new Audio("./sounds/correct-answer.wav");ba.volume=.4;const Ma=new Audio("./sounds/winning-chimes.wav");Ma.volume=.5;const Ue={small:new Audio("./sounds/water-drip-small.wav"),medium:new Audio("./sounds/water-drop.mp3"),large:new Audio("./sounds/water-drip-large.wav"),bubble:new Audio("./sounds/water-bubble.wav")};Ue.small.volume=.4;Ue.medium.volume=.5;Ue.large.volume=.6;Ue.bubble.volume=.3;const on=new Audio("./sounds/drizzle.mp3");on.loop=!0;on.volume=.45;let Ta=[];const rs=new Audio("./sounds/woosh.wav");rs.volume=.5;const Te=new Audio("./sounds/jungle-day.mp3");Te.loop=!0;Te.volume=0;let ze=null;const ls=new Audio("./sounds/ball-tap.wav");ls.volume=.5;function Uo(){return Os}function ks(){return nr}function an(a){nr=a}function sr(){return ut}function si(a){ut=a}function bu(a){if(ut)return;const e=[],t=Math.random();if(a<.8)t<.5?e.push(Ue.small):t<.8?e.push(Ue.medium):e.push(Ue.bubble);else if(a<1.3)t<.4?e.push(Ue.medium):t<.8?e.push(Ue.large):e.push(Ue.bubble);else if(t<.6?e.push(Ue.large):e.push(Ue.bubble),t>.7){const s=Ue.medium.cloneNode();s.volume=.3,s.currentTime=0,s.play().catch(i=>console.log("Water splash extra sound failed:",i))}const o=e[0],n=o.cloneNode();n.volume=o.volume,n.currentTime=0,n.playbackRate=.9+Math.random()*.2,n.play().catch(s=>console.log("Water splash sound failed:",s))}function ir(){if(ut)return;const a=Math.floor(Math.random()*is.length);Zt=is[a],Zt.currentTime=0,Zt.play().catch(e=>console.log("Sculpt sound failed:",e)),Zt.onended=()=>{tn&&!ut&&ir()}}function Mu(){Zt&&(Zt.pause(),Zt.onended=null,Zt=null)}function rr(){tn||(tn=!0,ir())}function Tn(){tn=!1,Mu()}function Tu(){ut||(ba.currentTime=0,ba.play().catch(a=>console.log("Quick-lock sound failed:",a)))}function xu(){ut||(Ma.currentTime=0,Ma.play().catch(a=>console.log("Winning chimes sound failed:",a)))}function Pu(){ut||(rs.currentTime=0,rs.play().catch(a=>console.log("Woosh sound failed:",a)))}function lr(){if(ut)return null;const a=on.cloneNode();return a.volume=on.volume,a.loop=!0,a.play().catch(e=>console.log("Drizzle sound failed:",e)),Ta.push(a),a}function cr(a){if(!a)return;const e=setInterval(()=>{if(a.volume>.05)a.volume=Math.max(0,a.volume-.05);else{a.pause(),a.currentTime=0,clearInterval(e);const t=Ta.indexOf(a);t>-1&&Ta.splice(t,1)}},50)}function Eu(){if(ut)return;ze&&(clearInterval(ze),ze=null),Te.currentTime=0,Te.volume=0,Te.play().catch(s=>console.log("Jungle day sound failed:",s));const a=.5,e=2e3,t=40,o=e/t,n=a/t;ze=setInterval(()=>{Te.volume<a-n?Te.volume=Math.min(a,Te.volume+n):(Te.volume=a,clearInterval(ze),ze=null)},o)}function Du(){ze&&(clearInterval(ze),ze=null);const a=1500,e=30,t=a/e,n=Te.volume/e;ze=setInterval(()=>{Te.volume>n?Te.volume=Math.max(0,Te.volume-n):(Te.volume=0,Te.pause(),Te.currentTime=0,clearInterval(ze),ze=null)},t)}function Fs(){Tn(),ba.pause(),ba.currentTime=0,Ma.pause(),Ma.currentTime=0,Ta.forEach(a=>{a.pause(),a.currentTime=0}),Ta=[],ze&&(clearInterval(ze),ze=null),Te.pause(),Te.currentTime=0,Te.volume=0}function ii(){return Te}function ur(){if(ut)return;const a=ls.cloneNode();a.volume=ls.volume,a.currentTime=0,a.playbackRate=.95+Math.random()*.1,a.play().catch(e=>console.log("Ball tap sound failed:",e))}const m={startDelay:8500,duration:14800,dropInterval:180,ballsDropped:0,isActive:!1,startTime:0,steadyStateReached:!1,steadyStateValues:null,cloudUpdateFrameCounter:0,startTimeoutId:null,dropIntervalId:null,isPaused:!1,pauseTimeoutRemaining:0,pauseTime:0,stormScheduledTime:0};function nn(a,e=!0){const{scene:t,world:o,ballMaterial:n,randomTerrainPosition:s,createCloudIndicator:i,sharedCloudTexture:l,sky:r,renderer:u,water:c}=a,d=45;m.stormScheduledTime=Date.now(),m.startTimeoutId=setTimeout(()=>{m.isActive=!0,m.startTime=Date.now(),m.ballsDropped=0;const h=s(),p=i({startX:h.x,startZ:h.z,endX:h.x,endZ:h.z,cloudTexture:l,rainCount:50,cloudHeight:31.88}),f=p.userData.cloud,g=p.userData.cloudMaterial;f.scale.set(125,32,128),f.rotation.y=Math.random()*Math.PI*2;const v=.22,S=.344;g.uniforms.base.value.setRGB(121/255*.5,138/255*.55,160/255*.65),g.uniforms.threshold.value=S,f.renderOrder=10,t.add(p);const M=lr();p.userData.drizzleSound=M,m.cloudData={group:p,startTime:Date.now(),rotationSpeed:.0013,baseOpacity:v},m.originalSkyValues={turbidity:r.material.uniforms.turbidity.value,rayleigh:r.material.uniforms.rayleigh.value,mieCoefficient:r.material.uniforms.mieCoefficient.value,exposure:u.toneMappingExposure},m.originalWaterValues={heightMultiplier:c.material.uniforms.uWaveHeightMultiplier.value,amplitude:c.material.uniforms.uWaveAmplitude.value,waterLevel:c.mesh.position.y},m.originalHemisphereColors={deepColor:c.hemisphereMesh.material.uniforms.uDeepColor.value.clone(),shallowColor:c.hemisphereMesh.material.uniforms.uShallowColor.value.clone()},m.water=c;const y=new Audio("sounds/thunderstorm.mp3");m.thunderSound=y,m.lightningTriggered=!1,m.lightningStarted=!1;const b=document.createElement("div");b.id="lightning-flash",b.style.position="fixed",b.style.top="0",b.style.left="0",b.style.width="100%",b.style.height="100%",b.style.backgroundColor="white",b.style.opacity="0",b.style.pointerEvents="none",b.style.zIndex="1000",document.body.appendChild(b),m.lightningFlash=b,m.dropIntervalId=setInterval(()=>{if(m.ballsDropped>=d){clearInterval(m.dropIntervalId),m.dropIntervalId=null;return}const T=s(),A=.12+Math.random()*.1,L=new ge(La.get(A),Aa);L.position.set(T.x,ee.spawnHeight,T.z),L.castShadow=!0,L.receiveShadow=!1,L.renderOrder=3,t.add(L);const I=new Ca(A),H=A*A*A,C=new ta({mass:H,material:n,linearDamping:0,angularDamping:0});C.addShape(I),C.position.set(T.x,ee.spawnHeight,T.z),o.addBody(C),e&&or(H),Ne.push({mesh:L,body:C,radius:A,active:!0,hasSpawnedRipple:!1}),m.ballsDropped++},m.dropInterval)},m.startDelay)}function ri(a,e){if(!m.lightningTriggered&&a>2500&&a<3500){m.lightningStarted||(m.lightningStarted=!0,m.lightningStartTime=e,m.thunderSound&&!sr()&&(m.thunderSound.currentTime=0,m.thunderSound.play().catch(n=>console.log("Thunder audio failed:",n))));const t=e-m.lightningStartTime;let o=0;return t<80?o=.9*(1-t/80):t>=180&&t<280?o=.85*(1-(t-180)/100):t>=280&&(m.lightningTriggered=!0,o=0),m.lightningFlash&&(m.lightningFlash.style.opacity=o.toString()),!0}return!1}function dr(){if(m.lightningFlash){const a=document.getElementById("lightning-flash");a&&document.body.removeChild(a),m.lightningFlash=null}}function _u(){if(!m.isPaused){if(m.isPaused=!0,m.pauseTime=Date.now(),m.startTimeoutId!==null&&!m.isActive){const a=Date.now()-m.stormScheduledTime;m.pauseTimeoutRemaining=Math.max(0,m.startDelay-a),clearTimeout(m.startTimeoutId),m.startTimeoutId=null}m.dropIntervalId!==null&&(clearInterval(m.dropIntervalId),m.dropIntervalId=null)}}function Iu(a,e){if(!m.isPaused)return;const t=Date.now()-m.pauseTime;if(m.isPaused=!1,m.startTime>0&&(m.startTime+=t),m.cloudData&&m.cloudData.startTime>0&&(m.cloudData.startTime+=t),m.lightningStartTime>0&&(m.lightningStartTime+=t),m.stormScheduledTime>0&&(m.stormScheduledTime+=t),m.pauseTimeoutRemaining>0&&!m.isActive&&(m.startTimeoutId=setTimeout(()=>{m.startTimeoutId=null,m.pauseTimeoutRemaining=0,nn(a,e)},m.pauseTimeoutRemaining)),m.isActive&&m.ballsDropped<45){const{scene:o,world:n,ballMaterial:s,randomTerrainPosition:i}=a,l=45;m.dropIntervalId=setInterval(()=>{if(m.ballsDropped>=l){clearInterval(m.dropIntervalId),m.dropIntervalId=null;return}const r=i(),u=.12+Math.random()*.1,c=new ge(La.get(u),Aa);c.position.set(r.x,ee.spawnHeight,r.z),c.castShadow=!0,c.receiveShadow=!1,c.renderOrder=3,o.add(c);const d=new Ca(u),h=u*u*u,p=new ta({mass:h,material:s,linearDamping:0,angularDamping:0});p.addShape(d),p.position.set(r.x,ee.spawnHeight,r.z),n.addBody(p),or(h),Ne.push({mesh:c,body:p,radius:u,active:!0,hasSpawnedRipple:!1}),m.ballsDropped++},m.dropInterval)}}function Cu(){m.isActive=!1,m.ballsDropped=0,m.startTime=0,m.lightningTriggered=!1,m.lightningStarted=!1,m.steadyStateReached=!1,m.steadyStateValues=null,m.cloudUpdateFrameCounter=0,m.startTimeoutId!==null&&(clearTimeout(m.startTimeoutId),m.startTimeoutId=null),m.dropIntervalId!==null&&(clearInterval(m.dropIntervalId),m.dropIntervalId=null),m.thunderSound&&(m.thunderSound.pause(),m.thunderSound.currentTime=0),dr(),delete m.originalSkyValues,m.originalWaterValues&&m.water&&(m.water.setWaveChoppiness(m.originalWaterValues.heightMultiplier,m.originalWaterValues.amplitude),m.water.mesh.position.y=m.originalWaterValues.waterLevel),m.originalHemisphereColors&&m.water&&(m.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(m.originalHemisphereColors.deepColor),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(m.originalHemisphereColors.shallowColor)),delete m.originalWaterValues,delete m.originalHemisphereColors,delete m.water}function Au(a){const{gameStarted:e,scene:t,camera:o,dt:n,sky:s,renderer:i,updateCloud:l,updateRainParticles:r,setRainOpacity:u}=a;if(!e||!m.isActive||!m.cloudData)return!1;const c=Date.now(),d=c-m.startTime,h=m.cloudData,p=c-h.startTime,{cloud:f,cloudMaterial:g}=h.group.userData;f.visible||(f.visible=!0),m.cloudUpdateFrameCounter++,m.cloudUpdateFrameCounter>=1.22&&(l(h.group,o,n),m.cloudUpdateFrameCounter=0),f.rotation.y+=h.rotationSpeed;const v=4e3,S=3800,M=m.duration-2500,y=m.duration-2e3,b=d<S,T=d>y,A=!b&&!T;let L=h.baseOpacity;if(p<v){const I=p/v,H=I*I*I;L*=H}else if(d>M){const I=(d-(m.duration-1500))/1500;L*=Math.max(0,1-I)}if(g.uniforms.opacity.value=Math.max(0,L),A&&m.steadyStateReached)return r(h.group,n),u(h.group,L*.6),d>=2500&&d<=3500&&ri(d,c),!0;if(m.originalSkyValues){ri(d,c);const I=0,H=.025,C=.01,B=.53;if(b){const de=d/S,Y=de*de;s.material.uniforms.turbidity.value=m.originalSkyValues.turbidity+(I-m.originalSkyValues.turbidity)*Y,s.material.uniforms.rayleigh.value=m.originalSkyValues.rayleigh+(H-m.originalSkyValues.rayleigh)*Y,s.material.uniforms.mieCoefficient.value=m.originalSkyValues.mieCoefficient+(C-m.originalSkyValues.mieCoefficient)*Y,i.toneMappingExposure=m.originalSkyValues.exposure+(B-m.originalSkyValues.exposure)*Y}else if(T){const de=(d-y)/2e3,Y=1-Math.pow(1-de,2),K=m.originalSkyValues.turbidity+(I-m.originalSkyValues.turbidity)*(1-Y),Re=m.originalSkyValues.rayleigh+(H-m.originalSkyValues.rayleigh)*(1-Y),oe=m.originalSkyValues.mieCoefficient+(C-m.originalSkyValues.mieCoefficient)*(1-Y),he=m.originalSkyValues.exposure+(B-m.originalSkyValues.exposure)*(1-Y);s.material.uniforms.turbidity.value=K,s.material.uniforms.rayleigh.value=Re,s.material.uniforms.mieCoefficient.value=oe,i.toneMappingExposure=he}else m.steadyStateReached||(m.steadyStateReached=!0,s.material.uniforms.turbidity.value=I,s.material.uniforms.rayleigh.value=H,s.material.uniforms.mieCoefficient.value=C,i.toneMappingExposure=B)}if(m.originalHemisphereColors&&m.water){const I=new re(4128),H=new re(2245717);if(b){const C=d/S,B=C*C;m.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(m.originalHemisphereColors.deepColor,I,B),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(m.originalHemisphereColors.shallowColor,H,B)}else if(T){const C=(d-y)/2e3,B=1-Math.pow(1-C,2);m.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(I,m.originalHemisphereColors.deepColor,B),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(H,m.originalHemisphereColors.shallowColor,B)}else m.steadyStateReached||(m.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(I),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(H))}if(m.originalWaterValues&&m.water){const H=m.duration-y,C=11.125,B=.55,de=.96;if(b){const Y=Math.min(d/3e3,1),K=Y*Y,Re=m.originalWaterValues.heightMultiplier+(C-m.originalWaterValues.heightMultiplier)*K,oe=m.originalWaterValues.amplitude+(B-m.originalWaterValues.amplitude)*K,he=m.originalWaterValues.waterLevel-de*K;m.water.mesh.position.y=he,m.water.setWaveChoppiness(Re,oe)}else if(T){const Y=Math.min((d-y)/H,1),K=1-Math.pow(1-Y,2),Re=C+(m.originalWaterValues.heightMultiplier-C)*K,oe=B+(m.originalWaterValues.amplitude-B)*K,he=m.originalWaterValues.waterLevel-de+de*K;m.water.mesh.position.y=he,m.water.setWaveChoppiness(Re,oe)}else if(!m.steadyStateReached){const Y=m.originalWaterValues.waterLevel-de;m.water.mesh.position.y=Y,m.water.setWaveChoppiness(C,B)}}return r(h.group,n),u(h.group,L*.6),d>m.duration?(m.isActive=!1,h.group&&(h.group.userData.drizzleSound&&cr(h.group.userData.drizzleSound),t.remove(h.group),h.group.traverse(I=>{I.geometry&&I.geometry.dispose(),I.material&&I.material.dispose()})),m.cloudData=null,m.originalSkyValues&&(s.material.uniforms.turbidity.value=m.originalSkyValues.turbidity,s.material.uniforms.rayleigh.value=m.originalSkyValues.rayleigh,s.material.uniforms.mieCoefficient.value=m.originalSkyValues.mieCoefficient,i.toneMappingExposure=m.originalSkyValues.exposure,m.originalSkyValues=null),m.originalWaterValues&&m.water&&(m.water.setWaveChoppiness(m.originalWaterValues.heightMultiplier,m.originalWaterValues.amplitude),m.water.mesh.position.y=m.originalWaterValues.waterLevel,m.originalWaterValues=null),m.originalHemisphereColors&&m.water&&(m.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(m.originalHemisphereColors.deepColor),m.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(m.originalHemisphereColors.shallowColor),m.originalHemisphereColors=null,m.water=null),dr(),!1):!0}const sn=[{id:1,name:"Desert Isle Revival",description:"A gentle introduction to island restoration",story:"Nothing stirred but heat and the sea",terrainShape:{size:14,scaleX:1,scaleY:1,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:1,distortion:{frequency:0,amplitude:0,randomness:0}},waterLevel:-1.747,winPercentage:.32,spawn:{enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:16,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.45,fadeInDuration:2800,fadeOutDuration:2800},difficulty:1,rewards:{stars:3,points:1e3}},{id:2,name:"Sun-Scored Sands",description:"The water comes faster now",story:"The islands held their arid breath",terrainShape:{size:14.43,scaleX:1.24,scaleY:.82,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:.3,distortion:{frequency:.04,amplitude:.14,randomness:.032},turbulence:{strength:.465,scale:.1269,octaves:.98}},waterLevel:-2.07,winPercentage:.48,spawn:{enabled:!0,interval:6500,cloudDuration:5500,dropletsPerCloud:14,dropletInterval:380,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.8,fadeInDuration:2500,fadeOutDuration:2500},difficulty:2,rewards:{stars:3,points:1500}},{id:3,name:"Ancient Challenge",description:"Less water to work with",story:"Drops like fists bruised the dust",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:Math.PI/4,amount:1.4},bay:{angle:0,depth:0,width:0},irregularity:1.15},waterLevel:-2.385,winPercentage:.52,spawn:{enabled:!0,interval:6e3,cloudDuration:5e3,dropletsPerCloud:15,dropletInterval:350,minRadius:.1,maxRadius:.16,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:2300,fadeOutDuration:2300},difficulty:3,rewards:{stars:3,points:2e3}},{id:4,name:"Hollow Basin",description:"Every drop counts",story:"Stone refused to drink",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:0,amount:.103},bay:{angle:6,depth:2.2,width:Math.PI/2.5},irregularity:1.426,distortion:{frequency:.4444,amplitude:3.28,randomness:.218},turbulence:{strength:5.422,scale:.0032,octaves:.2642}},waterLevel:-2.02,winPercentage:.58,spawn:{enabled:!0,interval:5e3,cloudDuration:4500,dropletsPerCloud:16,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3.3,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:4,rewards:{stars:3,points:2500}},{id:5,name:"Drinking Stone",description:"The final test of water mastery",story:"Lips carved into land's edge",terrainShape:{size:15.62,scaleX:1.2,scaleY:.9,tilt:{angle:Math.PI/6,amount:.7},bay:{angle:Math.PI,depth:1.5,width:Math.PI/3},irregularity:2},waterLevel:-1.8,winPercentage:.42,spawn:{enabled:!0,interval:4500,cloudDuration:4e3,dropletsPerCloud:18,dropletInterval:300,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1800,fadeOutDuration:1800},difficulty:5,rewards:{stars:3,points:3e3}},{id:6,name:"Mirage Archipelago",description:"A fragmented paradise - precision is everything",story:"Storm turned to slow soaking swale",terrainShape:{size:14.83,scaleX:1.028,scaleY:.98,tilt:{angle:Math.PI/5.23,amount:.85*2.123},bay:{angle:Math.PI/2,depth:1.8,width:Math.PI/2.8},irregularity:2.27},waterLevel:-1.189,winPercentage:.58,spawn:{enabled:!0,interval:3800,cloudDuration:3500,dropletsPerCloud:22,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:6,rewards:{stars:3,points:4e3}},{id:7,name:"Vapor Crucible",description:"The sun steals water while you work",story:"The land tasted water and ground softened",terrainShape:{scaleX:1,scaleY:.96,tilt:{angle:Math.PI/4,amount:.29},bay:{angle:20,depth:-1,width:20},irregularity:2.8328,distortion:{frequency:.64,amplitude:.24,randomness:.2},turbulence:{strength:1.965,scale:.269,octaves:.98}},waterLevel:-3.66,winPercentage:.6,evaporationRate:.18,spawn:{enabled:!0,interval:7e3,cloudDuration:5e3,dropletsPerCloud:10,dropletInterval:500,minRadius:.11,maxRadius:.18,spawnHeight:10.2,cloudSpeed:2.2,fadeInDuration:3e3,fadeOutDuration:2e3},difficulty:7,rewards:{stars:3,points:4500}},{id:8,name:"Split-Decision Atoll",description:"Clouds divide the moment they reach the island",story:"Earth cupped the rain like a secret",terrainShape:{scaleX:1.3,scaleY:.89,tilt:{angle:0,amount:0},bay:{angle:Math.PI,depth:1.2,width:Math.PI/2},irregularity:2.63},waterLevel:.18,winPercentage:.53,spawn:{enabled:!0,interval:5500,cloudDuration:4e3,dropletsPerCloud:14,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:1800,fadeOutDuration:1800,splitClouds:!0,splitDelay:800},difficulty:8,rewards:{stars:3,points:5e3}},{id:9,name:"Glass Dunes",description:"Rolling hills of slippery crystal sand - drops race through valleys",story:"Droplets slipped beneath to find dark places, waiting",terrainShape:{size:14.63,islandRadius:6.42,scaleX:.91,scaleY:.91,tilt:{angle:Math.PI/6,amount:1.2},bay:{angle:Math.PI/3,depth:1.5,width:Math.PI/4},irregularity:.8,distortion:{frequency:1.3,amplitude:.6,randomness:.21}},waterLevel:-2.75,winPercentage:.7,terrainFriction:.12,spawn:{enabled:!0,interval:5e3,cloudDuration:4200,dropletsPerCloud:17,dropletInterval:280,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.4,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:9,rewards:{stars:3,points:5500}},{id:10,name:"Tide-Turned Throat",description:"A narrow channel that reverses flow every 20 s",story:"Roots respond to the aquifer's sigh",terrainShape:{scaleX:.62,scaleY:1.8,tilt:{angle:Math.PI/2,amount:.6},bay:{angle:Math.PI/2,depth:2.8,width:Math.PI/6},irregularity:1.2},waterLevel:-1.814,winPercentage:.56,tideCycle:2e4,tideForce:.4,spawn:{enabled:!0,interval:4800,cloudDuration:3800,dropletsPerCloud:19,dropletInterval:260,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.6,fadeInDuration:1700,fadeOutDuration:1700},difficulty:10,rewards:{stars:3,points:6e3}},{id:11,name:"Adrift",description:"lost at sea",story:"Emerald hues of past fortunes sprung",terrainShape:{scaleX:1.25,scaleY:.85,tilt:{angle:Math.PI/4,amount:1.1},bay:{angle:3*Math.PI/4,depth:1.4,width:Math.PI/3},irregularity:1.8,distortion:{frequency:22.2,amplitude:.31,randomness:.03}},waterLevel:-2.3,winPercentage:.66,spawn:{enabled:!0,interval:4300,cloudDuration:3600,dropletsPerCloud:20,dropletInterval:240,minRadius:.07,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.8,fadeInDuration:1600,fadeOutDuration:1600},difficulty:11,rewards:{stars:3,points:7e3}},{id:12,name:"Island Omega",description:"All previous twists combined—and the goal moves",story:"What you channel, you also become",terrainShape:{scaleX:1,scaleY:1,tilt:{angle:Math.PI/5,amount:.63},bay:{angle:Math.PI/3,depth:2,width:Math.PI/2.5*.23},irregularity:3.427,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:.22,scale:.32,octaves:.2642}},waterLevel:-2.1,winPercentage:.7,dynamicTarget:!0,targetCycle:15e3,evaporationRate:.12,splitClouds:!0,splitDelay:600,terrainFriction:.35,spawn:{enabled:!0,interval:3500,cloudDuration:3200,dropletsPerCloud:24,dropletInterval:200,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4.2,fadeInDuration:1400,fadeOutDuration:1400},difficulty:12,rewards:{stars:3,points:1e4}},{id:13,name:"Shattered Archipelago",description:"A scattered chain of islands—turbulence has broken the land",story:"The ocean returned what had been lost",terrainShape:{size:19.43,islandRadius:8.12,scaleX:1,scaleY:1,tilt:{angle:14,amount:.141},bay:{angle:0,depth:0,width:0},irregularity:1.82,distortion:{frequency:.048,amplitude:4.44,randomness:.15},turbulence:{strength:2.6965,scale:.369,octaves:1.98}},waterLevel:-2,winPercentage:.75,multipleTargets:2,spawn:{enabled:!0,interval:4200,cloudDuration:3800,dropletsPerCloud:18,dropletInterval:270,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1700,fadeOutDuration:1700},difficulty:13,rewards:{stars:3,points:12e3}},{id:14,name:"Jagged Atoll",description:"Craggy peaks rise from the depths—navigate the chaos",story:"Clouds pause, listening for song",terrainShape:{size:19.012,islandRadius:8.16,scaleX:1.12,scaleY:.965,tilt:{angle:52,amount:.68},bay:{angle:Math.PI/4,depth:1.2,width:Math.PI/3},irregularity:1.785,distortion:{frequency:.46,amplitude:.52,randomness:.22},turbulence:{strength:3.42,scale:.343,octaves:2.41}},waterLevel:-1.8,winPercentage:.74,multipleTargets:2,spawn:{enabled:!0,interval:3900,cloudDuration:3500,dropletsPerCloud:20,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.7,fadeInDuration:1600,fadeOutDuration:1600},difficulty:14,rewards:{stars:3,points:14e3}},{id:15,name:"Chaos Reef",description:"The ocean has shattered reality—only skill remains",story:"Rain resumes its ancient rhythm",terrainShape:{size:21.62,islandRadius:9.464,scaleX:.98,scaleY:1.02,tilt:{angle:68,amount:.242},bay:{angle:Math.PI/1.25,depth:2.11,width:Math.PI/12.2},irregularity:5.31,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:3.822,scale:.232,octaves:.642}},waterLevel:-1.5,winPercentage:.076,multipleTargets:3,spawn:{enabled:!0,interval:3600,cloudDuration:3200,dropletsPerCloud:22,dropletInterval:230,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:15,rewards:{stars:3,points:16e3}}];function Hs(a){return sn.find(e=>e.id===a)||sn[0]}function Lo(){return sn.length}const xn=Object.freeze(Object.defineProperty({__proto__:null,LEVELS:sn,getLevelById:Hs,getTotalLevels:Lo},Symbol.toStringTag,{value:"Module"})),hr={url:"https://bvbzhpcxrutiriqndcfy.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YnpocGN4cnV0aXJpcW5kY2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDM4MDIsImV4cCI6MjA3Nzc3OTgwMn0.vjforq20xOL5jTMbaAOgesSCl8UJj6fN03CevS5gc_A"};function mr(){let a=localStorage.getItem("oasea_player_id");return a||(a=crypto.randomUUID(),localStorage.setItem("oasea_player_id",a),console.log("📝 Created new player ID:",a)),a}function fr(){let a=sessionStorage.getItem("oasea_session_id");return a||(a=crypto.randomUUID(),sessionStorage.setItem("oasea_session_id",a)),a}class Lu{constructor(e,t){this.supabase=Al(e,t),this.STATS_CACHE_KEY="oasea_stats_cache"}async getAllScores(){try{const{data:e,error:t}=await this.supabase.from("scores").select("*").order("created_at",{ascending:!1});if(t)throw t;return e.map(o=>({id:o.id,playerId:o.player_id,levelId:o.level_id,playerName:o.player_name,basePoints:o.base_points,bonusPoints:o.bonus_points,timeBonus:o.time_bonus,totalScore:o.total_score,waterPercentage:parseFloat(o.water_percentage),completionTimeMs:o.completion_time_ms,sessionId:o.session_id,timestamp:new Date(o.created_at).getTime(),date:o.date}))}catch(e){return console.error("Error fetching scores from Supabase:",e),[]}}async ensurePlayerExists(e,t){try{const{data:o,error:n}=await this.supabase.from("players").select("*").eq("player_id",e).single();if(o){if(t&&o.display_name!==t){const{error:l}=await this.supabase.rpc("update_player_display_name",{p_player_id:e,p_display_name:t});l&&console.error("Error updating player name:",l)}return o}const{data:s,error:i}=await this.supabase.from("players").insert({player_id:e,display_name:t||"Anonymous"}).select().single();if(i)throw i;return console.log("✨ Created new player in database:",e),s}catch(o){return console.error("Error ensuring player exists:",o),null}}async saveScore(e){try{await this.ensurePlayerExists(e.playerId,e.playerName);const{error:t}=await this.supabase.from("scores").insert({player_id:e.playerId,player_name:e.playerName,level_id:e.levelId,base_points:e.basePoints,bonus_points:e.bonusPoints,time_bonus:e.timeBonus,total_score:e.totalScore,water_percentage:e.waterPercentage,completion_time_ms:e.completionTimeMs,date:e.date,session_id:e.sessionId});if(t)throw t;await this.updatePlayerStats(e.playerId),localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){throw console.error("Error saving score to Supabase:",t),t}}async updatePlayerStats(e){try{const{error:t}=await this.supabase.rpc("update_player_stats",{p_player_id:e});if(t)throw t}catch(t){console.error("Error updating player stats:",t)}}async getCachedStats(){const e=localStorage.getItem(this.STATS_CACHE_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_CACHE_KEY,JSON.stringify(e))}async clearScoresBefore(e){try{const t=new Date(e).toISOString().split("T")[0],{error:o}=await this.supabase.from("scores").delete().lt("date",t);if(o)throw o;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){console.error("Error clearing old scores:",t)}}async clearAllScores(){try{const{error:e}=await this.supabase.from("scores").delete().neq("id",0);if(e)throw e;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(e){console.error("Error clearing all scores:",e)}}async getPlayerProfile(e){try{const{data:t,error:o}=await this.supabase.from("players").select("*").eq("player_id",e).single();if(o)throw o;return{playerId:t.player_id,displayName:t.display_name,firstSeenAt:new Date(t.first_seen_at).getTime(),lastSeenAt:new Date(t.last_seen_at).getTime(),totalScore:t.total_score,levelsCompleted:t.levels_completed,totalPlayTimeMs:t.total_play_time_ms,bestSingleScore:t.best_single_score,totalGamesPlayed:t.total_games_played}}catch(t){return console.error("Error fetching player profile:",t),null}}async getPlayerScores(e,t=10){try{const{data:o,error:n}=await this.supabase.from("scores").select("*").eq("player_id",e).order("created_at",{ascending:!1}).limit(t);if(n)throw n;return o.map(s=>({id:s.id,playerId:s.player_id,levelId:s.level_id,playerName:s.player_name,basePoints:s.base_points,bonusPoints:s.bonus_points,timeBonus:s.time_bonus,totalScore:s.total_score,waterPercentage:parseFloat(s.water_percentage),completionTimeMs:s.completion_time_ms,sessionId:s.session_id,timestamp:new Date(s.created_at).getTime(),date:s.date}))}catch(o){return console.error("Error fetching player scores:",o),[]}}async getPlayerLevelBests(e){try{const{data:t,error:o}=await this.supabase.from("scores").select("level_id, total_score, water_percentage, completion_time_ms, created_at").eq("player_id",e).order("level_id").order("total_score",{ascending:!1});if(o)throw o;const n={};return t.forEach(s=>{(!n[s.level_id]||s.total_score>n[s.level_id].totalScore)&&(n[s.level_id]={levelId:s.level_id,totalScore:s.total_score,waterPercentage:parseFloat(s.water_percentage),completionTimeMs:s.completion_time_ms,timestamp:new Date(s.created_at).getTime()})}),Object.values(n)}catch(t){return console.error("Error fetching player level bests:",t),[]}}}class Ru{constructor(){this.SCORES_KEY="oasea_scores",this.STATS_KEY="oasea_stats"}async getAllScores(){const e=localStorage.getItem(this.SCORES_KEY);return e?JSON.parse(e):[]}async saveScore(e){const t=await this.getAllScores();t.push(e),localStorage.setItem(this.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.STATS_KEY)}async getCachedStats(){const e=localStorage.getItem(this.STATS_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_KEY,JSON.stringify(e))}async clearScoresBefore(e){const o=(await this.getAllScores()).filter(n=>n.timestamp>=e);localStorage.setItem(this.SCORES_KEY,JSON.stringify(o)),localStorage.removeItem(this.STATS_KEY)}async clearAllScores(){localStorage.removeItem(this.SCORES_KEY),localStorage.removeItem(this.STATS_KEY)}}class zs{constructor(e=null){this.storage=e||new Ru}calculateScore(e,t,o,n="",s=0){const i=Hs(e),l=mr(),r=fr(),u=i.rewards.points,c=this.calculateBonusPoints(i,t,u),d=this.calculateTimeBonus(i,o,u),h=u+c+d;return{playerId:l,sessionId:r,levelId:e,playerName:n.trim(),basePoints:u,bonusPoints:c,timeBonus:d,totalScore:h,waterPercentage:t,completionTimeMs:o,terrainEdits:s,timestamp:Date.now(),date:this.getTodayDateString()}}calculateBonusPoints(e,t,o){const n=t-e.winPercentage;if(n<=0)return 0;const i=Math.floor(n*o*1.5);return Math.max(0,i)}calculateTimeBonus(e,t,o){const s=e.difficulty*9e4-t;if(s<=0)return 0;const i=Math.max(1,Math.floor(o/1e3)),r=Math.floor(s/1e3)*i;return Math.max(0,r)}async saveScore(e){await this.storage.saveScore(e)}async getTopScoresToday(e=10){const t=await this.storage.getAllScores(),o=this.getTodayDateString();return t.filter(n=>n.date===o).filter(n=>this.isValidScore(n)).sort((n,s)=>this.compareScores(n,s)).slice(0,e)}async getTopScoresAllTime(e=10){return(await this.storage.getAllScores()).filter(o=>this.isValidScore(o)).sort((o,n)=>this.compareScores(o,n)).slice(0,e)}async getTopScoresForLevel(e,t=10){return(await this.storage.getAllScores()).filter(n=>n.levelId===e).filter(n=>this.isValidScore(n)).sort((n,s)=>this.compareScores(n,s)).slice(0,t)}isValidScore(e){return e.waterPercentage>.01&&e.completionTimeMs>0&&e.totalScore>0}compareScores(e,t){const o=this.isValidScore(e),n=this.isValidScore(t);return o&&!n?-1:!o&&n?1:!o&&!n?0:t.totalScore-e.totalScore}async getLevelStats(e){const o=(await this.storage.getAllScores()).filter(r=>r.levelId===e).filter(r=>this.isValidScore(r));if(o.length===0)return{timesCompleted:0,bestScore:0,bestTime:null,avgScore:0,avgTime:0};const n=Math.max(...o.map(r=>r.totalScore)),s=Math.min(...o.map(r=>r.completionTimeMs)),i=Math.floor(o.reduce((r,u)=>r+u.totalScore,0)/o.length),l=Math.floor(o.reduce((r,u)=>r+u.completionTimeMs,0)/o.length);return{timesCompleted:o.length,bestScore:n,bestTime:s,avgScore:i,avgTime:l}}async getTotalStats(){const e=await this.storage.getCachedStats();if(e&&Date.now()-e.timestamp<6e4)return e.stats;const o=(await this.storage.getAllScores()).filter(r=>this.isValidScore(r));let n=null;if(o.length>0){const r={};o.forEach(c=>{r[c.levelId]=(r[c.levelId]||0)+1});const u=Math.max(...Object.values(r));n=parseInt(Object.keys(r).find(c=>r[c]===u))}const s=o.length>0?o.reduce((r,u)=>r+u.waterPercentage,0)/o.length:0,i=o.length>0?Math.min(...o.map(r=>r.completionTimeMs)):0,l={totalScore:o.reduce((r,u)=>r+u.totalScore,0),levelsCompleted:new Set(o.map(r=>r.levelId)).size,totalPlayTime:o.reduce((r,u)=>r+u.completionTimeMs,0),avgScore:o.length>0?Math.floor(o.reduce((r,u)=>r+u.totalScore,0)/o.length):0,bestSingleScore:o.length>0?Math.max(...o.map(r=>r.totalScore)):0,fastestTime:i,avgWaterPercentage:s,favoriteIsland:n};return await this.storage.setCachedStats({stats:l,timestamp:Date.now()}),l}async getPersonalBest(e){const t=await this.getTopScoresForLevel(e,1);return t.length>0?t[0]:null}async isNewPersonalBest(e,t){const o=await this.getPersonalBest(e);return!o||t>o.totalScore}async cleanupOldScores(e=90){const t=Date.now()-e*24*60*60*1e3;await this.storage.clearScoresBefore(t)}async resetAllScores(){await this.storage.clearAllScores()}async cleanupInvalidScores(){const e=await this.storage.getAllScores(),t=e.filter(n=>this.isValidScore(n)),o=e.length-t.length;return o>0&&(localStorage.setItem(this.storage.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.storage.STATS_KEY),console.log(`Cleaned up ${o} invalid score(s)`)),o}getTodayDateString(){return new Date().toISOString().split("T")[0]}async getPlayerProfile(e){return typeof this.storage.getPlayerProfile=="function"?await this.storage.getPlayerProfile(e):null}async getPlayerScores(e,t=10){return typeof this.storage.getPlayerScores=="function"?await this.storage.getPlayerScores(e,t):(await this.storage.getAllScores()).filter(n=>n.playerId===e).sort((n,s)=>s.timestamp-n.timestamp).slice(0,t)}async getPlayerLevelBests(e){if(typeof this.storage.getPlayerLevelBests=="function")return await this.storage.getPlayerLevelBests(e);const o=(await this.storage.getAllScores()).filter(s=>s.playerId===e),n={};return o.forEach(s=>{(!n[s.levelId]||s.totalScore>n[s.levelId].totalScore)&&(n[s.levelId]={levelId:s.levelId,totalScore:s.totalScore,waterPercentage:s.waterPercentage,completionTimeMs:s.completionTimeMs,timestamp:s.timestamp})}),Object.values(n)}static formatTime(e){const t=Math.floor(e/1e3),o=Math.floor(t/60),n=t%60;return o>0?`${o}:${n.toString().padStart(2,"0")}`:`${t}s`}static formatScore(e){return e.toLocaleString()}}let pr;const Ou=hr.url,ku=hr.anonKey;console.log("📊 Using Supabase for score storage (from config file)"),pr=new Lu(Ou,ku);const ho=new zs(pr);typeof window<"u"&&(window.cleanupInvalidScores=async()=>{const a=await ho.cleanupInvalidScores();return console.log(`✓ Cleaned up ${a} invalid score(s)`),a},window.viewAllScores=async()=>{const a=await ho.storage.getAllScores();return console.table(a.map(e=>({player:e.playerName||"Anonymous",level:e.levelId,score:e.totalScore,water:`${Math.round(e.waterPercentage*100)}%`,time:zs.formatTime(e.completionTimeMs),date:e.date,valid:ho.isValidScore(e)?"✓":"✗"}))),a},console.log("📊 Score system loaded! Try these commands:"),console.log("  cleanupInvalidScores() - Remove test data"),console.log("  viewAllScores() - View all scores in a table"));const Ra=Object.freeze(Object.defineProperty({__proto__:null,ScoreSystem:zs,getOrCreatePlayerId:mr,getOrCreateSessionId:fr,scoreSystem:ho},Symbol.toStringTag,{value:"Module"}));class Fu{constructor(){this.currentLevelId=parseInt(localStorage.getItem("currentLevelId"))||1,this.completedLevels=JSON.parse(localStorage.getItem("completedLevels")||"[]"),this.currentLevelId>Lo()&&(this.currentLevelId=Lo()),this.levelStartTime=null,this.levelElapsedTime=0}getCurrentLevel(){return Hs(this.currentLevelId)}getCurrentLevelId(){return this.currentLevelId}nextLevel(){return this.currentLevelId>=Lo()?null:(this.currentLevelId++,this.saveCurrentLevel(),this.getCurrentLevel())}startLevelTimer(){this.levelStartTime=Date.now(),this.levelElapsedTime=0}stopLevelTimer(){return this.levelStartTime?(this.levelElapsedTime=Date.now()-this.levelStartTime,this.levelElapsedTime):0}getCurrentElapsedTime(){return this.levelStartTime?Date.now()-this.levelStartTime:0}resetLevelTimer(){this.levelStartTime=null,this.levelElapsedTime=0}async completeLevel(e=3,t=0,o=0){const n=this.stopLevelTimer();if(t<=.01||n<=0)return console.warn("Invalid game completion - not saving score"),{basePoints:0,bonusPoints:0,timeBonus:0,totalScore:0,waterPercentage:0,completionTimeMs:0,isPersonalBest:!1,valid:!1};const s=this.completedLevels.findIndex(c=>c.levelId===this.currentLevelId),i={levelId:this.currentLevelId,timestamp:Date.now(),stars:e,completed:!0};s>=0?e>this.completedLevels[s].stars&&(this.completedLevels[s]=i):this.completedLevels.push(i),this.saveCompletedLevels();const l=localStorage.getItem("oasea_player_name")||"",r=ho.calculateScore(this.currentLevelId,t,n,l,o);await ho.saveScore(r);const u=await ho.isNewPersonalBest(this.currentLevelId,r.totalScore);return{...r,isPersonalBest:u,valid:!0}}isLevelCompleted(e){return this.completedLevels.some(t=>t.levelId===e)}isLastLevel(){return this.currentLevelId>=Lo()}resetProgress(){this.currentLevelId=1,this.completedLevels=[],this.saveCurrentLevel(),this.saveCompletedLevels()}saveCurrentLevel(){localStorage.setItem("currentLevelId",this.currentLevelId.toString())}saveCompletedLevels(){localStorage.setItem("completedLevels",JSON.stringify(this.completedLevels))}getTotalStars(){return this.completedLevels.reduce((e,t)=>e+t.stars,0)}getMaxStars(){return Lo()*3}}const Ht=new Fu;function Hu(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}let te,cs,us,Pe,Ae,ds,hs,vt,Ot,ao,ae,ga,ca,xa,ua,Xo,ms,Pa,fs,ps,Go,qt,Wa,Ct,$t,gs,yt,Pn,En,rn;function zu(a){yt=a.levelManager,Pn=a.animateCameraToGameplay,En=a.startGame,rn=a.transitionToNextLevel,te=document.getElementById("title-splash"),cs=document.getElementById("title-play-button"),us=document.getElementById("instructions-button"),Pe=document.getElementById("welcome-modal"),Ae=document.getElementById("simple-play-overlay"),ds=document.getElementById("simple-play-button"),hs=document.getElementById("play-button"),vt=document.getElementById("next-level-btn"),Ot=document.getElementById("sound"),ao=document.getElementById("fullscreen"),ae=document.getElementById("level-select-modal"),ga=document.getElementById("level-grid"),ca=document.getElementById("close-level-select"),xa=document.getElementById("level-name"),ua=document.querySelector(".gameplay-gif"),Xo=document.getElementById("score-modal"),ms=document.getElementById("close-score"),Pa=document.getElementById("leaderboard-modal"),fs=document.getElementById("leaderboard-btn"),ps=document.getElementById("close-leaderboard"),Go=document.getElementById("name-prompt-modal"),qt=document.getElementById("player-name-input"),Wa=document.getElementById("save-name-btn"),Ct=document.getElementById("score-player-name"),$t=document.getElementById("player-profile-modal"),gs=document.getElementById("close-player-profile"),ju(),Zu(),Ku(),$u(),Ju(),Qu(),ed(),td(),sd(),cd(),fd(),ld(),wd()}function gr(a,e=!1){a.id===1?(te&&(te.style.display="flex"),Pe&&(Pe.style.display="none"),Ae&&(Ae.style.display="none")):(e?(te&&(te.style.display="none"),Ae&&(Ae.style.display="none",Ae.style.pointerEvents="auto",Ae.style.animation="")):(te&&(te.style.display="flex"),Ae&&(Ae.style.display="none")),Pe&&(Pe.style.display="none"))}function vr(a){xa&&(xa.textContent=`Island ${a.id}: ${a.name}`)}function yr(a){const e=document.getElementById("goal-marker");if(e){const t=a*100;e.style.bottom=`${t}%`}}function Nu(){vt&&(yt.isLastLevel()?(vt.innerHTML='<span class="material-icons">eco</span>Credits',yd()):vt.innerHTML='<span class="material-icons">arrow_forward</span>Next&nbsp;Island',vt.style.display="flex")}function wr(){vt&&(vt.style.display="none")}function Bu(){Ae&&(Ae.style.display="flex")}function Wu(){Ae&&(Ae.style.display="none")}function Vu(){Pe&&(Pe.style.display="none")}function Uu(a){const e=document.getElementById("progress-fill"),t=document.getElementById("progress-text");e&&(e.style.height=a+"%"),t&&(t.textContent=Math.floor(a)+"%")}function Xu(){const a=document.getElementById("progress-fill");a&&a.classList.add("complete")}function Sr(){const a=document.getElementById("progress-fill"),e=document.getElementById("progress-text"),t=document.getElementById("progress-container");a&&(a.style.height="0%",a.classList.remove("complete")),e&&(e.textContent="0%"),t&&(t.style.background="linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",t.classList.remove("pulse"))}function Gu(){const a=document.getElementById("progress-container"),e=document.getElementById("progress-fill");a&&e&&(a.classList.remove("pulse"),e.classList.remove("pulse"),a.offsetWidth,e.offsetWidth,a.classList.add("pulse"),e.classList.add("pulse"),setTimeout(()=>{a.classList.remove("pulse"),e.classList.remove("pulse")},600))}function br(){const a=document.getElementById("win-modal");a&&(a.style.display="none")}function ju(){Ot&&Ot.addEventListener("click",()=>{const a=Uo();sr()?(si(!1),a.play().then(()=>{an(!0),Ot.querySelector(".material-icons").textContent=""}).catch(t=>console.log("Failed to play audio:",t))):(si(!0),a.pause(),Fs(),an(!1),Ot.querySelector(".material-icons").textContent="")})}function Zu(){ao&&(ao.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().then(()=>{ao.querySelector(".material-icons").textContent="fullscreen"}).catch(a=>{console.log("Error attempting to exit fullscreen:",a)}):document.documentElement.requestFullscreen().then(()=>{ao.querySelector(".material-icons").textContent="fullscreen_exit"}).catch(a=>{console.log("Error attempting to enable fullscreen:",a)})}),document.addEventListener("fullscreenchange",()=>{document.fullscreenElement?ao.querySelector(".material-icons").textContent="fullscreen_exit":ao.querySelector(".material-icons").textContent="fullscreen"}))}function qu(){te&&(te.style.pointerEvents="none",te.style.animation="none",te.offsetWidth,te.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{te.style.display="none",te.style.animation="",te.style.pointerEvents=""},500)),Pn(),En(),ks()||Uo().play().then(()=>{an(!0),Ot&&(Ot.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function Yu(){Pe&&(Pe.style.pointerEvents="none",Pe.style.animation="none",Pe.offsetWidth,Pe.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{Pe.style.display="none",Pe.classList.add("hidden"),Pe.style.animation="",Pe.style.pointerEvents=""},500)),Pn(),En(),ks()||Uo().play().then(()=>{an(!0),Ot&&(Ot.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function Ku(){cs&&cs.addEventListener("click",()=>{qu()})}function $u(){us&&us.addEventListener("click",()=>{te&&(te.style.display="none"),Pe&&(Pe.style.animation="fadeIn 0.5s ease",Pe.style.display="flex")})}function Ju(){hs&&hs.addEventListener("click",()=>{Yu()})}function Qu(){ds&&ds.addEventListener("click",()=>{Ae&&(Ae.style.pointerEvents="none",Ae.style.animation="fadeOut 0.5s ease",setTimeout(()=>{Ae.style.display="none"},500)),Pn(),En()})}function ed(){vt&&vt.addEventListener("click",()=>{if(vt.style.display="none",Tr(),yt.completeLevel(3),!yt.nextLevel()){xr().then(()=>{const e=document.querySelector('.tab-btn[data-tab="credits"]');e&&e.click()});return}rn()})}function td(){xa&&xa.parentElement.addEventListener("click",()=>{od()}),ca&&ca.addEventListener("click",()=>{ae&&(ae.style.pointerEvents="none",ae.style.animation="none",ae.offsetWidth,ae.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{ae.classList.add("hidden"),ae.style.display="none",ae.style.animation="",ae.style.pointerEvents=""},500))}),ae&&ae.addEventListener("click",a=>{a.target===ae&&ca&&ca.click()})}function od(){!ae||!ga||(ad(),ae.classList.remove("hidden"),ae.style.display="flex")}function ad(){ga&&St(async()=>{const{LEVELS:a}=await Promise.resolve().then(()=>xn);return{LEVELS:a}},void 0).then(({LEVELS:a})=>{ga.innerHTML="";const e=yt.getCurrentLevel();a.forEach(t=>{const o=yt.isLevelCompleted(t.id),n=t.id===e.id,s=t.id>1&&!yt.isLevelCompleted(t.id-1),i=document.createElement("div");i.className="level-card",s&&i.classList.add("locked"),n&&i.classList.add("current");const l=yt.completedLevels.find(u=>u.levelId===t.id),r=l?l.stars:0;i.innerHTML=`
        ${s?'<span class="material-icons lock-icon">lock</span>':""}
        <div class="level-number">${t.id}</div>
        <div class="level-title">${t.name}</div>
        <div class="level-stars">
          ${o?"★".repeat(r)+"☆".repeat(3-r):"☆☆☆"}
        </div>
      `,s||i.addEventListener("click",()=>{nd(t.id)}),ga.appendChild(i)})})}function nd(a){yt.currentLevelId=a,yt.saveCurrentLevel(),te&&te.style.display!=="none"&&(te.style.pointerEvents="none",te.style.animation="none",te.offsetWidth,te.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{te.style.display="none",te.style.animation="",te.style.pointerEvents=""},300)),ae?(ae.style.pointerEvents="none",ae.style.animation="none",ae.offsetWidth,ae.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{ae.classList.add("hidden"),ae.style.display="none",ae.style.animation="",ae.style.pointerEvents="",rn()},300)):rn()}function sd(){ua&&(ua.addEventListener("load",()=>{ua.classList.add("loaded");const a=document.querySelector(".gif-placeholder");a&&(a.style.display="none")}),ua.addEventListener("error",()=>{console.log("Gameplay GIF not found - placeholder will be shown")}))}function Mr(){return localStorage.getItem("oasea_player_name")||""}function id(a){return a.replace(/<[^>]*>/g,"").trim().slice(0,20)}function vs(a){const e=id(a);localStorage.setItem("oasea_player_name",e)}function li(){return!localStorage.getItem("oasea_player_name_set")}function rd(){localStorage.setItem("oasea_player_name_set","true")}function ld(){Wa&&qt&&(Wa.addEventListener("click",()=>{const a=qt.value.trim();a&&(vs(a),rd(),dd())}),qt.addEventListener("keypress",a=>{a.key==="Enter"&&Wa.click()}))}function cd(){ms&&ms.addEventListener("click",Tr),Ct&&(Ct.addEventListener("change",()=>{const a=Ct.value.trim();a&&vs(a)}),Ct.addEventListener("keypress",a=>{if(a.key==="Enter"){const e=Ct.value.trim();e&&(vs(e),Ct.blur())}}))}function ud(){Go&&(qt&&(qt.value=Mr(),setTimeout(()=>{qt.focus(),qt.select()},100)),Go.style.display="flex")}function dd(){Go&&(Go.style.display="none")}async function hd(a){if(Xo){if(li()){ud();const e=setInterval(()=>{(!li()||Go.style.display==="none")&&(clearInterval(e),ci(a))},100);return}ci(a)}}async function ci(a){if(!Xo)return;const{ScoreSystem:e,scoreSystem:t}=await St(async()=>{const{ScoreSystem:i,scoreSystem:l}=await Promise.resolve().then(()=>Ra);return{ScoreSystem:i,scoreSystem:l}},void 0);Ct&&(Ct.value=Mr()),document.getElementById("score-base").textContent=e.formatScore(a.basePoints),document.getElementById("score-bonus").textContent=e.formatScore(a.bonusPoints),document.getElementById("score-time").textContent=e.formatScore(a.timeBonus),document.getElementById("score-total").textContent=e.formatScore(a.totalScore);const o=await t.getTotalStats();document.getElementById("career-total").textContent=e.formatScore(o.totalScore);const n=Math.round(a.waterPercentage*100);document.getElementById("water-collected").textContent=`${n}%`,document.getElementById("completion-time").textContent=e.formatTime(a.completionTimeMs),document.getElementById("terrain-edits").textContent=a.terrainEdits||0;const s=document.getElementById("personal-best-badge");s&&(s.style.display=a.isPersonalBest?"flex":"none"),Xo.style.display="flex",md(a,o.totalScore)}function Tr(){Xo&&(Xo.style.display="none")}function md(a,e){const o=Date.now();function n(){const s=Date.now()-o,i=Math.min(s/1e3,1),l=1-Math.pow(1-i,3),r=Math.floor(a.basePoints*l),u=Math.floor(a.bonusPoints*l),c=Math.floor(a.timeBonus*l),d=Math.floor(a.totalScore*l),h=Math.floor(e*l);document.getElementById("score-base").textContent=r.toLocaleString(),document.getElementById("score-bonus").textContent=u.toLocaleString(),document.getElementById("score-time").textContent=c.toLocaleString(),document.getElementById("score-total").textContent=d.toLocaleString(),document.getElementById("career-total").textContent=h.toLocaleString(),i<1&&requestAnimationFrame(n)}n()}function fd(){fs&&fs.addEventListener("click",xr),ps&&ps.addEventListener("click",pd);const a=document.querySelectorAll(".tab-btn");a.forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.tab;gd(t),a.forEach(o=>o.classList.remove("active")),e.classList.add("active")})})}async function xr(){if(!Pa)return;Pa.style.display="flex";const a=document.querySelector(".tab-btn.active"),e=a?a.dataset.tab:"today";await Pr(e)}function pd(){Pa&&(Pa.style.display="none")}async function gd(a){document.querySelectorAll(".leaderboard-tab-content").forEach(t=>{t.style.display="none"});const e=document.getElementById(`leaderboard-${a}`);if(e&&(e.style.display="block"),a==="today"){const t=document.getElementById("today-loading"),o=document.getElementById("today-scores");t&&(t.style.display="flex"),o&&(o.style.display="none")}else if(a==="alltime"){const t=document.getElementById("alltime-loading"),o=document.getElementById("alltime-scores");t&&(t.style.display="flex"),o&&(o.style.display="none")}else if(a==="stats"){const t=document.getElementById("stats-loading"),o=document.getElementById("stats-content");t&&(t.style.display="flex"),o&&(o.style.display="none")}await Pr(a)}async function Pr(a){const{scoreSystem:e,ScoreSystem:t}=await St(async()=>{const{scoreSystem:o,ScoreSystem:n}=await Promise.resolve().then(()=>Ra);return{scoreSystem:o,ScoreSystem:n}},void 0);if(a==="today"){const o=await e.getTopScoresToday(10);ui("today-scores",o)}else if(a==="alltime"){const o=await e.getTopScoresAllTime(10);ui("alltime-scores",o)}else if(a==="stats"){const o=await e.getTotalStats();vd(o)}}function ui(a,e){const t=document.getElementById(a);t&&St(async()=>{const{ScoreSystem:o}=await Promise.resolve().then(()=>Ra);return{ScoreSystem:o}},void 0).then(({ScoreSystem:o})=>{St(async()=>{const{getLevelById:n}=await Promise.resolve().then(()=>xn);return{getLevelById:n}},void 0).then(({getLevelById:n})=>{if(e.length===0?t.innerHTML='<p class="no-scores">No scores yet. Complete a level to see your scores here!</p>':(t.innerHTML=e.map((i,l)=>{const r=n(i.levelId),u=Hu(i.playerName||"Anonymous"),c=i.playerId||"";return`
            <div class="score-item">
              <div class="score-rank">#${l+1}</div>
              <div class="score-info">
                <div class="score-player-name ${c?"clickable":""}" data-player-id="${c}">${u}</div>
                <div class="score-level">Island ${i.levelId}: ${r.name}</div>
                <div class="score-details">
                  <span>${o.formatTime(i.completionTimeMs)}</span>
                  <span>${Math.round(i.waterPercentage*100)}% collected</span>
                </div>
              </div>
              <div class="score-points">${o.formatScore(i.totalScore)}</div>
            </div>
          `}).join(""),t.querySelectorAll(".score-player-name.clickable").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.playerId;l&&Sd(l)})})),a==="today-scores"){const s=document.getElementById("today-loading");s&&(s.style.display="none"),t.style.display="block"}else if(a==="alltime-scores"){const s=document.getElementById("alltime-loading");s&&(s.style.display="none"),t.style.display="block"}})})}function vd(a){St(async()=>{const{ScoreSystem:e}=await Promise.resolve().then(()=>Ra);return{ScoreSystem:e}},void 0).then(({ScoreSystem:e})=>{St(async()=>{const{getLevelById:t}=await Promise.resolve().then(()=>xn);return{getLevelById:t}},void 0).then(({getLevelById:t})=>{document.getElementById("total-score-stat").textContent=e.formatScore(a.totalScore),document.getElementById("best-single-stat").textContent=e.formatScore(a.bestSingleScore),document.getElementById("levels-completed-stat").textContent=a.levelsCompleted;const o=document.getElementById("favorite-island-stat");if(a.favoriteIsland){const i=t(a.favoriteIsland);o.textContent=`${a.favoriteIsland}: ${i.name}`}else o.textContent="—";document.getElementById("total-time-stat").textContent=e.formatTime(a.totalPlayTime),document.getElementById("fastest-time-stat").textContent=a.fastestTime>0?e.formatTime(a.fastestTime):"—",document.getElementById("avg-score-stat").textContent=e.formatScore(a.avgScore),document.getElementById("avg-water-stat").textContent=a.avgWaterPercentage>0?`${Math.round(a.avgWaterPercentage*100)}%`:"0%";const n=document.getElementById("stats-loading"),s=document.getElementById("stats-content");n&&(n.style.display="none"),s&&(s.style.display="grid")})})}function yd(){const a=document.getElementById("level-story-overlay"),e=document.getElementById("level-story-text");!a||!e||(e.innerHTML="You shaped valleys, drew water back to its heart, and watched the parched earth breathe again.<br><br>Treat our planet with care, guide water home, and life will find the way.",a.style.display="block",setTimeout(()=>{a.classList.add("visible")},100),setTimeout(()=>{a.classList.remove("visible"),setTimeout(()=>{a.style.display="none"},500)},9864))}function wd(){gs&&gs.addEventListener("click",di),$t&&$t.addEventListener("click",a=>{a.target===$t&&di()})}async function Sd(a){if(!$t)return;const e=document.getElementById("profile-loading"),t=document.getElementById("profile-stats-content"),o=document.getElementById("profile-recent-scores");e&&(e.style.display="flex"),t&&(t.style.display="none"),o&&(o.style.display="none"),$t.style.display="flex";try{const{scoreSystem:n,ScoreSystem:s}=await St(async()=>{const{scoreSystem:h,ScoreSystem:p}=await Promise.resolve().then(()=>Ra);return{scoreSystem:h,ScoreSystem:p}},void 0),{getLevelById:i}=await St(async()=>{const{getLevelById:h}=await Promise.resolve().then(()=>xn);return{getLevelById:h}},void 0),l=await n.getPlayerProfile(a);if(!l){document.getElementById("profile-player-name").textContent="Player Not Found",e&&(e.style.display="none");return}document.getElementById("profile-player-name").textContent=l.displayName||"Anonymous";const r=new Date(l.firstSeenAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});document.getElementById("profile-member-since").textContent=`Member since ${r}`,document.getElementById("profile-total-score").textContent=s.formatScore(l.totalScore),document.getElementById("profile-best-single").textContent=s.formatScore(l.bestSingleScore),document.getElementById("profile-levels-completed").textContent=l.levelsCompleted,document.getElementById("profile-games-played").textContent=l.totalGamesPlayed,document.getElementById("profile-total-time").textContent=s.formatTime(l.totalPlayTimeMs);const u=l.totalGamesPlayed>0?Math.floor(l.totalScore/l.totalGamesPlayed):0;document.getElementById("profile-avg-score").textContent=s.formatScore(u);const c=await n.getPlayerScores(a,5),d=document.getElementById("profile-scores-list");c.length>0&&d&&(d.innerHTML=c.map(h=>{const p=i(h.levelId);return`
          <div class="score-item">
            <div class="score-info">
              <div class="score-level">Island ${h.levelId}: ${p.name}</div>
              <div class="score-details">
                <span>${s.formatTime(h.completionTimeMs)}</span>
                <span>${Math.round(h.waterPercentage*100)}% collected</span>
              </div>
            </div>
            <div class="score-points">${s.formatScore(h.totalScore)}</div>
          </div>
        `}).join("")),e&&(e.style.display="none"),t&&(t.style.display="grid"),o&&c.length>0&&(o.style.display="block")}catch(n){console.error("Error loading player profile:",n),e&&(e.style.display="none")}}function di(){$t&&($t.style.display="none")}const Ea=8,bd=4.3,ys=80,ws=90,Ss=500;let yo=[],wo=[],kt=[],Jt=[],Oa=[],mo=[],nt=[],ft=0,ue=null,ln=null,ce=null,No=null,We=[];function Md(){const a=new gl(.2,16),e=new lt({transparent:!0,depthWrite:!1,blending:Pi,uniforms:{color:{value:new re(8545340)}},vertexShader:`
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
    `});ue=new Yn(a,e,ys),ue.renderOrder=1,ln=new Float32Array(ys),ue.geometry.setAttribute("instanceOpacity",new Kn(ln,1)),ue.count=0;const t=new _s(.05,8,8),o=new lt({transparent:!0,depthWrite:!1,uniforms:{color:{value:new re(8965375)}},vertexShader:`
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
    `});ce=new Yn(t,o,Ss),ce.renderOrder=2,No=new Float32Array(Ss),ce.geometry.setAttribute("instanceOpacity",new Kn(No,1)),ce.count=0,yo=[],wo=[],kt=[],Jt=[],Oa=[],mo=[],nt=[],We=[],ft=0}function Er(a,e,t){const o=e.length;for(let n=0;n<o;n++){const s=e[n],{beamMesh:i,beamMaterial:l}=Td(s);a.add(i),yo.push(i),wo.push(l);const r=xd(s,t);a.add(r),kt.push(r);const{particles:u,particleVelocities:c}=Pd(s);a.add(u),Jt.push(u),Oa.push(c)}ue&&!ue.parent&&a.add(ue),ce&&!ce.parent&&a.add(ce)}function Td(a){const e=new Ls(1.5,1.5,Ea,32,1,!0),t=new lt({transparent:!0,side:dt,depthWrite:!1,depthTest:!0,vertexShader:`
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
    `,uniforms:{uTime:{value:0},uColor:{value:new w(1,1,0)},uPulseIntensity:{value:0}}}),o=new ge(e,t);return o.position.set(a.x,Ea/2,a.z),o.renderOrder=5,{beamMesh:o,beamMaterial:t}}function xd(a,e){const o=Fo({startX:a.x,startZ:a.z,endX:a.x,endZ:a.z,cloudTexture:e,rainCount:200,cloudHeight:14}),n=o.userData.cloud,s=o.userData.cloudMaterial;return n.scale.set(1.26,.42,1.6),s.uniforms.base.value.setRGB(.8,.9,1),s.uniforms.threshold.value=.25,s.uniforms.opacity.value=0,n.visible=!0,n.renderOrder=10,s.depthTest=!1,o}function Pd(a){const e=new yn,t=new Float32Array(ws*3),o=[];for(let i=0;i<ws;i++){const l=Math.random()*Math.PI*2,r=Math.random()*1.3;t[i*3]=Math.cos(l)*r,t[i*3+1]=Math.random()*Ea,t[i*3+2]=Math.sin(l)*r,o.push({y:.5+Math.random()*1,angle:l,radius:r,angleSpeed:(Math.random()-.5)*.5})}e.setAttribute("position",new ro(t,3));const n=new Is({color:16776960,size:.1,transparent:!0,opacity:.6,blending:vl,depthWrite:!1}),s=new Cs(e,n);return s.position.set(a.x,0,a.z),{particles:s,particleVelocities:o}}function Ed(a,e){const t=Math.sin(Date.now()*.003)*.1+.9,o=yo.length;for(let n=0;n<o;n++){e&&e[n]&&(e[n].emissiveIntensity=t*.5),wo[n].uniforms.uTime.value+=a,ft>0&&(ft-=a*bd,ft=Math.max(0,ft)),wo[n].uniforms.uPulseIntensity.value=ft;const s=1+ft*.04;yo[n].scale.set(s,1,s)}}function Dd(a){const e=Jt.length;for(let t=0;t<e;t++){const o=Jt[t].geometry,n=Oa[t],s=o.attributes.position.array;for(let i=0;i<ws;i++){const l=n[i];s[i*3+1]+=l.y*a,l.angle+=l.angleSpeed*a,s[i*3]=Math.cos(l.angle)*l.radius,s[i*3+2]=Math.sin(l.angle)*l.radius,s[i*3+1]>Ea&&(s[i*3+1]=0)}o.attributes.position.needsUpdate=!0}}function _d(a,e,t,o,n,s){const i=e.length;a.forEach(l=>{let r=1/0,u=-1;for(let c=0;c<i;c++){const d=Math.sqrt(Math.pow(l.body.position.x-e[c].x,2)+Math.pow(l.body.position.z-e[c].z,2));d<r&&(r=d,u=c)}r<1.5&&!o.has(l)&&(o.add(l),n(),ft=1,s(),t.removeBody(l.body),mo.push({ball:l,targetIndex:u,startY:l.body.position.y,targetY:Ea,progress:0,originalScale:1,particleEmitter:{particles:[],lastEmitTime:0}}))})}function Id(a,e,t){for(let o=mo.length-1;o>=0;o--){const n=mo[o],s=n.ball,i=t[n.targetIndex];n.progress+=e*.3;const l=Math.min(n.progress,1),r=l*l*(3-2*l);s.body.position.y=n.startY+(n.targetY-n.startY)*r,s.body.position.x+=(i.x-s.body.position.x)*e*2,s.body.position.z+=(i.z-s.body.position.z)*e*2,s.mesh.position.copy(s.body.position);const u=.6;if(l>u){const h=1-(l-u)/(1-u);s.mesh.scale.set(h,h,h)}const c=Date.now();if(c-n.particleEmitter.lastEmitTime>30&&ce&&We.length<Ss){const d=Math.random()*Math.PI*2,h=Math.random()*s.radius*.8,p=new w(s.body.position.x+Math.cos(d)*h,s.body.position.y+(Math.random()-.5)*s.radius,s.body.position.z+Math.sin(d)*h),f=We.length,g={instanceIndex:f,position:p,velocity:{x:(Math.random()-.5)*.5,y:1+Math.random()*.5,z:(Math.random()-.5)*.5},life:0,maxLife:.8,initialScale:1};We.push(g),n.particleEmitter.particles.push(g);const v=new Bt;v.compose(p,new zt,new w(1,1,1)),ce.setMatrixAt(f,v),No[f]=.6,ce.count=We.length,ce.instanceMatrix.needsUpdate=!0,ce.geometry.attributes.instanceOpacity.needsUpdate=!0,n.particleEmitter.lastEmitTime=c}l>=1&&(a.remove(s.mesh),s.active=!1,n.particleEmitter.particles=[],mo.splice(o,1))}Cd(e)}function Cd(a){if(!ce||We.length===0)return;let e=!1,t=!1;for(let o=We.length-1;o>=0;o--){const n=We[o];n.life+=a,n.position.x+=n.velocity.x*a,n.position.y+=n.velocity.y*a,n.position.z+=n.velocity.z*a;const s=n.life/n.maxLife,i=.6*(1-s),l=n.initialScale*(1-s*.5),r=new Bt;if(r.compose(n.position,new zt,new w(l,l,l)),ce.setMatrixAt(n.instanceIndex,r),e=!0,No[n.instanceIndex]=i,t=!0,n.life>=n.maxLife){We.splice(o,1);for(let u=o;u<We.length;u++){We[u].instanceIndex=u;const c=new Bt;ce.getMatrixAt(u+1,c),ce.setMatrixAt(u,c),No[u]=No[u+1]}ce.count=We.length}}e&&(ce.instanceMatrix.needsUpdate=!0),t&&(ce.geometry.attributes.instanceOpacity.needsUpdate=!0)}function Ad(a,e,t,o,n){const s=kt.length;for(let r=0;r<s;r++){const u=kt[r],c=u.userData.cloud;u.userData.cloudMaterial,$n(u,a,e),c.rotation.y+=e*.1}const i=1600,l=t?Date.now()-o:0;if(t&&l>=i)for(let d=0;d<s;d++){const h=kt[d],p=h.userData.cloud,f=h.userData.cloudMaterial,g=p.scale.x,v=g+(8-g)*e*1.5;p.scale.set(v,v*.6,v);const S=f.uniforms.opacity.value,M=isNaN(S)?.3:S+(.3-S)*e*1.5;f.uniforms.opacity.value=M,Jn(h,e),Ua(h,.6)}else for(let r=0;r<s;r++){const u=kt[r],c=u.userData.cloudMaterial;c.uniforms.opacity.value=0,Ua(u,0)}if(t&&n)for(let r=0;r<s;r++)wo[r].uniforms.uColor.value.set(0,1,.3),Jt[r].material.color.setHex(65416)}function Ld(a,e,t){if(!ue){console.error("Trail system not initialized");return}if(e.lastTrailTime&&Date.now()-e.lastTrailTime<50)return;let o;nt.length>=ys?o=nt.shift().instanceIndex:o=nt.length;const n=new Bt,s=e.radius*2.5,i=new w(e.body.position.x,t+.02,e.body.position.z),l=new zt().setFromEuler(new yl(-Math.PI/2,0,0)),r=new w(s,s,1);n.compose(i,l,r),ue.setMatrixAt(o,n),ue.instanceMatrix.needsUpdate=!0,ln[o]=.008,ue.geometry.attributes.instanceOpacity.needsUpdate=!0,ue.count=Math.max(ue.count,nt.length+1),nt.push({instanceIndex:o,opacity:.003,age:0,maxAge:3+Math.random()*2,scale:s}),e.lastTrailTime=Date.now()}function Rd(a){if(!ue)return;let e=!1,t=!1;for(let o=nt.length-1;o>=0;o--){const n=nt[o];n.age+=a;const s=n.age/n.maxAge;n.opacity=(.5-s)*.235,ln[n.instanceIndex]=n.opacity,t=!0;const i=1-s*.43,l=n.scale*i,r=new Bt;ue.getMatrixAt(n.instanceIndex,r);const u=new w,c=new zt,d=new w;r.decompose(u,c,d),d.x=l,d.y=l,r.compose(u,c,d),ue.setMatrixAt(n.instanceIndex,r),e=!0,n.age>=n.maxAge&&(nt.splice(o,1),ue.count=nt.length)}e&&(ue.instanceMatrix.needsUpdate=!0),t&&(ue.geometry.attributes.instanceOpacity.needsUpdate=!0)}function Od(a){[...yo].forEach(e=>{a.remove(e),e.geometry.dispose(),e.material.dispose()}),yo.length=0,wo.length=0,[...kt].forEach(e=>{a.remove(e),e.userData.cloud&&(e.userData.cloud.geometry.dispose(),e.userData.cloud.material.dispose())}),kt.length=0,[...Jt].forEach(e=>{a.remove(e),e.geometry.dispose(),e.material.dispose()}),Jt.length=0,Oa.length=0,nt.length=0,ue&&(ue.count=0),We.length=0,ce&&(ce.count=0),mo.length=0,ft=0}function kd(){yo=[],wo=[],kt=[],Jt=[],Oa=[],mo=[],nt=[],We=[],ue&&(ue.count=0),ce&&(ce.count=0),ft=0}const je=new Mo,qe=new Se;let Mt=!1,Ns=!1,Bs=!1,jo=0,da=0,Le=null,E=null,Da=.88,Zo=0,qo={x:0,y:0},Dn=0,Va=0;const Dr=10,Fd=300;let st=null,Yo=null,oa=null,ct=null,So=null,Ko=null,$o=null,Jo=null,Qo=null;function Ke(){return Ns||Bs||jo>=2}function _r(a){if(!a)return!1;let e=a;for(;e&&e!==document.body;){const t=e.tagName?.toLowerCase();if(t==="button"||t==="input"||t==="select"||t==="textarea"||t==="a"||e.onclick||e.getAttribute("role")==="button"||e.classList?.contains("ui-element")||e.classList?.contains("modal"))return!0;const o=e.id;if(o&&(o.includes("btn")||o.includes("button")||o.includes("modal")||o.includes("overlay")||o.includes("menu")||o.includes("ui")))return!0;e=e.parentElement}return!1}function Hd(a){if(_r(a.target))return;a.button===2&&(Bs=!0),qo={x:a.clientX,y:a.clientY},Dn=Date.now(),qe.x=a.clientX/window.innerWidth*2-1,qe.y=-(a.clientY/window.innerHeight)*2+1,je.setFromCamera(qe,Yo);const e=Ne.filter(n=>n.active).map(n=>n.mesh),t=je.intersectObjects(e);if(t.length>0){const n=t[0].object,s=Ne.find(i=>i.mesh===n);s&&Jo&&Qo&&ar(s,st,Jo,Qo)&&ur(),s&&s.radius>=.15&&(document.body.style.cursor="pointer"),a.preventDefault();return}const o=je.intersectObject(ct);if(o.length>0){const n=o[0].point;if(n.y<So-Da)return;const s=n.clone(),i=s.clone();if(ct.worldToLocal(i),Le={world:s,local:i},Mt=!0,oa.enabled=!1,document.body.style.cursor=Ke()?"s-resize":"n-resize",!E){const r=new Ia(1.1,2.2,46),u=new Lt({color:Ke()?16729156:4474111,transparent:!0,opacity:.4,side:dt,depthWrite:!1});E=new ge(r,u),E.rotation.x=-Math.PI/2,E.renderOrder=3,st.add(E)}E.material.color.setHex(Ke()?16729156:4474111),E.visible=!0,E.position.copy(s),E.position.y+=.05,rr()}}function zd(a){a.button===2&&(Bs=!1);const e={x:a.clientX,y:a.clientY},t=Math.sqrt(Math.pow(e.x-qo.x,2)+Math.pow(e.y-qo.y,2)),o=Date.now()-Dn;if(t<Dr&&o<500&&Le){const n=Ke()?-.8:.8;Ko(Le.local,n),$o(),Zo++}Mt=!1,Le=null,document.body.style.cursor="default",oa.enabled=!0,Tn(),E&&(st.remove(E),E.geometry.dispose(),E.material.dispose(),E=null)}function Nd(a){qe.x=a.clientX/window.innerWidth*2-1,qe.y=-(a.clientY/window.innerHeight)*2+1,je.setFromCamera(qe,Yo);const e=Ne.filter(o=>o.active).map(o=>o.mesh),t=je.intersectObjects(e);if(t.length>0){const o=t[0].object,n=Ne.find(s=>s.mesh===o);n&&n.radius>=.15?document.body.style.cursor="pointer":document.body.style.cursor="default"}else{const o=je.intersectObject(ct);o.length>0&&o[0].point.y>=So-Da?document.body.style.cursor=Ke()?"s-resize":"n-resize":document.body.style.cursor="default"}if(Mt){je.setFromCamera(qe,Yo);const o=je.intersectObject(ct);if(o.length>0){const n=o[0].point.clone();if(n.y<So-Da){Le=null,E&&(E.visible=!1);return}const s=n.clone();if(ct.worldToLocal(s),Le={world:n,local:s},!E){const l=new Ia(1.1,2.2,46),r=new Lt({color:Ke()?16729156:4474111,transparent:!0,opacity:.4,side:dt,depthWrite:!1});E=new ge(l,r),E.rotation.x=-Math.PI/2,E.renderOrder=3,st.add(E)}E.material.color.setHex(Ke()?16729156:4474111),E.visible=!0,E.position.copy(n),E.position.y+=.05}}}function Bd(a){a.key==="Shift"&&(Ns=!0,document.body.style.cursor="s-resize",E&&E.material.color.setHex(16729156))}function Wd(a){a.key==="Shift"&&(Ns=!1,document.body.style.cursor=Mt?"n-resize":"default",E&&E.material.color.setHex(4474111))}function Vd(a){if(_r(a.target))return;jo=a.touches.length;const e=a.touches[0];qo={x:e.clientX,y:e.clientY},Dn=Date.now(),qe.x=e.clientX/window.innerWidth*2-1,qe.y=-(e.clientY/window.innerHeight)*2+1,je.setFromCamera(qe,Yo);const t=Ne.filter(s=>s.active).map(s=>s.mesh),o=je.intersectObjects(t);if(o.length>0){const s=o[0].object,i=Ne.find(l=>l.mesh===s);i&&Jo&&Qo&&ar(i,st,Jo,Qo)&&ur(),i&&i.radius>=.15&&(document.body.style.cursor="pointer"),a.preventDefault();return}const n=je.intersectObject(ct);if(n.length>0){const s=n[0].point;if(s.y<So-Da)return;const i=s.clone(),l=i.clone();if(ct.worldToLocal(l),Le={world:i,local:l},Mt=!0,oa.enabled=!1,document.body.style.cursor=Ke()?"s-resize":"n-resize",!E){const u=new Ia(1.1,2.2,46),c=new Lt({color:Ke()?16729156:4474111,transparent:!0,opacity:.4,side:dt,depthWrite:!1});E=new ge(u,c),E.rotation.x=-Math.PI/2,E.renderOrder=3,st.add(E)}E.material.color.setHex(Ke()?16729156:4474111),E.visible=!0,E.position.copy(i),E.position.y+=.05,rr(),a.preventDefault()}}function Ud(a){jo=a.touches.length;const e=a.touches[0];if(qe.x=e.clientX/window.innerWidth*2-1,qe.y=-(e.clientY/window.innerHeight)*2+1,Mt){je.setFromCamera(qe,Yo);const t=je.intersectObject(ct);if(t.length>0){const o=t[0].point.clone();if(o.y<So-Da){Le=null,E&&(E.visible=!1);return}const n=o.clone();if(ct.worldToLocal(n),Le={world:o,local:n},!E){const i=new Ia(1.1,2.2,46),l=new Lt({color:Ke()?16729156:4474111,transparent:!0,opacity:.4,side:dt,depthWrite:!1});E=new ge(i,l),E.rotation.x=-Math.PI/2,E.renderOrder=3,st.add(E)}E.material.color.setHex(Ke()?16729156:4474111),E.visible=!0,E.position.copy(o),E.position.y+=.05}a.preventDefault()}}function Xd(a){const e=a.changedTouches[0],t={x:e.clientX,y:e.clientY},o=Math.sqrt(Math.pow(t.x-qo.x,2)+Math.pow(t.y-qo.y,2)),n=Date.now()-Dn;o<Dr&&n<500&&Le&&(Date.now()-Va<Fd?(Ko(Le.local,-.8),$o(),Zo++,Va=0):(Ko(Le.local,.8),$o(),Zo++,Va=Date.now())),jo=a.touches.length,jo===0&&(Mt=!1,Le=null,oa.enabled=!0,document.body.style.cursor="default",Tn(),E&&(st.remove(E),E.geometry.dispose(),E.material.dispose(),E=null))}function Gd(){jo=0,Mt=!1,Le=null,oa.enabled=!0,Va=0,document.body.style.cursor="default",Tn(),E&&(st.remove(E),E.geometry.dispose(),E.material.dispose(),E=null)}function jd(a){a.preventDefault()}function Zd(a){st=a.scene,Yo=a.camera,oa=a.controls,ct=a.terrainMesh,So=a.waterLevel,Ko=a.sculptTerrain,$o=a.updateTrimesh,Jo=a.world,Qo=a.ballMaterial,window.addEventListener("mousedown",Hd),window.addEventListener("mouseup",zd),window.addEventListener("mousemove",Nd),window.addEventListener("contextmenu",jd),window.addEventListener("keydown",Bd),window.addEventListener("keyup",Wd),window.addEventListener("touchstart",Vd,{passive:!1}),window.addEventListener("touchmove",Ud,{passive:!1}),window.addEventListener("touchend",Xd),window.addEventListener("touchcancel",Gd)}function qd(){if(Mt&&Le){const a=Date.now();if(a-da>16){const e=Ke()?-4.88:4.98;if(Ko(Le.local,e),Zo++,a-da>10)return $o(),da=a,!0;da=a}}return!1}function Yd(a){a.terrainMesh!==void 0&&(ct=a.terrainMesh),a.waterLevel!==void 0&&(So=a.waterLevel),a.sculptTerrain!==void 0&&(Ko=a.sculptTerrain),a.updateTrimesh!==void 0&&($o=a.updateTrimesh),a.world!==void 0&&(Jo=a.world),a.ballMaterial!==void 0&&(Qo=a.ballMaterial)}function Kd(){E&&st&&(st.remove(E),E.geometry.dispose(),E.material.dispose(),E=null),Mt=!1,Le=null,da=0,Zo=0}function $d(){return Zo}const _a=[];let zn=0;const Bo=[];function Jd(a){const e=new w(.9,.6,.2),t=new w(1,.8,.3),o=new w(1,.6,.4),n=new w(.502,.749,.4),s=new w(.4,.6,.302),i=new w(.6,.85,.5),l=Date.now(),r=1500,u=300,c=()=>{const d=Date.now()-l,h=Math.min(d/r,1),p=1-Math.pow(1-h,3);if(a.uniforms.midLowColor.value.lerpVectors(e,n,p),d>u){const f=Math.min((d-u)/r,1),g=1-Math.pow(1-f,3);a.uniforms.midColor.value.lerpVectors(t,s,g)}if(d>u*2){const f=Math.min((d-u*2)/r,1),g=1-Math.pow(1-f,3);a.uniforms.midHighColor.value.lerpVectors(o,i,g)}d<r+u*2&&requestAnimationFrame(c)};requestAnimationFrame(c)}function Qd(a,e,t,o=1.5,n=[]){const s=[],i=a*20,l={min:.3,max:2.2};let r=0;for(;s.length<a&&r<i;){r++;const u=(Math.random()-.5)*e*.8,c=(Math.random()-.5)*e*.8,d=new w(u,20,c),h=new w(0,-1,0),f=new Mo(d,h).intersectObject(t);if(f.length===0)continue;const g=f[0].point.y;if(g<l.min||g>l.max)continue;let v=!1;const S=[...n,...s];for(const M of S)if(Math.sqrt(Math.pow(u-M.x,2)+Math.pow(c-M.z,2))<o){v=!0;break}v||s.push({x:u,z:c})}return s}function Ir(a){const{scene:e,modelCache:t,terrainMesh:o,modelPath:n,positions:s,baseScale:i,scaleVariation:l,staggerDelay:r,growDuration:u,verticalOffset:c=-.15,startDelay:d=0}=a;if(s.length===0){console.warn(`No positions generated for ${n}, skipping model load`);return}if(!t[n]){console.warn(`Model ${n} not preloaded yet, waiting...`),setTimeout(()=>Ir(a),100);return}console.log(`Using cached model: ${n} for ${s.length} positions`);const h=t[n];s.forEach((p,f)=>{const g=new Kt;h.forEach(oe=>{const he=new ge(oe.geometry,oe.material);he.position.copy(oe.position),he.rotation.copy(oe.rotation),he.scale.copy(oe.scale),he.castShadow=oe.castShadow,he.receiveShadow=oe.receiveShadow,g.add(he)});const v=new w(p.x,20,p.z),S=new w(0,-1,0),y=new Mo(v,S).intersectObject(o);if(y.length===0){console.warn("Tree position not on terrain:",p);return}const b=y[0],T=b.point.y,L=b.face.normal.clone().clone().applyMatrix3(new wl().getNormalMatrix(o.matrixWorld)).normalize();g.rotation.y=Math.random()*Math.PI*2;const I=Math.atan2(p.z,p.x),H=new w(0,1,0),C=Math.acos(Math.max(-1,Math.min(1,H.dot(L)))),B=Math.PI/9,de=Math.min(C*.6,B);g.rotation.x=Math.sin(I)*de,g.rotation.z=-Math.cos(I)*de,g.position.set(p.x,T+c,p.z),g.scale.set(0,0,0),e.add(g),g.userData.swayOffset=Math.random()*Math.PI*2,g.userData.swaySpeed=.8+Math.random()*.4,g.userData.swayAmount=.03+Math.random()*.02,g.userData.baseRotation={x:g.rotation.x,z:g.rotation.z},_a.push(g);const Y=Date.now()+d+f*r,K=i+Math.random()*l,Re=()=>{const oe=Date.now()-Y;if(oe<0){requestAnimationFrame(Re);return}const he=Math.min(oe/u,1),it=(1-Math.pow(1-he,3))*K;g.scale.set(it,it,it),he<1&&requestAnimationFrame(Re)};requestAnimationFrame(Re)})}function eh(a,e,t){const o=[],n=a*25,s=.3,i={min:.3,max:2.2},l=Math.floor(a/6),r=[];for(let c=0;c<l;c++){const d=(Math.random()-.5)*e*.8,h=(Math.random()-.5)*e*.8;r.push({x:d,z:h,radius:1.5+Math.random()*1.5})}let u=0;for(;o.length<a&&u<n;){u++;let c,d;if(Math.random()<.7&&r.length>0){const M=r[Math.floor(Math.random()*r.length)],y=Math.random()*Math.PI*2,b=Math.random()*M.radius;c=M.x+Math.cos(y)*b,d=M.z+Math.sin(y)*b}else c=(Math.random()-.5)*e*.8,d=(Math.random()-.5)*e*.8;const h=new w(c,20,d),p=new w(0,-1,0),g=new Mo(h,p).intersectObject(t);if(g.length===0)continue;const v=g[0].point.y;if(v<i.min||v>i.max)continue;let S=!1;for(const M of o)if(Math.sqrt(Math.pow(c-M.x,2)+Math.pow(d-M.z,2))<s){S=!0;break}S||o.push({x:c,z:d})}return o}function hi(a){const{scene:e,modelCache:t,terrainMesh:o,grassModelPath:n,grassTuftPositions:s,batchIndex:i}=a,l=t[n];s.forEach((r,u)=>{const c=new Kt;l.forEach(y=>{const b=new ge(y.geometry,y.material);b.position.copy(y.position),b.rotation.copy(y.rotation),b.scale.copy(y.scale),b.castShadow=y.castShadow,b.receiveShadow=y.receiveShadow,c.add(b)});const d=new w(r.x,20,r.z),h=new w(0,-1,0),f=new Mo(d,h).intersectObject(o);if(f.length===0){console.warn("Grass tuft position not on terrain:",r);return}const g=f[0].point.y;c.rotation.y=Math.random()*Math.PI*2,c.position.set(r.x,g-.05,r.z),c.scale.set(0,0,0),e.add(c);const v=Date.now()+u*80+500,S=.228+Math.random()*.188,M=()=>{const y=Date.now()-v;if(y<0){requestAnimationFrame(M);return}const T=Math.min(y/800,1),L=(1-Math.pow(1-T,3))*S;c.scale.set(L,L,L),T<1&&requestAnimationFrame(M)};requestAnimationFrame(M)})}function th(a){const{scene:e,terrainMaterial:t,terrainMesh:o,terrainSize:n,modelCache:s}=a;Eu(),Jd(t);const i=[{modelPath:"./models/palm_tree.glb",count:24,minSpacing:1.12,baseScale:.00184,scaleVariation:949e-6,staggerDelay:150,growDuration:1e3,verticalOffset:-.15,startDelay:0},{modelPath:"./models/ivory-cane-palm.glb",count:20,minSpacing:.43,baseScale:.054689,scaleVariation:.04377,staggerDelay:130,growDuration:1100,verticalOffset:-.0812,startDelay:400},{modelPath:"./models/olive-palm.glb",count:6,minSpacing:.73,baseScale:.18,scaleVariation:.077,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/lady-palm.glb",count:5,minSpacing:.69,baseScale:.048,scaleVariation:.042,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/bismarck-palm.glb",count:5,minSpacing:.29,baseScale:.078,scaleVariation:.062,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450}],l=[],r=80;i.forEach((f,g)=>{setTimeout(()=>{const v=Qd(f.count,n,o,f.minSpacing,l);console.log(`Generated ${v.length} positions for ${f.modelPath} (requested ${f.count})`),l.push(...v),Ir({scene:e,modelCache:s,terrainMesh:o,modelPath:f.modelPath,positions:v,baseScale:f.baseScale,scaleVariation:f.scaleVariation,staggerDelay:f.staggerDelay,growDuration:f.growDuration,verticalOffset:f.verticalOffset,startDelay:f.startDelay})},g*r)});const u="./models/tall-grass.glb",c=15,d=4,h=60,p=[];for(let f=0;f<d;f++)setTimeout(()=>{const g=eh(c,n,o);p.push(...g),console.log(`Generated grass batch ${f+1}/${d}: ${g.length} positions`),s[u]?hi({scene:e,modelCache:s,terrainMesh:o,grassModelPath:u,grassTuftPositions:g,batchIndex:f}):(console.warn("Grass model not preloaded yet, waiting..."),setTimeout(()=>{s[u]&&hi({scene:e,modelCache:s,terrainMesh:o,grassModelPath:u,grassTuftPositions:g,batchIndex:f})},90))},400+f*h);setTimeout(()=>{ah(e)},2e3)}function oh(a){if(_a.length===0||(zn++,zn<2))return;zn=0;const e=Math.sin(a*.9);_a.forEach(t=>{if(t.scale.x===0)return;const{swayOffset:o,swaySpeed:n,swayAmount:s,baseRotation:i}=t.userData,l=Math.sin(a*n+o)*e*s;t.rotation.x=i.x+l,t.rotation.z=i.z+l*.7})}async function ah(a){const{GLTFLoader:e}=await St(async()=>{const{GLTFLoader:i}=await Promise.resolve().then(()=>Ic);return{GLTFLoader:i}},void 0),t=new e,o=Math.random()<.6?1:0,n=Math.floor(Math.random()*3),s=Math.floor(Math.random()*4);console.log(`Spawning win seagulls: ${o} flock, ${n} spirals, ${s} singles`),o>0&&t.load("./models/seagulls-flock.glb",i=>{const l=i.scene;if(l.position.set(0,6.28,0),l.scale.set(.026,.026,.026),l.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!1)}),a.add(l),i.animations&&i.animations.length>0){const r=new Ve(l);i.animations.forEach(u=>{const c=r.clipAction(u);c.timeScale=.5,c.play()}),l.userData.mixer=r}l.userData.type="flock",l.userData.bobTime=Math.random()*Math.PI*2,l.userData.bobSpeed=.3,l.userData.bobAmount=1.8,Bo.push(l)});for(let i=0;i<n;i++)t.load("./models/seagulls-spiral.glb",l=>{const r=l.scene,u=(Math.random()-.5)*8,c=(Math.random()-.5)*8,d=5+Math.random()*3;if(r.position.set(u,d,c),r.scale.set(.14,.14,.14),r.traverse(h=>{h.isMesh&&(h.castShadow=!0,h.receiveShadow=!1)}),a.add(r),l.animations&&l.animations.length>0){const h=new Ve(r);l.animations.forEach(p=>{const f=h.clipAction(p);f.timeScale=.55+Math.random()*.2,f.play()}),r.userData.mixer=h}r.userData.type="spiral",r.userData.bobTime=Math.random()*Math.PI*2,r.userData.bobSpeed=.25,r.userData.bobAmount=1.2,Bo.push(r)});for(let i=0;i<s;i++)t.load("./models/seagull-1.glb",l=>{const r=l.scene,u=(Math.random()-.5)*12,c=(Math.random()-.5)*12,d=4.2+Math.random()*4.2;if(r.position.set(u,d,c),r.scale.set(.028,.028,.028),r.traverse(h=>{h.isMesh&&(h.castShadow=!0,h.receiveShadow=!1)}),a.add(r),l.animations&&l.animations.length>0){const h=new Ve(r);l.animations.forEach(p=>{const f=h.clipAction(p);f.timeScale=.6+Math.random()*.3,f.play();const g=Math.random()*p.duration;f.time=g}),r.userData.mixer=h}r.userData.type="single",r.userData.bobTime=Math.random()*Math.PI*2,r.userData.bobSpeed=.35+Math.random()*.1,r.userData.bobAmount=.8,Bo.push(r)})}function nh(a){Bo.forEach(e=>{e.userData.mixer&&e.userData.mixer.update(a),e.userData.bobTime+=a*e.userData.bobSpeed;const t=Math.sin(e.userData.bobTime)*e.userData.bobAmount;e.userData.baseHeight||(e.userData.baseHeight=e.position.y),e.position.y=e.userData.baseHeight+t})}function sh(){Bo.forEach(a=>{a.parent&&a.parent.remove(a),a.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),Bo.length=0}function ih(){_a.forEach(a=>{a.parent&&a.parent.remove(a),a.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),_a.length=0}const rh=new $e,Cr={};function Co(a){return new Promise((e,t)=>{rh.load(a,o=>{const n=[];o.scene.traverse(s=>{s.isMesh&&n.push({geometry:s.geometry,material:s.material,position:s.position.clone(),rotation:s.rotation.clone(),scale:s.scale.clone(),castShadow:!0,receiveShadow:!0})}),Cr[a]=n,console.log(`Preloaded model: ${a}`),e(n)},void 0,o=>{console.error(`Failed to preload model ${a}:`,o),t(o)})})}let za=!1,mi=!1;function lh(){return za||mi?Promise.resolve():(za=!0,console.log("🌴 Lazy loading win celebration models..."),Promise.all([Co("./models/palm_tree.glb"),Co("./models/ivory-cane-palm.glb"),Co("./models/olive-palm.glb"),Co("./models/tall-grass.glb"),Co("./models/lady-palm.glb"),Co("./models/bismarck-palm.glb")]).then(()=>{mi=!0,za=!1,console.log("✅ Win celebration models loaded!")}).catch(a=>{za=!1,console.error("Error preloading models:",a)}))}function ch(){return Cr}window.addEventListener("resize",()=>{V.aspect=window.innerWidth/window.innerHeight,V.updateProjectionMatrix(),De.setSize(window.innerWidth,window.innerHeight)});const x=new bl;x.background=new re(1118719);const V=new Ai(65,window.innerWidth/window.innerHeight,.1,5e3),fo={introEnd:{x:0,y:.82,z:32},introMid:{x:0,y:3.24,z:16},birdsEye:{x:0,y:42,z:0},gameplay:{x:0,y:5.42,z:20.42}};V.position.set(fo.introEnd.x,fo.introEnd.y,fo.introEnd.z);V.lookAt(0,0,0);const De=new Sl({antialias:!0});De.setSize(window.innerWidth,window.innerHeight);De.shadowMap.enabled=!0;De.shadowMap.type=Ml;document.body.appendChild(De.domElement);const uh=ch(),Ee=new Rl(V,De.domElement);Ee.enableDamping=!0;Ee.dampingFactor=.05;Ee.minDistance=8.4;Ee.maxDistance=75;Ee.maxPolarAngle=Math.PI/1.9;Ee.enabled=!1;let bs=!1;const dh=1800;let cn=!1,Fe=new Kt;x.add(Fe);function hh(){bs=!0;const a=Date.now(),e=4100,t=[{...fo.birdsEye},{...fo.introMid},{...fo.introEnd}];function o(){const n=Date.now()-a,s=Math.min(n/e,1),i=s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;let l,r,u;i<.5?(l=i*2,r=t[0],u=t[1]):(l=(i-.5)*2,r=t[1],u=t[2]);const c=l<.5?2*l*l:1-Math.pow(-2*l+2,2)/2;V.position.x=r.x+(u.x-r.x)*c,V.position.y=r.y+(u.y-r.y)*c,V.position.z=r.z+(u.z-r.z)*c,V.lookAt(0,0,0),s<1?requestAnimationFrame(o):bs=!1}o()}function mh(){const a=Date.now(),e={x:V.position.x,y:V.position.y,z:V.position.z},t={...fo.gameplay};function o(){const n=Date.now()-a,s=Math.min(n/dh,1),i=1-Math.pow(1-s,3);V.position.x=e.x+(t.x-e.x)*i,V.position.y=e.y+(t.y-e.y)*i,V.position.z=e.z+(t.z-e.z)*i,V.lookAt(0,0,0),s<1&&requestAnimationFrame(o)}o()}const fh=new Tl(16777215,.486);x.add(fh);const Je=new As(16777215,1.63);Je.position.set(5,10,5);Je.castShadow=!0;Je.shadow.mapSize.width=2048;Je.shadow.mapSize.height=2048;Je.shadow.camera.near=.8;Je.shadow.camera.far=60;Je.shadow.camera.left=-15;Je.shadow.camera.right=15;Je.shadow.camera.top=15;Je.shadow.camera.bottom=-15;Je.shadow.bias=8e-4;Je.shadow.normalBias=.02;x.add(Je);let Ye,Nn;function ph(){Ye=new bn,Ye.scale.setScalar(285e4),x.add(Ye),Nn=new w;const a=Ye.material.uniforms;a.turbidity.value=1.21,a.rayleigh.value=.68,a.mieCoefficient.value=.002,a.mieDirectionalG.value=1.97;const e=ne.degToRad(84),t=ne.degToRad(68);Nn.setFromSphericalCoords(1,e,t),a.sunPosition.value.copy(Nn),De.toneMappingExposure=.5}ph();const Ar=new As(16754022,.4);Ar.position.set(-5,4,-5);x.add(Ar);const be=new _l({gravity:new ot(0,-9.82,0)}),Ws=new Ri("ground"),Wt=new Ri("ball"),gh=new Il(Ws,Wt,{friction:.0022,restitution:.43,contactEquationStiffness:1e7,contactEquationRelaxation:4,frictionEquationStiffness:1e7,frictionEquationRegularizationTime:3});be.addContactMaterial(gh);new Cl(x,be,{color:65280,scale:1});let D=Ht.getCurrentLevel();console.log(`Starting Level ${D.id}: ${D.name}`);let R=ki({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:be,groundMaterial:Ws,shape:D.terrainShape,waterLevel:D.waterLevel});Fe.add(R.mesh);let un=R.size,po=R.mesh,dn=R.geometry,He=R.material,Lr=R.body;dn.attributes.position;R.config.falloffStart;R.config.falloffEnd;R.getHeightAt;let Ft=R.randomPosition,Ms=R.sculpt,Ts=R.updatePhysics;R.simpleNoise;tr(D.spawn);R.setRenderer(De);He.uniforms.uUseWetnessMap.value=!0;He.uniforms.uWetnessMap.value=R.wetnessMap.texture();let Me=D.waterLevel,z=Fi({terrainSize:un,waterLevel:Me});x.add(z.mesh);x.add(z.hemisphereMesh);z.material.uniforms.uUseHeightmap.value=!0;z.material.uniforms.uTerrainHeightmap.value=R.heightmap.texture;z.material.uniforms.uHeightmapWorldSize.value=R.heightmap.worldSize;z.material.uniforms.uHeightmapMinHeight.value=R.heightmap.minHeight;z.material.uniforms.uHeightmapMaxHeight.value=R.heightmap.maxHeight;let Rr=z.mesh,N=z.material;N.uniforms.uTerrainWidthX.value=R.config.islandRadius;N.uniforms.uTerrainWidthZ.value=R.config.islandRadius;N.uniforms.uTerrainHeight.value=.5;const aa=D.terrainShape||{};N.uniforms.uTerrainScaleX.value=aa.scaleX||1;N.uniforms.uTerrainScaleY.value=aa.scaleY||1;N.uniforms.uTerrainIrregularity.value=aa.irregularity||1;N.uniforms.uTerrainBayAngle.value=aa.bay?.angle||0;N.uniforms.uTerrainBayDepth.value=aa.bay?.depth||0;N.uniforms.uTerrainBayWidth.value=aa.bay?.width||0;N.uniforms.uIslandGroupOffset.value.set(Fe.position.x,Fe.position.z);let hn=Hi({scene:x,waterLevel:Me,maxRipples:68});Zd({scene:x,camera:V,controls:Ee,terrainMesh:po,waterLevel:Me,sculptTerrain:Ms,updateTrimesh:Ts,world:be,ballMaterial:Wt});let F={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1,sailfish:!1};D.id>=1&&D.id<2&&(Wi(x),F.shark=!0);D.id>=2&&D.id<3&&(Xi(x),F.mantaRays=!0);D.id>=3&&D.id<4&&(Zi(x,a=>console.log("dolphins ready",a)),F.dolphins=!0);D.id>=4&&D.id<6&&(ji(x),F.whales=!0);D.id===5&&D.id<7&&(qi(x),F.ship=!0);D.id===6&&D.id<7&&(Yi(x),F.sailBoat=!0);D.id===3&&D.id<4&&(Ki(x,be,Wt),F.temple=!0);D.id===8&&D.id<9&&(er(x),F.sailfish=!0);D.id===10&&($i(x),F.whaleShark=!0);D.id===14&&(Ji(x),F.seagulls=!0);D.id>=1&&Qa(x,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:Me,behavior:{swimDepth:Me+-3.6865,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.022,max:.033},levels:[1,2,3,4,5,6,7,8,9,10]},e=>{console.log("Blue fish school loaded:",e.fish.length,"fish"),F.fishSchools=!0});[1,4,11].includes(D.id)&&Qa(x,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:Me,behavior:{swimDepth:Me+-3.1865,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},e=>{console.log("Clownfish school loaded:",e.fish.length,"fish"),F.fishSchools=!0});const go=ql(),vh=gu(x,be,Wt);function yh(){io=!0,Yt=Date.now(),pn=!1,gn=!1,Ht.startLevelTimer(),lh(),m.savedWinPercentage=mt,mt=1.01,nn({scene:x,world:be,ballMaterial:Wt,randomTerrainPosition:Ft,createCloudIndicator:Fo,sharedCloudTexture:go,sky:Ye,renderer:De,water:z}),ea=Date.now()+m.startDelay+m.duration+8e3}zu({levelManager:Ht,animateCameraToGameplay:mh,startGame:yh,transitionToNextLevel:xh});vr(D);yr(D.winPercentage);gr(D);let mn=D.multipleTargets||1,wt=[],bo=[],pt=[];const wh=5;function Sh(a,e,t){for(const o of e){const n=a.x-o.x,s=a.z-o.z;if(Math.sqrt(n*n+s*s)<t)return!1}return!0}for(let a=0;a<mn;a++){let e,t=0;const o=50;do e=Ft(),t++;while(!Sh(e,wt,wh)&&t<o);wt.push(e);const n=new Ls(1.5,1.5,.2,32),s=new wn({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.63,roughness:.7,transparent:!0,opacity:.246,depthWrite:!1}),i=new ge(n,s);i.position.set(e.x,.1,e.z),i.renderOrder=2,Fe.add(i),bo.push(i),pt.push(s)}Md();Er(x,wt,go);let io=!1,_t=!1,xs=0,Ps=!1,no=new Set,mt=D.winPercentage,ea=0,ye=null,Oo=!1,fn=0,Bn=null,Wn=null,Vn=0,Un=0,Yt=0,pn=!1,gn=!1;function bh(){io=!1,_t=!1,x.remove(po),dn.dispose(),He.dispose(),be.removeBody(Lr),R.dispose(),x.remove(Rr),x.remove(z.hemisphereMesh),N.dispose(),z.mesh.geometry.dispose(),z.hemisphereMesh.geometry.dispose(),z.hemisphereMesh.material.dispose(),hn.dispose(),[...Ne].forEach(e=>{x.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose(),be.removeBody(e.body)}),Ne.length=0,yu(),[...bo].forEach(e=>{x.remove(e),e.geometry.dispose(),e.material.dispose()}),bo.length=0,pt.length=0,wt.length=0,Od(x),ye&&(x.remove(ye),ye.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),ye=null),m.cloudData&&(m.cloudData.group&&(x.remove(m.cloudData.group),m.cloudData.group.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})),m.cloudData=null),Cu(),Ye&&(Ye.material.uniforms.turbidity.value=1.21,Ye.material.uniforms.rayleigh.value=.68,Ye.material.uniforms.mieCoefficient.value=.002,De.toneMappingExposure=.5),Kd(),x.remove(Fe),Fe.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())});const a=[];x.children.forEach(e=>{e.isLight||e.isSky||e.isCamera||a.push(e)}),a.forEach(e=>{x.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose())})}),no.clear(),Oo=!1,br(),wr(),Sr(),Fs(),ih(),sh(),F.fishSchools&&hu(x),F.shark&&Ac(x),F.mantaRays&&Bc(x),F.whales&&Uc(x),F.dolphins&&Zc(x),F.ship&&Kc(x),F.sailBoat&&Jc(x),F.sailfish&&pu(x),console.log("Level cleanup complete")}function Mh(a){console.log(`Loading Level ${a}...`),Fe=new Kt,x.add(Fe),Ht.currentLevelId=a,Ht.saveCurrentLevel(),D=Ht.getCurrentLevel(),R=ki({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:be,groundMaterial:Ws,shape:D.terrainShape,waterLevel:D.waterLevel}),Fe.add(R.mesh),un=R.size,po=R.mesh,dn=R.geometry,He=R.material,Lr=R.body,dn.attributes.position,R.config.falloffStart,R.config.falloffEnd,R.getHeightAt,Ft=R.randomPosition,Ms=R.sculpt,Ts=R.updatePhysics,R.simpleNoise,tr(D.spawn),R.setRenderer(De),He.uniforms.uUseWetnessMap.value=!0,He.uniforms.uWetnessMap.value=R.wetnessMap.texture(),vr(D),yr(D.winPercentage),Me=D.waterLevel,z=Fi({terrainSize:un,waterLevel:Me}),x.add(z.mesh),x.add(z.hemisphereMesh),Rr=z.mesh,N=z.material,N.uniforms.uUseHeightmap.value=!0,N.uniforms.uTerrainHeightmap.value=R.heightmap.texture,N.uniforms.uHeightmapWorldSize.value=R.heightmap.worldSize,N.uniforms.uHeightmapMinHeight.value=R.heightmap.minHeight,N.uniforms.uHeightmapMaxHeight.value=R.heightmap.maxHeight,N.uniforms.uTerrainWidthX.value=R.config.islandRadius,N.uniforms.uTerrainWidthZ.value=R.config.islandRadius,N.uniforms.uTerrainHeight.value=.5;const e=D.terrainShape||{};N.uniforms.uTerrainScaleX.value=e.scaleX||1,N.uniforms.uTerrainScaleY.value=e.scaleY||1,N.uniforms.uTerrainIrregularity.value=e.irregularity||1,N.uniforms.uTerrainBayAngle.value=e.bay?.angle||0,N.uniforms.uTerrainBayDepth.value=e.bay?.depth||0,N.uniforms.uTerrainBayWidth.value=e.bay?.width||0,N.uniforms.uIslandGroupOffset.value.set(Fe.position.x,Fe.position.z),hn=Hi({scene:x,waterLevel:Me,maxRipples:68}),Yd({terrainMesh:po,waterLevel:Me,sculptTerrain:Ms,updateTrimesh:Ts}),F={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1,sailfish:!1},D.id>=1&&D.id<2&&(Wi(x),F.shark=!0),D.id>=2&&D.id<3&&(Xi(x),F.mantaRays=!0),D.id>=3&&D.id<4&&(Zi(x),F.dolphins=!0),D.id>=4&&D.id<5&&(ji(x),F.whales=!0),D.id>=5&&D.id<6&&(qi(x),F.ship=!0),D.id>=6&&D.id<7&&(Yi(x),F.sailBoat=!0),D.id>=3&&D.id<4&&(Ki(x,be,Wt),F.temple=!0),D.id===10&&($i(x),F.whaleShark=!0),D.id===14&&(Ji(x),F.seagulls=!0),D.id===8&&(er(x),F.sailfish=!0),D.id>=1&&Qa(x,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:Me,behavior:{swimDepth:Me+-3.4285,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.022,max:.033},levels:[1,2,3,4,5,6,7,8,9,10]},()=>{F.fishSchools=!0}),[1,4,11].includes(D.id)&&Qa(x,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:Me,behavior:{swimDepth:Me+-3.18685,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},()=>{F.fishSchools=!0}),mn=D.multipleTargets||1,wt=[],bo=[],pt=[],kd();function t(n,s,i){for(const l of s){const r=n.x-l.x,u=n.z-l.z;if(r*r+u*u<i*i)return!1}return!0}for(let n=0;n<mn;n++){let s=Ft(),i=0;const l=50;for(;!t(s,wt,5)&&i<l;)s=Ft(),i++;wt.push(s);const r=new Ls(1.5,1.5,.2,32),u=new wn({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.3,roughness:.7,transparent:!0,opacity:.6,depthWrite:!1}),c=new ge(r,u);c.position.set(s.x,.1,s.z),c.renderOrder=2,Fe.add(c),bo.push(c),pt.push(u)}Er(x,wt,go),io=!1,_t=!1,xs=0,Ps=!1,no=new Set,mt=D.winPercentage,ea=0,Oo=!1,Yt=0,pn=!1,gn=!1,Ee.enabled=!1,br();const o=document.getElementById("level-select-modal");o&&(o.classList.add("hidden"),o.style.display="none",o.style.animation=""),Sr(),gr(D,!0),console.log(`Level ${a} loaded successfully!`)}const Ao=Array.from({length:10},()=>new w),Th=Ee.maxDistance;function xh(){if(cn)return;cn=!0,Du(),Pu();const a=Ht.currentLevelId;Wu(),Vu(),wr(),Ee.enabled=!1,Ee.maxDistance=1/0;const e=694,t=new w;V.getWorldDirection(t);const n=Math.atan2(t.z,t.x)+Math.PI,s=ne.degToRad(25),i=n-s,l=n+s;let r,u=0;do{r=Math.random()*Math.PI*2,u++;const _e=(r+Math.PI*2)%(Math.PI*2),Et=(i+Math.PI*2)%(Math.PI*2),J=(l+Math.PI*2)%(Math.PI*2);if(Et<J){if(_e<Et||_e>J)break}else if(_e<Et&&_e>J)break}while(u<100);const c=new w(Math.cos(r)*e,0,Math.sin(r)*e),d=V.position.clone(),h=Ee.target.clone(),p=V.fov,f=new w(z.mesh.position.x,z.mesh.position.y,z.mesh.position.z);V.rotation.x,V.rotation.y,V.rotation.z;const g=Uo(),v=g.playbackRate||1,S=Math.atan2(c.z-d.z,c.x-d.x),M=468,y=e*.38,b=26,T=4.82,A=460,L=Ao[4].set(c.x-Math.cos(S)*A,c.y+T,c.z-Math.sin(S)*A),I=Ao[5].set(d.x+Math.cos(S)*y,M,d.z+Math.sin(S)*y),H=Ao[6].set(c.x-Math.cos(S)*b,c.y+T,c.z-Math.sin(S)*b),C=Math.atan2(c.z-f.z,c.x-f.x),B=Ao[7].set(f.x+Math.cos(C)*y,M,f.z+Math.sin(C)*y),de=Ao[8].set(c.x,f.y,c.z),Y=5600,K=.36;let Re=0,oe=performance.now();const he=_e=>_e<.5?4*_e*_e*_e:1-Math.pow(-2*_e+2,3)/2;let ka=!1,it=!1;const Qe=document.getElementById("level-story-overlay"),Tt=document.getElementById("level-story-text"),To=Ht.getCurrentLevel();Qe&&Tt&&To.story&&(Tt.textContent=To.story,Qe.style.display="block");let xt=!1,Vt=!1;const Qt=Ao[9],Pt=new w,xo=new w;new w;function Po(_e){const Et=Math.min(.033,(_e-oe)/1e3);oe=_e,Re+=Et*1e3;const J=Math.min(Re/Y,1),et=he(J),Ut=1-et,Ie=et*et,na=Ie*et,Eo=Ut*Ut,P=Eo*Ut,O=1+J*.048;g.playbackRate=v*O,V.position.set(P*d.x+3*Eo*et*I.x+3*Ut*Ie*L.x+na*H.x,P*d.y+3*Eo*et*I.y+3*Ut*Ie*L.y+na*H.y,P*d.z+3*Eo*et*I.z+3*Ut*Ie*L.z+na*H.z);const k=65;V.fov=ne.lerp(p,k,et),V.updateProjectionMatrix(),J>=.05&&!it&&(it=!0,N.uniforms.uFoamEnabled.value=!1);const U=.22,q=.62;!xt&&J>=U&&Qe&&(xt=!0,Qe.classList.add("visible")),!Vt&&J>=q&&Qe&&(Vt=!0,Qe.classList.remove("visible"));const j={panOut:.03,panIn:.92,lockNew:1};if(J<j.panOut)Qt.copy(h);else if(J<j.panIn){const ve=(J-j.panOut)/(j.panIn-j.panOut),Dt=he(ve);Pt.set(Math.cos(S),0,Math.sin(S)).multiplyScalar(y*2),xo.copy(V.position).add(Pt).setY(V.position.y-96),Qt.lerpVectors(h,xo,Dt)}else{const ve=(J-j.panIn)/(j.lockNew-j.panIn),Dt=he(ve);Qt.lerpVectors(Qt,c,Dt)}Ee.target.copy(Qt),Ee.update();const se=V.rotation.z,Q=.15;let W=0;if(J<.2){const ve=J/.2;W=Q*ve}else if(J<.35)W=Q;else if(J<.55){const ve=(J-.35)/.2;W=Q*(1-ve)}else W=0;V.rotation.z=se+W,J>=K&&!ka&&(ka=!0,bh(),Mh(a),Fe.position.copy(c));const G=.086,Z=.192,le=1.16,_=.664;let me=f.x,fe=f.z;if(J>G){const ve=(J-G)/(1-G),Dt=Math.max(ve-Z,0),sa=Math.min(Dt/_,3),Oe=sa*sa*(3-2*sa),tt=1+(le-1)*Oe,ia=Math.min(ve*tt,1),eo=he(ia),Do=1-eo;me=Do*Do*f.x+2*Do*eo*B.x+eo*eo*de.x,fe=Do*Do*f.z+2*Do*eo*B.z+eo*eo*de.z}if(z.mesh.position.set(me,z.mesh.position.y,fe),z.hemisphereMesh.position.set(z.mesh.position.x,40.88,z.mesh.position.z),z.material.uniforms.uMeshOffset.value.set(z.mesh.position.x,z.mesh.position.z),J<1){requestAnimationFrame(Po);return}const pe=c.clone().negate();Fe.position.add(pe),z.mesh.position.add(pe),z.material.uniforms.uMeshOffset.value.set(z.mesh.position.x,z.mesh.position.z),z.hemisphereMesh.position.x+=pe.x,z.hemisphereMesh.position.z+=pe.z,V.position.add(pe),Ee.target.copy(c).add(pe),Ee.update(),g.playbackRate=v,Ph()}requestAnimationFrame(Po)}function Ph(){Ee.maxDistance=Th,cn=!1,N.uniforms.uFoamEnabled.value=!0;const a=document.getElementById("level-story-overlay");a&&(a.classList.remove("visible"),a.style.display="none"),D.id>1&&Bu(),console.log("Transition complete – welcome to the new island!")}let Es=!1,Xn=!1,Gn=!1,fi=0,pi=0;document.addEventListener("visibilitychange",()=>{if(document.hidden){Es=!0,pi=Date.now(),vn.stop();const a=ii();Gn=!a.paused,Gn&&(fi=a.volume);const e=Uo();Xn=!e.paused,Xn&&e.pause(),Fs(),_u()}else{Es=!1;const a=Date.now()-pi;fn>0&&(fn+=a),ea>0&&(ea+=a),Yt>0&&(Yt+=a);const e={scene:x,world:be,ballMaterial:Wt,randomTerrainPosition:R.randomPosition,createCloudIndicator:Fo,sharedCloudTexture:go,sky:Ye,renderer:De,water:z};Iu(e,!0),vn.start();const t=Uo();if(Xn&&ks()&&t.play().catch(o=>console.log("Failed to resume background music:",o)),Gn){const o=ii();o.volume=fi,o.play().catch(n=>console.log("Failed to resume jungle sound:",n))}}});const vn=new xl,gi=new Mo,vi=new Mo,Na=new w,Ba=new w,yi=new w,wi=new w;let Si=0;function Ds(){if(Es){De.render(x,V),requestAnimationFrame(Ds);return}const a=vn.getDelta();be.step(1/60,a,3),!cn&&!bs&&Ee.update(),qd();const e=Ne.filter(c=>c.active);e.forEach(c=>{const d=c.body.position.x,h=c.body.position.z,p=c.body.position.y;if(!c.hasSpawnedRipple){const g=p-c.radius,v=c.body.velocity.y;if(v<0&&g<=Me-.685){const M=(Me-g)/Math.abs(v),y=.142,b=d-c.body.velocity.x*M+c.body.velocity.x*y,T=h-c.body.velocity.z*M+c.body.velocity.z*y,A=N.uniforms.uTime.value,L=Zl(b,T,A),I=Me+L-.05;hn.spawnRipple(b,T,{size:c.radius*3,speed:1,color:new re(11197951),y:I}),bu(c.radius),c.hasSpawnedRipple=!0}}if(p-c.radius<Me-.88){c.active=!1,x.remove(c.mesh),be.removeBody(c.body),no.has(c)&&no.delete(c);return}Na.set(d,20,h),Ba.set(0,-1,0),gi.set(Na,Ba);const f=gi.intersectObject(po);if(f.length>0){const g=f[0].point.y;p-c.radius<g-.55&&(c.body.position.y=g+c.radius+.2,c.body.velocity.y=Math.max(0,c.body.velocity.y))}}),vu(a),e.forEach((c,d)=>{c.mesh.position.copy(c.body.position);const h=c.body.position.y-c.radius;Na.set(c.body.position.x,20,c.body.position.z),Ba.set(0,-1,0),vi.set(Na,Ba);const p=vi.intersectObject(po);let f=!1,g=-100;p.length>0&&(g=p[0].point.y,f=h<=g+.3&&g>Me+.5);const v=c.body.velocity,S=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);f&&S>.3&&Ld(x,c,g);for(let M=d+1;M<e.length;M++){const y=e[M];if(!y.active)continue;const b=c.body.position.x-y.body.position.x,T=c.body.position.z-y.body.position.z;if(b*b+T*T>1)continue;const L=c.body.position.y-y.body.position.y,I=Math.sqrt(b*b+L*L+T*T),H=c.radius+y.radius;if(I<H){const C=c.radius>=y.radius?c:y,B=c.radius>=y.radius?y:c,de=c.radius**3+y.radius**3,Y=Math.pow(de,1/3),K=C.body.mass+B.body.mass;C.body.velocity.x=(C.body.velocity.x*C.body.mass+B.body.velocity.x*B.body.mass)/K,C.body.velocity.y=(C.body.velocity.y*C.body.mass+B.body.velocity.y*B.body.mass)/K,C.body.velocity.z=(C.body.velocity.z*C.body.mass+B.body.velocity.z*B.body.mass)/K;const Re=C.originalMass||C.body.mass,oe=B.originalMass||B.body.mass;C.radius=Y,C.body.mass=K,C.originalMass=Re+oe,be.removeBody(C.body),C.body.shapes=[new Ca(Y)],C.body.updateBoundingRadius(),be.addBody(C.body),C.mesh.geometry=La.get(Y),B.active=!1,x.remove(B.mesh),be.removeBody(B.body)}}});const t=3,o=t*t,n=1.5;for(let c=0;c<e.length;c++)for(let d=c+1;d<e.length;d++){const h=e[c],p=e[d],f=p.body.position.x-h.body.position.x,g=p.body.position.z-h.body.position.z;if(f*f+g*g>o)continue;const S=p.body.position.y-h.body.position.y,M=Math.sqrt(f*f+S*S+g*g);if(M<t&&M>.1){const y=f/M,b=S/M,T=g/M,A=n*(1-M/t);h.body.velocity.x+=y*A*a,h.body.velocity.y+=b*A*a,h.body.velocity.z+=T*A*a,p.body.velocity.x-=y*A*a,p.body.velocity.y-=b*A*a,p.body.velocity.z-=T*A*a}}for(let c=0;c<bo.length;c++)bo[c].rotation.y+=a*.5;Ed(a,pt),Dd(a),z.update(N.uniforms.uTime.value+a),Si++,Si%2===0&&(R.wetnessMap.update(De,N,N.uniforms.uTime.value),He.uniforms.uWetnessMap.value=R.wetnessMap.texture()),He.uniforms.uTime.value=N.uniforms.uTime.value,He.uniforms.uWaveAmplitude.value=N.uniforms.uWaveAmplitude.value,He.uniforms.uWaveFrequency.value=N.uniforms.uWaveFrequency.value,He.uniforms.uWaveHeightMultiplier.value=N.uniforms.uWaveHeightMultiplier.value,He.uniforms.uWaterCurvature.value=N.uniforms.uCurvature.value;const s=Fe.position;He.uniforms.uWaterMeshOffset.value.set(N.uniforms.uMeshOffset.value.x-s.x,N.uniforms.uMeshOffset.value.y-s.z),He.uniforms.uWaterMeshPosition.value.set(z.mesh.position.x-s.x,z.mesh.position.z-s.z),N.uniforms.uIslandGroupOffset.value.set(s.x,s.z),hn.update(a),F.shark&&Cc(a),F.mantaRays&&Nc(a,x),F.dolphins&&jc(a),F.whales&&Vc(a),F.ship&&Yc(a),F.sailBoat&&$c(a),F.whaleShark&&Qc(a),F.seagulls&&eu(a),F.fishSchools&&du(a,m.isActive),F.sailfish&&fu(a),_d(e,wt,be,no,Tu,Gu),Id(x,a,wt);let i=0;no.size>0&&no.forEach(c=>{i+=c.originalMass||c.body.mass});const l=Math.min(i/Ha()*100,100);if(Uu(l),Ad(V,a,_t,xs,pt),!_t&&Ha()>0&&i>=Ha()*mt){_t=!0,xs=Date.now(),setTimeout(()=>{const c=i/Ha();console.log(`Final water collected: ${Math.round(c*100)}% (win at ${Math.round(mt*100)}%)`);const d=$d();Ht.completeLevel(3,c,d).then(h=>{console.log("Level completed! Score:",h),h.valid!==!1&&hd(h)})},2e3),xu(),Xu();for(let c=0;c<mn;c++)pt[c]&&(pt[c].color.setHex(255),pt[c].emissive.setHex(255),pt[c].emissiveIntensity=1);Nu(),th({scene:x,terrainMaterial:He,terrainMesh:po,terrainSize:un,modelCache:uh}),Ps=!0}Rd(a),Ps&&(oh(vn.getElapsedTime()),nh(a));const r=m.isActive;Au({gameStarted:io,scene:x,camera:V,dt:a,sky:Ye,renderer:De,updateCloud:$n,updateRainParticles:Jn,setRainOpacity:Ua}),r&&!m.isActive&&m.savedWinPercentage!==void 0&&(mt=m.savedWinPercentage,delete m.savedWinPercentage,console.log("Storm ended - win condition restored!"));const u=Date.now();if(io&&!_t&&!pn&&Yt>0&&u-Yt>=12e4&&(m.isActive||(console.log("🌩️ Second storm incoming!"),pn=!0,m.savedWinPercentage=mt,mt=1.01,nn({scene:x,world:be,ballMaterial:Wt,randomTerrainPosition:Ft,createCloudIndicator:Fo,sharedCloudTexture:go,sky:Ye,renderer:De,water:z},!0))),io&&!_t&&!gn&&Yt>0&&u-Yt>=21e4&&(m.isActive||(console.log("🌩️ Third storm incoming!"),gn=!0,m.savedWinPercentage=mt,mt=1.01,nn({scene:x,world:be,ballMaterial:Wt,randomTerrainPosition:Ft,createCloudIndicator:Fo,sharedCloudTexture:go,sky:Ye,renderer:De,water:z},!1))),io&&ee.enabled&&!_t&&!Oo&&u>=ea&&(Oo=!0,fn=u,Un=0,Vn=u,Bn=Ft(),Wn=Ft(),ye=Fo({startX:Bn.x,startZ:Bn.z,endX:Wn.x,endZ:Wn.z,cloudTexture:go}),x.add(ye),ye.userData.drizzleSound=lr()),Oo&&ye){const c=u-fn,d=Math.min(c/ee.cloudDuration,1),{cloud:h,cloudMaterial:p,startPos:f,endPos:g,baseOpacity:v}=ye.userData,S=f.x+(g.x-f.x)*d,M=f.z+(g.z-f.z)*d;ye.position.x=S,ye.position.z=M,h.visible||(h.visible=!0),h.getWorldPosition(yi);const y=V.position.distanceTo(yi);if(m.isActive&&m.cloudData){const T=m.cloudData.group.userData.cloud;T.getWorldPosition(wi),V.position.distanceTo(wi)>y?(T.renderOrder=10,h.renderOrder=11):(h.renderOrder=10,T.renderOrder=11)}else h.renderOrder=10;$n(ye,V,a),h.rotation.y=-performance.now()/7500;let b;if(c<ee.fadeInDuration){const T=Math.max(0,c/ee.fadeInDuration);b=v*T}else if(c>ee.cloudDuration-ee.fadeOutDuration){const T=(c-(ee.cloudDuration-ee.fadeOutDuration))/ee.fadeOutDuration;b=v*Math.max(0,1-T)}else b=v;p.uniforms.opacity.value=Math.max(0,b),Jn(ye,a),Ua(ye,b*.6),!_t&&Un<ee.dropletsPerCloud&&u-Vn>=ee.dropletInterval&&c>ee.fadeInDuration&&(vh(ye.position.x,ye.position.z),Un++,Vn=u),c>=ee.cloudDuration&&(ye.userData.drizzleSound&&cr(ye.userData.drizzleSound),x.remove(ye),ye.traverse(T=>{T.geometry&&T.geometry.dispose(),T.material&&T.material.dispose()}),ye=null,Oo=!1,ea=u+ee.interval)}De.render(x,V),requestAnimationFrame(Ds)}function Eh(){const a=document.getElementById("page-loading-screen");a&&setTimeout(()=>{a.classList.add("hidden"),setTimeout(()=>{a.remove()},500)},100)}Eh();hh();Ds();
