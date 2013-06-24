  var loadDirHandler = function(event) {
    var elem = $(this);
    event.preventDefault();
    if (elem.hasClass("js-loaded")) {
      elem.parent().find("ul").empty();
      elem.removeClass("js-loaded");
    }
    else {
      loadContent(elem.parent().find("ul"), elem.attr('href'));
      elem.addClass("js-loaded");
    }
  },
  loadContent = function(parent, url) {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        $.each(data, function(index, dir) {
          if (dir.type == 'dir') {
            $('<li><a href="/content?' + dir.html_url + '">' + dir.name + '</a><ul></ul></li>')
              .appendTo(parent)
              .find('a').click(loadDirHandler);
          }
          else if (/.wsd/.test(dir.name)) {
            $('<li><a href="/edit?' + dir.html_url + '">' + dir.name + '</a></li>')
              .appendTo(parent)
              .find('a').click(loadFileHandler);
          }
        });
      }
    });
  },
  setup_editor = function (div) {
    var editor_div = div.find(".editor"),
    diagram_div = div.find(".diagram"),
    editor = ace.edit(editor_div.get(0)),
    defaultValue = editor.getSession().getValue(),
    on_change = function() {
      $('input[name="content"]').val(editor.getSession().getValue());
      $.ajax( {
        url: '/render.png',
        type: 'post',
        data: editor.getSession().getValue(),
        headers: {
            'Accept': 'image/png;base64'
        },
        success: function( data ) {
          diagram_div.find('a').attr('href', 'data:image/png;base64,' + data);
          diagram_div.find('img').attr('src', 'data:image/png;base64,' + data);
        }
      });
    },
    urldecode = function (url) {
      return decodeURIComponent(url.replace(/\+/g, ' '));
    };

    editor.getSession().setValue(urldecode(defaultValue));
    editor.setFontSize(10);
    editor.setTheme("ace/theme/github");
    editor.commands.addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
      exec: function(editor) {
        $('a.js-save').click();
      }
    });
    editor.getSession().setMode('ace/mode/diagram');
    editor.getSession().on('change', on_change);
    on_change();
  };

  $(document).ready(function() {
    loadContent($('ul.parent'), '/content' + window.location.search);
    $(".fancybox").fancybox();
    setup_editor($('#demo'));
  });
