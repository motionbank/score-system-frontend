var Controller = require('controllers/base/controller'),
	ErrorView    = require('views/error-view');

module.exports = Controller.extend({

	show : function ( opts ) {
		/*
			route  		: opts
			/error 		: {}
			/something/that/doesnt/exit	: {notfound:something/that/doesnt/exit}
		*/

		// get options: message, template
		this.opts = _.defaults(opts, {
			'template' : 'default',
			'message' : 'The site you requested was not found.'
		});

		var view = new ErrorView( opts ); // you can optionally pass in message and template here
	}

});
