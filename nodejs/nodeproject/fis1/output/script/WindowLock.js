define(function(o,i,t){var n=o("jquery"),e=o("common"),c=function(o,i){var t=function(t){t=i.extend({canClickHide:!0},t||{});var n='<div id="lockWindow" class="lockWindow"></div>';i("body").append(n),t.content&&i("#lockWindow").html(t.content);var c=this,d=i("#lockWindow");d.css(t.slidable?{top:"0",left:"0",position:"absolute",width:"100%",height:"100%",background:"rgba(0,0,0,0.5)","z-index":"1000"}:{top:"0",left:"0",position:"fixed",width:"100%",height:i(o).height()+"px",background:"rgba(0,0,0,0.5)","z-index":"1000",display:"-webkit-box","-webkit-box-align":"center"}),t.wrapCss&&d.css(t.wrapCss),o.location=/#lock$g/.test(o.location.href)?"#lock1":"#lock";e.isTouchEnv?"touchstart":"mousedown";d.on("click",function(n){if(n.srcElement==d[0]){t.canClickHide&&c.remove();try{"function"==i.type(t.ontouched)&&t.ontouched.call(o)}catch(n){}}})};return function(o){t.call(this,o),this.$wrap=i("#lockWindow")}}(window,n);c.prototype={hide:function(){this.$wrap.hide()},show:function(){this.$wrap.show()},remove:function(){window.history.go(-1),this.$wrap.remove(),delete this}},t.exports=c});