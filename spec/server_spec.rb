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

  it 'root renders index', :aggregate_failures do
    get '/'
    expect(last_response).to be_ok
    expect(last_response.body).to include('<h1>vizard.io</h1>')
  end

  it 'show renders index', :aggregate_failures do
    get '/diagram1557870390342.pu'
    expect(last_response.body).to include('<h1>vizard.io</h1>')
  end

  it 'show renders index', :aggregate_failures do
    get '/bundle.js'
    expect(last_response.body).to_not include('<h1>vizard.io</h1>')
  end

  it 'edit renders index', :aggregate_failures do
    get '/edit/diagram1557870390342.pu'
    expect(last_response.body).to include('<h1>vizard.io</h1>')
  end
end
