var CellIFrameView = require('views/cell-types/cell-iframe-view');

module.exports = CellIFrameView.extend({

	initialize : function ( opts ) {

		CellIFrameView.prototype.initialize.apply(this,arguments);

-		var loop = this.model.attributes['loop'] && /^true|1$/i.test(this.model.attributes['loop']);
-		var autoplay = this.model.attributes['autoplay'] && /^true|1$/i.test(this.model.attributes['autoplay']);
-		this.model.set( 'iframe-src','http://player.vimeo.com/video/' + this.model.get('vimeo-id') + '?autoplay=' + (autoplay ? 1 : 0) + '&loop=' + (loop ? 1 : 0) );

		this.template = require('views/templates/cell-types/cell-iframe');
	}

});