define(["backbone"], function(Backbone) {
  var FolderNavigationView = Backbone.View.extend({
    tagName: 'ul',

    initialize: function(){
      this.render();
    },

    render: function(){
      // this.collection.each(function(diagram){
      //   var diagramView = new DiagramView({ model: diagram });
      //   this.$el.append(diagramView.el);
      // }, this);
    }
  });

  return FolderNavigationView;
});


