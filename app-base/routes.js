module.exports = function(match) {

	match( 'set/:setid', 'set#show' 
		//,{ constraints: { setid: /^\d+$/ }}
	);
	match( '', 'cover#index' );

	// match( 'error', 'error#show' ); // to test and error page (to redirect to)
	match( '*notfound', 'error#show' ); // match all other routes. passes the url in notfound attribute

};
