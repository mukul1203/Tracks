import React from "react";
import { useAuthentication } from "../utils/hooks/useAuthentication";
import UserStack from "./userStack";
import AuthStack from "./authStack";

export default function RootNavigation() {
  // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
  const { user } = useAuthentication();

  // @ts-expect-error TS(2749): 'UserStack' refers to a value, but is being used a... Remove this comment to see the full error message
  return user ? <UserStack /> : <AuthStack />;
}
