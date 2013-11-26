var CellDefaultView = require('views/cell-view'),
	SetController = require('controllers/set-controller');

module.exports = CellDefaultView.extend({

	events : {
		// follow the link when clicking anywhere in the cell
		'click' : function(e) {
			e.preventDefault();
			var href = this.$el.find('a').attr('href');

			// set to link to. if no set id given for link, use current set path or id
			var destSetID = (!this.model.get('set-id') || this.model.get('set-id') == '0') ? this.model.collection.set_path || this.model.collection.set_id : this.model.get('set-id');
			// cell id to link to. may be undefined if none given
			var destCellID = this.model.get('cell-id');
			// current cell id in the url
			var currentCellID = window.location.hash.match(/^#\/set\/.+\/(.*)\/?/);
			if (currentCellID) currentCellID = currentCellID[1]; // if we matched, get the capture group
			
			// same set and cell : need to manually call the controller action, router router won't do it again.
			if ( (destSetID == this.model.collection.set_path || destSetID == this.model.collection.set_id) && destCellID == currentCellID ) {
				var sc = new SetController();
				sc.show( {'setid': destSetID, 'cellid': destCellID} );
			}

			// navigate
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