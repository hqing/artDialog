/*!
* artDialog 5
* Date: 2012-02-28
* http://code.google.com/p/artdialog/
* (c) 2009-2012 TangBin, http://www.planeArt.cn
*
* This is licensed under the GNU LGPL, version 2.1 or later.
* For details, see: http://creativecommons.org/licenses/LGPL/2.1/
*/

;(function ($, window, undefined) {

// artDialog 只支持 xhtml 1.0 或者以上的 DOCTYPE 声明
if (document.compatMode === 'BackCompat') {
    throw new Error('artDialog: Document types require more than xhtml1.0');
};

var _singleton,
    _count = 0,
    _expando = 'artDialog' + + new Date,
    _isIE6 = window.VBArray && !window.XMLHttpRequest,
    _isMobile = 'createTouch' in document && !('onmousemove' in document)
        || /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
    _isFixed = !_isIE6 && !_isMobile;

    
var artDialog = function (config, ok, cancel) {

    config = config || {};
    
    if (typeof config === 'string' || config.nodeType === 1) {
    
        config = {content: config, fixed: !_isMobile};
    };
    
    
    var api, defaults = artDialog.defaults;
    var elem = config.follow = this.nodeType === 1 && this || config.follow;
        
    
    // 合并默认配置
    for (var i in defaults) {
        if (config[i] === undefined) {
            config[i] = defaults[i];
        };
    };

    
    config.id = elem && elem[_expando + 'follow'] || config.id || _expando + _count;
    api = artDialog.list[config.id];
    
    
    
    if (api) {
        if (elem) {
            api.follow(elem)
        };
        api.zIndex().focus();
        return api;
    };
    
    
    
    // 目前主流移动设备对fixed支持不好
    if (!_isFixed) {
        config.fixed = false;
    };
    
    // !$.isArray(config.button)
    if (!config.button || !config.button.push) {
        config.button = [];
    };
    
    
    // 确定按钮
    if (ok !== undefined) {
        config.ok = ok;
    };
    
    if (config.ok) {
        config.button.push({
            id: 'ok',
            value: config.okValue,
            callback: config.ok,
            focus: true
        });
    };
    
    
    // 取消按钮
    if (cancel !== undefined) {
        config.cancel = cancel;
    };
    
    if (config.cancel) {
        config.button.push({
            id: 'cancel',
            value: config.cancelValue,
            callback: config.cancel
        });
    };
    
    // 更新 zIndex 全局配置
    artDialog.defaults.zIndex = config.zIndex;
    
    _count ++;

    return artDialog.list[config.id] = _singleton ?
        _singleton.constructor(config) : new artDialog.fn.constructor(config);
};

artDialog.version = '5.0';

artDialog.fn = artDialog.prototype = {
    
    /** @inner */
    constructor: function (config) {
        var that = this, dom;
        
        that.closed = false;
        that.config = config;
        that.dom = dom = that.dom || that._getDom();
        
        config.skin && dom.wrap.addClass(config.skin);
        
        dom.wrap.css('position', config.fixed ? 'fixed' : 'absolute');
        dom.close[config.cancel === false ? 'hide' : 'show']();
        dom.content.css('padding', config.padding);
        
        that.button.apply(that, config.button);
        
        that.title(config.title)
        .content(config.content)
        .size(config.width, config.height)
        .time(config.time);
        
        config.follow
        ? that.follow(config.follow)
        : that.position();
        
        that.zIndex();
        config.lock && that.lock();
        
        that._addEvent();
        that[config.visible ? 'visible' : 'hidden']().focus();
        
        _singleton = null;
        
        config.initialize && config.initialize.call(that);
        
        return that;
    },
    
    
    /**
    * 设置内容
    * @param	{String, HTMLElement, Object}	内容 (可选)
    */
    content: function (message) {
    
        var prev, next, parent, display,
            that = this,
            $content = that.dom.content,
            content = $content[0];
        
        
        if (that._elemBack) {
            that._elemBack();
            delete that._elemBack;
        };
        
        
        if (typeof message === 'string') {
        
            $content.html(message);
        } else
        
        if (message && message.nodeType === 1) {
        
            // 让传入的元素在对话框关闭后可以返回到原来的地方
            display = message.style.display;
            prev = message.previousSibling;
            next = message.nextSibling;
            parent = message.parentNode;
            
            that._elemBack = function () {
                if (prev && prev.parentNode) {
                    prev.parentNode.insertBefore(message, prev.nextSibling);
                } else if (next && next.parentNode) {
                    next.parentNode.insertBefore(message, next);
                } else if (parent) {
                    parent.appendChild(message);
                };
                message.style.display = display;
                that._elemBack = null;
            };
            
            $content.html('');
            content.appendChild(message);
            $(message).show();
            
        };
        
        return that.position();
    },
    
    
    /**
    * 设置标题
    * @param	{String, Boolean}	标题内容. 为 false 则隐藏标题栏
    */
    title: function (content) {
    
        var dom = this.dom,
            outer = dom.outer,
            $title = dom.title,
            className = 'd-state-noTitle';
        
        if (content === false) {
            $title.hide().html('');
            outer.addClass(className);
        } else {
            $title.show().html(content);
            outer.removeClass(className);
        };
        
        return this;
    },
    

    /** @inner 位置居中 */
    position: function () {
    
        var that = this,
            dom = that.dom,
            wrap = dom.wrap[0],
            $window = dom.window,
            $document = dom.document,
            fixed = that.config.fixed,
            dl = fixed ? 0 : $document.scrollLeft(),
            dt = fixed ? 0 : $document.scrollTop(),
            ww = $window.width(),
            wh = $window.height(),
            ow = wrap.offsetWidth,
            oh = wrap.offsetHeight,
            left = (ww - ow) / 2 + dl,
            top = top = (oh < 4 * wh / 7 ? wh * 0.382 - oh / 2 : (wh - oh) / 2) + dt,
            style = wrap.style;

        style.left = Math.max(left, dl) + 'px';
        style.top = Math.max(top, dt) + 'px';
        
        return that;
    },
    
    
    /**
    *	尺寸
    *	@param	{Number, String}	宽度
    *	@param	{Number, String}	高度
    */
    size: function (width, height) {
    
        var style = this.dom.main[0].style;
        
        if (typeof width === 'number') {
            width = width + 'px';
        };
        
        if (typeof height === 'number') {
            height = height + 'px';
        };
            
        style.width = width;
        style.height = height;
        
        return this;
    },
    
    
    /**
    * 跟随元素
    * @param	{HTMLElement}
    */
    follow: function (elem) {
    
        var $elem = $(elem),
            that = this,
            config = that.config;
        
        
        // 隐藏元素不可用
        if (!elem || !elem.offsetWidth && !elem.offsetHeight) {
        
            return that.position(that._left, that._top);
        };
        
        var fixed = config.fixed,
            expando = _expando + 'follow',
            dom = that.dom,
            $window = dom.window,
            $document = dom.document,
            winWidth = $window.width(),
            winHeight = $window.height(),
            docLeft =  $document.scrollLeft(),
            docTop = $document.scrollTop(),
            offset = $elem.offset(),
            width = elem.offsetWidth,
            height = elem.offsetHeight,
            left = fixed ? offset.left - docLeft : offset.left,
            top = fixed ? offset.top - docTop : offset.top,
            wrap = that.dom.wrap[0],
            style = wrap.style,
            wrapWidth = wrap.offsetWidth,
            wrapHeight = wrap.offsetHeight,
            setLeft = left - (wrapWidth - width) / 2,
            setTop = top + height,
            dl = fixed ? 0 : docLeft,
            dt = fixed ? 0 : docTop;
            
            
        setLeft = setLeft < dl ? left :
        (setLeft + wrapWidth > winWidth) && (left - wrapWidth > dl)
        ? left - wrapWidth + width
        : setLeft;

        
        setTop = (setTop + wrapHeight > winHeight + dt)
        && (top - wrapHeight > dt)
        ? top - wrapHeight
        : setTop;
        
        
        style.left = setLeft + 'px';
        style.top = setTop + 'px';
        
        
        that._follow && that._follow.removeAttribute(expando);
        that._follow = elem;
        elem[expando] = config.id;
        
        return that;
    },
    
    
    /**
    * 自定义按钮
    * @example
        button({
            value: 'login',
            callback: function () {},
            disabled: false,
            focus: true
        }, .., ..)
    */
    button: function () {
    
        var that = this,
            dom = that.dom,
            $buttons = dom.buttons,
            elem = $buttons[0],
            strongButton = 'd-state-highlight',
            listeners = that._listeners = that._listeners || {},
            ags = [].slice.call(arguments);
            
        var i = 0, val, value, id, isNewButton, button;
        
        for (; i < ags.length; i ++) {
            
            val = ags[i];
            
            value = val.value;
            id = val.id || value;
            isNewButton = !listeners[id];
            button = !isNewButton ? listeners[id].elem : document.createElement('input');
            
            button.type = 'button';
            button.className = 'd-button';
                    
            if (!listeners[id]) {
                listeners[id] = {};
            };
            
            if (value) {
                button.value = value;
            };
            
            if (val.width) {
                button.style.width = val.width;
            };
            
            if (val.callback) {
                listeners[id].callback = val.callback;
            };
            
            if (val.focus) {
                that._focus && that._focus.removeClass(strongButton);
                that._focus = $(button).addClass(strongButton);
                that.focus();
            };
            
            button[_expando + 'callback'] = id;
            button.disabled = !!val.disabled;
            

            if (isNewButton) {
                listeners[id].elem = button;
                elem.appendChild(button);
            };
        };
        
        $buttons[0].style.display = ags.length ? '' : 'none';
        
        return that;
    },
    
    
    /** 显示对话框 */
    visible: function () {
        //this.dom.wrap.show();
        this.dom.wrap.css('visibility', 'visible');
        this.dom.outer.addClass('d-state-visible');
        
        if (this._isLock) {
            this._lockMask.show();
        };
        
        return this;
    },
    
    
    /** 隐藏对话框 */
    hidden: function () {
        //this.dom.wrap.hide();
        this.dom.wrap.css('visibility', 'hidden');
        this.dom.outer.removeClass('d-state-visible');
        
        if (this._isLock) {
            this._lockMask.hide();
        };
        
        return this;
    },
    
    
    /** 关闭对话框 */
    close: function () {
    
        var that = this,
            dom = that.dom,
            $wrap = dom.wrap,
            list = artDialog.list,
            beforeunload = that.config.beforeunload,
            follow = that.config.follow;
        
        if (that.closed) {
            return that;
        };
        
        if (beforeunload && beforeunload.call(that) === false) {
            return that;
        };
        
        
        if (artDialog.focus === that) {
            artDialog.focus = null;
        };
        
        
        if (follow) {
            follow.removeAttribute(_expando + 'follow');
        };
        
        
        if (that._elemBack) {
            that._elemBack();
        };
        
        
        
        that.time();
        that.unlock();
        that._removeEvent();
        delete list[that.config.id];

        
        if (_singleton) {
        
            $wrap.remove();
        
        // 使用单例模式
        } else {
        
            _singleton = that;
            
            dom.title.html('');
            dom.content.html('');
            dom.buttons.html('');
            
            $wrap[0].className = $wrap[0].style.cssText = '';
            dom.outer[0].className = 'd-outer';
            
            $wrap.css({
                left: 0,
                top: 0,
                position: _isFixed ? 'fixed' : 'absolute'
            });
            
            for (var i in that) {
                if (that.hasOwnProperty(i) && i !== 'dom') {
                    delete that[i];
                };
            };
            
            that.hidden();
            
        };
        
        that.closed = true;
        return that;
    },
    
    
    /**
    * 定时关闭
    * @param	{Number}	单位毫秒, 无参数则停止计时器
    */
    time: function (time) {
    
        var that = this,
            timer = that._timer;
            
        timer && clearTimeout(timer);
        
        if (time) {
            that._timer = setTimeout(function(){
                that._click('cancel');
            }, time);
        };
        
        
        return that;
    },
    
    /** @inner 设置焦点 */
    focus: function () {
        var that = this;
        
        if (that.config.focus) {
            //setTimeout(function () {
                try {
                    var elem = that._focus && that._focus[0] || that.dom.close[0];
                    elem && elem.focus();
                // IE对不可见元素设置焦点会报错
                } catch (e) {};
            //}, 0);
        };
        
        return that;
    },
    
    
    /** 置顶对话框 */
    zIndex: function () {
    
        var that = this,
            dom = that.dom,
            top = artDialog.focus,
            index = artDialog.defaults.zIndex ++;
        
        // 设置叠加高度
        dom.wrap.css('zIndex', index);
        that._lockMask && that._lockMask.css('zIndex', index - 1);
        
        // 设置最高层的样式
        top && top.dom.outer.removeClass('d-state-focus');
        artDialog.focus = that;
        dom.outer.addClass('d-state-focus');
        
        return that;
    },
    
    
    /** 设置屏锁 */
    lock: function () {
    
        if (this._isLock) {
            return this;
        };
        
        var that = this,
            config = that.config,
            dom = that.dom,
            div = document.createElement('div'),
            $div = $(div),
            index = artDialog.defaults.zIndex - 1;
        
        that.zIndex();
        dom.outer.addClass('d-state-lock');
            
        $div.css({
            zIndex: index,
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }).addClass('d-mask');
        
        if (!_isFixed) {
            $div.css({
                position: 'absolute',
                width: $(window).width() + 'px',
                height: $(document).height() + 'px'
            });
        };
        
            
        $div.bind('click', function () {
            that._reset();
        }).bind('dblclick', function () {
            that._click('cancel');
        });
        
        document.body.appendChild(div);
        
        that._lockMask = $div;
        that._isLock = true;
        
        return that;
    },
    
    
    /** 解开屏锁 */
    unlock: function () {
        var that = this;
        
        if (!that._isLock) {
            return that;
        };
        
        that._lockMask.unbind();
        that._lockMask.hide();
        that._lockMask.remove();
        
        that.dom.outer.removeClass('d-state-lock');
        that._isLock = false;

        return that;
    },
    
    
    // 获取元素
    _getDom: function () {
    
        var body = document.body;
        
        if (!body) {
            throw new Error('artDialog: "documents.body" not ready');
        };
        
        var wrap = document.createElement('div');
            
        wrap.style.cssText = 'position:absolute;left:0;top:0';
        wrap.innerHTML = artDialog._templates;
        body.insertBefore(wrap, body.firstChild);
        
        var name,
            i = 0,
            dom = {},
            els = wrap.getElementsByTagName('*'),
            elsLen = els.length;
            
        for (; i < elsLen; i ++) {
            name = els[i].className.split('d-')[1];
            if (name) {
                dom[name] = $(els[i]);
            };
        };
        
        dom.window = $(window);
        dom.document = $(document);
        dom.wrap = $(wrap);
        
        return dom;
    },
    
    
    // 按钮回调函数触发
    _click: function (id) {
    
        var that = this,
            fn = that._listeners[id] && that._listeners[id].callback;
            
        return typeof fn !== 'function' || fn.call(that) !== false ?
            that.close() : that;
    },
    
    
    // 重置位置
    _reset: function () {
        var elem = this.config.follow;
        elem ? this.follow(elem) : this.position();
    },
    
    
    // 事件代理
    _addEvent: function () {
    
        var that = this,
            dom = that.dom;
        
        
        // 监听点击
        dom.wrap
        .bind('click', function (event) {
        
            var target = event.target, callbackID;
            
            // IE BUG
            if (target.disabled) {
                return false;
            };
            
            if (target === dom.close[0]) {
                that._click('cancel');
                return false;
            } else {
                callbackID = target[_expando + 'callback'];
                callbackID && that._click(callbackID);
            };
            
        })
        .bind('mousedown', function () {
            that.zIndex();
        });
        
    },
    
    
    // 卸载事件代理
    _removeEvent: function () {
        this.dom.wrap.unbind();
    }
    
};

artDialog.fn.constructor.prototype = artDialog.fn;



$.fn.dialog = $.fn.artDialog = function () {
    var config = arguments;
    this[this.live ? 'live' : 'bind']('click', function () {
        artDialog.apply(this, config);
        return false;
    });
    return this;
};



/** 最顶层的对话框API */
artDialog.focus = null;



/**
* 根据 ID 获取某对话框 API
* @param	{String}	对话框 ID
* @return	{Object}	对话框 API (实例)
*/
artDialog.get = function (id) {
    return id === undefined
    ? artDialog.list
    : artDialog.list[id];
};

artDialog.list = {};



// 全局快捷键
$(document).bind('keydown', function (event) {
    var target = event.target,
        nodeName = target.nodeName,
        rinput = /^input|textarea$/i,
        api = artDialog.focus,
        keyCode = event.keyCode;

    if (!api || !api.config.esc || rinput.test(nodeName) && target.type !== 'button') {
        return;
    };
    
    // ESC
    keyCode === 27 && api._click('cancel');
});



// 浏览器窗口改变后重置对话框位置
$(window).bind('resize', function () {
    var dialogs = artDialog.list;
    for (var id in dialogs) {
        dialogs[id]._reset();
    };
});



// XHTML 模板
// 使用 uglifyjs 压缩能够预先处理"+"号合并字符串
// @see	http://marijnhaverbeke.nl/uglifyjs
artDialog._templates = 
'<div class="d-outer">'
+	'<table class="d-border">'
+		'<tbody>'
+			'<tr>'
+				'<td class="d-nw"></td>'
+				'<td class="d-n"></td>'
+				'<td class="d-ne"></td>'
+			'</tr>'
+			'<tr>'
+				'<td class="d-w"></td>'
+				'<td class="d-c">'
+					'<div class="d-inner">'
+					'<table class="d-dialog">'
+						'<tbody>'
+							'<tr>'
+								'<td class="d-header">'
+									'<div class="d-titleBar">'
+										'<div class="d-title"></div>'
+										'<a class="d-close" href="javascript:/*artDialog*/;">'
+											'\xd7'
+										'</a>'
+									'</div>'
+								'</td>'
+							'</tr>'
+							'<tr>'
+								'<td class="d-main">'
+									'<div class="d-content"></div>'
+								'</td>'
+							'</tr>'
+							'<tr>'
+								'<td class="d-footer">'
+									'<div class="d-buttons"></div>'
+								'</td>'
+							'</tr>'
+						'</tbody>'
+					'</table>'
+					'</div>'
+				'</td>'
+				'<td class="d-e"></td>'
+			'</tr>'
+			'<tr>'
+				'<td class="d-sw"></td>'
+				'<td class="d-s"></td>'
+				'<td class="d-se"></td>'
+			'</tr>'
+		'</tbody>'
+	'</table>'
+'</div>';



/**
 * 默认配置
 */
artDialog.defaults = {

    // 消息内容
    content: '<div class="d-loading"><span>loading..</span></div>',
    
    // 标题
    title: 'message',
    
    // 自定义按钮
    button: null,
    
    // 确定按钮回调函数
    ok: null,
    
    // 取消按钮回调函数
    cancel: null,
    
    // 对话框初始化后执行的函数
    initialize: null,
    
    // 对话框关闭前执行的函数
    beforeunload: null,
    
    // 确定按钮文本
    okValue: 'ok',
    
    // 取消按钮文本
    cancelValue: 'cancel',
    
    // 内容宽度
    width: 'auto',
    
    // 内容高度
    height: 'auto',
    
    // 内容与边界填充距离
    padding: '20px 25px',
    
    // 皮肤名(多皮肤共存预留接口)
    skin: null,
    
    // 自动关闭时间
    time: null,
    
    // 是否支持Esc键关闭
    esc: true,
    
    // 是否支持对话框按钮自动聚焦
    focus: true,
    
    // 初始化后是否显示对话框
    visible: true,
    
    // 让对话框跟随某元素
    follow: null,
    
    // 是否锁屏
    lock: false,
    
    // 是否固定定位
    fixed: false,
    
    // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
    zIndex: 1987
    
};

this.artDialog = $.dialog = $.artDialog = artDialog;
}(this.art || this.jQuery, this));




/* 更新记录

1.  follow 不再支持 String 类型
2.  button 参数只支持 Array 类型
3.  button name 成员改成 value
4.  button 增加 id 成员
5.  okVal 参数更名为 okValue, 默认值由 '确定' 改为 'ok'
6.  cancelVal 参数更名为 cancelValue, 默认值由 '取消' 改为 'cancel'
6.  close 参数更名为 beforeunload
7.  init 参数更名为 initialize
8.  title 参数默认值由 '消息' 改为 'message'
9.  time 参数与方法参数单位由秒改为毫秒
10. hide 参数方法更名为 hidden
11. 内部为皮肤增加动态样式 d-state-visible 类
12. 给遮罩增添样式 d-mask 类
13. background 参数被取消, 由 CSS 文件定义
14. opacity 参数被取消, 由 CSS 文件定义
15. 取消拖动特性，改由插件支持
16. 取消 left 与 top 参数
17. 取消对 ie6 提供 fixed 支持，自动转换为 absolute
18. 取消对 ie6 提供 alpha png 支持
19. 取消对 ie6 提供 select 标签遮盖支持
20. 增加 focus 参数
21. 取消 position 方法
22. 取消对 <script type="text/dialog"></script> 的支持
23. 取消对 iframe 的支持
24. title 方法不支持空参数
25. content 方法不支持空参数
26. button 方法的参数不支持数组类型
27. 判断 DOCTYPE, 对 xhtml1.0 以下的页面报告错误
28. 修复 IE8 动态等新内容时没有撑开对话框高度，特意为 ie8 取消 .d-content { display:inline-block }
29. show 参数与方法更名为 visible

*/

