var $ = require('jquery');

module.exports = {
  root: "/",
  router: null,
  rootItem: null,
  showBrowser: function() {
    $('.edit').animate({'margin-left':'-100%'}, 500);
    $('.navigation').animate({'margin-left':'0'}, 500);
  },
  showEditor: function() {
    $('.edit').animate({'margin-left':'0'}, 500);
    $('.navigation').animate({'margin-left':'100%'}, 500);
  }
};
