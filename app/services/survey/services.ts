import { useMutation } from "react-query"
import { createUserSurvey } from "./callers"

export const keySurvey = {
  createSurvey: "CREATE_SURVEY",
}

export const useCreateUserSurvey = (onSuccess: TCallback) => {
  return useMutation({
    mutationKey: keySurvey.createSurvey,
    mutationFn: (data: TCreateUserSurveyRequest) => createUserSurvey(data),
    onSuccess: (res) => {
      onSuccess()
    },
  })
}
