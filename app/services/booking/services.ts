import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query"
import { cancelBooking, createBooking, getBookingHistoryList, getBookingList } from "./callers"
import { TxKeyPath } from "app/i18n"

export const keyBooking = {
  BOOKING_LIST: "BOOKING_LIST",
  BOOKING_HISTORY_LIST: "BOOKING_HISTORY_LIST",
  CANCEL_BOOKING: "CANCEL_BOOKING",
}

export const bookingStatus = {
  Pending: "PEN",
  Approved: "APP",
  Rejected: "REJ",
  Cancel: "CAN",
  InReview: "REV",
  Completed: "COM",
}

export const getBookingStatusLabel = (status: string) => {
  switch (status) {
    case bookingStatus.Pending:
      return "common.pending" as TxKeyPath
    case bookingStatus.Approved:
      return "common.approved" as TxKeyPath
    case bookingStatus.Rejected:
      return "common.rejected" as TxKeyPath
    case bookingStatus.Cancel:
      return "common.cancel" as TxKeyPath
    case bookingStatus.InReview:
      return "common.inReview" as TxKeyPath
    case bookingStatus.Completed:
      return "common.completed" as TxKeyPath
    default:
      return "" as TxKeyPath
  }
}

export const useGetBookingList = () => {
  return useQuery({
    queryKey: [keyBooking.BOOKING_LIST],
    queryFn: () => {
      return getBookingList()
    },
  })
}

export const useGetBookingHistoryList = () => {
  return useInfiniteQuery({
    queryKey: [keyBooking.BOOKING_HISTORY_LIST],
    queryFn: ({ pageParam = 1 }) => {
      return getBookingHistoryList(pageParam)
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: keyBooking.CANCEL_BOOKING,
    mutationFn: ({ bookingID, reason }: TCancelBookingRequest) => {
      return cancelBooking(bookingID, reason)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(keyBooking.BOOKING_LIST)
    },
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TBookingCreationRequest) => {
      return createBooking(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(keyBooking.BOOKING_LIST)
    },
  })
}
