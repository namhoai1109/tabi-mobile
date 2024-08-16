import { proxy, useSnapshot } from "valtio"

export interface SurveyState {
  locationTypes: TSurveyItem[]
  activities: TSurveyItem[]
  preferredSeasons: TSurveyItem[]
}

export const surveyState = proxy<SurveyState>({
  locationTypes: [],
  activities: [],
  preferredSeasons: [],
})

export const useSurveyState = () => {
  return useSnapshot(surveyState)
}

export const setLocationTypes = (value: TSurveyItem[]) => {
  surveyState.locationTypes = value
}

export const setActivities = (value: TSurveyItem[]) => {
  surveyState.activities = value
}

export const setPreferredSeasons = (value: TSurveyItem[]) => {
  surveyState.preferredSeasons = value
}

export const clearLocationTypes = () => {
  surveyState.locationTypes = []
}

export const clearActivities = () => {
  surveyState.activities = []
}

export const clearPreferedSeasons = () => {
  surveyState.preferredSeasons = []
}
