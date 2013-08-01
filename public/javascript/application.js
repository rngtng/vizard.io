window.login = function(token) {
  $.cookie('github_token', token, { expires: 7 });
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
  var width = 1010,
  height = 590,
  leftPosition = (screen.width) ? (screen.width - width) / 2 : 0;
  topPosition = (screen.height) ? (screen.height - height) / 2 : 0;
  window.open(url, "Github Login", 'width='+width+',height='+height+',top='+topPosition+',left='+leftPosition);
},
load_repo = function(url) {
  var pattern = new RegExp("https?:\/\/github.com\/([^\/]+)\/([^\/]+)\/(blob|tree)\/([^\/]+)\/(.+)"),
  extracts = pattern.exec(url),
  repo = window.github.getRepo(extracts[1], extracts[2]);

  console.log(extracts);
  console.log(repo);

  repo.read(extracts[4], extracts[5], function(err, data) {
    console.log(data);
  });
};

$(document).ready(function() {
  setup_editor('editor', $(".edit .content"));
  $(".fancybox").fancybox();

  $('.login a').click(function(event){
    event.preventDefault();
    start_login(this.href);
  });

  $('.logout a').click(function(event){
    event.preventDefault();
    window.github = null;
  });

  if ((token = $.cookie('github_token'))) {
    login(token);
  }
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
