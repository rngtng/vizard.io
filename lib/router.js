"use strict";

var $ = require('jquery'),
  Backbone = require('backbone');

var   app        = require('./app'),
  HeaderView     = require('../views/header'),
  BrowserView    = require('../views/browser'),
  EditHeaderView = require('../views/edit_header'),
  EditorView     = require('../views/editor'),
  DiagramView    = require('../views/diagram');
//   GithubView     = require('../views/github');
//
module.exports = Backbone.Router.extend({
  routes: {
    "": "_index",
    "edit/*itemId": "_edit",
    "*itemId":      "_show"
  },

  initialize: function(options) {
    this.headerView     = new HeaderView({ el: $('header') });
    this.browserView    = new BrowserView({ el: $('.browse .view') });
    this.editHeaderView = new EditHeaderView({ el: $('header') });
    // this.githubView     = new GithubView({ model: app.github });
  },

  _index: function(itemId) {
    var items = app.rootItem;

    this.headerView.setItems(items);
    this.browserView.setItems(items);
    app.showBrowser();
  },

  _show: function(itemId) {
    var item = app.rootItem.findItem(itemId);

    if(item === undefined) {
      app.router.navigate("edit/" + itemId, { trigger: true, replace: true });
      return;
    }

    this.editHeaderView.setItem(item);

    $('.edit .view').html(new DiagramView({ model: item, action: 'Edit' }).$el);
    app.showSingle();
  },

  _edit: function(itemId) {
    var item = app.rootItem.findOrAddItem(itemId);

    this.editHeaderView.setItem(item);

    $('.edit .editor-wrapper').show().html(new EditorView({ model: item }).$el);
    $('.edit .view').html(new DiagramView({ model: item, action: 'Show' }).$el);
    app.showEditor();
  }
});
