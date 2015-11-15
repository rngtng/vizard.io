var $ = require('jquery'),
  _ = require('underscore'),
  Backbone     = require('backbone'),
  DiagramView  = require('./diagram');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#browserTemplate').html()),

  events: {
    "click #create": "createNew",
  },

  initialize: function(){
    _.bindAll(this, 'render');
  },

  createNew: function(event) {
    event.preventDefault();

    var modelId =  'diagram' + Date.now() + '.pu';

    Backbone.history.navigate("/" + modelId, {trigger: true});
  },

  setItems: function(items) {
    this.collection = items;
    this.render();
  },

  renderDiagrams: function(content) {
    this.collection.forEach(function(diagram) {
      var diagramView = new DiagramView({ model: diagram, action: 'Edit' });
      content.append(diagramView.render().el);
    }, this);
  },

  render: function() {
    this.$el.html("");

    if (this.collection.length > 0) {
      this.renderDiagrams(this.$el);
    } else {
      this.$el.html(this.template());
    }
    return this;
  }
});
