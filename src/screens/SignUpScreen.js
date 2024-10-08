import React from "react";
import { auth } from "../services/auth";
import { Background } from "../components/Background";
import { EmailPasswordInput } from "../components/EmailPasswordInput";
import { SIGNIN_SCREEN_NAME } from "./screenConstants";

const SignUpScreen = ({ navigation }) => {
  async function signUp(email, password) {
    await auth.userSignUp(email, password);
    navigation.navigate(SIGNIN_SCREEN_NAME);
  }
  return (
    <Background>
      <EmailPasswordInput title={"Sign up"} onDonePress={signUp} />
    </Background>
  );
};
export default SignUpScreen;
