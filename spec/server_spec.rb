# frozen_string_literal: true

require './server'
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

  it 'show index', :aggregate_failures do
    get '/'
    expect(last_response).to be_ok
    expect(last_response.body).to include('<h1>vizard.io</h1>')
  end
end
