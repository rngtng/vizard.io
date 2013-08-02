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
},

start_login = function(url) {
  var width    = 1010,
  height       = 590,
  leftPosition = (screen.width) ? (screen.width - width) / 2 : 0;
  topPosition  = (screen.height) ? (screen.height - height) / 2 : 0;
  window.open(url, "Github Login", 'width='+width+',height='+height+',top='+topPosition+',left='+leftPosition);
},

load_repo = function(url) {
  var pattern = new RegExp("https?:\/\/github.com\/([^\/]+)\/([^\/]+)\/(blob|tree)\/([^\/]+)(\/(.+))?"),
  extracts = pattern.exec(url),
  repo = window.github.getRepo(extracts[1], extracts[2]);

  repo.getTree(extracts[4] + '?recursive=true', function(err, data) {
    $.each(data, function(index, sha) {
      var parent = extracts[6],
      file_pattern = new RegExp("^" + parent + ".+\\.wsd$");
      if (sha.type == "blob" && file_pattern.test(sha.path)) {
        sha.github_info = {
          token: window.token,
          user: extracts[1],
          repo: extracts[2],
          branch: extracts[4],
          path: sha.path
        };
        add_file(sha);
      }
    });
  });
},

add_file = function(file) {
  var folders = file.path.split("/"),
  id          = 'file' + file.sha,
  name        = folders.pop().split(".").shift(),
  nav_node    = find_or_create_folder($('.browse .menu ul'), folders.slice()),
  view_node   = find_or_create_folder($('.browse .content ul'), folders.slice()),
  params      = $.param(file.github_info);

  $('<li id=' + id + '><a href="#' + id + '">' +  name + '</a></li>').appendTo(nav_node);
  $('<li id=' + id + '><div>' + file.path + '<br><a href=""><img class="diagram" src="/render.png?' + params + '"></a></div></li>').appendTo(view_node);
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
};


$(document).on('click', '.browse .navigation a', function(event) {
  event.preventDefault();
  var id = $(this).attr('href');
  console.log($('.browse .content ' + id));
  $('.browse .content').scrollTo( $('.browse .content ' + id), 800, {easing:'swing'} );
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
}).on('click', '.browse .content li a', function(event) {
  event.preventDefault();
}).on('dblclick', '.browse .content li a', function(event) {
  event.preventDefault();
  $('.edit').animate({'margin-left':'0'}, 500);
  $('.navigation').animate({'margin-left':'100%'}, 500);
});

// .scrollSpy();

$('.edit .view a').dblclick(function(event) {
  $('.edit').animate({'margin-left':'-100%'}, 500);
  $('.navigation').animate({'margin-left':'0'}, 500);
});


$(document).ready(function() {
  setup_editor('editor', $(".edit .content"));

  $(".fancybox").fancybox();

  if ((token = $.cookie('github_token'))) {
    login(token);
  }
});
