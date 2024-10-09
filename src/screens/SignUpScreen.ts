import React from "react";
import { Background } from "../components/Background";
import { SignUpForm } from "../components/SignUpForm";

const SignUpScreen = ({ navigation }) => {
  return (
    <Background>
      <SignUpForm />
    </Background>
  );
};
export default SignUpScreen;
