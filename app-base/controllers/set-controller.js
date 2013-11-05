var Controller = require('controllers/base/controller'),
    SetView    = require('views/set-view'),
    SetModel   = require('models/set-model'),
    ErrorView    = require('views/error-view');

module.exports = Controller.extend({

	show : function ( opts ) {
		
		this.model = new SetModel();

		this.model.fetch({
			id : opts.setid,

			error : function(model, response, options) {
				//Chaplin.helpers.redirectTo('error#show', {message: 'Error message'}); // use this to redirect to an error page (changes url)
				new ErrorView( {message : 'Couldn\'t get the set you requested. (' + response.status + ')'} );
			}
		});

		this.model.synced(function(){
			setView.render();
		});
		
		var setView = this.view = new SetView({
			region: 'content',
			model: this.model
		});
	}

});
