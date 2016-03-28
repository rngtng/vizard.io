var $ = require('jquery'),
  _  = require('underscore'),
  Backbone = require('backbone'),
  ace      = require('brace'),
  Firebase  = require('firebase'),
  Firepad = require('firepad');

require('../lib/ace-mode-diagram');
require('brace/theme/github');

Backbone.$ = $;

module.exports = Backbone.View.extend({
  id: 'editor',

  initialize: function(){
    _.bindAll(this, 'render', 'updateModel');

    this.editor = this.initEditor();

    this.listenTo(this.editor, 'change', this.updateModel);
    this.listenTo(this.model, 'externalDataLoaded', this.updateEditor);
    this.render();
  },

  initEditor: function() {
    var model = this.model,
    // firepadRef = new Firebase('https://vizard.firebaseio.com/development'),
    editor = ace.edit(this.$el);
    // editor2 = Firepad.fromACE(firepadRef, editor, {
    //   defaultText: model.read()
    // });

    editor.setFontSize(10);
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode('ace/mode/diagram');
    editor.getSession().setValue(this.model.read());
    // editor.getSession().setUseWorker(false);
    editor.setOption("scrollPastEnd", 0.3);

    editor.commands.addCommand({
      name: 'save',
      bindKey: {
        win: 'Ctrl-S',
        mac: 'Command-S',
        sender: 'editor|cli'
      },
      exec: function(editor) {
        console.log('save');
        console.log(editor);
        // TODO bring up save dialog, save to github?!
        // model.store();
      }
    });

    editor.commands.addCommand({
      name: 'load',
      bindKey: {
        win: 'Ctrl-L',
        mac: 'Command-L',
        sender: 'editor|cli'
      },
      exec: function(editor) {
        model.remoteLoad();
      }
    });

    return editor;
  },

  updateModel: function() {
    if (this.editor.curOp && this.editor.curOp.command.name) {
      this.model.update(this.editor.getSession().getValue());
      this.model.store();
    }
  },

  updateEditor: function() {
    this.editor.getSession().setValue(this.model.get('data'));
  },

  render: function(){
    this.editor.resize();
  }
});
