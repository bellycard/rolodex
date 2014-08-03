require "rolodex/version"
require "rolodex/sass"

module Rolodex

  if defined?(::Middleman)
    require "middleman-autoprefixer"
  end

end
