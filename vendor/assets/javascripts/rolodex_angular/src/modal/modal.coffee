#= require 'rolodex_angular/template/modal/window'

angular.module("rolodex.modal", ['rolodex.transition', 'rolodexTemplates'])
.factory "$$stackedMap", ->
  createNew: ->
    stack = []
    add: (key, value) ->
      stack.push
        key: key
        value: value

      return

    get: (key) ->
      i = 0

      while i < stack.length
        return stack[i]  if key is stack[i].key
        i++
      return

    keys: ->
      keys = []
      i = 0

      while i < stack.length
        keys.push stack[i].key
        i++
      keys

    top: ->
      stack[stack.length - 1]

    remove: (key) ->
      idx = -1
      i = 0

      while i < stack.length
        if key is stack[i].key
          idx = i
          break
        i++
      stack.splice(idx, 1)[0]

    removeTop: ->
      stack.splice(stack.length - 1, 1)[0]

    length: ->
      stack.length

.directive("modalWindow", ["$modalStack", "$timeout", ($modalStack, $timeout) ->
  restrict: "EA"
  scope:
    index: "@"
    animate: "="

  replace: true
  transclude: true
  templateUrl: (tElement, tAttrs) ->
    tAttrs.templateUrl or "rolodex_angular/template/modal/window"

  link: (scope, element, attrs) ->
    element.addClass attrs.windowClass or ""
    scope.size = attrs.size
    $timeout ->
      scope.animate = true
      element[0].focus()  unless element[0].querySelectorAll("[autofocus]").length
      return

    scope.close = (evt) ->
      modal = $modalStack.getTop()
      if modal and modal.value.backdrop and modal.value.backdrop isnt "static" and (evt.target is evt.currentTarget)
        evt.preventDefault()
        evt.stopPropagation()
        $modalStack.dismiss modal.key, "backdrop click"
      return

])

.directive "modalTransclude", ->
  link: ($scope, $element, $attrs, controller, $transclude) ->
    $transclude $scope.$parent, (clone) ->
      $element.empty()
      $element.append clone

.factory("$modalStack", ["$transition", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap"
  ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) ->
    backdropIndex = ->
      topBackdropIndex = -1
      opened = openedWindows.keys()
      i = 0

      while i < opened.length
        topBackdropIndex = i  if openedWindows.get(opened[i]).value.backdrop
        i++
      topBackdropIndex

    removeModalWindow = (modalInstance) ->
      body = $document.find("body").eq(0)
      modalWindow = openedWindows.get(modalInstance).value
      openedWindows.remove modalInstance
      removeAfterAnimate modalWindow.modalDomEl, modalWindow.modalScope, 300, ->
        modalWindow.modalScope.$destroy()
        body.toggleClass OPENED_MODAL_CLASS, openedWindows.length() > 0
        checkRemoveBackdrop()

    checkRemoveBackdrop = ->
      if backdropDomEl and backdropIndex() is -1
        backdropScopeRef = backdropScope
        removeAfterAnimate backdropDomEl, backdropScope, 150, ->
          backdropScopeRef.$destroy()
          backdropScopeRef = null

        backdropDomEl = undefined
        backdropScope = undefined

    removeAfterAnimate = (domEl, scope, emulateTime, done) ->
      afterAnimating = ->
        return if afterAnimating.done
        afterAnimating.done = true
        domEl.remove()
        done() if done

      scope.animate = false
      transitionEndEventName = $transition.transitionEndEventName

      if transitionEndEventName
        timeout = $timeout(afterAnimating, emulateTime)
        domEl.bind transitionEndEventName, ->
          $timeout.cancel timeout
          afterAnimating()
          scope.$apply()

      else
        $timeout afterAnimating

    OPENED_MODAL_CLASS = "modal-open"
    backdropDomEl = undefined
    backdropScope = undefined
    openedWindows = $$stackedMap.createNew()
    $modalStack = {}

    $rootScope.$watch backdropIndex, (newBackdropIndex) ->
      backdropScope.index = newBackdropIndex  if backdropScope

    $document.bind "keydown", (evt) ->
      modal = undefined
      if evt.which is 27
        modal = openedWindows.top()
        if modal and modal.value.keyboard
          evt.preventDefault()
          $rootScope.$apply ->
            $modalStack.dismiss modal.key, "escape key press"

    $modalStack.open = (modalInstance, modal) ->
      openedWindows.add modalInstance,
        deferred: modal.deferred
        modalScope: modal.scope
        backdrop: modal.backdrop
        keyboard: modal.keyboard

      body = $document.find("body").eq(0)
      currBackdropIndex = backdropIndex()

      if currBackdropIndex >= 0 and not backdropDomEl
        backdropScope = $rootScope.$new(true)
        backdropScope.index = currBackdropIndex
        angularBackgroundDomEl = angular.element("<div modal-backdrop></div>")
        angularBackgroundDomEl.attr "backdrop-class", modal.backdropClass
        backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope)
        body.append backdropDomEl

      angularDomEl = angular.element("<div modal-window></div>")
      angularDomEl.attr
        "template-url": modal.windowTemplateUrl
        "window-class": modal.windowClass
        size: modal.size
        index: openedWindows.length() - 1
        animate: "animate"
      .html modal.content

      modalDomEl = $compile(angularDomEl)(modal.scope)
      openedWindows.top().value.modalDomEl = modalDomEl
      body.append modalDomEl
      body.addClass OPENED_MODAL_CLASS

    $modalStack.close = (modalInstance, result) ->
      modalWindow = openedWindows.get(modalInstance)

      if modalWindow
        modalWindow.value.deferred.resolve result
        removeModalWindow modalInstance

    $modalStack.dismiss = (modalInstance, reason) ->
      modalWindow = openedWindows.get(modalInstance)

      if modalWindow
        modalWindow.value.deferred.reject reason
        removeModalWindow modalInstance

    $modalStack.dismissAll = (reason) ->
      topModal = @getTop()
      while topModal
        @dismiss topModal.key, reason
        topModal = @getTop()

    $modalStack.getTop = ->
      openedWindows.top()

    $modalStack
])

.provider "$modal", ->
  $modalProvider =
    options:
      backdrop: true #can be also false or 'static'
      keyboard: true

    $get: ["$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack"
      ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) ->
        getTemplatePromise = (options) ->
          (if options.template then $q.when(options.template) else $http.get((if angular.isFunction(options.templateUrl) then (options.templateUrl)() else options.templateUrl),
            cache: $templateCache
          ).then((result) ->
            result.data
          ))

        getResolvePromises = (resolves) ->
          promisesArr = []
          angular.forEach resolves, (value) ->
            promisesArr.push $q.when($injector.invoke(value))  if angular.isFunction(value) or angular.isArray(value)

          promisesArr

        $modal = {}

        $modal.open = (modalOptions) ->
          modalResultDeferred = $q.defer()
          modalOpenedDeferred = $q.defer()

          #prepare an instance of a modal to be injected into controllers and returned to a caller
          modalInstance =
            result: modalResultDeferred.promise
            opened: modalOpenedDeferred.promise
            close: (result) ->
              $modalStack.close modalInstance, result

            dismiss: (reason) ->
              $modalStack.dismiss modalInstance, reason

          #merge and clean up options
          modalOptions = angular.extend({}, $modalProvider.options, modalOptions)
          modalOptions.resolve = modalOptions.resolve or {}

          #verify options
          throw new Error("One of template or templateUrl options is required.")  if not modalOptions.template and not modalOptions.templateUrl
          templateAndResolvePromise = $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)))

          templateAndResolvePromise.then resolveSuccess = (tplAndVars) ->
            modalScope = (modalOptions.scope or $rootScope).$new()
            modalScope.$close = modalInstance.close
            modalScope.$dismiss = modalInstance.dismiss
            ctrlInstance = undefined
            ctrlLocals = {}
            resolveIter = 1

            #controllers
            if modalOptions.controller
              ctrlLocals.$scope = modalScope
              ctrlLocals.$modalInstance = modalInstance
              angular.forEach modalOptions.resolve, (value, key) ->
                ctrlLocals[key] = tplAndVars[resolveIter++]

              ctrlInstance = $controller(modalOptions.controller, ctrlLocals)
              modalScope[modalOptions.controllerAs] = ctrlInstance  if modalOptions.controller

            $modalStack.open modalInstance,
              scope: modalScope
              deferred: modalResultDeferred
              content: tplAndVars[0]
              backdrop: modalOptions.backdrop
              keyboard: modalOptions.keyboard
              backdropClass: modalOptions.backdropClass
              windowClass: modalOptions.windowClass
              windowTemplateUrl: modalOptions.windowTemplateUrl
              size: modalOptions.size

          , (reason) ->
            modalResultDeferred.reject reason

          templateAndResolvePromise.then ->
            modalOpenedDeferred.resolve true
          , ->
            modalOpenedDeferred.reject false

          modalInstance

        $modal
    ]

  $modalProvider
