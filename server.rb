# encoding: utf-8

require 'rubygems'
require 'bundler/setup'

require 'dotenv'
require 'sinatra'
require 'haml'
require 'sass/plugin/rack'

require 'base64'

require './lib/github'
require './lib/plantuml_renderer'
require './lib/cache_helper'

Dotenv.load(ENV['ENV'] || '.env')

CONTENT_TYPE_MAPPING = {
  'png'  => 'image/png',
  'txt'  => 'text/plain',
  'utxt' => 'text/plain',
}

require "rack-timeout"
Rack::Timeout.timeout = 20

use Rack::Timeout
use Sass::Plugin::Rack

Sass::Plugin.options.merge({
  :css_location      => './public/css/',
  :template_location => 'public/css',
  :style             => :compressed,
})

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
  cache_control :public
  # cache(request.env["QUERY_STRING"], format) do
    PlantumlRenderer.render(request.body.string, format)
  # end
end

# ---------------------------------------------------

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
