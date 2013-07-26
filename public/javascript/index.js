  var  setup_editor = function(div) {
    var diagram_div = $(".diagram"),
    editor          = ace.edit(div),
    defaultValue    = editor.getSession().getValue(),
    on_change       = function() {
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
    editor.getSession().setMode('ace/mode/diagram');
    editor.commands.addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
      exec: function(editor) {
        $('a.js-save').click();
      }
    });
    // editor.getSession().on('change', on_change);
    // on_change();
  },

  loadContent = function(parent, image, url) {
    parent = $('<ul></ul>').appendTo(parent);
    image = $('<ul></ul>').appendTo(image);
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        $.each(data, function(index, dir) {
          if (dir.type == 'dir') {
            var elemImage = $('<li>' + dir.name + '</li>')
              .appendTo(image),
            elem = $('<li>' + dir.name + '</li>')
              .appendTo(parent);

            loadContent(elem, elemImage, '/content?' + dir.html_url);
          }
          else if (/.wsd$/.test(dir.name)) {
            var elemImage2 = $('<li><a href="/edit?' + dir.html_url + '"><img src="/render.png?' + dir.html_url + '"></a></li>')
              .appendTo(image)
              .find('a').click(function(event) {
                event.preventDefault();
              })
              .dblclick(function(event) {
                $('#editor').toggle();
                $('#navigation').toggle();
                $('#view').scrollTo( elemImage2, 800, {easing:'swing'} );
              });
            elem2 = $('<li></li>').appendTo(parent);
            $('<a class="show" href="/render.png?' + dir.html_url + '">' + dir.name + '</a>')
              .appendTo(elem2)
              .click(function(event) {
                event.preventDefault();
                $('#view').scrollTo( elemImage2, 800, {easing:'swing'} );
              });
          }
        });
      }
    });
  },
  setup_nav = function(element, target) {
   element.mousewheel(function(event, delta, deltaX, deltaY) {
      console.log(deltaX);
      if (deltaX > 50 ) { target.hide("drop"); }
      if (deltaX < -50 ) { target.show("drop"); }
    });
  };
