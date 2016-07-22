# Rolodex

Style for [Belly](http://bellycard.com)

## Installation

### Use with Bower

Import modules with this path in your Sass files:

```
@import 'bower_components/rolodex/assets/stylesheets/rolodex';
```

### Use with Rails/Middleman

Add to your `Gemfile`:

```
gem 'rolodex'
```

Import modules to your Sass files:

```
@import 'rolodex'
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Publishing/Deploying

1. Bump the [version number](http://semver.org/) `rolodex/lib/rolodex/version.rb`
2. Build the new gemspec `$ gem build rolodex.gemspec`
3. Push to rubygems.org `$ gem push rolodex-[new-version-number].gem`
