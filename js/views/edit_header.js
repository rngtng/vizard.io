var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#editHeaderTemplate').html()),

  events: {
    "click #delete": "deleteItem",
    "click h1": "gotoRoot",
    "click #item": "gotoItem",
  },

  initialize: function(){
    _.bindAll(this, 'render');
  },

  deleteItem: function(event) {
    event.preventDefault();
    var response = confirm("Are sure you want to delete " + this.model.get('id') + "?" );
    if (response === true) {
      this.model.destroy();
      this.gotoRoot();
    }
  },

  gotoRoot: function(event) {
    Backbone.history.navigate("/", {trigger: true});
  },

  gotoItem: function(event) {
    Backbone.history.navigate("/" + this.model.get('id'), {trigger: true});
  },

  setItem: function(item) {
    this.model = item;
    this.render();
  },

  render: function() {
    this.$el.html(this.template({
      itemTitle: this.model.get('id'),
      rootTitle: 'asd', //this.model.get('id'),
    }));
    return this;
  }
});
