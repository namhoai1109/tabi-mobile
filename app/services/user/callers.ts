import { AxiosResponse } from "axios"
import { authBookingRequest } from "../axios"
import { ME_PATH } from "./paths"

export const getMe = async () => {
  return authBookingRequest.get<TMeResponse, AxiosResponse<TMeResponse>>(ME_PATH)
}
