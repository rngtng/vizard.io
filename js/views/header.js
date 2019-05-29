var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#headerTemplate').html()),

  events: {
    "click #create": "createNew",
  },

  initialize: function(){
    _.bindAll(this, 'render');
  },

  createNew: function(event) {
    event.preventDefault();
    var modelId = 'diagram' + Date.now() + '.puml';
    Backbone.history.navigate("/" + modelId, {trigger: true});
  },

  setItems: function(items) {
    this.collection = items;
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    $('header').toggleClass('hidden', (this.collection.length < 1) );
    return this;
  }
});
