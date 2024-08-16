type TCreatePaymentRequest = {
  room_id: number
  quantity: number
  price: number
}

type TCreatePaymentResponse = {
  approve_link: string
}

type TCapturePaymentResponse = {
  message: string
}

type TCapturePaymentRequest = {
  room_id: number
  check_in_date: string
  check_out_date: string
  payment_method: string
  total_price: number
  quantity: number
  note: string
}

type TCaptureOrderMutationRequest = {
  orderID: string
  data: TCapturePaymentRequest
}
