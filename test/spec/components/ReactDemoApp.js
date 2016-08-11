'use strict';

describe('ReactDemoApp', () => {
  let React = require('react/addons');
  let ReactDemoApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    ReactDemoApp = require('components/ReactDemoApp.js');
    component = React.createElement(ReactDemoApp);
  });

  it('should create a new instance of ReactDemoApp', () => {
    expect(component).toBeDefined();
  });
});
