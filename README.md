Testing Chaplin.js application framework
========================================

##Modules, theming and overriding html / css

This can be done through [brunch](http://brunch.io/)'s config file.

theme/assets/ --> get's copied into public/
theme/*.css   --> joined into public/stylesheets/theme.css
theme/*       --> all other files get handled just like under app/

##In-set event dispatcher

- based on PostMessenger

##Theming:
- replace meta tags (title, description)
- replace title
- replace favicon and twitter / fb images
? replace google analytics 
? replace google webmaster
- replace site url twitter / fb
