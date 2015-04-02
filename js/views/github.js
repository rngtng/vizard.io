var $ = window.jQuery = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone'),
  Remodal = require('remodal');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  template: _.template($('#githubModealTemplate').html()),

  initialize: function(){
    _.bindAll(this, 'render', 'showPopup');
    this.listenTo(this.model, 'requestToken', this.showPopup);
    this.render();
  },

  showPopup: function(event) {
    var el = $('[data-remodal-id=modal]'),
    modal = $.remodal.lookup[el.data('remodal')];
    modal.open();

    // var token = prompt("Please enter your github token");
    // if (token !== null) {
    //   this.model.save({'token': token });
    // }
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});
