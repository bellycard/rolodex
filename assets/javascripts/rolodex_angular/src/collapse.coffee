angular.module("rolodex.collapse", ["rolodex.transition"])

.directive "collapse", [
  "$transition"
  ($transition) ->
    return link: (scope, element, attrs) ->
      doTransition = (change) ->
        newTransitionDone = ->

          # Make sure it's this transition, otherwise, leave it alone.
          currentTransition = `undefined` if currentTransition is newTransition

        newTransition = $transition(element, change)

        currentTransition.cancel()  if currentTransition

        currentTransition = newTransition

        newTransition.then(newTransitionDone, newTransitionDone)

        return newTransition
        return
      expand = ->
        if initialAnimSkip
          initialAnimSkip = false
          expandDone()
        else
          element.removeClass("collapse").addClass "collapsing"
          doTransition(height: element[0].scrollHeight + "px").then expandDone
        return
      expandDone = ->
        element.removeClass "collapsing"
        element.addClass "collapse in"
        element.css height: "auto"
        return
      collapse = ->
        if initialAnimSkip
          initialAnimSkip = false
          collapseDone()
          element.css height: 0
        else

          # CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
          element.css height: element[0].scrollHeight + "px"

          #trigger reflow so a browser realizes that height was updated from auto to a specific value
          x = element[0].offsetWidth
          element.removeClass("collapse in").addClass "collapsing"
          doTransition(height: 0).then collapseDone
        return
      collapseDone = ->
        element.removeClass "collapsing"
        element.addClass "collapse"
        return
      initialAnimSkip = true
      currentTransition = undefined
      scope.$watch attrs.collapse, (shouldCollapse) ->
        if shouldCollapse
          collapse()
        else
          expand()
        return

      return
]
