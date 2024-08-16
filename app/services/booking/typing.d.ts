type TBookingListResponse = {
  data: TBookingModel
  file: TFileResponse
}

type TCancelBookingRequest = {
  reason: string
  bookingID: number
}

type TBookingHistoryListResponse = {
  data: TBookingListResponse[]
  total: number
}

type TBookingCreationRequest = {
  room_id: number
  check_in_date: string
  check_out_date: string
  payment_method: string
  total_price: number
  quantity: number
  note: string
}
