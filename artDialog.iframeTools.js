/*!
 * artDialog iframeTools
 * Date: 2011-08-29 17:25
 * http://code.google.com/p/artdialog/
 * (c) 2009-2011 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */(function(a,b,c,d){var e,f,g,h="@ARTDIALOG.DATA",i="@ARTDIALOG.OPEN",j="@ARTDIALOG.OPENER",k=b.name=b.name||"@ARTDIALOG.WINNAME"+(new Date).getTime(),l=b.VBArray&&!b.XMLHttpRequest;a(function(){!b.jQuery&&document.compatMode==="BackCompat"&&alert('artDialog Error: document.compatMode === "BackCompat"')});var m=c.top=function(){var a=b,c=function(a){try{var c=b[a].document;c.getElementsByTagName}catch(d){return!1}return b[a].artDialog&&c.getElementsByTagName("frameset").length===0};return c("top")?a=b.top:c("parent")&&(a=b.parent),a}();c.parent=m,e=m.artDialog,g=function(){return e.defaults.zIndex},c.data=function(a,b){var d=c.top,e=d[h]||{};d[h]=e;if(b)e[a]=b;else return e[a];return e},c.removeData=function(a){var b=c.top[h];b&&b[a]&&delete b[a]},c.through=f=function(){var a=e.apply(this,arguments);return m!==b&&(c.list[a.config.id]=a),a},m!==b&&a(b).bind("unload",function(){var a=c.list;for(var b in a)a[b]&&(a[b].config.duration=0,a[b].close(),delete a[b])}),c.open=function(e,h,k){h=h||{};var m,n,o,p,q,r,s,t,u,v,w=c.top,x="position:absolute;left:-9999em;top:-9999em;border:none 0;background:transparent",y="width:100%;height:100%;border:none 0",z=h.title;if(k===!1){var A=(new Date).getTime(),B=e.replace(/([?&])_=[^&]*/,"$1_="+A);e=B+(B===e?(/\?/.test(e)?"&":"?")+"_="+A:"")}var C=function(){var b,c,d=n.content.find(".aui_loading"),e=m.config;o.style.display="block",p.addClass("aui_state_full"),d&&d.hide();try{u=r.contentWindow,t=a(u.document),v=u.document.body}catch(f){r.style.cssText=y,e.follow?m.follow(e.follow):m.position(e.left,e.top),h.init&&h.init.call(m,u,w),h.init=null;return}b=e.width==="auto"?t.width()+(l?0:parseInt(a(v).css("marginLeft"))):e.width,c=e.height==="auto"?t.height():e.height,setTimeout(function(){r.style.cssText=y},0),m.size(b,c),e.follow?m.follow(e.follow):m.position(e.left,e.top),h.init&&h.init.call(m,u,w),h.init=null},D={zIndex:g(),init:function(){m=this,n=m.DOM,q=n.main,p=n.content,o=n.titleBar[0],!z&&(o.style.display="none"),r=m.iframe=w.document.createElement("iframe"),r.src=e,r.name="Open"+m.config.id,r.style.cssText=x,r.setAttribute("frameborder",0,0),r.setAttribute("allowTransparency",!0),s=a(r),m.content().appendChild(r),u=r.contentWindow;try{u.name=r.name,c.data(r.name+i,m),c.data(r.name+j,b)}catch(d){}s.bind("load",C)},close:function(){s.css("display","none").unbind("load",C);if(h.close&&h.close.call(this,r.contentWindow,w)===!1)return!1;p.removeClass("aui_state_full"),s[0].src="about:blank",s.remove();try{c.removeData(r.name+i),c.removeData(r.name+j)}catch(a){}}};typeof h.ok=="function"&&(D.ok=function(){return h.ok.call(m,r.contentWindow,w)}),typeof h.cancel=="function"&&(D.cancel=function(){return h.cancel.call(m,r.contentWindow,w)}),delete h.content;for(var E in h)D[E]===d&&(D[E]=h[E]);return f(D)},c.open.api=c.data(k+i),c.opener=c.data(k+j)||b,c.open.origin=c.opener,c.close=function(){var a=c.data(k+i);return a&&a.close(),!1},m!=b&&a(document).bind("mousedown",function(){var a=c.open.api;a&&a.focus(!0)}),c.load=function(b,c,e){e=e||!1;var h=c||{},i={zIndex:g(),init:function(c){var d=this,f=d.config;a.ajax({url:b,success:function(a){d.content(a),h.init&&h.init.call(d,c)},cache:e})}};delete c.content;for(var j in h)i[j]===d&&(i[j]=h[j]);return f(i)},c.alert=function(a){return f({id:"Alert",zIndex:g(),icon:"warning",fixed:!0,lock:!0,content:a,ok:!0})},c.confirm=function(a,b,c){return f({id:"Confirm",zIndex:g(),icon:"question",fixed:!0,lock:!0,opacity:.1,content:a,ok:function(a){return b.call(this,a)},cancel:function(a){return c&&c.call(this,a)}})},c.prompt=function(a,b,c){c=c||"";var d;return f({id:"Prompt",zIndex:g(),icon:"question",fixed:!0,lock:!0,opacity:.1,content:['<div style="margin-bottom:5px;font-size:12px">',a,"</div>","<div>",'<input value="',c,'" style="width:18em;padding:6px 4px" />',"</div>"].join(""),init:function(){d=this.DOM.content.find("input")[0],d.select(),d.focus()},ok:function(a){return b&&b.call(this,d.value,a)},cancel:!0})},c.tips=function(a,b){return f({id:"Tips",zIndex:g(),title:!1,cancel:!1,fixed:!0,lock:!1}).content('<div style="padding: 0 1em;">'+a+"</div>").time(b||1.5)},a(function(){var d=c.dragEvent;if(!d)return;var e=a(b),f=a(document),g=l?"absolute":"fixed",h=d.prototype,i=document.createElement("div"),j=i.style;j.cssText="display:none;position:"+g+";left:0;top:0;width:100%;height:100%;"+"cursor:move;filter:alpha(opacity=0);opacity:0;background:#FFF",document.body.appendChild(i),h._start=h.start,h._end=h.end,h.start=function(){var a=c.focus.DOM,b=a.main[0],d=a.content[0].getElementsByTagName("iframe")[0];h._start.apply(this,arguments),j.display="block",j.zIndex=c.defaults.zIndex+3,g==="absolute"&&(j.width=e.width()+"px",j.height=e.height()+"px",j.left=f.scrollLeft()+"px",j.top=f.scrollTop()+"px"),d&&b.offsetWidth*b.offsetHeight>307200&&(b.style.visibility="hidden")},h.end=function(){var a=c.focus;h._end.apply(this,arguments),j.display="none",a&&(a.DOM.main[0].style.visibility="visible")}})})(window.jQuery||window.art,this,this.artDialog)