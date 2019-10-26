var $ = require('jquery'),
  Backbone = require('backbone');

require("./index.html");
require("./stylesheets/pure-min.css");

Backbone.$ = $;
window.$ = $;

var app  = require('./lib/app'),
  Root   = require('./models/root'),
//   GitHub = require('./models/github'),
  Router = require('./lib/router');

app.rootItem  = new Root();
app.rootItem.fetch();

// app.github = new GitHub({id: 'root'});

app.router = new Router();
window.app = app; // Debug

Backbone.history.start({ pushState: true, root: app.root });

function KeyPressed( e ) {
  if (e.keyCode == 27) {
    Backbone.history.navigate(app.root, {
      trigger: true
    });
  }
}

document.onkeyup = KeyPressed;
