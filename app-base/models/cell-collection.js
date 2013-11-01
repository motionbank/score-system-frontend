var BaseCollection = require('models/base/collection'),
	CellModel      = require('models/cell-model');

module.exports = BaseCollection.extend({

	// we could also override the models per cell type
	model: function(attrs, options) {
		var CellTypeModel = CellModel;
		if ( attrs && 'type' in attrs && attrs.type ) {
			try {
				CellTypeModel = require('models/cell-types/cell-'+attrs.type+'-model');
			} catch (e) {
				// ignore
			}
		}
		return new CellTypeModel(attrs, options);
	},

	modeltype : 'cell-collection',

	//model : CellModel

	focusedCell : null, // i.e. most recently clicked iframe or vimeo cell

	// focus a cell 
	focusCell : function (cellModel) {
		if ( this.focusedCell) this.focusedCell.set('focused',false); // unfocus old cell
		this.focusedCell = cellModel; // save new cell
		this.focusedCell.set('focused',true); // focus new cell
	}
	
});