$(function(){
	var Application = require('application');
	var routes = require('routes');
	console.log( 'creating application' );
	new Application({
		title : 'Motion Bank online score system',
		controllerSuffix : '-controller',
		routes : routes,
		pushState: false
	});
});