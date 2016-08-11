'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.css');

var imageURL = require('../images/yeoman.png');

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
