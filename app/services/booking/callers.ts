import { AxiosResponse } from "axios"
import { authBookingRequest } from "../axios"
import { BOOKINGS_PATH, CANCEL_BOOKING_BY_ID } from "./paths"
import { getFiles } from "../file/callers"
import { interpolate } from "app/utils/interpolate"
import { bookingStatus } from "./services"

export const getBookingList = async (): Promise<TBookingListResponse[]> => {
  const resp = await authBookingRequest.get<
    TBranchDetailsData,
    AxiosResponse<{ data: TBookingModel[] }>
  >(
    `${BOOKINGS_PATH}?f=${encodeURIComponent(
      JSON.stringify({
        status__in: [bookingStatus.Pending, bookingStatus.Approved, bookingStatus.InReview],
      }),
    )}`,
    {
      params: {
        s: "check_in_date",
        o: "ASC",
      },
    },
  )

  return await getBookingListResponse(resp.data.data)
}

export const getBookingHistoryList = async (p: number): Promise<TBookingHistoryListResponse> => {
  const resp = await authBookingRequest.get<
    TBranchDetailsData,
    AxiosResponse<{ data: TBookingModel[]; total: number }>
  >(
    `${BOOKINGS_PATH}?f=${encodeURIComponent(
      JSON.stringify({
        status__in: [bookingStatus.Rejected, bookingStatus.Cancel, bookingStatus.Completed],
      }),
    )}`,
    {
      params: {
        s: "check_in_date",
        o: "DESC",
        l: 10,
        p: Math.ceil(p),
      },
    },
  )

  const list = await getBookingListResponse(resp.data.data)
  return {
    data: list,
    total: resp.data.total,
  }
}

const getBookingListResponse = async (
  bookingList: TBookingModel[],
): Promise<TBookingListResponse[]> => {
  const ids = bookingList.map((booking) => booking.room.branch?.id) as number[]

  const fileResp = await getFiles({
    attachment_id_in: ids,
    attachment_type: "branch",
    field: "branch_thumbnail",
  })
  const files = fileResp.data.data

  return bookingList.map((booking) => {
    const file = files.find((f) => f.attachment_id === booking.room.branch?.id) as TFileResponse
    return {
      data: booking,
      file,
    } as TBookingListResponse
  })
}

export const cancelBooking = async (bookingID: number, reason: string) => {
  return await authBookingRequest.post(interpolate(CANCEL_BOOKING_BY_ID, { id: bookingID }), {
    reason,
  })
}

export const createBooking = async (data: TBookingCreationRequest) => {
  return await authBookingRequest.post(BOOKINGS_PATH, data)
}
