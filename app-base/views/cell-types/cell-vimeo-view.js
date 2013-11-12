/* cell-vimeo-view.js */
var CellIFrameView = require('views/cell-types/cell-iframe-view');

module.exports = CellIFrameView.extend({
	// attributes governing how a cell behaves in the view
	// cell types have default values. can be overridden via fields
	// these are the defaults use by most cell types
	defaultViewAttributes : {
		autoload : 0, // automatically open a cell on set load or scroll in?
		sticky : 0, // close a cell on scroll out?
		solo: 1 // close other cells on open?
	},

	initialize : function ( opts ) {

		CellIFrameView.prototype.initialize.apply(this,arguments);

		var loop = this.model.attributes['loop'] && /^true|1$/i.test(this.model.attributes['loop']);
		var autoplay = this.model.attributes['autoplay'] && /^true|1$/i.test(this.model.attributes['autoplay']);
		this.model.set( 'iframe-src','http://player.vimeo.com/video/' + this.model.get('vimeo-id') + '?autoplay=' + (autoplay ? 1 : 0) + '&loop=' + (loop ? 1 : 0) );

		this.template = require('views/templates/cell-types/cell-iframe');
	}

});