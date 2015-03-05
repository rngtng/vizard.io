var $ = require('jquery'),
  _ = require('underscore'),
  Backbone     = require('backbone'),
  DiagramView  = require('./diagram');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#rootTemplate').html()),

  initialize: function(){
    _.bindAll(this, 'render');

    this.render();
  },

  renderDiagrams: function(content) {
    this.collection.forEach(function(diagram){
      var diagramView = new DiagramView({ model: diagram });
      content.append(diagramView.render().el);
    }, this);
  },

  render: function() {
    this.$el.html($(this.template()));
    this.renderDiagrams(this.$el.find('.diagrams'));
    return this;
  }
});
