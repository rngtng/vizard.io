var githubTokenName = 'githubToken',
preview             = ".edit .preview",
githubClient        = null,
editor              = null,
extractParams = function(url) {
  var pattern = new RegExp("https?://github.com/([^/]+)/([^/]+)/(blob|tree)/([^/]+)(/[^.]+(/[^/.]+\\.(wsd|dot))?)?$");
  if ((ex = pattern.exec(url))) {
    return {
      url:    url,
      github: ex[0],
      user:   ex[1],
      repo:   ex[2],
      branch: ex[4],
      path:   (ex[5] || '').substring(1), //github expects no root slash
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
    nav_node    = findOrCreateFolder($('.browse .menu ul'), folders.slice()),
    view_node   = findOrCreateFolder($('.browse .content ul'), folders.slice());

    $('<li id=' + id + '>' +
        '<a href="#' + id + '">' +  name + '</a>' +
      '</li>').appendTo(nav_node);

    $('<li id=' + id + '>' +
        '<div class="loading">' +
          file.path + '<br>' +
          '<a href="/edit?' + file.githubUrl +'">' +
            '<img class="loader hidden" src="/images/loading.gif">' +
            '<img class="diagram" src="/render.png?' + file.githubUrl + '?' + file.sha + '">' +
          '</a>' +
        '</div>' +
      '</li>')
      .appendTo(view_node)
      .on('scrollSpy:enter', function() {
        var id = $(this).attr('id');
        $('.menu li').removeClass('selected');
        $('.menu #' + id).addClass('selected');
      })
      // .on('scrollSpy:exit', function() {
      //   var id = $(this).attr('id');
      //   $('.menu #' + id).removeClass('selected');
      // })
      .scrollSpy()
      .find('.diagram')
      .on('load', function(event) {
        $(this).parents('.loading').removeClass();
        $(preview).attr('src', $(this).attr('src'));
      });

    nav_node.parents('.menu').show();

    if (content.edit) {
      view_node.find('a').dblclick();
    }
  };

  githubClient.getRepo(content.user, content.repo)
    .getTree(content.branch + '?recursive=true', function(err, data) {
      $.each(data, function(index, blob) {
        var filePattern = new RegExp("^" + content.path);

        if (blob.type == "blob" && /\.(wsd|dot)$/.test(blob.path) && filePattern.test(blob.path)) {
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

loadEditor = function(target, url) {
  var pattern = new RegExp(url),
  setup = function(div) {
    var editor = ace.edit(div);
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
    editor.on('change', function(event) {
      $.ajax({
        url: '/render.png',
        type: 'post',
        data: editor.getSession().getValue(),
        headers: {
          'Accept': 'image/png;base64'
        },
        success: function(data) {
          editor.target.attr('src', 'data:image/png;base64,' + data);
        }
      });
    });
    return editor;
  },
  getEditor = function() {
    if (!window.editor) {
      window.editor = setup('editor');
    }
    return window.editor;
  },
  editor = getEditor();

  editor.target = target;
  if(!pattern.test(window.location.href)) {
    window.history.pushState({}, '', url);
  }
  if ((content = extractParams(url))) {
    githubClient.getRepo(content.user, content.repo)
      .read(content.branch, content.path, function(err, contents) {
        editor.getSession().setValue(contents);
    });
  }
  else {
    editor.getSession().setValue('A -> B');
  }
  showEditor();
},

showEditor = function() {
  $('.edit').animate({'margin-left':'0'}, 500);
  $('.navigation').animate({'margin-left':'100%'}, 500);
};

$(document)
  .on('click', '.browse .navigation a', function(event) {
    var id = $(this).attr('href');
    event.preventDefault();
    $('.browse .content').scrollTo( $('.browse .content ' + id), 800, {easing:'swing'} );
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
  .on('click', '.browse .content a', function(event) {
    event.preventDefault();
  })
  .on('dblclick', '.browse .content a', function(event) {
    var target = $(this).find(".diagram");
    event.preventDefault();
    $(preview).parent().find('.loader').attr('src', target.attr('src'));
    $(preview).parents('div').addClass('loading');
    loadEditor(target, this.href);
  })
  .keyup(function(event) {
    if (event.keyCode == 27 && ($('.browse .content li').length > 0) ) {
      window.history.back();
      showBrowser();
    }
  })
  .ready(function() {
    $(preview).on('load', function(event) {
      var preview = $(this);
      preview.parents('a').attr('href', preview.attr('src'));
      setTimeout(function(){
        preview.parents('div').removeClass('loading');
      }, 1000);
    });

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
      loadEditor($(preview));
    }

    $('.fancybox')
      .fancybox();

    $('.browse .content')
      .on('scroll', function(event) {
        $('.menu').addClass('show');
      })
      .on('scroll', function(event) {
        $('.menu').removeClass('show');
      }, 100);
  });


