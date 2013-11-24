/* cell-media-view.js */
var CellDefaultView = require('views/cell-view'),
	config 			= require('config/config');

module.exports = CellDefaultView.extend({
	// attributes governing how a cell behaves in the view
	// cell types have default values. can be overridden via fields
	// these are the defaults use by most cell types
	defaultViewAttributes : {
		autoload : 0, // open on scroll in?
		sticky : 0, // don't close on scroll out?
		solo: 0 // close other cells on open?
	},

	events : {
		'click' : function () {
			// console.log("click"); 
			if ( !this.isOpen() ) {
				this.open();
			}
		}
	},

	loadState : "closed",

	isOpen : function() {
		return this.loadState.toLowerCase() == "open";
	},

	isClosed : function() {
		return this.loadState.toLowerCase() == "closed";
	},

	isLoading : function() {
		return this.loadState.toLowerCase() == "loading";
	},

	initialize : function () {
		CellDefaultView.prototype.initialize.apply(this,arguments);
		// fill in missing view attributs with defaults
		_.defaults(this.model.attributes, this.defaultViewAttributes);
		
		// listen for solo event. close if in same solo group
		this.subscribeEvent('!solo', function(args) {
			// console.log("solo", args);
			// skip if we sent that event
			if ( args.origin == this ) { return; }
			if ( args.group == this.model.get('solo') ) { 
				// close if open or loading
				if (!this.isClosed()) this.close(); 
			}
		});

		this.$el.css('cursor', 'pointer');
	},

	getTemplateData : function () {
		var data = CellDefaultView.prototype.getTemplateData.apply(this,arguments);
		
		if ( Handlebars.compile && data['iframe-src'] ) {
			data['iframe-src'] = Handlebars.compile(data['iframe-src'])(config);
		}
		if ( data['iframe-src'] ) {
			var spl = data['iframe-src'].split('?');
			var host = window.location.host;
			data['iframe-src'] = spl[0] + '?' + 'domain=http://' + host + '&' + (spl[1] || '');
		}
		
		// collect extra attributes for <iframe>
		data.attr = this.model.getPrefixAttributes('attr-');
		
		return data;
	},

	// render content
	open : function () {
		console.log("open " + this.cellInfo());
		this.loadState = "loading";

		// show loading animation
		this.showLoadingAnimation();

		// load iframe from data-src
		var $iframe = $('iframe',this.$el);
		var that = this;
		$iframe.one('load.open', function() { that.loadState = "open"; }); // once loaded, set open state
		$iframe.attr( 'src', $iframe.data('src') );
		
		$('.content',this.$el).removeClass('element-hidden');
		$('.info',this.$el).addClass('element-hidden');
		this.$el.css( 'background-image', 'none' );

		// handle solo
		// console.log("solo " + this.model.get('solo'));
		if ( this.model.getFlag('solo') ) {
			var soloGroup = this.model.get('solo');
			// console.log('publish solo ' + soloGroup);
			this.publishEvent('!solo', { group : soloGroup, origin : this });
		}

		this.$el.css('cursor', 'auto');
	},

	// remove content
	close : function () {
		console.log("close " + this.cellInfo());
		// debugger;
		this.$el.css( 'background-image', 'url('+this.model.getPosterImageURL()+')' ); // show poster image
		$('.info',this.$el).removeClass('element-hidden'); // show info
		$('.content',this.$el).addClass('element-hidden'); // hide content
		
		var $iframe = $('iframe',this.$el);
		$iframe.off('.open'); // don't set open state anymore, if pending
		$iframe.attr( 'src', 'about:blank');

		this.$el.css('cursor', 'pointer');

		this.loadState = "closed";
	},

	// called when scrolled into view 
	activate : function () {
		if ( this.model.getFlag('autoload') && !this.isOpen() ) {
			this.open();
		}
	},

	// called when scrolled out of view
	deactivate : function () {
		if ( !this.model.getFlag('sticky') ) {
			this.close();
		}
	},

	showLoadingAnimation : function () {
		$('.loading', this.$el).show(0);
		var that = this;
		$('iframe', this.$el).one('load', function() {
			$('.loading', that.$el).hide(0);
		});
	}
});