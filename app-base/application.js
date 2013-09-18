var config = require('config/config'),
	defaultSets = null,
	defaultSetsByUrl = null,
	//pieceMaker = null,
	dispatcher = require('dispatcher');

var loadUserSets = function loadUserSets ( user_id, next ) {
	next = next || function(){};
	jQuery.ajax({
		url: 'http://' + config.apiHost + '/users/'+user_id+'/sets',
		dataType: 'json',
		success: function loadUserSetsSuccess ( userWithSets ) {
			next.apply(null,[null,userWithSets]);
		},
		error: function loadUserSetsError (err) {
			next.apply(null,arguments);
		}
	});
}

module.exports = Chaplin.Application.extend({
	initialize : function ( options ) {

		// call super()
		Chaplin.Application.prototype.initialize.apply(this,arguments);
		
		// // initialize PieceMaker API client
		// pieceMaker = new PieceMakerApi({
		// 	piecemakerError : function () {
		// 		console.log( arguments );
		// 	}},
		// 	'http://' + config.pieceMaker.host,
		// 	config.pieceMaker.apiKey
		// );
		// // pieceMaker.login( config.pieceMaker.user,
		// // 	config.pieceMaker.pass,
		// // 	function(apiKey){
		// // 		console.log( apiKey );
		// // });
		// pieceMaker.listUsers(function(){
		// 	console.log( arguments );
		// });

		loadUserSets(1,function(err,userWithSets){
			if ( !err ) {
				defaultSets = [];
				defaultSetsByUrl = {};
				_.each(userWithSets.sets, function(set){
					defaultSets.push( set );
					defaultSetsByUrl[set.path] = set;
				});
			}
		});

		// subscribe to some events
		this.subscribeEvent( '!app:get-set-id-for-path',
			function( setpath, cbSucc,cbErr){
				if ( defaultSetsByUrl && setpath in defaultSetsByUrl ) {
					cbSucc( defaultSetsByUrl[setpath].id );
				}
		});

		var self = this;
		$(window).resize(function(){
			self.publishEvent('window:resized');
		});
	}
});
