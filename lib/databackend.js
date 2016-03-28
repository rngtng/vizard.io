var $ = require('jquery'),
  Backbone = require('backbone'),
  LocalStorage = require("backbone.localstorage");

module.exports = {
  storage: LocalStorage,
  sync: function(method, model, options) {
    // console.log('sync ' + method + ': ' + model.id + ' ');

    options.error = function(errorMessage) {
      console.log('sync ' + method + '--> error: ' + errorMessage);
    };

    var response = LocalStorage.sync(method, model, options);
    // console.log('sync ' + method + ' --> done');
    return response;
  }
};
