import axios from "axios"
import Config from "app/config"
import { useInterceptors, useTokenInterceptors } from "./interceptors"

export const authBookingRequest = axios.create({
  baseURL: Config.BOOKING_ENDPOINT,
})
useTokenInterceptors(authBookingRequest)

export const bookingRequest = axios.create({
  baseURL: Config.BOOKING_ENDPOINT,
})
useInterceptors(bookingRequest)

export const paymentRequest = axios.create({
  baseURL: Config.PAYMENT_ENDPOINT,
})
useTokenInterceptors(paymentRequest)

export const fileRequest = axios.create({
  baseURL: Config.FILE_ENDPOINT,
})
useInterceptors(fileRequest)

export const authNotificationRequest = axios.create({
  baseURL: Config.NOTIFICATION_ENDPOINT,
})
useTokenInterceptors(authNotificationRequest)
export const planRequest = axios.create({
  baseURL: Config.PLAN_ENDPOINT,
})
useTokenInterceptors(planRequest)

export const aiRequest = axios.create({
  baseURL: Config.AI_ENDPOINT,
})
useInterceptors(aiRequest)
