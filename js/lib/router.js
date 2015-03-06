"use strict";

var $ = require('jquery'),
  _ = require('underscore'),
  Backbone = require('backbone');

Backbone.$ = $;

var   app        = require('./app'),
  HeaderView     = require('../views/header'),
  RootView       = require('../views/root'),
  EditHeaderView = require('../views/edit_header'),
  EditorView     = require('../views/editor'),
  DiagramView    = require('../views/diagram');

module.exports = Backbone.Router.extend({
  routes: {
    "edit/*itemId": "_edit",
    "*itemId":      "_show"
  },

  initialize: function(options) {
    this.headerView     = new HeaderView({ el: $('header') });
    this.rootView       = new RootView({ el: $('.browse .view') });
    this.editHeaderView = new EditHeaderView({ el: $('header') });
  },

  _show: function(itemId) {
    var items = app.rootItem;

    if (itemId) {
      items = items.filterItem(itemId);
      if (items.length === 0) {
        app.router.navigate("edit/" + itemId, { trigger: true, replace: true });
        return;
      }
    }

    this.headerView.setItems(items);
    this.rootView.setItems(items);
    app.showBrowser();
  },

  _edit: function(itemId) {
    var item = app.rootItem.findOrAddItem(itemId);

    this.editHeaderView.setItem(item);

    $('.edit .editor-wrapper').html(new EditorView({ model: item }).$el);
    $('.edit .view').html(new DiagramView({ model: item }).$el);
    app.showEditor();
  }
});
