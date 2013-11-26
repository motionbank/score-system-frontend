var BaseCollection = require('models/base/collection'),
	CellModel      = require('models/cell-model');

module.exports = BaseCollection.extend({
	initialize : function (cells, opts) {
		BaseCollection.prototype.initialize.apply(this, arguments);
		this.set_id = opts.set_id;
		this.set_path = opts.set_path;
	},

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
	
});