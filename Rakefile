require 'coyote/rake'

BOURBON = File.expand_path("../app/sass/bourbon/lib/bourbon.rb",__FILE__)
TIBUILD = '~/Library/Application\ Support/Titanium/sdk/osx/1.2.1.RC1/tibuild.py'

SASS = "./app/sass/app.scss"
CSS = "./src/Resources/css/app.css"

COFFEE = "./app/coffee/app.coffee"
JS = "./src/Resources/js/app.js"

BUILD_SOURCE = File.expand_path('../src/',__FILE__)
BUILD_OUT = File.expand_path('../dist/',__FILE__)

desc "Compile all assets"
task :compile => ['compile:coffee', 'compile:sass']

namespace :watch do
  desc "Watch SASS"
  task :sass do
    sh "sass --watch --require #{BOURBON} #{SASS}:#{CSS}"
  end

  desc "Watch CoffeeScript"
  coyote :coffee do |config|
    config.input = COFFEE
    config.output = JS
    config.options = {:quiet => true, :watch => true}
  end
end

namespace :compile do
  desc "Compile CoffeeScript"
  coyote :coffee do |config|
    config.input = COFFEE
    config.output = JS
  end

  desc "Compile SASS"
  task :sass do
    sh "sass --require #{BOURBON} #{SASS} #{CSS}"
  end
end

namespace :compress do
  desc "Compile CoffeeScript"
  coyote :coffee do |config|
    config.input = COFFEE
    config.output = JS
    config.options = {:compress => true}
  end

  desc "Compile SASS"
  task :sass do
    sh "sass --style compressed --require #{BOURBON} #{SASS} #{CSS}"
  end
end

namespace :run do
  desc "RuniOS version of the application"
  task :osx => ['compile'] do
    sh "#{TIBUILD} --run --os osx --dest #{BUILD_OUT} --noinstall --type bundle #{BUILD_SOURCE}"
  end

  desc "Run Win32 version of the application"
  task :win32 => ['compile'] do
    sh "#{TIBUILD} --run --os win32 --dest #{BUILD_OUT} --noinstall --type bundle #{BUILD_SOURCE}"
  end
end

namespace :build do
  desc "Build iOS version of the application"
  task :osx => ['compress']  do
    puts "Building"
    sh "#{TIBUILD} --os osx --dest #{BUILD_OUT} --type bundle #{BUILD_SOURCE}"
  end

  desc "Build Win32 version of the application"
  task :win32 => ['compress']  do
    sh "#{TIBUILD} --os win32 --dest #{BUILD_OUT} --type bundle #{BUILD_SOURCE}"
  end
end
