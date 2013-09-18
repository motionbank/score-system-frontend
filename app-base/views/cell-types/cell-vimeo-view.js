var CellDefaultView = require('views/cell-view');

module.exports = CellDefaultView.extend({

	events : {
		click : function () {
			$('.element-hidden',this.$el).removeClass('element-hidden');
			$('.info',this.$el).addClass('element-hidden');
		}
	}

});