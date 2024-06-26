import React from "react";
import { auth } from "../services/auth";
import { Background } from "../components/Background";
import { EmailPasswordInput } from "../components/EmailPasswordInput";

const SignUpScreen = ({ navigation }) => {
  async function signUp(email, password) {
    await auth.userSignUp(email, password);
    navigation.navigate("Sign In");
  }
  return (
    <Background>
      <EmailPasswordInput title={"Sign up"} onDonePress={signUp} />
    </Background>
  );
};
export default SignUpScreen;
