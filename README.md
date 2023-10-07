# Tracks

A side project: possibly an app to track multiple people on map

Open in github codespaces...

npx install

eas build --profile development
This will use expo application services to push your code to an expo server, then pull it on another build server and run the builds, then deploy them for internal distribution and give us a link to download the apk from.

Once the apk is downloaded, and launched, you will see it prompts to start a local development server. That is the server which will serve the js bundle. The apk was custom native version of the regular expo go.
So start a server as such:
npx expo start --dev-client

If the server is not auto detected on your apk app, make sure you are logged in there in the app. Log in and kill and reopen the app. You should see the green...

For codespaces:

npx expo start --tunnel --dev-client

# Note

--tunnel is important while working on codespaces, because the virtual machine on which you are building has different network than your mobile. Tunnel allows connecting...
