/*!
 * artDialog basic
 * Date: 2011-08-28 23:14
 * http://code.google.com/p/artdialog/
 * (c) 2009-2011 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */
 
;(function (window, undefined) {
if (window.jQuery) return jQuery;

var $ = window.art = function (selector, content) {
    	return new $.fn.init(selector, content);
	},
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,
	rclass = /[\n\t]/g;

if (window.$ === undefined) window.$ = $;
$.fn = $.prototype = {
	constructor: $,

    /**
	 * 判断样式类是否存在
	 * @param	{String}	名称
	 * @return	{Boolean}
	 */
    hasClass: function (name) {		
		var className = ' ' + name + ' ';
		if ((' ' + this[0].className + ' ').replace(rclass, ' ').indexOf(className) > -1) return true;

		return false;
    },

    /**
	 * 添加样式类
	 * @param	{String}	名称
	 */
    addClass: function (name) {
        if (!this.hasClass(name)) this[0].className += ' ' + name;

        return this;
    },

    /**
	 * 移除样式类
	 * @param	{String}	名称
	 */
    removeClass: function (name) {
        var elem = this[0];

        if (!name) {
            elem.className = '';
        } else
		if (this.hasClass(name)) {
            elem.className = elem.className.replace(name, ' ');
        };

        return this;
    },

    /**
	 * 读写样式<br />
     * css(name) 访问第一个匹配元素的样式属性<br />
     * css(properties) 把一个"名/值对"对象设置为所有匹配元素的样式属性<br />
     * css(name, value) 在所有匹配的元素中，设置一个样式属性的值<br />
	 */
    css: function (name, value) {
        var i, elem = this[0], obj = arguments[0];

        if (typeof name === 'string') {
            if (value === undefined) {
                return $.css(elem, name);
            } else {
                elem.style[name] = value;
            };
        } else {
            for (i in obj) {
				elem.style[i] = obj[i];
			};
        };

        return this;
    },
	
	/** 显示元素 */
	show: function () {
		return this.css('display', 'block');
	},
	
	/** 隐藏元素 */
	hide: function () {
		return this.css('display', 'none');
	},

    /**
	 * 获取相对文档的坐标
	 * @return	{Object}	返回left、top的数值
	 */
    offset: function () {
        var elem = this[0],
            box = elem.getBoundingClientRect(),
            doc = elem.ownerDocument,
            body = doc.body,
            docElem = doc.documentElement,
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop,
            left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;

        return {
            left: left,
            top: top
        };
    },
	
	/**
	 * 读写HTML - (不支持文本框)
	 * @param	{String}	内容
	 */
	html: function (content) {
		var elem = this[0];
		
		if (content === undefined) return elem.innerHTML;
		$.cleanData(elem.getElementsByTagName('*'));
		elem.innerHTML = content;
		
		return this;
	},
	
	/**
	 * 移除节点
	 */
	remove: function () {
		var elem = this[0];

		$.cleanData(elem.getElementsByTagName('*'));
		$.cleanData([elem]);
		elem.parentNode.removeChild(elem);
		
		return this;
	},

	/**
	 * 事件绑定
	 * @param	{String}	类型
	 * @param	{Function}	要绑定的函数
	 */
	bind: function (type, callback) {
		$.event.add(this[0], type, callback);
		return this;
	},

	/**
	 * 移除事件
	 * @param	{String}	类型
	 * @param	{Function}	要卸载的函数
	 */
	unbind: function(type, callback) {
		$.event.remove(this[0], type, callback);
		return this;
	}
	
};

$.fn.init = function (selector, context) {
	var match, elem;
	context = context || document;
	
	if (!selector) return this;
	
	if (selector.nodeType) {
		this[0] = selector;
		return this;
	};
		
	if (typeof selector === 'string') {
		match = quickExpr.exec(selector);

		if (match && match[2]) {
			elem = context.getElementById(match[2]);
			if (elem && elem.parentNode) this[0] = elem;
			return this;
		};
	};
	
	this[0] = selector;
	return this;
};
$.fn.init.prototype = $.fn;

/** 空函数 */
$.noop = function () {};

/** 检测window */
$.isWindow = function (obj) {
	return obj && typeof obj === 'object' && 'setInterval' in obj;
};

/** 数组判定 */
$.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * 搜索子元素
 * 注意：只支持nodeName或.className的形式，并且只返回第一个元素
 * @param	{String}
 */
$.fn.find = function (expr) {
	var value, elem = this[0],
		className = expr.split('.')[1];

	if (className) {
		if (document.getElementsByClassName) {
			value = elem.getElementsByClassName(className);
		} else {
			value = getElementsByClassName(className, elem);
		};
	} else {
		value = elem.getElementsByTagName(expr);
	};
	
	return $(value[0]);
};
function getElementsByClassName (className, node, tag) {
	node = node || document;
	tag = tag || '*';
	var i = 0,
		j = 0,
		classElements = [],
		els = node.getElementsByTagName(tag),
		elsLen = els.length,
		pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
		
	for (; i < elsLen; i ++) {
		if (pattern.test(els[i].className)) {
			classElements[j] = els[i];
			j ++;
		};
	};
	return classElements;
};

/**
 * 遍历
 * @param {Object}
 * @param {Function}
 */
$.each = function (obj, callback) {
    var name, i = 0,
        length = obj.length,
        isObj = length === undefined;

    if (isObj) {
        for (name in obj) {
            if (callback.call(obj[name], name, obj[name]) === false) break;
        };
    } else {
        for (var value = obj[0]; i < length && callback.call(value, i, value) !== false; value = obj[++i]) {};
    };
	
	return obj;
};

/**
 * 读写缓存
 * @param		{HTMLElement}	元素
 * @param		{String}		缓存名称
 * @param		{Any}			数据
 * @return		{Any}			如果无参数data则返回缓存数据
 */
$.data = function (elem, name, data) {
	var cache = $.cache,
		id = uuid(elem);
	
	if (name === undefined) return cache[id];
	if (!cache[id]) cache[id] = {};
	if (data !== undefined) cache[id][name] = data;
	
	return cache[id][name];
};

/**
 * 删除缓存
 * @param		{HTMLElement}	元素
 * @param		{String}		缓存名称
 */
$.removeData = function (elem, name) {
	var empty = true,
		expando = $.expando,
		cache = $.cache,
		id = uuid(elem),
		thisCache = id && cache[id];

	if (!thisCache) return;
	if (name) {
		delete thisCache[name];
		for (var n in thisCache) empty = false;
		if (empty) delete $.cache[id];
	} else {
		delete cache[id];
		if (elem.removeAttribute) {
			elem.removeAttribute(expando);
		} else {
			elem[expando] = null;
		};
	};
};

$.uuid = 0;
$.cache = {};
$.expando = '@cache' + (new Date).getTime();

// 标记元素唯一身份
function uuid (elem) {
	var expando = $.expando,
		id = elem === window ? 0 : elem[expando];
	if (id === undefined) elem[expando] = id = ++ $.uuid;
	return id;
};


/**
 * 事件机制
 * @namespace
 * @requires	[$.data, $.removeData]
 */
$.event = {
	
	/**
	 * 添加事件
	 * @param		{HTMLElement}	元素
	 * @param		{String}		事件类型
	 * @param		{Function}		要添加的函数
	 */
	add: function (elem, type, callback) {
		var cache, listeners,
			that = $.event,
			data = $.data(elem, '@events') || $.data(elem, '@events', {});
		
		cache = data[type] = data[type] || {};
		listeners = cache.listeners = cache.listeners || [];
		listeners.push(callback);
		
		if (!cache.handler) {
			cache.elem = elem;
			cache.handler = that.handler(cache);
			
			document.addEventListener
			? elem.addEventListener(type, cache.handler, false)
			: elem.attachEvent('on' + type, cache.handler);
		};
	},
	
	/**
	 * 卸载事件
	 * @param		{HTMLElement}	元素
	 * @param		{String}		事件类型
	 * @param		{Function}		要卸载的函数
	 */
	remove: function (elem, type, callback) {
		var i, cache, listeners,
			that = $.event,
			empty = true,
			data = $.data(elem, '@events');
		
		if (!data) return;
		if (!type) {
			for (i in data) that.remove(elem, i);
			return;
		};
		
		cache = data[type];
		if (!cache) return;
		
		listeners = cache.listeners;
		if (callback) {
			for (i = 0; i < listeners.length; i ++) {
				listeners[i] === callback && listeners.splice(i--, 1);
			};
		} else {
			cache.listeners = [];
		};
		
		if (cache.listeners.length === 0) {
			document.removeEventListener
			? elem.removeEventListener(type, cache.handler, false)
			: elem.detachEvent('on' + type, cache.handler);
			
			delete data[type];
			cache = $.data(elem, '@events');
			for (var n in cache) empty = false;
			if (empty) $.removeData(elem, '@events');
		};
	},
	
	/** @inner 事件监听器 */
	handler: function (cache) {
		return function (event) {
			// 使IE6/7/8事件回调函数第一参数接收Event对象
			event = $.event.fix(event || window.event);
			for (var i = 0, list = cache.listeners, fn; fn = list[i++];) {
				if (fn.call(cache.elem, event) === false) {
					event.preventDefault();
					event.stopPropagation();
				};
			};
		};
	},
	
	/** @inner Event对象兼容处理 */
	fix: function (event) {
		if (event.target) return event;
		
		var event2 = {
			target: event.srcElement || document,
			preventDefault: function () {event.returnValue = false},
			stopPropagation: function () {event.cancelBubble = true}
		};
		// IE6/7/8 在原生window.event对象写入数据会导致内存无法回收，应当采用拷贝
		for (var i in event) event2[i] = event[i];
		return event2;
	}
	
};

/**
 * 清理元素集的事件与缓存
 * @requires	[$.removeData, $.event]
 * @param		{HTMLCollection}	元素集
 */
$.cleanData = function (elems) {
	var i = 0, elem,
		len = elems.length,
		removeEvent = $.event.remove,
		removeData = $.removeData;
	
	for (; i < len; i ++) {
		elem = elems[i];
		removeEvent(elem);
		removeData(elem);
	};
};

// 获取css
$.css = 'defaultView' in document && 'getComputedStyle' in document.defaultView ?
	function (elem, name) {
		return document.defaultView.getComputedStyle(elem, false)[name]
} :
	function (elem, name) {
		return elem.currentStyle[name] || '';
};

/**
 * 获取滚动条位置 - [不支持写入]
 * $.fn.scrollLeft, $.fn.scrollTop
 * @example		获取文档垂直滚动条：$(document).scrollTop()
 * @return		{Number}	返回滚动条位置
 */
$.each(['Left', 'Top'], function (i, name) {
    var method = 'scroll' + name;

    $.fn[method] = function (val) {
        var elem = this[0], win;

		win = getWindow(elem);
		return win ?
			('pageXOffset' in win) ?
				win[i ? 'pageYOffset' : 'pageXOffset'] :
				win.document.documentElement[method] || win.document.body[method] :
			elem[method];
    };
});

function getWindow (elem) {
	return $.isWindow(elem) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
};

/**
 * 获取窗口或文档尺寸 - [只支持window与document读取]
 * @example 
   获取文档宽度：$(document).width()
   获取可视范围：$(window).width()
 * @return	{Number}
 */
$.each(['Height', 'Width'], function (i, name) {
    var type = name.toLowerCase();

    $.fn[type] = function (size) {
        var elem = this[0];
        if (!elem) {
            return size == null ? null : this;
        };

		return $.isWindow(elem) ?
			elem.document.documentElement['client' + name] || elem.document.body['client' + name] :
			(elem.nodeType === 9) ?
				Math.max(
					elem.documentElement['client' + name],
					elem.body['scroll' + name], elem.documentElement['scroll' + name],
					elem.body['offset' + name], elem.documentElement['offset' + name]
				) : null;
    };

});

//-------------end
return $}(window));






//------------------------------------------------
// 对话框模块
//------------------------------------------------
;(function ($, window, undefined) {

$.noop = $.noop || function () {}; // jQuery 1.3.2
var _box,
	_count = 0,
	_$window = $(window),
	_$document = $(document),
	_elem = document.documentElement,
	_isIE6 = window.VBArray && !window.XMLHttpRequest,
	_isMobile = 'createTouch' in document && !('onmousemove' in _elem)
		|| /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
	_isFixed = !_isIE6 && !_isMobile,
	_expando = 'artDialog' + (new Date).getTime();

var artDialog = function (config, ok, cancel) {
	config = config || {};
	if (typeof config === 'string' || config.nodeType === 1) {
		config = {content: config, fixed: !_isMobile};
	};
	
	var api, buttons = [],
		defaults = artDialog.defaults,
		elem = config.follow = this.nodeType === 1 && this || config.follow;
		
	// 合并默认配置
	for (var i in defaults) {
		if (config[i] === undefined) config[i] = defaults[i];		
	};
	
	// 兼容v4.1.0之前的参数，未来版本将删除此
	$.each({ok:"yesFn",cancel:"noFn",close:"closeFn",init:"initFn",okVal:"yesText",cancelVal:"noText"},
	function(i,o){config[i]=config[i]!==undefined?config[i]:config[o]});
	
	// 返回跟随模式或重复定义的ID
	if (typeof elem === 'string') elem = $(elem)[0];
	config.id = elem && elem[_expando + 'follow'] || config.id || _expando + _count;
	api = artDialog.list[config.id];
	if (elem && api) return api.follow(elem).focus();
	if (api) return api.focus();
	
	// 目前主流移动设备对fixed支持不好
	if (!_isFixed) config.fixed = false;
	
	// 按钮队列
	if (!$.isArray(config.button)) {
		config.button = config.button ? [config.button] : [];
	};
	if (ok !== undefined) config.ok = ok;
	if (cancel !== undefined) config.cancel = cancel;
	config.ok && config.button.push({
		name: config.okVal,
		callback: config.ok,
		focus: true
	});
	config.cancel && config.button.push({
		name: config.cancelVal,
		callback: config.cancel
	});
	
	// zIndex全局配置
	artDialog.defaults.zIndex = config.zIndex;
	
	_count ++;

	return artDialog.list[config.id] = _box ?
		_box._init(config) : new artDialog.fn._init(config);
};

artDialog.fn = artDialog.prototype = {
	
	_init: function (config) {
		var that = this, DOM;
		
		that.config = config;
		that._listeners = {};
		that._elemBack = that._timer = that._focus = that._isClose = that._lock = null;
		
		DOM = that.DOM = that.DOM || that._getDOM();
		DOM.wrap.addClass(config.skin);
		DOM.wrap.css('position', config.fixed ? 'fixed' : 'absolute');
		DOM.close[config.cancel === false ? 'hide' : 'show']();
		DOM.se.css('cursor', config.resize ? 'se-resize' : 'auto');
		DOM.title.css('cursor', config.drag ? 'move' : 'auto');
		DOM.content.css('padding', config.padding);
		
		that[config.show ? 'show' : 'hide'](false)
		.button(config.button)
		.title(config.title)
		.content(config.content)
		.size(config.width, config.height)
		.time(config.time);
		
		config.follow
		? that.follow(config.follow)
		: that.position();
		
		that.focus(config.focus);
		config.lock && that.lock();
		
		that._addEvent();
		_box = null;
		
		config.init && config.init.call(that, window);
		return that;
	},
	
	/**
	 * 设置内容
	 * @param	{String, HTMLElement, Object}	内容 (可选)
	 * @return	{this, HTMLElement}				如果无参数则返回内容容器DOM对象
	 */
	content: function (msg) {
		var prev, next, parent, display,
			that = this,
			$content = that.DOM.content,
			content = $content[0];
		
		that._elemBack = null;

		if (msg === undefined) return content;
		if (typeof msg === 'string') {
			$content.html(msg);
		} else if (msg && msg.nodeType === 1) {
		
			// 让传入的元素在对话框关闭后可以返回到原来的地方
			display = msg.style.display;
			prev = msg.previousSibling;
			next = msg.nextSibling;
			parent = msg.parentNode;
			that._elemBack = function () {
				if (prev && prev.parentNode) {
					prev.parentNode.insertBefore(msg, prev.nextSibling);
				} else if (next && next.parentNode) {
					next.parentNode.insertBefore(msg, next);
				} else if (parent) {
					parent.appendChild(msg);
				};
				msg.style.display = display;
			};
			
			$content.html('');
			content.appendChild(msg);
			msg.style.display = 'block';
			
		};
		
		return that.position();
	},
	
	/**
	 * 设置标题
	 * @param	{String, Boolean}	标题内容. 为false则隐藏标题栏
	 * @return	{this, HTMLElement}	如果无参数则返回内容器DOM对象
	 */
	title: function (text) {
		var DOM = this.DOM,
			wrap = DOM.wrap,
			title = DOM.title,
			className = 'aui_state_noTitle';
			
		if (text === undefined) return title[0];
		if (text === false) {
			title.hide().html('');
			wrap.addClass(className);
		} else {
			title.show().html(text);
			wrap.removeClass(className);
		};
		
		return this;
	},
	

	/* 位置居中 */
	position: function () {
		var that = this,
			wrap = that.DOM.wrap[0],
			fixed = that.config.fixed,
			dl = fixed ? 0 : _$document.scrollLeft(),
			dt = fixed ? 0 : _$document.scrollTop(),
			ww = _$window.width(),
			wh = _$window.height(),
			ow = wrap.offsetWidth,
			oh = wrap.offsetHeight,
			left = (ww - ow) / 2 + dl,
			top = top = (oh < 4 * wh / 7 ? wh * 0.382 - oh / 2 : (wh - oh) / 2) + dt,
			style = wrap.style;

		style.left = Math.max(left, dl) + 'px';
		style.top = Math.max(top, dt) + 'px';
		
		/*that.config.follow = null;*/
		return that;
	},
	
	/**
	 *	尺寸
	 *	@param	{Number, String}	宽度
	 *	@param	{Number, String}	高度
	 */
	size: function (width, height) {
		var style = this.DOM.main[0].style;
		
		if (typeof width === 'number') width = width + 'px';
		if (typeof height === 'number') height = height + 'px';
			
		style.width = width;
		style.height = height;
		
		return this;
	},
	
	/**
	 * 跟随元素
	 * @param	{HTMLElement}
	 */
	follow: function (elem) {
		var $elem, that = this;

		if (typeof elem === 'string' || elem && elem.nodeType === 1) {
			$elem = $(elem);
		};
		if (!$elem || $elem.css('display') === 'none') {
			return that.position();
		};
		
		var fixed = that.config.fixed,
			winWidth = _$window.width(),
			winHeight = _$window.height(),
			docLeft =  _$document.scrollLeft(),
			docTop = _$document.scrollTop(),
			offset = $elem.offset(),
			width = $elem[0].offsetWidth,
			height = $elem[0].offsetHeight,
			left = fixed ? offset.left - docLeft : offset.left,
			top = fixed ? offset.top - docTop : offset.top,
			wrap = that.DOM.wrap[0],
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
		
		that.config.follow = elem;
		$elem[0][_expando + 'follow'] = that.config.id;
		return that;
	},
	
	/**
	 * 自定义按钮
	 * @example
		button({
			name: 'login',
			callback: function () {},
			disabled: false,
			focus: true
		}, .., ..)
	 */
	button: function () {
		var that = this,
			ags = arguments,
			DOM = that.DOM,
			wrap = DOM.wrap,
			buttons = DOM.buttons,
			elem = buttons[0],
			strongButton = 'aui_state_highlight',
			list = $.isArray(ags[0]) ? ags[0] : [].slice.call(ags);
		
		if (ags[0] === undefined) return elem;
		$.each(list, function (i, val) {
			var name = val.name,
				listeners = that._listeners,
				isNewButton = !listeners[name],
				button = !isNewButton ?
					listeners[name].elem :
					document.createElement('button');
					
			if (!listeners[name]) listeners[name] = {};
			if (val.callback) listeners[name].callback = val.callback;
			if (val.className) button.className = val.className;
			if (val.focus) {
				that._focus && that._focus.removeClass(strongButton);
				that._focus = $(button).addClass(strongButton);
				that.focus();
			};
			
			button[_expando + 'callback'] = name;
			button.disabled = !!val.disabled;

			if (isNewButton) {
				button.innerHTML = name;
				listeners[name].elem = button;
				elem.appendChild(button);
			};
		});
		
		buttons[0].style.display = list.length ? '' : 'none';
		return that;
	},
	
	/** 显示对话框 */
	show: function () {
		this.DOM.wrap.show();
		arguments[0] && this._lockMaskWrap && this._lockMaskWrap.show();
		return this;
	},
	
	/** 隐藏对话框 */
	hide: function () {
		this.DOM.wrap.hide();
		arguments[0] && this._lockMaskWrap && this._lockMaskWrap.hide();
		return this;
	},
	
	/** 关闭对话框 */
	close: function () {
		var that = this,
			DOM = that.DOM,
			wrap = DOM.wrap,
			list = artDialog.list,
			fn = that.config.close,
			follow = that.config.follow;
		
		if (that._isClose) return that;
		that.time();
		if (typeof fn === 'function' && fn.call(that, window) === false) {
			return that;
		};
		
		that.unlock();
		wrap[0].className = wrap[0].style.cssText = '';
		
		that._elemBack && that._elemBack();
		DOM.title.html('');
		DOM.content.html('');
		DOM.buttons.html('');
		
		if (artDialog.focus === that) artDialog.focus = null;
		if (follow) follow[_expando + 'follow'] = null;
		delete list[that.config.id];
		that._isClose = true;
		that._removeEvent();
		that.hide(true);
		
		_box ? wrap.remove() : _box = that;
		return that;
	},
	
	/**
	 * 定时关闭
	 * @param	{Number}	单位为秒, 无参数则停止计时器
	 */
	time: function (second) {
		var that = this,
			cancel = that.config.cancelVal,
			timer = that._timer;
			
		timer && clearTimeout(timer);
		
		if (second) {
			that._timer = setTimeout(function(){
				that._trigger(cancel);
			}, 1000 * second);
		};
		
		return that;
	},
	
	/** 设置焦点 */
	focus: function () {
		var elemFocus,
			that = this,
			DOM = that.DOM,
			wrap = DOM.wrap,
			top = artDialog.focus,
			index = artDialog.defaults.zIndex ++;
		
		// 设置叠加高度
		wrap.css('zIndex', index);
		that._lockMask && that._lockMask.css('zIndex', index - 1);
		
		// 设置最高层的样式
		top && top.DOM.wrap.removeClass('aui_state_focus');
		artDialog.focus = that;
		wrap.addClass('aui_state_focus');
		
		// 添加焦点
		if (arguments[0] !== false) {
			try {
				elemFocus = that._focus && that._focus[0] || DOM.close[0];
				elemFocus && elemFocus.focus();
			} catch (e) {}; // IE对不可见元素设置焦点会报错
		};
		
		return that;
	},
	
	/** 设置屏锁 */
	lock: function () {
		if (this._lock) return this;
		
		var that = this,
			index = artDialog.defaults.zIndex - 1,
			wrap = that.DOM.wrap,
			config = that.config,
			opacity = 'filter:alpha(opacity=' + (config.opacity * 100) + ');opacity:' + config.opacity,
			docWidth = _$window.width(),
			docHeight = _$document.height(),
			lockMaskWrap = that._lockMaskWrap || $(document.body.appendChild(document.createElement('div'))),
			lockMask = that._lockMask || $(lockMaskWrap[0].appendChild(document.createElement('div'))),
			sizeCss = !_isFixed ? 'position:absolute;width:' + docWidth + 'px;height:' + docHeight
				+ 'px' : 'position:fixed;width:100%;height:100%';
		
		that.focus(false);
		wrap.addClass('aui_state_lock');
		
		lockMaskWrap[0].style.cssText = sizeCss + ';z-index:'
			+ index + ';top:0;left:0;overflow:hidden;';
		lockMask[0].style.cssText = 'height:100%;background:'
			+ config.background + ';' + opacity;
			
		lockMask[0].ondblclick = function () { that.close() };
		
		that._lockMaskWrap = lockMaskWrap;
		that._lockMask = lockMask;
		
		that._lock = true;
		return that;
	},
	
	/** 解开屏锁 */
	unlock: function () {
		var that = this;
		
		if (!that._lock) return that;
		that.DOM.wrap.removeClass('aui_state_lock');
		that._lockMask[0].ondblclick = null;
		that._lockMaskWrap.hide();
		that._lock = false;
		if (_box) {
			that._lockMaskWrap.remove();
			that._lockMaskWrap = that._lockMask = null;
		};

		return that;
	},
	
	// 获取元素
	_getDOM: function (wrap) {
		wrap = document.createElement('div');
		wrap.style.cssText = 'position:absolute;left:0;top:0';
		wrap.innerHTML = artDialog.templates;
		document.body.appendChild(wrap);
		
		var name, i = 0,
			DOM = {wrap: $(wrap)},
			els = wrap.getElementsByTagName('*'),
			elsLen = els.length;
			
		for (; i < elsLen; i ++) {
			name = els[i].className.split('aui_')[1];
			if (name) DOM[name] = $(els[i]);
		};
		
		return DOM;
	},
	
	// 按钮事件触发
	_trigger: function (name) {
		var that = this,
			fn = that._listeners[name] && that._listeners[name].callback;
		return typeof fn !== 'function' || fn.call(that) !== false ?
			that.close() : that;
	},
	
	// 事件代理
	_addEvent: function () {
		var winResize, resizeTimer,
			that = this,
			DOM = that.DOM,
			winSize = _$window.width() * _$window.height();
		
		winResize = function () {
			var newSize,
				oldSize = winSize,
				elem = that.config.follow;
			
			if ('all' in document) {
				// IE6~7 window.onresize bug
				newSize = _$window.width() * _$window.height();
				winSize = newSize;
				if (oldSize === newSize) return;
			};
			
			
			if (elem) {
				that.follow(elem);
			} else {
				that.position();
			};
		};
		
		that._winResize = function () {
			resizeTimer && clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				winResize();
			}, 40);
		};
		
		// 窗口调节事件
		_$window.bind('resize', that._winResize);
		
		// 监听点击
		DOM.wrap
		.bind('click', function (event) {
			var target = event.target, callbackID;
			
			if (target.disabled) return false; // IE BUG
			
			if (target === DOM.close[0]) {
				that._trigger(that.config.cancelVal);
				return false;
			} else {
				callbackID = target[_expando + 'callback'];
				callbackID && that._trigger(callbackID);
			};
		})
		.bind('mousedown', function () {
			that.focus(false);
		});
	},
	
	// 卸载事件代理
	_removeEvent: function () {
		var that = this,
			DOM = that.DOM;
		
		DOM.wrap.unbind();
		_$window.unbind('resize', that._winResize);
	}
	
};

artDialog.fn._init.prototype = artDialog.fn;
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



/** 对话框列表 */
artDialog.list = {};



// 全局快捷键
_$document.bind('keydown', function (event) {
	var target = event.target,
		nodeName = target.nodeName,
		rinput = /^INPUT|TEXTAREA$/,
		api = artDialog.focus,
		keyCode = event.keyCode;

	if (!api || !api.config.esc || rinput.test(nodeName)) return;
		
	keyCode === 27 && api._trigger(api.config.cancelVal);
});



/** 模板 */
artDialog.templates = [
'<div class="aui_outer">',
	'<table class="aui_border">',
		'<tbody>',
			'<tr>',
				'<td class="aui_nw"></td>',
				'<td class="aui_n"></td>',
				'<td class="aui_ne"></td>',
			'</tr>',
			'<tr>',
				'<td class="aui_w"></td>',
				'<td class="aui_center">',
					'<table class="aui_inner">',
						'<tbody>',
							'<tr>',
								'<td class="aui_header">',
									'<div class="aui_titleBar">',
										'<div class="aui_title"></div>',
										'<a class="aui_close" href="javascript:/*artDialog*/;">',
											'\xd7',
										'</a>',
									'</div>',
								'</td>',
							'</tr>',
							'<tr>',
								'<td class="aui_main">',
									'<div class="aui_content"></div>',
								'</td>',
							'</tr>',
							'<tr>',
								'<td class="aui_footer">',
									'<div class="aui_buttons"></div>',
								'</td>',
							'</tr>',
						'</tbody>',
					'</table>',
				'</td>',
				'<td class="aui_e"></td>',
			'</tr>',
			'<tr>',
				'<td class="aui_sw"></td>',
				'<td class="aui_s"></td>',
				'<td class="aui_se"></td>',
			'</tr>',
		'</tbody>',
	'</table>',
'</div>'
].join('');



/**
 * 默认配置
 */
artDialog.defaults = {
								// 消息内容
	content: '<div class="aui_loading"><span>loading..</span></div>',
	title: '\u6d88\u606f',		// 标题. 默认'消息'
	button: null,				// 自定义按钮
	ok: null,					// 确定按钮回调函数
	cancel: null,				// 取消按钮回调函数
	init: null,					// 对话框初始化后执行的函数
	close: null,				// 对话框关闭前执行的函数
	okVal: '\u786E\u5B9A',		// 确定按钮文本. 默认'确定'
	cancelVal: '\u53D6\u6D88',	// 取消按钮文本. 默认'取消'
	width: 'auto',				// 内容宽度
	height: 'auto',				// 内容高度
	padding: '20px 25px',		// 内容与边界填充距离
	skin: '',					// 皮肤名(多皮肤共存预留接口)
	time: null,					// 自动关闭时间
	esc: true,					// 是否支持Esc键关闭
	focus: true,				// 是否支持对话框按钮聚焦
	show: true,					// 初始化后是否显示对话框
	follow: null,				// 跟随某元素(即让对话框在元素附近弹出)
	lock: false,				// 是否锁屏
	background: '#000',			// 遮罩颜色
	opacity: .7,				// 遮罩透明度
	fixed: false,				// 是否静止定位
	zIndex: 1987				// 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
	
};

window.artDialog = $.dialog = $.artDialog = artDialog;
}((window.jQuery && (window.art = jQuery)) || window.art, this));

