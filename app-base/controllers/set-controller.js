var Controller = require('controllers/base/controller'),
    SetView    = require('views/set-view'),
    SetModel   = require('models/set-model'),
    ErrorView  = require('views/error-view'),
    config 	   = require('config/config');

var current_opts = prev_opts = {}; // hack this sh*t

module.exports = Controller.extend({

	show : function ( opts ) {
		// console.log("set#show", opts.setid, opts.cellid);
		
		prev_opts = current_opts;
		current_opts = opts;

		this.compose('set', {
			compose : function() {
				// console.log("set compose");

				// create set model
				this.model = new SetModel();

				// create set view
				this.view = new SetView({
					region: 'content',
					model: this.model
				});
				
				this.model.fetch({
					id : opts.setid,

					error : function(model, response, options) {
						$('header #main-menu').hide();
						//Chaplin.helpers.redirectTo('error#show', {message: 'Error message'}); // use this to redirect to an error page (changes url)
						new ErrorView( {message : 'Couldn\'t get the set you requested. (' + response.status + ')'} );
					}
				});

				this.model.synced(function(){
					this.view.render();

					// scroll (jump) to cellid
					_(function() {
						if (current_opts.cellid) {
							this.model.collectionView.scrollToCell(current_opts.cellid, 0);
						}

						// set window title from config
						if (config.title && config.title.title) {
							document.title = this.model.get('title') + " - " + config.title.title + " - Motion Bank";
						}

						// show correct menu entry
						$('#main-menu li').removeClass('current');
						$('#main-menu li[data-setid=' +  this.model.get("id") + ']').addClass('current');
						$('#main-menu').fadeIn(500);

					}).bind(this).defer();
				}, this);
			},

			check : function() {
				// console.log("set check");
				// differnet set -> reload
				if ( current_opts.setid != prev_opts.setid ) {
					return false; //rerun compose()
				}

				// same set, but removed cell id -> reload
				if ( current_opts.cellid == undefined && current_opts.setid == prev_opts.setid ) {
					return false; //rerun compose()
				}

				// same set, cell id given -> scroll to cell
				if (current_opts.cellid) {
					if ( this.model.collectionView ) {
						this.model.collectionView.scrollToCell(current_opts.cellid, 0);
					}
				}

				return true;  // don't rerun compose()
			}

		});

	}

});
