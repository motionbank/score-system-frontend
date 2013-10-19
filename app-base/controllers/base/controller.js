var SiteView 	= require('views/site-view');

module.exports = Chaplin.Controller.extend({

	beforeAction : function() {
		this.compose('site', SiteView);
	}

});
