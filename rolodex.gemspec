# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'rolodex/version'

Gem::Specification.new do |spec|
  spec.name          = "rolodex"
  spec.version       = Rolodex::VERSION
  spec.authors       = ["Darby Frey"]
  spec.email         = ["darby@bellycard.com"]
  spec.description   = %q{Bellystyle}
  spec.summary       = %q{Bellystyle}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency 'autoprefixer-rails'
  spec.add_dependency 'middleman-autoprefixer'
  spec.add_dependency 'compass', '~> 1.0.0.alpha'
  spec.add_dependency 'sass', '>= 3.3.10'
  spec.add_dependency "angular-html2js"

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  spec.add_development_dependency "pry"
end
