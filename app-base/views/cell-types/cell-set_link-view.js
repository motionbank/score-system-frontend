var CellDefaultView = require('views/cell-view');

module.exports = CellDefaultView.extend({

	getTemplateData : function () {
		var data = CellDefaultView.prototype.getTemplateData.apply(this,arguments);
		data['link'] = '#/set/'+data['set-id'];
		data['title'] = 'Set: '+data['title'];
		return data;
	}

});