(function() {
  angular.module('rolodex', ['templates', 'rolodex.accordion', 'rolodex.alert', 'rolodex.buttons', 'rolodex.datepicker', 'rolodex.dropdown', 'rolodex.modal', 'rolodex.transition']);

}).call(this);

angular.module("rolodex").run(["$templateCache", function($templateCache) {$templateCache.put("rolodex_angular/template/accordion/accordion-group","<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a accordion-transclude=\"heading\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\"><span ng-class=\"{\'text-muted\': isDisabled}\">{{heading}}</span></a></h4></div><div class=\"panel-collapse\" collapse=\"!isOpen\"><div class=\"panel-body\" ng-transclude=\"\"></div></div></div>");
$templateCache.put("rolodex_angular/template/accordion/accordion","<div class=\"panel-group\" ng-transclude=\"\"></div>");
$templateCache.put("rolodex_angular/template/alert/alert","<div ng-class=\"[\'alert-banner-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]\" role=\"alert\"><button aria-hidden=\"true\" class=\"i-close\" ng-click=\"close()\" ng-show=\"closeable\" type=\"button\">&times;</button><div ng-transclude=\"\"></div></div>");
$templateCache.put("rolodex_angular/template/datepicker/datepicker","<div ng-keydown=\"keydown($event)\" ng-switch=\"datepickerMode\" role=\"application\"><daypicker ng-switch-when=\"day\" tabindex=\"0\"></daypicker><monthpicker ng-switch-when=\"month\" tabindex=\"0\"></monthpicker><yearpicker ng-switch-when=\"year\" tabindex=\"0\"></yearpicker></div>");
$templateCache.put("rolodex_angular/template/datepicker/day","<table aria-activedescendant=\"{{ activeDateId }}\" aria-labelledby=\"{{uniqueId }}-title\" role=\"grid\"><thead><tr><th class=\"prev available\" ng-click=\"move(-1)\" tabindex=\"-1\"><div class=\"i-caret\"></div></th><th class=\"month\" colspan=\"{{ 5 + showWeeks }}\">{{ title }}</th><th class=\"next available\" ng-click=\"move(1)\" tabindex=\"-1\"><div class=\"i-caret\"></div></th></tr><tr><th class=\"text-center\" ng-repeat=\"label in labels track by $index\"><small aria-label=\"{{ label.full}}\">{{ label.abbr }}</small></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td aria-disabled=\"{{ !!dt.disabled }}\" id=\"{{ dt.uid }}\" ng-class=\"{active: dt.selected, available: !dt.disabled, off: dt.disabled}\" ng-click=\"select(dt.date, dt.disabled)\" ng-disabled=\"dt.disabled\" ng-repeat=\"dt in row track by dt.date\" role=\"gridcell\" tabindex=\"-1\"><span ng-class=\"{\'text-muted\': dt.secondary}\">{{ dt.label }}</span></td></tr></tbody></table>");
$templateCache.put("rolodex_angular/template/datepicker/month","<table aria-activedescendant=\"{{ activeDateId }}\" aria-labelledby=\"{{ uniqueId }}-title\" role=\"grid\"><thead><tr><th><button class=\"btn btn-boring pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\" type=\"button\"><i class=\"i-caret\"></i></button></th><th><button aria-atomic=\"true\" aria-live=\"assertive\" class=\"btn btn-boring\" id=\"{{ uniqueId }}-title\" ng-click=\"toggleMode()\" role=\"heading\" style=\"width:100%;\" tabindex=\"-1\" type=\"button\"><strong>{{ title }}</strong></button></th><th><button class=\"btn btn-boring pull-right\" ng-click=\"move(1)\" tabindex=\"-1\" type=\"button\"><i class=\"i-caret\"></i></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td aria-disabled=\"{{ !!dt.disabled }}\" class=\"text-center\" id=\"{{ dt.uid }}\" ng-repeat=\"dt in row track by dt.date\" role=\"gridcell\"><button class=\"btn btn-boring\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" style=\"width:100%;\" tabindex=\"-1\" type=\"button\"><span ng-class=\"{\'text-info\': dt.current}\">{{ dt.label }}</span></button></td></tr></tbody></table>");
$templateCache.put("rolodex_angular/template/datepicker/popup","<div class=\"date-picker-solo daterangepicker dropdown-menu group\" data-dropdown-content=\"\" ng-keydown=\"keydown($event)\"><div ng-transclude=\"\"></div></div>");
$templateCache.put("rolodex_angular/template/datepicker/year","<table aria-activedescendant=\"{{ activeDateId }}\" aria-labelledby=\"{{ uniqueId }}-title\" role=\"grid\"><thead><tr><th><button class=\"btn btn-boring pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\" type=\"button\"><i class=\"i-caret\"></i></button></th><th colspan=\"3\"><button aria-atomic=\"true\" aria-live=\"assertive\" class=\"btn btn-boring\" id=\"{{ uniqueId }}-title\" ng-click=\"toggleMode()\" role=\"heading\" style=\"width:100%;\" tabindex=\"-1\" type=\"button\"><strong>{{ title }}</strong></button></th><th><button class=\"btn btn-boring pull-right\" ng-click=\"move(1)\" tabindex=\"-1\" type=\"button\"><i class=\"i-caret\"></i></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td aria-disabled=\"{{ !!dt.disabled }}\" class=\"text-center\" id=\"{{ dt.uid }}\" ng-repeat=\"dt in row track by dt.date\" role=\"gridcell\"><button class=\"btn btn-boring\" ng-class=\"{\'btn-info\': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" style=\"width:100%;\" tabindex=\"-1\" type=\"button\"><span ng-class=\"{\'text-info\': dt.current}\">{{ dt.label }}</span></button></td></tr></tbody></table>");
$templateCache.put("rolodex_angular/template/modal/window","<div class=\"modal\" ng-class=\"{\'modal-fade\': animate}\" ng-click=\"close($event)\" role=\"dialog\" tabindex=\"-1\"><div class=\"modal-content\" modal-transclude=\"\"></div></div>");}]);
(function() { angular.module('templates', []); }).call(this);
(function() {
  angular.module("rolodex.accordion", ["rolodex.collapse"]).constant("accordionConfig", {
    closeOthers: true
  }).controller("AccordionController", [
    "$scope", "$attrs", "accordionConfig", function($scope, $attrs, accordionConfig) {
      this.groups = [];
      this.closeOthers = function(openGroup) {
        var closeOthers;
        closeOthers = (angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers);
        if (closeOthers) {
          return angular.forEach(this.groups, function(group) {
            if (group !== openGroup) {
              return group.isOpen = false;
            }
          });
        }
      };
      this.addGroup = function(groupScope) {
        var that;
        that = this;
        this.groups.push(groupScope);
        return groupScope.$on("$destroy", function(event) {
          return that.removeGroup(groupScope);
        });
      };
      this.removeGroup = function(group) {
        var index;
        index = this.groups.indexOf(group);
        if (index !== -1) {
          return this.groups.splice(index, 1);
        }
      };
      return this;
    }
  ]).directive("accordion", function() {
    return {
      restrict: "EA",
      controller: "AccordionController",
      transclude: true,
      replace: false,
      templateUrl: 'rolodex_angular/template/accordion/accordion'
    };
  }).directive("accordionGroup", function() {
    return {
      require: "^accordion",
      restrict: "EA",
      transclude: true,
      replace: true,
      templateUrl: 'rolodex_angular/template/accordion/accordion-group',
      scope: {
        heading: "@",
        isOpen: "=?",
        isDisabled: "=?"
      },
      controller: function() {
        return this.setHeading = function(element) {
          return this.heading = element;
        };
      },
      link: function(scope, element, attrs, accordionCtrl) {
        accordionCtrl.addGroup(scope);
        scope.$watch("isOpen", function(value) {
          if (value) {
            accordionCtrl.closeOthers(scope);
          }
        });
        return scope.toggleOpen = function() {
          if (!scope.isDisabled) {
            return scope.isOpen = !scope.isOpen;
          }
        };
      }
    };
  }).directive("accordionHeading", function() {
    return {
      restrict: "EA",
      transclude: true,
      template: "",
      replace: true,
      require: "^accordionGroup",
      link: function(scope, element, attr, accordionGroupCtrl, transclude) {
        return accordionGroupCtrl.setHeading(transclude(scope, (function() {})));
      }
    };
  }).directive("accordionTransclude", function() {
    return {
      require: "^accordionGroup",
      link: function(scope, element, attr, controller) {
        return scope.$watch((function() {
          return controller[attr.accordionTransclude];
        }), function(heading) {
          if (heading) {
            element.html("");
            return element.append(heading);
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('rolodex.alert', []).controller('AlertController', [
    '$scope', '$attrs', function($scope, $attrs) {
      return $scope.closeable = 'close' in $attrs;
    }
  ]).directive('alert', function() {
    return {
      restrict: 'EA',
      controller: 'AlertController',
      templateUrl: 'rolodex_angular/template/alert/alert',
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
  angular.module("rolodex.buttons", []).constant("buttonConfig", {
    activeClass: "active",
    toggleEvent: "click"
  }).controller("ButtonsController", [
    "buttonConfig", function(buttonConfig) {
      this.activeClass = buttonConfig.activeClass || "active";
      this.toggleEvent = buttonConfig.toggleEvent || "click";
      return this;
    }
  ]).directive("btnRadio", function() {
    return {
      require: ["btnRadio", "ngModel"],
      controller: "ButtonsController",
      link: function(scope, element, attrs, ctrls) {
        var buttonsCtrl, ngModelCtrl;
        buttonsCtrl = ctrls[0];
        ngModelCtrl = ctrls[1];
        ngModelCtrl.$render = function() {
          return element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
        };
        return element.bind(buttonsCtrl.toggleEvent, function() {
          var isActive;
          isActive = element.hasClass(buttonsCtrl.activeClass);
          if (!isActive || angular.isDefined(attrs.uncheckable)) {
            return scope.$apply(function() {
              ngModelCtrl.$setViewValue((isActive ? null : scope.$eval(attrs.btnRadio)));
              return ngModelCtrl.$render();
            });
          }
        });
      }
    };
  }).directive("btnCheckbox", function() {
    return {
      require: ["btnCheckbox", "ngModel"],
      controller: "ButtonsController",
      link: function(scope, element, attrs, ctrls) {
        var buttonsCtrl, getCheckboxValue, getFalseValue, getTrueValue, ngModelCtrl;
        getTrueValue = function() {
          return getCheckboxValue(attrs.btnCheckboxTrue, true);
        };
        getFalseValue = function() {
          return getCheckboxValue(attrs.btnCheckboxFalse, false);
        };
        getCheckboxValue = function(attributeValue, defaultValue) {
          var val;
          val = scope.$eval(attributeValue);
          if (angular.isDefined(val)) {
            return val;
          } else {
            return defaultValue;
          }
        };
        buttonsCtrl = ctrls[0];
        ngModelCtrl = ctrls[1];
        ngModelCtrl.$render = function() {
          return element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
        };
        return element.bind(buttonsCtrl.toggleEvent, function() {
          return scope.$apply(function() {
            ngModelCtrl.$setViewValue((element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue()));
            return ngModelCtrl.$render();
          });
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("rolodex.collapse", ["rolodex.transition"]).directive("collapse", [
    "$transition", function($transition) {
      return {
        link: function(scope, element, attrs) {
          var collapse, collapseDone, currentTransition, doTransition, expand, expandDone, initialAnimSkip;
          doTransition = function(change) {
            var currentTransition, newTransition, newTransitionDone;
            newTransitionDone = function() {
              var currentTransition;
              if (currentTransition === newTransition) {
                return currentTransition = undefined;
              }
            };
            newTransition = $transition(element, change);
            if (currentTransition) {
              currentTransition.cancel();
            }
            currentTransition = newTransition;
            newTransition.then(newTransitionDone, newTransitionDone);
            return newTransition;
          };
          expand = function() {
            var initialAnimSkip;
            if (initialAnimSkip) {
              initialAnimSkip = false;
              expandDone();
            } else {
              element.removeClass("collapse").addClass("collapsing");
              doTransition({
                height: element[0].scrollHeight + "px"
              }).then(expandDone);
            }
          };
          expandDone = function() {
            element.removeClass("collapsing");
            element.addClass("collapse in");
            element.css({
              height: "auto"
            });
          };
          collapse = function() {
            var initialAnimSkip, x;
            if (initialAnimSkip) {
              initialAnimSkip = false;
              collapseDone();
              element.css({
                height: 0
              });
            } else {
              element.css({
                height: element[0].scrollHeight + "px"
              });
              x = element[0].offsetWidth;
              element.removeClass("collapse in").addClass("collapsing");
              doTransition({
                height: 0
              }).then(collapseDone);
            }
          };
          collapseDone = function() {
            element.removeClass("collapsing");
            element.addClass("collapse");
          };
          initialAnimSkip = true;
          currentTransition = void 0;
          scope.$watch(attrs.collapse, function(shouldCollapse) {
            if (shouldCollapse) {
              collapse();
            } else {
              expand();
            }
          });
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('rolodex.dateparser', []).service("dateParser", [
    "$locale", "orderByFilter", function($locale, orderByFilter) {
      var createParser, formatCodeToRegex, isValid;
      createParser = function(format) {
        var map, regex;
        map = [];
        regex = format.split("");
        angular.forEach(formatCodeToRegex, function(data, code) {
          var i, index, n;
          index = format.indexOf(code);
          if (index > -1) {
            format = format.split("");
            regex[index] = "(" + data.regex + ")";
            format[index] = "$";
            i = index + 1;
            n = index + code.length;
            while (i < n) {
              regex[i] = "";
              format[i] = "$";
              i++;
            }
            format = format.join("");
            map.push({
              index: index,
              apply: data.apply
            });
          }
        });
        return {
          regex: new RegExp("^" + regex.join("") + "$"),
          map: orderByFilter(map, "index")
        };
      };
      isValid = function(year, month, date) {
        if (month === 1 && date > 28) {
          return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
        }
        if (month === 3 || month === 5 || month === 8 || month === 10) {
          return date < 31;
        }
        return true;
      };
      this.parsers = {};
      formatCodeToRegex = {
        yyyy: {
          regex: "\\d{4}",
          apply: function(value) {
            this.year = +value;
          }
        },
        yy: {
          regex: "\\d{2}",
          apply: function(value) {
            this.year = +value + 2000;
          }
        },
        y: {
          regex: "\\d{1,4}",
          apply: function(value) {
            this.year = +value;
          }
        },
        MMMM: {
          regex: $locale.DATETIME_FORMATS.MONTH.join("|"),
          apply: function(value) {
            this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value);
          }
        },
        MMM: {
          regex: $locale.DATETIME_FORMATS.SHORTMONTH.join("|"),
          apply: function(value) {
            this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value);
          }
        },
        MM: {
          regex: "0[1-9]|1[0-2]",
          apply: function(value) {
            this.month = value - 1;
          }
        },
        M: {
          regex: "[1-9]|1[0-2]",
          apply: function(value) {
            this.month = value - 1;
          }
        },
        dd: {
          regex: "[0-2][0-9]{1}|3[0-1]{1}",
          apply: function(value) {
            this.date = +value;
          }
        },
        d: {
          regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
          apply: function(value) {
            return this.date = +value;
          }
        },
        EEEE: {
          regex: $locale.DATETIME_FORMATS.DAY.join("|")
        },
        EEE: {
          regex: $locale.DATETIME_FORMATS.SHORTDAY.join("|")
        }
      };
      return this.parse = function(input, format) {
        var dt, fields, i, map, mapper, n, parser, regex, results;
        if (!angular.isString(input) || !format) {
          return input;
        }
        format = $locale.DATETIME_FORMATS[format] || format;
        if (!this.parsers[format]) {
          this.parsers[format] = createParser(format);
        }
        parser = this.parsers[format];
        regex = parser.regex;
        map = parser.map;
        results = input.match(regex);
        if (results && results.length) {
          fields = {
            year: 1900,
            month: 0,
            date: 1,
            hours: 0
          };
          dt = void 0;
          i = 1;
          n = results.length;
          while (i < n) {
            mapper = map[i - 1];
            if (mapper.apply) {
              mapper.apply.call(fields, results[i]);
            }
            i++;
          }
          if (isValid(fields.year, fields.month, fields.date)) {
            dt = new Date(fields.year, fields.month, fields.date, fields.hours);
          }
          return dt;
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('rolodex.datepicker', ['rolodex.dateparser', 'rolodex.dropdown', 'rolodex.position']).constant('datepickerConfig', {
    formatDay: 'd',
    formatMonth: 'MMMM',
    formatYear: 'yyyy',
    formatDayHeader: 'EEE',
    formatDayTitle: 'MMMM yyyy',
    formatMonthTitle: 'yyyy',
    datepickerMode: 'day',
    minMode: 'day',
    maxMode: 'year',
    showWeeks: true,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null
  }).controller('DatepickerController', [
    '$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datepickerConfig', function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
      var focusElement, ngModelCtrl, self;
      self = this;
      ngModelCtrl = {
        $setViewValue: angular.noop
      };
      this.modes = ['day', 'month', 'year'];
      angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle', 'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange'], function(key, index) {
        self[key] = (angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key]);
      });
      angular.forEach(['minDate', 'maxDate'], function(key) {
        if ($attrs[key]) {
          return $scope.$parent.$watch($parse($attrs[key]), function(value) {
            self[key] = (value ? new Date(value) : null);
            return self.refreshView();
          });
        } else {
          return self[key] = (datepickerConfig[key] ? new Date(datepickerConfig[key]) : null);
        }
      });
      $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
      $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);
      this.activeDate = (angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date());
      this.init = function(ngModelCtrl_) {
        ngModelCtrl = ngModelCtrl_;
        return ngModelCtrl.$render = function() {
          return self.render();
        };
      };
      this.render = function() {
        var date, isValid;
        if (ngModelCtrl.$modelValue) {
          date = new Date(ngModelCtrl.$modelValue);
          isValid = !isNaN(date);
          if (isValid) {
            this.activeDate = date;
          } else {
            $log.error('Datepicker directive: \'ng-model\' value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
          }
          ngModelCtrl.$setValidity('date', isValid);
        }
        return this.refreshView();
      };
      this.refreshView = function() {
        var date;
        if (this.element) {
          this._refreshView();
          date = (ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null);
          return ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
        }
      };
      this.createDateObject = function(date, format) {
        var model;
        model = (ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null);
        return {
          date: date,
          label: dateFilter(date, format),
          selected: model && this.compare(date, model) === 0,
          disabled: this.isDisabled(date),
          current: this.compare(date, new Date()) === 0
        };
      };
      this.isDisabled = function(date) {
        return (this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({
          date: date,
          mode: $scope.datepickerMode
        }));
      };
      this.split = function(arr, size) {
        var arrays;
        arrays = [];
        while (arr.length > 0) {
          arrays.push(arr.splice(0, size));
        }
        return arrays;
      };
      $scope.select = (function(_this) {
        return function(date) {
          var dt;
          if (_this.isDisabled(date)) {
            return;
          }
          if ($scope.datepickerMode === self.minMode) {
            dt = (ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0));
            dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            ngModelCtrl.$setViewValue(dt);
            return ngModelCtrl.$render();
          } else {
            self.activeDate = date;
            return $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
          }
        };
      })(this);
      $scope.move = function(direction) {
        var month, year;
        year = self.activeDate.getFullYear() + direction * (self.step.years || 0);
        month = self.activeDate.getMonth() + direction * (self.step.months || 0);
        self.activeDate.setFullYear(year, month, 1);
        return self.refreshView();
      };
      $scope.toggleMode = function(direction) {
        direction = direction || 1;
        if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
          return;
        }
        return $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
      };
      $scope.keys = {
        13: 'enter',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };
      focusElement = function() {
        return $timeout((function() {
          return self.element[0].focus();
        }), 0, false);
      };
      $scope.$on('datepicker.focus', focusElement);
      $scope.keydown = function(evt) {
        var key;
        key = $scope.keys[evt.which];
        if (!key || evt.shiftKey || evt.altKey) {
          return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        if (key === 'enter' || key === 'space') {
          if (self.isDisabled(self.activeDate)) {
            return;
          }
          $scope.select(self.activeDate);
          return focusElement();
        } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
          $scope.toggleMode((key === 'up' ? 1 : -1));
          return focusElement();
        } else {
          self.handleKeyDown(key, evt);
          return self.refreshView();
        }
      };
      return this;
    }
  ]).directive('datepicker', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'rolodex_angular/template/datepicker/datepicker',
      scope: {
        datepickerMode: '=?',
        dateDisabled: '&'
      },
      require: ['datepicker', '?^ngModel'],
      controller: 'DatepickerController',
      link: function(scope, element, attrs, ctrls) {
        var datepickerCtrl, ngModelCtrl;
        datepickerCtrl = ctrls[0];
        ngModelCtrl = ctrls[1];
        if (ngModelCtrl) {
          return datepickerCtrl.init(ngModelCtrl);
        }
      }
    };
  }).directive('daypicker', [
    'dateFilter', function(dateFilter) {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'rolodex_angular/template/datepicker/day',
        require: '^datepicker',
        link: function(scope, element, attrs, ctrl) {
          var DAYS_IN_MONTH, getDates, getDaysInMonth, getISO8601WeekNumber;
          getDaysInMonth = function(year, month) {
            if ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) {
              return 29;
            } else {
              return DAYS_IN_MONTH[month];
            }
          };
          getDates = function(startDate, n) {
            var current, dates, i;
            dates = new Array(n);
            current = new Date(startDate);
            i = 0;
            current.setHours(12);
            while (i < n) {
              dates[i++] = new Date(current);
              current.setDate(current.getDate() + 1);
            }
            return dates;
          };
          getISO8601WeekNumber = function(date) {
            var checkDate, time;
            checkDate = new Date(date);
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
            time = checkDate.getTime();
            checkDate.setMonth(0);
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
          };
          scope.showWeeks = ctrl.showWeeks;
          ctrl.step = {
            months: 1
          };
          ctrl.element = element;
          DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          ctrl._refreshView = function() {
            var days, difference, firstDate, firstDayOfMonth, i, j, month, numDisplayedFromPreviousMonth, numWeeks, results, weekNumber, year;
            year = ctrl.activeDate.getFullYear();
            month = ctrl.activeDate.getMonth();
            firstDayOfMonth = new Date(year, month, 1);
            difference = ctrl.startingDay - firstDayOfMonth.getDay();
            numDisplayedFromPreviousMonth = (difference > 0 ? 7 - difference : -difference);
            firstDate = new Date(firstDayOfMonth);
            if (numDisplayedFromPreviousMonth > 0) {
              firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
            }
            days = getDates(firstDate, 42);
            i = 0;
            while (i < 42) {
              days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
                secondary: days[i].getMonth() !== month,
                uid: scope.uniqueId + '-' + i
              });
              i++;
            }
            scope.labels = new Array(7);
            j = 0;
            while (j < 7) {
              scope.labels[j] = {
                abbr: dateFilter(days[j].date, ctrl.formatDayHeader).substr(0, 2),
                full: dateFilter(days[j].date, 'EEEE')
              };
              j++;
            }
            scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle);
            scope.rows = ctrl.split(days, 7);
            if (scope.showWeeks) {
              scope.weekNumbers = [];
              weekNumber = getISO8601WeekNumber(scope.rows[0][0].date);
              numWeeks = scope.rows.length;
              results = [];
              while (scope.weekNumbers.push(weekNumber++) < numWeeks) {
                continue;
              }
              return results;
            }
          };
          ctrl.compare = function(date1, date2) {
            return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
          };
          ctrl.handleKeyDown = function(key, evt) {
            var date, month;
            date = ctrl.activeDate.getDate();
            if (key === 'left') {
              date = date - 1;
            } else if (key === 'up') {
              date = date - 7;
            } else if (key === 'right') {
              date = date + 1;
            } else if (key === 'down') {
              date = date + 7;
            } else if (key === 'pageup' || key === 'pagedown') {
              month = ctrl.activeDate.getMonth() + (key === 'pageup' ? -1 : 1);
              ctrl.activeDate.setMonth(month, 1);
              date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);
            } else if (key === 'home') {
              date = 1;
            } else {
              if (key === 'end') {
                date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
              }
            }
            return ctrl.activeDate.setDate(date);
          };
          return ctrl.refreshView();
        }
      };
    }
  ]).directive('monthpicker', [
    'dateFilter', function(dateFilter) {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'rolodex_angular/template/datepicker/month',
        require: '^datepicker',
        link: function(scope, element, attrs, ctrl) {
          ctrl.step = {
            years: 1
          };
          ctrl.element = element;
          ctrl._refreshView = function() {
            var i, months, year;
            months = new Array(12);
            year = ctrl.activeDate.getFullYear();
            i = 0;
            while (i < 12) {
              months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
                uid: scope.uniqueId + '-' + i
              });
              i++;
            }
            scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle);
            return scope.rows = ctrl.split(months, 3);
          };
          ctrl.compare = function(date1, date2) {
            return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
          };
          ctrl.handleKeyDown = function(key, evt) {
            var date, year;
            date = ctrl.activeDate.getMonth();
            if (key === 'left') {
              date = date - 1;
            } else if (key === 'up') {
              date = date - 3;
            } else if (key === 'right') {
              date = date + 1;
            } else if (key === 'down') {
              date = date + 3;
            } else if (key === 'pageup' || key === 'pagedown') {
              year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? -1 : 1);
              ctrl.activeDate.setFullYear(year);
            } else if (key === 'home') {
              date = 0;
            } else {
              if (key === 'end') {
                date = 11;
              }
            }
            return ctrl.activeDate.setMonth(date);
          };
          return ctrl.refreshView();
        }
      };
    }
  ]).directive('yearpicker', [
    'dateFilter', function(dateFilter) {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'rolodex_angular/template/datepicker/year',
        require: '^datepicker',
        link: function(scope, element, attrs, ctrl) {
          var getStartingYear, range;
          getStartingYear = function(year) {
            return parseInt((year - 1) / range, 10) * range + 1;
          };
          range = ctrl.yearRange;
          ctrl.step = {
            years: range
          };
          ctrl.element = element;
          ctrl._refreshView = function() {
            var i, start, years;
            years = new Array(range);
            i = 0;
            start = getStartingYear(ctrl.activeDate.getFullYear());
            while (i < range) {
              years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
                uid: scope.uniqueId + '-' + i
              });
              i++;
            }
            scope.title = [years[0].label, years[range - 1].label].join(' - ');
            return scope.rows = ctrl.split(years, 5);
          };
          ctrl.compare = function(date1, date2) {
            return date1.getFullYear() - date2.getFullYear();
          };
          ctrl.handleKeyDown = function(key, evt) {
            var date;
            date = ctrl.activeDate.getFullYear();
            if (key === 'left') {
              date = date - 1;
            } else if (key === 'up') {
              date = date - 5;
            } else if (key === 'right') {
              date = date + 1;
            } else if (key === 'down') {
              date = date + 5;
            } else if (key === 'pageup' || key === 'pagedown') {
              date += (key === 'pageup' ? -1 : 1) * ctrl.step.years;
            } else if (key === 'home') {
              date = getStartingYear(ctrl.activeDate.getFullYear());
            } else {
              if (key === 'end') {
                date = getStartingYear(ctrl.activeDate.getFullYear()) + range - 1;
              }
            }
            return ctrl.activeDate.setFullYear(date);
          };
          return ctrl.refreshView();
        }
      };
    }
  ]).constant('datepickerPopupConfig', {
    datepickerPopup: 'yyyy-MM-dd',
    currentText: 'Today',
    clearText: 'Clear',
    closeText: 'Done',
    closeOnDateSelection: true,
    appendToBody: false,
    showButtonBar: true
  }).directive('datepickerPopup', [
    '$compile', '$parse', '$document', 'dateFilter', 'dateParser', 'datepickerPopupConfig', 'dropdownService', function($compile, $parse, $document, dateFilter, dateParser, datepickerPopupConfig, dropdownService) {
      return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
          isOpen: '=?',
          currentText: '@',
          clearText: '@',
          closeText: '@',
          dateDisabled: '&'
        },
        link: function(scope, element, attrs, ngModel) {
          var $popup, appendToBody, cameltoDash, closeOnDateSelection, dateFormat, datepickerEl, parseDate, popupEl;
          cameltoDash = function(string) {
            return string.replace(/([A-Z])/g, function($1) {
              return '-' + $1.toLowerCase();
            });
          };
          parseDate = function(viewValue) {
            var date;
            if (!viewValue) {
              ngModel.$setValidity('date', true);
              return null;
            } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
              ngModel.$setValidity('date', true);
              return viewValue;
            } else if (angular.isString(viewValue)) {
              date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
              if (isNaN(date)) {
                ngModel.$setValidity('date', false);
                return undefined;
              } else {
                ngModel.$setValidity('date', true);
                return date;
              }
            } else {
              ngModel.$setValidity('date', false);
              return undefined;
            }
          };
          dateFormat = void 0;
          closeOnDateSelection = (angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection);
          appendToBody = (angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody);
          scope.showButtonBar = (angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar);
          scope.getText = function(key) {
            return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
          };
          attrs.$observe('datepickerPopup', function(value) {
            dateFormat = value || datepickerPopupConfig.datepickerPopup;
            return ngModel.$render();
          });
          popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
          popupEl.attr({
            'ng-model': 'date',
            'ng-change': 'dateSelection()'
          });
          datepickerEl = angular.element(popupEl.children()[0]);
          if (attrs.datepickerOptions) {
            angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function(value, option) {
              return datepickerEl.attr(cameltoDash(option), value);
            });
          }
          scope.watchData = {};
          angular.forEach(['minDate', 'maxDate', 'datepickerMode'], function(key) {
            var getAttribute, setAttribute;
            if (attrs[key]) {
              getAttribute = $parse(attrs[key]);
              scope.$parent.$watch(getAttribute, function(value) {
                return scope.watchData[key] = value;
              });
              datepickerEl.attr(cameltoDash(key), 'watchData.' + key);
              if (key === 'datepickerMode') {
                setAttribute = getAttribute.assign;
                return scope.$watch('watchData.' + key, function(value, oldvalue) {
                  if (value !== oldvalue) {
                    return setAttribute(scope.$parent, value);
                  }
                });
              }
            }
          });
          if (attrs.dateDisabled) {
            datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
          }
          ngModel.$parsers.unshift(parseDate);
          scope.dateSelection = function(dt) {
            if (angular.isDefined(dt)) {
              scope.date = dt;
            }
            ngModel.$setViewValue(scope.date);
            ngModel.$render();
            if (closeOnDateSelection) {
              scope.isOpen = false;
              scope.forceClose = true;
              dropdownService.close(scope);
              return element[0].focus();
            }
          };
          element.bind('input change keyup', function() {
            return scope.$apply(function() {
              return scope.date = ngModel.$modelValue;
            });
          });
          ngModel.$render = function() {
            var date;
            date = (ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '');
            element.val(date);
            return scope.date = parseDate(ngModel.$modelValue);
          };
          scope.select = function(date) {
            var today;
            if (date === 'today') {
              today = new Date();
              if (angular.isDate(ngModel.$modelValue)) {
                date = new Date(ngModel.$modelValue);
                date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
              } else {
                date = new Date(today.setHours(0, 0, 0, 0));
              }
            }
            return scope.dateSelection(date);
          };
          $popup = $compile(popupEl)(scope);
          if (appendToBody) {
            $document.find('body').append($popup);
          } else {
            element.after($popup);
          }
          return scope.$on('$destroy', function() {
            return $popup.remove();
          });
        }
      };
    }
  ]).directive('datepickerPopupWrap', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'rolodex_angular/template/datepicker/popup',
      link: function(scope, element, attrs) {
        return element.bind('click', function(event) {
          event.preventDefault();
          return event.stopPropagation();
        });
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
          return tAttrs.templateUrl || "rolodex_angular/template/modal/window";
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


/**
A set of utility methods that can be use to retrieve position of DOM elements.
It is meant to be used where we need to absolute-position DOM elements in
relation to other, existing elements (this is the case for tooltips, popovers,
typeahead suggestions etc.).
 */

(function() {
  angular.module('rolodex.position', []).factory('$position', [
    '$document', '$window', function($document, $window) {
      var getStyle, isStaticPositioned, parentOffsetEl;
      getStyle = function(el, cssprop) {
        if (el.currentStyle) {
          return el.currentStyle[cssprop];
        } else {
          if ($window.getComputedStyle) {
            return $window.getComputedStyle(el)[cssprop];
          }
        }
        return el.style[cssprop];
      };

      /**
      Checks if a given element is statically positioned
      @param element - raw DOM element
       */
      isStaticPositioned = function(element) {
        return (getStyle(element, 'position') || 'static') === 'static';
      };

      /**
      returns the closest, non-statically positioned parentOffset of a given element
      @param element
       */
      parentOffsetEl = function(element) {
        var docDomEl, offsetParent;
        docDomEl = $document[0];
        offsetParent = element.offsetParent || docDomEl;
        while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docDomEl;
      };
      return {

        /**
        Provides read-only equivalent of jQuery's position function:
        http://api.jquery.com/position/
         */
        position: function(element) {
          var boundingClientRect, elBCR, offsetParentBCR, offsetParentEl;
          elBCR = this.offset(element);
          offsetParentBCR = {
            top: 0,
            left: 0
          };
          offsetParentEl = parentOffsetEl(element[0]);
          if (offsetParentEl !== $document[0]) {
            offsetParentBCR = this.offset(angular.element(offsetParentEl));
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
          }
          boundingClientRect = element[0].getBoundingClientRect();
          return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left
          };
        },

        /**
        Provides read-only equivalent of jQuery's offset function:
        http://api.jquery.com/offset/
         */
        offset: function(element) {
          var boundingClientRect;
          boundingClientRect = element[0].getBoundingClientRect();
          return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
            left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
          };
        },

        /**
        Provides coordinates for the targetEl in relation to hostEl
         */
        positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
          var hostElPos, pos0, pos1, positionStrParts, shiftHeight, shiftWidth, targetElHeight, targetElPos, targetElWidth;
          positionStrParts = positionStr.split('-');
          pos0 = positionStrParts[0];
          pos1 = positionStrParts[1] || 'center';
          hostElPos = void 0;
          targetElWidth = void 0;
          targetElHeight = void 0;
          targetElPos = void 0;
          hostElPos = (appendToBody ? this.offset(hostEl) : this.position(hostEl));
          targetElWidth = targetEl.prop('offsetWidth');
          targetElHeight = targetEl.prop('offsetHeight');
          shiftWidth = {
            center: function() {
              return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
            },
            left: function() {
              return hostElPos.left;
            },
            right: function() {
              return hostElPos.left + hostElPos.width;
            }
          };
          shiftHeight = {
            center: function() {
              return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
            },
            top: function() {
              return hostElPos.top;
            },
            bottom: function() {
              return hostElPos.top + hostElPos.height;
            }
          };
          switch (pos0) {
            case 'right':
              targetElPos = {
                top: shiftHeight[pos1](),
                left: shiftWidth[pos0]()
              };
              break;
            case 'left':
              targetElPos = {
                top: shiftHeight[pos1](),
                left: hostElPos.left - targetElWidth
              };
              break;
            case 'bottom':
              targetElPos = {
                top: shiftHeight[pos0](),
                left: shiftWidth[pos1]()
              };
              break;
            default:
              targetElPos = {
                top: hostElPos.top - targetElHeight,
                left: shiftWidth[pos1]()
              };
          }
          return targetElPos;
        }
      };
    }
  ]);

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

}).call(this);
