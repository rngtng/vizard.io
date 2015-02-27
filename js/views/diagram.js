var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#diagramTemplate').html()),

  className: 'diagram',

  events: {
    //"click a": "showFancybox",
    "click a": "loadEditView"
  },

  initialize: function() {
    _.bindAll(this, 'render', 'loadEditView');
    this.listenTo(this.model.image, 'change:image', this.render);
    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      title: this.model.get('id'),
      image: this.model.image.get('image')
    }));
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
