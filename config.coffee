# See https://github.com/brunch/brunch/blob/stable/docs/config.md for docs.
exports.config =

  paths:
    watched:
        [ 'app-base', 'test', 'vendor',  # defaults
          'app-extend'                   # extending app-base
        ]

  files:
    javascripts:
      joinTo:
        'javascripts/app-base.js'   : /^app-base/
        'javascripts/app-extend.js' : /^app-extend/
        'javascripts/vendor.js'     : /^(?!app(-base|-extend))/

    stylesheets:
      joinTo:
        'stylesheets/app-base.css'   : /^app-base/
        'stylesheets/app-extend.css' : /^app-extend/

    templates:
      joinTo:
        'javascripts/app-base.js'   : /^app-base/
        'javascripts/app-extend.js' : /^app-extend/

  modules:

    nameCleaner: (path) ->
      path.replace(/^app(-base|-extend)\//, '') # clean theme from name to override app

  server:
    port: 3331