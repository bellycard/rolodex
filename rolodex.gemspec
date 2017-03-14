lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "rolodex/version"

Gem::Specification.new do |spec|
  spec.name          = "rolodex"
  spec.version       = Rolodex::VERSION
  spec.homepage      = "http://github.com/bellycard/rolodex"
  spec.authors       = ["AJ Self, Darby Frey, Shay Howe"]
  spec.email         = ["tech@bellycard.com"]
  spec.description   = %q{Rolodex}
  spec.summary       = %q{Rolodex}
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.require_paths = ["lib"]

  spec.add_dependency "sass", "~> 3.4.22"
  spec.add_dependency "sprockets"

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "pronto", "~> 0.8.2"
  spec.add_development_dependency "pronto-scss", "~> 0.8.0"
end
