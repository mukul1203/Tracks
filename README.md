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

You can either have Expo Go app as the native app inside which to run your javascript code, or you could choose to build your own version of Expo Go (because probably you have some native code changes per platform i.e. ios or android specific). To build your own version, EAS service provides you the way. It builds and deploys the apk or ipa for you to download on your device. When eas is invoked with --development, that means you are saying just produce my version of expo go, but the js code to run inside it will come from a development server, hence you need to run the dev server on your machine and click that in your downloaded app. In production mode, the js code will be baked into the app.

To run on ios simulator, if you don't have any native code changes, best is to switch to expo go mode (press s after you do npx expo start, then press i for ios simulator). This is because then, expo go will be installed on your ios simulator and your js code will be downloaded and run there. But if you are in development build with your custom eas build, you would need to download that build on simulator and then click your dev server in it and run (as usual on a physical device).

To debug:
Install the expo tools extension, it will provide a Debug expo app task. Use that to attach after running npx expo start > press s to switch to expo go > press i for ios simulator > launch Debug expo app task. Note that breakpoints are not correctly placed on the lines. Something above or below. Have to manage with this issue.

( IGNORE THIS:
Open launch.json file > Click Add configuration button > from dropdown, select React Native (you will have to have the React native tools extension downloaded) > Select Debug Application > Exponent > Hermes.
Just click run button from the launch tasks dropdown now. You get an error about failed npm command.
Issue is your vscode is trying to run npm, but it reads the program paths from equivalent of bash_profile, rather than from bashrc (which will be used when you run vscode from terminal, not UI).
To bring nvm etc. paths into your bash_profile, follow the link:
https://github.com/microsoft/vscode-react-native/issues/1753#issuecomment-1050694929
If you have zsh instead of bash, .bashrc => .zshrc, .bash_profile => .zshenv (and if not working, also .zprofile).
Make sure to restart vscode after the steps in url above are done.
)
