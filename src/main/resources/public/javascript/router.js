define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone"),
  app = require("app"),
  init = function(url) {
    require(["models/folder", "models/diagram"], function(Folder, Diagram) {
       if (!app.rootFolder) {
          app.rootFolder = new Folder();
          app.rootFolder.add(new Diagram());
       }
    });
  };

  // initGithub: function(url) {
  //   require(["models/github_folder"], function(GithubFolder, Diagram) {
  //     return new GithubFolder(url);
  //   });
  // }

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    routes: {
      "new":       "_new",
      "edit/:id":  "_edit",
      "*url":      "_show"
    },

    _new: function() {
      console.log('new');
      // new Editor({
      //   model: diagram
      //   // id: "document-row-" + doc.id
      // });
    },

    _edit: function(url) {
      var diagram = init(url),
      showEditor = function() {
        $('.edit').animate({'margin-left':'0'}, 500);
        $('.navigation').animate({'margin-left':'100%'}, 500);
      };

      if (diagram) {
        require(["views/diagram_item"], function(DiagramView) {
          $('.edit .view .content').html(new DiagramView({ model: diagram }).$el);
        });
        showEditor();
      }
      else {
        // show view
        showEditor();
      }
    },

    _show: function(url) {
      var diagram = init(url),
      showBrowser = function() {
        $('.edit').animate({'margin-left':'-100%'}, 500);
        $('.navigation').animate({'margin-left':'0'}, 500);
      };

      require(["views/folder_navigation", "views/folder_item"], function(FolderNavigationView, FolderItemView) {
        $('.show .view .content').html(new FolderItemView({collection: app.rootFolder.items}).$el);
      });

      showBrowser();

      if (diagram) {
         // app.router.navigate("edit", {trigger: true, replace: true});
      }
    }

  });
});


// var subFolder = new Folder();
// subFolder.add(new Diagram());
// app.rootFolder.add(new Diagram());
// app.rootFolder.add(subFolder);
// $('.show .navigation .menu').append(new FolderNavigationView({collection: app.root_folder}).$el);

