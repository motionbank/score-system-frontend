$(function(){
	var Application = require('application');
	var routes = require('routes');
	new Application({
		title : 'Motion Bank online score system',
		controllerSuffix : '-controller',
		routes : routes,
		pushState: false
	});
});