module.exports = function(match) {

	match( 'set/:setid', 'set#show' 
		//,{ constraints: { setid: /^\d+$/ }}
	);
	match( '', 'cover#index' );

};
