var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#headerTemplate').html()),

  events: {
    "click button": "createNew",
  },

  initialize: function(){
    _.bindAll(this, 'render');

    this.render();
  },

  createNew: function(event) {
    event.preventDefault();
    var modelId = $('input#modelId').val();
    Backbone.history.navigate("/" + modelId, {trigger: true});
    $('input#modelId').val("");
  },

  render: function() {
    this.$el.html($(this.template()));
    return this;
  }
});
