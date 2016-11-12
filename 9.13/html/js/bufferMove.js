/**
	* 缓冲运动
	* obj 要运动的对象
	* oTarget 包含要运动的属性以及属性终点值，对象类型
	* fn 回调函数，可传可不传
*/
function bufferMove(obj, oTarget, fn) {
	// 先清除老的定时器
	clearInterval(obj.iTimer);

	// 打开新的定时器
	obj.iTimer = setInterval(function () {
		var bBtn = true; // 假设所有的属性都已运动完毕
		for(var sAttr in oTarget) {
			// 获取当前值
			if(sAttr === 'opacity') {
				var iCur = parseFloat(getStyle(obj, 'opacity') * 100);
			} else {
				var iCur = parseInt(getStyle(obj, sAttr));
			}
			
			// 获取速度
			var iSpeed = (oTarget[sAttr] - iCur) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

			if(sAttr === 'opacity') {
				obj.style.opacity = (iCur + iSpeed) / 100;

				// 兼容低版本的IE
				obj.style.filter  = 'alpha(opacity=' + (iCur + iSpeed) + ')';
			} else {
				obj.style[sAttr] = iCur + iSpeed + 'px';
			}

			// 判断当前属性是否运动完毕
			if(iCur + iSpeed !== oTarget[sAttr]) {
				bBtn = false;
			}
		}

		// 如果bBtn为true，说明所有属性都已运动完毕
		if(bBtn) {
			// 清除定时器
			clearInterval(obj.iTimer);
			// 如果传入回调函数，就执行
			if(fn) {
				fn();
			}
		}
	}, 50);
}

// 获取对象某个属性值
function getStyle(obj, sAttr) {
	if(obj.currentStyle) {
		return obj.currentStyle[sAttr];
	} else {
		return getComputedStyle(obj, null)[sAttr];
	}
}