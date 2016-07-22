# Rolodex

Style for [Belly](http://bellycard.com)

## Installation

### Use with Bower

Import modules with this path in your Sass files:

```
@import 'bower_components/rolodex/assets/stylesheets/rolodex';
```

### Use with Rubygems

Add to your `Gemfile`:

```
gem 'rolodex'
```

Import modules to your Sass files:

```
@import 'rolodex'
```

## Building

Rolodex uses [Gulp](http://gulpjs.com) to build and minify assets. Before you release an updated version, make sure to run:

```
gulp build
```

## Releasing

Rolodex uses [semver](http://semver.org/) for versioning. Bower will pick up new releases by the tags.

1. Run `$ gulp build` to create the minified files
2. Bump `VERSION` in [rolodex/lib/rolodex/version.rb](https://github.com/bellycard/rolodex/blob/master/lib/rolodex/version.rb)
3. Commit the minified files and version bump (`$ git commit -am 'Release v4.2.0'`)
4. Create a new git tag with the (`$ git tag v4.2.0`)
5. Push the git tag (`$ git push --tags`)
6. Build the new gemspec (`$ gem build rolodex.gemspec`)
7. Push to rubygems.org (`$ gem push rolodex-4.2.0.gem`)
