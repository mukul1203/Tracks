import { Dimensions } from "react-native";

// Used for navigation
export const CREATE_GROUP_SCREEN_NAME = "Create Group";
export const MAP_SCREEN_NAME = "Map";
export const SIGNED_IN_SCREEN_NAME = "Signed In";
export const SIGNIN_SCREEN_NAME = "Sign In";
export const SIGNUP_SCREEN_NAME = "Sign Up";
export const WELCOME_SCREEN_NAME = "Welcome";

const { width, height } = Dimensions.get("screen");
const ASPECT_RATIO = width / height;
export const H_PADDING = width / 10;
export const V_PADDING = height / 10;
export const LATITUDE = 37.78825;
export const LONGITUDE = -122.4324;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
