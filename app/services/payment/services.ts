import { useMutation } from "react-query"
import { captureOrder, createPayment } from "./callers"
import { AxiosResponse } from "axios"

export const keyPayment = {
  payment: "PAYMENT",
}

export const RETURN_URL = "https://namhoai1109.github.io/processing/"
export const CANCEL_URL = "https://example.com/cancel"
export const ORDER_STATUS_COMPLETED = "COMPLETED"
export const PAYPAL_PAYMENT_METHOD = "ONLINE"
export const ON_SITE_PAYMENT_METHOD = "CASH"

export const useCreatePayment = (
  onSuccess?: TOnSuccessCallback<AxiosResponse<TCreatePaymentResponse, any>>,
) => {
  return useMutation({
    mutationKey: keyPayment.payment,
    mutationFn: (data: TCreatePaymentRequest) => createPayment(data),
    onSuccess,
  })
}

export const useCapturePayment = (
  onSuccess?: TOnSuccessCallback<AxiosResponse<TCapturePaymentResponse, any>>,
) => {
  return useMutation({
    mutationKey: keyPayment.payment,
    mutationFn: ({ orderID, data }: TCaptureOrderMutationRequest) => captureOrder(orderID, data),
    onSuccess,
  })
}
