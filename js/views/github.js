var $ = require('jquery'),
  _ = require('underscore'),
  Backbone     = require('backbone');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.model, 'requestToken', this.showPopup);
  },

  showPopup: function(event) {
    var token = prompt("Please enter your github token");
    if (token !== null) {
      this.model.save({'token': token });
    }
  }
});
