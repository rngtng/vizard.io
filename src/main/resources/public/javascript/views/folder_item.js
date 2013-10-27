define(["backbone", "views/diagram"], function(Backbone, DiagramView) {
  var FolderItemView = Backbone.View.extend({
    tagName: "ul",

    // template: _.template( $('#folderTemplate').html()),

    initialize: function(){
      _.bindAll(this, 'render');
      this.collection.bind('add', this.render);
      this.collection.bind('remove', this.render);
      this.render();
    },

    render: function(){
      this.$el.empty();
      this.collection.each(function(item) {
        var itemView = null;
        if (item.modelType == "Diagram") {
          itemView = new DiagramView({ model: item });
        }
        else {
          itemView = new FolderItemView({collection: item.items });
        }

        this.$el.append($('<li>').append(itemView.el));
      }, this);
    }
  });

  return FolderItemView;
});
