import React from "react";
import { Background } from "../components/Background";
import { EmailPasswordInput } from "../components/EmailPasswordInput";
import { userSignIn } from "../utils/data/actions";

const SignInScreen = () => {
  return (
    <Background>
      <EmailPasswordInput title={"Sign in"} onDonePress={userSignIn} />
    </Background>
  );
};
export default SignInScreen;
