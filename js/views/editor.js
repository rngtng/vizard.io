var $ = require('jquery'),
  _  = require('underscore'),
  Backbone = require('backbone'),
  ace      = require('brace');

require('../lib/ace-mode-diagram');
require('brace/theme/github');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  id: 'editor',

  initialize: function(){
    var model = this.model;

    _.bindAll(this, 'render', 'updateModel');
    this.editor = ace.edit(this.el);
    this.editor.setFontSize(10);
    this.editor.setTheme("ace/theme/github");
    this.editor.getSession().setMode('ace/mode/diagram');
    this.editor.getSession().setValue(model.read());
    this.editor.setOption("scrollPastEnd", 0.3);
    this.editor.commands.addCommand({
        name: 'save',
        bindKey: {
          win: 'Ctrl-S',
          mac: 'Command-S',
          sender: 'editor|cli'
        },
        exec: function(editor) {
          model.store();
        }
      });
    this.editor.commands.addCommand({
        name: 'back',
        bindKey: {
          win: 'ESC',
          mac: 'ESC',
          sender: 'editor|cli'
        },
        exec: function(editor) {
          Backbone.history.navigate("/", {trigger: true, replace: true});
        }
      });
    this.listenTo(this.editor, 'change', this.updateModel);
    // TODO update editor data when model data changed
    this.render();
  },

  updateModel: function() {
    this.model.update(this.editor.getSession().getValue());
    this.model.store();
  },

  render: function(){
    this.editor.resize();
  }
});
