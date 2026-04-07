import{C as so,q as Vl}from"./physicsQueue-XOQprDaT.js";import{x as Yl,a as Pr,s as jl,B as Kl,y as Lr,z as Or,A as Fr,o as Xl,C as ql,D as Zl,E as Nr,F as Hr,G as Es,H as Ql,I as Jl,J as $l,K as ec}from"./audioManager-3P7ETVi4.js";import{a0 as tc,a1 as nc,z as Gr,u as oc,a2 as sc,t as ac,O as ic,K as rc,a3 as zr,a4 as La,a5 as lc,_ as cc,P as uc,a6 as dc}from"./levelManager-BJEzDM0s.js";import{d as Q,V as H,P as Go,Q as Yt,E as Ks,T as kr,c as ao,R as ut,S as je,U as fc,aa as hc,j as ue,M as Re,ab as pc,ac as mc,ad as Oa,D as ze,J as gc,f as go,g as Le,C as Jo,L as rn,ae as ci,W as ua,af as vc,l as yc,p as Jt,ag as wc,ah as Mc,G as Mn,a as Wr,ai as _c,e as pt,aj as xc,v as Ur,x as ui,N as Br,y as Xs,h as Ps,i as We,I as In,ak as Tc,al as Fa,am as Vr,an as Sc,ao as Do,ap as Yr,aq as Dt,ar as Bt,as as Cc,a6 as Rc,_ as Ac,O as jr,at as Dc,au as bc,av as Ic,aw as Ec,ax as Pc,ay as Kr,az as Lc,aA as Oc,aB as da,z as Xr,q as zo,b as dt,aC as Fc,aD as Nc,a9 as Hc,H as Gc,aE as zc,aF as kc,aG as Wc,aH as Uc,aI as Bc,aJ as Vc,aK as qr,aL as Yc,aM as ki,aN as Wi,aO as Ui,aP as Bi,aQ as Vi,F as jc,aR as Kc,u as Xc,a0 as qc,A as _n,aS as Zc,o as bo,a8 as Qc,a7 as Jc,aT as $c,a4 as Yi,aU as eu,w as di,aV as tu,aW as fa,aX as nu,aY as ha,k as ou}from"./three-8-mrVIKw.js";import{b as Rt}from"./physics-CKC5f6tm.js";function bt(t,e=.35,n=.148,s=.4){const o=t.x*e,i=t.y*e,a=t.z*e+n,r=.299*o+.587*i+.114*a;return new H(o+(r-o)*s,i+(r-i)*s,a+(r-a)*s)}function mt(t,e=.35,n=.148,s=.4){const o=t.r*e,i=t.g*e,a=t.b*e+n,r=.299*o+.587*i+.114*a;return new Q(o+(r-o)*s,i+(r-i)*s,a+(r-a)*s)}function It(t,e=.75,n=.26){return new H(t.x*e+n,t.y*e,t.z*e)}function gt(t,e=.75,n=.16){return new Q(t.r*e+n,t.g*e,t.b*e)}const fi=new Q(16754022),hi=new Q(43212),pi=new Q(6740463),mi=new Q(6477),gi=new Q(3844815),vi=new Q(10541296),yi=new Q(8900331),wi=new Q(5618687),Mi=new Q(1731253),_i=new Q(14544639),xi=new H(.145,.161,.243),Ti=new H(.5412,.3098,.2235),Si=new H(.7922,.4784,.2471),Ci=new H(.906,.678,.388),Ri=new H(.945,.882,.659),Ai=new H(.871,.525,.318),Di=new H(.612,.239,.157),bi=new H(.3059,.1176,.2),Ii=new H(.1725,.0078,.2078),Ei=new H(.0824,0,.1569),su=mt(fi),au=mt(hi,.25,.06),iu=mt(pi,.25,.06),ru=mt(mi,.05,.02),lu=mt(gi,.2,.22),cu=mt(vi,.01,.094),uu=mt(yi,.12,.06),du=mt(wi,.515,.16),fu=mt(Mi,.51,.14),hu=mt(_i,.515,.15),pu=bt(Ei),mu=bt(Ii),gu=bt(bi),vu=bt(Di),yu=bt(Ai),wu=bt(Ri),Mu=bt(Ci),_u=bt(Si),xu=bt(Ti),Tu=bt(xi),Su=gt(fi),Cu=gt(hi,.75,.26),Ru=gt(pi),Au=gt(mi,.99,.02),Du=gt(gi),bu=gt(vi,.62,.19),Iu=gt(yi),Eu=gt(wi),Pu=gt(Mi),Lu=gt(_i),Ou=It(Ei),Fu=It(Ii),Nu=It(bi),Hu=It(Di),Gu=It(Ai),zu=It(Ri),ku=It(Ci),Wu=It(Si),Uu=It(Ti),Bu=It(xi),Pi=new Q(1,1,1),Vu=gt(Pi,.85,.18),Yu=mt(Pi,.4,.15),Zr=.4,Qr=.45,Jr=.55,ju=1-Zr,Ku=1-Qr,Xu=1-Jr,xt={DAY_WATER_COLOR:hi,NIGHT_WATER_COLOR:au,DUSK_WATER_COLOR:Cu,DAY_SHALLOW_COLOR:pi,NIGHT_SHALLOW_COLOR:iu,DUSK_SHALLOW_COLOR:Ru,DAY_FOG_COLOR:vi,NIGHT_FOG_COLOR:cu,DUSK_FOG_COLOR:bu,DAY_DEEP_COLOR:mi,NIGHT_DEEP_COLOR:ru,DUSK_DEEP_COLOR:Au,DAY_HEMISPHERE_SHALLOW:gi,NIGHT_HEMISPHERE_SHALLOW:lu,DUSK_HEMISPHERE_SHALLOW:Du,DAY_FILL_COLOR:fi,NIGHT_FILL_COLOR:su,DUSK_FILL_COLOR:Su,DAY_TERRAIN_OCEAN_DEEP:Ei,NIGHT_TERRAIN_OCEAN_DEEP:pu,DUSK_TERRAIN_OCEAN_DEEP:Ou,DAY_TERRAIN_OCEAN_MID:Ii,NIGHT_TERRAIN_OCEAN_MID:mu,DUSK_TERRAIN_OCEAN_MID:Fu,DAY_TERRAIN_DEEP:bi,NIGHT_TERRAIN_DEEP:gu,DUSK_TERRAIN_DEEP:Nu,DAY_TERRAIN_SHALLOW:Di,NIGHT_TERRAIN_SHALLOW:vu,DUSK_TERRAIN_SHALLOW:Hu,DAY_TERRAIN_LOW:Ai,NIGHT_TERRAIN_LOW:yu,DUSK_TERRAIN_LOW:Gu,DAY_TERRAIN_MID_LOW:Ri,NIGHT_TERRAIN_MID_LOW:wu,DUSK_TERRAIN_MID_LOW:zu,DAY_TERRAIN_MID:Ci,NIGHT_TERRAIN_MID:Mu,DUSK_TERRAIN_MID:ku,DAY_TERRAIN_MID_HIGH:Si,NIGHT_TERRAIN_MID_HIGH:_u,DUSK_TERRAIN_MID_HIGH:Wu,DAY_TERRAIN_HIGH:Ti,NIGHT_TERRAIN_HIGH:xu,DUSK_TERRAIN_HIGH:Uu,DAY_TERRAIN_PEAK:xi,NIGHT_TERRAIN_PEAK:Tu,DUSK_TERRAIN_PEAK:Bu,DAY_SKY_BG:yi,NIGHT_SKY_BG:uu,DUSK_SKY_BG:Iu,DAY_HYDRO_WATER:wi,NIGHT_HYDRO_WATER:du,DUSK_HYDRO_WATER:Eu,DAY_HYDRO_DEEP:Mi,NIGHT_HYDRO_DEEP:fu,DUSK_HYDRO_DEEP:Pu,DAY_HYDRO_FOAM:_i,NIGHT_HYDRO_FOAM:hu,DUSK_HYDRO_FOAM:Lu,DAY_RIPPLE_TINT:Pi,NIGHT_RIPPLE_TINT:Yu,DUSK_RIPPLE_TINT:Vu};function st(t,e,n,s,o){o>.5?t.lerpColors(n,s,(o-.5)*2):t.lerpColors(e,n,o*2)}function Tt(t,e,n,s,o){o>.5?t.lerpVectors(n,s,(o-.5)*2):t.lerpVectors(e,n,o*2)}const ji=new Q;function zh(t,e,n,s=!1,o=0){const{waterMaterial:i,waterHemisphereMaterial:a,terrainMaterial:r,fillLight:l,hydroMaterial:c,rippleSystem:d}=e,{DAY_WATER_COLOR:f,NIGHT_WATER_COLOR:u,DUSK_WATER_COLOR:p,DAY_SHALLOW_COLOR:h,NIGHT_SHALLOW_COLOR:v,DUSK_SHALLOW_COLOR:y,DAY_FOG_COLOR:w,NIGHT_FOG_COLOR:M,DUSK_FOG_COLOR:x,DAY_DEEP_COLOR:m,NIGHT_DEEP_COLOR:S,DUSK_DEEP_COLOR:b,DAY_HEMISPHERE_SHALLOW:D,NIGHT_HEMISPHERE_SHALLOW:R,DUSK_HEMISPHERE_SHALLOW:T,DAY_FILL_COLOR:C,NIGHT_FILL_COLOR:I,DUSK_FILL_COLOR:X,DAY_TERRAIN_OCEAN_DEEP:$,NIGHT_TERRAIN_OCEAN_DEEP:Z,DUSK_TERRAIN_OCEAN_DEEP:W,DAY_TERRAIN_OCEAN_MID:ne,NIGHT_TERRAIN_OCEAN_MID:Y,DUSK_TERRAIN_OCEAN_MID:F,DAY_TERRAIN_DEEP:ie,NIGHT_TERRAIN_DEEP:ce,DUSK_TERRAIN_DEEP:J,DAY_TERRAIN_SHALLOW:we,NIGHT_TERRAIN_SHALLOW:ye,DUSK_TERRAIN_SHALLOW:nt,DAY_TERRAIN_LOW:vt,NIGHT_TERRAIN_LOW:yt,DUSK_TERRAIN_LOW:be,DAY_TERRAIN_MID_LOW:pe,NIGHT_TERRAIN_MID_LOW:Fn,DUSK_TERRAIN_MID_LOW:ke,DAY_TERRAIN_MID:yo,NIGHT_TERRAIN_MID:Ke,DUSK_TERRAIN_MID:jt,DAY_TERRAIN_MID_HIGH:Et,NIGHT_TERRAIN_MID_HIGH:cn,DUSK_TERRAIN_MID_HIGH:os,DAY_TERRAIN_HIGH:ot,NIGHT_TERRAIN_HIGH:ss,DUSK_TERRAIN_HIGH:wo,DAY_TERRAIN_PEAK:na,NIGHT_TERRAIN_PEAK:as,DUSK_TERRAIN_PEAK:oa,DAY_HYDRO_WATER:sa,NIGHT_HYDRO_WATER:Mo,DUSK_HYDRO_WATER:_o,DAY_HYDRO_DEEP:aa,NIGHT_HYDRO_DEEP:ia,DUSK_HYDRO_DEEP:wt,DAY_HYDRO_FOAM:Xe,NIGHT_HYDRO_FOAM:Kt,DUSK_HYDRO_FOAM:ra,DAY_RIPPLE_TINT:xo,NIGHT_RIPPLE_TINT:Nn,DUSK_RIPPLE_TINT:un}=n;if(l&&(st(l.color,I,X,C,t),l.intensity=.15+t*.25),i&&(st(i.uniforms.uWaterColor.value,u,p,f,t),st(i.uniforms.uShallowColor.value,v,y,h,t),st(i.uniforms.fogColor.value,M,x,w,t),i.uniforms.uReflectionTint&&i.uniforms.uReflectionTint.value.setRGB(Zr+ju*t,Qr+Ku*t,Jr+Xu*t)),a&&!s&&(st(a.uniforms.uDeepColor.value,S,b,m,t),st(a.uniforms.uShallowColor.value,R,T,D,t),st(a.uniforms.fogColor.value,M,x,w,t)),r){const ge=r.uniforms;Tt(ge.oceanDeepColor.value,Z,W,$,t),Tt(ge.oceanMidColor.value,Y,F,ne,t),Tt(ge.deepColor.value,ce,J,ie,t),Tt(ge.shallowColor.value,ye,nt,we,t),Tt(ge.lowColor.value,yt,be,vt,t),Tt(ge.midLowColor.value,Fn,ke,pe,t),Tt(ge.midColor.value,Ke,jt,yo,t),Tt(ge.midHighColor.value,cn,os,Et,t),Tt(ge.highColor.value,ss,wo,ot,t),Tt(ge.peakColor.value,as,oa,na,t),o>0&&(ge.oceanDeepColor.value.lerp(Z,o),ge.oceanMidColor.value.lerp(Y,o),ge.deepColor.value.lerp(ce,o),ge.shallowColor.value.lerp(ye,o),ge.lowColor.value.lerp(yt,o),ge.midLowColor.value.lerp(Fn,o),ge.midColor.value.lerp(Ke,o),ge.midHighColor.value.lerp(cn,o),ge.highColor.value.lerp(ss,o),ge.peakColor.value.lerp(as,o))}c&&(st(c.uniforms.uWaterColor.value,Mo,_o,sa,t),st(c.uniforms.uWaterColorDeep.value,ia,wt,aa,t),st(c.uniforms.uFoamColor.value,Kt,ra,Xe,t)),d&&(st(ji,Nn,un,xo,t),d.setTimeTint(ji))}function pa(t,e,n,s,o){const i=t.material.uniforms;i.turbidity.value=n.turbidity+(s.turbidity-n.turbidity)*o,i.rayleigh.value=n.rayleigh+(s.rayleigh-n.rayleigh)*o,i.mieCoefficient.value=n.mieCoefficient+(s.mieCoefficient-n.mieCoefficient)*o,e.toneMappingExposure=n.exposure+(s.exposure-n.exposure)*o}const $r=2;let us=null;function qu(){if(us)return us;const t={minFilter:rn,magFilter:rn,format:yc,type:vc};return us={heightmap:new ua(512,512,t),wetness1:new ua(512,512,t),wetness2:new ua(512,512,t)},us}let ma=null,ga=null,va=null;const Ki=Object.create(null);let Hn=null,ds=null,Xt=null;function Zu(){if(Xt)return Xt;const t=256,e=document.createElement("canvas");e.width=t,e.height=t;const n=e.getContext("2d"),s=n.createImageData(t,t);for(let o=0;o<s.data.length;o+=4)s.data[o]=Math.random()*255,s.data[o+1]=Math.random()*255,s.data[o+2]=Math.random()*255,s.data[o+3]=255;return n.putImageData(s,0,0),Xt=new Jo(e),Xt.wrapS=ut,Xt.wrapT=ut,Xt.magFilter=rn,Xt.minFilter=ci,Xt}function kh(t={}){const{segments:e=32,normalMapPath:n="normal-maps/sand-normal.jpg",normalMapScale:s=2,physicsWorld:o,physicsConfig:i={ballGround:{friction:.0022,restitution:.43}},shape:a={},waterLevel:r=-2.87}=t,l=a.size||18,c={scaleX:a.scaleX||1,scaleY:a.scaleY||1,tilt:a.tilt||{angle:0,amount:0},bay:a.bay||{angle:0,depth:0,width:0},irregularity:a.irregularity||1,distortion:a.distortion||{frequency:.5,amplitude:.3,randomness:.2},turbulence:a.turbulence||null,islandRadius:a.islandRadius||l*.365,terracing:a.terracing||null,caldera:a.caldera||null,volcanoes:a.volcanoes||null,spiral:a.spiral||null},d=c.islandRadius,f=d+d*0,u=d+d*.26,p=d+d*.75,h=5.8,v=-4.6,y=512,w=new Go(l,l,e,e),M=w.attributes.position;function x(_,E){if(_<2){if(_<.01)return 0;const N=_/2,V=N*N*(3-2*N),U=Math.sin(E*3+_*.5)*.4,B=Math.sin(E*5-_*.3)*.25,K=Math.sin(E*7+_*.7)*.2;return(U+B+K)*c.irregularity*V}const O=Math.sin(E*3+_*.5)*.4,G=Math.sin(E*5-_*.3)*.25,q=Math.sin(E*7+_*.7)*.2;return(O+G+q)*c.irregularity}function m(_,E,P){const O=_/c.scaleX,G=E/c.scaleY;let q=Math.sqrt(O*O+G*G);if(c.bay.depth>0){const N=c.bay.angle,V=c.bay.width;let U=Math.abs(P-N);if(U>Math.PI&&(U=2*Math.PI-U),U<V){const B=Math.cos(U/V*Math.PI/2);q+=c.bay.depth*B}}return q}function S(_,E){if(c.tilt.amount===0)return 0;const P=1.5;if(_<P){if(_<.01)return 0;const q=_/P,N=q*q*(3-2*q),V=c.tilt.angle;return Math.cos(E-V)*c.tilt.amount*N}const O=c.tilt.angle;return Math.cos(E-O)*c.tilt.amount}function b(_){if(!c.terracing)return _;const{levels:E=3,sharpness:P=.5,heightRange:O=[0,2.5]}=c.terracing,[G,q]=O;if(_<G||_>q)return _;const N=(_-G)/(q-G),V=1/E,B=Math.floor(N/V)*V,K=(N-B)/V;let j;if(P>=.99)j=B+V*.5;else{const A=1-P,L=.5-A*.5,oe=.5+A*.5;let le;if(K<L)le=0;else if(K>oe)le=1;else{const fe=(K-L)/(oe-L);le=fe*fe*(3-2*fe)}j=B+V*le}return G+j*(q-G)}function D(_,E,P){if(!c.caldera)return 0;const{radius:O=.4,depth:G=2,rimHeight:q=.5,rimWidth:N=.15,breach:V=null}=c.caldera,U=d*O,B=U+d*N;let K=1;if(V&&V.width>0){let A=Math.abs(E-V.angle);A>Math.PI&&(A=2*Math.PI-A),A<V.width&&(K=A/V.width,K=K*K)}let j=0;if(_<U){const A=_/U,L=Math.cos(A*Math.PI*.5);j=-G*L}else if(_<B){const A=(_-U)/(B-U),L=Math.sin(A*Math.PI);j=q*L*K}return j}function R(_,E){if(!c.volcanoes||c.volcanoes.length===0)return 0;let P=0;for(const O of c.volcanoes){const{x:G=0,y:q=0,height:N=3,baseRadius:V=3,slope:U=1,crater:B=null}=O,K=_-G,j=E-q,A=Math.sqrt(K*K+j*j);if(A>=V)continue;const L=1-A/V,oe=Math.pow(L,1/U);let le=N*oe;if(B&&B.radius>0&&A<B.radius){const fe=A/B.radius,qe=B.flatRadius||.4,Mt=fe<qe?1:Math.cos((fe-qe)/(1-qe)*Math.PI*.5),dn=B.depth||N*.4;le=N*Math.pow(1-B.radius/V,1/U)-dn*Mt}P=Math.max(P,le)}return P}function T(_,E){if(!c.turbulence)return 0;const{strength:P=3,scale:O=.3,octaves:G=3}=c.turbulence;let q=0,N=P,V=O,U=0;for(let B=0;B<G;B++){const K=Math.sin(_*V+B*10)*Math.cos(E*V+B*5),j=Math.sin((_+E)*V*1.3+B*7),A=Math.cos((_-E)*V*.7+B*3),L=(K+j*.5+A*.3)*N;q+=L,U+=N,N*=.5,V*=2}return q/U*P}function C(_,E){if(!c.spiral)return 0;const{turns:P=2,heightRange:O=3,tightness:G=1,direction:q=1,centerHeight:N=0}=c.spiral,V=1.5;if(_<.01)return N;const U=_/d*P*Math.PI*2*G,B=E*q+U,K=Math.sin(B)*O*.5,j=I(0,V,_),A=d*.7,L=d*1.2,oe=1-I(A,L,_),fe=1-I(0,2,_);return K*j*oe+N*fe}function I(_,E,P){const O=Math.max(0,Math.min(1,(P-_)/(E-_)));return O*O*(3-2*O)}const{frequency:X,amplitude:$,randomness:Z}=c.distortion;for(let _=0;_<M.count;_++){const E=M.getX(_),P=M.getY(_),O=M.getZ(_),G=Math.sqrt(E*E+P*P),q=Math.atan2(P,E),N=m(E,P,q),V=x(G,q)*1.5,U=d+V,B=f+V*.8,K=u+V*.6,j=p+V*.4,A=.51+Math.sin(E*X)*Math.cos(P*X*1.04)*$+Math.random()*Z;let L;if(N<U)L=A;else if(N<B){const Ie=(N-U)/(B-U),_t=Ie*Ie*(3-2*Ie);L=A*(1-_t*.4)}else if(N<K){const Ie=(N-B)/(K-B),_t=Ie*Ie*(3-2*Ie);L=A*.6-_t*3.5}else if(N<j){const Ie=A*.6-3.5,_t=(N-K)/(j-K),ca=_t*_t*(3-2*_t);L=Ie-ca*(63+Ie)}else L=-63;N<U&&(L+=D(G,q)),L+=R(E,P),L=b(L),N<K&&(L+=C(G,q)),L+=S(G,q),N<K&&(L+=T(E,P));const oe=l/2,le=Math.abs(E)/oe,fe=Math.abs(P)/oe,qe=Math.max(le,fe),Mt=.85,dn=1;if(qe>Mt&&L>r-2){const Ie=(qe-Mt)/(dn-Mt),_t=Ie*Ie*(3-2*Ie),ca=r-2;L=Math.min(L,L*(1-_t)+ca*_t)}M.setZ(_,O+L)}M.needsUpdate=!0,w.computeVertexNormals();function W(_){const P=_.attributes.position,O=_.attributes.uv,G=_.index,q=e+1,N=[],V=[],U=[];for(let A=0;A<P.count;A++)N.push(P.getX(A),P.getY(A),P.getZ(A)),V.push(O.getX(A),O.getY(A));for(let A=0;A<G.count;A++)U.push(G.getX(A));const B=P.count;for(let A=0;A<P.count;A++)N.push(P.getX(A),P.getY(A),-63),V.push(O.getX(A),O.getY(A));function K(A,L){return A*q+L}for(let A=0;A<e;A++){const L=K(0,A),oe=K(0,A+1),le=L+B,fe=oe+B;U.push(L,oe,le),U.push(oe,fe,le)}for(let A=0;A<e;A++){const L=K(e,A),oe=K(e,A+1),le=L+B,fe=oe+B;U.push(L,le,oe),U.push(oe,le,fe)}for(let A=0;A<e;A++){const L=K(A,0),oe=K(A+1,0),le=L+B,fe=oe+B;U.push(L,le,oe),U.push(oe,le,fe)}for(let A=0;A<e;A++){const L=K(A,e),oe=K(A+1,e),le=L+B,fe=oe+B;U.push(L,oe,le),U.push(oe,fe,le)}const j=new go;return j.setAttribute("position",new Le(new Float32Array(N),3)),j.setAttribute("uv",new Le(new Float32Array(V),2)),j.setIndex(U),j.computeVertexNormals(),j}const ne=W(w);w.dispose();const Y=ne,F=Y.attributes.position;function ie(_,E){const P=Math.sqrt(_*_+E*E),O=Math.atan2(E,_),G=m(_,E,O),q=x(P,O)*1.5,N=d+q,V=f+q*.8,U=u+q*.6,B=p+q*.4,K=.51+Math.sin(_*X)*Math.cos(E*X*1.04)*$;let j;if(G<N)j=K;else if(G<V){const A=(G-N)/(V-N),L=A*A*(3-2*A);j=K*(1-L*.4)}else if(G<U){const A=(G-V)/(U-V),L=A*A*(3-2*A);j=K*.6-L*3.5}else if(G<B){const A=K*.6-3.5,L=(G-U)/(B-U),oe=L*L*(3-2*L);j=A-oe*(63+A)}else j=-63;return G<N&&(j+=D(P,O)),j+=R(_,E),j=b(j),j+=C(P,O),j+=S(P,O),G<U&&(j+=T(_,E)),j}function ce(){const _=(Math.random()-.5)*(l*.8),E=(Math.random()-.5)*(l*.8);return{x:_,z:E}}const J=e+1,we=J*J,ye=e/l;function nt(_,E){const P=(_+l/2)*e/l,O=(E+l/2)*e/l,G=Math.max(0,Math.min(e-1,Math.floor(P))),q=G+1,N=Math.max(0,Math.min(e-1,Math.floor(O))),V=N+1,U=P-G,B=O-N,K=F.getZ(N*J+G),j=F.getZ(N*J+q),A=F.getZ(V*J+G),L=F.getZ(V*J+q);return K*(1-U)*(1-B)+j*U*(1-B)+A*(1-U)*B+L*U*B}function vt(){const _=new Float32Array(F.count*3);for(let O=0;O<F.count;O++){const G=F.getX(O),q=F.getY(O);let N=F.getZ(O);if(O<we){const U=Math.floor(O/J),B=O%J;let K=N,j=1,A=0;if(U>0){const L=F.getZ(O-J);K+=L,j++,A=Math.max(A,Math.abs(L-N))}if(U<e){const L=F.getZ(O+J);K+=L,j++,A=Math.max(A,Math.abs(L-N))}if(B>0){const L=F.getZ(O-1);K+=L,j++,A=Math.max(A,Math.abs(L-N))}if(B<e){const L=F.getZ(O+1);K+=L,j++,A=Math.max(A,Math.abs(L-N))}A<.4&&(N=K/j)}const V=O*3;_[V]=G,_[V+1]=q,_[V+2]=N}const E=Y.index,P=new Uint32Array(E.array);return{vertices:_,indices:P}}const yt=vt(),be=new Ks(-Math.PI/2,0,0),pe=new Yt().setFromEuler(be),Fn=Rt.RigidBodyDesc.fixed().setRotation({x:pe.x,y:pe.y,z:pe.z,w:pe.w});let ke=o.createRigidBody(Fn);const yo=Rt.ColliderDesc.trimesh(yt.vertices,yt.indices).setFriction(i.ballGround.friction).setRestitution(i.ballGround.restitution).setCollisionGroups(so.terrain);let Ke=o.createCollider(yo,ke);function jt(){Ke&&o.removeCollider(Ke,!0),ke&&o.removeRigidBody(ke);const _=vt(),E=Rt.RigidBodyDesc.fixed().setRotation({x:pe.x,y:pe.y,z:pe.z,w:pe.w});ke=o.createRigidBody(E);const P=Rt.ColliderDesc.trimesh(_.vertices,_.indices).setFriction(i.ballGround.friction).setRestitution(i.ballGround.restitution).setCollisionGroups(so.terrain);Ke=o.createCollider(P,ke)}let Et=null,cn=0;const os=100;let ot=0;const ss=4;let wo=0;const na=8;function as(_,E,P=$r){const O=P*P,G=Math.ceil(P*ye),q=Math.round((_.x+l/2)*ye),N=Math.round((l/2-_.y)*ye),V=Math.max(0,q-G),U=Math.min(e,q+G),B=Math.max(0,N-G),K=Math.min(e,N+G);for(let A=B;A<=K;A++)for(let L=V;L<=U;L++){const oe=A*J+L,le=F.getX(oe)-_.x,fe=F.getY(oe)-_.y,qe=le*le+fe*fe;if(qe>=O)continue;const Mt=qe/O,dn=(1-Mt)*(1-Mt),Ie=F.getZ(oe)+E*dn*.02;F.setZ(oe,Math.max(v,Math.min(h,Ie)))}F.needsUpdate=!0,wo++,wo>=na&&(wo=0,Y.computeBoundingBox(),Y.computeBoundingSphere()),ot++,ot>=ss&&(ot=0,Y.computeVertexNormals());const j=performance.now();Et&&j-cn>os&&(is(Et),cn=j)}function oa(_,E,P){const O=E*E,G=Math.ceil(E*ye),q=Math.round((_.x+l/2)*ye),N=Math.round((l/2-_.y)*ye),V=Math.max(0,q-G),U=Math.min(e,q+G),B=Math.max(0,N-G),K=Math.min(e,N+G);for(let j=B;j<=K;j++)for(let A=V;A<=U;A++){const L=j*J+A,oe=F.getX(L)-_.x,le=F.getY(L)-_.y,fe=oe*oe+le*le;if(fe>=O)continue;const qe=fe/O,Mt=(1-qe)*(1-qe),dn=F.getZ(L)+P*Mt;F.setZ(L,Math.max(v,Math.min(h,dn)))}F.needsUpdate=!0,Y.computeVertexNormals(),Y.computeBoundingBox(),Y.computeBoundingSphere(),Et&&is(Et)}const sa=Zu(),Mo=40,_o=new kr;Hn||(Hn=_o.load("lava-textures/cool-lava-diffuse.jpg"),Hn.colorSpace=ao,Hn.wrapS=ut,Hn.wrapT=ut,ds=_o.load("lava-textures/cool-lava-normal.jpg"),ds.wrapS=ut,ds.wrapT=ut);const aa=Hn,ia=ds;let wt=Ki[n];wt||(wt=_o.load(n),wt.wrapS=ut,wt.wrapT=ut,Ki[n]=wt),wt.repeat.set(s,s);let Xe;if(ma){Xe=ma;const _=Xe.uniforms;_.normalMap.value=wt,_.normalMapRepeat.value=s,_.uWaterLevel.value=r,_.uFogEnd.value=r,_.uFogStart.value=r-16,_.uWinGreenIntensity.value=0,_.uWinGreenDetailIntensity.value=0,_.uUseWetnessMap.value=!1,_.uTerrainMeshSize.value=l,_.uCoolLavaSpotCount.value=0,_.uIsNightTime.value=!1}else Xe=new je({uniforms:fc.merge([hc.lights,{normalMap:{value:wt},normalMapRepeat:{value:s},rockGrainMap:{value:sa},rockGrainRepeat:{value:8},oceanDeepColor:{value:xt.DAY_TERRAIN_OCEAN_DEEP.clone()},oceanMidColor:{value:xt.DAY_TERRAIN_OCEAN_MID.clone()},deepColor:{value:xt.DAY_TERRAIN_DEEP.clone()},shallowColor:{value:xt.DAY_TERRAIN_SHALLOW.clone()},lowColor:{value:xt.DAY_TERRAIN_LOW.clone()},midLowColor:{value:xt.DAY_TERRAIN_MID_LOW.clone()},midColor:{value:xt.DAY_TERRAIN_MID.clone()},midHighColor:{value:xt.DAY_TERRAIN_MID_HIGH.clone()},highColor:{value:xt.DAY_TERRAIN_HIGH.clone()},peakColor:{value:xt.DAY_TERRAIN_PEAK.clone()},uFogColor:{value:new Q(943004)},uFogStart:{value:-18.87},uFogEnd:{value:-2.87},uTime:{value:0},uWaterLevel:{value:r},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uCausticsDepth:{value:4},uCausticsEnabled:{value:!0},uCausticsIntensity:{value:.15},uCausticsFadeStart:{value:.3},uCausticsBreath:{value:1},uCausticsAngleCos:{value:1},uCausticsAngleSin:{value:0},uCausticsRock1:{value:0},uCausticsRock2:{value:Math.sin(1.5)},uCausticsThreshold:{value:.6},uWaterMeshOffset:{value:new ue(0,0)},uWaterMeshPosition:{value:new ue(0,0)},uWaterCurvature:{value:2e-5},uWetnessMap:{value:null},uUseWetnessMap:{value:!1},uTerrainMeshSize:{value:l},uWinGreenIntensity:{value:0},uWinGreenColor:{value:new H(.075,.302,.082)},uWinGreenColorNight:{value:new H(.05,.15,.08)},uWinGreenDetailIntensity:{value:0},uWinGreenDetailColor:{value:new H(.035,.16,.045)},uWinGreenDetailColorNight:{value:new H(.025,.09,.04)},uIsNightTime:{value:!1},uCoolLavaTex:{value:aa},uCoolLavaNorm:{value:ia},uCoolLavaSpotCount:{value:0}}]),lights:!0,clipping:!0,vertexShader:`
      #include <common>
      #include <clipping_planes_pars_vertex>
      #include <shadowmap_pars_vertex>

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying vec3 vTangent;
      varying vec3 vBitangent;

      void main() {
        vPosition = position;
        vec3 transformedNormal = normalize(normalMatrix * normal);
        vNormal = transformedNormal;
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

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

        #include <clipping_planes_vertex>
        #include <shadowmap_vertex>
      }
    `,fragmentShader:`
      #include <common>
      #include <packing>
      #include <clipping_planes_pars_fragment>
      #include <shadowmap_pars_fragment>

      uniform sampler2D normalMap;
      uniform float normalMapRepeat;
      uniform sampler2D rockGrainMap;
      uniform float rockGrainRepeat;
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
      // Caustics animation pre-computed CPU-side each frame
      uniform float uCausticsBreath;
      uniform float uCausticsAngleCos;
      uniform float uCausticsAngleSin;
      uniform float uCausticsRock1;
      uniform float uCausticsRock2;
      uniform float uCausticsThreshold;
      uniform float uCausticsFadeStart;
      uniform vec2 uWaterMeshOffset;      // For wave calculations
      uniform vec2 uWaterMeshPosition;    // For curvature calculations
      uniform float uWaterCurvature;
      // Wetness map uniforms
      uniform sampler2D uWetnessMap;
      uniform bool uUseWetnessMap;
      uniform float uTerrainMeshSize;
      // Win effect uniforms
      uniform float uWinGreenIntensity;
      uniform vec3 uWinGreenColor;
      uniform vec3 uWinGreenColorNight;
      uniform float uWinGreenDetailIntensity;
      uniform vec3 uWinGreenDetailColor;
      uniform vec3 uWinGreenDetailColorNight;
      uniform bool uIsNightTime;
      uniform sampler2D uCoolLavaTex;
      uniform sampler2D uCoolLavaNorm;
      uniform vec4 uCoolLavaSpots[40]; // xy=worldXZ, z=radius
      uniform int uCoolLavaSpotCount;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vWorldNormal;
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
        // Breathing effect and rotation pre-computed CPU-side — same value for every fragment this frame
        mat2 rotation = mat2(uCausticsAngleCos, -uCausticsAngleSin, uCausticsAngleSin, uCausticsAngleCos);

        // Apply breathing scale and rotation
        vec2 uv = (worldXZ * rotation) * (1.5 * uCausticsBreath);

        // First layer - base noise for caustic lines with rocking motion
        vec2 drift1 = vec2(uCausticsRock1 * 0.4, uCausticsRock1 * 0.3);
        float noise1 = snoise(uv * 2.8 + drift1);
        noise1 = noise1 * 0.5 + 0.5;

        // Create thin lines using tight smoothstep and step
        float lines1 = smoothstep(0.08, 0.001, noise1);
        lines1 = step(0.5, lines1);

        // Second layer - wave-like noise with perpendicular rocking
        vec2 drift2 = vec2(uCausticsRock2 * -0.25, uCausticsRock2 * 0.4);
        float noise2 = snoise(uv * 0.8 + drift2);
        noise2 = noise2 * 0.45 + 0.5;

        // Threshold oscillates slowly with breathing rhythm (pre-computed)
        float threshold = uCausticsThreshold;

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
        #include <clipping_planes_fragment>

        // Sample the normal map with tiling/repeat
        vec3 normalMapSample = texture2D(normalMap, vUv * normalMapRepeat).xyz * 2.0 - 1.0;

        // Transform normal from tangent space to world space
        mat3 tbn = mat3(vTangent, vBitangent, vNormal);
        vec3 perturbedNormal = normalize(tbn * normalMapSample);

        // Height-based color grading - sunset/warm palette
        float height = vPosition.z;
        // All colors are now uniforms for day/night transitions

        // Rock striations - perturb height for natural geological variation
        // Skip expensive noise for deep ocean floor where it's not visible
        vec2 rockPos = vPosition.xy;
        float colorHeight = height;
        if (height > -10.0) {
          float rockFold = smoothNoise(rockPos * 0.6);                       // Large geological folding
          float rockLayer = smoothNoise(rockPos * 2.3 + vec2(50.0, 30.0));   // Medium rock layering
          float fineStriations = smoothNoise(vec2(                           // Fine striations
            height * 5.0 + rockFold * 3.0,
            dot(rockPos, vec2(0.7, 0.3)) * 0.8
          ));
          colorHeight += rockFold * 0.55 + rockLayer * 0.22 + fineStriations * 0.15;
        }

        vec3 color;
        float alpha = 1.0;

        if (colorHeight < -16.0) {
            color = oceanDeepColor; alpha = smoothstep(-30.0, -19.0, height);
        }
        else if (colorHeight < -10.0) {
            color = mix(oceanDeepColor, oceanMidColor, smoothstep(-12.0, -10.0, colorHeight));
        }
        else if (colorHeight < -4.0) {
            color = mix(oceanMidColor, deepColor, (colorHeight + 10.0) / 6.0);
        }
        else if (colorHeight < -3.0) {
            color = mix(deepColor, shallowColor, (colorHeight + 4.0) / 1.0);
        }
        else if (colorHeight < -1.0) {
            color = mix(shallowColor, lowColor, (colorHeight + 3.0) / 2.0);
        }
        else if (colorHeight < 0.5) {
            color = mix(lowColor, midLowColor, (colorHeight + 1.0) / 1.5);
        }
        else if (colorHeight < 1.5) {
            color = mix(midLowColor, midColor, (colorHeight - 0.5) / 1.0);
        }
        else if (colorHeight < 2.5) {
            color = mix(midColor, midHighColor, (colorHeight - 1.5) / 1.0);
        }
        else if (colorHeight < 3.5) {
            color = mix(midHighColor, highColor, (colorHeight - 2.5) / 1.0);
        }
        else {
            color = mix(highColor, peakColor, min((colorHeight - 3.5) / 2.0, 1.0));
        }

        // Rock grain texture - applied across full terrain depth
        vec2 grainUV = rockPos * rockGrainRepeat / ${l.toFixed(1)};
        vec3 grainSample = texture2D(rockGrainMap, grainUV).rgb;
        float fineGrain = grainSample.r * 0.08 - 0.03;
        float darkSpots = step(0.90, grainSample.g) * 0.10;
        float lightSpots = step(0.90, grainSample.b) * 0.08;
        vec3 colorShift = (grainSample - 0.5) * 0.04;
        color = color * (1.14 + fineGrain - darkSpots + lightSpots) + colorShift;

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
            vec2 wetnessUV = (vPosition.xy / uTerrainMeshSize) + 0.5;

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
          // Apply green to playable terrain heights - extends below green zone
          float greenMask = smoothstep(-1.8, 0.0, height) * (1.0 - smoothstep(2.0, 3.5, height));

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
            mottledPattern = mottledPattern * mottledPattern * 1.5;

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

        // Win Effect - Detailed Dark Green Layer (finer, denser vegetation look)
        if(uWinGreenDetailIntensity > 0.01) {
          float detailGreenMask = smoothstep(-1.5, 0.1, height) * (1.0 - smoothstep(1.8, 3.2, height));

          if(detailGreenMask > 0.01) {
            vec2 detailCoord = vWorldPosition.xz;

            // Multi-scale noise — lower large-patch frequency than mottled layer for distinct spread
            float detail1 = smoothNoise(detailCoord * 0.42 + vec2(47.0, 23.0)) * 0.6;
            float detail2 = smoothNoise(detailCoord * 2.1 + vec2(83.0, 61.0)) * 0.3;
            float detail3 = smoothNoise(detailCoord * 5.0 + vec2(127.0, 97.0)) * 0.1;

            float detailPattern = detail1 + detail2 + detail3;

            // Same contrast curve as light green layer
            detailPattern = detailPattern * detailPattern * 1.5;
            detailPattern = smoothstep(0.23, 0.76, detailPattern);

            // Slope-based bias: more detail green in flatter areas (where moss/grass would grow)
            float slopeDetail = 1.0 - smoothstep(0.6, 0.95, 1.0 - dot(normalize(vWorldNormal), vec3(0.0, 1.0, 0.0)));
            detailPattern *= slopeDetail;

            vec3 detailGreenColor = uIsNightTime ? uWinGreenDetailColorNight : uWinGreenDetailColor;

            // Slight color variation within the detail layer
            detailGreenColor *= (0.8 + detailPattern * 0.2);

            float detailStrength = uWinGreenDetailIntensity * detailGreenMask * detailPattern;
            color = mix(color, detailGreenColor, detailStrength);
          }
        }

        // Cool lava spots — blend hardened lava texture at each spot using world-space UVs
        if (uCoolLavaSpotCount > 0) {
          vec2 texCoord = vWorldPosition.xz * 0.55; // world-space tiling, shared across all spots
          vec3 nSample = texture2D(uCoolLavaNorm, texCoord).rgb * 2.0 - 1.0;
          // Tangent-space normal → world-space (terrain is flat/upward: T=X, B=Z, N=Y)
          vec3 pertNormal = normalize(vec3(nSample.r * 0.9, nSample.b, nSample.g * 0.9));
          vec3 viewDir   = normalize(cameraPosition - vWorldPosition);
          vec3 lightDir  = normalize(vec3(0.4, 1.0, 0.3));
          float spec     = pow(max(dot(pertNormal, normalize(viewDir + lightDir)), 0.0), 56.0) * 0.45;

          for (int i = 0; i < 40; i++) {
            if (i >= uCoolLavaSpotCount) break;
            vec4 spot = uCoolLavaSpots[i];
            // spot.xy = worldXZ centre, spot.z = radius
            float dist = length(vWorldPosition.xz - spot.xy);
            // Full opacity to ~60% radius, then fades out to edge
            float fade = 1.0 - smoothstep(spot.z * 0.30, spot.z, dist);
            if (fade > 0.001) {
              vec3 coolColor = texture2D(uCoolLavaTex, texCoord).rgb;
              // Add specular highlight from normal map
              coolColor = min(coolColor + vec3(spec * 0.5), 1.0);
              color = mix(color, coolColor, fade * 0.92);
            }
          }
        }

        gl_FragColor = vec4(color, alpha);
      }
    `,transparent:!0,depthWrite:!0}),Xe.uniforms.uCoolLavaSpots={value:new Float32Array(Mo*4)},Xe.isPersistent=!0,ma=Xe;const Kt=new Re(Y,Xe);Kt.rotation.x=-Math.PI/2,Kt.castShadow=!0,Kt.receiveShadow=!0,Kt.renderOrder=.5,Kt.customDepthMaterial=new pc({depthPacking:mc});const ra=512,xo=qu(),Nn=xo.heightmap,un=new Oa(-l/2,l/2,l/2,-l/2,.1,100);un.position.set(0,50,0),un.lookAt(0,0,0),un.updateProjectionMatrix(),ga||(ga=new je({vertexShader:`
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
    `,uniforms:{uMinHeight:{value:v},uMaxHeight:{value:h}},side:ze}));const ge=ga,To=new Re(Y,ge);To.rotation.x=-Math.PI/2;function is(_){if(!_){console.warn("updateHeightmapTexture: renderer not provided");return}const E=_.getRenderTarget();_.setRenderTarget(Nn),_.render(To,un),_.setRenderTarget(E)}const Hi=xo.wetness1,Gi=xo.wetness2;let la=Hi,rs=Gi;va||(va=new Go(2,2));const zi=va,Wl=new Oa(-1,1,1,-1,0,1),ls=Array.from({length:32},()=>new gc),cs=Array.from({length:32},()=>new H),Se=new je({uniforms:{uHeightmap:{value:Nn.texture},uPreviousWetness:{value:null},uWaterLevel:{value:r},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uWaveTime:{value:0},uWaveAngleCos:{value:1},uWaveAngleSin:{value:0},uTime:{value:0},uDecayRate:{value:.98},uMinHeight:{value:v},uMaxHeight:{value:h},uTerrainSize:{value:l},uMeshOffset:{value:new ue(0,0)},uCurvature:{value:2e-5},uWaterfallPositions:{value:cs},uWaterfallCount:{value:0},uSplatPositions:{value:ls},uSplatCount:{value:0},uGreenZoneWetnessIntensity:{value:0},uGreenZoneMin:{value:.13},uGreenZoneMax:{value:3.2}},vertexShader:`
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
      uniform float uWaveTime;
      uniform float uWaveAngleCos;
      uniform float uWaveAngleSin;
      uniform float uTime;
      uniform float uDecayRate;
      uniform float uMinHeight;
      uniform float uMaxHeight;
      uniform float uTerrainSize;
      uniform vec2 uMeshOffset;
      uniform float uCurvature;
      uniform vec3 uWaterfallPositions[32]; // Max 32 waterfalls
      uniform int uWaterfallCount;
      uniform vec4 uSplatPositions[32]; // Impact splats + trail marks: xy = position, w = radius
      uniform int uSplatCount;
      uniform float uGreenZoneWetnessIntensity;
      uniform float uGreenZoneMin;
      uniform float uGreenZoneMax;
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


      // Exact 5-train sine wave formula — matches the water surface shader.
      float getWaveHeight(vec2 worldXZ) {
        float cs = uWaveAngleCos; float sn = uWaveAngleSin;
        vec2 w = vec2(cs * worldXZ.x - sn * worldXZ.y, sn * worldXZ.x + cs * worldXZ.y);
        float f = uWaveFrequency * 0.12;
        float t = uWaveTime;
        float h = sin(dot(w, vec2( 1.000,  0.000)) * f * 1.00 - t * 0.85) * 0.38
                + sin(dot(w, vec2(-0.737,  0.676)) * f * 0.71 - t * 0.58) * 0.24
                + sin(dot(w, vec2( 0.087, -0.996)) * f * 1.43 + t * 1.15) * 0.18
                + sin(dot(w, vec2( 0.609,  0.793)) * f * 0.57 - t * 0.42) * 0.12
                + sin(dot(w, vec2(-0.985, -0.174)) * f * 1.18 - t * 0.73) * 0.08;
        return h * uWaveAmplitude;
      }

      void main() {
        // Convert UV to world coordinates (terrain-local)
        vec2 worldXZ = (vUv - 0.5) * uTerrainSize;

        // Sample terrain height from heightmap
        float normalizedHeight = texture2D(uHeightmap, vUv).r;
        float terrainHeight = mix(uMinHeight, uMaxHeight, normalizedHeight);

        // Wave height at this terrain position. worldXZ.y = -worldZ due to the terrain
        // plane's -π/2 X rotation, so negate Y to match the water shader's convention.
        vec2 waveCoords = vec2(worldXZ.x, -worldXZ.y) - uMeshOffset;
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

        // Add wetness from impact splats and ball trails
        for (int i = 0; i < 32; i++) {
          if (i >= uSplatCount) break;
          vec4 splat = uSplatPositions[i];
          float dist = distance(worldXZ, splat.xz);
          float splatWetness = smoothstep(splat.w, 0.0, dist);
          newWetness = max(newWetness, splatWetness * 0.85);
        }

        // Add wetness to green zone when win state is active (island rehydration effect)
        // Water seeps from the ground in green zone and flows downhill to lower areas
        if (uGreenZoneWetnessIntensity > 0.01) {
          // Multi-scale noise for organic, mottled wetness pattern (like green overlay)
          vec2 noiseCoord = worldXZ;

          // Large wet patches (main seepage areas) — offset into a different noise region than win green
          float noise1 = smoothNoise(noiseCoord * 0.64 + vec2(37.0, 53.0)) * 0.6;
          // Medium patches (secondary seepage)
          float noise2 = smoothNoise(noiseCoord * 1.82 + vec2(71.0, 29.0)) * 0.3;
          // Fine detail (edge variation)
          float noise3 = smoothNoise(noiseCoord * 4.5 + vec2(91.0, 67.0)) * 0.1;

          // Combine noise layers
          float mottledPattern = noise1 + noise2 + noise3;

          // Increase contrast to create distinct wet vs dry patches
          mottledPattern = mottledPattern * mottledPattern * 1.44;

          // Add threshold - creates gaps where ground is dry
          mottledPattern = smoothstep(0.25, 0.72, mottledPattern);

          // Height-based wetness strength - water flows from green zone downward
          // Use gradual fading to avoid any hard bands
          float wetnessStrength = 0.0;

          if (terrainHeight >= uGreenZoneMin && terrainHeight <= uGreenZoneMax) {
            // In green zone - wetness fades from bottom to top
            // Normalize position within green zone (0 = bottom, 1 = top)
            float posInZone = (terrainHeight - uGreenZoneMin) / (uGreenZoneMax - uGreenZoneMin);

            // Fade from strong at bottom to weak at top (inverted)
            // Start fading at 40% up the zone, fully faded by 90%
            float heightFade = smoothstep(0.9, 0.4, posInZone);

            wetnessStrength = mottledPattern * heightFade * 0.85;
          } else if (terrainHeight < uGreenZoneMin) {
            // Below green zone - water has flowed down here
            // Fade wetness based on distance below green zone
            float distanceBelow = uGreenZoneMin - terrainHeight;
            // Strong wetness just below green zone, fading out by 1.5 units below
            float heightFade = smoothstep(1.5, 0.0, distanceBelow);
            wetnessStrength = mottledPattern * heightFade * 0.9; // Slightly stronger than green zone
          } else {
            // Above green zone - no wetness (water doesn't flow uphill)
            wetnessStrength = 0.0;
          }

          // Apply wetness with intensity
          newWetness = max(newWetness, wetnessStrength * uGreenZoneWetnessIntensity);
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
    `}),Ul=new Re(zi,Se);function Bl(_,E,P){if(!_||!E)return;Se.uniforms.uWaterLevel.value=E.uniforms.uWaterLevel?.value??r,Se.uniforms.uWaveAmplitude.value=E.uniforms.uWaveAmplitude?.value??.26,Se.uniforms.uWaveFrequency.value=E.uniforms.uWaveFrequency?.value??4.2,Se.uniforms.uWaveHeightMultiplier.value=E.uniforms.uWaveHeightMultiplier?.value??4.13,Se.uniforms.uWaveTime.value=E.uniforms.uWaveTime?.value??0,Se.uniforms.uWaveAngleCos.value=E.uniforms.uWaveAngleCos?.value??1,Se.uniforms.uWaveAngleSin.value=E.uniforms.uWaveAngleSin?.value??0,Se.uniforms.uMeshOffset.value.copy(E.uniforms.uMeshOffset?.value??new ue(0,0)),Se.uniforms.uCurvature.value=E.uniforms.uCurvature?.value??2e-5,Se.uniforms.uTime.value=P,Se.uniforms.uPreviousWetness.value=rs.texture;const O=_.getRenderTarget();_.setRenderTarget(la),_.render(Ul,Wl),_.setRenderTarget(O);const G=la;la=rs,rs=G}return{mesh:Kt,geometry:Y,material:Xe,body:ke,collider:Ke,size:l,getHeightAt:ie,sampleHeightAt:nt,randomPosition:ce,sculpt:as,stamp:oa,updatePhysics:jt,simpleNoise:x,config:{size:l,segments:e,islandRadius:d,falloffStart:f,falloffEnd:u,fanOutEnd:p,maxHeight:h,minDepth:v},coolLavaSpots:{add(_,E,P){const O=Xe.uniforms,G=O.uCoolLavaSpots.value;let q=O.uCoolLavaSpotCount.value;if(q>=Mo){G.copyWithin(0,4);const N=(Mo-1)*4;G[N]=_,G[N+1]=E,G[N+2]=P}else{const N=q*4;G[N]=_,G[N+1]=E,G[N+2]=P,O.uCoolLavaSpotCount.value=q+1}},clear(){Xe.uniforms.uCoolLavaSpotCount.value=0}},heightmap:{renderTarget:Nn,texture:Nn.texture,camera:un,mesh:To,update:is,size:ra,worldSize:l,minHeight:v,maxHeight:h},setRenderer(_){if(Et=_,_){const E=_.getRenderTarget(),P=_.getClearColor(new Q),O=_.getClearAlpha();_.setClearColor(0,0),_.setRenderTarget(Hi),_.clear(!0,!0,!0),_.setRenderTarget(Gi),_.clear(!0,!0,!0),_.setClearColor(P,O),_.setRenderTarget(E),is(_)}},wetnessMap:{texture:()=>rs.texture,update:Bl,size:y,worldSize:l,setDecayRate(_){Se.uniforms.uDecayRate.value=_},setGreenZoneWetnessIntensity(_){Se.uniforms.uGreenZoneWetnessIntensity.value=Math.max(0,Math.min(1,_))},setSplats(_){const E=_&&_.length>0?Math.min(_.length,32):0;for(let P=0;P<32;P++)if(P<E){const O=_[P];ls[P].set(O.x,0,O.z,O.radius)}else ls[P].set(0,0,0,0);Se.uniforms.uSplatPositions.value=ls,Se.uniforms.uSplatCount.value=E},setWaterfalls(_){const E=_&&_.length>0?Math.min(_.length,32):0;for(let P=0;P<32;P++)if(P<E){const O=_[P];cs[P].set(O.x,O.y,O.z)}else cs[P].set(0,0,0);Se.uniforms.uWaterfallPositions.value=cs,Se.uniforms.uWaterfallCount.value=E},dispose(){Se.dispose(),zi.dispose()}},dispose(){To&&To.geometry.dispose()},cleanupPhysics(_){Ke&&_&&(_.removeCollider(Ke,!0),Ke=null),ke&&_&&(_.removeRigidBody(ke),ke=null)}}}const{lerp:fn}=Jt,Pe=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];for(let t=0;t<256;t++)Pe[256+t]=Pe[t];function ya(t){return t*t*t*(t*(t*6-15)+10)}function qt(t,e,n,s){const o=t&15,i=o<8?e:n,a=o<4?n:o==12||o==14?e:s;return((o&1)==0?i:-i)+((o&2)==0?a:-a)}class Qu{noise(e,n,s){const o=Math.floor(e),i=Math.floor(n),a=Math.floor(s),r=o&255,l=i&255,c=a&255;e-=o,n-=i,s-=a;const d=e-1,f=n-1,u=s-1,p=ya(e),h=ya(n),v=ya(s),y=Pe[r]+l,w=Pe[y]+c,M=Pe[y+1]+c,x=Pe[r+1]+l,m=Pe[x]+c,S=Pe[x+1]+c;return fn(fn(fn(qt(Pe[w],e,n,s),qt(Pe[m],d,n,s),p),fn(qt(Pe[M],e,f,s),qt(Pe[S],d,f,s),p),h),fn(fn(qt(Pe[w+1],e,n,u),qt(Pe[m+1],d,n,u),p),fn(qt(Pe[M+1],e,f,u),qt(Pe[S+1],d,f,u),p),h),v)}}function Ju(){const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d"),n=e.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,"rgba(255, 255, 255, 1.0)"),n.addColorStop(.9,"rgba(255, 255, 255, 0.95)"),n.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=n,e.fillRect(0,0,64,64);const s=new Jo(t);return s.needsUpdate=!0,s}const $u=Ju(),Xi=new pt;function Wh(){const e=new Uint8Array(2097152);let n=0;const s=.05,o=new Qu,i=new H;for(let r=0;r<128;r++)for(let l=0;l<128;l++)for(let c=0;c<128;c++){const d=1-i.set(c,l,r).subScalar(64).divideScalar(128).length();e[n]=(168+127.6*o.noise(c*s/1.53,l*s,r*s/1.51))*d*d,n++}const a=new wc(e,128,128,128);return a.format=Mc,a.minFilter=rn,a.magFilter=rn,a.unpackAlignment=1,a.needsUpdate=!0,a}function ed(t={}){const{startX:e,startZ:n,endX:s,endZ:o,cloudHeight:i=13.2,cloudTexture:a,baseOpacity:r=.23,rainCount:l=100,timeOfDay:c="day"}=t,d=new Mn,f=`
    in vec3 position;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 inverseModelMatrix;
    uniform vec3 cameraPos;

    out vec3 vOrigin;
    out vec3 vDirection;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      vOrigin = vec3(inverseModelMatrix * vec4(cameraPos, 1.0)).xyz;
      vDirection = position - vOrigin;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,u=`
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

        // Positional gradient shading — avoids 2 extra texture samples per step vs shading()
        float col = ((p.x + p.y) * 0.25) + 0.45;
        col *= brightnessFactor; // Scale brightness for night/day

        ac.rgb += (1.0 - ac.a) * d * col;
        ac.a += (1.0 - ac.a) * d;

        if (ac.a >= 0.95) break;

        p += rayDir * delta;
      }

      color = linearToSRGB(ac);

      if (color.a == 0.0) discard;
    }
  `,p=new Wr(15,8,15),h=new Q(6978965);let v=1;c==="night"&&(h.set(1715530),v=.028);const y=new _c({glslVersion:xc,uniforms:{base:{value:h},map:{value:a},cameraPos:{value:new H},inverseModelMatrix:{value:new pt},threshold:{value:.25},opacity:{value:0},range:{value:.08},steps:{value:5},frame:{value:0},textureRotation:{value:0},brightnessFactor:{value:v}},vertexShader:f,fragmentShader:u,side:ze,transparent:!0,depthWrite:!1,depthTest:!1}),w=new Re(p,y);w.position.y=i,w.scale.set(11.11,6.12,8.3),w.visible=!1,w.renderOrder=6,w.geometry.boundingSphere=new Ur(new H(0,0,0),1.5),d.add(w);const M=new go,x=new Float32Array(l*3),m=[],S=.8,b=.3;for(let T=0;T<l;T++){const C=Math.random()*Math.PI*2,I=Math.random()*3.2;x[T*3]=Math.cos(C)*I,x[T*3+1]=i-Math.random()*4,x[T*3+2]=Math.sin(C)*I,m.push({initialY:x[T*3+1],initialX:x[T*3],initialZ:x[T*3+2],speed:2+Math.random()*3})}M.setAttribute("position",new Le(x,3));const D=new ui({color:7258367,size:.16,transparent:!0,opacity:0,blending:Br,depthWrite:!1,depthTest:!0,map:$u}),R=new Xs(M,D);return R.renderOrder=5,d.add(R),d.position.set(e,0,n),d.userData={cloud:w,cloudMaterial:y,rainParticles:R,rainVelocities:m,windDriftX:S,windDriftZ:b,creationTime:Date.now(),startPos:{x:e,z:n},endPos:{x:s,z:o},baseOpacity:r,drizzleSound:null,rainSkipFrame:!1},d}function td(t,e,n=0){const{cloud:s,cloudMaterial:o}=t.userData;if(!s.visible)return;o.uniforms.cameraPos.value.copy(e.position),s.updateWorldMatrix(!0,!1),Xi.copy(s.matrixWorld).invert(),o.uniforms.inverseModelMatrix.value.copy(Xi),o.uniforms.frame.value++,o.uniforms.textureRotation.value+=n*.3;const i=o.uniforms.frame.value*.02;o.uniforms.steps.value=20+Math.sin(i)*5}function nd(t,e){const{rainParticles:n,rainVelocities:s,windDriftX:o,windDriftZ:i}=t.userData;if(n.material.opacity<.01||(t.userData.rainSkipFrame=!t.userData.rainSkipFrame,t.userData.rainSkipFrame))return;const a=n.geometry.attributes.position.array,r=e*2;for(let l=0;l<s.length;l++){const c=s[l];a[l*3+1]-=c.speed*r,a[l*3]+=o*r,a[l*3+2]+=i*r,a[l*3+1]<.1&&(a[l*3+1]=c.initialY,a[l*3]=c.initialX,a[l*3+2]=c.initialZ)}n.geometry.attributes.position.needsUpdate=!0}function od(t,e){const{rainParticles:n}=t.userData;n.material.opacity=Math.max(0,Math.min(1,e))}const lt=200,Na=new je({uniforms:{uTime:{value:0},uJiggleFrequency:{value:8}},transparent:!0,side:ze,depthWrite:!1,vertexShader:`
    uniform float uTime;
    uniform float uJiggleFrequency;

    // Packed per-instance attributes (keeps total ≤ 16 vertex attribute locations)
    // aPackA: (radius, visualScale, spawnScale, jiggleAmplitude)
    // aPackB: (jiggleTime, attractionStrength, groundFlatten, flattenDrop)
    attribute vec4 aPackA;
    attribute vec4 aPackB;
    attribute vec3 aVelocity;
    attribute vec3 aAttractionDir;
    attribute float aHeatTint;

    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    varying float vHeatTint;

    void main() {
      // Unpack attributes
      float aRadius = aPackA.x;
      float aVisualScale = aPackA.y;
      float aSpawnScale = aPackA.z;
      float aJiggleAmplitude = aPackA.w;
      float aJiggleTime = aPackB.x;
      float aAttractionStrength = aPackB.y;
      float aGroundFlatten = aPackB.z;
      float aFlattenDrop = aPackB.w;

      // Scale unit sphere to actual radius, apply spawn animation
      vec3 pos = position * aRadius * aSpawnScale;
      vec3 norm = normal;

      // 2. CONTINUOUS SUBTLE WOBBLE - organic movement
      float wobbleAmount = 0.008;
      float wobble = sin(uTime * 2.0 + pos.x * 10.0) * cos(uTime * 1.7 + pos.y * 10.0) * wobbleAmount;
      pos += norm * wobble;

      // 3. JIGGLE ON MERGE - oscillating deformation
      if (aJiggleAmplitude > 0.001) {
        float jiggle = sin(aJiggleTime * uJiggleFrequency + pos.y * 3.0) * aJiggleAmplitude;
        jiggle *= cos(aJiggleTime * uJiggleFrequency * 0.7 + pos.x * 2.0);
        pos += norm * jiggle;
      }

      // 4. VELOCITY-BASED STRETCHING - raindrop shape (rounded front, pinched tail)
      float verticalSpeed = abs(aVelocity.y);
      float horizontalSpeed = length(aVelocity.xz);
      float speed = verticalSpeed * 1.5 + horizontalSpeed * 0.13;

      if (speed > 1.0) {
        vec3 motionDir = normalize(aVelocity);
        float alignment = dot(norm, motionDir);
        float stretchAmount = min(speed * 0.03, 0.15);

        if (alignment < 0.0) {
          float tailStretch = pow(-alignment, 0.7) * stretchAmount * 1.8;
          pos -= motionDir * tailStretch;
        } else {
          float frontCompress = alignment * stretchAmount * 0.2;
          pos += motionDir * frontCompress;
        }
      }

      // 5. ATTRACTION STRETCHING - true metaball effect
      if (aAttractionStrength > 0.001) {
        vec3 attractDir = normalize(aAttractionDir);
        float alignment = dot(norm, attractDir);
        float stretchAmount = aAttractionStrength * 0.15;
        if (alignment > 0.0) {
          pos += attractDir * alignment * stretchAmount;
        }
      }

      // 6. GROUND FLATTEN - squash bottom hemisphere to mimic water adhesion
      if (aGroundFlatten > 0.01) {
        if (pos.y < 0.0) {
          float depth = -pos.y;
          pos.y *= 1.0 - aGroundFlatten * 0.75;
          float spread = 1.0 + depth * aGroundFlatten * 0.6;
          pos.x *= spread;
          pos.z *= spread;
        }
        pos.y -= aFlattenDrop;
      }

      // 7. VISUAL SCALE - evaporation/heat shrink (applied last, like mesh.scale)
      pos *= aVisualScale;

      vPos = pos;
      vHeatTint = aHeatTint;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPos = (modelMatrix * instanceMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,fragmentShader:`
    uniform float uTime;
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPos;
    varying float vHeatTint;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(vec3(5.0, 10.0, 5.0));

      float distFromCenter = length(vPos);

      float viewAngle = abs(dot(viewDir, normal));
      float thickness = (1.0 - viewAngle) * 2.0;

      float fresnel = pow(1.0 - viewAngle, 3.0);

      vec3 deepCore = vec3(0.05, 0.2, 0.8);
      vec3 coreColor = vec3(0.2, 0.5, 1.0);
      vec3 midColor = vec3(0.3, 0.7, 1.0);
      vec3 brightColor = vec3(0.5, 0.85, 1.0);
      vec3 glowColor = vec3(0.7, 0.95, 1.0);

      float depthFactor = smoothstep(0.0, 1.0, distFromCenter);
      vec3 baseColor = mix(deepCore, coreColor, depthFactor);
      baseColor = mix(baseColor, midColor, pow(depthFactor, 0.7));

      vec3 color = mix(baseColor, brightColor, thickness * 0.3);

      float diffuse = max(dot(normal, lightDir), 0.0) * 0.6 + 0.4;
      color *= diffuse;

      float backLight = max(dot(normal, -lightDir), 0.0);
      float subsurface = pow(backLight, 2.0) * thickness;
      vec3 transmittedColor = vec3(0.4, 0.7, 1.0);
      color += transmittedColor * subsurface * 0.8;

      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 25.0);
      color += glowColor * spec * 0.6;

      color += brightColor * fresnel * 0.5;

      float centerGlow = pow(1.0 - depthFactor, 2.5);
      color += coreColor * centerGlow * 0.4;

      float alpha = 0.2362 + thickness * 0.12 + fresnel * 0.15;

      vec3 heatColor = vec3(1.0, 0.3, 0.1);
      color = mix(color, heatColor, vHeatTint * 0.6);

      gl_FragColor = vec4(color, alpha);
    }
  `});let me=null,Ce=null,Ht=null;const Ha=new H(.427,.855,.256),ko=[],io=new Set,$t=new pt,fs=new pt,sd=new Yt().setFromEuler(new Ks(-Math.PI/2,0,0)),qi=new H,Zi=new H;let Ue,Gt,xn,Tn,Ls;const ad={aRadius:{pack:"A",comp:0},aVisualScale:{pack:"A",comp:1},aSpawnScale:{pack:"A",comp:2},aJiggleAmplitude:{pack:"A",comp:3},aJiggleTime:{pack:"B",comp:0},aAttractionStrength:{pack:"B",comp:1},aGroundFlatten:{pack:"B",comp:2},aFlattenDrop:{pack:"B",comp:3}};function Uh(t){const e=new Ps(1,24,24);Ue=new We(new Float32Array(lt*4),4),Gt=new We(new Float32Array(lt*4),4),xn=new We(new Float32Array(lt*3),3),Tn=new We(new Float32Array(lt*3),3),Ls=new We(new Float32Array(lt),1),e.setAttribute("aPackA",Ue),e.setAttribute("aPackB",Gt),e.setAttribute("aVelocity",xn),e.setAttribute("aAttractionDir",Tn),e.setAttribute("aHeatTint",Ls),me=new In(e,Na,lt),me.count=0,me.castShadow=!1,me.receiveShadow=!1,me.renderOrder=3,me.frustumCulled=!1,me.isPersistent=!0,t.add(me);const n=new Go(1,1);Ht=new We(new Float32Array(lt),1),n.setAttribute("aOpacity",Ht),Ce=new In(n,rd,lt),Ce.count=0,Ce.castShadow=!1,Ce.receiveShadow=!1,Ce.renderOrder=2,Ce.frustumCulled=!1,Ce.isPersistent=!0,t.add(Ce);const s=new pt().makeTranslation(0,-1e3,0);for(let o=0;o<lt;o++)Ce.setMatrixAt(o,s);Ce.instanceMatrix.needsUpdate=!0,ko.length=0,io.clear();for(let o=lt-1;o>=0;o--)ko.push(o),io.add(o),$t.makeTranslation(0,-1e3,0),me.setMatrixAt(o,$t),Ue.array[o*4+1]=0;me.instanceMatrix.needsUpdate=!0}function Li(){if(ko.length===0)return console.warn("Metaball instance pool exhausted!"),-1;const t=ko.pop();return io.delete(t),t>=me.count&&(me.count=t+1),t}function el(t){if(t<0||t>=lt||io.has(t))return;const e=t*4;Ue.array[e]=0,Ue.array[e+1]=0,$t.makeTranslation(0,-1e3,0),me.setMatrixAt(t,$t),ko.push(t),io.add(t),Ce&&($t.makeTranslation(0,-1e3,0),Ce.setMatrixAt(t,$t),Ht&&(Ht.array[t]=0),Ce.instanceMatrix.needsUpdate=!0,Ht&&(Ht.needsUpdate=!0)),t===me.count-1&&id()}function id(){let t=me.count-1;for(;t>=0&&io.has(t);)t--;me.count=t+1}function qs(t,e,n,s){$t.makeTranslation(e,n,s),me.setMatrixAt(t,$t)}function ct(t,e,n){const s=ad[e];if(s){const o=s.pack==="A"?Ue:Gt;o.array[t*4+s.comp]=n}else{const o=me.geometry.getAttribute(e);o&&(o.array[t]=n)}}function Ga(t,e,n,s,o){const i=me.geometry.getAttribute(e);if(i){const a=t*3;i.array[a]=n,i.array[a+1]=s,i.array[a+2]=o}}function tl(){me&&(me.instanceMatrix.needsUpdate=!0,Ue.needsUpdate=!0,Gt.needsUpdate=!0,xn.needsUpdate=!0,Tn.needsUpdate=!0,Ls.needsUpdate=!0,Ce&&(Ce.count=me.count,Ce.instanceMatrix.needsUpdate=!0,Ht.needsUpdate=!0))}function Bh(){return me}const rd=new je({transparent:!0,depthWrite:!1,depthTest:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:ze,vertexShader:`
    attribute float aOpacity;
    varying vec2 vUv;
    varying float vOpacity;
    void main() {
      vUv = uv;
      vOpacity = aOpacity;
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    varying vec2 vUv;
    varying float vOpacity;
    void main() {
      vec2 center = vUv - 0.5;
      float dist = length(center) * 2.0; // 0 at center, 1 at edge

      // Discard beyond circle to avoid any square artifacts
      if (dist > 1.0) discard;

      // Soft circular falloff — fades well before edges
      float falloff = 1.0 - smoothstep(0.0, 0.75, dist);
      // Organic wobble to break up the perfect circle
      float angle = atan(center.y, center.x);
      float wobble = 0.04 * sin(angle * 3.0) + 0.03 * sin(angle * 5.0 + 1.0);
      falloff *= 1.0 - smoothstep(0.6, 0.75, dist + wobble);

      // Bright caustic highlight (off-center to simulate light refraction)
      vec2 highlightCenter = center - vec2(0.06, 0.04);
      float highlightDist = length(highlightCenter) * 2.0;
      float highlight = exp(-highlightDist * highlightDist * 10.0) * 0.45;

      // Blue hue tint
      vec3 tint = vec3(0.15, 0.4, 0.85) * falloff * 0.35;

      // Add bright refracted highlight (white-blue)
      tint += vec3(0.5, 0.75, 1.0) * highlight;

      float alpha = (falloff * 0.3 + highlight * 0.5) * vOpacity;
      gl_FragColor = vec4(tint, alpha);
    }
  `}),At=[];let Zs=0;const Vh={cache:new Map,get(t){const e=Math.round(t*100)/100;if(!this.cache.has(e)){let n;e<.15?n=16:e<.25?n=24:e<.4?n=32:n=48,this.cache.set(e,new Ps(e,n,n))}return this.cache.get(e)},dispose(){this.cache.forEach(t=>t.dispose()),this.cache.clear()}},Ft={enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:12,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.5,fadeInDuration:2800,fadeOutDuration:2800};function Yh(t){Object.assign(Ft,t)}function nl(t,e,n,s,o,i){qs(t,e,n,s);const a=t*4;Ue.array[a]=o,Ue.array[a+1]=1,Ue.array[a+2]=i,Ue.array[a+3]=0,Gt.array.fill(0,a,a+4);const r=t*3;xn.array.fill(0,r,r+3),Tn.array.fill(0,r,r+3),Ls.array[t]=0}function ol(t,e,n,s,o,i,a,r,l,c){return{instanceIndex:t,position:new H(e,n,s),visualScale:1,body:l,collider:c,radius:o,mass:i,active:!0,hasSpawnedRipple:!1,originalMass:a,jiggleAmplitude:0,jiggleTime:0,spawnProgress:r,attractionDir:new H,attractionStrength:0}}function jh(t,e,n){return function(o,i){const a=Ft.minRadius+Math.random()*(Ft.maxRadius-Ft.minRadius),r=Li();if(r<0)return null;nl(r,o,Ft.spawnHeight,i,a,.01);const l=a*a*a*30.5,c=Rt.RigidBodyDesc.dynamic().setTranslation(o,Ft.spawnHeight,i).setLinearDamping(n.damping.linear).setAngularDamping(n.damping.angular).setCcdEnabled(!0),d=e.createRigidBody(c),f=Rt.ColliderDesc.ball(a).setMass(l).setFriction(n.ballGround.friction).setRestitution(n.ballGround.restitution).setCollisionGroups(so.ball),u=e.createCollider(f,d);Zs+=l;const p=ol(r,o,Ft.spawnHeight,i,a,l,l,0,d,u);return At.push(p),p}}function Kh(t){const e=Na.uniforms.uTime.value+t;Na.uniforms.uTime.value=e;const n=Math.pow(.1,t);let s=!1;At.forEach(o=>{if(!o.active)return;s=!0;const i=o.instanceIndex,a=i*4;if(o.spawnProgress<1){o.spawnProgress+=t*2.5,o.spawnProgress=Math.min(o.spawnProgress,1);const d=1-Math.pow(1-o.spawnProgress,3);Ue.array[a+2]=d}if(o.jiggleAmplitude>0&&(o.jiggleTime+=t,o.jiggleAmplitude*=n,o.jiggleAmplitude<.001&&(o.jiggleAmplitude=0,o.jiggleTime=0),Ue.array[a+3]=o.jiggleAmplitude,Gt.array[a]=o.jiggleTime),!o.isEvaporating){const d=o.body.linvel(),f=i*3;xn.array[f]=d.x,xn.array[f+1]=d.y,xn.array[f+2]=d.z}const r=i*3;Tn.array[r]=o.attractionDir.x,Tn.array[r+1]=o.attractionDir.y,Tn.array[r+2]=o.attractionDir.z,Gt.array[a+1]=o.attractionStrength;const l=o.isOnGround?1:0,c=o.isOnGround?8:4;if(o.groundFlatten=o.groundFlatten||0,o.groundFlatten+=(l-o.groundFlatten)*Math.min(c*t,1),Gt.array[a+2]=o.groundFlatten,Gt.array[a+3]=o.groundFlatten*o.radius*.55,Ce){const d=o.instanceIndex;if(o.groundFlatten>.05){const f=o.terrainHeightAtBall!==void 0?o.terrainHeightAtBall:o.position.y-o.radius,u=o.radius*3.5*o.groundFlatten;qi.set(o.position.x+Ha.x*o.radius*.8,f+.04,o.position.z+Ha.z*o.radius*.8),Zi.set(u,u,1),fs.compose(qi,sd,Zi),Ce.setMatrixAt(d,fs),Ht.array[d]=o.groundFlatten}else fs.makeTranslation(0,-1e3,0),Ce.setMatrixAt(d,fs),Ht.array[d]=0}}),s&&tl()}function ld(t,e=1){!t||!t.active||(t.jiggleAmplitude=.08*e,t.jiggleTime=0)}function Xh(){return Zs}function cd(t){Zs+=t}function qh(t){Ha.copy(t)}function Zh(){Zs=0}function Ts(t,e,n){if(t.active=!1,el(t.instanceIndex),t.body){try{n.removeRigidBody(t.body)}catch{}t.body=null,t.collider=null}else if(t.collider){try{n.removeCollider(t.collider,!0)}catch{}t.collider=null}}const ud=.15,wa=3,dd=.65;function sl(t,e,n,s){if(!t.active||t.isEvaporating||t.radius<ud)return!1;const o=t.radius*dd;if(o<Ft.minRadius*.8)return!1;const i=t.position.clone(),a=t.body.linvel(),r=t.originalMass;Ts(t,e,n);const l=At.indexOf(t);l>-1&&At.splice(l,1);const c=Math.PI*2/wa;for(let d=0;d<wa;d++){const f=c*d+Math.random()*.3,u=Li();if(u<0)continue;const p=t.radius*1.2,h=i.x+Math.cos(f)*p,v=i.y+.1,y=i.z+Math.sin(f)*p;nl(u,h,v,y,o,1);const w=o*o*o*30.5,M=Rt.RigidBodyDesc.dynamic().setTranslation(h,v,y).setLinvel(a.x,a.y,a.z).setLinearDamping(s.damping.linear).setAngularDamping(s.damping.angular).setCcdEnabled(!0),x=n.createRigidBody(M),m=Rt.ColliderDesc.ball(o).setMass(w).setFriction(s.ballGround.friction).setRestitution(s.ballGround.restitution).setCollisionGroups(so.ball),S=n.createCollider(m,x),b=.8,D=new H(Math.cos(f)*b,.342+Math.random()*.185,Math.sin(f)*b).normalize(),T=(4.4+Math.random()*3.42)*w;x.applyImpulse({x:D.x*T,y:D.y*T,z:D.z*T},!0);const C=ol(u,h,v,y,o,w,r/wa,1,x,S);At.push(C)}return!0}const hs=new Rt.Ray({x:0,y:20,z:0},{x:0,y:-1,z:0}),Fe=[],Gn=[];function Qh(t,e){const{world:n,PHYSICS_CONFIG:s,enabled:o,waterLevel:i,rippleColor:a,scene:r,rippleSystem:l,playWaterSplashSound:c,triggerSplitParticles:d,impactSplats:f,ballsInTarget:u,hasActiveLava:p,isPositionNearActiveLava:h,emitSteamBurst:v}=e;if(Fe.length=0,o)for(let m=0;m<At.length;m++){const S=At[m];S.active&&!S.isEvaporating&&Fe.push(S)}Gn.length=Fe.length;for(let m=0;m<Fe.length;m++)Gn[m]=Fe[m].body.translation();Fe.forEach((m,S)=>{if(!m.active)return;const b=Gn[S],D=b.x,R=b.y,T=b.z;if(!m.hasSpawnedRipple){const Z=R-m.radius,W=m.body.linvel();if(W.y<0&&Z<=i-.685){const ne=(i-Z)/Math.abs(W.y),Y=.142,F=D-W.x*ne+W.x*Y,ie=T-W.z*ne+W.z*Y;l.spawnRipple(F,ie,{size:m.radius*3,speed:1,color:a}),c(m.radius),m.hasSpawnedRipple=!0}}if(R-m.radius<i-.88){Ts(m,r,n),u.delete(m);return}hs.origin.x=D,hs.origin.z=T;const C=n.castRay(hs,40,!0,void 0,void 0,void 0,void 0,Z=>{const W=Z.parent();return W!==null&&W.isFixed()});let I=-100,X=!1;const $=R-m.radius;if(C!==null){if(I=hs.pointAt(C.timeOfImpact).y,$<I-.55){const W=m.body.linvel();m.body.setTranslation({x:D,y:I+m.radius+.2,z:T},!0),m.body.setLinvel({x:W.x,y:Math.max(0,W.y),z:W.z},!0)}X=$<=I+.3&&I>i+.5;const Z=m.isOnGround;if(m.isOnGround=X,X&&!Z){const ne=-m.body.linvel().y;if(ne>3){const Y=Math.min(ne/8,1);d({x:D,y:I+m.radius*.5,z:T},m.radius*(.5+Y*.5)),f.push({x:D,z:-T,radius:m.radius*(1.5+Y*2),life:0,maxLife:1.5+Y*1}),f.length>16&&f.shift()}}if(X){const W=m.body.linvel();W.y>.1&&m.body.setLinvel({x:W.x,y:W.y*.2,z:W.z},!0),m.body.applyImpulse({x:0,y:-m.mass*3*t,z:0},!0)}}if(m.terrainHeightAtBall=I,p()&&h(D,R,T,m.radius)){v(m.position,m.radius,12),Ts(m,r,n);return}m.position.set(D,R,T),qs(m.instanceIndex,D,R,T);for(let Z=S+1;Z<Fe.length;Z++){const W=Fe[Z];if(!W.active)continue;const ne=Gn[Z],Y=b.x-ne.x,F=b.z-ne.z;if(Y*Y+F*F>1)continue;const ie=b.y-ne.y;if(Math.sqrt(Y*Y+ie*ie+F*F)>=m.radius+W.radius)continue;const J=m.radius>=W.radius?m:W,we=m.radius>=W.radius?W:m;if(!J.active||!we.active)continue;const ye=Math.pow(m.radius**3+W.radius**3,1/3),nt=J.mass+we.mass,vt=J.body.linvel(),yt=we.body.linvel();J.body.setLinvel({x:(vt.x*J.mass+yt.x*we.mass)/nt,y:(vt.y*J.mass+yt.y*we.mass)/nt,z:(vt.z*J.mass+yt.z*we.mass)/nt},!0),J.originalMass=(J.originalMass||J.mass)+(we.originalMass||we.mass),J.radius=ye,J.mass=nt,J.collider&&n.removeCollider(J.collider,!0),J.collider=n.createCollider(Rt.ColliderDesc.ball(ye).setMass(nt).setFriction(s.ballGround.friction).setRestitution(s.ballGround.restitution).setCollisionGroups(so.ball),J.body),ct(J.instanceIndex,"aRadius",ye),ld(J,Math.min(we.radius/J.radius*1.5,1)),Ts(we,r,n)}});const y=3,w=y*y,M=1.5,x=y*.4;for(const m of Fe)m.active&&(m.attractionDir.set(0,0,0),m.attractionStrength=0);for(let m=0;m<Fe.length;m++){const S=Fe[m];if(!S.active)continue;const b=Gn[m];for(let D=m+1;D<Fe.length;D++){const R=Fe[D];if(!R.active)continue;const T=Gn[D],C=T.x-b.x,I=T.z-b.z;if(C*C+I*I>w)continue;const X=T.y-b.y,$=Math.sqrt(C*C+X*X+I*I);if($>=y||$<.1)continue;const Z=C/$,W=X/$,ne=I/$,Y=M*(1-$/y),F=S.body.linvel(),ie=R.body.linvel();if(S.body.setLinvel({x:F.x+Z*Y*t,y:F.y+W*Y*t,z:F.z+ne*Y*t},!0),R.body.setLinvel({x:ie.x-Z*Y*t,y:ie.y-W*Y*t,z:ie.z-ne*Y*t},!0),$<x){const ce=1-$/x;S.attractionDir.x+=Z*ce,S.attractionDir.y+=W*ce,S.attractionDir.z+=ne*ce,S.attractionStrength=Math.max(S.attractionStrength,ce),R.attractionDir.x-=Z*ce,R.attractionDir.y-=W*ce,R.attractionDir.z-=ne*ce,R.attractionStrength=Math.max(R.attractionStrength,ce)}}}return Fe.length>0&&tl(),Fe}const fd=30,Ma={turbidity:0,rayleigh:.025,mieCoefficient:.01,exposure:.53},hd=20,g={startDelay:8500,duration:14800,dropInterval:120,ballsDropped:0,isActive:!1,startTime:0,steadyStateReached:!1,steadyStateValues:null,cloudUpdateFrameCounter:0,startTimeoutId:null,dropIntervalId:null,terrainDarknessBlend:0,isPaused:!1,pauseTimeoutRemaining:0,pauseTime:0,stormScheduledTime:0};function al(t,e,n,s,o=0){const i=t.x,a=t.z,r=e,l=e*e*e;Vl((c,d,f)=>{const u=Li();if(u<0)return null;qs(u,i,n,a),ct(u,"aRadius",r),ct(u,"aVisualScale",1),ct(u,"aSpawnScale",1),ct(u,"aJiggleAmplitude",0),ct(u,"aJiggleTime",0),Ga(u,"aVelocity",0,0,0),Ga(u,"aAttractionDir",0,0,0),ct(u,"aAttractionStrength",0),ct(u,"aGroundFlatten",0),ct(u,"aFlattenDrop",0),ct(u,"aHeatTint",0),s&&cd(l);const p=d.RigidBodyDesc.dynamic().setTranslation(i,n,a).setLinearDamping(o).setAngularDamping(0).setCcdEnabled(!0),h=c.createRigidBody(p),v=d.ColliderDesc.ball(r).setMass(l).setFriction(f.ballGround.friction).setRestitution(f.ballGround.restitution).setCollisionGroups(so.ball),y=c.createCollider(v,h);return{instanceIndex:u,position:new H(i,n,a),visualScale:1,body:h,collider:y,radius:r,mass:l,active:!0,hasSpawnedRipple:!1,originalMass:l,jiggleAmplitude:0,jiggleTime:0,spawnProgress:1,attractionDir:new H,attractionStrength:0}},At)}function pd(t,e=!0,n=null){const{scene:s,randomTerrainPosition:o,createCloudIndicator:i,sharedCloudTexture:a,sky:r,renderer:l,water:c,timeOfDay:d="day"}=t,f=85;g.stormScheduledTime=Date.now();const u=n!==null?n:g.startDelay;g.startTimeoutId=setTimeout(()=>{g.startTimeoutId=null,g.isActive=!0,g.startTime=Date.now(),g.ballsDropped=0;const p=o(),h=i({startX:p.x,startZ:p.z,endX:p.x,endZ:p.z,cloudTexture:a,rainCount:50,cloudHeight:fd,timeOfDay:d}),v=h.userData.cloud,y=h.userData.cloudMaterial;v.scale.set(125,32,128),v.rotation.y=Math.random()*Math.PI*2;const w=.22,M=.344;d!=="night"&&y.uniforms.base.value.setRGB(121/255*.5,138/255*.55,160/255*.65),y.uniforms.threshold.value=M,v.renderOrder=10,s.add(h);const x=jl();tc(),h.userData.drizzleSound=x,g.cloudData={group:h,startTime:Date.now(),rotationSpeed:.0013,baseOpacity:w},g.originalSkyValues={turbidity:r.material.uniforms.turbidity.value,rayleigh:r.material.uniforms.rayleigh.value,mieCoefficient:r.material.uniforms.mieCoefficient.value,exposure:l.toneMappingExposure},g.originalWaterValues={heightMultiplier:c.material.uniforms.uWaveHeightMultiplier.value,amplitude:c.material.uniforms.uWaveAmplitude.value,waveSpeed:c.material.uniforms.uWaveSpeed.value,waterLevel:c.mesh.position.y},g.originalHemisphereColors={deepColor:c.hemisphereMesh.material.uniforms.uDeepColor.value.clone(),shallowColor:c.hemisphereMesh.material.uniforms.uShallowColor.value.clone()},g.water=c,g.timeOfDay=d,g.lightningTriggered=!1,g.lightningStarted=!1;const m=document.createElement("div");m.id="lightning-flash",m.style.position="fixed",m.style.top="0",m.style.left="0",m.style.width="100%",m.style.height="100%",m.style.backgroundColor="white",m.style.opacity="0",m.style.pointerEvents="none",m.style.zIndex="1000",document.body.appendChild(m),g.lightningFlash=m,g.dropIntervalId=setInterval(()=>{if(g.ballsDropped>=f){clearInterval(g.dropIntervalId),g.dropIntervalId=null;return}const S=o(),b=.12+Math.random()*.1;al(S,b,hd,e),g.ballsDropped++},g.dropInterval)},u)}function _a(t,e){if(!g.lightningTriggered&&t>2500&&t<3500){g.lightningStarted||(g.lightningStarted=!0,g.lightningStartTime=e,Kl(),nc());const n=e-g.lightningStartTime;let s=0;return n<80?s=.9*(1-n/80):n>=180&&n<280?s=.85*(1-(n-180)/100):n>=280&&(g.lightningTriggered=!0,s=0),g.lightningFlash&&(g.lightningFlash.style.opacity=s.toString()),!0}return!1}function il(){if(g.lightningFlash){const t=document.getElementById("lightning-flash");t&&document.body.removeChild(t),g.lightningFlash=null}}function Jh(){if(!g.isPaused){if(g.isPaused=!0,g.pauseTime=Date.now(),g.startTimeoutId!==null&&!g.isActive){const t=Date.now()-g.stormScheduledTime;g.pauseTimeoutRemaining=Math.max(0,g.startDelay-t),clearTimeout(g.startTimeoutId),g.startTimeoutId=null}g.dropIntervalId!==null&&(clearInterval(g.dropIntervalId),g.dropIntervalId=null)}}function $h(t,e){if(!g.isPaused)return;const n=Date.now()-g.pauseTime;if(g.isPaused=!1,g.startTime>0&&(g.startTime+=n),g.cloudData&&g.cloudData.startTime>0&&(g.cloudData.startTime+=n),g.lightningStartTime>0&&(g.lightningStartTime+=n),g.stormScheduledTime>0&&(g.stormScheduledTime+=n),g.pauseTimeoutRemaining>0&&!g.isActive&&(pd(t,e,g.pauseTimeoutRemaining),g.pauseTimeoutRemaining=0),g.isActive&&g.ballsDropped<45){const{randomTerrainPosition:s}=t,o=45;g.dropIntervalId=setInterval(()=>{if(g.ballsDropped>=o){clearInterval(g.dropIntervalId),g.dropIntervalId=null;return}const i=s(),a=.12+Math.random()*.1;al(i,a,Ft.spawnHeight,e),g.ballsDropped++},g.dropInterval)}}function e0(){g.isActive=!1,g.ballsDropped=0,g.startTime=0,g.lightningTriggered=!1,g.lightningStarted=!1,g.steadyStateReached=!1,g.steadyStateValues=null,g.cloudUpdateFrameCounter=0,g.timeOfDay=void 0,g.terrainDarknessBlend=0,g.isPaused=!1,g.pauseTimeoutRemaining=0,g.pauseTime=0,g.stormScheduledTime=0,g.startTimeoutId!==null&&(clearTimeout(g.startTimeoutId),g.startTimeoutId=null),g.dropIntervalId!==null&&(clearInterval(g.dropIntervalId),g.dropIntervalId=null),Yl(),g.cloudData?.group?.userData?.drizzleSound&&Pr(g.cloudData.group.userData.drizzleSound),il(),delete g.originalSkyValues,g.originalWaterValues&&g.water&&(g.water.setWaveChoppiness(g.originalWaterValues.heightMultiplier,g.originalWaterValues.amplitude,g.originalWaterValues.waveSpeed),g.water.mesh.position.y=g.originalWaterValues.waterLevel),g.originalHemisphereColors&&g.water&&(g.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(g.originalHemisphereColors.deepColor),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(g.originalHemisphereColors.shallowColor)),delete g.originalWaterValues,delete g.originalHemisphereColors,delete g.water}function t0(t){const{gameStarted:e,scene:n,camera:s,dt:o,sky:i,renderer:a,updateCloud:r,updateRainParticles:l,setRainOpacity:c}=t;if(!e||!g.isActive||!g.cloudData)return!1;const d=Date.now(),f=d-g.startTime,u=g.cloudData,p=d-u.startTime,{cloud:h,cloudMaterial:v}=u.group.userData;h.visible||(h.visible=!0),g.cloudUpdateFrameCounter++,g.cloudUpdateFrameCounter>=1.22&&(r(u.group,s,o),g.cloudUpdateFrameCounter=0),h.rotation.y+=u.rotationSpeed;const y=4e3,w=3800,M=g.duration-2500,x=g.duration-2e3,m=f<w,S=f>x,b=!m&&!S;let D=u.baseOpacity;if(p<y){const C=p/y,I=C*C*C;D*=I}else if(f>M){const C=(f-(g.duration-1500))/1500;D*=Math.max(0,1-C)}v.uniforms.opacity.value=Math.max(0,D);const R=5e3,T=g.duration-5e3;if(b&&g.steadyStateReached&&f>=R&&f<=T)return l(u.group,o),c(u.group,D*.6),f>=2500&&f<=3500&&_a(f,d),!0;if(g.originalSkyValues&&g.timeOfDay!=="night"){_a(f,d);const C=g.originalSkyValues;if(m){const I=Math.pow(f/w,2);pa(i,a,C,Ma,I)}else if(S){const I=1-Math.pow(1-(f-x)/2e3,2);pa(i,a,Ma,C,I)}else g.steadyStateReached||(g.steadyStateReached=!0,pa(i,a,C,Ma,1))}else g.timeOfDay==="night"&&_a(f,d);if(g.originalHemisphereColors&&g.water){const C=new Q(4128),I=new Q(2245717),X=.6;if(m){const $=f/w,Z=$*$;g.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(g.originalHemisphereColors.deepColor,C,Z),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(g.originalHemisphereColors.shallowColor,I,Z),g.timeOfDay!=="night"&&(g.terrainDarknessBlend=Z*X)}else if(S){const $=(f-x)/2e3,Z=1-Math.pow(1-$,2);g.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(C,g.originalHemisphereColors.deepColor,Z),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(I,g.originalHemisphereColors.shallowColor,Z),g.timeOfDay!=="night"&&(g.terrainDarknessBlend=X*(1-Z))}else g.steadyStateReached||(g.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(C),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(I),g.timeOfDay!=="night"&&(g.terrainDarknessBlend=X))}if(g.originalWaterValues&&g.water){const W=f<R,ne=f>T;if(W){const Y=Math.min(f/R,1),F=Y*Y,ie=g.originalWaterValues.heightMultiplier+(4.8-g.originalWaterValues.heightMultiplier)*F,ce=g.originalWaterValues.amplitude+(.8-g.originalWaterValues.amplitude)*F,J=g.originalWaterValues.waveSpeed+(1.825-g.originalWaterValues.waveSpeed)*F,we=g.originalWaterValues.waterLevel-.84*F;g.water.mesh.position.y=we,g.water.setWaveChoppiness(ie,ce,J)}else if(ne){const Y=Math.min((f-T)/5e3,1),F=Y*Y,ie=4.8+(g.originalWaterValues.heightMultiplier-4.8)*F,ce=.8+(g.originalWaterValues.amplitude-.8)*F,J=1.825+(g.originalWaterValues.waveSpeed-1.825)*F,we=g.originalWaterValues.waterLevel-.84+.84*F;g.water.mesh.position.y=we,g.water.setWaveChoppiness(ie,ce,J)}else if(!g.steadyStateReached){const Y=g.originalWaterValues.waterLevel-.84;g.water.mesh.position.y=Y,g.water.setWaveChoppiness(4.8,.8,1.825)}}return l(u.group,o),c(u.group,D*.6),f>g.duration?(g.isActive=!1,g.dropIntervalId!==null&&(clearInterval(g.dropIntervalId),g.dropIntervalId=null),g.terrainDarknessBlend=0,u.group&&(u.group.userData.drizzleSound&&Pr(u.group.userData.drizzleSound),n.remove(u.group),u.group.traverse(C=>{C.geometry&&C.geometry.dispose(),C.material&&C.material.dispose()})),g.cloudData=null,g.originalSkyValues&&(g.originalSkyValues=null),g.originalWaterValues&&g.water&&(g.water.setWaveChoppiness(g.originalWaterValues.heightMultiplier,g.originalWaterValues.amplitude,g.originalWaterValues.waveSpeed),g.water.mesh.position.y=g.originalWaterValues.waterLevel,g.originalWaterValues=null),g.originalHemisphereColors&&g.water&&(g.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(g.originalHemisphereColors.deepColor),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(g.originalHemisphereColors.shallowColor),g.originalHemisphereColors=null,g.water=null),il(),!1):!0}function rl(t){const e=new Map,n=new Map,s=t.clone();return ll(t,s,function(o,i){e.set(i,o),n.set(o,i)}),s.traverse(function(o){if(!o.isSkinnedMesh)return;const i=o,a=e.get(o),r=a.skeleton.bones;i.skeleton=a.skeleton.clone(),i.bindMatrix.copy(a.bindMatrix),i.skeleton.bones=r.map(function(l){return n.get(l)}),i.bind(i.skeleton,i.bindMatrix)}),s}function ll(t,e,n){n(t,e);for(let s=0;s<t.children.length;s++)ll(t.children[s],e.children[s],n)}function Qi(t,e){if(e===Tc)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),t;if(e===Fa||e===Vr){let n=t.getIndex();if(n===null){const a=[],r=t.getAttribute("position");if(r!==void 0){for(let l=0;l<r.count;l++)a.push(l);t.setIndex(a),n=t.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),t}const s=n.count-2,o=[];if(e===Fa)for(let a=1;a<=s;a++)o.push(n.getX(0)),o.push(n.getX(a)),o.push(n.getX(a+1));else for(let a=0;a<s;a++)a%2===0?(o.push(n.getX(a)),o.push(n.getX(a+1)),o.push(n.getX(a+2))):(o.push(n.getX(a+2)),o.push(n.getX(a+1)),o.push(n.getX(a)));o.length/3!==s&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const i=t.clone();return i.setIndex(o),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),t}class cl extends Sc{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(n){return new wd(n)}),this.register(function(n){return new Md(n)}),this.register(function(n){return new bd(n)}),this.register(function(n){return new Id(n)}),this.register(function(n){return new Ed(n)}),this.register(function(n){return new xd(n)}),this.register(function(n){return new Td(n)}),this.register(function(n){return new Sd(n)}),this.register(function(n){return new Cd(n)}),this.register(function(n){return new yd(n)}),this.register(function(n){return new Rd(n)}),this.register(function(n){return new _d(n)}),this.register(function(n){return new Dd(n)}),this.register(function(n){return new Ad(n)}),this.register(function(n){return new gd(n)}),this.register(function(n){return new Pd(n)}),this.register(function(n){return new Ld(n)})}load(e,n,s,o){const i=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=Do.extractUrlBase(e);a=Do.resolveURL(c,this.path)}else a=Do.extractUrlBase(e);this.manager.itemStart(e);const r=function(c){o?o(c):console.error(c),i.manager.itemError(e),i.manager.itemEnd(e)},l=new Yr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{i.parse(c,a,function(d){n(d),i.manager.itemEnd(e)},r)}catch(d){r(d)}},s,r)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,n,s,o){let i;const a={},r={},l=new TextDecoder;if(typeof e=="string")i=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===ul){try{a[te.KHR_BINARY_GLTF]=new Od(e)}catch(f){o&&o(f);return}i=JSON.parse(a[te.KHR_BINARY_GLTF].content)}else i=JSON.parse(l.decode(e));else i=e;if(i.asset===void 0||i.asset.version[0]<2){o&&o(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new Kd(i,{path:n||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let d=0;d<this.pluginCallbacks.length;d++){const f=this.pluginCallbacks[d](c);f.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),r[f.name]=f,a[f.name]=!0}if(i.extensionsUsed)for(let d=0;d<i.extensionsUsed.length;++d){const f=i.extensionsUsed[d],u=i.extensionsRequired||[];switch(f){case te.KHR_MATERIALS_UNLIT:a[f]=new vd;break;case te.KHR_DRACO_MESH_COMPRESSION:a[f]=new Fd(i,this.dracoLoader);break;case te.KHR_TEXTURE_TRANSFORM:a[f]=new Nd;break;case te.KHR_MESH_QUANTIZATION:a[f]=new Hd;break;default:u.indexOf(f)>=0&&r[f]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+f+'".')}}c.setExtensions(a),c.setPlugins(r),c.parse(s,o)}parseAsync(e,n){const s=this;return new Promise(function(o,i){s.parse(e,n,o,i)})}}function md(){let t={};return{get:function(e){return t[e]},add:function(e,n){t[e]=n},remove:function(e){delete t[e]},removeAll:function(){t={}}}}const te={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class gd{constructor(e){this.parser=e,this.name=te.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,n=this.parser.json.nodes||[];for(let s=0,o=n.length;s<o;s++){const i=n[s];i.extensions&&i.extensions[this.name]&&i.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,i.extensions[this.name].light)}}_loadLight(e){const n=this.parser,s="light:"+e;let o=n.cache.get(s);if(o)return o;const i=n.json,l=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e];let c;const d=new Q(16777215);l.color!==void 0&&d.setRGB(l.color[0],l.color[1],l.color[2],Bt);const f=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Ac(d),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Rc(d),c.distance=f;break;case"spot":c=new Cc(d),c.distance=f,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Ct(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=n.createUniqueName(l.name||"light_"+e),o=Promise.resolve(c),n.cache.add(s,o),o}getDependency(e,n){if(e==="light")return this._loadLight(n)}createNodeAttachment(e){const n=this,s=this.parser,i=s.json.nodes[e],r=(i.extensions&&i.extensions[this.name]||{}).light;return r===void 0?null:this._loadLight(r).then(function(l){return s._getNodeRef(n.cache,r,l)})}}class vd{constructor(){this.name=te.KHR_MATERIALS_UNLIT}getMaterialType(){return dt}extendParams(e,n,s){const o=[];e.color=new Q(1,1,1),e.opacity=1;const i=n.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){const a=i.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Bt),e.opacity=a[3]}i.baseColorTexture!==void 0&&o.push(s.assignTexture(e,"map",i.baseColorTexture,ao))}return Promise.all(o)}}class yd{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,n){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=o.extensions[this.name].emissiveStrength;return i!==void 0&&(n.emissiveIntensity=i),Promise.resolve()}}class wd{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];if(a.clearcoatFactor!==void 0&&(n.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&i.push(s.assignTexture(n,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(n.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&i.push(s.assignTexture(n,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(i.push(s.assignTexture(n,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const r=a.clearcoatNormalTexture.scale;n.clearcoatNormalScale=new ue(r,r)}return Promise.all(i)}}class Md{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_DISPERSION}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=o.extensions[this.name];return n.dispersion=i.dispersion!==void 0?i.dispersion:0,Promise.resolve()}}class _d{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return a.iridescenceFactor!==void 0&&(n.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&i.push(s.assignTexture(n,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(n.iridescenceIOR=a.iridescenceIor),n.iridescenceThicknessRange===void 0&&(n.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&i.push(s.assignTexture(n,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(i)}}class xd{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_SHEEN}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[];n.sheenColor=new Q(0,0,0),n.sheenRoughness=0,n.sheen=1;const a=o.extensions[this.name];if(a.sheenColorFactor!==void 0){const r=a.sheenColorFactor;n.sheenColor.setRGB(r[0],r[1],r[2],Bt)}return a.sheenRoughnessFactor!==void 0&&(n.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&i.push(s.assignTexture(n,"sheenColorMap",a.sheenColorTexture,ao)),a.sheenRoughnessTexture!==void 0&&i.push(s.assignTexture(n,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(i)}}class Td{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return a.transmissionFactor!==void 0&&(n.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&i.push(s.assignTexture(n,"transmissionMap",a.transmissionTexture)),Promise.all(i)}}class Sd{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_VOLUME}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];n.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&i.push(s.assignTexture(n,"thicknessMap",a.thicknessTexture)),n.attenuationDistance=a.attenuationDistance||1/0;const r=a.attenuationColor||[1,1,1];return n.attenuationColor=new Q().setRGB(r[0],r[1],r[2],Bt),Promise.all(i)}}class Cd{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_IOR}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=o.extensions[this.name];return n.ior=i.ior!==void 0?i.ior:1.5,Promise.resolve()}}class Rd{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_SPECULAR}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];n.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&i.push(s.assignTexture(n,"specularIntensityMap",a.specularTexture));const r=a.specularColorFactor||[1,1,1];return n.specularColor=new Q().setRGB(r[0],r[1],r[2],Bt),a.specularColorTexture!==void 0&&i.push(s.assignTexture(n,"specularColorMap",a.specularColorTexture,ao)),Promise.all(i)}}class Ad{constructor(e){this.parser=e,this.name=te.EXT_MATERIALS_BUMP}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return n.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&i.push(s.assignTexture(n,"bumpMap",a.bumpTexture)),Promise.all(i)}}class Dd{constructor(e){this.parser=e,this.name=te.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:Dt}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return a.anisotropyStrength!==void 0&&(n.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(n.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&i.push(s.assignTexture(n,"anisotropyMap",a.anisotropyTexture)),Promise.all(i)}}class bd{constructor(e){this.parser=e,this.name=te.KHR_TEXTURE_BASISU}loadTexture(e){const n=this.parser,s=n.json,o=s.textures[e];if(!o.extensions||!o.extensions[this.name])return null;const i=o.extensions[this.name],a=n.options.ktx2Loader;if(!a){if(s.extensionsRequired&&s.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return n.loadTextureImage(e,i.source,a)}}class Id{constructor(e){this.parser=e,this.name=te.EXT_TEXTURE_WEBP}loadTexture(e){const n=this.name,s=this.parser,o=s.json,i=o.textures[e];if(!i.extensions||!i.extensions[n])return null;const a=i.extensions[n],r=o.images[a.source];let l=s.textureLoader;if(r.uri){const c=s.options.manager.getHandler(r.uri);c!==null&&(l=c)}return s.loadTextureImage(e,a.source,l)}}class Ed{constructor(e){this.parser=e,this.name=te.EXT_TEXTURE_AVIF}loadTexture(e){const n=this.name,s=this.parser,o=s.json,i=o.textures[e];if(!i.extensions||!i.extensions[n])return null;const a=i.extensions[n],r=o.images[a.source];let l=s.textureLoader;if(r.uri){const c=s.options.manager.getHandler(r.uri);c!==null&&(l=c)}return s.loadTextureImage(e,a.source,l)}}class Pd{constructor(e){this.name=te.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const n=this.parser.json,s=n.bufferViews[e];if(s.extensions&&s.extensions[this.name]){const o=s.extensions[this.name],i=this.parser.getDependency("buffer",o.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return i.then(function(r){const l=o.byteOffset||0,c=o.byteLength||0,d=o.count,f=o.byteStride,u=new Uint8Array(r,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(d,f,u,o.mode,o.filter).then(function(p){return p.buffer}):a.ready.then(function(){const p=new ArrayBuffer(d*f);return a.decodeGltfBuffer(new Uint8Array(p),d,f,u,o.mode,o.filter),p})})}else return null}}class Ld{constructor(e){this.name=te.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const n=this.parser.json,s=n.nodes[e];if(!s.extensions||!s.extensions[this.name]||s.mesh===void 0)return null;const o=n.meshes[s.mesh];for(const c of o.primitives)if(c.mode!==Ze.TRIANGLES&&c.mode!==Ze.TRIANGLE_STRIP&&c.mode!==Ze.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=s.extensions[this.name].attributes,r=[],l={};for(const c in a)r.push(this.parser.getDependency("accessor",a[c]).then(d=>(l[c]=d,l[c])));return r.length<1?null:(r.push(this.parser.createNodeMesh(e)),Promise.all(r).then(c=>{const d=c.pop(),f=d.isGroup?d.children:[d],u=c[0].count,p=[];for(const h of f){const v=new pt,y=new H,w=new Yt,M=new H(1,1,1),x=new In(h.geometry,h.material,u);for(let m=0;m<u;m++)l.TRANSLATION&&y.fromBufferAttribute(l.TRANSLATION,m),l.ROTATION&&w.fromBufferAttribute(l.ROTATION,m),l.SCALE&&M.fromBufferAttribute(l.SCALE,m),x.setMatrixAt(m,v.compose(y,w,M));for(const m in l)if(m==="_COLOR_0"){const S=l[m];x.instanceColor=new We(S.array,S.itemSize,S.normalized)}else m!=="TRANSLATION"&&m!=="ROTATION"&&m!=="SCALE"&&h.geometry.setAttribute(m,l[m]);jr.prototype.copy.call(x,h),this.parser.assignFinalMaterial(x),p.push(x)}return d.isGroup?(d.clear(),d.add(...p),d):p[0]}))}}const ul="glTF",So=12,Ji={JSON:1313821514,BIN:5130562};class Od{constructor(e){this.name=te.KHR_BINARY_GLTF,this.content=null,this.body=null;const n=new DataView(e,0,So),s=new TextDecoder;if(this.header={magic:s.decode(new Uint8Array(e.slice(0,4))),version:n.getUint32(4,!0),length:n.getUint32(8,!0)},this.header.magic!==ul)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const o=this.header.length-So,i=new DataView(e,So);let a=0;for(;a<o;){const r=i.getUint32(a,!0);a+=4;const l=i.getUint32(a,!0);if(a+=4,l===Ji.JSON){const c=new Uint8Array(e,So+a,r);this.content=s.decode(c)}else if(l===Ji.BIN){const c=So+a;this.body=e.slice(c,c+r)}a+=r}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Fd{constructor(e,n){if(!n)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=te.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=n,this.dracoLoader.preload()}decodePrimitive(e,n){const s=this.json,o=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,r={},l={},c={};for(const d in a){const f=za[d]||d.toLowerCase();r[f]=a[d]}for(const d in e.attributes){const f=za[d]||d.toLowerCase();if(a[d]!==void 0){const u=s.accessors[e.attributes[d]],p=Qn[u.componentType];c[f]=p.name,l[f]=u.normalized===!0}}return n.getDependency("bufferView",i).then(function(d){return new Promise(function(f,u){o.decodeDracoFile(d,function(p){for(const h in p.attributes){const v=p.attributes[h],y=l[h];y!==void 0&&(v.normalized=y)}f(p)},r,c,Bt,u)})})}}class Nd{constructor(){this.name=te.KHR_TEXTURE_TRANSFORM}extendTexture(e,n){return(n.texCoord===void 0||n.texCoord===e.channel)&&n.offset===void 0&&n.rotation===void 0&&n.scale===void 0||(e=e.clone(),n.texCoord!==void 0&&(e.channel=n.texCoord),n.offset!==void 0&&e.offset.fromArray(n.offset),n.rotation!==void 0&&(e.rotation=n.rotation),n.scale!==void 0&&e.repeat.fromArray(n.scale),e.needsUpdate=!0),e}}class Hd{constructor(){this.name=te.KHR_MESH_QUANTIZATION}}class dl extends Kc{constructor(e,n,s,o){super(e,n,s,o)}copySampleValue_(e){const n=this.resultBuffer,s=this.sampleValues,o=this.valueSize,i=e*o*3+o;for(let a=0;a!==o;a++)n[a]=s[i+a];return n}interpolate_(e,n,s,o){const i=this.resultBuffer,a=this.sampleValues,r=this.valueSize,l=r*2,c=r*3,d=o-n,f=(s-n)/d,u=f*f,p=u*f,h=e*c,v=h-c,y=-2*p+3*u,w=p-u,M=1-y,x=w-u+f;for(let m=0;m!==r;m++){const S=a[v+m+r],b=a[v+m+l]*d,D=a[h+m+r],R=a[h+m]*d;i[m]=M*S+x*b+y*D+w*R}return i}}const Gd=new Yt;class zd extends dl{interpolate_(e,n,s,o){const i=super.interpolate_(e,n,s,o);return Gd.fromArray(i).normalize().toArray(i),i}}const Ze={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Qn={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},$i={9728:Kr,9729:rn,9984:Pc,9985:Ec,9986:Ic,9987:ci},er={33071:Oc,33648:Lc,10497:ut},xa={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},za={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Zt={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},kd={CUBICSPLINE:void 0,LINEAR:qr,STEP:Vc},Ta={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Wd(t){return t.DefaultMaterial===void 0&&(t.DefaultMaterial=new zo({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:jc})),t.DefaultMaterial}function hn(t,e,n){for(const s in n.extensions)t[s]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[s]=n.extensions[s])}function Ct(t,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(t.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ud(t,e,n){let s=!1,o=!1,i=!1;for(let c=0,d=e.length;c<d;c++){const f=e[c];if(f.POSITION!==void 0&&(s=!0),f.NORMAL!==void 0&&(o=!0),f.COLOR_0!==void 0&&(i=!0),s&&o&&i)break}if(!s&&!o&&!i)return Promise.resolve(t);const a=[],r=[],l=[];for(let c=0,d=e.length;c<d;c++){const f=e[c];if(s){const u=f.POSITION!==void 0?n.getDependency("accessor",f.POSITION):t.attributes.position;a.push(u)}if(o){const u=f.NORMAL!==void 0?n.getDependency("accessor",f.NORMAL):t.attributes.normal;r.push(u)}if(i){const u=f.COLOR_0!==void 0?n.getDependency("accessor",f.COLOR_0):t.attributes.color;l.push(u)}}return Promise.all([Promise.all(a),Promise.all(r),Promise.all(l)]).then(function(c){const d=c[0],f=c[1],u=c[2];return s&&(t.morphAttributes.position=d),o&&(t.morphAttributes.normal=f),i&&(t.morphAttributes.color=u),t.morphTargetsRelative=!0,t})}function Bd(t,e){if(t.updateMorphTargets(),e.weights!==void 0)for(let n=0,s=e.weights.length;n<s;n++)t.morphTargetInfluences[n]=e.weights[n];if(e.extras&&Array.isArray(e.extras.targetNames)){const n=e.extras.targetNames;if(t.morphTargetInfluences.length===n.length){t.morphTargetDictionary={};for(let s=0,o=n.length;s<o;s++)t.morphTargetDictionary[n[s]]=s}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Vd(t){let e;const n=t.extensions&&t.extensions[te.KHR_DRACO_MESH_COMPRESSION];if(n?e="draco:"+n.bufferView+":"+n.indices+":"+Sa(n.attributes):e=t.indices+":"+Sa(t.attributes)+":"+t.mode,t.targets!==void 0)for(let s=0,o=t.targets.length;s<o;s++)e+=":"+Sa(t.targets[s]);return e}function Sa(t){let e="";const n=Object.keys(t).sort();for(let s=0,o=n.length;s<o;s++)e+=n[s]+":"+t[n[s]]+";";return e}function ka(t){switch(t){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Yd(t){return t.search(/\.jpe?g($|\?)/i)>0||t.search(/^data\:image\/jpeg/)===0?"image/jpeg":t.search(/\.webp($|\?)/i)>0||t.search(/^data\:image\/webp/)===0?"image/webp":t.search(/\.ktx2($|\?)/i)>0||t.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const jd=new pt;class Kd{constructor(e={},n={}){this.json=e,this.extensions={},this.plugins={},this.options=n,this.cache=new md,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let s=!1,o=-1,i=!1,a=-1;if(typeof navigator<"u"){const r=navigator.userAgent;s=/^((?!chrome|android).)*safari/i.test(r)===!0;const l=r.match(/Version\/(\d+)/);o=s&&l?parseInt(l[1],10):-1,i=r.indexOf("Firefox")>-1,a=i?r.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||s&&o<17||i&&a<98?this.textureLoader=new kr(this.options.manager):this.textureLoader=new Dc(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Yr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,n){const s=this,o=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([s.getDependencies("scene"),s.getDependencies("animation"),s.getDependencies("camera")])}).then(function(a){const r={scene:a[0][o.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:o.asset,parser:s,userData:{}};return hn(i,r,o),Ct(r,o),Promise.all(s._invokeAll(function(l){return l.afterRoot&&l.afterRoot(r)})).then(function(){for(const l of r.scenes)l.updateMatrixWorld();e(r)})}).catch(n)}_markDefs(){const e=this.json.nodes||[],n=this.json.skins||[],s=this.json.meshes||[];for(let o=0,i=n.length;o<i;o++){const a=n[o].joints;for(let r=0,l=a.length;r<l;r++)e[a[r]].isBone=!0}for(let o=0,i=e.length;o<i;o++){const a=e[o];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(s[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,n){n!==void 0&&(e.refs[n]===void 0&&(e.refs[n]=e.uses[n]=0),e.refs[n]++)}_getNodeRef(e,n,s){if(e.refs[n]<=1)return s;const o=s.clone(),i=(a,r)=>{const l=this.associations.get(a);l!=null&&this.associations.set(r,l);for(const[c,d]of a.children.entries())i(d,r.children[c])};return i(s,o),o.name+="_instance_"+e.uses[n]++,o}_invokeOne(e){const n=Object.values(this.plugins);n.push(this);for(let s=0;s<n.length;s++){const o=e(n[s]);if(o)return o}return null}_invokeAll(e){const n=Object.values(this.plugins);n.unshift(this);const s=[];for(let o=0;o<n.length;o++){const i=e(n[o]);i&&s.push(i)}return s}getDependency(e,n){const s=e+":"+n;let o=this.cache.get(s);if(!o){switch(e){case"scene":o=this.loadScene(n);break;case"node":o=this._invokeOne(function(i){return i.loadNode&&i.loadNode(n)});break;case"mesh":o=this._invokeOne(function(i){return i.loadMesh&&i.loadMesh(n)});break;case"accessor":o=this.loadAccessor(n);break;case"bufferView":o=this._invokeOne(function(i){return i.loadBufferView&&i.loadBufferView(n)});break;case"buffer":o=this.loadBuffer(n);break;case"material":o=this._invokeOne(function(i){return i.loadMaterial&&i.loadMaterial(n)});break;case"texture":o=this._invokeOne(function(i){return i.loadTexture&&i.loadTexture(n)});break;case"skin":o=this.loadSkin(n);break;case"animation":o=this._invokeOne(function(i){return i.loadAnimation&&i.loadAnimation(n)});break;case"camera":o=this.loadCamera(n);break;default:if(o=this._invokeOne(function(i){return i!=this&&i.getDependency&&i.getDependency(e,n)}),!o)throw new Error("Unknown type: "+e);break}this.cache.add(s,o)}return o}getDependencies(e){let n=this.cache.get(e);if(!n){const s=this,o=this.json[e+(e==="mesh"?"es":"s")]||[];n=Promise.all(o.map(function(i,a){return s.getDependency(e,a)})),this.cache.add(e,n)}return n}loadBuffer(e){const n=this.json.buffers[e],s=this.fileLoader;if(n.type&&n.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+n.type+" buffer type is not supported.");if(n.uri===void 0&&e===0)return Promise.resolve(this.extensions[te.KHR_BINARY_GLTF].body);const o=this.options;return new Promise(function(i,a){s.load(Do.resolveURL(n.uri,o.path),i,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+n.uri+'".'))})})}loadBufferView(e){const n=this.json.bufferViews[e];return this.getDependency("buffer",n.buffer).then(function(s){const o=n.byteLength||0,i=n.byteOffset||0;return s.slice(i,i+o)})}loadAccessor(e){const n=this,s=this.json,o=this.json.accessors[e];if(o.bufferView===void 0&&o.sparse===void 0){const a=xa[o.type],r=Qn[o.componentType],l=o.normalized===!0,c=new r(o.count*a);return Promise.resolve(new Le(c,a,l))}const i=[];return o.bufferView!==void 0?i.push(this.getDependency("bufferView",o.bufferView)):i.push(null),o.sparse!==void 0&&(i.push(this.getDependency("bufferView",o.sparse.indices.bufferView)),i.push(this.getDependency("bufferView",o.sparse.values.bufferView))),Promise.all(i).then(function(a){const r=a[0],l=xa[o.type],c=Qn[o.componentType],d=c.BYTES_PER_ELEMENT,f=d*l,u=o.byteOffset||0,p=o.bufferView!==void 0?s.bufferViews[o.bufferView].byteStride:void 0,h=o.normalized===!0;let v,y;if(p&&p!==f){const w=Math.floor(u/p),M="InterleavedBuffer:"+o.bufferView+":"+o.componentType+":"+w+":"+o.count;let x=n.cache.get(M);x||(v=new c(r,w*p,o.count*p/d),x=new bc(v,p/d),n.cache.add(M,x)),y=new Yc(x,l,u%p/d,h)}else r===null?v=new c(o.count*l):v=new c(r,u,o.count*l),y=new Le(v,l,h);if(o.sparse!==void 0){const w=xa.SCALAR,M=Qn[o.sparse.indices.componentType],x=o.sparse.indices.byteOffset||0,m=o.sparse.values.byteOffset||0,S=new M(a[1],x,o.sparse.count*w),b=new c(a[2],m,o.sparse.count*l);r!==null&&(y=new Le(y.array.slice(),y.itemSize,y.normalized)),y.normalized=!1;for(let D=0,R=S.length;D<R;D++){const T=S[D];if(y.setX(T,b[D*l]),l>=2&&y.setY(T,b[D*l+1]),l>=3&&y.setZ(T,b[D*l+2]),l>=4&&y.setW(T,b[D*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}y.normalized=h}return y})}loadTexture(e){const n=this.json,s=this.options,i=n.textures[e].source,a=n.images[i];let r=this.textureLoader;if(a.uri){const l=s.manager.getHandler(a.uri);l!==null&&(r=l)}return this.loadTextureImage(e,i,r)}loadTextureImage(e,n,s){const o=this,i=this.json,a=i.textures[e],r=i.images[n],l=(r.uri||r.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(n,s).then(function(d){d.flipY=!1,d.name=a.name||r.name||"",d.name===""&&typeof r.uri=="string"&&r.uri.startsWith("data:image/")===!1&&(d.name=r.uri);const u=(i.samplers||{})[a.sampler]||{};return d.magFilter=$i[u.magFilter]||rn,d.minFilter=$i[u.minFilter]||ci,d.wrapS=er[u.wrapS]||ut,d.wrapT=er[u.wrapT]||ut,d.generateMipmaps=!d.isCompressedTexture&&d.minFilter!==Kr&&d.minFilter!==rn,o.associations.set(d,{textures:e}),d}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,n){const s=this,o=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());const a=o.images[e],r=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=s.getDependency("bufferView",a.bufferView).then(function(f){c=!0;const u=new Blob([f],{type:a.mimeType});return l=r.createObjectURL(u),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const d=Promise.resolve(l).then(function(f){return new Promise(function(u,p){let h=u;n.isImageBitmapLoader===!0&&(h=function(v){const y=new ki(v);y.needsUpdate=!0,u(y)}),n.load(Do.resolveURL(f,i.path),h,void 0,p)})}).then(function(f){return c===!0&&r.revokeObjectURL(l),Ct(f,a),f.userData.mimeType=a.mimeType||Yd(a.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),f});return this.sourceCache[e]=d,d}assignTexture(e,n,s,o){const i=this;return this.getDependency("texture",s.index).then(function(a){if(!a)return null;if(s.texCoord!==void 0&&s.texCoord>0&&(a=a.clone(),a.channel=s.texCoord),i.extensions[te.KHR_TEXTURE_TRANSFORM]){const r=s.extensions!==void 0?s.extensions[te.KHR_TEXTURE_TRANSFORM]:void 0;if(r){const l=i.associations.get(a);a=i.extensions[te.KHR_TEXTURE_TRANSFORM].extendTexture(a,r),i.associations.set(a,l)}}return o!==void 0&&(a.colorSpace=o),e[n]=a,a})}assignFinalMaterial(e){const n=e.geometry;let s=e.material;const o=n.attributes.tangent===void 0,i=n.attributes.color!==void 0,a=n.attributes.normal===void 0;if(e.isPoints){const r="PointsMaterial:"+s.uuid;let l=this.cache.get(r);l||(l=new ui,da.prototype.copy.call(l,s),l.color.copy(s.color),l.map=s.map,l.sizeAttenuation=!1,this.cache.add(r,l)),s=l}else if(e.isLine){const r="LineBasicMaterial:"+s.uuid;let l=this.cache.get(r);l||(l=new Xr,da.prototype.copy.call(l,s),l.color.copy(s.color),l.map=s.map,this.cache.add(r,l)),s=l}if(o||i||a){let r="ClonedMaterial:"+s.uuid+":";o&&(r+="derivative-tangents:"),i&&(r+="vertex-colors:"),a&&(r+="flat-shading:");let l=this.cache.get(r);l||(l=s.clone(),i&&(l.vertexColors=!0),a&&(l.flatShading=!0),o&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(r,l),this.associations.set(l,this.associations.get(s))),s=l}e.material=s}getMaterialType(){return zo}loadMaterial(e){const n=this,s=this.json,o=this.extensions,i=s.materials[e];let a;const r={},l=i.extensions||{},c=[];if(l[te.KHR_MATERIALS_UNLIT]){const f=o[te.KHR_MATERIALS_UNLIT];a=f.getMaterialType(),c.push(f.extendParams(r,i,n))}else{const f=i.pbrMetallicRoughness||{};if(r.color=new Q(1,1,1),r.opacity=1,Array.isArray(f.baseColorFactor)){const u=f.baseColorFactor;r.color.setRGB(u[0],u[1],u[2],Bt),r.opacity=u[3]}f.baseColorTexture!==void 0&&c.push(n.assignTexture(r,"map",f.baseColorTexture,ao)),r.metalness=f.metallicFactor!==void 0?f.metallicFactor:1,r.roughness=f.roughnessFactor!==void 0?f.roughnessFactor:1,f.metallicRoughnessTexture!==void 0&&(c.push(n.assignTexture(r,"metalnessMap",f.metallicRoughnessTexture)),c.push(n.assignTexture(r,"roughnessMap",f.metallicRoughnessTexture))),a=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,r)})))}i.doubleSided===!0&&(r.side=ze);const d=i.alphaMode||Ta.OPAQUE;if(d===Ta.BLEND?(r.transparent=!0,r.depthWrite=!1):(r.transparent=!1,d===Ta.MASK&&(r.alphaTest=i.alphaCutoff!==void 0?i.alphaCutoff:.5)),i.normalTexture!==void 0&&a!==dt&&(c.push(n.assignTexture(r,"normalMap",i.normalTexture)),r.normalScale=new ue(1,1),i.normalTexture.scale!==void 0)){const f=i.normalTexture.scale;r.normalScale.set(f,f)}if(i.occlusionTexture!==void 0&&a!==dt&&(c.push(n.assignTexture(r,"aoMap",i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(r.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==dt){const f=i.emissiveFactor;r.emissive=new Q().setRGB(f[0],f[1],f[2],Bt)}return i.emissiveTexture!==void 0&&a!==dt&&c.push(n.assignTexture(r,"emissiveMap",i.emissiveTexture,ao)),Promise.all(c).then(function(){const f=new a(r);return i.name&&(f.name=i.name),Ct(f,i),n.associations.set(f,{materials:e}),i.extensions&&hn(o,f,i),f})}createUniqueName(e){const n=Fc.sanitizeNodeName(e||"");return n in this.nodeNamesUsed?n+"_"+ ++this.nodeNamesUsed[n]:(this.nodeNamesUsed[n]=0,n)}loadGeometries(e){const n=this,s=this.extensions,o=this.primitiveCache;function i(r){return s[te.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(r,n).then(function(l){return tr(l,r,n)})}const a=[];for(let r=0,l=e.length;r<l;r++){const c=e[r],d=Vd(c),f=o[d];if(f)a.push(f.promise);else{let u;c.extensions&&c.extensions[te.KHR_DRACO_MESH_COMPRESSION]?u=i(c):u=tr(new go,c,n),o[d]={primitive:c,promise:u},a.push(u)}}return Promise.all(a)}loadMesh(e){const n=this,s=this.json,o=this.extensions,i=s.meshes[e],a=i.primitives,r=[];for(let l=0,c=a.length;l<c;l++){const d=a[l].material===void 0?Wd(this.cache):this.getDependency("material",a[l].material);r.push(d)}return r.push(n.loadGeometries(a)),Promise.all(r).then(function(l){const c=l.slice(0,l.length-1),d=l[l.length-1],f=[];for(let p=0,h=d.length;p<h;p++){const v=d[p],y=a[p];let w;const M=c[p];if(y.mode===Ze.TRIANGLES||y.mode===Ze.TRIANGLE_STRIP||y.mode===Ze.TRIANGLE_FAN||y.mode===void 0)w=i.isSkinnedMesh===!0?new Nc(v,M):new Re(v,M),w.isSkinnedMesh===!0&&w.normalizeSkinWeights(),y.mode===Ze.TRIANGLE_STRIP?w.geometry=Qi(w.geometry,Vr):y.mode===Ze.TRIANGLE_FAN&&(w.geometry=Qi(w.geometry,Fa));else if(y.mode===Ze.LINES)w=new Hc(v,M);else if(y.mode===Ze.LINE_STRIP)w=new Gc(v,M);else if(y.mode===Ze.LINE_LOOP)w=new zc(v,M);else if(y.mode===Ze.POINTS)w=new Xs(v,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+y.mode);Object.keys(w.geometry.morphAttributes).length>0&&Bd(w,i),w.name=n.createUniqueName(i.name||"mesh_"+e),Ct(w,i),y.extensions&&hn(o,w,y),n.assignFinalMaterial(w),f.push(w)}for(let p=0,h=f.length;p<h;p++)n.associations.set(f[p],{meshes:e,primitives:p});if(f.length===1)return i.extensions&&hn(o,f[0],i),f[0];const u=new Mn;i.extensions&&hn(o,u,i),n.associations.set(u,{meshes:e});for(let p=0,h=f.length;p<h;p++)u.add(f[p]);return u})}loadCamera(e){let n;const s=this.json.cameras[e],o=s[s.type];if(!o){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return s.type==="perspective"?n=new kc(Jt.radToDeg(o.yfov),o.aspectRatio||1,o.znear||1,o.zfar||2e6):s.type==="orthographic"&&(n=new Oa(-o.xmag,o.xmag,o.ymag,-o.ymag,o.znear,o.zfar)),s.name&&(n.name=this.createUniqueName(s.name)),Ct(n,s),Promise.resolve(n)}loadSkin(e){const n=this.json.skins[e],s=[];for(let o=0,i=n.joints.length;o<i;o++)s.push(this._loadNodeShallow(n.joints[o]));return n.inverseBindMatrices!==void 0?s.push(this.getDependency("accessor",n.inverseBindMatrices)):s.push(null),Promise.all(s).then(function(o){const i=o.pop(),a=o,r=[],l=[];for(let c=0,d=a.length;c<d;c++){const f=a[c];if(f){r.push(f);const u=new pt;i!==null&&u.fromArray(i.array,c*16),l.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',n.joints[c])}return new Wc(r,l)})}loadAnimation(e){const n=this.json,s=this,o=n.animations[e],i=o.name?o.name:"animation_"+e,a=[],r=[],l=[],c=[],d=[];for(let f=0,u=o.channels.length;f<u;f++){const p=o.channels[f],h=o.samplers[p.sampler],v=p.target,y=v.node,w=o.parameters!==void 0?o.parameters[h.input]:h.input,M=o.parameters!==void 0?o.parameters[h.output]:h.output;v.node!==void 0&&(a.push(this.getDependency("node",y)),r.push(this.getDependency("accessor",w)),l.push(this.getDependency("accessor",M)),c.push(h),d.push(v))}return Promise.all([Promise.all(a),Promise.all(r),Promise.all(l),Promise.all(c),Promise.all(d)]).then(function(f){const u=f[0],p=f[1],h=f[2],v=f[3],y=f[4],w=[];for(let x=0,m=u.length;x<m;x++){const S=u[x],b=p[x],D=h[x],R=v[x],T=y[x];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();const C=s._createAnimationTracks(S,b,D,R,T);if(C)for(let I=0;I<C.length;I++)w.push(C[I])}const M=new Uc(i,void 0,w);return Ct(M,o),M})}createNodeMesh(e){const n=this.json,s=this,o=n.nodes[e];return o.mesh===void 0?null:s.getDependency("mesh",o.mesh).then(function(i){const a=s._getNodeRef(s.meshCache,o.mesh,i);return o.weights!==void 0&&a.traverse(function(r){if(r.isMesh)for(let l=0,c=o.weights.length;l<c;l++)r.morphTargetInfluences[l]=o.weights[l]}),a})}loadNode(e){const n=this.json,s=this,o=n.nodes[e],i=s._loadNodeShallow(e),a=[],r=o.children||[];for(let c=0,d=r.length;c<d;c++)a.push(s.getDependency("node",r[c]));const l=o.skin===void 0?Promise.resolve(null):s.getDependency("skin",o.skin);return Promise.all([i,Promise.all(a),l]).then(function(c){const d=c[0],f=c[1],u=c[2];u!==null&&d.traverse(function(p){p.isSkinnedMesh&&p.bind(u,jd)});for(let p=0,h=f.length;p<h;p++)d.add(f[p]);return d})}_loadNodeShallow(e){const n=this.json,s=this.extensions,o=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const i=n.nodes[e],a=i.name?o.createUniqueName(i.name):"",r=[],l=o._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&r.push(l),i.camera!==void 0&&r.push(o.getDependency("camera",i.camera).then(function(c){return o._getNodeRef(o.cameraCache,i.camera,c)})),o._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){r.push(c)}),this.nodeCache[e]=Promise.all(r).then(function(c){let d;if(i.isBone===!0?d=new Bc:c.length>1?d=new Mn:c.length===1?d=c[0]:d=new jr,d!==c[0])for(let f=0,u=c.length;f<u;f++)d.add(c[f]);if(i.name&&(d.userData.name=i.name,d.name=a),Ct(d,i),i.extensions&&hn(s,d,i),i.matrix!==void 0){const f=new pt;f.fromArray(i.matrix),d.applyMatrix4(f)}else i.translation!==void 0&&d.position.fromArray(i.translation),i.rotation!==void 0&&d.quaternion.fromArray(i.rotation),i.scale!==void 0&&d.scale.fromArray(i.scale);if(!o.associations.has(d))o.associations.set(d,{});else if(i.mesh!==void 0&&o.meshCache.refs[i.mesh]>1){const f=o.associations.get(d);o.associations.set(d,{...f})}return o.associations.get(d).nodes=e,d}),this.nodeCache[e]}loadScene(e){const n=this.extensions,s=this.json.scenes[e],o=this,i=new Mn;s.name&&(i.name=o.createUniqueName(s.name)),Ct(i,s),s.extensions&&hn(n,i,s);const a=s.nodes||[],r=[];for(let l=0,c=a.length;l<c;l++)r.push(o.getDependency("node",a[l]));return Promise.all(r).then(function(l){for(let d=0,f=l.length;d<f;d++)i.add(l[d]);const c=d=>{const f=new Map;for(const[u,p]of o.associations)(u instanceof da||u instanceof ki)&&f.set(u,p);return d.traverse(u=>{const p=o.associations.get(u);p!=null&&f.set(u,p)}),f};return o.associations=c(i),i})}_createAnimationTracks(e,n,s,o,i){const a=[],r=e.name?e.name:e.uuid,l=[];Zt[i.path]===Zt.weights?e.traverse(function(u){u.morphTargetInfluences&&l.push(u.name?u.name:u.uuid)}):l.push(r);let c;switch(Zt[i.path]){case Zt.weights:c=Ui;break;case Zt.rotation:c=Bi;break;case Zt.translation:case Zt.scale:c=Wi;break;default:s.itemSize===1?c=Ui:c=Wi;break}const d=o.interpolation!==void 0?kd[o.interpolation]:qr,f=this._getArrayFromAccessor(s);for(let u=0,p=l.length;u<p;u++){const h=new c(l[u]+"."+Zt[i.path],n.array,f,d);o.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(h),a.push(h)}return a}_getArrayFromAccessor(e){let n=e.array;if(e.normalized){const s=ka(n.constructor),o=new Float32Array(n.length);for(let i=0,a=n.length;i<a;i++)o[i]=n[i]*s;n=o}return n}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(s){const o=this instanceof Bi?zd:dl;return new o(this.times,this.values,this.getValueSize()/3,s)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Xd(t,e,n){const s=e.attributes,o=new Xc;if(s.POSITION!==void 0){const r=n.json.accessors[s.POSITION],l=r.min,c=r.max;if(l!==void 0&&c!==void 0){if(o.set(new H(l[0],l[1],l[2]),new H(c[0],c[1],c[2])),r.normalized){const d=ka(Qn[r.componentType]);o.min.multiplyScalar(d),o.max.multiplyScalar(d)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const i=e.targets;if(i!==void 0){const r=new H,l=new H;for(let c=0,d=i.length;c<d;c++){const f=i[c];if(f.POSITION!==void 0){const u=n.json.accessors[f.POSITION],p=u.min,h=u.max;if(p!==void 0&&h!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(h[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(h[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(h[2]))),u.normalized){const v=ka(Qn[u.componentType]);l.multiplyScalar(v)}r.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}o.expandByVector(r)}t.boundingBox=o;const a=new Ur;o.getCenter(a.center),a.radius=o.min.distanceTo(o.max)/2,t.boundingSphere=a}function tr(t,e,n){const s=e.attributes,o=[];function i(a,r){return n.getDependency("accessor",a).then(function(l){t.setAttribute(r,l)})}for(const a in s){const r=za[a]||a.toLowerCase();r in t.attributes||o.push(i(s[a],r))}if(e.indices!==void 0&&!t.index){const a=n.getDependency("accessor",e.indices).then(function(r){t.setIndex(r)});o.push(a)}return Vi.workingColorSpace!==Bt&&"COLOR_0"in s&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Vi.workingColorSpace}" not supported.`),Ct(t,e),Xd(t,e,n),Promise.all(o).then(function(){return e.targets!==void 0?Ud(t,e.targets,n):t})}const fl=new cl,Ss={},Wo={};function St(t,e={}){return Ss[t]?Promise.resolve(Ss[t]):(zn[t]||(zn[t]=new Promise((n,s)=>{fl.load(t,o=>{const i=[];o.scene.traverse(a=>{if(a.isMesh){const r=a.rotation.clone();if(e.rotationCorrection){const{x:l=0,y:c=0,z:d=0}=e.rotationCorrection;r.x+=l,r.y+=c,r.z+=d}i.push({geometry:a.geometry,material:a.material,position:a.position.clone(),rotation:r,scale:a.scale.clone(),castShadow:!0,receiveShadow:!0})}}),Ss[t]=i,delete zn[t],n(i)},void 0,o=>{console.error(`Failed to preload model ${t}:`,o),delete zn[t],s(o)})})),zn[t])}function Cs(t){return new Promise((e,n)=>{fl.load(t,s=>{s.scene.traverse(o=>{o.userData={}}),Wo[t]={scene:s.scene,animations:s.animations},e(Wo[t])},void 0,s=>{console.error(`Failed to preload GLTF ${t}:`,s),n(s)})})}const zn={};let ps=!1,nr=!1;function n0(){return St("./models/win-state/palm_tree.glb",{rotationCorrection:{x:-Math.PI/2,y:0,z:0}})}function o0(){return ps||nr?Promise.resolve():(ps=!0,Promise.all([St("./models/win-state/palm_tree.glb",{rotationCorrection:{x:-Math.PI/2,y:0,z:0}}),St("./models/win-state/ivory-cane-palm.glb"),St("./models/win-state/olive-palm.glb"),St("./models/win-state/tall-grass.glb"),St("./models/win-state/grass.glb"),St("./models/win-state/fern.glb"),St("./models/win-state/lady-palm.glb"),St("./models/win-state/bismarck-palm.glb"),St("./models/win-state/banana-tree.glb"),Cs("./models/creatures/seagulls-flock.glb"),Cs("./models/creatures/seagulls-spiral.glb"),Cs("./models/creatures/seagull-1.glb")]).then(()=>{nr=!0,ps=!1}).catch(t=>{ps=!1,console.error("Error preloading models:",t)}))}function s0(){return Ss}function qd(){return Wo}function at(t){return Wo[t]?Promise.resolve(Wo[t]):Cs(t)}function a0(){return Promise.all([at("./models/creatures/shark.glb"),at("./models/creatures/manta-ray.glb"),at("./models/creatures/whale.glb"),at("./models/creatures/dolphin.glb"),at("./models/creatures/container-ship.glb"),at("./models/creatures/sailboat.glb"),at("./models/creatures/mayan-temple.glb"),at("./models/creatures/whale_shark.glb"),at("./models/creatures/sail-fish.glb"),at("./models/creatures/firefly_squid.glb"),at("./models/creatures/green_turtle.glb")]).then(()=>{})}function Zd(){const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d"),n=e.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,"rgba(255, 255, 255, 1.0)"),n.addColorStop(.5,"rgba(255, 255, 255, 0.5)"),n.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=n,e.fillRect(0,0,64,64);const s=new Jo(t);return s.needsUpdate=!0,s}const Qd=Zd(),Uo=8,Jd=4.3,Wa=90,Ua=500,Ba=200,$d=18;let En=[],Be=[],tn=[],Ve=[],$o=[],Sn=[],Qe=[],vo=[],wn=null,ve=null,Jn=null,Ne=[],he=null,$n=null,He=[];const Je=new pt,Qs=new Yt,ln=new H;let or=0,sr=1,ar=1;function i0(){const t=new Ps(.05,8,8),e=new je({transparent:!0,depthWrite:!1,uniforms:{color:{value:new Q(8965375)}},vertexShader:`
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
    `});ve=new In(t,e,Ua),ve.renderOrder=2,ve.isPersistent=!0,Jn=new Float32Array(Ua),ve.geometry.setAttribute("instanceOpacity",new We(Jn,1)),ve.count=0;const n=new Ps(.06,8,8),s=new je({transparent:!0,depthWrite:!1,uniforms:{color:{value:new Q(6737151)}},vertexShader:`
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
    `});he=new In(n,s,Ba),he.renderOrder=4,he.isPersistent=!0,$n=new Float32Array(Ba),he.geometry.setAttribute("instanceOpacity",new We($n,1)),he.count=0,En=[],Be=[],tn=[],Ve=[],$o=[],Sn=[],Ne=[],He=[],Qe=[],vo=[],wn=null}function r0(t,e,n,s="day"){const o=e.length;Qe=new Array(o).fill(0),vo=new Array(o).fill(0);for(let i=0;i<o;i++){const a=e[i],{beamMesh:r,beamMaterial:l}=ef(a);t.add(r),En.push(r),Be.push(l);const c=tf(a,n,s);t.add(c),tn.push(c);const{particles:d,particleVelocities:f}=nf(a);t.add(d),Ve.push(d),$o.push(f)}ve&&!ve.parent&&t.add(ve),he&&!he.parent&&t.add(he)}function ef(t){const e=new qc(1.5,1.5,Uo,32,1,!0),n=new je({transparent:!0,side:ze,depthWrite:!1,depthTest:!0,vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uPulseIntensity;
      uniform float uFillProgress;
      uniform vec3 uFillColor;
      varying vec2 vUv;

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

        // Base beam (always visible)
        vec3 color = uColor;
        float alpha = heightFade * pulse * edgeGlow * (0.4 + triggerPulse);

        // Blue fill rising from bottom (soft gradient at top edge)
        float belowFill = smoothstep(uFillProgress + 0.15, uFillProgress - 0.05, vUv.y);
        color = mix(color, uFillColor, belowFill * 0.85);
        alpha += belowFill * 0.35;

        // Boost color brightness during pulse
        color = color * (1.0 + triggerPulse * 0.5);

        gl_FragColor = vec4(color, alpha);
      }
    `,uniforms:{uTime:{value:0},uColor:{value:new H(1,1,0)},uPulseIntensity:{value:0},uFillProgress:{value:0},uFillColor:{value:new H(0,.33,.85)}}}),s=new Re(e,n);return s.position.set(t.x,Uo/2,t.z),s.renderOrder=5,{beamMesh:s,beamMaterial:n}}function tf(t,e,n="day"){const o=ed({startX:t.x,startZ:t.z,endX:t.x,endZ:t.z,cloudTexture:e,rainCount:200,cloudHeight:16,timeOfDay:n}),i=o.userData.cloud,a=o.userData.cloudMaterial;return i.scale.set(1.26,.42,1.6),n!=="night"&&a.uniforms.base.value.setRGB(.8,.9,1),a.uniforms.threshold.value=.25,a.uniforms.opacity.value=0,i.visible=!1,i.renderOrder=10,a.depthTest=!1,o}function nf(t){const e=new go,n=new Float32Array(Wa*3),s=[];for(let a=0;a<Wa;a++){const r=Math.random()*Math.PI*2,l=Math.random()*1.3;n[a*3]=Math.cos(r)*l,n[a*3+1]=Math.random()*Uo,n[a*3+2]=Math.sin(r)*l,s.push({y:.5+Math.random()*1,angle:r,radius:l,angleSpeed:(Math.random()-.5)*.5})}e.setAttribute("position",new Le(n,3));const o=new ui({color:16776960,size:.18,transparent:!0,opacity:.6,blending:_n,depthWrite:!1,map:Qd}),i=new Xs(e,o);return i.position.set(t.x,0,t.z),{particles:i,particleVelocities:s}}function l0(t,e,n,s){if(or^=1,or===1)return;const o=t*2,i=Math.sin(Date.now()*.003)*.1+.9,a=En.length,r=a>0&&n>0?n*s/a:1;for(let l=0;l<a;l++){const c=Math.min((vo[l]||0)/r,1);e&&e[l]&&(e[l].emissiveIntensity=i*.5+c*.3+(Qe[l]||0)),Be[l].uniforms.uTime.value+=o,Be[l].uniforms.uFillProgress.value=c,Qe[l]>0&&(Qe[l]-=o*Jd,Qe[l]=Math.max(0,Qe[l])),Be[l].uniforms.uPulseIntensity.value=Qe[l];const d=1+Qe[l]*.04;En[l].scale.set(d,1,d),Ve[l]&&Ve[l].material&&(Ve[l].material.opacity=.6+c*.2,Ve[l].material.size=.18+c*.08)}}function c0(t){if(sr^=1,sr===1)return;const e=t*2,n=Ve.length;for(let s=0;s<n;s++){if(!Ve[s].visible)continue;const o=Ve[s].geometry,i=$o[s],a=o.attributes.position.array,r=Be[s]?Be[s].uniforms.uFillProgress.value:0,l=.5+r*1;for(let c=0;c<Wa;c++){const d=i[c];a[c*3+1]+=d.y*e*l,d.angle+=d.angleSpeed*e*(.7+r*.6),a[c*3]=Math.cos(d.angle)*d.radius,a[c*3+2]=Math.sin(d.angle)*d.radius,a[c*3+1]>Uo&&(a[c*3+1]=0)}o.attributes.position.needsUpdate=!0}}function u0(t,e,n,s,o,i){const a=e.length;t.forEach(r=>{if(!r.active||r.isEvaporating)return;const l=r.body.translation();let c=1/0,d=-1;for(let f=0;f<a;f++){const u=l.x-e[f].x,p=l.z-e[f].z,h=u*u+p*p;h<c&&(c=h,d=f)}if(c<1.5*1.5&&!s.has(r)){s.add(r),o(),Qe[d]=1,vo[d]+=r.originalMass||1,i();const u=r.body.translation().y;if(r.body){try{n.removeRigidBody(r.body)}catch{}r.body=null,r.collider=null}r.isEvaporating=!0,r.isOnGround=!1,Ga(r.instanceIndex,"aVelocity",0,0,0),Sn.push({ball:r,targetIndex:d,startY:u,targetY:Uo,progress:0,originalScale:1,particleEmitter:{particles:[],lastEmitTime:0}})}})}function d0(t,e,n){for(let s=Sn.length-1;s>=0;s--){const o=Sn[s],i=o.ball,a=n[o.targetIndex];o.progress+=e*.3;const r=Math.min(o.progress,1),l=r*r*(3-2*r);i.position.y=o.startY+(o.targetY-o.startY)*l,i.position.x+=(a.x-i.position.x)*e*2,i.position.z+=(a.z-i.position.z)*e*2,qs(i.instanceIndex,i.position.x,i.position.y,i.position.z);const c=.6;if(r>c){const u=1-(r-c)/(1-c);i.visualScale=u,ct(i.instanceIndex,"aVisualScale",u)}const d=Date.now();if(d-o.particleEmitter.lastEmitTime>30&&ve&&Ne.length<Ua){const f=Math.random()*Math.PI*2,u=Math.random()*i.radius*.8,p={x:i.position.x+Math.cos(f)*u,y:i.position.y+(Math.random()-.5)*i.radius,z:i.position.z+Math.sin(f)*u},h=Ne.length,v={instanceIndex:h,position:p,velocity:{x:(Math.random()-.5)*.5,y:1+Math.random()*.5,z:(Math.random()-.5)*.5},life:0,maxLife:.8,initialScale:1};Ne.push(v),o.particleEmitter.particles.push(v),ln.set(1,1,1),Je.compose(p,Qs,ln),ve.setMatrixAt(h,Je),Jn[h]=.6,ve.count=Ne.length,o.particleEmitter.lastEmitTime=d}r>=1&&(el(i.instanceIndex),i.active=!1,o.particleEmitter.particles=[],Sn.splice(s,1))}of(e)}function of(t){if(!ve||Ne.length===0||(ar^=1,ar===1))return;const e=t*2;let n=!1,s=!1,o=0;for(;o<Ne.length;){const i=Ne[o];if(i.life+=e,i.life>=i.maxLife){const c=Ne.length-1;if(o!==c){const d=Ne[c];Ne[o]=d,d.instanceIndex=o,ve.getMatrixAt(c,Je),ve.setMatrixAt(o,Je),Jn[o]=Jn[c],n=!0,s=!0}Ne.pop(),ve.count=Ne.length;continue}i.position.x+=i.velocity.x*e,i.position.y+=i.velocity.y*e,i.position.z+=i.velocity.z*e;const a=i.life/i.maxLife,r=.6*(1-a),l=i.initialScale*(1-a*.5);ln.set(l,l,l),Je.compose(i.position,Qs,ln),ve.setMatrixAt(i.instanceIndex,Je),n=!0,Jn[i.instanceIndex]=r,s=!0,o++}n&&(ve.instanceMatrix.needsUpdate=!0),s&&(ve.geometry.attributes.instanceOpacity.needsUpdate=!0)}function hl(t,e=.3,n=null){if(!he)return;const o=Math.max(4,Math.round((n??$d)*Math.min(1,e/.3)));for(let i=0;i<o&&!(He.length>=Ba);i++){const a=Math.random()*Math.PI*2,r=Math.random()*Math.PI*.6+Math.PI*.2,l=Math.sin(r)*Math.cos(a),c=Math.cos(r)*.5+.3,d=Math.sin(r)*Math.sin(a),f=e*.3,u={x:t.x+l*f,y:t.y+c*f,z:t.z+d*f},p=2.5+Math.random()*2,h={x:l*p,y:c*p+1,z:d*p},v=He.length,y={instanceIndex:v,position:u,velocity:h,life:0,maxLife:.4+Math.random()*.3,initialScale:.8+Math.random()*.4,gravity:-8};He.push(y);const w=y.initialScale;ln.set(w,w,w),Je.compose(u,Qs,ln),he.setMatrixAt(v,Je),$n[v]=.8}he.count=He.length,he.instanceMatrix.needsUpdate=!0,he.geometry.attributes.instanceOpacity.needsUpdate=!0}function f0(t){if(!he||He.length===0)return;let e=!1,n=!1,s=0;for(;s<He.length;){const o=He[s];if(o.life+=t,o.life>=o.maxLife){const l=He.length-1;if(s!==l){const c=He[l];He[s]=c,c.instanceIndex=s,he.getMatrixAt(l,Je),he.setMatrixAt(s,Je),$n[s]=$n[l],e=!0,n=!0}He.pop(),he.count=He.length;continue}o.velocity.y+=o.gravity*t,o.position.x+=o.velocity.x*t,o.position.y+=o.velocity.y*t,o.position.z+=o.velocity.z*t;const i=o.life/o.maxLife,a=.8*(1-i),r=o.initialScale*(1-i*.3);ln.set(r,r,r),Je.compose(o.position,Qs,ln),he.setMatrixAt(o.instanceIndex,Je),e=!0,$n[o.instanceIndex]=a,n=!0,s++}e&&(he.instanceMatrix.needsUpdate=!0),n&&(he.geometry.attributes.instanceOpacity.needsUpdate=!0)}function h0(t,e,n,s,o){const i=tn.length,a=1600,r=n?Date.now()-s:0;if(n&&r>=a)for(let f=0;f<i;f++){const u=tn[f],p=u.userData.cloud,h=u.userData.cloudMaterial;p.visible=!0,td(u,t,e),h.uniforms.steps.value=Math.min(h.uniforms.steps.value,15),p.rotation.y+=e*.1;const v=p.scale.x,y=v+(8-v)*e*1.5;p.scale.set(y,y*.6,y);const w=h.uniforms.opacity.value,M=isNaN(w)?.046:w+(.046-w)*e*1.15;h.uniforms.opacity.value=M,nd(u,e),od(u,.6)}else for(let l=0;l<i;l++){const c=tn[l];c.userData.cloud.visible=!1}if(n&&o){if(!wn){wn=[];for(let u=0;u<i;u++)wn.push(Be[u].uniforms.uFillProgress.value)}const c=Math.min(r/1200,1),d=c*c,f=c>=1;for(let u=0;u<i;u++)if(f)Be[u].uniforms.uFillProgress.value=0,Be[u].uniforms.uColor.value.set(0,1,.3),Ve[u].visible=!0;else{const p=wn[u]||0;Be[u].uniforms.uFillProgress.value=p*(1-d)}}}function p0(t){[...En].forEach(e=>{t.remove(e),e.geometry.dispose(),e.material.dispose()}),En.length=0,Be.length=0,[...tn].forEach(e=>{t.remove(e),e.userData.cloud&&(e.userData.cloud.geometry.dispose(),e.userData.cloud.material.dispose())}),tn.length=0,[...Ve].forEach(e=>{t.remove(e),e.geometry.dispose(),e.material.dispose()}),Ve.length=0,$o.length=0,Ne.length=0,ve&&(ve.count=0),He.length=0,he&&(he.count=0),Sn.length=0,Qe=[],vo=[],wn=null}function m0(){En=[],Be=[],tn=[],Ve=[],$o=[],Sn=[],Ne=[],He=[],ve&&(ve.count=0),he&&(he.count=0),Qe=[],vo=[],wn=null}const Io=300,Eo=50,pl=1.5,ml=1.2,sf=3;let _e=[],xe=[],de=null,se=null,Cn=null,ae=null,Rn=null,Js=null,Va=null;const Oe=new pt,Pn=new Yt,tt=new H;new H;new H;const ir=new Yt;function g0(t,e){Js=t,Va=e;const n=new Go(1,1),s=new je({transparent:!0,depthWrite:!1,blending:Br,side:ze,uniforms:{baseColor:{value:new Q(13935988)}},vertexShader:`
      attribute float instanceOpacity;
      attribute vec3 instanceColor;
      varying float vOpacity;
      varying vec3 vColor;
      varying vec2 vUv;

      void main() {
        vOpacity = instanceOpacity;
        vColor = instanceColor;
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 baseColor;
      varying float vOpacity;
      varying vec3 vColor;
      varying vec2 vUv;

      void main() {
        // Use instance color if available, otherwise use base color
        vec3 finalColor = length(vColor) > 0.0 ? vColor : baseColor;

        // Create soft dust-like appearance with radial gradient
        vec2 center = vUv - 0.5;
        float dist = length(center) * 2.0;
        float dustAlpha = 1.0 - smoothstep(0.0, 1.0, dist);
        dustAlpha = pow(dustAlpha, 1.5); // Softer edges

        gl_FragColor = vec4(finalColor, vOpacity * dustAlpha);
      }
    `});se=new In(n,s,Io),se.renderOrder=2,se.count=0,se.isPersistent=!0,Cn=new Float32Array(Io);const o=new Float32Array(Io*3);se.geometry.setAttribute("instanceOpacity",new We(Cn,1)),se.geometry.setAttribute("instanceColor",new We(o,3)),t.add(se);const i=new Wr(.15,.15,.15),a=new je({transparent:!0,depthWrite:!1,uniforms:{baseColor:{value:new Q(11045226)}},vertexShader:`
      attribute float instanceOpacity;
      attribute vec3 instanceColor;
      varying float vOpacity;
      varying vec3 vColor;

      void main() {
        vOpacity = instanceOpacity;
        vColor = instanceColor;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 baseColor;
      varying float vOpacity;
      varying vec3 vColor;

      void main() {
        vec3 finalColor = length(vColor) > 0.0 ? vColor : baseColor;
        gl_FragColor = vec4(finalColor, vOpacity);
      }
    `});ae=new In(i,a,Eo),ae.renderOrder=2,ae.count=0,ae.isPersistent=!0,Rn=new Float32Array(Eo);const r=new Float32Array(Eo*3);ae.geometry.setAttribute("instanceOpacity",new We(Rn,1)),ae.geometry.setAttribute("instanceColor",new We(r,3)),t.add(ae);const l=new Zc(1.46,32),c=new je({transparent:!0,depthWrite:!1,blending:_n,uniforms:{color:{value:new Q(1,.6,.2)},intensity:{value:0}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,fragmentShader:`
      uniform vec3 color;
      uniform float intensity;
      varying vec2 vUv;

      void main() {
        // Concentrated radial falloff - bright center, soft edge
        float dist = length(vUv - 0.5) * 2.0;
        float alpha = 1.0 - smoothstep(0.0, 0.85, dist);
        alpha = alpha * alpha * intensity;

        gl_FragColor = vec4(color, alpha * 0.9);
      }
    `});de=new Re(l,c),de.rotation.x=-Math.PI/2,de.visible=!1,de.isPersistent=!0,t.add(de),_e=[],xe=[]}function Os(t,e,n=1,s=null){if(!t||!Js)return;const o=s||new Q(15258817);uf(t,e,n,o),Math.random()<(e?.7:.3)*n&&df(t,e,n,o),cf(t,e,n)}function rr(t,e,n,s=null){if(!t||!Js)return;const o=s||new Q(15258817),i=n===2?40:25,a=n===2?15:8,r=n===2?1.5:1;af(t,e,i,o,r),rf(t,e,a,o,r),lf(t,e,n)}function af(t,e,n,s,o){if(se){for(let i=0;i<n;i++){let a,r=!1;_e.length>=Io?(a=0,r=!0):a=_e.length;const l=i/n*Math.PI*2+Math.random()*.3,c=e*(.5+Math.random()*.5),d=new H(t.x+Math.cos(l)*c,t.y+Math.random()*.3,t.z+Math.sin(l)*c),f=(2.5+Math.random()*2)*o,u=(3+Math.random()*2.5)*o,p=new H(Math.cos(l)*f,u,Math.sin(l)*f),h=Math.random()<.25,v=Math.random()*Math.PI*2,y=1+Math.random()*.8,w=h?new H(Math.cos(v)*y,0,Math.sin(v)*y):null,M={instanceIndex:a,position:d.clone(),velocity:p,life:0,maxLife:pl*(1+Math.random()*.5),initialSize:.45*(.8+Math.random()*.6),color:s.clone(),isFloating:h,windDirection:w};r?_e[0]=M:_e.push(M),tt.set(M.initialSize,M.initialSize,M.initialSize),Oe.compose(d,Pn,tt),se.setMatrixAt(a,Oe),Cn[a]=.4,se.geometry.attributes.instanceColor.setXYZ(a,s.r,s.g,s.b),se.count=_e.length}se.instanceMatrix.needsUpdate=!0,se.geometry.attributes.instanceOpacity.needsUpdate=!0,se.geometry.attributes.instanceColor.needsUpdate=!0}}function rf(t,e,n,s,o){if(ae){for(let i=0;i<n;i++){let a,r=!1;xe.length>=Eo?(a=0,r=!0):a=xe.length;const l=i/n*Math.PI*2+Math.random()*.4,c=e*(.3+Math.random()*.7),d=new H(t.x+Math.cos(l)*c,t.y+.2,t.z+Math.sin(l)*c),f=(3+Math.random()*2.5)*o,u=(4+Math.random()*3)*o,p=new H(Math.cos(l)*f,u,Math.sin(l)*f),h=new H((Math.random()-.5)*15,(Math.random()-.5)*15,(Math.random()-.5)*15),v={instanceIndex:a,position:d.clone(),velocity:p,angularVelocity:h,rotation:new Ks(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),life:0,maxLife:ml*(1+Math.random()*.5),initialSize:.5*(.7+Math.random()*.6),color:s.clone().multiplyScalar(.85),onGround:!1,groundTime:0};r?xe[0]=v:xe.push(v),Pn.setFromEuler(v.rotation),tt.set(v.initialSize,v.initialSize,v.initialSize),Oe.compose(d,Pn,tt),ae.setMatrixAt(a,Oe),Rn[a]=.95,ae.geometry.attributes.instanceColor.setXYZ(a,v.color.r,v.color.g,v.color.b),ae.count=xe.length}ae.instanceMatrix.needsUpdate=!0,ae.geometry.attributes.instanceOpacity.needsUpdate=!0,ae.geometry.attributes.instanceColor.needsUpdate=!0}}function lf(t,e,n){if(!de)return;de.position.set(t.x,t.y+.1,t.z),de.visible=!0;const s=e*.8;de.scale.set(s,s,1),n===2?de.material.uniforms.color.value.setRGB(1,.8,.2):de.material.uniforms.color.value.setRGB(1,.5,.1),de.material.uniforms.intensity.value=n===2?1.5:1.2}function cf(t,e,n){de&&(de.position.set(t.x,t.y+.1,t.z),de.visible=!0,e?de.material.uniforms.color.value.setRGB(1,.4,.2):de.material.uniforms.color.value.setRGB(.4,.8,1),de.material.uniforms.intensity.value=Math.min(1,n*1.2))}function uf(t,e,n,s){if(!se)return;const o=Math.floor((e?8:4)*n);for(let i=0;i<o;i++){let a,r=!1;_e.length>=Io?(a=0,r=!0):a=_e.length;const l=Math.random()*Math.PI*2,c=e?2.5:1.5,d=e?3.5:2,f=new H(Math.cos(l)*c*(.5+Math.random()*.5),d*(.7+Math.random()*.3),Math.sin(l)*c*(.5+Math.random()*.5)),u=Math.random()*.5,p=Math.random()*Math.PI*2,h=new H(t.x+Math.cos(p)*u,t.y+Math.random()*.2,t.z+Math.sin(p)*u),v=Math.random()<.18,y=Math.random()*Math.PI*2,w=1.5+Math.random()*1,M=v?new H(Math.cos(y)*w,0,Math.sin(y)*w):null,x={instanceIndex:a,position:h.clone(),velocity:f,life:0,maxLife:pl*(.8+Math.random()*.4),initialSize:.35*(.8+Math.random()*.6),color:s.clone(),isFloating:v,windDirection:M};r?_e[0]=x:_e.push(x),tt.set(x.initialSize,x.initialSize,x.initialSize),Oe.compose(h,Pn,tt),se.setMatrixAt(a,Oe),Cn[a]=.3,se.geometry.attributes.instanceColor.setXYZ(a,s.r,s.g,s.b),se.count=_e.length}se.instanceMatrix.needsUpdate=!0,se.geometry.attributes.instanceOpacity.needsUpdate=!0,se.geometry.attributes.instanceColor.needsUpdate=!0}function df(t,e,n,s){if(!ae)return;const o=Math.floor((e?3:1)*n);for(let i=0;i<o;i++){let a,r=!1;xe.length>=Eo?(a=0,r=!0):a=xe.length;const l=Math.random()*Math.PI*2,c=1.5+Math.random()*1.5,d=new H(Math.cos(l)*c,2.5+Math.random()*1.5,Math.sin(l)*c),f=new H((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10),u=t.clone();u.y+=.2;const p={instanceIndex:a,position:u.clone(),velocity:d,angularVelocity:f,rotation:new Ks(0,0,0),life:0,maxLife:ml*(.8+Math.random()*.4),initialSize:.4*(.8+Math.random()*.4),color:s.clone().multiplyScalar(.8),onGround:!1,groundTime:0};r?xe[0]=p:xe.push(p),tt.set(p.initialSize,p.initialSize,p.initialSize),Oe.compose(u,Pn,tt),ae.setMatrixAt(a,Oe),Rn[a]=.9,ae.geometry.attributes.instanceColor.setXYZ(a,p.color.r,p.color.g,p.color.b),ae.count=xe.length}ae.instanceMatrix.needsUpdate=!0,ae.geometry.attributes.instanceOpacity.needsUpdate=!0,ae.geometry.attributes.instanceColor.needsUpdate=!0}function v0(t){ff(t),hf(t),pf(t)}function ff(t){if(!se||_e.length===0)return;let e=!1,n=!1,s=!1;const o=-9.8*t,i=2.5*t;Va&&ir.copy(Va.quaternion);let a=0;for(;a<_e.length;){const r=_e[a];if(r.life+=t,r.life>=r.maxLife){const f=_e.length-1;if(a!==f){const u=_e[f];_e[a]=u,u.instanceIndex=a,se.getMatrixAt(f,Oe),se.setMatrixAt(a,Oe),Cn[a]=Cn[f];const p=se.geometry.attributes.instanceColor;p.setXYZ(a,p.getX(f),p.getY(f),p.getZ(f)),s=!0,e=!0,n=!0}_e.pop(),se.count=_e.length;continue}r.isFloating?(r.velocity.y+=i,r.windDirection&&(r.velocity.x+=r.windDirection.x*t,r.velocity.z+=r.windDirection.z*t)):r.velocity.y+=o,r.velocity.multiplyScalar(.95),r.position.x+=r.velocity.x*t,r.position.y+=r.velocity.y*t,r.position.z+=r.velocity.z*t;const l=r.life/r.maxLife,c=.23*(1-l),d=r.initialSize*(1+l*2);tt.set(d,d,d),Oe.compose(r.position,ir,tt),se.setMatrixAt(r.instanceIndex,Oe),e=!0,Cn[r.instanceIndex]=c,n=!0,a++}e&&(se.instanceMatrix.needsUpdate=!0),n&&(se.geometry.attributes.instanceOpacity.needsUpdate=!0),s&&(se.geometry.attributes.instanceColor.needsUpdate=!0)}function hf(t){if(!ae||xe.length===0)return;let e=!1,n=!1,s=!1;const o=-9.8*t;let i=0;for(;i<xe.length;){const a=xe[i];if(a.life+=t,a.life>=a.maxLife){const c=xe.length-1;if(i!==c){const d=xe[c];xe[i]=d,d.instanceIndex=i,ae.getMatrixAt(c,Oe),ae.setMatrixAt(i,Oe),Rn[i]=Rn[c];const f=ae.geometry.attributes.instanceColor;f.setXYZ(i,f.getX(c),f.getY(c),f.getZ(c)),s=!0,e=!0,n=!0}xe.pop(),ae.count=xe.length;continue}if(a.onGround)a.groundTime+=t,a.life+=t*2;else{a.velocity.y+=o,a.position.x+=a.velocity.x*t,a.position.y+=a.velocity.y*t,a.position.z+=a.velocity.z*t,a.rotation.x+=a.angularVelocity.x*t,a.rotation.y+=a.angularVelocity.y*t,a.rotation.z+=a.angularVelocity.z*t,a.angularVelocity.multiplyScalar(.95);const c=-1;a.position.y<=c&&(a.position.y=c,Math.abs(a.velocity.y)<2?(a.onGround=!0,a.velocity.set(0,0,0),a.angularVelocity.set(0,0,0)):(a.velocity.y*=-.3,a.velocity.x*=.5,a.velocity.z*=.5))}const l=.9*(1-a.life/a.maxLife);Pn.setFromEuler(a.rotation),tt.set(a.initialSize,a.initialSize,a.initialSize),Oe.compose(a.position,Pn,tt),ae.setMatrixAt(a.instanceIndex,Oe),e=!0,Rn[a.instanceIndex]=l,n=!0,i++}e&&(ae.instanceMatrix.needsUpdate=!0),n&&(ae.geometry.attributes.instanceOpacity.needsUpdate=!0),s&&(ae.geometry.attributes.instanceColor.needsUpdate=!0)}function pf(t){if(!de)return;const e=de.material.uniforms.intensity.value;if(e>0){const n=e-t*sf;de.material.uniforms.intensity.value=Math.max(0,n),n<=0&&(de.visible=!1)}}const it=new Q,rt=new Q,Ca=new Q,lr=new Q(15258817);function Me(t,e){return t.setRGB(e.value.x,e.value.y,e.value.z)}function eo(t,e){if(!t||!e)return Ca.copy(lr);const n=t.material;if(!n||!n.uniforms)return Ca.copy(lr);const s=n.uniforms,o=e.y;let i;return o<-16?(i=Math.max(0,Math.min(1,(o+16)/6)),i=i*i*(3-2*i),Me(it,s.oceanDeepColor),Me(rt,s.oceanMidColor)):o<-10?(i=(o+16)/6,Me(it,s.oceanDeepColor),Me(rt,s.oceanMidColor)):o<-4?(i=(o+10)/6,Me(it,s.oceanMidColor),Me(rt,s.deepColor)):o<-3?(i=(o+4)/1,Me(it,s.deepColor),Me(rt,s.shallowColor)):o<-1?(i=(o+3)/2,Me(it,s.shallowColor),Me(rt,s.lowColor)):o<.5?(i=(o+1)/1.5,Me(it,s.lowColor),Me(rt,s.midLowColor)):o<1.5?(i=(o-.5)/1,Me(it,s.midLowColor),Me(rt,s.midColor)):o<2.5?(i=(o-1.5)/1,Me(it,s.midColor),Me(rt,s.midHighColor)):o<3.5?(i=(o-2.5)/1,Me(it,s.midHighColor),Me(rt,s.highColor)):(i=Math.min((o-3.5)/2,1),Me(it,s.highColor),Me(rt,s.peakColor)),Ca.copy(it).lerp(rt,i)}function y0(){Js&&(_e=[],xe=[],se&&(se.count=0),ae&&(ae.count=0),de&&(de.visible=!1,de.material.uniforms.intensity.value=0))}const kt=14,Nt=8,cr=3,Kn=0,Bo=2,Vo=80,ur=-8,mf=80,gf=-104,vf=.88,dr=.3,An=.22,yf=200,wf=.982,Mf=-19,kn=.03,_f=.0262,Wn=.07,fr=.018,Ya=An*1.6,xf=Ya*Ya,ms=new Map;let hr=-1,Ro=1,gl=1,vl=1;function pr(t){t!==hr&&(hr=t,Ro=Math.pow(wf,t*60),gl=Math.pow(vf,t*60),vl=Math.pow(.96,t*60))}function Tf(t){if(ms.has(t))return ms.get(t);const e=new Float32Array(t),n=new Float32Array(t),s=new Float32Array(t),o=new Float32Array(t);for(let i=0;i<t;i++){const a=i/(t-1);e[i]=Math.pow(1-a,.6),n[i]=Math.pow(Math.max(0,1-a*5),1.5)*2.2,s[i]=(1-a)*.85,o[i]=(1-a)*.42}return ms.set(t,{taper:e,cut:n,colG:s,colB:o}),ms.get(t)}function gs(t=kt){const e=t*2,n=(t-1)*6,s=new Le(new Float32Array(e*3),3);s.usage=Yi;const o=new Le(new Float32Array(e*3),3);o.usage=Yi;const i=new Uint16Array(n);for(let r=0;r<t-1;r++){const l=r*6,c=r*2;i[l]=c,i[l+1]=c+1,i[l+2]=c+2,i[l+3]=c+1,i[l+4]=c+3,i[l+5]=c+2}const a=new go;return a.setAttribute("position",s),a.setAttribute("color",o),a.setIndex(new Le(i,1)),a}function vs(t,e,n,s=kt,o=0,i=0,a=1){return Array.from({length:s},(r,l)=>({x:t+o*l*An,y:e+i*l*An,z:n+a*l*An,vx:0,vy:0,vz:0}))}function ys(t,e,n,s,o,i){t[0].x=e,t[0].y=n,t[0].z=s,t[0].vx=0,t[0].vy=0,t[0].vz=0;for(let a=1;a<t.length;a++){const r=t[a],l=t[a-1],c=l.x-r.x,d=l.y-r.y,f=l.z-r.z,u=Math.sqrt(c*c+d*d+f*f)||1e-5,p=(u-An)*yf;r.vx=(r.vx+c/u*p*o)*i,r.vy=(r.vy+(d/u*p+Mf)*o)*i,r.vz=(r.vz+f/u*p*o)*i,r.x+=r.vx*o,r.y+=r.vy*o,r.z+=r.vz*o;const h=r.x-l.x,v=r.y-l.y,y=r.z-l.z,w=h*h+v*v+y*y;if(w>xf){const M=Ya/Math.sqrt(w);r.x=l.x+h*M,r.y=l.y+v*M,r.z=l.z+y*M}}}function ws(t,e,n,s,o,i,a=_f){if(e.setDrawRange(0,Math.max(0,i-1)*6),i<2)return;const r=e.attributes.position.array,l=e.attributes.color.array,{taper:c,cut:d,colG:f,colB:u}=Tf(i),p=e._lastColorCount!==i;p&&(e._lastColorCount=i);for(let h=0;h<i;h++){const v=a*c[h],{x:y,y:w,z:M}=t[h],x=d[h]*a,m=h*6,S=m+3;r[m]=y-n*v*s,r[m+1]=w-n*v*o-x,r[m+2]=M,r[S]=y+n*v*s,r[S+1]=w+n*v*o+x,r[S+2]=M,p&&(l[m]=0,l[m+1]=f[h],l[m+2]=u[h],l[S]=0,l[S+1]=f[h],l[S+2]=u[h])}e.attributes.position.needsUpdate=!0,p&&(e.attributes.color.needsUpdate=!0)}class yl{constructor(){this._model=null,this._mixer=null,this._action=null,this._scene=null,this._shadowClones=[],this.birdY=23,this.velocityY=0,this._controlEnabled=!1,this._isMouseDown=!1,this._isShiftPressed=!1,this._isRightMouseDown=!1,this._activeTouchCount=0,this._inputListeners=[],this._timeSinceInput=0,this._soarFlapTimer=0,this._soarFlapBurst=!1,this._soarFlapBurstTimer=0,this._wasInSoarMode=!1,this._soarRockPhase=0,this._soarDriftPhase=0,this._rollActive=!1,this._rollAngle=0,this._cloneUpdateFrame=0,this._secondaryModel=null,this._secondaryMixer=null,this._secondaryAction=null,this._secondaryYOffset=.002,this._secondaryXOffset=.14,this._secondaryBaseRotZ=-.05,this._leftFeatherMesh=null,this._rightFeatherMesh=null,this._featherGeomL=null,this._featherGeomR=null,this._chainL=[],this._chainR=[],this._leftFeatherMesh2=null,this._rightFeatherMesh2=null,this._featherGeomL2=null,this._featherGeomR2=null,this._chainL2=[],this._chainR2=[],this._blueSeedDecor=null,this._redSeedDecor=null}get model(){return this._model}get isControlEnabled(){return this._controlEnabled}get isRolling(){return this._rollActive}enableControl(){this._controlEnabled=!0}disableControl(){this._controlEnabled=!1}keepFlapping(){this._timeSinceInput=0}snapChainTrail(e,n){if(!this._chainL)return;const s=this._model?this._model.position.x:0,o=this._model?this._model.position.y:0,i=this._model?this._model.position.z:0;for(const a of[this._chainL,this._chainR,this._chainL2,this._chainR2])for(let r=0;r<a.length;r++)a[r].x=s+r*An*e,a[r].y=o,a[r].z=i+r*An*n,a[r].vx=0,a[r].vy=0,a[r].vz=0}triggerRoll(){this._rollActive=!0,this._rollAngle=0,this.velocityY+=18}load(e){return new Promise((n,s)=>{const o=new cl;Promise.all([new Promise((i,a)=>o.load("./models/synthwave-bird.glb",i,void 0,a)),new Promise((i,a)=>o.load("./models/synth-brd-remesh-anim-1.glb",i,void 0,a))]).then(([i,a])=>{this._scene=e,this._model=i.scene,this._model.scale.setScalar(1.4),this._model.rotation.y=0,this._model.visible=!1,e.add(this._model),this._model.traverse(h=>{h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(y=>{y.color&&y.color.set(65442)})}),this._secondaryModel=a.scene,this._secondaryModel.scale.setScalar(1.36),this._secondaryModel.rotation.y=0,this._secondaryModel.visible=!1,e.add(this._secondaryModel);const r=new zo({color:new Q(20991),emissive:new Q(5223423),emissiveIntensity:.2,transparent:!0,opacity:.4,depthWrite:!1,roughness:.3});this._secondaryModel.traverse(h=>{h.isMesh&&(h.material=r)}),a.animations?.length>0&&(this._secondaryMixer=new bo(this._secondaryModel),this._secondaryAction=this._secondaryMixer.clipAction(a.animations[0]),this._secondaryAction.play());const l=[{scale:1.4*.94,color:27433,opacity:.92,renderOrder:97,lineWidth:3},{scale:1.4*1.04,color:15673,opacity:.75,renderOrder:96,lineWidth:5}],c=(h,v)=>{const y=h.clone();y.computeBoundingBox();const w=y.boundingBox.min.y,M=y.boundingBox.max.y-w||1,x=y.attributes.position,m=new Float32Array(x.count*3),S=new Q(v);for(let b=0;b<x.count;b++){const R=.15+(x.getY(b)-w)/M*.85;m[b*3]=S.r*R,m[b*3+1]=S.g*R,m[b*3+2]=S.b*R}return y.setAttribute("color",new Le(m,3)),y};for(let h=0;h<l.length;h++){const v=l[h],y=rl(i.scene);y.scale.setScalar(v.scale),y.visible=!1;const w=[];y.traverse(m=>{if(m.isLine||m.isLineSegments){const S=c(m.geometry,v.color);m.geometry=S,m.material=new Xr({color:v.color,transparent:!0,opacity:v.opacity,depthWrite:!1,vertexColors:!0}),m.renderOrder=v.renderOrder,w.push(m.material)}else m.isMesh&&(m.material=new dt({color:v.color,transparent:!0,opacity:v.opacity,depthWrite:!1}),w.push(m.material))});let M=null,x=null;i.animations?.length>0&&(M=new bo(y),x=M.clipAction(i.animations[0]),x.play()),e.add(y),this._shadowClones.push({mesh:y,ox:0,oy:0,oz:0,mixer:M,action:x,materials:w,baseOpacity:v.opacity,pulsePhase:h*2.1})}const d=document.createElement("canvas");d.width=d.height=128;const f=d.getContext("2d"),u=f.createRadialGradient(64,64,0,64,64,64);u.addColorStop(0,"rgba(0, 255, 247, 0.25)"),u.addColorStop(.25,"rgba(0, 220, 220, 0.1)"),u.addColorStop(1,"rgba(0, 132, 180, 0)"),f.fillStyle=u,f.fillRect(0,0,128,128);const p=new Qc(new Jc({map:new Jo(d),transparent:!0,blending:_n,depthWrite:!1}));p.scale.set(2.5,2,.8),p.renderOrder=99,this._model.add(p),this._createSeeds(),i.animations?.length>0&&(this._mixer=new bo(this._model),this._action=this._mixer.clipAction(i.animations[0]),this._action.play()),n(this._model)},void 0,s)})}initFeathers(e,n,s,o,i=0,a=0,r=1){this._chainL=vs(n-kn,s,o,kt,i,a,r),this._chainR=vs(n+kn,s,o,kt,i,a,r),this._chainL2=vs(n-Wn,s,o,Nt,i,a,r),this._chainR2=vs(n+Wn,s,o,Nt,i,a,r);const l=new dt({vertexColors:!0,transparent:!0,opacity:.88,side:ze,depthWrite:!1,blending:_n});this._featherGeomL=gs(),this._featherGeomR=gs(),this._leftFeatherMesh=new Re(this._featherGeomL,l),this._rightFeatherMesh=new Re(this._featherGeomR,l.clone()),this._leftFeatherMesh.renderOrder=this._rightFeatherMesh.renderOrder=101,this._leftFeatherMesh.frustumCulled=this._rightFeatherMesh.frustumCulled=!1,e.add(this._leftFeatherMesh),e.add(this._rightFeatherMesh);const c=new dt({vertexColors:!0,transparent:!0,opacity:.65,side:ze,depthWrite:!1,blending:_n});this._featherGeomL2=gs(Nt),this._featherGeomR2=gs(Nt),this._leftFeatherMesh2=new Re(this._featherGeomL2,c),this._rightFeatherMesh2=new Re(this._featherGeomR2,c.clone()),this._leftFeatherMesh2.renderOrder=this._rightFeatherMesh2.renderOrder=100,this._leftFeatherMesh2.frustumCulled=this._rightFeatherMesh2.frustumCulled=!1,e.add(this._leftFeatherMesh2),e.add(this._rightFeatherMesh2)}setupInputHandlers(){const e=(c,d,f,u)=>{c.addEventListener(d,f,u),this._inputListeners.push({target:c,type:d,handler:f,opts:u})},n=c=>{c.button===0&&(this._isMouseDown=!0),c.button===2&&(this._isRightMouseDown=!0)},s=c=>{c.button===0&&(this._isMouseDown=!1),c.button===2&&(this._isRightMouseDown=!1)},o=c=>{c.key==="Shift"&&(this._isShiftPressed=!0)},i=c=>{c.key==="Shift"&&(this._isShiftPressed=!1)},a=c=>{this._activeTouchCount=c.touches.length},r=c=>{this._activeTouchCount=c.touches.length},l=c=>c.preventDefault();e(window,"mousedown",n),e(window,"mouseup",s),e(window,"keydown",o),e(window,"keyup",i),e(window,"touchstart",a,{passive:!0}),e(window,"touchend",r,{passive:!0}),e(window,"contextmenu",l)}removeInputHandlers(){this._inputListeners.forEach(({target:e,type:n,handler:s,opts:o})=>{e.removeEventListener(n,s,o)}),this._inputListeners=[],this._isMouseDown=!1,this._isShiftPressed=!1,this._isRightMouseDown=!1,this._activeTouchCount=0}updateAnimation(e){if(this._mixer){if(this._rollActive)this._wasInSoarMode=!1,this._mixer.timeScale+=(.2-this._mixer.timeScale)*Math.min(1,e*5),this._mixer.update(e);else if(this._timeSinceInput>.4){!this._wasInSoarMode&&this._action&&(this._action.time=dr,this._mixer.timeScale=0,this._mixer.update(0),this._soarRockPhase=Math.random()*Math.PI*2,this._soarDriftPhase=Math.random()*Math.PI*2),this._wasInSoarMode=!0,this._soarRockPhase=(this._soarRockPhase||0)+e*.6;const n=Math.sin(this._soarRockPhase)*.22,s=Math.cos(this._soarRockPhase*.8)*.05;this._soarDriftPhase=(this._soarDriftPhase||0)+e*.4;const o=Math.sin(this._soarDriftPhase)*.15,i=Math.sin(this._soarDriftPhase*.5)*.08;this._model&&(this._model.rotation.x=s,this._model.rotation.z=n,this._model.position.x+=o*e,this._model.position.z+=i*e),this._soarFlapTimer+=e,this._soarFlapTimer>=2.5&&!this._soarFlapBurst&&(this._soarFlapBurst=!0,this._soarFlapBurstTimer=0,this._soarFlapTimer=0),this._soarFlapBurst&&(this._soarFlapBurstTimer+=e,this._soarFlapBurstTimer>=.45&&(this._soarFlapBurst=!1,this._action&&(this._action.time=dr,this._mixer.update(0)))),this._mixer.timeScale=this._soarFlapBurst?2:0,this._mixer.update(e)}else{this._wasInSoarMode=!1;const n=this._model?Math.max(0,Math.min(1,(-this._model.rotation.x-.5)/.4)):0,s=(1+Math.max(-.55,Math.min(1,this.velocityY*.045)))*(1-n);this._mixer.timeScale+=(s-this._mixer.timeScale)*Math.min(1,e*5),this._mixer.update(e)}if(this._cloneUpdateFrame=(this._cloneUpdateFrame+1)%3,this._cloneUpdateFrame===0){this._secondaryMixer&&this._secondaryAction&&this._action&&(this._secondaryMixer.timeScale=this._mixer.timeScale,this._secondaryAction.time=this._action.time,this._secondaryMixer.update(0));for(const{action:n,mixer:s}of this._shadowClones)n&&this._action&&(n.time=this._action.time,s.update(0))}}}updateFeathers(e,n=kt,s=Nt,o=0,i=0,a=0,r=0,l=34){if(this._model&&this._shadowClones.length){const w=this._model.position.x,M=this._model.position.y,x=this._model.position.z;for(const{mesh:m,ox:S,oy:b,oz:D}of this._shadowClones)m.visible=this._model.visible,m.position.set(w+S,M+b,x+D),m.rotation.copy(this._model.rotation)}if(this._secondaryModel&&this._model&&(this._secondaryModel.visible=this._model.visible,this._secondaryModel.position.copy(this._model.position),this._secondaryModel.position.y+=this._secondaryYOffset,this._secondaryModel.position.z+=this._secondaryXOffset,this._secondaryModel.rotation.copy(this._model.rotation),this._secondaryModel.rotation.z+=this._secondaryBaseRotZ),!this._leftFeatherMesh||!this._model)return;const c=this._model.visible;if(this._leftFeatherMesh.visible=c,this._rightFeatherMesh.visible=c,this._leftFeatherMesh2.visible=c,this._rightFeatherMesh2.visible=c,!c)return;if(o!==0){const w=o*e;for(const M of[this._chainL,this._chainR,this._chainL2,this._chainR2])for(const x of M)x.z-=w}const d=Math.sqrt(i*i+r*r);if(d>.5){const w=-i/d*l*e,M=-r/d*l*e;for(const x of[this._chainL,this._chainR,this._chainL2,this._chainR2])for(let m=1;m<x.length;m++)x[m].vx+=w,x[m].vz+=M}const f=this._model.rotation.z,u=Math.cos(f),p=Math.sin(f),h=this._model.position.x,v=this._model.position.y-.04,y=this._model.position.z;pr(e),ys(this._chainL,h-kn*u,v-kn*p,y,e,Ro),ys(this._chainR,h+kn*u,v+kn*p,y,e,Ro),this._chainL2.length&&ys(this._chainL2,h-Wn*u,v-Wn*p,y,e,Ro),this._chainR2.length&&ys(this._chainR2,h+Wn*u,v+Wn*p,y,e,Ro),ws(this._chainL,this._featherGeomL,-1,u,p,n),ws(this._chainR,this._featherGeomR,1,u,p,n),ws(this._chainL2,this._featherGeomL2,-1,u,p,s,fr),ws(this._chainR2,this._featherGeomR2,1,u,p,s,fr)}updateSeeds(e){if(!this._blueSeedDecor)return;const n=.05+e*.95;this._blueSeedDecor.scale.setScalar(n),this._blueSeedDecor.material.emissiveIntensity=e*5,this._redSeedDecor.scale.setScalar(n),this._redSeedDecor.material.emissiveIntensity=e*5}applyPhysics(e){if(!this._controlEnabled||!this._model)return;const n=this._isUpInput()||this._isLowerInput();n?(this._timeSinceInput=0,this._soarFlapTimer=0,this._soarFlapBurst=!1):this._timeSinceInput+=e,this._isUpInput()&&(this.velocityY+=mf*e),this._isLowerInput()&&(this.velocityY+=gf*e);const s=!n&&this.velocityY>0;this.velocityY+=(s?ur*.15:ur)*e,pr(e),this.velocityY*=s?vl:gl,this.birdY+=this.velocityY*e,this.birdY=Math.max(Bo,Math.min(Vo,this.birdY)),(this.birdY<=Bo||this.birdY>=Vo)&&(this.velocityY=0);const o=Math.max(-.9,Math.min(.45,this.velocityY*.1));this._model.rotation.x+=(o-this._model.rotation.x)*Math.min(1,e*1.5),this._rollActive?(this._rollAngle+=Math.PI*2/.65*e,this._rollAngle>=Math.PI*2&&(this._rollActive=!1,this._rollAngle=0),this._model.rotation.z=this._rollAngle):this._model.rotation.z=Math.max(-.2,Math.min(.2,-this.velocityY*.03))}dispose(e){for(const{mesh:n,mixer:s}of this._shadowClones)s&&s.stopAllAction(),e.remove(n),n.traverse(o=>{o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(i=>i.dispose()):o.material.dispose())});this._shadowClones=[],this._model&&(e.remove(this._model),this._model.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(s=>s.dispose()):n.material.dispose())}),this._model=null),this._secondaryModel&&(this._secondaryMixer&&this._secondaryMixer.stopAllAction(),e.remove(this._secondaryModel),this._secondaryModel.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(s=>s.dispose()):n.material.dispose())}),this._secondaryModel=null,this._secondaryMixer=null,this._secondaryAction=null);for(const n of[this._leftFeatherMesh,this._rightFeatherMesh,this._leftFeatherMesh2,this._rightFeatherMesh2])n&&(e.remove(n),n.geometry?.dispose(),n.material?.dispose());this._leftFeatherMesh=this._rightFeatherMesh=null,this._leftFeatherMesh2=this._rightFeatherMesh2=null,this._featherGeomL=this._featherGeomR=null,this._featherGeomL2=this._featherGeomR2=null,this._chainL=this._chainR=this._chainL2=this._chainR2=[],this._mixer=null,this._action=null,this._blueSeedDecor=null,this._redSeedDecor=null}_isUpInput(){return this._isMouseDown&&!this._isLowerInput()||this._activeTouchCount===1}_isLowerInput(){return this._isShiftPressed||this._isRightMouseDown||this._activeTouchCount>=2}_createSeeds(){const e=(n,s)=>{const o=new Re(new $c(s,12),new zo({color:16711680,emissive:new Q(n),emissiveIntensity:0,transparent:!0,opacity:.9,depthWrite:!1}));return o.rotation.x=-Math.PI/2,o};this._blueSeedDecor=e(65322,[new ue(0,-.22),new ue(.032,-.14),new ue(.062,-.04),new ue(.068,.03),new ue(.064,.11),new ue(.054,.2),new ue(.038,.29),new ue(.018,.36),new ue(0,.4)]),this._redSeedDecor=e(16729122,[new ue(0,-.18),new ue(.026,-.11),new ue(.052,-.03),new ue(.057,.02),new ue(.053,.09),new ue(.044,.17),new ue(.03,.25),new ue(.013,.31),new ue(0,.34)]),this._blueSeedDecor.position.set(0,-.03,-.15),this._redSeedDecor.position.set(0,-.04,-.15),this._model.add(this._blueSeedDecor),this._model.add(this._redSeedDecor)}}function w0(t){return t*t*t}function Ra(t){if(t<.5)return 4*t*t*t;const e=-2*t+2;return 1-e*e*e/2}const Sf=142,Cf=142,mr=20,Rf=1,gr=3,Af=1.8,Df=10,Yo=220,vr=Yo+20,Dn=22,$s=Yo-10;function bf(t){const e=[],n=[],s=[],o=[],i=[];t.traverse(a=>{!a.isMesh||!a.material||(a.userData.spawnOpacity=a.material.opacity,a.userData.rotationSpeed!==void 0?(e.push(a),o.push(a)):a.userData.isBaseRing||a.userData.isTurboGlow?o.push(a):a.userData.isConvergingRing?(n.push(a),i.push(a)):a.userData.isConvergingChevron&&(s.push(a),i.push(a)))}),t.userData._blades=e,t.userData._cRings=n,t.userData._cChevrons=s,t.userData._staticMeshes=o,t.userData._dynamicMeshes=i}function wl(t){t.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>{for(const o of Object.values(s))o&&o.isTexture&&o.dispose();s.dispose()})})}function If(t,e,n){e.remove(t);const s=n.indexOf(t);s!==-1&&n.splice(s,1),wl(t)}function Ml(t,e){const n=[];for(let s=0;s<t;s++)n.push(!1);for(let s=0;s<e;s++)n.push(!0);for(let s=n.length-1;s>0;s--){const o=Math.floor(Math.random()*(s+1));[n[s],n[o]]=[n[o],n[s]]}return n}const Ef=`
  attribute float aSize;
  attribute vec3  aColor;
  attribute vec3  aVelocity;      // initial velocity per particle
  attribute float aFlickerPhase;  // random 0..2π phase offset per particle
  uniform   float uElapsed;
  uniform   float uApproachSpeed;
  uniform   float uUpwardBurst;   // 1.0 = upward burst, 0.0 = forward burst
  varying   vec3  vColor;
  varying   float vFlickerPhase;
  void main() {
    vColor = aColor;
    vFlickerPhase = aFlickerPhase;
    float t = uElapsed;
    // Analytical drag: integral of exp(-k*s) from 0 to t = (1 - exp(-k*t)) / k
    float intXY = (1.0 - exp(-3.0 * t)) / 3.0;
    float intZ  = (1.0 - exp(-2.0 * t)) / 2.0;
    float dx = aVelocity.x * intXY;
    float dz = aVelocity.z * intZ - uApproachSpeed * t;
    float dy;
    if (uUpwardBurst > 0.5) {
      dy = aVelocity.y * t - 20.0 * t * t; // stronger gravity — peaks sooner, drops harder
    } else {
      dy = aVelocity.y * intXY;
    }
    vec4 mv = modelViewMatrix * vec4(position + vec3(dx, dy, dz), 1.0);
    gl_PointSize = aSize * (300.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`,Pf=`
  uniform float uOpacity;
  uniform float uElapsed;
  varying vec3  vColor;
  varying float vFlickerPhase;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = pow(max(0.0, 1.0 - d * 2.0), 5.0);
    float halo = smoothstep(0.5, 0.35, d) * 0.15;
    // Per-particle flicker: kicks in at t=0.5s, each particle has its own phase
    // so they wink out independently. Two frequencies give an organic beat.
    float fp = clamp((uElapsed - 0.5) / 1.5, 0.0, 1.0);
    float flicker = 1.0 - fp * 0.85 * (0.5 + 0.35 * sin(uElapsed * 36.0 + vFlickerPhase)
                                             + 0.15 * sin(uElapsed * 71.0 + vFlickerPhase * 1.7));
    gl_FragColor = vec4(vColor, (core + halo) * uOpacity * max(0.0, flicker));
  }
`;function ja(t,e,n,s,o,i,a,r=0,l=!1){const f=new Q(t?16720384:43775),u=new Q(t?16746581:8969727),p=new Float32Array(180),h=new Float32Array(180),v=new Float32Array(180),y=new Float32Array(60),w=new Float32Array(60);for(let b=0;b<60;b++){p[b*3]=e,p[b*3+1]=n,p[b*3+2]=s,w[b]=Math.random()*Math.PI*2;const D=l?12+Math.random()*20:15+Math.random()*30,R=8+Math.random()*16,T=Math.random()*Math.PI*2;l?(v[b*3]=Math.cos(T)*R,v[b*3+1]=D,v[b*3+2]=Math.sin(T)*R*.7):(v[b*3]=Math.cos(T)*R,v[b*3+1]=Math.sin(T)*R*.7,v[b*3+2]=-D);const C=Math.random()<.6?f:u;h[b*3]=C.r,h[b*3+1]=C.g,h[b*3+2]=C.b,y[b]=.8+Math.random()*Math.random()*3.5}const M=new go;M.setAttribute("position",new Le(p,3)),M.setAttribute("aColor",new Le(h,3)),M.setAttribute("aSize",new Le(y,1)),M.setAttribute("aVelocity",new Le(v,3)),M.setAttribute("aFlickerPhase",new Le(w,1));const x=new je({vertexShader:Ef,fragmentShader:Pf,uniforms:{uOpacity:{value:1},uElapsed:{value:0},uApproachSpeed:{value:r},uUpwardBurst:{value:l?1:0}},transparent:!0,depthWrite:!1,blending:_n}),m=new Xs(M,x);o.add(m),i.push(m);let S=0;a.push({done:!1,update(b){if(S+=b,x.uniforms.uElapsed.value=S,x.uniforms.uOpacity.value=Math.max(0,1-(S/2)**2),S>=2){m.parent&&o.remove(m);const D=i.indexOf(m);D!==-1&&i.splice(D,1),M.dispose(),x.dispose(),this.done=!0}}})}let Ka=!1;function Lf(t){Gr(),oc(t),Ka=!1}function Of(t,e,n){ac(t/e*100,{currentMass:t,totalMass:e,winPercentage:n}),t>=Math.ceil(e*n)&&(ic(),Ka||(Ka=!0,Xl())),rc()}function Ff(){Gr()}function _l(t,e){for(let n=t.length-1;n>=0;n--)t[n].update(e),t[n].done&&t.splice(n,1)}function Nf(t,e,{birdZ:n,birdWorldY:s,ringSpeed:o,approachSpeed:i=0,scene:a,trackingArray:r,onHit:l,onMiss:c}){for(let f=t.length-1;f>=0;f--){const u=t[f];u.position.z+=(o-i)*e,u.userData.animTime+=e;const p=u.userData.animTime;u.userData.collected&&(u.userData.collectedTime+=e);const h=u.userData.collectedTime;u.rotation.z+=(u.userData.isLower?-.5:.5)*e;const v=u.userData.collected?2:1;for(const M of u.userData._blades)M.rotation.z+=M.userData.rotationSpeed*e*60*v,u.userData.collected&&(M.material.color.setHex(16763904),M.material.opacity=M.userData.baseOpacity*(.85+Math.sin(h*8)*.15)*1.3);for(const M of u.userData._cRings){const x=(p-M.userData.animationOffset)%1.5;if(x<0){M.material.opacity=0;continue}const m=Math.min(x/1.5,1),S=M.userData.startRadius*(1-m*.6);M.scale.set(S/M.userData.ringRadius,S/M.userData.ringRadius,1);const b=m<.15?m/.15:m>.5?(1-m)/.5:1;M.material.opacity=b*.4}for(const M of u.userData._cChevrons){const x=(p-M.userData.animationOffset)%1.5;if(x<0){M.visible=!1;continue}M.visible=!0;const m=Math.min(x/1.5,1),S=M.userData.startRadius*(1-m*.64);M.position.x=Math.cos(M.userData.angle)*S,M.position.y=Math.sin(M.userData.angle)*S;const b=1-m*.45;M.scale.set(b,b,1);const D=m<.15?m/.15:m>.5?(1-m)/.5:1;M.material.opacity=D*.7,u.userData.collected&&M.material.color.setHex(65484)}const y=n-u.position.z,w=Math.min(1,Math.max(0,1-(y-mr)/(Cf-mr)));if(w<1){for(const M of u.userData._staticMeshes)M.material.opacity=(M.userData.spawnOpacity??M.material.opacity)*w;for(const M of u.userData._dynamicMeshes)M.material.opacity*=w}!u.userData.checked&&u.position.z>=n&&(u.userData.checked=!0,Math.abs(u.position.y-s)<u.userData.innerRadius*Rf?(u.userData.collected=!0,l?.(u.userData.isLower)):c?.()),u.position.z>n+20&&(If(u,a,r),t.splice(f,1))}}let en=null,Pt=null,ht=!1,ft=null,Fs=null,xl=null,k=null,es=[],Rs=0,Ns=[],nn=0,Xn=0,jo=0,As=(Bo+Vo)/2,Xa=0,qa=!1,Po=0,ro=[],Hs=[],Za=!1,Lo=!1,Ge=null,Un=Dn,Gs=!1,Qa=0;const Hf=2.5;let zs=!1,Ja=0;const Gf=.45,Tl=new Yt,yr=new Yt;let ks=!1,$a=0;const zf=.45;let Sl=0,Cl=0,Rl=0,Al=$s;function kf(t){en.add(t),ro.push(t)}function Lt(){return k?k.birdY:23}function Qt(){return $s}function Wf(){const t=ft.ringTotal??20;if(nn>=t)return;const e=Ns[nn];nn++;const n=Math.min(1,Xa/Df),s=gr+(Af-gr)*n;Xa++;const o=ii(e);o.rotation.set(0,0,0),o.scale.setScalar(s),bf(o),o.userData.isLower=e,o.userData.innerRadius=2.2*.5*s,o.userData.checked=!1,o.userData.animTime=0,o.userData.collected=!1,o.userData.collectedTime=0;const i=8+Math.random()*10,a=e?Math.max(Bo+1,As-i):Math.min(Vo-1,As+i);As=a,o.position.set(0,Dn-22+a,Qt()-Sf),kf(o),es.push(o)}function Uf(t){Xn++,jo++,Po++,t?Lr():Or(),sc(),Po>=3&&!k.isRolling&&k.isControlEnabled&&(Fr(),k.triggerRoll(),Po=0);const e=ft.ringTotal??20;Of(jo,e,ft.winPercentage??.6),Dl()}function Dl(){if(qa)return;const t=ft.ringTotal??20;if(nn<t||es.length>0)return;const e=Math.ceil(t*(ft.winPercentage??.6));jo>=e?(qa=!0,setTimeout(()=>{ht&&Vf()},1e3)):(Ns=Ml(Math.round(5*.6),Math.round(5*.4)),nn=0,ft.ringTotal=jo+5)}function Bf(){const t=document.getElementById("level-story-overlay"),e=document.getElementById("level-story-text");!t||!e||(e.textContent="GO!",t.style.display="block",requestAnimationFrame(()=>{ht&&t.classList.add("visible")}),setTimeout(()=>{ht&&(t.classList.remove("visible"),setTimeout(()=>{t.style.display="none"},400))},650))}function Vf(){k.disableControl(),Lo=!0,k.velocityY=35,Ge=document.createElement("div"),Ge.style.cssText="position:fixed;inset:0;background:black;opacity:0;pointer-events:none;transition:opacity 0.8s ease;z-index:9999;display:flex;align-items:center;justify-content:center;",document.body.appendChild(Ge);const t=xl;if(t){const e=document.createElement("p");e.textContent=t,e.style.cssText="color:rgba(255,255,255,0);font-family:var(--font-hagrid-light-italic);font-size:1.4rem;text-align:center;max-width:480px;padding:0 2rem;letter-spacing:0.03em;transition:color 1s ease;",Ge.appendChild(e),setTimeout(()=>{e&&(e.style.color="rgba(255,255,255,0.85)")},900)}setTimeout(()=>{Ge&&(Ge.style.opacity="1")},200),setTimeout(()=>{ht&&Yf()},2e3)}function Yf(){if(!ht)return;ht=!1;const t=Ge;Ge=null,Kf(),window.showMainMenuFromMinigame&&window.showMainMenuFromMinigame(),t&&t.parentNode&&setTimeout(()=>{t.style.transition="opacity 1.8s ease",t.style.opacity="0",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},1900)},400)}function jf(t,e){t.position.z=e.position.z}function M0(t,e,n,s=null,o=null,i=null){if(en=t,Pt=e,ft=n,ht=!0,Fs=o,xl=i,k=null,es=[],Rs=0,Ns=[],nn=0,Xn=0,jo=0,Xa=0,As=(Bo+Vo)/2,Po=0,qa=!1,ro=[],Hs=[],Za=!1,Lo=!1,Ge=null,Un=s?e.position.y:Dn,Gs=!!s,Qa=0,zs=!!s,Ja=0,s&&Tl.copy(e.quaternion),s||(e.position.set(0,Dn,Yo),e.lookAt(0,Dn,$s-30),e.updateMatrixWorld(!0)),t.fog=new eu(9090260,18e-6),Lf(n.winPercentage??.6),s?(k=s,k.birdY=13,k.setupInputHandlers(),k.model&&(ks=!0,$a=0,Sl=k.model.rotation.x,Cl=k.model.rotation.y,Rl=k.model.rotation.z,Al=k.model.position.z,k.model.visible=!0,k.snapChainTrail(0,1)),k._leftFeatherMesh&&(k._leftFeatherMesh.visible=!0),k._rightFeatherMesh&&(k._rightFeatherMesh.visible=!0),k._leftFeatherMesh2&&(k._leftFeatherMesh2.visible=!0),k._rightFeatherMesh2&&(k._rightFeatherMesh2.visible=!0)):(k=new yl,k.birdY=13,k.initFeathers(t,Kn,Lt(),Qt()),k.setupInputHandlers(),k.load(t).then(()=>{if(!ht){k.dispose(t);return}k.model.position.set(Kn,Lt(),Qt()),k.model.visible=!0})),!ht)return;k.enableControl();const a=n.ringTotal??20,r=n.ringBlueCount??Math.round(a*.6);Ns=Ml(r,a-r),nn=0,Za=!0,Bf()}function _0(t){if(!ht)return;const e=!!k?.model;let n=Pt.position.y;if(Lo&&e)Un+=(Lt()-Un)*Math.min(1,t*880);else{const l=e?Math.max(0,k.velocityY??0)*.3:0,c=e?Lt()+4.5-l:Dn,d=e?Math.min(0,(k.velocityY??0)*.5):0,f=e?Lt()+d:Dn;n=Pt.position.y+(c-Pt.position.y)*Math.min(1,t*3),Un+=(f-Un)*Math.min(1,t*3)}let s=Yo;if(Gs){Qa+=t;const l=Math.min(Qa/Hf,1),c=Ra(l);s=vr+(Yo-vr)*c,l>=1&&(Gs=!1)}if(Pt.position.set(0,n,s),Fs&&jf(Fs,Pt),Pt.lookAt(0,Un,Qt()-30),zs){Ja+=t;const l=Math.min(Ja/Gf,1),c=Ra(l);yr.copy(Pt.quaternion),Pt.quaternion.slerpQuaternions(Tl,yr,c),l>=1&&(zs=!1)}if(k.updateAnimation(t),Lo){if(k.model){k.velocityY-=10*t,k.birdY+=k.velocityY*t,k.model.position.set(Kn,k.birdY,Qt());const l=Math.min(.45,k.velocityY*.08);k.model.rotation.x+=(l-k.model.rotation.x)*Math.min(1,t*1.5)}}else if(k.applyPhysics(t),k.model)if(ks){$a+=t;const l=Math.min($a/zf,1),c=Ra(l),d=Jt.lerp(Al,$s,c);k.model.position.set(Kn,Lt(),d),k.model.rotation.x=Jt.lerp(Sl,0,c),k.model.rotation.y=Jt.lerp(Cl,0,c),k.model.rotation.z=Jt.lerp(Rl,0,c),l>=1&&(ks=!1)}else k.model.position.set(Kn,Lt(),Qt());if(Za&&!Lo){const l=ft.ringTotal??20,c=ft.ringSpawnInterval??3;Rs+=t,Rs>=c&&(Rs=0,Wf()),Nf(es,t,{birdZ:Qt(),birdWorldY:Lt(),ringSpeed:ft.ringSpeed??22,approachSpeed:0,scene:en,trackingArray:ro,onHit:d=>{Uf(d),ja(d,Kn,Lt(),Qt(),en,ro,Hs)},onMiss:()=>{Po=0}}),nn>=l&&Dl()}const o=k.isControlEnabled?2:0,i=Math.min(kt,o+Xn*2),a=Xn>=cr?2:0,r=Math.min(Nt,a+Math.max(0,Xn-cr)*2);k.updateFeathers(t,i,r),k.updateSeeds(Math.min(1,Xn/(ft.ringTotal??20))),_l(Hs,t)}function Kf(){ht=!1,Gs=!1,zs=!1,ks=!1,Fs=null,Ff();const t=document.getElementById("level-story-overlay");t&&(t.classList.remove("visible"),t.style.display="none"),k&&(k.removeInputHandlers(),k.dispose(en),k=null),ro.forEach(e=>{e.parent&&en.remove(e),wl(e)}),ro=[],es=[],Hs=[],en&&(en.fog=null),Ge&&Ge.parentNode&&(Ge.parentNode.removeChild(Ge),Ge=null)}const Wt=[];let Aa=0;const lo=[],bn=[];let wr=0,z=null,on=null,Ws=0,Ln=!1;const Ut=new H;let Ko=!1,Xo=!1,qn=0,bl=0;const to=new H,Oo=new H,no=new H,Fo=new H;let Us=!1,oo=0;const Ao=new H,Ms=[],Mr=[];let ei=!1;const _r=1.5,Xf=2.5,qf=10,Zf=8,Qf=.81,Il=.13;let Bn=Il;const Jf=260,El=.004;let Pl=El;const ti=.75,Co=.2,$f=30,pn=[];let qo=!1;const xr=new H,eh=new H(0,-1,0),Tr=new di,_s=new tu,Ll=new H(0,1,0);function Ol(){if(pn.length===0){qo=!1;return}const t=Date.now();let e=pn.length;for(;e--;){const n=pn[e],s=t-n.startTime;if(s<0)continue;n.object.visible||(n.object.visible=!0);const o=Math.min(s/n.duration,1),a=(1-Math.pow(1-o,3))*n.targetScale;n.object.scale.set(a,a,a),o>=1&&pn.splice(e,1)}pn.length>0?requestAnimationFrame(Ol):qo=!1}function Fl(t,e,n,s){pn.push({object:t,startTime:e,duration:n,targetScale:s}),qo||(qo=!0,requestAnimationFrame(Ol))}const th=24,No=[],nh=8;let Bs=!1;function Nl(t){No.push(t),Bs||(Bs=!0,requestAnimationFrame(Hl))}function Hl(){let t=0;for(;No.length>0&&t<nh;)No.shift()(),t++;No.length>0?requestAnimationFrame(Hl):Bs=!1}function Da(t){const{numPositions:e,terrainSize:n,terrainMesh:s,heightSampler:o=null,minSpacing:i,existingPositions:a=[],validHeightRange:r={min:.3,max:2.2},minSlopeDotProduct:l=.423,useClusterMode:c=!1}=t;if(o){const d=[],f=e*20,u=i*i,p=.3;let h=[];if(c){const v=Math.floor(e/6);for(let y=0;y<v;y++)h.push({x:(Math.random()-.5)*n*.8,z:(Math.random()-.5)*n*.8,radius:1.5+Math.random()*1.5})}for(let v=0;d.length<e&&v<f;v++){let y,w;if(c&&Math.random()<.7&&h.length>0){const R=h[Math.floor(Math.random()*h.length)],T=Math.random()*Math.PI*2,C=Math.random()*R.radius;y=R.x+Math.cos(T)*C,w=R.z+Math.sin(T)*C}else y=(Math.random()-.5)*n*.8,w=(Math.random()-.5)*n*.8;const M=o(y,w);if(M<r.min||M>r.max)continue;const x=o(y+p,w)-M,m=o(y,w+p)-M,S=Math.sqrt(x*x+p*p+m*m);if(p/S<l)continue;let D=!1;for(let R=0;R<a.length&&!D;R++){const T=y-a[R].x,C=w-a[R].z;T*T+C*C<u&&(D=!0)}for(let R=0;R<d.length&&!D;R++){const T=y-d[R].x,C=w-d[R].z;T*T+C*C<u&&(D=!0)}D||d.push({x:y,z:w,height:M,normal:{x:-x/S,y:p/S,z:-m/S}})}return Promise.resolve(d)}return new Promise(d=>{const f=[],u=e*20,p=i*i;let h=0,v=0,y=[];if(c){const M=Math.floor(e/6);for(let x=0;x<M;x++)y.push({x:(Math.random()-.5)*n*.8,z:(Math.random()-.5)*n*.8,radius:1.5+Math.random()*1.5})}function w(){for(v=0;f.length<e&&h<u;){if(v>=th){requestAnimationFrame(w);return}h++;let M,x;if(c&&Math.random()<.7&&y.length>0){const T=y[Math.floor(Math.random()*y.length)],C=Math.random()*Math.PI*2,I=Math.random()*T.radius;M=T.x+Math.cos(C)*I,x=T.z+Math.sin(C)*I}else M=(Math.random()-.5)*n*.8,x=(Math.random()-.5)*n*.8;xr.set(M,20,x),Tr.set(xr,eh);const m=Tr.intersectObject(s);if(v++,m.length===0)continue;const S=m[0].point.y;if(S<r.min||S>r.max)continue;const b=m[0].face.normal;if(_s.getNormalMatrix(s.matrixWorld),Ll.dot(b.clone().applyMatrix3(_s).normalize())<l)continue;let R=!1;for(let T=0;T<a.length&&!R;T++){const C=M-a[T].x,I=x-a[T].z;C*C+I*I<p&&(R=!0)}for(let T=0;T<f.length&&!R;T++){const C=M-f[T].x,I=x-f[T].z;C*C+I*I<p&&(R=!0)}if(!R){const T=m[0].face.normal;_s.getNormalMatrix(s.matrixWorld);const C=T.clone().applyMatrix3(_s).normalize();f.push({x:M,z:x,height:S,normal:{x:C.x,y:C.y,z:C.z}})}}d(f)}requestAnimationFrame(w)})}function oh(t,e="day"){t.uniforms.uIsNightTime&&(t.uniforms.uIsNightTime.value=e==="night");const n=Date.now(),s=1200,o=300,i=1400,a=()=>{const r=Date.now()-n,l=Math.min(r/s,1),c=1-Math.pow(1-l,3);if(t.uniforms.uWinGreenIntensity.value=c*.6,r>=o){const d=Math.min((r-o)/i,1),f=1-Math.pow(1-d,3);t.uniforms.uWinGreenDetailIntensity.value=f*.55}(l<1||r<o+i)&&requestAnimationFrame(a)};requestAnimationFrame(a)}function sh(t){if(!t||!t.wetnessMap)return;const e=Date.now(),n=1800,s=200,o=()=>{const i=Date.now()-e;if(i<s){requestAnimationFrame(o);return}const a=Math.min((i-s)/n,1),r=1-Math.pow(1-a,3);t.wetnessMap.setGreenZoneWetnessIntensity(r),a<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}function ni(t){const{scene:e,modelCache:n,terrainMesh:s,modelPath:o,positions:i,baseScale:a,scaleVariation:r,staggerDelay:l,growDuration:c,verticalOffset:d=-.15,startDelay:f=0}=t;if(i.length===0){console.warn(`No positions generated for ${o}, skipping model load`);return}if(!n[o]){console.warn(`Model ${o} not preloaded yet, waiting...`),setTimeout(()=>ni(t),100);return}const u=n[o],p=t.timeOfDay==="night",h=t.timeOfDay==="dusk",v=o.includes("ivory-cane-palm"),y=p?v?3.5:6.2:1,w=new Q(1.85,1.55,1.05),M=u.map(m=>{const S=m.material.clone();return p&&S.color?S.color.multiplyScalar(y):h&&S.color&&S.color.multiply(w),S}),x=Date.now();i.forEach((m,S)=>{const b=x+f+S*l,D=a+Math.random()*r,R=Math.random()*Math.PI*2;Nl(()=>{const T=new Mn;u.forEach((ne,Y)=>{const F=new Re(ne.geometry,M[Y]);F.position.copy(ne.position),F.rotation.copy(ne.rotation),F.scale.copy(ne.scale),F.castShadow=ne.castShadow,F.receiveShadow=ne.receiveShadow,T.add(F)});const C=m.height,I=m.normal?new H(m.normal.x,m.normal.y,m.normal.z):new H(0,1,0);T.rotation.y=R;const X=Math.atan2(m.z,m.x),$=Math.acos(Math.max(-1,Math.min(1,Ll.dot(I)))),Z=Math.PI/9,W=Math.min($*.6,Z);T.rotation.x=Math.sin(X)*W,T.rotation.z=-Math.cos(X)*W,T.position.set(m.x,C+d,m.z),T.scale.set(0,0,0),T.visible=!1,T.userData.baseRotation={x:T.rotation.x,z:T.rotation.z},T.userData.verticalOffset=d,T.userData.targetScale=D,Wt.push(T),e.add(T),Fl(T,b,c,D)})})}function ah(t){const{scene:e,modelCache:n,grassModelPath:s,grassTuftPositions:o,timeOfDay:i,baseScale:a=.228,scaleVariation:r=.188}=t,l=n[s],c=i==="night",d=i==="dusk",f=c?6.2:1,u=new Q(1.85,1.55,1.05),p=l.map(y=>{const w=y.material.clone();return c&&w.color?w.color.multiplyScalar(f):d&&w.color&&w.color.multiply(u),w}),h=Date.now(),v=800;o.forEach((y,w)=>{const M=h+w*20+500,x=a+Math.random()*r,m=Math.random()*Math.PI*2;Nl(()=>{const S=new Mn;l.forEach((D,R)=>{const T=new Re(D.geometry,p[R]);T.position.copy(D.position),T.rotation.copy(D.rotation),T.scale.copy(D.scale),T.castShadow=!1,T.receiveShadow=!1,S.add(T)});const b=y.height;S.rotation.y=m,S.position.set(y.x,b-.05,y.z),S.scale.set(0,0,0),S.visible=!1,S.userData.verticalOffset=-.05,S.userData.targetScale=x,lo.push(S),e.add(S),Fl(S,M,v,x)})})}function ih(t){z=new yl,on=t,Ws=0,Ln=!1,z.initFeathers(t,0,0,0,0,-1,0),z._leftFeatherMesh.isPersistent=!0,z._rightFeatherMesh.isPersistent=!0,z._leftFeatherMesh2.isPersistent=!0,z._rightFeatherMesh2.isPersistent=!0,z.load(t).then(()=>{z.model.isPersistent=!0,z.model.position.set(0,0,0),z.model.visible=!0,z.updateSeeds(1),Ut.set(0,0,0),Ln=!0,z._secondaryModel&&(z._secondaryModel.isPersistent=!0);for(const{mesh:e}of z._shadowClones)e.isPersistent=!0})}function x0(t){if(Ms.length>0&&_l(Ms,t),!Ln||!z||!z.model)return;if(Us){oo+=t;const D=Math.min(oo/ti,1),R=z.model,T=Ut;let C=Ao.x,I=Ao.y,X=Ao.z;if(D<Co){const W=D/Co;I+=W*2.5,R.rotation.x+=(-.6*W-R.rotation.x)*Math.min(1,t*12),R.rotation.z*=Math.pow(.85,t*60)}else{const W=(D-Co)/(1-Co),ne=W*W*W,Y=W*Math.PI*1.5,F=2*(1-W);C+=Math.sin(Y)*F,X+=Math.cos(Y)*F,I=Ao.y+2.5-ne*$f;const ie=C-T.x,ce=X-T.z;Math.abs(ie)+Math.abs(ce)>2e-4&&(R.rotation.y=Math.atan2(-ie,-ce)),R.rotation.x+=(Math.min(1.5,W*2.8)-R.rotation.x)*Math.min(1,t*10),R.rotation.z*=Math.pow(.9,t*60)}R.position.set(C,I,X),C-T.x,I-T.y,X-T.z,T.set(C,I,X),!ei&&I<=2&&D>Co&&on&&(ei=!0,ja(!1,C,-2.5,X,on,Mr,Ms,0,!0),ja(!0,C,-2.5,X,on,Mr,Ms,0,!0)),z.keepFlapping(),z.updateAnimation(t);const $=-Math.sin(R.rotation.y)*100,Z=-Math.cos(R.rotation.y)*100;z.updateFeathers(t,kt,Nt,0,$,0,Z),z.updateSeeds(Math.max(0,1-D*1.6));return}if(Xo&&(qn+=t,!(qn<Bn))){Bn>0&&qn-t<Bn&&to.copy(z.model.position);const D=bl-Bn,R=Math.min((qn-Bn)/D,1),T=Math.min(R+Pl,1),C=T<.5?4*T*T*T:1-Math.pow(-2*T+2,3)/2,I=1-C,X=to,$=Oo,Z=no,W=Fo,ne=I*I*I*X.x+3*I*I*C*$.x+3*I*C*C*Z.x+C*C*C*W.x,Y=I*I*I*X.y+3*I*I*C*$.y+3*I*C*C*Z.y+C*C*C*W.y,F=I*I*I*X.z+3*I*I*C*$.z+3*I*C*C*Z.z+C*C*C*W.z,ie=z.model,ce=Ut,J=ne-ce.x,we=Y-ce.y,ye=F-ce.z;if(Math.abs(J)+Math.abs(ye)>2e-4){let ot=(Ko?Math.atan2(J,ye):Math.atan2(-J,-ye))-ie.rotation.y;ot>Math.PI&&(ot-=Math.PI*2),ot<-Math.PI&&(ot+=Math.PI*2),ie.rotation.y+=ot*Math.min(1,t*8)}const nt=t>0?we/t:0,vt=Math.max(-1.2,Math.min(.9,-nt*.06));ie.rotation.x+=(vt-ie.rotation.x)*Math.min(1,t*5);const be=Math.min(C+.02,1),pe=1-be,Fn=pe*pe*pe*X.x+3*pe*pe*be*$.x+3*pe*be*be*Z.x+be*be*be*W.x,ke=pe*pe*pe*X.z+3*pe*pe*be*$.z+3*pe*be*be*Z.z+be*be*be*W.z,yo=J*(ke-F)-ye*(Fn-ne),Ke=Math.max(-.25,Math.min(.25,yo*.4));ie.rotation.z+=(Ke-ie.rotation.z)*Math.min(1,t*3),ie.position.set(ne,Y,F),ce.set(ne,Y,F);const jt=Math.sqrt(J*J+ye*ye),Et=jt>.001?J/jt*100:-Math.sin(ie.rotation.y)*100,cn=jt>.001?ye/jt*100:-Math.cos(ie.rotation.y)*100;z.keepFlapping(),z.updateAnimation(t),z.updateFeathers(t,kt,Nt,0,Et,0,cn),z.updateSeeds(1);return}Ws+=t;const e=Ws,n=e*Qf,s=Math.min(e/Xf,1),o=s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2,i=o*qf,a=Math.min(e/_r,1),r=1-(1-a)*(1-a),l=Math.max(0,Math.min(1,(e-_r)/1)),c=r*Zf+Math.sin(e*.38)*4.5*l,d=Math.sin(n)*i,f=Math.cos(n)*i,u=z.model,p=Ut,h=d-p.x,v=f-p.z,y=c-p.y;if(Math.abs(h)+Math.abs(v)>2e-4){let R=Math.atan2(-h,-v)-u.rotation.y;R>Math.PI&&(R-=Math.PI*2),R<-Math.PI&&(R+=Math.PI*2),u.rotation.y+=R*Math.min(1,t*8)}const w=t>0?y/t:0,M=.9*(1-a)+.3*a,x=Math.max(-M,Math.min(M,w*.06));u.rotation.x+=(x-u.rotation.x)*Math.min(1,t*5);const m=-.38*o;u.rotation.z+=(m-u.rotation.z)*Math.min(1,t*3),u.position.set(d,c,f),p.set(d,c,f);const S=-Math.sin(u.rotation.y)*100,b=-Math.cos(u.rotation.y)*100;z.keepFlapping(),z.updateAnimation(t),z.updateFeathers(t,kt,Nt,0,S,0,b),z.updateSeeds(1)}function T0(){!z||!z.model||(Us=!0,oo=0,Ao.copy(z.model.position))}function S0(t){if(!z||!z.model)return;const e=t.x,n=t.y,s=t.z;z.model.position.x+=e,z.model.position.y+=n,z.model.position.z+=s,Ut.x+=e,Ut.y+=n,Ut.z+=s,to.x+=e,to.y+=n,to.z+=s,Oo.x+=e,Oo.y+=n,Oo.z+=s,no.x+=e,no.y+=n,no.z+=s,Fo.x+=e,Fo.y+=n,Fo.z+=s;for(const o of[z._chainL,z._chainR,z._chainL2,z._chainR2])if(o)for(const i of o)i.x+=e,i.y+=n,i.z+=s}function rh(t=!1){if(!(!t&&Xo)){if(t&&Us&&oo<ti){const e=(ti-oo)*1e3+150;setTimeout(()=>rh(!0),e);return}z&&on&&z.dispose(on),z=null,on=null,Ws=0,Ln=!1,Xo=!1,qn=0,Ko=!1,Us=!1,oo=0,ei=!1}}function C0({nextIslandOffset:t,flightAngle:e,duration:n,p3y:s=12,p3zOffset:o=0,ringMinigame:i=!1}){if(!z||!Ln){console.warn("[WinBird] startWinBirdTransition called before bird loaded — transition skipped");return}Xo=!0,qn=0,Ko=!1,bl=n/1e3*(i?1.12:1),Bn=i?0:Il,Pl=i?0:El;const a=t.length(),r=Math.cos(e),l=Math.sin(e),c=a*.28;i&&z&&z.model&&(to.copy(z.model.position),z.snapChainTrail(-r,-l)),Oo.set(r*c,Jf,l*c),i?no.set(t.x,35,t.z+o+80):no.set(t.x-r*40,70,t.z-l*40),Fo.set(t.x,s,t.z+o)}function R0(){if(Ko=!Ko,!z||!z.model)return;z.model.rotation.y+=Math.PI;const t=z.model.position.x-Ut.x,e=z.model.position.z-Ut.z,n=Math.sqrt(t*t+e*e);n>1e-4&&z.snapChainTrail(-t/n,-e/n)}function A0(t){return!z||!z.model?!1:(t.copy(z.model.position),!0)}function D0(){if(!z||!Ln)return null;const t=z;return z=null,on=null,Ln=!1,Xo=!1,t}function b0(t){const{scene:e,terrainMaterial:n,terrainMesh:s,terrainSize:o,modelCache:i,timeOfDay:a="day",terrain:r,heightSampler:l=null,waterSystem:c=null}=t;a==="night"?ql():Zl(),oh(n,a),sh(r);const d=[{modelPath:"./models/win-state/palm_tree.glb",count:32,minSpacing:.612,baseScale:.224,scaleVariation:.001249,staggerDelay:60,growDuration:600,verticalOffset:-.15,startDelay:0},{modelPath:"./models/win-state/ivory-cane-palm.glb",count:18,minSpacing:.37,baseScale:.054689,scaleVariation:.04377,staggerDelay:50,growDuration:700,verticalOffset:-.0812,startDelay:150},{modelPath:"./models/win-state/olive-palm.glb",count:6,minSpacing:.64,baseScale:.18,scaleVariation:.077,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200},{modelPath:"./models/win-state/lady-palm.glb",count:8,minSpacing:.6,baseScale:.048,scaleVariation:.042,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200},{modelPath:"./models/win-state/bismarck-palm.glb",count:7,minSpacing:.21,baseScale:.078,scaleVariation:.062,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200},{modelPath:"./models/win-state/banana-tree.glb",count:5,minSpacing:.21,baseScale:.0556,scaleVariation:.0482,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200}],f=[];async function u(){const h=d[0],v=await Da({numPositions:h.count,terrainSize:o,terrainMesh:s,heightSampler:l,minSpacing:h.minSpacing,existingPositions:f});f.push(...v),ni({scene:e,modelCache:i,terrainMesh:s,modelPath:h.modelPath,positions:v,baseScale:h.baseScale,scaleVariation:h.scaleVariation,staggerDelay:h.staggerDelay,growDuration:h.growDuration,verticalOffset:h.verticalOffset,startDelay:h.startDelay,timeOfDay:a}),await Promise.all(d.slice(1).map(async y=>{const w=await Da({numPositions:y.count,terrainSize:o,terrainMesh:s,heightSampler:l,minSpacing:y.minSpacing,existingPositions:f});f.push(...w),ni({scene:e,modelCache:i,terrainMesh:s,modelPath:y.modelPath,positions:w,baseScale:y.baseScale,scaleVariation:y.scaleVariation,staggerDelay:y.staggerDelay,growDuration:y.growDuration,verticalOffset:y.verticalOffset,startDelay:y.startDelay,timeOfDay:a})}))}u();async function p(){const h=[{path:"./models/win-state/tall-grass.glb",count:10},{path:"./models/win-state/grass.glb",count:10},{path:"./models/win-state/fern.glb",count:10,baseScale:.0022,scaleVariation:.0032}];for(const v of h){if(!i[v.path]){console.warn(`Grass model ${v.path} not preloaded yet, skipping`);continue}const y=await Da({numPositions:v.count,terrainSize:o,terrainMesh:s,heightSampler:l,minSpacing:.09,useClusterMode:!0});ah({scene:e,modelCache:i,grassModelPath:v.path,grassTuftPositions:y,timeOfDay:a,...v.baseScale!==void 0&&{baseScale:v.baseScale},...v.scaleVariation!==void 0&&{scaleVariation:v.scaleVariation}})}}setTimeout(p,100),setTimeout(()=>{uh(e,a)},800),c&&setTimeout(()=>{n.uniforms.uUseWetnessMap.value=!0,c.activate()},3500),setTimeout(()=>ih(e),3200)}const Sr=new di,lh=new H(0,-1,0),Cr=new H;let ba=0;const ch=5;function Rr(t,e,n=2,s=!1,o=null){if(Wt.length===0&&lo.length===0||!t||!e||!s&&(ba++,ba<ch))return;if(ba=0,!e.isObject3D&&!e.isMesh){console.warn("Invalid terrainMesh passed to updateTreePositions");return}const i=.3,a=2.2,r=.4,l=2.6,c=i-r,d=l-a,f=n*n,u=p=>{if(p.userData.targetScale===void 0)return;const h=p.position.x-t.x,v=p.position.z-t.z;if(h*h+v*v>f)return;let w;if(o)w=o(p.position.x,p.position.z);else{Cr.set(p.position.x,20,p.position.z),Sr.set(Cr,lh);const m=Sr.intersectObject(e,!1);if(m.length===0)return;w=m[0].point.y}p.userData.verticalOffset===void 0&&(p.userData.verticalOffset=p.position.y-w),p.position.y=w+p.userData.verticalOffset;let M=1;w<i?w<=r?M=0:M=(w-r)/c:w>a&&(w>=l?M=0:M=(l-w)/d);const x=p.userData.targetScale*M;p.scale.set(x,x,x)};Wt.forEach(u),lo.forEach(u)}function I0(t,e=null,n=0){if(Wt.length===0||(Aa++,Aa<5))return;Aa=0;const s=Math.sin(t*.9)*.035;for(let o=0;o<Wt.length;o++){const i=Wt[o];if(i.scale.x===0)continue;if(e){const r=i.position.x-e.x,l=i.position.z-e.z;if(r*r+l*l<n)continue}const{baseRotation:a}=i.userData;i.rotation.x=a.x+s,i.rotation.z=a.z+s*.7}}function uh(t,e="day"){const n=qd(),s=e==="night",o=e==="dusk",i=s?4.25:1,a=new Q(1.7,1.45,1.1),r=Math.random()<.6?1:0,l=Math.floor(Math.random()*3),c=Math.floor(Math.random()*4);function d(u){const p=n[u];if(!p)return console.warn(`Seagull model ${u} not preloaded yet, skipping`),null;const h=rl(p.scene);return h.traverse(v=>{v.isMesh&&(v.castShadow=!1,v.receiveShadow=!1,(s||o)&&v.material&&(v.material=v.material.clone(),v.material._ownedByInstance=!0,v.material.color&&(s?v.material.color.multiplyScalar(i):v.material.color.multiply(a))))}),{clone:h,animations:p.animations}}function f(u,p,h){if(!p||p.length===0)return;const v=new bo(u);p.forEach(y=>{const w=v.clipAction(y);w.timeScale=h,w.play()}),u.userData.mixer=v}if(r>0){const u=d("./models/creatures/seagulls-flock.glb");if(u){const{clone:p,animations:h}=u;p.position.set(0,6.28,0),p.scale.set(.0162,.0162,.0162),t.add(p),f(p,h,.5),p.userData.type="flock",p.userData.bobTime=Math.random()*Math.PI*2,p.userData.bobSpeed=.3,p.userData.bobAmount=1.8,p.userData.baseHeight=p.position.y,bn.push(p)}}for(let u=0;u<l;u++){const p=d("./models/creatures/seagulls-spiral.glb");if(p){const{clone:h,animations:v}=p;h.position.set((Math.random()-.5)*8,5+Math.random()*3,(Math.random()-.5)*8),h.scale.set(.14,.14,.14),t.add(h),f(h,v,.55+Math.random()*.2),h.userData.type="spiral",h.userData.bobTime=Math.random()*Math.PI*2,h.userData.bobSpeed=.25,h.userData.bobAmount=1.2,h.userData.baseHeight=h.position.y,bn.push(h)}}for(let u=0;u<c;u++){const p=d("./models/creatures/seagull-1.glb");if(p){const{clone:h,animations:v}=p;if(h.position.set((Math.random()-.5)*12,4.2+Math.random()*4.2,(Math.random()-.5)*12),h.scale.set(.028,.028,.028),t.add(h),v&&v.length>0){const y=new bo(h);v.forEach(w=>{const M=y.clipAction(w);M.timeScale=.6+Math.random()*.3,M.play(),M.time=Math.random()*w.duration}),h.userData.mixer=y}h.userData.type="single",h.userData.bobTime=Math.random()*Math.PI*2,h.userData.bobSpeed=.35+Math.random()*.1,h.userData.bobAmount=.8,h.userData.baseHeight=h.position.y,bn.push(h)}}}function E0(t){wr++;const e=(wr&1)===0;for(let n=0;n<bn.length;n++){const s=bn[n],o=s.userData;o.mixer&&e&&o.mixer.update(t*2),o.bobTime+=t*o.bobSpeed,s.position.y=o.baseHeight+Math.sin(o.bobTime)*o.bobAmount}}function P0(){bn.forEach(t=>{t.userData.mixer&&(t.userData.mixer.stopAllAction(),t.userData.mixer.uncacheRoot(t),t.userData.mixer=null),t.parent&&t.parent.remove(t),t.traverse(e=>{e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>{s._ownedByInstance&&dh(s)})})}),bn.length=0}function L0(t){t&&t.uniforms.uWinGreenIntensity&&(t.uniforms.uWinGreenIntensity.value=0),t&&t.uniforms.uWinGreenDetailIntensity&&(t.uniforms.uWinGreenDetailIntensity.value=0),t&&t.uniforms.uIsNightTime&&(t.uniforms.uIsNightTime.value=!1)}function O0(t){t&&t.wetnessMap&&t.wetnessMap.setGreenZoneWetnessIntensity&&t.wetnessMap.setGreenZoneWetnessIntensity(0)}function dh(t){for(const e of Object.values(t))e&&e.isTexture&&e.dispose();t.dispose()}function F0(){Wt.forEach(t=>{t.parent&&t.parent.remove(t),t.traverse(e=>{e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>s.dispose())})}),Wt.length=0,lo.forEach(t=>{t.parent&&t.parent.remove(t),t.traverse(e=>{e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>s.dispose())})}),lo.length=0,No.length=0,Bs=!1,pn.length=0,qo=!1}function N0(){return Wt}function H0(){return lo}const Ia=new H,De=new H,$e=new H,Vs=new H;function Oi(t){let e=null,n=1/0;for(let s=0;s<At.length;s++){const o=At[s];if(!o.active||o.isEvaporating)continue;if(t.closestPointToPoint(o.position,Ia),Ia.distanceTo(o.position)<=o.radius*1.5){const a=Ia.distanceTo(t.origin);a<n&&(n=a,e=o)}}return e}const Ye=new di;Ye.far=5e3;const et=new ue;let Ee=!1,Fi=!1,Ni=!1,co=0,oi=0,si=0;const fh=100;let re=null,ee=null,mn=0,gn=null,vn=null,Zo=.88,sn=0,Ar=0;const hh=150;let Dr=0;const ph=50;let br=0;const mh=16;let uo={x:0,y:0},ea=0,Ds=0,zt=null;const Gl=10,gh=300;let Vn=0,Ot=!1,bs=0,Ys=!1;const ai=1.5,zl=1,vh=1.5,yh=1.5,wh=ai+zl-yh;let Yn=0,yn=0,jn=0,js=!1,Is=!1;const Ir=1.5,xs=1,Er=1.5,Mh=1.5,Ea=3.25,_h=-.85,Pa=4.75,xh=-1.45;let Ho=null,ts=null,Vt=null,fo=!1,Ae=null,On=null,ho=null,Zn=null,an=null,po=null,mo=null;function Te(){return Fi||Ni||co>=2}function ii(t){const e=$r*1.1,n=new Mn;n.rotation.x=-Math.PI/2,n.renderOrder=3;const s=new fa,o=e,i=e*.5;s.moveTo(o,0);for(let f=1;f<=46;f++){const u=f/46*Math.PI*2;s.lineTo(Math.cos(u)*o,Math.sin(u)*o)}const a=new nu;a.moveTo(i,0);for(let f=1;f<=46;f++){const u=f/46*Math.PI*2;a.lineTo(Math.cos(u)*i,Math.sin(u)*i)}s.holes.push(a);const r={depth:.032,bevelEnabled:!0,bevelThickness:.005,bevelSize:.003,bevelSegments:2},l=new ha(s,r),c=new zo({color:t?16720418:2237183,transparent:!0,opacity:t?.28:.55,roughness:.62,metalness:.31,emissive:t?16720384:8959,emissiveIntensity:1.62,side:ze,depthWrite:!1}),d=new Re(l,c);if(d.position.z=-.015,d.userData.isBaseRing=!0,d.userData.isLowerMode=t,n.add(d),t)for(let u=0;u<8;u++){const p=u/8*Math.PI*2,h=(u+1)/8*Math.PI*2,v=new fa,y=e*.62,w=e*.98,M=20;for(let D=0;D<=M;D++){const R=D/M,T=p+R*(h-p),C=Jt.lerp(w,y,R*.7),I=Math.cos(T)*C,X=Math.sin(T)*C;D===0?v.moveTo(I,X):v.lineTo(I,X)}for(let D=M;D>=0;D--){const R=D/M,T=p+R*(h-p),C=Jt.lerp(w,y,R*.7)*.7,I=Math.cos(T)*C,X=Math.sin(T)*C;v.lineTo(I,X)}const x={depth:.03,bevelEnabled:!1},m=new ha(v,x),S=new dt({color:16724787,transparent:!0,opacity:.5-u/8*.2,side:ze,depthWrite:!1}),b=new Re(m,S);b.position.z=-.015,b.userData.rotationSpeed=-.05-u*.01,b.userData.baseOpacity=.5-u/8*.2,n.add(b)}else{for(let y=0;y<4;y++){const w=e*1,M=.3,x=y*.36,m=new ou(M*.84,M,64),S=document.createElement("canvas");S.width=256,S.height=256;const b=S.getContext("2d"),D=b.createRadialGradient(128,128,128*.84,128,128,128);D.addColorStop(0,"rgba(34, 34, 170, 1.0)"),D.addColorStop(1,"rgba(34, 34, 170, 0.0)"),b.fillStyle=D,b.fillRect(0,0,256,256);const R=new Jo(S),T=new dt({map:R,transparent:!0,opacity:0,side:ze,depthWrite:!1}),C=new Re(m,T);C.userData.animationOffset=x,C.userData.startRadius=w,C.userData.ringRadius=M,C.userData.isConvergingRing=!0,n.add(C);for(let I=0;I<8;I++){const X=I/8*Math.PI*2,$=.895,Z=new fa;Z.moveTo(0,-$/2),Z.lineTo(-$*.6,0),Z.lineTo(0,$/2),Z.lineTo(-$*.3,0),Z.lineTo(0,-$/2);const W={depth:.03,bevelEnabled:!1},ne=new ha(Z,W),Y=new dt({color:1710832,transparent:!0,opacity:0,side:ze,depthWrite:!1}),F=new Re(ne,Y);F.position.x=Math.cos(X)*w,F.position.y=Math.sin(X)*w,F.position.z=-.012,F.rotation.z=X,F.userData.angle=X,F.userData.startRadius=w,F.userData.animationOffset=x,F.userData.isConvergingChevron=!0,n.add(F)}}const p=new Go(e*1.82,e*1.82),h=new je({transparent:!0,depthWrite:!1,blending:_n,side:ze,uniforms:{color:{value:new Q(65484)},opacity:{value:0}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center) * 2.0;
          // Create soft ring glow - peaks around 0.6-0.8 radius, fades both inward and outward
          float ring = smoothstep(0.3, 0.6, dist) * smoothstep(1.0, 0.7, dist);
          float alpha = ring * opacity;
          gl_FragColor = vec4(color, alpha);
        }
      `}),v=new Re(p,h);v.position.z=-.02,v.userData.isTurboGlow=!0,v.visible=!1,n.add(v)}return n}function ta(t){const e=t?vn:gn;return e?(ee=e,ee.visible=!0,mn=0,ee):null}function Qo(){ee&&(ee.visible=!1,ee=null)}function ns(t){if(!ee)return;const e=ee.position,n=e.x,s=e.y,o=e.z;ee.visible=!1;const i=t?vn:gn;i&&(ee=i,ee.position.set(n,s,o),ee.visible=!0)}function Th(t,e=0,n=!1,s=0,o=0){if(!ee)return;mn+=t;const i=n?1.8:1,a=1.5/i,r=6711039,l=54442,c=65484,d=16746496,f=16763904,u=ee.children;for(let p=0;p<u.length;p++){const h=u[p];if(h.userData.isBaseRing){if(h.userData.isLowerMode)continue;n?(h.material.color.setHex(5592575),h.material.emissive.setHex(8772),h.material.emissiveIntensity=.4,h.material.opacity=.4):e>0?(h.material.emissiveIntensity=.2+e*.2,h.material.opacity=.3+e*.1):(h.material.color.setHex(4474111),h.material.emissive.setHex(68),h.material.emissiveIntensity=.2,h.material.opacity=.3);continue}if(h.userData.isTurboGlow){if(h.visible=n||e>0,h.material.uniforms)if(n){const v=.25+Math.sin(mn*6)*.1;h.material.uniforms.opacity.value=v}else e>0?h.material.uniforms.opacity.value=e*.15:h.material.uniforms.opacity.value=0;continue}if(h.userData.rotationSpeed!==void 0)if(h.rotation.z+=h.userData.rotationSpeed*t*60,s===2){const v=.85+Math.sin(mn*8)*.15;h.material.color.setHex(f),h.material.opacity=h.userData.baseOpacity*v*1.3}else if(s===1)h.material.color.setHex(d),h.material.opacity=h.userData.baseOpacity*1.2;else if(o>0){const y=.2+o*.33,w=.2*(1-o);h.material.color.setRGB(1,y,w),h.material.opacity=h.userData.baseOpacity*(1+o*.2)}else h.material.color.setHex(16724787),h.material.opacity=h.userData.baseOpacity;if(h.userData.isConvergingRing===!0){const v=h.userData.animationOffset/i,w=(mn*i-v)%a;if(w<0){h.material.opacity=0;continue}const M=.6,x=Math.min(w/a,1),m=x*M,S=h.userData.startRadius,b=h.userData.ringRadius,R=S*(1-m)/b;h.scale.set(R,R,1);let T;x<.15?T=x/.15:x>.5?T=(1-x)/.5:T=1,h.material.opacity=T*.4}if(h.userData.isConvergingChevron===!0){const v=h.userData.animationOffset,y=v/i,M=(mn*i-y)%a,m=(Math.round(v/.36)+1)/4,S=e>=m||n;if(M<0){h.material.opacity=0,h.visible=!1;continue}h.visible=!0;const b=.64,D=Math.min(M/a,1),R=D*b,C=h.userData.startRadius*(1-R),I=h.userData.angle;h.position.x=Math.cos(I)*C,h.position.y=Math.sin(I)*C;const X=1-R*.45;h.scale.set(X,X,1);let $;D<.15?$=D/.15:D>.5?$=(1-D)/.5:$=1,n?(h.material.color.setHex(c),h.material.opacity=$*.8):S?(h.material.color.setHex(l),h.material.opacity=$*.7):(h.material.color.setHex(r),h.material.opacity=$*.4)}}}function kl(t){if(!t)return!1;let e=t;for(;e&&e!==document.body;){const n=e.tagName?.toLowerCase();if(n==="button"||n==="input"||n==="select"||n==="textarea"||n==="a"||e.onclick||e.getAttribute("role")==="button"||e.classList?.contains("ui-element")||e.classList?.contains("modal")||Array.from(e.classList||[]).some(o=>o.includes("modal")))return!0;const s=e.id;if(s&&(s.includes("btn")||s.includes("button")||s.includes("modal")||s.includes("overlay")||s.includes("menu")||s.includes("ui")))return!0;e=e.parentElement}return!1}function Sh(t){if(kl(t.target))return;t.button===2&&(Ni=!0),uo={x:t.clientX,y:t.clientY},ea=Date.now(),et.x=t.clientX/window.innerWidth*2-1,et.y=-(t.clientY/window.innerHeight)*2+1,Ye.setFromCamera(et,ts);const e=Oi(Ye.ray);if(e&&e.radius>=.15&&po&&mo){Vs.copy(e.position);const s=e.radius;sl(e,Ho,po,mo)&&(Nr(),zr(),hl(Vs,s)),document.body.style.cursor="pointer",t.preventDefault();return}const n=Ye.intersectObject(Ae);if(n.length>0){const s=n[0].point;if(s.y<On-Zo)return;De.copy(s),$e.copy(De),Ae.worldToLocal($e),re={world:De,local:$e},Ee=!0,Vt.enabled=!1,document.body.style.cursor=Te()?"s-resize":"n-resize",ee||ta(Te()),ee&&(ee.position.copy(De),ee.position.y+=.05),Hr()}}function Ch(t){t.button===2&&(Ni=!1);const e={x:t.clientX,y:t.clientY},n=Math.sqrt(Math.pow(e.x-uo.x,2)+Math.pow(e.y-uo.y,2)),s=Date.now()-ea;if(n<Gl&&s<500&&re){const o=Te()?-.8:.8;ho(re.local,o),an(),sn++;const i=re.world,a=.5,r=eo(Ae,i);Os(i,Te(),a,r),La()}Ee=!1,re=null,document.body.style.cursor="default",fo||(Vt.enabled=!0),Es(),Qo()}function Rh(t){if(et.x=t.clientX/window.innerWidth*2-1,et.y=-(t.clientY/window.innerHeight)*2+1,Ye.setFromCamera(et,ts),Ee){const s=performance.now();if(s-br<mh)return;br=s;const o=Ye.intersectObject(Ae);if(o.length>0){if(De.copy(o[0].point),De.y<On-Zo){re=null,ee&&(ee.visible=!1);return}$e.copy(De),Ae.worldToLocal($e),re={world:De,local:$e},ee?ee.visible=!0:ta(Te()),ee&&(ee.position.copy(De),ee.position.y+=.05)}return}const e=performance.now();if(e-Dr<ph)return;Dr=e;const n=Oi(Ye.ray);if(n)document.body.style.cursor=n.radius>=.15?"pointer":"default";else{const s=Ye.intersectObject(Ae);if(s.length>0){const o=s[0].point;document.body.style.cursor=o.y>=On-Zo?Te()?"s-resize":"n-resize":"default"}else document.body.style.cursor="default"}}function Ah(t){if(t.key==="Shift"){const e=Te();Fi=!0,document.body.style.cursor="s-resize",!e&&ee&&Ee&&ns(!0)}}function Dh(t){if(t.key==="Shift"){const e=Te();Fi=!1,document.body.style.cursor=Ee?"n-resize":"default",e&&ee&&Ee&&ns(!1)}}function bh(t){if(kl(t.target))return;const e=Te();co=t.touches.length;const n=Te();e!==n&&ee&&Ee&&ns(n);const s=t.changedTouches[0];uo={x:s.clientX,y:s.clientY},ea=Date.now(),et.x=s.clientX/window.innerWidth*2-1,et.y=-(s.clientY/window.innerHeight)*2+1,Ye.setFromCamera(et,ts);const o=Oi(Ye.ray);if(o&&o.radius>=.15&&po&&mo){Vs.copy(o.position);const a=o.radius;sl(o,Ho,po,mo)&&(Nr(),zr(),hl(Vs,a)),document.body.style.cursor="pointer",t.preventDefault();return}const i=Ye.intersectObject(Ae);if(i.length>0){const a=i[0].point;if(a.y<On-Zo)return;De.copy(a),$e.copy(De),Ae.worldToLocal($e),re={world:De,local:$e},Ee=!0,Vt.enabled=!1,zt=s.identifier,document.body.style.cursor=Te()?"s-resize":"n-resize",ee||ta(Te()),ee&&(ee.position.copy(De),ee.position.y+=.05),Hr(),t.preventDefault()}}function Ih(t){const e=Te();co=t.touches.length;const n=Te();e!==n&&ee&&Ee&&ns(n);let s=null;if(zt!==null){for(let o=0;o<t.touches.length;o++)if(t.touches[o].identifier===zt){s=t.touches[o];break}}if(s||(s=t.touches[0]),et.x=s.clientX/window.innerWidth*2-1,et.y=-(s.clientY/window.innerHeight)*2+1,Ee){Ye.setFromCamera(et,ts);const o=Ye.intersectObject(Ae);if(o.length>0){if(De.copy(o[0].point),De.y<On-Zo){re=null,ee&&(ee.visible=!1);return}$e.copy(De),Ae.worldToLocal($e),re={world:De,local:$e},ee?ee.visible=!0:ta(Te()),ee&&(ee.position.copy(De),ee.position.y+=.05)}t.preventDefault()}}function Eh(t){const e=t.changedTouches[0],n={x:e.clientX,y:e.clientY},s=Math.sqrt(Math.pow(n.x-uo.x,2)+Math.pow(n.y-uo.y,2)),o=Date.now()-ea;if(s<Gl&&o<500&&re){const c=Date.now()-Ds<gh;if(c||Te()){ho(re.local,-.8),an(),sn++,Ds=c?0:Date.now();const u=re.world,p=.5,h=eo(Ae,u);Os(u,!0,p,h),La()}else{ho(re.local,.8),an(),sn++,Ds=Date.now();const u=re.world,p=.5,h=eo(Ae,u);Os(u,!1,p,h),La()}}const i=Te();co=t.touches.length;const a=Te(),r=e.identifier;i!==a&&ee&&Ee&&r!==zt&&ns(a),r===zt&&(zt=null,Ee=!1,re=null,fo||(Vt.enabled=!0),document.body.style.cursor="default",Es(),Qo()),co===0&&(zt=null,Ee=!1,re=null,fo||(Vt.enabled=!0),document.body.style.cursor="default",Es(),Qo())}function Ph(){co=0,zt=null,Ee=!1,re=null,fo||(Vt.enabled=!0),Ds=0,document.body.style.cursor="default",Es(),Qo()}function Lh(t){t.preventDefault()}function G0(t){Ho=t.scene,ts=t.camera,Vt=t.controls,Ae=t.terrainMesh,On=t.waterLevel,ho=t.sculptTerrain,Zn=t.stampTerrain,an=t.updateTrimesh,po=t.world,mo=t.physicsConfig,gn||(gn=ii(!1),gn.visible=!1,gn.isPersistent=!0,Ho.add(gn)),vn||(vn=ii(!0),vn.visible=!1,vn.isPersistent=!0,Ho.add(vn)),window.addEventListener("mousedown",Sh),window.addEventListener("mouseup",Ch),window.addEventListener("mousemove",Rh),window.addEventListener("contextmenu",Lh),window.addEventListener("keydown",Ah),window.addEventListener("keyup",Dh),window.addEventListener("touchstart",bh,{passive:!1}),window.addEventListener("touchmove",Ih,{passive:!1}),window.addEventListener("touchend",Eh),window.addEventListener("touchcancel",Ph)}function z0(t=.016){if(Th(t,bs,Ot,yn,jn),Ee&&re){const e=Date.now(),n=Te();if(n){if(ri(),Yn+=t,!js&&Yn>=Mh&&(js=!0,Lr()),Yn>=Ir){const s=Yn-Ir,o=xs,i=xs+Er;if(s>=i&&yn<2){if(yn=2,jn=1,Zn&&re){Zn(re.local,Pa,xh),$l(),cc(),an(),sn++;const a=re.world,r=eo(Ae,a);rr(a,Pa,2,r),Rr(a,Ae,Pa,!0)}}else if(s>=o&&!Is){if(yn=1,jn=0,Is=!0,Zn&&re){Zn(re.local,Ea,_h),ec(),uc(),an(),sn++;const a=re.world,r=eo(Ae,a);rr(a,Ea,1,r),Rr(a,Ae,Ea,!0)}}else s<o?jn=s/xs:s<i&&Is&&(jn=(s-xs)/Er)}}else if(li(),Vn+=t,!Ys&&Vn>=wh&&(Ys=!0,Fr()),!Ot&&Vn>=ai){const s=Vn-ai;bs=Math.min(1,s/zl),bs>=1&&!Ot&&(Ot=!0,Or(),lc())}if(e-oi>16){const i=(n?-6.88:6.98)*(!n&&Ot?vh:1);ho(re.local,i),sn++;const a=re.world,r=Ot?1.5:1,l=eo(Ae,a);if(Os(a,n,r,l),e-Ar>hh&&(dc(),Ar=e),oi=e,e-si>fh)return an(),si=e,!0}}else(Vn>0||Ot)&&ri(),(Yn>0||yn>0)&&li();return!1}function ri(){Ys&&!Ot&&Ql(),Vn=0,Ot=!1,bs=0,Ys=!1}function li(){js&&yn===0&&Jl(),Yn=0,yn=0,jn=0,js=!1,Is=!1}function k0(t){t.terrainMesh!==void 0&&(Ae=t.terrainMesh),t.waterLevel!==void 0&&(On=t.waterLevel),t.sculptTerrain!==void 0&&(ho=t.sculptTerrain),t.stampTerrain!==void 0&&(Zn=t.stampTerrain),t.updateTrimesh!==void 0&&(an=t.updateTrimesh),t.world!==void 0&&(po=t.world),t.physicsConfig!==void 0&&(mo=t.physicsConfig),t.minigameActive!==void 0&&(fo=t.minigameActive,Vt&&(Vt.enabled=!fo))}function W0(){Qo(),Ee=!1,re=null,oi=0,si=0,sn=0,zt=null,mn=0,ri(),li()}function U0(){return{isMouseDown:Ee,currentIntersectionPoint:re,isLowerMode:Te()}}function B0(){return sn}export{W0 as $,g0 as A,$h as B,n0 as C,k0 as D,Rr as E,Kh as F,cl as G,Qh as H,l0 as I,c0 as J,qh as K,u0 as L,d0 as M,h0 as N,f0 as O,x0 as P,v0 as Q,N0 as R,$r as S,H0 as T,Jh as U,M0 as V,e0 as W,Ts as X,Vh as Y,p0 as Z,y0 as _,nd as a,B0 as a0,m0 as a1,jf as a2,_0 as a3,U0 as a4,Ra as a5,w0 as a6,F0 as a7,P0 as a8,L0 as a9,Ff as aA,wl as aB,yl as aC,Kn as aD,Nf as aE,_l as aF,If as aG,Ml as aH,Lf as aI,ii as aJ,bf as aK,Sf as aL,kt as aM,Nt as aN,cr as aO,ja as aP,gr as aQ,Af as aR,Bo as aS,Vo as aT,Df as aU,al as aV,Of as aW,pa as aX,O0 as aa,Xh as ab,Bh as ac,rh as ad,Zh as ae,Kf as af,Dn as ag,vr as ah,C0 as ai,A0 as aj,z0 as ak,b0 as al,I0 as am,E0 as an,t0 as ao,a0 as ap,o0 as aq,$s as ar,R0 as as,S0 as at,T0 as au,D0 as av,s0 as aw,pd as ax,qd as ay,jh as az,od as b,ed as c,rl as d,Li as e,qs as f,ct as g,Ga as h,g as i,cd as j,zh as k,at as l,At as m,bt as n,el as o,xt as p,kh as q,Yh as r,Ft as s,hl as t,td as u,G0 as v,Wh as w,Uh as x,i0 as y,r0 as z};
