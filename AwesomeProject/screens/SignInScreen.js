import React from "react";
import { auth } from "../services/auth";
import { Background } from "./Background";
import { EmailPasswordInput } from "./EmailPasswordInput";

const SignInScreen = () => {
  return (
    <Background>
      <EmailPasswordInput title={"Sign in"} onDonePress={auth.userSignIn} />
    </Background>
  );
};
export default SignInScreen;
