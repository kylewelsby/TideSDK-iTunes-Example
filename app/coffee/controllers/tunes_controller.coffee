class Tunes.TunesController extends Batman.Controller
  constructor: () ->
    @set 'app', new Tunes.ITunesApp()
  routingKey: 'tunes'

  index: (params) =>
    console.log "TunesController > Index"

    @refresh()
    setInterval @refresh ,2500

  refresh: (params) =>
    @get('app').getOsa()
