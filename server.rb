# encoding: utf-8

require 'rubygems'
require 'bundler/setup'

GITHUB_ID     = "b2941818e58646fa024c"
GITHUB_SECRET = "4a973802fd425d28a3a1132942c498dae6327efe"
OAUTH_TOKEN   = "25117da0c9914b5291a54e419251e3996a3fce1b"

require "sinatra"
require "sinatra/reloader" if development?


# def load_diagram(file_url)
#   if (user, repo, file_path = @github_loader.extract(file_url))
#     github_file(user, repo, file_path)
#   else
#     puts "hi"
#   end
# end

get '/render.:format' do
  diagram_data = if file_url = params["f"]
    load_diagram(file_url)
  else
    params["c"]
  end

  content_type 'image/png'  if params["format"] == 'png'
  content_type 'text/plain' if params["format"] == 'txt'
  content_type 'text/plain' if params["format"] == 'utxt'
  render_dia(diagram_data, params["format"])
end

get '/' do
  <<-EOF
  <img src="/render.png">
  EOF
end
