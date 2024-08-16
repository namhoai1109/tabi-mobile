import { TextField } from "app/components/core"
import { styled } from "nativewind"
import React from "react"
import { View } from "react-native"
import { IFormProps } from "./SignUpForm"
import { setEmail, setPhone } from "app/hooks/useSignUp"

const StyledView = styled(View)

function CredentialForm({ changeForm, textInputRefs, signUpState }: IFormProps) {
  return (
    <StyledView className="px-1">
      <TextField
        value={signUpState?.email}
        onChangeText={setEmail}
        helper={signUpState?.validateEmail}
        status={signUpState?.validateEmail ? "error" : undefined}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        containerStyle="mb-4"
        onSubmitEditing={() => {
          textInputRefs.current[0]?.focus()
        }}
      />
      <TextField
        value={signUpState?.phone}
        onChangeText={setPhone}
        helper={signUpState?.validatePhone}
        status={signUpState?.validatePhone ? "error" : undefined}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="phone-pad"
        placeholderTx="loginScreen.phoneNumberFieldPlaceholder"
        containerStyle="mb-4"
        ref={(ref) => {
          if (ref) {
            textInputRefs.current[0] = ref
          }
        }}
        onSubmitEditing={() => {
          if (changeForm) {
            textInputRefs.current[1]?.focus()
            changeForm()
          }
        }}
      />
    </StyledView>
  )
}

export default CredentialForm
