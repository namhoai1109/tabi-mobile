import { AxiosResponse } from "axios"
import { authBookingRequest, bookingRequest } from "../axios"
import {
  BRANCH_LIST_PATH,
  BRANCH_BY_ID,
  BRANCH_ROOM_LIST_PATH,
  RATE_BRANCH_BY_ID,
  BRANCH_FEATURED,
  BRANCH_RECOMMENDED,
} from "./paths"
import { interpolate } from "app/utils/interpolate"
import { getFiles } from "../file/callers"

export const getBranchList = async (p: number, params: TPublicBranchListParams | null) => {
  let builtParams: any = {
    l: 10,
    p: Math.ceil(p),
  }
  let path = BRANCH_LIST_PATH

  if (params) {
    builtParams = {
      l: params.l,
      p: Math.ceil(p),
      booking_date_in: [params.startDate, params.endDate],
      occupancy: params.occupants,
    }

    if (params.searchText) {
      const fParams = encodeURIComponent(JSON.stringify({ destination: params.searchText }))
      path = `${BRANCH_LIST_PATH}?f=${fParams}`
    }
  }

  const response = await bookingRequest.get<{ data: TPublicBranch[]; total: number }>(path, {
    params: builtParams,
  })

  if (response.data.data.length === 0) {
    return {
      data: [],
      total: 0,
    }
  }

  const list = await getBranchListWithImages(response.data.data)
  return {
    data: list,
    total: response.data.total,
  }
}

export const getBranchListWithImages = async (
  branchList: TPublicBranch[],
): Promise<TBranchResponse[]> => {
  const ids = branchList.map((branch) => branch.id) as number[]

  const fileResp = await getFiles({
    attachment_id_in: ids,
    attachment_type: "branch",
    field: "branch_thumbnail",
  })
  const files = fileResp.data.data

  return branchList.map((branch) => {
    const file = files.find((f) => f.attachment_id === branch.id) as TFileResponse
    return {
      data: branch,
      file,
    } as TBranchResponse
  })
}

export const getBranchById = async (id: number) => {
  return await bookingRequest.get<TBranchDetailsData, AxiosResponse<TBranchDetailsData>>(
    interpolate(BRANCH_BY_ID, { id }),
    {
      method: "GET",
    },
  )
}

export const getBranchRoomList = async (p: number, params: TPublicBranchRoomListParams) => {
  let response = await bookingRequest.get<
    { data: TPublicBranch[]; total: number },
    AxiosResponse<{ data: TPublicRoom[]; total: number }>
  >(interpolate(BRANCH_ROOM_LIST_PATH, { id: params.branch_id }), {
    params: {
      p,
      l: params.l,
    },
  })

  const list = await getBranchRoomListWithImages(response.data.data)
  return {
    data: list,
    total: response.data.total,
  }
}

export const getBranchRoomListWithImages = async (roomList: TPublicRoom[]) => {
  const ids = roomList.map((room) => room.id) as number[]

  const fileResp = await getFiles({
    attachment_id_in: ids,
    attachment_type: "room",
    field: "room_gallery",
  })

  const files = fileResp.data.data

  // Map each room to its corresponding image files
  const roomResponses: TRoomResponse[] = roomList.map((room) => {
    // Find all files corresponding to the room
    const matchingFiles = files.filter((f) => f.attachment_id === room.id) as TFileResponse[]

    // Return the room along with its image files
    return {
      data: room,
      files: matchingFiles,
    }
  })

  return roomResponses
}

export const rateBranchByID = async (id: number, data: TRateBranchRequest) => {
  return await authBookingRequest.post(interpolate(RATE_BRANCH_BY_ID, { id }), data)
}

export const getFeaturedBranches = async () => {
  const response = await bookingRequest.get<{ data: TFeaturedBranch[]; total: number }>(
    BRANCH_FEATURED,
  )
  const formattedResponse = response.data.data.map((item) => ({
    id: item.id,
    name: item.name,
    district: item.district,
    province_city: item.province_city,
    min_price: item.min_price,
    max_price: item.max_price,
    star_level: item.star_level,
    review_quantity: item.review_quantity,
  }))

  const list = await getBranchListWithImages(formattedResponse)
  return {
    data: list,
    total: response.data.total,
  }
}

export const getRecommendedBranches = async (userID: number, p: number) => {
  const response = await bookingRequest.get<{ data: TPublicBranch[]; total: number }>(
    BRANCH_RECOMMENDED,
    {
      params: {
        l: 10,
        p: Math.ceil(p),
      },
      data: {
        user_id: userID,
      },
    },
  )

  if (response.data.data.length === 0) {
    return {
      data: [],
      total: 0,
    }
  }

  const list = await getBranchListWithImages(response.data.data)
  return {
    data: list,
    total: response.data.total,
  }
}
