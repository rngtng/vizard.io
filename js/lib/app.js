var $ = require('jquery');

module.exports = {
  root: "/",
  router: null,
  rootItem: null,
  showBrowser: function() {
    //TODO Add class to body??
    $('.edit').animate({'margin-left':'-100%'}, 500);
    $('.browse').animate({'margin-right':'0'}, 500);
  },
  showEditor: function() {
    $('.edit').animate({'margin-left':'0'}, 500);
    $('.browse').animate({'margin-right':'-100%'}, 500);
  }
};
