import React from "react";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { userSignIn } from "../utils/data/actions";

export const SignInForm = () => {
  // @ts-expect-error TS(2749): 'EmailPasswordInput' refers to a value, but is bei... Remove this comment to see the full error message
  return <EmailPasswordInput title={"Sign In"} onDonePress={userSignIn} />;
};
