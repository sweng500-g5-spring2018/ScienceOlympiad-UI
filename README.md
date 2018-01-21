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

## Running ScienceOlympiad
1) The following are NPM commands for installing module dependencies in the package.json 
and for compiling/executing modules.  Run these commands from project root directory.
 
    a) Install dependent modules: 
    >       npm install 
    
    b) Run the UI (which runs buildpack server, transpiles JS, compiles LESS files, 
    and watches for any changes so that they can be reflected in the running 
    application): <br />
    >       npm start
    
    c) Currently the application runs on port 3000; navigate to:
    >       http://localhost:3000
    
   
