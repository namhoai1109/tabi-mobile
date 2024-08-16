import { AxiosResponse } from "axios"
import { bookingRequest } from "../axios"
import { SIGN_IN_PATH, SIGN_UP_PATH } from "./paths"

export const postSignUp = async (data: TSignUpRequest) => {
  return bookingRequest.post<TTokenResponse, AxiosResponse<TTokenResponse>, TSignUpRequest>(
    SIGN_UP_PATH,
    data,
  )
}

export const postSignIn = async (data: TSignInRequest) => {
  return bookingRequest.post<TTokenResponse, AxiosResponse<TTokenResponse>, TSignInRequest>(
    SIGN_IN_PATH,
    data,
  )
}
