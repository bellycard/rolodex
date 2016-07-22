(function() {
  angular.module('rolodex', ['rolodex.alert', 'rolodex.dropdown', 'rolodex.modal', 'rolodex.stepper']);

}).call(this);

angular.module("rolodex").run(["$templateCache", function($templateCache) {$templateCache.put("components/alert/alert.html","<div ng-class=\"[\'alert-banner-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]\" role=\"alert\"><button aria-hidden=\"true\" class=\"i-close\" ng-click=\"close()\" ng-show=\"closeable\" type=\"button\">&times;</button><div ng-transclude=\"\"></div></div>");
$templateCache.put("components/modal/window.html","<div class=\"modal\" ng-class=\"{\'modal-fade\': animate}\" ng-click=\"close($event)\" role=\"dialog\" tabindex=\"-1\"><div class=\"modal-content\" modal-transclude=\"\"></div></div>");
$templateCache.put("components/stepper/stepper.html","<input name=\"{{name}}\" type=\"number\" ng-model=\"ngModel\" min=\"{{min}}\" placeholder=\"{{min}}\"><div class=\"stepper\"><div class=\"btn-decrement\" ng-disabled=\"!canDecrement()\" ng-click=\"canDecrement() && decrement()\">&ndash;</div><div class=\"btn-increment\" ng-disabled=\"!canIncrement()\" ng-click=\"canIncrement() && increment()\">+</div></div>");}]);
(function() {
  angular.module('rolodex.alert', []).controller('AlertController', [
    '$scope', '$attrs', function($scope, $attrs) {
      return $scope.closeable = 'close' in $attrs;
    }
  ]).directive('alert', function() {
    return {
      restrict: 'EA',
      controller: 'AlertController',
      templateUrl: 'components/alert',
      transclude: true,
      replace: true,
      scope: {
        type: '@',
        close: '&'
      }
    };
  });

}).call(this);

(function() {
  angular.module('rolodex.dropdown', []).constant('dropdownConfig', {
    dropDownOpen: 'data-dropdown-open'
  }).service('dropdownService', [
    '$document', '$timeout', function($document, $timeout) {
      var closeDropdown, escapeKeyBind, openScope;
      openScope = null;
      this.open = function(dropdownScope) {
        if (!openScope) {
          $document.bind('click', closeDropdown);
          $document.bind('keydown', escapeKeyBind);
        }
        if (openScope && openScope !== dropdownScope) {
          openScope.isOpen = false;
        }
        return openScope = dropdownScope;
      };
      this.close = function(dropdownScope) {
        if (openScope === dropdownScope || dropdownScope.forceClose) {
          if (dropdownScope.forceClose) {
            if (openScope) {
              openScope.isOpen = false;
            }
            $timeout(function() {
              return dropdownScope.isOpen = false;
            });
          }
          openScope = null;
          $document.unbind('click', closeDropdown);
          return $document.unbind('keydown', escapeKeyBind);
        }
      };
      closeDropdown = function(evt) {
        var toggleElement;
        toggleElement = openScope.getToggleElement();
        if (evt && (toggleElement != null ? toggleElement[0].contains(evt.target) : void 0) || (evt != null ? evt.target.nodeName.toLowerCase() : void 0) === 'input') {
          return;
        }
        return openScope.$apply(function() {
          return openScope.isOpen = false;
        });
      };
      escapeKeyBind = function(evt) {
        if (evt.which === 27) {
          openScope.focusToggleElement();
          return closeDropdown();
        }
      };
      return this;
    }
  ]).controller('DropdownController', [
    '$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
      var dropDownOpen, getIsOpen, scope, self, setIsOpen, toggleInvoker;
      self = this;
      scope = $scope.$new();
      dropDownOpen = dropdownConfig.dropDownOpen;
      getIsOpen = void 0;
      setIsOpen = angular.noop;
      toggleInvoker = ($attrs.onToggle ? $parse($attrs.onToggle) : angular.noop);
      this.init = function(element) {
        self.$element = element;
        if ($attrs.isOpen) {
          getIsOpen = $parse($attrs.isOpen);
          setIsOpen = getIsOpen.assign;
          return $scope.$watch(getIsOpen, function(value) {
            return scope.isOpen = !!value;
          });
        }
      };
      this.toggle = function(open) {
        return scope.isOpen = (arguments.length ? !!open : !scope.isOpen);
      };
      this.isOpen = function() {
        return scope.isOpen;
      };
      scope.getToggleElement = function() {
        return self.toggleElement;
      };
      scope.focusToggleElement = function() {
        if (self.toggleElement) {
          self.toggleElement[0].focus();
        }
      };
      scope.$watch('isOpen', function(isOpen, wasOpen) {
        var anchors;
        anchors = self.$element.find('a');
        if (isOpen) {
          self.$element.attr(dropDownOpen, '');
          scope.focusToggleElement();
          dropdownService.open(scope);
          if (anchors.length) {
            scope.forceClose = true;
            _.each(anchors, function(anchor) {
              return angular.element(anchor).on('click', function(evt) {
                dropdownService.close(scope);
                return scope.$digest();
              });
            });
          }
        } else {
          self.$element.removeAttr(dropDownOpen);
          dropdownService.close(scope);
        }
        setIsOpen($scope, isOpen);
        if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
          return toggleInvoker($scope, {
            open: !!isOpen
          });
        }
      });
      $scope.$on('$locationChangeSuccess', function() {
        return scope.isOpen = false;
      });
      $scope.$on('$destroy', function() {
        return scope.$destroy();
      });
      return this;
    }
  ]).directive('dropdown', function() {
    return {
      controller: 'DropdownController',
      link: function(scope, element, attrs, dropdownCtrl) {
        return dropdownCtrl.init(element);
      }
    };
  }).directive('dropdownToggle', function() {
    return {
      require: '?^dropdown',
      link: function(scope, element, attrs, dropdownCtrl) {
        var toggleDropdown;
        if (!dropdownCtrl) {
          return;
        }
        dropdownCtrl.toggleElement = element;
        toggleDropdown = function(event) {
          event.preventDefault();
          if (!element.hasClass('disabled') && !attrs.disabled) {
            return scope.$apply(function() {
              return dropdownCtrl.toggle();
            });
          }
        };
        element.bind('click', toggleDropdown);
        element.attr({
          'aria-haspopup': true,
          'aria-expanded': false
        });
        scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
          return element.attr('aria-expanded', !!isOpen);
        });
        return scope.$on('$destroy', function() {
          return element.unbind('click', toggleDropdown);
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('rolodex.stepper', []).directive('blyStepper', function() {
    return {
      restrict: 'AE',
      require: 'ngModel',
      scope: {
        min: '@',
        max: '@',
        step: '@',
        name: '@',
        ngModel: '=',
        ngDisabled: '='
      },
      templateUrl: 'components/stepper/stepper',
      link: function(scope, elem, attrs, ngModelCtrl) {
        var updateViewValue;
        if (!scope.step) {
          scope.step = 1;
        }
        if (scope.min) {
          scope.min = _.parseInt(scope.min);
        }
        if (scope.max) {
          scope.max = _.parseInt(scope.max);
        }
        ngModelCtrl.$formatters.push(function(value) {
          return _.parseInt(value);
        });
        ngModelCtrl.$parsers.push(function(value) {
          return _.parseInt(value);
        });
        updateViewValue = function(value) {
          ngModelCtrl.$setViewValue(_.parseInt(value));
          ngModelCtrl.$render();
          return scope.$emit('stepper:update', value);
        };
        scope.canDecrement = function() {
          if (!scope.min) {
            return true;
          }
          return angular.isDefined(scope.min) && ngModelCtrl.$viewValue >= scope.min && (ngModelCtrl.$viewValue + -scope.step) >= scope.min;
        };
        scope.canIncrement = function() {
          if (!scope.max) {
            return true;
          }
          angular.isDefined(scope.max) && ngModelCtrl.$viewValue <= scope.max;
          return (ngModelCtrl.$viewValue + +scope.step) <= scope.max;
        };
        scope.increment = function() {
          var value;
          value = ngModelCtrl.$viewValue + +scope.step;
          updateViewValue(value);
          return scope.$emit('stepper:increment', value);
        };
        scope.decrement = function() {
          var value;
          value = ngModelCtrl.$viewValue + -scope.step;
          updateViewValue(value);
          return scope.$emit('stepper:decrement', value);
        };
        return elem.find('input').bind('blur', function() {
          if (isNaN(ngModelCtrl.$viewValue)) {
            updateViewValue(scope.min);
          }
          return scope.$apply(function() {
            return scope.ngModel = _.parseInt(ngModelCtrl.$modelValue);
          });
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("rolodex.transition", []).factory("$transition", [
    "$q", "$timeout", "$rootScope", function($q, $timeout, $rootScope) {
      var $transition, animationEndEventNames, findEndEventName, transElement, transitionEndEventNames;
      findEndEventName = function(endEventNames) {
        var name;
        for (name in endEventNames) {
          if (transElement.style[name] !== undefined) {
            return endEventNames[name];
          }
        }
      };
      $transition = function(element, trigger, options) {
        var deferred, endEventName, transitionEndHandler;
        options = options || {};
        deferred = $q.defer();
        endEventName = $transition[(options.animation ? "animationEndEventName" : "transitionEndEventName")];
        transitionEndHandler = function(event) {
          $rootScope.$apply(function() {
            element.unbind(endEventName, transitionEndHandler);
            deferred.resolve(element);
          });
        };
        if (endEventName) {
          element.bind(endEventName, transitionEndHandler);
        }
        $timeout(function() {
          if (angular.isString(trigger)) {
            element.addClass(trigger);
          } else if (angular.isFunction(trigger)) {
            trigger(element);
          } else {
            if (angular.isObject(trigger)) {
              element.css(trigger);
            }
          }
          if (!endEventName) {
            deferred.resolve(element);
          }
        });
        deferred.promise.cancel = function() {
          if (endEventName) {
            element.unbind(endEventName, transitionEndHandler);
          }
          deferred.reject("Transition cancelled");
        };
        return deferred.promise;
      };
      transElement = document.createElement("trans");
      transitionEndEventNames = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        transition: "transitionend"
      };
      animationEndEventNames = {
        WebkitTransition: "webkitAnimationEnd",
        MozTransition: "animationend",
        OTransition: "oAnimationEnd",
        transition: "animationend"
      };
      $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
      $transition.animationEndEventName = findEndEventName(animationEndEventNames);
      return $transition;
    }
  ]);

  angular.module("rolodex.modal", ["rolodex.transition", "templates"]).factory("$$stackedMap", function() {
    return {
      createNew: function() {
        var stack;
        stack = [];
        return {
          add: function(key, value) {
            return stack.push({
              key: key,
              value: value
            });
          },
          get: function(key) {
            var i;
            i = 0;
            while (i < stack.length) {
              if (key === stack[i].key) {
                return stack[i];
              }
              i++;
            }
          },
          keys: function() {
            var i, keys;
            keys = [];
            i = 0;
            while (i < stack.length) {
              keys.push(stack[i].key);
              i++;
            }
            return keys;
          },
          top: function() {
            return stack[stack.length - 1];
          },
          remove: function(key) {
            var i, idx;
            idx = -1;
            i = 0;
            while (i < stack.length) {
              if (key === stack[i].key) {
                idx = i;
                break;
              }
              i++;
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function() {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function() {
            return stack.length;
          }
        };
      }
    };
  }).directive("modalWindow", [
    "$modalStack", "$timeout", function($modalStack, $timeout) {
      return {
        restrict: "EA",
        scope: {
          index: "@",
          animate: "="
        },
        replace: true,
        transclude: true,
        templateUrl: function(tElement, tAttrs) {
          return tAttrs.templateUrl || "components/modal/window";
        },
        link: function(scope, element, attrs) {
          element.addClass(attrs.windowClass || "");
          scope.size = attrs.size;
          $timeout(function() {
            scope.animate = true;
            if (!element[0].querySelectorAll("[autofocus]").length) {
              element[0].focus();
            }
          });
          return scope.close = function(evt) {
            var modal;
            modal = $modalStack.getTop();
            if (modal && modal.value.backdrop && modal.value.backdrop !== "static" && (evt.target === evt.currentTarget)) {
              evt.preventDefault();
              evt.stopPropagation();
              return $modalStack.dismiss(modal.key, "backdrop click");
            }
          };
        }
      };
    }
  ]).directive("modalTransclude", function() {
    return {
      link: function($scope, $element, $attrs, controller, $transclude) {
        return $transclude($scope.$parent, function(clone) {
          $element.empty();
          return $element.append(clone);
        });
      }
    };
  }).factory("$modalStack", [
    "$transition", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {
      var $modalStack, OPENED_MODAL_CLASS, backdropDomEl, backdropIndex, backdropScope, checkRemoveBackdrop, openedWindows, removeAfterAnimate, removeModalWindow;
      backdropIndex = function() {
        var i, opened, topBackdropIndex;
        topBackdropIndex = -1;
        opened = openedWindows.keys();
        i = 0;
        while (i < opened.length) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
          i++;
        }
        return topBackdropIndex;
      };
      removeModalWindow = function(modalInstance) {
        var body, modalWindow;
        body = $document.find("body").eq(0);
        modalWindow = openedWindows.get(modalInstance).value;
        openedWindows.remove(modalInstance);
        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
          modalWindow.modalScope.$destroy();
          body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
          checkRemoveBackdrop();
        });
      };
      checkRemoveBackdrop = function() {
        var backdropDomEl, backdropScope, backdropScopeRef;
        if (backdropDomEl && backdropIndex() === -1) {
          backdropScopeRef = backdropScope;
          removeAfterAnimate(backdropDomEl, backdropScope, 150, function() {
            backdropScopeRef.$destroy();
            backdropScopeRef = null;
          });
          backdropDomEl = undefined;
          backdropScope = undefined;
        }
      };
      removeAfterAnimate = function(domEl, scope, emulateTime, done) {
        var afterAnimating, timeout, transitionEndEventName;
        afterAnimating = function() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;
          domEl.remove();
          if (done) {
            done();
          }
        };
        scope.animate = false;
        transitionEndEventName = $transition.transitionEndEventName;
        if (transitionEndEventName) {
          timeout = $timeout(afterAnimating, emulateTime);
          domEl.bind(transitionEndEventName, function() {
            $timeout.cancel(timeout);
            afterAnimating();
            scope.$apply();
          });
        } else {
          $timeout(afterAnimating);
        }
      };
      OPENED_MODAL_CLASS = "modal-open";
      backdropDomEl = void 0;
      backdropScope = void 0;
      openedWindows = $$stackedMap.createNew();
      $modalStack = {};
      $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });
      $document.bind("keydown", function(evt) {
        var modal;
        modal = void 0;
        if (evt.which === 27) {
          modal = openedWindows.top();
          if (modal && modal.value.keyboard) {
            evt.preventDefault();
            $rootScope.$apply(function() {
              $modalStack.dismiss(modal.key, "escape key press");
            });
          }
        }
      });
      $modalStack.open = function(modalInstance, modal) {
        var angularBackgroundDomEl, angularDomEl, body, currBackdropIndex, modalDomEl;
        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard
        });
        body = $document.find("body").eq(0);
        currBackdropIndex = backdropIndex();
        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.index = currBackdropIndex;
          angularBackgroundDomEl = angular.element("<div modal-backdrop></div>");
          angularBackgroundDomEl.attr("backdrop-class", modal.backdropClass);
          backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
          body.append(backdropDomEl);
        }
        angularDomEl = angular.element("<div modal-window></div>");
        angularDomEl.attr({
          "template-url": modal.windowTemplateUrl,
          "window-class": modal.windowClass,
          size: modal.size,
          index: openedWindows.length() - 1,
          animate: "animate"
        }).html(modal.content);
        modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        body.append(modalDomEl);
        body.addClass(OPENED_MODAL_CLASS);
      };
      $modalStack.close = function(modalInstance, result) {
        var modalWindow;
        modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.deferred.resolve(result);
          removeModalWindow(modalInstance);
        }
      };
      $modalStack.dismiss = function(modalInstance, reason) {
        var modalWindow;
        modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.deferred.reject(reason);
          removeModalWindow(modalInstance);
        }
      };
      $modalStack.dismissAll = function(reason) {
        var topModal;
        topModal = this.getTop();
        while (topModal) {
          this.dismiss(topModal.key, reason);
          topModal = this.getTop();
        }
      };
      $modalStack.getTop = function() {
        return openedWindows.top();
      };
      return $modalStack;
    }
  ]).provider("$modal", function() {
    var $modalProvider;
    $modalProvider = {
      options: {
        backdrop: true,
        keyboard: true
      },
      $get: [
        "$injector", "$rootScope", "$q", "$http", "$templateCache", "$controller", "$modalStack", function($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {
          var $modal, getResolvePromises, getTemplatePromise;
          getTemplatePromise = function(options) {
            if (options.template) {
              return $q.when(options.template);
            } else {
              return $http.get((angular.isFunction(options.templateUrl) ? options.templateUrl() : options.templateUrl), {
                cache: $templateCache
              }).then(function(result) {
                return result.data;
              });
            }
          };
          getResolvePromises = function(resolves) {
            var promisesArr;
            promisesArr = [];
            angular.forEach(resolves, function(value) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          };
          $modal = {};
          $modal.open = function(modalOptions) {
            var modalInstance, modalOpenedDeferred, modalResultDeferred, resolveError, resolveSuccess, templateAndResolvePromise;
            modalResultDeferred = $q.defer();
            modalOpenedDeferred = $q.defer();
            modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function(result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function(reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error("One of template or templateUrl options is required.");
            }
            templateAndResolvePromise = $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));
            templateAndResolvePromise.then((resolveSuccess = function(tplAndVars) {
              var ctrlInstance, ctrlLocals, modalScope, resolveIter;
              modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;
              ctrlInstance = void 0;
              ctrlLocals = {};
              resolveIter = 1;
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function(value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });
                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                if (modalOptions.controller) {
                  modalScope[modalOptions.controllerAs] = ctrlInstance;
                }
              }
              return $modalStack.open(modalInstance, {
                scope: modalScope,
                deferred: modalResultDeferred,
                content: tplAndVars[0],
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                backdropClass: modalOptions.backdropClass,
                windowClass: modalOptions.windowClass,
                windowTemplateUrl: modalOptions.windowTemplateUrl,
                size: modalOptions.size
              });
            }), resolveError = function(reason) {
              return modalResultDeferred.reject(reason);
            });
            templateAndResolvePromise.then((function() {
              return modalOpenedDeferred.resolve(true);
            }), function() {
              return modalOpenedDeferred.reject(false);
            });
            return modalInstance;
          };
          return $modal;
        }
      ]
    };
    return $modalProvider;
  });

}).call(this);
