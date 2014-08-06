droopy-static
=============

Template for a static site with live reload


##Setup
```
npm install gulp -g
git clone https://github.com/DroopyTersen/droopy-static MyStaticWebsite
cd MyStaticWebsite
rm -force -recurse .git
npm install
```

##Run It
Just run the default gulp task and it will start an http server, launch a browser, and setup live reload so that anytime you change a file, the browser automatically refreshes.
```
gulp
```

##Extras
Its all setup for bower, so you can easily do things like 
```
bower install --save bootstrap
bower install --save jquery
```
