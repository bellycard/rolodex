#= require 'rolodex_angular/template/stepper/stepper'

angular.module 'rolodex.stepper', []

.directive 'blyStepper', ->
  restrict: 'AE'
  require: 'ngModel'
  scope:
    min: '@'
    max: '@'
    step: '@'
    name: '@'
    ngModel: '='
    ngDisabled: '='
  templateUrl: 'components/stepper/stepper.html'

  link: (scope, elem, attrs, ngModelCtrl) ->
    scope.step = 1 unless scope.step
    scope.min = _.parseInt(scope.min) if scope.min
    scope.max = _.parseInt(scope.max) if scope.max

    # On input and increment/decrement, turn the string into an integer
    ngModelCtrl.$formatters.push (value) -> _.parseInt(value)
    ngModelCtrl.$parsers.push (value) -> _.parseInt(value)

    # Update the value
    updateViewValue = (value) ->
      ngModelCtrl.$setViewValue(_.parseInt(value))
      ngModelCtrl.$render()
      scope.$emit('stepper:update', value)

    # Decrement the value if:
    #   a min value is defined, and the value is >= the min
    #   you wont go below the min value if you decrement by the step
    scope.canDecrement = ->
      return true unless scope.min

      angular.isDefined(scope.min) and
        ngModelCtrl.$viewValue >= scope.min and
        (ngModelCtrl.$viewValue + -scope.step) >= scope.min

    # Increment the value if:
    #   a max value is defined, and the value is <= the max
    #   you wont go above the max value if you increment by the step
    scope.canIncrement = ->
      return true unless scope.max

      angular.isDefined(scope.max) and
        ngModelCtrl.$viewValue <= scope.max
        (ngModelCtrl.$viewValue + +scope.step) <= scope.max

    # Increment the value by the step
    scope.increment = ->
      value = ngModelCtrl.$viewValue + +scope.step
      updateViewValue(value)
      scope.$emit('stepper:increment', value)

    # Decrement the value by the step
    scope.decrement = ->
      value = ngModelCtrl.$viewValue + -scope.step
      updateViewValue(value)
      scope.$emit('stepper:decrement', value)

    elem.find('input').bind 'blur', ->
      # If user clears the field, set it to 0
      if isNaN(ngModelCtrl.$viewValue)
        updateViewValue(scope.min)

      # Remove leading zeroes when blurring
      scope.$apply ->
        scope.ngModel = _.parseInt(ngModelCtrl.$modelValue)
