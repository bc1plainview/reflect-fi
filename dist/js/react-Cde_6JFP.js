function _e(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var z={exports:{}},j={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var re;function Te(){if(re)return j;re=1;var r=Symbol.for("react.transitional.element"),f=Symbol.for("react.fragment");function l(T,h,d){var w=null;if(d!==void 0&&(w=""+d),h.key!==void 0&&(w=""+h.key),"key"in h){d={};for(var C in h)C!=="key"&&(d[C]=h[C])}else d=h;return h=d.ref,{$$typeof:r,type:T,key:w,ref:h!==void 0?h:null,props:d}}return j.Fragment=f,j.jsx=l,j.jsxs=l,j}var ne;function ke(){return ne||(ne=1,z.exports=Te()),z.exports}var He=ke(),D={exports:{}};function Re(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var se={exports:{}},p=se.exports={},E,_;function J(){throw new Error("setTimeout has not been defined")}function Q(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?E=setTimeout:E=J}catch{E=J}try{typeof clearTimeout=="function"?_=clearTimeout:_=Q}catch{_=Q}})();function ie(r){if(E===setTimeout)return setTimeout(r,0);if((E===J||!E)&&setTimeout)return E=setTimeout,setTimeout(r,0);try{return E(r,0)}catch{try{return E.call(null,r,0)}catch{return E.call(this,r,0)}}}function we(r){if(_===clearTimeout)return clearTimeout(r);if((_===Q||!_)&&clearTimeout)return _=clearTimeout,clearTimeout(r);try{return _(r)}catch{try{return _.call(null,r)}catch{return _.call(this,r)}}}var k=[],M=!1,g,P=-1;function Ce(){!M||!g||(M=!1,g.length?k=g.concat(k):P=-1,k.length&&ce())}function ce(){if(!M){var r=ie(Ce);M=!0;for(var f=k.length;f;){for(g=k,k=[];++P<f;)g&&g[P].run();P=-1,f=k.length}g=null,M=!1,we(r)}}p.nextTick=function(r){var f=new Array(arguments.length-1);if(arguments.length>1)for(var l=1;l<arguments.length;l++)f[l-1]=arguments[l];k.push(new ae(r,f)),k.length===1&&!M&&ie(ce)};function ae(r,f){this.fun=r,this.array=f}ae.prototype.run=function(){this.fun.apply(null,this.array)};p.title="browser";p.browser=!0;p.env={};p.argv=[];p.version="";p.versions={};function R(){}p.on=R;p.addListener=R;p.once=R;p.off=R;p.removeListener=R;p.removeAllListeners=R;p.emit=R;p.prependListener=R;p.prependOnceListener=R;p.listeners=function(r){return[]};p.binding=function(r){throw new Error("process.binding is not supported")};p.cwd=function(){return"/"};p.chdir=function(r){throw new Error("process.chdir is not supported")};p.umask=function(){return 0};var ge=se.exports;const W=Re(ge);var n={},oe;function xe(){if(oe)return n;oe=1;var r=Symbol.for("react.transitional.element"),f=Symbol.for("react.portal"),l=Symbol.for("react.fragment"),T=Symbol.for("react.strict_mode"),h=Symbol.for("react.profiler"),d=Symbol.for("react.consumer"),w=Symbol.for("react.context"),C=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),L=Symbol.for("react.memo"),H=Symbol.for("react.lazy"),pe=Symbol.for("react.activity"),Z=Symbol.iterator;function le(e){return e===null||typeof e!="object"?null:(e=Z&&e[Z]||e["@@iterator"],typeof e=="function"?e:null)}var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},G=Object.assign,X={};function x(e,t,u){this.props=e,this.context=t,this.refs=X,this.updater=u||B}x.prototype.isReactComponent={},x.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},x.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function F(){}F.prototype=x.prototype;function $(e,t,u){this.props=e,this.context=t,this.refs=X,this.updater=u||B}var b=$.prototype=new F;b.constructor=$,G(b,x.prototype),b.isPureReactComponent=!0;var V=Array.isArray;function N(){}var c={H:null,A:null,T:null,S:null},K=Object.prototype.hasOwnProperty;function I(e,t,u){var o=u.ref;return{$$typeof:r,type:e,key:t,ref:o!==void 0?o:null,props:u}}function ye(e,t){return I(e.type,t,e.props)}function Y(e){return typeof e=="object"&&e!==null&&e.$$typeof===r}function he(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(u){return t[u]})}var ee=/\/+/g;function U(e,t){return typeof e=="object"&&e!==null&&e.key!=null?he(""+e.key):t.toString(36)}function de(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(N,N):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function A(e,t,u,o,s){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var a=!1;if(e===null)a=!0;else switch(i){case"bigint":case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case r:case f:a=!0;break;case H:return a=e._init,A(a(e._payload),t,u,o,s)}}if(a)return s=s(e),a=o===""?"."+U(e,0):o,V(s)?(u="",a!=null&&(u=a.replace(ee,"$&/")+"/"),A(s,t,u,"",function(Ee){return Ee})):s!=null&&(Y(s)&&(s=ye(s,u+(s.key==null||e&&e.key===s.key?"":(""+s.key).replace(ee,"$&/")+"/")+a)),t.push(s)),1;a=0;var m=o===""?".":o+":";if(V(e))for(var v=0;v<e.length;v++)o=e[v],i=m+U(o,v),a+=A(o,t,u,i,s);else if(v=le(e),typeof v=="function")for(e=v.call(e),v=0;!(o=e.next()).done;)o=o.value,i=m+U(o,v++),a+=A(o,t,u,i,s);else if(i==="object"){if(typeof e.then=="function")return A(de(e),t,u,o,s);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return a}function O(e,t,u){if(e==null)return e;var o=[],s=0;return A(e,o,"","",function(i){return t.call(u,i,s++)}),o}function ve(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(u){(e._status===0||e._status===-1)&&(e._status=1,e._result=u)},function(u){(e._status===0||e._status===-1)&&(e._status=2,e._result=u)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var te=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof W=="object"&&typeof W.emit=="function"){W.emit("uncaughtException",e);return}console.error(e)},me={map:O,forEach:function(e,t,u){O(e,function(){t.apply(this,arguments)},u)},count:function(e){var t=0;return O(e,function(){t++}),t},toArray:function(e){return O(e,function(t){return t})||[]},only:function(e){if(!Y(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};return n.Activity=pe,n.Children=me,n.Component=x,n.Fragment=l,n.Profiler=h,n.PureComponent=$,n.StrictMode=T,n.Suspense=q,n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=c,n.__COMPILER_RUNTIME={__proto__:null,c:function(e){return c.H.useMemoCache(e)}},n.cache=function(e){return function(){return e.apply(null,arguments)}},n.cacheSignal=function(){return null},n.cloneElement=function(e,t,u){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var o=G({},e.props),s=e.key;if(t!=null)for(i in t.key!==void 0&&(s=""+t.key),t)!K.call(t,i)||i==="key"||i==="__self"||i==="__source"||i==="ref"&&t.ref===void 0||(o[i]=t[i]);var i=arguments.length-2;if(i===1)o.children=u;else if(1<i){for(var a=Array(i),m=0;m<i;m++)a[m]=arguments[m+2];o.children=a}return I(e.type,s,o)},n.createContext=function(e){return e={$$typeof:w,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:d,_context:e},e},n.createElement=function(e,t,u){var o,s={},i=null;if(t!=null)for(o in t.key!==void 0&&(i=""+t.key),t)K.call(t,o)&&o!=="key"&&o!=="__self"&&o!=="__source"&&(s[o]=t[o]);var a=arguments.length-2;if(a===1)s.children=u;else if(1<a){for(var m=Array(a),v=0;v<a;v++)m[v]=arguments[v+2];s.children=m}if(e&&e.defaultProps)for(o in a=e.defaultProps,a)s[o]===void 0&&(s[o]=a[o]);return I(e,i,s)},n.createRef=function(){return{current:null}},n.forwardRef=function(e){return{$$typeof:C,render:e}},n.isValidElement=Y,n.lazy=function(e){return{$$typeof:H,_payload:{_status:-1,_result:e},_init:ve}},n.memo=function(e,t){return{$$typeof:L,type:e,compare:t===void 0?null:t}},n.startTransition=function(e){var t=c.T,u={};c.T=u;try{var o=e(),s=c.S;s!==null&&s(u,o),typeof o=="object"&&o!==null&&typeof o.then=="function"&&o.then(N,te)}catch(i){te(i)}finally{t!==null&&u.types!==null&&(t.types=u.types),c.T=t}},n.unstable_useCacheRefresh=function(){return c.H.useCacheRefresh()},n.use=function(e){return c.H.use(e)},n.useActionState=function(e,t,u){return c.H.useActionState(e,t,u)},n.useCallback=function(e,t){return c.H.useCallback(e,t)},n.useContext=function(e){return c.H.useContext(e)},n.useDebugValue=function(){},n.useDeferredValue=function(e,t){return c.H.useDeferredValue(e,t)},n.useEffect=function(e,t){return c.H.useEffect(e,t)},n.useEffectEvent=function(e){return c.H.useEffectEvent(e)},n.useId=function(){return c.H.useId()},n.useImperativeHandle=function(e,t,u){return c.H.useImperativeHandle(e,t,u)},n.useInsertionEffect=function(e,t){return c.H.useInsertionEffect(e,t)},n.useLayoutEffect=function(e,t){return c.H.useLayoutEffect(e,t)},n.useMemo=function(e,t){return c.H.useMemo(e,t)},n.useOptimistic=function(e,t){return c.H.useOptimistic(e,t)},n.useReducer=function(e,t,u){return c.H.useReducer(e,t,u)},n.useRef=function(e){return c.H.useRef(e)},n.useState=function(e){return c.H.useState(e)},n.useSyncExternalStore=function(e,t,u){return c.H.useSyncExternalStore(e,t,u)},n.useTransition=function(){return c.H.useTransition()},n.version="19.2.4",n}var ue;function Ae(){return ue||(ue=1,D.exports=xe()),D.exports}var S=Ae();const Oe=_e(S);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),fe=(...r)=>r.filter((f,l,T)=>!!f&&f.trim()!==""&&T.indexOf(f)===l).join(" ").trim();/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Se={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const je=S.forwardRef(({color:r="currentColor",size:f=24,strokeWidth:l=2,absoluteStrokeWidth:T,className:h="",children:d,iconNode:w,...C},q)=>S.createElement("svg",{ref:q,...Se,width:f,height:f,stroke:r,strokeWidth:T?Number(l)*24/Number(f):l,className:fe("lucide",h),...C},[...w.map(([L,H])=>S.createElement(L,H)),...Array.isArray(d)?d:[d]]));/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(r,f)=>{const l=S.forwardRef(({className:T,...h},d)=>S.createElement(je,{ref:d,iconNode:f,className:fe(`lucide-${Me(r)}`,T),...h}));return l.displayName=`${r}`,l};/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=y("ArrowLeftRight",[["path",{d:"M8 3 4 7l4 4",key:"9rb6wj"}],["path",{d:"M4 7h16",key:"6tx8e3"}],["path",{d:"m16 21 4-4-4-4",key:"siv7j2"}],["path",{d:"M20 17H4",key:"h6l3hr"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=y("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=y("Coins",[["circle",{cx:"8",cy:"8",r:"6",key:"3yglwk"}],["path",{d:"M18.09 10.37A6 6 0 1 1 10.34 18",key:"t5s6rm"}],["path",{d:"M7 6h1v4",key:"1obek4"}],["path",{d:"m16.71 13.88.7.71-2.82 2.82",key:"1rbuyh"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=y("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=y("FileQuestion",[["path",{d:"M12 17h.01",key:"p32p05"}],["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",key:"1mlx9k"}],["path",{d:"M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3",key:"mhlwft"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=y("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=y("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=y("SearchX",[["path",{d:"m13.5 8.5-5 5",key:"1cs55j"}],["path",{d:"m8.5 8.5 5 5",key:"a8mexj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=y("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=y("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=y("Sprout",[["path",{d:"M7 20h10",key:"e6iznv"}],["path",{d:"M10 20c5.5-2.5.8-6.4 3-10",key:"161w41"}],["path",{d:"M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",key:"9gtqwd"}],["path",{d:"M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",key:"bkxnd2"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=y("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=y("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=y("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=y("Wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);/**
 * @license lucide-react v0.470.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=y("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);export{Pe as A,qe as C,$e as E,be as F,Ie as R,ze as S,Je as T,Qe as U,Ze as W,Be as Z,S as a,Ne as b,We as c,Ue as d,Ye as e,Le as f,_e as g,De as h,Oe as i,He as j,W as p,Ae as r};
