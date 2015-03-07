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
    $(".edit .editor-wrapper").animate({'min-width': '500'}, 500);
    $('.edit').animate({'margin-left':'0'}, 500);
    $('.browse').animate({'margin-right':'-100%'}, 500);
    $(".edit .diagram").css('text-align', 'left');
  },
  showSingle: function() {
    $(".edit .diagram").css('text-align', 'center');
    $(".edit .editor-wrapper").animate({'width': '0', 'min-width': '0'}, 500);
  }
};
