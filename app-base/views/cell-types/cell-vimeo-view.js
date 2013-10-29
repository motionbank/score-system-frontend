var CellIFrameView = require('views/cell-types/cell-iframe-view');

module.exports = CellIFrameView.extend({

	initialize : function ( opts ) {

		CellIFrameView.prototype.initialize.apply(this,arguments);

		this.model.set('iframe-src','http://player.vimeo.com/video/'+this.model.get('vimeo-id'));

		this.template = require('views/templates/cell-types/cell-iframe');
	}

});