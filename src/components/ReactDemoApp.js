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

//单张图片组件
var ImgFigure = React.createClass({
	render: function(){
		var styleObj = {};
		//如果this.props属性中指定了图片的位置信息，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
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
				topImgNum = Math.ceil(Math.random() * 2),//顶部设置0或1张图片
				topImgSpliceIndex = 0,
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

				//居中centerIndex的图片
				imgsArrangeCenterArr[0].pos = centerPos;

				//取出上侧图片状态信息
				topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
				imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

				//布局上侧图片信息
				imgsArrangeTopArr.forEach(function(value, index){
					imgsArrangeTopArr[index].pos = {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
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

					imgsArrangeArr[i].pos = {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
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

	getInitialState: function(){
		return {
			imgsArrangeArr: [
				// {
				// 	pos: {
				// 		left: "0",
				// 		top: "0"
				// 	}
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
		this.rearrange(3);
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
					}
				};
			}
			imgFigures.push(<ImgFigure data={value} arrange={this.state.imgsArrangeArr[index]} ref={'imgFigure' + index}/>);
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
