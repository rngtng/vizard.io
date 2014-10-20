var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#diagramTemplate').html()),

  tagName: 'li',

  events: {
    "click a":    "showFancybox",
    "dblclick a": "loadEditView"
  },

  initialize: function() {
    _.bindAll(this, 'render', 'loadEditView');
    this.listenTo(this.model.image, 'change:image', this.render);
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.image.toJSON()));
    return this;
  },

  showFancybox: function(event) {
    event.preventDefault();
    console.log('fancybox');
  },

  loadEditView: function(event) {
    Backbone.history.navigate("edit/" + this.model.id, {trigger: true});
  }
});
