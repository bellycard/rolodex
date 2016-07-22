angular.module("rolodex.buttons", [])

.constant("buttonConfig", activeClass: "active", toggleEvent: "click")

.controller("ButtonsController", [
  "buttonConfig"
  (buttonConfig) ->
    @activeClass = buttonConfig.activeClass or "active"
    @toggleEvent = buttonConfig.toggleEvent or "click"

    return this
])

.directive("btnRadio", ->
  require: [
    "btnRadio"
    "ngModel"
  ]
  controller: "ButtonsController"
  link: (scope, element, attrs, ctrls) ->
    buttonsCtrl = ctrls[0]
    ngModelCtrl = ctrls[1]
    ngModelCtrl.$render = ->
      element.toggleClass buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio))

    element.bind buttonsCtrl.toggleEvent, ->
      isActive = element.hasClass(buttonsCtrl.activeClass)
      if not isActive or angular.isDefined(attrs.uncheckable)
        scope.$apply ->
          ngModelCtrl.$setViewValue (if isActive then null else scope.$eval(attrs.btnRadio))
          ngModelCtrl.$render()
)

.directive "btnCheckbox", ->
  require: [
    "btnCheckbox"
    "ngModel"
  ]
  controller: "ButtonsController"
  link: (scope, element, attrs, ctrls) ->
    getTrueValue = ->
      getCheckboxValue attrs.btnCheckboxTrue, true
    getFalseValue = ->
      getCheckboxValue attrs.btnCheckboxFalse, false
    getCheckboxValue = (attributeValue, defaultValue) ->
      val = scope.$eval(attributeValue)
      (if angular.isDefined(val) then val else defaultValue)
    buttonsCtrl = ctrls[0]
    ngModelCtrl = ctrls[1]

    #model -> UI
    ngModelCtrl.$render = ->
      element.toggleClass buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue())

    #ui->model
    element.bind buttonsCtrl.toggleEvent, ->
      scope.$apply ->
        ngModelCtrl.$setViewValue (if element.hasClass(buttonsCtrl.activeClass) then getFalseValue() else getTrueValue())
        ngModelCtrl.$render()
