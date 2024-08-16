import { Platform } from "react-native"

/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  BOOKING_ENDPOINT: Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000",
  PAYMENT_ENDPOINT: Platform.OS === "android" ? "http://10.0.2.2:3003" : "http://localhost:3003",
  FILE_ENDPOINT: Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001",
  NOTIFICATION_ENDPOINT:
    Platform.OS === "android" ? "http://10.0.2.2:3002" : "http://localhost:3002",
  PLAN_ENDPOINT: Platform.OS === "android" ? "http://10.0.2.2:3002" : "http://localhost:3002",
  AI_ENDPOINT: "https://tabi-ai.onrender.com/api/v1/plan",
}
