import React from "react"
import { IFormProps } from "./SignUpForm"
import { styled } from "nativewind"
import { View } from "react-native"
import { PasswordField } from "app/components/core"
import { setConfirmPassword, setPassword } from "app/hooks/useSignUp"

const StyledView = styled(View)

function PasswordForm({ changeForm, textInputRefs, signUpState }: IFormProps) {
  return (
    <StyledView className="px-1">
      <PasswordField
        value={signUpState?.password}
        onChangeText={setPassword}
        helper={signUpState?.validatePassword}
        status={signUpState?.validatePassword ? "error" : undefined}
        containerStyle="mb-4"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        ref={(ref) => {
          if (ref) {
            textInputRefs.current[1] = ref
          }
        }}
        onSubmitEditing={() => {
          textInputRefs.current[2]?.focus()
        }}
      />
      <PasswordField
        value={signUpState?.confirmPassword}
        onChangeText={setConfirmPassword}
        helper={signUpState?.validateConfirmPassword}
        status={signUpState?.validateConfirmPassword ? "error" : undefined}
        containerStyle="mb-4"
        placeholderTx="loginScreen.confirmPasswordFieldPlaceholder"
        ref={(ref) => {
          if (ref) {
            textInputRefs.current[2] = ref
          }
        }}
        onSubmitEditing={() => {
          if (changeForm) {
            textInputRefs.current[3]?.focus()
            changeForm()
          }
        }}
      />
    </StyledView>
  )
}

export default PasswordForm
