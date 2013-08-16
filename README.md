Motion Bank score system frontend
=================================

These files make up the frontend (single app website) of our "online score" system. Under development ... i don't think you want to use it right now.

**Running this locally**

It requires a backend / API which needes to be installed separately:
https://github.com/motionbank/score-system-backend

Copy and rename `config-default.js` to `config.js` (in app/js/config/). Set values as needed.

Install [brunch](http://brunch.io/)
```
$ npm install brunch
```

Run brunch:
```
$ brunch w --server # skip the --server option if you have your own
```

Now point your browser to your local server (or the one that brunch started) and enjoy.

**Running on a server**

Run brunch once and the upload the contents of ```public/``` to your server.

**Resources**

See:
- http://motionbank.org/
- http://theforsythecompany.com/

We are:
- https://github.com/motionbank