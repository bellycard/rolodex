angular.module('rolodex.dropDown', [])

.constant('dropdownConfig', openClass: 'open')

.service('dropdownService', [
  '$document'
  ($document) ->
    openScope = null

    @open = (dropdownScope) ->
      unless openScope
        $document.bind 'click', closeDropdown
        $document.bind 'keydown', escapeKeyBind
      openScope.isOpen = false  if openScope and openScope isnt dropdownScope
      openScope = dropdownScope

    @close = (dropdownScope) ->
      if openScope is dropdownScope
        openScope = null
        $document.unbind 'click', closeDropdown
        $document.unbind 'keydown', escapeKeyBind

    closeDropdown = (evt) ->
      toggleElement = openScope.getToggleElement()
      return  if evt and toggleElement and toggleElement[0].contains(evt.target)
      openScope.$apply ->
        openScope.isOpen = false

    escapeKeyBind = (evt) ->
      if evt.which is 27
        openScope.focusToggleElement()
        closeDropdown()

    return this
])

.controller('DropdownController', [
  '$scope'
  '$attrs'
  '$parse'
  'dropdownConfig'
  'dropdownService'
  '$animate'
  ($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) ->
    self = this
    scope = $scope.$new()
    openClass = dropdownConfig.openClass
    getIsOpen = undefined
    setIsOpen = angular.noop
    toggleInvoker = (if $attrs.onToggle then $parse($attrs.onToggle) else angular.noop)

    @init = (element) ->
      self.$element = element
      if $attrs.isOpen
        getIsOpen = $parse($attrs.isOpen)
        setIsOpen = getIsOpen.assign
        $scope.$watch getIsOpen, (value) ->
          scope.isOpen = !!value

    @toggle = (open) ->
      scope.isOpen = (if arguments.length then !!open else not scope.isOpen)

    @isOpen = ->
      scope.isOpen

    scope.getToggleElement = ->
      self.toggleElement

    scope.focusToggleElement = ->
      self.toggleElement[0].focus()  if self.toggleElement
      return

    scope.$watch 'isOpen', (isOpen, wasOpen) ->
      $animate[(if isOpen then 'addClass' else 'removeClass')] self.$element, openClass
      if isOpen
        scope.focusToggleElement()
        dropdownService.open scope
      else
        dropdownService.close scope
      setIsOpen $scope, isOpen
      if angular.isDefined(isOpen) and isOpen isnt wasOpen
        toggleInvoker $scope,
          open: !!isOpen

    $scope.$on '$locationChangeSuccess', ->
      scope.isOpen = false

    $scope.$on '$destroy', ->
      scope.$destroy()

    return this

])

.directive 'dropdown', ->
  controller: 'DropdownController'
  link: (scope, element, attrs, dropdownCtrl) ->
    dropdownCtrl.init element

.directive 'dropdownToggle', ->
  require: '?^dropdown'
  link: (scope, element, attrs, dropdownCtrl) ->
    return  unless dropdownCtrl
    dropdownCtrl.toggleElement = element

    toggleDropdown = (event) ->
      event.preventDefault()
      if not element.hasClass('disabled') and not attrs.disabled
        scope.$apply ->
          dropdownCtrl.toggle()
          return

      return

    element.bind 'click', toggleDropdown

    # WAI-ARIA
    element.attr
      'aria-haspopup': true
      'aria-expanded': false

    scope.$watch dropdownCtrl.isOpen, (isOpen) ->
      element.attr 'aria-expanded', !!isOpen
      return

    scope.$on '$destroy', ->
      element.unbind 'click', toggleDropdown
      return

    return
