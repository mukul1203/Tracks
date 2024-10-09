import React from "react";
import { EmailPasswordInput } from "./EmailPasswordInput";
import { userSignIn } from "../utils/data/actions";

export const SignInForm = () => {
  return <EmailPasswordInput title={"Sign In"} onDonePress={userSignIn} />;
};
