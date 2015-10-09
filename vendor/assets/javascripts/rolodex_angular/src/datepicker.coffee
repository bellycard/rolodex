angular.module('rolodex.datepicker', [
  'rolodex.dateparser'
  'rolodex.dropdown'
  'rolodex.position'
])

.constant 'datepickerConfig',
  formatDay: 'd'
  formatMonth: 'MMMM'
  formatYear: 'yyyy'
  formatDayHeader: 'EEE'
  formatDayTitle: 'MMMM yyyy'
  formatMonthTitle: 'yyyy'
  datepickerMode: 'day'
  minMode: 'day'
  maxMode: 'year'
  showWeeks: true
  startingDay: 0
  yearRange: 20
  minDate: null
  maxDate: null

.controller 'DatepickerController', [
  '$scope'
  '$attrs'
  '$parse'
  '$interpolate'
  '$timeout'
  '$log'
  'dateFilter'
  'datepickerConfig'
  ($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) ->
    self = this
    ngModelCtrl = $setViewValue: angular.noop
    @modes = [
      'day'
      'month'
      'year'
    ]
    angular.forEach [
      'formatDay'
      'formatMonth'
      'formatYear'
      'formatDayHeader'
      'formatDayTitle'
      'formatMonthTitle'
      'minMode'
      'maxMode'
      'showWeeks'
      'startingDay'
      'yearRange'
    ], (key, index) ->
      self[key] = (if angular.isDefined($attrs[key]) then ((if index < 8 then $interpolate($attrs[key])($scope.$parent) else $scope.$parent.$eval($attrs[key]))) else datepickerConfig[key])
      return

    angular.forEach [
      'minDate'
      'maxDate'
    ], (key) ->
      if $attrs[key]
        $scope.$parent.$watch $parse($attrs[key]), (value) ->
          self[key] = (if value then new Date(value) else null)
          self.refreshView()

      else
        self[key] = (if datepickerConfig[key] then new Date(datepickerConfig[key]) else null)

    $scope.datepickerMode = $scope.datepickerMode or datepickerConfig.datepickerMode

    $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000)

    @activeDate = (if angular.isDefined($attrs.initDate) then $scope.$parent.$eval($attrs.initDate) else new Date())

    @init = (ngModelCtrl_) ->
      ngModelCtrl = ngModelCtrl_
      ngModelCtrl.$render = ->
        self.render()

    @render = ->
      if ngModelCtrl.$modelValue
        date = new Date(ngModelCtrl.$modelValue)
        isValid = not isNaN(date)

        if isValid
          @activeDate = date
        else
          $log.error 'Datepicker directive: \'ng-model\' value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'

        ngModelCtrl.$setValidity 'date', isValid

      @refreshView()

    @refreshView = ->
      if @element
        @_refreshView()
        date = (if ngModelCtrl.$modelValue then new Date(ngModelCtrl.$modelValue) else null)
        ngModelCtrl.$setValidity 'date-disabled', not date or (@element and not @isDisabled(date))

    @createDateObject = (date, format) ->
      model = (if ngModelCtrl.$modelValue then new Date(ngModelCtrl.$modelValue) else null)
      date: date
      label: dateFilter(date, format)
      selected: model and @compare(date, model) is 0
      disabled: @isDisabled(date)
      current: @compare(date, new Date()) is 0

    @isDisabled = (date) ->
      (@minDate and @compare(date, @minDate) < 0) or (@maxDate and @compare(date, @maxDate) > 0) or ($attrs.dateDisabled and $scope.dateDisabled(date: date, mode: $scope.datepickerMode))

    @split = (arr, size) ->
      arrays = []
      arrays.push arr.splice(0, size) while arr.length > 0
      arrays

    $scope.select = (date) =>
      return if @isDisabled(date)

      if $scope.datepickerMode is self.minMode
        dt = (if ngModelCtrl.$modelValue then new Date(ngModelCtrl.$modelValue) else new Date(0, 0, 0, 0, 0, 0, 0))
        dt.setFullYear date.getFullYear(), date.getMonth(), date.getDate()
        ngModelCtrl.$setViewValue dt
        ngModelCtrl.$render()
      else
        self.activeDate = date
        $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1]

    $scope.move = (direction) ->
      year = self.activeDate.getFullYear() + direction * (self.step.years or 0)
      month = self.activeDate.getMonth() + direction * (self.step.months or 0)
      self.activeDate.setFullYear year, month, 1
      self.refreshView()

    $scope.toggleMode = (direction) ->
      direction = direction or 1
      return if ($scope.datepickerMode is self.maxMode and direction is 1) or ($scope.datepickerMode is self.minMode and direction is -1)
      $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction]

    $scope.keys =
      13: 'enter'
      32: 'space'
      33: 'pageup'
      34: 'pagedown'
      35: 'end'
      36: 'home'
      37: 'left'
      38: 'up'
      39: 'right'
      40: 'down'

    focusElement = ->
      $timeout (->
        self.element[0].focus()
      ), 0, false

    $scope.$on 'datepicker.focus', focusElement

    $scope.keydown = (evt) ->
      key = $scope.keys[evt.which]
      return if not key or evt.shiftKey or evt.altKey
      evt.preventDefault()
      evt.stopPropagation()

      if key is 'enter' or key is 'space'
        return if self.isDisabled(self.activeDate)
        $scope.select self.activeDate
        focusElement()
      else if evt.ctrlKey and (key is 'up' or key is 'down')
        $scope.toggleMode (if key is 'up' then 1 else -1)
        focusElement()
      else
        self.handleKeyDown key, evt
        self.refreshView()

    return this
]

.directive 'datepicker', ->
  restrict: 'EA'
  replace: true
  templateUrl: 'rolodex_angular/template/datepicker/datepicker'
  scope:
    datepickerMode: '=?'
    dateDisabled: '&'

  require: [
    'datepicker'
    '?^ngModel'
  ]
  controller: 'DatepickerController'
  link: (scope, element, attrs, ctrls) ->
    datepickerCtrl = ctrls[0]
    ngModelCtrl = ctrls[1]
    datepickerCtrl.init ngModelCtrl if ngModelCtrl

.directive 'daypicker', [
  'dateFilter'
  (dateFilter) ->
    return (
      restrict: 'EA'
      replace: true
      templateUrl: 'rolodex_angular/template/datepicker/day'
      require: '^datepicker'
      link: (scope, element, attrs, ctrl) ->
        getDaysInMonth = (year, month) ->
          (if ((month is 1) and (year % 4 is 0) and ((year % 100 isnt 0) or (year % 400 is 0))) then 29 else DAYS_IN_MONTH[month])
        getDates = (startDate, n) ->
          dates = new Array(n)
          current = new Date(startDate)
          i = 0
          current.setHours 12
          while i < n
            dates[i++] = new Date(current)
            current.setDate current.getDate() + 1
          dates
        getISO8601WeekNumber = (date) ->
          checkDate = new Date(date)
          checkDate.setDate checkDate.getDate() + 4 - (checkDate.getDay() or 7)
          time = checkDate.getTime()
          checkDate.setMonth 0
          checkDate.setDate 1
          Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1
        scope.showWeeks = ctrl.showWeeks
        ctrl.step = months: 1
        ctrl.element = element
        DAYS_IN_MONTH = [
          31
          28
          31
          30
          31
          30
          31
          31
          30
          31
          30
          31
        ]
        ctrl._refreshView = ->
          year = ctrl.activeDate.getFullYear()
          month = ctrl.activeDate.getMonth()
          firstDayOfMonth = new Date(year, month, 1)
          difference = ctrl.startingDay - firstDayOfMonth.getDay()
          numDisplayedFromPreviousMonth = (if (difference > 0) then 7 - difference else -difference)
          firstDate = new Date(firstDayOfMonth)
          firstDate.setDate -numDisplayedFromPreviousMonth + 1  if numDisplayedFromPreviousMonth > 0
          days = getDates(firstDate, 42)
          i = 0

          while i < 42
            days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay),
              secondary: days[i].getMonth() isnt month
              uid: scope.uniqueId + '-' + i
            )
            i++
          scope.labels = new Array(7)
          j = 0

          while j < 7
            scope.labels[j] =
              abbr: dateFilter(days[j].date, ctrl.formatDayHeader).substr(0, 2)
              full: dateFilter(days[j].date, 'EEEE')
            j++
          scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle)
          scope.rows = ctrl.split(days, 7)
          if scope.showWeeks
            scope.weekNumbers = []
            weekNumber = getISO8601WeekNumber(scope.rows[0][0].date)
            numWeeks = scope.rows.length
            continue  while scope.weekNumbers.push(weekNumber++) < numWeeks

        ctrl.compare = (date1, date2) ->
          new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())

        ctrl.handleKeyDown = (key, evt) ->
          date = ctrl.activeDate.getDate()
          if key is 'left'
            date = date - 1
          else if key is 'up'
            date = date - 7
          else if key is 'right'
            date = date + 1
          else if key is 'down'
            date = date + 7
          else if key is 'pageup' or key is 'pagedown'
            month = ctrl.activeDate.getMonth() + ((if key is 'pageup' then -1 else 1))
            ctrl.activeDate.setMonth month, 1
            date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date)
          else if key is 'home'
            date = 1
          else date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth())  if key is 'end'
          ctrl.activeDate.setDate date

        ctrl.refreshView()
    )
]

.directive 'monthpicker', [
  'dateFilter'
  (dateFilter) ->
    return (
      restrict: 'EA'
      replace: true
      templateUrl: 'rolodex_angular/template/datepicker/month'
      require: '^datepicker'
      link: (scope, element, attrs, ctrl) ->
        ctrl.step = years: 1
        ctrl.element = element
        ctrl._refreshView = ->
          months = new Array(12)
          year = ctrl.activeDate.getFullYear()
          i = 0

          while i < 12
            months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth),
              uid: scope.uniqueId + '-' + i
            )
            i++
          scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle)
          scope.rows = ctrl.split(months, 3)

        ctrl.compare = (date1, date2) ->
          new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth())

        ctrl.handleKeyDown = (key, evt) ->
          date = ctrl.activeDate.getMonth()
          if key is 'left'
            date = date - 1
          else if key is 'up'
            date = date - 3
          else if key is 'right'
            date = date + 1
          else if key is 'down'
            date = date + 3
          else if key is 'pageup' or key is 'pagedown'
            year = ctrl.activeDate.getFullYear() + ((if key is 'pageup' then -1 else 1))
            ctrl.activeDate.setFullYear year
          else if key is 'home'
            date = 0
          else date = 11  if key is 'end'
          ctrl.activeDate.setMonth date

        ctrl.refreshView()
    )
]

.directive 'yearpicker', [
  'dateFilter'
  (dateFilter) ->
    return (
      restrict: 'EA'
      replace: true
      templateUrl: 'rolodex_angular/template/datepicker/year'
      require: '^datepicker'
      link: (scope, element, attrs, ctrl) ->
        getStartingYear = (year) ->
          parseInt((year - 1) / range, 10) * range + 1
        range = ctrl.yearRange
        ctrl.step = years: range
        ctrl.element = element
        ctrl._refreshView = ->
          years = new Array(range)
          i = 0
          start = getStartingYear(ctrl.activeDate.getFullYear())

          while i < range
            years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear),
              uid: scope.uniqueId + '-' + i
            )
            i++
          scope.title = [
            years[0].label
            years[range - 1].label
          ].join(' - ')
          scope.rows = ctrl.split(years, 5)

        ctrl.compare = (date1, date2) ->
          date1.getFullYear() - date2.getFullYear()

        ctrl.handleKeyDown = (key, evt) ->
          date = ctrl.activeDate.getFullYear()
          if key is 'left'
            date = date - 1
          else if key is 'up'
            date = date - 5
          else if key is 'right'
            date = date + 1
          else if key is 'down'
            date = date + 5
          else if key is 'pageup' or key is 'pagedown'
            date += ((if key is 'pageup' then -1 else 1)) * ctrl.step.years
          else if key is 'home'
            date = getStartingYear(ctrl.activeDate.getFullYear())
          else date = getStartingYear(ctrl.activeDate.getFullYear()) + range - 1  if key is 'end'
          ctrl.activeDate.setFullYear date

        ctrl.refreshView()
    )
]

.constant 'datepickerPopupConfig',
  datepickerPopup: 'yyyy-MM-dd'
  currentText: 'Today'
  clearText: 'Clear'
  closeText: 'Done'
  closeOnDateSelection: true
  appendToBody: false
  showButtonBar: true

.directive 'datepickerPopup', [
  '$compile'
  '$parse'
  '$document'
  'dateFilter'
  'dateParser'
  'datepickerPopupConfig'
  'dropdownService'
  ($compile, $parse, $document, dateFilter, dateParser, datepickerPopupConfig, dropdownService) ->
    return (
      restrict: 'EA'
      require: 'ngModel'
      scope:
        isOpen: '=?'
        currentText: '@'
        clearText: '@'
        closeText: '@'
        dateDisabled: '&'

      link: (scope, element, attrs, ngModel) ->

        cameltoDash = (string) ->
          string.replace /([A-Z])/g, ($1) ->
            '-' + $1.toLowerCase()

        parseDate = (viewValue) ->
          unless viewValue
            ngModel.$setValidity 'date', true
            null
          else if angular.isDate(viewValue) and not isNaN(viewValue)
            ngModel.$setValidity 'date', true
            viewValue
          else if angular.isString(viewValue)
            date = dateParser.parse(viewValue, dateFormat) or new Date(viewValue)
            if isNaN(date)
              ngModel.$setValidity 'date', false
              `undefined`
            else
              ngModel.$setValidity 'date', true
              date
          else
            ngModel.$setValidity 'date', false
            `undefined`
        dateFormat = undefined
        closeOnDateSelection = (if angular.isDefined(attrs.closeOnDateSelection) then scope.$parent.$eval(attrs.closeOnDateSelection) else datepickerPopupConfig.closeOnDateSelection)
        appendToBody = (if angular.isDefined(attrs.datepickerAppendToBody) then scope.$parent.$eval(attrs.datepickerAppendToBody) else datepickerPopupConfig.appendToBody)
        scope.showButtonBar = (if angular.isDefined(attrs.showButtonBar) then scope.$parent.$eval(attrs.showButtonBar) else datepickerPopupConfig.showButtonBar)
        scope.getText = (key) ->
          scope[key + 'Text'] or datepickerPopupConfig[key + 'Text']

        attrs.$observe 'datepickerPopup', (value) ->
          dateFormat = value or datepickerPopupConfig.datepickerPopup
          ngModel.$render()

        popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>')
        popupEl.attr
          'ng-model': 'date'
          'ng-change': 'dateSelection()'

        datepickerEl = angular.element(popupEl.children()[0])

        if attrs.datepickerOptions
          angular.forEach scope.$parent.$eval(attrs.datepickerOptions), (value, option) ->
            datepickerEl.attr cameltoDash(option), value

        scope.watchData = {}
        angular.forEach [
          'minDate'
          'maxDate'
          'datepickerMode'
        ], (key) ->
          if attrs[key]
            getAttribute = $parse(attrs[key])

            scope.$parent.$watch getAttribute, (value) ->
              scope.watchData[key] = value

            datepickerEl.attr cameltoDash(key), 'watchData.' + key
            if key is 'datepickerMode'
              setAttribute = getAttribute.assign
              scope.$watch 'watchData.' + key, (value, oldvalue) ->
                setAttribute scope.$parent, value  if value isnt oldvalue

        datepickerEl.attr 'date-disabled', 'dateDisabled({ date: date, mode: mode })'  if attrs.dateDisabled
        ngModel.$parsers.unshift parseDate
        scope.dateSelection = (dt) ->
          scope.date = dt  if angular.isDefined(dt)
          ngModel.$setViewValue scope.date
          ngModel.$render()
          if closeOnDateSelection
            scope.isOpen = false
            scope.forceClose = true
            dropdownService.close(scope)
            element[0].focus()

        element.bind 'input change keyup', ->
          scope.$apply ->
            scope.date = ngModel.$modelValue

        ngModel.$render = ->
          date = (if ngModel.$viewValue then dateFilter(ngModel.$viewValue, dateFormat) else '')
          element.val date
          scope.date = parseDate(ngModel.$modelValue)

        scope.select = (date) ->

          if date is 'today'
            today = new Date()
            if angular.isDate(ngModel.$modelValue)
              date = new Date(ngModel.$modelValue)
              date.setFullYear today.getFullYear(), today.getMonth(), today.getDate()
            else
              date = new Date(today.setHours(0, 0, 0, 0))
          scope.dateSelection date
        $popup = $compile(popupEl)(scope)
        if appendToBody
          $document.find('body').append $popup
        else
          element.after $popup
        scope.$on '$destroy', ->
          $popup.remove()
    )
]
.directive 'datepickerPopupWrap', ->
  restrict: 'EA'
  replace: true
  transclude: true
  templateUrl: 'rolodex_angular/template/datepicker/popup'
  link: (scope, element, attrs) ->
    element.bind 'click', (event) ->
      event.preventDefault()
      event.stopPropagation()
