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
# set :raise_errors, false
set :show_exceptions, false

helpers do
  def github
    @github ||= Github.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'], session[:access_token])
  end

  def user
    session[:user]
  end

  def diagram_data
    data = request.env["QUERY_STRING"]
    if extracts = github.extract(data)
      @github_file = data
      github.get_file(*extracts)
    elsif !request.body.string.empty?
      request.body.string
    end
  end
end

# ---------------------------------------------------

before do
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
  session[:redirect_to] = request.url
  haml :not_found, :locals => { :github_file => @github_file }
end

# ---------------------------------------------------

get '/render.:format' do
  body PlantumlRenderer.render(diagram_data, params["format"])
end

post '/render.:format' do
  body PlantumlRenderer.render(diagram_data, params["format"])
end

get '/auth' do
  if code = params["code"]
    session[:access_token] = github.get_access_token(code)
    session[:user] = github.get_user
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

get '/logout' do
  session[:access_token] = nil
  redirect '/'
end

get '/' do
  diagram = diagram_data || File.read('public/default.wsd')
  haml :edit, :locals => { :user => user, :github_file => @github_file, :diagram => diagram }
end
