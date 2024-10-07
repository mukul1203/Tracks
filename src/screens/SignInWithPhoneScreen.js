import React, { useState } from "react";
import { auth } from "../services/auth";
import { Background } from "../components/Background";
import {
  PhoneNumberInput,
  VerificationCodeInput,
} from "../components/PhoneNumberInput";
import { View } from "react-native";

const SignInWithPhone = () => {
  const [step, setStep] = useState(1);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");

  // Handle phone number submission
  const onSignInSubmit = (phoneNumber) => {
    auth
      .userSignInWithPhoneNumber(phoneNumber)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setStep(2); // Move to verification step
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Handle verification code submission
  const onVerifyCodeSubmit = (verificationCode) => {
    setError("");
    confirmationResult
      .confirm(verificationCode)
      .then((result) => {
        const user = result.user;
        console.log("User signed in successfully:", user);
        // Handle successful login here
      })
      .catch((error) => {
        setError("Invalid verification code. Please try again.");
      });
  };
  return (
    <Background>
      {!!error && (
        <View>
          <Text>{error}</Text>
        </View>
      )}
      {/* reCAPTCHA container, TODO: this string should come from auth module*/}
      <View id="recaptcha-container"></View>
      {step == 1 ? (
        <PhoneNumberInput title="Get OTP" onDonePress={onSignInSubmit} />
      ) : (
        <VerificationCodeInput
          title="Verify"
          onDonePress={onVerifyCodeSubmit}
        />
      )}
    </Background>
  );
};
export default SignInWithPhone;
