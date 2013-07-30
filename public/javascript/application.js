var setup_editor = function(div, diagramDiv) {
  var editor   = ace.edit(div),
  defaultValue = editor.getSession().getValue(),
  on_change    = function() {
    $('input[name="content"]').val(editor.getSession().getValue());
    $.ajax( {
      url: '/render.png',
      type: 'post',
      data: editor.getSession().getValue(),
      headers: {
        'Accept': 'image/png;base64'
      },
      success: function( data ) {
        diagramDiv.find('a').attr('href', 'data:image/png;base64,' + data);
        diagramDiv.find('img').attr('src', 'data:image/png;base64,' + data);
      }
    });
  },
  urldecode = function (url) {
    return decodeURIComponent(url.replace(/\+/g, ' '));
  };

  editor.getSession().setValue(urldecode(defaultValue));
  editor.setFontSize(10);
  editor.setTheme("ace/theme/github");
  editor.getSession().setMode('ace/mode/diagram');
  editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
    exec: function(editor) {
      $('a.js-save').click();
    }
  });
  editor.getSession().on('change', on_change);
  on_change();
};

$(document).ready(function() {
  setup_editor('editor', $(".edit .content"));
  $(".fancybox").fancybox();
});

  // $('.browse .navigation a').click(function(event) {
  //   event.preventDefault();
  //   element_id = $(this).attr('href');
  //   $('.browse .content').scrollTo( $('.browse .content ' + element_id), 800, {easing:'swing'} );
  // });

  // $('.browse .content li').on('scrollSpy:enter', function() {
  //     // console.log('enter:', $(this).attr('id'));
  // }).on('scrollSpy:exit', function() {
  //     // console.log('exit:', $(this).attr('id'));
  // }).dblclick(function(event) {
  //   $('.edit').animate({'margin-left':'0'}, 500);
  //   $('.navigation').animate({'margin-left':'100%'}, 500);
  // }).scrollSpy();

  // $('.edit .view a').dblclick(function(event) {
  //   $('.edit').animate({'margin-left':'-100%'}, 500);
  //   $('.navigation').animate({'margin-left':'0'}, 500);
  // });

  // loadContent($('#navigation'), $('#view'), '/content' + window.location.search);
  //

  //setup_nav($('body'), $("#navigation"))
