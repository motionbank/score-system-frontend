var View 	 = require('views/base/view');

module.exports = View.extend({

	initialize : function () {
		View.prototype.initialize.apply(this,arguments);

		this.subscribeEvent('set:scrolled',function(val){
			this.layoutAttributes.position = val;
			this.updateVisibleCells();
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
		position : 0.0,
		visible_x : 0,
		visible_y : 0,
		width : -1,
		height : -1,
		cell_width : 0,
		cell_height : 0
	},

	render : function () {

		View.prototype.render.apply(this,arguments);
		
		this.model.collectionView.render();
		// call updateCellGrid() after render finished (for it to have width, height avail)
		_(function(){
			this.updateCellGrid();
			this.updateVisibleCells();
		}).bind(this).defer();

		return this;
	},

	updateLayoutSize : function () {
		this.layoutAttributes.width  = this.$el.width();
		this.layoutAttributes.height = this.$el.height();
	},

	updateCellGrid : function () {

		var layAttrs = this.layoutAttributes;

		this.updateLayoutSize();
		
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

		//console.log( this.layoutAttributes );
	},

	updateVisibleCells : function () {

		var gridWidth = this.model.get('grid_cols');
		var xFrom = Math.round( this.layoutAttributes.position * (gridWidth - this.layoutAttributes.visible_x) );

		var cw = 100.0/gridWidth;
		var ch = 100.0/this.layoutAttributes.visible_y;

		var absCw = (1.0*this.layoutAttributes.width) /this.layoutAttributes.visible_x,
			absCh = (1.0*this.layoutAttributes.height)/this.layoutAttributes.visible_y;

		// TODO: clean this mess
		_.each( this.model.collectionView.getItemViews(), 
				(function(layAttrs){ return function( cellView, cid ) {

			var cellDim = cellView.model.get('extra');

			cellView.$el.removeClass('lastcol').removeClass('lastrow');

			// ... not too far left or right
			if ( !( (cellDim.x + (cellDim.width-1)) < xFrom - 1 ||
					 cellDim.x > xFrom + layAttrs.visible_x + 1 ) 
				) {
				
				var left  = cw * cellDim.x;
				var width = cw * cellDim.width;

				// show, set position and size in % to make responsive
				
				cellView.activate();

				cellView.$el.css({
					left: 	left+'%',
					top: 	(ch*cellDim.y)+'%',
					width: 	width+'%',
					height: (ch*cellDim.height)+'%'
				});

				// add media-query style classes to cells
				cellView.$el.attr( 'class', cellView.$el.attr('class').replace(/cell-(width|height)-[0-9]+/ig,'') );
				cellView.$el.addClass( 'cell-width-'+ (parseInt((absCw*cellDim.width) /50)*50) ).
					   addClass( 'cell-height-'+(parseInt((absCh*cellDim.height)/50)*50) );

				if ( (cellDim.x-xFrom) + cellDim.width >= layAttrs.visible_x ) {
					cellView.$el.addClass('lastcol');
				}
				if ( cellDim.y+cellDim.height >= layAttrs.visible_y ) {
					cellView.$el.addClass('lastrow');
				}
			} else {
				cellView.deactivate();
			}

			// if ( showCellInfo ) {
			// 	cellView.$el.addClass('with-info');
			// } else {
			// 	cellView.$el.removeClass('with-info');
			// }
		}})(this.layoutAttributes));
	}
  
});