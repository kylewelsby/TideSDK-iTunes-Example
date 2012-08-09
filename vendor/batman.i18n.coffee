class Batman.I18N extends Batman.Object
  @defaultLocale: "en"

  @classAccessor 'locale',
    get: -> @locale || @get('defaultLocale')
    set: (k,v) -> @locale = v
    unset: -> x = @locale; delete @locale; x

  @classAccessor 'translations', -> @get("locales.#{@get('locale')}")

  @translate: (key, values) ->
    translation = @get("translations.#{key}")
    if ! translation?
      Batman.developer.warn "Warning, undefined translation #{key} when in local #{@get('locale')}"
      return ""
    Batman.helpers.interpolate(translation, values)

  @enable: ->
    @_oldTranslation = Batman.translate
    @locales.set 'en', Batman.translate.messages
    Batman.translate = => @translate(arguments...)

  @disable: ->
    Batman.translate = @_oldTranslation

  constructor: -> Batman.developer.error "Can't instantiate i18n!"

class Batman.I18N.LocalesStorage extends Batman.Object
  constructor: ->
    @isStorage = true
    @_storage = {}
    super

  # Define a default accessor which fires off a request to the backend to
  # grab a locale json.
  @accessor
    get: (k) ->
      unless @_storage[k]
        @_storage[k] = {}
        new Batman.Request
          url: "/locales/#{k}.json"
          success: (data) => @set k, data[k]
          error: (xhr) ->
            throw new Error("Couldn't load locale file #{k}!")
      @_storage[k]
    set: (k, v) -> @_storage[k] = v
    unset: (k) ->
      x = @_storage[k]
      delete @_storage[k]
      x

Batman.I18N.set 'locales', new Batman.I18N.LocalesStorage

Batman.Filters.t = Batman.Filters.translate = Batman.Filters.interpolate
translationsAlias = Batman()
translationsAlias.accessor 't', -> Batman.I18N.get('translations')

Batman.RenderContext.base = Batman.RenderContext.base.descend(translationsAlias)
