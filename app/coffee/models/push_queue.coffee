class Tunes.Pushed extends Batman.Model
  @resourceName: 'push_queue'
  @persist Batman.LocalStorage

  @encode 'name', 'artist', 'album', 'duration', 'databaseID', 'location'

  push: =>
    file = Titanium.Filesystem.getFile(@get)
    
