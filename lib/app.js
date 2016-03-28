var $ = require('jquery');

module.exports = {
  root: "/",
  router: null,
  github: null,
  rootItem: null,
  showBrowser: function() {
    $('.edit').animate({'margin-left':'-100%'}, 500);
    $('.browse').animate({'margin-right':'0'}, 500);
    $('body').attr('class', 'browser');
  },
  showEditor: function() {
    $(".edit .editor-wrapper").animate({'opacity': '1', 'min-width': '500'}, 500);
    $('.edit').animate({'margin-left':'0'}, 500);
    $('.browse').animate({'margin-right':'-100%'}, 500);
    $(".edit .diagram").css('text-align', 'left');
    $('body').attr('class', 'editor');
  },
  showSingle: function() {
    $(".edit .editor-wrapper").animate({'opacity': '0', 'width': '0', 'min-width': '0'}, 500);
    $('.edit').animate({'margin-left':'0'}, 500);
    $('.browse').animate({'margin-right':'-100%'}, 500);
    $(".edit .diagram").css('text-align', 'center');
    $('body').attr('class', 'single');
  }
};
