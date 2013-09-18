var SiteView 	= require('views/site-view');

module.exports = Chaplin.Controller.extend({

	// Place your application-specific controller features here.
	beforeAction : function(){
		this.compose('site', SiteView);
	}
});
