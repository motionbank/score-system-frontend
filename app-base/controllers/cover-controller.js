var Controller = require('controllers/base/controller'),
	FrontView  = require('views/cover-view');

module.exports = Controller.extend({

	index : function () {
		this.view = new FrontView({
			region: 'content'
		});
	}

});