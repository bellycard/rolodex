require "angular/html2js"
require "rolodex/version"
require "rolodex/sass"

module Rolodex

  if defined?(::Middleman)
    require "middleman-autoprefixer"
    require "rolodex/sprockets"

    Angular::Html2js.configure do |config|
      config.module_name = 'templates'
      config.init_sprockets
    end

  end

end
