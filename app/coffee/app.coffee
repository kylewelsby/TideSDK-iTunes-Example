#= require ../../vendor/es5-shim.js
#= require ../../vendor/number_to_money.coffee
#= require ../../vendor/jquery-1.7.2.min.js
#= require ../../vendor/batman.js
#= require ../../vendor/batman.rails.coffee
# require ../../vendor/batman.jquery.js
#= require ti_fallback.coffee

window.Tunes||= {}

#= require tunes.coffee
#= require models
#= require lib
#= require controllers

$ ->
  $('img').live 'dragstart',  (e) ->
    e.preventDefault()

  Tunes.run()
