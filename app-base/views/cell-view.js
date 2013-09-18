BaseView = require('views/base/view');

// see ```views/cell-types``` for per cell type views

module.exports = BaseView.extend({

	events: {
		click: function () {
			/* some cells only fully render on click */
		}
	},

	initialize : function ( opts ) {

		BaseView.prototype.initialize.apply(this,arguments);

		try {
			// per type template, separated from per type views to remove
			// the need to define them just to have spacialized templates
			this.template = require('views/templates/cell-types/cell-'+opts.model.get('type'));
		} catch (e) {
			// ignore, uses default template
		}
	},

	autoRender : false,
	className : 'cell',
	//region : 'grid',
	template : require('views/templates/cell'),

	// always on for now, see setActive / setInactive and render
	active : false,

	getTemplateData : function () {
		console.log( this.model.attributes );
		var data = _.extend({},this.model.attributes);
		data.content = '';
		return data;
	},

	render : function () {
		if ( this.active ) {
			BaseView.prototype.render.apply(this,arguments);
		}

		this.$el.addClass( 'type-' + this.model.get('type') );
		this.$el.css({
			'background-image': 'url('+this.model.getPosterImageURL()+')'
		});
	},

	activate : function () {
		if ( !this.active ) {
			this.active = true;
			this.render();
		}
	},

	deactivate : function () {
		this.active = false;
		this.$el.empty();
	}

});