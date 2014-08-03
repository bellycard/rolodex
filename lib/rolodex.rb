require "rolodex/version"
require "rolodex/sass"

module Rolodex

  if defined?(::Middleman)
    require "middleman-autoprefixer"
    require "rolodex/sprockets"
  end

end
