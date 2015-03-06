var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#headerTemplate').html()),

  events: {
    "click #create": "createNew",
    "keypress #modelId": "enableCreate"
  },

  initialize: function(){
    _.bindAll(this, 'render');
    $('#create').attr("disabled", true);
  },

  enableCreate: function() {
    $('#create').attr("disabled", false);
  },

  createNew: function(event) {
    event.preventDefault();
    var modelId = $('input#modelId').val();
    if( modelId ) {
      Backbone.history.navigate("/" + modelId, {trigger: true});
      $('input#modelId').val("");
      $('#create').attr("disabled", true);
    }
  },

  setItems: function(items) {
    this.collection = items;
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});
