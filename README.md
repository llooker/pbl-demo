# Looker PBL Demo Application

This app is the new solution for PBL Demos.

This is a react/node app featuring Looker's all new embed SDK to showcase PBL demos.

## Local Setup

### Clone Repo
```
git clone git@github.com:ewarrenG/looker-embed.git
```

### Setup Env files
```
Reach out to Elliot Glasenk for the contents of these files
```

### install node
```
Go to https://nodejs.org/en/download/ and install for your OS
```

### install packages
In the root directory run
```
npm install
```

In the client directory run
```
npm install
```

### edit hosts file (MacOSX)
open /etc/hosts using sudo
Add
```
127.0.0.1   embed.demo
```

## Running th demo
Run in root directory
```
npm dev start
```

Go to http://embed.demo:8080

First time it will need to build alot of files to be patient!

<ol>
    <li>Open terminal and run 'git clone git@github.com:ewarrenG/looker-embed.git'</li>
    <li>There are three files with sensitive credentials, you'll need to add manually:
        <ol>
        <li>looker.ini at the root level</li>
        <li>config.js at the root level</li>
        <li>clientConfig.json inside of the src folder inside of the client folder</li>
        </ol>
    </li>
    <li>Reach out to Elliot Glasenk for the contents of these files</li>
    <li>Next, back in your terminal window, cd into the looker-embed directory and run 'npm install'</li>
    <li>cd into the client directory and run 'npm install'</li>
<li>cd back to looker-embed parent directory, i.e. 'cd ../'</li>
<li>run npm start, localhost:3000 should open and you should see a list of looks associated with this demo (for now) :P</li>
</ol>

Questions, comments, concerns? Reach out to Elliot Glasenk