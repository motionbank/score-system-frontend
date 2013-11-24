/* cell-iframe-view.js */
var CellMediaView = require('views/cell-types/cell-media-view'),
	pm 	= require('postmessenger'),
	hasher = require('hasher');

module.exports = CellMediaView.extend({
	// attributes governing how a cell behaves in the view
	// cell types have default values. can be overridden via fields
	// these are the defaults use by most cell types
	defaultViewAttributes : {
		autoload : 1, // open on scroll in?
		sticky : 0, // don't close on scroll out?
		solo: 0 // close other cells on open?
	},

	render : function () {
		CellMediaView.prototype.render.apply(this,arguments);
		
		// when rendering is finished, meaning the <iframe> exists, connect postmessenger
		_(this.connectPM).bind(this).defer();
		
		return this;
	},

	// connect postmessenger to iframe
	// remains on the iframe and reconnects on load, so only call this once
	connectPM : function () {
		// console.log("connectPM " + this.cellInfo());
		
		var that = this;
		$('iframe', this.$el).on('load', function() {
			// load event is also fired on close, when src is set to "". skip this.
			if (!this.src) {
				// console.log("src not valid: " + this.src);
				return;
			}

			// if iframe on another domain add that to the accept list
			var src = that.model.get('iframe-src');
			if ( /^http[s]?:\/\/.+/.test(src) ) {
				var iframe_domain = (function(){
					var p = src.split('/');
					return p[0]+'//'+p[2];
				})();
				pm.accept(iframe_domain);
			}
			// connect it
			pm.send(
				'connect?',
				{ listener_id: hasher.generate(20) }, 
				this.contentWindow,
				iframe_domain
			);
		});
	},
	
	sendPM : function (msg, opts) {
		var iframe = $('iframe', this.$el)[0];
		if (opts == undefined) { opts = {}; }

		if (this.isOpen()) {
			// console.log("sending " + msg);
			pm.send(msg, opts, iframe.contentWindow );
		} else { // wait till iframe is loaded to send message
			$(iframe).one('load', function() {
				// console.log("late sending " + msg);
				pm.send(msg, opts, this.contentWindow );
			});
		}
	},

	// called when scrolled into view 
	activate : function () {
		CellMediaView.prototype.activate.apply(this,arguments);

		if ( this.model.getFlag('sticky') && this.isOpen() ) {
			// console.log("sending activate");
			this.sendPM('activate!');
		}
	},

	// called when scrolled out of view
	deactivate : function () {
		CellMediaView.prototype.deactivate.apply(this,arguments);

		if ( this.model.getFlag('sticky') && this.isOpen() ) {
			// console.log("sending deactivate");
			this.sendPM('deactivate!');
		}
	},

	// show iframe only when loaded
	open : function () {
		var $iframe = $('iframe',this.$el);
		$iframe.css('visibility', 'hidden');
		var $cell = this.$el;
		// $cell.css('background-color', 'rgba(255,255,255,0.2)');
		$iframe.one('load.open', function() { 
			$(this).css('visibility', 'visible');
			// $cell.css('background-color', 'transparent'); 
		});

		CellMediaView.prototype.open.apply(this,arguments);
	}

});