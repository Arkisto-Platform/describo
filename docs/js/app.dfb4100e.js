(function(e){function t(t){for(var n,s,i=t[0],c=t[1],l=t[2],f=0,d=[];f<i.length;f++)s=i[f],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&d.push(o[s][0]),o[s]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);u&&u(t);while(d.length)d.shift()();return a.push.apply(a,l||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,i=1;i<r.length;i++){var c=r[i];0!==o[c]&&(n=!1)}n&&(a.splice(t--,1),e=s(s.s=r[0]))}return e}var n={},o={app:0},a=[];function s(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=n,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/describo/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var u=c;a.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("56d7")},"56d7":function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n=r("2b0e"),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("router-view")],1)},a=[],s=r("2877"),i={},c=Object(s["a"])(i,o,a,!1,null,null,null),l=c.exports,u=r("8c4f"),f=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},d=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"flex flex-col justify-center md:flex-row mt-10"},[r("div",{staticClass:"text-3xl lg:text-6xl mr-2"},[e._v(" Describo ")]),r("div",{staticClass:"text-lg lg:text-3xl md: pt-4 lg:pt-10"},[e._v(" The tool to describe and package data. ")])]),r("div",{staticClass:"my-8 text-base md:text-2xl text-center text-orange-600"},[e._v(" Describo is a tool to create and update "),r("a",{attrs:{href:"https://researchobject.github.io/ro-crate/"}},[e._v("Research Object Crates (RO-CRATE)")]),e._v(". ")]),r("div",{staticClass:"flex flex-col lg:flex-row"},[r("div",{staticClass:"flex-col"},[r("div",[r("img",{attrs:{src:"images/select-folder.png"}})]),r("div",{staticClass:"text-center"},[e._v("Select a folder to describe.")])]),r("div",{staticClass:"flex-col"},[r("div",[r("img",{attrs:{src:"images/select-profile.png"}})]),r("div",{staticClass:"text-center"},[e._v("Select a profile.")])]),r("div",{staticClass:"flex-col"},[r("div",[r("img",{attrs:{src:"images/describe-item.png"}})]),r("div",{staticClass:"text-center"},[e._v("Describe your data.")])])])])}],p={components:{}},v=p,b=Object(s["a"])(v,f,d,!1,null,null,null),x=b.exports;n["a"].use(u["a"]);var g=[{path:"/",name:"Home",component:x}],m=new u["a"]({mode:"history",base:"/describo/",routes:g}),h=m;r("d940");n["a"].config.productionTip=!1,new n["a"]({router:h,render:function(e){return e(l)}}).$mount("#app")},d940:function(e,t,r){}});
//# sourceMappingURL=app.dfb4100e.js.map