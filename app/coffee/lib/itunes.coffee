class Tunes.ITunesApp extends Batman.Object
  constructor: () ->
    @set 'stateText', 'stopped'
    @set 'playhead', null
    @set 'iTunesRunning', 0
    @set 'trackDuration', 0
    @set 'currentDatabaseID', 0
    @accessor 'percentPlayed',
      get: (key) ->
        Math.round((@get('playhead')/ @get('trackDuration')) * 100)

  getOsa: =>
    @set 'iTunesRunning', parseInt(@tellApp('count (every process whose displayed name is "iTunes")', 'System Events'))
    state = @tellApp('return {player state, player position}')?.split(',')
    if state
      @set 'currentDatabaseID', parseInt @tellApp('return database id of current track'),10
      @set 'stateText', state[0]
      @set 'playhead', parseInt(state[1], 10)
    return

  isRunning: =>
    @getOsa()
    @get('itunesTunning') > 0

  isPlaying: =>
    @getOsa()
    return false if @get('stateText') is "stopped"
    return true if @get('stateText') is "playing"
    false

  currentTrack: =>
    # throw "NotPlaying" unless @isPlaying()
    info = @tellApp('return {n:name,ar:artist,al:album,d:duration,id:database id,kind:kind} of current track').split(/,\s\w+:/)
    location = @tellApp('return POSIX path of ((get location of current track) as text)').replace(/\n/,'')

    @set 'trackDuration', parseFloat(info[3])
    spl = location.split('/')
    new Tunes.Track(
      name: info[0].substr(2)
      artist: info[1]
      album: info[2]
      duration: parseFloat(info[3])
      databaseID: parseInt(info[4])
      location: location
      filetype: @trackMime(info[5])
      filename: location.split('/')[spl.length-1]
    )


  trackMime: (kind) ->
    switch kind.replace(/\n/,'')
      when "MPEG audio file"
        "audio/mpeg"
      when "MPEG audio stream"
        "audio/mpeg"
      when "AAC audio file"
        "audio/m4a"
      when "Purchased AAC audio file"
        "audio/m4a"
      when "WAV audio file"
        "audio/wav"
      else
        "unknown"

  tellApp: (to, app) ->
    app = "iTunes" unless app
    command = ["osascript", "-e", "tell app \"#{app}\" to #{to}"]
    process = Titanium.Process.createProcess(command)
    process().toString()
