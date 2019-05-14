# frozen_string_literal: true

require 'net/http'

class Github
  def initialize(id, secret)
    @id = id
    @secret = secret
  end

  def get_access_token(code)
    response = post('https://github.com/login/oauth/access_token',
                    'client_id' => @id,
                    'client_secret' => @secret,
                    'code' => code)
    Rack::Utils.parse_nested_query(response.body)['access_token']
  end

  def auth_url(scope = 'repo')
    "https://github.com/login/oauth/authorize?client_id=#{@id}&scope=#{scope}"
  end

  private

  def post(url, data)
    uri = URI(url)
    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true
    https.post(uri.path, URI.encode_www_form(data))
  end
end
