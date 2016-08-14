'use strict';

var React = require('react/addons');
// var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');

// imagesJSON
var imageDatas = require('../data/imageDatas.json');

// 获取图片信息数组
imageDatas = (function genImageURL(imageDataArr){
	var i = 0;
	var len = imageDataArr.length;
	for(i; i < len; i++){
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
})(imageDatas);

//控制组件
var ControllerUnits = React.createClass({
	handleClick: function(e){
		//点击图片为选中态则翻转，否则居中
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		}else {
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();

	},

	render: function(){
		var controllerUnitClassName = 'controller-unit';
		controllerUnitClassName += this.props.arrange.isCenter ? ' is-center' : '';
		controllerUnitClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
});

//单张图片组件
var ImgFigure = React.createClass({

	handleClick: function(e){
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		}else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	},

	render: function(){
		var styleObj = {};
		//如果this.props属性中指定了图片的位置信息，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		//如果已经设置非零旋转角度
		if(this.props.arrange.rotate){
			(['mozTransform', 'webkitTransform', 'msTransform', 'transform'].forEach(function(value){
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this)));
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
			styleObj.boxShadow = '0 0 10px 0 #333';
		}

		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
					<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>
		);
	}
});

/**
 * 获取指定区间的随机值
 * @param  {Number} low    [最小值]
 * @param  {Number} height [最大值]
 * @return {Number}        [随机值]
 */
function getRangeRandom(low, height){
	return Math.ceil(Math.random() * (height - low) + low);
}

/**
 * 获取0-30度的任意正负值
 * @return {String}
 */
function get30DegRandom(){
	return (( Math.random() > 0.5 ? '' : '-' ) + Math.random() * 30);
}

//main
var ReactDemoApp = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: { //水平方向的取值范围
			leftLeftSecX: [0, 0],
			rightLeftSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: { //垂直方向的取值范围
			x: [0, 0],
			topY: [0, 0]
		}
	},

	/**
	 * 翻转图片
	 * @param  {int} index 当前图片的索引值
	 * @return {function}       闭包函数
	 */
	inverse: function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	},



	/**
	 * 布局图片
	 * @param  {int} centerIndex [指定居中图片索引]
	 */
	rearrange: function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
				Constant = this.Constant,
				centerPos = Constant.centerPos,
				hPosRange = Constant.hPosRange,
				vPosRange = Constant.vPosRange,
				hPosRangeLeftLeftSecX = hPosRange.leftLeftSecX,
				hPosRangeRightLeftSecX = hPosRange.rightLeftSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,

				imgsArrangeTopArr = [],
				topImgNum = Math.floor(Math.random() * 2),//顶部设置0或1张图片
				topImgSpliceIndex = 0,
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

				//居中centerIndex的图片
				imgsArrangeCenterArr[0] = {
					pos: centerPos,
					rotate: 0,
					isCenter: true
				};

				//取出上侧图片状态信息
				topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
				imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

				//布局上侧图片信息
				imgsArrangeTopArr.forEach(function(value, index){
					imgsArrangeTopArr[index] = {
						pos: {
							top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
							left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
						},
						rotate: get30DegRandom(),
						isCenter: false
					};
				});

				//布局左右两侧的图片
				for (var i = imgsArrangeArr.length - 1, k = i / 2; i >= 0; i--) {
					var hPosRangeLORX = null;
					if (i < k) {//左边
						hPosRangeLORX = hPosRangeLeftLeftSecX;
					} else {//右边
						hPosRangeLORX = hPosRangeRightLeftSecX;
					}

					imgsArrangeArr[i] = {
						pos: {
							top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
							left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
						},
						rotate: get30DegRandom(),
						isCenter: false
					};
				}
				if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
					imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
				}

				imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

				this.setState({
					imgsArrangeArr: imgsArrangeArr
				});

	},

	/**
	 * 居中指定index的图片
	 * @param {int}  指定图片索引值
	 * @return {[function} 闭包函数
	 */
	center: function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},

	getInitialState: function(){
		return {
			imgsArrangeArr: [
				// {
				// 	pos: {
				// 		left: "0",
				// 		top: "0"
				// 	},
				// 	rotate:0,  //旋转角度
				// 	isInverse: false,  //图片正反面
				// 	isCenter: false  //图片是否居中
				// }
			]
		};
	},

	//组件加载完成后，计算图片位置范围
	componentDidMount: function(){
		//获取舞台大小
		var stageDOM = React.findDOMNode(this.refs.stage),
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW / 2),
				halfStageH = Math.ceil(stageH / 2);

		//获取imgFigure的大小
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW / 2),
				halfImgH = Math.ceil(imgH / 2);

		// 中心图片位置
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		// 水平方向取值范围
		this.Constant.hPosRange.leftLeftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftLeftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightLeftSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightLeftSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.rearrange(0);
	},
  render: function() {
		var controllerUnits = [];
		var imgFigures = [];
		imageDatas.forEach(function(value, index){
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: '0',
						top: '0'
					},
					rotate: '0',
					isInverse: false,
					isCenter: false
				};
			}
			imgFigures.push(<ImgFigure data={value} key={index} inverse={this.inverse(index)} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} ref={'imgFigure' + index}/>);

			controllerUnits.push(<ControllerUnits key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}/>);
		}.bind(this));

    return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
    );
  }
});
React.render(<ReactDemoApp />, document.getElementById('content')); // jshint ignore:line

module.exports = ReactDemoApp;
