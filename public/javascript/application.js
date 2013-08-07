var editor = null,
startLogin = function(url) {
  var width = 1010,
  height    = 590,
  leftPos   = (screen.width) ? (screen.width - width) / 2 : 0,
  topPos    = (screen.height) ? (screen.height - height) / 2 : 0,
  options   = 'width=' + width + ',height=' + height + ',top=' + topPos + ',left=' + leftPos;

  window.open(url, "Github Login", options);
},

login = function(token) {
  $.cookie('github_token', token, { expires: 7 });
  window.github = new Github({
    token: token,
    auth: "oauth"
  });
  $('#login').addClass('collapsed');
  // window.github.getUser().show(null, function(err, user) {
  //   // update_user(user);
  // });
  loadBrowser(window.location.href) || loadEditor();
},

extractParams = function(url) {
  var pattern = new RegExp("https?:\/\/github.com\/([^\/]+)\/([^\/]+)\/(blob|tree)\/([^\/]+)(\/(.+))?");
  if ((ex = pattern.exec(url))) {
    return {
      url:    url,
      user:   ex[1],
      repo:   ex[2],
      branch: ex[4],
      path:   ex[6]
    };
  }
  return false;
},

render_diagram = function(content, successCb){
  $.ajax({
    url: '/render.png',
    type: 'post',
    data: content,
    headers: {
      'Accept': 'image/png;base64'
    },
    success: successCb
  });
},

add_file = function(file) {
  var folders = file.path.split("/"),
  id          = 'file' + file.sha,
  name        = folders.pop().split(".").shift(),
  nav_node    = find_or_create_folder($('.browse .menu').show().find('ul'), folders.slice()),
  view_node   = find_or_create_folder($('.browse .content ul'), folders.slice());

  $('<li id=' + id + '>' +
      '<a href="#' + id + '">' +  name + '</a>' +
    '</li>').appendTo(nav_node);

  $('<li id=' + id + '>' +
      '<div>' +
        file.path + '<br>' +
        '<a href="/edit?' + file.githubUrl +'">' +
          '<img class="diagram" src="/render.png?' + file.githubUrl + '?' + file.sha + '">' +
        '</a>' +
      '</div>' +
    '</li>')
    .appendTo(view_node)
    .find('img')
      .error(function(event) {
        console.log(event);
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

loadEditor = function(url) {
  if (!editor) { setupEditor('editor', $(".edit .content")); }
  if ((github = extractParams(url))) {
    window.github.getRepo(github.user, github.repo)
      .read(github.branch, github.path, function(err, contents) {
        showEditor(contents);
    });
  } else {
    showEditor();
  }
},

setupEditor = function(div, diagramDiv) {
  var on_change  = function() {
    render_diagram(editor.getSession().getValue(), function(data) {
      diagramDiv.find('a').attr('href', 'data:image/png;base64,' + data).show();
      diagramDiv.find('img').attr('src', 'data:image/png;base64,' + data).show();
    });
  };

  editor = ace.edit(div);
  editor.setFontSize(10);
  editor.setTheme("ace/theme/github");
  editor.commands
    .addCommand({
      name: 'save',
      bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
      exec: function(editor) {
        $('.save a').click();
      }
    });
  editor.getSession().setMode('ace/mode/diagram');
  editor.getSession().on('change', on_change);
  on_change();
},

showEditor = function(contents) {
  if (contents) {
    editor.getSession().setValue(contents);
  }
  $('.edit').animate({'margin-left':'0'}, 500);
  $('.navigation').animate({'margin-left':'100%'}, 500);
},

loadBrowser = function(url) {
  if ((params = extractParams(url))) {
    if (window.github) {
      window.github.getRepo(params.user, params.repo)
        .getTree(params.branch + '?recursive=true', function(err, data) {
          $.each(data, function(index, blob) {
            var filePattern = new RegExp("^" + params.path);

            if (blob.type == "blob" && /\.wsd$/.test(blob.path) && filePattern.test(blob.path)) {
              blob.githubUrl = 'https://github.com/' + params.user + '/' + params.repo + '/tree/' + params.branch + '/' + blob.path;
              add_file(blob);
            }
          });
        });
      showBrowser();

      if (/\/edit\/?/.test(url)) {
        if (/\.wsd/.test(url)) {
          loadEditor(url);
        }
        else {
          window.history.replaceState({}, '', url.replace('/edit', ''));
        }
      }

    }
    else {
      $('#login').removeClass('collapsed');
      return true;
    }
  }
  return false;
},

showBrowser = function() {
  $('.edit').animate({'margin-left':'-100%'}, 500);
  $('.navigation').animate({'margin-left':'0'}, 500);
};


$(document)
  .on('click', '.browse .navigation a', function(event) {
    var id = $(this).attr('href');
    $('.browse .content').scrollTo( $('.browse .content ' + id), 800, {easing:'swing'} );
    event.preventDefault();
  })
  .on('click', 'a[href="/login"]', function(event) {
    event.preventDefault();
    startLogin(this.href);
  })
  .on('click', '.logout a', function(event){
    event.preventDefault();
    $.cookie('github_token', null);
    window.github = null;
  })
  .on('scrollSpy:enter', '.browse .content li', function() {
    // console.log('enter:', $(this).attr('id'));
  })
  .on('scrollSpy:exit', '.browse .content li', function() {
    // console.log('exit:', $(this).attr('id'));
  })
  .on('click', '.browse .content a', function(event) {
    event.preventDefault();
  })
  .on('dblclick', '.browse .content a', function(event) {
    event.preventDefault();
    window.history.pushState({}, '', this.href);
    loadEditor(this.href);
  })
  .keyup(function(event) {
    if (event.keyCode == 27) {
      window.history.back();
      showBrowser();
    }
  })

  .ready(function() {
    window.login = login;

    if ((token = $.cookie('github_token'))) {
      login(token);
    }

    $(".fancybox").fancybox();
  });


// .scrollSpy();
