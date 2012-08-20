class Tunes.ITunesApp extends Batman.Object
  constructor: () ->
    @set 'file_dir', Titanium.Filesystem.getResourcesDirectory().toString()
    @set 'app', @tellApp()
    @set 'stateText', 'stopped'
    @set 'playhead', null
    @set 'isRunning', false
    @accessor 'percentPlayed',
      get: (key) ->
        Math.round((@get('playhead')/ @get('trackDuration')) * 100)

  getOsa: =>
    app = @tellApp()
    @set 'app', app
    if app.is_running > 0
      @set 'isRunning', true
      @set 'stateText', app.player.state
      if isNaN app.player.position
        @set 'playhead', 0
      else
        @set 'playhead', app.player.position
        @set 'track', new Tunes.Track app.track
    else
      @set 'isRunning', false

  isPlaying: =>
    @get('app').player.state is "playing"

  tellApp: (to, app) ->
    command = ['osascript',"#{@get('file_dir')}/itunes.applescript"]
    try
      process = Titanium.Process.createProcess(command)
      result = process().toString()
      JSON.parse result
    catch err
      console.error "somethign went wrong #{err}"
