// Break out the application running from the configuration definition to
// assist with testing.
require(["config"], function() {
  // Kick off the application.

  require(["app", "router", "models/folder"], function(app, Router, Folder) {
    // Define your master router on the application namespace and trigger all
    // navigation from this instance.

    app.router = new Router();

    Backbone.sync = function(method, model) {
      alert(method + ": " + JSON.stringify(model));
      // model.id = 1;
    };

    // Trigger the initial route and enable HTML5 History API support, set the
    // root folder to '/' by default.  Change in app.js.
    Backbone.history.start({ pushState: true, root: app.root });
  });
});
