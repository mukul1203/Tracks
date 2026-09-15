# Tracks — working notes

Live location-sharing app. React Native + Expo (Expo Go), Google Maps, Firebase Realtime DB.

## Project setup

- **App root is `src/`**, not the repo root. Run all `npm`/`expo` commands from `src/`.
- **Use Node 22** (via nvm). Node 23+ breaks `@react-native/dev-middleware`; the repo's
  `.nvmrc` says 18 but deps need 20/22/24+. `nvm use 22` before installing/running.
- First-time: `cd src && npm install` (needs `dotenv` etc.), then `npx expo install`.

## Driving the iOS simulator (for on-device testing)

The `ios-simulator` MCP (`adborroto/ios-simulator-mcp`, added via
`uvx --with "mcp<2" ios-simulator-mcp` — the pin matters, the published package
uses the old FastMCP API) is only **partly** reliable. Use this split:

- **MCP is good for:** `take_screenshot`, `set_location`, `get_booted_simulator`,
  `start/stop_video_recording`.
- **MCP is BROKEN for:** `tap` (maps to the wrong screen spot — ignores the window
  title bar) and `input_text` (invokes `simctl io` incorrectly). Do NOT use these.
- **Tap / type with `cliclick`** (`brew install cliclick`) at real Mac-screen coords.
  Typing: `cliclick c:<x>,<y>` to focus, then `cliclick t:<text>`. For emails/anything
  autocorrect mangles, paste instead: `printf '<text>' | pbcopy` then
  `cliclick c:<x>,<y> kd:cmd t:a ku:cmd kp:delete kd:cmd t:v ku:cmd`.

### Getting Mac-screen coords
1. Position the Simulator window at a known spot: Simulator → Window → **Point Accurate**,
   then `osascript ... set position of window 1 to {40,40}`.
2. `screencapture -x -R<winX>,<winY>,<w>,<h> out.png` and read the pixel location of the
   control directly (the display is 1:1). cliclick uses those same global coords.
3. Rough transform for iPhone 15 Plus at window {40,40}: `Mac_x ≈ 62 + 1.037·dx`,
   `Mac_y ≈ 123 + 1.002·dy` (dx,dy = device points, 430×932). Re-measure if the window moves.

### Gotchas
- Needs macOS **Accessibility** AND **Automation** permission for the app running the
  MCP/`osascript` (System Settings → Privacy & Security). Without Automation, AppleScript
  calls hang; kill stuck ones with `pkill -9 osascript`.
- If a control sits in the bottom ~40px of the screen it can hit the Dock hot-zone and
  hang; enable Dock auto-hide (`defaults write com.apple.dock autohide -bool true; killall Dock`)
  and revert after.
- Two booted sims = two Simulator windows; lay them side by side and target each by its
  own window coords.
- Launch the app after boot with `xcrun simctl openurl <udid> "exp://127.0.0.1:8081"`
  (Metro must be running).

### Verifying animation/jitter
Stills at rest miss transients. Burst-capture across an update and montage:
`for i in $(seq -w 0 20); do screencapture -x -R<win> "$DIR/f$i.png"; sleep 0.12; done`
then `montage "$DIR"/f*.png -tile 7x -geometry 180x390 -label '%f' out.png`.

## Data model notes

- Invites are keyed by **email** (`sentTo` = email), so non-registered people can be
  invited and see it when they sign up. Received invites query by the current user's email.
- Group `members` are still resolved to userIds at creation, so an invited email that
  isn't registered yet won't appear in the members preview until they join. (Known gap.)
