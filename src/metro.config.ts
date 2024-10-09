// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
// @ts-expect-error TS(2304): Cannot find name '__dirname'.
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("cjs");
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = config;
