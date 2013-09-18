
var chars = '_-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

module.exports = {
	generate : function generate ( length ) {
		if ( !length ) length = 20;
		var d = new Date().getTime();
		var ds = parseInt(d + Math.random() * d) + '';
		var hs = '';
		for ( var i = 0, k = 0; i < length; i++ ) {
			var c = chars[parseInt( ds.charAt(k) + ds.charAt(k+1) ) % chars.length];
			hs += c;
			k = (k+2) % ds.length;
		}
		return hs;
	}
};