# [Angular](https://angularjs.org/) modules just for [Rolodex](https://github.com/bellycard/rolodex)

***

## Wat?
Rolodex components written in Angular. Rolodex Angular has very few dependencies, requiring only [AngularJS](https://angularjs.org/), of course, and [LoDash](http://lodash.com/) (or [Underscore](http://underscorejs.org/)). The collection of directives should be very simple to use, fast, and drop in seamlessly when using Rolodex styles and classes. jQuery is not required for any of these modules to work now and forever. This project is heavily infulenced by [UI Bootstrap](http://angular-ui.github.io/bootstrap/).

## See Rolodex Angular In Action
[Belly Style Guide](https://style.bellycard.com/)

## Installation
Required libraries

* [AngularJS](https://angularjs.org/)
* [LoDash](http://lodash.com/) or [Underscore](http://underscorejs.org/)

Make sure that both are loaded before Rolodex.

Add to your `Gemfile:`

```ruby
gem 'rolodex', :git => 'https://github.com/bellycard/rolodex.git'
```

Import to your main coffee/js file

```coffeescript
#= require 'rolodex_angular'
```

Add Rolodex to your Angular App

```coffeescript
angular.module('myApp', ['rolodex'])
```

## Dial Up Only What You Need
Utilizing Angular's flexible module system each directive is its own module which means you don't have to import then entire rolodex module if you don't need it. No need for jQuery either - each module should be independent of jQuery. Guaranteed. Forever.

## Tested Browsers
* Chrome
* Safari
* IE 9/10
* Opera

## Development
You will need already installed:

* Ruby
* NodeJS (For Karma, the test runner)

Run Bundler

```
$: bundle install
```

Run NPM install

```
$: npm install
```

Run Karma

```
$: npm test_angular
```
