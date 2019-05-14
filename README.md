# vizard.io

An online editor and webservice to render UML diagrams with [plantuml](http://plantuml.com)

## Usage

```shell
npm run server
```

## Deploy

When deploying to Heroku, make sure to set cfgs and enable multi-pack:

```shell  
heroku config:add BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-multi.git
heroku config:add RAKE_ENV=production
```

Once pushed to github, heroku pipeline will pick it up and auto-deploy

## Release
Before deploy build & uglify js:

```shell
npm run build
```

## Development

### Docker

This repo comes with a Dockerfile to build the image with all dependencies. Just
run:

```
make build
```

New developement can happen *inside* the container. To enter, run:

```
make dev
```

Which brings up a bash mounted to your local source directory. From here start
the server:

```
bundle exec puma
```

Run Specs:

```
rspec
```

Or rubocop:

```
rubocop -a
```





### Native

To build css & javascript run:

```shell
npm install
npm run server
npm run watch
```



## Install jruby in paralell to ruby homebrew

```
jruby -S gem install --platform=java bundler
jruby -S bundle
```

## Requirements

### Production

-   jruby
-   graphviz

### Development

For development vizard depends on:

-   nodejs

## Dependencies

-   jquery
-   jquery localstorage
-   browserify
-   backbone
-   purecss

## Help

-   http://caniuse.com/
-   https://css-tricks.com/snippets/css/a-guide-to-flexbox/
-   http://jsdesignpatterns.com/
-   http://jsninja.com/
-   https://github.com/bengourley/modal.js

### Backbone load order

1.  main.js
2.  app.js (to keep global state)
3.  init rootItem (once)
4.  init Router (once)
5.  start routing

## Related/Similar Projects

  * [websequencediagrams](https://www.websequencediagrams.com)
  * [Draw UML](http://ogom.github.io/draw_uml)
  * Other: http://plantuml.com/external-links

## TODO/Ideas

-   Use jQuery implementation?? http://plantuml.com/jquery.html
