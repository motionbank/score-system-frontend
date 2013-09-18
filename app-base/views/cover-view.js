var View 	 = require('views/base/view');

module.exports = View.extend({

  autoRender: true,
  id: 'cover',
  className: 'cover container',
  template: require('views/templates/cover')
  
});