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
	
	template: template,

	events: {
		// little dirty hack to fix the logo link.
		// would get something like http://scores.motionbank.org/jbmf/#http://scores.motionbank.org/ overwise
		'click #logo' : function(evt) {
			// replace location, so no history is created for the link we don't want
			window.location.replace($(evt.currentTarget).data('href'));
			evt.preventDefault();
		}
	}

});
