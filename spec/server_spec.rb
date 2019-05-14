# frozen_string_literal: true

require 'server'
require 'rspec'
require 'rack/test'

RSpec.configure do |conf|
  conf.include Rack::Test::Methods
end

set :environment, :test

describe 'Uml Generator App' do
  def app
    Sinatra::Application
  end

  it 'show index' do
    get '/'
    last_response.should be_ok
    last_response.body.should =~ '<h1>UML Generator</h1>'
  end
end
