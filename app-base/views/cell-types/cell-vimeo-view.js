/* cell-vimeo-view.js */
var CellIFrameView = require('views/cell-types/cell-iframe-view'),
	pm  = require('postmessenger');

module.exports = CellIFrameView.extend({
	// attributes governing how a cell behaves in the view
	// cell types have default values. can be overridden via fields
	// these are the defaults use by most cell types
	defaultViewAttributes : {
		autoload : 0, // open on scroll in?
		sticky : 0, // don't close on scroll out?
		solo: 1, // close other cells on open?
		autoplay : 1
	},

	initialize : function ( opts ) {
		CellIFrameView.prototype.initialize.apply(this,arguments);

		var loop = this.model.attributes['loop'] && /^true|1$/i.test(this.model.attributes['loop']);
		var autoplay = this.model.attributes['autoplay'] && /^true|1$/i.test(this.model.attributes['autoplay']);
		this.model.set( 'iframe-src','http://player.vimeo.com/video/' + this.model.get('vimeo-id') + '?autoplay=' + (autoplay ? 1 : 0) + '&loop=' + (loop ? 1 : 0) );

		this.template = require('views/templates/cell-types/cell-iframe');

		this.subscribeEvent('!open', function(args) {
			if ( args.origin == this ) { return; }
			//console.log("open received for: " + args.cellid);
			if ( args.cellid == this.model.get('connection_id') ) { this.open(); }
		});
	},

	// overridden
	connectPM : function () {
		// console.log("connectPM " + this.cellInfo());
		var that = this;
		
		pm.accept( 'http://player.vimeo.com' );
		// pm.on({
		// 	matcher: /.+/,
		// 	callback: function ( request, response ) {
		// 		var iframe = $('iframe', that.$el)[0];
		// 		// check source window
		// 		if (iframe.contentWindow == request.source) {
		// 			console.log(that.cellInfo() + ' received: ', request.name );
		// 			//console.log(iframe);
		// 		}
		// 	},
		// 	nameAlias: 'event'
		// });

		pm.on({
			matcher: 'finish',
			callback: function ( request, response ) {
				var iframe = $('iframe', that.$el)[0];
				// check source window
				if (iframe.contentWindow == request.source) {
					console.log(that.cellInfo() + ' received: ', request.name );
					//console.log(iframe);
					var onfinish = that.model.get('on-finish');
					if (onfinish) {
						that.publishEvent('!open', {cellid : onfinish, origin : that});
					}
				}
			},
			nameAlias: 'event'
		});
		
		var that = this;
		$('iframe', this.$el).on('load', function() {
			// load event is also fired on close, when src is set to "". skip this.
			if (!this.src) {
				// console.log("src not valid: " + this.src);
				return;
			}
			// request finish events from player
			pm.send({
        		name: 'addEventListener', data: 'finish',
        		receiver: this.contentWindow, receiverOrigin: 'http://player.vimeo.com',
        		nameAlias: 'method', dataAlias: 'value'
			});

		});
	},

	sendPM : function (msg, opts) {
		// no op
	}

});