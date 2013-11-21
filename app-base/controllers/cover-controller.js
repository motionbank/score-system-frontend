var Controller = require('controllers/base/controller'),
	FrontView  = require('views/cover-view');

module.exports = Controller.extend({

	index : function () {
		// hide menu (if coming back to cover page)
		$('header #main-menu').hide();
		
		this.view = new FrontView({
			region: 'content'
		});
	}

});