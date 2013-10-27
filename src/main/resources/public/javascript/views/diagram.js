define(["backbone", "app"], function(Backbone, app) {
  var DiagramView = Backbone.View.extend({
    template: _.template( $('#diagramTemplate').html()),

    events : {
      "dblclick a" : "loadEditView"
    },

    initialize: function(){
      _.bindAll(this, 'render', 'loadEditView');
      this.model.bind('change:imageData', this.render);
      this.render();
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    },

    loadEditView: function(event) {
      app.router.navigate("edit/" + this.model.cid, {trigger: true});
    }
  });

  return DiagramView;
});
