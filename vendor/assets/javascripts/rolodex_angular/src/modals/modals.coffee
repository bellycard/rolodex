# This is a complete clone of UI Bootstraps modal implementation with a few additions and rewritten in CoffeeScript
angular.module('rolodex.modal', ['rolodex.transition'])

# A helper, internal data structure that acts as a map but also allows getting / removing
# elements in the LIFO order

.factory '$$stackedMap', ->
  createNew: ->
    stack = []

    add: (key, value) ->
      stack.push
        key: key
        value: value
    # TODO: Checkback this might break
    get: (key) ->
      search[key] = key
      _.find(stack, search)
    # TODO: Checkback this might break
    keys: -> _.pluck(stack, 'key')
    top: -> stack[stack.length - 1]
    # TODO: Checkback this might break
    remove: (key) ->
      removed = null
      _.remove stack, (datum) ->
        if datum.key is key
          removed = datum
          true
      if removed? then return removed
    removeTop: -> stack.splick(stack.length - 1, 1)[0]
    length: -> stack.length

# A helper directive for the roModal service. It creates a backdrop element.
.directive('roModalBackdrop', ['$timeout', ($timeout) ->
  restrict: 'EA'
  replace: true
  templateUrl: 'rolodex_angular/template/modal/backgroup.html'
  link: (scope, element, attrs) ->
    scope.backdropClass = attrs.backdropClass or ''
    scope.animate = false
    # Trigger CSS transitions
    $timeout -> scope.animate = true
])

.directive('roModalWindow', ['roModalStack', '$timeout', (roModalStack, $timeout) ->
  restrict: 'EA'
  scope:
    index: '@'
    animate: '='
  replace: true
  transclude: true
  templateUrl: (element, attrs) -> attrs.templateUrl or 'rolodex_angular/template/modal/window.html'
  link: (scope, element, attrs) ->
    element.addClass(attrs.windowClass or '')
    scope.size = attrs.size

    $timeout ->
      # Trigger CSS transitions
      scope.animate = true
      # Auto-focusing of a freshly-opened modal element causes any child elements
      # with the autofocus attribute to loose focus. This is an issue on touch
      # based devices which will show and then hide the onscreen keyboard.
      # Attempts to refocus the autofocus element via JavaScript will not reopen
      # the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
      # the modal element if the modal does not contain an autofocus element.
      if not element[0].querySelectorAll('[autofocus]').length
        element[0].focus()

    scope.close = (evt) ->
      modal = roModalStack.getTop()
      if modal?.value.backdrop and modal.value.backdrop isnt 'static' and (evt.target is evt.currentTarget)
        evt.preventDefault()
        evt.stopPropagation()
        roModalStack.dismiss(modal.key, 'backdrop click')
])

.directive 'roModalTransclude', ->
  link: (scope, element, attrs, controller, $transclude) ->
    $transclude scope.parent, (clone) ->
      element.empty()
      element.append(clone)

.factory('roModalStack', ['$compile', '$document', '$rootScope', '$timeout', '$$stackedMap', 'roTransition',
  ($compile, $document, $rootScope, $timeout, $$stackedMap, roTransition) ->
    OPENED_MODAL_CLASS = 'modal-open'

    backdropDomEl = null
    backdropScope = null
    openedWindows = $$stackedMap.createNew()
    roModalStack = {}

    backdropIndex = ->
      topBackdropIndex = -1
      opened = _.keys(openedWindows)
      _.each opened, (datum, idx) ->
        if openedWindows.get(datum).value.backdrop
          topBackdropIndex = idx
      topBackdropIndex

    $rootScope.$watch backdropIndex, (newBackdropIndex) ->
      if backdropScope
        backdropScope.index = newBackdropIndex

    removeModalWindow = (modalInstance) ->
      body = $document.find('body').eq(0)
      modalWindow = openedWindows.get(modalInstance).value

      # Clean up the stack
      openedWindows.remove(modalInstance)

      # Remove window DOM element
      removeAfterAnimate modalWindow.modalDomEl, modalWindow.modalScope, 300, ->
        modalWindow.modalScope.$destroy()
        body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0)
        checkRemoveBackdrop()

    checkRemoveBackdrop = ->
      # Remove backdrop if no longer needed
      if backdropDomEl and backdropIndex() is -1
        backdropScopeRef = backdropScope
        removeAfterAnimate backdropDomEl, backdropScope, 150, ->
          backdropScopeRef.$destroy()
          backdropScopeRef = null
        backdropDomEl = undefined
        backdropScope = undefined

    removeAfterAnimate = (domEl, scope, emulateTime, done) ->
      scope.animate = false

      transitionEndEventName = $transition.transitionEndEventName

      if transitionEndEventName
        # Transition out
        timeout = $timeout(afterAnimating, emulateTime)

        domEl.bind transitionEndEventName, ->
          $timeout.cancel(timeout)
          afterAnimating()
          scope.$apply()

      else
        # Ensure this call is async
        $timeout(afterAnimating)

      afterAnimating = ->
        return if afterAnimating.done

        afterAnimating.done = true

        domEl.remove()

        done() if done

    $document.bind 'keydown', (evt) ->
      if evt.which is 27
        modal = openedWindows.top()

        if modal and modal.value.keyboard
          evt.preventDefault()
          $rootScope.$apply ->
            roModalStack.dismiss(modal.key, 'escape key press')

    roModalStack.open = (modalInstance, modal) ->
      openedWindows.add modalInstance,
        deferred: modal.deferred
        modalScope: modal.scope
        backdrop: modal.backdrop
        keyboard: modal.keyboard


      body = $document.find('body').eq(0)
      currBackdropIndex = backdropIndex()

      if  currBackdropIndex >= 0 and not backdropDomEl
        backdropScope = $rootScope.$new(true)
        backdropScope.index = currBackdropIndex
        angularBackgroundDomEl = angular.element('<div modal-backdrop></div>')
        angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass)
        backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope)
        body.append(backdropDomEl)

      angularDomEl = angular.element('<div modal-window></div>')
      angularDomEl.attr
        'template-url': modal.windowTemplateUrl
        'window-class': modal.windowClass
        'size': modal.size
        'index': openedWindows.length() - 1
        'animate': 'animate'
      .html(modal.content)

      modalDomEl = $compile(angularDomEl)(modal.scope)
      openedWindows.top().value.modalDomEl = modalDomEl
      body.append(modalDomEl)
      body.addClass(OPENED_MODAL_CLASS)

    roModalStack.close = (modalInstance, result) ->
      modalWindow = openedWindows.get(modalInstance)
      if modalWindow
        modalWindow.value.deferred.resolve(result)
        removeModalWindow(modalInstance)

    roModalStack.dismiss = (modalInstance, reason) ->
      modalWindow = openedWindows.get(modalInstance)
      if modalWindow
        modalWindow.value.deferred.reject(reason)
        removeModalWindow(modalInstance)

    roModalStack.dismissAll = (reason) ->
      topModal = this.getTop()
      while topModal
        this.dismiss(topModal.key, reason)
        topModal = this.getTop()

    roModalStack.getTop = ->
      return openedWindows.top()

    return roModalStack
])

.provider 'roModal', ->
  roModalProvider =
    options:
      backdrop: true # Can also be false or 'static'
      keyboard: true
    $get: ['$controller', '$http', '$injector', '$q', '$rootScope', '$templateCache', 'roModalStack',
      ($controller, $http, $injector, $q, $rootScope, $templateCache, roModalStack) ->
        roModal = {}

        getTemplatePromise = (options) ->
          if options.template
            $q.when(options.template)
          else
            if _.isFunction(options.templateUrl) then url = (options.templateUrl)() else url = options.templateUrl
            $http.get(url, cache: $templateCache)
            .then (result) -> result.data

        getResolvePromises = (resolves) ->
          promisesArr = []
          _.each resolves, (value) ->
            if _.isFunction(value) or _.isArray(value)
              promisesArr.push($q.when($injector.invoke(value)))
          promisesArr

        roModal.open = (modalOptions) ->
          modalResultDeferred = $q.defer()
          modalOpenedDeferred = $q.defer()

          # Prepare an instance of a modal to be injected into controllers and returned to a caller
          modalInstance =
            result: modalResultDeferred.promise
            opened: modalOpenedDeferred.promise
            close: (result) -> roModal.close(modalInstance, result)
            dismiss: (reason) -> roModal.dismiss(modalInstance, reason)

          # Merge and clean up options
          _.defaults(modalOptions, roModalProvider.options)

          modalOptions.resolve = modalOptions.resolve or {}

          # Verify options
          unless modalOptions.template and modalOptions.templateUrl
            throw new Error('A template or templateUrl option is required')

          templateAndResolvePromise = $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)))

          # Handle Result promise
          templateAndResolvePromise.then (tplAndVars) ->
            modalScope = (modalOptions or $rootScope).$new()
            modalScope.$close = modalInstance.close
            modalScope.$dismiss = modalInstance.dismiss

            ctrlInstance = {}
            ctrlLocals = {}
            resolveIter = 1

            # Controllers
            if modalOptions.controller
              ctrlLocals.$scope = modalScope
              _.each modalOptions.resolve, (value, key) ->
                ctrlLocals[key] = tplAndVars[resolveIter++]

            ctrlInstance = $controller(modalOptions.controller, ctrlLocals)

            if modalOptions.controller
              modalScope[modalOptions.controllerAs] = ctrlInstance

            roModalStack.open modalInstance,
              scope: modalScope
              deferred: modalResultDeferred
              content: _.first(tplAndVars)
              backdrop: modalOptions.backdrop
              keyboard: modalOptions.keyboard
              backdropClass: modalOptions.backdropClass
              windowClass: modalOptions.windowClass
              windowTemplateUrl: modalOptions.windowTemplateUrl
              size: modalOptions.size

          # Handle resolve error
          # TODO .catch()?
          , (reason) ->
            modalResultDeferred.reject(reason)

          # Handle Opened promise
          templateAndResolvePromise.then ->
            modalOpenedDeferred.resolve(true)
          # Agan, .catch()?
          , ->
            modalOpenedDeferred.reject(false)

          return modalInstance

        return roModal
    ]

  return roModalProvider
