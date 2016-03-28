var $ = require('jquery'),
  Backbone     = require('backbone'),
  DiagramModel = require('./diagram'),
  Databackend  = require('../lib/databackend');

Backbone.sync = Databackend.sync;

module.exports = Backbone.Collection.extend({
  localStorage: new Databackend.storage("vizard-root"),

  model: DiagramModel,

  filterItem: function(itemId) {
    return this.filter({id: itemId});
  },

  findItem: function(itemId) {
    return this.findWhere({id: itemId});
  },

  findOrAddItem: function(itemId) {
    var item = this.findWhere({id: itemId});

    if(item === undefined) {
      item = this.create({id: itemId});
    }
    return item;
  }
});
