# ScienceOlympiad-UI

The UI for the Science Olympiad Application


## Getting Started

### Node.js Runtime
This application will run on the Node.js runtime and NPM.

##### Windows User
1) Download Windows installer of Node.js: https://nodejs.org/en/ <br />
    a) Select the version that is “Recommended for Most Users” <br />
2) Run the installer <br />
    b) Allow for all things to be installed (Node.js runtime environemnt, NPM, and allow the setup to add them to your PATH)

##### Mac User
1) Install xcode if it is not already installed: <br />
    a) Open terminal <br />
    b) Type: <br />
    >       xcode-select --install
2) Install Homebrew if it is not already installed: <br />
    a) Open terminal <br />
    b) Type: <br />
    >       ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
3) Install Node.js <br />
    a) Open terminal <br />
    b) Type: <br />
    >       brew install node

   
### IntelliJ Configurations
1) Verify that you have your language level set to React JSX

    a) Preferences / Language & Frameworks / JavaScript
    
    b) Set JavaScript language level to React JSX in the dropdown
    
2) Set up IntelliJ to run the app locally:

    a) Edit Run Configurations 
    
    b) Add new configuration (plus button in top right)
    
    c) Select 'npm'
    
    d) Verify that the 'package.json' points to the file of the same name within the root of our project space
    
    e) set the command to 'run'
     
    f) set the scripts to 'start'
    

## Running ScienceOlympiad
1) The following are NPM commands for installing module dependencies in the package.json 
and for compiling/executing modules.  Run these commands from project root directory.
 
    a) Install dependent modules: 
    >       npm install 
    
    b) Run the UI (which runs buildpack server, transpiles JS, compiles LESS files, 
    and watches for any changes so that they can be reflected in the running 
    application): <br />
    >       npm start
    
    c) Currently the application runs on port 8080; navigate to:
    >       http://localhost:3000
    

## Testing 

##### Creating Tests
1) Currently, create tests in the same directly that the components are located
in.  Each test file must end with <b><i>.test.js</i></b><br />
    <ul><b>If your component name is: <i>App.js</i> your test file 
    should be <i>App.test.js</i></b></ul>
    
2) Running tests with locally:

    a) The local test environment provides the ability for tests to run
        on demand as they are updated and a CLI to execute some or all tests
        at any given time when using.

    >       npm run test
    
    b) The local test environment provides the ability to run the tests and 
    generate a code coverage report that outputs to the <i>/coverage</i> 
    directory.  Open <i><b>index.html</b></i> in a browser for optimal viewing.
    
    >       npm run test:coverage
    
3) Running tests through CI/CD:
    
    a) When Jenkins is running a build, it will run the tests via the following
        command.  This can be run locally too for a 'one and done' test run, but 
        it only works on unix-based systems (due to how the CI variable is set).
        It outputs to the <i><b>coverage/junit</b></i> directory.
        
    >       npm run test:ci
    

## Production Build 

##### Creating a Production Optimized Build
1) A build optimized for production can be transpiled.  This build will be
    output to the <b><i>/build</i></b> directory.  To create a production 
    build, run the following command: 

    >       npm run build
    
