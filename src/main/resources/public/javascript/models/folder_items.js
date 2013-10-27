define(["backbone"], function(Backbone) {
  var ItemsCollection = Backbone.Collection.extend({
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

  return ItemsCollection;
});

