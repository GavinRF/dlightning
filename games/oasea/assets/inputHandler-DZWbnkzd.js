import{C as to,q as Bl}from"./physicsQueue-XOQprDaT.js";import{x as Vl,a as Pr,s as Yl,B as jl,y as Lr,z as Or,A as Fr,o as Kl,C as Xl,D as ql,E as Nr,F as Hr,G as Es,H as Zl,I as Jl,J as Ql,K as $l}from"./audioManager-3P7ETVi4.js";import{_ as ec,$ as tc,y as Gr,u as nc,q as oc,N as sc,J as ac,a0 as zr,a1 as La,a2 as ic,a3 as rc,a4 as lc,a5 as cc}from"./levelManager-DlJa85a7.js";import{d as Q,V as H,P as Go,Q as Vt,E as Ks,T as kr,c as no,R as ct,S as je,U as uc,aa as dc,j as ue,M as Ce,ab as fc,ac as hc,ad as Oa,D as ze,J as pc,f as ho,g as Le,C as Qo,L as sn,ae as ci,W as ua,af as mc,l as gc,p as Zt,ag as vc,ah as yc,G as yn,a as Wr,ai as wc,e as pt,aj as Mc,v as Ur,x as ui,N as Br,y as Xs,h as Ps,i as We,I as Dn,ak as _c,al as Fa,am as Vr,an as xc,ao as Do,ap as Yr,aq as At,ar as Ut,as as Tc,a6 as Sc,_ as Cc,O as jr,at as Rc,au as Ac,av as Dc,aw as bc,ax as Ic,ay as Kr,az as Ec,aA as Pc,aB as da,z as Xr,q as zo,b as dt,aC as Lc,aD as Oc,a9 as Fc,H as Nc,aE as Hc,aF as Gc,aG as zc,aH as kc,aI as Wc,aJ as Uc,aK as qr,aL as Bc,aM as ki,aN as Wi,aO as Ui,aP as Bi,aQ as Vi,F as Vc,aR as Yc,u as jc,a0 as Kc,A as wn,aS as Xc,o as bo,a8 as qc,a7 as Zc,aT as Jc,a4 as Yi,aU as Qc,w as di,aV as $c,aW as fa,aX as eu,aY as ha,k as tu}from"./three-8-mrVIKw.js";import{b as Ct}from"./physics-CKC5f6tm.js";function Dt(t,e=.35,n=.148,s=.4){const o=t.x*e,i=t.y*e,a=t.z*e+n,r=.299*o+.587*i+.114*a;return new H(o+(r-o)*s,i+(r-i)*s,a+(r-a)*s)}function mt(t,e=.35,n=.148,s=.4){const o=t.r*e,i=t.g*e,a=t.b*e+n,r=.299*o+.587*i+.114*a;return new Q(o+(r-o)*s,i+(r-i)*s,a+(r-a)*s)}function bt(t,e=.75,n=.26){return new H(t.x*e+n,t.y*e,t.z*e)}function gt(t,e=.75,n=.16){return new Q(t.r*e+n,t.g*e,t.b*e)}const fi=new Q(16754022),hi=new Q(43212),pi=new Q(6740463),mi=new Q(6477),gi=new Q(3844815),vi=new Q(10541296),yi=new Q(8900331),wi=new Q(5618687),Mi=new Q(1731253),_i=new Q(14544639),xi=new H(.145,.161,.243),Ti=new H(.5412,.3098,.2235),Si=new H(.7922,.4784,.2471),Ci=new H(.906,.678,.388),Ri=new H(.945,.882,.659),Ai=new H(.871,.525,.318),Di=new H(.612,.239,.157),bi=new H(.3059,.1176,.2),Ii=new H(.1725,.0078,.2078),Ei=new H(.0824,0,.1569),nu=mt(fi),ou=mt(hi,.25,.06),su=mt(pi,.25,.06),au=mt(mi,.05,.02),iu=mt(gi,.2,.22),ru=mt(vi,.01,.094),lu=mt(yi,.12,.06),cu=mt(wi,.515,.16),uu=mt(Mi,.51,.14),du=mt(_i,.515,.15),fu=Dt(Ei),hu=Dt(Ii),pu=Dt(bi),mu=Dt(Di),gu=Dt(Ai),vu=Dt(Ri),yu=Dt(Ci),wu=Dt(Si),Mu=Dt(Ti),_u=Dt(xi),xu=gt(fi),Tu=gt(hi,.75,.26),Su=gt(pi),Cu=gt(mi,.99,.02),Ru=gt(gi),Au=gt(vi,.62,.19),Du=gt(yi),bu=gt(wi),Iu=gt(Mi),Eu=gt(_i),Pu=bt(Ei),Lu=bt(Ii),Ou=bt(bi),Fu=bt(Di),Nu=bt(Ai),Hu=bt(Ri),Gu=bt(Ci),zu=bt(Si),ku=bt(Ti),Wu=bt(xi),Pi=new Q(1,1,1),Uu=gt(Pi,.85,.18),Bu=mt(Pi,.4,.15),Zr=.4,Jr=.45,Qr=.55,Vu=1-Zr,Yu=1-Jr,ju=1-Qr,_t={DAY_WATER_COLOR:hi,NIGHT_WATER_COLOR:ou,DUSK_WATER_COLOR:Tu,DAY_SHALLOW_COLOR:pi,NIGHT_SHALLOW_COLOR:su,DUSK_SHALLOW_COLOR:Su,DAY_FOG_COLOR:vi,NIGHT_FOG_COLOR:ru,DUSK_FOG_COLOR:Au,DAY_DEEP_COLOR:mi,NIGHT_DEEP_COLOR:au,DUSK_DEEP_COLOR:Cu,DAY_HEMISPHERE_SHALLOW:gi,NIGHT_HEMISPHERE_SHALLOW:iu,DUSK_HEMISPHERE_SHALLOW:Ru,DAY_FILL_COLOR:fi,NIGHT_FILL_COLOR:nu,DUSK_FILL_COLOR:xu,DAY_TERRAIN_OCEAN_DEEP:Ei,NIGHT_TERRAIN_OCEAN_DEEP:fu,DUSK_TERRAIN_OCEAN_DEEP:Pu,DAY_TERRAIN_OCEAN_MID:Ii,NIGHT_TERRAIN_OCEAN_MID:hu,DUSK_TERRAIN_OCEAN_MID:Lu,DAY_TERRAIN_DEEP:bi,NIGHT_TERRAIN_DEEP:pu,DUSK_TERRAIN_DEEP:Ou,DAY_TERRAIN_SHALLOW:Di,NIGHT_TERRAIN_SHALLOW:mu,DUSK_TERRAIN_SHALLOW:Fu,DAY_TERRAIN_LOW:Ai,NIGHT_TERRAIN_LOW:gu,DUSK_TERRAIN_LOW:Nu,DAY_TERRAIN_MID_LOW:Ri,NIGHT_TERRAIN_MID_LOW:vu,DUSK_TERRAIN_MID_LOW:Hu,DAY_TERRAIN_MID:Ci,NIGHT_TERRAIN_MID:yu,DUSK_TERRAIN_MID:Gu,DAY_TERRAIN_MID_HIGH:Si,NIGHT_TERRAIN_MID_HIGH:wu,DUSK_TERRAIN_MID_HIGH:zu,DAY_TERRAIN_HIGH:Ti,NIGHT_TERRAIN_HIGH:Mu,DUSK_TERRAIN_HIGH:ku,DAY_TERRAIN_PEAK:xi,NIGHT_TERRAIN_PEAK:_u,DUSK_TERRAIN_PEAK:Wu,DAY_SKY_BG:yi,NIGHT_SKY_BG:lu,DUSK_SKY_BG:Du,DAY_HYDRO_WATER:wi,NIGHT_HYDRO_WATER:cu,DUSK_HYDRO_WATER:bu,DAY_HYDRO_DEEP:Mi,NIGHT_HYDRO_DEEP:uu,DUSK_HYDRO_DEEP:Iu,DAY_HYDRO_FOAM:_i,NIGHT_HYDRO_FOAM:du,DUSK_HYDRO_FOAM:Eu,DAY_RIPPLE_TINT:Pi,NIGHT_RIPPLE_TINT:Bu,DUSK_RIPPLE_TINT:Uu};function ot(t,e,n,s,o){o>.5?t.lerpColors(n,s,(o-.5)*2):t.lerpColors(e,n,o*2)}function xt(t,e,n,s,o){o>.5?t.lerpVectors(n,s,(o-.5)*2):t.lerpVectors(e,n,o*2)}const ji=new Q;function Hh(t,e,n,s=!1,o=0){const{waterMaterial:i,waterHemisphereMaterial:a,terrainMaterial:r,fillLight:l,hydroMaterial:c,rippleSystem:d}=e,{DAY_WATER_COLOR:u,NIGHT_WATER_COLOR:f,DUSK_WATER_COLOR:p,DAY_SHALLOW_COLOR:h,NIGHT_SHALLOW_COLOR:v,DUSK_SHALLOW_COLOR:y,DAY_FOG_COLOR:w,NIGHT_FOG_COLOR:M,DUSK_FOG_COLOR:x,DAY_DEEP_COLOR:m,NIGHT_DEEP_COLOR:S,DUSK_DEEP_COLOR:b,DAY_HEMISPHERE_SHALLOW:I,NIGHT_HEMISPHERE_SHALLOW:A,DUSK_HEMISPHERE_SHALLOW:T,DAY_FILL_COLOR:C,NIGHT_FILL_COLOR:D,DUSK_FILL_COLOR:k,DAY_TERRAIN_OCEAN_DEEP:K,NIGHT_TERRAIN_OCEAN_DEEP:J,DUSK_TERRAIN_OCEAN_DEEP:X,DAY_TERRAIN_OCEAN_MID:te,NIGHT_TERRAIN_OCEAN_MID:U,DUSK_TERRAIN_OCEAN_MID:N,DAY_TERRAIN_DEEP:fe,NIGHT_TERRAIN_DEEP:re,DUSK_TERRAIN_DEEP:$,DAY_TERRAIN_SHALLOW:ce,NIGHT_TERRAIN_SHALLOW:Ee,DUSK_TERRAIN_SHALLOW:Fe,DAY_TERRAIN_LOW:vt,NIGHT_TERRAIN_LOW:nt,DUSK_TERRAIN_LOW:os,DAY_TERRAIN_MID_LOW:he,NIGHT_TERRAIN_MID_LOW:De,DUSK_TERRAIN_MID_LOW:ke,DAY_TERRAIN_MID:mo,NIGHT_TERRAIN_MID:Ke,DUSK_TERRAIN_MID:go,DAY_TERRAIN_MID_HIGH:It,NIGHT_TERRAIN_MID_HIGH:rn,DUSK_TERRAIN_MID_HIGH:vo,DAY_TERRAIN_HIGH:yo,NIGHT_TERRAIN_HIGH:ss,DUSK_TERRAIN_HIGH:wo,DAY_TERRAIN_PEAK:na,NIGHT_TERRAIN_PEAK:as,DUSK_TERRAIN_PEAK:oa,DAY_HYDRO_WATER:sa,NIGHT_HYDRO_WATER:Mo,DUSK_HYDRO_WATER:_o,DAY_HYDRO_DEEP:aa,NIGHT_HYDRO_DEEP:ia,DUSK_HYDRO_DEEP:yt,DAY_HYDRO_FOAM:Xe,NIGHT_HYDRO_FOAM:Yt,DUSK_HYDRO_FOAM:ra,DAY_RIPPLE_TINT:xo,NIGHT_RIPPLE_TINT:Ln,DUSK_RIPPLE_TINT:ln}=n;if(l&&(ot(l.color,D,k,C,t),l.intensity=.15+t*.25),i&&(ot(i.uniforms.uWaterColor.value,f,p,u,t),ot(i.uniforms.uShallowColor.value,v,y,h,t),ot(i.uniforms.fogColor.value,M,x,w,t),i.uniforms.uReflectionTint&&i.uniforms.uReflectionTint.value.setRGB(Zr+Vu*t,Jr+Yu*t,Qr+ju*t)),a&&!s&&(ot(a.uniforms.uDeepColor.value,S,b,m,t),ot(a.uniforms.uShallowColor.value,A,T,I,t),ot(a.uniforms.fogColor.value,M,x,w,t)),r){const ve=r.uniforms;xt(ve.oceanDeepColor.value,J,X,K,t),xt(ve.oceanMidColor.value,U,N,te,t),xt(ve.deepColor.value,re,$,fe,t),xt(ve.shallowColor.value,Ee,Fe,ce,t),xt(ve.lowColor.value,nt,os,vt,t),xt(ve.midLowColor.value,De,ke,he,t),xt(ve.midColor.value,Ke,go,mo,t),xt(ve.midHighColor.value,rn,vo,It,t),xt(ve.highColor.value,ss,wo,yo,t),xt(ve.peakColor.value,as,oa,na,t),o>0&&(ve.oceanDeepColor.value.lerp(J,o),ve.oceanMidColor.value.lerp(U,o),ve.deepColor.value.lerp(re,o),ve.shallowColor.value.lerp(Ee,o),ve.lowColor.value.lerp(nt,o),ve.midLowColor.value.lerp(De,o),ve.midColor.value.lerp(Ke,o),ve.midHighColor.value.lerp(rn,o),ve.highColor.value.lerp(ss,o),ve.peakColor.value.lerp(as,o))}c&&(ot(c.uniforms.uWaterColor.value,Mo,_o,sa,t),ot(c.uniforms.uWaterColorDeep.value,ia,yt,aa,t),ot(c.uniforms.uFoamColor.value,Yt,ra,Xe,t)),d&&(ot(ji,Ln,ln,xo,t),d.setTimeTint(ji))}function pa(t,e,n,s,o){const i=t.material.uniforms;i.turbidity.value=n.turbidity+(s.turbidity-n.turbidity)*o,i.rayleigh.value=n.rayleigh+(s.rayleigh-n.rayleigh)*o,i.mieCoefficient.value=n.mieCoefficient+(s.mieCoefficient-n.mieCoefficient)*o,e.toneMappingExposure=n.exposure+(s.exposure-n.exposure)*o}const $r=2;let us=null;function Ku(){if(us)return us;const t={minFilter:sn,magFilter:sn,format:gc,type:mc};return us={heightmap:new ua(512,512,t),wetness1:new ua(512,512,t),wetness2:new ua(512,512,t)},us}let ma=null,ga=null,va=null;const Ki=Object.create(null);let On=null,ds=null,jt=null;function Xu(){if(jt)return jt;const t=256,e=document.createElement("canvas");e.width=t,e.height=t;const n=e.getContext("2d"),s=n.createImageData(t,t);for(let o=0;o<s.data.length;o+=4)s.data[o]=Math.random()*255,s.data[o+1]=Math.random()*255,s.data[o+2]=Math.random()*255,s.data[o+3]=255;return n.putImageData(s,0,0),jt=new Qo(e),jt.wrapS=ct,jt.wrapT=ct,jt.magFilter=sn,jt.minFilter=ci,jt}function Gh(t={}){const{segments:e=32,normalMapPath:n="normal-maps/sand-normal.jpg",normalMapScale:s=2,physicsWorld:o,physicsConfig:i={ballGround:{friction:.0022,restitution:.43}},shape:a={},waterLevel:r=-2.87}=t,l=a.size||18,c={scaleX:a.scaleX||1,scaleY:a.scaleY||1,tilt:a.tilt||{angle:0,amount:0},bay:a.bay||{angle:0,depth:0,width:0},irregularity:a.irregularity||1,distortion:a.distortion||{frequency:.5,amplitude:.3,randomness:.2},turbulence:a.turbulence||null,islandRadius:a.islandRadius||l*.365,terracing:a.terracing||null,caldera:a.caldera||null,volcanoes:a.volcanoes||null,spiral:a.spiral||null},d=c.islandRadius,u=d+d*0,f=d+d*.26,p=d+d*.75,h=5.8,v=-4.6,y=512,w=new Go(l,l,e,e),M=w.attributes.position;function x(_,E){if(_<2){if(_<.01)return 0;const F=_/2,Y=F*F*(3-2*F),B=Math.sin(E*3+_*.5)*.4,V=Math.sin(E*5-_*.3)*.25,q=Math.sin(E*7+_*.7)*.2;return(B+V+q)*c.irregularity*Y}const O=Math.sin(E*3+_*.5)*.4,G=Math.sin(E*5-_*.3)*.25,Z=Math.sin(E*7+_*.7)*.2;return(O+G+Z)*c.irregularity}function m(_,E,P){const O=_/c.scaleX,G=E/c.scaleY;let Z=Math.sqrt(O*O+G*G);if(c.bay.depth>0){const F=c.bay.angle,Y=c.bay.width;let B=Math.abs(P-F);if(B>Math.PI&&(B=2*Math.PI-B),B<Y){const V=Math.cos(B/Y*Math.PI/2);Z+=c.bay.depth*V}}return Z}function S(_,E){if(c.tilt.amount===0)return 0;const P=1.5;if(_<P){if(_<.01)return 0;const Z=_/P,F=Z*Z*(3-2*Z),Y=c.tilt.angle;return Math.cos(E-Y)*c.tilt.amount*F}const O=c.tilt.angle;return Math.cos(E-O)*c.tilt.amount}function b(_){if(!c.terracing)return _;const{levels:E=3,sharpness:P=.5,heightRange:O=[0,2.5]}=c.terracing,[G,Z]=O;if(_<G||_>Z)return _;const F=(_-G)/(Z-G),Y=1/E,V=Math.floor(F/Y)*Y,q=(F-V)/Y;let j;if(P>=.99)j=V+Y*.5;else{const R=1-P,L=.5-R*.5,oe=.5+R*.5;let le;if(q<L)le=0;else if(q>oe)le=1;else{const pe=(q-L)/(oe-L);le=pe*pe*(3-2*pe)}j=V+Y*le}return G+j*(Z-G)}function I(_,E,P){if(!c.caldera)return 0;const{radius:O=.4,depth:G=2,rimHeight:Z=.5,rimWidth:F=.15,breach:Y=null}=c.caldera,B=d*O,V=B+d*F;let q=1;if(Y&&Y.width>0){let R=Math.abs(E-Y.angle);R>Math.PI&&(R=2*Math.PI-R),R<Y.width&&(q=R/Y.width,q=q*q)}let j=0;if(_<B){const R=_/B,L=Math.cos(R*Math.PI*.5);j=-G*L}else if(_<V){const R=(_-B)/(V-B),L=Math.sin(R*Math.PI);j=Z*L*q}return j}function A(_,E){if(!c.volcanoes||c.volcanoes.length===0)return 0;let P=0;for(const O of c.volcanoes){const{x:G=0,y:Z=0,height:F=3,baseRadius:Y=3,slope:B=1,crater:V=null}=O,q=_-G,j=E-Z,R=Math.sqrt(q*q+j*j);if(R>=Y)continue;const L=1-R/Y,oe=Math.pow(L,1/B);let le=F*oe;if(V&&V.radius>0&&R<V.radius){const pe=R/V.radius,qe=V.flatRadius||.4,wt=pe<qe?1:Math.cos((pe-qe)/(1-qe)*Math.PI*.5),cn=V.depth||F*.4;le=F*Math.pow(1-V.radius/Y,1/B)-cn*wt}P=Math.max(P,le)}return P}function T(_,E){if(!c.turbulence)return 0;const{strength:P=3,scale:O=.3,octaves:G=3}=c.turbulence;let Z=0,F=P,Y=O,B=0;for(let V=0;V<G;V++){const q=Math.sin(_*Y+V*10)*Math.cos(E*Y+V*5),j=Math.sin((_+E)*Y*1.3+V*7),R=Math.cos((_-E)*Y*.7+V*3),L=(q+j*.5+R*.3)*F;Z+=L,B+=F,F*=.5,Y*=2}return Z/B*P}function C(_,E){if(!c.spiral)return 0;const{turns:P=2,heightRange:O=3,tightness:G=1,direction:Z=1,centerHeight:F=0}=c.spiral,Y=1.5;if(_<.01)return F;const B=_/d*P*Math.PI*2*G,V=E*Z+B,q=Math.sin(V)*O*.5,j=D(0,Y,_),R=d*.7,L=d*1.2,oe=1-D(R,L,_),pe=1-D(0,2,_);return q*j*oe+F*pe}function D(_,E,P){const O=Math.max(0,Math.min(1,(P-_)/(E-_)));return O*O*(3-2*O)}const{frequency:k,amplitude:K,randomness:J}=c.distortion;for(let _=0;_<M.count;_++){const E=M.getX(_),P=M.getY(_),O=M.getZ(_),G=Math.sqrt(E*E+P*P),Z=Math.atan2(P,E),F=m(E,P,Z),Y=x(G,Z)*1.5,B=d+Y,V=u+Y*.8,q=f+Y*.6,j=p+Y*.4,R=.51+Math.sin(E*k)*Math.cos(P*k*1.04)*K+Math.random()*J;let L;if(F<B)L=R;else if(F<V){const be=(F-B)/(V-B),Mt=be*be*(3-2*be);L=R*(1-Mt*.4)}else if(F<q){const be=(F-V)/(q-V),Mt=be*be*(3-2*be);L=R*.6-Mt*3.5}else if(F<j){const be=R*.6-3.5,Mt=(F-q)/(j-q),ca=Mt*Mt*(3-2*Mt);L=be-ca*(63+be)}else L=-63;F<B&&(L+=I(G,Z)),L+=A(E,P),L=b(L),F<q&&(L+=C(G,Z)),L+=S(G,Z),F<q&&(L+=T(E,P));const oe=l/2,le=Math.abs(E)/oe,pe=Math.abs(P)/oe,qe=Math.max(le,pe),wt=.85,cn=1;if(qe>wt&&L>r-2){const be=(qe-wt)/(cn-wt),Mt=be*be*(3-2*be),ca=r-2;L=Math.min(L,L*(1-Mt)+ca*Mt)}M.setZ(_,O+L)}M.needsUpdate=!0,w.computeVertexNormals();function X(_){const P=_.attributes.position,O=_.attributes.uv,G=_.index,Z=e+1,F=[],Y=[],B=[];for(let R=0;R<P.count;R++)F.push(P.getX(R),P.getY(R),P.getZ(R)),Y.push(O.getX(R),O.getY(R));for(let R=0;R<G.count;R++)B.push(G.getX(R));const V=P.count;for(let R=0;R<P.count;R++)F.push(P.getX(R),P.getY(R),-63),Y.push(O.getX(R),O.getY(R));function q(R,L){return R*Z+L}for(let R=0;R<e;R++){const L=q(0,R),oe=q(0,R+1),le=L+V,pe=oe+V;B.push(L,oe,le),B.push(oe,pe,le)}for(let R=0;R<e;R++){const L=q(e,R),oe=q(e,R+1),le=L+V,pe=oe+V;B.push(L,le,oe),B.push(oe,le,pe)}for(let R=0;R<e;R++){const L=q(R,0),oe=q(R+1,0),le=L+V,pe=oe+V;B.push(L,le,oe),B.push(oe,le,pe)}for(let R=0;R<e;R++){const L=q(R,e),oe=q(R+1,e),le=L+V,pe=oe+V;B.push(L,oe,le),B.push(oe,pe,le)}const j=new ho;return j.setAttribute("position",new Le(new Float32Array(F),3)),j.setAttribute("uv",new Le(new Float32Array(Y),2)),j.setIndex(B),j.computeVertexNormals(),j}const te=X(w);w.dispose();const U=te,N=U.attributes.position;function fe(_,E){const P=Math.sqrt(_*_+E*E),O=Math.atan2(E,_),G=m(_,E,O),Z=x(P,O)*1.5,F=d+Z,Y=u+Z*.8,B=f+Z*.6,V=p+Z*.4,q=.51+Math.sin(_*k)*Math.cos(E*k*1.04)*K;let j;if(G<F)j=q;else if(G<Y){const R=(G-F)/(Y-F),L=R*R*(3-2*R);j=q*(1-L*.4)}else if(G<B){const R=(G-Y)/(B-Y),L=R*R*(3-2*R);j=q*.6-L*3.5}else if(G<V){const R=q*.6-3.5,L=(G-B)/(V-B),oe=L*L*(3-2*L);j=R-oe*(63+R)}else j=-63;return G<F&&(j+=I(P,O)),j+=A(_,E),j=b(j),j+=C(P,O),j+=S(P,O),G<B&&(j+=T(_,E)),j}function re(){const _=(Math.random()-.5)*(l*.8),E=(Math.random()-.5)*(l*.8);return{x:_,z:E}}const $=e+1,ce=$*$,Ee=e/l;function Fe(_,E){const P=(_+l/2)*e/l,O=(E+l/2)*e/l,G=Math.max(0,Math.min(e-1,Math.floor(P))),Z=G+1,F=Math.max(0,Math.min(e-1,Math.floor(O))),Y=F+1,B=P-G,V=O-F,q=N.getZ(F*$+G),j=N.getZ(F*$+Z),R=N.getZ(Y*$+G),L=N.getZ(Y*$+Z);return q*(1-B)*(1-V)+j*B*(1-V)+R*(1-B)*V+L*B*V}function vt(){const _=new Float32Array(N.count*3);for(let O=0;O<N.count;O++){const G=N.getX(O),Z=N.getY(O);let F=N.getZ(O);if(O<ce){const B=Math.floor(O/$),V=O%$;let q=F,j=1,R=0;if(B>0){const L=N.getZ(O-$);q+=L,j++,R=Math.max(R,Math.abs(L-F))}if(B<e){const L=N.getZ(O+$);q+=L,j++,R=Math.max(R,Math.abs(L-F))}if(V>0){const L=N.getZ(O-1);q+=L,j++,R=Math.max(R,Math.abs(L-F))}if(V<e){const L=N.getZ(O+1);q+=L,j++,R=Math.max(R,Math.abs(L-F))}R<.4&&(F=q/j)}const Y=O*3;_[Y]=G,_[Y+1]=Z,_[Y+2]=F}const E=U.index,P=new Uint32Array(E.array);return{vertices:_,indices:P}}const nt=vt(),os=new Ks(-Math.PI/2,0,0),he=new Vt().setFromEuler(os),De=Ct.RigidBodyDesc.fixed().setRotation({x:he.x,y:he.y,z:he.z,w:he.w});let ke=o.createRigidBody(De);const mo=Ct.ColliderDesc.trimesh(nt.vertices,nt.indices).setFriction(i.ballGround.friction).setRestitution(i.ballGround.restitution).setCollisionGroups(to.terrain);let Ke=o.createCollider(mo,ke);function go(){Ke&&o.removeCollider(Ke,!0),ke&&o.removeRigidBody(ke);const _=vt(),E=Ct.RigidBodyDesc.fixed().setRotation({x:he.x,y:he.y,z:he.z,w:he.w});ke=o.createRigidBody(E);const P=Ct.ColliderDesc.trimesh(_.vertices,_.indices).setFriction(i.ballGround.friction).setRestitution(i.ballGround.restitution).setCollisionGroups(to.terrain);Ke=o.createCollider(P,ke)}let It=null,rn=0;const vo=100;let yo=0;const ss=4;let wo=0;const na=8;function as(_,E,P=$r){const O=P*P,G=Math.ceil(P*Ee),Z=Math.round((_.x+l/2)*Ee),F=Math.round((l/2-_.y)*Ee),Y=Math.max(0,Z-G),B=Math.min(e,Z+G),V=Math.max(0,F-G),q=Math.min(e,F+G);for(let R=V;R<=q;R++)for(let L=Y;L<=B;L++){const oe=R*$+L,le=N.getX(oe)-_.x,pe=N.getY(oe)-_.y,qe=le*le+pe*pe;if(qe>=O)continue;const wt=qe/O,cn=(1-wt)*(1-wt),be=N.getZ(oe)+E*cn*.02;N.setZ(oe,Math.max(v,Math.min(h,be)))}N.needsUpdate=!0,wo++,wo>=na&&(wo=0,U.computeBoundingBox(),U.computeBoundingSphere()),yo++,yo>=ss&&(yo=0,U.computeVertexNormals());const j=performance.now();It&&j-rn>vo&&(is(It),rn=j)}function oa(_,E,P){const O=E*E,G=Math.ceil(E*Ee),Z=Math.round((_.x+l/2)*Ee),F=Math.round((l/2-_.y)*Ee),Y=Math.max(0,Z-G),B=Math.min(e,Z+G),V=Math.max(0,F-G),q=Math.min(e,F+G);for(let j=V;j<=q;j++)for(let R=Y;R<=B;R++){const L=j*$+R,oe=N.getX(L)-_.x,le=N.getY(L)-_.y,pe=oe*oe+le*le;if(pe>=O)continue;const qe=pe/O,wt=(1-qe)*(1-qe),cn=N.getZ(L)+P*wt;N.setZ(L,Math.max(v,Math.min(h,cn)))}N.needsUpdate=!0,U.computeVertexNormals(),U.computeBoundingBox(),U.computeBoundingSphere(),It&&is(It)}const sa=Xu(),Mo=40,_o=new kr;On||(On=_o.load("lava-textures/cool-lava-diffuse.jpg"),On.colorSpace=no,On.wrapS=ct,On.wrapT=ct,ds=_o.load("lava-textures/cool-lava-normal.jpg"),ds.wrapS=ct,ds.wrapT=ct);const aa=On,ia=ds;let yt=Ki[n];yt||(yt=_o.load(n),yt.wrapS=ct,yt.wrapT=ct,Ki[n]=yt),yt.repeat.set(s,s);let Xe;if(ma){Xe=ma;const _=Xe.uniforms;_.normalMap.value=yt,_.normalMapRepeat.value=s,_.uWaterLevel.value=r,_.uFogEnd.value=r,_.uFogStart.value=r-16,_.uWinGreenIntensity.value=0,_.uWinGreenDetailIntensity.value=0,_.uUseWetnessMap.value=!1,_.uTerrainMeshSize.value=l,_.uCoolLavaSpotCount.value=0,_.uIsNightTime.value=!1}else Xe=new je({uniforms:uc.merge([dc.lights,{normalMap:{value:yt},normalMapRepeat:{value:s},rockGrainMap:{value:sa},rockGrainRepeat:{value:8},oceanDeepColor:{value:_t.DAY_TERRAIN_OCEAN_DEEP.clone()},oceanMidColor:{value:_t.DAY_TERRAIN_OCEAN_MID.clone()},deepColor:{value:_t.DAY_TERRAIN_DEEP.clone()},shallowColor:{value:_t.DAY_TERRAIN_SHALLOW.clone()},lowColor:{value:_t.DAY_TERRAIN_LOW.clone()},midLowColor:{value:_t.DAY_TERRAIN_MID_LOW.clone()},midColor:{value:_t.DAY_TERRAIN_MID.clone()},midHighColor:{value:_t.DAY_TERRAIN_MID_HIGH.clone()},highColor:{value:_t.DAY_TERRAIN_HIGH.clone()},peakColor:{value:_t.DAY_TERRAIN_PEAK.clone()},uFogColor:{value:new Q(943004)},uFogStart:{value:-18.87},uFogEnd:{value:-2.87},uTime:{value:0},uWaterLevel:{value:r},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uCausticsDepth:{value:4},uCausticsEnabled:{value:!0},uCausticsIntensity:{value:.15},uCausticsFadeStart:{value:.3},uCausticsBreath:{value:1},uCausticsAngleCos:{value:1},uCausticsAngleSin:{value:0},uCausticsRock1:{value:0},uCausticsRock2:{value:Math.sin(1.5)},uCausticsThreshold:{value:.6},uWaterMeshOffset:{value:new ue(0,0)},uWaterMeshPosition:{value:new ue(0,0)},uWaterCurvature:{value:2e-5},uWetnessMap:{value:null},uUseWetnessMap:{value:!1},uTerrainMeshSize:{value:l},uWinGreenIntensity:{value:0},uWinGreenColor:{value:new H(.075,.302,.082)},uWinGreenColorNight:{value:new H(.05,.15,.08)},uWinGreenDetailIntensity:{value:0},uWinGreenDetailColor:{value:new H(.035,.16,.045)},uWinGreenDetailColorNight:{value:new H(.025,.09,.04)},uIsNightTime:{value:!1},uCoolLavaTex:{value:aa},uCoolLavaNorm:{value:ia},uCoolLavaSpotCount:{value:0}}]),lights:!0,clipping:!0,vertexShader:`
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
    `,transparent:!0,depthWrite:!0}),Xe.uniforms.uCoolLavaSpots={value:new Float32Array(Mo*4)},Xe.isPersistent=!0,ma=Xe;const Yt=new Ce(U,Xe);Yt.rotation.x=-Math.PI/2,Yt.castShadow=!0,Yt.receiveShadow=!0,Yt.renderOrder=.5,Yt.customDepthMaterial=new fc({depthPacking:hc});const ra=512,xo=Ku(),Ln=xo.heightmap,ln=new Oa(-l/2,l/2,l/2,-l/2,.1,100);ln.position.set(0,50,0),ln.lookAt(0,0,0),ln.updateProjectionMatrix(),ga||(ga=new je({vertexShader:`
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
    `,uniforms:{uMinHeight:{value:v},uMaxHeight:{value:h}},side:ze}));const ve=ga,To=new Ce(U,ve);To.rotation.x=-Math.PI/2;function is(_){if(!_){console.warn("updateHeightmapTexture: renderer not provided");return}const E=_.getRenderTarget();_.setRenderTarget(Ln),_.render(To,ln),_.setRenderTarget(E)}const Hi=xo.wetness1,Gi=xo.wetness2;let la=Hi,rs=Gi;va||(va=new Go(2,2));const zi=va,kl=new Oa(-1,1,1,-1,0,1),ls=Array.from({length:32},()=>new pc),cs=Array.from({length:32},()=>new H),Te=new je({uniforms:{uHeightmap:{value:Ln.texture},uPreviousWetness:{value:null},uWaterLevel:{value:r},uWaveAmplitude:{value:.26},uWaveFrequency:{value:4.2},uWaveHeightMultiplier:{value:4.13},uWaveTime:{value:0},uWaveAngleCos:{value:1},uWaveAngleSin:{value:0},uTime:{value:0},uDecayRate:{value:.98},uMinHeight:{value:v},uMaxHeight:{value:h},uTerrainSize:{value:l},uMeshOffset:{value:new ue(0,0)},uCurvature:{value:2e-5},uWaterfallPositions:{value:cs},uWaterfallCount:{value:0},uSplatPositions:{value:ls},uSplatCount:{value:0},uGreenZoneWetnessIntensity:{value:0},uGreenZoneMin:{value:.13},uGreenZoneMax:{value:3.2}},vertexShader:`
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
    `}),Wl=new Ce(zi,Te);function Ul(_,E,P){if(!_||!E)return;Te.uniforms.uWaterLevel.value=E.uniforms.uWaterLevel?.value??r,Te.uniforms.uWaveAmplitude.value=E.uniforms.uWaveAmplitude?.value??.26,Te.uniforms.uWaveFrequency.value=E.uniforms.uWaveFrequency?.value??4.2,Te.uniforms.uWaveHeightMultiplier.value=E.uniforms.uWaveHeightMultiplier?.value??4.13,Te.uniforms.uWaveTime.value=E.uniforms.uWaveTime?.value??0,Te.uniforms.uWaveAngleCos.value=E.uniforms.uWaveAngleCos?.value??1,Te.uniforms.uWaveAngleSin.value=E.uniforms.uWaveAngleSin?.value??0,Te.uniforms.uMeshOffset.value.copy(E.uniforms.uMeshOffset?.value??new ue(0,0)),Te.uniforms.uCurvature.value=E.uniforms.uCurvature?.value??2e-5,Te.uniforms.uTime.value=P,Te.uniforms.uPreviousWetness.value=rs.texture;const O=_.getRenderTarget();_.setRenderTarget(la),_.render(Wl,kl),_.setRenderTarget(O);const G=la;la=rs,rs=G}return{mesh:Yt,geometry:U,material:Xe,body:ke,collider:Ke,size:l,getHeightAt:fe,sampleHeightAt:Fe,randomPosition:re,sculpt:as,stamp:oa,updatePhysics:go,simpleNoise:x,config:{size:l,segments:e,islandRadius:d,falloffStart:u,falloffEnd:f,fanOutEnd:p,maxHeight:h,minDepth:v},coolLavaSpots:{add(_,E,P){const O=Xe.uniforms,G=O.uCoolLavaSpots.value;let Z=O.uCoolLavaSpotCount.value;if(Z>=Mo){G.copyWithin(0,4);const F=(Mo-1)*4;G[F]=_,G[F+1]=E,G[F+2]=P}else{const F=Z*4;G[F]=_,G[F+1]=E,G[F+2]=P,O.uCoolLavaSpotCount.value=Z+1}},clear(){Xe.uniforms.uCoolLavaSpotCount.value=0}},heightmap:{renderTarget:Ln,texture:Ln.texture,camera:ln,mesh:To,update:is,size:ra,worldSize:l,minHeight:v,maxHeight:h},setRenderer(_){if(It=_,_){const E=_.getRenderTarget(),P=_.getClearColor(new Q),O=_.getClearAlpha();_.setClearColor(0,0),_.setRenderTarget(Hi),_.clear(!0,!0,!0),_.setRenderTarget(Gi),_.clear(!0,!0,!0),_.setClearColor(P,O),_.setRenderTarget(E),is(_)}},wetnessMap:{texture:()=>rs.texture,update:Ul,size:y,worldSize:l,setDecayRate(_){Te.uniforms.uDecayRate.value=_},setGreenZoneWetnessIntensity(_){Te.uniforms.uGreenZoneWetnessIntensity.value=Math.max(0,Math.min(1,_))},setSplats(_){const E=_&&_.length>0?Math.min(_.length,32):0;for(let P=0;P<32;P++)if(P<E){const O=_[P];ls[P].set(O.x,0,O.z,O.radius)}else ls[P].set(0,0,0,0);Te.uniforms.uSplatPositions.value=ls,Te.uniforms.uSplatCount.value=E},setWaterfalls(_){const E=_&&_.length>0?Math.min(_.length,32):0;for(let P=0;P<32;P++)if(P<E){const O=_[P];cs[P].set(O.x,O.y,O.z)}else cs[P].set(0,0,0);Te.uniforms.uWaterfallPositions.value=cs,Te.uniforms.uWaterfallCount.value=E},dispose(){Te.dispose(),zi.dispose()}},dispose(){To&&To.geometry.dispose()},cleanupPhysics(_){Ke&&_&&(_.removeCollider(Ke,!0),Ke=null),ke&&_&&(_.removeRigidBody(ke),ke=null)}}}const{lerp:un}=Zt,Pe=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];for(let t=0;t<256;t++)Pe[256+t]=Pe[t];function ya(t){return t*t*t*(t*(t*6-15)+10)}function Kt(t,e,n,s){const o=t&15,i=o<8?e:n,a=o<4?n:o==12||o==14?e:s;return((o&1)==0?i:-i)+((o&2)==0?a:-a)}class qu{noise(e,n,s){const o=Math.floor(e),i=Math.floor(n),a=Math.floor(s),r=o&255,l=i&255,c=a&255;e-=o,n-=i,s-=a;const d=e-1,u=n-1,f=s-1,p=ya(e),h=ya(n),v=ya(s),y=Pe[r]+l,w=Pe[y]+c,M=Pe[y+1]+c,x=Pe[r+1]+l,m=Pe[x]+c,S=Pe[x+1]+c;return un(un(un(Kt(Pe[w],e,n,s),Kt(Pe[m],d,n,s),p),un(Kt(Pe[M],e,u,s),Kt(Pe[S],d,u,s),p),h),un(un(Kt(Pe[w+1],e,n,f),Kt(Pe[m+1],d,n,f),p),un(Kt(Pe[M+1],e,u,f),Kt(Pe[S+1],d,u,f),p),h),v)}}function Zu(){const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d"),n=e.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,"rgba(255, 255, 255, 1.0)"),n.addColorStop(.9,"rgba(255, 255, 255, 0.95)"),n.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=n,e.fillRect(0,0,64,64);const s=new Qo(t);return s.needsUpdate=!0,s}const Ju=Zu(),Xi=new pt;function zh(){const e=new Uint8Array(2097152);let n=0;const s=.05,o=new qu,i=new H;for(let r=0;r<128;r++)for(let l=0;l<128;l++)for(let c=0;c<128;c++){const d=1-i.set(c,l,r).subScalar(64).divideScalar(128).length();e[n]=(168+127.6*o.noise(c*s/1.53,l*s,r*s/1.51))*d*d,n++}const a=new vc(e,128,128,128);return a.format=yc,a.minFilter=sn,a.magFilter=sn,a.unpackAlignment=1,a.needsUpdate=!0,a}function Qu(t={}){const{startX:e,startZ:n,endX:s,endZ:o,cloudHeight:i=13.2,cloudTexture:a,baseOpacity:r=.23,rainCount:l=100,timeOfDay:c="day"}=t,d=new yn,u=`
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
  `,f=`
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
  `,p=new Wr(15,8,15),h=new Q(6978965);let v=1;c==="night"&&(h.set(1715530),v=.028);const y=new wc({glslVersion:Mc,uniforms:{base:{value:h},map:{value:a},cameraPos:{value:new H},inverseModelMatrix:{value:new pt},threshold:{value:.25},opacity:{value:0},range:{value:.08},steps:{value:5},frame:{value:0},textureRotation:{value:0},brightnessFactor:{value:v}},vertexShader:u,fragmentShader:f,side:ze,transparent:!0,depthWrite:!1,depthTest:!1}),w=new Ce(p,y);w.position.y=i,w.scale.set(11.11,6.12,8.3),w.visible=!1,w.renderOrder=6,w.geometry.boundingSphere=new Ur(new H(0,0,0),1.5),d.add(w);const M=new ho,x=new Float32Array(l*3),m=[],S=.8,b=.3;for(let T=0;T<l;T++){const C=Math.random()*Math.PI*2,D=Math.random()*3.2;x[T*3]=Math.cos(C)*D,x[T*3+1]=i-Math.random()*4,x[T*3+2]=Math.sin(C)*D,m.push({initialY:x[T*3+1],initialX:x[T*3],initialZ:x[T*3+2],speed:2+Math.random()*3})}M.setAttribute("position",new Le(x,3));const I=new ui({color:7258367,size:.16,transparent:!0,opacity:0,blending:Br,depthWrite:!1,depthTest:!0,map:Ju}),A=new Xs(M,I);return A.renderOrder=5,d.add(A),d.position.set(e,0,n),d.userData={cloud:w,cloudMaterial:y,rainParticles:A,rainVelocities:m,windDriftX:S,windDriftZ:b,creationTime:Date.now(),startPos:{x:e,z:n},endPos:{x:s,z:o},baseOpacity:r,drizzleSound:null,rainSkipFrame:!1},d}function $u(t,e,n=0){const{cloud:s,cloudMaterial:o}=t.userData;if(!s.visible)return;o.uniforms.cameraPos.value.copy(e.position),s.updateWorldMatrix(!0,!1),Xi.copy(s.matrixWorld).invert(),o.uniforms.inverseModelMatrix.value.copy(Xi),o.uniforms.frame.value++,o.uniforms.textureRotation.value+=n*.3;const i=o.uniforms.frame.value*.02;o.uniforms.steps.value=20+Math.sin(i)*5}function ed(t,e){const{rainParticles:n,rainVelocities:s,windDriftX:o,windDriftZ:i}=t.userData;if(n.material.opacity<.01||(t.userData.rainSkipFrame=!t.userData.rainSkipFrame,t.userData.rainSkipFrame))return;const a=n.geometry.attributes.position.array,r=e*2;for(let l=0;l<s.length;l++){const c=s[l];a[l*3+1]-=c.speed*r,a[l*3]+=o*r,a[l*3+2]+=i*r,a[l*3+1]<.1&&(a[l*3+1]=c.initialY,a[l*3]=c.initialX,a[l*3+2]=c.initialZ)}n.geometry.attributes.position.needsUpdate=!0}function td(t,e){const{rainParticles:n}=t.userData;n.material.opacity=Math.max(0,Math.min(1,e))}const rt=200,Na=new je({uniforms:{uTime:{value:0},uJiggleFrequency:{value:8}},transparent:!0,side:ze,depthWrite:!1,vertexShader:`
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
  `});let ge=null,Se=null,Nt=null;const Ha=new H(.427,.855,.256),ko=[],oo=new Set,Jt=new pt,fs=new pt,nd=new Vt().setFromEuler(new Ks(-Math.PI/2,0,0)),qi=new H,Zi=new H;let Ue,Ht,Mn,_n,Ls;const od={aRadius:{pack:"A",comp:0},aVisualScale:{pack:"A",comp:1},aSpawnScale:{pack:"A",comp:2},aJiggleAmplitude:{pack:"A",comp:3},aJiggleTime:{pack:"B",comp:0},aAttractionStrength:{pack:"B",comp:1},aGroundFlatten:{pack:"B",comp:2},aFlattenDrop:{pack:"B",comp:3}};function kh(t){const e=new Ps(1,24,24);Ue=new We(new Float32Array(rt*4),4),Ht=new We(new Float32Array(rt*4),4),Mn=new We(new Float32Array(rt*3),3),_n=new We(new Float32Array(rt*3),3),Ls=new We(new Float32Array(rt),1),e.setAttribute("aPackA",Ue),e.setAttribute("aPackB",Ht),e.setAttribute("aVelocity",Mn),e.setAttribute("aAttractionDir",_n),e.setAttribute("aHeatTint",Ls),ge=new Dn(e,Na,rt),ge.count=0,ge.castShadow=!1,ge.receiveShadow=!1,ge.renderOrder=3,ge.frustumCulled=!1,ge.isPersistent=!0,t.add(ge);const n=new Go(1,1);Nt=new We(new Float32Array(rt),1),n.setAttribute("aOpacity",Nt),Se=new Dn(n,ad,rt),Se.count=0,Se.castShadow=!1,Se.receiveShadow=!1,Se.renderOrder=2,Se.frustumCulled=!1,Se.isPersistent=!0,t.add(Se);const s=new pt().makeTranslation(0,-1e3,0);for(let o=0;o<rt;o++)Se.setMatrixAt(o,s);Se.instanceMatrix.needsUpdate=!0,ko.length=0,oo.clear();for(let o=rt-1;o>=0;o--)ko.push(o),oo.add(o),Jt.makeTranslation(0,-1e3,0),ge.setMatrixAt(o,Jt),Ue.array[o*4+1]=0;ge.instanceMatrix.needsUpdate=!0}function Li(){if(ko.length===0)return console.warn("Metaball instance pool exhausted!"),-1;const t=ko.pop();return oo.delete(t),t>=ge.count&&(ge.count=t+1),t}function el(t){if(t<0||t>=rt||oo.has(t))return;const e=t*4;Ue.array[e]=0,Ue.array[e+1]=0,Jt.makeTranslation(0,-1e3,0),ge.setMatrixAt(t,Jt),ko.push(t),oo.add(t),Se&&(Jt.makeTranslation(0,-1e3,0),Se.setMatrixAt(t,Jt),Nt&&(Nt.array[t]=0),Se.instanceMatrix.needsUpdate=!0,Nt&&(Nt.needsUpdate=!0)),t===ge.count-1&&sd()}function sd(){let t=ge.count-1;for(;t>=0&&oo.has(t);)t--;ge.count=t+1}function qs(t,e,n,s){Jt.makeTranslation(e,n,s),ge.setMatrixAt(t,Jt)}function lt(t,e,n){const s=od[e];if(s){const o=s.pack==="A"?Ue:Ht;o.array[t*4+s.comp]=n}else{const o=ge.geometry.getAttribute(e);o&&(o.array[t]=n)}}function Ga(t,e,n,s,o){const i=ge.geometry.getAttribute(e);if(i){const a=t*3;i.array[a]=n,i.array[a+1]=s,i.array[a+2]=o}}function tl(){ge&&(ge.instanceMatrix.needsUpdate=!0,Ue.needsUpdate=!0,Ht.needsUpdate=!0,Mn.needsUpdate=!0,_n.needsUpdate=!0,Ls.needsUpdate=!0,Se&&(Se.count=ge.count,Se.instanceMatrix.needsUpdate=!0,Nt.needsUpdate=!0))}function Wh(){return ge}const ad=new je({transparent:!0,depthWrite:!1,depthTest:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:ze,vertexShader:`
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
  `}),Rt=[];let Zs=0;const Uh={cache:new Map,get(t){const e=Math.round(t*100)/100;if(!this.cache.has(e)){let n;e<.15?n=16:e<.25?n=24:e<.4?n=32:n=48,this.cache.set(e,new Ps(e,n,n))}return this.cache.get(e)},dispose(){this.cache.forEach(t=>t.dispose()),this.cache.clear()}},Ot={enabled:!0,interval:8e3,cloudDuration:6e3,dropletsPerCloud:12,dropletInterval:400,minRadius:.1,maxRadius:.15,spawnHeight:10.2,cloudSpeed:2.5,fadeInDuration:2800,fadeOutDuration:2800};function Bh(t){Object.assign(Ot,t)}function nl(t,e,n,s,o,i){qs(t,e,n,s);const a=t*4;Ue.array[a]=o,Ue.array[a+1]=1,Ue.array[a+2]=i,Ue.array[a+3]=0,Ht.array.fill(0,a,a+4);const r=t*3;Mn.array.fill(0,r,r+3),_n.array.fill(0,r,r+3),Ls.array[t]=0}function ol(t,e,n,s,o,i,a,r,l,c){return{instanceIndex:t,position:new H(e,n,s),visualScale:1,body:l,collider:c,radius:o,mass:i,active:!0,hasSpawnedRipple:!1,originalMass:a,jiggleAmplitude:0,jiggleTime:0,spawnProgress:r,attractionDir:new H,attractionStrength:0}}function Vh(t,e,n){return function(o,i){const a=Ot.minRadius+Math.random()*(Ot.maxRadius-Ot.minRadius),r=Li();if(r<0)return null;nl(r,o,Ot.spawnHeight,i,a,.01);const l=a*a*a*30.5,c=Ct.RigidBodyDesc.dynamic().setTranslation(o,Ot.spawnHeight,i).setLinearDamping(n.damping.linear).setAngularDamping(n.damping.angular).setCcdEnabled(!0),d=e.createRigidBody(c),u=Ct.ColliderDesc.ball(a).setMass(l).setFriction(n.ballGround.friction).setRestitution(n.ballGround.restitution).setCollisionGroups(to.ball),f=e.createCollider(u,d);Zs+=l;const p=ol(r,o,Ot.spawnHeight,i,a,l,l,0,d,f);return Rt.push(p),p}}function Yh(t){const e=Na.uniforms.uTime.value+t;Na.uniforms.uTime.value=e;const n=Math.pow(.1,t);let s=!1;Rt.forEach(o=>{if(!o.active)return;s=!0;const i=o.instanceIndex,a=i*4;if(o.spawnProgress<1){o.spawnProgress+=t*2.5,o.spawnProgress=Math.min(o.spawnProgress,1);const d=1-Math.pow(1-o.spawnProgress,3);Ue.array[a+2]=d}if(o.jiggleAmplitude>0&&(o.jiggleTime+=t,o.jiggleAmplitude*=n,o.jiggleAmplitude<.001&&(o.jiggleAmplitude=0,o.jiggleTime=0),Ue.array[a+3]=o.jiggleAmplitude,Ht.array[a]=o.jiggleTime),!o.isEvaporating){const d=o.body.linvel(),u=i*3;Mn.array[u]=d.x,Mn.array[u+1]=d.y,Mn.array[u+2]=d.z}const r=i*3;_n.array[r]=o.attractionDir.x,_n.array[r+1]=o.attractionDir.y,_n.array[r+2]=o.attractionDir.z,Ht.array[a+1]=o.attractionStrength;const l=o.isOnGround?1:0,c=o.isOnGround?8:4;if(o.groundFlatten=o.groundFlatten||0,o.groundFlatten+=(l-o.groundFlatten)*Math.min(c*t,1),Ht.array[a+2]=o.groundFlatten,Ht.array[a+3]=o.groundFlatten*o.radius*.55,Se){const d=o.instanceIndex;if(o.groundFlatten>.05){const u=o.terrainHeightAtBall!==void 0?o.terrainHeightAtBall:o.position.y-o.radius,f=o.radius*3.5*o.groundFlatten;qi.set(o.position.x+Ha.x*o.radius*.8,u+.04,o.position.z+Ha.z*o.radius*.8),Zi.set(f,f,1),fs.compose(qi,nd,Zi),Se.setMatrixAt(d,fs),Nt.array[d]=o.groundFlatten}else fs.makeTranslation(0,-1e3,0),Se.setMatrixAt(d,fs),Nt.array[d]=0}}),s&&tl()}function id(t,e=1){!t||!t.active||(t.jiggleAmplitude=.08*e,t.jiggleTime=0)}function jh(){return Zs}function rd(t){Zs+=t}function Kh(t){Ha.copy(t)}function Xh(){Zs=0}function Ts(t,e,n){if(t.active=!1,el(t.instanceIndex),t.body){try{n.removeRigidBody(t.body)}catch{}t.body=null,t.collider=null}else if(t.collider){try{n.removeCollider(t.collider,!0)}catch{}t.collider=null}}const ld=.15,wa=3,cd=.65;function sl(t,e,n,s){if(!t.active||t.isEvaporating||t.radius<ld)return!1;const o=t.radius*cd;if(o<Ot.minRadius*.8)return!1;const i=t.position.clone(),a=t.body.linvel(),r=t.originalMass;Ts(t,e,n);const l=Rt.indexOf(t);l>-1&&Rt.splice(l,1);const c=Math.PI*2/wa;for(let d=0;d<wa;d++){const u=c*d+Math.random()*.3,f=Li();if(f<0)continue;const p=t.radius*1.2,h=i.x+Math.cos(u)*p,v=i.y+.1,y=i.z+Math.sin(u)*p;nl(f,h,v,y,o,1);const w=o*o*o*30.5,M=Ct.RigidBodyDesc.dynamic().setTranslation(h,v,y).setLinvel(a.x,a.y,a.z).setLinearDamping(s.damping.linear).setAngularDamping(s.damping.angular).setCcdEnabled(!0),x=n.createRigidBody(M),m=Ct.ColliderDesc.ball(o).setMass(w).setFriction(s.ballGround.friction).setRestitution(s.ballGround.restitution).setCollisionGroups(to.ball),S=n.createCollider(m,x),b=.8,I=new H(Math.cos(u)*b,.342+Math.random()*.185,Math.sin(u)*b).normalize(),T=(4.4+Math.random()*3.42)*w;x.applyImpulse({x:I.x*T,y:I.y*T,z:I.z*T},!0);const C=ol(f,h,v,y,o,w,r/wa,1,x,S);Rt.push(C)}return!0}const hs=new Ct.Ray({x:0,y:20,z:0},{x:0,y:-1,z:0}),Ne=[],Fn=[];function qh(t,e){const{world:n,PHYSICS_CONFIG:s,enabled:o,waterLevel:i,rippleColor:a,scene:r,rippleSystem:l,playWaterSplashSound:c,triggerSplitParticles:d,impactSplats:u,ballsInTarget:f,hasActiveLava:p,isPositionNearActiveLava:h,emitSteamBurst:v}=e;if(Ne.length=0,o)for(let m=0;m<Rt.length;m++){const S=Rt[m];S.active&&!S.isEvaporating&&Ne.push(S)}Fn.length=Ne.length;for(let m=0;m<Ne.length;m++)Fn[m]=Ne[m].body.translation();Ne.forEach((m,S)=>{if(!m.active)return;const b=Fn[S],I=b.x,A=b.y,T=b.z;if(!m.hasSpawnedRipple){const J=A-m.radius,X=m.body.linvel();if(X.y<0&&J<=i-.685){const te=(i-J)/Math.abs(X.y),U=.142,N=I-X.x*te+X.x*U,fe=T-X.z*te+X.z*U;l.spawnRipple(N,fe,{size:m.radius*3,speed:1,color:a}),c(m.radius),m.hasSpawnedRipple=!0}}if(A-m.radius<i-.88){Ts(m,r,n),f.delete(m);return}hs.origin.x=I,hs.origin.z=T;const C=n.castRay(hs,40,!0,void 0,void 0,void 0,void 0,J=>{const X=J.parent();return X!==null&&X.isFixed()});let D=-100,k=!1;const K=A-m.radius;if(C!==null){if(D=hs.pointAt(C.timeOfImpact).y,K<D-.55){const X=m.body.linvel();m.body.setTranslation({x:I,y:D+m.radius+.2,z:T},!0),m.body.setLinvel({x:X.x,y:Math.max(0,X.y),z:X.z},!0)}k=K<=D+.3&&D>i+.5;const J=m.isOnGround;if(m.isOnGround=k,k&&!J){const te=-m.body.linvel().y;if(te>3){const U=Math.min(te/8,1);d({x:I,y:D+m.radius*.5,z:T},m.radius*(.5+U*.5)),u.push({x:I,z:-T,radius:m.radius*(1.5+U*2),life:0,maxLife:1.5+U*1}),u.length>16&&u.shift()}}if(k){const X=m.body.linvel();X.y>.1&&m.body.setLinvel({x:X.x,y:X.y*.2,z:X.z},!0),m.body.applyImpulse({x:0,y:-m.mass*3*t,z:0},!0)}}if(m.terrainHeightAtBall=D,p()&&h(I,A,T,m.radius)){v(m.position,m.radius,12),Ts(m,r,n);return}m.position.set(I,A,T),qs(m.instanceIndex,I,A,T);for(let J=S+1;J<Ne.length;J++){const X=Ne[J];if(!X.active)continue;const te=Fn[J],U=b.x-te.x,N=b.z-te.z;if(U*U+N*N>1)continue;const fe=b.y-te.y;if(Math.sqrt(U*U+fe*fe+N*N)>=m.radius+X.radius)continue;const $=m.radius>=X.radius?m:X,ce=m.radius>=X.radius?X:m;if(!$.active||!ce.active)continue;const Ee=Math.pow(m.radius**3+X.radius**3,1/3),Fe=$.mass+ce.mass,vt=$.body.linvel(),nt=ce.body.linvel();$.body.setLinvel({x:(vt.x*$.mass+nt.x*ce.mass)/Fe,y:(vt.y*$.mass+nt.y*ce.mass)/Fe,z:(vt.z*$.mass+nt.z*ce.mass)/Fe},!0),$.originalMass=($.originalMass||$.mass)+(ce.originalMass||ce.mass),$.radius=Ee,$.mass=Fe,$.collider&&n.removeCollider($.collider,!0),$.collider=n.createCollider(Ct.ColliderDesc.ball(Ee).setMass(Fe).setFriction(s.ballGround.friction).setRestitution(s.ballGround.restitution).setCollisionGroups(to.ball),$.body),lt($.instanceIndex,"aRadius",Ee),id($,Math.min(ce.radius/$.radius*1.5,1)),Ts(ce,r,n)}});const y=3,w=y*y,M=1.5,x=y*.4;for(const m of Ne)m.active&&(m.attractionDir.set(0,0,0),m.attractionStrength=0);for(let m=0;m<Ne.length;m++){const S=Ne[m];if(!S.active)continue;const b=Fn[m];for(let I=m+1;I<Ne.length;I++){const A=Ne[I];if(!A.active)continue;const T=Fn[I],C=T.x-b.x,D=T.z-b.z;if(C*C+D*D>w)continue;const k=T.y-b.y,K=Math.sqrt(C*C+k*k+D*D);if(K>=y||K<.1)continue;const J=C/K,X=k/K,te=D/K,U=M*(1-K/y),N=S.body.linvel(),fe=A.body.linvel();if(S.body.setLinvel({x:N.x+J*U*t,y:N.y+X*U*t,z:N.z+te*U*t},!0),A.body.setLinvel({x:fe.x-J*U*t,y:fe.y-X*U*t,z:fe.z-te*U*t},!0),K<x){const re=1-K/x;S.attractionDir.x+=J*re,S.attractionDir.y+=X*re,S.attractionDir.z+=te*re,S.attractionStrength=Math.max(S.attractionStrength,re),A.attractionDir.x-=J*re,A.attractionDir.y-=X*re,A.attractionDir.z-=te*re,A.attractionStrength=Math.max(A.attractionStrength,re)}}}return Ne.length>0&&tl(),Ne}const ud=30,Ma={turbidity:0,rayleigh:.025,mieCoefficient:.01,exposure:.53},dd=20,g={startDelay:8500,duration:14800,dropInterval:120,ballsDropped:0,isActive:!1,startTime:0,steadyStateReached:!1,steadyStateValues:null,cloudUpdateFrameCounter:0,startTimeoutId:null,dropIntervalId:null,terrainDarknessBlend:0,isPaused:!1,pauseTimeoutRemaining:0,pauseTime:0,stormScheduledTime:0};function al(t,e,n,s,o=0){const i=t.x,a=t.z,r=e,l=e*e*e;Bl((c,d,u)=>{const f=Li();if(f<0)return null;qs(f,i,n,a),lt(f,"aRadius",r),lt(f,"aVisualScale",1),lt(f,"aSpawnScale",1),lt(f,"aJiggleAmplitude",0),lt(f,"aJiggleTime",0),Ga(f,"aVelocity",0,0,0),Ga(f,"aAttractionDir",0,0,0),lt(f,"aAttractionStrength",0),lt(f,"aGroundFlatten",0),lt(f,"aFlattenDrop",0),lt(f,"aHeatTint",0),s&&rd(l);const p=d.RigidBodyDesc.dynamic().setTranslation(i,n,a).setLinearDamping(o).setAngularDamping(0).setCcdEnabled(!0),h=c.createRigidBody(p),v=d.ColliderDesc.ball(r).setMass(l).setFriction(u.ballGround.friction).setRestitution(u.ballGround.restitution).setCollisionGroups(to.ball),y=c.createCollider(v,h);return{instanceIndex:f,position:new H(i,n,a),visualScale:1,body:h,collider:y,radius:r,mass:l,active:!0,hasSpawnedRipple:!1,originalMass:l,jiggleAmplitude:0,jiggleTime:0,spawnProgress:1,attractionDir:new H,attractionStrength:0}},Rt)}function fd(t,e=!0,n=null){const{scene:s,randomTerrainPosition:o,createCloudIndicator:i,sharedCloudTexture:a,sky:r,renderer:l,water:c,timeOfDay:d="day"}=t,u=85;g.stormScheduledTime=Date.now();const f=n!==null?n:g.startDelay;g.startTimeoutId=setTimeout(()=>{g.startTimeoutId=null,g.isActive=!0,g.startTime=Date.now(),g.ballsDropped=0;const p=o(),h=i({startX:p.x,startZ:p.z,endX:p.x,endZ:p.z,cloudTexture:a,rainCount:50,cloudHeight:ud,timeOfDay:d}),v=h.userData.cloud,y=h.userData.cloudMaterial;v.scale.set(125,32,128),v.rotation.y=Math.random()*Math.PI*2;const w=.22,M=.344;d!=="night"&&y.uniforms.base.value.setRGB(121/255*.5,138/255*.55,160/255*.65),y.uniforms.threshold.value=M,v.renderOrder=10,s.add(h);const x=Yl();ec(),h.userData.drizzleSound=x,g.cloudData={group:h,startTime:Date.now(),rotationSpeed:.0013,baseOpacity:w},g.originalSkyValues={turbidity:r.material.uniforms.turbidity.value,rayleigh:r.material.uniforms.rayleigh.value,mieCoefficient:r.material.uniforms.mieCoefficient.value,exposure:l.toneMappingExposure},g.originalWaterValues={heightMultiplier:c.material.uniforms.uWaveHeightMultiplier.value,amplitude:c.material.uniforms.uWaveAmplitude.value,waveSpeed:c.material.uniforms.uWaveSpeed.value,waterLevel:c.mesh.position.y},g.originalHemisphereColors={deepColor:c.hemisphereMesh.material.uniforms.uDeepColor.value.clone(),shallowColor:c.hemisphereMesh.material.uniforms.uShallowColor.value.clone()},g.water=c,g.timeOfDay=d,g.lightningTriggered=!1,g.lightningStarted=!1;const m=document.createElement("div");m.id="lightning-flash",m.style.position="fixed",m.style.top="0",m.style.left="0",m.style.width="100%",m.style.height="100%",m.style.backgroundColor="white",m.style.opacity="0",m.style.pointerEvents="none",m.style.zIndex="1000",document.body.appendChild(m),g.lightningFlash=m,g.dropIntervalId=setInterval(()=>{if(g.ballsDropped>=u){clearInterval(g.dropIntervalId),g.dropIntervalId=null;return}const S=o(),b=.12+Math.random()*.1;al(S,b,dd,e),g.ballsDropped++},g.dropInterval)},f)}function _a(t,e){if(!g.lightningTriggered&&t>2500&&t<3500){g.lightningStarted||(g.lightningStarted=!0,g.lightningStartTime=e,jl(),tc());const n=e-g.lightningStartTime;let s=0;return n<80?s=.9*(1-n/80):n>=180&&n<280?s=.85*(1-(n-180)/100):n>=280&&(g.lightningTriggered=!0,s=0),g.lightningFlash&&(g.lightningFlash.style.opacity=s.toString()),!0}return!1}function il(){if(g.lightningFlash){const t=document.getElementById("lightning-flash");t&&document.body.removeChild(t),g.lightningFlash=null}}function Zh(){if(!g.isPaused){if(g.isPaused=!0,g.pauseTime=Date.now(),g.startTimeoutId!==null&&!g.isActive){const t=Date.now()-g.stormScheduledTime;g.pauseTimeoutRemaining=Math.max(0,g.startDelay-t),clearTimeout(g.startTimeoutId),g.startTimeoutId=null}g.dropIntervalId!==null&&(clearInterval(g.dropIntervalId),g.dropIntervalId=null)}}function Jh(t,e){if(!g.isPaused)return;const n=Date.now()-g.pauseTime;if(g.isPaused=!1,g.startTime>0&&(g.startTime+=n),g.cloudData&&g.cloudData.startTime>0&&(g.cloudData.startTime+=n),g.lightningStartTime>0&&(g.lightningStartTime+=n),g.stormScheduledTime>0&&(g.stormScheduledTime+=n),g.pauseTimeoutRemaining>0&&!g.isActive&&(fd(t,e,g.pauseTimeoutRemaining),g.pauseTimeoutRemaining=0),g.isActive&&g.ballsDropped<45){const{randomTerrainPosition:s}=t,o=45;g.dropIntervalId=setInterval(()=>{if(g.ballsDropped>=o){clearInterval(g.dropIntervalId),g.dropIntervalId=null;return}const i=s(),a=.12+Math.random()*.1;al(i,a,Ot.spawnHeight,e),g.ballsDropped++},g.dropInterval)}}function Qh(){g.isActive=!1,g.ballsDropped=0,g.startTime=0,g.lightningTriggered=!1,g.lightningStarted=!1,g.steadyStateReached=!1,g.steadyStateValues=null,g.cloudUpdateFrameCounter=0,g.timeOfDay=void 0,g.terrainDarknessBlend=0,g.isPaused=!1,g.pauseTimeoutRemaining=0,g.pauseTime=0,g.stormScheduledTime=0,g.startTimeoutId!==null&&(clearTimeout(g.startTimeoutId),g.startTimeoutId=null),g.dropIntervalId!==null&&(clearInterval(g.dropIntervalId),g.dropIntervalId=null),Vl(),g.cloudData?.group?.userData?.drizzleSound&&Pr(g.cloudData.group.userData.drizzleSound),il(),delete g.originalSkyValues,g.originalWaterValues&&g.water&&(g.water.setWaveChoppiness(g.originalWaterValues.heightMultiplier,g.originalWaterValues.amplitude,g.originalWaterValues.waveSpeed),g.water.mesh.position.y=g.originalWaterValues.waterLevel),g.originalHemisphereColors&&g.water&&(g.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(g.originalHemisphereColors.deepColor),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(g.originalHemisphereColors.shallowColor)),delete g.originalWaterValues,delete g.originalHemisphereColors,delete g.water}function $h(t){const{gameStarted:e,scene:n,camera:s,dt:o,sky:i,renderer:a,updateCloud:r,updateRainParticles:l,setRainOpacity:c}=t;if(!e||!g.isActive||!g.cloudData)return!1;const d=Date.now(),u=d-g.startTime,f=g.cloudData,p=d-f.startTime,{cloud:h,cloudMaterial:v}=f.group.userData;h.visible||(h.visible=!0),g.cloudUpdateFrameCounter++,g.cloudUpdateFrameCounter>=1.22&&(r(f.group,s,o),g.cloudUpdateFrameCounter=0),h.rotation.y+=f.rotationSpeed;const y=4e3,w=3800,M=g.duration-2500,x=g.duration-2e3,m=u<w,S=u>x,b=!m&&!S;let I=f.baseOpacity;if(p<y){const C=p/y,D=C*C*C;I*=D}else if(u>M){const C=(u-(g.duration-1500))/1500;I*=Math.max(0,1-C)}v.uniforms.opacity.value=Math.max(0,I);const A=5e3,T=g.duration-5e3;if(b&&g.steadyStateReached&&u>=A&&u<=T)return l(f.group,o),c(f.group,I*.6),u>=2500&&u<=3500&&_a(u,d),!0;if(g.originalSkyValues&&g.timeOfDay!=="night"){_a(u,d);const C=g.originalSkyValues;if(m){const D=Math.pow(u/w,2);pa(i,a,C,Ma,D)}else if(S){const D=1-Math.pow(1-(u-x)/2e3,2);pa(i,a,Ma,C,D)}else g.steadyStateReached||(g.steadyStateReached=!0,pa(i,a,C,Ma,1))}else g.timeOfDay==="night"&&_a(u,d);if(g.originalHemisphereColors&&g.water){const C=new Q(4128),D=new Q(2245717),k=.6;if(m){const K=u/w,J=K*K;g.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(g.originalHemisphereColors.deepColor,C,J),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(g.originalHemisphereColors.shallowColor,D,J),g.timeOfDay!=="night"&&(g.terrainDarknessBlend=J*k)}else if(S){const K=(u-x)/2e3,J=1-Math.pow(1-K,2);g.water.hemisphereMesh.material.uniforms.uDeepColor.value.lerpColors(C,g.originalHemisphereColors.deepColor,J),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.lerpColors(D,g.originalHemisphereColors.shallowColor,J),g.timeOfDay!=="night"&&(g.terrainDarknessBlend=k*(1-J))}else g.steadyStateReached||(g.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(C),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(D),g.timeOfDay!=="night"&&(g.terrainDarknessBlend=k))}if(g.originalWaterValues&&g.water){const X=u<A,te=u>T;if(X){const U=Math.min(u/A,1),N=U*U,fe=g.originalWaterValues.heightMultiplier+(4.8-g.originalWaterValues.heightMultiplier)*N,re=g.originalWaterValues.amplitude+(.8-g.originalWaterValues.amplitude)*N,$=g.originalWaterValues.waveSpeed+(1.825-g.originalWaterValues.waveSpeed)*N,ce=g.originalWaterValues.waterLevel-.84*N;g.water.mesh.position.y=ce,g.water.setWaveChoppiness(fe,re,$)}else if(te){const U=Math.min((u-T)/5e3,1),N=U*U,fe=4.8+(g.originalWaterValues.heightMultiplier-4.8)*N,re=.8+(g.originalWaterValues.amplitude-.8)*N,$=1.825+(g.originalWaterValues.waveSpeed-1.825)*N,ce=g.originalWaterValues.waterLevel-.84+.84*N;g.water.mesh.position.y=ce,g.water.setWaveChoppiness(fe,re,$)}else if(!g.steadyStateReached){const U=g.originalWaterValues.waterLevel-.84;g.water.mesh.position.y=U,g.water.setWaveChoppiness(4.8,.8,1.825)}}return l(f.group,o),c(f.group,I*.6),u>g.duration?(g.isActive=!1,g.dropIntervalId!==null&&(clearInterval(g.dropIntervalId),g.dropIntervalId=null),g.terrainDarknessBlend=0,f.group&&(f.group.userData.drizzleSound&&Pr(f.group.userData.drizzleSound),n.remove(f.group),f.group.traverse(C=>{C.geometry&&C.geometry.dispose(),C.material&&C.material.dispose()})),g.cloudData=null,g.originalSkyValues&&(g.originalSkyValues=null),g.originalWaterValues&&g.water&&(g.water.setWaveChoppiness(g.originalWaterValues.heightMultiplier,g.originalWaterValues.amplitude,g.originalWaterValues.waveSpeed),g.water.mesh.position.y=g.originalWaterValues.waterLevel,g.originalWaterValues=null),g.originalHemisphereColors&&g.water&&(g.water.hemisphereMesh.material.uniforms.uDeepColor.value.copy(g.originalHemisphereColors.deepColor),g.water.hemisphereMesh.material.uniforms.uShallowColor.value.copy(g.originalHemisphereColors.shallowColor),g.originalHemisphereColors=null,g.water=null),il(),!1):!0}function rl(t){const e=new Map,n=new Map,s=t.clone();return ll(t,s,function(o,i){e.set(i,o),n.set(o,i)}),s.traverse(function(o){if(!o.isSkinnedMesh)return;const i=o,a=e.get(o),r=a.skeleton.bones;i.skeleton=a.skeleton.clone(),i.bindMatrix.copy(a.bindMatrix),i.skeleton.bones=r.map(function(l){return n.get(l)}),i.bind(i.skeleton,i.bindMatrix)}),s}function ll(t,e,n){n(t,e);for(let s=0;s<t.children.length;s++)ll(t.children[s],e.children[s],n)}function Ji(t,e){if(e===_c)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),t;if(e===Fa||e===Vr){let n=t.getIndex();if(n===null){const a=[],r=t.getAttribute("position");if(r!==void 0){for(let l=0;l<r.count;l++)a.push(l);t.setIndex(a),n=t.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),t}const s=n.count-2,o=[];if(e===Fa)for(let a=1;a<=s;a++)o.push(n.getX(0)),o.push(n.getX(a)),o.push(n.getX(a+1));else for(let a=0;a<s;a++)a%2===0?(o.push(n.getX(a)),o.push(n.getX(a+1)),o.push(n.getX(a+2))):(o.push(n.getX(a+2)),o.push(n.getX(a+1)),o.push(n.getX(a)));o.length/3!==s&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const i=t.clone();return i.setIndex(o),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),t}class cl extends xc{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(n){return new vd(n)}),this.register(function(n){return new yd(n)}),this.register(function(n){return new Ad(n)}),this.register(function(n){return new Dd(n)}),this.register(function(n){return new bd(n)}),this.register(function(n){return new Md(n)}),this.register(function(n){return new _d(n)}),this.register(function(n){return new xd(n)}),this.register(function(n){return new Td(n)}),this.register(function(n){return new gd(n)}),this.register(function(n){return new Sd(n)}),this.register(function(n){return new wd(n)}),this.register(function(n){return new Rd(n)}),this.register(function(n){return new Cd(n)}),this.register(function(n){return new pd(n)}),this.register(function(n){return new Id(n)}),this.register(function(n){return new Ed(n)})}load(e,n,s,o){const i=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=Do.extractUrlBase(e);a=Do.resolveURL(c,this.path)}else a=Do.extractUrlBase(e);this.manager.itemStart(e);const r=function(c){o?o(c):console.error(c),i.manager.itemError(e),i.manager.itemEnd(e)},l=new Yr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{i.parse(c,a,function(d){n(d),i.manager.itemEnd(e)},r)}catch(d){r(d)}},s,r)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,n,s,o){let i;const a={},r={},l=new TextDecoder;if(typeof e=="string")i=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===ul){try{a[ne.KHR_BINARY_GLTF]=new Pd(e)}catch(u){o&&o(u);return}i=JSON.parse(a[ne.KHR_BINARY_GLTF].content)}else i=JSON.parse(l.decode(e));else i=e;if(i.asset===void 0||i.asset.version[0]<2){o&&o(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new Yd(i,{path:n||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let d=0;d<this.pluginCallbacks.length;d++){const u=this.pluginCallbacks[d](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),r[u.name]=u,a[u.name]=!0}if(i.extensionsUsed)for(let d=0;d<i.extensionsUsed.length;++d){const u=i.extensionsUsed[d],f=i.extensionsRequired||[];switch(u){case ne.KHR_MATERIALS_UNLIT:a[u]=new md;break;case ne.KHR_DRACO_MESH_COMPRESSION:a[u]=new Ld(i,this.dracoLoader);break;case ne.KHR_TEXTURE_TRANSFORM:a[u]=new Od;break;case ne.KHR_MESH_QUANTIZATION:a[u]=new Fd;break;default:f.indexOf(u)>=0&&r[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(r),c.parse(s,o)}parseAsync(e,n){const s=this;return new Promise(function(o,i){s.parse(e,n,o,i)})}}function hd(){let t={};return{get:function(e){return t[e]},add:function(e,n){t[e]=n},remove:function(e){delete t[e]},removeAll:function(){t={}}}}const ne={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class pd{constructor(e){this.parser=e,this.name=ne.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,n=this.parser.json.nodes||[];for(let s=0,o=n.length;s<o;s++){const i=n[s];i.extensions&&i.extensions[this.name]&&i.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,i.extensions[this.name].light)}}_loadLight(e){const n=this.parser,s="light:"+e;let o=n.cache.get(s);if(o)return o;const i=n.json,l=((i.extensions&&i.extensions[this.name]||{}).lights||[])[e];let c;const d=new Q(16777215);l.color!==void 0&&d.setRGB(l.color[0],l.color[1],l.color[2],Ut);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Cc(d),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Sc(d),c.distance=u;break;case"spot":c=new Tc(d),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),St(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=n.createUniqueName(l.name||"light_"+e),o=Promise.resolve(c),n.cache.add(s,o),o}getDependency(e,n){if(e==="light")return this._loadLight(n)}createNodeAttachment(e){const n=this,s=this.parser,i=s.json.nodes[e],r=(i.extensions&&i.extensions[this.name]||{}).light;return r===void 0?null:this._loadLight(r).then(function(l){return s._getNodeRef(n.cache,r,l)})}}class md{constructor(){this.name=ne.KHR_MATERIALS_UNLIT}getMaterialType(){return dt}extendParams(e,n,s){const o=[];e.color=new Q(1,1,1),e.opacity=1;const i=n.pbrMetallicRoughness;if(i){if(Array.isArray(i.baseColorFactor)){const a=i.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Ut),e.opacity=a[3]}i.baseColorTexture!==void 0&&o.push(s.assignTexture(e,"map",i.baseColorTexture,no))}return Promise.all(o)}}class gd{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,n){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=o.extensions[this.name].emissiveStrength;return i!==void 0&&(n.emissiveIntensity=i),Promise.resolve()}}class vd{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];if(a.clearcoatFactor!==void 0&&(n.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&i.push(s.assignTexture(n,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(n.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&i.push(s.assignTexture(n,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(i.push(s.assignTexture(n,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const r=a.clearcoatNormalTexture.scale;n.clearcoatNormalScale=new ue(r,r)}return Promise.all(i)}}class yd{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_DISPERSION}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=o.extensions[this.name];return n.dispersion=i.dispersion!==void 0?i.dispersion:0,Promise.resolve()}}class wd{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return a.iridescenceFactor!==void 0&&(n.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&i.push(s.assignTexture(n,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(n.iridescenceIOR=a.iridescenceIor),n.iridescenceThicknessRange===void 0&&(n.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&i.push(s.assignTexture(n,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(i)}}class Md{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_SHEEN}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[];n.sheenColor=new Q(0,0,0),n.sheenRoughness=0,n.sheen=1;const a=o.extensions[this.name];if(a.sheenColorFactor!==void 0){const r=a.sheenColorFactor;n.sheenColor.setRGB(r[0],r[1],r[2],Ut)}return a.sheenRoughnessFactor!==void 0&&(n.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&i.push(s.assignTexture(n,"sheenColorMap",a.sheenColorTexture,no)),a.sheenRoughnessTexture!==void 0&&i.push(s.assignTexture(n,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(i)}}class _d{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return a.transmissionFactor!==void 0&&(n.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&i.push(s.assignTexture(n,"transmissionMap",a.transmissionTexture)),Promise.all(i)}}class xd{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_VOLUME}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];n.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&i.push(s.assignTexture(n,"thicknessMap",a.thicknessTexture)),n.attenuationDistance=a.attenuationDistance||1/0;const r=a.attenuationColor||[1,1,1];return n.attenuationColor=new Q().setRGB(r[0],r[1],r[2],Ut),Promise.all(i)}}class Td{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_IOR}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const o=this.parser.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=o.extensions[this.name];return n.ior=i.ior!==void 0?i.ior:1.5,Promise.resolve()}}class Sd{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_SPECULAR}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];n.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&i.push(s.assignTexture(n,"specularIntensityMap",a.specularTexture));const r=a.specularColorFactor||[1,1,1];return n.specularColor=new Q().setRGB(r[0],r[1],r[2],Ut),a.specularColorTexture!==void 0&&i.push(s.assignTexture(n,"specularColorMap",a.specularColorTexture,no)),Promise.all(i)}}class Cd{constructor(e){this.parser=e,this.name=ne.EXT_MATERIALS_BUMP}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return n.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&i.push(s.assignTexture(n,"bumpMap",a.bumpTexture)),Promise.all(i)}}class Rd{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const s=this.parser.json.materials[e];return!s.extensions||!s.extensions[this.name]?null:At}extendMaterialParams(e,n){const s=this.parser,o=s.json.materials[e];if(!o.extensions||!o.extensions[this.name])return Promise.resolve();const i=[],a=o.extensions[this.name];return a.anisotropyStrength!==void 0&&(n.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(n.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&i.push(s.assignTexture(n,"anisotropyMap",a.anisotropyTexture)),Promise.all(i)}}class Ad{constructor(e){this.parser=e,this.name=ne.KHR_TEXTURE_BASISU}loadTexture(e){const n=this.parser,s=n.json,o=s.textures[e];if(!o.extensions||!o.extensions[this.name])return null;const i=o.extensions[this.name],a=n.options.ktx2Loader;if(!a){if(s.extensionsRequired&&s.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return n.loadTextureImage(e,i.source,a)}}class Dd{constructor(e){this.parser=e,this.name=ne.EXT_TEXTURE_WEBP}loadTexture(e){const n=this.name,s=this.parser,o=s.json,i=o.textures[e];if(!i.extensions||!i.extensions[n])return null;const a=i.extensions[n],r=o.images[a.source];let l=s.textureLoader;if(r.uri){const c=s.options.manager.getHandler(r.uri);c!==null&&(l=c)}return s.loadTextureImage(e,a.source,l)}}class bd{constructor(e){this.parser=e,this.name=ne.EXT_TEXTURE_AVIF}loadTexture(e){const n=this.name,s=this.parser,o=s.json,i=o.textures[e];if(!i.extensions||!i.extensions[n])return null;const a=i.extensions[n],r=o.images[a.source];let l=s.textureLoader;if(r.uri){const c=s.options.manager.getHandler(r.uri);c!==null&&(l=c)}return s.loadTextureImage(e,a.source,l)}}class Id{constructor(e){this.name=ne.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const n=this.parser.json,s=n.bufferViews[e];if(s.extensions&&s.extensions[this.name]){const o=s.extensions[this.name],i=this.parser.getDependency("buffer",o.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return i.then(function(r){const l=o.byteOffset||0,c=o.byteLength||0,d=o.count,u=o.byteStride,f=new Uint8Array(r,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(d,u,f,o.mode,o.filter).then(function(p){return p.buffer}):a.ready.then(function(){const p=new ArrayBuffer(d*u);return a.decodeGltfBuffer(new Uint8Array(p),d,u,f,o.mode,o.filter),p})})}else return null}}class Ed{constructor(e){this.name=ne.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const n=this.parser.json,s=n.nodes[e];if(!s.extensions||!s.extensions[this.name]||s.mesh===void 0)return null;const o=n.meshes[s.mesh];for(const c of o.primitives)if(c.mode!==Ze.TRIANGLES&&c.mode!==Ze.TRIANGLE_STRIP&&c.mode!==Ze.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=s.extensions[this.name].attributes,r=[],l={};for(const c in a)r.push(this.parser.getDependency("accessor",a[c]).then(d=>(l[c]=d,l[c])));return r.length<1?null:(r.push(this.parser.createNodeMesh(e)),Promise.all(r).then(c=>{const d=c.pop(),u=d.isGroup?d.children:[d],f=c[0].count,p=[];for(const h of u){const v=new pt,y=new H,w=new Vt,M=new H(1,1,1),x=new Dn(h.geometry,h.material,f);for(let m=0;m<f;m++)l.TRANSLATION&&y.fromBufferAttribute(l.TRANSLATION,m),l.ROTATION&&w.fromBufferAttribute(l.ROTATION,m),l.SCALE&&M.fromBufferAttribute(l.SCALE,m),x.setMatrixAt(m,v.compose(y,w,M));for(const m in l)if(m==="_COLOR_0"){const S=l[m];x.instanceColor=new We(S.array,S.itemSize,S.normalized)}else m!=="TRANSLATION"&&m!=="ROTATION"&&m!=="SCALE"&&h.geometry.setAttribute(m,l[m]);jr.prototype.copy.call(x,h),this.parser.assignFinalMaterial(x),p.push(x)}return d.isGroup?(d.clear(),d.add(...p),d):p[0]}))}}const ul="glTF",So=12,Qi={JSON:1313821514,BIN:5130562};class Pd{constructor(e){this.name=ne.KHR_BINARY_GLTF,this.content=null,this.body=null;const n=new DataView(e,0,So),s=new TextDecoder;if(this.header={magic:s.decode(new Uint8Array(e.slice(0,4))),version:n.getUint32(4,!0),length:n.getUint32(8,!0)},this.header.magic!==ul)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const o=this.header.length-So,i=new DataView(e,So);let a=0;for(;a<o;){const r=i.getUint32(a,!0);a+=4;const l=i.getUint32(a,!0);if(a+=4,l===Qi.JSON){const c=new Uint8Array(e,So+a,r);this.content=s.decode(c)}else if(l===Qi.BIN){const c=So+a;this.body=e.slice(c,c+r)}a+=r}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Ld{constructor(e,n){if(!n)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ne.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=n,this.dracoLoader.preload()}decodePrimitive(e,n){const s=this.json,o=this.dracoLoader,i=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,r={},l={},c={};for(const d in a){const u=za[d]||d.toLowerCase();r[u]=a[d]}for(const d in e.attributes){const u=za[d]||d.toLowerCase();if(a[d]!==void 0){const f=s.accessors[e.attributes[d]],p=Xn[f.componentType];c[u]=p.name,l[u]=f.normalized===!0}}return n.getDependency("bufferView",i).then(function(d){return new Promise(function(u,f){o.decodeDracoFile(d,function(p){for(const h in p.attributes){const v=p.attributes[h],y=l[h];y!==void 0&&(v.normalized=y)}u(p)},r,c,Ut,f)})})}}class Od{constructor(){this.name=ne.KHR_TEXTURE_TRANSFORM}extendTexture(e,n){return(n.texCoord===void 0||n.texCoord===e.channel)&&n.offset===void 0&&n.rotation===void 0&&n.scale===void 0||(e=e.clone(),n.texCoord!==void 0&&(e.channel=n.texCoord),n.offset!==void 0&&e.offset.fromArray(n.offset),n.rotation!==void 0&&(e.rotation=n.rotation),n.scale!==void 0&&e.repeat.fromArray(n.scale),e.needsUpdate=!0),e}}class Fd{constructor(){this.name=ne.KHR_MESH_QUANTIZATION}}class dl extends Yc{constructor(e,n,s,o){super(e,n,s,o)}copySampleValue_(e){const n=this.resultBuffer,s=this.sampleValues,o=this.valueSize,i=e*o*3+o;for(let a=0;a!==o;a++)n[a]=s[i+a];return n}interpolate_(e,n,s,o){const i=this.resultBuffer,a=this.sampleValues,r=this.valueSize,l=r*2,c=r*3,d=o-n,u=(s-n)/d,f=u*u,p=f*u,h=e*c,v=h-c,y=-2*p+3*f,w=p-f,M=1-y,x=w-f+u;for(let m=0;m!==r;m++){const S=a[v+m+r],b=a[v+m+l]*d,I=a[h+m+r],A=a[h+m]*d;i[m]=M*S+x*b+y*I+w*A}return i}}const Nd=new Vt;class Hd extends dl{interpolate_(e,n,s,o){const i=super.interpolate_(e,n,s,o);return Nd.fromArray(i).normalize().toArray(i),i}}const Ze={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Xn={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},$i={9728:Kr,9729:sn,9984:Ic,9985:bc,9986:Dc,9987:ci},er={33071:Pc,33648:Ec,10497:ct},xa={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},za={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Xt={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Gd={CUBICSPLINE:void 0,LINEAR:qr,STEP:Uc},Ta={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function zd(t){return t.DefaultMaterial===void 0&&(t.DefaultMaterial=new zo({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Vc})),t.DefaultMaterial}function dn(t,e,n){for(const s in n.extensions)t[s]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[s]=n.extensions[s])}function St(t,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(t.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function kd(t,e,n){let s=!1,o=!1,i=!1;for(let c=0,d=e.length;c<d;c++){const u=e[c];if(u.POSITION!==void 0&&(s=!0),u.NORMAL!==void 0&&(o=!0),u.COLOR_0!==void 0&&(i=!0),s&&o&&i)break}if(!s&&!o&&!i)return Promise.resolve(t);const a=[],r=[],l=[];for(let c=0,d=e.length;c<d;c++){const u=e[c];if(s){const f=u.POSITION!==void 0?n.getDependency("accessor",u.POSITION):t.attributes.position;a.push(f)}if(o){const f=u.NORMAL!==void 0?n.getDependency("accessor",u.NORMAL):t.attributes.normal;r.push(f)}if(i){const f=u.COLOR_0!==void 0?n.getDependency("accessor",u.COLOR_0):t.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(r),Promise.all(l)]).then(function(c){const d=c[0],u=c[1],f=c[2];return s&&(t.morphAttributes.position=d),o&&(t.morphAttributes.normal=u),i&&(t.morphAttributes.color=f),t.morphTargetsRelative=!0,t})}function Wd(t,e){if(t.updateMorphTargets(),e.weights!==void 0)for(let n=0,s=e.weights.length;n<s;n++)t.morphTargetInfluences[n]=e.weights[n];if(e.extras&&Array.isArray(e.extras.targetNames)){const n=e.extras.targetNames;if(t.morphTargetInfluences.length===n.length){t.morphTargetDictionary={};for(let s=0,o=n.length;s<o;s++)t.morphTargetDictionary[n[s]]=s}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Ud(t){let e;const n=t.extensions&&t.extensions[ne.KHR_DRACO_MESH_COMPRESSION];if(n?e="draco:"+n.bufferView+":"+n.indices+":"+Sa(n.attributes):e=t.indices+":"+Sa(t.attributes)+":"+t.mode,t.targets!==void 0)for(let s=0,o=t.targets.length;s<o;s++)e+=":"+Sa(t.targets[s]);return e}function Sa(t){let e="";const n=Object.keys(t).sort();for(let s=0,o=n.length;s<o;s++)e+=n[s]+":"+t[n[s]]+";";return e}function ka(t){switch(t){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Bd(t){return t.search(/\.jpe?g($|\?)/i)>0||t.search(/^data\:image\/jpeg/)===0?"image/jpeg":t.search(/\.webp($|\?)/i)>0||t.search(/^data\:image\/webp/)===0?"image/webp":t.search(/\.ktx2($|\?)/i)>0||t.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Vd=new pt;class Yd{constructor(e={},n={}){this.json=e,this.extensions={},this.plugins={},this.options=n,this.cache=new hd,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let s=!1,o=-1,i=!1,a=-1;if(typeof navigator<"u"){const r=navigator.userAgent;s=/^((?!chrome|android).)*safari/i.test(r)===!0;const l=r.match(/Version\/(\d+)/);o=s&&l?parseInt(l[1],10):-1,i=r.indexOf("Firefox")>-1,a=i?r.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||s&&o<17||i&&a<98?this.textureLoader=new kr(this.options.manager):this.textureLoader=new Rc(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Yr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,n){const s=this,o=this.json,i=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([s.getDependencies("scene"),s.getDependencies("animation"),s.getDependencies("camera")])}).then(function(a){const r={scene:a[0][o.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:o.asset,parser:s,userData:{}};return dn(i,r,o),St(r,o),Promise.all(s._invokeAll(function(l){return l.afterRoot&&l.afterRoot(r)})).then(function(){for(const l of r.scenes)l.updateMatrixWorld();e(r)})}).catch(n)}_markDefs(){const e=this.json.nodes||[],n=this.json.skins||[],s=this.json.meshes||[];for(let o=0,i=n.length;o<i;o++){const a=n[o].joints;for(let r=0,l=a.length;r<l;r++)e[a[r]].isBone=!0}for(let o=0,i=e.length;o<i;o++){const a=e[o];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(s[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,n){n!==void 0&&(e.refs[n]===void 0&&(e.refs[n]=e.uses[n]=0),e.refs[n]++)}_getNodeRef(e,n,s){if(e.refs[n]<=1)return s;const o=s.clone(),i=(a,r)=>{const l=this.associations.get(a);l!=null&&this.associations.set(r,l);for(const[c,d]of a.children.entries())i(d,r.children[c])};return i(s,o),o.name+="_instance_"+e.uses[n]++,o}_invokeOne(e){const n=Object.values(this.plugins);n.push(this);for(let s=0;s<n.length;s++){const o=e(n[s]);if(o)return o}return null}_invokeAll(e){const n=Object.values(this.plugins);n.unshift(this);const s=[];for(let o=0;o<n.length;o++){const i=e(n[o]);i&&s.push(i)}return s}getDependency(e,n){const s=e+":"+n;let o=this.cache.get(s);if(!o){switch(e){case"scene":o=this.loadScene(n);break;case"node":o=this._invokeOne(function(i){return i.loadNode&&i.loadNode(n)});break;case"mesh":o=this._invokeOne(function(i){return i.loadMesh&&i.loadMesh(n)});break;case"accessor":o=this.loadAccessor(n);break;case"bufferView":o=this._invokeOne(function(i){return i.loadBufferView&&i.loadBufferView(n)});break;case"buffer":o=this.loadBuffer(n);break;case"material":o=this._invokeOne(function(i){return i.loadMaterial&&i.loadMaterial(n)});break;case"texture":o=this._invokeOne(function(i){return i.loadTexture&&i.loadTexture(n)});break;case"skin":o=this.loadSkin(n);break;case"animation":o=this._invokeOne(function(i){return i.loadAnimation&&i.loadAnimation(n)});break;case"camera":o=this.loadCamera(n);break;default:if(o=this._invokeOne(function(i){return i!=this&&i.getDependency&&i.getDependency(e,n)}),!o)throw new Error("Unknown type: "+e);break}this.cache.add(s,o)}return o}getDependencies(e){let n=this.cache.get(e);if(!n){const s=this,o=this.json[e+(e==="mesh"?"es":"s")]||[];n=Promise.all(o.map(function(i,a){return s.getDependency(e,a)})),this.cache.add(e,n)}return n}loadBuffer(e){const n=this.json.buffers[e],s=this.fileLoader;if(n.type&&n.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+n.type+" buffer type is not supported.");if(n.uri===void 0&&e===0)return Promise.resolve(this.extensions[ne.KHR_BINARY_GLTF].body);const o=this.options;return new Promise(function(i,a){s.load(Do.resolveURL(n.uri,o.path),i,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+n.uri+'".'))})})}loadBufferView(e){const n=this.json.bufferViews[e];return this.getDependency("buffer",n.buffer).then(function(s){const o=n.byteLength||0,i=n.byteOffset||0;return s.slice(i,i+o)})}loadAccessor(e){const n=this,s=this.json,o=this.json.accessors[e];if(o.bufferView===void 0&&o.sparse===void 0){const a=xa[o.type],r=Xn[o.componentType],l=o.normalized===!0,c=new r(o.count*a);return Promise.resolve(new Le(c,a,l))}const i=[];return o.bufferView!==void 0?i.push(this.getDependency("bufferView",o.bufferView)):i.push(null),o.sparse!==void 0&&(i.push(this.getDependency("bufferView",o.sparse.indices.bufferView)),i.push(this.getDependency("bufferView",o.sparse.values.bufferView))),Promise.all(i).then(function(a){const r=a[0],l=xa[o.type],c=Xn[o.componentType],d=c.BYTES_PER_ELEMENT,u=d*l,f=o.byteOffset||0,p=o.bufferView!==void 0?s.bufferViews[o.bufferView].byteStride:void 0,h=o.normalized===!0;let v,y;if(p&&p!==u){const w=Math.floor(f/p),M="InterleavedBuffer:"+o.bufferView+":"+o.componentType+":"+w+":"+o.count;let x=n.cache.get(M);x||(v=new c(r,w*p,o.count*p/d),x=new Ac(v,p/d),n.cache.add(M,x)),y=new Bc(x,l,f%p/d,h)}else r===null?v=new c(o.count*l):v=new c(r,f,o.count*l),y=new Le(v,l,h);if(o.sparse!==void 0){const w=xa.SCALAR,M=Xn[o.sparse.indices.componentType],x=o.sparse.indices.byteOffset||0,m=o.sparse.values.byteOffset||0,S=new M(a[1],x,o.sparse.count*w),b=new c(a[2],m,o.sparse.count*l);r!==null&&(y=new Le(y.array.slice(),y.itemSize,y.normalized)),y.normalized=!1;for(let I=0,A=S.length;I<A;I++){const T=S[I];if(y.setX(T,b[I*l]),l>=2&&y.setY(T,b[I*l+1]),l>=3&&y.setZ(T,b[I*l+2]),l>=4&&y.setW(T,b[I*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}y.normalized=h}return y})}loadTexture(e){const n=this.json,s=this.options,i=n.textures[e].source,a=n.images[i];let r=this.textureLoader;if(a.uri){const l=s.manager.getHandler(a.uri);l!==null&&(r=l)}return this.loadTextureImage(e,i,r)}loadTextureImage(e,n,s){const o=this,i=this.json,a=i.textures[e],r=i.images[n],l=(r.uri||r.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(n,s).then(function(d){d.flipY=!1,d.name=a.name||r.name||"",d.name===""&&typeof r.uri=="string"&&r.uri.startsWith("data:image/")===!1&&(d.name=r.uri);const f=(i.samplers||{})[a.sampler]||{};return d.magFilter=$i[f.magFilter]||sn,d.minFilter=$i[f.minFilter]||ci,d.wrapS=er[f.wrapS]||ct,d.wrapT=er[f.wrapT]||ct,d.generateMipmaps=!d.isCompressedTexture&&d.minFilter!==Kr&&d.minFilter!==sn,o.associations.set(d,{textures:e}),d}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,n){const s=this,o=this.json,i=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=o.images[e],r=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=s.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const f=new Blob([u],{type:a.mimeType});return l=r.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const d=Promise.resolve(l).then(function(u){return new Promise(function(f,p){let h=f;n.isImageBitmapLoader===!0&&(h=function(v){const y=new ki(v);y.needsUpdate=!0,f(y)}),n.load(Do.resolveURL(u,i.path),h,void 0,p)})}).then(function(u){return c===!0&&r.revokeObjectURL(l),St(u,a),u.userData.mimeType=a.mimeType||Bd(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=d,d}assignTexture(e,n,s,o){const i=this;return this.getDependency("texture",s.index).then(function(a){if(!a)return null;if(s.texCoord!==void 0&&s.texCoord>0&&(a=a.clone(),a.channel=s.texCoord),i.extensions[ne.KHR_TEXTURE_TRANSFORM]){const r=s.extensions!==void 0?s.extensions[ne.KHR_TEXTURE_TRANSFORM]:void 0;if(r){const l=i.associations.get(a);a=i.extensions[ne.KHR_TEXTURE_TRANSFORM].extendTexture(a,r),i.associations.set(a,l)}}return o!==void 0&&(a.colorSpace=o),e[n]=a,a})}assignFinalMaterial(e){const n=e.geometry;let s=e.material;const o=n.attributes.tangent===void 0,i=n.attributes.color!==void 0,a=n.attributes.normal===void 0;if(e.isPoints){const r="PointsMaterial:"+s.uuid;let l=this.cache.get(r);l||(l=new ui,da.prototype.copy.call(l,s),l.color.copy(s.color),l.map=s.map,l.sizeAttenuation=!1,this.cache.add(r,l)),s=l}else if(e.isLine){const r="LineBasicMaterial:"+s.uuid;let l=this.cache.get(r);l||(l=new Xr,da.prototype.copy.call(l,s),l.color.copy(s.color),l.map=s.map,this.cache.add(r,l)),s=l}if(o||i||a){let r="ClonedMaterial:"+s.uuid+":";o&&(r+="derivative-tangents:"),i&&(r+="vertex-colors:"),a&&(r+="flat-shading:");let l=this.cache.get(r);l||(l=s.clone(),i&&(l.vertexColors=!0),a&&(l.flatShading=!0),o&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(r,l),this.associations.set(l,this.associations.get(s))),s=l}e.material=s}getMaterialType(){return zo}loadMaterial(e){const n=this,s=this.json,o=this.extensions,i=s.materials[e];let a;const r={},l=i.extensions||{},c=[];if(l[ne.KHR_MATERIALS_UNLIT]){const u=o[ne.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(r,i,n))}else{const u=i.pbrMetallicRoughness||{};if(r.color=new Q(1,1,1),r.opacity=1,Array.isArray(u.baseColorFactor)){const f=u.baseColorFactor;r.color.setRGB(f[0],f[1],f[2],Ut),r.opacity=f[3]}u.baseColorTexture!==void 0&&c.push(n.assignTexture(r,"map",u.baseColorTexture,no)),r.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,r.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(n.assignTexture(r,"metalnessMap",u.metallicRoughnessTexture)),c.push(n.assignTexture(r,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,r)})))}i.doubleSided===!0&&(r.side=ze);const d=i.alphaMode||Ta.OPAQUE;if(d===Ta.BLEND?(r.transparent=!0,r.depthWrite=!1):(r.transparent=!1,d===Ta.MASK&&(r.alphaTest=i.alphaCutoff!==void 0?i.alphaCutoff:.5)),i.normalTexture!==void 0&&a!==dt&&(c.push(n.assignTexture(r,"normalMap",i.normalTexture)),r.normalScale=new ue(1,1),i.normalTexture.scale!==void 0)){const u=i.normalTexture.scale;r.normalScale.set(u,u)}if(i.occlusionTexture!==void 0&&a!==dt&&(c.push(n.assignTexture(r,"aoMap",i.occlusionTexture)),i.occlusionTexture.strength!==void 0&&(r.aoMapIntensity=i.occlusionTexture.strength)),i.emissiveFactor!==void 0&&a!==dt){const u=i.emissiveFactor;r.emissive=new Q().setRGB(u[0],u[1],u[2],Ut)}return i.emissiveTexture!==void 0&&a!==dt&&c.push(n.assignTexture(r,"emissiveMap",i.emissiveTexture,no)),Promise.all(c).then(function(){const u=new a(r);return i.name&&(u.name=i.name),St(u,i),n.associations.set(u,{materials:e}),i.extensions&&dn(o,u,i),u})}createUniqueName(e){const n=Lc.sanitizeNodeName(e||"");return n in this.nodeNamesUsed?n+"_"+ ++this.nodeNamesUsed[n]:(this.nodeNamesUsed[n]=0,n)}loadGeometries(e){const n=this,s=this.extensions,o=this.primitiveCache;function i(r){return s[ne.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(r,n).then(function(l){return tr(l,r,n)})}const a=[];for(let r=0,l=e.length;r<l;r++){const c=e[r],d=Ud(c),u=o[d];if(u)a.push(u.promise);else{let f;c.extensions&&c.extensions[ne.KHR_DRACO_MESH_COMPRESSION]?f=i(c):f=tr(new ho,c,n),o[d]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const n=this,s=this.json,o=this.extensions,i=s.meshes[e],a=i.primitives,r=[];for(let l=0,c=a.length;l<c;l++){const d=a[l].material===void 0?zd(this.cache):this.getDependency("material",a[l].material);r.push(d)}return r.push(n.loadGeometries(a)),Promise.all(r).then(function(l){const c=l.slice(0,l.length-1),d=l[l.length-1],u=[];for(let p=0,h=d.length;p<h;p++){const v=d[p],y=a[p];let w;const M=c[p];if(y.mode===Ze.TRIANGLES||y.mode===Ze.TRIANGLE_STRIP||y.mode===Ze.TRIANGLE_FAN||y.mode===void 0)w=i.isSkinnedMesh===!0?new Oc(v,M):new Ce(v,M),w.isSkinnedMesh===!0&&w.normalizeSkinWeights(),y.mode===Ze.TRIANGLE_STRIP?w.geometry=Ji(w.geometry,Vr):y.mode===Ze.TRIANGLE_FAN&&(w.geometry=Ji(w.geometry,Fa));else if(y.mode===Ze.LINES)w=new Fc(v,M);else if(y.mode===Ze.LINE_STRIP)w=new Nc(v,M);else if(y.mode===Ze.LINE_LOOP)w=new Hc(v,M);else if(y.mode===Ze.POINTS)w=new Xs(v,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+y.mode);Object.keys(w.geometry.morphAttributes).length>0&&Wd(w,i),w.name=n.createUniqueName(i.name||"mesh_"+e),St(w,i),y.extensions&&dn(o,w,y),n.assignFinalMaterial(w),u.push(w)}for(let p=0,h=u.length;p<h;p++)n.associations.set(u[p],{meshes:e,primitives:p});if(u.length===1)return i.extensions&&dn(o,u[0],i),u[0];const f=new yn;i.extensions&&dn(o,f,i),n.associations.set(f,{meshes:e});for(let p=0,h=u.length;p<h;p++)f.add(u[p]);return f})}loadCamera(e){let n;const s=this.json.cameras[e],o=s[s.type];if(!o){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return s.type==="perspective"?n=new Gc(Zt.radToDeg(o.yfov),o.aspectRatio||1,o.znear||1,o.zfar||2e6):s.type==="orthographic"&&(n=new Oa(-o.xmag,o.xmag,o.ymag,-o.ymag,o.znear,o.zfar)),s.name&&(n.name=this.createUniqueName(s.name)),St(n,s),Promise.resolve(n)}loadSkin(e){const n=this.json.skins[e],s=[];for(let o=0,i=n.joints.length;o<i;o++)s.push(this._loadNodeShallow(n.joints[o]));return n.inverseBindMatrices!==void 0?s.push(this.getDependency("accessor",n.inverseBindMatrices)):s.push(null),Promise.all(s).then(function(o){const i=o.pop(),a=o,r=[],l=[];for(let c=0,d=a.length;c<d;c++){const u=a[c];if(u){r.push(u);const f=new pt;i!==null&&f.fromArray(i.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',n.joints[c])}return new zc(r,l)})}loadAnimation(e){const n=this.json,s=this,o=n.animations[e],i=o.name?o.name:"animation_"+e,a=[],r=[],l=[],c=[],d=[];for(let u=0,f=o.channels.length;u<f;u++){const p=o.channels[u],h=o.samplers[p.sampler],v=p.target,y=v.node,w=o.parameters!==void 0?o.parameters[h.input]:h.input,M=o.parameters!==void 0?o.parameters[h.output]:h.output;v.node!==void 0&&(a.push(this.getDependency("node",y)),r.push(this.getDependency("accessor",w)),l.push(this.getDependency("accessor",M)),c.push(h),d.push(v))}return Promise.all([Promise.all(a),Promise.all(r),Promise.all(l),Promise.all(c),Promise.all(d)]).then(function(u){const f=u[0],p=u[1],h=u[2],v=u[3],y=u[4],w=[];for(let x=0,m=f.length;x<m;x++){const S=f[x],b=p[x],I=h[x],A=v[x],T=y[x];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();const C=s._createAnimationTracks(S,b,I,A,T);if(C)for(let D=0;D<C.length;D++)w.push(C[D])}const M=new kc(i,void 0,w);return St(M,o),M})}createNodeMesh(e){const n=this.json,s=this,o=n.nodes[e];return o.mesh===void 0?null:s.getDependency("mesh",o.mesh).then(function(i){const a=s._getNodeRef(s.meshCache,o.mesh,i);return o.weights!==void 0&&a.traverse(function(r){if(r.isMesh)for(let l=0,c=o.weights.length;l<c;l++)r.morphTargetInfluences[l]=o.weights[l]}),a})}loadNode(e){const n=this.json,s=this,o=n.nodes[e],i=s._loadNodeShallow(e),a=[],r=o.children||[];for(let c=0,d=r.length;c<d;c++)a.push(s.getDependency("node",r[c]));const l=o.skin===void 0?Promise.resolve(null):s.getDependency("skin",o.skin);return Promise.all([i,Promise.all(a),l]).then(function(c){const d=c[0],u=c[1],f=c[2];f!==null&&d.traverse(function(p){p.isSkinnedMesh&&p.bind(f,Vd)});for(let p=0,h=u.length;p<h;p++)d.add(u[p]);return d})}_loadNodeShallow(e){const n=this.json,s=this.extensions,o=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const i=n.nodes[e],a=i.name?o.createUniqueName(i.name):"",r=[],l=o._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&r.push(l),i.camera!==void 0&&r.push(o.getDependency("camera",i.camera).then(function(c){return o._getNodeRef(o.cameraCache,i.camera,c)})),o._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){r.push(c)}),this.nodeCache[e]=Promise.all(r).then(function(c){let d;if(i.isBone===!0?d=new Wc:c.length>1?d=new yn:c.length===1?d=c[0]:d=new jr,d!==c[0])for(let u=0,f=c.length;u<f;u++)d.add(c[u]);if(i.name&&(d.userData.name=i.name,d.name=a),St(d,i),i.extensions&&dn(s,d,i),i.matrix!==void 0){const u=new pt;u.fromArray(i.matrix),d.applyMatrix4(u)}else i.translation!==void 0&&d.position.fromArray(i.translation),i.rotation!==void 0&&d.quaternion.fromArray(i.rotation),i.scale!==void 0&&d.scale.fromArray(i.scale);if(!o.associations.has(d))o.associations.set(d,{});else if(i.mesh!==void 0&&o.meshCache.refs[i.mesh]>1){const u=o.associations.get(d);o.associations.set(d,{...u})}return o.associations.get(d).nodes=e,d}),this.nodeCache[e]}loadScene(e){const n=this.extensions,s=this.json.scenes[e],o=this,i=new yn;s.name&&(i.name=o.createUniqueName(s.name)),St(i,s),s.extensions&&dn(n,i,s);const a=s.nodes||[],r=[];for(let l=0,c=a.length;l<c;l++)r.push(o.getDependency("node",a[l]));return Promise.all(r).then(function(l){for(let d=0,u=l.length;d<u;d++)i.add(l[d]);const c=d=>{const u=new Map;for(const[f,p]of o.associations)(f instanceof da||f instanceof ki)&&u.set(f,p);return d.traverse(f=>{const p=o.associations.get(f);p!=null&&u.set(f,p)}),u};return o.associations=c(i),i})}_createAnimationTracks(e,n,s,o,i){const a=[],r=e.name?e.name:e.uuid,l=[];Xt[i.path]===Xt.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(r);let c;switch(Xt[i.path]){case Xt.weights:c=Ui;break;case Xt.rotation:c=Bi;break;case Xt.translation:case Xt.scale:c=Wi;break;default:s.itemSize===1?c=Ui:c=Wi;break}const d=o.interpolation!==void 0?Gd[o.interpolation]:qr,u=this._getArrayFromAccessor(s);for(let f=0,p=l.length;f<p;f++){const h=new c(l[f]+"."+Xt[i.path],n.array,u,d);o.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(h),a.push(h)}return a}_getArrayFromAccessor(e){let n=e.array;if(e.normalized){const s=ka(n.constructor),o=new Float32Array(n.length);for(let i=0,a=n.length;i<a;i++)o[i]=n[i]*s;n=o}return n}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(s){const o=this instanceof Bi?Hd:dl;return new o(this.times,this.values,this.getValueSize()/3,s)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function jd(t,e,n){const s=e.attributes,o=new jc;if(s.POSITION!==void 0){const r=n.json.accessors[s.POSITION],l=r.min,c=r.max;if(l!==void 0&&c!==void 0){if(o.set(new H(l[0],l[1],l[2]),new H(c[0],c[1],c[2])),r.normalized){const d=ka(Xn[r.componentType]);o.min.multiplyScalar(d),o.max.multiplyScalar(d)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const i=e.targets;if(i!==void 0){const r=new H,l=new H;for(let c=0,d=i.length;c<d;c++){const u=i[c];if(u.POSITION!==void 0){const f=n.json.accessors[u.POSITION],p=f.min,h=f.max;if(p!==void 0&&h!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(h[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(h[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(h[2]))),f.normalized){const v=ka(Xn[f.componentType]);l.multiplyScalar(v)}r.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}o.expandByVector(r)}t.boundingBox=o;const a=new Ur;o.getCenter(a.center),a.radius=o.min.distanceTo(o.max)/2,t.boundingSphere=a}function tr(t,e,n){const s=e.attributes,o=[];function i(a,r){return n.getDependency("accessor",a).then(function(l){t.setAttribute(r,l)})}for(const a in s){const r=za[a]||a.toLowerCase();r in t.attributes||o.push(i(s[a],r))}if(e.indices!==void 0&&!t.index){const a=n.getDependency("accessor",e.indices).then(function(r){t.setIndex(r)});o.push(a)}return Vi.workingColorSpace!==Ut&&"COLOR_0"in s&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Vi.workingColorSpace}" not supported.`),St(t,e),jd(t,e,n),Promise.all(o).then(function(){return e.targets!==void 0?kd(t,e.targets,n):t})}const fl=new cl,Ss={},Wo={};function Tt(t,e={}){return Ss[t]?Promise.resolve(Ss[t]):(Nn[t]||(Nn[t]=new Promise((n,s)=>{fl.load(t,o=>{const i=[];o.scene.traverse(a=>{if(a.isMesh){const r=a.rotation.clone();if(e.rotationCorrection){const{x:l=0,y:c=0,z:d=0}=e.rotationCorrection;r.x+=l,r.y+=c,r.z+=d}i.push({geometry:a.geometry,material:a.material,position:a.position.clone(),rotation:r,scale:a.scale.clone(),castShadow:!0,receiveShadow:!0})}}),Ss[t]=i,delete Nn[t],n(i)},void 0,o=>{console.error(`Failed to preload model ${t}:`,o),delete Nn[t],s(o)})})),Nn[t])}function Cs(t){return new Promise((e,n)=>{fl.load(t,s=>{s.scene.traverse(o=>{o.userData={}}),Wo[t]={scene:s.scene,animations:s.animations},e(Wo[t])},void 0,s=>{console.error(`Failed to preload GLTF ${t}:`,s),n(s)})})}const Nn={};let ps=!1,nr=!1;function e0(){return Tt("./models/win-state/palm_tree.glb",{rotationCorrection:{x:-Math.PI/2,y:0,z:0}})}function t0(){return ps||nr?Promise.resolve():(ps=!0,Promise.all([Tt("./models/win-state/palm_tree.glb",{rotationCorrection:{x:-Math.PI/2,y:0,z:0}}),Tt("./models/win-state/ivory-cane-palm.glb"),Tt("./models/win-state/olive-palm.glb"),Tt("./models/win-state/tall-grass.glb"),Tt("./models/win-state/grass.glb"),Tt("./models/win-state/fern.glb"),Tt("./models/win-state/lady-palm.glb"),Tt("./models/win-state/bismarck-palm.glb"),Tt("./models/win-state/banana-tree.glb"),Cs("./models/creatures/seagulls-flock.glb"),Cs("./models/creatures/seagulls-spiral.glb"),Cs("./models/creatures/seagull-1.glb")]).then(()=>{nr=!0,ps=!1}).catch(t=>{ps=!1,console.error("Error preloading models:",t)}))}function n0(){return Ss}function Kd(){return Wo}function st(t){return Wo[t]?Promise.resolve(Wo[t]):Cs(t)}function o0(){return Promise.all([st("./models/creatures/shark.glb"),st("./models/creatures/manta-ray.glb"),st("./models/creatures/whale.glb"),st("./models/creatures/dolphin.glb"),st("./models/creatures/container-ship.glb"),st("./models/creatures/sailboat.glb"),st("./models/creatures/mayan-temple.glb"),st("./models/creatures/whale_shark.glb"),st("./models/creatures/sail-fish.glb"),st("./models/creatures/firefly_squid.glb"),st("./models/creatures/green_turtle.glb")]).then(()=>{})}function Xd(){const t=document.createElement("canvas");t.width=64,t.height=64;const e=t.getContext("2d"),n=e.createRadialGradient(32,32,0,32,32,32);n.addColorStop(0,"rgba(255, 255, 255, 1.0)"),n.addColorStop(.5,"rgba(255, 255, 255, 0.5)"),n.addColorStop(1,"rgba(255, 255, 255, 0.0)"),e.fillStyle=n,e.fillRect(0,0,64,64);const s=new Qo(t);return s.needsUpdate=!0,s}const qd=Xd(),Uo=8,Zd=4.3,Wa=90,Ua=500,Ba=200,Jd=18;let bn=[],Be=[],$t=[],Ve=[],$o=[],xn=[],Je=[],po=[],vn=null,ye=null,qn=null,He=[],me=null,Zn=null,Ge=[];const Qe=new pt,Js=new Vt,an=new H;let or=0,sr=1,ar=1;function s0(){const t=new Ps(.05,8,8),e=new je({transparent:!0,depthWrite:!1,uniforms:{color:{value:new Q(8965375)}},vertexShader:`
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
    `});ye=new Dn(t,e,Ua),ye.renderOrder=2,ye.isPersistent=!0,qn=new Float32Array(Ua),ye.geometry.setAttribute("instanceOpacity",new We(qn,1)),ye.count=0;const n=new Ps(.06,8,8),s=new je({transparent:!0,depthWrite:!1,uniforms:{color:{value:new Q(6737151)}},vertexShader:`
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
    `});me=new Dn(n,s,Ba),me.renderOrder=4,me.isPersistent=!0,Zn=new Float32Array(Ba),me.geometry.setAttribute("instanceOpacity",new We(Zn,1)),me.count=0,bn=[],Be=[],$t=[],Ve=[],$o=[],xn=[],He=[],Ge=[],Je=[],po=[],vn=null}function a0(t,e,n,s="day"){const o=e.length;Je=new Array(o).fill(0),po=new Array(o).fill(0);for(let i=0;i<o;i++){const a=e[i],{beamMesh:r,beamMaterial:l}=Qd(a);t.add(r),bn.push(r),Be.push(l);const c=$d(a,n,s);t.add(c),$t.push(c);const{particles:d,particleVelocities:u}=ef(a);t.add(d),Ve.push(d),$o.push(u)}ye&&!ye.parent&&t.add(ye),me&&!me.parent&&t.add(me)}function Qd(t){const e=new Kc(1.5,1.5,Uo,32,1,!0),n=new je({transparent:!0,side:ze,depthWrite:!1,depthTest:!0,vertexShader:`
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
    `,uniforms:{uTime:{value:0},uColor:{value:new H(1,1,0)},uPulseIntensity:{value:0},uFillProgress:{value:0},uFillColor:{value:new H(0,.33,.85)}}}),s=new Ce(e,n);return s.position.set(t.x,Uo/2,t.z),s.renderOrder=5,{beamMesh:s,beamMaterial:n}}function $d(t,e,n="day"){const o=Qu({startX:t.x,startZ:t.z,endX:t.x,endZ:t.z,cloudTexture:e,rainCount:200,cloudHeight:16,timeOfDay:n}),i=o.userData.cloud,a=o.userData.cloudMaterial;return i.scale.set(1.26,.42,1.6),n!=="night"&&a.uniforms.base.value.setRGB(.8,.9,1),a.uniforms.threshold.value=.25,a.uniforms.opacity.value=0,i.visible=!1,i.renderOrder=10,a.depthTest=!1,o}function ef(t){const e=new ho,n=new Float32Array(Wa*3),s=[];for(let a=0;a<Wa;a++){const r=Math.random()*Math.PI*2,l=Math.random()*1.3;n[a*3]=Math.cos(r)*l,n[a*3+1]=Math.random()*Uo,n[a*3+2]=Math.sin(r)*l,s.push({y:.5+Math.random()*1,angle:r,radius:l,angleSpeed:(Math.random()-.5)*.5})}e.setAttribute("position",new Le(n,3));const o=new ui({color:16776960,size:.18,transparent:!0,opacity:.6,blending:wn,depthWrite:!1,map:qd}),i=new Xs(e,o);return i.position.set(t.x,0,t.z),{particles:i,particleVelocities:s}}function i0(t,e,n,s){if(or^=1,or===1)return;const o=t*2,i=Math.sin(Date.now()*.003)*.1+.9,a=bn.length,r=a>0&&n>0?n*s/a:1;for(let l=0;l<a;l++){const c=Math.min((po[l]||0)/r,1);e&&e[l]&&(e[l].emissiveIntensity=i*.5+c*.3+(Je[l]||0)),Be[l].uniforms.uTime.value+=o,Be[l].uniforms.uFillProgress.value=c,Je[l]>0&&(Je[l]-=o*Zd,Je[l]=Math.max(0,Je[l])),Be[l].uniforms.uPulseIntensity.value=Je[l];const d=1+Je[l]*.04;bn[l].scale.set(d,1,d),Ve[l]&&Ve[l].material&&(Ve[l].material.opacity=.6+c*.2,Ve[l].material.size=.18+c*.08)}}function r0(t){if(sr^=1,sr===1)return;const e=t*2,n=Ve.length;for(let s=0;s<n;s++){if(!Ve[s].visible)continue;const o=Ve[s].geometry,i=$o[s],a=o.attributes.position.array,r=Be[s]?Be[s].uniforms.uFillProgress.value:0,l=.5+r*1;for(let c=0;c<Wa;c++){const d=i[c];a[c*3+1]+=d.y*e*l,d.angle+=d.angleSpeed*e*(.7+r*.6),a[c*3]=Math.cos(d.angle)*d.radius,a[c*3+2]=Math.sin(d.angle)*d.radius,a[c*3+1]>Uo&&(a[c*3+1]=0)}o.attributes.position.needsUpdate=!0}}function l0(t,e,n,s,o,i){const a=e.length;t.forEach(r=>{if(!r.active||r.isEvaporating)return;const l=r.body.translation();let c=1/0,d=-1;for(let u=0;u<a;u++){const f=l.x-e[u].x,p=l.z-e[u].z,h=f*f+p*p;h<c&&(c=h,d=u)}if(c<1.5*1.5&&!s.has(r)){s.add(r),o(),Je[d]=1,po[d]+=r.originalMass||1,i();const f=r.body.translation().y;if(r.body){try{n.removeRigidBody(r.body)}catch{}r.body=null,r.collider=null}r.isEvaporating=!0,r.isOnGround=!1,Ga(r.instanceIndex,"aVelocity",0,0,0),xn.push({ball:r,targetIndex:d,startY:f,targetY:Uo,progress:0,originalScale:1,particleEmitter:{particles:[],lastEmitTime:0}})}})}function c0(t,e,n){for(let s=xn.length-1;s>=0;s--){const o=xn[s],i=o.ball,a=n[o.targetIndex];o.progress+=e*.3;const r=Math.min(o.progress,1),l=r*r*(3-2*r);i.position.y=o.startY+(o.targetY-o.startY)*l,i.position.x+=(a.x-i.position.x)*e*2,i.position.z+=(a.z-i.position.z)*e*2,qs(i.instanceIndex,i.position.x,i.position.y,i.position.z);const c=.6;if(r>c){const f=1-(r-c)/(1-c);i.visualScale=f,lt(i.instanceIndex,"aVisualScale",f)}const d=Date.now();if(d-o.particleEmitter.lastEmitTime>30&&ye&&He.length<Ua){const u=Math.random()*Math.PI*2,f=Math.random()*i.radius*.8,p={x:i.position.x+Math.cos(u)*f,y:i.position.y+(Math.random()-.5)*i.radius,z:i.position.z+Math.sin(u)*f},h=He.length,v={instanceIndex:h,position:p,velocity:{x:(Math.random()-.5)*.5,y:1+Math.random()*.5,z:(Math.random()-.5)*.5},life:0,maxLife:.8,initialScale:1};He.push(v),o.particleEmitter.particles.push(v),an.set(1,1,1),Qe.compose(p,Js,an),ye.setMatrixAt(h,Qe),qn[h]=.6,ye.count=He.length,o.particleEmitter.lastEmitTime=d}r>=1&&(el(i.instanceIndex),i.active=!1,o.particleEmitter.particles=[],xn.splice(s,1))}tf(e)}function tf(t){if(!ye||He.length===0||(ar^=1,ar===1))return;const e=t*2;let n=!1,s=!1,o=0;for(;o<He.length;){const i=He[o];if(i.life+=e,i.life>=i.maxLife){const c=He.length-1;if(o!==c){const d=He[c];He[o]=d,d.instanceIndex=o,ye.getMatrixAt(c,Qe),ye.setMatrixAt(o,Qe),qn[o]=qn[c],n=!0,s=!0}He.pop(),ye.count=He.length;continue}i.position.x+=i.velocity.x*e,i.position.y+=i.velocity.y*e,i.position.z+=i.velocity.z*e;const a=i.life/i.maxLife,r=.6*(1-a),l=i.initialScale*(1-a*.5);an.set(l,l,l),Qe.compose(i.position,Js,an),ye.setMatrixAt(i.instanceIndex,Qe),n=!0,qn[i.instanceIndex]=r,s=!0,o++}n&&(ye.instanceMatrix.needsUpdate=!0),s&&(ye.geometry.attributes.instanceOpacity.needsUpdate=!0)}function hl(t,e=.3,n=null){if(!me)return;const o=Math.max(4,Math.round((n??Jd)*Math.min(1,e/.3)));for(let i=0;i<o&&!(Ge.length>=Ba);i++){const a=Math.random()*Math.PI*2,r=Math.random()*Math.PI*.6+Math.PI*.2,l=Math.sin(r)*Math.cos(a),c=Math.cos(r)*.5+.3,d=Math.sin(r)*Math.sin(a),u=e*.3,f={x:t.x+l*u,y:t.y+c*u,z:t.z+d*u},p=2.5+Math.random()*2,h={x:l*p,y:c*p+1,z:d*p},v=Ge.length,y={instanceIndex:v,position:f,velocity:h,life:0,maxLife:.4+Math.random()*.3,initialScale:.8+Math.random()*.4,gravity:-8};Ge.push(y);const w=y.initialScale;an.set(w,w,w),Qe.compose(f,Js,an),me.setMatrixAt(v,Qe),Zn[v]=.8}me.count=Ge.length,me.instanceMatrix.needsUpdate=!0,me.geometry.attributes.instanceOpacity.needsUpdate=!0}function u0(t){if(!me||Ge.length===0)return;let e=!1,n=!1,s=0;for(;s<Ge.length;){const o=Ge[s];if(o.life+=t,o.life>=o.maxLife){const l=Ge.length-1;if(s!==l){const c=Ge[l];Ge[s]=c,c.instanceIndex=s,me.getMatrixAt(l,Qe),me.setMatrixAt(s,Qe),Zn[s]=Zn[l],e=!0,n=!0}Ge.pop(),me.count=Ge.length;continue}o.velocity.y+=o.gravity*t,o.position.x+=o.velocity.x*t,o.position.y+=o.velocity.y*t,o.position.z+=o.velocity.z*t;const i=o.life/o.maxLife,a=.8*(1-i),r=o.initialScale*(1-i*.3);an.set(r,r,r),Qe.compose(o.position,Js,an),me.setMatrixAt(o.instanceIndex,Qe),e=!0,Zn[o.instanceIndex]=a,n=!0,s++}e&&(me.instanceMatrix.needsUpdate=!0),n&&(me.geometry.attributes.instanceOpacity.needsUpdate=!0)}function d0(t,e,n,s,o){const i=$t.length,a=1600,r=n?Date.now()-s:0;if(n&&r>=a)for(let u=0;u<i;u++){const f=$t[u],p=f.userData.cloud,h=f.userData.cloudMaterial;p.visible=!0,$u(f,t,e),h.uniforms.steps.value=Math.min(h.uniforms.steps.value,15),p.rotation.y+=e*.1;const v=p.scale.x,y=v+(8-v)*e*1.5;p.scale.set(y,y*.6,y);const w=h.uniforms.opacity.value,M=isNaN(w)?.046:w+(.046-w)*e*1.15;h.uniforms.opacity.value=M,ed(f,e),td(f,.6)}else for(let l=0;l<i;l++){const c=$t[l];c.userData.cloud.visible=!1}if(n&&o){if(!vn){vn=[];for(let f=0;f<i;f++)vn.push(Be[f].uniforms.uFillProgress.value)}const c=Math.min(r/1200,1),d=c*c,u=c>=1;for(let f=0;f<i;f++)if(u)Be[f].uniforms.uFillProgress.value=0,Be[f].uniforms.uColor.value.set(0,1,.3),Ve[f].visible=!0;else{const p=vn[f]||0;Be[f].uniforms.uFillProgress.value=p*(1-d)}}}function f0(t){[...bn].forEach(e=>{t.remove(e),e.geometry.dispose(),e.material.dispose()}),bn.length=0,Be.length=0,[...$t].forEach(e=>{t.remove(e),e.userData.cloud&&(e.userData.cloud.geometry.dispose(),e.userData.cloud.material.dispose())}),$t.length=0,[...Ve].forEach(e=>{t.remove(e),e.geometry.dispose(),e.material.dispose()}),Ve.length=0,$o.length=0,He.length=0,ye&&(ye.count=0),Ge.length=0,me&&(me.count=0),xn.length=0,Je=[],po=[],vn=null}function h0(){bn=[],Be=[],$t=[],Ve=[],$o=[],xn=[],He=[],Ge=[],ye&&(ye.count=0),me&&(me.count=0),Je=[],po=[],vn=null}const Io=300,Eo=50,pl=1.5,ml=1.2,nf=3;let Me=[],_e=[],de=null,se=null,Tn=null,ae=null,Sn=null,Qs=null,Va=null;const Oe=new pt,In=new Vt,tt=new H;new H;new H;const ir=new Vt;function p0(t,e){Qs=t,Va=e;const n=new Go(1,1),s=new je({transparent:!0,depthWrite:!1,blending:Br,side:ze,uniforms:{baseColor:{value:new Q(13935988)}},vertexShader:`
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
    `});se=new Dn(n,s,Io),se.renderOrder=2,se.count=0,se.isPersistent=!0,Tn=new Float32Array(Io);const o=new Float32Array(Io*3);se.geometry.setAttribute("instanceOpacity",new We(Tn,1)),se.geometry.setAttribute("instanceColor",new We(o,3)),t.add(se);const i=new Wr(.15,.15,.15),a=new je({transparent:!0,depthWrite:!1,uniforms:{baseColor:{value:new Q(11045226)}},vertexShader:`
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
    `});ae=new Dn(i,a,Eo),ae.renderOrder=2,ae.count=0,ae.isPersistent=!0,Sn=new Float32Array(Eo);const r=new Float32Array(Eo*3);ae.geometry.setAttribute("instanceOpacity",new We(Sn,1)),ae.geometry.setAttribute("instanceColor",new We(r,3)),t.add(ae);const l=new Xc(1.46,32),c=new je({transparent:!0,depthWrite:!1,blending:wn,uniforms:{color:{value:new Q(1,.6,.2)},intensity:{value:0}},vertexShader:`
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
    `});de=new Ce(l,c),de.rotation.x=-Math.PI/2,de.visible=!1,de.isPersistent=!0,t.add(de),Me=[],_e=[]}function Os(t,e,n=1,s=null){if(!t||!Qs)return;const o=s||new Q(15258817);lf(t,e,n,o),Math.random()<(e?.7:.3)*n&&cf(t,e,n,o),rf(t,e,n)}function rr(t,e,n,s=null){if(!t||!Qs)return;const o=s||new Q(15258817),i=n===2?40:25,a=n===2?15:8,r=n===2?1.5:1;of(t,e,i,o,r),sf(t,e,a,o,r),af(t,e,n)}function of(t,e,n,s,o){if(se){for(let i=0;i<n;i++){let a,r=!1;Me.length>=Io?(a=0,r=!0):a=Me.length;const l=i/n*Math.PI*2+Math.random()*.3,c=e*(.5+Math.random()*.5),d=new H(t.x+Math.cos(l)*c,t.y+Math.random()*.3,t.z+Math.sin(l)*c),u=(2.5+Math.random()*2)*o,f=(3+Math.random()*2.5)*o,p=new H(Math.cos(l)*u,f,Math.sin(l)*u),h=Math.random()<.25,v=Math.random()*Math.PI*2,y=1+Math.random()*.8,w=h?new H(Math.cos(v)*y,0,Math.sin(v)*y):null,M={instanceIndex:a,position:d.clone(),velocity:p,life:0,maxLife:pl*(1+Math.random()*.5),initialSize:.45*(.8+Math.random()*.6),color:s.clone(),isFloating:h,windDirection:w};r?Me[0]=M:Me.push(M),tt.set(M.initialSize,M.initialSize,M.initialSize),Oe.compose(d,In,tt),se.setMatrixAt(a,Oe),Tn[a]=.4,se.geometry.attributes.instanceColor.setXYZ(a,s.r,s.g,s.b),se.count=Me.length}se.instanceMatrix.needsUpdate=!0,se.geometry.attributes.instanceOpacity.needsUpdate=!0,se.geometry.attributes.instanceColor.needsUpdate=!0}}function sf(t,e,n,s,o){if(ae){for(let i=0;i<n;i++){let a,r=!1;_e.length>=Eo?(a=0,r=!0):a=_e.length;const l=i/n*Math.PI*2+Math.random()*.4,c=e*(.3+Math.random()*.7),d=new H(t.x+Math.cos(l)*c,t.y+.2,t.z+Math.sin(l)*c),u=(3+Math.random()*2.5)*o,f=(4+Math.random()*3)*o,p=new H(Math.cos(l)*u,f,Math.sin(l)*u),h=new H((Math.random()-.5)*15,(Math.random()-.5)*15,(Math.random()-.5)*15),v={instanceIndex:a,position:d.clone(),velocity:p,angularVelocity:h,rotation:new Ks(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),life:0,maxLife:ml*(1+Math.random()*.5),initialSize:.5*(.7+Math.random()*.6),color:s.clone().multiplyScalar(.85),onGround:!1,groundTime:0};r?_e[0]=v:_e.push(v),In.setFromEuler(v.rotation),tt.set(v.initialSize,v.initialSize,v.initialSize),Oe.compose(d,In,tt),ae.setMatrixAt(a,Oe),Sn[a]=.95,ae.geometry.attributes.instanceColor.setXYZ(a,v.color.r,v.color.g,v.color.b),ae.count=_e.length}ae.instanceMatrix.needsUpdate=!0,ae.geometry.attributes.instanceOpacity.needsUpdate=!0,ae.geometry.attributes.instanceColor.needsUpdate=!0}}function af(t,e,n){if(!de)return;de.position.set(t.x,t.y+.1,t.z),de.visible=!0;const s=e*.8;de.scale.set(s,s,1),n===2?de.material.uniforms.color.value.setRGB(1,.8,.2):de.material.uniforms.color.value.setRGB(1,.5,.1),de.material.uniforms.intensity.value=n===2?1.5:1.2}function rf(t,e,n){de&&(de.position.set(t.x,t.y+.1,t.z),de.visible=!0,e?de.material.uniforms.color.value.setRGB(1,.4,.2):de.material.uniforms.color.value.setRGB(.4,.8,1),de.material.uniforms.intensity.value=Math.min(1,n*1.2))}function lf(t,e,n,s){if(!se)return;const o=Math.floor((e?8:4)*n);for(let i=0;i<o;i++){let a,r=!1;Me.length>=Io?(a=0,r=!0):a=Me.length;const l=Math.random()*Math.PI*2,c=e?2.5:1.5,d=e?3.5:2,u=new H(Math.cos(l)*c*(.5+Math.random()*.5),d*(.7+Math.random()*.3),Math.sin(l)*c*(.5+Math.random()*.5)),f=Math.random()*.5,p=Math.random()*Math.PI*2,h=new H(t.x+Math.cos(p)*f,t.y+Math.random()*.2,t.z+Math.sin(p)*f),v=Math.random()<.18,y=Math.random()*Math.PI*2,w=1.5+Math.random()*1,M=v?new H(Math.cos(y)*w,0,Math.sin(y)*w):null,x={instanceIndex:a,position:h.clone(),velocity:u,life:0,maxLife:pl*(.8+Math.random()*.4),initialSize:.35*(.8+Math.random()*.6),color:s.clone(),isFloating:v,windDirection:M};r?Me[0]=x:Me.push(x),tt.set(x.initialSize,x.initialSize,x.initialSize),Oe.compose(h,In,tt),se.setMatrixAt(a,Oe),Tn[a]=.3,se.geometry.attributes.instanceColor.setXYZ(a,s.r,s.g,s.b),se.count=Me.length}se.instanceMatrix.needsUpdate=!0,se.geometry.attributes.instanceOpacity.needsUpdate=!0,se.geometry.attributes.instanceColor.needsUpdate=!0}function cf(t,e,n,s){if(!ae)return;const o=Math.floor((e?3:1)*n);for(let i=0;i<o;i++){let a,r=!1;_e.length>=Eo?(a=0,r=!0):a=_e.length;const l=Math.random()*Math.PI*2,c=1.5+Math.random()*1.5,d=new H(Math.cos(l)*c,2.5+Math.random()*1.5,Math.sin(l)*c),u=new H((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10),f=t.clone();f.y+=.2;const p={instanceIndex:a,position:f.clone(),velocity:d,angularVelocity:u,rotation:new Ks(0,0,0),life:0,maxLife:ml*(.8+Math.random()*.4),initialSize:.4*(.8+Math.random()*.4),color:s.clone().multiplyScalar(.8),onGround:!1,groundTime:0};r?_e[0]=p:_e.push(p),tt.set(p.initialSize,p.initialSize,p.initialSize),Oe.compose(f,In,tt),ae.setMatrixAt(a,Oe),Sn[a]=.9,ae.geometry.attributes.instanceColor.setXYZ(a,p.color.r,p.color.g,p.color.b),ae.count=_e.length}ae.instanceMatrix.needsUpdate=!0,ae.geometry.attributes.instanceOpacity.needsUpdate=!0,ae.geometry.attributes.instanceColor.needsUpdate=!0}function m0(t){uf(t),df(t),ff(t)}function uf(t){if(!se||Me.length===0)return;let e=!1,n=!1,s=!1;const o=-9.8*t,i=2.5*t;Va&&ir.copy(Va.quaternion);let a=0;for(;a<Me.length;){const r=Me[a];if(r.life+=t,r.life>=r.maxLife){const u=Me.length-1;if(a!==u){const f=Me[u];Me[a]=f,f.instanceIndex=a,se.getMatrixAt(u,Oe),se.setMatrixAt(a,Oe),Tn[a]=Tn[u];const p=se.geometry.attributes.instanceColor;p.setXYZ(a,p.getX(u),p.getY(u),p.getZ(u)),s=!0,e=!0,n=!0}Me.pop(),se.count=Me.length;continue}r.isFloating?(r.velocity.y+=i,r.windDirection&&(r.velocity.x+=r.windDirection.x*t,r.velocity.z+=r.windDirection.z*t)):r.velocity.y+=o,r.velocity.multiplyScalar(.95),r.position.x+=r.velocity.x*t,r.position.y+=r.velocity.y*t,r.position.z+=r.velocity.z*t;const l=r.life/r.maxLife,c=.23*(1-l),d=r.initialSize*(1+l*2);tt.set(d,d,d),Oe.compose(r.position,ir,tt),se.setMatrixAt(r.instanceIndex,Oe),e=!0,Tn[r.instanceIndex]=c,n=!0,a++}e&&(se.instanceMatrix.needsUpdate=!0),n&&(se.geometry.attributes.instanceOpacity.needsUpdate=!0),s&&(se.geometry.attributes.instanceColor.needsUpdate=!0)}function df(t){if(!ae||_e.length===0)return;let e=!1,n=!1,s=!1;const o=-9.8*t;let i=0;for(;i<_e.length;){const a=_e[i];if(a.life+=t,a.life>=a.maxLife){const c=_e.length-1;if(i!==c){const d=_e[c];_e[i]=d,d.instanceIndex=i,ae.getMatrixAt(c,Oe),ae.setMatrixAt(i,Oe),Sn[i]=Sn[c];const u=ae.geometry.attributes.instanceColor;u.setXYZ(i,u.getX(c),u.getY(c),u.getZ(c)),s=!0,e=!0,n=!0}_e.pop(),ae.count=_e.length;continue}if(a.onGround)a.groundTime+=t,a.life+=t*2;else{a.velocity.y+=o,a.position.x+=a.velocity.x*t,a.position.y+=a.velocity.y*t,a.position.z+=a.velocity.z*t,a.rotation.x+=a.angularVelocity.x*t,a.rotation.y+=a.angularVelocity.y*t,a.rotation.z+=a.angularVelocity.z*t,a.angularVelocity.multiplyScalar(.95);const c=-1;a.position.y<=c&&(a.position.y=c,Math.abs(a.velocity.y)<2?(a.onGround=!0,a.velocity.set(0,0,0),a.angularVelocity.set(0,0,0)):(a.velocity.y*=-.3,a.velocity.x*=.5,a.velocity.z*=.5))}const l=.9*(1-a.life/a.maxLife);In.setFromEuler(a.rotation),tt.set(a.initialSize,a.initialSize,a.initialSize),Oe.compose(a.position,In,tt),ae.setMatrixAt(a.instanceIndex,Oe),e=!0,Sn[a.instanceIndex]=l,n=!0,i++}e&&(ae.instanceMatrix.needsUpdate=!0),n&&(ae.geometry.attributes.instanceOpacity.needsUpdate=!0),s&&(ae.geometry.attributes.instanceColor.needsUpdate=!0)}function ff(t){if(!de)return;const e=de.material.uniforms.intensity.value;if(e>0){const n=e-t*nf;de.material.uniforms.intensity.value=Math.max(0,n),n<=0&&(de.visible=!1)}}const at=new Q,it=new Q,Ca=new Q,lr=new Q(15258817);function we(t,e){return t.setRGB(e.value.x,e.value.y,e.value.z)}function Jn(t,e){if(!t||!e)return Ca.copy(lr);const n=t.material;if(!n||!n.uniforms)return Ca.copy(lr);const s=n.uniforms,o=e.y;let i;return o<-16?(i=Math.max(0,Math.min(1,(o+16)/6)),i=i*i*(3-2*i),we(at,s.oceanDeepColor),we(it,s.oceanMidColor)):o<-10?(i=(o+16)/6,we(at,s.oceanDeepColor),we(it,s.oceanMidColor)):o<-4?(i=(o+10)/6,we(at,s.oceanMidColor),we(it,s.deepColor)):o<-3?(i=(o+4)/1,we(at,s.deepColor),we(it,s.shallowColor)):o<-1?(i=(o+3)/2,we(at,s.shallowColor),we(it,s.lowColor)):o<.5?(i=(o+1)/1.5,we(at,s.lowColor),we(it,s.midLowColor)):o<1.5?(i=(o-.5)/1,we(at,s.midLowColor),we(it,s.midColor)):o<2.5?(i=(o-1.5)/1,we(at,s.midColor),we(it,s.midHighColor)):o<3.5?(i=(o-2.5)/1,we(at,s.midHighColor),we(it,s.highColor)):(i=Math.min((o-3.5)/2,1),we(at,s.highColor),we(it,s.peakColor)),Ca.copy(at).lerp(it,i)}function g0(){Qs&&(Me=[],_e=[],se&&(se.count=0),ae&&(ae.count=0),de&&(de.visible=!1,de.material.uniforms.intensity.value=0))}const zt=14,Ft=8,cr=3,Vn=0,Bo=2,Vo=80,ur=-8,hf=80,pf=-104,mf=.88,dr=.3,Cn=.22,gf=200,vf=.982,yf=-19,Hn=.03,wf=.0262,Gn=.07,fr=.018,Ya=Cn*1.6,Mf=Ya*Ya,ms=new Map;let hr=-1,Ro=1,gl=1,vl=1;function pr(t){t!==hr&&(hr=t,Ro=Math.pow(vf,t*60),gl=Math.pow(mf,t*60),vl=Math.pow(.96,t*60))}function _f(t){if(ms.has(t))return ms.get(t);const e=new Float32Array(t),n=new Float32Array(t),s=new Float32Array(t),o=new Float32Array(t);for(let i=0;i<t;i++){const a=i/(t-1);e[i]=Math.pow(1-a,.6),n[i]=Math.pow(Math.max(0,1-a*5),1.5)*2.2,s[i]=(1-a)*.85,o[i]=(1-a)*.42}return ms.set(t,{taper:e,cut:n,colG:s,colB:o}),ms.get(t)}function gs(t=zt){const e=t*2,n=(t-1)*6,s=new Le(new Float32Array(e*3),3);s.usage=Yi;const o=new Le(new Float32Array(e*3),3);o.usage=Yi;const i=new Uint16Array(n);for(let r=0;r<t-1;r++){const l=r*6,c=r*2;i[l]=c,i[l+1]=c+1,i[l+2]=c+2,i[l+3]=c+1,i[l+4]=c+3,i[l+5]=c+2}const a=new ho;return a.setAttribute("position",s),a.setAttribute("color",o),a.setIndex(new Le(i,1)),a}function vs(t,e,n,s=zt,o=0,i=0,a=1){return Array.from({length:s},(r,l)=>({x:t+o*l*Cn,y:e+i*l*Cn,z:n+a*l*Cn,vx:0,vy:0,vz:0}))}function ys(t,e,n,s,o,i){t[0].x=e,t[0].y=n,t[0].z=s,t[0].vx=0,t[0].vy=0,t[0].vz=0;for(let a=1;a<t.length;a++){const r=t[a],l=t[a-1],c=l.x-r.x,d=l.y-r.y,u=l.z-r.z,f=Math.sqrt(c*c+d*d+u*u)||1e-5,p=(f-Cn)*gf;r.vx=(r.vx+c/f*p*o)*i,r.vy=(r.vy+(d/f*p+yf)*o)*i,r.vz=(r.vz+u/f*p*o)*i,r.x+=r.vx*o,r.y+=r.vy*o,r.z+=r.vz*o;const h=r.x-l.x,v=r.y-l.y,y=r.z-l.z,w=h*h+v*v+y*y;if(w>Mf){const M=Ya/Math.sqrt(w);r.x=l.x+h*M,r.y=l.y+v*M,r.z=l.z+y*M}}}function ws(t,e,n,s,o,i,a=wf){if(e.setDrawRange(0,Math.max(0,i-1)*6),i<2)return;const r=e.attributes.position.array,l=e.attributes.color.array,{taper:c,cut:d,colG:u,colB:f}=_f(i),p=e._lastColorCount!==i;p&&(e._lastColorCount=i);for(let h=0;h<i;h++){const v=a*c[h],{x:y,y:w,z:M}=t[h],x=d[h]*a,m=h*6,S=m+3;r[m]=y-n*v*s,r[m+1]=w-n*v*o-x,r[m+2]=M,r[S]=y+n*v*s,r[S+1]=w+n*v*o+x,r[S+2]=M,p&&(l[m]=0,l[m+1]=u[h],l[m+2]=f[h],l[S]=0,l[S+1]=u[h],l[S+2]=f[h])}e.attributes.position.needsUpdate=!0,p&&(e.attributes.color.needsUpdate=!0)}class yl{constructor(){this._model=null,this._mixer=null,this._action=null,this._scene=null,this._shadowClones=[],this.birdY=23,this.velocityY=0,this._controlEnabled=!1,this._isMouseDown=!1,this._isShiftPressed=!1,this._isRightMouseDown=!1,this._activeTouchCount=0,this._inputListeners=[],this._timeSinceInput=0,this._soarFlapTimer=0,this._soarFlapBurst=!1,this._soarFlapBurstTimer=0,this._wasInSoarMode=!1,this._soarRockPhase=0,this._soarDriftPhase=0,this._rollActive=!1,this._rollAngle=0,this._cloneUpdateFrame=0,this._secondaryModel=null,this._secondaryMixer=null,this._secondaryAction=null,this._secondaryYOffset=.002,this._secondaryXOffset=.14,this._secondaryBaseRotZ=-.05,this._leftFeatherMesh=null,this._rightFeatherMesh=null,this._featherGeomL=null,this._featherGeomR=null,this._chainL=[],this._chainR=[],this._leftFeatherMesh2=null,this._rightFeatherMesh2=null,this._featherGeomL2=null,this._featherGeomR2=null,this._chainL2=[],this._chainR2=[],this._blueSeedDecor=null,this._redSeedDecor=null}get model(){return this._model}get isControlEnabled(){return this._controlEnabled}get isRolling(){return this._rollActive}enableControl(){this._controlEnabled=!0}disableControl(){this._controlEnabled=!1}keepFlapping(){this._timeSinceInput=0}snapChainTrail(e,n){if(!this._chainL)return;const s=this._model?this._model.position.x:0,o=this._model?this._model.position.y:0,i=this._model?this._model.position.z:0;for(const a of[this._chainL,this._chainR,this._chainL2,this._chainR2])for(let r=0;r<a.length;r++)a[r].x=s+r*Cn*e,a[r].y=o,a[r].z=i+r*Cn*n,a[r].vx=0,a[r].vy=0,a[r].vz=0}triggerRoll(){this._rollActive=!0,this._rollAngle=0,this.velocityY+=18}load(e){return new Promise((n,s)=>{const o=new cl;Promise.all([new Promise((i,a)=>o.load("./models/synthwave-bird.glb",i,void 0,a)),new Promise((i,a)=>o.load("./models/synth-brd-remesh-anim-1.glb",i,void 0,a))]).then(([i,a])=>{this._scene=e,this._model=i.scene,this._model.scale.setScalar(1.4),this._model.rotation.y=0,this._model.visible=!1,e.add(this._model),this._model.traverse(h=>{h.material&&(Array.isArray(h.material)?h.material:[h.material]).forEach(y=>{y.color&&y.color.set(65442)})}),this._secondaryModel=a.scene,this._secondaryModel.scale.setScalar(1.36),this._secondaryModel.rotation.y=0,this._secondaryModel.visible=!1,e.add(this._secondaryModel);const r=new zo({color:new Q(20991),emissive:new Q(5223423),emissiveIntensity:.2,transparent:!0,opacity:.4,depthWrite:!1,roughness:.3});this._secondaryModel.traverse(h=>{h.isMesh&&(h.material=r)}),a.animations?.length>0&&(this._secondaryMixer=new bo(this._secondaryModel),this._secondaryAction=this._secondaryMixer.clipAction(a.animations[0]),this._secondaryAction.play());const l=[{scale:1.4*.94,color:27433,opacity:.92,renderOrder:97,lineWidth:3},{scale:1.4*1.04,color:15673,opacity:.75,renderOrder:96,lineWidth:5}],c=(h,v)=>{const y=h.clone();y.computeBoundingBox();const w=y.boundingBox.min.y,M=y.boundingBox.max.y-w||1,x=y.attributes.position,m=new Float32Array(x.count*3),S=new Q(v);for(let b=0;b<x.count;b++){const A=.15+(x.getY(b)-w)/M*.85;m[b*3]=S.r*A,m[b*3+1]=S.g*A,m[b*3+2]=S.b*A}return y.setAttribute("color",new Le(m,3)),y};for(let h=0;h<l.length;h++){const v=l[h],y=rl(i.scene);y.scale.setScalar(v.scale),y.visible=!1;const w=[];y.traverse(m=>{if(m.isLine||m.isLineSegments){const S=c(m.geometry,v.color);m.geometry=S,m.material=new Xr({color:v.color,transparent:!0,opacity:v.opacity,depthWrite:!1,vertexColors:!0}),m.renderOrder=v.renderOrder,w.push(m.material)}else m.isMesh&&(m.material=new dt({color:v.color,transparent:!0,opacity:v.opacity,depthWrite:!1}),w.push(m.material))});let M=null,x=null;i.animations?.length>0&&(M=new bo(y),x=M.clipAction(i.animations[0]),x.play()),e.add(y),this._shadowClones.push({mesh:y,ox:0,oy:0,oz:0,mixer:M,action:x,materials:w,baseOpacity:v.opacity,pulsePhase:h*2.1})}const d=document.createElement("canvas");d.width=d.height=128;const u=d.getContext("2d"),f=u.createRadialGradient(64,64,0,64,64,64);f.addColorStop(0,"rgba(0, 255, 247, 0.25)"),f.addColorStop(.25,"rgba(0, 220, 220, 0.1)"),f.addColorStop(1,"rgba(0, 132, 180, 0)"),u.fillStyle=f,u.fillRect(0,0,128,128);const p=new qc(new Zc({map:new Qo(d),transparent:!0,blending:wn,depthWrite:!1}));p.scale.set(2.5,2,.8),p.renderOrder=99,this._model.add(p),this._createSeeds(),i.animations?.length>0&&(this._mixer=new bo(this._model),this._action=this._mixer.clipAction(i.animations[0]),this._action.play()),n(this._model)},void 0,s)})}initFeathers(e,n,s,o,i=0,a=0,r=1){this._chainL=vs(n-Hn,s,o,zt,i,a,r),this._chainR=vs(n+Hn,s,o,zt,i,a,r),this._chainL2=vs(n-Gn,s,o,Ft,i,a,r),this._chainR2=vs(n+Gn,s,o,Ft,i,a,r);const l=new dt({vertexColors:!0,transparent:!0,opacity:.88,side:ze,depthWrite:!1,blending:wn});this._featherGeomL=gs(),this._featherGeomR=gs(),this._leftFeatherMesh=new Ce(this._featherGeomL,l),this._rightFeatherMesh=new Ce(this._featherGeomR,l.clone()),this._leftFeatherMesh.renderOrder=this._rightFeatherMesh.renderOrder=101,this._leftFeatherMesh.frustumCulled=this._rightFeatherMesh.frustumCulled=!1,e.add(this._leftFeatherMesh),e.add(this._rightFeatherMesh);const c=new dt({vertexColors:!0,transparent:!0,opacity:.65,side:ze,depthWrite:!1,blending:wn});this._featherGeomL2=gs(Ft),this._featherGeomR2=gs(Ft),this._leftFeatherMesh2=new Ce(this._featherGeomL2,c),this._rightFeatherMesh2=new Ce(this._featherGeomR2,c.clone()),this._leftFeatherMesh2.renderOrder=this._rightFeatherMesh2.renderOrder=100,this._leftFeatherMesh2.frustumCulled=this._rightFeatherMesh2.frustumCulled=!1,e.add(this._leftFeatherMesh2),e.add(this._rightFeatherMesh2)}setupInputHandlers(){const e=(c,d,u,f)=>{c.addEventListener(d,u,f),this._inputListeners.push({target:c,type:d,handler:u,opts:f})},n=c=>{c.button===0&&(this._isMouseDown=!0),c.button===2&&(this._isRightMouseDown=!0)},s=c=>{c.button===0&&(this._isMouseDown=!1),c.button===2&&(this._isRightMouseDown=!1)},o=c=>{c.key==="Shift"&&(this._isShiftPressed=!0)},i=c=>{c.key==="Shift"&&(this._isShiftPressed=!1)},a=c=>{this._activeTouchCount=c.touches.length},r=c=>{this._activeTouchCount=c.touches.length},l=c=>c.preventDefault();e(window,"mousedown",n),e(window,"mouseup",s),e(window,"keydown",o),e(window,"keyup",i),e(window,"touchstart",a,{passive:!0}),e(window,"touchend",r,{passive:!0}),e(window,"contextmenu",l)}removeInputHandlers(){this._inputListeners.forEach(({target:e,type:n,handler:s,opts:o})=>{e.removeEventListener(n,s,o)}),this._inputListeners=[],this._isMouseDown=!1,this._isShiftPressed=!1,this._isRightMouseDown=!1,this._activeTouchCount=0}updateAnimation(e){if(this._mixer){if(this._rollActive)this._wasInSoarMode=!1,this._mixer.timeScale+=(.2-this._mixer.timeScale)*Math.min(1,e*5),this._mixer.update(e);else if(this._timeSinceInput>.4){!this._wasInSoarMode&&this._action&&(this._action.time=dr,this._mixer.timeScale=0,this._mixer.update(0),this._soarRockPhase=Math.random()*Math.PI*2,this._soarDriftPhase=Math.random()*Math.PI*2),this._wasInSoarMode=!0,this._soarRockPhase=(this._soarRockPhase||0)+e*.6;const n=Math.sin(this._soarRockPhase)*.22,s=Math.cos(this._soarRockPhase*.8)*.05;this._soarDriftPhase=(this._soarDriftPhase||0)+e*.4;const o=Math.sin(this._soarDriftPhase)*.15,i=Math.sin(this._soarDriftPhase*.5)*.08;this._model&&(this._model.rotation.x=s,this._model.rotation.z=n,this._model.position.x+=o*e,this._model.position.z+=i*e),this._soarFlapTimer+=e,this._soarFlapTimer>=2.5&&!this._soarFlapBurst&&(this._soarFlapBurst=!0,this._soarFlapBurstTimer=0,this._soarFlapTimer=0),this._soarFlapBurst&&(this._soarFlapBurstTimer+=e,this._soarFlapBurstTimer>=.45&&(this._soarFlapBurst=!1,this._action&&(this._action.time=dr,this._mixer.update(0)))),this._mixer.timeScale=this._soarFlapBurst?2:0,this._mixer.update(e)}else{this._wasInSoarMode=!1;const n=this._model?Math.max(0,Math.min(1,(-this._model.rotation.x-.5)/.4)):0,s=(1+Math.max(-.55,Math.min(1,this.velocityY*.045)))*(1-n);this._mixer.timeScale+=(s-this._mixer.timeScale)*Math.min(1,e*5),this._mixer.update(e)}if(this._cloneUpdateFrame=(this._cloneUpdateFrame+1)%3,this._cloneUpdateFrame===0){this._secondaryMixer&&this._secondaryAction&&this._action&&(this._secondaryMixer.timeScale=this._mixer.timeScale,this._secondaryAction.time=this._action.time,this._secondaryMixer.update(0));for(const{action:n,mixer:s}of this._shadowClones)n&&this._action&&(n.time=this._action.time,s.update(0))}}}updateFeathers(e,n=zt,s=Ft,o=0,i=0,a=0,r=0){if(this._model&&this._shadowClones.length){const y=this._model.position.x,w=this._model.position.y,M=this._model.position.z;for(const{mesh:x,ox:m,oy:S,oz:b}of this._shadowClones)x.visible=this._model.visible,x.position.set(y+m,w+S,M+b),x.rotation.copy(this._model.rotation)}if(this._secondaryModel&&this._model&&(this._secondaryModel.visible=this._model.visible,this._secondaryModel.position.copy(this._model.position),this._secondaryModel.position.y+=this._secondaryYOffset,this._secondaryModel.position.z+=this._secondaryXOffset,this._secondaryModel.rotation.copy(this._model.rotation),this._secondaryModel.rotation.z+=this._secondaryBaseRotZ),!this._leftFeatherMesh||!this._model)return;const l=this._model.visible;if(this._leftFeatherMesh.visible=l,this._rightFeatherMesh.visible=l,this._leftFeatherMesh2.visible=l,this._rightFeatherMesh2.visible=l,!l)return;if(o!==0){const y=o*e;for(const w of[this._chainL,this._chainR,this._chainL2,this._chainR2])for(const M of w)M.z-=y}const c=Math.sqrt(i*i+r*r);if(c>.5){const w=-i/c*34*e,M=-r/c*34*e;for(const x of[this._chainL,this._chainR,this._chainL2,this._chainR2])for(let m=1;m<x.length;m++)x[m].vx+=w,x[m].vz+=M}const d=this._model.rotation.z,u=Math.cos(d),f=Math.sin(d),p=this._model.position.x,h=this._model.position.y-.04,v=this._model.position.z;pr(e),ys(this._chainL,p-Hn*u,h-Hn*f,v,e,Ro),ys(this._chainR,p+Hn*u,h+Hn*f,v,e,Ro),this._chainL2.length&&ys(this._chainL2,p-Gn*u,h-Gn*f,v,e,Ro),this._chainR2.length&&ys(this._chainR2,p+Gn*u,h+Gn*f,v,e,Ro),ws(this._chainL,this._featherGeomL,-1,u,f,n),ws(this._chainR,this._featherGeomR,1,u,f,n),ws(this._chainL2,this._featherGeomL2,-1,u,f,s,fr),ws(this._chainR2,this._featherGeomR2,1,u,f,s,fr)}updateSeeds(e){if(!this._blueSeedDecor)return;const n=.05+e*.95;this._blueSeedDecor.scale.setScalar(n),this._blueSeedDecor.material.emissiveIntensity=e*5,this._redSeedDecor.scale.setScalar(n),this._redSeedDecor.material.emissiveIntensity=e*5}applyPhysics(e){if(!this._controlEnabled||!this._model)return;const n=this._isUpInput()||this._isLowerInput();n?(this._timeSinceInput=0,this._soarFlapTimer=0,this._soarFlapBurst=!1):this._timeSinceInput+=e,this._isUpInput()&&(this.velocityY+=hf*e),this._isLowerInput()&&(this.velocityY+=pf*e);const s=!n&&this.velocityY>0;this.velocityY+=(s?ur*.15:ur)*e,pr(e),this.velocityY*=s?vl:gl,this.birdY+=this.velocityY*e,this.birdY=Math.max(Bo,Math.min(Vo,this.birdY)),(this.birdY<=Bo||this.birdY>=Vo)&&(this.velocityY=0);const o=Math.max(-.9,Math.min(.45,this.velocityY*.1));this._model.rotation.x+=(o-this._model.rotation.x)*Math.min(1,e*1.5),this._rollActive?(this._rollAngle+=Math.PI*2/.65*e,this._rollAngle>=Math.PI*2&&(this._rollActive=!1,this._rollAngle=0),this._model.rotation.z=this._rollAngle):this._model.rotation.z=Math.max(-.2,Math.min(.2,-this.velocityY*.03))}dispose(e){for(const{mesh:n,mixer:s}of this._shadowClones)s&&s.stopAllAction(),e.remove(n),n.traverse(o=>{o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(i=>i.dispose()):o.material.dispose())});this._shadowClones=[],this._model&&(e.remove(this._model),this._model.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(s=>s.dispose()):n.material.dispose())}),this._model=null),this._secondaryModel&&(this._secondaryMixer&&this._secondaryMixer.stopAllAction(),e.remove(this._secondaryModel),this._secondaryModel.traverse(n=>{n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material.forEach(s=>s.dispose()):n.material.dispose())}),this._secondaryModel=null,this._secondaryMixer=null,this._secondaryAction=null);for(const n of[this._leftFeatherMesh,this._rightFeatherMesh,this._leftFeatherMesh2,this._rightFeatherMesh2])n&&(e.remove(n),n.geometry?.dispose(),n.material?.dispose());this._leftFeatherMesh=this._rightFeatherMesh=null,this._leftFeatherMesh2=this._rightFeatherMesh2=null,this._featherGeomL=this._featherGeomR=null,this._featherGeomL2=this._featherGeomR2=null,this._chainL=this._chainR=this._chainL2=this._chainR2=[],this._mixer=null,this._action=null,this._blueSeedDecor=null,this._redSeedDecor=null}_isUpInput(){return this._isMouseDown&&!this._isLowerInput()||this._activeTouchCount===1}_isLowerInput(){return this._isShiftPressed||this._isRightMouseDown||this._activeTouchCount>=2}_createSeeds(){const e=(n,s)=>{const o=new Ce(new Jc(s,12),new zo({color:16711680,emissive:new Q(n),emissiveIntensity:0,transparent:!0,opacity:.9,depthWrite:!1}));return o.rotation.x=-Math.PI/2,o};this._blueSeedDecor=e(65322,[new ue(0,-.22),new ue(.032,-.14),new ue(.062,-.04),new ue(.068,.03),new ue(.064,.11),new ue(.054,.2),new ue(.038,.29),new ue(.018,.36),new ue(0,.4)]),this._redSeedDecor=e(16729122,[new ue(0,-.18),new ue(.026,-.11),new ue(.052,-.03),new ue(.057,.02),new ue(.053,.09),new ue(.044,.17),new ue(.03,.25),new ue(.013,.31),new ue(0,.34)]),this._blueSeedDecor.position.set(0,-.03,-.15),this._redSeedDecor.position.set(0,-.04,-.15),this._model.add(this._blueSeedDecor),this._model.add(this._redSeedDecor)}}function v0(t){return t*t*t}function Ra(t){if(t<.5)return 4*t*t*t;const e=-2*t+2;return 1-e*e*e/2}const xf=142,Tf=142,mr=20,Sf=1,gr=3,Cf=1.8,Rf=10,Yo=220,vr=Yo+20,Rn=22,$s=Yo-10;function Af(t){const e=[],n=[],s=[],o=[],i=[];t.traverse(a=>{!a.isMesh||!a.material||(a.userData.spawnOpacity=a.material.opacity,a.userData.rotationSpeed!==void 0?(e.push(a),o.push(a)):a.userData.isBaseRing||a.userData.isTurboGlow?o.push(a):a.userData.isConvergingRing?(n.push(a),i.push(a)):a.userData.isConvergingChevron&&(s.push(a),i.push(a)))}),t.userData._blades=e,t.userData._cRings=n,t.userData._cChevrons=s,t.userData._staticMeshes=o,t.userData._dynamicMeshes=i}function wl(t){t.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>{for(const o of Object.values(s))o&&o.isTexture&&o.dispose();s.dispose()})})}function Df(t,e,n){e.remove(t);const s=n.indexOf(t);s!==-1&&n.splice(s,1),wl(t)}function Ml(t,e){const n=[];for(let s=0;s<t;s++)n.push(!1);for(let s=0;s<e;s++)n.push(!0);for(let s=n.length-1;s>0;s--){const o=Math.floor(Math.random()*(s+1));[n[s],n[o]]=[n[o],n[s]]}return n}const bf=`
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
`,If=`
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
`;function ja(t,e,n,s,o,i,a,r=0,l=!1){const u=new Q(t?16720384:43775),f=new Q(t?16746581:8969727),p=new Float32Array(180),h=new Float32Array(180),v=new Float32Array(180),y=new Float32Array(60),w=new Float32Array(60);for(let b=0;b<60;b++){p[b*3]=e,p[b*3+1]=n,p[b*3+2]=s,w[b]=Math.random()*Math.PI*2;const I=l?12+Math.random()*20:15+Math.random()*30,A=8+Math.random()*16,T=Math.random()*Math.PI*2;l?(v[b*3]=Math.cos(T)*A,v[b*3+1]=I,v[b*3+2]=Math.sin(T)*A*.7):(v[b*3]=Math.cos(T)*A,v[b*3+1]=Math.sin(T)*A*.7,v[b*3+2]=-I);const C=Math.random()<.6?u:f;h[b*3]=C.r,h[b*3+1]=C.g,h[b*3+2]=C.b,y[b]=.8+Math.random()*Math.random()*3.5}const M=new ho;M.setAttribute("position",new Le(p,3)),M.setAttribute("aColor",new Le(h,3)),M.setAttribute("aSize",new Le(y,1)),M.setAttribute("aVelocity",new Le(v,3)),M.setAttribute("aFlickerPhase",new Le(w,1));const x=new je({vertexShader:bf,fragmentShader:If,uniforms:{uOpacity:{value:1},uElapsed:{value:0},uApproachSpeed:{value:r},uUpwardBurst:{value:l?1:0}},transparent:!0,depthWrite:!1,blending:wn}),m=new Xs(M,x);o.add(m),i.push(m);let S=0;a.push({done:!1,update(b){if(S+=b,x.uniforms.uElapsed.value=S,x.uniforms.uOpacity.value=Math.max(0,1-(S/2)**2),S>=2){m.parent&&o.remove(m);const I=i.indexOf(m);I!==-1&&i.splice(I,1),M.dispose(),x.dispose(),this.done=!0}}})}let Ka=!1;function Ef(t){Gr(),nc(t),Ka=!1}function Pf(t,e,n){oc(t/e*100,{currentMass:t,totalMass:e,winPercentage:n}),t>=Math.ceil(e*n)&&(sc(),Ka||(Ka=!0,Kl())),ac()}function Lf(){Gr()}function _l(t,e){for(let n=t.length-1;n>=0;n--)t[n].update(e),t[n].done&&t.splice(n,1)}function Of(t,e,{birdZ:n,birdWorldY:s,ringSpeed:o,approachSpeed:i=0,scene:a,trackingArray:r,onHit:l,onMiss:c}){for(let u=t.length-1;u>=0;u--){const f=t[u];f.position.z+=(o-i)*e,f.userData.animTime+=e;const p=f.userData.animTime;f.userData.collected&&(f.userData.collectedTime+=e);const h=f.userData.collectedTime;f.rotation.z+=(f.userData.isLower?-.5:.5)*e;const v=f.userData.collected?2:1;for(const M of f.userData._blades)M.rotation.z+=M.userData.rotationSpeed*e*60*v,f.userData.collected&&(M.material.color.setHex(16763904),M.material.opacity=M.userData.baseOpacity*(.85+Math.sin(h*8)*.15)*1.3);for(const M of f.userData._cRings){const x=(p-M.userData.animationOffset)%1.5;if(x<0){M.material.opacity=0;continue}const m=Math.min(x/1.5,1),S=M.userData.startRadius*(1-m*.6);M.scale.set(S/M.userData.ringRadius,S/M.userData.ringRadius,1);const b=m<.15?m/.15:m>.5?(1-m)/.5:1;M.material.opacity=b*.4}for(const M of f.userData._cChevrons){const x=(p-M.userData.animationOffset)%1.5;if(x<0){M.visible=!1;continue}M.visible=!0;const m=Math.min(x/1.5,1),S=M.userData.startRadius*(1-m*.64);M.position.x=Math.cos(M.userData.angle)*S,M.position.y=Math.sin(M.userData.angle)*S;const b=1-m*.45;M.scale.set(b,b,1);const I=m<.15?m/.15:m>.5?(1-m)/.5:1;M.material.opacity=I*.7,f.userData.collected&&M.material.color.setHex(65484)}const y=n-f.position.z,w=Math.min(1,Math.max(0,1-(y-mr)/(Tf-mr)));if(w<1){for(const M of f.userData._staticMeshes)M.material.opacity=(M.userData.spawnOpacity??M.material.opacity)*w;for(const M of f.userData._dynamicMeshes)M.material.opacity*=w}!f.userData.checked&&f.position.z>=n&&(f.userData.checked=!0,Math.abs(f.position.y-s)<f.userData.innerRadius*Sf?(f.userData.collected=!0,l?.(f.userData.isLower)):c?.()),f.position.z>n+20&&(Df(f,a,r),t.splice(u,1))}}let Qt=null,Et=null,ht=!1,ft=null,Fs=null,W=null,es=[],Rs=0,Ns=[],en=0,Yn=0,jo=0,As=(Bo+Vo)/2,Xa=0,qa=!1,Po=0,so=[],Hs=[],Za=!1,Lo=!1,ut=null,zn=Rn,Gs=!1,Ja=0;const Ff=2.5;let zs=!1,Qa=0;const Nf=.45,xl=new Vt,yr=new Vt;let ks=!1,$a=0;const Hf=.45;let Tl=0,Sl=0,Cl=0,Rl=$s;function Gf(t){Qt.add(t),so.push(t)}function Pt(){return W?W.birdY:23}function qt(){return $s}function zf(){const t=ft.ringTotal??20;if(en>=t)return;const e=Ns[en];en++;const n=Math.min(1,Xa/Rf),s=gr+(Cf-gr)*n;Xa++;const o=ii(e);o.rotation.set(0,0,0),o.scale.setScalar(s),Af(o),o.userData.isLower=e,o.userData.innerRadius=2.2*.5*s,o.userData.checked=!1,o.userData.animTime=0,o.userData.collected=!1,o.userData.collectedTime=0;const i=8+Math.random()*10,a=e?Math.max(Bo+1,As-i):Math.min(Vo-1,As+i);As=a,o.position.set(0,Rn-22+a,qt()-xf),Gf(o),es.push(o)}function kf(t){Yn++,jo++,Po++,t?Lr():Or(),Po>=3&&!W.isRolling&&W.isControlEnabled&&(Fr(),W.triggerRoll(),Po=0);const e=ft.ringTotal??20;Pf(jo,e,ft.winPercentage??.6),Al()}function Al(){if(qa)return;const t=ft.ringTotal??20;if(en<t||es.length>0)return;const e=Math.ceil(t*(ft.winPercentage??.6));jo>=e?(qa=!0,setTimeout(()=>{ht&&Uf()},1e3)):(Ns=Ml(Math.round(5*.6),Math.round(5*.4)),en=0,ft.ringTotal=jo+5)}function Wf(){const t=document.getElementById("level-story-overlay"),e=document.getElementById("level-story-text");!t||!e||(e.textContent="GO!",t.style.display="block",requestAnimationFrame(()=>{ht&&t.classList.add("visible")}),setTimeout(()=>{ht&&(t.classList.remove("visible"),setTimeout(()=>{t.style.display="none"},400))},650))}function Uf(){W.disableControl(),Lo=!0,W.velocityY=35,ut=document.createElement("div"),ut.style.cssText="position:fixed;inset:0;background:black;opacity:0;pointer-events:none;transition:opacity 1.5s ease;z-index:9999;",document.body.appendChild(ut),setTimeout(()=>{ut&&(ut.style.opacity="1")},500),setTimeout(()=>{ht&&Bf()},2200)}function Bf(){ht&&(ht=!1,Yf(),window.showMainMenuFromMinigame&&window.showMainMenuFromMinigame())}function Vf(t,e){t.position.z=e.position.z}function y0(t,e,n,s=null,o=null){if(Qt=t,Et=e,ft=n,ht=!0,Fs=o,W=null,es=[],Rs=0,Ns=[],en=0,Yn=0,jo=0,Xa=0,As=(Bo+Vo)/2,Po=0,qa=!1,so=[],Hs=[],Za=!1,Lo=!1,ut=null,zn=s?e.position.y:Rn,Gs=!!s,Ja=0,zs=!!s,Qa=0,s&&xl.copy(e.quaternion),s||(e.position.set(0,Rn,Yo),e.lookAt(0,Rn,$s-30),e.updateMatrixWorld(!0)),t.fog=new Qc(9090260,18e-6),Ef(n.winPercentage??.6),s?(W=s,W.birdY=13,W.setupInputHandlers(),W.model&&(ks=!0,$a=0,Tl=W.model.rotation.x,Sl=W.model.rotation.y,Cl=W.model.rotation.z,Rl=W.model.position.z,W.model.visible=!0),W._leftFeatherMesh&&(W._leftFeatherMesh.visible=!0),W._rightFeatherMesh&&(W._rightFeatherMesh.visible=!0),W._leftFeatherMesh2&&(W._leftFeatherMesh2.visible=!0),W._rightFeatherMesh2&&(W._rightFeatherMesh2.visible=!0)):(W=new yl,W.birdY=13,W.initFeathers(t,Vn,Pt(),qt()),W.setupInputHandlers(),W.load(t).then(()=>{if(!ht){W.dispose(t);return}W.model.position.set(Vn,Pt(),qt()),W.model.visible=!0})),!ht)return;W.enableControl();const i=n.ringTotal??20,a=n.ringBlueCount??Math.round(i*.6);Ns=Ml(a,i-a),en=0,Za=!0,Wf()}function w0(t){if(!ht)return;const e=!!W?.model;let n=Et.position.y;if(Lo&&e)zn+=(Pt()-zn)*Math.min(1,t*880);else{const l=e?Math.max(0,W.velocityY??0)*.3:0,c=e?Pt()+4.5-l:Rn,d=e?Math.min(0,(W.velocityY??0)*.5):0,u=e?Pt()+d:Rn;n=Et.position.y+(c-Et.position.y)*Math.min(1,t*3),zn+=(u-zn)*Math.min(1,t*3)}let s=Yo;if(Gs){Ja+=t;const l=Math.min(Ja/Ff,1),c=Ra(l);s=vr+(Yo-vr)*c,l>=1&&(Gs=!1)}if(Et.position.set(0,n,s),Fs&&Vf(Fs,Et),Et.lookAt(0,zn,qt()-30),zs){Qa+=t;const l=Math.min(Qa/Nf,1),c=Ra(l);yr.copy(Et.quaternion),Et.quaternion.slerpQuaternions(xl,yr,c),l>=1&&(zs=!1)}if(W.updateAnimation(t),Lo){if(W.model){W.velocityY-=10*t,W.birdY+=W.velocityY*t,W.model.position.set(Vn,W.birdY,qt());const l=Math.min(.45,W.velocityY*.08);W.model.rotation.x+=(l-W.model.rotation.x)*Math.min(1,t*1.5)}}else if(W.applyPhysics(t),W.model)if(ks){$a+=t;const l=Math.min($a/Hf,1),c=Ra(l),d=Zt.lerp(Rl,$s,c);W.model.position.set(Vn,Pt(),d),W.model.rotation.x=Zt.lerp(Tl,0,c),W.model.rotation.y=Zt.lerp(Sl,0,c),W.model.rotation.z=Zt.lerp(Cl,0,c),l>=1&&(ks=!1)}else W.model.position.set(Vn,Pt(),qt());if(Za&&!Lo){const l=ft.ringTotal??20,c=ft.ringSpawnInterval??3;Rs+=t,Rs>=c&&(Rs=0,zf()),Of(es,t,{birdZ:qt(),birdWorldY:Pt(),ringSpeed:ft.ringSpeed??22,approachSpeed:0,scene:Qt,trackingArray:so,onHit:d=>{kf(d),ja(d,Vn,Pt(),qt(),Qt,so,Hs)},onMiss:()=>{Po=0}}),en>=l&&Al()}const o=W.isControlEnabled?2:0,i=Math.min(zt,o+Yn*2),a=Yn>=cr?2:0,r=Math.min(Ft,a+Math.max(0,Yn-cr)*2);W.updateFeathers(t,i,r),W.updateSeeds(Math.min(1,Yn/(ft.ringTotal??20))),_l(Hs,t)}function Yf(){ht=!1,Gs=!1,zs=!1,ks=!1,Fs=null,Lf();const t=document.getElementById("level-story-overlay");t&&(t.classList.remove("visible"),t.style.display="none"),W&&(W.removeInputHandlers(),W.dispose(Qt),W=null),so.forEach(e=>{e.parent&&Qt.remove(e),wl(e)}),so=[],es=[],Hs=[],Qt&&(Qt.fog=null),ut&&ut.parentNode&&(ut.parentNode.removeChild(ut),ut=null)}const kt=[];let Aa=0;const ao=[],An=[];let wr=0,z=null,tn=null,Ws=0,En=!1;const Wt=new H;let Ko=!1,Xo=!1,jn=0,Dl=0;const Qn=new H,Oo=new H,$n=new H,Fo=new H;let Us=!1,eo=0;const Ao=new H,Ms=[],Mr=[];let ei=!1;const _r=1.5,jf=2.5,Kf=10,Xf=8,qf=.81,bl=.13;let kn=bl;const Zf=260,Il=.004;let El=Il;const ti=.75,Co=.2,Jf=30,fn=[];let qo=!1;const xr=new H,Qf=new H(0,-1,0),Tr=new di,_s=new $c,Pl=new H(0,1,0);function Ll(){if(fn.length===0){qo=!1;return}const t=Date.now();let e=fn.length;for(;e--;){const n=fn[e],s=t-n.startTime;if(s<0)continue;n.object.visible||(n.object.visible=!0);const o=Math.min(s/n.duration,1),a=(1-Math.pow(1-o,3))*n.targetScale;n.object.scale.set(a,a,a),o>=1&&fn.splice(e,1)}fn.length>0?requestAnimationFrame(Ll):qo=!1}function Ol(t,e,n,s){fn.push({object:t,startTime:e,duration:n,targetScale:s}),qo||(qo=!0,requestAnimationFrame(Ll))}const $f=24,No=[],eh=8;let Bs=!1;function Fl(t){No.push(t),Bs||(Bs=!0,requestAnimationFrame(Nl))}function Nl(){let t=0;for(;No.length>0&&t<eh;)No.shift()(),t++;No.length>0?requestAnimationFrame(Nl):Bs=!1}function Da(t){const{numPositions:e,terrainSize:n,terrainMesh:s,heightSampler:o=null,minSpacing:i,existingPositions:a=[],validHeightRange:r={min:.3,max:2.2},minSlopeDotProduct:l=.423,useClusterMode:c=!1}=t;if(o){const d=[],u=e*20,f=i*i,p=.3;let h=[];if(c){const v=Math.floor(e/6);for(let y=0;y<v;y++)h.push({x:(Math.random()-.5)*n*.8,z:(Math.random()-.5)*n*.8,radius:1.5+Math.random()*1.5})}for(let v=0;d.length<e&&v<u;v++){let y,w;if(c&&Math.random()<.7&&h.length>0){const A=h[Math.floor(Math.random()*h.length)],T=Math.random()*Math.PI*2,C=Math.random()*A.radius;y=A.x+Math.cos(T)*C,w=A.z+Math.sin(T)*C}else y=(Math.random()-.5)*n*.8,w=(Math.random()-.5)*n*.8;const M=o(y,w);if(M<r.min||M>r.max)continue;const x=o(y+p,w)-M,m=o(y,w+p)-M,S=Math.sqrt(x*x+p*p+m*m);if(p/S<l)continue;let I=!1;for(let A=0;A<a.length&&!I;A++){const T=y-a[A].x,C=w-a[A].z;T*T+C*C<f&&(I=!0)}for(let A=0;A<d.length&&!I;A++){const T=y-d[A].x,C=w-d[A].z;T*T+C*C<f&&(I=!0)}I||d.push({x:y,z:w,height:M,normal:{x:-x/S,y:p/S,z:-m/S}})}return Promise.resolve(d)}return new Promise(d=>{const u=[],f=e*20,p=i*i;let h=0,v=0,y=[];if(c){const M=Math.floor(e/6);for(let x=0;x<M;x++)y.push({x:(Math.random()-.5)*n*.8,z:(Math.random()-.5)*n*.8,radius:1.5+Math.random()*1.5})}function w(){for(v=0;u.length<e&&h<f;){if(v>=$f){requestAnimationFrame(w);return}h++;let M,x;if(c&&Math.random()<.7&&y.length>0){const T=y[Math.floor(Math.random()*y.length)],C=Math.random()*Math.PI*2,D=Math.random()*T.radius;M=T.x+Math.cos(C)*D,x=T.z+Math.sin(C)*D}else M=(Math.random()-.5)*n*.8,x=(Math.random()-.5)*n*.8;xr.set(M,20,x),Tr.set(xr,Qf);const m=Tr.intersectObject(s);if(v++,m.length===0)continue;const S=m[0].point.y;if(S<r.min||S>r.max)continue;const b=m[0].face.normal;if(_s.getNormalMatrix(s.matrixWorld),Pl.dot(b.clone().applyMatrix3(_s).normalize())<l)continue;let A=!1;for(let T=0;T<a.length&&!A;T++){const C=M-a[T].x,D=x-a[T].z;C*C+D*D<p&&(A=!0)}for(let T=0;T<u.length&&!A;T++){const C=M-u[T].x,D=x-u[T].z;C*C+D*D<p&&(A=!0)}if(!A){const T=m[0].face.normal;_s.getNormalMatrix(s.matrixWorld);const C=T.clone().applyMatrix3(_s).normalize();u.push({x:M,z:x,height:S,normal:{x:C.x,y:C.y,z:C.z}})}}d(u)}requestAnimationFrame(w)})}function th(t,e="day"){t.uniforms.uIsNightTime&&(t.uniforms.uIsNightTime.value=e==="night");const n=Date.now(),s=1200,o=300,i=1400,a=()=>{const r=Date.now()-n,l=Math.min(r/s,1),c=1-Math.pow(1-l,3);if(t.uniforms.uWinGreenIntensity.value=c*.6,r>=o){const d=Math.min((r-o)/i,1),u=1-Math.pow(1-d,3);t.uniforms.uWinGreenDetailIntensity.value=u*.55}(l<1||r<o+i)&&requestAnimationFrame(a)};requestAnimationFrame(a)}function nh(t){if(!t||!t.wetnessMap)return;const e=Date.now(),n=1800,s=200,o=()=>{const i=Date.now()-e;if(i<s){requestAnimationFrame(o);return}const a=Math.min((i-s)/n,1),r=1-Math.pow(1-a,3);t.wetnessMap.setGreenZoneWetnessIntensity(r),a<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}function ni(t){const{scene:e,modelCache:n,terrainMesh:s,modelPath:o,positions:i,baseScale:a,scaleVariation:r,staggerDelay:l,growDuration:c,verticalOffset:d=-.15,startDelay:u=0}=t;if(i.length===0){console.warn(`No positions generated for ${o}, skipping model load`);return}if(!n[o]){console.warn(`Model ${o} not preloaded yet, waiting...`),setTimeout(()=>ni(t),100);return}const f=n[o],p=t.timeOfDay==="night",h=t.timeOfDay==="dusk",v=o.includes("ivory-cane-palm"),y=p?v?3.5:6.2:1,w=new Q(1.85,1.55,1.05),M=f.map(m=>{const S=m.material.clone();return p&&S.color?S.color.multiplyScalar(y):h&&S.color&&S.color.multiply(w),S}),x=Date.now();i.forEach((m,S)=>{const b=x+u+S*l,I=a+Math.random()*r,A=Math.random()*Math.PI*2;Fl(()=>{const T=new yn;f.forEach((te,U)=>{const N=new Ce(te.geometry,M[U]);N.position.copy(te.position),N.rotation.copy(te.rotation),N.scale.copy(te.scale),N.castShadow=te.castShadow,N.receiveShadow=te.receiveShadow,T.add(N)});const C=m.height,D=m.normal?new H(m.normal.x,m.normal.y,m.normal.z):new H(0,1,0);T.rotation.y=A;const k=Math.atan2(m.z,m.x),K=Math.acos(Math.max(-1,Math.min(1,Pl.dot(D)))),J=Math.PI/9,X=Math.min(K*.6,J);T.rotation.x=Math.sin(k)*X,T.rotation.z=-Math.cos(k)*X,T.position.set(m.x,C+d,m.z),T.scale.set(0,0,0),T.visible=!1,T.userData.baseRotation={x:T.rotation.x,z:T.rotation.z},T.userData.verticalOffset=d,T.userData.targetScale=I,kt.push(T),e.add(T),Ol(T,b,c,I)})})}function oh(t){const{scene:e,modelCache:n,grassModelPath:s,grassTuftPositions:o,timeOfDay:i,baseScale:a=.228,scaleVariation:r=.188}=t,l=n[s],c=i==="night",d=i==="dusk",u=c?6.2:1,f=new Q(1.85,1.55,1.05),p=l.map(y=>{const w=y.material.clone();return c&&w.color?w.color.multiplyScalar(u):d&&w.color&&w.color.multiply(f),w}),h=Date.now(),v=800;o.forEach((y,w)=>{const M=h+w*20+500,x=a+Math.random()*r,m=Math.random()*Math.PI*2;Fl(()=>{const S=new yn;l.forEach((I,A)=>{const T=new Ce(I.geometry,p[A]);T.position.copy(I.position),T.rotation.copy(I.rotation),T.scale.copy(I.scale),T.castShadow=!1,T.receiveShadow=!1,S.add(T)});const b=y.height;S.rotation.y=m,S.position.set(y.x,b-.05,y.z),S.scale.set(0,0,0),S.visible=!1,S.userData.verticalOffset=-.05,S.userData.targetScale=x,ao.push(S),e.add(S),Ol(S,M,v,x)})})}function sh(t){z=new yl,tn=t,Ws=0,En=!1,z.initFeathers(t,0,0,0,0,-1,0),z._leftFeatherMesh.isPersistent=!0,z._rightFeatherMesh.isPersistent=!0,z._leftFeatherMesh2.isPersistent=!0,z._rightFeatherMesh2.isPersistent=!0,z.load(t).then(()=>{z.model.isPersistent=!0,z.model.position.set(0,0,0),z.model.visible=!0,z.updateSeeds(1),Wt.set(0,0,0),En=!0,z._secondaryModel&&(z._secondaryModel.isPersistent=!0);for(const{mesh:e}of z._shadowClones)e.isPersistent=!0})}function M0(t){if(Ms.length>0&&_l(Ms,t),!En||!z||!z.model)return;if(Us){eo+=t;const A=Math.min(eo/ti,1),T=z.model,C=Wt;let D=Ao.x,k=Ao.y,K=Ao.z;if(A<Co){const U=A/Co;k+=U*2.5,T.rotation.x+=(-.6*U-T.rotation.x)*Math.min(1,t*12),T.rotation.z*=Math.pow(.85,t*60)}else{const U=(A-Co)/(1-Co),N=U*U*U,fe=U*Math.PI*1.5,re=2*(1-U);D+=Math.sin(fe)*re,K+=Math.cos(fe)*re,k=Ao.y+2.5-N*Jf;const $=D-C.x,ce=K-C.z;Math.abs($)+Math.abs(ce)>2e-4&&(T.rotation.y=Math.atan2(-$,-ce)),T.rotation.x+=(Math.min(1.5,U*2.8)-T.rotation.x)*Math.min(1,t*10),T.rotation.z*=Math.pow(.9,t*60)}T.position.set(D,k,K);const J=D-C.x,X=k-C.y,te=K-C.z;C.set(D,k,K),!ei&&k<=2&&A>Co&&tn&&(ei=!0,ja(!1,D,-2.5,K,tn,Mr,Ms,0,!0),ja(!0,D,-2.5,K,tn,Mr,Ms,0,!0)),z.keepFlapping(),z.updateAnimation(t),z.updateFeathers(t,zt,Ft,0,t>0?J/t:0,t>0?X/t:0,t>0?te/t:0),z.updateSeeds(Math.max(0,1-A*1.6));return}if(Xo&&(jn+=t,!(jn<kn))){kn>0&&jn-t<kn&&Qn.copy(z.model.position);const A=Dl-kn,T=Math.min((jn-kn)/A,1),C=Math.min(T+El,1),D=C<.5?4*C*C*C:1-Math.pow(-2*C+2,3)/2,k=1-D,K=Qn,J=Oo,X=$n,te=Fo,U=k*k*k*K.x+3*k*k*D*J.x+3*k*D*D*X.x+D*D*D*te.x,N=k*k*k*K.y+3*k*k*D*J.y+3*k*D*D*X.y+D*D*D*te.y,fe=k*k*k*K.z+3*k*k*D*J.z+3*k*D*D*X.z+D*D*D*te.z,re=z.model,$=Wt,ce=U-$.x,Ee=N-$.y,Fe=fe-$.z;Math.abs(ce)+Math.abs(Fe)>2e-4&&(re.rotation.y=Ko?Math.atan2(ce,Fe):Math.atan2(-ce,-Fe));const vt=t>0?Ee/t:0,nt=Math.max(-1.2,Math.min(.9,-vt*.06));re.rotation.x+=(nt-re.rotation.x)*Math.min(1,t*5);const he=Math.min(D+.02,1),De=1-he,ke=De*De*De*K.x+3*De*De*he*J.x+3*De*he*he*X.x+he*he*he*te.x,mo=De*De*De*K.z+3*De*De*he*J.z+3*De*he*he*X.z+he*he*he*te.z,Ke=ce*(mo-fe)-Fe*(ke-U),go=Math.max(-.25,Math.min(.25,Ke*.4));re.rotation.z+=(go-re.rotation.z)*Math.min(1,t*3),re.position.set(U,N,fe),$.set(U,N,fe);const It=t>0?ce/t:0,rn=t>0?Ee/t:0,vo=t>0?Fe/t:0;z.keepFlapping(),z.updateAnimation(t),z.updateFeathers(t,zt,Ft,0,It,rn,vo),z.updateSeeds(1);return}Ws+=t;const e=Ws,n=e*qf,s=Math.min(e/jf,1),o=s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2,i=o*Kf,a=Math.min(e/_r,1),r=1-(1-a)*(1-a),l=Math.max(0,Math.min(1,(e-_r)/1)),c=r*Xf+Math.sin(e*.38)*4.5*l,d=Math.sin(n)*i,u=Math.cos(n)*i,f=z.model,p=Wt,h=d-p.x,v=u-p.z,y=c-p.y;Math.abs(h)+Math.abs(v)>2e-4&&(f.rotation.y=Math.atan2(-h,-v));const w=t>0?y/t:0,M=.9*(1-a)+.3*a,x=Math.max(-M,Math.min(M,w*.06));f.rotation.x+=(x-f.rotation.x)*Math.min(1,t*5);const m=-.38*o;f.rotation.z+=(m-f.rotation.z)*Math.min(1,t*3),f.position.set(d,c,u),p.set(d,c,u);const S=t>0?h/t:0,b=t>0?y/t:0,I=t>0?v/t:0;z.keepFlapping(),z.updateAnimation(t),z.updateFeathers(t,zt,Ft,0,S,b,I),z.updateSeeds(1)}function _0(){!z||!z.model||(Us=!0,eo=0,Ao.copy(z.model.position))}function x0(t){if(!z||!z.model)return;const e=t.x,n=t.y,s=t.z;z.model.position.x+=e,z.model.position.y+=n,z.model.position.z+=s,Wt.x+=e,Wt.y+=n,Wt.z+=s,Qn.x+=e,Qn.y+=n,Qn.z+=s,Oo.x+=e,Oo.y+=n,Oo.z+=s,$n.x+=e,$n.y+=n,$n.z+=s,Fo.x+=e,Fo.y+=n,Fo.z+=s;for(const o of[z._chainL,z._chainR,z._chainL2,z._chainR2])if(o)for(const i of o)i.x+=e,i.y+=n,i.z+=s}function ah(t=!1){if(!(!t&&Xo)){if(t&&Us&&eo<ti){const e=(ti-eo)*1e3+150;setTimeout(()=>ah(!0),e);return}z&&tn&&z.dispose(tn),z=null,tn=null,Ws=0,En=!1,Xo=!1,jn=0,Ko=!1,Us=!1,eo=0,ei=!1}}function T0({nextIslandOffset:t,flightAngle:e,duration:n,p3y:s=12,p3zOffset:o=0,ringMinigame:i=!1}){if(!z||!En){console.warn("[WinBird] startWinBirdTransition called before bird loaded — transition skipped");return}Xo=!0,jn=0,Ko=!1,Dl=n/1e3*(i?1.12:1),kn=i?0:bl,El=i?0:Il;const a=t.length(),r=Math.cos(e),l=Math.sin(e),c=a*.28;i&&z&&z.model&&(Qn.copy(z.model.position),z.snapChainTrail(-r,-l)),Oo.set(r*c,Zf,l*c),i?$n.set(t.x,35,t.z+o+80):$n.set(t.x-r*40,70,t.z-l*40),Fo.set(t.x,s,t.z+o)}function S0(){if(Ko=!Ko,!z||!z.model)return;z.model.rotation.y+=Math.PI;const t=z.model.position.x-Wt.x,e=z.model.position.z-Wt.z,n=Math.sqrt(t*t+e*e);n>1e-4&&z.snapChainTrail(-t/n,-e/n)}function C0(t){return!z||!z.model?!1:(t.copy(z.model.position),!0)}function R0(){if(!z||!En)return null;const t=z;return z=null,tn=null,En=!1,Xo=!1,t}function A0(t){const{scene:e,terrainMaterial:n,terrainMesh:s,terrainSize:o,modelCache:i,timeOfDay:a="day",terrain:r,heightSampler:l=null,waterSystem:c=null}=t;a==="night"?Xl():ql(),th(n,a),nh(r);const d=[{modelPath:"./models/win-state/palm_tree.glb",count:32,minSpacing:.612,baseScale:.224,scaleVariation:.001249,staggerDelay:60,growDuration:600,verticalOffset:-.15,startDelay:0},{modelPath:"./models/win-state/ivory-cane-palm.glb",count:18,minSpacing:.37,baseScale:.054689,scaleVariation:.04377,staggerDelay:50,growDuration:700,verticalOffset:-.0812,startDelay:150},{modelPath:"./models/win-state/olive-palm.glb",count:6,minSpacing:.64,baseScale:.18,scaleVariation:.077,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200},{modelPath:"./models/win-state/lady-palm.glb",count:8,minSpacing:.6,baseScale:.048,scaleVariation:.042,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200},{modelPath:"./models/win-state/bismarck-palm.glb",count:7,minSpacing:.21,baseScale:.078,scaleVariation:.062,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200},{modelPath:"./models/win-state/banana-tree.glb",count:5,minSpacing:.21,baseScale:.0556,scaleVariation:.0482,staggerDelay:50,growDuration:700,verticalOffset:-.12,startDelay:200}],u=[];async function f(){const h=d[0],v=await Da({numPositions:h.count,terrainSize:o,terrainMesh:s,heightSampler:l,minSpacing:h.minSpacing,existingPositions:u});u.push(...v),ni({scene:e,modelCache:i,terrainMesh:s,modelPath:h.modelPath,positions:v,baseScale:h.baseScale,scaleVariation:h.scaleVariation,staggerDelay:h.staggerDelay,growDuration:h.growDuration,verticalOffset:h.verticalOffset,startDelay:h.startDelay,timeOfDay:a}),await Promise.all(d.slice(1).map(async y=>{const w=await Da({numPositions:y.count,terrainSize:o,terrainMesh:s,heightSampler:l,minSpacing:y.minSpacing,existingPositions:u});u.push(...w),ni({scene:e,modelCache:i,terrainMesh:s,modelPath:y.modelPath,positions:w,baseScale:y.baseScale,scaleVariation:y.scaleVariation,staggerDelay:y.staggerDelay,growDuration:y.growDuration,verticalOffset:y.verticalOffset,startDelay:y.startDelay,timeOfDay:a})}))}f();async function p(){const h=[{path:"./models/win-state/tall-grass.glb",count:10},{path:"./models/win-state/grass.glb",count:10},{path:"./models/win-state/fern.glb",count:10,baseScale:.0022,scaleVariation:.0032}];for(const v of h){if(!i[v.path]){console.warn(`Grass model ${v.path} not preloaded yet, skipping`);continue}const y=await Da({numPositions:v.count,terrainSize:o,terrainMesh:s,heightSampler:l,minSpacing:.09,useClusterMode:!0});oh({scene:e,modelCache:i,grassModelPath:v.path,grassTuftPositions:y,timeOfDay:a,...v.baseScale!==void 0&&{baseScale:v.baseScale},...v.scaleVariation!==void 0&&{scaleVariation:v.scaleVariation}})}}setTimeout(p,100),setTimeout(()=>{lh(e,a)},800),c&&setTimeout(()=>{n.uniforms.uUseWetnessMap.value=!0,c.activate()},3500),setTimeout(()=>sh(e),3200)}const Sr=new di,ih=new H(0,-1,0),Cr=new H;let ba=0;const rh=5;function Rr(t,e,n=2,s=!1,o=null){if(kt.length===0&&ao.length===0||!t||!e||!s&&(ba++,ba<rh))return;if(ba=0,!e.isObject3D&&!e.isMesh){console.warn("Invalid terrainMesh passed to updateTreePositions");return}const i=.3,a=2.2,r=.4,l=2.6,c=i-r,d=l-a,u=n*n,f=p=>{if(p.userData.targetScale===void 0)return;const h=p.position.x-t.x,v=p.position.z-t.z;if(h*h+v*v>u)return;let w;if(o)w=o(p.position.x,p.position.z);else{Cr.set(p.position.x,20,p.position.z),Sr.set(Cr,ih);const m=Sr.intersectObject(e,!1);if(m.length===0)return;w=m[0].point.y}p.userData.verticalOffset===void 0&&(p.userData.verticalOffset=p.position.y-w),p.position.y=w+p.userData.verticalOffset;let M=1;w<i?w<=r?M=0:M=(w-r)/c:w>a&&(w>=l?M=0:M=(l-w)/d);const x=p.userData.targetScale*M;p.scale.set(x,x,x)};kt.forEach(f),ao.forEach(f)}function D0(t,e=null,n=0){if(kt.length===0||(Aa++,Aa<5))return;Aa=0;const s=Math.sin(t*.9)*.035;for(let o=0;o<kt.length;o++){const i=kt[o];if(i.scale.x===0)continue;if(e){const r=i.position.x-e.x,l=i.position.z-e.z;if(r*r+l*l<n)continue}const{baseRotation:a}=i.userData;i.rotation.x=a.x+s,i.rotation.z=a.z+s*.7}}function lh(t,e="day"){const n=Kd(),s=e==="night",o=e==="dusk",i=s?4.25:1,a=new Q(1.7,1.45,1.1),r=Math.random()<.6?1:0,l=Math.floor(Math.random()*3),c=Math.floor(Math.random()*4);function d(f){const p=n[f];if(!p)return console.warn(`Seagull model ${f} not preloaded yet, skipping`),null;const h=rl(p.scene);return h.traverse(v=>{v.isMesh&&(v.castShadow=!1,v.receiveShadow=!1,(s||o)&&v.material&&(v.material=v.material.clone(),v.material._ownedByInstance=!0,v.material.color&&(s?v.material.color.multiplyScalar(i):v.material.color.multiply(a))))}),{clone:h,animations:p.animations}}function u(f,p,h){if(!p||p.length===0)return;const v=new bo(f);p.forEach(y=>{const w=v.clipAction(y);w.timeScale=h,w.play()}),f.userData.mixer=v}if(r>0){const f=d("./models/creatures/seagulls-flock.glb");if(f){const{clone:p,animations:h}=f;p.position.set(0,6.28,0),p.scale.set(.0162,.0162,.0162),t.add(p),u(p,h,.5),p.userData.type="flock",p.userData.bobTime=Math.random()*Math.PI*2,p.userData.bobSpeed=.3,p.userData.bobAmount=1.8,p.userData.baseHeight=p.position.y,An.push(p)}}for(let f=0;f<l;f++){const p=d("./models/creatures/seagulls-spiral.glb");if(p){const{clone:h,animations:v}=p;h.position.set((Math.random()-.5)*8,5+Math.random()*3,(Math.random()-.5)*8),h.scale.set(.14,.14,.14),t.add(h),u(h,v,.55+Math.random()*.2),h.userData.type="spiral",h.userData.bobTime=Math.random()*Math.PI*2,h.userData.bobSpeed=.25,h.userData.bobAmount=1.2,h.userData.baseHeight=h.position.y,An.push(h)}}for(let f=0;f<c;f++){const p=d("./models/creatures/seagull-1.glb");if(p){const{clone:h,animations:v}=p;if(h.position.set((Math.random()-.5)*12,4.2+Math.random()*4.2,(Math.random()-.5)*12),h.scale.set(.028,.028,.028),t.add(h),v&&v.length>0){const y=new bo(h);v.forEach(w=>{const M=y.clipAction(w);M.timeScale=.6+Math.random()*.3,M.play(),M.time=Math.random()*w.duration}),h.userData.mixer=y}h.userData.type="single",h.userData.bobTime=Math.random()*Math.PI*2,h.userData.bobSpeed=.35+Math.random()*.1,h.userData.bobAmount=.8,h.userData.baseHeight=h.position.y,An.push(h)}}}function b0(t){wr++;const e=(wr&1)===0;for(let n=0;n<An.length;n++){const s=An[n],o=s.userData;o.mixer&&e&&o.mixer.update(t*2),o.bobTime+=t*o.bobSpeed,s.position.y=o.baseHeight+Math.sin(o.bobTime)*o.bobAmount}}function I0(){An.forEach(t=>{t.userData.mixer&&(t.userData.mixer.stopAllAction(),t.userData.mixer.uncacheRoot(t),t.userData.mixer=null),t.parent&&t.parent.remove(t),t.traverse(e=>{e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>{s._ownedByInstance&&ch(s)})})}),An.length=0}function E0(t){t&&t.uniforms.uWinGreenIntensity&&(t.uniforms.uWinGreenIntensity.value=0),t&&t.uniforms.uWinGreenDetailIntensity&&(t.uniforms.uWinGreenDetailIntensity.value=0),t&&t.uniforms.uIsNightTime&&(t.uniforms.uIsNightTime.value=!1)}function P0(t){t&&t.wetnessMap&&t.wetnessMap.setGreenZoneWetnessIntensity&&t.wetnessMap.setGreenZoneWetnessIntensity(0)}function ch(t){for(const e of Object.values(t))e&&e.isTexture&&e.dispose();t.dispose()}function L0(){kt.forEach(t=>{t.parent&&t.parent.remove(t),t.traverse(e=>{e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>s.dispose())})}),kt.length=0,ao.forEach(t=>{t.parent&&t.parent.remove(t),t.traverse(e=>{e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>s.dispose())})}),ao.length=0,No.length=0,Bs=!1,fn.length=0,qo=!1}function O0(){return kt}function F0(){return ao}const Ia=new H,Ae=new H,$e=new H,Vs=new H;function Oi(t){let e=null,n=1/0;for(let s=0;s<Rt.length;s++){const o=Rt[s];if(!o.active||o.isEvaporating)continue;if(t.closestPointToPoint(o.position,Ia),Ia.distanceTo(o.position)<=o.radius*1.5){const a=Ia.distanceTo(t.origin);a<n&&(n=a,e=o)}}return e}const Ye=new di;Ye.far=5e3;const et=new ue;let Ie=!1,Fi=!1,Ni=!1,io=0,oi=0,si=0;const uh=100;let ie=null,ee=null,hn=0,pn=null,mn=null,Zo=.88,nn=0,Ar=0;const dh=150;let Dr=0;const fh=50;let br=0;const hh=16;let ro={x:0,y:0},ea=0,Ds=0,Gt=null;const Hl=10,ph=300;let Wn=0,Lt=!1,bs=0,Ys=!1;const ai=1.5,Gl=1,mh=1.5,gh=1.5,vh=ai+Gl-gh;let Un=0,gn=0,Bn=0,js=!1,Is=!1;const Ir=1.5,xs=1,Er=1.5,yh=1.5,Ea=3.25,wh=-.85,Pa=4.75,Mh=-1.45;let Ho=null,ts=null,Bt=null,lo=!1,Re=null,Pn=null,co=null,Kn=null,on=null,uo=null,fo=null;function xe(){return Fi||Ni||io>=2}function ii(t){const e=$r*1.1,n=new yn;n.rotation.x=-Math.PI/2,n.renderOrder=3;const s=new fa,o=e,i=e*.5;s.moveTo(o,0);for(let u=1;u<=46;u++){const f=u/46*Math.PI*2;s.lineTo(Math.cos(f)*o,Math.sin(f)*o)}const a=new eu;a.moveTo(i,0);for(let u=1;u<=46;u++){const f=u/46*Math.PI*2;a.lineTo(Math.cos(f)*i,Math.sin(f)*i)}s.holes.push(a);const r={depth:.032,bevelEnabled:!0,bevelThickness:.005,bevelSize:.003,bevelSegments:2},l=new ha(s,r),c=new zo({color:t?16720418:2237183,transparent:!0,opacity:t?.28:.55,roughness:.62,metalness:.31,emissive:t?16720384:8959,emissiveIntensity:1.62,side:ze,depthWrite:!1}),d=new Ce(l,c);if(d.position.z=-.015,d.userData.isBaseRing=!0,d.userData.isLowerMode=t,n.add(d),t)for(let f=0;f<8;f++){const p=f/8*Math.PI*2,h=(f+1)/8*Math.PI*2,v=new fa,y=e*.62,w=e*.98,M=20;for(let I=0;I<=M;I++){const A=I/M,T=p+A*(h-p),C=Zt.lerp(w,y,A*.7),D=Math.cos(T)*C,k=Math.sin(T)*C;I===0?v.moveTo(D,k):v.lineTo(D,k)}for(let I=M;I>=0;I--){const A=I/M,T=p+A*(h-p),C=Zt.lerp(w,y,A*.7)*.7,D=Math.cos(T)*C,k=Math.sin(T)*C;v.lineTo(D,k)}const x={depth:.03,bevelEnabled:!1},m=new ha(v,x),S=new dt({color:16724787,transparent:!0,opacity:.5-f/8*.2,side:ze,depthWrite:!1}),b=new Ce(m,S);b.position.z=-.015,b.userData.rotationSpeed=-.05-f*.01,b.userData.baseOpacity=.5-f/8*.2,n.add(b)}else{for(let y=0;y<4;y++){const w=e*1,M=.3,x=y*.36,m=new tu(M*.84,M,64),S=document.createElement("canvas");S.width=256,S.height=256;const b=S.getContext("2d"),I=b.createRadialGradient(128,128,128*.84,128,128,128);I.addColorStop(0,"rgba(34, 34, 170, 1.0)"),I.addColorStop(1,"rgba(34, 34, 170, 0.0)"),b.fillStyle=I,b.fillRect(0,0,256,256);const A=new Qo(S),T=new dt({map:A,transparent:!0,opacity:0,side:ze,depthWrite:!1}),C=new Ce(m,T);C.userData.animationOffset=x,C.userData.startRadius=w,C.userData.ringRadius=M,C.userData.isConvergingRing=!0,n.add(C);for(let D=0;D<8;D++){const k=D/8*Math.PI*2,K=.895,J=new fa;J.moveTo(0,-K/2),J.lineTo(-K*.6,0),J.lineTo(0,K/2),J.lineTo(-K*.3,0),J.lineTo(0,-K/2);const X={depth:.03,bevelEnabled:!1},te=new ha(J,X),U=new dt({color:1710832,transparent:!0,opacity:0,side:ze,depthWrite:!1}),N=new Ce(te,U);N.position.x=Math.cos(k)*w,N.position.y=Math.sin(k)*w,N.position.z=-.012,N.rotation.z=k,N.userData.angle=k,N.userData.startRadius=w,N.userData.animationOffset=x,N.userData.isConvergingChevron=!0,n.add(N)}}const p=new Go(e*1.82,e*1.82),h=new je({transparent:!0,depthWrite:!1,blending:wn,side:ze,uniforms:{color:{value:new Q(65484)},opacity:{value:0}},vertexShader:`
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
      `}),v=new Ce(p,h);v.position.z=-.02,v.userData.isTurboGlow=!0,v.visible=!1,n.add(v)}return n}function ta(t){const e=t?mn:pn;return e?(ee=e,ee.visible=!0,hn=0,ee):null}function Jo(){ee&&(ee.visible=!1,ee=null)}function ns(t){if(!ee)return;const e=ee.position,n=e.x,s=e.y,o=e.z;ee.visible=!1;const i=t?mn:pn;i&&(ee=i,ee.position.set(n,s,o),ee.visible=!0)}function _h(t,e=0,n=!1,s=0,o=0){if(!ee)return;hn+=t;const i=n?1.8:1,a=1.5/i,r=6711039,l=54442,c=65484,d=16746496,u=16763904,f=ee.children;for(let p=0;p<f.length;p++){const h=f[p];if(h.userData.isBaseRing){if(h.userData.isLowerMode)continue;n?(h.material.color.setHex(5592575),h.material.emissive.setHex(8772),h.material.emissiveIntensity=.4,h.material.opacity=.4):e>0?(h.material.emissiveIntensity=.2+e*.2,h.material.opacity=.3+e*.1):(h.material.color.setHex(4474111),h.material.emissive.setHex(68),h.material.emissiveIntensity=.2,h.material.opacity=.3);continue}if(h.userData.isTurboGlow){if(h.visible=n||e>0,h.material.uniforms)if(n){const v=.25+Math.sin(hn*6)*.1;h.material.uniforms.opacity.value=v}else e>0?h.material.uniforms.opacity.value=e*.15:h.material.uniforms.opacity.value=0;continue}if(h.userData.rotationSpeed!==void 0)if(h.rotation.z+=h.userData.rotationSpeed*t*60,s===2){const v=.85+Math.sin(hn*8)*.15;h.material.color.setHex(u),h.material.opacity=h.userData.baseOpacity*v*1.3}else if(s===1)h.material.color.setHex(d),h.material.opacity=h.userData.baseOpacity*1.2;else if(o>0){const y=.2+o*.33,w=.2*(1-o);h.material.color.setRGB(1,y,w),h.material.opacity=h.userData.baseOpacity*(1+o*.2)}else h.material.color.setHex(16724787),h.material.opacity=h.userData.baseOpacity;if(h.userData.isConvergingRing===!0){const v=h.userData.animationOffset/i,w=(hn*i-v)%a;if(w<0){h.material.opacity=0;continue}const M=.6,x=Math.min(w/a,1),m=x*M,S=h.userData.startRadius,b=h.userData.ringRadius,A=S*(1-m)/b;h.scale.set(A,A,1);let T;x<.15?T=x/.15:x>.5?T=(1-x)/.5:T=1,h.material.opacity=T*.4}if(h.userData.isConvergingChevron===!0){const v=h.userData.animationOffset,y=v/i,M=(hn*i-y)%a,m=(Math.round(v/.36)+1)/4,S=e>=m||n;if(M<0){h.material.opacity=0,h.visible=!1;continue}h.visible=!0;const b=.64,I=Math.min(M/a,1),A=I*b,C=h.userData.startRadius*(1-A),D=h.userData.angle;h.position.x=Math.cos(D)*C,h.position.y=Math.sin(D)*C;const k=1-A*.45;h.scale.set(k,k,1);let K;I<.15?K=I/.15:I>.5?K=(1-I)/.5:K=1,n?(h.material.color.setHex(c),h.material.opacity=K*.8):S?(h.material.color.setHex(l),h.material.opacity=K*.7):(h.material.color.setHex(r),h.material.opacity=K*.4)}}}function zl(t){if(!t)return!1;let e=t;for(;e&&e!==document.body;){const n=e.tagName?.toLowerCase();if(n==="button"||n==="input"||n==="select"||n==="textarea"||n==="a"||e.onclick||e.getAttribute("role")==="button"||e.classList?.contains("ui-element")||e.classList?.contains("modal")||Array.from(e.classList||[]).some(o=>o.includes("modal")))return!0;const s=e.id;if(s&&(s.includes("btn")||s.includes("button")||s.includes("modal")||s.includes("overlay")||s.includes("menu")||s.includes("ui")))return!0;e=e.parentElement}return!1}function xh(t){if(zl(t.target))return;t.button===2&&(Ni=!0),ro={x:t.clientX,y:t.clientY},ea=Date.now(),et.x=t.clientX/window.innerWidth*2-1,et.y=-(t.clientY/window.innerHeight)*2+1,Ye.setFromCamera(et,ts);const e=Oi(Ye.ray);if(e&&e.radius>=.15&&uo&&fo){Vs.copy(e.position);const s=e.radius;sl(e,Ho,uo,fo)&&(Nr(),zr(),hl(Vs,s)),document.body.style.cursor="pointer",t.preventDefault();return}const n=Ye.intersectObject(Re);if(n.length>0){const s=n[0].point;if(s.y<Pn-Zo)return;Ae.copy(s),$e.copy(Ae),Re.worldToLocal($e),ie={world:Ae,local:$e},Ie=!0,Bt.enabled=!1,document.body.style.cursor=xe()?"s-resize":"n-resize",ee||ta(xe()),ee&&(ee.position.copy(Ae),ee.position.y+=.05),Hr()}}function Th(t){t.button===2&&(Ni=!1);const e={x:t.clientX,y:t.clientY},n=Math.sqrt(Math.pow(e.x-ro.x,2)+Math.pow(e.y-ro.y,2)),s=Date.now()-ea;if(n<Hl&&s<500&&ie){const o=xe()?-.8:.8;co(ie.local,o),on(),nn++;const i=ie.world,a=.5,r=Jn(Re,i);Os(i,xe(),a,r),La()}Ie=!1,ie=null,document.body.style.cursor="default",lo||(Bt.enabled=!0),Es(),Jo()}function Sh(t){if(et.x=t.clientX/window.innerWidth*2-1,et.y=-(t.clientY/window.innerHeight)*2+1,Ye.setFromCamera(et,ts),Ie){const s=performance.now();if(s-br<hh)return;br=s;const o=Ye.intersectObject(Re);if(o.length>0){if(Ae.copy(o[0].point),Ae.y<Pn-Zo){ie=null,ee&&(ee.visible=!1);return}$e.copy(Ae),Re.worldToLocal($e),ie={world:Ae,local:$e},ee?ee.visible=!0:ta(xe()),ee&&(ee.position.copy(Ae),ee.position.y+=.05)}return}const e=performance.now();if(e-Dr<fh)return;Dr=e;const n=Oi(Ye.ray);if(n)document.body.style.cursor=n.radius>=.15?"pointer":"default";else{const s=Ye.intersectObject(Re);if(s.length>0){const o=s[0].point;document.body.style.cursor=o.y>=Pn-Zo?xe()?"s-resize":"n-resize":"default"}else document.body.style.cursor="default"}}function Ch(t){if(t.key==="Shift"){const e=xe();Fi=!0,document.body.style.cursor="s-resize",!e&&ee&&Ie&&ns(!0)}}function Rh(t){if(t.key==="Shift"){const e=xe();Fi=!1,document.body.style.cursor=Ie?"n-resize":"default",e&&ee&&Ie&&ns(!1)}}function Ah(t){if(zl(t.target))return;const e=xe();io=t.touches.length;const n=xe();e!==n&&ee&&Ie&&ns(n);const s=t.changedTouches[0];ro={x:s.clientX,y:s.clientY},ea=Date.now(),et.x=s.clientX/window.innerWidth*2-1,et.y=-(s.clientY/window.innerHeight)*2+1,Ye.setFromCamera(et,ts);const o=Oi(Ye.ray);if(o&&o.radius>=.15&&uo&&fo){Vs.copy(o.position);const a=o.radius;sl(o,Ho,uo,fo)&&(Nr(),zr(),hl(Vs,a)),document.body.style.cursor="pointer",t.preventDefault();return}const i=Ye.intersectObject(Re);if(i.length>0){const a=i[0].point;if(a.y<Pn-Zo)return;Ae.copy(a),$e.copy(Ae),Re.worldToLocal($e),ie={world:Ae,local:$e},Ie=!0,Bt.enabled=!1,Gt=s.identifier,document.body.style.cursor=xe()?"s-resize":"n-resize",ee||ta(xe()),ee&&(ee.position.copy(Ae),ee.position.y+=.05),Hr(),t.preventDefault()}}function Dh(t){const e=xe();io=t.touches.length;const n=xe();e!==n&&ee&&Ie&&ns(n);let s=null;if(Gt!==null){for(let o=0;o<t.touches.length;o++)if(t.touches[o].identifier===Gt){s=t.touches[o];break}}if(s||(s=t.touches[0]),et.x=s.clientX/window.innerWidth*2-1,et.y=-(s.clientY/window.innerHeight)*2+1,Ie){Ye.setFromCamera(et,ts);const o=Ye.intersectObject(Re);if(o.length>0){if(Ae.copy(o[0].point),Ae.y<Pn-Zo){ie=null,ee&&(ee.visible=!1);return}$e.copy(Ae),Re.worldToLocal($e),ie={world:Ae,local:$e},ee?ee.visible=!0:ta(xe()),ee&&(ee.position.copy(Ae),ee.position.y+=.05)}t.preventDefault()}}function bh(t){const e=t.changedTouches[0],n={x:e.clientX,y:e.clientY},s=Math.sqrt(Math.pow(n.x-ro.x,2)+Math.pow(n.y-ro.y,2)),o=Date.now()-ea;if(s<Hl&&o<500&&ie){const c=Date.now()-Ds<ph;if(c||xe()){co(ie.local,-.8),on(),nn++,Ds=c?0:Date.now();const f=ie.world,p=.5,h=Jn(Re,f);Os(f,!0,p,h),La()}else{co(ie.local,.8),on(),nn++,Ds=Date.now();const f=ie.world,p=.5,h=Jn(Re,f);Os(f,!1,p,h),La()}}const i=xe();io=t.touches.length;const a=xe(),r=e.identifier;i!==a&&ee&&Ie&&r!==Gt&&ns(a),r===Gt&&(Gt=null,Ie=!1,ie=null,lo||(Bt.enabled=!0),document.body.style.cursor="default",Es(),Jo()),io===0&&(Gt=null,Ie=!1,ie=null,lo||(Bt.enabled=!0),document.body.style.cursor="default",Es(),Jo())}function Ih(){io=0,Gt=null,Ie=!1,ie=null,lo||(Bt.enabled=!0),Ds=0,document.body.style.cursor="default",Es(),Jo()}function Eh(t){t.preventDefault()}function N0(t){Ho=t.scene,ts=t.camera,Bt=t.controls,Re=t.terrainMesh,Pn=t.waterLevel,co=t.sculptTerrain,Kn=t.stampTerrain,on=t.updateTrimesh,uo=t.world,fo=t.physicsConfig,pn||(pn=ii(!1),pn.visible=!1,pn.isPersistent=!0,Ho.add(pn)),mn||(mn=ii(!0),mn.visible=!1,mn.isPersistent=!0,Ho.add(mn)),window.addEventListener("mousedown",xh),window.addEventListener("mouseup",Th),window.addEventListener("mousemove",Sh),window.addEventListener("contextmenu",Eh),window.addEventListener("keydown",Ch),window.addEventListener("keyup",Rh),window.addEventListener("touchstart",Ah,{passive:!1}),window.addEventListener("touchmove",Dh,{passive:!1}),window.addEventListener("touchend",bh),window.addEventListener("touchcancel",Ih)}function H0(t=.016){if(_h(t,bs,Lt,gn,Bn),Ie&&ie){const e=Date.now(),n=xe();if(n){if(ri(),Un+=t,!js&&Un>=yh&&(js=!0,Lr()),Un>=Ir){const s=Un-Ir,o=xs,i=xs+Er;if(s>=i&&gn<2){if(gn=2,Bn=1,Kn&&ie){Kn(ie.local,Pa,Mh),Ql(),rc(),on(),nn++;const a=ie.world,r=Jn(Re,a);rr(a,Pa,2,r),Rr(a,Re,Pa,!0)}}else if(s>=o&&!Is){if(gn=1,Bn=0,Is=!0,Kn&&ie){Kn(ie.local,Ea,wh),$l(),lc(),on(),nn++;const a=ie.world,r=Jn(Re,a);rr(a,Ea,1,r),Rr(a,Re,Ea,!0)}}else s<o?Bn=s/xs:s<i&&Is&&(Bn=(s-xs)/Er)}}else if(li(),Wn+=t,!Ys&&Wn>=vh&&(Ys=!0,Fr()),!Lt&&Wn>=ai){const s=Wn-ai;bs=Math.min(1,s/Gl),bs>=1&&!Lt&&(Lt=!0,Or(),ic())}if(e-oi>16){const i=(n?-6.88:6.98)*(!n&&Lt?mh:1);co(ie.local,i),nn++;const a=ie.world,r=Lt?1.5:1,l=Jn(Re,a);if(Os(a,n,r,l),e-Ar>dh&&(cc(),Ar=e),oi=e,e-si>uh)return on(),si=e,!0}}else(Wn>0||Lt)&&ri(),(Un>0||gn>0)&&li();return!1}function ri(){Ys&&!Lt&&Zl(),Wn=0,Lt=!1,bs=0,Ys=!1}function li(){js&&gn===0&&Jl(),Un=0,gn=0,Bn=0,js=!1,Is=!1}function G0(t){t.terrainMesh!==void 0&&(Re=t.terrainMesh),t.waterLevel!==void 0&&(Pn=t.waterLevel),t.sculptTerrain!==void 0&&(co=t.sculptTerrain),t.stampTerrain!==void 0&&(Kn=t.stampTerrain),t.updateTrimesh!==void 0&&(on=t.updateTrimesh),t.world!==void 0&&(uo=t.world),t.physicsConfig!==void 0&&(fo=t.physicsConfig),t.minigameActive!==void 0&&(lo=t.minigameActive,Bt&&(Bt.enabled=!lo))}function z0(){Jo(),Ie=!1,ie=null,oi=0,si=0,nn=0,Gt=null,hn=0,ri(),li()}function k0(){return{isMouseDown:Ie,currentIntersectionPoint:ie,isLowerMode:xe()}}function W0(){return nn}export{z0 as $,p0 as A,Jh as B,e0 as C,G0 as D,Rr as E,Yh as F,cl as G,qh as H,i0 as I,r0 as J,Kh as K,l0 as L,c0 as M,d0 as N,u0 as O,M0 as P,m0 as Q,O0 as R,$r as S,F0 as T,Zh as U,y0 as V,Qh as W,Ts as X,Uh as Y,f0 as Z,g0 as _,ed as a,W0 as a0,h0 as a1,Vf as a2,w0 as a3,k0 as a4,Ra as a5,v0 as a6,L0 as a7,I0 as a8,E0 as a9,Lf as aA,wl as aB,yl as aC,Vn as aD,Of as aE,_l as aF,Df as aG,Ml as aH,Ef as aI,ii as aJ,Af as aK,xf as aL,zt as aM,Ft as aN,cr as aO,ja as aP,gr as aQ,Cf as aR,Bo as aS,Vo as aT,Rf as aU,al as aV,Pf as aW,pa as aX,P0 as aa,jh as ab,Wh as ac,ah as ad,Xh as ae,Yf as af,Rn as ag,vr as ah,T0 as ai,C0 as aj,H0 as ak,A0 as al,D0 as am,b0 as an,$h as ao,o0 as ap,t0 as aq,$s as ar,S0 as as,x0 as at,_0 as au,R0 as av,n0 as aw,fd as ax,Kd as ay,Vh as az,td as b,Qu as c,rl as d,Li as e,qs as f,lt as g,Ga as h,g as i,rd as j,Hh as k,st as l,Rt as m,Dt as n,el as o,_t as p,Gh as q,Bh as r,Ot as s,hl as t,$u as u,N0 as v,zh as w,kh as x,s0 as y,a0 as z};
