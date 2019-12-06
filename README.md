# Looker Demo Eng Initial Web App Skeleton

This is a basic node/react app that will be used to showcase demos for Looker PBL.

You'll need to have a local looker instance running as well. For more info on this process, see this [Guru card](https://app.getguru.com/card/eckbn9Kc/How-to-install-a-local-Looker-instance?q=installing%20looker%20locally).

Steps for installing locally and running...

<ol>
<li>run 'git clone git@github.com:ewarrenG/looker-embed.git' in terminal</li>
<li>add a looker.ini file at the root level of the directory and fill in the credentials for api_version, base_url, client_id and client_secret as documented in this github repo 
https://github.com/looker-open-source/sdk-codegen/tree/master/typescript/looker#configure-the-sdk-for-your-looker-server.You'll also need to add 'verify_ssl=false' to th eini since you're connecting against a local server. 
<li>cd into the looker-embed directory and run 'npm install'</li>
<li>cd into the client directory and 'run npm install' as well</li>
<li>cd back to looker-embed parent directory 'cd ../'</li>
<li>run npm start, localhost:3000 should open and you should see a list of looks associated with this demo (for now) :P</li>
</ol>

For help, slack elliot glasenk