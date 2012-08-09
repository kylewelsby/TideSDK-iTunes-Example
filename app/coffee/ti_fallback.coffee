unless window.Titanium
  Titanium =
    UI:
      UserWindow:
        showInspector: (bool) ->
          console.log '***show inspector***'
    Process:
      createProcess: (args, env, stdin, stdout, stderr) ->
        ->
          toString: ->
            # console.log "Expecting NPAPI to call #{args} (http://code.google.com/chrome/extensions/npapi.html)"
          launch: ->
            # console.log "Expecting NPAPI to call #{args} (http://code.google.com/chrome/extensions/npapi.html)"


  window.Titanium = Titanium
