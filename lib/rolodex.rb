require "rolodex/version"

module Rolodex

  if defined?(::Rails)
    class Engine < ::Rails::Engine
    end
  end
end
