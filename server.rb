# encoding: utf-8

require 'rubygems'
require 'bundler/setup'

require "sinatra"
require "sinatra/reloader" if development?

require "lib/github_loader"
require "lib/plantuml_renderer"

@@github_loader = GithubLoader.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'], ENV['OAUTH_TOKEN'])

get '/render.:format' do
  diagram_data = if extracts = @@github_loader.extract(params["f"])
    @@github_loader.get_file(*extracts)
  else
    params["c"]
  end

  content_type 'image/png'  if params["format"] == 'png'
  content_type 'text/plain' if params["format"] == 'txt'
  content_type 'text/plain' if params["format"] == 'utxt'
  PlantumlRenderer.render(diagram_data, params["format"])
end

get '/' do
  <<-EOF
  <img src="/render.png">
  EOF
end
