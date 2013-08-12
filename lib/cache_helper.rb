require 'sinatra/base'
require 'digest/sha1'

# original version by https://gist.github.com/bryanthompson/277560

class CacheHelper
  module Sinatra
    module Helpers
      def cache(cache_file, options = {}, &block)
        read_fragment(cache_file, options) || write_fragment(cache_file, block.call)
      end

      private

      def read_fragment(cache_file, options = {})
        if File.file?(cache_file)
          if options[:max_age]
            current_age = (Time.now - File.mtime(cache_file)).to_i / 60
            puts "Fragment for '#{name}' is #{current_age} minutes old."
            return false if current_age > options[:max_age]
          end
          return File.read(cache_file)
        end
        false
      end

      def write_fragment(cache_file, content)
        FileUtils.mkdir_p File.dirname(cache_file)
        File.open(cache_file, "w") { |f| f.write(content) }
        puts "Fragment written for '#{cache_file}'"
        content
      end
    end

    def self.registered(app)
      app.helpers CacheHelper::Sinatra::Helpers
    end
  end
end

Sinatra.register CacheHelper::Sinatra
