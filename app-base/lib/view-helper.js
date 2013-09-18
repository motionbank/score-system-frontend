var mediator = require('mediator');

// Application-specific view helpers
// http://handlebarsjs.com/#helpers
// --------------------------------

// Map helpers
// -----------

// Make 'with' behave a little more mustachey.
Handlebars.registerHelper( 'with', function (context, options) {
  if ( !context || Handlebars.Utils.isEmpty( context ) ) {
    options.inverse(this);
  } else {
    options.fn(context);
  }
});

// Inverse for 'with'.
Handlebars.registerHelper( 'without', function (context, options) {
  var inverse = options.inverse;
  options.inverse = options.fn;
  options.fn = inverse;
  Handlebars.helpers.with.call(this, context, options);
});

// Get Chaplin-declared named routes. {{#url "like" "105"}}{{/url}}
Handlebars.registerHelper( 'url', function () {
  
  var routeName = arguments[0],
      options = arguments[arguments.length-1],
      params = [];
  for ( var i = 1; i < arguments.length-1; i++ ) {
    params.push( arguments[i] );
  }

  var url = null;

  // Backbone events are synchronous, so this is possible.
  mediator.publish(
    '!router:reverse', 
    routeName, 
    params, 
    function (result) {
      url = result ? "/#{result}" : routeName;
    }
  );
  
  return url;
});