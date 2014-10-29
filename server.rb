# encoding: utf-8

require 'rubygems'
require 'dotenv'
Dotenv.load(ENV['ENV'] || '.env')

require 'bundler/setup'

require 'sinatra'
require 'sinatra/cookies'
require 'sinatra/reloader' if development?

require 'newrelic_rpm'
require 'haml'
require 'less'
require 'base64'

require 'lib/cache_helper'

require 'lib/github'
require 'lib/plantuml_renderer'

CONTENT_TYPE_MAPPING = {
  'png'  => 'image/png',
  'txt'  => 'text/plain',
  'utxt' => 'text/plain',
}

newrelic_ignore '/ping'

set :haml, :format => :html5, :escape_attrs => false

helpers do
  def github
    @github ||= Github.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'])
  end

  def format
    params["format"]
  end

  def set_content_type(format)
    if content_type_value = CONTENT_TYPE_MAPPING[format]
      content_type content_type_value
    end
  end
end

# ---------------------------------------------------
before do
  if request.host.include?('heroku')
    redirect 'http://vizard.io'
  end
end

# ---------------------------------------------------

after do
  if request.env["HTTP_ACCEPT"] =~ /base64/
    body Base64.encode64(body.first)
  end
end

# ---------------------------------------------------

post '/render.:format' do
  set_content_type(format)
  cache(request.env["QUERY_STRING"], format) do
    PlantumlRenderer.render(request.body.string, format)
  end
end

# ---------------------------------------------------

get '/css/style.css' do
  less :'style.css'
end

get '/login' do
  if code = params["code"]
    haml :login, :locals => { :access_token => github.get_access_token(code) }
  else
    redirect github.auth_url
  end
end

get %r{(edit)?} do
  haml :index
end

get '/ping' do
  'OK'
end
