var $ = require('jquery'),
  Backbone = require('backbone');

Backbone.$ = $;

var app        = require('./lib/app'),
  Databackend  = require('./lib/databackend'),
  Router       = require('./lib/router'),
  Root         = require('./models/root');

app.rootItem  = new Root();
app.rootItem.fetch();

app.router    = new Router();
window.app    = app; // Debug

// Trigger the initial route and enable HTML5 History API support, set the
// root folder to '/' by default.  Change in app.js.
Backbone.history.start({ pushState: true, root: app.root });


//window.localStorage.clear();
