import "dotenv/config";
export default {
  expo: {
    name: "Tracks",
    description: "Live location of a group of people on map",
    slug: "Tracks",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "ios.mukuluec.tracks",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.mukuluec.tracks",
      config: {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-location",
        {
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
    ],
    extra: {
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      firebaseAppId: process.env.FIREBASE_APP_ID,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
      databaseURL: process.env.DATABASE_URL,
      eas: {
        projectId: "b41e62d7-2452-47a4-af34-ffb38a18a16e",
      },
    },
  },
};
