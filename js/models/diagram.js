var $ = require('jquery'),
  _ = require('underscore'),
  Backbone          = require('backbone'),
  DiagramImageModel = require('./diagram_image'),
  Databackend       = require('../lib/databackend');

Backbone.sync = Databackend.sync;

module.exports = Backbone.Model.extend({
  defaults: {
    data: "' Welcome to vizard.io\n" +
      "' This diagram will be auto-saved in your browser \n" +
      "' \n" +
      "' For syntax see PlantUML Language Reference Guide:  \n" +
      "' http://plantuml.sourceforge.net/PlantUML_Language_Reference_Guide.pdf \n" +
      "\n" +
      "\n" +
      "A -> B",
    remoteData: null,
    image: null
  },

  initialize: function() {
    this.initDiagram();
  },

  initDiagram: function() {
    _.bindAll(this, 'read', 'update', 'store');
    _.bindAll(this, 'updateImage', 'setDataFromRemote');

    this.image = new DiagramImageModel();

    this.bind('change:remoteData', this.setDataFromRemote);
    this.bind('change:data', this.updateImage);
    this.bind('errorOnFetch', this.updateImage);

    this.fetch({
      error: this.trigger('errorOnFetch')
    });
  },

  //---- PUBLIC
  read: function() {
    return this.get('data');
  },

  update: function(data) {
    this.set('data', data);
  },

  store: function() {
    console.log("store model: <" + this.id + ">");
    this.save({
      remoteData: this.get('data')
    }, {
      wait: true
    });
  },

  //---- PRIVATE
  updateImage: function() {
    this.image.update(this.get('data'));
  },

  setDataFromRemote: function() {
    this.set('data', this.get('remoteData'));
  }
});