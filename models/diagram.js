var $ = require('jquery'),
  _ = require('underscore'),
  Backbone          = require('backbone'),
  DiagramImageModel = require('./diagram_image'),
  Databackend       = require('../lib/databackend'),
  app               = require('../lib/app');

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
      "A -> B: Example Request\n" +
      "A <-- B: A Response",
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
    if (!this.get('remoteData')) {
      this.remoteLoad();
    }
    return this.get('data');
  },

  update: function(data) {
    this.set('data', data);
  },

  store: function() {
    // console.log("store model: <" + this.id + ">");
    this.save({
      remoteData: this.get('data')
    }, {
      wait: true
    });
  },

  remoteLoad: function() {
    var self = this;
    app.github.loadFile(this.id, function(data) {
      self.set('remoteData', data);
      self.trigger('externalDataLoaded');
    });
  },

  setTitle: function(title) {
    this.set('title', title);
    this.save({
      title: title
    });
  },

  title: function() {
    return this.get('title') || this.get('id');
  },

  //---- PRIVATE
  updateImage: function() {
    this.image.update(this.get('data'));
  },

  setDataFromRemote: function() {
    this.set('data', this.get('remoteData'));
  }
});
