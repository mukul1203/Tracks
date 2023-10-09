# Tracks

A side project: possibly an app to track multiple people on map

Open in github codespaces...

1. Create a copy of TODO.env as .env.local. Fill in all the details.
2. From the project folder, run npm install.
3. Run npm install -g eas-cli to globally install eas (expo application services) cli
4. (Only if created a fresh eas account, or if .env.local has more env variables introduced)
    Run eas secret:push --force to push the env variables as secrets on eas server. This is to avoid
    pushing the variables to git or on server in some other way as they could be then compromised.
5. eas build --profile development
    This will prompt you to login with your eas account credentials. Do so.
    Then select the platform for which to build: All/Android/iOS
6. Let the build finish on eas server. Once done, go to the eas builds on mobile and install the build.
7. Run a server to serve the js bundle from your computer: 
    npx expo start --tunnel --dev-client 
8. Launch the installed app on mobile and make sure to Log in with your eas account
9. You should see your eas project (Tracks) development server there. Click and it will load the bundle.
10. And the app should be up and running!

# Note
--tunnel is important while working on codespaces, because the virtual machine on which you are building has different network than your mobile. Tunnel allows connecting...
