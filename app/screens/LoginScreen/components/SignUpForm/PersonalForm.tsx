import React from "react"
import { IFormProps } from "./SignUpForm"
import { styled } from "nativewind"
import { View } from "@ant-design/react-native"
import { TextField } from "app/components/core"
import { setDob, setFirstName, setLastName, setUsername } from "app/hooks/useSignUp"
import DatePicker from "app/components/core/DatePicker"

const StyledView = styled(View)

function PersonalForm({ textInputRefs, signUpState }: IFormProps) {
  return (
    <StyledView className="px-1">
      <TextField
        value={signUpState?.username}
        onChangeText={setUsername}
        helper={signUpState?.validateUsername}
        status={signUpState?.validateUsername ? "error" : undefined}
        autoCapitalize="none"
        autoCorrect={false}
        containerStyle="mb-4"
        placeholderTx="loginScreen.usernameFieldPlaceholder"
        ref={(ref) => {
          if (ref) {
            textInputRefs.current[3] = ref
          }
        }}
        onSubmitEditing={() => {
          textInputRefs.current[4]?.focus()
        }}
      />
      <StyledView className="w-full flex flex-row justify-center px-1">
        <TextField
          value={signUpState?.firstName}
          onChangeText={setFirstName}
          helper={signUpState?.validateFirstName}
          status={signUpState?.validateFirstName ? "error" : undefined}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTx="loginScreen.firstNameFieldPlaceholder"
          containerStyle="mb-4 w-1/2 mr-1"
          ref={(ref) => {
            if (ref) {
              textInputRefs.current[4] = ref
            }
          }}
          onSubmitEditing={() => {
            textInputRefs.current[5]?.focus()
          }}
        />
        <TextField
          value={signUpState?.lastName}
          onChangeText={setLastName}
          helper={signUpState?.validateLastName}
          status={signUpState?.validateLastName ? "error" : undefined}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTx="loginScreen.lastNameFieldPlaceholder"
          containerStyle="mb-4 w-1/2 ml-1"
          ref={(ref) => {
            if (ref) {
              textInputRefs.current[5] = ref
            }
          }}
        />
      </StyledView>
      <DatePicker
        value={signUpState?.dob}
        onChange={setDob}
        helper={signUpState?.validateDob}
        status={signUpState?.validateDob ? "error" : undefined}
        placeholderTx="loginScreen.dobFieldPlaceholder"
      />
    </StyledView>
  )
}

export default PersonalForm
