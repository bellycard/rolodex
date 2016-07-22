angular.module('rolodex.dateparser', [])

.service "dateParser", [
  "$locale"
  "orderByFilter"
  ($locale, orderByFilter) ->
    createParser = (format) ->
      map = []
      regex = format.split("")
      angular.forEach formatCodeToRegex, (data, code) ->
        index = format.indexOf(code)
        if index > -1
          format = format.split("")
          regex[index] = "(" + data.regex + ")"
          format[index] = "$" # Custom symbol to define consumed part of format
          i = index + 1
          n = index + code.length

          while i < n
            regex[i] = ""
            format[i] = "$"
            i++
          format = format.join("")
          map.push
            index: index
            apply: data.apply

        return

      regex: new RegExp("^" + regex.join("") + "$")
      map: orderByFilter(map, "index")

    # Check if date is valid for specific month (and year for February).
    # Month: 0 = Jan, 1 = Feb, etc
    isValid = (year, month, date) ->
      return date is 29 and ((year % 4 is 0 and year % 100 isnt 0) or year % 400 is 0)  if month is 1 and date > 28
      return date < 31  if month is 3 or month is 5 or month is 8 or month is 10
      true
    @parsers = {}
    formatCodeToRegex =
      yyyy:
        regex: "\\d{4}"
        apply: (value) ->
          @year = +value
          return

      yy:
        regex: "\\d{2}"
        apply: (value) ->
          @year = +value + 2000
          return

      y:
        regex: "\\d{1,4}"
        apply: (value) ->
          @year = +value
          return

      MMMM:
        regex: $locale.DATETIME_FORMATS.MONTH.join("|")
        apply: (value) ->
          @month = $locale.DATETIME_FORMATS.MONTH.indexOf(value)
          return

      MMM:
        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join("|")
        apply: (value) ->
          @month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value)
          return

      MM:
        regex: "0[1-9]|1[0-2]"
        apply: (value) ->
          @month = value - 1
          return

      M:
        regex: "[1-9]|1[0-2]"
        apply: (value) ->
          @month = value - 1
          return

      dd:
        regex: "[0-2][0-9]{1}|3[0-1]{1}"
        apply: (value) ->
          @date = +value
          return

      d:
        regex: "[1-2]?[0-9]{1}|3[0-1]{1}"
        apply: (value) ->
          @date = +value

      EEEE:
        regex: $locale.DATETIME_FORMATS.DAY.join("|")

      EEE:
        regex: $locale.DATETIME_FORMATS.SHORTDAY.join("|")

    @parse = (input, format) ->
      return input  if not angular.isString(input) or not format
      format = $locale.DATETIME_FORMATS[format] or format
      @parsers[format] = createParser(format)  unless @parsers[format]
      parser = @parsers[format]
      regex = parser.regex
      map = parser.map
      results = input.match(regex)
      if results and results.length
        fields =
          year: 1900
          month: 0
          date: 1
          hours: 0

        dt = undefined
        i = 1
        n = results.length

        while i < n
          mapper = map[i - 1]
          mapper.apply.call fields, results[i]  if mapper.apply
          i++
        dt = new Date(fields.year, fields.month, fields.date, fields.hours)  if isValid(fields.year, fields.month, fields.date)
        dt
]
