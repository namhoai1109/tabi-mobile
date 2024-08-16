import { bookingReviewScreen } from "./en/bookingReviewScreen"
import { roomDetailScreen } from "./en/roomDetailScreen"
import { homeScreen } from "./en/homeScreen"
import { branchListScreen } from "./en/branchListScreen"
import { branchDetailsScreen } from "./en/branchDetailsScreen"
import { bookingScreen } from "./en/bookingScreen"
import { bookingDetailsScreen } from "./en/bookingDetailsScreen"
import { planningScreen } from "./en/planningScreen"
import { accountScreen } from "./en/accountScreen"

const en = {
  common: {
    ok: "OK",
    cancel: "Cancelled",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    inReview: "In review",
    completed: "Completed",
    back: "Back",
    logOut: "Log Out",
    dismiss: "Dismiss",
    hour: "Hour",
    day: "Day",
    week: "Week",
    month: "Month",
    year: "Year",
    checkInAt: "Check-in at",
    checkOutAt: "Check-out at",
  },
  rating: {
    bad: "Bad",
    unsatisfied: "Unsatisfied",
    average: "Average",
    good: "Good",
    excellent: "Excellent",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  datePickerLabel: "Click to select date",
  errors: {
    invalidEmail: "Invalid email address.",
    tokenExpired: "Session expired. Please log in again.",
  },
  loginScreen: {
    signIn: "Sign In",
    signUp: "Sign Up",
    continue: "Continue",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    confirmPasswordFieldLabel: "Confirm Password",
    phoneNumberFieldLabel: "Phone Number",
    firstNameFieldLabel: "First Name",
    lastNameFieldLabel: "Last Name",
    usernameFieldLabel: "Username",
    dobFieldLabel: "Date of Birth",
    dobFieldPlaceholder: "Select your date of birth",
    firstNameFieldPlaceholder: "First name",
    lastNameFieldPlaceholder: "Last name",
    usernameFieldPlaceholder: "Enter your username",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Enter your password",
    confirmPasswordFieldPlaceholder: "Confirm your password",
    phoneNumberFieldPlaceholder: "Enter your phone number",
    tapToSignIn: "Tap to sign in!",
    hint: "Hint: you can use any email address and your favorite password :)",
    noAccount: "You don't have an account?",
    haveAccount: "Already have an account?",
    rememberMe: "Remember me",
  },
  validation: {
    required: "This field is required",
    atLeast6Char: "Must be at least 6 characters",
    isEmailOrPhone: "Must be a email or phone number",
    isEmail: "Must be a valid email address",
    isPhone: "Must be a valid phone number",
    atLeast1Uppercase: "Must contain at least 1 uppercase",
    atLeast1Lowercase: "Must contain at least 1 lowercase",
    atLeast1Number: "Must contain at least 1 number",
    notContainSpace: "Can't contain space",
    mustMatchPassword: "Must match password field",
    atLeast2Char: "Must be at least 2 characters",
  },
  navigator: {
    bookingTab: "Booking",
    accountTab: "Account",
    homeTab: "Home",
  },
  roomDetailScreen,
  bookingReviewScreen,
  homeScreen,
  branchListScreen,
  branchDetailsScreen,
  bookingScreen,
  bookingDetailsScreen,
  planningScreen,
  accountScreen,
}

export default en
export type TTranslations = typeof en
