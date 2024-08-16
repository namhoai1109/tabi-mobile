import { AxiosResponse } from "axios"
import { authBookingRequest } from "../axios"
import { CREATE_SURVEY_PATH } from "./paths"

export const createUserSurvey = async (data: TCreateUserSurveyRequest) => {
  return authBookingRequest.post<any, AxiosResponse<any>, TCreateUserSurveyRequest>(
    CREATE_SURVEY_PATH,
    data,
  )
}
