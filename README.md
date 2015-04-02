# vizard.io

An online editor and webservice to render UML diagrams with plantuml (http://plantuml.com)

## Usage

```
npm run server
```

## Deploy

When deploying to Heroku, make sure to set cfgs and enable multi-pack:

```
  heroku config:add GRAPHVIZ_DOT=/app/graphviz/bin/dot
  heroku config:add BUILDPACK_URL=https://github.com/heroku/heroku-buildpack-multi.git
  heroku config:add RAKE_ENV=production
```

Before deploy build & uglify js:

```
  npm run build
```


## Development

To build css & javascript run:

```
  npm install
  npm run server
  npm run watch
```


## Requirements

### Production
  - jruby
  - graphviz


### Development
  - nodejs


## Dependencies
  - jquery
  - jquery localstorage
  - browserify
  - backbone
  - purecss



## Help

- http://caniuse.com/
- https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- http://jsdesignpatterns.com/
- http://jsninja.com/
- https://github.com/bengourley/modal.js

### Backbone load order

  1. main.js
  2. app.js (to keep global state)
  3. init rootItem (once)
  4. init Router (once)
  5. start routing


## Related/Similar Projects

  * [websequencediagrams](https://www.websequencediagrams.com)


'08c7612351d1da876509761e94e71f1d40bd2123'

