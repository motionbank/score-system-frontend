/* cell-iframe-view.js */
var CellDefaultView = require('views/cell-view'),
	config 			= require('config/config'),
	pm 				= require('postmessenger'),
	hasher			= require('hasher');

module.exports = CellDefaultView.extend({
	// attributes governing how a cell behaves in the view
	// cell types have default values. can be overridden via fields
	// these are the defaults use by most cell types
	defaultViewAttributes : {
		autoload : 1, // automatically open on scroll in?
		sticky : 0, // close a cell on scroll out?
		solo: 0 // close other cells on open?
	},

	events : {
		'click' : function () {
			console.log("click"); 
			if ( !this.isOpen ) {
				this.open();

				// console.log("solo " + this.model.get('solo'));
				if ( this.model.getFlag('solo') ) {
					var soloGroup = this.model.get('solo');
					// console.log('publish solo ' + soloGroup);
					this.publishEvent('!solo', { group : soloGroup, origin : this });
				}
			}
		}
	},

	initialize : function () {
		CellDefaultView.prototype.initialize.apply(this,arguments);
		// fill in missing view attributs with defaults
		_.defaults(this.model.attributes, this.defaultViewAttributes);
		
		// listen for solo event. close if in same solo group
		this.subscribeEvent('!solo', function(args) {
			// console.log("solo ");
			// console.log(args);
			// skip if we sent that event
			if ( args.origin == this ) { return; }
			if ( args.group == this.model.get('solo') ) { this.close(); }
		});
	},

	render : function () {
		CellDefaultView.prototype.render.apply(this,arguments);

		return this;
	},

	// render content
	open : function () {
		console.log("open " + this.cellInfo());

		// load iframe from data-src
		var $iframe = $('iframe',this.$el);
		$iframe.attr( 'src', $iframe.data('src') );
		
		$('.content',this.$el).removeClass('element-hidden');
		$('.info',this.$el).addClass('element-hidden');
		this.$el.css( 'background-image', 'none' );

		this.isOpen = true;
	},

	// remove content
	close : function () {
		console.log("close " + this.cellInfo());

		var $iframe = $('iframe',this.$el);
		$iframe.attr( 'src', '');
		
		$('.content',this.$el).addClass('element-hidden');
		$('.info',this.$el).removeClass('element-hidden');
		this.$el.css( 'background-image', 'url('+this.model.getPosterImageURL()+')' );

		this.isOpen = false;
	},

	// called when scrolled into view 
	activate : function () {
		// console.log( "activate " + this.model.get('type') + this.model.get('connection_id') );
		if ( this.model.getFlag('autoload') ) {
			this.open();
		}
	},

	// called when scrolled out of view
	deactivate : function () {
		// console.log( "deactivate " + this.model.get('type') + this.model.get('connection_id') );
		if ( !this.model.getFlag('sticky') ) {
			this.close();
		}
	},
});