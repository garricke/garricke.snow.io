$(document).ready(function(){
	/*
	 * 配置参数
	 */
	var config = {
		'physicEngine':false ,  //物理引擎，默认关闭
		'frameRate':10,  // 帧率，默认每秒10帧
		'fallSpeed':1,  // 下落速度,默认随便设一个数值
		'snowNum':1,  // 每次循环生成的雪花数量,默认1朵
		'snowRadius':5  // 雪花的最大半径
	}

	// 雪花总行数
	var frameData = [];
	// var nxtFrameData;  // 用来存储下一帧的雪花参数
	var frameLength = 0;
	// var odd = false ;

	// 渲染初始位置指针
	var pointerBegin = 0;

	// 自动执行一次渲染
	;(function(){
		$('#snowCanvas')[0].height = $('body').height();
		$('#snowCanvas')[0].width  = $('body').width() ;
		renderCanvas();
	})();

	/*
	 * 重置窗口大小后，重置画布，并重新初始化帧参数
	 */
	$(window).resize(function(){
		// 重设画布大小
		$('#snowCanvas')[0].height = $('body').height();
		$('#snowCanvas')[0].width  = $('body').width();

		// 帧参数重置
		frameData = null ;
		frameData = [] ;
		for(var cnt = 0; cnt < frameLength-1; cnt++){
			frameData.push([]);
			for( var num = 0; num < config.snowNum; num++){
				frameData[cnt].push([
						Math.floor(Math.random()*($('#snowCanvas').width())),  // 第一个参数存储雪花X坐标
						Math.floor(Math.random()*config.snowRadius)  // 第三个参数存储雪花半径
					]);
			}
		}
	});	

	/*
	 * 画布渲染
	 */
	function renderCanvas(){
		var snowCanvas = $('#snowCanvas')[0];
		var showPage = $('#snowCanvas')[0];

		// 调整画布内容高，填满屏幕
		snowCanvas.width = showPage.offsetWidth;
		snowCanvas.height = showPage.offsetHeight;

		// 画布大小初始化
		frameLength = Math.floor($('#snowCanvas').height() / config.fallSpeed);

		// 帧参数初始化
		for(var cnt = 0; cnt < frameLength-1; cnt++){
			frameData.push([]);
			for( var num = 0; num < config.snowNum; num++){
				frameData[cnt].push([
						Math.floor(Math.random()*($('#snowCanvas').width())),  // 第一个参数存储雪花X坐标
						Math.floor(Math.random()*config.snowRadius)  // 第三个参数存储雪花半径
					]);
			}
		}

		//根据预设的帧率，计算动画延时
		var interVal = 1/config.frameRate;

		//循环渲染，达到动画效果
		setInterval(
			function(){
				$('#snowCanvas').frameRender();
			}
		,20);
	};

	/*
	 * 雪花渲染器
	 * API:
	 * obj.snowRender({
	 * 'snowParams':Array  // [x,y,r]
	 * })
	 */
	;(function($){
		$.fn.snowRender = function(params){
			var canvas = this[0];
			var context = canvas.getContext('2d');
			context.beginPath();
			context.arc(
				params.snowParams[0],
				params.snowParams[1],
				params.snowParams[2],
				0,
				2*Math.PI
			);
			context.closePath();
			context.fillStyle = 'white';
			context.fill();
		}
	})(jQuery);

	/*
	 * 帧渲染器
	 * API:
	 * canvas.frameRender({})
	 */
	var cntr = 0;
	;(function($){
		$.fn.frameRender = function(params){

			var snowCanvas = this;

			// 清空上一帧的雪花显示
			snowCanvas[0].height = snowCanvas.height();	

			// 循环渲染每一行雪花
			for(var cnt = 0; cnt < frameLength - 1; cnt++){
				// 计算该行雪花的Y坐标
				var offsetHeight = (frameLength + cnt - pointerBegin)*config.fallSpeed;
				var canvasHeight = snowCanvas[0].height;
				var snowY = offsetHeight < 0?
					-offsetHeight:
					canvasHeight > offsetHeight?
					canvasHeight - offsetHeight:
					2*canvasHeight - offsetHeight;

				// 循环渲染该行每一朵雪花
				for(var num = 0; num < config.snowNum; num++){
					// 渲染雪花
					snowCanvas.snowRender({
						'snowParams':[
							frameData[cnt][num][0],
							snowY,
							frameData[cnt][num][1],
						]
					});
				}
			}

			// 初始位置指针递进
			if(pointerBegin <2*frameLength - 2){
				pointerBegin++;
			}
			else{
				pointerBegin = 0;
			}
		}
	})(jQuery);
})