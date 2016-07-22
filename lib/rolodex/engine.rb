module Rolodex
  module Rails
    class Engine < ::Rails::Engine
      initializer 'rolodex.assets.precompile' do |app|
        %w(stylesheets javascripts dist images).each do |sub|
          app.config.assets.paths << root.join('assets', sub).to_s
        end
        app.config.assets.precompile << %r(\.(?:png|svg|gif)$)
      end
    end
  end
end
