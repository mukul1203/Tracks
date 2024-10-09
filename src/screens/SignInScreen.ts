import React from "react";
import { Background } from "../components/Background";
import { SignInForm } from "../components/SignInForm";

const SignInScreen = () => {
  return (
    // @ts-expect-error TS(2749): 'Background' refers to a value, but is being used ... Remove this comment to see the full error message
    <Background>
      // @ts-expect-error TS(2749): 'SignInForm' refers to a value, but is being used ... Remove this comment to see the full error message
      <SignInForm />
    </Background>
  );
};
export default SignInScreen;
