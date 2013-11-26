var CellDefaultView = require('views/cell-view'),
	SetController = require('controllers/set-controller');

module.exports = CellDefaultView.extend({

	events : {
		// follow the link when clicking anywhere in the cell
		'click' : function(e) {
			e.preventDefault();
			var href = this.$el.find('a').attr('href');

			// only need to do this, if path is the same (to force jump to cell)
			// console.log("INIT SC");
			// var sc = new SetController();
			// sc.show({setid: 'all-cell-types', cellid: 'b0c35f716d6d6d8d0daa0100'});
			// console.log("LOC");

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
		
		// current set id/path
		var current_set_id = this.model.collection.set_id, current_set_path = this.model.collection.set_path;

		// fill set id if not given
		if ( !data['set-id'] || data['set-id'] == '0' ) {
			data['set-id'] = current_set_path || current_set_id; // use id if path is empty
		}
		// basic link
 		data['link'] = '#/set/' + data['set-id'];
 		// add cell id to link if given
 		if ( data['cell-id'] ) data['link'] += '/' + data['cell-id'];

		data['title'] = data['title'];
		return data;
	}

});