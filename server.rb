#! /usr/bin/env jruby
# frozen_string_literal: true

require 'rubygems'
require 'bundler/setup'

require 'dotenv'
require 'sinatra'
require 'haml'
require 'sass/plugin/rack'
# require 'rack/sassc'

require 'base64'

require './lib/github'
require './lib/plantuml_renderer'
require './lib/cache_helper'

Dotenv.load(ENV['ENV'] || '.env')

CONTENT_TYPE_MAPPING = {
  'png' => 'image/png',
  'txt' => 'text/plain',
  'utxt' => 'text/plain'
}.freeze

require 'rack-timeout'
use Rack::Timeout, service_timeout: 20
use Sass::Plugin::Rack

Sass::Plugin.options.merge(
  css_location: './docs/css/',
  template_location: 'docs/css',
  style: :compressed
)
# use Rack::SassC, {
#   check: ENV['RACK_ENV'] != 'production',
#   public_location: 'publi/css',
#   syntax: :scss,
#   css_dirname: :css,
#   scss_dirname: :scss,
#   create_map_file: true,
# }

# Sass::Plugin.options.merge({
#   :css_location      => './docs/css/',
#   :template_location => 'docs/css',
#   :style             => :compressed,
# })

set :haml, format: :html5, escape_attrs: false

set :static, true
set :public_folder, Proc.new { File.join(root, "docs") }

helpers do
  def github
    @github ||= Github.new(ENV['GITHUB_ID'], ENV['GITHUB_SECRET'])
  end

  def format
    params['format']
  end

  def set_content_type(format)
    # rubocop:disable Style/GuardClause
    if (content_type_value = CONTENT_TYPE_MAPPING[format])
      content_type content_type_value
    end
    # rubocop:enable Style/GuardClause
  end
end

# ---------------------------------------------------
# before do
#   redirect 'http://vizard.io' if request.host.include?('heroku')
# end

# ---------------------------------------------------

after do
  body Base64.encode64(body.first) if request.env['HTTP_ACCEPT'] =~ /base64/
end

# ---------------------------------------------------

post '/render.:format' do
  set_content_type(format)
  cache_control :public
  headers 'Access-Control-Allow-Origin' => '*'
  # cache(request.env["QUERY_STRING"], format) do
  PlantumlRenderer.render(request.body.string, format)
  # end
end

# ---------------------------------------------------

get '/login' do
  if (code = params['code'])
    haml :login, locals: { access_token: github.get_access_token(code) }
  else
    redirect github.auth_url
  end
end

get '/ping' do
  'OK'
end

get %r{(/edit)?/.*} do
  haml :'index-old'
end
