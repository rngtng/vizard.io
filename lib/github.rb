require 'octokit'
require 'net/http'

class Github

  class NotFound < StandardError; end

  PATTERN = /https?:\/\/github.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/(?<branch>[^\/]+)\/(?<file>.+)/

  def initialize(client_id, client_secret, oauth_token = nil)
    @client_id     = client_id
    @client_secret = client_secret
    @oauth_token   = oauth_token
  end

  def get_access_token(code)
    response = post("https://github.com/login/oauth/access_token", {
      'client_id'     => @client_id,
      'client_secret' => @client_secret,
      'code'          => code,
    })
    @oauth_token = Rack::Utils.parse_nested_query(response.body)['access_token']
  rescue => e
    puts e.message
    nil
  end

  def auth_url(scope = 'repo')
    "https://github.com/login/oauth/authorize?client_id=#{@client_id}&scope=#{scope}"
  end

  def extract(url)
    if m = url.to_s.match(PATTERN)
      return [m[:user], m[:repo], m[:branch], m[:file]]
    end
  end

  def get_file(user, repo, branch, file_path)
    @github = Octokit::Client.new(:oauth_token => @oauth_token)
    @github.contents "#{user}/#{repo}", :path => file_path, :accept => 'application/vnd.github.raw'
  rescue Octokit::BadGateway, Octokit::NotFound
    raise NotFound
  end

  private
  def post(url, data)
    uri = URI(url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    https.post(uri.path, URI.encode_www_form(data))
  end
end
