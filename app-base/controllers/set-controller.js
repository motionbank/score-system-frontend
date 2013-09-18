var Controller = require('controllers/base/controller'),
    SetView    = require('views/set-view'),
    SetModel   = require('models/set-model');

module.exports = Controller.extend({

	show : function ( opts ) {
		
		this.model = new SetModel();
		this.model.fetch({id:opts.setid});
		this.model.synced(function(){
			setView.render();
		});

		var setView = this.view = new SetView({
			region: 'content',
			model: this.model
		});
	}

});