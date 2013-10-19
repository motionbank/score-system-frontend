var CellDefaultView = require('views/cell-view');

module.exports = CellDefaultView.extend({

	events : {
		click : 'renderContent'
	},

	// keep this in sync with cell-iframe!
	render : function () {
		CellDefaultView.prototype.render.apply(this,arguments);

		if ( this.model.attributes['autoload'] && 
			/^(1|true)$/i.test(this.model.attributes['autoload']) ) {
			this.renderContent();
		}

		return this;
	},

	renderContent : function () {
		$('.element-hidden',this.$el).removeClass('element-hidden');
		$('iframe',this.$el).attr('src',$('iframe',this.$el).data('src'));
		$('.info',this.$el).addClass('element-hidden');
	}

});