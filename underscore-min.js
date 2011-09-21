// Underscore.js 1.1.7
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var p=this,C=p._,m={},i=Array.prototype,n=Object.prototype,f=i.slice,D=i.unshift,E=n.toString,l=n.hasOwnProperty,s=i.forEach,t=i.map,u=i.reduce,v=i.reduceRight,w=i.filter,x=i.every,y=i.some,o=i.indexOf,z=i.lastIndexOf,n=Array.isArray,F=Object.keys,q=Function.prototype.bind,b=function(a){return new j(a)};typeof module!=="undefined"&&module.exports?(module.exports=b,b._=b):p._=b;b.VERSION="1.1.7";var h=b.each=b.forEach=function(a,d,b){if(a!=null)if(s&&a.forEach===s)a.forEach(d,b);else if(a.length===
+a.length)for(var e=0,k=a.length;e<k;e++){if(e in a&&d.call(b,a[e],e,a)===m)break}else for(e in a)if(l.call(a,e)&&d.call(b,a[e],e,a)===m)break};b.map=function(a,d,b){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(d,b);h(a,function(a,g,G){e[e.length]=d.call(b,a,g,G)});return e};b.reduce=b.foldl=b.inject=function(a,d,c,e){var k=c!==void 0;a==null&&(a=[]);if(u&&a.reduce===u)return e&&(d=b.bind(d,e)),k?a.reduce(d,c):a.reduce(d);h(a,function(a,b,f){k?c=d.call(e,c,a,b,f):(c=a,k=!0)});if(!k)throw new TypeError("Reduce of empty array with no initial value");
return c};b.reduceRight=b.foldr=function(a,d,c,e){a==null&&(a=[]);if(v&&a.reduceRight===v)return e&&(d=b.bind(d,e)),c!==void 0?a.reduceRight(d,c):a.reduceRight(d);a=(b.isArray(a)?a.slice():b.toArray(a)).reverse();return b.reduce(a,d,c,e)};b.find=b.detect=function(a,d,b){var e;A(a,function(a,g,f){if(d.call(b,a,g,f))return e=a,!0});return e};b.filter=b.select=function(a,b,c){var e=[];if(a==null)return e;if(w&&a.filter===w)return a.filter(b,c);h(a,function(a,g,f){b.call(c,a,g,f)&&(e[e.length]=a)});return e};
b.reject=function(a,b,c){var e=[];if(a==null)return e;h(a,function(a,g,f){b.call(c,a,g,f)||(e[e.length]=a)});return e};b.every=b.all=function(a,b,c){var e=!0;if(a==null)return e;if(x&&a.every===x)return a.every(b,c);h(a,function(a,g,f){if(!(e=e&&b.call(c,a,g,f)))return m});return e};var A=b.some=b.any=function(a,d,c){var d=d||b.identity,e=!1;if(a==null)return e;if(y&&a.some===y)return a.some(d,c);h(a,function(a,b,f){if(e|=d.call(c,a,b,f))return m});return!!e};b.include=b.contains=function(a,b){var c=
!1;if(a==null)return c;if(o&&a.indexOf===o)return a.indexOf(b)!=-1;A(a,function(a){if(c=a===b)return!0});return c};b.invoke=function(a,d){var c=f.call(arguments,2);return b.map(a,function(a){return(d.call?d||a:a[d]).apply(a,c)})};b.pluck=function(a,d){return b.map(a,function(a){return a[d]})};b.max=function(a,d,c){if(!d&&b.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};h(a,function(a,b,f){b=d?d.call(c,a,b,f):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,
d,c){if(!d&&b.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};h(a,function(a,b,f){b=d?d.call(c,a,b,f):a;b<e.computed&&(e={value:a,computed:b})});return e.value};b.sortBy=function(a,d,c){return b.pluck(b.map(a,function(a,b,f){return{value:a,criteria:d.call(c,a,b,f)}}).sort(function(a,d){return b.compare(a.criteria,d.criteria)}),"value")};b.groupBy=function(a,b){var c={};h(a,function(a,f){var g=b(a,f);(c[g]||(c[g]=[])).push(a)});return c};b.COMPARE_EQUAL=0;b.COMPARE_ASCENDING=1;b.COMPARE_DESCENDING=
-1;b.compare=function(a,d,c){c||(c="compare");if(typeof a=="object"&&a[c]&&b.isFunction(a[c]))return a=a[c](d),a===0?b.COMPARE_EQUAL:a<0?b.COMPARE_DESCENDING:b.COMPARE_ASCENDING;return typeof d=="object"&&d[c]&&b.isFunction(d[c])?(a=d[c](a),a===0?b.COMPARE_EQUAL:a<0?b.COMPARE_ASCENDING:b.COMPARE_DESCENDING):a===d?b.COMPARE_EQUAL:a<d?b.COMPARE_ASCENDING:b.COMPARE_DESCENDING};b.sortedIndex=function(a,d,c){c||(c=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;b.compare(c(a[g]),c(d))==b.COMPARE_ASCENDING?
e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?f.call(a):b.isArguments(a)?f.call(a):b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,c){return b!=null&&!c?f.call(a,0,b):a[0]};b.rest=b.tail=function(a,b,c){return f.call(a,b==null||c?1:b)};b.last=function(a){return a[a.length-1]};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a){return b.reduce(a,function(a,c){if(b.isArray(c))return a.concat(b.flatten(c));
a[a.length]=c;return a},[])};b.without=function(a){return b.difference(a,f.call(arguments,1))};b.uniq=b.unique=function(a,d,c){var c=c?b.map(a,c):a,e=[];b.reduce(c,function(c,f,h){if(0==h||(d===!0?b.last(c)!=f:!b.include(c,f)))c[c.length]=f,e[e.length]=a[h];return c},[]);return e};b.union=function(){return b.uniq(b.flatten(arguments))};b.intersection=b.intersect=function(a){var d=f.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(d,function(d){return b.indexOf(d,a)>=0})})};b.difference=
function(a,d){return b.filter(a,function(a){return!b.include(d,a)})};b.zip=function(){for(var a=f.call(arguments),d=b.max(b.pluck(a,"length")),c=Array(d),e=0;e<d;e++)c[e]=b.pluck(a,""+e);return c};b.indexOf=function(a,d,c){if(a==null)return-1;var e;if(c)return c=b.sortedIndex(a,d),a[c]===d?c:-1;if(o&&a.indexOf===o)return a.indexOf(d);for(c=0,e=a.length;c<e;c++)if(a[c]===d)return c;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var c=a.length;c--;)if(a[c]===
b)return c;return-1};b.range=function(a,b,c){arguments.length<=1&&(b=a||0,a=0);for(var c=arguments[2]||1,e=Math.max(Math.ceil((b-a)/c),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=c;return g};b.bind=function(a,b){if(a.bind===q&&q)return q.apply(a,f.call(arguments,1));var c=f.call(arguments,2);return function(){return a.apply(b,c.concat(f.call(arguments)))}};b.bindAll=function(a){var d=f.call(arguments,1);d.length==0&&(d=b.functions(a));h(d,function(d){a[d]=b.bind(a[d],a)});return a};b.memoize=function(a,d){var c=
{};d||(d=b.identity);return function(){var b=d.apply(this,arguments);return l.call(c,b)?c[b]:c[b]=a.apply(this,arguments)}};b.delay=function(a,b){var c=f.call(arguments,2);return setTimeout(function(){return a.apply(a,c)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(f.call(arguments,1)))};var B=function(a,b,c){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};c&&clearTimeout(e);if(c||!e)e=setTimeout(h,b)}};b.throttle=function(a,b){return B(a,b,!1)};b.debounce=
function(a,b){return B(a,b,!0)};b.once=function(a){var b=!1,c;return function(){if(b)return c;b=!0;return c=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var c=[a].concat(f.call(arguments));return b.apply(this,c)}};b.compose=function(){var a=f.call(arguments);return function(){for(var b=f.call(arguments),c=a.length-1;c>=0;c--)b=[a[c].apply(this,b)];return b[0]}};b.after=function(a,b){return function(){if(--a<1)return b.apply(this,arguments)}};b.keys=F||function(a){if(a!==Object(a))throw new TypeError("Invalid object");
var b=[],c;for(c in a)l.call(a,c)&&(b[b.length]=c);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var d=[],c;for(c in a)b.isFunction(a[c])&&d.push(c);return d.sort()};b.extend=function(a){h(f.call(arguments,1),function(b){for(var c in b)b[c]!==void 0&&(a[c]=b[c])});return a};b.defaults=function(a){h(f.call(arguments,1),function(b){for(var c in b)a[c]==null&&(a[c]=b[c])});return a};b.clone=function(a){return b.isArray(a)?a.slice():b.extend({},a)};b.cloneToDepth=
function(a,d){if(typeof a!=="object")return a;if(d<1)return b.clone(a);clone=b.clone(a);for(var c in clone)clone[c]=b.cloneToDepth(clone[c],d-1);return clone};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,d){if(a===d)return!0;var c=typeof a;if(c!=typeof d)return!1;if(a==d)return!0;if(!a&&d||a&&!d)return!1;if(a._chain)a=a._wrapped;if(d._chain)d=d._wrapped;if(a.isEqual)return a.isEqual(d);if(d.isEqual)return d.isEqual(a);if(b.isDate(a)&&b.isDate(d))return a.getTime()===d.getTime();if(b.isNaN(a)&&
b.isNaN(d))return!1;if(b.isRegExp(a)&&b.isRegExp(d))return a.source===d.source&&a.global===d.global&&a.ignoreCase===d.ignoreCase&&a.multiline===d.multiline;if(c!=="object")return!1;if(a.length&&a.length!==d.length)return!1;var c=b.keys(a),e=b.keys(d);if(c.length!=e.length)return!1;for(var f in a)if(!(f in d)||!b.isEqual(a[f],d[f]))return!1;return!0};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var d in a)if(l.call(a,d))return!1;return!0};b.isElement=function(a){return!!(a&&
a.nodeType==1)};b.isArray=n||function(a){return E.call(a)==="[object Array]"};b.isObject=function(a){return a===Object(a)};b.isArguments=function(a){return!(!a||!l.call(a,"callee"))};b.isFunction=function(a){return!(!a||!a.constructor||!a.call||!a.apply)};b.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};b.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===!0||a===!1};b.isDate=function(a){return!(!a||
!a.getTimezoneOffset||!a.setUTCFullYear)};b.isRegExp=function(a){return!(!a||!a.test||!a.exec||!(a.ignoreCase||a.ignoreCase===!1))};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){p._=C;return this};b.identity=function(a){return a};b.times=function(a,b,c){for(var e=0;e<a;e++)b.call(c,e)};b.mixin=function(a){h(b.functions(a),function(d){H(d,b[d]=a[d])})};var I=0;b.uniqueId=function(a){var b=I++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,
interpolate:/<%=([\s\S]+?)%>/g};b.template=function(a,d){var c=b.templateSettings,c="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(c.interpolate,function(a,b){return"',"+b.replace(/\\'/g,"'")+",'"}).replace(c.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",c=new Function("obj",
c);return d?c(d):c};var j=function(a){this._wrapped=a};b.prototype=j.prototype;var r=function(a,d){return d?b(a).chain():a},H=function(a,d){j.prototype[a]=function(){var a=f.call(arguments);D.call(a,this._wrapped);return r(d.apply(b,a),this._chain)}};b.mixin(b);h("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=i[a];j.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});h(["concat","join","slice"],function(a){var b=i[a];j.prototype[a]=
function(){return r(b.apply(this._wrapped,arguments),this._chain)}});j.prototype.chain=function(){this._chain=!0;return this};j.prototype.value=function(){return this._wrapped}})();
