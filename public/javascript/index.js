  var loadFileHandler = function(event) {
    event.preventDefault();
    var elem = $(this);
    $('#view a').attr('href', elem.attr('href'));
    $('#view img').attr('src', elem.attr('href'));
  },
  loadContent = function(parent, url) {
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        $.each(data, function(index, dir) {
          if (dir.type == 'dir') {
            elem = $('<li>' + dir.name + '<ul></ul></li>').appendTo(parent);
            loadContent(elem.find("ul"), '/content?' + dir.html_url);
          }
          else if (/.wsd/.test(dir.name)) {
            $('<li><a href="/edit?' + dir.html_url + '">(e)</a> <a class="show" href="/render.png?' + dir.html_url + '">' + dir.name + '</a></li>')
              .appendTo(parent)
              .find('a.show').click(loadFileHandler);
            $('#view').append('<a><img src="/render.png?' + dir.html_url + '"></a><br>');
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
