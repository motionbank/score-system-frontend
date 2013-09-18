module.exports = Chaplin.Model.extend({
	
	initialize: function () {
		Chaplin.Model.prototype.initialize.apply(this, arguments);
		_.extend(this, Chaplin.SyncMachine);
	}
	
});