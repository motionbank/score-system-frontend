/* set-view.js */	
var View 	 = require('views/base/view');

module.exports = View.extend({

	initialize : function () {
		View.prototype.initialize.apply(this,arguments);

		this.subscribeEvent('set:scrolled',function(val){
			this.layoutAttributes.position = val;
			this.updateCellVisibility();
		});

		this.subscribeEvent('window:resized',function(){
			this.updateCellGrid();
		});
	},

	id : 'set',
	regions : {
		'grid' : '.cell-collection-container'
	},
	autoRender: false,
	className: 'set',
	template: require('views/templates/set'),

	layoutAttributes : {
		position : 0.0, // scroll position in set [0,1]
		visible_x : 0, // #cells that fit in one screen horizontally
		visible_y : 0, // #cells that fit in one screen vertically
		width : -1, // set width in px
		height : -1, // set height in px
		cell_width : 0, // cell width in px
		cell_height : 0 // cell height in px
	},

	render : function () {
		// console.log("rendering set");
		View.prototype.render.apply(this,arguments);

		this.layoutAttributes.position = 0.0;
		
		this.model.collectionView.render();

		// call updateCellGrid() after render finished (for it to have width, height avail)
		_(function(){
			this.updateCellGrid();
			this.establishCellGrid();
			this.updateCellVisibility();
		}).bind(this).defer();

		return this;
	},

	// re-calculate layout attributes: set dimensions, grid dimensions (on resize)
	updateCellGrid : function () {
		// console.log("updateCellGrid");

		var layAttrs = this.layoutAttributes;

		// update layout size
		layAttrs.width  = this.$el.width();
		layAttrs.height = this.$el.height();
		
		var cell_height = parseInt( Math.floor( layAttrs.height / this.model.get('grid_rows') ) );
		var cell_width  = (this.model.get('cell_width') / this.model.get('cell_height')) * cell_height;

		layAttrs.visible_x = parseInt( layAttrs.width / cell_width );
		layAttrs.visible_y = this.model.get('grid_rows');

		if ( layAttrs.width - (layAttrs.visible_x * cell_width) > cell_width / 2 ) {
			layAttrs.visible_x++;
		}
		cell_width = parseInt( Math.floor( layAttrs.width / layAttrs.visible_x ) );

		this.model.collectionView.$el.css({
			width: parseInt( cell_width * this.model.get('grid_cols') ) + 'px'
		});

		layAttrs.cell_width  = cell_width;
		layAttrs.cell_height = cell_height;

		// add media-query style classes to cells
		_.each( this.model.collectionView.getItemViews(), function( cellView ) {
		var cellDim = cellView.model.get('extra');
			cellView.$el.attr( 'class', cellView.$el.attr('class').replace(/ cell-(width|height)-[0-9]+/ig,'') );
			// console.log('cell-width-'+ (parseInt((layAttrs.cell_width*cellDim.width) /50)*50));
			cellView.$el.addClass( 'cell-width-'+ (parseInt((layAttrs.cell_width*cellDim.width) /50)*50) );
			cellView.$el.addClass( 'cell-height-'+(parseInt((layAttrs.cell_height*cellDim.height)/50)*50) );
		});
	},

	// establish css cell positions and dimensions (once)
	establishCellGrid : function () {
		// console.log("establishCellGrid");

		var gridWidth = this.model.get('grid_cols');
		var xFrom = Math.round( this.layoutAttributes.position * (gridWidth - this.layoutAttributes.visible_x) );

		var cw = 100.0/gridWidth;  // cell width (% of set)
		var ch = 100.0/this.layoutAttributes.visible_y; // cell height (% of set)

		_.each( this.model.collectionView.getItemViews(), function( cellView ) {
			var cellDim = cellView.model.get('extra');

			var left  = cw * cellDim.x;
			var width = cw * cellDim.width;

			cellView.$el.css({
				left: 	left+'%',
				top: 	(ch*cellDim.y)+'%',
				width: 	width+'%',
				height: (ch*cellDim.height)+'%'
			});
		});
	},

	// send activation / deactivation to cells (on scroll)
	updateCellVisibility : function () {
		// console.log("updateVisibleCells");

		var gridWidth = this.model.get('grid_cols');
		var xFrom = Math.round( this.layoutAttributes.position * (gridWidth - this.layoutAttributes.visible_x) );
		var layAttrs = this.layoutAttributes;

		_.each( this.model.collectionView.getItemViews(), function( cellView ) {
			var cellDim = cellView.model.get('extra');
			// ... not too far left or right
			if ( !( (cellDim.x + (cellDim.width-1)) < xFrom - 1 ||
					 cellDim.x > xFrom + layAttrs.visible_x + 1 ) 
				) {
				if ( !cellView.isVisible ) { 
					cellView.activate();
					cellView.isVisible = true;
				}
			} else {
				if ( cellView.isVisible ) {
					cellView.deactivate();
					cellView.isVisible = false;
				}
			}
		});
	}
  
});