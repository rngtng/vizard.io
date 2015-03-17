var $ = require('jquery'),
  _ = require('underscore'),
  Backbone     = require('backbone'),
  Databackend  = require('../lib/databackend'),
  Github = require('github-api'),

  extractParams = function(url) {
    var pattern = new RegExp("https?://github.com/([^/]+)/([^/]+)/(blob|tree)/([^/]+)(/[^.]+(/[^/.]+\\.(wsd|dot))?)?$");
    if ((ex = pattern.exec(url))) {
      return {
        url:    url,
        github: ex[0],
        user:   ex[1],
        repo:   ex[2],
        branch: ex[4],
        path:   (ex[5] || '').substring(1), //github expects no root slash
        file:   ex[6],
      };
    }
    return false;
  };

Backbone.sync = Databackend.sync;

module.exports = Backbone.Model.extend({
  localStorage: new Databackend.storage("vizard-github"),

  initialize: function() {
    _.bindAll(this, 'token');

    this.queue = {};
    this.fetch();
    this.bind('change:token', this.process);
  },

  token: function() {
    this.trigger('requestToken');
  },

  tokenIsValid: function() {
    var token = this.get('token');

    return token;
  },

  process: function() {
    if ( (token = this.tokenIsValid()) ) {
      $.each(this.queue, function(url, cb) {
        cb(token);
      });

      this.queue = {};
    }
    else {
      this.trigger('requestToken');
    }
  },

  loadFile: function(url, cb) {
    if( (params = extractParams(url)) ) {
      this.queue[url] = this.loadFileFromGithubCb(params, cb);
      this.process();
    }
    return true;
  },

  loadFileFromGithubCb: function(params, cb) {
    return function(token) {
      new Github({
        token: token,
        auth: "oauth"
      })
      .getRepo(params.user, params.repo)
      .read(params.branch, params.path, function(error, data) {
        cb(data);
      });
    };
  },

});
