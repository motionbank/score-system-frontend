var CellDefaultView = require('views/cell-view');
module.exports = CellDefaultView.extend({

	render : function () {

		CellDefaultView.prototype.render.apply(this,arguments);

		this.$el.css({
			'background-image': 'none'
		});
	}

});