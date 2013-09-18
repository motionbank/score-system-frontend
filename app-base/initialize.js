$(function(){
	var Application = require('application');
	var routes = require('routes');
	new Application({
		title : 'Testing the Chaplin.js application framework',
		controllerSuffix : '-controller',
		routes : routes,
		pushState: false
	});
});