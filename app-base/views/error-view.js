var View = require('views/base/view');

module.exports = View.extend({

	autoRender: true,
  	id: 'cover', // use #cover to get styling for free
  	className: 'error container',
  	region : 'content',
  	containerMethod: 'html', // replace content instead of appending it

	initialize : function (opts) {
		if (!opts) opts = {};
		this.opts = _.defaults(opts, {
			'template' : 'default',
			'message' : ''
		});

		this.template = require( 'views/templates/errors/' + opts.template );
	},

	getTemplateData : function () {
		return this.opts;
	}
});