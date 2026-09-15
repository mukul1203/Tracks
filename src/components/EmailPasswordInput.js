import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Input } from "react-native-elements";
import { colors, radius, spacing } from "../theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailPasswordInput = ({ title, onDonePress }) => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    error: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const email = value.email.trim();
  const canSubmit =
    EMAIL_REGEX.test(email) && value.password.length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setValue((v) => ({ ...v, error: "" }));
    try {
      await onDonePress(email, value.password);
    } catch (error) {
      setValue((v) => ({ ...v, error: error.message }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {!!value.error && (
        <View style={styles.error}>
          <Icon name="exclamation-circle" size={16} color={colors.text} />
          <Text style={styles.errorText}>{value.error}</Text>
        </View>
      )}
      <View style={styles.controls}>
        <Input
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          containerStyle={styles.control}
          style={styles.text}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          // Email addresses are case-insensitive and never auto-corrected:
          // stop iOS from capitalising / "fixing" what the user types.
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          leftIcon={<Icon name="envelope" size={16} color={colors.textMuted} />}
        />

        <Input
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          containerStyle={styles.control}
          style={styles.text}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={submit}
          leftIcon={<Icon name="key" size={16} color={colors.textMuted} />}
          rightIcon={
            <Icon
              name={showPassword ? "eye-slash" : "eye"}
              size={18}
              color={colors.textMuted}
              onPress={() => setShowPassword((s) => !s)}
            />
          }
        />
        <Button
          title={title}
          buttonStyle={styles.submit}
          disabledStyle={styles.submitDisabled}
          disabled={!canSubmit}
          loading={submitting}
          onPress={submit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    justifyContent: "center",
  },
  controls: {
    alignSelf: "stretch",
  },
  control: {
    marginTop: spacing.sm,
  },
  text: {
    color: colors.text,
  },
  submit: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  submitDisabled: {
    backgroundColor: colors.border,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.danger,
  },
  errorText: {
    color: colors.text,
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
});
