import { AxiosResponse } from "axios"
import { paymentRequest } from "../axios"
import { CAPTURE_PAYMENT_PATH, CREATE_PAYMENT_PATH } from "./paths"

export const createPayment = async (data: TCreatePaymentRequest) => {
  return paymentRequest.post<TCreatePaymentResponse, AxiosResponse<TCreatePaymentResponse>>(
    CREATE_PAYMENT_PATH,
    data,
  )
}

export const captureOrder = async (orderID: string, data: TCapturePaymentRequest) => {
  return paymentRequest.post<TCapturePaymentResponse, AxiosResponse<TCapturePaymentResponse>>(
    CAPTURE_PAYMENT_PATH + `/${orderID}`,
    data,
  )
}
