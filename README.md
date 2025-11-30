# Tracks

A side project app to track multiple people on a map.

## Development Setup

Follow these steps to set up the project locally.

### 1. Environment Configuration

Create a copy of `TODO.env` as `.env.local`. Fill in all the details.

### 2. Install Dependencies

From the project `src` folder, run:

```bash
npm install
```

### 3. Install EAS CLI

Run the following command to globally install EAS (Expo Application Services) CLI:

```bash
npm install -g eas-cli
```

### 4. Push Secrets to EAS

_(Only if you created a fresh EAS account, or if `.env.local` has new environment variables)_

Run the following to push the env variables as secrets on the EAS server. This avoids pushing variables to git or exposing them insecurely.

```bash
eas secret:push --force
```

### 5. Build Development Client

Run the following command:

```bash
eas build --profile development
```

- This will prompt you to login with your EAS account credentials.
- Select the platform for which to build: All, Android, or iOS.

### 6. Install the Build

Let the build finish on the EAS server. Once done, go to the EAS builds on your mobile device and install the build.

### 7. Start Development Server

Run a server to serve the JS bundle from your computer:

```bash
npx expo start --tunnel --dev-client
```

### 8. Launch and Login

Launch the installed app on mobile and make sure to log in with your EAS account.

### 9. Connect to Development Server

You should see your EAS project (Tracks) development server listed. Click it to load the bundle.

### 10. Verification

The app should be up and running!

### 11. Additional Dependencies

If required, install map support:

```bash
npx expo install react-native-maps
```

---

## Notes

### Codespaces & Tunneling

`--tunnel` is important while working on GitHub Codespaces because the virtual machine has a different network configuration than your mobile device. The tunnel allows them to connect.

### Expo Go vs. Development Build

You can either use the **Expo Go** app to run your JavaScript code or build your own **Development Build**.

- **Expo Go**: Good for quick testing if you don't have custom native code.
- **Development Build**: Required if you have native code changes (iOS/Android specific). EAS builds and deploys the APK/IPA for you.
  - When invoking `eas` with `--development`, it produces a custom version of Expo Go. The JS code runs from your development server.
  - In production mode, the JS code is baked into the app.

### iOS Simulator

- **No Native Changes**: Switch to Expo Go mode. Press `s` after running `npx expo start`, then press `i` for iOS simulator.
- **Custom Native Code**: You must download the development build on the simulator, then click your dev server to run it.

## Debugging

1. Install the **Expo Tools** extension in VS Code.
2. Run `npx expo start`.
3. Press `s` to switch to Expo Go.
4. Press `i` for iOS simulator.
5. Launch the "Debug Expo app" task from the extension.

### Advanced Debugging (Legacy/Reference)

<details>
<summary>Click to expand launch.json configuration notes</summary>

(IGNORE THIS SECTION UNLESS NECESSARY)

To set up `launch.json`:

1. Open `launch.json`.
2. Click "Add configuration".
3. Select "React Native" (requires React Native Tools extension).
4. Select "Debug Application" > "Exponent" > "Hermes".

**Troubleshooting NPM Paths:**
If you get an error about a failed npm command, VS Code might be reading paths from `.bash_profile` instead of `.bashrc`.

- To bring nvm paths into `.bash_profile`, see: [Issue #1753 Comment](https://github.com/microsoft/vscode-react-native/issues/1753#issuecomment-1050694929)
- For Zsh: Check `.zshrc` / `.zshenv`.
- Restart VS Code after applying fixes.
</details>
