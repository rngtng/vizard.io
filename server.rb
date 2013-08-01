# encoding: utf-8

require 'rubygems'
require 'dotenv'
Dotenv.load(ENV['ENV'] || '.env')

require 'bundler/setup'

require 'sinatra'
require 'sinatra/reloader' if development?

require 'haml'
require 'less'
require 'base64'
require "lib/github"
require "lib/plantuml_renderer"

CONTENT_TYPE_MAPPING = {
  'png'  => 'image/png',
  'txt'  => 'text/plain',
  'utxt' => 'text/plain',
}

enable :sessions

set :session_secret, "everybody-loves-uml"
set :haml, :format => :html5
set :show_exceptions, :after_handler

helpers do
  def github
    @github ||= Github.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'], session[:access_token])
  end

  def user
    session[:user]
  end

  def github_path
    data = request.env["QUERY_STRING"]
    github.valid?(data) ? data : nil
  end

  def diagram_data
    if github_path
      github.get_content(github_path)
    elsif !request.body.string.empty?
      request.body.string
    end
  end

  def set_content_type(format)
    if content_type_value = CONTENT_TYPE_MAPPING[format]
      content_type content_type_value
    end
  end
end

# ---------------------------------------------------

after do
  if request.env["HTTP_ACCEPT"] =~ /base64/
    body Base64.encode64(body.first)
  end
end

error Github::NotFound do
  session[:redirect_to] = request.url
  haml(:not_found, :locals => { :github_path => "" })
end

# ---------------------------------------------------
get '/css/style.css' do
  less :'style.css'
end

get '/render.:format' do
  set_content_type params["format"]
  body PlantumlRenderer.render(diagram_data, params["format"])
end

post '/render.:format' do
  set_content_type params["format"]
  body PlantumlRenderer.render(diagram_data, params["format"])
end

get '/login' do
  if code = params["code"]
    haml :login, :locals => { :access_token => github.get_access_token(code) }
  else
    redirect github.auth_url
  end
end

get '/' do
  haml :index
end


# post '/update' do
#   commit_message = params[:message].empty? ? params[:placeholder_message] : params[:message]
#   unless params[:description].empty?
#     commit_message += "\n\n#{params[:description]}"
#   end

#   github.update_file(github_path, commit_message, params[:content])

#   redirect "/?#{github_path}"
# end

# get '/edit' do
#   diagram = diagram_data || File.read('public/default.wsd')
#   haml :edit, :locals => { :user => user, :github_path => github_path.to_s, :diagram => diagram }
# end

# get '/content' do
#   github.get_content(github_path).to_json
# end

