(function() {
	var /*k, install = true,*/
	boxs = [],
	onmouse = false,
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
		st: 0,//被滚动条卷去的文档高度
		sl: 0//被滚动条卷去的文档宽度
	},
	z = 999999999,//对话框初始叠加高度
	lock = 0,//锁屏遮罩计数器
	dom = document.documentElement || document.body,
	//查找遍历
	Each = function(a, b) {
		for (var i = 0,len = a.length; i < len; i++) b(a[i], i);
	},
	//样式操作
	hasClass = function(element,className){
		var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
		return element.className.match(reg);
	},
	addClass = function(element,className){//添加类
		if(!hasClass(element, className)){
			element.className += ' '+className;
		};
	},
	removeClass = function(element,className){//移除类
		if(hasClass(element, className)){
			var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
			element.className = element.className.replace(reg,' ');
		};
	},
	getClass = function(element,attribute){//读取元素CSS属性值
		return element.currentStyle ? element.currentStyle[attribute] : document.defaultView.getComputedStyle(element, false)[attribute];   
	},
	
	//智能定位(对象,x轴,y轴,超出可视范围是否重叠在边界,是否为静态定位)
	location = function(obj, x, y, overlap, fixed){
		var left = 0;
		var top = 0; 
		var dd = document.documentElement;
		var db = document.body;
		var ddw = dd.clientWidth;//浏览器内容框宽度
		var ddh = dd.clientHeight;//浏览器内容框高度
		var dbw = db.clientWidth;//页面总宽度
		var dbh = db.clientHeight;//页面总长度
		var st = Math.max(dd.scrollTop, db.scrollTop);//被纵向滚动条卷去的长度
		var sl = Math.max(dd.scrollLeft, db.scrollLeft);//被横向滚动条卷去的长度
		var ow = obj.clientWidth;//对话框宽度
		var oh = obj.clientHeight;//对话框高度
		
		//范围计算
		if(fixed){//静止定位
			var minX = 0;
			var maxX = ddw - ow;
			var centerX = maxX / 2;
			var minY = 0;
			var maxY = ddh - oh;
			var centerY = (ddh * 0.382 - oh / 2 > 0) ?  ddh * 0.382 - oh / 2 : maxY / 2;//黄金比例算法
		}else{//相对定位
			var minX = sl;
			var maxX = ddw + minX - ow;
			var centerX = maxX / 2;
			var minY = st;
			var maxY = ddh + minY - oh;
			var centerY =  (ddh * 0.382 - oh / 2 + minY > minY) ? ddh * 0.382 - oh / 2 + minY : (maxY + minY) / 2;//黄金比例算法
		};
		//范围限制
		if(overlap){//与边界叠加
			if(y > maxY) y = maxY;
			if(x > maxX) x = maxX;
			//优先满足最小坐标限制，防止对象超过可是面积而被截取
			if(x < minX) x = minX;
			if(y < minY) y = minY;
			left = x;
			top = y;
		}else{//主动避开
			if(x == undefined || x == 'center'){		
				left = centerX;
			}else
			if(x == 'left'){
				left = minX;
			}else
			if(x == 'right'){
				left = maxX;
			}else{
				if(fixed)x = x - sl;//把原点移到浏览器视口
				if(x < minX) x = x + ow;
				if(x > maxX) x = x - ow;
				left = x;
			};
			if(y == undefined || y == 'center'){
				top = centerY;
			}else
			if(y == 'top'){
				top = minY;
			}else
			if(y == 'bottom'){
				top = maxY;
			}else{
				if(fixed)y = y - st;//把原点移到浏览器视口
				if(y < minY) y = y + oh;
				if(y > maxY) y = y - oh;
				top = y;
			};
		};
		obj.style.left = left + 'px';
		obj.style.top = top + 'px';
	},//location end
	
	//鼠标事件控制
	cmd = function(b, s) {
		var e = b || window.event;
		M.x = e.clientX;
		M.y = e.clientY;
		M.t = parseInt(this.target.style.top);
		M.l = parseInt(this.target.style.left);
		M.w = parseInt(this.target.style.width);
		M.h = parseInt(this.target.style.height);
		M.st = dom.scrollTop;
		onmouse = true;
		sun = this;
		sun.zIndex();
		if (s == 'd') {
			document.onmousemove = function(a) {
				drag.call(sun, a);//移动
			};
		} else {
			document.onmousemove = function(a) {
				/*resize.call(sun, a);//调整大小*/
			};
		};
		document.onmouseup = function() {
			onmouse = false;
			document.onmouseup = null;
			//隐藏加载动画
			//Each(boxs,
			//	function(o) {
			//		o.hideCloud();
			//	}
			//);
			if (document.body.releaseCapture) sun.target.releaseCapture();//释放鼠标监控
		};
		//显示加载动画
		/*Each(boxs,
			function(o) {
				o.showCloud();
			}
		);*/
		
		//IE下鼠标超出视口仍可监控
		if (document.body.setCapture) {
			sun.target.setCapture();
			sun.target.onmousewheel = mousewheel;
		};
	},//cmd end

	//拖动
	drag = function(a) {
		if (onmouse === false) return false;
		var e = a || window.event,
		_x = e.clientX,
		_y = e.clientY,
		_t = parseInt(M.t - M.y + _y - M.st + dom.scrollTop);
		_l = parseInt(M.l - M.x + _x - M.sl + dom.scrollLeft);//
		/*if (_t + M.h > dom.scrollHeight) {
			_t = dom.scrollHeight - M.h;
		} else if (_t < 0) {
			_t = 0;
		};
		if (_l <0) _l = 0;
		sun.target.style.top = _t + 'px';
		//sun.target.style.left = M.l - M.x + _x + 'px';
		sun.target.style.left = _l + 'px';*/
		var fixed = (getClass(sun.target, 'position') == 'fixed' || getClass(sun.target, 'fixed') == 'true') ? true : false;//判读元素是否静止定位
		location(sun.target, _l, _t, true, fixed);
		return false;
	},
	//?
	mousewheel = function() {
		window.scrollTo(0, document.documentElement.scrollTop - window.event.wheelDelta / 4);
	},
	//调整对话框大小
	/*resize = function(a) {
		if (onmouse === false) return false;
		var e = a || window.event,
		_x = e.clientX,
		_y = e.clientY;
		sun.width(M.w + _x - M.x);
		sun.height(M.h + _y - M.y - M.st + dom.scrollTop);
	},*/
	//构建窗口
	newBox = function() {
		var j = -1;
		Each(boxs,
			function(o, i) {
				if (o.free === true) j = i;
			}
		);
		if (j >= 0) return boxs[j];
		/*var X = {},
		T = document.createElement('div'),
		tl = document.createElement('div'),
		tc = document.createElement('div'),
		tr = document.createElement('div'),
		bl = document.createElement('div'),
		br = document.createElement('div'),
		h3 = document.createElement('h3'),
		span = document.createElement("span"),//关闭按钮
		cloud = document.createElement('div'),//加载动画
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
		T.appendChild(con);*/
		
		
		var $ce = function (name){//生成xhtml节点
			return document.createElement(name);
		};
		var $ctn = function (txt){//生成文本节点
			return document.createTextNode(txt);
		};
		
		var cTitleBar = $ce('td');//标题栏
		var cTitle = $ce('div');//标题与按钮外套
		var cTitleText = $ce('div');//标题文字内容
		var cClose = $ce('a');//关闭按钮
		cTitleBar.className = 'cTitle';
		cTitle.className = 'cTitleWrap';
		cTitleText.className ='cTitleText';
		cClose.className ='cClose';
		cClose.href = 'javascript:void(0)';
		cClose.title = '关闭';
		cClose.appendChild($ctn('关闭'));
		cTitle.appendChild(cTitleText);
		cTitle.appendChild(cClose);
		cTitleBar.appendChild(cTitle);
		
		var cContent = $ce('td');//内容区
		var cContentWrap = $ce('div');//内容包裹
		cContent.className = 'cContent';
		cContentWrap.className = 'cContentWrap';
		cContent.appendChild(cContentWrap);
		
		var cBottom = $ce('td');//底部按钮区
		var cBottomWrap = $ce('div');
		var cBtns = $ce('div');
		var cResize = $ce('div');
		cBottom.className = 'cBottom';
		cBottomWrap.className = 'cBottomWrap';
		cBtns.className = 'cBtns';
		cResize.className = 'cResize';
		cBottomWrap.appendChild(cBtns);
		cBottomWrap.appendChild(cResize);
		cBottom.appendChild(cBottomWrap);
		
		var cTable = $ce('table');//内容表格
		var cTbody = $ce('tbody');
		for(var r=0;r<3;r++){
			_tr = $ce('tr');
			if (r == 0) _tr.appendChild(cTitleBar);
			if (r == 1) _tr.appendChild(cContent);
			if (r == 2) _tr.appendChild(cBottom);
			cTbody.appendChild(_tr);
		};
		cTable.className = 'contentWrap';
		cTable.appendChild(cTbody);
		cTable.setAttribute('class', 'contentWrap');
		
		var bTable = $ce('table');//外边框表格
		var bTbody = $ce('tbody');
		for(var r=0;r<3;r++){
			_tr = $ce('tr');
			for(var d=0; d<3; d++){
				_td = $ce('td');
				if(r == 1 && d == 1) {
					_td.appendChild(cTable);
				}else{
					_td.className = 'dBorder r' +r+ 'd' +d;
				}
				_tr.appendChild(_td);
			};
			bTbody.appendChild(_tr);
		};
		bTable.appendChild(bTbody);
		
		var art = $ce('div');
		art.className = 'art';
		art.appendChild(bTable);
		
		var dOverlay = $ce('div');//锁屏遮罩
		dOverlay.className = 'dOverlay';
		dOverlay.appendChild($ce('div'));
		
		var dWrap = $ce('div');//外套
		dWrap.className = 'dWrap';
		dWrap.appendChild(art);
		
		
		var X = {};
		X.target = art;
		art.style.zIndex = ++z;

		//显示加载动画
		/*X.showCloud = function() {
			cloud.style.display = 'block';
		};*/
		
		//隐藏加载动画
		/*X.hideCloud = function() {
			cloud.style.display = 'none';
		};*/
		
		//增大对话框叠加高度
		X.zIndex = function(o) {
			var x = o ? o : art;
			x.style.zIndex = ++z;
			dWrap.style.zIndex = ++z;//IE6叠加高度受具有绝对或者相对定位的父元素z-index影响
		};
		
		//关闭对话框
		X.close = function() {
			onmouse = false;
			X.free = true;
			X.alpha(art, 1, function(){
				//art.style.display = 'none';//隐藏对话框
				art.style.cssText = cTitleText.innerHTML = cContentWrap.innerHTML = cBtns.innerHTML = '';//清空内容
				removeClass(cContentWrap, 'cIframeWrap');//移除嵌入框架专属样式
				removeClass(dWrap, 'dFixed');//移除静止定位属性
				bTable.className = '';//移除风格属性
			});
			if (dWrap.className.indexOf('dLock') > -1){
				X.alpha(dOverlay, 1, function(){
					dOverlay.style.cssText = '';//隐藏遮罩
					var h = document.getElementsByTagName('html')[0];
					if (lock == 1) removeClass(h, 'mesLock');//移除锁屏样式
					lock --;
					removeClass(dWrap, 'dLock');
				});
			};
			var a = true;
			Each(boxs,
			function(o, i) {
				if (!o.free && o.lock) a = false;
			});
			//if (a) k.style.display = 'none';
		};
		
		//定时关闭对话框
		X.time = function(time){
			setTimeout(function(){
				X.close();
			}, 1000 * time);
		};
		
		//消息内容构建(标题,url,html,确定回调函数,取消回调函数,确定按钮文本,取消按钮文本,样式,锁屏)
		X.html = function(title, url, content, yes, no, yesText, noText, style, lock) {
			cTitleText.innerHTML = title;//写入标题
			var e = this;
			if (yes) {
				var f = $ce('input'),
				no = $ce('input');
				//yn = $ce('div');
				f.type = no.type = 'button';
				f.value = yesText;
				no.value = noText;
				f.className = 'cOk';
				no.className = 'cCancel';
				//yn.className = 'YN';
				//yn.innerHTML = content || '';
				cBtns.appendChild(f);
				//cTbody.appendChild(cBtns);
				//yn.appendChild(f);
				if (no) {
					no.onclick = function() {
						no();
						e.close();
					};
					//yn.appendChild(no);
					cBtns.appendChild(no);
					//cTbody.appendChild(cBtns);
				} else {
					no = null;
				};
				f.onclick = function() {
					yes();
					e.close();//关闭对话框
				};
				//cContentWrap.appendChild(yn);
			};
			if (content) {
				cContentWrap.innerHTML = '<div class="cDialogIcon"></div>' + content;
			} else {
				var g = $ce('iframe');
				//g.className = 'cIframe';
				//g.setAttribute('class', 'cIframe');
				/*g.setAttribute('width', '100%');
				g.setAttribute('height', '100%');
				g.setAttribute('scrolling', 'auto');
				g.frameBorder = 0;*/
				//cContentWrap.style.display = 'block';
				//cContentWrap.style.height = '100%';
				g.src = url;
				addClass(cContentWrap, 'cIframeWrap');
				cContentWrap.appendChild(g);
			};
			bTable.className += ' ' + style;//接受风格参数
			art.style.display = 'block';//显示对话框
			X.alpha(art, 0);
			if (lock) X.lock();
			if (f) f.focus();
			if (no) no.focus();
			X.free = false;
			return X;
		};//X.html end
		
		//锁屏
		X.lock = function(){
			var h = document.getElementsByTagName('html')[0];
			addClass(h, 'mesLock');
			addClass(h, 'ie6Fixed');
			addClass(dWrap, 'dFixed');
			addClass(dWrap, 'dLock');
			//dOverlay.style.cssText = (document.all) ? 'filter:alpha(opacity=0);' : 'opacity:0;';
			//dOverlay.style.zIndex = ++z;
			X.zIndex(dOverlay);
			dWrap.appendChild(dOverlay);
			dOverlay.style.display = 'block';
			lock ++;
			//dOverlay.opacity = 0;
			//X.alpha(dOverlay, 100);
			X.alpha(dOverlay, 0);
			
			return X;
		};
		
		//透明渐变(元素, 初始透明值, 回调函数)
		X.alpha = function(obj, int , fn, x){
			if(!x) i = int;
			s = 0.05;
			s = (int == 0) ? s : -s;
			i += s;
			if(obj.filters) {
				obj.filters[0].opacity = i * 100;
			} else {
				obj.style.opacity = i;
			};
			if (i > 0 && i < 1) {
				setTimeout(function(){X.alpha(obj, int, fn, i)}, 5);
			} else if(fn) {
				fn();
			};
		};
		
		
		/*X.width = function(w) {
			if (w > 980) return false;//最大宽度限制
			if (w < 100) w = 100;//最小宽度限制
			cContent.style.width = w + 'px';
			return X;
		};
		
		X.height = function(h) {
			if (h > 980 || h < 0) return false;//最大最小高度限制
			cContent.style.height = h + 'px';
			return X;
		};*/
		
		//位置(宽度, 高度, 横坐标, 纵坐标, 静止定位, 定时关闭)
		X.align = function(width, height, x, y, fixed, time) {
			//X.width(width).height(height);
			//var a = dom.scrollTop + (dom.clientHeight - height) / 2,
			//_w = dom.scrollLeft + (dom.clientWidth - width) / 2;
			//art.style.top = a + 'px';
			//art.style.left = _w + 'px';
			//如果不带单位则使用像素为单位
			if(parseInt(width) == width) width = width + 'px';
			if(parseInt(height) == height) height = height + 'px';
			cContent.style.width = width;
			cContent.style.height = height;
			//art.style.zIndex = ++z;
			X.zIndex(art);
			
			if (fixed == true) {//静止定位
				addClass(document.getElementsByTagName('html')[0], 'ie6Fixed');
				addClass(dWrap, 'dFixed');
			};
			location(art, x, y, false, fixed);
			if (time) X.time(time);
			return X;
		};
		
		//拖动事件
		Each([cTitleBar, cBtns], function(o, i) {
			o.onmousedown = function(a) {
				cmd.call(X, a, 'd');
				addClass(dWrap, 'mesMove');
			};
			o.onmouseup = function() {
				removeClass(dWrap, 'mesMove');
			};
			o.onselectstart = function(){
				return false;//禁止选择文字
			};
		});
		
		//调整窗口把柄事件
		cResize.onmousedown = function(a) {
			cmd.call(X, a);
		};
		
		//关闭按钮事件
		cClose.onclick = X.close;
		document.onkeyup = function(e){//ESC键关闭弹出层
			var e = e || window.event;
			if(e.keyCode == 27) cClose.onclick(); //X.close();
		};
		
		//向页面插入对话框代码
		document.body.appendChild(dWrap);
		
		return boxs[boxs.push(X) - 1];
	},//newBox end
	
	/*init = function() {
		//构建锁屏HTML
		//k = document.createElement('div');
		//k.className = 'dialogLock';
		//document.body.appendChild(k);
		
		install = false;
	},*/
	
	load = function(o, y, n) {
		//if (install) init();
		var a = newBox(
		).html(
			o.title || '提示',
			o.url || 'about:blank',
			o.content,
			y,
			n,
			o.yes || '确定',
			o.no || '取消',
			o.style || '',
			o.lock || false
		).align(
			o.width || 'auto',
			o.height || 'auto',
			o.x || 'center',
			o.y || 'center',
			o.fixed || false,
			o.time || false
		);
		//锁屏
		/*a.lock = o.lock == true ? true: false;
		if (a.lock == true) {
			addClass(document.getElementsByTagName('html')[0], 'mesLock');
			//k.style.height = Math.max(dom.clientHeight, dom.scrollHeight) + 'px';
			//k.style.display = 'block';
		};*/
		
		return a;
	};
	window.artDialog = load;
})()