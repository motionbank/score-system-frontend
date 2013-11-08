var config = require('config/config'),
	defaultSets = null,
	defaultSetsByUrl = null,
	//pieceMaker = null,
	dispatcher = require('dispatcher');

var loadUserSets = function loadUserSets ( user_id, next ) {
	next = next || function(){};
	
	// show "loading..."
	var showLoading = function() {
		$('#portal .enter').addClass('hidden');
		$('#portal .loading').removeClass('hidden');
		$('#cover h1 a').attr('href', '#');
	},

	// show error
	showError = function(msg) {
		$('#portal .loading').addClass('hidden');
		$('#portal .error').html(msg).fadeIn(1000);
	},

	// show "Enter site" link
	showEnter = function() {
		$('#portal .loading').addClass('hidden');
		var enter = $('#portal .enter').fadeIn(1000);
		// put link on title too
		$('#cover h1 a').attr('href', enter.find('a').attr('href'));
	};

	showLoading();
	
	jQuery.ajax({
		url: 'http://' + config.apiHost + '/users/'+user_id+'/sets',
		//url: 'http://localhost:3331/', // test faulty data
		//url: 'http://xnxnxnx.cmxmmxm', // test url not found
		dataType: 'json',
		success: function loadUserSetsSuccess ( userWithSets ) {
			if ( userWithSets ) {
				next.apply(null,[null,userWithSets]);
				showEnter();
			} else { // userWithSets == "", null, undefined
				showError('Error loading sets: Bad set data');
			}
		},
		error: function loadUserSetsError (jqXHR, textStatus, errorThrown) {
			//next.apply(null,arguments);
			showError('Error loading sets' + (textStatus ? ': ' + textStatus + ' (' + jqXHR.status + ')' : '') );
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
