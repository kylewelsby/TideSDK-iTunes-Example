class Tunes.Track extends Batman.Model
  resourceName: 'track'
  @encode 'name', 'artist', 'album', 'duration', 'location', 'databaseID', 'pushed', 'filename', 'filetype'
