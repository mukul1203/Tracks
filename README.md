# Tracks

An app to track multiple people on a map.

<img src="https://github.com/user-attachments/assets/ef55adf8-f5f5-4753-9bd6-15b3f143f85c" alt="shot1" width="25%" style="display:inline-block;"/>
<img src="https://github.com/user-attachments/assets/d9d684c1-e955-4313-8fc4-9e1ec421ef74" alt="shot2" width="25%" style="display:inline-block; margin-left: 1em;"/>

## 1. Environment Setup (Prerequisites)

### Step 1: Environment Configuration

Create a copy of `TODO.env` as `.env.local`. Fill in all the details.

### Step 2: Install Dependencies

From the project `src` folder, run:

```bash
npx expo install
```

Note that using expo install ensures that the dependency versions are compatible with the expo version (specified in package.json). E.g. react-native-maps module version compatible to expo version must be installed, else app breaks. expo install updates the versions in package.json if needed and then does npm install.

---

## 2. Quick Start: Local Development (Expo Go)

Use this method for standard development if you are **not** using custom native code (most common).

### Run on iOS Simulator

1. Start the development server:
   ```bash
   npx expo start
   ```
2. Press `shift + i` to choose a simulator. Choose iphone to open the app in the iphone simulator. (ipads seem to have issues, not sure yet)
   - _Note: If you don't have the simulator installed, you need Xcode installed on your Mac._

### Run on Android Emulator

1. Start the development server:
   ```bash
   npx expo start
   ```
2. Press `a` to open the app in the Android Emulator.

---

## 3. Debugging

1. Install the **Expo Tools** extension in VS Code.
2. Run `npx expo start` in the terminal.
3. Press `s` to switch to Expo Go (if not already).
4. Press `i` (iOS) or `a` (Android) to launch the app.
5. In VS Code, launch the **"Debug Expo app"** task from the extension.

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

---

## 4. Advanced: Custom Development Build (EAS)

Use this method **only** if you have added native modules that require custom native code (not supported by Expo Go).

### Step 1: Install EAS CLI

Globally install EAS (Expo Application Services) CLI:

```bash
npm install -g eas-cli
```

### Step 2: Push Secrets to EAS

_(Only if you created a fresh EAS account, or if `.env.local` has new environment variables)_

Push env variables as secrets to EAS (avoids exposing them in git):

```bash
eas secret:push --force
```

### Step 3: Build Development Client

Run the command below and log in with your EAS credentials when prompted:

```bash
eas build --profile development
```

- Select the platform: All, Android, or iOS.

### Step 4: Install the Build

Once the build finishes on the EAS server:

- **Physical Device**: Go to the build link on your mobile and install.
- **Simulator**: Download the build file and drag it onto the simulator.

### Step 5: Start Development Server

Run the server for the development client:

```bash
npx expo start --tunnel --dev-client
```

### Step 6: Launch and Connect

1. Launch the installed "Tracks" app on your device/simulator.
2. Log in with your EAS account if prompted.
3. You should see your development server listed. Click it to load the bundle.

---

## Notes

### Codespaces & Tunneling

`--tunnel` is important while working on GitHub Codespaces because the virtual machine has a different network configuration than your mobile device. The tunnel allows them to connect.

### Expo Go vs. Development Build

- **Expo Go**: Good for quick testing if you don't have custom native code.
- **Development Build**: Required if you have native code changes (iOS/Android specific). EAS builds and deploys the APK/IPA for you.
  - When invoking `eas` with `--development`, it produces a custom version of Expo Go. The JS code runs from your development server.
  - In production mode, the JS code is baked into the app.
