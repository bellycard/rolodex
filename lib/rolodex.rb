require 'rolodex/sass'

module Rolodex
  class << self
    def load!
      if defined?(::Rails)
        require 'rolodex/engine'
      elsif defined?(::Sprockets)
        Sprockets.append_path(File.join(asset_path, 'images'))
        Sprockets.append_path(File.join(asset_path, 'stylesheets'))
        Sprockets.append_path(File.join(asset_path, 'javascripts'))
        Sprockets.append_path(File.join(asset_path, 'dist'))
      end
    end

    def gem_path
      @gem_path ||= File.expand_path '..', File.dirname(__FILE__)
    end

    def asset_path
      @asset_path ||= File.join gem_path, 'assets'
    end
  end
end

Rolodex.load!
