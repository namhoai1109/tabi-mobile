import { useInfiniteQuery, useMutation, useQuery } from "react-query"
import {
  getBranchById,
  getBranchList,
  getBranchRoomList,
  rateBranchByID,
  getFeaturedBranches,
  getRecommendedBranches,
} from "./callers"
import { TxKeyPath } from "app/i18n"

export const keyBranch = {
  BRANCH_LIST: "BRANCH_LIST",
  BRANCH_DETAILS: "BRANCH_DETAILS",
  BRANCH_ROOM_LIST: "BRANCH_ROOM_LIST",
  BRANCH_FEATURED: "BRANCH_FEATURED",
  BRANCH_RECOMMENDED: "BRANCH_RECOMMENDED",
}

export const cancellationTimeUnit = {
  hour: "HOUR",
  day: "DAY",
  week: "WEEK",
  month: "MONTH",
  year: "YEAR",
}

export const getCancellationTimeUnitLabel = (unit: string) => {
  switch (unit) {
    case cancellationTimeUnit.hour:
      return "common.hour" as TxKeyPath
    case cancellationTimeUnit.day:
      return "common.day" as TxKeyPath
    case cancellationTimeUnit.week:
      return "common.week" as TxKeyPath
    case cancellationTimeUnit.month:
      return "common.month" as TxKeyPath
    case cancellationTimeUnit.year:
      return "common.year" as TxKeyPath
    default:
      return "" as TxKeyPath
  }
}

export const useGetBranchList = (params: TPublicBranchListParams | null) => {
  return useInfiniteQuery({
    queryKey: [
      keyBranch.BRANCH_LIST,
      params?.l,
      params?.occupants,
      params?.startDate,
      params?.endDate,
      params?.searchText,
    ],
    queryFn: ({ pageParam = 1 }) => {
      return getBranchList(pageParam, params)
    },
    retry: false,
  })
}

export const useGetBranchById = (id: number) => {
  return useQuery({
    queryKey: [keyBranch.BRANCH_DETAILS, id],
    queryFn: () => {
      return getBranchById(id)
    },
  })
}

export const useGetBranchRoomList = (params: TPublicBranchRoomListParams) => {
  return useInfiniteQuery({
    queryKey: [keyBranch.BRANCH_ROOM_LIST, params?.l, params?.branch_id],
    queryFn: ({ pageParam = 1 }) => {
      return getBranchRoomList(pageParam, params)
    },
  })
}

export const useRateBranch = (id: number) => {
  return useMutation({
    mutationKey: [keyBranch.BRANCH_DETAILS, id],
    mutationFn: (data: TRateBranchRequest) => {
      return rateBranchByID(id, data)
    },
  })
}

export const useGetFeaturedBranches = () => {
  return useQuery({
    queryKey: [keyBranch.BRANCH_FEATURED],
    queryFn: () => {
      return getFeaturedBranches()
    },
  })
}

export const useGetRecommendedBranches = (userID: number) => {
  return useInfiniteQuery({
    queryKey: [keyBranch.BRANCH_RECOMMENDED, userID],
    queryFn: ({ pageParam = 1 }) => {
      return getRecommendedBranches(userID, pageParam)
    },
    retry: false,
  })
}
