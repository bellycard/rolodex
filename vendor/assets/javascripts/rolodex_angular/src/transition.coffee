# $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
# @param {DOMElement} element  The DOMElement that will be animated.
# @param {string|object|function} trigger  The thing that will cause the transition to start:
# - As a string, it represents the css class to be added to the element.
# - As an object, it represents a hash of style attributes to be applied to the element.
# - As a function, it represents a function to be called that will cause the transition to occur.
# @return {Promise}  A promise that is resolved when the transition finishes.

angular.module("rolodex.transition", []).factory "$transition", [
  "$q"
  "$timeout"
  "$rootScope"
  ($q, $timeout, $rootScope) ->

    # Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur

    #If browser does not support transitions, instantly resolve

    # Add our custom cancel function to the promise that is returned
    # We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    # i.e. it will therefore never raise a transitionEnd event for that transition

    # Work out the name of the transitionEnd event
    findEndEventName = (endEventNames) ->
      for name of endEventNames
        return endEventNames[name]  if transElement.style[name] isnt `undefined`
      return
    $transition = (element, trigger, options) ->
      options = options or {}
      deferred = $q.defer()
      endEventName = $transition[(if options.animation then "animationEndEventName" else "transitionEndEventName")]
      transitionEndHandler = (event) ->
        $rootScope.$apply ->
          element.unbind endEventName, transitionEndHandler
          deferred.resolve element
          return

        return

      element.bind endEventName, transitionEndHandler  if endEventName
      $timeout ->
        if angular.isString(trigger)
          element.addClass trigger
        else if angular.isFunction(trigger)
          trigger element
        else element.css trigger  if angular.isObject(trigger)
        deferred.resolve element  unless endEventName
        return

      deferred.promise.cancel = ->
        element.unbind endEventName, transitionEndHandler  if endEventName
        deferred.reject "Transition cancelled"
        return

      deferred.promise

    transElement = document.createElement("trans")
    transitionEndEventNames =
      WebkitTransition: "webkitTransitionEnd"
      MozTransition: "transitionend"
      OTransition: "oTransitionEnd"
      transition: "transitionend"

    animationEndEventNames =
      WebkitTransition: "webkitAnimationEnd"
      MozTransition: "animationend"
      OTransition: "oAnimationEnd"
      transition: "animationend"

    $transition.transitionEndEventName = findEndEventName(transitionEndEventNames)
    $transition.animationEndEventName = findEndEventName(animationEndEventNames)
    return $transition
]
