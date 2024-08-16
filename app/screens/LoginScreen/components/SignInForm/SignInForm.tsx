import React, { useRef } from "react"
import { StyleProp, TextInput, View, ViewStyle } from "react-native"
import { ActivityIndicator, Button, Checkbox, Flex } from "@ant-design/react-native"
import {
  setIdentity,
  setPassword,
  useAuthentication,
  validateSignIn,
} from "app/hooks/useAuthentication"
import { PasswordField, Text, TextField } from "app/components/core"
import { styled } from "nativewind"
import { usePostSignIn } from "app/services/authen/services"
import { colors } from "app/theme"
import { translate } from "app/i18n"
import FadeView from "app/components/core/FadeView"

export interface ISignInProps {
  style?: StyleProp<ViewStyle>
}

const StyledButton = styled(Button)
const StyledText = styled(Text)
const StyledView = styled(View)

interface ISignInFormProps {
  onSuccess: TCallback
}

function SignInForm({ onSuccess }: ISignInFormProps) {
  const authPasswordInput = useRef<TextInput>(null)
  const authenticationSnapshot = useAuthentication()
  const [remember, setRemember] = React.useState(false)
  const { mutate, isLoading } = usePostSignIn(onSuccess)

  return (
    <FadeView>
      <TextField
        value={authenticationSnapshot.identity}
        onChangeText={setIdentity}
        containerStyle="mb-4"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={authenticationSnapshot.validateIdentity}
        status={authenticationSnapshot.validateIdentity ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <PasswordField
        containerStyle="mb-4"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        onSubmitEditing={() => {
          mutate({
            identity: authenticationSnapshot.identity,
            password: authenticationSnapshot.password,
          })
        }}
        ref={authPasswordInput}
        value={authenticationSnapshot.password}
        onChangeText={setPassword}
        helper={authenticationSnapshot.validatePassword}
        status={authenticationSnapshot.validatePassword ? "error" : undefined}
      />
      <StyledView className="mt-2">
        <Checkbox
          checked={remember}
          onChange={(event) => {
            setRemember(event.target.checked)
          }}
        >
          {translate("loginScreen.rememberMe")}
        </Checkbox>
      </StyledView>
      <Flex justify="center">
        <StyledButton
          type="primary"
          testID="sign-in-button"
          className="mt-6 mb-7 rounded-full w-full h-12"
          onPress={() => {
            if (validateSignIn()) {
              mutate({
                identity: authenticationSnapshot.identity,
                password: authenticationSnapshot.password,
                remember,
              })
            }
          }}
        >
          <StyledText tx="loginScreen.signIn" className="text-light" />
          {isLoading && <ActivityIndicator animating={isLoading} color={colors.background} />}
        </StyledButton>
      </Flex>
    </FadeView>
  )
}

export default SignInForm
