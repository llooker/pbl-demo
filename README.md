# Looker PBL Demo Application

This app is the new solution for PBL Demos.

This is a react/node app featuring Looker's all new embed SDK to showcase PBL demos.

Steps for configuring this application locally on your machine: 
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