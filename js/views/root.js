var $ = require('jquery'),
  _ = require('underscore'),
  Backbone     = require('backbone'),
  DiagramView  = require('./diagram');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function(){
    _.bindAll(this, 'render');
  },

  renderDiagrams: function(content) {
    this.collection.forEach(function(diagram){
      var diagramView = new DiagramView({ model: diagram, action: 'edit/' });
      content.append(diagramView.render().el);
    }, this);
  },

  setItems: function(items) {
    this.collection = items;
    this.render();
  },

  render: function() {
    this.$el.html("");
    this.renderDiagrams(this.$el);
    return this;
  }
});
