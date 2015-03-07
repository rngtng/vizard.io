var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#editHeaderTemplate').html()),

  events: {
    "click h1":            "gotoRoot",
    "click #item":         "showRename",
    "click #cancelRename": "cancelRename",
    "click #rename":       "renameItem",
    "click #delete":       "deleteItem"
  },

  initialize: function(){
    _.bindAll(this, 'render');
  },

  showRename: function(event) {
    event.preventDefault();
    $('.rename').css("display", "inline-block");
    $('.menu').hide();
  },

  cancelRename: function(event) {
    event.preventDefault();
    $('.rename').hide();
    $('.menu').show();
  },

  renameItem: function(event) {
    event.preventDefault();
    this.model.setTitle($('input#modelId').val());
    this.model.save();
    this.render();
  },

  deleteItem: function(event) {
    event.preventDefault();
    var response = confirm("Are sure you want to delete " + this.model.title() + "?" );
    if (response === true) {
      this.model.destroy();
      this.gotoRoot();
    }
  },

  gotoRoot: function(event) {
    if (event) {
      event.preventDefault();
    }
    Backbone.history.navigate("/", {trigger: true});
  },

  gotoItem: function(event) {
    var href = $(event.currentTarget).attr("href");
    event.preventDefault();
    Backbone.history.navigate(href, {trigger: true});
  },

  setItem: function(item) {
    this.model = item;
    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      itemPath: this.model.id,
      itemTitle: this.model.title(),
    }));
    return this;
  }
});
