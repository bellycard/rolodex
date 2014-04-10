require "rolodex/version"
require "rolodex/sass"

module Rolodex

  if defined?(::Rails)
    class Engine < ::Rails::Engine
    end
  end

end
