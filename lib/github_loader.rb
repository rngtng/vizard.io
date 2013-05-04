require 'github_api'

class GithubLoader

  PATTERN = /https?:\/\/github.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/master\/(?<file>.+)/

  def initialize(client_id, client_secret, oauth_token)
    @github = Github.new do |config|
      config.client_id     = client_id
      config.client_secret = client_secret
      config.oauth_token   = oauth_token
    end
  end

  def extract(url)
    if m = url.match(PATTERN)
      return [m[:user], m[:repo], m[:file]]
    end
  end

  def get_file(user, repo, file_path)
    Base64.decode64 @github.get_request("/repos/#{user}/#{repo}/contents/#{file_path}").content
  end
end

