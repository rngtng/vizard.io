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
require 'octokit'
require 'net/http'

require 'lib/plantuml_renderer'

CONTENT_TYPE_MAPPING = {
  'png'  => 'image/png',
  'txt'  => 'text/plain',
  'utxt' => 'text/plain',
}

set :haml, :format => :html5

helpers do
  def get_access_token(code)
    response = post("https://github.com/login/oauth/access_token", {
      'client_id'     => ENV['GITHUB_ID'],
      'client_secret' => ENV['GITHUB_SECRET'],
      'code'          => code,
    })
    Rack::Utils.parse_nested_query(response.body)['access_token']
  end

  def post(url, data)
    uri = URI(url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    https.post(uri.path, URI.encode_www_form(data))
  end

  def get_content(user, repo, token, path, branch = 'master')
    user_repo = "#{user}/#{repo}"
    Octokit::Client.new(:oauth_token => token).contents(user_repo, {
      :path   => path,
      :ref    => branch,
      :accept => 'application/vnd.github.raw'
    })
  end

  def auth_url(scope = 'repo')
    "https://github.com/login/oauth/authorize?client_id=#{ENV['GITHUB_ID']}&scope=#{scope}"
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

# ---------------------------------------------------

get '/render.:format' do
  set_content_type params["format"]
  diagram_data = get_content(params[:user], params[:repo], params[:token], params[:path], params[:branch])
  body PlantumlRenderer.render(diagram_data, params["format"])
end

post '/render.:format' do
  set_content_type params["format"]
  body PlantumlRenderer.render(request.body.string, params["format"])
end

# ---------------------------------------------------

get '/css/style.css' do
  less :'style.css'
end

get '/login' do
  if code = params["code"]
    haml :login, :locals => { :access_token => get_access_token(code) }
  else
    redirect auth_url
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

