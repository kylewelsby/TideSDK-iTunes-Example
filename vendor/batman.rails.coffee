
numericKeys = [1, 2, 3, 4, 5, 6, 7, 10, 11]
date_re = ///
  ^
  (\d{4}|[+\-]\d{6})  # 1 YYYY
  (?:-(\d{2})         # 2 MM
  (?:-(\d{2}))?)?     # 3 DD
  (?:
    T(\d{2}):         # 4 HH
    (\d{2})           # 5 mm
    (?::(\d{2})       # 6 ss
    (?:\.(\d{3}))?)?  # 7 msec
    (?:(Z)|           # 8 Z
      ([+\-])         # 9 ±
      (\d{2})         # 10 tzHH
      (?::(\d{2}))?   # 11 tzmm
    )?
  )?
  $
///

Batman.mixin Batman.Encoders,
  railsDate:
    defaultTimezoneOffset: (new Date()).getTimezoneOffset()
    encode: (value) -> value
    decode: (value) ->
      # Thanks to https://github.com/csnover/js-iso8601 for the majority of this algorithm.
      # MIT Licensed
      if value?
        if (obj = date_re.exec(value))
          # avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
          for key in numericKeys
            obj[key] = +obj[key] or 0

          # allow undefined days and months
          obj[2] = (+obj[2] || 1) - 1;
          obj[3] = +obj[3] || 1;

          # process timezone by adjusting minutes
          if obj[8] != "Z" and obj[9] != undefined
            minutesOffset = obj[10] * 60 + obj[11]
            minutesOffset = 0 - minutesOffset  if obj[9] == "+"
          else
            minutesOffset = Batman.Encoders.railsDate.defaultTimezoneOffset
          return new Date(Date.UTC(obj[1], obj[2], obj[3], obj[4], obj[5] + minutesOffset, obj[6], obj[7]))
        else
          Batman.developer.warn "Unrecognized rails date #{value}!"
          return Date.parse(value)

class Batman.RailsStorage extends Batman.RestStorage

  urlForRecord: -> @_addJsonExtension(super)
  urlForCollection: -> @_addJsonExtension(super)

  _addJsonExtension: (url) ->
    if url.indexOf('?') isnt -1 or url.substr(-5, 5) is '.json'
      return url
    url + '.json'

  _errorsFrom422Response: (response) -> JSON.parse(response)

  @::after 'update', 'create', (env, next) ->
    record = env.subject
    {error, response} = env
    if error
      # Rails validation errors
      if error.request?.get('status') == 422
        try
          validationErrors = @_errorsFrom422Response(response)
        catch extractionError
          env.error = extractionError
          return next()

        for key, errorsArray of validationErrors
          for validationError in errorsArray
            record.get('errors').add(key, validationError)

        env.result = record
        env.error = record.get('errors')
        return next()
    next()
