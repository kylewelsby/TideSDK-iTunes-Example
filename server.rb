#!/usr/bin/env ruby
# Modified from http://yehudakatz.com/2007/08/06/webrick-anywhere/
require 'webrick'
include WEBrick

s = HTTPServer.new(
  :Port            => ARGV[0] || 3000,
  :DocumentRoot    => Dir::pwd
)

## mount subdirectories
s.mount("",
        HTTPServlet::FileHandler, "./src/Resources/",
        true)  #<= allow to show directory index.

trap("INT"){ s.shutdown }
s.start

