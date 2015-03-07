var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#diagramTemplate').html()),

  className: 'diagram',

  events: {
    "click a": "gotoEditView"
  },

  initialize: function(options) {
    this.action = options.action || '';
    _.bindAll(this, 'render');
    this.listenTo(this.model.image, 'change:image', this.render);
    this.render();
  },

  gotoEditView: function(event) {
    var href = $(event.currentTarget).attr("href");
    event.preventDefault();
    Backbone.history.navigate(href, {trigger: true});
  },

  render: function() {
    this.$el.html(this.template({
      itemPath: this.action + this.model.id,
      itemTitle: this.model.title(),
      image: this.model.image.get('image')
    }));
    return this;
  }
});
