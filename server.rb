# encoding: utf-8

require 'rubygems'
require 'bundler/setup'
require 'github_api'

GITHUB_ID     = "b2941818e58646fa024c"
GITHUB_SECRET = "4a973802fd425d28a3a1132942c498dae6327efe"
OAUTH_TOKEN   = "25117da0c9914b5291a54e419251e3996a3fce1b"

Dir.entries("./lib").sort.each do |entry|
  if entry =~ /.jar$/
    require "./lib/#{entry}"
  end
end

require "sinatra"
require "sinatra/reloader" if development?

java_import 'net.sourceforge.plantuml.SourceStringReader'
java_import 'net.sourceforge.plantuml.FileFormatOption'
java_import 'net.sourceforge.plantuml.FileFormat'
java_import 'java.io.ByteArrayOutputStream'
java_import 'java.io.FileOutputStream'

FORMAT_MAPPING = {
  'svg'  => FileFormat::SVG,
  'png'  => FileFormat::PNG,
  'txt'  => FileFormat::ATXT,
  'utxt' => FileFormat::UTXT
  # error: PDF, HTML
  # wrong: HTML5
  # untested: EPS, EPS_TEXT, XMI_STANDARD, XMI_STAR, XMI_ARGO, MJPEG
}

GITHUB_PATTERN = /https?:\/\/github.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/master\/(?<file>.+)/

def github
  @@github = Github.new do |config|
    config.client_id     = GITHUB_ID
    config.client_secret = GITHUB_SECRET
    config.oauth_token   = OAUTH_TOKEN
  end
end

def github_file(user, repo, file)
  Base64.decode64 github.get_request("/repos/#{user}/#{repo}/contents/#{file}").content
end

def render_dia(diagram_data, format = 'svg')
  out = ByteArrayOutputStream.new
  SourceStringReader.new(diagram_data).generate_image(out, FileFormatOption.new(FORMAT_MAPPING[format]))
  out.toString("UTF-8")
end

def load_diagram(file_url)
  if m = file_url.match(GITHUB_PATTERN)
    '@startuml' + github_file(m[:user], m[:repo], m[:file]) + '@enduml'
  else

  end
end

get '/render.:format' do
  diagram_data = if file_url = params["f"]
    load_diagram(file_url)
  else
    params["c"]
  end

  content_type 'image/png'  if params["format"] == 'png'
  content_type 'text/plain' if params["format"] == 'txt'
  content_type 'text/plain' if params["format"] == 'utxt'
  render_dia(diagram_data, params["format"])
end

get '/' do
  <<-EOF
  <img src="/render.png">
  EOF
end


__END__
java_import 'java.io.ImageIO'
java_import 'java.io.BufferedImage'
java_import 'java.io.File'

out = FileOutputStream.new("test.png")
output_stream =
out.writeTo(output_stream)
out.close


repo = Github::Repos.new({:user => 'soundcloud', :repo => 'payments-team'})
repos.branches do |branch|
  puts branch.name
end


# def github
#   @github ||= github.git_data.trees.get 'rngtng', 'massive_sitemap', 'HEAD' do |file|
#     file.path
#   end


# Encoding.default_internal = Encoding::UTF_8
# Encoding.default_external = Encoding::UTF_8
