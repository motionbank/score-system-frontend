/* cell-collection-view.js */
var CellDefaultView = require('views/cell-view'),
	BaseCollectionView = require('views/base/collection-view'),
	mediator = require('mediator'),
	postmessenger = require('postmessenger');

module.exports = BaseCollectionView.extend({

	className : 'cell-collection',
	itemView : CellDefaultView,
	region : 'grid',
	autoRender : false,
	//renderItems : false,
	template : require('views/templates/cell-collection'),

	initialize : function () {
		BaseCollectionView.prototype.initialize.apply(this,arguments);

		// postmessenger.on('>>ping',function(req,res){
		// 	console.log( req.data );
		// });
	},

	render : function () {
		console.log("rendering cell collection");
		BaseCollectionView.prototype.render.apply(this,arguments);
		// after rendring is finished attach scroll listener
		_(function(){
			var self = this;
			$(this.$el.parent()).scroll(function(){
				var $el = $(this);
				var val = $el.scrollLeft() / (self.$el.width()-$el.width());
				self.publishEvent('set:scrolled',val);
			});
		}).bind(this).defer();
		return this;
	},

	// this allows for each cell model to use a specialized view per cell type
	initItemView : function (model) {
		var CellTypeView = CellDefaultView;
		try {
			var CellTypeView = require('views/cell-types/cell-'+model.get('type')+'-view');
		} catch (e) {
			// ignore
		}

		var cellView = new CellTypeView({ model:model, autoRender:false });
		if (model.get('type') === 'iframe' || model.get('type') === 'vimeo') {
			// handle clicking on this cell
			cellView.delegate( 'click', function(evt) {
				// console.log("click: " + cellView.cid);
				// notify collection so it can handle focuesd state
				model.collection.focusCell(model);
			});
		}
		
		return cellView;
	},

	// scroll to a cell
	scrollToCell : function (cellid, time) {
		if (cellid == undefined) return;
		var cellView = _.find(this.subviews, function(cellView) {
			return cellView.model.id == cellid;
		});
		if (cellView) cellView.scrollTo(time);
	}

});