# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'rolodex/version'

Gem::Specification.new do |spec|
  spec.name          = "rolodex"
  spec.version       = Rolodex::VERSION
  spec.authors       = ["AJ Self, Darby Frey, Shay Howe"]
  spec.email         = ["tech@bellycard.com"]
  spec.description   = %q{Rolodex}
  spec.summary       = %q{Rolodex}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_dependency 'angular-html2js'
  spec.add_dependency 'sass', '~> 3.4.3'
  spec.add_dependency 'sprockets', '~> 2.12.2'

  spec.add_development_dependency 'bundler', '~> 1.3'
  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'pry'

end
