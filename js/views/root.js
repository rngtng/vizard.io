var $ = require('jquery'),
  _ = require('underscore'),
  Backbone       = require('backbone'),
  DiagramView    = require('./diagram');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#rootTemplate').html()),

  events: {
    "click button": "createNew",
  },

  initialize: function(){
    _.bindAll(this, 'render');

    this.render();
  },

  createNew: function(event) {
    event.preventDefault();
    var modelId = $('input#modelId').val();
    Backbone.history.navigate("/" + modelId, {trigger: true});
  },

  diagrams: function() {
    var content = $('<ul>');
    this.collection.forEach(function(diagram){
      var diagramView = new DiagramView({ model: diagram });
      content.append(diagramView.render().el);
    }, this);
    return content;
  },

  render: function() {
    this.$el.html(
      $(this.template())
       .filter('.diagrams')
       .html(this.diagrams())
       .end()
    );
    return this;
  }
});
