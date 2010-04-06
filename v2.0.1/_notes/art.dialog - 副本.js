(function() {
	var k, install = true,
	boxs = [],
	moon = false,
	sun,
	M = {
		x: 0,//距离文档的X轴坐标
		y: 0,//距离文档的Y轴坐标
		t: 0,//对话框top值
		l: 0,//对话框left值
		w: 300,//对话框宽度
		h: 300,//对话框高度
		//Sw: 1024,//[预留]
		//Sh: 768,//[预留]
		st: 0//被滚动条卷去的文档高度
	},
	z = 999999999,//对话框初始叠加高度
	dom = document.documentElement || document.body,
	Each = function(a, b) {
		for (var i = 0,len = a.length; i < len; i++) b(a[i], i);
	},
	//?
	kiss = function(b, s) {
		var e = b || window.event;
		M.x = e.clientX;
		M.y = e.clientY;
		M.t = parseInt(this.target.style.top);
		M.l = parseInt(this.target.style.left);
		M.w = parseInt(this.target.style.width);
		M.h = parseInt(this.target.style.height);
		M.st = dom.scrollTop;
		moon = true;
		sun = this;
		sun.resetZ();
		if (s == "d") {
			document.onmousemove = function(a) {
				drag.call(sun, a);
			}
		} else {
			document.onmousemove = function(a) {
				resize.call(sun, a);
			}
		};
		document.onmouseup = miss;
		Each(boxs,
		function(o) {
			o.showCloud();
		});
		if (document.body.setCapture) {
			sun.target.setCapture();
			sun.target.onmousewheel = mousewheel;
		}
	},//kiss end
	//?
	miss = function() {
		moon = false;
		document.onmouseup = null;
		Each(boxs,
		function(o) {
			o.hideCloud();
		});
		if (document.body.releaseCapture) sun.target.releaseCapture();
	},
	//拖动
	drag = function(a) {
		if (moon === false) return false;
		var e = a || window.event,
		_x = e.clientX,
		_y = e.clientY,
		_t = parseInt(M.t - M.y + _y - M.st + dom.scrollTop);
		if (_t + M.h + 20 > dom.scrollHeight) {
			_t = dom.scrollHeight - 10 - M.h;
		} else if (_t < 30) {
			_t = 20;
		};
		sun.target.style.top = _t + 'px';
		sun.target.style.left = M.l - M.x + _x + 'px';
		return false;
	},
	//?
	mousewheel = function() {
		window.scrollTo(0, document.documentElement.scrollTop - window.event.wheelDelta / 4);
	},
	//调整对话框大小
	resize = function(a) {
		if (moon === false) return false;
		var e = a || window.event,
		_x = e.clientX,
		_y = e.clientY;
		sun.width(M.w + _x - M.x);
		sun.height(M.h + _y - M.y - M.st + dom.scrollTop);
	},
	//构建窗口
	newBox = function() {
		var j = -1;
		Each(boxs,
			function(o, i) {
				if (o.free === true) j = i;
			}
		);
		if (j >= 0) return boxs[j];
		var W = {},
		T = document.createElement('div'),
		tl = document.createElement('div'),
		tc = document.createElement('div'),
		tr = document.createElement('div'),
		bl = document.createElement('div'),
		br = document.createElement('div'),
		h3 = document.createElement('h3'),
		span = document.createElement("span"),
		cloud = document.createElement('div'),
		con = document.createElement('div');
		
		tl.className = 'dialogTL';
		tc.className = 'dialogTC';
		tr.className = 'dialogTR';
		bl.className = 'dialogBL';
		br.className = 'dialogBR';//右下角
		cloud.className = 'dialogMask';//加载动画
		con.className = 'dialogContent';
		T.className = 'dialog';
		T.style.display = 'none';
		tc.appendChild(h3);
		tc.appendChild(span);
		T.appendChild(tl);
		T.appendChild(tc);
		T.appendChild(tr);
		T.appendChild(bl);
		T.appendChild(br);
		T.appendChild(cloud);
		T.appendChild(con);
		W.target = T;
		T.style.zIndex = ++z;
		
		W.showCloud = function() {
			cloud.style.display = 'block';
		};
		
		W.hideCloud = function() {
			cloud.style.display = 'none';
		};
		//增大对话框叠加高度
		W.resetZ = function() {
			T.style.zIndex = ++z;
		};
		//关闭对话框
		W.close = function() {
			moon = false;
			con.innerHTML = '';
			W.free = true;
			T.style.display = 'none';
			var a = true;
			Each(boxs,
			function(o, i) {
				if (!o.free && o.lock) a = false;
			});
			if (a) k.style.display = 'none';
		};
		//消息内容构建
		W.html = function(t, a, b, y, n, c, d) {
			h3.innerHTML = t;
			var e = this;
			if (y) {
				var f = document.createElement('input'),
				no = document.createElement('input'),
				yn = document.createElement('div');
				f.type = no.type = 'button';
				f.value = c;
				no.value = d;
				f.className = 'popboxYes';
				no.className = 'popboxNo';
				yn.className = 'popboxYN';
				yn.innerHTML = (b || '') + '<br />';
				yn.appendChild(f);
				if (n) {
					no.onclick = function() {
						n();
						e.close();
					};
					yn.appendChild(no);
				} else {
					no = null;
				};
				f.onclick = function() {
					y();
					e.close();
				};
				con.appendChild(yn);
			} else if (b) {
				con.innerHTML = b;
			} else {
				var g = document.createElement('iframe');
				g.setAttribute('width', '100%');
				g.setAttribute('height', '100%');
				g.setAttribute('scrolling', 'auto');
				g.frameBorder = 0;
				con.appendChild(g);
				g.src = a;
			};
			
			T.style.display = 'block';
			if (f) f.focus();
			if (no) no.focus();
			W.free = false;
			return W;
		};
		
		W.width = function(w) {
			if (w > 980) return false;//最大宽度限制
			if (w < 100) w = 100;//最小宽度限制
			T.style.width = w + 'px';
			return W;
		};
		
		W.height = function(h) {
			if (h > 980 || h < 0) return false;//最大最小高度限制
			T.style.height = h + 'px';
			return W;
		};
		
		//位置
		W.align = function(w, h) {
			W.width(w).height(h);
			var a = dom.scrollTop + (dom.clientHeight - h) / 2,
			_w = dom.scrollLeft + (dom.clientWidth - w) / 2;
			T.style.top = a + 'px';
			T.style.left = _w + 'px';
			T.style.zIndex = ++z;
			return W;
		};
		
		//拖动事件
		Each([tl, tc, tr, bl],
		function(o, i) {
			o.onmousedown = function(a) {
				kiss.call(W, a, 'd');
			};
		});
		
		//调整窗口大小事件
		br.onmousedown = function(a) {
			kiss.call(W, a);
		};
		
		//关闭按钮事件
		span.onclick = W.close;
		
		//向页面插入对话框代码
		document.body.appendChild(T);
		
		return boxs[boxs.push(W) - 1];
	},//newBox end
	
	init = function() {
		k = document.createElement('div');
		k.className = 'dialogLock';
		document.body.appendChild(k);
		install = false;
	},
	
	load = function(o, y, n) {
		if (install) init();
		var a = newBox().align(o.width || 640, o.height || 400).html(o.title || '', o.url || 'about:blank', o.html, y, n, o.yes || '确定', o.no || '取消');
		//锁屏
		a.lock = o.lock == false ? false: true;
		if (o.lock == true) {
			k.style.height = Math.max(dom.clientHeight, dom.scrollHeight) + 'px';
			k.style.display = 'block';
		};
		return a;
	};
	window.dialog = load;
})()