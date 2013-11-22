var View 	 = require('views/base/view'),
	template = require('views/templates/header');

module.exports = View.extend({

	autoRender: true,
	className: 'header',
	region: 'header',
	id: 'header',
	template: template,

	events : {
		'click #main-menu li.set-link a' : function(evt) {
			$('#main-menu li').removeClass('current');
			$(evt.target).parent('li').addClass('current');
			// reset show-info link, since we switched the set.
			$('#main-menu li.hide-info-link').removeClass('hide-info-link').addClass('show-info-link');
		},

		'click #main-menu li.show-info-link' : function(evt) {
			// console.log("SHOW info");
			evt.preventDefault();
			var $li = $(evt.currentTarget);
			$li.removeClass('show-info-link').addClass('hide-info-link');
			$('.cell-collection .cell').addClass('show-info');
		},

		'click #main-menu li.hide-info-link' : function(evt) {
			// console.log("HIDE info");
			evt.preventDefault();
			var $li = $(evt.currentTarget);
			$li.removeClass('hide-info-link').addClass('show-info-link');
			$('.cell-collection .cell').removeClass('show-info');
		}
	},

	initialize : function (opts) {
		this.overview_id = '';
		this.info_id = '';
		this.setLinks = [];

		// sort by set title
		opts.sets = _.sortBy(opts.sets, function(set) {
			return set.title;
		});

		// create Set Menu
		_.each(opts.sets, function(set) {
			if ( set.path == 'sets') {
				this.overview_id = set.id;
				return; // skip main set here. it's already in the template as 'OVERVIEW'
			}
			if ( set.path == 'info') {
				this.info_id = set.id;
				return; // skip main set here. it's already in the template as 'OVERVIEW'
			}
			// list published sets only
			this.setLinks.push({
				title : set.title,
				url : '#/set/' + (set.path || set.id),
				id : set.id,
				hidden : !set.published
			});
			// if ( set.published ) {}
		}, this);
	},

	getTemplateData : function () {
		return {
			overview_id : this.overview_id,
			info_id : this.info_id,
			setLinks : this.setLinks 
		};
	}

});