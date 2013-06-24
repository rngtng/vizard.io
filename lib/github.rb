require 'octokit'
require 'net/http'
require 'digest/sha1'

class Github

  class NotFound < StandardError; end
  class Invalid < StandardError; end

  PATTERN = /https?:\/\/github.com\/(?<user_repo>[^\/]+\/[^\/]+)\/(blob|tree)\/(?<branch>[^\/]+)\/(?<file>.+)/

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

  def valid?(github_path)
    extract(github_path)
  rescue Invalid
    false
  end

  def get_content(github_path)
    user_repo, branch, file_path = extract(github_path)
    client.contents(user_repo, :path => file_path, :ref => branch, :accept => 'application/vnd.github.raw')
  rescue Octokit::BadGateway, Octokit::NotFound
    raise NotFound
  end

  # def get_dir(github_path)
  #   get_file(github_path).inject({}) do |hash, dir|
  #     # url._links.inspect
  #     puts dir.html_url
  #     hash[dir.name] =  (dir.type == 'dir') ? get_dir(dir.html_url) : dir.html_url
  #     hash
  #   end
  # rescue NoMethodError
  #   {}
  # end

  def get_raw_file(github_path)
    user_repo, branch, file_path = extract(github_path)
    client.contents(user_repo, :path => file_path, :ref => branch)
  rescue Octokit::BadGateway, Octokit::NotFound
    raise NotFound
  end

  def get_user
    user = client.user
    {
      :login      => user.login,
      :url        => user.html_url,
      :email      => user.email,
      :avatar_url => user.avatar_url,
    }
  end

  def update_file(github_path, commit_message, content)
    if file = get_raw_file(github_path)
      user_repo, branch, file_path = extract(github_path)
      r = client.update_contents(user_repo, file_path, commit_message, file.sha, content, :branch => branch)
      puts r.inspect
    end
  rescue Octokit::UnprocessableEntity
    false
  end


  private
  def extract(url)
    if m = url.to_s.match(PATTERN)
      return [m[:user_repo], m[:branch], m[:file]]
    end
    raise Invalid
  end

  def post(url, data)
    uri = URI(url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    https.post(uri.path, URI.encode_www_form(data))
  end

  def client
    Octokit::Client.new(:oauth_token => @oauth_token)
  end
end
