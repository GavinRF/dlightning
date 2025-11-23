const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/OrbitControls-D99eEBr6.js","assets/three-BM-_dztD.js"])))=>i.map(i=>d[i]);
import{a as pe,c as ct,d as hl,U as Vn,B as gl,V as w,e as q,P as ui,T as yl,R as lo,f as yu,g as na,h as O,i as vu,j as wu,W as Gs,k as $s,l as Xs,L as Tt,O as di,D as At,b as Po,m as Ua,S as co,n as _o,o as Su,p as Tu,G as Ia,q as bu,r as Mu,s as Ds,N as vl,t as Ps,u as xu,v as mi,w as wl,x as Eu,y as to,z as Sl,A as Vt,E as ua,H as uo,I as Iu,J as Du,K as nr,Q as gt,X as mo,Y as Pt,Z as fo,_ as or,$ as Pu,a0 as _u,a1 as Tl,a2 as Au,a3 as Lu,a4 as Cu,a5 as bl,a6 as Ru,a7 as Ou,a8 as qs,a9 as ku,aa as _s,M as oa,ab as Fu,ac as Nu,ad as Bu,ae as Hu,af as zu,ag as Ml,ah as Wu,ai as Vu,aj as Uu,ak as Gu,al as xl,am as $u,an as Er,ao as Ir,ap as Dr,aq as Pr,ar as _r,as as Xu,at as qu,au as Yu,av as ju,aw as As,ax as Ge,ay as Ku,C as sr,az as El,aA as Zu,aB as sn,aC as Ju,F as Ys,aD as Qu,aE as ed,aF as td,aG as ad,aH as nd,aI as od,aJ as sd}from"./three-BM-_dztD.js";import{B as Un,T as id,V as ft,C as rd,a as ld,S as Ao,W as cd,M as Il,b as ud,c as dd}from"./physics-BFZyaTYb.js";import{c as Lo,_ as J}from"./supabase-6RHs7m4s.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();class Ls extends pe{constructor(){const e=Ls.SkyShader,t=new ct({name:e.name,uniforms:Vn.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:hl,depthWrite:!1});super(new gl(1,1,1),t),this.isSky=!0}}Ls.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new w},up:{value:new w(0,1,0)}},vertexShader:`
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

		}`};const{lerp:Ca}=q,ze=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];for(let a=0;a<256;a++)ze[256+a]=ze[a];function js(a){return a*a*a*(a*(a*6-15)+10)}function ya(a,e,t,n){const o=a&15,s=o<8?e:t,i=o<4?t:o==12||o==14?e:n;return((o&1)==0?s:-s)+((o&2)==0?i:-i)}class md{noise(e,t,n){const o=Math.floor(e),s=Math.floor(t),i=Math.floor(n),r=o&255,l=s&255,c=i&255;e-=o,t-=s,n-=i;const d=e-1,u=t-1,m=n-1,f=js(e),p=js(t),g=js(n),y=ze[r]+l,v=ze[y]+c,S=ze[y+1]+c,T=ze[r+1]+l,b=ze[T]+c,x=ze[T+1]+c;return Ca(Ca(Ca(ya(ze[v],e,t,n),ya(ze[b],d,t,n),f),Ca(ya(ze[S],e,u,n),ya(ze[x],d,u,n),f),p),Ca(Ca(ya(ze[v+1],e,t,m),ya(ze[b+1],d,t,m),f),Ca(ya(ze[S+1],e,u,m),ya(ze[x+1],d,u,m),f),p),g)}}function Dl(a={}){const{segments:e=34,normalMapPath:t="sand-normal.jpg",physicsWorld:n,groundMaterial:o,shape:s={},waterLevel:i=-2.87}=a,r=s.size||18,l={scaleX:s.scaleX||1,scaleY:s.scaleY||1,tilt:s.tilt||{angle:0,amount:0},bay:s.bay||{angle:0,depth:0,width:0},irregularity:s.irregularity||1,distortion:s.distortion||{frequency:.5,amplitude:.3,randomness:.2},turbulence:s.turbulence||null,islandRadius:s.islandRadius||r*.365},c=l.islandRadius,d=c+c*0,u=c+c*.26,m=c+c*.75,f=5.8,p=-4.6,g=512,y=new ui(r,r,e,e),v=y.attributes.position;function S(D,N){const B=Math.atan2(N,D),V=Math.sqrt(D*D+N*N),ee=Math.sin(B*3+V*.5)*.4,ne=Math.sin(B*5-V*.3)*.25,ce=Math.sin(B*7+V*.7)*.2;return(ee+ne+ce)*l.irregularity}function T(D,N){const B=D/l.scaleX,V=N/l.scaleY;let ee=Math.sqrt(B*B+V*V);if(l.bay.depth>0){const ne=Math.atan2(N,D),ce=l.bay.angle,te=l.bay.width;let Y=Math.abs(ne-ce);if(Y>Math.PI&&(Y=2*Math.PI-Y),Y<te){const j=Math.cos(Y/te*Math.PI/2);ee+=l.bay.depth*j}}return ee}function b(D,N){if(l.tilt.amount===0)return 0;const B=Math.atan2(N,D),V=l.tilt.angle;return Math.cos(B-V)*l.tilt.amount}function x(D,N){if(!l.turbulence)return 0;const{strength:B=3,scale:V=.3,octaves:ee=3}=l.turbulence;let ne=0,ce=B,te=V,Y=0;for(let j=0;j<ee;j++){const K=Math.sin(D*te+j*10)*Math.cos(N*te+j*5),se=Math.sin((D+N)*te*1.3+j*7),L=Math.cos((D-N)*te*.7+j*3),he=(K+se*.5+L*.3)*ce;ne+=he,Y+=ce,ce*=.5,te*=2}return ne/Y*B}for(let D=0;D<v.count;D++){const N=v.getX(D),B=v.getY(D),V=v.getZ(D),ee=T(N,B),ne=S(N,B)*1.5,ce=c+ne,te=d+ne*.8,Y=u+ne*.6,j=m+ne*.4,K=l.distortion,se=.51+Math.sin(N*K.frequency)*Math.cos(B*K.frequency*1.04)*K.amplitude+Math.random()*K.randomness;let L;if(ee<ce)L=se;else if(ee<te){const be=(ee-ce)/(te-ce),Ze=be*be*(3-2*be);L=se*(1-Ze*.4)}else if(ee<Y){const be=(ee-te)/(Y-te),Ze=be*be*(3-2*be);L=se*.6-Ze*3.5}else if(ee<j){const be=se*.6-3.5,Ze=(ee-Y)/(j-Y),Xn=Ze*Ze*(3-2*Ze);L=be-Xn*(63+be)}else L=-63;L+=b(N,B),ee<Y&&(L+=x(N,B));const he=r/2,ge=Math.abs(N)/he,Ce=Math.abs(B)/he,at=Math.max(ge,Ce),Ct=.85,mt=1;if(at>Ct&&L>i-2){const be=(at-Ct)/(mt-Ct),Ze=be*be*(3-2*be),Xn=i-2;L=Math.min(L,L*(1-Ze)+Xn*Ze)}v.setZ(D,V+L)}v.needsUpdate=!0,y.computeVertexNormals();function _(D){const B=D.attributes.position,V=D.attributes.uv,ee=D.index,ne=e+1,ce=[],te=[],Y=[];for(let L=0;L<B.count;L++)ce.push(B.getX(L),B.getY(L),B.getZ(L)),te.push(V.getX(L),V.getY(L));for(let L=0;L<ee.count;L++)Y.push(ee.getX(L));const j=B.count;for(let L=0;L<B.count;L++)ce.push(B.getX(L),B.getY(L),-63),te.push(V.getX(L),V.getY(L));function K(L,he){return L*ne+he}for(let L=0;L<e;L++){const he=K(0,L),ge=K(0,L+1),Ce=he+j,at=ge+j;Y.push(he,ge,Ce),Y.push(ge,at,Ce)}for(let L=0;L<e;L++){const he=K(e,L),ge=K(e,L+1),Ce=he+j,at=ge+j;Y.push(he,Ce,ge),Y.push(ge,Ce,at)}for(let L=0;L<e;L++){const he=K(L,0),ge=K(L+1,0),Ce=he+j,at=ge+j;Y.push(he,Ce,ge),Y.push(ge,Ce,at)}for(let L=0;L<e;L++){const he=K(L,e),ge=K(L+1,e),Ce=he+j,at=ge+j;Y.push(he,ge,Ce),Y.push(ge,at,Ce)}const se=new Po;return se.setAttribute("position",new Ua(new Float32Array(ce),3)),se.setAttribute("uv",new Ua(new Float32Array(te),2)),se.setIndex(Y),se.computeVertexNormals(),se}const R=_(y);y.dispose();const P=R,E=P.attributes.position;function C(D,N){const B=T(D,N),V=S(D,N)*1.5,ee=c+V,ne=d+V*.8,ce=u+V*.6,te=m+V*.4,Y=.51+Math.sin(D*.5)*Math.cos(N*.52)*.3;let j;if(B<ee)j=Y;else if(B<ne){const K=(B-ee)/(ne-ee),se=K*K*(3-2*K);j=Y*(1-se*.4)}else if(B<ce){const K=(B-ne)/(ce-ne),se=K*K*(3-2*K);j=Y*.6-se*3.5}else if(B<te){const K=Y*.6-3.5,se=(B-ce)/(te-ce),L=se*se*(3-2*se);j=K-L*(63+K)}else j=-63;return j+=b(D,N),j}function k(){const D=(Math.random()-.5)*(r*.8),N=(Math.random()-.5)*(r*.8);return{x:D,z:N}}function G(){const D=[],N=[];for(let V=0;V<E.count;V++)D.push(E.getX(V),E.getY(V),E.getZ(V));const B=P.index;for(let V=0;V<B.count;V++)N.push(B.getX(V));return new id(D,N)}const $=G(),ae=new Un({mass:0,material:o});ae.addShape($),ae.quaternion.setFromEuler(-Math.PI/2,0,0),n.addBody(ae);function ke(){n.removeBody(ae);const D=G();ae.shapes=[D],ae.updateBoundingRadius(),ae.updateAABB(),n.addBody(ae)}let Ee=null;function Pe(D,N){const ee=E.count/2;for(let ne=0;ne<ee;ne++){const ce=E.getX(ne),te=E.getY(ne),Y=ce-D.x,j=te-D.y,K=Y*Y+j*j;if(K<4){const L=1-Math.sqrt(K)/2,ge=E.getZ(ne)+N*L*.02,Ce=Math.max(p,Math.min(f,ge));E.setZ(ne,Ce)}}E.needsUpdate=!0,P.computeVertexNormals(),P.computeBoundingBox(),Ee&&Xt(Ee)}const re=new yl().load(t);re.wrapS=lo,re.wrapT=lo,re.repeat.set(16,16);const _e=new ct({uniforms:Vn.merge([yu.lights,{normalMap:{value:re},oceanDeepColor:{value:new w(.008,.024,.169)},oceanMidColor:{value:new w(.102,.078,.22)},deepColor:{value:new w(.224,.157,.271)},shallowColor:{value:new w(.702,.02,.102)},lowColor:{value:new w(.859,.259,0)},midLowColor:{value:new w(.9,.6,.2)},midColor:{value:new w(1,.8,.3)},midHighColor:{value:new w(1,.6,.4)},highColor:{value:new w(1,.4,.5)},peakColor:{value:new w(1,.859,.933)},uFogColor:{value:new O(943004)},uFogStart:{value:-18.87},uFogEnd:{value:-2.87},depthTest:!0,uTime:{value:0},uWaterLevel:{value:i},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uCausticsDepth:{value:4},uCausticsEnabled:{value:!0},uCausticsIntensity:{value:.15},uCausticsFadeStart:{value:.3},uWaterMeshOffset:{value:new na(0,0)},uWaterMeshPosition:{value:new na(0,0)},uWaterCurvature:{value:2e-5},uWetnessMap:{value:null},uWetnessMapSize:{value:g},uUseWetnessMap:{value:!1},uWinGreenIntensity:{value:0},uWinGreenColor:{value:new w(.075,.302,.082)},uWinGreenColorNight:{value:new w(.05,.15,.08)},uIsNightTime:{value:!1}}]),lights:!0,vertexShader:`
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
      uniform vec3 oceanDeepColor;
      uniform vec3 oceanMidColor;
      uniform vec3 deepColor;
      uniform vec3 shallowColor;
      uniform vec3 lowColor;
      uniform vec3 midLowColor;
      uniform vec3 midColor;
      uniform vec3 midHighColor;
      uniform vec3 highColor;
      uniform vec3 peakColor;
      uniform vec3 uFogColor;
      uniform float uFogStart;
      uniform float uFogEnd;
      // Caustics uniforms
      uniform float uTime;
      uniform float uWaterLevel;
      uniform float uWaveAmplitude;
      uniform float uWaveFrequency;
      uniform float uWaveHeightMultiplier;
      uniform float uCausticsDepth;
      uniform bool uCausticsEnabled;
      uniform float uCausticsIntensity;
      uniform float uCausticsFadeStart;
      uniform vec2 uWaterMeshOffset;      // For wave calculations
      uniform vec2 uWaterMeshPosition;    // For curvature calculations
      uniform float uWaterCurvature;
      // Wetness map uniforms
      uniform sampler2D uWetnessMap;
      uniform float uWetnessMapSize;
      uniform bool uUseWetnessMap;
      // Win effect uniforms
      uniform float uWinGreenIntensity;
      uniform vec3 uWinGreenColor;
      uniform vec3 uWinGreenColorNight;
      uniform bool uIsNightTime;
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

      // Simplex noise for caustics
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626,  // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i); // Avoid truncation effects in permutation
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));

        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
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

      // Caustics pattern - creates network of lines using simplex noise
      float generateCaustics(vec2 worldXZ, float depthFactor) {
        // Breathing effect - expand and contract over time (slow, pronounced)
        float breathe = sin(uTime * 0.08) * 0.25 + 1.0; // Oscillates between 0.75 and 1.25

        // Very slow rotation for subtle organic movement
        float angle = uTime * 0.02;
        mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

        // Apply breathing scale and rotation
        vec2 uv = (worldXZ * rotation) * (1.5 * breathe);

        // First layer - base noise for caustic lines with rocking motion
        // Rock back and forth diagonally (like gentle water sway)
        float rock1 = sin(uTime * 0.06);
        vec2 drift1 = vec2(rock1 * 0.4, rock1 * 0.3);
        float noise1 = snoise(uv * 2.8 + drift1);
        noise1 = noise1 * 0.5 + 0.5;

        // Create thin lines using tight smoothstep and step
        float lines1 = smoothstep(0.08, 0.001, noise1);
        lines1 = step(0.5, lines1);

        // Second layer - wave-like noise with perpendicular rocking
        // Rock in a different direction for variation
        float rock2 = sin(uTime * 0.05 + 1.5); // Phase offset for different rhythm
        vec2 drift2 = vec2(rock2 * -0.25, rock2 * 0.4);
        float noise2 = snoise(uv * 0.8 + drift2);
        noise2 = noise2 * 0.45 + 0.5;

        // Create threshold that oscillates slowly with breathing rhythm
        float threshold = 0.6 + 0.02 * sin(uTime * 0.15);

        // Double smoothstep to create crisp line boundaries
        float lines2 = 1.0 - (smoothstep(threshold + 0.03, threshold + 0.032, noise2) +
                              smoothstep(threshold, threshold - 0.01, noise2));

        // Binary step to sharpen the lines
        lines2 = step(0.5, lines2);

        // Combine both line layers
        float combinedLines = min(lines1 + lines2, 1.0);

        // Modulate by depth factor
        combinedLines *= depthFactor;

        return clamp(combinedLines, 0.0, 1.0);
      }

      void main() {
        // Sample the normal map
        vec3 normalMapSample = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;

        // Transform normal from tangent space to world space
        mat3 tbn = mat3(vTangent, vBitangent, vNormal);
        vec3 perturbedNormal = normalize(tbn * normalMapSample);

        // Height-based color grading - sunset/warm palette
        float height = vPosition.z;
        // All colors are now uniforms for day/night transitions

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
            vec2 wetnessUV = (vPosition.xy / ${r.toFixed(1)}) + 0.5;

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

        // Caustics Effect - simulated light refraction from water surface
        if(uCausticsEnabled) {
          // Calculate water surface height
          vec2 waveCoords = vWorldPosition.xz - uWaterMeshOffset;
          float elevation = getWaveHeight(waveCoords);

          // Curvature effect
          vec2 meshRelativePos = vWorldPosition.xz - uWaterMeshPosition;
          float distFromWaterCenter = length(meshRelativePos);
          float curveBend = distFromWaterCenter * distFromWaterCenter * uWaterCurvature;

          float currentWaterHeight = uWaterLevel + (elevation * uWaveHeightMultiplier) - curveBend;

          // Calculate depth below water surface
          float depthBelowWater = currentWaterHeight - vWorldPosition.y - 0.5;

          // Ensure we're actually underwater (below base water level, not just wave peaks)
          if(depthBelowWater > uCausticsFadeStart) {
            // Depth factor: fades with depth (bottom fadeout)
            float depthFadeFactor = smoothstep(uCausticsDepth, uCausticsFadeStart, depthBelowWater);

            // Surface fade: smooth fadeout near water surface (top fadeout)
            float surfaceFadeFactor = smoothstep(uCausticsFadeStart, uCausticsFadeStart + 0.8, depthBelowWater);

            // Combine both fade factors
            float combinedFade = depthFadeFactor * surfaceFadeFactor;

            // Generate caustic pattern
            float caustics = generateCaustics(waveCoords, combinedFade);

            // Caustics color - cool blue-tinted light, subtle
            vec3 causticsColor = vec3(0.85, 0.95, 1.0) * uCausticsIntensity;

            // Apply caustics additively (brightens terrain) - multiplied by pattern for transparency
            color += causticsColor * caustics;
          }
        }

        // Win Effect - Mottled Green Overlay
        if(uWinGreenIntensity > 0.01) {
          // Only apply green to playable terrain heights (mid-range)
          float greenMask = smoothstep(-1.0, 0.3, height) * (1.0 - smoothstep(2.0, 3.5, height));

          if(greenMask > 0.01) {
            // Multi-scale noise for organic, mottled appearance
            vec2 noiseCoord = vWorldPosition.xz;

            // Large patches (main variation) - bigger, more distinct patches
            float noise1 = smoothNoise(noiseCoord * 0.64) * 0.6;
            // Medium patches (secondary variation) - fill in some gaps
            float noise2 = smoothNoise(noiseCoord * 1.82 + vec2(10.0, 5.0)) * 0.3;
            // Fine detail (texture) - add edge variation
            float noise3 = smoothNoise(noiseCoord * 4.5 + vec2(20.0, 15.0)) * 0.1;

            // Combine noise layers for natural variation
            float mottledPattern = noise1 + noise2 + noise3;

            // Increase contrast to create distinct patches vs clear areas
            mottledPattern = pow(mottledPattern, 2.0) * 1.5;

            // Add threshold - below 0.3, no green at all (creates gaps)
            mottledPattern = smoothstep(0.23, 0.76, mottledPattern);

            // Choose appropriate green color based on time of day
            vec3 baseGreenColor = uIsNightTime ? uWinGreenColorNight : uWinGreenColor;

            // Vary green color intensity based on pattern
            vec3 greenOverlay = baseGreenColor * (0.7 + mottledPattern * 0.3);

            // Apply green overlay with mottled intensity (no base value, fully transparent in gaps)
            float overlayStrength = uWinGreenIntensity * greenMask * mottledPattern;
            color = mix(color, greenOverlay, overlayStrength);
          }
        }

        gl_FragColor = vec4(color, alpha);
      }
    `,transparent:!0,depthWrite:!0}),Te=new pe(P,_e);Te.rotation.x=-Math.PI/2,Te.castShadow=!0,Te.receiveShadow=!0,Te.renderOrder=.5,Te.customDepthMaterial=new vu({depthPacking:wu});const Ae=512,wt=new Gs(Ae,Ae,{minFilter:Tt,magFilter:Tt,format:Xs,type:$s}),Lt=new di(-r/2,r/2,r/2,-r/2,.1,100);Lt.position.set(0,50,0),Lt.lookAt(0,0,0),Lt.updateProjectionMatrix();const Xe=new ct({vertexShader:`
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
    `,uniforms:{uMinHeight:{value:p},uMaxHeight:{value:f}},side:At}),$t=new pe(P,Xe);$t.rotation.x=-Math.PI/2;function Xt(D){if(!D){console.warn("updateHeightmapTexture: renderer not provided");return}const N=D.getRenderTarget();D.setRenderTarget(wt),D.render($t,Lt),D.setRenderTarget(N)}const ln=new Gs(g,g,{minFilter:Tt,magFilter:Tt,format:Xs,type:$s}),cn=new Gs(g,g,{minFilter:Tt,magFilter:Tt,format:Xs,type:$s});let un=ln,Le=cn;const qt=new ui(2,2),le=new di(-1,1,1,-1,0,1),de=new ct({uniforms:{uHeightmap:{value:wt.texture},uPreviousWetness:{value:null},uWaterLevel:{value:i},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uTime:{value:0},uDecayRate:{value:.98},uMinHeight:{value:p},uMaxHeight:{value:f},uTerrainSize:{value:r},uMeshOffset:{value:new na(0,0)},uCurvature:{value:2e-5},uWaterfallPositions:{value:new Array(32).fill(0).map(()=>new w(0,0,0))},uWaterfallCount:{value:0}},vertexShader:`
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
      uniform vec3 uWaterfallPositions[32]; // Max 32 waterfalls
      uniform int uWaterfallCount;
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

        // Add wetness from waterfalls
        for (int i = 0; i < 32; i++) {
          if (i >= uWaterfallCount) break;

          vec3 waterfallPos = uWaterfallPositions[i];
          // waterfallPos.x and waterfallPos.z are world XZ
          // waterfallPos.y is the base height of the waterfall in world Y

          float dist = distance(worldXZ, waterfallPos.xz);
          float waterfallBaseHeight = waterfallPos.y;

          // Wetness radius - fixed size for all waterfalls
          float wetnessRadius = 2.5;

          // Add wetness with smooth falloff based on distance
          float waterfallWetness = smoothstep(wetnessRadius, 0.3, dist);

          // Only add wetness if terrain is at or below waterfall base height
          // This prevents wetness from appearing on terrain above the waterfall
          // Allow wetness up to 1.5 units above base for splash effect
          float heightFactor = smoothstep(waterfallBaseHeight + 2.0, waterfallBaseHeight - 1.0, terrainHeight);

          newWetness = max(newWetness, waterfallWetness * heightFactor * 0.8);
        }

        // Sample previous wetness for temporal persistence
        float previousWetness = texture2D(uPreviousWetness, vUv).r;

        // Decay previous wetness over time
        float decayedWetness = previousWetness * uDecayRate;

        // Take maximum of new wetness and decayed previous wetness
        // This means: if water touches, immediately wet; if not, gradually dry
        float finalWetness = max(newWetness, decayedWetness);

        gl_FragColor = vec4(finalWetness, finalWetness, finalWetness, 1.0);
      }
    `}),ga=new pe(qt,de);function dn(D,N,B){if(!D||!N)return;de.uniforms.uWaterLevel.value=N.uniforms.uWaterLevel?.value??i,de.uniforms.uWaveAmplitude.value=N.uniforms.uWaveAmplitude?.value??.26,de.uniforms.uWaveFrequency.value=N.uniforms.uWaveFrequency?.value??4.2,de.uniforms.uWaveHeightMultiplier.value=N.uniforms.uWaveHeightMultiplier?.value??4.13,de.uniforms.uMeshOffset.value.copy(N.uniforms.uMeshOffset?.value??new na(0,0)),de.uniforms.uCurvature.value=N.uniforms.uCurvature?.value??2e-5,de.uniforms.uTime.value=B,de.uniforms.uPreviousWetness.value=Le.texture;const V=D.getRenderTarget();D.setRenderTarget(un),D.render(ga,le),D.setRenderTarget(V);const ee=un;un=Le,Le=ee}return{mesh:Te,geometry:P,material:_e,body:ae,size:r,getHeightAt:C,randomPosition:k,sculpt:Pe,updatePhysics:ke,simpleNoise:S,config:{size:r,segments:e,islandRadius:c,falloffStart:d,falloffEnd:u,fanOutEnd:m,maxHeight:f,minDepth:p},setColors(D={}){D.midLow&&_e.uniforms.midLowColor.value.copy(D.midLow),D.mid&&_e.uniforms.midColor.value.copy(D.mid),D.midHigh&&_e.uniforms.midHighColor.value.copy(D.midHigh)},heightmap:{renderTarget:wt,texture:wt.texture,camera:Lt,mesh:$t,update:Xt,size:Ae,worldSize:r,minHeight:p,maxHeight:f},setRenderer(D){Ee=D,D&&Xt(D)},wetnessMap:{texture:()=>Le.texture,update:dn,size:g,worldSize:r,setDecayRate(D){de.uniforms.uDecayRate.value=D},setWaterfalls(D){const N=new Array(32).fill(0).map((B,V)=>{if(D&&V<D.length){const ee=D[V];return new w(ee.x,ee.y,ee.z)}return new w(0,0,0)});de.uniforms.uWaterfallPositions.value=N,de.uniforms.uWaterfallCount.value=D&&D.length>0?Math.min(D.length,32):0},dispose(){ln.dispose(),cn.dispose(),de.dispose(),qt.dispose()}},dispose(){wt&&wt.dispose(),$t&&($t.geometry.dispose(),$t.material.dispose()),ln.dispose(),cn.dispose(),de.dispose(),qt.dispose()}}}function fd(a,e,t,n=0,o=0){const l=a-n,c=e-o;function d(y,v){const S=y*3127.1+v*31.7;return Math.sin(S)*43758.5453%1}function u(y,v){const S=Math.floor(y),T=Math.floor(v),b=y-S,x=v-T,_=b*b*b*(b*(b*6-15)+10),R=x*x*x*(x*(x*6-15)+10),P=d(S,T),E=d(S+1,T),C=d(S,T+1),k=d(S+1,T+1),G=P*(1-_)+E*_,$=C*(1-_)+k*_;return G*(1-R)+$*R}function m(y,v){let S=.212,T=.26,b=4.2;for(let x=0;x<2;x++)S+=T*u(y*b,v*b),b*=2.4,T*=.09;return S}const f=m(l*.15+t*.08,c*.15+t*.15),p=m(l*.08-t*.08,c*.08-t*.12);return(f*.5+p*.5-.5)*4.13}function Pl(a={}){const{terrainSize:e,waterLevel:t=-2.87}=a,n=1100,o=new ui(n,n,65,65),s=n-550,i=new ct({transparent:!0,side:At,depthWrite:!1,uniforms:{uTime:{value:0},uWaterColor:{value:new O(43212)},uShallowColor:{value:new O(6740463)},uShineColor:{value:new O(14531583)},fogColor:{value:new O(10541296)},fogNear:{value:180},fogFar:{value:400},uCurvature:{value:2e-5},uClipRadius:{value:s},uWaveAmplitude:{value:.286},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uMeshOffset:{value:new na(0,0)},uTerrainWidthX:{value:18},uTerrainWidthZ:{value:18},uTerrainHeight:{value:.15},uFoamEnabled:{value:!0},uWaterLevel:{value:t},uTerrainScaleX:{value:1},uTerrainScaleY:{value:1},uTerrainIrregularity:{value:1},uTerrainBayAngle:{value:0},uTerrainBayDepth:{value:0},uTerrainBayWidth:{value:0},uIslandGroupOffset:{value:new na(0,0)},uFoamHeightOffset:{value:-.363},uUseHeightmap:{value:!1},uTerrainHeightmap:{value:null},uHeightmapWorldSize:{value:18},uHeightmapMinHeight:{value:-4.6},uHeightmapMaxHeight:{value:5.8}},vertexShader:`
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
    `}),r=new pe(o,i);r.rotation.x=-Math.PI/2,r.position.y=t,r.receiveShadow=!0,r.renderOrder=1;const l=new co(s,26,8,0,Math.PI*2,Math.PI/2,Math.PI/2),c=new ct({side:hl,transparent:!0,depthWrite:!0,uniforms:{uDeepColor:{value:new O(9549)},uShallowColor:{value:new O(3844815)},fogColor:{value:new O(10541296)},fogNear:{value:260},fogFar:{value:420}},vertexShader:`
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
    `}),d=new pe(l,c);return d.position.y=40.88,d.renderOrder=0,{mesh:r,hemisphereMesh:d,material:i,update(u){i.uniforms.uTime.value=u},setColors(u={}){u.water!==void 0&&i.uniforms.uWaterColor.value.set(u.water),u.shallow!==void 0&&i.uniforms.uShallowColor.value.set(u.shallow),u.shine!==void 0&&i.uniforms.uShineColor.value.set(u.shine)},setWaveChoppiness(u,m){u!==void 0&&(i.uniforms.uWaveHeightMultiplier.value=u),m!==void 0&&(i.uniforms.uWaveAmplitude.value=m)}}}function _l(a={}){const{scene:e,waterLevel:t=-2.87,maxRipples:n=50}=a,o=[],s=[];let i=0;const r=new _o(.1,.2,32),l=()=>new ct({transparent:!0,side:At,depthWrite:!1,uniforms:{uProgress:{value:0},uRadius:{value:1},uColor:{value:new O(16777215)}},vertexShader:`
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
      `});for(let m=0;m<n;m++){const f=l(),p=new pe(r,f);p.rotation.x=-Math.PI/2,p.visible=!1,p.renderOrder=2,e.add(p),s.push(p)}function c(m,f,p={}){const{size:g=1,speed:y=1,color:v=new O(16777215),y:S=null}=p;let T=s[i];if(i=(i+1)%n,!T)return;if(T.visible){const R=o.findIndex(P=>P.mesh===T);R!==-1&&o.splice(R,1)}const b=S!==null?S:t-.685;T.position.set(m,b,f),T.visible=!0,T.material.uniforms.uProgress.value=.0182,T.material.uniforms.uRadius.value=g,T.material.uniforms.uColor.value.copy(v);const x=2*g;T.scale.set(x,x,1);const _={mesh:T,progress:.114,speed:y*.4,maxScale:x*3.5,baseScale:x};o.push(_)}function d(m){for(let f=o.length-1;f>=0;f--){const p=o[f];p.progress+=m*p.speed,p.mesh.material.uniforms.uProgress.value=p.progress;const g=p.baseScale+(p.maxScale-p.baseScale)*p.progress;p.mesh.scale.set(g,g,1),p.progress>=1&&(p.mesh.visible=!1,o.splice(f,1))}}function u(){s.forEach(m=>{e.remove(m),m.material.dispose()}),r.dispose(),o.length=0,s.length=0}return{spawnRipple:c,update:d,dispose:u}}function pd(){const e=new Uint8Array(2097152);let t=0;const n=.05,o=new md,s=new w;for(let r=0;r<128;r++)for(let l=0;l<128;l++)for(let c=0;c<128;c++){const d=1-s.set(c,l,r).subScalar(64).divideScalar(128).length();e[t]=(168+127.6*o.noise(c*n/1.53,l*n,r*n/1.51))*d*d,t++}const i=new Su(e,128,128,128);return i.format=Tu,i.minFilter=Tt,i.magFilter=Tt,i.unpackAlignment=1,i.needsUpdate=!0,i}function Tn(a={}){const{startX:e,startZ:t,endX:n,endZ:o,cloudHeight:s=13.2,cloudTexture:i,baseOpacity:r=.43,rainCount:l=100,timeOfDay:c="day"}=a,d=new Ia,u=`
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
  `,m=`
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
    uniform float brightnessFactor;

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
        col *= brightnessFactor; // Scale brightness for night/day

        ac.rgb += (1.0 - ac.a) * d * col;
        ac.a += (1.0 - ac.a) * d;

        if (ac.a >= 0.95) break;

        p += rayDir * delta;
      }

      color = linearToSRGB(ac);

      if (color.a == 0.0) discard;
    }
  `,f=new gl(15,8,15),p=new O(7965344);let g=1;c==="night"&&(p.multiplyScalar(.35),g=.135);const y=new bu({glslVersion:Mu,uniforms:{base:{value:p},map:{value:i},cameraPos:{value:new w},threshold:{value:.25},opacity:{value:0},range:{value:.08},steps:{value:40},frame:{value:0},textureRotation:{value:0},brightnessFactor:{value:g}},vertexShader:u,fragmentShader:m,side:At,transparent:!0,depthWrite:!1,depthTest:!1}),v=new pe(f,y);v.position.y=s,v.scale.set(11.11,6.12,8.3),v.visible=!1,v.renderOrder=6,d.add(v);const S=new Po,T=new Float32Array(l*3),b=[],x=.8,_=.3;for(let E=0;E<l;E++){const C=Math.random()*Math.PI*2,k=Math.random()*3.2;T[E*3]=Math.cos(C)*k,T[E*3+1]=s-Math.random()*4,T[E*3+2]=Math.sin(C)*k,b.push({initialY:T[E*3+1],initialX:T[E*3],initialZ:T[E*3+2],speed:2+Math.random()*3})}S.setAttribute("position",new Ua(T,3));const R=new Ds({color:7258367,size:.16,transparent:!0,opacity:0,blending:vl,depthWrite:!1,depthTest:!0}),P=new Ps(S,R);return P.renderOrder=5,d.add(P),d.position.set(e,0,t),d.userData={cloud:v,cloudMaterial:y,rainParticles:P,rainVelocities:b,windDriftX:x,windDriftZ:_,creationTime:Date.now(),startPos:{x:e,z:t},endPos:{x:n,z:o},baseOpacity:r,drizzleSound:null},d}function fi(a,e,t=0){const{cloudMaterial:n}=a.userData;n.uniforms.cameraPos.value.copy(e.position),n.uniforms.frame.value++,n.uniforms.textureRotation.value+=t*.3;const o=n.uniforms.frame.value*.02;n.uniforms.steps.value=50+Math.sin(o)*15}function pi(a,e){const{rainParticles:t,rainVelocities:n,windDriftX:o,windDriftZ:s}=a.userData;if(t.material.opacity<.01)return;const i=t.geometry.attributes.position.array;for(let r=0;r<n.length;r++){const l=n[r];i[r*3+1]-=l.speed*e,i[r*3]+=o*e,i[r*3+2]+=s*e,i[r*3+1]<.1&&(i[r*3+1]=l.initialY,i[r*3]=l.initialX,i[r*3+2]=l.initialZ)}t.geometry.attributes.position.needsUpdate=!0}function jo(a,e){const{rainParticles:t}=a.userData;t.material.opacity=Math.max(0,Math.min(1,e))}function Ar(a,e){if(e===xu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),a;if(e===mi||e===wl){let t=a.getIndex();if(t===null){const i=[],r=a.getAttribute("position");if(r!==void 0){for(let l=0;l<r.count;l++)i.push(l);a.setIndex(i),t=a.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),a}const n=t.count-2,o=[];if(e===mi)for(let i=1;i<=n;i++)o.push(t.getX(0)),o.push(t.getX(i)),o.push(t.getX(i+1));else for(let i=0;i<n;i++)i%2===0?(o.push(t.getX(i)),o.push(t.getX(i+1)),o.push(t.getX(i+2))):(o.push(t.getX(i+2)),o.push(t.getX(i+1)),o.push(t.getX(i)));o.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=a.clone();return s.setIndex(o),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),a}class Ke extends Eu{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new wd(t)}),this.register(function(t){return new Sd(t)}),this.register(function(t){return new _d(t)}),this.register(function(t){return new Ad(t)}),this.register(function(t){return new Ld(t)}),this.register(function(t){return new bd(t)}),this.register(function(t){return new Md(t)}),this.register(function(t){return new xd(t)}),this.register(function(t){return new Ed(t)}),this.register(function(t){return new vd(t)}),this.register(function(t){return new Id(t)}),this.register(function(t){return new Td(t)}),this.register(function(t){return new Pd(t)}),this.register(function(t){return new Dd(t)}),this.register(function(t){return new gd(t)}),this.register(function(t){return new Cd(t)}),this.register(function(t){return new Rd(t)})}load(e,t,n,o){const s=this;let i;if(this.resourcePath!=="")i=this.resourcePath;else if(this.path!==""){const c=to.extractUrlBase(e);i=to.resolveURL(c,this.path)}else i=to.extractUrlBase(e);this.manager.itemStart(e);const r=function(c){o?o(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Sl(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,i,function(d){t(d),s.manager.itemEnd(e)},r)}catch(d){r(d)}},n,r)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,o){let s;const i={},r={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Al){try{i[X.KHR_BINARY_GLTF]=new Od(e)}catch(u){o&&o(u);return}s=JSON.parse(i[X.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){o&&o(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new qd(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let d=0;d<this.pluginCallbacks.length;d++){const u=this.pluginCallbacks[d](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),r[u.name]=u,i[u.name]=!0}if(s.extensionsUsed)for(let d=0;d<s.extensionsUsed.length;++d){const u=s.extensionsUsed[d],m=s.extensionsRequired||[];switch(u){case X.KHR_MATERIALS_UNLIT:i[u]=new yd;break;case X.KHR_DRACO_MESH_COMPRESSION:i[u]=new kd(s,this.dracoLoader);break;case X.KHR_TEXTURE_TRANSFORM:i[u]=new Fd;break;case X.KHR_MESH_QUANTIZATION:i[u]=new Nd;break;default:m.indexOf(u)>=0&&r[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(i),c.setPlugins(r),c.parse(n,o)}parseAsync(e,t){const n=this;return new Promise(function(o,s){n.parse(e,t,o,s)})}}function hd(){let a={};return{get:function(e){return a[e]},add:function(e,t){a[e]=t},remove:function(e){delete a[e]},removeAll:function(){a={}}}}const X={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class gd{constructor(e){this.parser=e,this.name=X.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,o=t.length;n<o;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let o=t.cache.get(n);if(o)return o;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const d=new O(16777215);l.color!==void 0&&d.setRGB(l.color[0],l.color[1],l.color[2],ua);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new nr(d),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Du(d),c.distance=u;break;case"spot":c=new Iu(d),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Ot(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),o=Promise.resolve(c),t.cache.add(n,o),o}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],r=(s.extensions&&s.extensions[this.name]||{}).light;return r===void 0?null:this._loadLight(r).then(function(l){return n._getNodeRef(t.cache,r,l)})}}class yd{constructor(){this.name=X.KHR_MATERIALS_UNLIT}getMaterialType(){return oa}extendParams(e,t,n){const o=[];e.color=new O(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const i=s.baseColorFactor;e.color.setRGB(i[0],i[1],i[2],ua),e.opacity=i[3]}s.baseColorTexture!==void 0&&o.push(n.assignTexture(e,"map",s.baseColorTexture,uo))}return Promise.all(o)}}class vd{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=o.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class wd{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[],i=o.extensions[this.name];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){const r=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new na(r,r)}return Promise.all(s)}}class Sd{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=o.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class Td{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[],i=o.extensions[this.name];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}}class bd{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new O(0,0,0),t.sheenRoughness=0,t.sheen=1;const i=o.extensions[this.name];if(i.sheenColorFactor!==void 0){const r=i.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],ua)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",i.sheenColorTexture,uo)),i.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}}class Md{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[],i=o.extensions[this.name];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(s)}}class xd{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[],i=o.extensions[this.name];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;const r=i.attenuationColor||[1,1,1];return t.attenuationColor=new O().setRGB(r[0],r[1],r[2],ua),Promise.all(s)}}class Ed{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=o.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class Id{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[],i=o.extensions[this.name];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",i.specularTexture));const r=i.specularColorFactor||[1,1,1];return t.specularColor=new O().setRGB(r[0],r[1],r[2],ua),i.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",i.specularColorTexture,uo)),Promise.all(s)}}class Dd{constructor(e){this.parser=e,this.name=X.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[],i=o.extensions[this.name];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(s)}}class Pd{constructor(e){this.parser=e,this.name=X.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Vt}extendMaterialParams(e,t){const n=this.parser,o=n.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const s=[],i=o.extensions[this.name];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}}class _d{constructor(e){this.parser=e,this.name=X.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,o=n.textures[e];if(!o.extensions||!o.extensions[this.name])return null;const s=o.extensions[this.name],i=t.options.ktx2Loader;if(!i){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,i)}}class Ad{constructor(e){this.parser=e,this.name=X.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,o=n.json,s=o.textures[e];if(!s.extensions||!s.extensions[t])return null;const i=s.extensions[t],r=o.images[i.source];let l=n.textureLoader;if(r.uri){const c=n.options.manager.getHandler(r.uri);c!==null&&(l=c)}return n.loadTextureImage(e,i.source,l)}}class Ld{constructor(e){this.parser=e,this.name=X.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,o=n.json,s=o.textures[e];if(!s.extensions||!s.extensions[t])return null;const i=s.extensions[t],r=o.images[i.source];let l=n.textureLoader;if(r.uri){const c=n.options.manager.getHandler(r.uri);c!==null&&(l=c)}return n.loadTextureImage(e,i.source,l)}}class Cd{constructor(e){this.name=X.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const o=n.extensions[this.name],s=this.parser.getDependency("buffer",o.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(r){const l=o.byteOffset||0,c=o.byteLength||0,d=o.count,u=o.byteStride,m=new Uint8Array(r,l,c);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(d,u,m,o.mode,o.filter).then(function(f){return f.buffer}):i.ready.then(function(){const f=new ArrayBuffer(d*u);return i.decodeGltfBuffer(new Uint8Array(f),d,u,m,o.mode,o.filter),f})})}else return null}}class Rd{constructor(e){this.name=X.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const o=t.meshes[n.mesh];for(const c of o.primitives)if(c.mode!==pt.TRIANGLES&&c.mode!==pt.TRIANGLE_STRIP&&c.mode!==pt.TRIANGLE_FAN&&c.mode!==void 0)return null;const i=n.extensions[this.name].attributes,r=[],l={};for(const c in i)r.push(this.parser.getDependency("accessor",i[c]).then(d=>(l[c]=d,l[c])));return r.length<1?null:(r.push(this.parser.createNodeMesh(e)),Promise.all(r).then(c=>{const d=c.pop(),u=d.isGroup?d.children:[d],m=c[0].count,f=[];for(const p of u){const g=new gt,y=new w,v=new Pt,S=new w(1,1,1),T=new mo(p.geometry,p.material,m);for(let b=0;b<m;b++)l.TRANSLATION&&y.fromBufferAttribute(l.TRANSLATION,b),l.ROTATION&&v.fromBufferAttribute(l.ROTATION,b),l.SCALE&&S.fromBufferAttribute(l.SCALE,b),T.setMatrixAt(b,g.compose(y,v,S));for(const b in l)if(b==="_COLOR_0"){const x=l[b];T.instanceColor=new fo(x.array,x.itemSize,x.normalized)}else b!=="TRANSLATION"&&b!=="ROTATION"&&b!=="SCALE"&&p.geometry.setAttribute(b,l[b]);or.prototype.copy.call(T,p),this.parser.assignFinalMaterial(T),f.push(T)}return d.isGroup?(d.clear(),d.add(...f),d):f[0]}))}}const Al="glTF",qn=12,Lr={JSON:1313821514,BIN:5130562};class Od{constructor(e){this.name=X.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,qn),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Al)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const o=this.header.length-qn,s=new DataView(e,qn);let i=0;for(;i<o;){const r=s.getUint32(i,!0);i+=4;const l=s.getUint32(i,!0);if(i+=4,l===Lr.JSON){const c=new Uint8Array(e,qn+i,r);this.content=n.decode(c)}else if(l===Lr.BIN){const c=qn+i;this.body=e.slice(c,c+r)}i+=r}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class kd{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=X.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,o=this.dracoLoader,s=e.extensions[this.name].bufferView,i=e.extensions[this.name].attributes,r={},l={},c={};for(const d in i){const u=hi[d]||d.toLowerCase();r[u]=i[d]}for(const d in e.attributes){const u=hi[d]||d.toLowerCase();if(i[d]!==void 0){const m=n.accessors[e.attributes[d]],f=bn[m.componentType];c[u]=f.name,l[u]=m.normalized===!0}}return t.getDependency("bufferView",s).then(function(d){return new Promise(function(u,m){o.decodeDracoFile(d,function(f){for(const p in f.attributes){const g=f.attributes[p],y=l[p];y!==void 0&&(g.normalized=y)}u(f)},r,c,ua,m)})})}}class Fd{constructor(){this.name=X.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Nd{constructor(){this.name=X.KHR_MESH_QUANTIZATION}}class Ll extends qu{constructor(e,t,n,o){super(e,t,n,o)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,o=this.valueSize,s=e*o*3+o;for(let i=0;i!==o;i++)t[i]=n[s+i];return t}interpolate_(e,t,n,o){const s=this.resultBuffer,i=this.sampleValues,r=this.valueSize,l=r*2,c=r*3,d=o-t,u=(n-t)/d,m=u*u,f=m*u,p=e*c,g=p-c,y=-2*f+3*m,v=f-m,S=1-y,T=v-m+u;for(let b=0;b!==r;b++){const x=i[g+b+r],_=i[g+b+l]*d,R=i[p+b+r],P=i[p+b]*d;s[b]=S*x+T*_+y*R+v*P}return s}}const Bd=new Pt;class Hd extends Ll{interpolate_(e,t,n,o){const s=super.interpolate_(e,t,n,o);return Bd.fromArray(s).normalize().toArray(s),s}}const pt={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},bn={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Cr={9728:bl,9729:Tt,9984:Cu,9985:Lu,9986:Au,9987:Tl},Rr={33071:Ou,33648:Ru,10497:lo},Ks={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},hi={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},va={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},zd={CUBICSPLINE:void 0,LINEAR:xl,STEP:Gu},Zs={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Wd(a){return a.DefaultMaterial===void 0&&(a.DefaultMaterial=new _s({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Xu})),a.DefaultMaterial}function Ra(a,e,t){for(const n in t.extensions)a[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ot(a,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(a.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Vd(a,e,t){let n=!1,o=!1,s=!1;for(let c=0,d=e.length;c<d;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(o=!0),u.COLOR_0!==void 0&&(s=!0),n&&o&&s)break}if(!n&&!o&&!s)return Promise.resolve(a);const i=[],r=[],l=[];for(let c=0,d=e.length;c<d;c++){const u=e[c];if(n){const m=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):a.attributes.position;i.push(m)}if(o){const m=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):a.attributes.normal;r.push(m)}if(s){const m=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):a.attributes.color;l.push(m)}}return Promise.all([Promise.all(i),Promise.all(r),Promise.all(l)]).then(function(c){const d=c[0],u=c[1],m=c[2];return n&&(a.morphAttributes.position=d),o&&(a.morphAttributes.normal=u),s&&(a.morphAttributes.color=m),a.morphTargetsRelative=!0,a})}function Ud(a,e){if(a.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)a.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(a.morphTargetInfluences.length===t.length){a.morphTargetDictionary={};for(let n=0,o=t.length;n<o;n++)a.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Gd(a){let e;const t=a.extensions&&a.extensions[X.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Js(t.attributes):e=a.indices+":"+Js(a.attributes)+":"+a.mode,a.targets!==void 0)for(let n=0,o=a.targets.length;n<o;n++)e+=":"+Js(a.targets[n]);return e}function Js(a){let e="";const t=Object.keys(a).sort();for(let n=0,o=t.length;n<o;n++)e+=t[n]+":"+a[t[n]]+";";return e}function gi(a){switch(a){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function $d(a){return a.search(/\.jpe?g($|\?)/i)>0||a.search(/^data\:image\/jpeg/)===0?"image/jpeg":a.search(/\.webp($|\?)/i)>0||a.search(/^data\:image\/webp/)===0?"image/webp":a.search(/\.ktx2($|\?)/i)>0||a.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Xd=new gt;class qd{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new hd,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,o=-1,s=!1,i=-1;if(typeof navigator<"u"){const r=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(r)===!0;const l=r.match(/Version\/(\d+)/);o=n&&l?parseInt(l[1],10):-1,s=r.indexOf("Firefox")>-1,i=s?r.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&o<17||s&&i<98?this.textureLoader=new yl(this.options.manager):this.textureLoader=new Pu(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Sl(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,o=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(i){return i._markDefs&&i._markDefs()}),Promise.all(this._invokeAll(function(i){return i.beforeRoot&&i.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(i){const r={scene:i[0][o.scene||0],scenes:i[0],animations:i[1],cameras:i[2],asset:o.asset,parser:n,userData:{}};return Ra(s,r,o),Ot(r,o),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(r)})).then(function(){for(const l of r.scenes)l.updateMatrixWorld();e(r)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let o=0,s=t.length;o<s;o++){const i=t[o].joints;for(let r=0,l=i.length;r<l;r++)e[i[r]].isBone=!0}for(let o=0,s=e.length;o<s;o++){const i=e[o];i.mesh!==void 0&&(this._addNodeRef(this.meshCache,i.mesh),i.skin!==void 0&&(n[i.mesh].isSkinnedMesh=!0)),i.camera!==void 0&&this._addNodeRef(this.cameraCache,i.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const o=n.clone(),s=(i,r)=>{const l=this.associations.get(i);l!=null&&this.associations.set(r,l);for(const[c,d]of i.children.entries())s(d,r.children[c])};return s(n,o),o.name+="_instance_"+e.uses[t]++,o}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const o=e(t[n]);if(o)return o}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let o=0;o<t.length;o++){const s=e(t[o]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let o=this.cache.get(n);if(!o){switch(e){case"scene":o=this.loadScene(t);break;case"node":o=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":o=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":o=this.loadAccessor(t);break;case"bufferView":o=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":o=this.loadBuffer(t);break;case"material":o=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":o=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":o=this.loadSkin(t);break;case"animation":o=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":o=this.loadCamera(t);break;default:if(o=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!o)throw new Error("Unknown type: "+e);break}this.cache.add(n,o)}return o}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,o=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(o.map(function(s,i){return n.getDependency(e,i)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[X.KHR_BINARY_GLTF].body);const o=this.options;return new Promise(function(s,i){n.load(to.resolveURL(t.uri,o.path),s,void 0,function(){i(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const o=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+o)})}loadAccessor(e){const t=this,n=this.json,o=this.json.accessors[e];if(o.bufferView===void 0&&o.sparse===void 0){const i=Ks[o.type],r=bn[o.componentType],l=o.normalized===!0,c=new r(o.count*i);return Promise.resolve(new Ua(c,i,l))}const s=[];return o.bufferView!==void 0?s.push(this.getDependency("bufferView",o.bufferView)):s.push(null),o.sparse!==void 0&&(s.push(this.getDependency("bufferView",o.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",o.sparse.values.bufferView))),Promise.all(s).then(function(i){const r=i[0],l=Ks[o.type],c=bn[o.componentType],d=c.BYTES_PER_ELEMENT,u=d*l,m=o.byteOffset||0,f=o.bufferView!==void 0?n.bufferViews[o.bufferView].byteStride:void 0,p=o.normalized===!0;let g,y;if(f&&f!==u){const v=Math.floor(m/f),S="InterleavedBuffer:"+o.bufferView+":"+o.componentType+":"+v+":"+o.count;let T=t.cache.get(S);T||(g=new c(r,v*f,o.count*f/d),T=new _u(g,f/d),t.cache.add(S,T)),y=new $u(T,l,m%f/d,p)}else r===null?g=new c(o.count*l):g=new c(r,m,o.count*l),y=new Ua(g,l,p);if(o.sparse!==void 0){const v=Ks.SCALAR,S=bn[o.sparse.indices.componentType],T=o.sparse.indices.byteOffset||0,b=o.sparse.values.byteOffset||0,x=new S(i[1],T,o.sparse.count*v),_=new c(i[2],b,o.sparse.count*l);r!==null&&(y=new Ua(y.array.slice(),y.itemSize,y.normalized)),y.normalized=!1;for(let R=0,P=x.length;R<P;R++){const E=x[R];if(y.setX(E,_[R*l]),l>=2&&y.setY(E,_[R*l+1]),l>=3&&y.setZ(E,_[R*l+2]),l>=4&&y.setW(E,_[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}y.normalized=p}return y})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,i=t.images[s];let r=this.textureLoader;if(i.uri){const l=n.manager.getHandler(i.uri);l!==null&&(r=l)}return this.loadTextureImage(e,s,r)}loadTextureImage(e,t,n){const o=this,s=this.json,i=s.textures[e],r=s.images[t],l=(r.uri||r.bufferView)+":"+i.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(d){d.flipY=!1,d.name=i.name||r.name||"",d.name===""&&typeof r.uri=="string"&&r.uri.startsWith("data:image/")===!1&&(d.name=r.uri);const m=(s.samplers||{})[i.sampler]||{};return d.magFilter=Cr[m.magFilter]||Tt,d.minFilter=Cr[m.minFilter]||Tl,d.wrapS=Rr[m.wrapS]||lo,d.wrapT=Rr[m.wrapT]||lo,d.generateMipmaps=!d.isCompressedTexture&&d.minFilter!==bl&&d.minFilter!==Tt,o.associations.set(d,{textures:e}),d}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,o=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const i=o.images[e],r=self.URL||self.webkitURL;let l=i.uri||"",c=!1;if(i.bufferView!==void 0)l=n.getDependency("bufferView",i.bufferView).then(function(u){c=!0;const m=new Blob([u],{type:i.mimeType});return l=r.createObjectURL(m),l});else if(i.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const d=Promise.resolve(l).then(function(u){return new Promise(function(m,f){let p=m;t.isImageBitmapLoader===!0&&(p=function(g){const y=new Er(g);y.needsUpdate=!0,m(y)}),t.load(to.resolveURL(u,s.path),p,void 0,f)})}).then(function(u){return c===!0&&r.revokeObjectURL(l),Ot(u,i),u.userData.mimeType=i.mimeType||$d(i.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=d,d}assignTexture(e,t,n,o){const s=this;return this.getDependency("texture",n.index).then(function(i){if(!i)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(i=i.clone(),i.channel=n.texCoord),s.extensions[X.KHR_TEXTURE_TRANSFORM]){const r=n.extensions!==void 0?n.extensions[X.KHR_TEXTURE_TRANSFORM]:void 0;if(r){const l=s.associations.get(i);i=s.extensions[X.KHR_TEXTURE_TRANSFORM].extendTexture(i,r),s.associations.set(i,l)}}return o!==void 0&&(i.colorSpace=o),e[t]=i,i})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const o=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,i=t.attributes.normal===void 0;if(e.isPoints){const r="PointsMaterial:"+n.uuid;let l=this.cache.get(r);l||(l=new Ds,qs.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(r,l)),n=l}else if(e.isLine){const r="LineBasicMaterial:"+n.uuid;let l=this.cache.get(r);l||(l=new ku,qs.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(r,l)),n=l}if(o||s||i){let r="ClonedMaterial:"+n.uuid+":";o&&(r+="derivative-tangents:"),s&&(r+="vertex-colors:"),i&&(r+="flat-shading:");let l=this.cache.get(r);l||(l=n.clone(),s&&(l.vertexColors=!0),i&&(l.flatShading=!0),o&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(r,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return _s}loadMaterial(e){const t=this,n=this.json,o=this.extensions,s=n.materials[e];let i;const r={},l=s.extensions||{},c=[];if(l[X.KHR_MATERIALS_UNLIT]){const u=o[X.KHR_MATERIALS_UNLIT];i=u.getMaterialType(),c.push(u.extendParams(r,s,t))}else{const u=s.pbrMetallicRoughness||{};if(r.color=new O(1,1,1),r.opacity=1,Array.isArray(u.baseColorFactor)){const m=u.baseColorFactor;r.color.setRGB(m[0],m[1],m[2],ua),r.opacity=m[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(r,"map",u.baseColorTexture,uo)),r.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,r.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(r,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(r,"roughnessMap",u.metallicRoughnessTexture))),i=this._invokeOne(function(m){return m.getMaterialType&&m.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(m){return m.extendMaterialParams&&m.extendMaterialParams(e,r)})))}s.doubleSided===!0&&(r.side=At);const d=s.alphaMode||Zs.OPAQUE;if(d===Zs.BLEND?(r.transparent=!0,r.depthWrite=!1):(r.transparent=!1,d===Zs.MASK&&(r.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&i!==oa&&(c.push(t.assignTexture(r,"normalMap",s.normalTexture)),r.normalScale=new na(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;r.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&i!==oa&&(c.push(t.assignTexture(r,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(r.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&i!==oa){const u=s.emissiveFactor;r.emissive=new O().setRGB(u[0],u[1],u[2],ua)}return s.emissiveTexture!==void 0&&i!==oa&&c.push(t.assignTexture(r,"emissiveMap",s.emissiveTexture,uo)),Promise.all(c).then(function(){const u=new i(r);return s.name&&(u.name=s.name),Ot(u,s),t.associations.set(u,{materials:e}),s.extensions&&Ra(o,u,s),u})}createUniqueName(e){const t=Fu.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,o=this.primitiveCache;function s(r){return n[X.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(r,t).then(function(l){return Or(l,r,t)})}const i=[];for(let r=0,l=e.length;r<l;r++){const c=e[r],d=Gd(c),u=o[d];if(u)i.push(u.promise);else{let m;c.extensions&&c.extensions[X.KHR_DRACO_MESH_COMPRESSION]?m=s(c):m=Or(new Po,c,t),o[d]={primitive:c,promise:m},i.push(m)}}return Promise.all(i)}loadMesh(e){const t=this,n=this.json,o=this.extensions,s=n.meshes[e],i=s.primitives,r=[];for(let l=0,c=i.length;l<c;l++){const d=i[l].material===void 0?Wd(this.cache):this.getDependency("material",i[l].material);r.push(d)}return r.push(t.loadGeometries(i)),Promise.all(r).then(function(l){const c=l.slice(0,l.length-1),d=l[l.length-1],u=[];for(let f=0,p=d.length;f<p;f++){const g=d[f],y=i[f];let v;const S=c[f];if(y.mode===pt.TRIANGLES||y.mode===pt.TRIANGLE_STRIP||y.mode===pt.TRIANGLE_FAN||y.mode===void 0)v=s.isSkinnedMesh===!0?new Nu(g,S):new pe(g,S),v.isSkinnedMesh===!0&&v.normalizeSkinWeights(),y.mode===pt.TRIANGLE_STRIP?v.geometry=Ar(v.geometry,wl):y.mode===pt.TRIANGLE_FAN&&(v.geometry=Ar(v.geometry,mi));else if(y.mode===pt.LINES)v=new Bu(g,S);else if(y.mode===pt.LINE_STRIP)v=new Hu(g,S);else if(y.mode===pt.LINE_LOOP)v=new zu(g,S);else if(y.mode===pt.POINTS)v=new Ps(g,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+y.mode);Object.keys(v.geometry.morphAttributes).length>0&&Ud(v,s),v.name=t.createUniqueName(s.name||"mesh_"+e),Ot(v,s),y.extensions&&Ra(o,v,y),t.assignFinalMaterial(v),u.push(v)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&Ra(o,u[0],s),u[0];const m=new Ia;s.extensions&&Ra(o,m,s),t.associations.set(m,{meshes:e});for(let f=0,p=u.length;f<p;f++)m.add(u[f]);return m})}loadCamera(e){let t;const n=this.json.cameras[e],o=n[n.type];if(!o){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Ml(q.radToDeg(o.yfov),o.aspectRatio||1,o.znear||1,o.zfar||2e6):n.type==="orthographic"&&(t=new di(-o.xmag,o.xmag,o.ymag,-o.ymag,o.znear,o.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ot(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let o=0,s=t.joints.length;o<s;o++)n.push(this._loadNodeShallow(t.joints[o]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(o){const s=o.pop(),i=o,r=[],l=[];for(let c=0,d=i.length;c<d;c++){const u=i[c];if(u){r.push(u);const m=new gt;s!==null&&m.fromArray(s.array,c*16),l.push(m)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Wu(r,l)})}loadAnimation(e){const t=this.json,n=this,o=t.animations[e],s=o.name?o.name:"animation_"+e,i=[],r=[],l=[],c=[],d=[];for(let u=0,m=o.channels.length;u<m;u++){const f=o.channels[u],p=o.samplers[f.sampler],g=f.target,y=g.node,v=o.parameters!==void 0?o.parameters[p.input]:p.input,S=o.parameters!==void 0?o.parameters[p.output]:p.output;g.node!==void 0&&(i.push(this.getDependency("node",y)),r.push(this.getDependency("accessor",v)),l.push(this.getDependency("accessor",S)),c.push(p),d.push(g))}return Promise.all([Promise.all(i),Promise.all(r),Promise.all(l),Promise.all(c),Promise.all(d)]).then(function(u){const m=u[0],f=u[1],p=u[2],g=u[3],y=u[4],v=[];for(let T=0,b=m.length;T<b;T++){const x=m[T],_=f[T],R=p[T],P=g[T],E=y[T];if(x===void 0)continue;x.updateMatrix&&x.updateMatrix();const C=n._createAnimationTracks(x,_,R,P,E);if(C)for(let k=0;k<C.length;k++)v.push(C[k])}const S=new Vu(s,void 0,v);return Ot(S,o),S})}createNodeMesh(e){const t=this.json,n=this,o=t.nodes[e];return o.mesh===void 0?null:n.getDependency("mesh",o.mesh).then(function(s){const i=n._getNodeRef(n.meshCache,o.mesh,s);return o.weights!==void 0&&i.traverse(function(r){if(r.isMesh)for(let l=0,c=o.weights.length;l<c;l++)r.morphTargetInfluences[l]=o.weights[l]}),i})}loadNode(e){const t=this.json,n=this,o=t.nodes[e],s=n._loadNodeShallow(e),i=[],r=o.children||[];for(let c=0,d=r.length;c<d;c++)i.push(n.getDependency("node",r[c]));const l=o.skin===void 0?Promise.resolve(null):n.getDependency("skin",o.skin);return Promise.all([s,Promise.all(i),l]).then(function(c){const d=c[0],u=c[1],m=c[2];m!==null&&d.traverse(function(f){f.isSkinnedMesh&&f.bind(m,Xd)});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}_loadNodeShallow(e){const t=this.json,n=this.extensions,o=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],i=s.name?o.createUniqueName(s.name):"",r=[],l=o._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&r.push(l),s.camera!==void 0&&r.push(o.getDependency("camera",s.camera).then(function(c){return o._getNodeRef(o.cameraCache,s.camera,c)})),o._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){r.push(c)}),this.nodeCache[e]=Promise.all(r).then(function(c){let d;if(s.isBone===!0?d=new Uu:c.length>1?d=new Ia:c.length===1?d=c[0]:d=new or,d!==c[0])for(let u=0,m=c.length;u<m;u++)d.add(c[u]);if(s.name&&(d.userData.name=s.name,d.name=i),Ot(d,s),s.extensions&&Ra(n,d,s),s.matrix!==void 0){const u=new gt;u.fromArray(s.matrix),d.applyMatrix4(u)}else s.translation!==void 0&&d.position.fromArray(s.translation),s.rotation!==void 0&&d.quaternion.fromArray(s.rotation),s.scale!==void 0&&d.scale.fromArray(s.scale);if(!o.associations.has(d))o.associations.set(d,{});else if(s.mesh!==void 0&&o.meshCache.refs[s.mesh]>1){const u=o.associations.get(d);o.associations.set(d,{...u})}return o.associations.get(d).nodes=e,d}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],o=this,s=new Ia;n.name&&(s.name=o.createUniqueName(n.name)),Ot(s,n),n.extensions&&Ra(t,s,n);const i=n.nodes||[],r=[];for(let l=0,c=i.length;l<c;l++)r.push(o.getDependency("node",i[l]));return Promise.all(r).then(function(l){for(let d=0,u=l.length;d<u;d++)s.add(l[d]);const c=d=>{const u=new Map;for(const[m,f]of o.associations)(m instanceof qs||m instanceof Er)&&u.set(m,f);return d.traverse(m=>{const f=o.associations.get(m);f!=null&&u.set(m,f)}),u};return o.associations=c(s),s})}_createAnimationTracks(e,t,n,o,s){const i=[],r=e.name?e.name:e.uuid,l=[];va[s.path]===va.weights?e.traverse(function(m){m.morphTargetInfluences&&l.push(m.name?m.name:m.uuid)}):l.push(r);let c;switch(va[s.path]){case va.weights:c=Dr;break;case va.rotation:c=Pr;break;case va.translation:case va.scale:c=Ir;break;default:switch(n.itemSize){case 1:c=Dr;break;case 2:case 3:default:c=Ir;break}break}const d=o.interpolation!==void 0?zd[o.interpolation]:xl,u=this._getArrayFromAccessor(n);for(let m=0,f=l.length;m<f;m++){const p=new c(l[m]+"."+va[s.path],t.array,u,d);o.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(p),i.push(p)}return i}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=gi(t.constructor),o=new Float32Array(t.length);for(let s=0,i=t.length;s<i;s++)o[s]=t[s]*n;t=o}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const o=this instanceof Pr?Hd:Ll;return new o(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Yd(a,e,t){const n=e.attributes,o=new Yu;if(n.POSITION!==void 0){const r=t.json.accessors[n.POSITION],l=r.min,c=r.max;if(l!==void 0&&c!==void 0){if(o.set(new w(l[0],l[1],l[2]),new w(c[0],c[1],c[2])),r.normalized){const d=gi(bn[r.componentType]);o.min.multiplyScalar(d),o.max.multiplyScalar(d)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const r=new w,l=new w;for(let c=0,d=s.length;c<d;c++){const u=s[c];if(u.POSITION!==void 0){const m=t.json.accessors[u.POSITION],f=m.min,p=m.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),m.normalized){const g=gi(bn[m.componentType]);l.multiplyScalar(g)}r.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}o.expandByVector(r)}a.boundingBox=o;const i=new ju;o.getCenter(i.center),i.radius=o.min.distanceTo(o.max)/2,a.boundingSphere=i}function Or(a,e,t){const n=e.attributes,o=[];function s(i,r){return t.getDependency("accessor",i).then(function(l){a.setAttribute(r,l)})}for(const i in n){const r=hi[i]||i.toLowerCase();r in a.attributes||o.push(s(n[i],r))}if(e.indices!==void 0&&!a.index){const i=t.getDependency("accessor",e.indices).then(function(r){a.setIndex(r)});o.push(i)}return _r.workingColorSpace!==ua&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${_r.workingColorSpace}" not supported.`),Ot(a,e),Yd(a,e,t),Promise.all(o).then(function(){return e.targets!==void 0?Vd(a,e.targets,t):a})}const jd=Object.freeze(Object.defineProperty({__proto__:null,GLTFLoader:Ke},Symbol.toStringTag,{value:"Module"}));function da(a){const e=new Map,t=new Map,n=a.clone();return Cl(a,n,function(o,s){e.set(s,o),t.set(o,s)}),n.traverse(function(o){if(!o.isSkinnedMesh)return;const s=o,i=e.get(o),r=i.skeleton.bones;s.skeleton=i.skeleton.clone(),s.bindMatrix.copy(i.bindMatrix),s.skeleton.bones=r.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Cl(a,e,t){t(a,e);for(let n=0;n<a.children.length;n++)Cl(a.children[n],e.children[n],t)}const rt={center:{x:13.5,y:-4.064,z:-1},radius:34,speed:.148,currentTime:0};function yi(a){const e=rt.radius,t=1/(1+Math.sin(a)*Math.sin(a)),n=rt.center.x+e*t*Math.cos(a),o=rt.center.z+e*t*Math.sin(a)*Math.cos(a),s=rt.center.y;return{x:n,y:s,z:o}}let ot=null,Ga=null;function Rl(a,e,t){new Ke().load("./models/shark.glb",o=>{ot=o.scene;const s=yi(0);ot.position.set(s.x,s.y,s.z),ot.scale.set(.14,.15,.16),ot.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(ot),o.animations&&o.animations.length>0&&(Ga=new Ge(ot),o.animations.forEach(i=>{Ga.clipAction(i).play()}))},void 0,o=>{console.error("Error loading shark model:",o)})}function Kd(a){if(!ot)return;rt.currentTime+=a*rt.speed;const e=yi(rt.currentTime),t=yi(rt.currentTime+.01),n=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();ot.position.set(e.x,e.y,e.z);const o=Math.atan2(n.x,n.z);ot.rotation.y=o,Ga&&Ga.update(a)}function Zd(a){ot&&(a.remove(ot),ot.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),ot=null),Ga&&(Ga.stopAllAction(),Ga=null),rt.currentTime=0}let po=null;const Mn=[],Ko=[],Zo=[],Jd=106,Qd=2,Ba=280,Ol=1.85,em=28.2,kl=30,tm=8,am=6,kr=18;let ao=0;const nm=5;function Fl(a,e,t){new Ke().load("./models/manta-ray.glb",o=>{po=o.scene,Zo.push(...o.animations);for(let s=0;s<kl;s++)Nl(a,!0,s);ao=0},void 0,o=>{console.error("Error loading manta ray model:",o)})}function Nl(a,e=!1,t=0){if(!po)return;const n=da(po);n.traverse(i=>{i.isMesh&&(i.castShadow=!1,i.receiveShadow=!1)});const o=q.randFloat(.12,.18);n.scale.set(o,o,o),n.rotation.y=Math.PI/2;let s;if(e){const i=t/kl;s=-Ba/2+i*Ba}else s=-Ba/2-Math.random()*20;if(n.position.set(s,rt.center.y-.5+q.randFloatSpread(Ol),rt.center.z+q.randFloatSpread(30)),n.userData.baseY=n.position.y,n.userData.baseZ=n.position.z,n.userData.offset=Math.random()*10,n.userData.speed=Qd*q.randFloat(.8,1.2),n.userData.avoidanceSide=n.position.z>=0?1:-1,e&&(n.userData.fadeTime=0,n.userData.isFading=!0,n.traverse(i=>{i.isMesh&&i.material&&(i.material.transparent=!0,i.material.opacity=0)})),a.add(n),Mn.push(n),Zo.length>0){const i=new Ge(n);Zo.forEach(r=>i.clipAction(r).play()),Ko.push(i)}}function om(a){Nl(a,!1,0)}function sm(a,e){if(po){ao+=a,Mn.length<Jd&&ao>em*Math.random()&&(om(e),ao=0);for(let t=0;t<Mn.length;t++){const n=Mn[t],o=n.userData.speed;if(n.userData.isFading){n.userData.fadeTime+=a;const l=Math.min(n.userData.fadeTime/tm,1);n.traverse(c=>{c.isMesh&&c.material&&(c.material.opacity=l)}),l>=1&&(n.userData.isFading=!1)}n.position.x+=o*a;const s=Math.abs(n.position.x);if(s<kr){const l=1-s/kr,d=l*l*(3-2*l)*am*n.userData.avoidanceSide;n.position.z=n.userData.baseZ+d;const u=6*l*(1-l),m=n.position.x<0?1:-1,f=u*.4*n.userData.avoidanceSide*m;n.rotation.z=f}else n.position.z=n.userData.baseZ,n.rotation.z=0;n.position.x>Ba/2+20&&(n.position.x=-Ba/2-Math.random()*20,n.position.y=rt.center.y-.5+q.randFloatSpread(Ol),n.position.z=rt.center.z+q.randFloatSpread(30),n.userData.baseY=n.position.y,n.userData.baseZ=n.position.z,n.userData.avoidanceSide=n.position.z>=0?1:-1);const i=(n.position.x+Ba/2)/Ba,r=1-Math.sin(i*Math.PI);n.position.y=n.userData.baseY+Math.sin(performance.now()*.001+n.userData.offset)*.2-r*nm}Ko.forEach(t=>t.update(a))}}function im(a){Mn.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}),Ko.forEach(e=>e.stopAllAction()),Mn.length=0,Ko.length=0,Zo.length=0,po=null,ao=0}let no=null;const An=[],ho=[],oo=new As([new w(80,-8,0),new w(0,-10,60),new w(-120,-14,0),new w(0,-12,-20),new w(80,-8,0)],!0,"centripetal",.8),rm=.0032;oo.getLengths()[oo.getLengths().length-1];function Bl(a,e,t){new Ke().load("./models/whale.glb",o=>{no=o.scene;const s=o.animations,i=da(no);if(i.scale.set(.825,.825,.825),i.userData.pathProgress=Math.random(),i.userData.speed=rm*q.randFloat(.9,1.1),i.userData.lookAhead=.41,i.userData.pathOffset=0,i.userData.baseYOffset=0,i.userData.baseXOffset=0,i.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),a.add(i),An.push(i),s.length>0){const l=new Ge(i);s.forEach(c=>l.clipAction(c).play()),ho.push(l)}const r=da(no);if(r.scale.set(.42,.42,.42),r.userData.pathProgress=i.userData.pathProgress-.01,r.userData.pathProgress>1&&(r.userData.pathProgress-=1),r.userData.speed=i.userData.speed,r.userData.lookAhead=.41,r.userData.pathOffset=-3.215,r.userData.baseYOffset=-3.2862,r.userData.baseXOffset=8.2261,r.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),a.add(r),An.push(r),s.length>0){const l=new Ge(r);s.forEach(c=>{l.clipAction(c).startAt(Math.random()*c.duration).play()}),ho.push(l)}},void 0,o=>{console.error("Error loading whale model:",o)})}function lm(a,e){if(!no)return;const t=new w;new w(0,1,0),new w;const n=new Pt;for(let o=0;o<An.length;o++){const s=An[o];s.userData.pathProgress+=s.userData.speed*a,s.userData.pathProgress>1&&(s.userData.pathProgress-=1);const i=oo.getPointAt(s.userData.pathProgress);s.position.copy(i),s.position.y+=s.userData.baseYOffset,s.position.x+=s.userData.baseXOffset;const r=oo.getPointAt((s.userData.pathProgress+s.userData.lookAhead)%1);s.lookAt(r),oo.getTangentAt(s.userData.pathProgress,t);const l=new w(0,0,1);n.setFromUnitVectors(l,t.normalize()),s.quaternion.copy(n)}ho.forEach(o=>o.update(a))}function cm(a){An.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}),ho.forEach(e=>e.stopAllAction()),An.length=0,ho.length=0,no=null}let vi=null;const Ln=[],Jo=[],jn=new As([new w(45,-7,22),new w(18,-5,38),new w(-22,-6,33),new w(-55,-8,-11),new w(-25,-7,-46),new w(19,-6,-36),new w(45,-7,22)],!0,"centripetal",.7),um=.023,dm=jn.getLength();function Hl(a,e,t){new Ke().load("./models/dolphin.glb",o=>{vi=o.scene;const s=o.animations;for(let i=0;i<7;i++){const r=da(vi);if(r.scale.setScalar(.26+Math.random()*.035),i===0&&(r.userData.pathProgress=0),r.userData.speed=um*q.randFloat(.95,1.05),r.userData.lookAhead=.35,r.userData.sineAmp=3.65,r.userData.sineFreq=2.8+Math.random()*.4,r.userData.roll=0,r.userData.spinTimer=Math.random()*6,r.userData.spinDuration=.55,r.userData.spinSpeed=0,r.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),a.add(r),Ln.push(r),s.length>0){const l=new Ge(r);s.forEach(c=>l.clipAction(c).play()),Jo.push(l)}}e&&e(Ln)},void 0,o=>{console.error("Error loading dolphin model:",o)})}function mm(a){const e=new w,t=new w(0,1,0),n=6,o=4,s=.18;Ln.forEach((i,r)=>{r===0&&(i.userData.pathProgress+=i.userData.speed*a);let l;if(r===0){l=i.userData.pathProgress%1,l<0&&(l+=1);const c=jn.getPointAt(l),d=Math.sin(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.65);if(c.y+=d,c.y>-.2){const g=(c.y+.2)/3;c.y-=4*g*g}i.position.copy(c);const u=(i.userData.pathProgress+.08)%1,m=jn.getPointAt(u);e.subVectors(m,c).normalize(),i.lookAt(c.clone().add(e));const f=Math.cos(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.65*Math.PI*2*i.userData.sineFreq*2.2),p=-Math.atan(f*.006);i.rotateX(p)}else{i.userData.podOffset===void 0&&(i.userData.podOffset=q.randFloat(-4,o)),i.userData.podSide===void 0&&(i.userData.podSide=q.randFloat(-n,n));let c=Ln[0].userData.pathProgress+i.userData.podOffset/dm;i.userData.pathProgress===void 0&&(i.userData.pathProgress=c);const d=c-i.userData.pathProgress;i.userData.pathProgress+=d*s,l=i.userData.pathProgress%1,l<0&&(l+=1);const u=jn.getPointAt(l),m=(i.userData.pathProgress+.08)%1,f=jn.getPointAt(m);e.subVectors(f,u).normalize();const p=new w().crossVectors(e,t).normalize();u.add(p.multiplyScalar(i.userData.podSide));const g=Math.sin(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.85);if(u.y+=g,u.y>-.2){const S=(u.y+.2)/3;u.y-=4*S*S}i.position.copy(u),i.lookAt(u.clone().add(e));const y=Math.cos(i.userData.pathProgress*Math.PI*2*i.userData.sineFreq*2.2)*(i.userData.sineAmp*.85*Math.PI*2*i.userData.sineFreq*2.2),v=-Math.atan(y*.006);i.rotateX(v)}i.userData.spinTimer-=a,i.userData.spinTimer<=0&&i.userData.spinSpeed===0&&(i.userData.spinSpeed=(5+Math.random()*3)*(Math.random()>.5?1:-1),i.userData.spinTimer=i.userData.spinDuration),i.userData.spinTimer<=0&&(i.userData.spinSpeed=0,i.userData.spinTimer=3+Math.random()*4),i.userData.roll+=i.userData.spinSpeed*a,i.rotation.z=i.userData.roll}),Jo.forEach(i=>i.update(a))}function fm(a){Ln.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}),Jo.forEach(e=>e.stopAllAction()),Ln.length=0,Jo.length=0,vi=null}let Qo=null;const es=[],ts=[],wi=new As([new w(-400,-3.28,-150),new w(-200,-1.612,50),new w(20,-1.498,180),new w(200,-1.612,50),new w(400,-3.28,-150)],!1,"centripetal",.95),pm=.00297;wi.getLength();function zl(a,e,t){new Ke().load("./models/container-ship.glb",o=>{Qo=o.scene;const s=o.animations,i=da(Qo);if(i.scale.setScalar(16.2),i.userData.pathProgress=0,i.userData.speed=pm*q.randFloat(.9,1.1),i.userData.lookAhead=.02,i.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),a.add(i),es.push(i),s.length>0){const r=new Ge(i);s.forEach(l=>r.clipAction(l).play()),ts.push(r)}},void 0,o=>{console.error("Error loading container-ship model:",o)})}function hm(a){Qo&&(new w,new w(0,1,0),es.forEach(e=>{e.userData.pathProgress+=e.userData.speed*a,e.userData.pathProgress=q.clamp(e.userData.pathProgress,0,1);const t=wi.getPointAt(e.userData.pathProgress);e.position.copy(t);const n=wi.getPointAt(Math.min(e.userData.pathProgress+e.userData.lookAhead,1));e.lookAt(n)}),ts.forEach(e=>e.update(a)))}function gm(a){es.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}),ts.forEach(e=>e.stopAllAction()),es.length=0,ts.length=0,Qo=null}const sa={center:{x:93.5,y:-2.874,z:-61},radius:34,speed:.148,currentTime:0};function Si(a){const e=sa.radius,t=1/(1+Math.sin(a)*Math.sin(a)),n=sa.center.x+e*t*Math.cos(a),o=sa.center.z+e*t*Math.sin(a)*Math.cos(a),s=sa.center.y;return{x:n,y:s,z:o}}let st=null,$a=null;function Wl(a,e,t){new Ke().load("./models/sailboat.glb",o=>{st=o.scene;const s=Si(0);st.position.set(s.x,s.y,s.z),st.scale.set(.12,.13,.09),st.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(st),o.animations&&o.animations.length>0&&($a=new Ge(st),o.animations.forEach(i=>{$a.clipAction(i).play()}))},void 0,o=>{console.error("Error loading sailBoat model:",o)})}function ym(a){if(!st)return;sa.currentTime+=a*sa.speed;const e=Si(sa.currentTime),t=Si(sa.currentTime+.01),n=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();st.position.set(e.x,e.y,e.z);const o=Math.atan2(n.x,n.z);st.rotation.y=o,$a&&$a.update(a)}function vm(a){st&&(a.remove(st),st.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),st=null),$a&&($a.stopAllAction(),$a=null),sa.currentTime=0}let Fr=null;const Ti=[];let Kt=null;function Vl(a,e,t,n,o){new Ke().load("./models/mayan-temple.glb",i=>{Fr=i.scene;const r=da(Fr);if(r.scale.setScalar(5.6),r.position.set(.684,-1.82,.14),r.rotation.y=Math.PI*.1,r.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!0)}),a.add(r),Ti.push(r),e){const u=[new ft(-4.68,0,-4.68),new ft(4.68,0,-4.68),new ft(4.68,0,4.68),new ft(-4.68,0,4.68),new ft(-1.64,3.69,-1.64),new ft(1.64,3.69,-1.64),new ft(1.64,3.69,1.64),new ft(-1.64,3.69,1.64)],m=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]],f=new rd({vertices:u,faces:m}),p=1.2,g=.8,y=1.2,v=new ld(new ft(p,g,y));Kt=new Un({mass:0,material:t}),Kt.addShape(f);const S=new ft(0,3.69+g,0);Kt.addShape(v,S),Kt.position.set(r.position.x,r.position.y+3.69-5.98,r.position.z),Kt.quaternion.setFromEuler(0,r.rotation.y,0),e.addBody(Kt)}},void 0,i=>{console.error("Error loading Mayan-temple model:",i)})}function wm(a,e){Ti.forEach(t=>{a.remove(t),t.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(o=>o.dispose()):n.material.dispose())})}),Ti.length=0,Kt&&e&&(e.removeBody(Kt),Kt=null)}const ta={center:{x:0,y:-6.5,z:0},radius:18,speed:.08,currentTime:0};function bi(a){const e=ta.center.x+ta.radius*Math.cos(a),t=ta.center.z+ta.radius*Math.sin(a),n=ta.center.y;return{x:e,y:n,z:t}}let Zt=null,as=null;function Ul(a,e,t){new Ke().load("./models/whale_shark.glb",o=>{Zt=o.scene;const s=bi(0);Zt.position.set(s.x,s.y,s.z),Zt.scale.set(.58,.58,.58),Zt.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(Zt),o.animations&&o.animations.length>0&&(as=new Ge(Zt),o.animations.forEach(i=>{as.clipAction(i).play()}))},void 0,o=>{console.error("Error loading whale shark model:",o)})}function Sm(a){if(!Zt)return;as&&as.update(a),ta.currentTime+=a*ta.speed;const e=bi(ta.currentTime),t=bi(ta.currentTime+.05),n=new w(t.x-e.x,t.y-e.y,t.z-e.z).normalize();Zt.position.set(e.x,e.y,e.z);const o=Math.atan2(n.x,n.z);Zt.rotation.y=o-Math.PI/2}let Sa=null,ns=null,Nr=0;function Gl(a,e,t){new Ke().load("./models/seagulls-spiral.glb",o=>{Sa=o.scene,Sa.position.set(0,5.6,0),Sa.scale.set(.142,.142,.142),Sa.traverse(s=>{s.isMesh&&(s.castShadow=!0,s.receiveShadow=!1)}),a.add(Sa),o.animations&&o.animations.length>0&&(ns=new Ge(Sa),o.animations.forEach(s=>{const i=ns.clipAction(s);i.timeScale=.65,i.play()}))},void 0,o=>{console.error("Error loading seagulls model:",o)})}function Tm(a){if(!Sa)return;ns&&ns.update(a),Nr+=a;const n=Math.sin(Nr*.24)*1.5;Sa.position.y=8+n}const os=[];let $l={};const bm=-10,Mm=2.5,xm=4,Em={separationDistance:.8,separationForce:.8,alignmentDistance:2,alignmentForce:.3,cohesionDistance:3,cohesionForce:.2,maxSpeed:2,minSpeed:.5,maxForce:.05,avoidanceDistance:5,containmentRadius:20,containmentForce:.3,swimDepth:-3,depthVariation:1.5,wanderStrength:.02,damping:.98};function ss(a,e,t,n){const o=new Ke,s={modelPath:e.modelPath,count:e.count||20,spawnArea:e.spawnArea||{centerX:0,centerZ:0,radiusX:15,radiusZ:15},behavior:{...Em,...e.behavior||{}},scale:e.scale||{min:.15,max:.25},waterLevel:e.waterLevel||-1.814,levels:e.levels||[1],fish:[],mixers:[],isHiding:!1,hideProgress:0};o.load(e.modelPath,i=>{const r=i.scene,l=i.animations;$l[e.modelPath]=r,s.waterLevel=e.waterLevel;for(let c=0;c<s.count;c++){const d=da(r),u=q.randFloat(s.scale.min,s.scale.max);d.scale.setScalar(u);const m=s.spawnArea.centerX+q.randFloatSpread(s.spawnArea.radiusX),f=s.spawnArea.centerZ+q.randFloatSpread(s.spawnArea.radiusZ),p=s.behavior.swimDepth+q.randFloatSpread(s.behavior.depthVariation);d.position.set(m,p,f);const g=Math.random()*Math.PI*2,y=q.randFloat(s.behavior.minSpeed,s.behavior.maxSpeed);d.userData.velocity=new w(Math.cos(g)*y,0,Math.sin(g)*y),d.userData.acceleration=new w(0,0,0),d.userData.wanderAngle=Math.random()*Math.PI*2,d.userData.originalPosition=new w(m,p,f);const v=Math.random()*Math.PI*2,S=Math.random()*Mm;if(d.userData.hideTarget=new w(Math.cos(v)*S,bm,Math.sin(v)*S),d.traverse(T=>{T.isMesh&&(T.castShadow=!0,T.receiveShadow=!1)}),a.add(d),s.fish.push(d),l.length>0){const T=new Ge(d);l.forEach(b=>{T.clipAction(b).startAt(Math.random()*b.duration).play()}),s.mixers.push(T)}}os.push(s),t&&t(s)},void 0,i=>{console.error("Error loading fish model:",e.modelPath,i)})}function fn(a,e,t){e.clampLength(0,t),a.userData.acceleration.add(e)}const Fe=new w,Bt=new w;function Im(a,e,t){const n=new w;let o=0;const s=t.separationDistance*t.separationDistance;for(let i=0;i<e.length;i++){const r=e[i];if(r===a)continue;const l=a.position.x-r.position.x,c=a.position.y-r.position.y,d=a.position.z-r.position.z,u=l*l+c*c+d*d;if(u>.001&&u<s){const m=Math.sqrt(u);Fe.set(l,c,d),Fe.normalize(),Fe.divideScalar(m),n.add(Fe),o++}}return o>0&&(n.divideScalar(o),n.normalize(),n.multiplyScalar(t.maxSpeed),n.sub(a.userData.velocity),n.multiplyScalar(t.separationForce)),n}function Dm(a,e,t){const n=new w;let o=0;const s=t.alignmentDistance*t.alignmentDistance;for(let i=0;i<e.length;i++){const r=e[i];if(r===a)continue;const l=a.position.x-r.position.x,c=a.position.y-r.position.y,d=a.position.z-r.position.z,u=l*l+c*c+d*d;u>.001&&u<s&&(n.add(r.userData.velocity),o++)}return o>0?(n.divideScalar(o),n.normalize(),n.multiplyScalar(t.maxSpeed),Bt.subVectors(n,a.userData.velocity),Bt.multiplyScalar(t.alignmentForce),Bt.clone()):n}function Pm(a,e,t){const n=new w;let o=0;const s=t.cohesionDistance*t.cohesionDistance;for(let i=0;i<e.length;i++){const r=e[i];if(r===a)continue;const l=a.position.x-r.position.x,c=a.position.y-r.position.y,d=a.position.z-r.position.z,u=l*l+c*c+d*d;u>.001&&u<s&&(n.add(r.position),o++)}return o>0?(n.divideScalar(o),Fe.subVectors(n,a.position),Fe.normalize(),Fe.multiplyScalar(t.maxSpeed),Bt.subVectors(Fe,a.userData.velocity),Bt.multiplyScalar(t.cohesionForce),Bt.clone()):n}function _m(a,e){const t=new w,n=Math.sqrt(a.position.x*a.position.x+a.position.z*a.position.z);if(n<e.avoidanceDistance){t.set(a.position.x,0,a.position.z),t.normalize(),t.multiplyScalar(e.maxSpeed),t.sub(a.userData.velocity);const o=1-n/e.avoidanceDistance;t.multiplyScalar(o*1.5)}return t}function Am(a,e,t){const n=new w,o=a.position.x-e.centerX,s=a.position.z-e.centerZ,i=Math.sqrt(o*o+s*s);if(i>t.containmentRadius){n.set(-o,0,-s),n.normalize(),n.multiplyScalar(t.maxSpeed),n.sub(a.userData.velocity);const r=i-t.containmentRadius,l=Math.min(r/10,1);n.multiplyScalar(l*t.containmentForce)}return n}function Lm(a,e,t){a.userData.wanderAngle+=q.randFloatSpread(.2)*t;const n=new w(Math.cos(a.userData.wanderAngle),Math.sin(a.userData.wanderAngle*.3)*.2,Math.sin(a.userData.wanderAngle));return n.multiplyScalar(e.wanderStrength),n}let Br=0;function Cm(a,e=!1){const t=Math.min(a,.1);os.forEach(n=>{const o=n.behavior;if(e&&!n.isHiding?n.isHiding=!0:!e&&n.isHiding&&n.hideProgress>=.9&&(n.isHiding=!1),n.isHiding?n.hideProgress=Math.min(1,n.hideProgress+t*.7):n.hideProgress=Math.max(0,n.hideProgress-t*.15),n.hideProgress>=.7&&n.isHiding){n.fish[0]&&n.fish[0].visible&&n.fish.forEach(i=>{i.visible=!1});return}n.hideProgress<.7&&n.fish[0]&&!n.fish[0].visible&&n.fish.forEach(i=>{i.visible=!0}),Br++;const s=Br%2===0;n.fish.forEach((i,r)=>{if(n.hideProgress>.05&&n.isHiding){if(Fe.copy(i.userData.hideTarget).sub(i.position),Fe.length()>.1){const g=Fe.x,y=Fe.z,v=Fe.y;Fe.normalize().multiplyScalar(xm*t),i.position.add(Fe);let T=Math.atan2(g,y)-i.rotation.y;T>Math.PI&&(T-=Math.PI*2),T<-Math.PI&&(T+=Math.PI*2),i.rotation.y+=T*.15,i.rotation.x=-v*.3}n.mixers[r]&&n.mixers[r].update(t*.5);return}if(!n.isHiding&&n.hideProgress>0&&n.hideProgress<.2){const p=new w(n.spawnArea.centerX-i.position.x,o.swimDepth-i.position.y,n.spawnArea.centerZ-i.position.z);p.normalize().multiplyScalar(o.maxSpeed*.5),i.userData.velocity.copy(p)}if(s){i.userData.acceleration.set(0,0,0);const p=Im(i,n.fish,o),g=Dm(i,n.fish,o),y=Pm(i,n.fish,o),v=_m(i,o),S=Am(i,n.spawnArea,o),T=Lm(i,o,t);fn(i,p,o.maxForce*1.5),fn(i,g,o.maxForce),fn(i,y,o.maxForce),fn(i,v,o.maxForce*2),fn(i,S,o.maxForce*3),fn(i,T,o.maxForce*.3)}if(s){i.userData.velocity.add(i.userData.acceleration),i.userData.velocity.multiplyScalar(o.damping);const p=i.userData.velocity.length();p>o.maxSpeed?i.userData.velocity.normalize().multiplyScalar(o.maxSpeed):p<o.minSpeed&&i.userData.velocity.normalize().multiplyScalar(o.minSpeed)}Fe.copy(i.userData.velocity).multiplyScalar(t),i.position.add(Fe);const l=n.waterLevel||-1.814,c=.3;i.position.y>l-c&&(i.position.y=l-c,i.userData.velocity.y=Math.min(0,i.userData.velocity.y));const u=o.swimDepth-i.position.y;if(Math.abs(u)/(o.depthVariation*2)>.04&&(i.userData.velocity.y+=u*.01*t*60),i.userData.velocity.lengthSq()>.01){Bt.copy(i.userData.velocity).normalize();let g=Math.atan2(Bt.x,Bt.z)-i.rotation.y;g>Math.PI&&(g-=Math.PI*2),g<-Math.PI&&(g+=Math.PI*2),i.rotation.y+=g*.1;const y=-Bt.y*.25;i.rotation.x+=(y-i.rotation.x)*.1}n.mixers[r]&&n.mixers[r].update(t)})})}function Rm(a){os.forEach(e=>{e.fish.forEach(t=>{a.remove(t),t.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(o=>o.dispose()):n.material.dispose())})}),e.mixers.forEach(t=>t.stopAllAction())}),os.length=0,$l={}}let we=null,Xa=null;const is=new As([new w(35,-12,20),new w(20,-14,40),new w(0,-15,50),new w(-20,-14,40),new w(-40,-12,10),new w(-45,-10,-10),new w(-35,-9,-25),new w(-20,-8,-35),new w(35,-12,20)],!0,"centripetal",.5),Om=.035;is.getLength();let ue={isBreaching:!1,timeSinceLastBreach:0,breachProgress:0,nextBreachTime:15+Math.random()*20,breachDuration:3.5,breachStartProgress:0,targetBreachHeight:2.25};function Xl(a,e,t){new Ke().load("./models/sail-fish.glb",o=>{we=o.scene;const s=is.getPointAt(0);we.position.copy(s),we.scale.set(1.1,1.1,1.1),we.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),a.add(we),o.animations&&o.animations.length>0&&(Xa=new Ge(we),o.animations.forEach(i=>{Xa.clipAction(i).play()})),o.scene,ue.timeSinceLastBreach=0,ue.isBreaching=!1,ue.nextBreachTime=15+Math.random()*20},void 0,o=>{console.error("Error loading sailfish model:",o)})}function km(a){if(!we)return;ue.isBreaching||(ue.timeSinceLastBreach+=a,ue.timeSinceLastBreach>=ue.nextBreachTime&&(ue.isBreaching=!0,ue.breachProgress=0,ue.breachStartProgress=we.userData.pathProgress||0,ue.timeSinceLastBreach=0,ue.nextBreachTime=15+Math.random()*20)),ue.isBreaching&&(ue.breachProgress+=a/ue.breachDuration,ue.breachProgress>=1&&(ue.isBreaching=!1,ue.breachProgress=0)),we.userData.pathProgress||(we.userData.pathProgress=0),we.userData.pathProgress+=Om*a,we.userData.pathProgress%=1;const e=is.getPointAt(we.userData.pathProgress);let t=0;ue.isBreaching&&(t=Math.sin(ue.breachProgress*Math.PI)*(ue.targetBreachHeight-e.y)),we.position.set(e.x,e.y+t,e.z);const n=(we.userData.pathProgress+.02)%1,o=is.getPointAt(n),s=new w().subVectors(o,e).normalize();if(ue.isBreaching){const r=Math.cos(ue.breachProgress*Math.PI);s.y+=r*.5,s.normalize()}const i=we.position.clone().add(s);we.lookAt(i),Xa&&Xa.update(a)}function Fm(a){we&&(a.remove(we),we.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())}),we=null),Xa&&(Xa.stopAllAction(),Xa=null),ue={isBreaching:!1,timeSinceLastBreach:0,breachProgress:0,nextBreachTime:15+Math.random()*20,breachDuration:3.5,breachStartProgress:0,breachStartY:0,targetBreachHeight:2.5}}let go=null;const yo=[],rs=[],ls=[],Nm=60,Bm=Nm,Hm=45,zm=28,ql=new w(0,0,0),Yl=-18,Wm=-3.6,Vm=3.5,Hr=(Wm-Yl)/2;function Mi(a){const t=a*Math.PI*2-Math.PI/2,n=Vm*Math.cos(t),o=Yl+Hr+Hr*Math.sin(t);return new w(n,o,0)}function Um(a){const t=Mi(a);return Mi((a+.01)%1).sub(t).normalize()}function jl(a,e,t){new Ke().load("./models/firefly_squid.glb",o=>{go=o.scene,ls.push(...o.animations);for(let s=0;s<Bm;s++)Gm(a,!0)},void 0,o=>{console.error("firefly-squid load error:",o)})}function Gm(a,e=!1){if(!go)return;const t=da(go);t.traverse(r=>{r.isMesh&&(r.castShadow=!1,r.receiveShadow=!1,r.renderOrder=.7,r.material&&(r.material.transparent=!0,r.material.depthWrite=!1,r.material.emissive&&(r.material.emissive.set(65484),r.material.emissiveIntensity=0,r.material.toneMapped=!1)))});const n=q.randFloat(.08,.13);t.scale.set(n,n,n);const o=Math.random()*Math.PI*2,s=Math.random()*Hm,i=new w(Math.cos(o)*s,0,Math.sin(o)*s);if(t.position.copy(ql).add(i),t.userData.spawnXZ=i,t.userData.life01=Math.random(),t.userData.speed=1/zm,t.userData.glowTimer=Math.random()*5,a.add(t),yo.push(t),ls.length){const r=new Ge(t);ls.forEach(l=>r.clipAction(l).play()),rs.push(r)}}function $m(a,e){if(go){for(let t=yo.length-1;t>=0;t--){const n=yo[t];n.userData.life01+=n.userData.speed*a,n.userData.life01=n.userData.life01%1;const s=Mi(n.userData.life01).clone().add(ql).add(n.userData.spawnXZ);n.position.copy(s);const r=Um(n.userData.life01).clone().normalize();let l=new w(0,1,0);Math.abs(r.dot(l))>.99&&(l=new w(0,0,1));const c=new w().crossVectors(r,l).normalize();l=new w().crossVectors(c,r).normalize();const d=new gt;d.makeBasis(c,l,r.negate());const u=new Pt().setFromRotationMatrix(d);n.userData.quaternion||(n.userData.quaternion=new Pt().copy(u)),n.userData.quaternion.slerp(u,.1),n.quaternion.copy(n.userData.quaternion);const m=.5+.4*Math.sin(n.userData.glowTimer*2.2);n.traverse(f=>{f.isMesh&&f.material&&(f.material.opacity=1,f.material.emissive&&(f.material.emissiveIntensity=m*16.2))})}rs.forEach(t=>t.update(a))}}function Xm(a){yo.forEach(e=>a.remove(e)),rs.forEach(e=>e.stopAllAction()),yo.length=rs.length=ls.length=0,go=null}const qm="./models/green_turtle.glb",Ym=48,jm=1,Km=486.5,Zm=.589,Jm=-80,xi=-2.325,Qm=45,zr=.861;new w(0,xi,0);const ef=2.13,tf=8.8,af=4.5;let vo=null;const wo=[],cs=[],us=[],Oa={SWIM_IN:0,PAUSED:1,SWIM_OUT:2};let so=0;function Kl(a,e,t){new Ke().load(qm,o=>{vo=o.scene,o.animations&&us.push(...o.animations);for(let s=0;s<jm;s++)Zl(a,!0,s);so=0},void 0,o=>{console.error("Error loading green_turtle.glb:",o)})}function Zl(a,e=!1,t=0){if(!vo)return;const n=new or;n.position.set(Jm,xi,q.randFloatSpread(Qm));const o=da(vo);o.rotation.y=Math.PI,o.scale.setScalar(Zm),o.traverse(r=>{r.isMesh&&(r.castShadow=!0,r.receiveShadow=!0)}),n.add(o),a.add(n);const s=q.randFloatSpread(ef),i=new w(tf,xi,s);if(n.userData={state:Oa.SWIM_IN,pauseTimer:0,startPos:n.position.clone(),targetPos:i,dir:new w().subVectors(i,n.position).normalize()},wo.push(n),us.length){const r=new Ge(o);us.forEach(l=>r.clipAction(l).play()),cs.push(r)}}function nf(a,e){vo&&(so+=a,wo.length<Ym&&so>Km*Math.random()&&(Zl(e,!1,0),so=0),wo.forEach(t=>{const n=t.userData;switch(n.state){case Oa.SWIM_IN:{const o=new w().subVectors(n.targetPos,t.position);if(o.length()<1.5){n.state=Oa.PAUSED,n.pauseTimer=0;return}o.normalize().multiplyScalar(zr*a),t.position.add(o),t.lookAt(t.position.clone().add(o));break}case Oa.PAUSED:{n.pauseTimer+=a,n.pauseTimer>=af&&(n.state=Oa.SWIM_OUT);break}case Oa.SWIM_OUT:{const o=new w().subVectors(n.startPos,t.position);if(o.length()<2){t.position.copy(n.startPos),n.state=Oa.SWIM_IN;return}o.normalize().multiplyScalar(zr*a),t.position.add(o),t.lookAt(t.position.clone().add(o));break}}}),cs.forEach(t=>t.update(a)))}function of(a){wo.forEach(e=>{a.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}),cs.forEach(e=>e.stopAllAction()),wo.length=0,cs.length=0,us.length=0,vo=null,so=0}const zt=new ct({uniforms:{uTime:{value:0},uJiggleAmplitude:{value:0},uJiggleFrequency:{value:8},uJiggleTime:{value:0},uVelocity:{value:new w},uAttractionDir:{value:new w},uAttractionStrength:{value:0},uSpawnScale:{value:1}},transparent:!0,side:At,depthWrite:!1,vertexShader:`
    uniform float uTime;
    uniform float uJiggleAmplitude;
    uniform float uJiggleFrequency;
    uniform float uJiggleTime;
    uniform vec3 uVelocity;
    uniform vec3 uAttractionDir;
    uniform float uAttractionStrength;
    uniform float uSpawnScale;

    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;

    void main() {
      vec3 pos = position;
      vec3 norm = normal;

      // 1. SPAWN ANIMATION - scale from tiny to full size
      pos *= uSpawnScale;

      // 2. CONTINUOUS SUBTLE WOBBLE - organic movement
      float wobbleAmount = 0.008; // Very subtle
      float wobble = sin(uTime * 2.0 + pos.x * 10.0) * cos(uTime * 1.7 + pos.y * 10.0) * wobbleAmount;
      pos += norm * wobble;

      // 3. JIGGLE ON MERGE - oscillating deformation
      if (uJiggleAmplitude > 0.001) {
        float jiggle = sin(uJiggleTime * uJiggleFrequency + pos.y * 3.0) * uJiggleAmplitude;
        jiggle *= cos(uJiggleTime * uJiggleFrequency * 0.7 + pos.x * 2.0); // Multi-directional
        pos += norm * jiggle;
      }

      // 4. VELOCITY-BASED STRETCHING - raindrop shape (rounded front, pinched tail)
      // Prioritize vertical velocity (falling) over horizontal (rolling)
      float verticalSpeed = abs(uVelocity.y);
      float horizontalSpeed = length(uVelocity.xz);
      float speed = verticalSpeed * 1.5 + horizontalSpeed * 0.13; // Weight vertical motion heavily

      if (speed > 1.0) {
        vec3 motionDir = normalize(uVelocity);
        float alignment = dot(norm, motionDir);
        float stretchAmount = min(speed * 0.03, 0.15); // Cap stretching - toned down

        // Asymmetric stretching for raindrop shape:
        // - Front/leading edge (alignment > 0): Keep rounded
        // - Back/tail (alignment < 0): Stretch and pinch
        if (alignment < 0.0) {
          // Tail (trailing edge): stretch back, with power curve for pinched taper
          float tailStretch = pow(-alignment, 0.7) * stretchAmount * 1.8;
          pos -= motionDir * tailStretch; // Stretch opposite to motion direction
        } else {
          // Front (leading edge): keep rounded with minimal deformation
          float frontCompress = alignment * stretchAmount * 0.2;
          pos += motionDir * frontCompress;
        }
      }

      // 5. ATTRACTION STRETCHING - true metaball effect
      if (uAttractionStrength > 0.001) {
        vec3 attractDir = normalize(uAttractionDir);
        float alignment = dot(norm, attractDir);
        float stretchAmount = uAttractionStrength * 0.15;
        // Only stretch toward attraction, not away
        if (alignment > 0.0) {
          pos += attractDir * alignment * stretchAmount;
        }
      }

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
  `}),$e=[];let Cs=0;const Co={cache:new Map,get(a){const e=Math.round(a*100)/100;if(!this.cache.has(e)){let t;e<.15?t=16:e<.25?t=24:e<.4?t=32:t=48,this.cache.set(e,new co(e,t,t))}return this.cache.get(e)},dispose(){this.cache.forEach(a=>a.dispose()),this.cache.clear()}},ie={enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:12,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.5,fadeInDuration:2800,fadeOutDuration:2800};function Jl(a){Object.assign(ie,a)}function sf(a,e,t){return function(o,s){const i=ie.minRadius+Math.random()*(ie.maxRadius-ie.minRadius),r=zt.clone();r.uniforms=Vn.clone(zt.uniforms),r.uniforms.uSpawnScale.value=.01;const l=new pe(Co.get(i),r);l.position.set(o,ie.spawnHeight,s),l.castShadow=!0,l.receiveShadow=!0,l.renderOrder=3,a.add(l);const c=new Ao(i),d=i*i*i*30.5,u=new Un({mass:d,material:t,linearDamping:.3,angularDamping:.3});u.addShape(c),u.position.set(o,ie.spawnHeight,s),e.addBody(u),Cs+=d;const m={mesh:l,body:u,radius:i,active:!0,hasSpawnedRipple:!1,originalMass:d,jiggleAmplitude:0,jiggleTime:0,spawnProgress:0,attractionDir:new w,attractionStrength:0};return $e.push(m),m}}function rf(a){const e=zt.uniforms.uTime.value+a;zt.uniforms.uTime.value=e,$e.forEach(t=>{if(!t.active||!t.mesh.material)return;const n=t.mesh.material.uniforms;if(t.spawnProgress<1){t.spawnProgress+=a*2.5,t.spawnProgress=Math.min(t.spawnProgress,1);const o=1-Math.pow(1-t.spawnProgress,3);n.uSpawnScale.value=o}t.jiggleAmplitude>0&&(t.jiggleTime+=a,t.jiggleAmplitude*=Math.pow(.1,a),t.jiggleAmplitude<.001&&(t.jiggleAmplitude=0,t.jiggleTime=0),n.uJiggleAmplitude.value=t.jiggleAmplitude,n.uJiggleTime.value=t.jiggleTime),t.isEvaporating||n.uVelocity.value.set(t.body.velocity.x,t.body.velocity.y,t.body.velocity.z),n.uAttractionDir.value.copy(t.attractionDir),n.uAttractionStrength.value=t.attractionStrength,n.uTime.value=e})}function lf(a,e=1){!a||!a.active||(a.jiggleAmplitude=.08*e,a.jiggleTime=0)}function Ho(){return Cs}function Ql(a){Cs+=a}function cf(){Cs=0}const uf=.15,Qs=3,df=.65;function ec(a,e,t,n){if(a.radius<uf)return!1;const o=a.radius*df;if(o<ie.minRadius*.8)return!1;const s=a.mesh.position.clone(),i=a.body.velocity.clone(),r=a.originalMass;e.remove(a.mesh),t.removeBody(a.body),a.active=!1;const l=$e.indexOf(a);l>-1&&$e.splice(l,1);const c=Math.PI*2/Qs;for(let d=0;d<Qs;d++){const u=c*d+Math.random()*.3,m=zt.clone();m.uniforms=Vn.clone(zt.uniforms),m.uniforms.uSpawnScale.value=1;const f=new pe(Co.get(o),m),p=a.radius*.3;f.position.set(s.x+Math.cos(u)*p,s.y,s.z+Math.sin(u)*p),f.castShadow=!0,f.receiveShadow=!0,f.renderOrder=3,e.add(f);const g=new Ao(o),y=o*o*o*30.5,v=new Un({mass:y,material:n,linearDamping:.3,angularDamping:.3});v.addShape(g),v.position.copy(f.position),v.velocity.copy(i);const S=new w(Math.cos(u),.02+Math.random()*.02,Math.sin(u)).normalize(),T=1.12+Math.random()*1.125;v.applyImpulse(new ft(S.x*T,S.y*T,S.z*T),v.position),t.addBody(v);const b={mesh:f,body:v,radius:o,active:!0,hasSpawnedRipple:!1,originalMass:r/Qs,jiggleAmplitude:0,jiggleTime:0,spawnProgress:1,attractionDir:new w,attractionStrength:0};$e.push(b)}return!0}const ir=new Audio("./sounds/tropical-island-waves.mp3");ir.loop=!0;ir.volume=.45;let tc=!1,_t=!1;const Ei=[new Audio("./sounds/stone-debris.mp3"),new Audio("./sounds/stones-falling-down.wav"),new Audio("./sounds/stones-short-debris.wav")];Ei.forEach(a=>{a.volume=.3});let ba=null,ds=!1;const So=new Audio("./sounds/correct-answer.wav");So.volume=.4;const To=new Audio("./sounds/winning-chimes.wav");To.volume=.5;const nt={small:new Audio("./sounds/water-drip-small.wav"),medium:new Audio("./sounds/water-drop.mp3"),large:new Audio("./sounds/water-drip-large.wav"),bubble:new Audio("./sounds/water-bubble.wav")};nt.small.volume=.4;nt.medium.volume=.5;nt.large.volume=.6;nt.bubble.volume=.3;const ms=new Audio("./sounds/drizzle.mp3");ms.loop=!0;ms.volume=.45;let bo=[];const Ii=new Audio("./sounds/woosh.mp3");Ii.volume=.5;const xe=new Audio("./sounds/jungle-day.mp3");xe.loop=!0;xe.volume=0;let Ye=null;const Di=new Audio("./sounds/ball-tap.wav");Di.volume=.5;function Cn(){return ir}function rr(){return tc}function fs(a){tc=a}function ac(){return _t}function Wr(a){_t=a}function mf(a){if(_t)return;const e=[],t=Math.random();if(a<.8)t<.5?e.push(nt.small):t<.8?e.push(nt.medium):e.push(nt.bubble);else if(a<1.3)t<.4?e.push(nt.medium):t<.8?e.push(nt.large):e.push(nt.bubble);else if(t<.6?e.push(nt.large):e.push(nt.bubble),t>.7){const s=nt.medium.cloneNode();s.volume=.3,s.currentTime=0,s.play().catch(i=>console.log("Water splash extra sound failed:",i))}const n=e[0],o=n.cloneNode();o.volume=n.volume,o.currentTime=0,o.playbackRate=.9+Math.random()*.2,o.play().catch(s=>console.log("Water splash sound failed:",s))}function nc(){if(_t)return;const a=Math.floor(Math.random()*Ei.length);ba=Ei[a],ba.currentTime=0,ba.play().catch(e=>console.log("Sculpt sound failed:",e)),ba.onended=()=>{ds&&!_t&&nc()}}function ff(){ba&&(ba.pause(),ba.onended=null,ba=null)}function oc(){ds||(ds=!0,nc())}function Rs(){ds=!1,ff()}function pf(){_t||(So.currentTime=0,So.play().catch(a=>console.log("Quick-lock sound failed:",a)))}function hf(){_t||(To.currentTime=0,To.play().catch(a=>console.log("Winning chimes sound failed:",a)))}function gf(){_t||(Ii.currentTime=0,Ii.play().catch(a=>console.log("Woosh sound failed:",a)))}function sc(){if(_t)return null;const a=ms.cloneNode();return a.volume=ms.volume,a.loop=!0,a.play().catch(e=>console.log("Drizzle sound failed:",e)),bo.push(a),a}function ic(a){if(!a)return;const e=setInterval(()=>{if(a.volume>.05)a.volume=Math.max(0,a.volume-.05);else{a.pause(),a.currentTime=0,clearInterval(e);const t=bo.indexOf(a);t>-1&&bo.splice(t,1)}},50)}function yf(){if(_t)return;Ye&&(clearInterval(Ye),Ye=null),xe.currentTime=0,xe.volume=0,xe.play().catch(s=>console.log("Jungle day sound failed:",s));const a=.5,e=2e3,t=40,n=e/t,o=a/t;Ye=setInterval(()=>{xe.volume<a-o?xe.volume=Math.min(a,xe.volume+o):(xe.volume=a,clearInterval(Ye),Ye=null)},n)}function vf(){Ye&&(clearInterval(Ye),Ye=null);const a=1500,e=30,t=a/e,o=xe.volume/e;Ye=setInterval(()=>{xe.volume>o?xe.volume=Math.max(0,xe.volume-o):(xe.volume=0,xe.pause(),xe.currentTime=0,clearInterval(Ye),Ye=null)},t)}function lr(){Rs(),So.pause(),So.currentTime=0,To.pause(),To.currentTime=0,bo.forEach(a=>{a.pause(),a.currentTime=0}),bo=[],Ye&&(clearInterval(Ye),Ye=null),xe.pause(),xe.currentTime=0,xe.volume=0}function Vr(){return xe}function rc(){if(_t)return;const a=Di.cloneNode();a.volume=Di.volume,a.currentTime=0,a.playbackRate=.95+Math.random()*.1,a.play().catch(e=>console.log("Ball tap sound failed:",e))}const h={startDelay:8500,duration:14800,dropInterval:180,ballsDropped:0,isActive:!1,startTime:0,steadyStateReached:!1,steadyStateValues:null,cloudUpdateFrameCounter:0,startTimeoutId:null,dropIntervalId:null,terrainDarknessBlend:0,isPaused:!1,pauseTimeoutRemaining:0,pauseTime:0,stormScheduledTime:0};function ps(a,e=!0){const{scene:t,world:n,ballMaterial:o,randomTerrainPosition:s,createCloudIndicator:i,sharedCloudTexture:r,sky:l,renderer:c,water:d,timeOfDay:u="day"}=a,m=45;h.stormScheduledTime=Date.now(),h.startTimeoutId=setTimeout(()=>{h.isActive=!0,h.startTime=Date.now(),h.ballsDropped=0;const f=s(),p=i({startX:f.x,startZ:f.z,endX:f.x,endZ:f.z,cloudTexture:r,rainCount:50,cloudHeight:31.88,timeOfDay:u}),g=p.userData.cloud,y=p.userData.cloudMaterial;g.scale.set(125,32,128),g.rotation.y=Math.random()*Math.PI*2;const v=.22,S=.344;u!=="night"&&y.uniforms.base.value.setRGB(121/255*.5,138/255*.55,160/255*.65),y.uniforms.threshold.value=S,g.renderOrder=10,t.add(p);const T=sc();p.userData.drizzleSound=T,h.cloudData={group:p,startTime:Date.now(),rotationSpeed:.0013,baseOpacity:v},h.originalSkyValues={turbidity:l.material.uniforms.turbidity.value,rayleigh:l.material.uniforms.rayleigh.value,mieCoefficient:l.material.uniforms.mieCoefficient.value,exposure:c.toneMappingExposure},h.originalWaterValues={heightMultiplier:d.material.uniforms.uWaveHeightMultiplier.value,amplitude:d.material.uniforms.uWaveAmplitude.value,waterLevel:d.mesh.position.y},h.originalHemisphereColors={deepColor:d.hemisphereMesh.material.uniforms.uDeepColor.value.clone(),shallowColor:d.hemisphereMesh.material.uniforms.uShallowColor.value.clone()},h.water=d,h.timeOfDay=u;const b=new Audio("sounds/thunderstorm.mp3");h.thunderSound=b,h.lightningTriggered=!1,h.lightningStarted=!1;const x=document.createElement("div");x.id="lightning-flash",x.style.position="fixed",x.style.top="0",x.style.left="0",x.style.width="100%",x.style.height="100%",x.style.backgroundColor="white",x.style.opacity="0",x.style.pointerEvents="none",x.style.zIndex="1000",document.body.appendChild(x),h.lightningFlash=x,h.dropIntervalId=setInterval(()=>{if(h.ballsDropped>=m){clearInterval(h.dropIntervalId),h.dropIntervalId=null;return}const _=s(),R=.12+Math.random()*.1,P=zt.clone();P.uniforms=Vn.clone(zt.uniforms),P.uniforms.uSpawnScale.value=1;const E=new pe(Co.get(R),P);E.position.set(_.x,ie.spawnHeight,_.z),E.castShadow=!0,E.receiveShadow=!1,E.renderOrder=3,t.add(E);const C=new Ao(R),k=R*R*R,G=new Un({mass:k,material:o,linearDamping:0,angularDamping:0});G.addShape(C),G.position.set(_.x,ie.spawnHeight,_.z),n.addBody(G),e&&Ql(k),$e.push({mesh:E,body:G,radius:R,active:!0,hasSpawnedRipple:!1,originalMass:k,jiggleAmplitude:0,jiggleTime:0,spawnProgress:1,attractionDir:new w,attractionStrength:0}),h.ballsDropped++},h.dropInterval)},h.startDelay)}function ei(a,e){if(!h.lightningTriggered&&a>2500&&a<3500){h.lightningStarted||(h.lightningStarted=!0,h.lightningStartTime=e,h.thunderSound&&!ac()&&(h.thunderSound.currentTime=0,h.thunderSound.play().catch(o=>console.log("Thunder audio failed:",o))));const t=e-h.lightningStartTime;let n=0;return t<80?n=.9*(1-t/80):t>=180&&t<280?n=.85*(1-(t-180)/100):t>=280&&(h.lightningTriggered=!0,n=0),h.lightningFlash&&(h.lightningFlash.style.opacity=n.toString()),!0}return!1}function lc(){if(h.lightningFlash){const a=document.getElementById("lightning-flash");a&&document.body.removeChild(a),h.lightningFlash=null}}function wf(){if(!h.isPaused){if(h.isPaused=!0,h.pauseTime=Date.now(),h.startTimeoutId!==null&&!h.isActive){const a=Date.now()-h.stormScheduledTime;h.pauseTimeoutRemaining=Math.max(0,h.startDelay-a),clearTimeout(h.startTimeoutId),h.startTimeoutId=null}h.dropIntervalId!==null&&(clearInterval(h.dropIntervalId),h.dropIntervalId=null)}}function Sf(a,e){if(!h.isPaused)return;const t=Date.now()-h.pauseTime;if(h.isPaused=!1,h.startTime>0&&(h.startTime+=t),h.cloudData&&h.cloudData.startTime>0&&(h.cloudData.startTime+=t),h.lightningStartTime>0&&(h.lightningStartTime+=t),h.stormScheduledTime>0&&(h.stormScheduledTime+=t),h.pauseTimeoutRemaining>0&&!h.isActive&&(h.startTimeoutId=setTimeout(()=>{h.startTimeoutId=null,h.pauseTimeoutRemaining=0,ps(a,e)},h.pauseTimeoutRemaining)),h.isActive&&h.ballsDropped<45){const{scene:n,world:o,ballMaterial:s,randomTerrainPosition:i}=a,r=45;h.dropIntervalId=setInterval(()=>{if(h.ballsDropped>=r){clearInterval(h.dropIntervalId),h.dropIntervalId=null;return}const l=i(),c=.12+Math.random()*.1,d=zt.clone();d.uniforms=Vn.clone(zt.uniforms),d.uniforms.uSpawnScale.value=1;const u=new pe(Co.get(c),d);u.position.set(l.x,ie.spawnHeight,l.z),u.castShadow=!0,u.receiveShadow=!1,u.renderOrder=3,n.add(u);const m=new Ao(c),f=c*c*c,p=new Un({mass:f,material:s,linearDamping:0,angularDamping:0});p.addShape(m),p.position.set(l.x,ie.spawnHeight,l.z),o.addBody(p),Ql(f),$e.push({mesh:u,body:p,radius:c,active:!0,hasSpawnedRipple:!1,originalMass:f,jiggleAmplitude:0,jiggleTime:0,spawnProgress:1,attractionDir:new w,attractionStrength:0}),h.ballsDropped++},h.dropInterval)}}function Tf(){h.isActive=!1,h.ballsDropped=0,h.startTime=0,h.lightningTriggered=!1,h.lightningStarted=!1,h.steadyStateReached=!1,h.steadyStateValues=null,h.cloudUpdateFrameCounter=0,h.timeOfDay=void 0,h.terrainDarknessBlend=0,h.startTimeoutId!==null&&(clearTimeout(h.startTimeoutId),h.startTimeoutId=null),h.dropIntervalId!==null&&(clearInterval(h.dropIntervalId),h.dropIntervalId=null),h.thunderSound&&(h.thunderSound.pause(),h.thunderSound.currentTime=0),lc(),delete h.originalSkyValues,h.originalWaterValues&&h.water&&(h.water.setWaveChoppiness(h.originalWaterValues.heightMultiplier,h.originalWaterValues.amplitude),h.water.mesh.position.y=h.originalWaterValues.waterLevel),h.originalHemisphereColors&&h.water&&(h.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(h.originalHemisphereColors.deepColor),h.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(h.originalHemisphereColors.shallowColor)),delete h.originalWaterValues,delete h.originalHemisphereColors,delete h.water}function bf(a){const{gameStarted:e,scene:t,camera:n,dt:o,sky:s,renderer:i,updateCloud:r,updateRainParticles:l,setRainOpacity:c}=a;if(!e||!h.isActive||!h.cloudData)return!1;const d=Date.now(),u=d-h.startTime,m=h.cloudData,f=d-m.startTime,{cloud:p,cloudMaterial:g}=m.group.userData;p.visible||(p.visible=!0),h.cloudUpdateFrameCounter++,h.cloudUpdateFrameCounter>=1.22&&(r(m.group,n,o),h.cloudUpdateFrameCounter=0),p.rotation.y+=m.rotationSpeed;const y=4e3,v=3800,S=h.duration-2500,T=h.duration-2e3,b=u<v,x=u>T,_=!b&&!x;let R=m.baseOpacity;if(f<y){const P=f/y,E=P*P*P;R*=E}else if(u>S){const P=(u-(h.duration-1500))/1500;R*=Math.max(0,1-P)}if(g.uniforms.opacity.value=Math.max(0,R),_&&h.steadyStateReached)return l(m.group,o),c(m.group,R*.6),u>=2500&&u<=3500&&ei(u,d),!0;if(h.originalSkyValues&&h.timeOfDay!=="night"){ei(u,d);const P=0,E=.025,C=.01,k=.53;if(b){const G=u/v,$=G*G;s.material.uniforms.turbidity.value=h.originalSkyValues.turbidity+(P-h.originalSkyValues.turbidity)*$,s.material.uniforms.rayleigh.value=h.originalSkyValues.rayleigh+(E-h.originalSkyValues.rayleigh)*$,s.material.uniforms.mieCoefficient.value=h.originalSkyValues.mieCoefficient+(C-h.originalSkyValues.mieCoefficient)*$,i.toneMappingExposure=h.originalSkyValues.exposure+(k-h.originalSkyValues.exposure)*$}else if(x){const G=(u-T)/2e3,$=1-Math.pow(1-G,2),ae=h.originalSkyValues.turbidity+(P-h.originalSkyValues.turbidity)*(1-$),ke=h.originalSkyValues.rayleigh+(E-h.originalSkyValues.rayleigh)*(1-$),Ee=h.originalSkyValues.mieCoefficient+(C-h.originalSkyValues.mieCoefficient)*(1-$),Pe=h.originalSkyValues.exposure+(k-h.originalSkyValues.exposure)*(1-$);s.material.uniforms.turbidity.value=ae,s.material.uniforms.rayleigh.value=ke,s.material.uniforms.mieCoefficient.value=Ee,i.toneMappingExposure=Pe}else h.steadyStateReached||(h.steadyStateReached=!0,s.material.uniforms.turbidity.value=P,s.material.uniforms.rayleigh.value=E,s.material.uniforms.mieCoefficient.value=C,i.toneMappingExposure=k)}else h.timeOfDay==="night"&&ei(u,d);if(h.originalHemisphereColors&&h.water){const P=new O(4128),E=new O(2245717);if(b){const C=u/v,k=C*C;h.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(h.originalHemisphereColors.deepColor,P,k),h.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(h.originalHemisphereColors.shallowColor,E,k),h.timeOfDay!=="night"&&(h.terrainDarknessBlend=k*.5)}else if(x){const C=(u-T)/2e3,k=1-Math.pow(1-C,2);h.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(P,h.originalHemisphereColors.deepColor,k),h.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(E,h.originalHemisphereColors.shallowColor,k),h.timeOfDay!=="night"&&(h.terrainDarknessBlend=(1-k)*.5)}else h.steadyStateReached||(h.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(P),h.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(E),h.timeOfDay!=="night"&&(h.terrainDarknessBlend=.5))}if(h.originalWaterValues&&h.water){const E=h.duration-T,C=11.125,k=.55,G=.96;if(b){const $=Math.min(u/3e3,1),ae=$*$,ke=h.originalWaterValues.heightMultiplier+(C-h.originalWaterValues.heightMultiplier)*ae,Ee=h.originalWaterValues.amplitude+(k-h.originalWaterValues.amplitude)*ae,Pe=h.originalWaterValues.waterLevel-G*ae;h.water.mesh.position.y=Pe,h.water.setWaveChoppiness(ke,Ee)}else if(x){const $=Math.min((u-T)/E,1),ae=1-Math.pow(1-$,2),ke=C+(h.originalWaterValues.heightMultiplier-C)*ae,Ee=k+(h.originalWaterValues.amplitude-k)*ae,Pe=h.originalWaterValues.waterLevel-G+G*ae;h.water.mesh.position.y=Pe,h.water.setWaveChoppiness(ke,Ee)}else if(!h.steadyStateReached){const $=h.originalWaterValues.waterLevel-G;h.water.mesh.position.y=$,h.water.setWaveChoppiness(C,k)}}return l(m.group,o),c(m.group,R*.6),u>h.duration?(h.isActive=!1,h.terrainDarknessBlend=0,m.group&&(m.group.userData.drizzleSound&&ic(m.group.userData.drizzleSound),t.remove(m.group),m.group.traverse(P=>{P.geometry&&P.geometry.dispose(),P.material&&P.material.dispose()})),h.cloudData=null,h.originalSkyValues&&(h.originalSkyValues=null),h.originalWaterValues&&h.water&&(h.water.setWaveChoppiness(h.originalWaterValues.heightMultiplier,h.originalWaterValues.amplitude),h.water.mesh.position.y=h.originalWaterValues.waterLevel,h.originalWaterValues=null),h.originalHemisphereColors&&h.water&&(h.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(h.originalHemisphereColors.deepColor),h.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(h.originalHemisphereColors.shallowColor),h.originalHemisphereColors=null,h.water=null),lc(),!1):!0}const hs=[{id:1,name:"Desert Isle Revival",description:"A gentle introduction to island restoration",story:"Nothing stirred but heat and the sea",terrainShape:{size:14,scaleX:1,scaleY:1,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:1,distortion:{frequency:0,amplitude:0,randomness:0}},waterLevel:-1.747,winPercentage:.32,spawn:{enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:16,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.45,fadeInDuration:2800,fadeOutDuration:2800},difficulty:1,rewards:{points:1e3}},{id:2,name:"Sun-Scored Sands",description:"The water comes faster now",story:"The islands held their arid breath",terrainShape:{size:14.43,scaleX:1.24,scaleY:.82,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:.3,distortion:{frequency:.04,amplitude:.14,randomness:.032},turbulence:{strength:.465,scale:.1269,octaves:.98}},waterLevel:-2.07,winPercentage:.48,spawn:{enabled:!0,interval:6500,cloudDuration:5500,dropletsPerCloud:14,dropletInterval:380,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.8,fadeInDuration:2500,fadeOutDuration:2500},difficulty:2,rewards:{points:1500}},{id:3,name:"Ancient Challenge",description:"Less water to work with",story:"Raindrops like fists bruised the dust",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:Math.PI/4,amount:1.4},bay:{angle:0,depth:0,width:0},irregularity:1.15},waterLevel:-2.385,winPercentage:.52,spawn:{enabled:!0,interval:6e3,cloudDuration:5e3,dropletsPerCloud:15,dropletInterval:350,minRadius:.1,maxRadius:.16,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:2300,fadeOutDuration:2300},difficulty:3,rewards:{points:2e3}},{id:4,name:"Hollow Basin",description:"Every drop counts",story:"Stone refused to drink",terrainShape:{size:14.43,scaleX:1,scaleY:1,tilt:{angle:0,amount:.103},bay:{angle:6,depth:2.2,width:Math.PI/2.5},irregularity:1.426,distortion:{frequency:.4444,amplitude:3.28,randomness:.218},turbulence:{strength:5.422,scale:.0032,octaves:.2642}},waterLevel:-2.02,winPercentage:.58,spawn:{enabled:!0,interval:5e3,cloudDuration:4500,dropletsPerCloud:16,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3.3,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:4,rewards:{points:2500}},{id:5,name:"Drinking Stone",description:"The final test of water mastery",story:"Lips carved into land's edge",terrainShape:{size:15.62,scaleX:1.2,scaleY:.9,tilt:{angle:Math.PI/6,amount:.7},bay:{angle:Math.PI,depth:1.5,width:Math.PI/3},irregularity:2},waterLevel:-1.8,winPercentage:.42,spawn:{enabled:!0,interval:4500,cloudDuration:4e3,dropletsPerCloud:18,dropletInterval:300,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1800,fadeOutDuration:1800},difficulty:5,rewards:{points:3e3}},{id:6,name:"Mirage Archipelago",description:"A fragmented paradise - precision is everything",story:"Stormwater turned to slow soaking swale",terrainShape:{size:14.83,scaleX:1.028,scaleY:.98,tilt:{angle:Math.PI/5.23,amount:.85*2.123},bay:{angle:Math.PI/2,depth:1.8,width:Math.PI/2.8},irregularity:2.27},waterLevel:-1.189,winPercentage:.58,spawn:{enabled:!0,interval:3800,cloudDuration:3500,dropletsPerCloud:22,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:6,rewards:{points:4e3}},{id:7,name:"Vapor Crucible",description:"The sun steals water while you work",story:"The land tasted water and ground softened",terrainShape:{scaleX:1,scaleY:.96,tilt:{angle:Math.PI/4,amount:.29},bay:{angle:20,depth:-1,width:20},irregularity:2.8328,distortion:{frequency:.64,amplitude:.24,randomness:.2},turbulence:{strength:1.965,scale:.269,octaves:.98}},waterLevel:-3.66,winPercentage:.6,evaporationRate:.18,spawn:{enabled:!0,interval:7e3,cloudDuration:5e3,dropletsPerCloud:10,dropletInterval:500,minRadius:.11,maxRadius:.18,spawnHeight:10.2,cloudSpeed:2.2,fadeInDuration:3e3,fadeOutDuration:2e3},difficulty:7,rewards:{points:4500}},{id:8,name:"Split-Decision Atoll",description:"Clouds divide the moment they reach the island",story:"Earth cupped the rain like a secret",terrainShape:{scaleX:1.3,scaleY:.89,tilt:{angle:0,amount:0},bay:{angle:Math.PI,depth:1.2,width:Math.PI/2},irregularity:2.63},waterLevel:.18,winPercentage:.53,spawn:{enabled:!0,interval:5500,cloudDuration:4e3,dropletsPerCloud:14,dropletInterval:320,minRadius:.09,maxRadius:.14,spawnHeight:10.2,cloudSpeed:3,fadeInDuration:1800,fadeOutDuration:1800,splitClouds:!0,splitDelay:800},difficulty:8,rewards:{points:5e3}},{id:9,name:"Glass Dunes",description:"Rolling hills of slippery crystal sand - drops race through valleys",story:"Droplets slipped beneath to find dark places, waiting",terrainShape:{size:14.63,islandRadius:6.42,scaleX:.91,scaleY:.91,tilt:{angle:Math.PI/6,amount:1.2},bay:{angle:Math.PI/3,depth:1.5,width:Math.PI/4},irregularity:.8,distortion:{frequency:1.3,amplitude:.6,randomness:.21}},waterLevel:-2.75,winPercentage:.7,terrainFriction:.12,spawn:{enabled:!0,interval:5e3,cloudDuration:4200,dropletsPerCloud:17,dropletInterval:280,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.4,fadeInDuration:2e3,fadeOutDuration:2e3},difficulty:9,rewards:{points:5500}},{id:10,name:"Tide-Turned Throat",description:"A narrow channel that reverses flow every 20 s",story:"Roots respond to the aquifer's sigh",terrainShape:{scaleX:.62,scaleY:1.8,tilt:{angle:Math.PI/2,amount:.6},bay:{angle:Math.PI/2,depth:2.8,width:Math.PI/6},irregularity:1.2},waterLevel:-1.814,winPercentage:.56,tideCycle:2e4,tideForce:.4,spawn:{enabled:!0,interval:4800,cloudDuration:3800,dropletsPerCloud:19,dropletInterval:260,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.6,fadeInDuration:1700,fadeOutDuration:1700},difficulty:10,rewards:{points:6e3}},{id:11,name:"Adrift",description:"lost at sea",story:"Emerald hues of past fortunes sprung",terrainShape:{scaleX:1.25,scaleY:.85,tilt:{angle:Math.PI/4,amount:1.1},bay:{angle:3*Math.PI/4,depth:1.4,width:Math.PI/3},irregularity:1.8,distortion:{frequency:22.2,amplitude:.31,randomness:.03}},waterLevel:-2.3,winPercentage:.66,spawn:{enabled:!0,interval:4300,cloudDuration:3600,dropletsPerCloud:20,dropletInterval:240,minRadius:.07,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.8,fadeInDuration:1600,fadeOutDuration:1600},difficulty:11,rewards:{points:7e3}},{id:12,name:"Island Omega",description:"All previous twists combined—and the goal moves",story:"What you channel, you also become",terrainShape:{scaleX:1,scaleY:1,tilt:{angle:Math.PI/5,amount:.63},bay:{angle:Math.PI/3,depth:2,width:Math.PI/2.5*.23},irregularity:3.427,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:.22,scale:.32,octaves:.2642}},waterLevel:-2.1,winPercentage:.7,dynamicTarget:!0,targetCycle:15e3,evaporationRate:.12,splitClouds:!0,splitDelay:600,terrainFriction:.35,spawn:{enabled:!0,interval:3500,cloudDuration:3200,dropletsPerCloud:24,dropletInterval:200,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4.2,fadeInDuration:1400,fadeOutDuration:1400},difficulty:12,rewards:{points:1e4}},{id:13,name:"Shattered Archipelago",description:"A scattered chain of islands—turbulence has broken the land",story:"The ocean returned what had been lost",terrainShape:{size:19.43,islandRadius:8.12,scaleX:1,scaleY:1,tilt:{angle:14,amount:.141},bay:{angle:0,depth:0,width:0},irregularity:1.82,distortion:{frequency:.048,amplitude:4.44,randomness:.15},turbulence:{strength:2.6965,scale:.369,octaves:1.98}},waterLevel:-2,winPercentage:.75,multipleTargets:2,spawn:{enabled:!0,interval:4200,cloudDuration:3800,dropletsPerCloud:18,dropletInterval:270,minRadius:.08,maxRadius:.13,spawnHeight:10.2,cloudSpeed:3.5,fadeInDuration:1700,fadeOutDuration:1700},difficulty:13,rewards:{points:12e3}},{id:14,name:"Jagged Atoll",description:"Craggy peaks rise from the depths—navigate the chaos",story:"Clouds pause, listening for song",terrainShape:{size:19.012,islandRadius:8.16,scaleX:1.12,scaleY:.965,tilt:{angle:52,amount:.68},bay:{angle:Math.PI/4,depth:1.2,width:Math.PI/3},irregularity:1.785,distortion:{frequency:.46,amplitude:.52,randomness:.22},turbulence:{strength:3.42,scale:.343,octaves:2.41}},waterLevel:-1.8,winPercentage:.74,multipleTargets:2,spawn:{enabled:!0,interval:3900,cloudDuration:3500,dropletsPerCloud:20,dropletInterval:250,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.7,fadeInDuration:1600,fadeOutDuration:1600},difficulty:14,rewards:{points:14e3}},{id:15,name:"Chaos Reef",description:"The ocean has shattered reality—only skill remains",story:"Rain resumes its ancient rhythm",terrainShape:{size:21.62,islandRadius:9.464,scaleX:.98,scaleY:1.02,tilt:{angle:68,amount:.242},bay:{angle:Math.PI/1.25,depth:2.11,width:Math.PI/12.2},irregularity:5.31,distortion:{frequency:.444,amplitude:.28,randomness:.18},turbulence:{strength:3.822,scale:.232,octaves:.642}},waterLevel:-1.5,winPercentage:.076,multipleTargets:3,spawn:{enabled:!0,interval:3600,cloudDuration:3200,dropletsPerCloud:22,dropletInterval:230,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4,fadeInDuration:1500,fadeOutDuration:1500},difficulty:15,rewards:{points:16e3}},{id:16,name:"Celestial Pools",description:"Scattered heaven-sent basins demand perfect precision",story:"Beyond the journey lies mastery",isBonus:!0,terrainShape:{size:21.05,islandRadius:9.68,scaleX:1.013,scaleY:1.016,tilt:{angle:Math.PI/3,amount:4.95},bay:{angle:Math.PI/1.8,depth:2.5,width:Math.PI/8},irregularity:6.2,distortion:{frequency:.52,amplitude:.435,randomness:.625},turbulence:{strength:4.2,scale:.28,octaves:2.41}},waterLevel:-1.3,winPercentage:.8,multipleTargets:3,evaporationRate:.08,spawn:{enabled:!0,interval:3400,cloudDuration:3e3,dropletsPerCloud:24,dropletInterval:210,minRadius:.06,maxRadius:.1,spawnHeight:10.2,cloudSpeed:4.3,fadeInDuration:1400,fadeOutDuration:1400},difficulty:16,rewards:{points:2e4}},{id:17,name:"Hourglass Narrows",description:"Time slips through this impossible passage",story:"The patient stone wants for nothing",isBonus:!0,timeOfDay:"night",terrainShape:{size:19.75,islandRadius:12.5,scaleX:.45,scaleY:2.2,tilt:{angle:0,amount:1.8},bay:{angle:Math.PI/2,depth:3.2,width:Math.PI/10},irregularity:2.1,distortion:{frequency:.65,amplitude:2.42,randomness:.15},turbulence:{strength:2.8,scale:.25,octaves:1.5}},waterLevel:-2.2,winPercentage:.72,terrainFriction:.08,splitClouds:!0,splitDelay:600,multipleTargets:2,spawn:{enabled:!0,interval:3800,cloudDuration:3400,dropletsPerCloud:20,dropletInterval:240,minRadius:.07,maxRadius:.12,spawnHeight:10.2,cloudSpeed:3.9,fadeInDuration:1500,fadeOutDuration:1500},difficulty:17,rewards:{points:22e3}},{id:18,name:"Spiral Lagoon",description:"Water winds through an endless spiral—follow the curve",story:"Cycles return what flows away",isBonus:!0,timeOfDay:"night",terrainShape:{size:18.8,islandRadius:8.9,scaleX:1.15,scaleY:.96,tilt:{angle:Math.PI/2.5,amount:1.3},bay:{angle:Math.PI/3.5,depth:3.8,width:Math.PI/5.22},irregularity:4.5,distortion:{frequency:.2,amplitude:2.55,randomness:.28},turbulence:{strength:3.5,scale:.22,octaves:1.8}},waterLevel:-1.6,winPercentage:.174,evaporationRate:.15,splitClouds:!0,splitDelay:800,terrainFriction:.15,spawn:{enabled:!0,interval:3200,cloudDuration:2900,dropletsPerCloud:26,dropletInterval:200,minRadius:.06,maxRadius:.11,spawnHeight:10.2,cloudSpeed:4.4,fadeInDuration:1300,fadeOutDuration:1300},difficulty:18,rewards:{points:24e3}},{id:19,name:"Wind Shear Heights",description:"Break the wind or watch your water fly.",story:"Gales drank the drops before the earth",isBonus:!0,timeOfDay:"night",terrainShape:{size:14.6,scaleX:1,scaleY:1,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:1.5,turbulence:{strength:9.86,scale:.0652,octaves:.042}},waterLevel:-4.1368,winPercentage:.58,windSpeed:12,windLossRadius:.8,spawn:{enabled:!0,interval:6500,cloudDuration:5e3,dropletsPerCloud:14,dropletInterval:400,minRadius:.11,maxRadius:.16,spawnHeight:10.2,cloudSpeed:2.6,fadeInDuration:2200,fadeOutDuration:2200},difficulty:14,rewards:{points:2500}},{id:20,name:"Salinity Citadel",description:"Rinse the salt before the soil can drink.",story:"Taste of pure rain.",isBonus:!0,terrainShape:{size:16.42,scaleX:1.15,scaleY:.96,tilt:{angle:0,amount:0},bay:{angle:0,depth:0,width:0},irregularity:11.2,distortion:{frequency:1.2,amplitude:.25,randomness:.28},turbulence:{strength:5.5,scale:.22,octaves:1.8}},waterLevel:-1.9,winPercentage:.4,multipleTargets:2,spawn:{enabled:!0,interval:7e3,cloudDuration:5500,dropletsPerCloud:15,dropletInterval:450,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.4,fadeInDuration:2500,fadeOutDuration:2500},difficulty:13,rewards:{points:2e3}},{id:21,name:"Infinite Oasis",description:"The final elements converge in perfect chaos",story:"What you have learned, you now pass on",isBonus:!0,terrainShape:{size:28.18,islandRadius:13.52,scaleX:1.15,scaleY:1.05,tilt:{angle:Math.PI/4.5,amount:1.1},bay:{angle:Math.PI/2.2,depth:2.4,width:Math.PI/7},irregularity:7.8,distortion:{frequency:.48,amplitude:.38,randomness:.32},turbulence:{strength:5.62,scale:.219,octaves:2.65}},waterLevel:-1.2,winPercentage:.178,multipleTargets:4,evaporationRate:.18,splitClouds:!0,splitDelay:700,terrainFriction:.12,spawn:{enabled:!0,interval:3e3,cloudDuration:2700,dropletsPerCloud:28,dropletInterval:190,minRadius:.05,maxRadius:.1,spawnHeight:10.2,cloudSpeed:4.6,fadeInDuration:1200,fadeOutDuration:1200},difficulty:19,rewards:{points:3e4}}];function gs(a){return hs.find(e=>e.id===a)||hs[0]}function Go(){return hs.length}const Ro=Object.freeze(Object.defineProperty({__proto__:null,LEVELS:hs,getLevelById:gs,getTotalLevels:Go},Symbol.toStringTag,{value:"Module"})),Wt={url:"https://bvbzhpcxrutiriqndcfy.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2YnpocGN4cnV0aXJpcW5kY2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDM4MDIsImV4cCI6MjA3Nzc3OTgwMn0.vjforq20xOL5jTMbaAOgesSCl8UJj6fN03CevS5gc_A"},Ur={success:"check_circle",error:"error",warning:"warning",info:"info",achievement:"emoji_events",daily:"today"},cr=4e3;function Mf(){if(!document.getElementById("toast-container")){const a=document.createElement("div");a.id="toast-container",a.className="toast-container",document.body.appendChild(a)}}function Os(a,e="info",t=cr){Mf();const n=document.getElementById("toast-container"),o=document.createElement("div"),s=`toast-${Date.now()}-${Math.random()}`;o.id=s,o.className=`toast toast-${e}`;const i=Ur[e]||Ur.info;return o.innerHTML=`
    <span class="toast-icon material-icons">${i}</span>
    <span class="toast-message">${a}</span>
    <button class="toast-close" aria-label="Close">
      <span class="material-icons">close</span>
    </button>
  `,n.appendChild(o),requestAnimationFrame(()=>{o.classList.add("toast-show")}),o.querySelector(".toast-close").addEventListener("click",()=>{Gr(o)}),t>0&&setTimeout(()=>{Gr(o)},t),o}function Gr(a){!a||!a.parentElement||(a.classList.remove("toast-show"),a.classList.add("toast-hide"),setTimeout(()=>{a.parentElement&&a.remove()},300))}function cc(a,e=cr){return Os(a,"success",e)}function $r(a,e=cr){return Os(a,"error",e)}function xf(a,e=5e3){return Os(a,"achievement",e)}function Ef(a,e=6e3){return Os(a,"daily",e)}const Oo={speed_runner:{id:"speed_runner",name:"Speed Runner",description:"Restore all 15 islands before the second rainstorm @ 2:30",icon:"speed",iconColor:"#FFD700",rarity:"legendary",global:!0},perfectionist:{id:"perfectionist",name:"Perfectionist",description:"Collect 100% water on any level",icon:"grade",iconColor:"#9C27B0",rarity:"epic",global:!0},minimalist:{id:"minimalist",name:"Minimalist",description:"Complete all 15 levels with exceptional efficiency",icon:"eco",iconColor:"#4CAF50",rarity:"legendary",global:!0},marathon:{id:"marathon",name:"Marathon",description:"Complete 10 levels in a single session",icon:"local_fire_department",iconColor:"#FF5722",rarity:"rare",global:!0},perfect_level:{id:"perfect_level",name:"Perfect Island",description:"Achieve 100% water collection",icon:"water_drop",iconColor:"#2196F3",rarity:"rare",global:!1}};let ti=null;function ur(){if(!ti){const a=Wt.url,e=Wt.anonKey;ti=Lo(a,e)}return ti}async function uc(a,e,t){if(!ur())return console.log("⚠️ Achievements disabled: Supabase not configured"),[];const o=[];try{if(await If(a,t)){const s=await gn(a,"speed_runner");s&&o.push(s)}if(e.waterPercentage>=1){const s=await gn(a,"perfectionist",null,{level_id:e.levelId,score:e.totalScore,water_percentage:e.waterPercentage});s&&o.push(s)}if(await Df(a,t)){const s=await gn(a,"minimalist");s&&o.push(s)}if(await Pf(a,e.sessionId,t)){const s=await gn(a,"marathon",null,{session_id:e.sessionId});s&&o.push(s)}if(e.waterPercentage>=1){const s=await gn(a,"perfect_level",e.levelId,{score:e.totalScore,water_percentage:e.waterPercentage});s&&o.push(s)}}catch(s){console.error("Error checking achievements:",s)}return o}async function If(a,e){try{const o=await e.getPlayerLevelBests(a);return o.length<15?!1:o.every(i=>i.completionTimeMs<15e4)}catch(o){return console.error("Error checking Speed Runner:",o),!1}}async function Df(a,e){try{if((await e.getPlayerLevelBests(a)).length<15)return!1;const i=(await e.getPlayerScores(a,1e3)).filter(l=>l.efficiencyScore&&l.efficiencyScore>0);return i.length<15?!1:i.reduce((l,c)=>l+c.efficiencyScore,0)/i.length>=3}catch(o){return console.error("Error checking Minimalist:",o),!1}}async function Pf(a,e,t){try{const s=(await t.storage.getAllScores()).filter(r=>r.playerId===a&&r.sessionId===e);return new Set(s.map(r=>r.levelId)).size>=10}catch(o){return console.error("Error checking Marathon:",o),!1}}async function gn(a,e,t=null,n=null){const o=ur();if(!o)return null;try{const{data:s,error:i}=await o.rpc("award_achievement",{p_player_id:a,p_achievement_type:e,p_level_id:t,p_metadata:n});if(i)throw i;if(s){const r=Oo[e];return _f(r),{id:s,...r,earnedAt:new Date}}return null}catch(s){return console.error("Error awarding achievement:",s),null}}async function dc(a){const e=ur();if(!e)return[];try{const{data:t,error:n}=await e.rpc("get_player_achievements",{p_player_id:a});if(n)throw n;return t.map(o=>({...o,...Oo[o.achievement_type],earnedAt:new Date(o.earned_at)}))}catch(t){return console.error("Error fetching player achievements:",t),[]}}function _f(a){xf(`Achievement unlocked: ${a.name}!`)}function Af(a,e=!1){const t=Oo[a.achievement_type]||a;return e?`
      <div class="achievement-badge achievement-locked" style="
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: rgba(100, 100, 100, 0.2);
        border: 1px solid rgba(150, 150, 150, 0.3);
        border-radius: 12px;
        margin: 2px;
        opacity: 0.4;
      " title="🔒 ${t.name}: ${t.description}">
        <span class="material-icons" style="
          font-size: 16px;
          color: #666;
        ">${t.icon}</span>
        <span style="
          font-size: 11px;
          font-weight: 500;
          color: #888;
        ">${t.name}</span>
      </div>
    `:`
    <div class="achievement-badge achievement-unlocked" style="
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: ${t.iconColor}22;
      border: 1px solid ${t.iconColor};
      border-radius: 12px;
      margin: 2px;
    " title="✅ ${t.name}: ${t.description}">
      <span class="material-icons" style="
        font-size: 16px;
        color: ${t.iconColor};
      ">${t.icon}</span>
      <span style="
        font-size: 11px;
        font-weight: 500;
        color: ${t.iconColor};
      ">${t.name}</span>
    </div>
  `}async function Lf(a){const e=await dc(a),t=new Set(e.map(n=>n.achievement_type));return Object.values(Oo).filter(n=>n.global).map(n=>({...n,achievement_type:n.id,isUnlocked:t.has(n.id),earnedAt:e.find(o=>o.achievement_type===n.id)?.earnedAt})).sort((n,o)=>n.isUnlocked&&!o.isUnlocked?-1:!n.isUnlocked&&o.isUnlocked?1:n.name.localeCompare(o.name))}const mc=Object.freeze(Object.defineProperty({__proto__:null,ACHIEVEMENTS:Oo,awardAchievement:gn,checkAndAwardAchievements:uc,getAchievementBadgeHTML:Af,getAllAchievementsWithStatus:Lf,getPlayerAchievements:dc},Symbol.toStringTag,{value:"Module"}));function je(){let a=localStorage.getItem("oasea_player_id");return a||(a=crypto.randomUUID(),localStorage.setItem("oasea_player_id",a)),a}function Cf(){return localStorage.getItem("oasea_player_name")||""}function fc(){let a=sessionStorage.getItem("oasea_session_id");return a||(a=crypto.randomUUID(),sessionStorage.setItem("oasea_session_id",a)),a}class Rf{constructor(e,t){this.supabase=Lo(e,t),this.STATS_CACHE_KEY="oasea_stats_cache"}async getAllScores(){try{const{data:e,error:t}=await this.supabase.from("scores").select("*").order("created_at",{ascending:!1});if(t)throw t;return e.map(n=>({id:n.id,playerId:n.player_id,levelId:n.level_id,playerName:n.player_name,basePoints:n.base_points,bonusPoints:n.bonus_points,timeBonus:n.time_bonus,totalScore:n.total_score,waterPercentage:parseFloat(n.water_percentage),completionTimeMs:n.completion_time_ms,terrainEdits:n.terrain_edits||0,efficiencyScore:parseFloat(n.efficiency_score)||0,sessionId:n.session_id,dailyNumber:n.day_number,timestamp:n.created_at?new Date(n.created_at.endsWith("Z")?n.created_at:n.created_at+"Z").getTime():new Date(n.date).getTime(),date:n.date}))}catch(e){return console.error("Error fetching scores from Supabase:",e),[]}}async ensurePlayerExists(e,t){try{const{data:n,error:o}=await this.supabase.from("players").select("*").eq("player_id",e).single();if(n){if(t&&n.display_name!==t){const{error:r}=await this.supabase.rpc("update_player_display_name",{p_player_id:e,p_display_name:t});r&&console.error("Error updating player name:",r)}return n}const{data:s,error:i}=await this.supabase.from("players").insert({player_id:e,display_name:t||"Anonymous"}).select().single();if(i)throw i;return s}catch(n){return console.error("Error ensuring player exists:",n),null}}async saveScore(e){try{await this.ensurePlayerExists(e.playerId,e.playerName);const t={player_id:e.playerId,player_name:e.playerName,level_id:e.levelId,base_points:e.basePoints,bonus_points:e.bonusPoints,time_bonus:e.timeBonus,total_score:e.totalScore,water_percentage:e.waterPercentage,completion_time_ms:e.completionTimeMs,terrain_edits:e.terrainEdits||0,efficiency_score:e.efficiencyScore||0,date:e.date,session_id:e.sessionId};e.dailyNumber!==void 0&&(t.day_number=e.dailyNumber);const{error:n}=await this.supabase.from("scores").insert(t);if(n)throw n;await this.updatePlayerStats(e.playerId),localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){throw console.error("Error saving score to Supabase:",t),t}}async updatePlayerStats(e){try{const{error:t}=await this.supabase.rpc("update_player_stats",{p_player_id:e});if(t)throw t}catch(t){console.error("Error updating player stats:",t)}}async getCachedStats(){const e=localStorage.getItem(this.STATS_CACHE_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_CACHE_KEY,JSON.stringify(e))}async clearScoresBefore(e){try{const t=new Date(e).toISOString().split("T")[0],{error:n}=await this.supabase.from("scores").delete().lt("date",t);if(n)throw n;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(t){console.error("Error clearing old scores:",t)}}async clearAllScores(){try{const{error:e}=await this.supabase.from("scores").delete().neq("id",0);if(e)throw e;localStorage.removeItem(this.STATS_CACHE_KEY)}catch(e){console.error("Error clearing all scores:",e)}}async getPlayerProfile(e){try{const{data:t,error:n}=await this.supabase.from("players").select("*").eq("player_id",e).single();if(n)throw n;return{playerId:t.player_id,displayName:t.display_name,firstSeenAt:new Date(t.first_seen_at).getTime(),lastSeenAt:new Date(t.last_seen_at).getTime(),totalScore:t.total_score,levelsCompleted:t.levels_completed,totalPlayTimeMs:t.total_play_time_ms,bestSingleScore:t.best_single_score,totalGamesPlayed:t.total_games_played}}catch(t){return console.error("Error fetching player profile:",t),null}}async getPlayerScores(e,t=10){try{const{data:n,error:o}=await this.supabase.from("scores").select("*").eq("player_id",e).order("created_at",{ascending:!1}).limit(t);if(o)throw o;return n.map(s=>({id:s.id,playerId:s.player_id,levelId:s.level_id,playerName:s.player_name,basePoints:s.base_points,bonusPoints:s.bonus_points,timeBonus:s.time_bonus,totalScore:s.total_score,waterPercentage:parseFloat(s.water_percentage),completionTimeMs:s.completion_time_ms,terrainEdits:s.terrain_edits||0,efficiencyScore:parseFloat(s.efficiency_score)||0,sessionId:s.session_id,dailyNumber:s.day_number,timestamp:s.created_at?new Date(s.created_at.endsWith("Z")?s.created_at:s.created_at+"Z").getTime():new Date(s.date).getTime(),date:s.date}))}catch(n){return console.error("Error fetching player scores:",n),[]}}async getPlayerLevelBests(e){try{const{data:t,error:n}=await this.supabase.from("scores").select("level_id, total_score, water_percentage, completion_time_ms, created_at").eq("player_id",e).order("level_id").order("total_score",{ascending:!1});if(n)throw n;const o={};return t.forEach(s=>{(!o[s.level_id]||s.total_score>o[s.level_id].totalScore)&&(o[s.level_id]={levelId:s.level_id,totalScore:s.total_score,waterPercentage:parseFloat(s.water_percentage),completionTimeMs:s.completion_time_ms,timestamp:new Date(s.created_at).getTime()})}),Object.values(o)}catch(t){return console.error("Error fetching player level bests:",t),[]}}}class Of{constructor(){this.SCORES_KEY="oasea_scores",this.STATS_KEY="oasea_stats"}async getAllScores(){const e=localStorage.getItem(this.SCORES_KEY);return e?JSON.parse(e):[]}async saveScore(e){const t=await this.getAllScores();t.push(e),localStorage.setItem(this.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.STATS_KEY)}async getCachedStats(){const e=localStorage.getItem(this.STATS_KEY);return e?JSON.parse(e):null}async setCachedStats(e){localStorage.setItem(this.STATS_KEY,JSON.stringify(e))}async clearScoresBefore(e){const n=(await this.getAllScores()).filter(o=>o.timestamp>=e);localStorage.setItem(this.SCORES_KEY,JSON.stringify(n)),localStorage.removeItem(this.STATS_KEY)}async clearAllScores(){localStorage.removeItem(this.SCORES_KEY),localStorage.removeItem(this.STATS_KEY)}}class vn{constructor(e=null){this.storage=e||new Of}calculateScore(e,t,n,o="",s=0){let i;e===999?i=ut.currentDailyLevel||gs(e):i=gs(e);const r=je(),l=fc(),c=i.rewards.points,d=this.calculateBonusPoints(i,t,c),u=this.calculateTimeBonus(i,n,c),m=c+d+u,f=s>0?t*100/Math.sqrt(s):0,p={playerId:r,sessionId:l,levelId:e,playerName:o.trim(),basePoints:c,bonusPoints:d,timeBonus:u,totalScore:m,waterPercentage:t,completionTimeMs:n,terrainEdits:s,efficiencyScore:f,timestamp:Date.now(),date:this.getTodayDateString()};return i.dailyNumber!==void 0&&(p.dailyNumber=i.dailyNumber),p}calculateBonusPoints(e,t,n){const o=t-e.winPercentage;if(o<=0)return 0;const i=Math.floor(o*n*1.5);return Math.max(0,i)}calculateTimeBonus(e,t,n){const s=e.difficulty*9e4-t;if(s<=0)return 0;const i=Math.max(1,Math.floor(n/1e3)),l=Math.floor(s/1e3)*i;return Math.max(0,l)}async saveScore(e){await this.storage.saveScore(e);try{const t=await uc(e.playerId,e,this);t.length>0&&console.log(`🏆 Unlocked ${t.length} new achievement(s)!`)}catch(t){console.error("Error checking achievements:",t)}}async getTopScoresToday(e=10){const t=await this.storage.getAllScores(),n=this.getTodayDateString();return t.filter(o=>o.date===n).filter(o=>this.isValidScore(o)).sort((o,s)=>this.compareScores(o,s)).slice(0,e)}async getTopScoresAllTime(e=10){return(await this.storage.getAllScores()).filter(n=>this.isValidScore(n)).sort((n,o)=>this.compareScores(n,o)).slice(0,e)}async getTopScoresForLevel(e,t=10){return(await this.storage.getAllScores()).filter(o=>o.levelId===e).filter(o=>this.isValidScore(o)).sort((o,s)=>this.compareScores(o,s)).slice(0,t)}getThisMonthString(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0");return`${t}-${n}`}async getTopScoresThisMonth(e=10){const t=await this.storage.getAllScores(),n=this.getThisMonthString();return t.filter(o=>o.date&&o.date.startsWith(n)).filter(o=>this.isValidScore(o)).sort((o,s)=>this.compareScores(o,s)).slice(0,e)}async getFilteredLeaderboard({levelId:e="all",period:t="today",limit:n=10}){let o=await this.storage.getAllScores();if(e!=="all"){const s=parseInt(e);o=o.filter(i=>i.levelId===s)}if(t==="today"){const s=this.getTodayDateString();o=o.filter(i=>i.date===s)}else if(t==="month"){const s=this.getThisMonthString();o=o.filter(i=>i.date&&i.date.startsWith(s))}if(o=o.filter(s=>this.isValidScore(s)),parseInt(e)===999){const s=new Map;o.forEach(i=>{const r=i.playerId,l=s.get(r);(!l||this.compareScores(i,l)<0)&&s.set(r,i)}),o=Array.from(s.values())}return o.sort((s,i)=>this.compareScores(s,i)).slice(0,n)}async getPlayerRank(e,{levelId:t="all",period:n="today"}){let o=await this.storage.getAllScores();if(t!=="all"){const r=parseInt(t);o=o.filter(l=>l.levelId===r)}if(n==="today"){const r=this.getTodayDateString();o=o.filter(l=>l.date===r)}else if(n==="month"){const r=this.getThisMonthString();o=o.filter(l=>l.date&&l.date.startsWith(r))}if(o=o.filter(r=>this.isValidScore(r)),parseInt(t)===999){const r=new Map;o.forEach(l=>{const c=l.playerId,d=r.get(c);(!d||this.compareScores(l,d)<0)&&r.set(c,l)}),o=Array.from(r.values())}o=o.sort((r,l)=>this.compareScores(r,l));const s=o.find(r=>r.playerId===e);return s?{rank:o.findIndex(r=>r.playerId===e)+1,bestScore:s.totalScore,totalScores:o.length}:{rank:null,bestScore:null,totalScores:o.length}}isValidScore(e){return e.waterPercentage>.01&&e.completionTimeMs>0&&e.totalScore>0}compareScores(e,t){const n=this.isValidScore(e),o=this.isValidScore(t);return n&&!o?-1:!n&&o?1:!n&&!o?0:t.totalScore-e.totalScore}async getLevelStats(e){const n=(await this.storage.getAllScores()).filter(l=>l.levelId===e).filter(l=>this.isValidScore(l));if(n.length===0)return{timesCompleted:0,bestScore:0,bestTime:null,avgScore:0,avgTime:0};const o=Math.max(...n.map(l=>l.totalScore)),s=Math.min(...n.map(l=>l.completionTimeMs)),i=Math.floor(n.reduce((l,c)=>l+c.totalScore,0)/n.length),r=Math.floor(n.reduce((l,c)=>l+c.completionTimeMs,0)/n.length);return{timesCompleted:n.length,bestScore:o,bestTime:s,avgScore:i,avgTime:r}}async getTotalStats(){const e=await this.storage.getCachedStats();if(e&&Date.now()-e.timestamp<6e4)return e.stats;const n=(await this.storage.getAllScores()).filter(l=>this.isValidScore(l));let o=null;if(n.length>0){const l={};n.forEach(d=>{l[d.levelId]=(l[d.levelId]||0)+1});const c=Math.max(...Object.values(l));o=parseInt(Object.keys(l).find(d=>l[d]===c))}const s=n.length>0?n.reduce((l,c)=>l+c.waterPercentage,0)/n.length:0,i=n.length>0?Math.min(...n.map(l=>l.completionTimeMs)):0,r={totalScore:n.reduce((l,c)=>l+c.totalScore,0),levelsCompleted:new Set(n.map(l=>l.levelId)).size,totalPlayTime:n.reduce((l,c)=>l+c.completionTimeMs,0),avgScore:n.length>0?Math.floor(n.reduce((l,c)=>l+c.totalScore,0)/n.length):0,bestSingleScore:n.length>0?Math.max(...n.map(l=>l.totalScore)):0,fastestTime:i,avgWaterPercentage:s,favoriteIsland:o};return await this.storage.setCachedStats({stats:r,timestamp:Date.now()}),r}async getMyStats(){const e=je(),n=(await this.storage.getAllScores()).filter(l=>l.playerId===e).filter(l=>this.isValidScore(l));let o=null;if(n.length>0){const l={};n.forEach(d=>{l[d.levelId]=(l[d.levelId]||0)+1});const c=Math.max(...Object.values(l));o=parseInt(Object.keys(l).find(d=>l[d]===c))}const s=n.length>0?n.reduce((l,c)=>l+c.waterPercentage,0)/n.length:0,i=n.filter(l=>l.levelId===999&&l.dailyNumber),r=new Set(i.map(l=>l.dailyNumber)).size;return{totalScore:n.reduce((l,c)=>l+c.totalScore,0),levelsCompleted:new Set(n.map(l=>l.levelId)).size,totalPlayTime:n.reduce((l,c)=>l+c.completionTimeMs,0),avgScore:n.length>0?Math.floor(n.reduce((l,c)=>l+c.totalScore,0)/n.length):0,bestSingleScore:n.length>0?Math.max(...n.map(l=>l.totalScore)):0,dailyLevelsPlayed:r,avgWaterPercentage:s,favoriteIsland:o}}async getPersonalBest(e){const t=await this.getTopScoresForLevel(e,1);return t.length>0?t[0]:null}async isNewPersonalBest(e,t){const n=await this.getPersonalBest(e);return!n||t>n.totalScore}async cleanupOldScores(e=90){const t=Date.now()-e*24*60*60*1e3;await this.storage.clearScoresBefore(t)}async resetAllScores(){await this.storage.clearAllScores()}async cleanupInvalidScores(){const e=await this.storage.getAllScores(),t=e.filter(o=>this.isValidScore(o)),n=e.length-t.length;return n>0&&(localStorage.setItem(this.storage.SCORES_KEY,JSON.stringify(t)),localStorage.removeItem(this.storage.STATS_KEY),console.log(`Cleaned up ${n} invalid score(s)`)),n}getTodayDateString(){const e=new Date,t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${o}`}async getPlayerProfile(e){return typeof this.storage.getPlayerProfile=="function"?await this.storage.getPlayerProfile(e):null}async getPlayerScores(e,t=10){return typeof this.storage.getPlayerScores=="function"?await this.storage.getPlayerScores(e,t):(await this.storage.getAllScores()).filter(o=>o.playerId===e).sort((o,s)=>s.timestamp-o.timestamp).slice(0,t)}async getPlayerLevelBests(e){if(typeof this.storage.getPlayerLevelBests=="function")return await this.storage.getPlayerLevelBests(e);const n=(await this.storage.getAllScores()).filter(s=>s.playerId===e),o={};return n.forEach(s=>{(!o[s.levelId]||s.totalScore>o[s.levelId].totalScore)&&(o[s.levelId]={levelId:s.levelId,totalScore:s.totalScore,waterPercentage:s.waterPercentage,completionTimeMs:s.completionTimeMs,timestamp:s.timestamp})}),Object.values(o)}async getDailyLeaderboard(e=10){const t=await this.storage.getAllScores(),n=this.getTodayDateString();return t.filter(o=>o.levelId===999&&o.date===n).filter(o=>this.isValidScore(o)).sort((o,s)=>this.compareScores(o,s)).slice(0,e)}async getDailyLeaderboardForDate(e,t=10){return(await this.storage.getAllScores()).filter(o=>o.levelId===999&&o.date===e).filter(o=>this.isValidScore(o)).sort((o,s)=>this.compareScores(o,s)).slice(0,t)}async getPlayerDailyHistory(e,t=7){return(await this.storage.getAllScores()).filter(o=>o.playerId===e&&o.levelId===999).filter(o=>this.isValidScore(o)).sort((o,s)=>s.timestamp-o.timestamp).slice(0,t)}async getPlayerDailyRank(e){const t=await this.getDailyLeaderboard(1e3),n=t.find(i=>i.playerId===e);if(!n)return null;const o=t.findIndex(i=>i.playerId===e)+1,s=t.length;return{rank:o,totalPlayers:s,score:n.totalScore,percentile:Math.round((1-o/s)*100)}}async getDailyStats(e=null){const t=e||this.getTodayDateString(),o=(await this.storage.getAllScores()).filter(i=>i.levelId===999&&i.date===t).filter(i=>this.isValidScore(i));return o.length===0?{uniquePlayers:0,totalAttempts:0,avgScore:0,bestScore:0,avgTime:0,bestTime:0}:{uniquePlayers:new Set(o.map(i=>i.playerId)).size,totalAttempts:o.length,avgScore:Math.floor(o.reduce((i,r)=>i+r.totalScore,0)/o.length),bestScore:Math.max(...o.map(i=>i.totalScore)),avgTime:Math.floor(o.reduce((i,r)=>i+r.completionTimeMs,0)/o.length),bestTime:Math.min(...o.map(i=>i.completionTimeMs))}}static formatTime(e){const t=Math.floor(e/1e3),n=Math.floor(t/60),o=t%60;return n>0?`${n}:${o.toString().padStart(2,"0")}`:`${t}s`}static formatScore(e){return e.toLocaleString()}}let pc;const kf=Wt.url,Ff=Wt.anonKey;pc=new Rf(kf,Ff);const bt=new vn(pc);typeof window<"u"&&(window.cleanupInvalidScores=async()=>{const a=await bt.cleanupInvalidScores();return console.log(`✓ Cleaned up ${a} invalid score(s)`),a},window.viewAllScores=async()=>{const a=await bt.storage.getAllScores();return console.table(a.map(e=>({player:e.playerName||"Anonymous",level:e.levelId,score:e.totalScore,water:`${Math.round(e.waterPercentage*100)}%`,time:vn.formatTime(e.completionTimeMs),date:e.date,valid:bt.isValidScore(e)?"✓":"✗"}))),a},window.viewDailyLeaderboard=async(a=10)=>{const e=await bt.getDailyLeaderboard(a);return console.table(e.map((t,n)=>({rank:n+1,player:t.playerName||"Anonymous",score:t.totalScore,water:`${Math.round(t.waterPercentage*100)}%`,time:vn.formatTime(t.completionTimeMs),edits:t.terrainEdits}))),e},window.viewDailyStats=async()=>{const a=await bt.getDailyStats();return console.log("📊 Today's Daily Challenge Stats:"),console.log(`  Players: ${a.uniquePlayers}`),console.log(`  Attempts: ${a.totalAttempts}`),console.log(`  Best Score: ${a.bestScore}`),console.log(`  Avg Score: ${a.avgScore}`),console.log(`  Best Time: ${vn.formatTime(a.bestTime)}`),console.log(`  Avg Time: ${vn.formatTime(a.avgTime)}`),a},window.viewMyDailyRank=async()=>{const a=je(),e=await bt.getPlayerDailyRank(a);return e?(console.log("🏆 Your Daily Challenge Rank:"),console.log(`  Rank: #${e.rank} out of ${e.totalPlayers}`),console.log(`  Score: ${e.score}`),console.log(`  Percentile: Top ${100-e.percentile}%`),e):(console.log("❌ You haven't played today's daily challenge yet!"),null)},window.viewLocalData=()=>{console.log("💾 Current localStorage data:"),console.log("");const a={};for(let i=0;i<localStorage.length;i++){const r=localStorage.key(i);if(r&&r.startsWith("oasea_")){let l=localStorage.getItem(r);try{const c=JSON.parse(l);Array.isArray(c)?(a[r]=`Array(${c.length})`,console.log(`  ${r}: Array with ${c.length} items`),r==="completedLevels"&&c.length>0&&console.log("    Completed levels:",c.map(d=>`Level ${d.levelId} (${d.stars}⭐)`).join(", "))):typeof c=="object"?(a[r]="Object",console.log(`  ${r}: Object`),console.log("    ",c)):(a[r]=c,console.log(`  ${r}: ${c}`))}catch{a[r]=l.length>50?l.substring(0,50)+"...":l,console.log(`  ${r}: ${l.length>50?l.substring(0,50)+"...":l}`)}}}const e=localStorage.getItem("oasea_player_id"),t=localStorage.getItem("oasea_player_name"),n=localStorage.getItem("oasea_player_name_set"),o=localStorage.getItem("currentLevelId"),s=localStorage.getItem("completedLevels");if((e||t||n)&&(console.log(""),console.log("👤 Player Info:"),e&&console.log(`  Player ID: ${e}`),t&&console.log(`  Player Name: ${t}`),n&&console.log(`  Name Set: ${n==="true"?"Yes":"No"}`)),(o||s)&&(console.log(""),console.log("🎮 Level Progression:"),o&&console.log(`  Current Level: ${o}`),s))try{const i=JSON.parse(s);console.log(`  Levels Completed: ${i.length}`);const r=i.reduce((l,c)=>l+c.stars,0);console.log(`  Total Stars: ${r}`)}catch{}return console.log(""),console.log(`Total Oasea localStorage items: ${Object.keys(a).length}`),console.log(""),console.log("💡 To clear all data: localStorage.clear()"),console.log('💡 To clear specific item: localStorage.removeItem("oasea_player_id")'),a},window.clearLocalData=()=>{const a=[];for(let e=0;e<localStorage.length;e++){const t=localStorage.key(e);t&&t.startsWith("oasea_")&&a.push(t)}if(a.length===0){console.log("✓ No Oasea data to clear");return}console.log(`🗑️  Clearing ${a.length} Oasea localStorage items...`),a.forEach(e=>{localStorage.removeItem(e),console.log(`  ✓ Removed: ${e}`)}),console.log(""),console.log("✓ All Oasea data cleared! Reload the page to start fresh.")});const Et=Object.freeze(Object.defineProperty({__proto__:null,ScoreSystem:vn,getOrCreatePlayerId:je,getOrCreateSessionId:fc,getPlayerName:Cf,scoreSystem:bt},Symbol.toStringTag,{value:"Module"}));class Nf{constructor(){this.currentLevelId=parseInt(localStorage.getItem("currentLevelId"))||1,this.completedLevels=JSON.parse(localStorage.getItem("completedLevels")||"[]"),this.levelStartTime=null,this.levelElapsedTime=0,this.currentDailyLevel=null,this.currentLevelId===999&&this.initializeDailyLevel(),this.currentLevelId!==999&&this.currentLevelId>Go()&&(this.currentLevelId=Go())}async initializeDailyLevel(){const e=localStorage.getItem("currentDailyLevel");if(e)try{this.currentDailyLevel=JSON.parse(e)}catch(t){console.error("Failed to parse stored daily level:",t),this.currentDailyLevel=null}if(this.currentDailyLevel)try{const{canPlayDailyForFree:t}=await J(async()=>{const{canPlayDailyForFree:o}=await Promise.resolve().then(()=>Aa);return{canPlayDailyForFree:o}},void 0);if(!await t()){this.restorePreviousLevel();return}}catch(t){console.error("Error checking daily play eligibility:",t)}else this.restorePreviousLevel()}restorePreviousLevel(){const e=parseInt(localStorage.getItem("previousLevelId"));e&&e!==999?this.currentLevelId=e:this.currentLevelId=1,this.saveCurrentLevel(),this.currentDailyLevel=null,localStorage.removeItem("currentDailyLevel")}getCurrentLevel(){return this.currentLevelId===999&&this.currentDailyLevel?this.currentDailyLevel:gs(this.currentLevelId)}getCurrentLevelId(){return this.currentLevelId}nextLevel(){return this.currentLevelId===15||this.currentLevelId>=21?null:(this.currentLevelId++,this.saveCurrentLevel(),this.getCurrentLevel())}startLevelTimer(){this.levelStartTime=Date.now(),this.levelElapsedTime=0}stopLevelTimer(){return this.levelStartTime?(this.levelElapsedTime=Date.now()-this.levelStartTime,this.levelElapsedTime):0}getCurrentElapsedTime(){return this.levelStartTime?Date.now()-this.levelStartTime:0}resetLevelTimer(){this.levelStartTime=null,this.levelElapsedTime=0}async completeLevel(e=3,t=0,n=0){const o=this.stopLevelTimer();if(t<=.01||o<=0)return console.warn("Invalid game completion - not saving score"),{basePoints:0,bonusPoints:0,timeBonus:0,totalScore:0,waterPercentage:0,completionTimeMs:0,isPersonalBest:!1,valid:!1};const s=this.completedLevels.findIndex(d=>d.levelId===this.currentLevelId),i={levelId:this.currentLevelId,timestamp:Date.now(),stars:e,completed:!0};s>=0?e>this.completedLevels[s].stars&&(this.completedLevels[s]=i):this.completedLevels.push(i),this.saveCompletedLevels();const r=localStorage.getItem("oasea_player_name")||"",l=bt.calculateScore(this.currentLevelId,t,o,r,n);if(await bt.saveScore(l),this.currentLevelId===999)try{const{recordDailyCompletion:d}=await J(async()=>{const{recordDailyCompletion:u}=await Promise.resolve().then(()=>Aa);return{recordDailyCompletion:u}},void 0);await d(null,null,l.totalScore)}catch(d){console.error("Error recording daily completion:",d)}const c=await bt.isNewPersonalBest(this.currentLevelId,l.totalScore);return{...l,isPersonalBest:c,valid:!0}}isLevelCompleted(e){return this.completedLevels.some(t=>t.levelId===e)}isLastLevel(){return this.currentLevelId===15||this.currentLevelId>=21||this.currentLevelId===999}resetProgress(){this.currentLevelId=1,this.completedLevels=[],this.saveCurrentLevel(),this.saveCompletedLevels()}saveCurrentLevel(){localStorage.setItem("currentLevelId",this.currentLevelId.toString())}saveCompletedLevels(){localStorage.setItem("completedLevels",JSON.stringify(this.completedLevels))}getTotalStars(){return this.completedLevels.reduce((e,t)=>e+t.stars,0)}getMaxStars(){return Go()*3}unlockBonusLevels(){for(let e=1;e<=15;e++)this.isLevelCompleted(e)||this.completedLevels.push({levelId:e,timestamp:Date.now(),stars:3,completed:!0});this.saveCompletedLevels(),cc("Bonus levels unlocked!")}}const ut=new Nf;typeof window<"u"&&(window.unlockBonusLevels=()=>ut.unlockBonusLevels());let Be,kt,Pi=!1;const qa={introEnd:{x:0,y:.82,z:32},introMid:{x:0,y:3.24,z:16},birdsEye:{x:0,y:42,z:0},gameplay:{x:0,y:5.42,z:20.42}},Bf=1800;async function Hf(a,e){Be=new Ml(65,window.innerWidth/window.innerHeight,.1,5e3),Be.position.set(qa.introEnd.x,qa.introEnd.y,qa.introEnd.z),Be.lookAt(0,0,0);const{OrbitControls:t}=await J(async()=>{const{OrbitControls:n}=await import("./OrbitControls-D99eEBr6.js");return{OrbitControls:n}},__vite__mapDeps([0,1]));return kt=new t(Be,e.domElement),kt.enableDamping=!0,kt.dampingFactor=.05,kt.minDistance=8.4,kt.maxDistance=75,kt.maxPolarAngle=Math.PI/1.9,kt.enabled=!1,a.add(Be),{camera:Be,controls:kt}}function zf(){Pi=!0;const a=Date.now(),e=4100,t=[{...qa.birdsEye},{...qa.introMid},{...qa.introEnd}];function n(){const o=Date.now()-a,s=Math.min(o/e,1),i=s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;let r,l,c;i<.5?(r=i*2,l=t[0],c=t[1]):(r=(i-.5)*2,l=t[1],c=t[2]);const d=r<.5?2*r*r:1-Math.pow(-2*r+2,2)/2;Be.position.x=l.x+(c.x-l.x)*d,Be.position.y=l.y+(c.y-l.y)*d,Be.position.z=l.z+(c.z-l.z)*d,Be.lookAt(0,0,0),s<1?requestAnimationFrame(n):Pi=!1}n()}function Wf(){const a=Date.now(),e={x:Be.position.x,y:Be.position.y,z:Be.position.z},t={...qa.gameplay};function n(){const o=Date.now()-a,s=Math.min(o/Bf,1),i=1-Math.pow(1-s,3);Be.position.x=e.x+(t.x-e.x)*i,Be.position.y=e.y+(t.y-e.y)*i,Be.position.z=e.z+(t.z-e.z)*i,Be.lookAt(0,0,0),s<1&&requestAnimationFrame(n)}n()}function _i(){kt&&kt.update()}function Vf(){return Pi}let dr=!1,hc=0,Ya="pullback",$o=null,gc=0,St=null;const Uf=3e3,Gf=9500,Xr=35,yc=12,$f=Math.PI/6,qr=28,Xf=8,Yr=12,jr=18e-5,qf=Math.PI/12,Kr=8e-5,Yf=6,jf=-4;function Kf(a,e){return new Promise(t=>{e&&(e.enabled=!1),dr=!0,hc=Date.now(),Ya="pullback",$o=t,a.userData.creditsStartPos=a.position.clone(),a.userData.creditsStartTarget=e?e.target.clone():new w(0,0,0),a.userData.creditsControls=e})}function mr(a,e){dr=!1,Ya="pullback",e.enabled=!1,St=null,a&&a.userData&&(delete a.userData.creditsStartPos,delete a.userData.creditsStartTarget,delete a.userData.creditsControls,delete a.userData.orbitStartAngle,delete a.userData.orbitPhaseStartTime)}function Zf(a){if(!dr)return;const e=Date.now()-hc;Ya==="pullback"?Jf(a,e):Ya==="pause"?Qf(a):Ya==="orbit"&&ep(a)}function Jf(a,e){const t=Math.min(e/Uf,1),n=1-Math.pow(1-t,3),o=a.userData.creditsStartPos,s=$f,i=Math.sin(s)*Xr*1.6,r=yc,l=Math.cos(s)*Xr+2.25;a.position.x=o.x+(i-o.x)*n,a.position.y=o.y+(r-o.y)*n,a.position.z=o.z+(l-o.z)*n;const c=.3,d=Math.max(0,(t-c)/(1-c)),u=d*d*(3-2*d),m=a.userData.creditsStartTarget||new w(0,0,0),f=new w(-42,1.2,0),p=new w(m.x+(f.x-m.x)*u,m.y+(f.y-m.y)*u,m.z+(f.z-m.z)*u);a.lookAt(p),t>=1&&(Ya="pause",gc=Date.now(),St=a.position.clone(),$o&&($o(),$o=null))}function Qf(a){const e=Date.now()-gc;St&&a.position.copy(St);const t=new w(-42,1.2,0);if(a.lookAt(t),e>=Gf){Ya="orbit",a.userData.orbitStartAngle=Math.atan2(a.position.x,a.position.z),a.userData.orbitPhaseStartTime=Date.now();const n=a.userData.creditsControls;n&&n.target.set(-42,1.2,0)}}function ep(a){const e=Date.now()-a.userData.orbitPhaseStartTime,t=3e3,n=3e3,o=Math.min(e/t,1),s=1-Math.pow(1-o,3),i=Math.min(e/n,1),r=1-Math.pow(1-i,3),c=(a.userData.orbitStartAngle||0)+e*jr,d=St?Math.sqrt(St.x**2+St.z**2):qr,u=Math.sin(e*jr*3.7)*Yf*s,m=qr+u,f=d+(m-d)*s,p=Math.sin(c)*f,g=Math.cos(c)*f,y=St?St.y:yc,v=Math.sin(e*Kr)*Yr*r,S=Math.sin(e*Kr*2.3)*(Yr*.3)*r,T=Xf+v+S,b=y+(T-y)*r,_=Math.max(b,jf),R=Math.sin(c*2)*Math.tan(qf)*f*.3*s,P=new w(p,_+R,g),C=Math.min(e/1e3,1),k=C*C*(3-2*C);St&&C<1?a.position.lerpVectors(St,P,k):a.position.copy(P);const G=a.userData.creditsControls;if(G){const $=new w(Math.sin(c+Math.PI/4)*1.5*s,0,Math.cos(c+Math.PI/4)*1.5*s),ae=new w(0,1,0).add($),Ee=Math.min(e/2e3,1),Pe=1-Math.pow(1-Ee,3),vt=new w(-42,1.2,0),re=new w().lerpVectors(vt,ae,Pe),Ae=.005+.015*Math.min(e/500,1);G.target.lerp(re,Ae)}}function tp(a){return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}const Ai=new Map;function ap(){const a=new Date,e=a.getFullYear(),t=String(a.getMonth()+1).padStart(2,"0"),n=String(a.getDate()).padStart(2,"0");return`${e}-${t}-${n}`}function vc(a){return a.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])')}function np(a){const e=vc(a);if(e.length===0)return;const t=e[0],n=e[e.length-1],o=s=>{s.key==="Tab"&&(s.shiftKey?document.activeElement===t&&(s.preventDefault(),n.focus()):document.activeElement===n&&(s.preventDefault(),t.focus()))};a.removeEventListener("keydown",o),a.addEventListener("keydown",o)}function ks(a){const e=document.activeElement;e&&Ai.set(a.id,e),a.style.display="flex",a.style.animation="fadeIn 0.5s ease",setTimeout(()=>{const t=vc(a);t.length>0&&t[0].focus()},100),np(a)}function Fs(a,e){a.style.animation="fadeOut 0.5s ease",setTimeout(()=>{a.style.display="none";const t=Ai.get(a.id);t&&document.body.contains(t)&&t.focus(),Ai.delete(a.id),e&&e()},500)}function fr(a,e){const t=n=>{n.key==="Escape"&&a.style.display==="flex"&&(n.preventDefault(),e.click())};document.removeEventListener("keydown",t),document.addEventListener("keydown",t)}let z,Li,Ci,Ie,Ne,Ri,Oi,Ue,ia,ra,ka,U,qe,Fa,aa,Kn,Pa,Zn,ma,ki,Jn,Qa,Ma,Qn,Jt,Da,xn,xa,Fi,Re,Ni,Rt,Xo,Ha=null,Z,Ns,Bs,fa,ko,Fo;function op(a){Z=a.levelManager,Ns=a.animateCameraToGameplay,Bs=a.startGame,fa=a.transitionToNextLevel,ko=a.camera,Fo=a.controls,z=document.getElementById("title-splash"),Li=document.getElementById("title-play-button"),Ci=document.getElementById("instructions-button"),Ie=document.getElementById("welcome-modal"),Ne=document.getElementById("simple-play-overlay"),Ri=document.getElementById("simple-play-button"),Oi=document.getElementById("play-button"),Ue=document.getElementById("next-level-btn"),ia=document.getElementById("replay-daily-btn"),ra=document.getElementById("sound"),ka=document.getElementById("fullscreen"),U=document.getElementById("level-select-modal"),qe=document.getElementById("level-grid"),Fa=document.getElementById("close-level-select"),aa=document.getElementById("level-name"),Kn=document.querySelector(".gameplay-gif"),Pa=document.getElementById("score-modal"),Zn=document.getElementById("close-score"),ma=document.getElementById("leaderboard-modal"),ki=document.getElementById("leaderboard-btn"),Jn=document.getElementById("close-leaderboard"),Qa=document.getElementById("name-prompt-modal"),Ma=document.getElementById("player-name-input"),Qn=document.getElementById("save-name-btn"),Jt=document.getElementById("score-player-name"),Da=document.getElementById("player-profile-modal"),xn=document.getElementById("close-player-profile"),xa=document.getElementById("play-again-overlay"),Fi=document.getElementById("play-again-btn"),Re=document.getElementById("share-modal"),Ni=document.getElementById("close-share"),Rt=document.getElementById("copy-score-btn"),Xo=document.getElementById("native-share-btn"),mp(),fp(),gp(),yp(),vp(),wp(),Sp(),Tp(),bp(),Ip(),Ap(),kp(),_p(),Gp(),Vp(),Xp()}function wc(a,e=!1){a.id===1?(z&&(z.style.display="flex"),Ie&&(Ie.style.display="none"),Ne&&(Ne.style.display="none")):(e?(z&&(z.style.display="none"),Ne&&(Ne.style.display="none",Ne.style.pointerEvents="auto",Ne.style.animation="")):(z&&(z.style.display="flex"),Ne&&(Ne.style.display="none")),Ie&&(Ie.style.display="none"))}function Sc(a){aa&&(a.isDaily?(aa.textContent=a.name,aa.setAttribute("aria-label",`View level select menu. Current level: ${a.name}`)):(aa.textContent=`Island ${a.id}: ${a.name}`,aa.setAttribute("aria-label",`View level select menu. Current level: Island ${a.id}: ${a.name}`)))}function Tc(a){const e=document.getElementById("goal-marker");if(e){const t=a*100;e.style.bottom=`${t}%`}}function sp(){const a=Z.getCurrentLevel(),e=Z.isLastLevel();a.isDaily&&ia&&(ia.style.display="flex"),Ue&&(a.isDaily?Ue.innerHTML='<span class="material-icons">share</span>Share&nbsp;Score':e?Ue.innerHTML='<span class="material-icons">eco</span>Credits':Ue.innerHTML='<span class="material-icons">arrow_forward</span>Next&nbsp;Island',Ue.style.display="flex")}function bc(){Ue&&(Ue.style.display="none"),ia&&(ia.style.display="none")}function ip(){Ne&&(Ne.style.display="flex")}function rp(){Ne&&(Ne.style.display="none")}function lp(){Ie&&(Ie.style.display="none")}function cp(a){const e=document.getElementById("progress-fill"),t=document.getElementById("progress-text"),n=document.getElementById("progress-container");if(e&&(e.style.height=a+"%"),t&&(t.textContent=Math.floor(a)+"%"),n){const o=Math.floor(a);n.setAttribute("aria-valuenow",o),n.setAttribute("aria-valuetext",`${o}% water collected`)}}function up(){const a=document.getElementById("progress-fill");a&&a.classList.add("complete")}function Mc(){const a=document.getElementById("progress-fill"),e=document.getElementById("progress-text"),t=document.getElementById("progress-container");a&&(a.style.height="0%",a.classList.remove("complete")),e&&(e.textContent="0%"),t&&(t.style.background="linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",t.classList.remove("pulse"))}function dp(){const a=document.getElementById("progress-container"),e=document.getElementById("progress-fill");a&&e&&(a.classList.remove("pulse"),e.classList.remove("pulse"),a.offsetWidth,e.offsetWidth,a.classList.add("pulse"),e.classList.add("pulse"),setTimeout(()=>{a.classList.remove("pulse"),e.classList.remove("pulse")},600))}function xc(){const a=document.getElementById("win-modal");a&&(a.style.display="none")}function mp(){ra&&ra.addEventListener("click",()=>{const a=Cn();ac()?(Wr(!1),a.play().then(()=>{fs(!0),ra.querySelector(".material-icons").textContent=""}).catch(t=>console.log("Failed to play audio:",t))):(Wr(!0),a.pause(),lr(),fs(!1),ra.querySelector(".material-icons").textContent="")})}function fp(){ka&&(ka.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().then(()=>{ka.querySelector(".material-icons").textContent="fullscreen"}).catch(a=>{console.log("Error attempting to exit fullscreen:",a)}):document.documentElement.requestFullscreen().then(()=>{ka.querySelector(".material-icons").textContent="fullscreen_exit"}).catch(a=>{console.log("Error attempting to enable fullscreen:",a)})}),document.addEventListener("fullscreenchange",()=>{document.fullscreenElement?ka.querySelector(".material-icons").textContent="fullscreen_exit":ka.querySelector(".material-icons").textContent="fullscreen"}))}function pp(){z&&(z.style.pointerEvents="none",z.style.animation="none",z.offsetWidth,z.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{z.style.display="none",z.style.animation="",z.style.pointerEvents=""},500)),Ns(),Bs(),rr()||Cn().play().then(()=>{fs(!0),ra&&(ra.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function hp(){Ie&&(Ie.style.pointerEvents="none",Ie.style.animation="none",Ie.offsetWidth,Ie.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>{Ie.style.display="none",Ie.classList.add("hidden"),Ie.style.animation="",Ie.style.pointerEvents=""},500)),Ns(),Bs(),rr()||Cn().play().then(()=>{fs(!0),ra&&(ra.querySelector(".material-icons").textContent="")}).catch(e=>console.log("Background music autoplay prevented:",e))}function gp(){Li&&Li.addEventListener("click",()=>{pp()})}function yp(){Ci&&Ci.addEventListener("click",()=>{z&&(z.style.display="none"),Ie&&(Ie.style.animation="fadeIn 0.5s ease",Ie.style.display="flex")})}function vp(){Oi&&Oi.addEventListener("click",()=>{hp()})}function wp(){Ri&&Ri.addEventListener("click",()=>{Ne&&(Ne.style.pointerEvents="none",Ne.style.animation="fadeOut 0.5s ease",setTimeout(()=>{Ne.style.display="none"},500)),Ns(),Bs()})}function Sp(){Ue&&Ue.addEventListener("click",async()=>{if(Z.getCurrentLevel().isDaily){Ue.style.display="none",en(),qp();return}if(Ue.style.display="none",en(),!Z.nextLevel()){await Kf(ko,Fo),await Wp(),hr().then(()=>{const t=document.querySelector('.tab-btn[data-tab="credits"]');t&&t.click()});return}fa()})}function Tp(){ia&&ia.addEventListener("click",async()=>{ia.style.display="none",Ue&&(Ue.style.display="none"),en(),Hi();const{canPlayDailyForFree:a}=await J(async()=>{const{canPlayDailyForFree:s}=await Promise.resolve().then(()=>Aa);return{canPlayDailyForFree:s}},void 0);if(!await a()){const{showPaymentModal:s}=await J(async()=>{const{showPaymentModal:r}=await Promise.resolve().then(()=>Sr);return{showPaymentModal:r}},void 0);if(!await s()){ia.style.display="flex",Ue&&(Ue.style.display="flex");return}console.log("🎉 Replay access granted!")}const{getTodaysDaily:t,recordDailyPlay:n}=await J(async()=>{const{getTodaysDaily:s,recordDailyPlay:i}=await Promise.resolve().then(()=>Aa);return{getTodaysDaily:s,recordDailyPlay:i}},void 0),o=await t();await n(),Z.currentDailyLevel=o,Z.currentLevelId=999,Z.saveCurrentLevel(),localStorage.setItem("currentDailyLevel",JSON.stringify(o)),fa()})}function bp(){aa&&(aa.addEventListener("click",()=>{Mo()}),aa.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),Mo())})),Fa&&Fa.addEventListener("click",()=>{U&&Fs(U)}),U&&U.addEventListener("click",a=>{a.target===U&&Fa&&Fa.click()}),U&&Fa&&fr(U,Fa)}function Mo(){!U||!qe||(pr(),ks(U),U.classList.remove("hidden"))}function pr(){qe&&Promise.all([J(()=>Promise.resolve().then(()=>Ro),void 0),J(()=>Promise.resolve().then(()=>Aa),void 0)]).then(([{LEVELS:a},{getTodaysDaily:e,getDailyLevelNumber:t}])=>{qe.innerHTML="";const n=Z.getCurrentLevel(),o=Z.completedLevels.length,s=document.createElement("div");s.className="daily-cards-container";const i=document.createElement("button");i.className="daily-level-card",i.setAttribute("aria-label",`Play Daily Islet number ${t()}`);const r=t(),l=n.id===999&&(!Z.currentDailyLevel||!Z.currentDailyLevel.date||Z.currentDailyLevel.date===ap());i.innerHTML=`
      ${l?'<span class="material-symbols-outlined current-level-badge" aria-hidden="true">person_pin_circle</span>':""}
      <div class="daily-icon">
        <span class="material-icons" aria-hidden="true">today</span>
      </div>
      <div class="daily-info">
        <div class="daily-title">Daily Islet #${r}</div>
        <div class="daily-subtitle">A new challenge every 24&nbsp;hours</div>
      </div>
      <div class="daily-play">
        <span class="material-icons" aria-hidden="true">play_arrow</span>
      </div>
    `,i.addEventListener("click",()=>{Ep()}),s.appendChild(i);const c=document.createElement("button");c.className="past-daily-btn",c.setAttribute("aria-label","View past daily levels"),c.innerHTML=`
      <span class="material-icons" aria-hidden="true">history</span>
      <div class="past-daily-btn-text">Past Daily Levels</div>
    `,c.addEventListener("click",()=>{Mp()}),s.appendChild(c),qe.appendChild(s);const d=a.filter(m=>m.id<=15),u=a.filter(m=>m.id>15);if(d.forEach(m=>{const f=Z.isLevelCompleted(m.id),p=m.id===n.id,g=m.id>1&&!Z.isLevelCompleted(m.id-1),y=document.createElement(g?"div":"button");y.className="level-card",g&&y.classList.add("locked"),p&&y.classList.add("current");const v=Z.completedLevels.find(T=>T.levelId===m.id),S=v?v.stars:0;if(g)y.setAttribute("aria-label",`Island ${m.id}: ${m.name} - Locked. Complete Island ${m.id-1} to unlock.`);else{const T=f?`${S} out of 3 stars`:"not yet completed",b=p?"Currently selected. ":"";y.setAttribute("aria-label",`${b}Island ${m.id}: ${m.name}, ${T}`)}y.innerHTML=`
        ${g?'<span class="material-icons lock-icon" aria-hidden="true">lock</span>':""}
        ${p?'<span class="material-symbols-outlined current-level-badge" aria-hidden="true">person_pin_circle</span>':""}
        <div class="level-number" aria-hidden="true">${m.id}</div>
        <div class="level-title" aria-hidden="true">${m.name}</div>
        <div class="level-stars" aria-hidden="true">
          ${f?"★".repeat(S)+"☆".repeat(3-S):"☆☆☆"}
        </div>
      `,g||y.addEventListener("click",()=>{Zr(m.id)}),qe.appendChild(y)}),u.length>0){const m=document.createElement("div");m.className="bonus-levels-header",m.innerHTML=`
        <div class="bonus-divider"></div>
        <div class="bonus-title">
          <span class="material-icons">emoji_events</span>
          Bonus Levels
        </div>
        <div class="bonus-subtitle">Complete all 15 islands to unlock</div>
      `,qe.appendChild(m),u.forEach(f=>{const p=Z.isLevelCompleted(f.id),g=f.id===n.id,y=o<15,v=document.createElement(y?"div":"button");v.className="level-card bonus-card",y&&v.classList.add("locked"),g&&v.classList.add("current");const S=Z.completedLevels.find(b=>b.levelId===f.id),T=S?S.stars:0;if(y)v.setAttribute("aria-label",`Bonus Island ${f.id}: ${f.name} - Locked. Complete all 15 islands to unlock bonus levels.`);else{const b=p?`${T} out of 3 stars`:"not yet completed",x=g?"Currently selected. ":"";v.setAttribute("aria-label",`${x}Bonus Island ${f.id}: ${f.name}, ${b}`)}v.innerHTML=`
          ${y?'<span class="material-icons lock-icon" aria-hidden="true">lock</span>':""}
          ${g?'<span class="material-symbols-outlined current-level-badge" aria-hidden="true">person_pin_circle</span>':""}
          <div class="level-number bonus-number" aria-hidden="true">${f.id}</div>
          <div class="level-title" aria-hidden="true">${f.name}</div>
          <div class="level-stars" aria-hidden="true">
            ${p?"★".repeat(T)+"☆".repeat(3-T):"☆☆☆"}
          </div>
        `,y||v.addEventListener("click",()=>{Zr(f.id)}),qe.appendChild(v)})}})}async function Mp(){if(!qe)return;const{fetchPastDailyLevels:a}=await J(async()=>{const{fetchPastDailyLevels:o}=await Promise.resolve().then(()=>Aa);return{fetchPastDailyLevels:o}},void 0),e=await a(),t=Z.getCurrentLevel();qe.innerHTML="",qe.classList.add("past-dailies-grid");const n=document.createElement("button");if(n.className="back-to-levels-btn",n.setAttribute("aria-label","Go back to island select"),n.innerHTML=`
    <span class="material-icons" aria-hidden="true">arrow_back</span>
    <span>Back to Island Select</span>
  `,n.addEventListener("click",()=>{qe.classList.remove("past-dailies-grid"),pr()}),qe.appendChild(n),e.length===0){const o=document.createElement("div");o.className="empty-past-dailies",o.innerHTML=`
      <span class="material-icons" style="font-size: 48px; opacity: 0.5; margin-bottom: 16px; display: block;">event_busy</span>
      <div>No past daily levels yet!</div>
      <div style="font-size: var(--font-size-xs); margin-top: 8px;">Come back tomorrow for more challenges.</div>
    `,qe.appendChild(o)}else e.forEach(o=>{const s=document.createElement("button");s.className="past-daily-item",o.hasPaidForReplay||s.classList.add("locked");const r=new Date(o.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),l=o.hasPlayed||!1,c=t.id===999&&Z.currentDailyLevel&&Z.currentDailyLevel.date===o.date;if(o.hasPaidForReplay){const d=l?"Completed":"Not yet played",u=c?"Currently selected. ":"";s.setAttribute("aria-label",`${u}Play Daily Islet number ${o.dayNumber} from ${r}. Unlocked. ${d}.`)}else s.setAttribute("aria-label",`Daily Islet number ${o.dayNumber} from ${r}. Locked. Purchase to unlock.`);s.innerHTML=`
        ${c?'<span class="material-symbols-outlined current-level-badge" aria-hidden="true">person_pin_circle</span>':""}
        <div class="past-daily-item-info">
          <div class="past-daily-item-title" aria-hidden="true">Daily Islet #${o.dayNumber}</div>
          <div class="past-daily-item-date" aria-hidden="true">${r}</div>
        </div>
        <div class="past-daily-indicators" aria-hidden="true">
          <span class="material-symbols-outlined past-daily-played-indicator ${l?"played":"not-played"}" title="${l?"Completed":"Not played"}">
            ${l?"humidity_high":"humidity_low"}
          </span>
          <div class="past-daily-item-status ${o.hasPaidForReplay?"paid":"locked"}">
            <span class="material-icons">${o.hasPaidForReplay?"check_circle":"lock"}</span>
            <span>${o.hasPaidForReplay?"Unlocked":"Locked"}</span>
          </div>
        </div>
      `,s.addEventListener("click",()=>{xp(o)}),qe.appendChild(s)})}async function xp(a){if(!a.hasPaidForReplay){const{showPaymentModal:e}=await J(async()=>{const{showPaymentModal:t}=await Promise.resolve().then(()=>Sr);return{showPaymentModal:t}},void 0);e(a.date,a.dayNumber);return}mr(ko,Fo),Hs(),en(),Z.currentLevelId=999,Z.currentDailyLevel=a.levelConfig,Z.saveCurrentLevel(),localStorage.setItem("currentDailyLevel",JSON.stringify(a.levelConfig)),localStorage.setItem("currentLevelId","999"),z&&z.style.display!=="none"&&(z.style.pointerEvents="none",z.style.animation="none",z.offsetWidth,z.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{z.style.display="none",z.style.animation="",z.style.pointerEvents=""},300)),U?(U.style.pointerEvents="none",U.style.animation="none",U.offsetWidth,U.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{U.classList.add("hidden"),U.style.display="none",U.style.animation="",U.style.pointerEvents="",fa()},300)):fa()}function Zr(a){mr(ko,Fo),Hs(),en(),Z.currentLevelId=a,Z.saveCurrentLevel(),a!==999&&(Z.currentDailyLevel=null,localStorage.removeItem("currentDailyLevel")),z&&z.style.display!=="none"&&(z.style.pointerEvents="none",z.style.animation="none",z.offsetWidth,z.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{z.style.display="none",z.style.animation="",z.style.pointerEvents=""},300)),U?(U.style.pointerEvents="none",U.style.animation="none",U.offsetWidth,U.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{U.classList.add("hidden"),U.style.display="none",U.style.animation="",U.style.pointerEvents="",fa()},300)):fa()}async function Ep(){mr(ko,Fo),Hs(),en();const{canPlayDailyForFree:a}=await J(async()=>{const{canPlayDailyForFree:t}=await Promise.resolve().then(()=>Aa);return{canPlayDailyForFree:t}},void 0);if(!await a()){const{showPaymentModal:t}=await J(async()=>{const{showPaymentModal:o}=await Promise.resolve().then(()=>Sr);return{showPaymentModal:o}},void 0);if(!await t())return;console.log("🎉 Replay access granted!")}J(()=>Promise.resolve().then(()=>Aa),void 0).then(async({getTodaysDaily:t,recordDailyPlay:n})=>{const o=await t();await n(),Z.currentLevelId!==999&&localStorage.setItem("previousLevelId",Z.currentLevelId.toString()),Z.currentDailyLevel=o,Z.currentLevelId=999,localStorage.setItem("currentDailyLevel",JSON.stringify(o)),Z.saveCurrentLevel(),z&&z.style.display!=="none"&&(z.style.pointerEvents="none",z.style.animation="none",z.offsetWidth,z.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{z.style.display="none",z.style.animation="",z.style.pointerEvents=""},300)),U?(U.style.pointerEvents="none",U.style.animation="none",U.offsetWidth,U.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>{U.classList.add("hidden"),U.style.display="none",U.style.animation="",U.style.pointerEvents="",fa()},300)):fa()})}function Ip(){Kn&&(Kn.addEventListener("load",()=>{Kn.classList.add("loaded");const a=document.querySelector(".gif-placeholder");a&&(a.style.display="none")}),Kn.addEventListener("error",()=>{console.log("Gameplay GIF not found - placeholder will be shown")}))}function Ec(){return localStorage.getItem("oasea_player_name")||""}function Dp(a){return a.replace(/<[^>]*>/g,"").trim().slice(0,20)}function Bi(a){const e=Dp(a);localStorage.setItem("oasea_player_name",e)}function Pp(){localStorage.setItem("oasea_player_name_set","true")}function _p(){if(Qn&&Ma&&(Qn.addEventListener("click",()=>{const a=Ma.value.trim();a&&(Bi(a),Pp(),Jr())}),Ma.addEventListener("keypress",a=>{a.key==="Enter"&&Qn.click()})),Qa&&Qn){const a=e=>{e.key==="Escape"&&Qa.style.display==="flex"&&(e.preventDefault(),Jr())};document.addEventListener("keydown",a)}}function Ap(){Zn&&Zn.addEventListener("click",en),Pa&&Zn&&fr(Pa,Zn),Jt&&(Jt.addEventListener("change",()=>{const a=Jt.value.trim();a&&Bi(a)}),Jt.addEventListener("keypress",a=>{if(a.key==="Enter"){const e=Jt.value.trim();e&&(Bi(e),Jt.blur())}}))}function Lp(){Qa&&(Ma&&(Ma.value=Ec()),ks(Qa),setTimeout(()=>{Ma&&Ma.select()},150))}function Jr(){Qa&&Fs(Qa)}async function Cp(a){Pa&&(Ha=a,Rp(a))}async function Rp(a){if(!Pa)return;const{ScoreSystem:e,scoreSystem:t}=await J(async()=>{const{ScoreSystem:i,scoreSystem:r}=await Promise.resolve().then(()=>Et);return{ScoreSystem:i,scoreSystem:r}},void 0);Jt&&(Jt.value=Ec()),document.getElementById("score-base").textContent=e.formatScore(a.basePoints),document.getElementById("score-bonus").textContent=e.formatScore(a.bonusPoints),document.getElementById("score-time").textContent=e.formatScore(a.timeBonus),document.getElementById("score-total").textContent=e.formatScore(a.totalScore);const n=await t.getMyStats();document.getElementById("career-total").textContent=e.formatScore(n.totalScore);const o=Math.round(a.waterPercentage*100);document.getElementById("water-collected").textContent=`${o}%`,document.getElementById("completion-time").textContent=e.formatTime(a.completionTimeMs),document.getElementById("terrain-edits").textContent=a.terrainEdits||0;const s=document.getElementById("personal-best-badge");s&&(s.style.display=a.isPersonalBest?"flex":"none"),ks(Pa),sp(),Op(a,n.totalScore)}function en(){Pa&&Fs(Pa)}function Op(a,e){const n=Date.now();function o(){const s=Date.now()-n,i=Math.min(s/1e3,1),r=1-Math.pow(1-i,3),l=Math.floor(a.basePoints*r),c=Math.floor(a.bonusPoints*r),d=Math.floor(a.timeBonus*r),u=Math.floor(a.totalScore*r),m=Math.floor(e*r);document.getElementById("score-base").textContent=l.toLocaleString(),document.getElementById("score-bonus").textContent=c.toLocaleString(),document.getElementById("score-time").textContent=d.toLocaleString(),document.getElementById("score-total").textContent=u.toLocaleString(),document.getElementById("career-total").textContent=m.toLocaleString(),i<1&&requestAnimationFrame(o)}o()}let io=null;function kp(){ki&&ki.addEventListener("click",hr),Jn&&Jn.addEventListener("click",Ic),ma&&Jn&&fr(ma,Jn);const a=document.querySelectorAll(".tab-btn");a.forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.tab;Fp(s),a.forEach(i=>i.classList.remove("active")),o.classList.add("active")})});const e=document.getElementById("level-filter");e&&e.addEventListener("change",()=>{En("leaderboard")});const t=document.querySelectorAll(".period-btn");t.forEach(o=>{o.addEventListener("click",()=>{t.forEach(s=>s.classList.remove("active")),o.classList.add("active"),En("leaderboard")})});const n=document.getElementById("show-more-btn");n&&n.addEventListener("click",async()=>{n.disabled=!0,await En("leaderboard",20),n.style.display="none"})}async function hr(){if(!ma)return;const a=document.getElementById("level-filter");a&&a.options.length===2&&J(async()=>{const{LEVELS:n}=await Promise.resolve().then(()=>Ro);return{LEVELS:n}},void 0).then(({LEVELS:n})=>{n.forEach(o=>{const s=document.createElement("option");s.value=o.id,s.textContent=`Island ${o.id}: ${o.name}`,a.appendChild(s)})}),ks(ma);const e=document.querySelector(".tab-btn.active"),t=e?e.dataset.tab:"leaderboard";await En(t)}function Ic(){ma&&Fs(ma,()=>{const a=document.querySelector('.tab-btn[data-tab="credits"]');a&&a.classList.contains("active")&&Up()})}async function Fp(a){a!=="leaderboard"&&io&&J(async()=>{const{stopCountdown:t}=await import("./countdown-DIlarHUF.js");return{stopCountdown:t}},[]).then(({stopCountdown:t})=>{t(io),io=null}),document.querySelectorAll(".leaderboard-tab-content").forEach(t=>{t.style.display="none"});const e=document.getElementById(`leaderboard-${a}`);if(e&&(e.style.display="block"),a==="leaderboard"){const t=document.getElementById("leaderboard-loading"),n=document.getElementById("leaderboard-scores");t&&(t.style.display="flex"),n&&(n.style.display="none")}else if(a==="stats"){const t=document.getElementById("stats-loading"),n=document.getElementById("stats-content");t&&(t.style.display="flex"),n&&(n.style.display="none")}await En(a)}async function En(a,e=10){const{scoreSystem:t,ScoreSystem:n,getOrCreatePlayerId:o}=await J(async()=>{const{scoreSystem:s,ScoreSystem:i,getOrCreatePlayerId:r}=await Promise.resolve().then(()=>Et);return{scoreSystem:s,ScoreSystem:i,getOrCreatePlayerId:r}},void 0);if(a==="leaderboard"){const s=document.getElementById("level-filter"),i=document.querySelector(".period-btn.active"),r=s?s.value:"999",l=i?i.dataset.period:"today",c=document.getElementById("daily-countdown");r==="999"&&c?(c.style.display="flex",io||J(async()=>{const{startDailyCountdown:p}=await import("./countdown-DIlarHUF.js");return{startDailyCountdown:p}},[]).then(({startDailyCountdown:p})=>{io=p("countdown-timer")})):c&&(c.style.display="none");const d=await t.getFilteredLeaderboard({levelId:r,period:l,limit:e}),u=o(),m=await t.getPlayerRank(u,{levelId:r,period:l}),f=e===10&&d.length===10;Np("leaderboard-scores",d,m,f)}else if(a==="stats"){const s=await t.getMyStats();zp(s)}}function Np(a,e,t=null,n=!1){const o=document.getElementById(a);o&&J(async()=>{const{ScoreSystem:s,getOrCreatePlayerId:i}=await Promise.resolve().then(()=>Et);return{ScoreSystem:s,getOrCreatePlayerId:i}},void 0).then(({ScoreSystem:s,getOrCreatePlayerId:i})=>{J(async()=>{const{getLevelById:r}=await Promise.resolve().then(()=>Ro);return{getLevelById:r}},void 0).then(({getLevelById:r})=>{const l=i(),c=document.getElementById("your-rank-banner"),d=document.getElementById("player-rank"),u=document.getElementById("player-best-score");if(c&&t&&t.rank?(c.style.display="flex",d&&(d.textContent=`#${t.rank}`),u&&(u.textContent=s.formatScore(t.bestScore))):c&&(c.style.display="none"),e.length===0){let f="No scores yet for this filter. Be the first to play!";o.innerHTML=`<p class="no-scores">${f}</p>`}else o.innerHTML=e.map((p,g)=>{const y=r(p.levelId),v=tp(p.playerName||"Anonymous"),S=p.playerId||"",T=g+1,b=p.timestamp||p.date,x=Hp(b),_=Bp(p),R=_==="—"?0:_.length,P=p.efficiencyScore||0,E=P>0?P.toFixed(1):"0.0",C=R>0?Array(R).fill('<span class="material-icons" style="font-size: 12px; color: #ffd700;">star</span>').join(""):'<span style="font-size: 10px; color: #666;">—</span>',k=["score-item"];T===1?k.push("rank-1"):T===2?k.push("rank-2"):T===3&&k.push("rank-3"),S===l&&k.push("player-entry"),p.levelId===999&&k.push("daily-level-card");let G;if(p.levelId===999){const $=p.dailyNumber||y.dailyNumber;G=$?`Daily #${$}`:y.name}else G=`Island ${p.levelId}: ${y.name}`;return`
            <div class="${k.join(" ")}">
              <div class="score-rank">#${T}</div>
              <div class="score-info">
                <div class="score-player-name ${S?"clickable":""}" data-player-id="${S}">${v}</div>
                <div class="score-level">${G}</div>
                <div class="score-details">
                  <span><span class="material-icons">schedule</span> ${s.formatTime(p.completionTimeMs)}</span>
                  <span><span class="material-icons">water_drop</span> ${Math.round(p.waterPercentage*100)}%</span>
                  <span style="font-weight: 600;"><span class="material-icons">touch_app</span> ${E}</span>
                  <span class="score-timestamp">${x}</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
                <div class="score-points">${s.formatScore(p.totalScore)}</div>
                <div style="display: flex; align-items: center; line-height: 1;">${C}</div>
              </div>
            </div>
          `}).join(""),o.querySelectorAll(".score-player-name.clickable").forEach(p=>{p.addEventListener("click",()=>{const g=p.dataset.playerId;g&&$p(g)})});const m=document.getElementById("leaderboard-loading");if(m&&(m.style.display="none"),o.style.display="block",n){let f=document.getElementById("show-more-container");f||(f=document.createElement("div"),f.id="show-more-container",f.className="show-more-container",f.innerHTML='<button id="show-more-btn" class="show-more-btn">Show More</button>'),o.appendChild(f),f.style.display="flex";const p=document.getElementById("show-more-btn");if(p){p.disabled=!1;const g=p.cloneNode(!0);p.parentNode.replaceChild(g,p),g.addEventListener("click",async()=>{g.disabled=!0,await En("leaderboard",20),g.style.display="none"})}}else{const f=document.getElementById("show-more-container");f&&f.parentNode&&f.remove()}})})}function Bp(a){let e=0;return a.waterPercentage>=.01&&(e=1),a.waterPercentage>=.6&&(e=2),(a.efficiencyStars>=3||a.waterPercentage>=.85)&&(e=3),"⭐".repeat(e)||"—"}function Hp(a){const t=Date.now()-a,n=Math.floor(t/1e3),o=Math.floor(n/60),s=Math.floor(o/60),i=Math.floor(s/24);if(n<60)return"just now";if(o<60)return`${o}m ago`;if(s<24)return`${s}h ago`;if(i<7)return`${i}d ago`;const r=new Date(a),l=r.toLocaleDateString("en-US",{month:"short"}),c=r.getDate();return`${l} ${c}`}function zp(a){J(async()=>{const{ScoreSystem:e,getPlayerName:t,getOrCreatePlayerId:n}=await Promise.resolve().then(()=>Et);return{ScoreSystem:e,getPlayerName:t,getOrCreatePlayerId:n}},void 0).then(({ScoreSystem:e,getPlayerName:t,getOrCreatePlayerId:n})=>{J(async()=>{const{getLevelById:o}=await Promise.resolve().then(()=>Ro);return{getLevelById:o}},void 0).then(({getLevelById:o})=>{J(async()=>{const{initEmailManagementUI:m}=await Promise.resolve().then(()=>Uc);return{initEmailManagementUI:m}},void 0).then(({initEmailManagementUI:m})=>{m()}).catch(m=>{console.error("Error initializing email recovery UI:",m)});const s=t()||"Anonymous",i=document.getElementById("stats-player-header"),r=document.getElementById("stats-player-name");r&&(r.textContent=s),i&&(i.style.display="block");const l=n();J(async()=>{const{getAllAchievementsWithStatus:m,getAchievementBadgeHTML:f}=await Promise.resolve().then(()=>mc);return{getAllAchievementsWithStatus:m,getAchievementBadgeHTML:f}},void 0).then(({getAllAchievementsWithStatus:m,getAchievementBadgeHTML:f})=>{m(l).then(p=>{const g=document.getElementById("stats-achievements-list"),y=document.getElementById("stats-achievements-section");p.length>0&&g&&(g.innerHTML=p.map(v=>f(v,!v.isUnlocked)).join(""),y&&(y.style.display="block"))}).catch(p=>{console.error("Error loading achievements for stats tab:",p)})}),document.getElementById("total-score-stat").textContent=e.formatScore(a.totalScore),document.getElementById("best-single-stat").textContent=e.formatScore(a.bestSingleScore),document.getElementById("levels-completed-stat").textContent=a.levelsCompleted;const c=document.getElementById("favorite-island-stat");if(a.favoriteIsland){const m=o(a.favoriteIsland);c.textContent=`${a.favoriteIsland}: ${m.name}`}else c.textContent="—";document.getElementById("total-time-stat").textContent=e.formatTime(a.totalPlayTime),document.getElementById("daily-levels-played-stat").textContent=a.dailyLevelsPlayed||0,document.getElementById("avg-score-stat").textContent=e.formatScore(a.avgScore),document.getElementById("avg-water-stat").textContent=a.avgWaterPercentage>0?`${Math.round(a.avgWaterPercentage*100)}%`:"0%";const d=document.getElementById("stats-loading"),u=document.getElementById("stats-content");d&&(d.style.display="none"),u&&(u.style.display="grid")})})}function Qr(a,e){return new Promise(t=>{const n=document.getElementById("level-story-overlay"),o=document.getElementById("level-story-text");if(!n||!o){t();return}o.innerHTML=a,n.style.display="block",setTimeout(()=>{n.classList.add("visible")},100),setTimeout(()=>{n.classList.remove("visible"),setTimeout(()=>{n.style.display="none",t()},500)},e)})}async function Wp(){const a="You shaped valleys, drew water back to its heart, and watched the parched earth breathe again.",e="Treat our planet with care, guide water home, and life will find the way.";await Qr(a,4500),await Qr(e,4500)}function Vp(){Fi&&Fi.addEventListener("click",()=>{Hs(),Mo()})}function Up(){xa&&setTimeout(()=>{xa.style.display="flex",setTimeout(()=>{xa.classList.add("visible")},50)},6e3)}function Hs(){xa&&(xa.classList.remove("visible"),setTimeout(()=>{xa.style.display="none",xa.style.opacity="0"},1600))}let wn=!1;function Gp(){xn&&xn.addEventListener("click",el),Da&&Da.addEventListener("click",a=>{a.target===Da&&el()})}async function $p(a){if(!Da)return;if(wn=ma&&ma.style.display==="flex",wn&&Ic(),xn){const s=Array.from(xn.childNodes).find(r=>r.nodeType===Node.TEXT_NODE);s&&(s.textContent=wn?`
  Back to Leaderboard`:`
  Close`);const i=xn.querySelector(".material-icons");i&&(i.textContent=wn?"arrow_back":"close")}const e=document.getElementById("profile-loading"),t=document.getElementById("profile-stats-content"),n=document.getElementById("profile-recent-scores"),o=document.getElementById("profile-achievements-section");e&&(e.style.display="flex"),t&&(t.style.display="none"),n&&(n.style.display="none"),o&&(o.style.display="none"),Da.style.display="flex";try{const{scoreSystem:s,ScoreSystem:i}=await J(async()=>{const{scoreSystem:v,ScoreSystem:S}=await Promise.resolve().then(()=>Et);return{scoreSystem:v,ScoreSystem:S}},void 0),{getLevelById:r}=await J(async()=>{const{getLevelById:v}=await Promise.resolve().then(()=>Ro);return{getLevelById:v}},void 0),{getAllAchievementsWithStatus:l,getAchievementBadgeHTML:c}=await J(async()=>{const{getAllAchievementsWithStatus:v,getAchievementBadgeHTML:S}=await Promise.resolve().then(()=>mc);return{getAllAchievementsWithStatus:v,getAchievementBadgeHTML:S}},void 0),d=await s.getPlayerProfile(a);if(!d){document.getElementById("profile-player-name").textContent="Player Not Found",e&&(e.style.display="none");return}document.getElementById("profile-player-name").textContent=d.displayName||"Anonymous";const u=new Date(d.firstSeenAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});document.getElementById("profile-member-since").textContent=`Conservator since ${u}`,document.getElementById("profile-total-score").textContent=i.formatScore(d.totalScore),document.getElementById("profile-best-single").textContent=i.formatScore(d.bestSingleScore),document.getElementById("profile-levels-completed").textContent=d.levelsCompleted,document.getElementById("profile-games-played").textContent=d.totalGamesPlayed,document.getElementById("profile-total-time").textContent=i.formatTime(d.totalPlayTimeMs);const m=d.totalGamesPlayed>0?Math.floor(d.totalScore/d.totalGamesPlayed):0;document.getElementById("profile-avg-score").textContent=i.formatScore(m);const f=await l(a),p=document.getElementById("profile-achievements-list");f.length>0&&p&&(p.innerHTML=f.map(v=>c(v,!v.isUnlocked)).join(""),o&&(o.style.display="block"));const g=await s.getPlayerScores(a,5),y=document.getElementById("profile-scores-list");g.length>0&&y&&(y.innerHTML=g.map(v=>{const S=r(v.levelId);let T;if(v.levelId===999){const b=v.dailyNumber||S.dailyNumber;T=b?`Daily #${b}`:S.name}else T=`Island ${v.levelId}: ${S.name}`;return`
          <div class="score-item">
            <div class="score-info">
              <div class="score-level">${T}</div>
              <div class="score-details">
                <span>${i.formatTime(v.completionTimeMs)}</span>
                <span>${Math.round(v.waterPercentage*100)}%</span>
              </div>
            </div>
            <div class="score-points">${i.formatScore(v.totalScore)}</div>
          </div>
        `}).join("")),e&&(e.style.display="none"),t&&(t.style.display="grid"),n&&g.length>0&&(n.style.display="block")}catch(s){console.error("Error loading player profile:",s),e&&(e.style.display="none")}}function el(){Da&&(Da.style.display="none",wn&&(hr(),wn=!1))}function Xp(){Ni&&Ni.addEventListener("click",()=>{Hi(),Mo()}),Rt&&Rt.addEventListener("click",async()=>{if(!Ha){console.error("No score data available to share");return}const a=Z.getCurrentLevel(),e=Ha,t=Math.round(e.waterPercentage*100),n=e.efficiencyScore>0?e.efficiencyScore.toFixed(1):"—";let o=`🏝️ Oasea - ${a.name}
📊 Score: ${e.totalScore.toLocaleString()}
⏱️ Time: ${zi(e.completionTimeMs)}`;if(a.isDaily)try{const{scoreSystem:s}=await J(async()=>{const{scoreSystem:c}=await Promise.resolve().then(()=>Et);return{scoreSystem:c}},void 0),{getOrCreatePlayerId:i}=await J(async()=>{const{getOrCreatePlayerId:c}=await Promise.resolve().then(()=>Et);return{getOrCreatePlayerId:c}},void 0),r=i(),l=await s.getPlayerDailyRank(r);if(l){const c=100-l.percentile;o+=`
🏆 Rank: #${l.rank} / ${l.totalPlayers} (Top ${c}%)`}}catch(s){console.error("Error fetching rank for share:",s)}o+=`
💧 Water: ${t}%
⚡ Efficiency: ${n}

Play daily challenges at https://dlightning.org/games/oasea/`;try{await navigator.clipboard.writeText(o);const s=Rt.innerHTML;Rt.innerHTML='<span class="material-icons">check</span>Copied!',Rt.style.background="linear-gradient(135deg, rgba(0, 200, 100, 0.5), rgba(0, 150, 80, 0.4))",setTimeout(()=>{Rt.innerHTML=s,Rt.style.background=""},2e3)}catch(s){console.error("Failed to copy:",s),Rt.innerHTML='<span class="material-icons">error</span>Failed',setTimeout(()=>{Rt.innerHTML='<span class="material-icons">content_copy</span>Copy Score'},2e3)}}),Xo&&navigator.share&&(Xo.style.display="flex",Xo.addEventListener("click",async()=>{if(!Ha){console.error("No score data available to share");return}const a=Z.getCurrentLevel(),e=Ha,t=Math.round(e.waterPercentage*100),n=e.efficiencyScore>0?e.efficiencyScore.toFixed(1):"—";let o=`I scored ${e.totalScore.toLocaleString()} points in ${zi(e.completionTimeMs)}!`;if(a.isDaily)try{const{scoreSystem:i}=await J(async()=>{const{scoreSystem:d}=await Promise.resolve().then(()=>Et);return{scoreSystem:d}},void 0),{getOrCreatePlayerId:r}=await J(async()=>{const{getOrCreatePlayerId:d}=await Promise.resolve().then(()=>Et);return{getOrCreatePlayerId:d}},void 0),l=r(),c=await i.getPlayerDailyRank(l);if(c){const d=100-c.percentile;o+=` 🏆 Rank #${c.rank} (Top ${d}%)`}}catch(i){console.error("Error fetching rank for share:",i)}o+=` 💧 ${t}% water collected, ⚡ ${n} efficiency`;const s={title:`Oasea - ${a.name}`,text:o,url:window.location.href};try{await navigator.share(s)}catch(i){i.name!=="AbortError"&&console.error("Error sharing:",i)}})),Re&&Re.addEventListener("click",a=>{a.target===Re&&(Hi(),Mo())})}async function qp(){if(!Re)return;if(!Ha){console.error("No score data available to share");return}const a=Z.getCurrentLevel(),e=Ha,t=Re.querySelector(".share-level-name"),n=Re.querySelector(".share-score-value"),o=Re.querySelector(".share-time-value"),s=Re.querySelector(".share-water-value"),i=Re.querySelector(".share-efficiency-value"),r=Re.querySelector(".share-rank-row"),l=Re.querySelector(".share-rank-value"),c=Re.querySelector(".share-percentile-value"),d=Math.round(e.waterPercentage*100),u=e.efficiencyScore>0?e.efficiencyScore.toFixed(1):"—";if(t&&(t.textContent=a.name),n&&(n.textContent=e.totalScore.toLocaleString()),o&&(o.textContent=`Completed in ${zi(e.completionTimeMs)}`),s&&(s.textContent=`${d}%`),i&&(i.textContent=u),a.isDaily&&r)try{const{scoreSystem:m}=await J(async()=>{const{scoreSystem:y}=await Promise.resolve().then(()=>Et);return{scoreSystem:y}},void 0),{getOrCreatePlayerId:f}=await J(async()=>{const{getOrCreatePlayerId:y}=await Promise.resolve().then(()=>Et);return{getOrCreatePlayerId:y}},void 0),p=f(),g=await m.getPlayerDailyRank(p);if(g){if(l&&(l.textContent=`#${g.rank} / ${g.totalPlayers}`),c){const y=100-g.percentile;c.textContent=`Top ${y}%`}r.style.display="flex"}else r.style.display="none"}catch(m){console.error("Error fetching rank data:",m),r.style.display="none"}else r&&(r.style.display="none");Re.classList.remove("hidden"),Re.style.display="flex"}function Hi(){Re&&(Re.classList.add("hidden"),Re.style.display="none")}function zi(a){const e=Math.floor(a/1e3),t=Math.floor(e/60),n=e%60;return t>0?`${t}:${n.toString().padStart(2,"0")}`:`${e}s`}const xo=8,Yp=4.3,Wi=80,Vi=90,Ui=500;let tn=[],an=[],la=[],_a=[],No=[],ja=[],ht=[],Ft=0,fe=null,ys=null,me=null,In=null,Je=[];function jp(){const a=new Ku(.2,16),e=new ct({transparent:!0,depthWrite:!1,blending:vl,uniforms:{color:{value:new O(8545340)}},vertexShader:`
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
    `});fe=new mo(a,e,Wi),fe.renderOrder=1,ys=new Float32Array(Wi),fe.geometry.setAttribute("instanceOpacity",new fo(ys,1)),fe.count=0;const t=new co(.05,8,8),n=new ct({transparent:!0,depthWrite:!1,uniforms:{color:{value:new O(8965375)}},vertexShader:`
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
    `});me=new mo(t,n,Ui),me.renderOrder=2,In=new Float32Array(Ui),me.geometry.setAttribute("instanceOpacity",new fo(In,1)),me.count=0,tn=[],an=[],la=[],_a=[],No=[],ja=[],ht=[],Je=[],Ft=0}function Dc(a,e,t,n="day"){const o=e.length;for(let s=0;s<o;s++){const i=e[s],{beamMesh:r,beamMaterial:l}=Kp(i);a.add(r),tn.push(r),an.push(l);const c=Zp(i,t,n);a.add(c),la.push(c);const{particles:d,particleVelocities:u}=Jp(i);a.add(d),_a.push(d),No.push(u)}fe&&!fe.parent&&a.add(fe),me&&!me.parent&&a.add(me)}function Kp(a){const e=new sr(1.5,1.5,xo,32,1,!0),t=new ct({transparent:!0,side:At,depthWrite:!1,depthTest:!0,vertexShader:`
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
    `,uniforms:{uTime:{value:0},uColor:{value:new w(1,1,0)},uPulseIntensity:{value:0}}}),n=new pe(e,t);return n.position.set(a.x,xo/2,a.z),n.renderOrder=5,{beamMesh:n,beamMaterial:t}}function Zp(a,e,t="day"){const o=Tn({startX:a.x,startZ:a.z,endX:a.x,endZ:a.z,cloudTexture:e,rainCount:200,cloudHeight:14,timeOfDay:t}),s=o.userData.cloud,i=o.userData.cloudMaterial;return s.scale.set(1.26,.42,1.6),t!=="night"&&i.uniforms.base.value.setRGB(.8,.9,1),i.uniforms.threshold.value=.25,i.uniforms.opacity.value=0,s.visible=!0,s.renderOrder=10,i.depthTest=!1,o}function Jp(a){const e=new Po,t=new Float32Array(Vi*3),n=[];for(let i=0;i<Vi;i++){const r=Math.random()*Math.PI*2,l=Math.random()*1.3;t[i*3]=Math.cos(r)*l,t[i*3+1]=Math.random()*xo,t[i*3+2]=Math.sin(r)*l,n.push({y:.5+Math.random()*1,angle:r,radius:l,angleSpeed:(Math.random()-.5)*.5})}e.setAttribute("position",new Ua(t,3));const o=new Ds({color:16776960,size:.1,transparent:!0,opacity:.6,blending:El,depthWrite:!1}),s=new Ps(e,o);return s.position.set(a.x,0,a.z),{particles:s,particleVelocities:n}}function Qp(a,e){const t=Math.sin(Date.now()*.003)*.1+.9,n=tn.length;for(let o=0;o<n;o++){e&&e[o]&&(e[o].emissiveIntensity=t*.5),an[o].uniforms.uTime.value+=a,Ft>0&&(Ft-=a*Yp,Ft=Math.max(0,Ft)),an[o].uniforms.uPulseIntensity.value=Ft;const s=1+Ft*.04;tn[o].scale.set(s,1,s)}}function eh(a){const e=_a.length;for(let t=0;t<e;t++){const n=_a[t].geometry,o=No[t],s=n.attributes.position.array;for(let i=0;i<Vi;i++){const r=o[i];s[i*3+1]+=r.y*a,r.angle+=r.angleSpeed*a,s[i*3]=Math.cos(r.angle)*r.radius,s[i*3+2]=Math.sin(r.angle)*r.radius,s[i*3+1]>xo&&(s[i*3+1]=0)}n.attributes.position.needsUpdate=!0}}function th(a,e,t,n,o,s){const i=e.length;a.forEach(r=>{let l=1/0,c=-1;for(let d=0;d<i;d++){const u=Math.sqrt(Math.pow(r.body.position.x-e[d].x,2)+Math.pow(r.body.position.z-e[d].z,2));u<l&&(l=u,c=d)}l<1.5&&!n.has(r)&&(n.add(r),o(),Ft=1,s(),t.removeBody(r.body),r.isEvaporating=!0,r.mesh.material&&r.mesh.material.uniforms&&r.mesh.material.uniforms.uVelocity&&r.mesh.material.uniforms.uVelocity.value.set(0,0,0),ja.push({ball:r,targetIndex:c,startY:r.body.position.y,targetY:xo,progress:0,originalScale:1,particleEmitter:{particles:[],lastEmitTime:0}}))})}function ah(a,e,t){for(let n=ja.length-1;n>=0;n--){const o=ja[n],s=o.ball,i=t[o.targetIndex];o.progress+=e*.3;const r=Math.min(o.progress,1),l=r*r*(3-2*r);s.body.position.y=o.startY+(o.targetY-o.startY)*l,s.body.position.x+=(i.x-s.body.position.x)*e*2,s.body.position.z+=(i.z-s.body.position.z)*e*2,s.mesh.position.copy(s.body.position);const c=.6;if(r>c){const m=1-(r-c)/(1-c);s.mesh.scale.set(m,m,m)}const d=Date.now();if(d-o.particleEmitter.lastEmitTime>30&&me&&Je.length<Ui){const u=Math.random()*Math.PI*2,m=Math.random()*s.radius*.8,f=new w(s.body.position.x+Math.cos(u)*m,s.body.position.y+(Math.random()-.5)*s.radius,s.body.position.z+Math.sin(u)*m),p=Je.length,g={instanceIndex:p,position:f,velocity:{x:(Math.random()-.5)*.5,y:1+Math.random()*.5,z:(Math.random()-.5)*.5},life:0,maxLife:.8,initialScale:1};Je.push(g),o.particleEmitter.particles.push(g);const y=new gt;y.compose(f,new Pt,new w(1,1,1)),me.setMatrixAt(p,y),In[p]=.6,me.count=Je.length,me.instanceMatrix.needsUpdate=!0,me.geometry.attributes.instanceOpacity.needsUpdate=!0,o.particleEmitter.lastEmitTime=d}r>=1&&(a.remove(s.mesh),s.active=!1,o.particleEmitter.particles=[],ja.splice(n,1))}nh(e)}function nh(a){if(!me||Je.length===0)return;let e=!1,t=!1;for(let n=Je.length-1;n>=0;n--){const o=Je[n];o.life+=a,o.position.x+=o.velocity.x*a,o.position.y+=o.velocity.y*a,o.position.z+=o.velocity.z*a;const s=o.life/o.maxLife,i=.6*(1-s),r=o.initialScale*(1-s*.5),l=new gt;if(l.compose(o.position,new Pt,new w(r,r,r)),me.setMatrixAt(o.instanceIndex,l),e=!0,In[o.instanceIndex]=i,t=!0,o.life>=o.maxLife){Je.splice(n,1);for(let c=n;c<Je.length;c++){Je[c].instanceIndex=c;const d=new gt;me.getMatrixAt(c+1,d),me.setMatrixAt(c,d),In[c]=In[c+1]}me.count=Je.length}}e&&(me.instanceMatrix.needsUpdate=!0),t&&(me.geometry.attributes.instanceOpacity.needsUpdate=!0)}function oh(a,e,t,n,o){const s=la.length;for(let l=0;l<s;l++){const c=la[l],d=c.userData.cloud;c.userData.cloudMaterial,fi(c,a,e),d.rotation.y+=e*.1}const i=1600,r=t?Date.now()-n:0;if(t&&r>=i)for(let u=0;u<s;u++){const m=la[u],f=m.userData.cloud,p=m.userData.cloudMaterial,g=f.scale.x,y=g+(8-g)*e*1.5;f.scale.set(y,y*.6,y);const v=p.uniforms.opacity.value,S=isNaN(v)?.3:v+(.3-v)*e*1.5;p.uniforms.opacity.value=S,pi(m,e),jo(m,.6)}else for(let l=0;l<s;l++){const c=la[l],d=c.userData.cloudMaterial;d.uniforms.opacity.value=0,jo(c,0)}if(t&&o)for(let l=0;l<s;l++)an[l].uniforms.uColor.value.set(0,1,.3),_a[l].material.color.setHex(65416)}function sh(a,e,t){if(!fe){console.error("Trail system not initialized");return}if(e.lastTrailTime&&Date.now()-e.lastTrailTime<50)return;let n;ht.length>=Wi?n=ht.shift().instanceIndex:n=ht.length;const o=new gt,s=e.radius*2.5,i=new w(e.body.position.x,t+.02,e.body.position.z),r=new Pt().setFromEuler(new Zu(-Math.PI/2,0,0)),l=new w(s,s,1);o.compose(i,r,l),fe.setMatrixAt(n,o),fe.instanceMatrix.needsUpdate=!0,ys[n]=.008,fe.geometry.attributes.instanceOpacity.needsUpdate=!0,fe.count=Math.max(fe.count,ht.length+1),ht.push({instanceIndex:n,opacity:.003,age:0,maxAge:3+Math.random()*2,scale:s}),e.lastTrailTime=Date.now()}function ih(a){if(!fe)return;let e=!1,t=!1;for(let n=ht.length-1;n>=0;n--){const o=ht[n];o.age+=a;const s=o.age/o.maxAge;o.opacity=(.5-s)*.235,ys[o.instanceIndex]=o.opacity,t=!0;const i=1-s*.43,r=o.scale*i,l=new gt;fe.getMatrixAt(o.instanceIndex,l);const c=new w,d=new Pt,u=new w;l.decompose(c,d,u),u.x=r,u.y=r,l.compose(c,d,u),fe.setMatrixAt(o.instanceIndex,l),e=!0,o.age>=o.maxAge&&(ht.splice(n,1),fe.count=ht.length)}e&&(fe.instanceMatrix.needsUpdate=!0),t&&(fe.geometry.attributes.instanceOpacity.needsUpdate=!0)}function rh(a){[...tn].forEach(e=>{a.remove(e),e.geometry.dispose(),e.material.dispose()}),tn.length=0,an.length=0,[...la].forEach(e=>{a.remove(e),e.userData.cloud&&(e.userData.cloud.geometry.dispose(),e.userData.cloud.material.dispose())}),la.length=0,[..._a].forEach(e=>{a.remove(e),e.geometry.dispose(),e.material.dispose()}),_a.length=0,No.length=0,ht.length=0,fe&&(fe.count=0),Je.length=0,me&&(me.count=0),ja.length=0,Ft=0}function lh(){tn=[],an=[],la=[],_a=[],No=[],ja=[],ht=[],Je=[],fe&&(fe.count=0),me&&(me.count=0),Ft=0}const it=new sn,lt=new na;let Ut=!1,gr=!1,yr=!1,Rn=0,eo=0,He=null,A=null,Eo=.88,On=0,kn={x:0,y:0},zs=0,qo=0;const Pc=10,ch=300;let yt=null,Fn=null,Gn=null,It=null,nn=null,Nn=null,Bn=null,Hn=null,zn=null;function dt(){return gr||yr||Rn>=2}function _c(a){if(!a)return!1;let e=a;for(;e&&e!==document.body;){const t=e.tagName?.toLowerCase();if(t==="button"||t==="input"||t==="select"||t==="textarea"||t==="a"||e.onclick||e.getAttribute("role")==="button"||e.classList?.contains("ui-element")||e.classList?.contains("modal"))return!0;const n=e.id;if(n&&(n.includes("btn")||n.includes("button")||n.includes("modal")||n.includes("overlay")||n.includes("menu")||n.includes("ui")))return!0;e=e.parentElement}return!1}function uh(a){if(_c(a.target))return;a.button===2&&(yr=!0),kn={x:a.clientX,y:a.clientY},zs=Date.now(),lt.x=a.clientX/window.innerWidth*2-1,lt.y=-(a.clientY/window.innerHeight)*2+1,it.setFromCamera(lt,Fn);const e=$e.filter(o=>o.active).map(o=>o.mesh),t=it.intersectObjects(e);if(t.length>0){const o=t[0].object,s=$e.find(i=>i.mesh===o);s&&Hn&&zn&&ec(s,yt,Hn,zn)&&rc(),s&&s.radius>=.15&&(document.body.style.cursor="pointer"),a.preventDefault();return}const n=it.intersectObject(It);if(n.length>0){const o=n[0].point;if(o.y<nn-Eo)return;const s=o.clone(),i=s.clone();if(It.worldToLocal(i),He={world:s,local:i},Ut=!0,Gn.enabled=!1,document.body.style.cursor=dt()?"s-resize":"n-resize",!A){const l=new _o(1.1,2.2,46),c=new oa({color:dt()?16729156:4474111,transparent:!0,opacity:.4,side:At,depthWrite:!1});A=new pe(l,c),A.rotation.x=-Math.PI/2,A.renderOrder=3,yt.add(A)}A.material.color.setHex(dt()?16729156:4474111),A.visible=!0,A.position.copy(s),A.position.y+=.05,oc()}}function dh(a){a.button===2&&(yr=!1);const e={x:a.clientX,y:a.clientY},t=Math.sqrt(Math.pow(e.x-kn.x,2)+Math.pow(e.y-kn.y,2)),n=Date.now()-zs;if(t<Pc&&n<500&&He){const o=dt()?-.8:.8;Nn(He.local,o),Bn(),On++}Ut=!1,He=null,document.body.style.cursor="default",Gn.enabled=!0,Rs(),A&&(yt.remove(A),A.geometry.dispose(),A.material.dispose(),A=null)}function mh(a){lt.x=a.clientX/window.innerWidth*2-1,lt.y=-(a.clientY/window.innerHeight)*2+1,it.setFromCamera(lt,Fn);const e=$e.filter(n=>n.active).map(n=>n.mesh),t=it.intersectObjects(e);if(t.length>0){const n=t[0].object,o=$e.find(s=>s.mesh===n);o&&o.radius>=.15?document.body.style.cursor="pointer":document.body.style.cursor="default"}else{const n=it.intersectObject(It);n.length>0&&n[0].point.y>=nn-Eo?document.body.style.cursor=dt()?"s-resize":"n-resize":document.body.style.cursor="default"}if(Ut){it.setFromCamera(lt,Fn);const n=it.intersectObject(It);if(n.length>0){const o=n[0].point.clone();if(o.y<nn-Eo){He=null,A&&(A.visible=!1);return}const s=o.clone();if(It.worldToLocal(s),He={world:o,local:s},!A){const r=new _o(1.1,2.2,46),l=new oa({color:dt()?16729156:4474111,transparent:!0,opacity:.4,side:At,depthWrite:!1});A=new pe(r,l),A.rotation.x=-Math.PI/2,A.renderOrder=3,yt.add(A)}A.material.color.setHex(dt()?16729156:4474111),A.visible=!0,A.position.copy(o),A.position.y+=.05}}}function fh(a){a.key==="Shift"&&(gr=!0,document.body.style.cursor="s-resize",A&&A.material.color.setHex(16729156))}function ph(a){a.key==="Shift"&&(gr=!1,document.body.style.cursor=Ut?"n-resize":"default",A&&A.material.color.setHex(4474111))}function hh(a){if(_c(a.target))return;Rn=a.touches.length;const e=a.touches[0];kn={x:e.clientX,y:e.clientY},zs=Date.now(),lt.x=e.clientX/window.innerWidth*2-1,lt.y=-(e.clientY/window.innerHeight)*2+1,it.setFromCamera(lt,Fn);const t=$e.filter(s=>s.active).map(s=>s.mesh),n=it.intersectObjects(t);if(n.length>0){const s=n[0].object,i=$e.find(r=>r.mesh===s);i&&Hn&&zn&&ec(i,yt,Hn,zn)&&rc(),i&&i.radius>=.15&&(document.body.style.cursor="pointer"),a.preventDefault();return}const o=it.intersectObject(It);if(o.length>0){const s=o[0].point;if(s.y<nn-Eo)return;const i=s.clone(),r=i.clone();if(It.worldToLocal(r),He={world:i,local:r},Ut=!0,Gn.enabled=!1,document.body.style.cursor=dt()?"s-resize":"n-resize",!A){const c=new _o(1.1,2.2,46),d=new oa({color:dt()?16729156:4474111,transparent:!0,opacity:.4,side:At,depthWrite:!1});A=new pe(c,d),A.rotation.x=-Math.PI/2,A.renderOrder=3,yt.add(A)}A.material.color.setHex(dt()?16729156:4474111),A.visible=!0,A.position.copy(i),A.position.y+=.05,oc(),a.preventDefault()}}function gh(a){Rn=a.touches.length;const e=a.touches[0];if(lt.x=e.clientX/window.innerWidth*2-1,lt.y=-(e.clientY/window.innerHeight)*2+1,Ut){it.setFromCamera(lt,Fn);const t=it.intersectObject(It);if(t.length>0){const n=t[0].point.clone();if(n.y<nn-Eo){He=null,A&&(A.visible=!1);return}const o=n.clone();if(It.worldToLocal(o),He={world:n,local:o},!A){const i=new _o(1.1,2.2,46),r=new oa({color:dt()?16729156:4474111,transparent:!0,opacity:.4,side:At,depthWrite:!1});A=new pe(i,r),A.rotation.x=-Math.PI/2,A.renderOrder=3,yt.add(A)}A.material.color.setHex(dt()?16729156:4474111),A.visible=!0,A.position.copy(n),A.position.y+=.05}a.preventDefault()}}function yh(a){const e=a.changedTouches[0],t={x:e.clientX,y:e.clientY},n=Math.sqrt(Math.pow(t.x-kn.x,2)+Math.pow(t.y-kn.y,2)),o=Date.now()-zs;n<Pc&&o<500&&He&&(Date.now()-qo<ch?(Nn(He.local,-.8),Bn(),On++,qo=0):(Nn(He.local,.8),Bn(),On++,qo=Date.now())),Rn=a.touches.length,Rn===0&&(Ut=!1,He=null,Gn.enabled=!0,document.body.style.cursor="default",Rs(),A&&(yt.remove(A),A.geometry.dispose(),A.material.dispose(),A=null))}function vh(){Rn=0,Ut=!1,He=null,Gn.enabled=!0,qo=0,document.body.style.cursor="default",Rs(),A&&(yt.remove(A),A.geometry.dispose(),A.material.dispose(),A=null)}function wh(a){a.preventDefault()}function Sh(a){yt=a.scene,Fn=a.camera,Gn=a.controls,It=a.terrainMesh,nn=a.waterLevel,Nn=a.sculptTerrain,Bn=a.updateTrimesh,Hn=a.world,zn=a.ballMaterial,window.addEventListener("mousedown",uh),window.addEventListener("mouseup",dh),window.addEventListener("mousemove",mh),window.addEventListener("contextmenu",wh),window.addEventListener("keydown",fh),window.addEventListener("keyup",ph),window.addEventListener("touchstart",hh,{passive:!1}),window.addEventListener("touchmove",gh,{passive:!1}),window.addEventListener("touchend",yh),window.addEventListener("touchcancel",vh)}function Th(){if(Ut&&He){const a=Date.now();if(a-eo>16){const e=dt()?-4.88:4.98;if(Nn(He.local,e),On++,a-eo>10)return Bn(),eo=a,!0;eo=a}}return!1}function bh(a){a.terrainMesh!==void 0&&(It=a.terrainMesh),a.waterLevel!==void 0&&(nn=a.waterLevel),a.sculptTerrain!==void 0&&(Nn=a.sculptTerrain),a.updateTrimesh!==void 0&&(Bn=a.updateTrimesh),a.world!==void 0&&(Hn=a.world),a.ballMaterial!==void 0&&(zn=a.ballMaterial)}function Mh(){A&&yt&&(yt.remove(A),A.geometry.dispose(),A.material.dispose(),A=null),Ut=!1,He=null,eo=0,On=0}function xh(){return On}const tl=280,al=150;let Gi=[],yn=[];function ai(a){return Math.min(.15+a*.08,.5)}let Qe=null,et=null,Dn=[],Pn=[];function Eh(a){const e=new co(.08,6,6),t=new ct({transparent:!0,depthWrite:!1,uniforms:{color:{value:new O(16777215)}},vertexShader:`
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
    `});Qe=new mo(e,t,tl),Qe.renderOrder=3,Qe.isPersistent=!0;const n=new Float32Array(tl);Qe.geometry.setAttribute("instanceOpacity",new fo(n,1)),Qe.count=0,a.add(Qe);const o=new co(.022,8,8),s=new ct({transparent:!0,depthWrite:!1,uniforms:{color:{value:new O(13426175)}},vertexShader:`
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
        gl_FragColor = vec4(color, vOpacity * 0.4);
      }
    `});et=new mo(o,s,al),et.renderOrder=4,et.isPersistent=!0;const i=new Float32Array(al);et.geometry.setAttribute("instanceOpacity",new fo(i,1)),et.count=0,a.add(et)}function Ih(){if(!Qe)return;const a=Qe.geometry.attributes.instanceOpacity.array;Dn.forEach((e,t)=>{const n=new gt,o=1-e.life/e.maxLife*.5;n.compose(e.position,new Pt,new w(o,o,o)),Qe.setMatrixAt(e.instanceIndex,n),a[e.instanceIndex]=(1-e.life/e.maxLife)*.8}),Qe.count=Dn.length,Qe.instanceMatrix.needsUpdate=!0,Qe.geometry.attributes.instanceOpacity.needsUpdate=!0}function Dh(){if(!et)return;const a=et.geometry.attributes.instanceOpacity.array;Pn.forEach((e,t)=>{const n=new gt,o=1+e.life/e.maxLife*.5;n.compose(e.position,new Pt,new w(o,o,o)),et.setMatrixAt(e.instanceIndex,n),a[e.instanceIndex]=(1-e.life/e.maxLife)*.6}),et.count=Pn.length,et.instanceMatrix.needsUpdate=!0,et.geometry.attributes.instanceOpacity.needsUpdate=!0}function Ph(a,e){Gi.forEach(t=>{t.material.uniforms&&(t.material.uniforms.uTime.value+=a)});for(let t=Dn.length-1;t>=0;t--){const n=Dn[t];if(n.life+=a,n.velocity.y-=9.8*a,n.position.x+=n.velocity.x*a,n.position.y+=n.velocity.y*a,n.position.z+=n.velocity.z*a,n.life>=n.maxLife)if(n.respawn&&yn[n.waterfallIndex]){const o=yn[n.waterfallIndex],s=ai(o.height),i=Math.random()*Math.PI*2,r=Math.random()*s*.8,l=o.adjustedBottomPos||o.bottomPos;n.position.set(l.x+Math.cos(i)*r,l.z+Math.random()*.3,-l.y+Math.sin(i)*r),n.velocity.set((Math.random()-.5)*1.5,2+Math.random()*1.5,(Math.random()-.5)*1.5),n.life=0}else{Dn.splice(t,1);continue}}Ih();for(let t=Pn.length-1;t>=0;t--){const n=Pn[t];if(n.life+=a,n.position.x+=n.velocity.x*a,n.position.y+=n.velocity.y*a,n.position.z+=n.velocity.z*a,n.life>=n.maxLife)if(n.respawn&&yn[n.waterfallIndex]){const o=yn[n.waterfallIndex],s=ai(o.height),i=Math.random()*Math.PI*2,r=Math.random()*s*1.5,l=o.adjustedBottomPos||o.bottomPos;n.position.set(l.x+Math.cos(i)*r,l.z+Math.random()*.8,-l.y+Math.sin(i)*r),n.velocity.set((Math.random()-.5)*.3,.4+Math.random()*.3,(Math.random()-.5)*.3),n.life=0}else{Pn.splice(t,1);continue}}if(Dh(),e){const t=Date.now();yn.forEach(n=>{if(t>=n.nextRippleTime){const o=ai(n.height),s=Math.random()*Math.PI*2,i=Math.random()*o*.5,r=n.adjustedBottomPos||n.bottomPos,l=n.topPos.x-r.x,c=n.topPos.y-r.y,d=Math.sqrt(l*l+c*c),u=.25,m=d>0?l/d*u:0,f=d>0?c/d*u:0;e.spawnRipple(r.x+Math.cos(s)*i+m,-r.y+Math.sin(s)*i-f,{size:Math.min(.4+n.height*.05,.6),speed:1.2,color:new O(16777215)}),n.nextRippleTime=t+300+Math.random()*400}})}}function _h(a,e=null){Gi.forEach(t=>{a.remove(t),t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()}),Gi=[],yn=[],Dn=[],Pn=[],Qe&&(Qe.count=0),et&&(et.count=0),e&&e.wetnessMap&&e.wetnessMap.setWaterfalls&&e.wetnessMap.setWaterfalls([])}const Io=[];let ni=0;const _n=[];function Ah(a,e="day"){a.uniforms.uIsNightTime&&(a.uniforms.uIsNightTime.value=e==="night");const t=Date.now(),n=2e3,o=()=>{const s=Date.now()-t,i=Math.min(s/n,1),r=1-Math.pow(1-i,3);a.uniforms.uWinGreenIntensity.value=r*.6,i<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}function Lh(a,e,t,n=1.5,o=[]){const s=[],i=a*20,r={min:.3,max:2.2};let l=0;for(;s.length<a&&l<i;){l++;const c=(Math.random()-.5)*e*.8,d=(Math.random()-.5)*e*.8,u=new w(c,20,d),m=new w(0,-1,0),p=new sn(u,m).intersectObject(t);if(p.length===0)continue;const g=p[0].point.y;if(g<r.min||g>r.max)continue;let y=!1;const v=[...o,...s];for(const S of v)if(Math.sqrt(Math.pow(c-S.x,2)+Math.pow(d-S.z,2))<n){y=!0;break}y||s.push({x:c,z:d})}return s}function Ac(a){const{scene:e,modelCache:t,terrainMesh:n,modelPath:o,positions:s,baseScale:i,scaleVariation:r,staggerDelay:l,growDuration:c,verticalOffset:d=-.15,startDelay:u=0}=a;if(s.length===0){console.warn(`No positions generated for ${o}, skipping model load`);return}if(!t[o]){console.warn(`Model ${o} not preloaded yet, waiting...`),setTimeout(()=>Ac(a),100);return}const m=t[o],f=a.timeOfDay==="night",p=o.includes("ivory-cane-palm"),g=f?p?3.5:6.2:1;s.forEach((y,v)=>{const S=new Ia;m.forEach(re=>{const _e=re.material.clone();f&&_e.color&&_e.color.multiplyScalar(g);const Te=new pe(re.geometry,_e);Te.position.copy(re.position),Te.rotation.copy(re.rotation),Te.scale.copy(re.scale),Te.castShadow=re.castShadow,Te.receiveShadow=re.receiveShadow,S.add(Te)});const T=new w(y.x,20,y.z),b=new w(0,-1,0),_=new sn(T,b).intersectObject(n);if(_.length===0){console.warn("Tree position not on terrain:",y);return}const R=_[0],P=R.point.y,C=R.face.normal.clone().clone().applyMatrix3(new Ju().getNormalMatrix(n.matrixWorld)).normalize();S.rotation.y=Math.random()*Math.PI*2;const k=Math.atan2(y.z,y.x),G=new w(0,1,0),$=Math.acos(Math.max(-1,Math.min(1,G.dot(C)))),ae=Math.PI/9,ke=Math.min($*.6,ae);S.rotation.x=Math.sin(k)*ke,S.rotation.z=-Math.cos(k)*ke,S.position.set(y.x,P+d,y.z),S.scale.set(0,0,0),e.add(S),S.userData.swayOffset=Math.random()*Math.PI*2,S.userData.swaySpeed=.8+Math.random()*.4,S.userData.swayAmount=.03+Math.random()*.02,S.userData.baseRotation={x:S.rotation.x,z:S.rotation.z},Io.push(S);const Ee=Date.now()+u+v*l,Pe=i+Math.random()*r,vt=()=>{const re=Date.now()-Ee;if(re<0){requestAnimationFrame(vt);return}const _e=Math.min(re/c,1),Ae=(1-Math.pow(1-_e,3))*Pe;S.scale.set(Ae,Ae,Ae),_e<1&&requestAnimationFrame(vt)};requestAnimationFrame(vt)})}function Ch(a,e,t){const n=[],o=a*25,s=.3,i={min:.3,max:2.2},r=Math.floor(a/6),l=[];for(let d=0;d<r;d++){const u=(Math.random()-.5)*e*.8,m=(Math.random()-.5)*e*.8;l.push({x:u,z:m,radius:1.5+Math.random()*1.5})}let c=0;for(;n.length<a&&c<o;){c++;let d,u;if(Math.random()<.7&&l.length>0){const S=l[Math.floor(Math.random()*l.length)],T=Math.random()*Math.PI*2,b=Math.random()*S.radius;d=S.x+Math.cos(T)*b,u=S.z+Math.sin(T)*b}else d=(Math.random()-.5)*e*.8,u=(Math.random()-.5)*e*.8;const m=new w(d,20,u),f=new w(0,-1,0),g=new sn(m,f).intersectObject(t);if(g.length===0)continue;const y=g[0].point.y;if(y<i.min||y>i.max)continue;let v=!1;for(const S of n)if(Math.sqrt(Math.pow(d-S.x,2)+Math.pow(u-S.z,2))<s){v=!0;break}v||n.push({x:d,z:u})}return n}function nl(a){const{scene:e,modelCache:t,terrainMesh:n,grassModelPath:o,grassTuftPositions:s,batchIndex:i,timeOfDay:r}=a,l=t[o],c=r==="night",d=c?6.2:1;s.forEach((u,m)=>{const f=new Ia;l.forEach(_=>{const R=_.material.clone();c&&R.color&&R.color.multiplyScalar(d);const P=new pe(_.geometry,R);P.position.copy(_.position),P.rotation.copy(_.rotation),P.scale.copy(_.scale),P.castShadow=_.castShadow,P.receiveShadow=_.receiveShadow,f.add(P)});const p=new w(u.x,20,u.z),g=new w(0,-1,0),v=new sn(p,g).intersectObject(n);if(v.length===0){console.warn("Grass tuft position not on terrain:",u);return}const S=v[0].point.y;f.rotation.y=Math.random()*Math.PI*2,f.position.set(u.x,S-.05,u.z),f.scale.set(0,0,0),e.add(f);const T=Date.now()+m*80+500,b=.228+Math.random()*.188,x=()=>{const _=Date.now()-T;if(_<0){requestAnimationFrame(x);return}const P=Math.min(_/800,1),C=(1-Math.pow(1-P,3))*b;f.scale.set(C,C,C),P<1&&requestAnimationFrame(x)};requestAnimationFrame(x)})}function Rh(a){const{scene:e,terrainMaterial:t,terrainMesh:n,terrainSize:o,modelCache:s,timeOfDay:i="day"}=a;yf(),Ah(t,i);const r=[{modelPath:"./models/palm_tree.glb",count:24,minSpacing:1.12,baseScale:.00184,scaleVariation:949e-6,staggerDelay:150,growDuration:1e3,verticalOffset:-.15,startDelay:0},{modelPath:"./models/ivory-cane-palm.glb",count:20,minSpacing:.43,baseScale:.054689,scaleVariation:.04377,staggerDelay:130,growDuration:1100,verticalOffset:-.0812,startDelay:400},{modelPath:"./models/olive-palm.glb",count:6,minSpacing:.73,baseScale:.18,scaleVariation:.077,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/lady-palm.glb",count:5,minSpacing:.69,baseScale:.048,scaleVariation:.042,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450},{modelPath:"./models/bismarck-palm.glb",count:5,minSpacing:.29,baseScale:.078,scaleVariation:.062,staggerDelay:130,growDuration:1100,verticalOffset:-.12,startDelay:450}],l=[],c=80;r.forEach((g,y)=>{setTimeout(()=>{const v=Lh(g.count,o,n,g.minSpacing,l);l.push(...v),Ac({scene:e,modelCache:s,terrainMesh:n,modelPath:g.modelPath,positions:v,baseScale:g.baseScale,scaleVariation:g.scaleVariation,staggerDelay:g.staggerDelay,growDuration:g.growDuration,verticalOffset:g.verticalOffset,startDelay:g.startDelay,timeOfDay:i})},y*c)});const d="./models/tall-grass.glb",u=15,m=4,f=60,p=[];for(let g=0;g<m;g++)setTimeout(()=>{const y=Ch(u,o,n);p.push(...y),s[d]?nl({scene:e,modelCache:s,terrainMesh:n,grassModelPath:d,grassTuftPositions:y,batchIndex:g,timeOfDay:i}):(console.warn("Grass model not preloaded yet, waiting..."),setTimeout(()=>{s[d]&&nl({scene:e,modelCache:s,terrainMesh:n,grassModelPath:d,grassTuftPositions:y,batchIndex:g,timeOfDay:i})},90))},400+g*f);setTimeout(()=>{kh(e,i)},2e3)}function Oh(a){if(Io.length===0||(ni++,ni<2))return;ni=0;const e=Math.sin(a*.9);Io.forEach(t=>{if(t.scale.x===0)return;const{swayOffset:n,swaySpeed:o,swayAmount:s,baseRotation:i}=t.userData,r=Math.sin(a*o+n)*e*s;t.rotation.x=i.x+r,t.rotation.z=i.z+r*.7})}async function kh(a,e="day"){const{GLTFLoader:t}=await J(async()=>{const{GLTFLoader:c}=await Promise.resolve().then(()=>jd);return{GLTFLoader:c}},void 0),n=new t,o=e==="night",s=o?4.25:1,i=Math.random()<.6?1:0,r=Math.floor(Math.random()*3),l=Math.floor(Math.random()*4);console.log(`Spawning win seagulls: ${i} flock, ${r} spirals, ${l} singles`),i>0&&n.load("./models/seagulls-flock.glb",c=>{const d=c.scene;if(d.position.set(0,6.28,0),d.scale.set(.026,.026,.026),d.traverse(u=>{u.isMesh&&(u.castShadow=!0,u.receiveShadow=!1,o&&u.material&&(u.material=u.material.clone(),u.material.color&&u.material.color.multiplyScalar(s)))}),a.add(d),c.animations&&c.animations.length>0){const u=new Ge(d);c.animations.forEach(m=>{const f=u.clipAction(m);f.timeScale=.5,f.play()}),d.userData.mixer=u}d.userData.type="flock",d.userData.bobTime=Math.random()*Math.PI*2,d.userData.bobSpeed=.3,d.userData.bobAmount=1.8,_n.push(d)});for(let c=0;c<r;c++)n.load("./models/seagulls-spiral.glb",d=>{const u=d.scene,m=(Math.random()-.5)*8,f=(Math.random()-.5)*8,p=5+Math.random()*3;if(u.position.set(m,p,f),u.scale.set(.14,.14,.14),u.traverse(g=>{g.isMesh&&(g.castShadow=!0,g.receiveShadow=!1,o&&g.material&&(g.material=g.material.clone(),g.material.color&&g.material.color.multiplyScalar(s)))}),a.add(u),d.animations&&d.animations.length>0){const g=new Ge(u);d.animations.forEach(y=>{const v=g.clipAction(y);v.timeScale=.55+Math.random()*.2,v.play()}),u.userData.mixer=g}u.userData.type="spiral",u.userData.bobTime=Math.random()*Math.PI*2,u.userData.bobSpeed=.25,u.userData.bobAmount=1.2,_n.push(u)});for(let c=0;c<l;c++)n.load("./models/seagull-1.glb",d=>{const u=d.scene,m=(Math.random()-.5)*12,f=(Math.random()-.5)*12,p=4.2+Math.random()*4.2;if(u.position.set(m,p,f),u.scale.set(.028,.028,.028),u.traverse(g=>{g.isMesh&&(g.castShadow=!0,g.receiveShadow=!1,o&&g.material&&(g.material=g.material.clone(),g.material.color&&g.material.color.multiplyScalar(s)))}),a.add(u),d.animations&&d.animations.length>0){const g=new Ge(u);d.animations.forEach(y=>{const v=g.clipAction(y);v.timeScale=.6+Math.random()*.3,v.play();const S=Math.random()*y.duration;v.time=S}),u.userData.mixer=g}u.userData.type="single",u.userData.bobTime=Math.random()*Math.PI*2,u.userData.bobSpeed=.35+Math.random()*.1,u.userData.bobAmount=.8,_n.push(u)})}function Fh(a){_n.forEach(e=>{e.userData.mixer&&e.userData.mixer.update(a),e.userData.bobTime+=a*e.userData.bobSpeed;const t=Math.sin(e.userData.bobTime)*e.userData.bobAmount;e.userData.baseHeight||(e.userData.baseHeight=e.position.y),e.position.y=e.userData.baseHeight+t})}function Nh(){_n.forEach(a=>{a.parent&&a.parent.remove(a),a.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),_n.length=0}function Bh(a){_h(a)}function Hh(a){a&&a.uniforms.uWinGreenIntensity&&(a.uniforms.uWinGreenIntensity.value=0),a&&a.uniforms.uIsNightTime&&(a.uniforms.uIsNightTime.value=!1)}function zh(){Io.forEach(a=>{a.parent&&a.parent.remove(a),a.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}),Io.length=0}const Wh=new Ke,Lc={};function pn(a){return new Promise((e,t)=>{Wh.load(a,n=>{const o=[];n.scene.traverse(s=>{s.isMesh&&o.push({geometry:s.geometry,material:s.material,position:s.position.clone(),rotation:s.rotation.clone(),scale:s.scale.clone(),castShadow:!0,receiveShadow:!0})}),Lc[a]=o,e(o)},void 0,n=>{console.error(`Failed to preload model ${a}:`,n),t(n)})})}let zo=!1,ol=!1;function Vh(){return zo||ol?Promise.resolve():(zo=!0,Promise.all([pn("./models/palm_tree.glb"),pn("./models/ivory-cane-palm.glb"),pn("./models/olive-palm.glb"),pn("./models/tall-grass.glb"),pn("./models/lady-palm.glb"),pn("./models/bismarck-palm.glb")]).then(()=>{ol=!0,zo=!1}).catch(a=>{zo=!1,console.error("Error preloading models:",a)}))}function Uh(){return Lc}let Oe=null;const Gh=Wt.url,$h=Wt.anonKey;Oe=Lo(Gh,$h);class Xh{constructor(e){this.seed=e%2147483647,this.seed<=0&&(this.seed+=2147483646)}next(){return this.seed=this.seed*16807%2147483647,(this.seed-1)/2147483646}range(e,t){return e+this.next()*(t-e)}choice(e){return e[Math.floor(this.next()*e.length)]}}function rn(){const t=new Date-new Date("2025-11-10T00:00:00Z");return Math.floor(t/(1e3*60*60*24))+1}function Gt(){const a=new Date,e=a.getFullYear(),t=String(a.getMonth()+1).padStart(2,"0"),n=String(a.getDate()).padStart(2,"0");return`${e}-${t}-${n}`}function vs(a=null){const e=a!==null?a:rn(),t=new Xh(e),n=t.range(12,16),o=n*.35,s={size:parseFloat(n.toFixed(2)),islandRadius:parseFloat(o.toFixed(2)),scaleX:parseFloat(t.range(.8,1.3).toFixed(2)),scaleY:parseFloat(t.range(.8,1.3).toFixed(2)),tilt:{angle:parseFloat(t.range(0,Math.PI).toFixed(2)),amount:parseFloat(t.range(0,1.5).toFixed(2))},bay:{angle:parseFloat(t.range(0,Math.PI*2).toFixed(2)),depth:parseFloat(t.range(0,2.5).toFixed(2)),width:parseFloat(t.range(0,Math.PI/2).toFixed(2))},irregularity:parseFloat(t.range(.5,4).toFixed(2))};t.next()>.5&&(s.distortion={frequency:parseFloat(t.range(.1,.8).toFixed(2)),amplitude:parseFloat(t.range(.1,.5).toFixed(2)),randomness:parseFloat(t.range(.05,.3).toFixed(2))}),t.next()>.3&&(s.turbulence={strength:parseFloat(t.range(1,4).toFixed(2)),scale:parseFloat(t.range(.1,.4).toFixed(2)),octaves:parseFloat(t.range(.5,2).toFixed(2))});const i=parseFloat(t.range(-2.5,-1.5).toFixed(2)),r=parseFloat(t.range(.45,.65).toFixed(2)),l={enabled:!0,interval:Math.floor(t.range(5e3,7e3)),cloudDuration:Math.floor(t.range(4e3,5500)),dropletsPerCloud:Math.floor(t.range(12,18)),dropletInterval:Math.floor(t.range(300,450)),minRadius:parseFloat(t.range(.08,.11).toFixed(2)),maxRadius:parseFloat(t.range(.13,.16).toFixed(2)),spawnHeight:10.2,cloudSpeed:parseFloat(t.range(2.5,3.5).toFixed(1)),fadeInDuration:Math.floor(t.range(1800,2500)),fadeOutDuration:Math.floor(t.range(1800,2500))},c={};return t.next()>.7&&(c.evaporationRate=parseFloat(t.range(.08,.15).toFixed(2))),t.next()>.7&&(c.terrainFriction=parseFloat(t.range(.15,.35).toFixed(2))),t.next()>.7&&(c.splitClouds=!0,c.splitDelay=Math.floor(t.range(600,900))),t.next()>.85&&(c.multipleTargets=Math.floor(t.range(2,3))),{id:999,name:`Daily Islet #${e}`,description:"A fleeting challenge—here today, gone tomorrow",story:"Each dawn brings a new island to restore",isDaily:!0,dailyNumber:e,terrainShape:s,waterLevel:i,winPercentage:r,spawn:l,difficulty:Math.floor(t.range(6,12)),rewards:{points:5e3},...c}}async function qh(a=null){if(!Oe)return!0;const e=a||Gt(),t=je();try{const{data:n,error:o}=await Oe.rpc("can_play_daily_for_free",{p_player_id:t,p_date:e});if(o)throw o;return n}catch(n){return console.error("Error checking daily play eligibility:",n),!0}}async function Yh(a=null,e=null){if(!Oe)return;const t=a||Gt(),n=e||rn(),o=je();try{const{error:s}=await Oe.rpc("record_daily_play",{p_player_id:o,p_date:t,p_day_number:n});if(s)throw s}catch(s){console.error("Error recording daily play:",s)}}async function jh(a=null,e=null,t=0){if(!Oe)return;const n=a||Gt(),o=e||rn(),s=je();try{const{error:i}=await Oe.rpc("record_daily_completion",{p_player_id:s,p_date:n,p_day_number:o,p_score:t});if(i)throw i}catch(i){console.error("Error recording daily completion:",i)}}async function Kh(){if(!Oe)return[];const a=je(),e=Gt();try{const{data:t,error:n}=await Oe.from("daily_levels").select("date, day_number, level_config").lt("date",e).order("date",{ascending:!1});if(n)throw n;if(!t||t.length===0)return[];const{data:o,error:s}=await Oe.from("players").select("has_unlimited_past_access").eq("player_id",a).single();if(s)throw s;if(o?.has_unlimited_past_access||!1){const u=t.map(f=>{const p=f.level_config;return p.dailyNumber=f.day_number,p.name=`Daily Islet #${f.day_number}`,{date:f.date,dayNumber:f.day_number,levelConfig:p,hasPaidForReplay:!0,hasUnlimitedAccess:!0}}),{data:m}=await Oe.from("scores").select("level_id, created_at").eq("player_id",a).eq("level_id",999);return u.forEach(f=>{f.hasPlayed=m.some(p=>p.created_at.startsWith(f.date))}),u}const{data:r,error:l}=await Oe.from("daily_replay_payments").select("date, payment_status").eq("player_id",a).eq("payment_status","succeeded");if(l)throw l;const c=new Set(r?.map(u=>u.date)||[]);return t.map(u=>{const m=u.level_config;return m.dailyNumber=u.day_number,m.name=`Daily Islet #${u.day_number}`,{date:u.date,dayNumber:u.day_number,levelConfig:m,hasPaidForReplay:c.has(u.date),hasUnlimitedAccess:!1}})}catch(t){return console.error("Error fetching past daily levels:",t),[]}}async function Zh(a){if(!Oe)return null;try{const{data:e,error:t}=await Oe.from("daily_levels").select("day_number, level_config").eq("date",a).single();if(t)return t.code!=="PGRST116"&&console.error("Error fetching daily level:",t),null;const n=e.level_config;return n.dailyNumber=e.day_number,n.name=`Daily Islet #${e.day_number}`,n}catch(e){return console.error("Error fetching daily level:",e),null}}async function Jh(a,e,t){if(!Oe)return!1;try{const n=je(),{error:o}=await Oe.from("daily_levels").insert({date:a,day_number:e,level_config:t,generated_by:n});if(o){if(o.code==="23505")return!1;throw o}return!0}catch(n){return console.error("Error saving daily level:",n),!1}}async function Cc(a=!1){const e="oasea_daily_level",t="oasea_daily_date",n=Gt(),o=rn();if(a){const r=Math.floor(Math.random()*1e4);return vs(r)}if(localStorage.getItem(t)===n){const r=localStorage.getItem(e);if(r)return JSON.parse(r)}if(Oe){const r=await Zh(n);if(r)return localStorage.setItem(e,JSON.stringify(r)),localStorage.setItem(t,n),r}const i=vs();return Oe&&await Jh(n,o,i),localStorage.setItem(e,JSON.stringify(i)),localStorage.setItem(t,n),i}function Qh(){const a=localStorage.getItem("oasea_daily_toast_date"),e=Gt();return a===e}function e0(){const a=Gt();localStorage.setItem("oasea_daily_toast_date",a)}function vr(){if(Qh())return!1;const a=rn();return Ef(`Daily Islet #${a} is ready!`,6e3),e0(),!0}typeof window<"u"&&(window.generateDailyLevel=vs,window.getTodaysDaily=Cc,window.checkAndShowDailyNotification=vr);const Aa=Object.freeze(Object.defineProperty({__proto__:null,canPlayDailyForFree:qh,checkAndShowDailyNotification:vr,fetchPastDailyLevels:Kh,generateDailyLevel:vs,getDailyLevelNumber:rn,getTodayDateString:Gt,getTodaysDaily:Cc,recordDailyCompletion:jh,recordDailyPlay:Yh},Symbol.toStringTag,{value:"Module"}));let Dt=null;const Ws=Wt.url,Vs=Wt.anonKey;Dt=Lo(Ws,Vs);const Ka={publishableKey:"pk_test_51SRkYpLTNnCfYOpshomJSwPamwf1TIerrefVeSeCKDXPsu2hPefFRD22UKpBqHnZCbk0R84AvBl2uBCIFrM1qhEM00v4bsZCol",priceId:"price_1SRkdrLTNnCfYOpseKghvVo3",amount:245,bulkPriceId:"price_1STzXPLTNnCfYOpsm9lSQTeT",bulkAmount:3999};let Wo=null;async function Rc(){return Wo||(typeof Stripe>"u"&&await t0(),Ka.publishableKey.startsWith("pk_test_YOUR")||Ka.publishableKey.startsWith("pk_live_YOUR")?(console.warn("⚠️ Stripe not configured. Set VITE_STRIPE_PUBLISHABLE_KEY in .env"),null):(Wo=Stripe(Ka.publishableKey),Wo))}function t0(){return new Promise((a,e)=>{const t=document.createElement("script");t.src="https://js.stripe.com/v3/",t.onload=a,t.onerror=e,document.head.appendChild(t)})}async function a0(a){if(!Dt)throw new Error("Supabase not initialized");const e=je(),{data:t,error:n}=await Dt.from("daily_replay_payments").insert({player_id:e,date:a,amount_cents:Ka.amount,currency:"USD",payment_status:"pending"}).select().single();if(n)throw n;return t.id}async function Oc(a,e,t){if(!Dt)return;const{error:n}=await Dt.from("daily_replay_payments").update({stripe_payment_intent_id:e,payment_status:t,updated_at:new Date().toISOString()}).eq("id",a);if(n)throw n}async function n0(a,e){if(!Dt)return;const t=je(),{data:n,error:o}=await Dt.from("daily_replay_payments").select("date").eq("id",a).single();if(o)throw o;const{error:s}=await Dt.rpc("record_replay_payment",{p_player_id:t,p_date:n.date,p_payment_id:a,p_stripe_payment_intent_id:e});if(s)throw s}async function wr(a=null,e=null){try{const t=await Rc();if(!t)throw new Error("Stripe not configured. Please set up your Stripe keys.");const n=e||rn(),o=a||Gt(),s=await a0(o),i=`${Ws}/functions/v1/create-checkout-session`,r=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${Vs}`},body:JSON.stringify({paymentId:s,dayNumber:n,date:o,amount:Ka.amount,currency:"USD"})});if(!r.ok){const d=await r.text();throw new Error("Failed to create checkout session")}const{sessionId:l}=await r.json(),{error:c}=await t.redirectToCheckout({sessionId:l});if(c)throw await Oc(s,null,"failed"),c;return!0}catch(t){return Fc(t.message),!1}}async function kc(){try{const a=await Rc();if(!a)throw new Error("Stripe not configured. Please set up your Stripe keys.");const e=await o0(),t=`${Ws}/functions/v1/create-checkout-session`,n=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${Vs}`},body:JSON.stringify({paymentId:e,amount:Ka.bulkAmount,currency:"USD",isBulkPurchase:!0,description:"Unlock All Past Daily Levels - Lifetime Access"})});if(!n.ok){const i=await n.text();throw new Error("Failed to create checkout session")}const{sessionId:o}=await n.json(),{error:s}=await a.redirectToCheckout({sessionId:o});if(s)throw await Oc(e,null,"failed"),s;return!0}catch(a){return Fc(a.message),!1}}async function o0(){const a=je(),{data:e,error:t}=await Dt.from("unlimited_past_access_payments").insert({player_id:a,amount_cents:Ka.bulkAmount,currency:"USD",payment_status:"pending"}).select("id").single();if(t)throw t;return e.id}async function s0(a,e){const t=je(),{error:n}=await Dt.from("unlimited_past_access_payments").update({payment_status:"succeeded",stripe_payment_intent_id:e,updated_at:new Date().toISOString()}).eq("id",a);if(n)throw n;const{error:o}=await Dt.from("players").update({has_unlimited_past_access:!0,updated_at:new Date().toISOString()}).eq("player_id",t);if(o)throw o}async function $i(a){try{const e=`${Ws}/functions/v1/verify-payment`,t=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${Vs}`},body:JSON.stringify({sessionId:a})});if(!t.ok)throw new Error("Failed to verify payment");const{paymentId:n,paymentIntentId:o,isBulkPurchase:s}=await t.json();return s?(await s0(n,o),console.log("✅ Payment successful! Unlimited past access unlocked.")):(await n0(n,o),console.log("✅ Payment successful! Daily replay unlocked.")),J(async()=>{const{showEmailPromptForPayingCustomer:i}=await Promise.resolve().then(()=>Uc);return{showEmailPromptForPayingCustomer:i}},void 0).then(({showEmailPromptForPayingCustomer:i})=>{i()}).catch(i=>{console.error("Error showing email prompt:",i)}),!0}catch(e){return console.error("Error handling payment success:",e),!1}}function Fc(a){const e=document.createElement("div");e.className="payment-error-modal",e.innerHTML=`
    <div class="payment-error-content">
      <h2>Payment Failed</h2>
      <p>${a}</p>
      <button class="close-error-btn">Close</button>
    </div>
  `,document.body.appendChild(e),e.querySelector(".close-error-btn").addEventListener("click",()=>{e.remove()}),setTimeout(()=>{e.parentElement&&e.remove()},5e3)}async function Nc(a=null,e=null){return new Promise(t=>{const n=a&&a!==Gt(),o=n?"for unlimited replays of this level":"for unlimited replays today",s=n?`
      <div class="paywall-divider">
        <span>OR</span>
      </div>
      <div class="paywall-upsell">
        <div class="upsell-badge">BEST VALUE</div>
        <div class="upsell-price">
          <span class="price-amount">$39.99</span>
          <span class="price-label">Unlock ALL Past Dailies Forever</span>
        </div>
        <div class="upsell-features">
          <div class="upsell-feature">
            <span class="material-icons">check_circle</span>
            <span>Access every past daily level</span>
          </div>
          <div class="upsell-feature">
            <span class="material-icons">check_circle</span>
            <span>Includes all future past dailies</span>
          </div>
          <div class="upsell-feature">
            <span class="material-icons">check_circle</span>
            <span>One-time payment, lifetime access</span>
          </div>
        </div>
        <button class="btn-purchase-bulk">Unlock All Past Dailies</button>
      </div>
    `:"",i=document.createElement("div");i.className="daily-paywall-modal",i.innerHTML=`
      <div class="paywall-content ${n?"with-upsell":""}">
        <div class="paywall-header">
          <span class="material-icons">lock</span>
          <h2>${n?"Unlock Past Daily?":"Play Again?"}</h2>
        </div>
        <div class="paywall-body">
          <p>${n?"This is a past daily level.":"You've already played today's daily challenge!"}</p>
          <p>Want to ${n?"unlock":"play again"}?</p>
          <div class="paywall-price">
            <span class="price-amount">$2.45</span>
            <span class="price-label">${o}</span>
          </div>
          <button class="btn-purchase-single">${n?"Unlock This Level":"Purchase Replay"}</button>
        </div>
        ${s}
        <div class="paywall-actions">
          <button class="btn-cancel">Maybe Later</button>
        </div>
      </div>
    `,document.body.appendChild(i),i.querySelector(".btn-purchase-single").addEventListener("click",async()=>{i.remove();const l=await wr(a,e);t(l)});const r=i.querySelector(".btn-purchase-bulk");r&&r.addEventListener("click",async()=>{i.remove();const l=await kc();t(l)}),i.querySelector(".btn-cancel").addEventListener("click",()=>{i.remove(),t(!1)}),i.addEventListener("click",l=>{l.target===i&&(i.remove(),t(!1))})})}if(typeof window<"u"){const a=new URLSearchParams(window.location.search),e=a.get("payment"),t=a.get("session_id");console.log("🔍 Checking for payment callback..."),console.log("  payment status:",e),console.log("  session_id:",t),e==="success"&&t?(console.log("✅ Payment callback detected! Verifying payment..."),$i(t).then(n=>{n?(console.log("✅ Payment verified successfully!"),cc("Payment successful! Daily replay unlocked."),pr()):(console.error("❌ Payment verification failed"),$r("Payment verification failed. Please contact support.")),window.history.replaceState({},document.title,window.location.pathname)}).catch(n=>{console.error("❌ Error handling payment callback:",n),$r("Error verifying payment. Please contact support."),window.history.replaceState({},document.title,window.location.pathname)})):e==="cancelled"&&(console.log("⚠️ Payment cancelled by user"),window.history.replaceState({},document.title,window.location.pathname)),window.purchaseDailyReplay=wr,window.showPaymentModal=Nc,window.handlePaymentSuccess=$i}const Sr=Object.freeze(Object.defineProperty({__proto__:null,handlePaymentSuccess:$i,purchaseDailyReplay:wr,purchaseUnlimitedPastAccess:kc,showPaymentModal:Nc},Symbol.toStringTag,{value:"Module"})),i0=Wt.url,r0=Wt.anonKey;let pa=null;pa=Lo(i0,r0);async function Tr(){if(!pa)return console.warn("Supabase not configured"),null;try{const a=je(),{data:e,error:t}=await pa.from("players").select("email, email_verified").eq("player_id",a).single();return t?(console.error("Error fetching player email:",t),null):e?.email||null}catch(a){return console.error("Error in getPlayerEmail:",a),null}}async function br(a){if(!pa)return{success:!1,error:"Supabase not configured"};if(!a||!a.includes("@"))return{success:!1,error:"Invalid email address"};try{const e=je(),{data:t,error:n}=await pa.rpc("set_player_email",{p_player_id:e,p_email:a.toLowerCase().trim()});return n?(console.error("Error setting email:",n),{success:!1,error:"Failed to set email"}):t===!1?{success:!1,error:"Email already in use by another account"}:{success:!0}}catch(e){return console.error("Error in setPlayerEmail:",e),{success:!1,error:"An error occurred"}}}async function l0(a){try{const t=(await bt.storage.getAllScores()).filter(s=>s.playerId===a);if(t.length===0){console.log("No scores found for this player");return}const n=new Map;t.forEach(s=>{if(s.levelId!==999){const i=n.get(s.levelId),r=s.waterPercentage>=.9?3:s.waterPercentage>=.7?2:1;(!i||r>i.stars)&&n.set(s.levelId,{levelId:s.levelId,timestamp:s.timestamp,stars:r,completed:!0})}});const o=Array.from(n.values());if(localStorage.setItem("completedLevels",JSON.stringify(o)),o.length>0){const s=Math.max(...o.map(r=>r.levelId)),i=s>=21?21:s+1;localStorage.setItem("currentLevelId",i.toString()),console.log(`✅ Restored level progression: ${o.length} levels completed, current level: ${i}`)}else localStorage.setItem("currentLevelId","1"),console.log("✅ No regular levels completed, starting at level 1")}catch(e){console.error("Error restoring level progression:",e)}}async function Bc(a){if(!pa)return{success:!1,error:"Supabase not configured"};if(!a||!a.includes("@"))return{success:!1,error:"Invalid email address"};try{const{data:e,error:t}=await pa.functions.invoke("send-recovery-email",{body:{email:a.toLowerCase().trim()}});return t?(console.error("Error requesting recovery:",t),{success:!1,error:"Failed to send recovery email"}):{success:!0,message:e.message||"If that email is registered, you will receive a recovery link."}}catch(e){return console.error("Error in requestRecovery:",e),{success:!1,error:"An error occurred"}}}async function Hc(a){if(!pa)return{success:!1,error:"Supabase not configured"};if(!a)return{success:!1,error:"Invalid recovery token"};try{const{data:e,error:t}=await pa.functions.invoke("verify-recovery-token",{body:{token:a}});return t?(console.error("Error verifying token:",t),{success:!1,error:"Invalid or expired recovery token"}):e.success?(localStorage.setItem("oasea_player_id",e.player_id),e.display_name&&(localStorage.setItem("oasea_player_name",e.display_name),localStorage.setItem("oasea_player_name_set","true")),console.log("✅ Account recovered:",e.player_id),await l0(e.player_id),{success:!0,playerId:e.player_id,displayName:e.display_name,email:e.email}):{success:!1,error:e.error||"Invalid recovery token"}}catch(e){return console.error("Error in verifyRecoveryToken:",e),{success:!1,error:"An error occurred"}}}function c0(){const a=document.getElementById("stats-content");if(!a||document.getElementById("email-management-section"))return;const e=document.createElement("div");e.id="email-management-section",e.className="email-management-section",e.innerHTML=`
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
  `,a.insertBefore(e,a.firstChild),zc()}async function zc(){const a=document.getElementById("email-status");if(!a)return;const e=await Tr();e?(a.innerHTML=`
      <div class="email-set">
        <span class="material-icons" style="color: #4CAF50;">check_circle</span>
        <span style="margin-left: 8px;">${e}</span>
      </div>
      <button id="change-email-btn" class="secondary-btn" style="margin-top: 10px;">
        Change Email
      </button>
      <div style="margin-top: 15px; text-align: center;">
        <a href="#" id="stats-recovery-link" style="font-size: 0.85em; opacity: 0.7; text-decoration: none; color: inherit;">
          <span class="material-icons" style="font-size: 14px; vertical-align: middle;">restore</span>
          Recover a different account
        </a>
      </div>
    `,document.getElementById("change-email-btn")?.addEventListener("click",Xi),document.getElementById("stats-recovery-link")?.addEventListener("click",t=>{t.preventDefault(),Do()})):(a.innerHTML=`
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
    `,document.getElementById("add-email-btn")?.addEventListener("click",Xi),document.getElementById("stats-recovery-link")?.addEventListener("click",t=>{t.preventDefault(),Do()}))}function Xi(){const a=document.getElementById("email-prompt-modal");if(!a)return u0(),Xi();a.style.display="flex";const e=document.getElementById("email-input");e&&(e.value="",e.focus())}function u0(){const a=document.createElement("div");a.id="email-prompt-modal",a.className="modal",a.style.display="none",a.innerHTML=`
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
  `,document.body.appendChild(a),document.getElementById("save-email-btn")?.addEventListener("click",sl),document.getElementById("cancel-email-btn")?.addEventListener("click",()=>{a.style.display="none"}),a.addEventListener("click",e=>{e.target===a&&(a.style.display="none")}),document.getElementById("email-input")?.addEventListener("keypress",e=>{e.key==="Enter"&&sl()})}async function sl(){const a=document.getElementById("email-input"),e=document.getElementById("email-error"),t=document.getElementById("save-email-btn");if(!a||!e||!t)return;const n=a.value.trim();if(!n||!n.includes("@")){e.textContent="Please enter a valid email address",e.style.display="block";return}t.disabled=!0,t.innerHTML='<span class="material-icons rotating">hourglass_empty</span> Saving...';const o=await br(n);o.success?(e.style.display="none",t.innerHTML='<span class="material-icons">check</span> Saved!',setTimeout(()=>{document.getElementById("email-prompt-modal").style.display="none",t.disabled=!1,t.innerHTML='<span class="material-icons">check</span> Save Email',zc()},1500)):(e.textContent=o.error||"Failed to save email",e.style.display="block",t.disabled=!1,t.innerHTML='<span class="material-icons">check</span> Save Email')}function Wc(){const e=new URLSearchParams(window.location.search).get("token");e&&Vc(e),f0()}async function Vc(a){const e=document.getElementById("recovery-modal");if(!e)return d0(),Vc(a);e.style.display="flex";const t=document.getElementById("recovery-status");if(!t)return;t.innerHTML=`
    <div class="stats-loading-animation">
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="collection"></div>
    </div>
    <p>Recovering your account...</p>
  `;const n=await Hc(a);n.success?(t.innerHTML=`
      <div style="text-align: center;">
        <span class="material-icons" style="font-size: 64px; color: #4CAF50;">check_circle</span>
        <h2>Welcome Back${n.displayName?", "+n.displayName:""}!</h2>
        <p>Your account has been recovered successfully.</p>
        <button id="continue-btn" class="play-btn" style="margin-top: 20px;">
          <span class="material-icons">play_arrow</span>
          Continue Playing
        </button>
      </div>
    `,document.getElementById("continue-btn")?.addEventListener("click",()=>{e.style.display="none",window.history.replaceState({},document.title,window.location.pathname),window.location.reload()})):(t.innerHTML=`
      <div style="text-align: center;">
        <span class="material-icons" style="font-size: 64px; color: #f44336;">error</span>
        <h2>Recovery Failed</h2>
        <p>${n.error||"Invalid or expired recovery link."}</p>
        <button id="try-again-btn" class="secondary-btn" style="margin-top: 20px;">
          Request New Link
        </button>
      </div>
    `,document.getElementById("try-again-btn")?.addEventListener("click",()=>{e.style.display="none",Do()}))}function d0(){const a=document.createElement("div");a.id="recovery-modal",a.className="modal",a.style.display="none",a.innerHTML=`
    <div class="modal-content score-content">
      <h2>Account Recovery</h2>
      <div id="recovery-status">
        <!-- Populated dynamically -->
      </div>
    </div>
  `,document.body.appendChild(a)}function Do(){const a=document.getElementById("recovery-request-modal");if(!a)return m0(),Do();a.style.display="flex";const e=document.getElementById("recovery-email-input");e&&(e.value="",e.focus());const t=document.getElementById("recovery-request-status");t&&(t.style.display="none")}function m0(){const a=document.createElement("div");a.id="recovery-request-modal",a.className="modal",a.style.display="none",a.innerHTML=`
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
  `,document.body.appendChild(a),document.getElementById("send-recovery-btn")?.addEventListener("click",il),document.getElementById("cancel-recovery-btn")?.addEventListener("click",()=>{a.style.display="none"}),a.addEventListener("click",e=>{e.target===a&&(a.style.display="none")}),document.getElementById("recovery-email-input")?.addEventListener("keypress",e=>{e.key==="Enter"&&il()})}async function il(){const a=document.getElementById("recovery-email-input"),e=document.getElementById("recovery-request-status"),t=document.getElementById("send-recovery-btn");if(!a||!e||!t)return;const n=a.value.trim();if(!n||!n.includes("@")){e.textContent="Please enter a valid email address",e.className="error-message",e.style.display="block";return}t.disabled=!0,t.innerHTML='<span class="material-icons rotating">hourglass_empty</span> Sending...';const o=await Bc(n);o.success?(e.textContent=o.message||"Check your email for a recovery link!",e.className="info-message",e.style.display="block",t.innerHTML='<span class="material-icons">check</span> Sent!',setTimeout(()=>{document.getElementById("recovery-request-modal").style.display="none",t.disabled=!1,t.innerHTML='<span class="material-icons">email</span> Send Recovery Link'},3e3)):(e.textContent=o.error||"Failed to send recovery email",e.className="error-message",e.style.display="block",t.disabled=!1,t.innerHTML='<span class="material-icons">email</span> Send Recovery Link')}function f0(){const a=document.getElementById("splash-buttons");if(!a||document.getElementById("recovery-link")||localStorage.getItem("oasea_player_id")!==null)return;const t=document.createElement("button");t.id="recovery-link",t.className="secondary-btn",t.style.marginTop="10px",t.innerHTML=`
    <span class="material-icons" style="font-size: 16px;">restore</span>
    Recover Account
  `,t.addEventListener("click",Do),a.appendChild(t)}function p0(){Tr().then(a=>{a||setTimeout(()=>{const e=document.getElementById("first-completion-email-modal");e?e.style.display="flex":(h0(),setTimeout(()=>{document.getElementById("first-completion-email-modal").style.display="flex"},100))},1500)})}function h0(){const a=document.createElement("div");a.id="first-completion-email-modal",a.className="modal",a.style.display="none",a.innerHTML=`
    <div class="modal-content score-content">
      <h2>Protect Your Purchase</h2>
      <p style="text-align: center; margin-bottom: 10px;">
        Add an email to secure your account
      </p>
      <p style="text-align: center; margin-bottom: 20px; font-size: 0.9em; opacity: 0.8;">
        You can recover your purchase if you ever clear your browser data or switch devices.
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
  `,document.body.appendChild(a),document.getElementById("save-first-completion-email-btn")?.addEventListener("click",async()=>{const e=document.getElementById("first-completion-email-input"),t=document.getElementById("first-completion-email-error"),n=document.getElementById("save-first-completion-email-btn");if(!e||!t||!n)return;const o=e.value.trim();if(!o||!o.includes("@")){t.textContent="Please enter a valid email address",t.style.display="block";return}n.disabled=!0,n.innerHTML='<span class="material-icons rotating">hourglass_empty</span> Saving...';const s=await br(o);s.success?(t.style.display="none",n.innerHTML='<span class="material-icons">check</span> Saved!',setTimeout(()=>{a.style.display="none",n.disabled=!1,n.innerHTML='<span class="material-icons">check</span> Save Email'},1500)):(t.textContent=s.error||"Failed to save email",t.style.display="block",n.disabled=!1,n.innerHTML='<span class="material-icons">check</span> Save Email')}),document.getElementById("skip-email-btn")?.addEventListener("click",()=>{a.style.display="none"}),document.getElementById("first-completion-email-input")?.addEventListener("keypress",e=>{e.key==="Enter"&&document.getElementById("save-first-completion-email-btn")?.click()})}const Uc=Object.freeze(Object.defineProperty({__proto__:null,getPlayerEmail:Tr,initEmailManagementUI:c0,initRecoveryFlow:Wc,requestRecovery:Bc,setPlayerEmail:br,showEmailPromptForPayingCustomer:p0,verifyRecoveryToken:Hc},Symbol.toStringTag,{value:"Module"}));function qi(a,e,t,n=!1,o=0){const{waterMaterial:s,waterHemisphereMaterial:i,terrainMaterial:r,fillLight:l}=e,{DAY_WATER_COLOR:c,NIGHT_WATER_COLOR:d,DAY_SHALLOW_COLOR:u,NIGHT_SHALLOW_COLOR:m,DAY_FOG_COLOR:f,NIGHT_FOG_COLOR:p,DAY_DEEP_COLOR:g,NIGHT_DEEP_COLOR:y,DAY_HEMISPHERE_SHALLOW:v,NIGHT_HEMISPHERE_SHALLOW:S,DAY_FILL_COLOR:T,NIGHT_FILL_COLOR:b,DAY_TERRAIN_OCEAN_DEEP:x,NIGHT_TERRAIN_OCEAN_DEEP:_,DAY_TERRAIN_OCEAN_MID:R,NIGHT_TERRAIN_OCEAN_MID:P,DAY_TERRAIN_DEEP:E,NIGHT_TERRAIN_DEEP:C,DAY_TERRAIN_SHALLOW:k,NIGHT_TERRAIN_SHALLOW:G,DAY_TERRAIN_LOW:$,NIGHT_TERRAIN_LOW:ae,DAY_TERRAIN_MID_LOW:ke,NIGHT_TERRAIN_MID_LOW:Ee,DAY_TERRAIN_MID:Pe,NIGHT_TERRAIN_MID:vt,DAY_TERRAIN_MID_HIGH:re,NIGHT_TERRAIN_MID_HIGH:_e,DAY_TERRAIN_HIGH:Te,NIGHT_TERRAIN_HIGH:Ae,DAY_TERRAIN_PEAK:wt,NIGHT_TERRAIN_PEAK:Lt}=t;if(l&&(l.color.lerpColors(b,T,a),l.intensity=.15+a*.25),s&&(s.uniforms.uWaterColor.value.lerpColors(d,c,a),s.uniforms.uShallowColor.value.lerpColors(m,u,a),s.uniforms.fogColor.value.lerpColors(p,f,a)),i&&!n&&(i.uniforms.uDeepColor.value.lerpColors(y,g,a),i.uniforms.uShallowColor.value.lerpColors(S,v,a),i.uniforms.fogColor.value.lerpColors(p,f,a)),r){const Xe=a*(1-o);r.uniforms.oceanDeepColor.value.lerpVectors(_,x,Xe),r.uniforms.oceanMidColor.value.lerpVectors(P,R,Xe),r.uniforms.deepColor.value.lerpVectors(C,E,Xe),r.uniforms.shallowColor.value.lerpVectors(G,k,Xe),r.uniforms.lowColor.value.lerpVectors(ae,$,Xe),r.uniforms.midLowColor.value.lerpVectors(Ee,ke,Xe),r.uniforms.midColor.value.lerpVectors(vt,Pe,Xe),r.uniforms.midHighColor.value.lerpVectors(_e,re,Xe),r.uniforms.highColor.value.lerpVectors(Ae,Te,Xe),r.uniforms.peakColor.value.lerpVectors(Lt,wt,Xe)}}const wa=q.degToRad(64),Yt=q.degToRad(98),Yn=q.degToRad(80),rl=q.degToRad(50),g0=16e3;class y0{constructor(e,t,n,o,s,i){this.sky=e,this.sun=t,this.renderer=n,this.ambient=o,this.light=s,this.starField=i,this.currentSunPhi=wa,this.currentSunTheta=Yn,this.isSunTransitioning=!1,this.sunTransitionStartTime=0,this.sunTransitionStartPhi=wa,this.sunTransitionTargetPhi=wa,this.sunTransitionStartTheta=Yn,this.sunTransitionTargetTheta=Yn}initializeTimeOfDay(e,t,n){e==="night"?(this.currentSunPhi=Yt,this.currentSunTheta=rl,this.sun.setFromSphericalCoords(1,this.currentSunPhi,this.currentSunTheta),this.sky.material.uniforms.sunPosition.value.copy(this.sun),this.renderer.toneMappingExposure=.05,this.ambient.intensity=4.25,this.light.intensity=.854,this.sky.material.uniforms.turbidity.value=.4,this.sky.material.uniforms.rayleigh.value=.25,this.sky.material.uniforms.mieCoefficient.value=5e-4,this.sky.material.uniforms.mieDirectionalG.value=.8,n.copy(t.NIGHT_SKY_BG),console.log(`Initial time of day: NIGHT (phi: ${q.radToDeg(this.currentSunPhi).toFixed(1)}°, theta: ${q.radToDeg(this.currentSunTheta).toFixed(1)}°)`)):(this.currentSunPhi=wa,this.currentSunTheta=Yn,n.copy(t.DAY_SKY_BG))}startTransition(e,t,n,o,s){const i=e==="night"?Yt:wa,r=e==="night"?rl:Yn;Math.abs(this.currentSunPhi-i)>.01?(this.isSunTransitioning=!0,this.sunTransitionStartTime=t,this.sunTransitionStartPhi=this.currentSunPhi,this.sunTransitionTargetPhi=i,this.sunTransitionStartTheta=this.currentSunTheta,this.sunTransitionTargetTheta=r,console.log(`Starting sun transition to ${e.toUpperCase()}`)):(this.currentSunPhi=i,this.currentSunTheta=r,this._applyImmediateLighting(n,o,s))}update(e,t,n,o){if(this.isSunTransitioning){const s=e-this.sunTransitionStartTime,i=Math.min(s/g0,1),r=i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;if(this.currentSunPhi=this.sunTransitionStartPhi+(this.sunTransitionTargetPhi-this.sunTransitionStartPhi)*r,this.currentSunTheta=this.sunTransitionStartTheta+(this.sunTransitionTargetTheta-this.sunTransitionStartTheta)*r,this.sun.setFromSphericalCoords(1,this.currentSunPhi,this.currentSunTheta),this.sky.material.uniforms.sunPosition.value.copy(this.sun),i>=1){this.isSunTransitioning=!1;const l=this.currentSunPhi>Yt-.01;console.log(`Sun transition complete - ${l?"NIGHT":"DAY"} (phi: ${q.radToDeg(this.currentSunPhi).toFixed(1)}°, theta: ${q.radToDeg(this.currentSunTheta).toFixed(1)}°)`)}}this._updateLighting(t,n,o)}_updateLighting(e,t,n){const o=q.clamp((this.currentSunPhi-Yt)/(wa-Yt),0,1);this.starField&&(this.starField.material.opacity=1-o),this.renderer.toneMappingExposure=.05+o*.45,this.ambient.intensity=.15+o*.336,this.light.intensity=.4+o*1.23,qi(o,e,t,h.isActive,h.terrainDarknessBlend),h.isActive||(this.sky.material.uniforms.turbidity.value=.1+o*4.9,this.sky.material.uniforms.rayleigh.value=.2+o*.5,this.sky.material.uniforms.mieCoefficient.value=3e-4+.0012*o,this.sky.material.uniforms.mieDirectionalG.value=.65+.2*o,n.lerpColors(t.NIGHT_SKY_BG,t.DAY_SKY_BG,o))}_applyImmediateLighting(e,t,n){this.sun.setFromSphericalCoords(1,this.currentSunPhi,this.currentSunTheta),this.sky.material.uniforms.sunPosition.value.copy(this.sun);const o=(this.currentSunPhi-Yt)/(wa-Yt);this.renderer.toneMappingExposure=.05+o*.35,this.ambient.intensity=.15+o*.336,this.light.intensity=.4+o*.923,qi(o,e,t,h.isActive,h.terrainDarknessBlend),h.isActive||(this.sky.material.uniforms.turbidity.value=.1+o*4.9,this.sky.material.uniforms.rayleigh.value=.05+o*.63,this.sky.material.uniforms.mieCoefficient.value=5e-4+.0015*o,this.sky.material.uniforms.mieDirectionalG.value=.8+.15*o,n.lerpColors(t.NIGHT_SKY_BG,t.DAY_SKY_BG,o))}isTransitioning(){return this.isSunTransitioning}getCurrentPhi(){return this.currentSunPhi}}function v0(a,e,t,n=!1){const o={shark:()=>Kd(e),mantaRays:()=>sm(e,t),dolphins:()=>mm(e),whales:()=>lm(e),ship:()=>hm(e),sailBoat:()=>ym(e),whaleShark:()=>Sm(e),seagulls:()=>Tm(e),fishSchools:()=>Cm(e,n),sailfish:()=>km(e),squids:()=>$m(e),turtles:()=>nf(e,t)};Object.entries(a).forEach(([s,i])=>{i&&o[s]&&o[s]()})}function w0(a,e,t,n){a.uniforms.uTime.value=e.uniforms.uTime.value,a.uniforms.uWaveAmplitude.value=e.uniforms.uWaveAmplitude.value,a.uniforms.uWaveFrequency.value=e.uniforms.uWaveFrequency.value,a.uniforms.uWaveHeightMultiplier.value=e.uniforms.uWaveHeightMultiplier.value,a.uniforms.uWaterCurvature.value=e.uniforms.uCurvature.value,a.uniforms.uWaterMeshOffset.value.set(e.uniforms.uMeshOffset.value.x-n.x,e.uniforms.uMeshOffset.value.y-n.z),a.uniforms.uWaterMeshPosition.value.set(t.position.x-n.x,t.position.z-n.z),e.uniforms.uIslandGroupOffset.value.set(n.x,n.z)}const We={BLUE_WHITE:[new O(13227519),new O(13951231),new O(12110335)],WHITE:[new O(16777215),new O(16316671),new O(16775408)],YELLOW_WHITE:[new O(16774368),new O(16773336),new O(16771272)],ORANGE_RED:[new O(16768460),new O(16766392),new O(16763048)]},Ta={SMALL:{size:1.5,probability:.7},MEDIUM:{size:2.5,probability:.25},LARGE:{size:4}};function S0(){const a=Math.random();return a<.1?We.BLUE_WHITE[Math.floor(Math.random()*We.BLUE_WHITE.length)].clone():a<.4?We.WHITE[Math.floor(Math.random()*We.WHITE.length)].clone():a<.75?We.YELLOW_WHITE[Math.floor(Math.random()*We.YELLOW_WHITE.length)].clone():We.ORANGE_RED[Math.floor(Math.random()*We.ORANGE_RED.length)].clone()}function T0(){const a=Math.random();return a<Ta.SMALL.probability?Ta.SMALL.size:a<Ta.SMALL.probability+Ta.MEDIUM.probability?Ta.MEDIUM.size:Ta.LARGE.size}function b0(a,e){const t=Math.PI/3,n=Math.sin(a)*Math.sin(e),o=Math.cos(a),s=n*Math.sin(t)+o*Math.cos(t);return Math.abs(s)<.25}function M0(){const t=[],n=[],o=[];let s=0,i=0;const r=6e3*2;for(;s<6e3&&i<r;){i++;const u=Math.acos(2*Math.random()-1),m=2*Math.PI*Math.random();if(u>Math.PI*.45)continue;const f=new w().setFromSphericalCoords(1,u,m);t.push(f.x,f.y,f.z);const p=S0();n.push(p.r,p.g,p.b),o.push(T0()),s++}for(s=0,i=0;s<4e3&&i<r;){i++;const u=Math.acos(2*Math.random()-1),m=2*Math.PI*Math.random();if(u>Math.PI*.45||!b0(u,m))continue;const f=new w().setFromSphericalCoords(1,u,m);t.push(f.x,f.y,f.z);const p=Math.random();let g;p<.15?g=We.BLUE_WHITE[Math.floor(Math.random()*We.BLUE_WHITE.length)].clone():p<.55?g=We.WHITE[Math.floor(Math.random()*We.WHITE.length)].clone():p<.8?g=We.YELLOW_WHITE[Math.floor(Math.random()*We.YELLOW_WHITE.length)].clone():g=We.ORANGE_RED[Math.floor(Math.random()*We.ORANGE_RED.length)].clone(),g.multiplyScalar(1.1),n.push(g.r,g.g,g.b);const y=Math.random()<.8?Ta.SMALL.size:Ta.MEDIUM.size;o.push(y),s++}const l=new Po;l.setAttribute("position",new Ys(t,3)),l.setAttribute("color",new Ys(n,3)),l.setAttribute("size",new Ys(o,1));const c=new Ds({size:2,sizeAttenuation:!0,transparent:!0,opacity:0,depthWrite:!1,vertexColors:!0,blending:El});c.onBeforeCompile=u=>{u.vertexShader=u.vertexShader.replace("attribute float size;",`attribute float size;
varying vec3 vColor;`),u.vertexShader=u.vertexShader.replace("#include <color_vertex>",`#include <color_vertex>
vColor = color;`),u.vertexShader=u.vertexShader.replace("gl_PointSize = size;","gl_PointSize = size * 2.0;"),u.fragmentShader=u.fragmentShader.replace("varying vec3 vColor;",`varying vec3 vColor;
`),u.fragmentShader=u.fragmentShader.replace("#include <premultiplied_alpha_fragment>",`
        // Radial gradient for soft star glow
        float dist = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
        alpha = pow(alpha, 1.5); // Sharper falloff
        gl_FragColor.a *= alpha;

        #include <premultiplied_alpha_fragment>
      `)};const d=new Ps(l,c);return d.scale.setScalar(4e3),d.renderOrder=-1,d}const M=new Qu;M.background=new O(1118719);let oe,Mt;const De=new ed({antialias:!0});De.setSize(window.innerWidth,window.innerHeight);De.shadowMap.enabled=!0;De.shadowMap.type=td;document.body.appendChild(De.domElement);const Gc=await Hf(M,De);oe=Gc.camera;Mt=Gc.controls;window.addEventListener("resize",()=>{oe.aspect=window.innerWidth/window.innerHeight,oe.updateProjectionMatrix(),De.setSize(window.innerWidth,window.innerHeight)});const x0=Uh();let ws=!1,Ve=new Ia;M.add(Ve);const $c=new ad(16777215,.486);M.add($c);const tt=new nr(16777215,1.63);tt.position.set(5,10,5);tt.castShadow=!0;tt.shadow.mapSize.width=2048;tt.shadow.mapSize.height=2048;tt.shadow.camera.near=.8;tt.shadow.camera.far=60;tt.shadow.camera.left=-15;tt.shadow.camera.right=15;tt.shadow.camera.top=15;tt.shadow.camera.bottom=-15;tt.shadow.bias=8e-4;tt.shadow.normalBias=.02;M.add(tt);let xt,Yo,Qt,Us;function E0(){xt=new Ls,xt.scale.setScalar(285e4),xt.material.depthWrite=!1,M.add(xt),Yo=new w;const a=xt.material.uniforms;a.turbidity.value=1.21,a.rayleigh.value=.068,a.mieCoefficient.value=.002,a.mieDirectionalG.value=2.97;const e=q.degToRad(64),t=q.degToRad(68);Yo.setFromSphericalCoords(1,e,t),a.sunPosition.value.copy(Yo),De.toneMapping=sd,De.toneMappingExposure=2.5}E0();Us=M0();M.add(Us);const Mr=new nr(16754022,.4);Mr.position.set(-5,4,-5);M.add(Mr);const I0=new O(16754022),D0=new O(6724044),P0=new O(43212),_0=new O(12615),A0=new O(6740463),L0=new O(2245734),C0=new O(9549),R0=new O(4386),O0=new O(3844815),k0=new O(734044),F0=new O(10541296),N0=new O(1714746),B0=new O(8900331),H0=new O(728378),Xc=new w(.008,.024,.169),qc=new w(.002,.006,.08),Yc=new w(.102,.078,.22),jc=new w(.08,.075,.105),Kc=new w(.224,.157,.271),Zc=new w(.11,.1,.12),Jc=new w(.702,.02,.102),Qc=new w(.32,.11,.1),eu=new w(.859,.259,0),tu=new w(.4,.18,.08),au=new w(.9,.6,.2),nu=new w(.42,.32,.2),ou=new w(1,.8,.3),su=new w(.46,.38,.22),iu=new w(1,.6,.4),ru=new w(.48,.34,.26),lu=new w(1,.4,.5),cu=new w(.5,.28,.3),uu=new w(1,.859,.933),du=new w(.58,.52,.54),Se=new cd({gravity:new ft(0,-9.82,0)}),xr=new Il("ground"),ha=new Il("ball"),z0=new ud(xr,ha,{friction:.0022,restitution:.43,contactEquationStiffness:1e5,contactEquationRelaxation:4,frictionEquationStiffness:1e5,frictionEquationRegularizationTime:3});Se.addContactMaterial(z0);new dd(M,Se,{color:65280,scale:1});let I=ut.getCurrentLevel(),Yi,ji,Ki;I.timeOfDay==="night"?(Yi=12769266,ji=10402009,Ki=1.96129):(Yi=16515066,ji=16252912,Ki=.86);Qt=new nd(Yi,ji,Ki);Qt.name="win_hemi";M.add(Qt);const za=new y0(xt,Yo,De,$c,tt,Us),Bo={DAY_WATER_COLOR:P0,NIGHT_WATER_COLOR:_0,DAY_SHALLOW_COLOR:A0,NIGHT_SHALLOW_COLOR:L0,DAY_FOG_COLOR:F0,NIGHT_FOG_COLOR:N0,DAY_DEEP_COLOR:C0,NIGHT_DEEP_COLOR:R0,DAY_HEMISPHERE_SHALLOW:O0,NIGHT_HEMISPHERE_SHALLOW:k0,DAY_FILL_COLOR:I0,NIGHT_FILL_COLOR:D0,DAY_TERRAIN_OCEAN_DEEP:Xc,NIGHT_TERRAIN_OCEAN_DEEP:qc,DAY_TERRAIN_OCEAN_MID:Yc,NIGHT_TERRAIN_OCEAN_MID:jc,DAY_TERRAIN_DEEP:Kc,NIGHT_TERRAIN_DEEP:Zc,DAY_TERRAIN_SHALLOW:Jc,NIGHT_TERRAIN_SHALLOW:Qc,DAY_TERRAIN_LOW:eu,NIGHT_TERRAIN_LOW:tu,DAY_TERRAIN_MID_LOW:au,NIGHT_TERRAIN_MID_LOW:nu,DAY_TERRAIN_MID:ou,NIGHT_TERRAIN_MID:su,DAY_TERRAIN_MID_HIGH:iu,NIGHT_TERRAIN_MID_HIGH:ru,DAY_TERRAIN_HIGH:lu,NIGHT_TERRAIN_HIGH:cu,DAY_TERRAIN_PEAK:uu,NIGHT_TERRAIN_PEAK:du,DAY_SKY_BG:B0,NIGHT_SKY_BG:H0},mu=I.timeOfDay||"day";za.initializeTimeOfDay(mu,Bo,M.background);let F=Dl({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:Se,groundMaterial:xr,shape:I.terrainShape,waterLevel:I.waterLevel});Ve.add(F.mesh);let Ss=F.size,Za=F.mesh,Ts=F.geometry,ve=F.material,fu=F.body;Ts.attributes.position;F.config.falloffStart;F.config.falloffEnd;F.getHeightAt;let ca=F.randomPosition,Zi=F.sculpt,Ji=F.updatePhysics;F.simpleNoise;Jl(I.spawn);F.setRenderer(De);ve.uniforms.uUseWetnessMap.value=!0;ve.uniforms.uWetnessMap.value=F.wetnessMap.texture();let Me=I.waterLevel,H=Pl({terrainSize:Ss,waterLevel:Me});M.add(H.mesh);M.add(H.hemisphereMesh);const Wa={waterMaterial:H.material,waterHemisphereMaterial:H.hemisphereMesh.material,terrainMaterial:ve,fillLight:Mr},W0=mu==="night"?0:1;qi(W0,Wa,Bo);H.material.uniforms.uUseHeightmap.value=!0;H.material.uniforms.uTerrainHeightmap.value=F.heightmap.texture;H.material.uniforms.uHeightmapWorldSize.value=F.heightmap.worldSize;H.material.uniforms.uHeightmapMinHeight.value=F.heightmap.minHeight;H.material.uniforms.uHeightmapMaxHeight.value=F.heightmap.maxHeight;let pu=H.mesh,Q=H.material;Q.uniforms.uTerrainWidthX.value=F.config.islandRadius;Q.uniforms.uTerrainWidthZ.value=F.config.islandRadius;Q.uniforms.uTerrainHeight.value=.5;const $n=I.terrainShape||{};Q.uniforms.uTerrainScaleX.value=$n.scaleX||1;Q.uniforms.uTerrainScaleY.value=$n.scaleY||1;Q.uniforms.uTerrainIrregularity.value=$n.irregularity||1;Q.uniforms.uTerrainBayAngle.value=$n.bay?.angle||0;Q.uniforms.uTerrainBayDepth.value=$n.bay?.depth||0;Q.uniforms.uTerrainBayWidth.value=$n.bay?.width||0;Q.uniforms.uIslandGroupOffset.value.set(Ve.position.x,Ve.position.z);let ro=_l({scene:M,waterLevel:Me,maxRipples:68});Sh({scene:M,camera:oe,controls:Mt,terrainMesh:Za,waterLevel:Me,sculptTerrain:Zi,updateTrimesh:Ji,world:Se,ballMaterial:ha});let W={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1,sailfish:!1,squids:!1,turtles:!1};I.id>=1&&I.id<2&&(Rl(M),W.shark=!0);I.id>=2&&I.id<3&&(Fl(M),W.mantaRays=!0);I.id>=3&&I.id<4&&(Hl(M,a=>console.log("dolphins ready",a)),W.dolphins=!0);I.id>=4&&I.id<6&&(Bl(M),W.whales=!0);I.id===5&&I.id<7&&(zl(M),W.ship=!0);I.id===6&&I.id<7&&(Wl(M),W.sailBoat=!0);I.id===3&&I.id<4&&(Vl(M,Se,ha),W.temple=!0);I.id===8&&I.id<9&&(Xl(M),W.sailfish=!0);I.id===10&&(Ul(M),W.whaleShark=!0);I.id===14&&(Gl(M),W.seagulls=!0);I.id===15&&(Kl(M),W.turtles=!0);I.id===18&&(jl(M),W.squids=!0);I.id>=1&&ss(M,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:Me,behavior:{swimDepth:Me+-3.6865,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.02,max:.026},levels:[1,2,3,4,5,6,7,8,9,10]},e=>{W.fishSchools=!0});[1,4,11].includes(I.id)&&ss(M,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:Me,behavior:{swimDepth:Me+-3.1865,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},e=>{W.fishSchools=!0});const Ja=pd(),V0=sf(M,Se,ha);function U0(){Va=!0,Ea=Date.now(),xs=!1,Es=!1,ut.startLevelTimer(),Vh(),h.savedWinPercentage=ea,ea=1.01,ps({scene:M,world:Se,ballMaterial:ha,randomTerrainPosition:ca,createCloudIndicator:Tn,sharedCloudTexture:Ja,sky:xt,renderer:De,water:H,timeOfDay:I.timeOfDay||"day"}),Wn=Date.now()+h.startDelay+h.duration+8e3}op({levelManager:ut,animateCameraToGameplay:Wf,startGame:U0,transitionToNextLevel:j0,camera:oe,controls:Mt});Sc(I);Tc(I.winPercentage);wc(I);Wc();let bs=I.multipleTargets||1,Ht=[],on=[],Nt=[];const G0=5;function $0(a,e,t){for(const n of e){const o=a.x-n.x,s=a.z-n.z;if(Math.sqrt(o*o+s*s)<t)return!1}return!0}for(let a=0;a<bs;a++){let e,t=0;const n=50;do e=ca(),t++;while(!$0(e,Ht,G0)&&t<n);Ht.push(e);const o=new sr(1.5,1.5,.2,32),s=new _s({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.63,roughness:.7,transparent:!0,opacity:.246,depthWrite:!1}),i=new pe(o,s);i.position.set(e.x,.1,e.z),i.renderOrder=2,Ve.add(i),on.push(i),Nt.push(s)}jp();Dc(M,Ht,Ja,I.timeOfDay||"day");Eh(M);let Va=!1,jt=!1,Qi=0,er=!1,Na=new Set,ea=I.winPercentage,Wn=0,ye=null,Sn=!1,Ms=0,oi=null,si=null,ii=0,ri=0,Ea=0,xs=!1,Es=!1;function X0(){Va=!1,jt=!1,M.remove(Za),Ts.dispose(),ve.dispose(),Se.removeBody(fu),F.dispose(),M.remove(pu),M.remove(H.hemisphereMesh),Q.dispose(),H.mesh.geometry.dispose(),H.hemisphereMesh.geometry.dispose(),H.hemisphereMesh.material.dispose(),ro.dispose(),[...$e].forEach(e=>{M.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose(),Se.removeBody(e.body)}),$e.length=0,cf(),[...on].forEach(e=>{M.remove(e),e.geometry.dispose(),e.material.dispose()}),on.length=0,Nt.length=0,Ht.length=0,rh(M),ye&&(M.remove(ye),ye.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()}),ye=null),h.cloudData&&(h.cloudData.group&&(M.remove(h.cloudData.group),h.cloudData.group.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})),h.cloudData=null),Tf(),Mh(),M.remove(Ve),Ve.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())});const a=[];M.children.forEach(e=>{e.isLight||e.isSky||e.isCamera||e===Us||e.isPersistent||a.push(e)}),a.forEach(e=>{M.remove(e),e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(n=>n.dispose()):t.material.dispose())})}),Na.clear(),Sn=!1,xc(),bc(),Mc(),lr(),zh(),Nh(),Bh(M),F&&F.material&&Hh(F.material),W.fishSchools&&Rm(M),W.shark&&Zd(M),W.mantaRays&&im(M),W.whales&&cm(M),W.dolphins&&fm(M),W.ship&&gm(M),W.sailBoat&&vm(M),W.sailfish&&Fm(M),W.temple&&wm(M,Se),W.squids&&Xm(M),W.turtles&&of(M)}function q0(a){if(Ve=new Ia,M.add(Ve),ut.currentLevelId=a,ut.saveCurrentLevel(),I=ut.getCurrentLevel(),I.timeOfDay==="night"?(Qt.color.setHex(12769266),Qt.groundColor.setHex(10402009),Qt.intensity=1.96129):(Qt.color.setHex(16515066),Qt.groundColor.setHex(16252912),Qt.intensity=.86),!za.isTransitioning()){const o=I.timeOfDay||"day";za.startTransition(o,performance.now(),Wa,Bo,M.background)}if(F=Dl({segments:34,normalMapPath:"sand-normal.jpg",physicsWorld:Se,groundMaterial:xr,shape:I.terrainShape,waterLevel:I.waterLevel}),Ve.add(F.mesh),Ss=F.size,Za=F.mesh,Ts=F.geometry,ve=F.material,fu=F.body,Ts.attributes.position,F.config.falloffStart,F.config.falloffEnd,F.getHeightAt,ca=F.randomPosition,Zi=F.sculpt,Ji=F.updatePhysics,F.simpleNoise,Jl(I.spawn),F.setRenderer(De),ve.uniforms.uUseWetnessMap.value=!0,ve.uniforms.uWetnessMap.value=F.wetnessMap.texture(),Sc(I),Tc(I.winPercentage),Me=I.waterLevel,H=Pl({terrainSize:Ss,waterLevel:Me}),M.add(H.mesh),M.add(H.hemisphereMesh),pu=H.mesh,Q=H.material,Wa.waterMaterial=H.material,Wa.waterHemisphereMaterial=H.hemisphereMesh.material,Wa.terrainMaterial=ve,!za.isTransitioning()){const o=(za.getCurrentPhi()-Yt)/(wa-Yt);ve.uniforms.oceanDeepColor.value.lerpVectors(qc,Xc,o),ve.uniforms.oceanMidColor.value.lerpVectors(jc,Yc,o),ve.uniforms.deepColor.value.lerpVectors(Zc,Kc,o),ve.uniforms.shallowColor.value.lerpVectors(Qc,Jc,o),ve.uniforms.lowColor.value.lerpVectors(tu,eu,o),ve.uniforms.midLowColor.value.lerpVectors(nu,au,o),ve.uniforms.midColor.value.lerpVectors(su,ou,o),ve.uniforms.midHighColor.value.lerpVectors(ru,iu,o),ve.uniforms.highColor.value.lerpVectors(cu,lu,o),ve.uniforms.peakColor.value.lerpVectors(du,uu,o)}Q.uniforms.uUseHeightmap.value=!0,Q.uniforms.uTerrainHeightmap.value=F.heightmap.texture,Q.uniforms.uHeightmapWorldSize.value=F.heightmap.worldSize,Q.uniforms.uHeightmapMinHeight.value=F.heightmap.minHeight,Q.uniforms.uHeightmapMaxHeight.value=F.heightmap.maxHeight,Q.uniforms.uTerrainWidthX.value=F.config.islandRadius,Q.uniforms.uTerrainWidthZ.value=F.config.islandRadius,Q.uniforms.uTerrainHeight.value=.5;const e=I.terrainShape||{};Q.uniforms.uTerrainScaleX.value=e.scaleX||1,Q.uniforms.uTerrainScaleY.value=e.scaleY||1,Q.uniforms.uTerrainIrregularity.value=e.irregularity||1,Q.uniforms.uTerrainBayAngle.value=e.bay?.angle||0,Q.uniforms.uTerrainBayDepth.value=e.bay?.depth||0,Q.uniforms.uTerrainBayWidth.value=e.bay?.width||0,Q.uniforms.uIslandGroupOffset.value.set(Ve.position.x,Ve.position.z),ro=_l({scene:M,waterLevel:Me,maxRipples:68}),bh({terrainMesh:Za,waterLevel:Me,sculptTerrain:Zi,updateTrimesh:Ji}),W={shark:!1,mantaRays:!1,dolphins:!1,whales:!1,ship:!1,sailBoat:!1,temple:!1,seagulls:!1,whaleShark:!1,fishSchools:!1,sailfish:!1,squids:!1,turtles:!1},I.id>=1&&I.id<2&&(Rl(M),W.shark=!0),I.id>=2&&I.id<3&&(Fl(M),W.mantaRays=!0),I.id>=3&&I.id<4&&(Hl(M),W.dolphins=!0),I.id>=4&&I.id<5&&(Bl(M),W.whales=!0),I.id>=5&&I.id<6&&(zl(M),W.ship=!0),I.id>=6&&I.id<7&&(Wl(M),W.sailBoat=!0),I.id>=3&&I.id<4&&(Vl(M,Se,ha),W.temple=!0),I.id===10&&(Ul(M),W.whaleShark=!0),I.id===14&&(Gl(M),W.seagulls=!0),I.id===8&&(Xl(M),W.sailfish=!0),I.id===18&&(jl(M),W.squids=!0),I.id===15&&(Kl(M),W.turtles=!0),I.id>=1&&ss(M,{modelPath:"./models/blue-fish.glb",count:15,spawnArea:{centerX:8,centerZ:8,radiusX:10,radiusZ:10},waterLevel:Me,behavior:{swimDepth:Me+-3.4285,depthVariation:2,maxSpeed:1.65,minSpeed:.8,avoidanceDistance:6,containmentRadius:8,containmentForce:.4},scale:{min:.022,max:.033},levels:[1,2,3,4,5,6,7,8,9,10]},()=>{W.fishSchools=!0}),[1,4,11].includes(I.id)&&ss(M,{modelPath:"./models/clown-fish.glb",count:20,spawnArea:{centerX:-8,centerZ:-8,radiusX:8,radiusZ:8},waterLevel:Me,behavior:{swimDepth:Me+-3.18685,depthVariation:1.5,maxSpeed:2.5,minSpeed:1,separationDistance:.6,cohesionForce:.25,avoidanceDistance:5,containmentRadius:6,containmentForce:.5},scale:{min:.019,max:.028},levels:[1,4,11]},()=>{W.fishSchools=!0}),bs=I.multipleTargets||1,Ht=[],on=[],Nt=[],lh();function t(o,s,i){for(const r of s){const l=o.x-r.x,c=o.z-r.z;if(l*l+c*c<i*i)return!1}return!0}for(let o=0;o<bs;o++){let s=ca(),i=0;const r=50;for(;!t(s,Ht,5)&&i<r;)s=ca(),i++;Ht.push(s);const l=new sr(1.5,1.5,.2,32),c=new _s({color:16776960,emissive:16776960,emissiveIntensity:.5,metalness:.3,roughness:.7,transparent:!0,opacity:.6,depthWrite:!1}),d=new pe(l,c);d.position.set(s.x,.1,s.z),d.renderOrder=2,Ve.add(d),on.push(d),Nt.push(c)}Dc(M,Ht,Ja,I.timeOfDay||"day"),Va=!1,jt=!1,Qi=0,er=!1,Na=new Set,ea=I.winPercentage,Wn=0,Sn=!1,Ea=0,xs=!1,Es=!1,Mt.enabled=!1,xc();const n=document.getElementById("level-select-modal");n&&(n.classList.add("hidden"),n.style.display="none",n.style.animation=""),Mc(),wc(I,!0)}const hn=Array.from({length:10},()=>new w),Y0=Mt.maxDistance;function j0(){if(ws)return;ws=!0,vf(),gf();const a=ut.currentLevelId,t=ut.getCurrentLevel().timeOfDay||"day";za.startTransition(t,performance.now(),Wa,Bo,M.background),rp(),lp(),bc(),Mt.enabled=!1,Mt.maxDistance=1/0;const n=694,o=new w;oe.getWorldDirection(o);const i=Math.atan2(o.z,o.x)+Math.PI,r=q.degToRad(25),l=i-r,c=i+r;let d,u=0;do{d=Math.random()*Math.PI*2,u++;const Le=(d+Math.PI*2)%(Math.PI*2),qt=(l+Math.PI*2)%(Math.PI*2),le=(c+Math.PI*2)%(Math.PI*2);if(qt<le){if(Le<qt||Le>le)break}else if(Le<qt&&Le>le)break}while(u<100);const m=new w(Math.cos(d)*n,0,Math.sin(d)*n),f=oe.position.clone(),p=Mt.target.clone(),g=oe.fov,y=new w(H.mesh.position.x,H.mesh.position.y,H.mesh.position.z);oe.rotation.x,oe.rotation.y,oe.rotation.z;const v=Cn(),S=v.playbackRate||1,T=Math.atan2(m.z-f.z,m.x-f.x),b=468,x=n*.38,_=26,R=4.82,P=460,E=hn[4].set(m.x-Math.cos(T)*P,m.y+R,m.z-Math.sin(T)*P),C=hn[5].set(f.x+Math.cos(T)*x,b,f.z+Math.sin(T)*x),k=hn[6].set(m.x-Math.cos(T)*_,m.y+R,m.z-Math.sin(T)*_),G=Math.atan2(m.z-y.z,m.x-y.x),$=hn[7].set(y.x+Math.cos(G)*x,b,y.z+Math.sin(G)*x),ae=hn[8].set(m.x,y.y,m.z),ke=5600,Ee=.36;let Pe=0,vt=performance.now();const re=Le=>Le<.5?4*Le*Le*Le:1-Math.pow(-2*Le+2,3)/2;let _e=!1,Te=!1;const Ae=document.getElementById("level-story-overlay"),wt=document.getElementById("level-story-text"),Lt=ut.getCurrentLevel();Ae&&wt&&Lt.story&&(wt.textContent=Lt.story,Ae.style.display="block");let Xe=!1,$t=!1;const Xt=hn[9],ln=new w,cn=new w;new w;function un(Le){const qt=Math.min(.033,(Le-vt)/1e3);vt=Le,Pe+=qt*1e3;const le=Math.min(Pe/ke,1),de=re(le),ga=1-de,dn=de*de,D=dn*de,N=ga*ga,B=N*ga,V=1+le*.048;v.playbackRate=S*V,oe.position.set(B*f.x+3*N*de*C.x+3*ga*dn*E.x+D*k.x,B*f.y+3*N*de*C.y+3*ga*dn*E.y+D*k.y,B*f.z+3*N*de*C.z+3*ga*dn*E.z+D*k.z);const ee=65;oe.fov=q.lerp(g,ee,de),oe.updateProjectionMatrix(),le>=.05&&!Te&&(Te=!0,Q.uniforms.uFoamEnabled.value=!1);const ne=.22,ce=.62;!Xe&&le>=ne&&Ae&&(Xe=!0,Ae.classList.add("visible")),!$t&&le>=ce&&Ae&&($t=!0,Ae.classList.remove("visible"));const te={panOut:.03,panIn:.92,lockNew:1};if(le<te.panOut)Xt.copy(p);else if(le<te.panIn){const mt=(le-te.panOut)/(te.panIn-te.panOut),be=re(mt);ln.set(Math.cos(T),0,Math.sin(T)).multiplyScalar(x*2),cn.copy(oe.position).add(ln).setY(oe.position.y-96),Xt.lerpVectors(p,cn,be)}else{const mt=(le-te.panIn)/(te.lockNew-te.panIn),be=re(mt);Xt.lerpVectors(Xt,m,be)}Mt.target.copy(Xt),_i();const Y=oe.rotation.z,j=.15;let K=0;if(le<.2){const mt=le/.2;K=j*mt}else if(le<.35)K=j;else if(le<.55){const mt=(le-.35)/.2;K=j*(1-mt)}else K=0;oe.rotation.z=Y+K,le>=Ee&&!_e&&(_e=!0,X0(),q0(a),Ve.position.copy(m));const se=.086,L=.192,he=1.16,ge=.664;let Ce=y.x,at=y.z;if(le>se){const mt=(le-se)/(1-se),be=Math.max(mt-L,0),Ze=Math.min(be/ge,3),Xn=Ze*Ze*(3-2*Ze),hu=1+(he-1)*Xn,gu=Math.min(mt*hu,1),La=re(gu),mn=1-La;Ce=mn*mn*y.x+2*mn*La*$.x+La*La*ae.x,at=mn*mn*y.z+2*mn*La*$.z+La*La*ae.z}if(H.mesh.position.set(Ce,H.mesh.position.y,at),H.hemisphereMesh.position.set(H.mesh.position.x,40.88,H.mesh.position.z),H.material.uniforms.uMeshOffset.value.set(H.mesh.position.x,H.mesh.position.z),le<1){requestAnimationFrame(un);return}const Ct=m.clone().negate();Ve.position.add(Ct),H.mesh.position.add(Ct),H.material.uniforms.uMeshOffset.value.set(H.mesh.position.x,H.mesh.position.z),H.hemisphereMesh.position.x+=Ct.x,H.hemisphereMesh.position.z+=Ct.z,oe.position.add(Ct),Mt.target.copy(m).add(Ct),_i(),v.playbackRate=S,K0()}requestAnimationFrame(un)}function K0(){Mt.maxDistance=Y0,ws=!1,Q.uniforms.uFoamEnabled.value=!0;const a=document.getElementById("level-story-overlay");a&&(a.classList.remove("visible"),a.style.display="none"),I.id>1&&ip()}let tr=!1,li=!1,ci=!1,ll=0,cl=0;document.addEventListener("visibilitychange",()=>{if(document.hidden){tr=!0,cl=Date.now(),Is.stop();const a=Vr();ci=!a.paused,ci&&(ll=a.volume);const e=Cn();li=!e.paused,li&&e.pause(),lr(),wf()}else{tr=!1;const a=Date.now()-cl;Ms>0&&(Ms+=a),Wn>0&&(Wn+=a),Ea>0&&(Ea+=a);const e={scene:M,world:Se,ballMaterial:ha,randomTerrainPosition:F.randomPosition,createCloudIndicator:Tn,sharedCloudTexture:Ja,sky:xt,renderer:De,water:H,timeOfDay:I.timeOfDay||"day"};Sf(e,!0),Is.start();const t=Cn();if(li&&rr()&&t.play().catch(n=>console.log("Failed to resume background music:",n)),ci){const n=Vr();n.volume=ll,n.play().catch(o=>console.log("Failed to resume jungle sound:",o))}}});const Is=new od,ul=new sn,dl=new sn,Vo=new w,Uo=new w,ml=new w,fl=new w;let pl=0;function ar(){if(tr){De.render(M,oe),requestAnimationFrame(ar);return}const a=Is.getDelta();Se.step(1/60,a,3),!ws&&!Vf()&&_i(),Zf(oe),za.update(performance.now(),Wa,Bo,M.background),Th();const e=$e.filter(c=>c.active);e.forEach(c=>{const d=c.body.position.x,u=c.body.position.z,m=c.body.position.y;if(!c.hasSpawnedRipple){const p=m-c.radius,g=c.body.velocity.y;if(g<0&&p<=Me-.685){const v=(Me-p)/Math.abs(g),S=.142,T=d-c.body.velocity.x*v+c.body.velocity.x*S,b=u-c.body.velocity.z*v+c.body.velocity.z*S,x=Q.uniforms.uTime.value,_=fd(T,b,x),R=Me+_-.05;ro.spawnRipple(T,b,{size:c.radius*3,speed:1,color:new O(11197951),y:R}),mf(c.radius),c.hasSpawnedRipple=!0}}if(m-c.radius<Me-.88){c.active=!1,M.remove(c.mesh),Se.removeBody(c.body),Na.has(c)&&Na.delete(c);return}Vo.set(d,20,u),Uo.set(0,-1,0),ul.set(Vo,Uo);const f=ul.intersectObject(Za);if(f.length>0){const p=f[0].point.y;m-c.radius<p-.55&&(c.body.position.y=p+c.radius+.2,c.body.velocity.y=Math.max(0,c.body.velocity.y))}}),rf(a),e.forEach((c,d)=>{c.mesh.position.copy(c.body.position);const u=c.body.position.y-c.radius;Vo.set(c.body.position.x,20,c.body.position.z),Uo.set(0,-1,0),dl.set(Vo,Uo);const m=dl.intersectObject(Za);let f=!1,p=-100;m.length>0&&(p=m[0].point.y,f=u<=p+.3&&p>Me+.5);const g=c.body.velocity,y=Math.sqrt(g.x*g.x+g.y*g.y+g.z*g.z);f&&y>.3&&sh(M,c,p);for(let v=d+1;v<e.length;v++){const S=e[v];if(!S.active)continue;const T=c.body.position.x-S.body.position.x,b=c.body.position.z-S.body.position.z;if(T*T+b*b>1)continue;const _=c.body.position.y-S.body.position.y,R=Math.sqrt(T*T+_*_+b*b),P=c.radius+S.radius;if(R<P){const E=c.radius>=S.radius?c:S,C=c.radius>=S.radius?S:c,k=c.radius**3+S.radius**3,G=Math.pow(k,1/3),$=E.body.mass+C.body.mass;E.body.velocity.x=(E.body.velocity.x*E.body.mass+C.body.velocity.x*C.body.mass)/$,E.body.velocity.y=(E.body.velocity.y*E.body.mass+C.body.velocity.y*C.body.mass)/$,E.body.velocity.z=(E.body.velocity.z*E.body.mass+C.body.velocity.z*C.body.mass)/$;const ae=E.originalMass||E.body.mass,ke=C.originalMass||C.body.mass;E.radius=G,E.body.mass=$,E.originalMass=ae+ke,Se.removeBody(E.body),E.body.shapes=[new Ao(G)],E.body.updateBoundingRadius(),Se.addBody(E.body),E.mesh.geometry=Co.get(G);const Ee=C.radius/E.radius,Pe=Math.min(Ee*1.5,1);lf(E,Pe),C.active=!1,M.remove(C.mesh),Se.removeBody(C.body)}}});const t=3,n=t*t,o=1.5;e.forEach(c=>{c.attractionDir.set(0,0,0),c.attractionStrength=0});for(let c=0;c<e.length;c++)for(let d=c+1;d<e.length;d++){const u=e[c],m=e[d],f=m.body.position.x-u.body.position.x,p=m.body.position.z-u.body.position.z;if(f*f+p*p>n)continue;const y=m.body.position.y-u.body.position.y,v=Math.sqrt(f*f+y*y+p*p);if(v<t&&v>.1){const S=f/v,T=y/v,b=p/v,x=o*(1-v/t);if(u.body.velocity.x+=S*x*a,u.body.velocity.y+=T*x*a,u.body.velocity.z+=b*x*a,m.body.velocity.x-=S*x*a,m.body.velocity.y-=T*x*a,m.body.velocity.z-=b*x*a,v<t*.4){const _=1-v/(t*.4);u.attractionDir.x+=S*_,u.attractionDir.y+=T*_,u.attractionDir.z+=b*_,u.attractionStrength=Math.max(u.attractionStrength,_),m.attractionDir.x-=S*_,m.attractionDir.y-=T*_,m.attractionDir.z-=b*_,m.attractionStrength=Math.max(m.attractionStrength,_)}}}for(let c=0;c<on.length;c++)on[c].rotation.y+=a*.5;Qp(a,Nt),eh(a),H.update(Q.uniforms.uTime.value+a),pl++,pl%2===0&&(F.wetnessMap.update(De,Q,Q.uniforms.uTime.value),ve.uniforms.uWetnessMap.value=F.wetnessMap.texture()),w0(ve,Q,H.mesh,Ve.position),ro.update(a),v0(W,a,M,h.isActive),th(e,Ht,Se,Na,pf,dp),ah(M,a,Ht);let s=0;Na.size>0&&Na.forEach(c=>{s+=c.originalMass||c.body.mass});const i=Math.min(s/Ho()*100,100);if(cp(i),oh(oe,a,jt,Qi,Nt),!jt&&Ho()>0&&s>=Ho()*ea){jt=!0,Qi=Date.now(),setTimeout(async()=>{!localStorage.getItem("oasea_player_name_set")&&(Lp(),await new Promise(v=>{const S=setInterval(()=>{localStorage.getItem("oasea_player_name_set")&&(clearInterval(S),v())},100)}));const d=s/Ho(),u=xh(),m=15e4,f=3;let p=1;const g=ut.getCurrentElapsedTime();g<m&&(p++,console.log(`⭐ Speed star earned! Completed in ${Math.round(g/1e3)}s (under ${m/1e3}s)`));const y=u>0?d/u*100:0;y>=f&&(p++,console.log(`⭐ Efficiency star earned! Efficiency: ${y.toFixed(2)} (threshold: ${f})`)),console.log(`Total stars earned: ${p}/3`),ut.completeLevel(p,d,u).then(v=>{console.log("Level completed! Score:",v),v.valid!==!1&&Cp(v)})},2e3),hf(),up();for(let c=0;c<bs;c++)Nt[c]&&(Nt[c].color.setHex(255),Nt[c].emissive.setHex(255),Nt[c].emissiveIntensity=1);Rh({scene:M,terrainMaterial:ve,terrainMesh:Za,terrainSize:Ss,modelCache:x0,timeOfDay:I.timeOfDay||"day"}),er=!0}ih(a),er&&(Oh(Is.getElapsedTime()),Fh(a),Ph(a,ro));const r=h.isActive;bf({gameStarted:Va,scene:M,camera:oe,dt:a,sky:xt,renderer:De,updateCloud:fi,updateRainParticles:pi,setRainOpacity:jo}),r&&!h.isActive&&h.savedWinPercentage!==void 0&&(ea=h.savedWinPercentage,delete h.savedWinPercentage);const l=Date.now();if(Va&&!jt&&!xs&&Ea>0&&l-Ea>=12e4&&(h.isActive||(console.log("🌩️ Second storm incoming!"),xs=!0,h.savedWinPercentage=ea,ea=1.01,ps({scene:M,world:Se,ballMaterial:ha,randomTerrainPosition:ca,createCloudIndicator:Tn,sharedCloudTexture:Ja,sky:xt,renderer:De,water:H,timeOfDay:I.timeOfDay||"day"},!0))),Va&&!jt&&!Es&&Ea>0&&l-Ea>=21e4&&(h.isActive||(console.log("🌩️ Third storm incoming!"),Es=!0,h.savedWinPercentage=ea,ea=1.01,ps({scene:M,world:Se,ballMaterial:ha,randomTerrainPosition:ca,createCloudIndicator:Tn,sharedCloudTexture:Ja,sky:xt,renderer:De,water:H,timeOfDay:I.timeOfDay||"day"},!1))),Va&&ie.enabled&&!jt&&!Sn&&l>=Wn&&(Sn=!0,Ms=l,ri=0,ii=l,oi=ca(),si=ca(),ye=Tn({startX:oi.x,startZ:oi.z,endX:si.x,endZ:si.z,cloudTexture:Ja,timeOfDay:I.timeOfDay||"day"}),M.add(ye),ye.userData.drizzleSound=sc()),Sn&&ye){const c=l-Ms,d=Math.min(c/ie.cloudDuration,1),{cloud:u,cloudMaterial:m,startPos:f,endPos:p,baseOpacity:g}=ye.userData,y=f.x+(p.x-f.x)*d,v=f.z+(p.z-f.z)*d;ye.position.x=y,ye.position.z=v,u.visible||(u.visible=!0),u.getWorldPosition(ml);const S=oe.position.distanceTo(ml);if(h.isActive&&h.cloudData){const b=h.cloudData.group.userData.cloud;b.getWorldPosition(fl),oe.position.distanceTo(fl)>S?(b.renderOrder=10,u.renderOrder=11):(u.renderOrder=10,b.renderOrder=11)}else u.renderOrder=10;fi(ye,oe,a),u.rotation.y=-performance.now()/7500;let T;if(c<ie.fadeInDuration){const b=Math.max(0,c/ie.fadeInDuration);T=g*b}else if(c>ie.cloudDuration-ie.fadeOutDuration){const b=(c-(ie.cloudDuration-ie.fadeOutDuration))/ie.fadeOutDuration;T=g*Math.max(0,1-b)}else T=g;m.uniforms.opacity.value=Math.max(0,T),pi(ye,a),jo(ye,T*.6),!jt&&ri<ie.dropletsPerCloud&&l-ii>=ie.dropletInterval&&c>ie.fadeInDuration&&(V0(ye.position.x,ye.position.z),ri++,ii=l),c>=ie.cloudDuration&&(ye.userData.drizzleSound&&ic(ye.userData.drizzleSound),M.remove(ye),ye.traverse(b=>{b.geometry&&b.geometry.dispose(),b.material&&b.material.dispose()}),ye=null,Sn=!1,Wn=l+ie.interval)}De.render(M,oe),requestAnimationFrame(ar)}function Z0(){const a=document.getElementById("page-loading-screen");a&&setTimeout(()=>{a.classList.add("hidden"),setTimeout(()=>{a.remove()},500)},100)}Z0();setTimeout(()=>{vr()},1500);zf();ar();
