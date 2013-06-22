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
  'png'  => 'image/png',
  'txt'  => 'text/plain',
  'utxt' => 'text/plain',
}

enable :sessions

set :haml, :format => :html5

def github
  @github ||= Github.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'], session[:access_token])
end

# ---------------------------------------------------

before do
  data = request.env["QUERY_STRING"]
  @diagram_data = if extracts = github.extract(data)
    github.get_file(*extracts)
  else
   request.body.string
  end

  if content_type_value = CONTENT_TYPE_MAPPING[params["format"]]
    content_type content_type_value
  end
end

after do
  if request.env["HTTP_ACCEPT"] =~ /base64/
    body Base64.encode64(body.first)
  end
end

error Github::NotFound do
  session[:redirect_to] = "/render.#{params["format"]}?#{data}"
  haml :not_found, :locals => { :data => data }
end

# ---------------------------------------------------

get '/render.:format' do
  body PlantumlRenderer.render(@diagram_data, params["format"])
end

post '/render.:format' do
  body PlantumlRenderer.render(@diagram_data, params["format"])
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
  @diagram_data ||= File.read('public/default.wsd')
  haml :edit, :locals => { :diagram => @diagram_data }
end
