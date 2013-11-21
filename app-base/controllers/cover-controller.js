var Controller = require('controllers/base/controller'),
	FrontView  = require('views/cover-view'),
	config = require('config/config');

module.exports = Controller.extend({

	index : function () {
		// hide menu (if coming back to cover page)
		$('header #main-menu').hide();
		
		this.view = new FrontView({
			region: 'content'
		});

		// set window title from config
		if (config.title && config.title.title) {
			document.title = config.title.title + " - Motion Bank";
		}
	}

});