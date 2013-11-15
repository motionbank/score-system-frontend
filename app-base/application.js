/* application.js */
var config = require('config/config'),
	defaultSets = null,
	defaultSetsById = null,
	defaultSetsByUrl = null,
	//pieceMaker = null,
	dispatcher = require('dispatcher');

// show "loading..."
var showLoading = function() {
	$('#portal .enter').addClass('hidden');
	$('#portal .loading').removeClass('hidden');
	$('#cover h1 a').attr('href', '#');
};

// show error
var showError = function(msg) {
	$('#portal .loading').addClass('hidden');
	$('#portal .error').html(msg).fadeIn(1000);
};

// show "Enter site" link
var showEnter = function() {
	$('#portal .loading').addClass('hidden');
	var enter = $('#portal .enter').fadeIn(1000);
	// put link on title too
	$('#cover h1 a').attr('href', enter.find('a').attr('href'));
};

var loadUserSets = function loadUserSets ( user_id, next ) {
	next = next || function(){};

	showLoading();
	
	jQuery.ajax({
		url: 'http://' + config.apiHost + '/' + config.apiBaseUrl + '/sets.json',
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
		},
		timeout: 10000
	});
}

module.exports = Chaplin.Application.extend({

	initialize : function ( options ) {

		this.subscribeEvent( '!app:get-set-id-for-path',
			function( setPathOrId, cbSucc, cbErr){
				if ( defaultSetsByUrl && setPathOrId in defaultSetsByUrl ) {
					cbSucc( defaultSetsByUrl[setPathOrId].id );
				} else if ( defaultSetsById && setPathOrId in defaultSetsById ) {
					cbSucc( setPathOrId );
				} else {
					loadUserSets(1, function(){
						setsLoadedCallback.apply(this,arguments);
						if ( setPathOrId in defaultSetsByUrl ) {
							cbSucc( defaultSetsByUrl[setPathOrId].id );
						} else if ( setPathOrId in defaultSetsById ) {
							cbSucc( setPathOrId );
						} else {
							showError( 'Error loading sets' );
						}
					});
				}
		});

		Chaplin.Application.prototype.initialize.apply(this,arguments);

		var setsLoadedCallback = function setsLoadedCallback (err, sets) {
			if ( !err ) {
				defaultSets = [];
				defaultSetsByUrl = {};
				defaultSetsById = {};
				_.each(sets, function(set) {
					defaultSets.push( set );
					defaultSetsById[set.id] = set;
					defaultSetsByUrl[set.path] = set;
				});
			}
		};

		loadUserSets(1, setsLoadedCallback);

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

		var self = this;
		$(window).resize(function(){
			self.publishEvent('window:resized');
		});
	}
});
