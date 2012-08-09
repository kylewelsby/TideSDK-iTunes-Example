# Example TideSDK application

This is an extraction of part of a application I'm working on as a side project.

Using TideSDK the application communicates via the command line using [osascript](https://developer.apple.com/library/mac/#documentation/Darwin/Reference/Manpages/man1/osascript.1.html) to acquire information from iTunes.app.

## Prerequisites 
This application source code requires;

#### System Requirements

* Intel CPU
* OS X 10.5 or higher
* [XCode][xcode] or GCC Compiler
* [Homebrew][homebrew] (recommend)

#### TideSDK Requirements

* [SCons][scons]
* [Git][git]
* [pkg-config][pkgconfig]

#### Application Requirements

* [TideSDK][tidesdk]
* [RVM (Ruby Version Manager)][rvm] (optional but recommened)
* [SASS](http://sass-lang.com/)
* [CoffeeScript](http://coffeescript.org/)

#### Development Frameworks

* [batman.js][batmanjs] - MVC JavaScript Framework
* [Rake][rake] - Rake is a Make-like program implemented in Ruby
* [Foreman](http://ddollar.github.com/foreman/) - manage Procfile-based applications


Most will be installed via [Bundler](http://gembundler.com/) which is included in the project.

## Full Install Guide

### Install Homebrew
Using your system default ruby, you can install [Homebrew][homebrew].

    $ ruby <(curl -fsSk https://raw.github.com/mxcl/homebrew/go)

### Install RVM [https://rvm.io/rvm/install/](https://rvm.io/rvm/install/)
In addition you can optionally install [RVM][rvm] but it's optional

    $ curl -L https://get.rvm.io | bash -s stable --ruby
    
Grab a brew, this could take a few minutes while it compiles the latest version of Ruby. 

### Meanwhile, Build TideSDK - [Building-TideSDK](https://github.com/TideSDK/TideSDK/wiki/Building-TideSDK)

This is where [Homebrew][homebrew] becomes very handy.

#### Install (nearly) all prerequisites

    $ brew install scons git pkgconfig
    
#### Checkout TideSDK sources

**Please Note:** this application uses [TideSDK 1.2.1.RC1]()

````
git clone git://github.com/TideSDK/TideSDK
cd TideSDK
git checkout bd9fffb
git submodule update --init
cd kroll
git checkout osx-10.7.x-sdk-10.7-xcode4
git pull
cd ..
````

#### Build TideSDK

    $ scons -s debug=1 sdkinstaller run=1
    
#### Test the build

    $ scons -s debug=1 drill bit run=1
        

#### Check you the build script
This is the location of the build script require to compile the application.

    $ ~/Library/Application\ Support/Titanium/sdk/osx/1.2.1.RC1/tibuild.py 
    
You should have some options output running this in the terminal.
    
## Get Started with the application

Now that you have a everything setup to run [TideSDK] this application uses a few things to make development super quick and fun.

First make sure you have a few useful RubyGems installed

    $ gem install bundler

_When using [RVM][rvm] you shouldn't get a permission error at this point_

_If you chose to be gutsy and not use [RVM][rvm] you may need to `sudo ||` the last command_

#### Checkout the source

````
git clone git://github.com/kylewelsby/TideSDK-iTunes-Example
cd TideSDK-iTunes-Example
bundle install
````

Now if all is setup right you should be able to run the application.

    $ bundle exec rake run:osx
    
This Rake task will compile the CoffeeScript, SASS and Application, then Launch it.

### Additional usefulness

As you use `HTML`, `JavaScript` and `CSS` to make your application why not skip the whole compile process when making changes and run your application right in the browser.

This project comes with code watchers that will monitor your `CoffeeScript` and `SASS` for changes and compile them. Once compiled into `JavaScript` and `CSS` they are viewable in the browser. 

#### Start a web server for development

    $ bundle exec foreman start
    
Navigate to the url

    $ open http://localhost:3000
    
Your application will *mostly* work in the browser, except from native `Titanium` commands which are cleverly stubbed out using [ti_fallback.coffee](http://github.com/kylewelsby/TideSDK-iTunes-Example/blob/master/app/coffee/ti_fallback.coffee).

## Developing

If you like the organisation of this application feel free to `fork` and develop your own awesome application. 

This application uses [batman.js][batmanjs] as a JavaScript MVC Framework.
It's super awesome, give it a try :).


## Feedback or issues.

I love to hear your feedback, 

* email: kyle@mekyle.com
* twitter: [@halfcube](https://twitter.com/halfcube)

Also join in the [TideSDK][tidesdk] discussions

* Google Group: [https://groups.google.com/forum/#!forum/tidesdk](https://groups.google.com/forum/#!forum/tidesdk)
* Twitter: [@tidesdk](https://twitter.com/tidesdk)

[homebrew]:http://mxcl.github.com/homebrew/
[rvm]:https://rvm.io/
[xcode]:https://developer.apple.com/xcode/
[scons]:http://www.scons.org/
[git]:http://git-scm.com/
[pkgconfig]:http://www.freedesktop.org/wiki/Software/pkg-config
[tidesdk]:http://tidesdk.org/
[batmanjs]:http://batmanjs.org/
[rake]:https://rubygems.org/gems/rake