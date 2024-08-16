import { useMutation } from "react-query"
import { postSignIn, postSignUp } from "./callers"
import { resetSignIn, setRefreshToken, setToken } from "app/hooks/useAuthentication"
import { resetSignUp } from "app/hooks/useSignUp"

export const keyAuth = {
  signUp: "SIGN_UP",
  signIn: "SIGN_IN",
}

const storeToken = ({ data }: { data: TTokenResponse }) => {
  setToken(data.token_type + " " + data.access_token)
  setRefreshToken(data.refresh_token)
}

export const usePostSignUp = (onSuccess: TCallback) => {
  return useMutation({
    mutationKey: keyAuth.signUp,
    mutationFn: (signUpReq: TSignUpRequest) => postSignUp(signUpReq),
    onSuccess: (res) => {
      resetSignUp()
      storeToken(res)
      onSuccess()
    },
  })
}

export const usePostSignIn = (onSuccess: TCallback) => {
  return useMutation({
    mutationKey: keyAuth.signIn,
    mutationFn: (signInReq: TSignInRequest) => postSignIn(signInReq),
    onSuccess: (res) => {
      resetSignIn()
      storeToken(res)
      onSuccess()
    },
  })
}
