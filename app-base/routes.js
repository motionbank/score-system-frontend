// The routes for the application. This module returns a function.
// `match` is match method of the Router

module.exports = function(match) {

	match( 'set/:setid', 'set#show' 
		//,{ constraints: { setid: /^\d+$/ }}
	);
	match( '', 'cover#index' );

};
