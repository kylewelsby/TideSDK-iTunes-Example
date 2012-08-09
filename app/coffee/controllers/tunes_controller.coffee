class Tunes.TunesController extends Batman.Controller
  constructor: () ->
    @set 'app', new Tunes.ITunesApp()
  routingKey: 'tunes'

  index: (params) =>
    console.log "TunesController > Index"

    @refresh()
    setInterval @refresh ,2500

  refresh: (params) =>
    if @get('app').isPlaying() is true
      if @get('track') is undefined or (@get('app').get('currentDatabaseID') isnt @get('track').get('databaseID'))
        @set 'track', @get('app').currentTrack()
