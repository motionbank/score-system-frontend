var pm = require('postmessenger');

module.exports = (function(){

	var listeners = [];
	
	pm.on('connect!',function(req,res){
		addListener({ source: req.source, origin: req.origin });
	});

	pm.on(/^>>.+/,function(req, res){
		for ( var i = 0; i < listeners.length; i++ ) {
			if ( listeners[i].source !== req.source ) {
				pm.send( req.name, req.data, listeners[i].source, listeners[i].origin );
			} else {
				// ignore the one that sent it ..
			}
		}
	});

	var addListener = function addListener (l) {
		if ( listeners.indexOf(l) === -1 ) {
			for ( var i = 0; i < listeners.length; i++ ) {
				if (!listeners[i]) {
					console.log( 'invalid listener:', listeners[i] );
				}
			}
			listeners.push(l);
		}
	};

	var removeListener = function removeListener (l) {
		var li;
		if ( (li = listeners.indexOf(l)) !== -1 ) {
			listeners.slice(li,1);
		}
	}

})();