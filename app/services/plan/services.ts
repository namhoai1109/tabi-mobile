import { useQuery, useMutation, useQueryClient } from "react-query"
import {
  getPlanList,
  getPlanById,
  addPlan,
  updatePlanById,
  deletePlanById,
  getAIRecommendedDestinations,
  deleteAllPlans,
} from "./callers"

export const keyPlan = {
  AI: "AI_RECOMMENDED_DESTINATION",
  PLAN_LIST: "PLAN_LIST",
  PLAN_DETAILS: "PLAN_DETAILS",
}

export const useGetAIRecommendedDestinations = (user_id: number | undefined, location: string) => {
  return useQuery({
    queryKey: [keyPlan.AI],
    queryFn: () => {
      return getAIRecommendedDestinations(user_id, location)
    },
  })
}

export const useGetPlanList = (booking_id: number) => {
  return useQuery({
    queryKey: [keyPlan.PLAN_LIST],
    queryFn: () => {
      return getPlanList(booking_id)
    },
  })
}

export const useGetPlanDetailsById = (id: number) => {
  return useQuery({
    queryKey: [keyPlan.PLAN_DETAILS, id],
    queryFn: () => {
      return getPlanById(id)
    },
  })
}

export const useAddPlan = (onSuccess: TCallback) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPlan: TPlan) => addPlan(newPlan),
    onSuccess: (res) => {
      queryClient.invalidateQueries(keyPlan.PLAN_LIST)
      onSuccess()
    },
  })
}

export const useUpdatePlanById = (id: number, onSuccess: TCallback) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedPlan: TPlan) => updatePlanById(id, updatedPlan),
    onSuccess: () => {
      queryClient.invalidateQueries([keyPlan.PLAN_DETAILS, id])
      queryClient.invalidateQueries(keyPlan.PLAN_LIST)
    },
  })
}

export const useDeleteAllPlans = (onSuccess: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: number[]) => deleteAllPlans(ids),
    onSuccess: () => {
      queryClient.invalidateQueries(keyPlan.PLAN_LIST)
      onSuccess()
    },
  })
}

export const useDeletePlanById = (onSuccess: TCallback) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePlanById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(keyPlan.PLAN_LIST)
      onSuccess()
    },
  })
}
