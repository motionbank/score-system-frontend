/* cell-view.js */
BaseView = require('views/base/view');

// see ```views/cell-types``` for per cell type views

module.exports = BaseView.extend({

	events: {
		click: function () {
			/* some cells only fully render on click */
		}
	},

	initialize : function ( opts ) {
		BaseView.prototype.initialize.apply(this,arguments);

		try {
			// per type template, separated from per type views to remove
			// the need to define them just to have spacialized templates
			this.template = require('views/templates/cell-types/cell-'+opts.model.get('type'));
		} catch (e) {
			// ignore, uses default template
		}
	},

	autoRender : false,
	className : 'cell',
	//region : 'grid',
	template : require('views/templates/cell'),

	// always on for now, see setActive / setInactive and render
	// active : false,

	getTemplateData : function () {
		var data = _.extend({},this.model.attributes);
		data.content = '';
		return data;
	},

	render : function () {
		//console.log("rendering " + this.cellInfo());
		// if ( this.active ) {
		BaseView.prototype.render.apply(this,arguments);

		// add classes (cell type, cell id)
		this.$el.addClass( 'type-' + this.model.get('type') );
		this.$el.addClass( 'cellid-' + this.model.getID() ); // add view id as class (viewXX) to make debugging easier
		this.$el.data( 'cellid', this.model.getID() );

		// add classes set via class field
		var cls = this.model.get('class');
		if (cls) {
			_.each(cls.split(" "), function(cls) {
				if (cls) this.$el.addClass(cls);
			}, this);
		}

		var cssOpts = {
			'background-image': 'url('+this.model.getPosterImageURL()+')'
		};
		// add css from "css-" fields
		cssOpts = _.extend( cssOpts, this.model.getPrefixAttributes('css-') );
		this.$el.css(cssOpts);

		return this;
	},

	// get a string made up of cell type + id
	cellInfo : function () {
		return this.model.get('type') + this.model.getID();
	},
	
	// called when scrolled into view 
	activate : function () {
		// console.log( "activate " + this.cellInfo() );
	},

	// called when scrolled out of view
	deactivate : function () {
		// console.log( "deactivate " + this.cellInfo() );
	},

	// smoothly scroll to this cell
	scrollTo : function(time) {
		console.log("scrolling to " + this.cellInfo());
		//$('#set .cell-collection-container').scrollLeft(this.$el.position().left); // jump
		//$('#set .cell-collection-container').animate( {scrollLeft : this.$el.position().left}, 1500 ); // smoother
		
		if (time == undefined) time = 1500;

		var $viewport = $('#set .cell-collection-container');
		if ( this.$el.offset().left + this.$el.width() > $viewport.width() 
			|| this.$el.offset().left < 0 ) { // if not fully in view
			var destLeft = this.$el.position().left - ($viewport.width() - this.$el.width()) / 2;
			//$viewport.scrollLeft( destLeft ); //jump 
			$viewport.animate( {scrollLeft : destLeft}, time ); // smooth
		}
	}
});