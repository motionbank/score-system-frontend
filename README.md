Motion Bank score system frontend
=================================

These files make up the front end of our "online score" system. Under development ... i don't think you want to use it right now.

**Running this locally**

The front end is a single page application based on [Chaplin.js](http://chaplinjs.org/) and [Backbone.js](http://backbone.js.org/). It requires a back end that serves the actual content through an API:
https://github.com/motionbank/score-system-backend

Copy and rename `config.sample.js` to `config.js` (in `app-base/config/`). Set values for the back end as needed.

Install [Node.js](http://nodejs.org/), we are running v0.8.2 locally.

Install [Brunch](http://brunch.io/):
```
$ npm install -g brunch
```

Now fetch the needed modules and libraries:
```
$ npm install
$ bower install
```

Run brunch:
```
$ brunch w --server # skip the --server option if you have your own
```
Now point your browser to http://localhost:3331/

**Deploy it**

Run brunch once: `brunch b` and then upload the contents of `public/` to your server.

**Extending the base**

The base of the system lives in `app-base`, you can extend anything in there by creating another directory called `app-extend` next to it. Place any HTML / CSS / JS code in there using the same structure as in `app-base`. Once brunch is run the contents will be compiled along.

See an example extension package [here](https://github.com/motionbank/score-system-frontend-sample)

****

**Resources**

See:
- http://motionbank.org/
- http://theforsythecompany.com/

We are:
- https://github.com/motionbank