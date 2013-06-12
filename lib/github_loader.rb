require 'github_api'
require 'net/http'

class GithubLoader

  PATTERN = /https?:\/\/github.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/(?<branch>[^\/]+)\/(?<file>.+)/

  def initialize(client_id, client_secret, oauth_token = nil)
    @client_id     = client_id
    @client_secret = client_secret
    # @github = Octokit::Client.new(:login => "me", :oauth_token => oauth_token)
    @github = Github.new do |config|
      config.client_id     = @client_id
      config.client_secret = @client_secret
      config.oauth_token   = oauth_token
    end
  end

  def get_access_token(code)
    response = post("https://github.com/login/oauth/access_token", {
      'client_id'     => @client_id,
      'client_secret' => @client_secret,
      'code'          => code,
    })
    Rack::Utils.parse_nested_query(response.body)['access_token']
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
    # @github.contents("#{user}/#{repo}", :path => file_path)
    Base64.decode64 @github.get_request("/repos/#{user}/#{repo}/contents/#{file_path}?ref=#{branch}").content
  end

  private
  def post(url, data)
    uri = URI("https://github.com/login/oauth/access_token")
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    https.post(uri.path, URI.encode_www_form(data))
  end
end
