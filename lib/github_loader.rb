require 'github_api'

class GithubLoader

  PATTERN = /https?:\/\/github.com\/(?<user>[^\/]+)\/(?<repo>[^\/]+)\/blob\/(?<branch>[^\/]+)\/(?<file>.+)/

  def initialize(client_id, client_secret, oauth_token)
    @github = Github.new do |config|
      config.client_id     = client_id
      config.client_secret = client_secret
      config.oauth_token   = oauth_token
    end
  end

  def extract(url)
    if m = url.to_s.match(PATTERN)
      return [m[:user], m[:repo], m[:branch], m[:file]]
    end
  end

  def get_file(user, repo, branch, file_path)
    Base64.decode64 @github.get_request("/repos/#{user}/#{repo}/contents/#{file_path}?ref=#{branch}").content
  end
end

