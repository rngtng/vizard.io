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
    "": "_index",
    "edit/*itemId": "_edit",
    "*itemId":      "_show"
  },

  initialize: function(options) {
    this.headerView     = new HeaderView({ el: $('header') });
    this.rootView       = new RootView({ el: $('.browse .view') });
    this.editHeaderView = new EditHeaderView({ el: $('header') });
  },

  _index: function(itemId) {
    var items = app.rootItem;

    this.headerView.setItems(items);
    this.rootView.setItems(items);
    app.showBrowser();
  },

  _show: function(itemId) {
    var item = app.rootItem.findItem(itemId);

    if(item === undefined) {
      app.router.navigate("edit/" + itemId, { trigger: true, replace: true });
      return;
    }

    this.editHeaderView.setItem(item);

    $('.edit .editor-wrapper').html(new EditorView({ model: item }).$el);
    $('.edit .view').html(new DiagramView({ model: item, action: 'edit/' }).$el);
    app.showSingle();
  },

  _edit: function(itemId) {
    var item = app.rootItem.findOrAddItem(itemId);

    this.editHeaderView.setItem(item);

    $('.edit .editor-wrapper').html(new EditorView({ model: item }).$el);
    $('.edit .view').html(new DiagramView({ model: item }).$el);
    app.showEditor();
  }
});
