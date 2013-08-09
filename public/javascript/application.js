var githubTokenName = 'githubToken',
githubClient = null,
editor = null,
extractParams = function(url) {
  var pattern = new RegExp("https?://github.com/([^/]+)/([^/]+)/(blob|tree)/([^/]+)(/[^.]+(/[^/.]+\\.wsd)?)?$");
  if ((ex = pattern.exec(url))) {
    return {
      url:    url,
      github: ex[0],
      user:   ex[1],
      repo:   ex[2],
      branch: ex[4],
      path:   (ex[5] || '').substring(1),
      file:   ex[6],
      edit:   new RegExp("/edit/?\\?http").test(url)
    };
  }
  return false;
},

login = function(token, successCb) {
  if (token) {
    $.cookie(githubTokenName, token, { expires: 7 });
    githubClient = new Github({
      token: token,
      auth: "oauth"
    });
    $('#login').addClass('collapsed');
    successCb();
  }
  else {
    window.loginCb = function(token) {
      login(token, successCb);
    };
    $('#login').removeClass('collapsed');
  }
},

logout = function() {
  $.removeCookie(githubTokenName);
  githubClient = null;
},

loadBrowser = function(content) {
  var addFile = function(file) {
    var folders = file.path.split("/"),
    id          = 'file' + file.sha,
    name        = folders.pop().split(".").shift(),
    findOrCreateFolder = function(parent, folders) {
      if (folders.length === 0) {
        return parent;
      }
      else {
        var name = folders.shift(),
        node     = parent.find("#" + name + " ul").first();

        if (node.length === 0) {
          node = $('<li id=' + name + '><span>' + name + '</span><ul></ul></li>')
            .appendTo(parent)
            .find('ul')
            .first();
        }
        return findOrCreateFolder(node, folders);
      }
    },
    nav_node    = findOrCreateFolder($('.browse .menu').show().find('ul'), folders.slice()),
    view_node   = findOrCreateFolder($('.browse .content ul'), folders.slice());

    $('<li id=' + id + '>' +
        '<a href="#' + id + '">' +  name + '</a>' +
      '</li>').appendTo(nav_node);

    $('<li id=' + id + '>' +
        '<div class="loading">' +
          file.path + '<br>' +
          '<a href="/edit?' + file.githubUrl +'">' +
            '<img class="hidden" src="/images/loading.gif">' +
            '<img class="diagram" src="/render.png?' + file.githubUrl + '?' + file.sha + '">' +
          '</a>' +
        '</div>' +
      '</li>')
      .appendTo(view_node)
      .find('.diagram').load( function(event) {
        $(this).parents('.loading').removeClass();
      });

    if (content.edit) {
      view_node.find('a').dblclick();
    }
  };

  githubClient.getRepo(content.user, content.repo)
    .getTree(content.branch + '?recursive=true', function(err, data) {
      $.each(data, function(index, blob) {
        var filePattern = new RegExp("^" + content.path);

        if (blob.type == "blob" && /\.wsd$/.test(blob.path) && filePattern.test(blob.path)) {
          blob.githubUrl = 'https://github.com/' + content.user + '/' + content.repo + '/tree/' + content.branch + '/' + blob.path;
          addFile(blob);
        }
      });
    });
  showBrowser();
},

showBrowser = function() {
  $('.edit').animate({'margin-left':'-100%'}, 500);
  $('.navigation').animate({'margin-left':'0'}, 500);
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

loadEditor = function(url) {
  var pattern = new RegExp(url),
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
  };

  if(!pattern.test(window.location.href)) {
    window.history.pushState({}, '', url);
  }
  if (!editor) {
    setupEditor('editor', $(".edit .content"));
  }
  if ((content = extractParams(url))) {
    githubClient.getRepo(content.user, content.repo)
      .read(content.branch, content.path, function(err, contents) {
        showEditor(contents);
    });
  } else {
    showEditor();
  }
},

showEditor = function(contents) {
  if (contents) {
    editor.getSession().setValue(contents);
  }
  $('.edit').animate({'margin-left':'0'}, 500);
  $('.navigation').animate({'margin-left':'100%'}, 500);
};

$(document)
  .on('click', '.browse .navigation a', function(event) {
    var id = $(this).attr('href');
    $('.browse .content').scrollTo( $('.browse .content ' + id), 800, {easing:'swing'} );
    event.preventDefault();
  })
  .on('click', 'a[href="/login"]', function(event) {
    var width = 1010,
    height    = 590,
    leftPos   = (screen.width) ? (screen.width - width) / 2 : 0,
    topPos    = (screen.height) ? (screen.height - height) / 2 : 0,
    options   = 'width=' + width + ',height=' + height + ',top=' + topPos + ',left=' + leftPos;

    event.preventDefault();
    window.open(this.href, "Github Login", options);
  })
  .on('click', 'a[href="/logout"]', function(event){
    event.preventDefault();
    logout();
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
    loadEditor(this.href);
  })
  .keyup(function(event) {
    if (event.keyCode == 27) {
      window.history.back();
      showBrowser();
    }
  })
  .ready(function() {
    if ((content = extractParams(window.location.href))) {
      if (content.edit && !content.file) {
        window.history.replaceState({}, '', content.url.replace('/edit', ''));
        content.edit = false;
      }
      login($.cookie(githubTokenName), function(){
        loadBrowser(content);
      });
    }
    else {
      window.history.replaceState({}, '', '/edit');
      loadEditor();
    }

    $(".fancybox").fancybox();
  });


// .scrollSpy();
