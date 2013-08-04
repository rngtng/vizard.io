window.login = function(token) {
  $.cookie('github_token', token, { expires: 7 });
  window.token = token;
  window.github = new Github({
    token: token,
    auth: "oauth"
  });
  window.github.getUser().show(null, function(err, user) {
    // update_user(user);
  });
  if ((githubUrl = window.location.href.split("?")[1])) {
    load_repo(githubUrl);
  }
};

var extractParams = function(url) {
  var pattern = new RegExp("https?:\/\/github.com\/([^\/]+)\/([^\/]+)\/(blob|tree)\/([^\/]+)(\/(.+))?"),
  ex = pattern.exec(url);

  return {
    url:    url,
    user:   ex[1],
    repo:   ex[2],
    branch: ex[4],
    path:   ex[6]
  };
},

render_diagram = function(content, success){
  $.ajax({
    url: '/render.png',
    type: 'post',
    data: content,
    headers: {
      'Accept': 'image/png;base64'
    },
    success: success
  });
},

setup_editor = function(div, diagramDiv) {
  var editor = ace.edit(div),
  on_change  = function() {
    $('input[name="content"]').val(editor.getSession().getValue());
    render_diagram(editor.getSession().getValue(), function(data) {
      diagramDiv.find('a').attr('href', 'data:image/png;base64,' + data);
      diagramDiv.find('img').attr('src', 'data:image/png;base64,' + data);
    });
  };
  window.editor = editor;

  editor.setFontSize(10);
  editor.setTheme("ace/theme/github");
  editor.getSession().setMode('ace/mode/diagram');
  editor.commands
    .addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
      exec: function(editor) {
        $('.save a').click();
      }
    });
  editor.getSession().on('change', on_change);
  on_change();
},

start_login = function(url) {
  var width = 1010,
  height    = 590,
  leftPos   = (screen.width) ? (screen.width - width) / 2 : 0,
  topPos    = (screen.height) ? (screen.height - height) / 2 : 0,
  options   = 'width=' + width + ',height=' + height + ',top=' + topPos + ',left=' + leftPos;

  window.open(url, "Github Login", options);
},

load_repo = function(url) {
  var github = extractParams(url);

  window.github.getRepo(github.user, github.repo)
    .getTree(github.branch + '?recursive=true', function(err, data) {
      $.each(data, function(index, blob) {
        var filePattern = new RegExp("^" + github.path + ".+\\.wsd$");

        if (blob.type == "blob" && filePattern.test(blob.path)) {
          blob.githubUrl = 'https://github.com/' + github.user + '/' + github.repo + '/tree/' + github.branch + '/' + blob.path;
          add_file(blob);
        }
      });
    });
},

add_file = function(file) {
  var folders = file.path.split("/"),
  id          = 'file' + file.sha,
  name        = folders.pop().split(".").shift(),
  nav_node    = find_or_create_folder($('.browse .menu ul'), folders.slice()),
  view_node   = find_or_create_folder($('.browse .content ul'), folders.slice());

  $('<li id=' + id + '>' +
      '<a href="#' + id + '">' +  name + '</a>' +
    '</li>').appendTo(nav_node);

  $('<li id=' + id + '>' +
      '<div>' +
        file.path + '<br>' +
        '<a href="/edit?' + file.githubUrl +'">' +
          '<img class="diagram" src="/render.png?' + file.githubUrl + '">' +
        '</a>' +
      '</div>' +
    '</li>')
    .appendTo(view_node)
    .find('img')
      .error(function(event) {
        console.log(event);
      })
      .end()
    .find('a')
      .click(function(event) {
        event.preventDefault();
      }).dblclick(function(event) {
        event.preventDefault();
        window.history.pushState({}, '', this.href);
        load_editor();
      });
},

find_or_create_folder = function(parent, folders) {
  if (folders.length === 0) {
    return parent;
  }
  else {
    var name = folders.shift(),
    node     = parent.find("#" + name + " ul").first();

    if (node.length === 0) {
      node = $('<li id=' + name + '><span>' + name + '</span><ul></ul></li>').appendTo(parent).find('ul').first();
    }
    return find_or_create_folder(node, folders);
  }
},

load_editor = function() {
  var github = extractParams(window.location.href);
  window.github.getRepo(github.user, github.repo)
    .read(github.branch, github.path, function(err, contents) {
      show_editor(contents);
  });
},

show_editor = function(contents) {
  if (contents) {
    window.editor.getSession().setValue(contents);
  }
  $('.edit').animate({'margin-left':'0'}, 500);
  $('.navigation').animate({'margin-left':'100%'}, 500);
},

show_browser = function() {
  $('.edit').animate({'margin-left':'-100%'}, 500);
  $('.navigation').animate({'margin-left':'0'}, 500);
};


$(document)
  .on('click', '.browse .navigation a', function(event) {
    var id = $(this).attr('href');
    $('.browse .content').scrollTo( $('.browse .content ' + id), 800, {easing:'swing'} );
    event.preventDefault();
  }).on('click', '.login a', function(event) {
    event.preventDefault();
    start_login(this.href);
  }).on('click', '.logout a', function(event){
    event.preventDefault();
    window.github = null;
  }).on('scrollSpy:enter', '.browse .content li', function() {
        // console.log('enter:', $(this).attr('id'));
  }).on('scrollSpy:exit', '.browse .content li', function() {
      // console.log('exit:', $(this).attr('id'));
  })
  .keyup(function(e) {
    if (e.keyCode == 27) {
      show_browser();
    }
  })
  .ready(function() {
    if ((token = $.cookie('github_token'))) {
      login(token);
    }

    setup_editor('editor', $(".edit .content"));

    $(".fancybox").fancybox();
  });


// .scrollSpy();
