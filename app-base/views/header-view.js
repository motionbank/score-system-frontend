var View 	 = require('views/base/view'),
	template = require('views/templates/header');

module.exports = View.extend({

  autoRender: true,
  className: 'header',
  region: 'header',
  id: 'header',
  template: template
  
});