"use strict";

var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

var app       = require('./app'),
  RootView    = require('../views/root'),
  EditorView  = require('../views/editor'),
  DiagramView = require('../views/diagram');

module.exports = Backbone.Router.extend({
  routes: {
    "edit/*itemId": "_edit",
    "*itemId":      "_show"
  },

  _show: function(itemId) {
    console.log("Router show: " + itemId);

    var items = app.rootItem;
    if (itemId) {
      items = items.filterItem(itemId);
      if (items.length == 0) {
        app.router.navigate("edit/" + itemId, { trigger: true, replace: true });
        return;
      }
    }

    new RootView({ el: $('.browse .view .content'), collection: items });
    app.showBrowser();
  },

  _edit: function(itemId) {
    console.log("Router edit: " + itemId);

    var item = app.rootItem.findOrAddItem(itemId);
    $('.edit .editor').html(new EditorView({ model: item }).$el);
    $('.edit .view .content').html(new DiagramView({ model: item }).$el);
    app.showEditor();
  }
});
