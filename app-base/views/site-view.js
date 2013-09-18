'use strict';

var View 	 = require('views/base/view'),
	template = require('views/templates/site');

module.exports = View.extend({

	container: 'body',

	id: 'site-container',
	
	regions: {
		'header'  : '#header-container',
		'content' : '#content-container',
		'footer'  : '#footer-container'
	},
	
	template: template

});
