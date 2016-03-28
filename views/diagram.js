var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#diagramTemplate').html()),

  className: 'diagram',

  events: {
    "click .btnEdit": "gotoView",
    "click .btnShow": "gotoView",
    "click .btnShrink": "imgFit",
    "click .btnExtend": "imgFit",
    "click .btnDownload": "imgDownload",
    "click .img": "clickAction"
  },

  initialize: function(options) {
    this.action = options.action || 'Show';
    _.bindAll(this, 'render');
    this.listenTo(this.model.image, 'change:image', this.render);
    this.render();
  },

  imgFit: function(event) {
    event.preventDefault();
    this.$el.toggleClass('fit');
  },

  clickAction: function(event) {
    event.preventDefault();
    this.$el.find('.btn' + this.action).click();
  },

  gotoView: function(event) {
    var href = $(event.currentTarget).attr("href");
    event.preventDefault();
    Backbone.history.navigate(href, {trigger: true});
  },

  render: function() {
    this.$el.html(this.template({
      itemPath: this.model.id,
      itemTitle: this.model.title(),
      image: this.model.image.get('image'),
      action: this.action,
    }));
    return this;
  }
});
