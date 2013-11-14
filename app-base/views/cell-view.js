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
		this.$el.addClass( 'cellid-' + this.model.get('connection_id') ); // add view id as class (viewXX) to make debugging easier
		this.$el.data('cellid', this.model.get('connection_id'));

		// add css from "css-"-fields
		var cssOpts = {
			'background-image': 'url('+this.model.getPosterImageURL()+')'
		};
		attribs = {};
		_.filter(this.model.attributes.fields,function(f){
			return /^css-/i.test(f.name);
		}).map(function(f){
			attribs[f.name.replace(/^css-/i,'')] = f.value;
		});
		cssOpts = _.extend(cssOpts,attribs);
		this.$el.css(cssOpts);
		// }

		return this;
	},

	// get a string made up of cell type + id
	cellInfo : function () {
		return this.model.get('type') + this.model.get('connection_id');
	},
	
	// called when scrolled into view 
	activate : function () {
		// console.log( "activate " + this.model.get('type') + this.model.get('connection_id') );
	},

	// called when scrolled out of view
	deactivate : function () {
		// console.log( "deactivate " + this.model.get('type') + this.model.get('connection_id') );
	},

	// smoothly scroll to this cell
	scrollTo : function() {
		console.log("scrolling to " + this.cellInfo());
		//$('#set .cell-collection-container').scrollLeft(this.$el.position().left); // jump
		//$('#set .cell-collection-container').animate( {scrollLeft : this.$el.position().left}, 1500 ); // smoother
		
		var $viewport = $('#set .cell-collection-container');
		if ( this.$el.offset().left + this.$el.width() > $viewport.width() ) { // if not fully in view
			var destLeft = this.$el.position().left - ($viewport.width() - this.$el.width()) / 2;
			//$viewport.scrollLeft( destLeft ); //jump 
			$viewport.animate( {scrollLeft : destLeft}, 1500 ); // smooth
		}
	}
});