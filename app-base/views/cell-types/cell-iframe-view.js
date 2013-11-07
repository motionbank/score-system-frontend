var CellDefaultView = require('views/cell-view'),
	config 			= require('config/config'),
	pm 				= require('postmessenger'),
	hasher			= require('hasher');

module.exports = CellDefaultView.extend({

	// events : {
	// 	'click' : function () {
	// 		this.renderContent();
	// 	}
	// },

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
		// load iframe from data-src
		$('iframe',this.$el).attr('src',$('iframe',this.$el).data('src'));

		// connect to iframe with postmessenger
		_(function(){

			var view = this;
			var iframe = $('iframe',this.$el);
			
			iframe.load(function() {
				// show content, hide info
				$('.element-hidden',view.$el).removeClass('element-hidden');
				$('.info',view.$el).addClass('element-hidden');

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

		this.$el.css({
			'background-image' : 'none'
		});
	},

	getTemplateData : function () {
		var data = CellDefaultView.prototype.getTemplateData.apply(this,arguments);
		if ( Handlebars.compile && data['iframe-src'] ) {
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
	},
	
	listen : {
		// listen to changes of the active property
		'change:focused model' : function(model, focused, options) {
			if (focused) {
				this.activate();
				this.renderContent();
			} else {
				if (!model.isSticky()) this.deactivate();
			}
		}
	},

	activate : function () {
		if ( !this.active ) {
			console.log("activate iframe: " + this.cid);

			this.active = true; // needs to be before render(). why? don't know...

			if ( !this.model.isSticky() ) {
				this.render();
			} else {
				if (!this.rendered) {
					this.render();
					var iframe = $('iframe', this.$el)[0];
					var that = this;
					$(iframe).one('load', function(){
						pm.send(that.active ? 'activate!' : 'deactivate!', {}, this.contentWindow );
						that.rendered = true;
					});
				} else {
					var iframe = $('iframe', this.$el)[0];
					pm.send( 'activate!', {}, iframe.contentWindow );
			}}

		}
	},

	deactivate : function () {
		if ( this.active ) {
			if (!this.model.isSticky()) {
				console.log("deactivate iframe: " + this.cid);
				console.log(this);
				//this.$el.empty();
				// remove content and show info again
				$('.content', this.$el).remove();
				$('.info', this.$el).removeClass('element-hidden');

				this.$el.css({
					'background-image': 'url('+this.model.getPosterImageURL()+')'
				});

				this.rendered = false;
			} else {
				var iframe = $('iframe', this.$el)[0];
				if (iframe)  {
					pm.send('deactivate!', {}, iframe.contentWindow );
				}
			}
			this.active = false;
		}
	}
});