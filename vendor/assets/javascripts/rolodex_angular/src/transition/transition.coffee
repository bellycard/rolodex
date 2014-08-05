angular.module('rolodex.transition', [])

# $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
# @param  {DOMElement} element  The DOMElement that will be animated.
# @param  {string|object|function} trigger  The thing that will cause the transition to start:
#   - As a string, it represents the css class to be added to the element.
#   - As an object, it represents a hash of style attributes to be applied to the element.
#   - As a function, it represents a function to be called that will cause the transition to occur.
# @return {Promise}  A promise that is resolved when the transition finishes.
.factory('$transition', ['$q', '$timeout', '$rootScope', ($q, $timeout, $rootScope) ->
  $transition = (element, trigger, options) ->
    options = options or {}
    deferred = $q.defer()
    endEventName = $transition[if options.animation then 'animationEndEventName' else 'transitionEndEventName']

    transitionEndHandler = (event) ->
      $rootScope.$apply ->
        element.unbind endEventName, transitionEndHandler
        deferred.resolve(element)

    if endEventName
      element.bind(endEventName, transitionEndHandler)

    # Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
    $timeout ->
      if _.isString(trigger)
        element.addClass(trigger)
      else if _.isFunction(trigger)
        trigger(element)
      else if _.isObject(tigger)
        element.css(trigger)

      # If browser does not support transitions, instantly resolve
      unless endEventName
        deferred.resolve(element)

    # Add our custom cancel function to the promise that is returned
    # We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    # i.e. it will therefore never raise a transitionEnd event for that transition
    deferred.promise.cancel = ->
      if endEventName
        element.unbind(endEventName, transitionEndHandler)
      deferred.reject('Transition cancelled')

    deferred.promise

  # Work out the name of the transitionEnd event
  transElement = document.createElement('trans')
  transitionEndEventNames =
    'WebkitTransition': 'webkitTransitionEnd'
    'MozTransition': 'transitionend'
    'OTransition': 'oTransitionEnd'
    'transition': 'transitionend'
  animationEndEventNames =
    'WebkitTransition': 'webkitAnimationEnd'
    'MozTransition': 'animationend'
    'OTransition': 'oAnimationEnd'
    'transition': 'animationend'

  findEndEventName = (endEventNames) ->
    _.each endEventNames, (value, name) ->
      if transElement.style[name] isnt undefined
        endEventNames[name]

  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames)
  $transition.animationEndEventName = findEndEventName(animationEndEventNames)
  return $transition
])
