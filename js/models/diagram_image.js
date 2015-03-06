var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone'),
  Rusha    = require('rusha');

Backbone.$ = $;

module.exports = Backbone.Model.extend({
  initialize: function() {
    _.bindAll(this, 'update');
    _.bindAll(this, 'updateImageData', 'setImage', 'cacheKey');

    this.bind('change:imageData', this.updateImageData);
  },

  //---- PUBLIC
  update: function(imageData) {
    this.set('imageData', imageData);
  },

  //---- PRIVATE
  updateImageData: function() {
    if (this.request) {
      this.request.abort();
    }
    this.request = $.ajax({
      url: '/render.png?' + this.cacheKey(),
      type: 'post',
      data: this.get('imageData'), // + "\ntitle " + this.cacheKey()
      headers: {
        'Accept': 'image/png;base64'
      },
      success: this.setImage
    });
  },

  setImage: function(imageData) {
    this.set('image', imageData);
    this.request = undefined;
  },

  cacheKey: function() {
    return new Rusha().digest(this.get('imageData'));
  },

  defaults: {
    image: "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"
  }
});
