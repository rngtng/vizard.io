var $ = require('jquery');

module.exports = {
  root: "/",
  router: null,
  rootItem: null,
  showBrowser: function() {
    $('.edit').animate({'margin-left':'-100%'}, 500);
    $('.browse').animate({'margin-right':'0'}, 500);
  },
  showEditor: function() {
    $(".edit .editor-wrapper").animate({'opacity': '1', 'min-width': '500'}, 500);
    $('.edit').animate({'margin-left':'0'}, 500);
    $('.browse').animate({'margin-right':'-100%'}, 500);
    $(".edit .diagram").css('text-align', 'left');
  },
  showSingle: function() {
    $(".edit .editor-wrapper").animate({'opacity': '0', 'width': '0', 'min-width': '0'}, 500);
    $('.edit').animate({'margin-left':'0'}, 500);
    $('.browse').animate({'margin-right':'-100%'}, 500);
    $(".edit .diagram").css('text-align', 'center');
  }
};
