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

Backbone.history.start({ pushState: true, root: app.root });

function KeyPressed( e ) {
  if (e.keyCode == 27) {
    Backbone.history.navigate("/", {trigger: true});
    // window.history.back();
  }
}

document.onkeyup = KeyPressed;
