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

    var date = Date.now(),
    modelId = $('input#modelId').val() || date;

    Backbone.history.navigate("/" + modelId, {trigger: true});
    $('input#modelId').val("");
  },

  setItems: function(items) {
    this.collection = items;
    this.render();
  },

  renderDiagrams: function(content) {
    this.collection.forEach(function(diagram) {
      var diagramView = new DiagramView({ model: diagram, action: 'edit/' });
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
