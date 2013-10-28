var CellDefaultView = require('views/cell-view'),
	config 			= require('config/config'),
	pm 				= require('postmessenger'),
	hasher			= require('hasher');

module.exports = CellDefaultView.extend({

	events : {
		'click' : 'renderContent'
	},

	// keep this in sync with cell-vimeo!
	render : function () {
		CellDefaultView.prototype.render.apply(this,arguments);

		if ( this.model.attributes['autoload'] && 
			/^(1|true)$/i.test(this.model.attributes['autoload']) ) {
			this.renderContent();
		}

		return this;
	},

	renderContent : function () {

		// show content, hide info
		$('.element-hidden',this.$el).removeClass('element-hidden');
		$('.info',this.$el).addClass('element-hidden');

		// load iframe from data-src
		$('iframe',this.$el).attr('src',$('iframe',this.$el).data('src'));

		// connect to iframe with postmessenger
		_(function(){
			var view = this;
			$('iframe',this.$el).load(function(){
				view.$iframe = $(this);
				// if iframe on another domain add that to the accept list
				var src = view.model.get('iframe-src');
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
		}).bind(this).defer();
	},

	getTemplateData : function () {
		var data = CellDefaultView.prototype.getTemplateData.apply(this,arguments);
		if ( Handlebars.compile ) {
			data['iframe-src'] = Handlebars.compile(data['iframe-src'])(config);
		}
		var spl = data['iframe-src'].split('?');
		data['iframe-src'] = spl[0] + '?' + 'domain=http://' + config.host + '&' + (spl[1] || '');
		// if ( false === /^http[s]:\/\/.+/.test(data['iframe-src']) ) {
		// 	data['iframe-src'] = 'http://' + config.host + config.baseUrl + data['iframe-src'];
		// }
		
		// collect attributes for <iframe>
		data.attr = {};
		_.each(data.fields, function(element, index, list) {
			if (element.name.substr(0,5) == 'attr-') {
				var attrName = element.name.substr(5);
				data.attr[attrName] = element.value;
			}
		});
		
		return data;
	}

});