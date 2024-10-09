import React from "react";
import { Background } from "../components/Background";
import { SignUpForm } from "../components/SignUpForm";

const SignUpScreen = ({
  navigation
}: any) => {
  return (
    // @ts-expect-error TS(2749): 'Background' refers to a value, but is being used ... Remove this comment to see the full error message
    <Background>
      // @ts-expect-error TS(2749): 'SignUpForm' refers to a value, but is being used ... Remove this comment to see the full error message
      <SignUpForm />
    </Background>
  );
};
export default SignUpScreen;
