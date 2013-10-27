define(["backbone", "models/folder_items"], function(Backbone, Items) {
  var FolderModel = Backbone.Model.extend({
    items: null,

    add: function(item) {
      this.items.add(item);
    },

    remove: function(item) {
      this.items.remove(item);
    },

    at: function(pos) {
      this.items.at(pos);
    },

    initialize: function() {
      this.items = new Items();
    }
    // model: function(attrs, options) {
    //   console.log("hihi");
    //   console.log(attrs);
    //   console.log(options);
    //   if (condition) {
    //     return new Diagram();
    //   } else {
    //     return new Folder();
    //   }
    // }
  });

  return FolderModel;
});

