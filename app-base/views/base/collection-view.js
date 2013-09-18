var View = require ('views/base/view');

module.exports = Chaplin.CollectionView.extend({

	// initialize : function () {
	// 	Chaplin.CollectionView.prototype.initialize.apply(this, arguments);
	// },

	// This class doesn’t inherit from the application-specific View class,
	// so we need to borrow the method from the View prototype:
	getTemplateFunction : View.prototype.getTemplateFunction

});