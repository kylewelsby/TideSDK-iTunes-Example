window.Tunes = class Tunes extends Batman.App
  @title = "iCloudTunes"

  @root 'tunes#index'

  @on 'run', =>
    $('script[type="text/template"]').each ->
      Batman.View.store.set($(@).attr('id'), $(@).html())
    console.log "We're running"

  @on 'ready', => 
    console.log "We're ready"

