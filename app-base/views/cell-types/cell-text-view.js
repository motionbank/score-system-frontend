var CellDefaultView = require('views/cell-view');
module.exports = CellDefaultView.extend({

	render : function () {

		CellDefaultView.prototype.render.apply(this,arguments);

		this.$el.css({
			'background-image': 'none'
		});
	},

	getTemplateData : function () {
		var data = CellDefaultView.prototype.getTemplateData.apply(this,arguments);
		data['text-content'] = data['text-content'] || data['description'] || '';
		data['text-content'] = $('<div>'+data['text-content']+'</div>').text();
		return data;
	}

});