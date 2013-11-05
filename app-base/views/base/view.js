require('lib/view-helper'); // Just load the view helpers, no return value

module.exports = Chaplin.View.extend({
	containerMethod: 'html', // when rendering, replace content instead of appending it

	initialize : function () {
		Chaplin.View.prototype.initialize.apply(this, arguments);
	},

	// Precompiled templates function initializer.
	getTemplateFunction : function () {
		return this.template;
	},

	render : function () {
		Chaplin.View.prototype.render.apply(this,arguments);
		if ( this.$el && this.model ) {
			this.$el.addClass( this.model.modeltype + '-' + this.model.get('id') );
		}
		return this;
	}

});
