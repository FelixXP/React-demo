'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.css');

//imagesJSON
var imageDatas = require('../data/iamgesDatas.json')
// var imageURL = require('../images/yeoman.png');

//获取图片信息数组
imageDatas = (function genImageURL(imageDataArr){
	for(var i=0,len=imageDataArr.length;i<len;i++){
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/'+ singleImageData.fileName)
		imageDataArr[i] = singleImageData;
	}
})(imageDatas)

var ReactDemoApp = React.createClass({
  render: function() {
    return (
      <div className="main">
        <ReactTransitionGroup transitionName="fade">
          <img src={imageURL} />
          <h1>felix</h1>
        </ReactTransitionGroup>
      </div>
    );
  }
});
React.render(<ReactDemoApp />, document.getElementById('content')); // jshint ignore:line

module.exports = ReactDemoApp;
