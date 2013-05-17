# encoding: utf-8

require 'rubygems'
require 'bundler/setup'

require "sinatra"
require "sinatra/reloader" if development?

require "lib/github_loader"
require "lib/plantuml_renderer"

@@github_loader = GithubLoader.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'], ENV['OAUTH_TOKEN'])

CONTENT_TYPE_MAPPING = {
  'png'  => 'image/png',
  'txt'  => 'text/plain',
  'utxt' => 'text/plain',
}

def render_diagram(data)
  if content_type_value = CONTENT_TYPE_MAPPING[params["format"]]
    content_type content_type_value
  end

  PlantumlRenderer.render(data, params["format"])
end

get '/render.:format' do
  data = if params["f"] && (extracts = @@github_loader.extract(params["f"]))
    @@github_loader.get_file(*extracts)
  end

  render_diagram data
end

post '/render.:format' do
  data = render_diagram(params["c"])
  (params["base64"]) ? Base64.encode64(data) : data
end

get '/' do
  haml :index, :format => :html5
end
