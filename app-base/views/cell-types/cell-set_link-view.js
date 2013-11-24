var CellDefaultView = require('views/cell-view');

module.exports = CellDefaultView.extend({

	events : {
		// follow the link when clicking anywhere in the cell
		'click' : function(e) {
			e.preventDefault();
			var href = this.$el.find('a').attr('href');
			window.location = href;
			return false;
		}
	},

	initialize : function() {
		CellDefaultView.prototype.initialize.apply(this,arguments);
		this.$el.css('cursor', 'pointer'); // add pointer cursor to the whole cell
	},

	getTemplateData : function () {
		var data = CellDefaultView.prototype.getTemplateData.apply(this,arguments);
		data['link'] = '#/set/'+data['set-id'];
		data['title'] = 'Set: '+data['title'];
		return data;
	}

});