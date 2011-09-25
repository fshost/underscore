// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var t=this,G=t._,q={},n=Array.prototype,r=Object.prototype,k=n.slice,H=n.unshift,I=r.toString,o=r.hasOwnProperty,w=n.forEach,x=n.map,y=n.reduce,z=n.reduceRight,A=n.filter,B=n.every,C=n.some,s=n.indexOf,D=n.lastIndexOf,r=Array.isArray,J=Object.keys,u=Function.prototype.bind,b=function(a){return new p(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):t._=b;b.VERSION="1.1.7";var j=b.each=b.forEach=function(a,c,b){if(a!=null)if(w&&a.forEach===w)a.forEach(c,b);else if(a.length===
+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(b,a[e],e,a)===q)break}else for(e in a)if(o.call(a,e)&&c.call(b,a[e],e,a)===q)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(x&&a.map===x)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=d!==void 0;a==null&&(a=[]);if(y&&a.reduce===y)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);j(a,function(a,b,j){f?d=c.call(e,d,a,b,j):(d=a,f=!0)});if(!f)throw new TypeError("Reduce of empty array with no initial value");
return d};b.reduceRight=b.foldr=function(a,c,d,e){a==null&&(a=[]);if(z&&a.reduceRight===z)return e&&(c=b.bind(c,e)),d!==void 0?a.reduceRight(c,d):a.reduceRight(c);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,c,d,e)};b.find=b.detect=function(a,c,b){var e;E(a,function(a,g,h){if(c.call(b,a,g,h))return e=a,!0});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(A&&a.filter===A)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};
b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=!0;if(a==null)return e;if(B&&a.every===B)return a.every(c,b);j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h)))return q});return e};var E=b.some=b.any=function(a,c,d){var c=c||b.identity,e=!1;if(a==null)return e;if(C&&a.some===C)return a.some(c,d);j(a,function(a,b,h){if(e|=c.call(d,a,b,h))return q});return!!e};b.include=b.contains=function(a,c){var b=
!1;if(a==null)return b;if(s&&a.indexOf===s)return a.indexOf(c)!=-1;E(a,function(a){if(b=a===c)return!0});return b};b.invoke=function(a,c){var d=k.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,d)})};b.pluck=function(a,c,d){return d?b.map(a,function(a){var b=a[c];delete a[c];return b}):b.map(a,function(a){return a[c]})};b.copyProperties=function(a,c,d,e){for(var f=d||b.keys(c),g=!1,h=0,j=f.length;h<j;h++)d=f[h],o.call(c,d)&&(a[d]=c[d],g=!0,e&&delete c[d]);return g};b.getValue=
function(a,c,b,e){if(o.call(a,c)){if(!e)return a[c];b=a[c];delete a[c]}return b};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,c,d){return b.pluck(b.map(a,
function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)}}).sort(function(a,c){return b.compare(a.criteria,c.criteria)}),"value")};b.groupBy=function(a,b){var d={};j(a,function(a,f){var g=b(a,f);(d[g]||(d[g]=[])).push(a)});return d};b.COMPARE_EQUAL=0;b.COMPARE_ASCENDING=-1;b.COMPARE_DESCENDING=1;b.compare=function(a,c,d){if(typeof a!=="object")return a===c?b.COMPARE_EQUAL:a<c?b.COMPARE_ASCENDING:b.COMPARE_DESCENDING;d||(d="compare");if(a[d]&&b.isFunction(a[d]))return a=a[d](c),a===0?b.COMPARE_EQUAL:
a<0?b.COMPARE_ASCENDING:b.COMPARE_DESCENDING;else if(c[d]&&b.isFunction(c[d]))return a=c[d](a),a===0?b.COMPARE_EQUAL:a<0?b.COMPARE_DESCENDING:b.COMPARE_ASCENDING;return a===c?b.COMPARE_EQUAL:a<c?b.COMPARE_ASCENDING:b.COMPARE_DESCENDING};b.sortedIndex=function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;b.compare(d(a[g]),d(c))==b.COMPARE_ASCENDING?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?k.call(a):b.isArguments(a)?k.call(a):b.values(a)};
b.size=function(a){return b.toArray(a).length};b.own=function(a,c){if(!a)return a;c||(c={});if(b.isArray(a))if(c.clone){var d=[];j(a,function(a){d.push(b.own(a))});return d}else j(a,function(a){b.own(a)});else if(c.properties)if(c.clone)return d={},j(a,function(a,c){d[c]=b.own(a)}),d;else j(a,function(a){b.own(a)});else a.retain?a.retain():a.clone&&a.clone();return a};b.disown=function(a,c){if(!a)return a;c||(c={});b.isArray(a)?c.clear?j(a,function(c,e){b.disown(c);a[e]=null}):(j(a,function(a){b.disown(a)}),
a=[]):c.properties?c.clear?j(a,function(c,e){b.disown(c);a[e]=null}):(j(a,function(a){b.disown(a)}),a={}):a.release?a.release():a.destroy&&a.destroy();return a};b.remove=function(a,c,d){if(b.isEmpty(a))return!c||b.isFunction(c)?[]:void 0;d||(d={});b.isFunction(d)&&(d={callback:d});if(d.preclear){var e=a,a=b.clone(a);if(b.isArray(e))e.length=0;else for(var f in e)delete e[f]}var g=[];if(b.isArray(a)){e=!1;if(b.isUndefined(c))g=b.keys(a);else if(b.isFunction(c))d.first_only?(e=!0,b.find(a,function(a,
b){return c(a)?(g.push(b),!0):!1})):j(a,function(a,b){c(a)&&g.push(b)});else if(b.isArray(c))if(d.first_only)for(var e=!0,h,m=c.length-1;m>=0;m--)h=c[m],b.find(a,function(a,b){return h===a?(g.push(b),!0):!1});else for(m=c.length-1;m>=0;m--)h=c[m],j(a,function(a,b){h===a&&g.push(b)});else d.first_only?(e=!0,f=b.indexOf(a,c),f>=0&&g.push(f)):(e=!0,j(a,function(a,b){c===a&&g.push(b)}));if(e){if(g.length){f=0;e=a[g[0]];for(g=g.sort(function(a,c){return b.compare(a,c)});g.length;)f++,a.splice(g.pop(),
1);if(d.callback)for(;f>0;)d.callback(e),f--;return e}}else if(g.length){e=[];for(g=g.sort(function(a,c){return b.compare(a,c)});g.length;)f=g.pop(),e.unshift(a[f]),a.splice(f,1);d.callback&&j(e,function(a){d.callback(a)});return b.uniq(e)}else return[]}else{var k,e=!1;if(b.isUndefined(c))g=b.keys(a);else if(b.isFunction(c))for(f in a)c(a[f],f)&&g.push(f);else if(b.isArray(c))if(d.is_value)for(var m=0,n=c.length;m<n;m++)if(h=c[m],d.first_only)for(f in a){if(h===a[f]){g.push(f);break}}else for(f in a)h===
a[f]&&g.push(f);else{k=c;m=0;for(n=c.length;m<n;m++)f=c[m],a.hasOwnProperty(f)&&g.push(f)}else if(b.isString(c)&&!d.is_value)e=!0,k=[],a.hasOwnProperty(c)&&(k.push(c),g.push(c));else for(f in a)c===a[f]&&g.push(f);if(k)if(k.length){for(m=[];g.length;)f=g.shift(),m.push(a[f]),delete a[f];d.callback&&j(m,function(a,b){d.callback(a,k[b])});return e?m[0]:m}else return e?void 0:[];else if(g.length){for(m={};g.length;)f=g.shift(),m[f]=a[f],delete a[f];d.callback&&j(m,function(a,b){d.callback(a,b)});return m}else return{}}};
b.first=b.head=function(a,b,d){return b!=null&&!d?k.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,d){return k.call(a,b==null||d?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,d){if(b.isArray(d))return a.concat(b.flatten(d));a[a.length]=d;return a},[])};b.without=function(a){return b.difference(a,k.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];b.reduce(d,
function(d,g,h){if(0==h||(c===!0?b.last(d)!=g:!b.include(d,g)))d[d.length]=g,e[e.length]=a[h];return d},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var c=k.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a,c){return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=k.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),
e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(s&&a.indexOf===s)return a.indexOf(c);for(d=0,e=a.length;d<e;d++)if(a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(D&&a.lastIndexOf===D)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;return-1};b.findIndex=function(a,b){for(i=0,l=a.length;i<l;i++)if(b(a[i]))return i;return-1};b.range=function(a,b,d){arguments.length<=
1&&(b=a||0,a=0);for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};b.bind=function(a,b){if(a.bind===u&&u)return u.apply(a,k.call(arguments,1));var d=k.call(arguments,2);return function(){return a.apply(b,d.concat(k.call(arguments)))}};b.bindAll=function(a){var c=k.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,
arguments);return o.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=k.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(k.call(arguments,1)))};var F=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return F(a,b,!1)};b.debounce=function(a,b){return F(a,b,!0)};b.once=function(a){var b=
!1,d;return function(){if(b)return d;b=!0;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(k.call(arguments));return b.apply(this,d)}};b.compose=function(){var a=k.call(arguments);return function(){for(var b=k.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=J||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)o.call(a,
d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.hasKeypath=b.keypathExists=function(a,c){return!!b.keypathValueOwner(a,c)};b.keypathValueOwner=function(a,c){for(var d,e=b.isString(c)?c.split("."):c,f=a,g=0,h=e.length;g<h;){d=e[g];if(!(d in f))break;if(++g===h)return f;f=f[d];if(!f||!(f instanceof Object))break}};b.keypathValue=function(a,c,d){c=b.isString(c)?c.split("."):c;a=b.keypathValueOwner(a,c);return!a?d:a[c[c.length-1]]};b.keypathSetValue=function(a,c,d){var c=
b.isString(c)?c.split("."):c,e=b.keypathValueOwner(a,c);if(e)return e[c[c.length-1]]=d,a};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(k.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){j(k.call(arguments,1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.cloneToDepth=function(a,
c){if(typeof a!=="object")return a;b.isUndefined(c)&&(c=0);if(c<1)return b.clone(a);clone=b.clone(a);for(var d in clone)clone[d]=b.cloneToDepth(clone[d],c-1);return clone};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,c){if(a===c)return!0;if(!a&&c||a&&!c)return!1;if(a===void 0||c===void 0)return!1;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual)return a.isEqual(c);if(c.isEqual)return c.isEqual(a);var d=typeof a;if(d!=typeof c)return!1;if(a==c)return!0;if(b.isDate(a)&&b.isDate(c))return a.getTime()===
c.getTime();if(b.isNaN(a)&&b.isNaN(c))return!1;if(b.isRegExp(a)&&b.isRegExp(c))return a.source===c.source&&a.global===c.global&&a.ignoreCase===c.ignoreCase&&a.multiline===c.multiline;if(d!=="object")return!1;if(a.length&&a.length!==c.length)return!1;var d=b.keys(a),e=b.keys(c);if(d.length!=e.length)return!1;for(var f in a)if(!(f in c)||!b.isEqual(a[f],c[f]))return!1;return!0};b.isConstructor=function(a){return b.isFunction(a)&&a.name};b.resolveConstructor=function(a){var c=b.isArray(a)?a:b.isString(a)?
a.split("."):void 0;if(c)return(a=c.length===1?window[c[0]]:b.keypathValue(window,c))&&b.isConstructor(a)?a:void 0;else if(b.isFunction(a)&&b.isConstructor(a))return a};b.CONVERT_NONE=0;b.CONVERT_IS_TYPE=1;b.CONVERT_TO_METHOD=2;b.conversionPath=function(a,c){var d=b.isArray(c)?c:b.isString(c)?c.split("."):void 0,e=typeof a,f=d?d[d.length-1]:void 0;if(d&&e===f)return b.CONVERT_IS_TYPE;if((d=b.resolveConstructor(d?d:c))&&e=="object")try{if(a instanceof d)return b.CONVERT_IS_TYPE}catch(g){}f=d&&d.name?
d.name:f;if(!f)return b.CONVERT_NONE;if(b["is"+f]&&b["is"+f](a))return b.CONVERT_IS_TYPE;else if(e=="object"&&a["to"+f])return b.CONVERT_TO_METHOD;return b.CONVERT_NONE};b.toType=function(a,c){var d=b.isArray(c)?c:b.isString(c)?c.split("."):void 0;switch(b.conversionPath(a,d?d:c)){case 1:return a;case 2:return d?a["to"+d[d.length-1]]():(d=b.resolveConstructor(c))&&d.name?a["to"+d.name]():void 0}};b.functionExists=function(a,c){return a instanceof Object&&a[c]&&b.isFunction(a[c])};b.callIfExists=function(a,
c){return b.functionExists(a,c)?a[c].apply(a,k.call(arguments,2)):void 0};b.getSuperFunction=function(a,c){var d=b.keypathValueOwner(a,["constructor","__super__",c]);return d&&b.isFunction(d[c])?d[c]:void 0};b.superCall=function(a,c){return b.superApply(a,c,k.call(arguments,2))};b.superApply=function(a,c,d){return(c=b.getSuperFunction(a,c))?c.apply(a,d):void 0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(o.call(a,c))return!1;return!0};b.isElement=function(a){return!!(a&&
a.nodeType==1)};b.isArray=r||function(a){return I.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!o.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||
!a.getTimezoneOffset||!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.toJSON=function(a){if(b.isArray(a)){var c=[];j(a,function(a){c.push(b.toJSON(a))});return c}else if(a instanceof Object&&a.toJSON)return a.toJSON();return a};b.parseJSON=function(a,c){var d=typeof a;if(d!=="object"&&d!=="string")return a;if(d==="string"&&a.length&&(a[0]==="{"||a[0]===
"["))try{var e=JSON.parse(a);e&&(a=e)}catch(f){throw new TypeError("Unable to parse JSON: "+a);}c||(c={});if(b.isArray(a)){var g=[];j(a,function(a){g.push(b.parseJSON(a,h))});return g}else if(c.properties)return g={},j(a,function(a,c){g[c]=b.parseJSON(a,h)}),g;var h=c.type_field?c.type_field:"_type";if(!(a instanceof Object)||!a.hasOwnProperty(h))return a;d=a[h];e=b.keypathValueOwner(window,d+".parseJSON");if(!e)throw new TypeError("Unable to find a parseJSON function for type: "+d);return e.parseJSON(a)};
b.noConflict=function(){t._=G;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.mixin=function(a){j(b.functions(a),function(c){K(c,b[c]=a[c])})};var L=0;b.uniqueId=function(a){var b=L++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,
"\\'").replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",d=new Function("obj",d);return c?d(c):d};var p=function(a){this._wrapped=a};b.prototype=p.prototype;var v=function(a,c){return c?b(a).chain():a},K=function(a,c){p.prototype[a]=function(){var a=k.call(arguments);H.call(a,
this._wrapped);return v(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=n[a];p.prototype[a]=function(){b.apply(this._wrapped,arguments);return v(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=n[a];p.prototype[a]=function(){return v(b.apply(this._wrapped,arguments),this._chain)}});p.prototype.chain=function(){this._chain=!0;return this};p.prototype.value=function(){return this._wrapped}})();
