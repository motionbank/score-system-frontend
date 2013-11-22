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
		}
	},

	initialize : function (opts) {
		this.overview_id = '';
		this.info_id = '';
		this.setLinks = [];

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
			if ( set.published ) {
				this.setLinks.push({
					title : set.title,
					url : '#/set/' + (set.path || set.id),
					id : set.id
				});
			}
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