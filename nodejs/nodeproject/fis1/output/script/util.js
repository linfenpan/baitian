define(function(require,exports,module){var $=require("jquery"),util={},__head=document.head||document.getElementsByTagName("head")[0];util.format=function(str,data,def,reg){return str.replace(reg||/\${([^}]*)}/g,function(a,b){var res=eval("data."+b);return"undefined"==typeof res?def||"":res})},util.value=function(data,str){try{return eval("data."+str)}catch(e){return""}},util.delay=function(e){return function(t){var n=this;return n.setAttribute("active",1),setTimeout(function(){n.removeAttribute("active"),e&&e.call(n,t)},200),!1}},util.animate=function(e,t){t?e.attr("animate",1):e.removeAttr("animate")},util.tabSwitch=function(e,t,n){util.animate(t,!0),setTimeout(function(){t.addClass("hide"),e.removeClass("hide"),setTimeout(function(){util.animate(e,!1)},10)},n||300)},util.openWindow=function(e){window.location.href=e},util.urlsearch=function(e){var t=new RegExp("[?|&]"+e+"=([^&]*)","g").exec(location.search);return t?t[1]:null},util.urlhash=function(e){var t=new RegExp("#"+e+"=([^&]*)","g").exec(location.hash);return t?t[1]:null},util.css=function(e){var t=document.getElementById("dd-inline-css-style");t||(t=document.createElement("style"),t.type="text/css",t.id="dd-inline-css-style",__head.appendChild(t)),t.styleSheet?t.styleSheet.cssText=t.styleSheet.cssText+e:t.appendChild(document.createTextNode(e))},util.getCookie=function(e,t){var n=new RegExp("(?:^|\n|;)"+e+"=([^;]*)","g").exec(document.cookie);return n?n[1]:t||null},window.util=util,module.exports=util});