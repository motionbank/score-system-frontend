module.exports = function(match) {
	
	match( 'set/:setid', 'set#show' );
	match( 'set/:setid/', 'set#show' );
	match( 'set/:setid/:cellid', 'set#show' );
	match( 'set/:setid/:cellid/', 'set#show' );

	match( '', 'cover#index' );

	// match( 'error', 'error#show' ); // to test and error page (to redirect to)
	match( '*notfound', 'error#show' ); // match all other routes. passes the url in notfound attribute

};
