# encoding: utf-8

require 'rubygems'
require 'dotenv'
Dotenv.load(*[ENV['ENV'], '.env.default'].compact)

require 'bundler/setup'

require "sinatra"
require "sinatra/reloader" if development?

require "base64"
require "lib/github"
require "lib/plantuml_renderer"

CONTENT_TYPE_MAPPING = {
  'png'        => 'image/png',
  'txt'        => 'text/plain',
  'utxt'       => 'text/plain',
}

enable :sessions

set :haml, :format => :html5

def github
  @github ||= Github.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'], session[:access_token])
end

def render_diagram(data, format)
  if content_type_value = CONTENT_TYPE_MAPPING[format]
    content_type content_type_value
  end

  PlantumlRenderer.render(data, format)
end

get '/render.:format' do
  data = request.env["QUERY_STRING"]
  begin
    if extracts = github.extract(data)
      data = github.get_file(*extracts)
    end
    render_diagram(data, params["format"])
  rescue Github::NotFound
    session[:redirect_to] = "render.#{params["format"]}?#{data}"
    haml :not_found, :locals => { :data => data }
  end
end

post '/render.:format' do
  diagram = render_diagram(request.body.string, params["format"])
  (request.env["HTTP_ACCEPT"] =~ /base64/) ? Base64.encode64(diagram) : diagram
end

get '/auth' do
  if code = params["code"]
    session[:access_token] = github.get_access_token(code)
  end

  redirect_to = if session[:access_token]
    session.delete(:redirect_to) || "/"
  else
    github.auth_url
  end

  redirect redirect_to
end

get '/browse' do

  haml :browse
end

get '/' do
  haml :index
end
