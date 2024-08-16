import axios, { AxiosResponse } from "axios"
import { planRequest } from "../axios"
import {
  PLAN_LIST_PATH,
  PLAN_BY_ID,
  ADD_PLAN_PATH,
  UPDATE_PLAN_PATH,
  DELETE_PLAN_PATH,
  DELETE_ALL_PLANS_PATH,
} from "./paths"
import { interpolate } from "app/utils/interpolate"

export const getAIRecommendedDestinations = async (
  user_id: number | undefined,
  location: string,
) => {
  let path = `https://tabi-ai.onrender.com/api/v1/plan?user_id=${user_id}&city=${location.replace(
    / /g,
    "%20",
  )}`
  console.info("request API  ", path)
  return await axios.get(path)
}

export const getPlanList = async (booking_id: number) => {
  return await planRequest.get(PLAN_LIST_PATH)
  // return await planRequest.get<any, AxiosResponse<any>>(
  //   interpolate(PLAN_LIST_PATH, { booking_id }),
  //   {
  //     method: "GET",
  //   },
  // )
}

export const getPlanById = async (id: number) => {
  return await planRequest.get<TPlanDetailsDataResponse, AxiosResponse<TPlanDetailsDataResponse>>(
    interpolate(PLAN_BY_ID, { id }),
    {
      method: "GET",
    },
  )
}

export const addPlan = async (newPlan: TPlan) => {
  return await planRequest.post<any, AxiosResponse<any>>(ADD_PLAN_PATH, newPlan, {
    method: "POST",
  })
}

export const updatePlanById = async (id: number, updatedPlan: TPlan) => {
  return await planRequest.put<TPlanDetailsData, AxiosResponse<TPlanDetailsData>>(
    interpolate(UPDATE_PLAN_PATH, { id }),
    updatedPlan,
    {
      method: "PUT",
    },
  )
}

export const deleteAllPlans = async (ids: number[]) => {
  return await planRequest.delete<any, AxiosResponse<any>>(DELETE_ALL_PLANS_PATH, {
    data: { ids },
  })
}

export const deletePlanById = async (id: number) => {
  return await planRequest.delete<void, AxiosResponse<void>>(
    interpolate(DELETE_PLAN_PATH, { id }),
    {
      method: "DELETE",
    },
  )
}
