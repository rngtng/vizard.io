# vizard.io

An online editor and webservice to render UML diagrams with plantuml (http://plantuml.com)

## CAUTION

This somewhat **WIP** - stay tuned!

## Backbone

Load order:

1. main.js
3. app.js (to keep global state)
4. init rootItem (once)
5. init Router (once)
6. start routing


## Usage

```
$ jruby server.rb
```

## Deploy

When deploying to Heroku, make sure  cfgs to set:

`heroku config:add GRAPHVIZ_DOT=/app/vendor/graphviz/bin/dot`



## Similar Project

  * [websequencediagrams](https://www.websequencediagrams.com)


## About

This is a SoundCloud 20% Project
