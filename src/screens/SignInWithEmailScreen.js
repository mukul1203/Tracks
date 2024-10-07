import React from "react";
import { auth } from "../services/auth";
import { Background } from "../components/Background";
import { EmailPasswordInput } from "../components/EmailPasswordInput";

const SignInWithEmail = () => {
  return (
    <Background>
      <EmailPasswordInput title={"Sign in"} onDonePress={auth.userSignIn} />
    </Background>
  );
};
export default SignInWithEmail;
