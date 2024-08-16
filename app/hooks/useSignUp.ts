import {
  emailRegex,
  lowercaseRegex,
  numberRegex,
  phoneRegex,
  spaceRegex,
  uppercaseRegex,
} from "app/constants/regex"
import { translate } from "app/i18n"
import { proxy, useSnapshot } from "valtio"

export type TSignUpState = typeof signUpState

export const signUpState = proxy({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  dob: undefined as Date | undefined,
  isValidated: false,
  get validateEmail() {
    if (signUpState.isValidated) {
      if (signUpState.email.length === 0) {
        return translate("validation.required")
      }
      if (signUpState.email.length < 6) {
        return translate("validation.atLeast6Char")
      }
      if (!emailRegex.test(signUpState.email)) {
        return translate("validation.isEmail")
      }
    }
    return ""
  },
  get validatePassword() {
    if (signUpState.isValidated) {
      if (signUpState.password.length === 0) {
        return translate("validation.required")
      }
      if (signUpState.password.length < 6) {
        return translate("validation.atLeast6Char")
      }
      if (!uppercaseRegex.test(signUpState.password)) {
        return translate("validation.atLeast1Uppercase")
      }
      if (!lowercaseRegex.test(signUpState.password)) {
        return translate("validation.atLeast1Lowercase")
      }
      if (!numberRegex.test(signUpState.password)) {
        return translate("validation.atLeast1Number")
      }
      if (spaceRegex.test(signUpState.password)) {
        return translate("validation.notContainSpace")
      }
    }
    return ""
  },
  get validateConfirmPassword() {
    if (signUpState.isValidated) {
      if (signUpState.confirmPassword.length === 0) {
        return translate("validation.required")
      }
      if (signUpState.confirmPassword !== signUpState.password) {
        return translate("validation.mustMatchPassword")
      }
    }
    return ""
  },
  get validateUsername() {
    if (signUpState.isValidated) {
      if (signUpState.username.length === 0) {
        return translate("validation.required")
      }
      if (signUpState.username.length < 6) {
        return translate("validation.atLeast6Char")
      }
      if (spaceRegex.test(signUpState.username)) {
        return translate("validation.notContainSpace")
      }
    }
    return ""
  },
  get validatePhone() {
    if (signUpState.isValidated) {
      if (signUpState.phone.length === 0) {
        return translate("validation.required")
      }
      if (signUpState.phone.length !== 10 || !phoneRegex.test(signUpState.phone)) {
        return translate("validation.isPhone")
      }
    }
    return ""
  },
  get validateFirstName() {
    if (signUpState.isValidated) {
      if (signUpState.firstName.length === 0) {
        return translate("validation.required")
      }
      if (signUpState.firstName.length < 2) {
        return translate("validation.atLeast2Char")
      }
    }
    return ""
  },
  get validateLastName() {
    if (signUpState.isValidated) {
      if (signUpState.lastName.length === 0) {
        return translate("validation.required")
      }
      if (signUpState.lastName.length < 2) {
        return translate("validation.atLeast2Char")
      }
    }
    return ""
  },
  get validateDob() {
    if (signUpState.isValidated) {
      if (signUpState.dob === undefined) {
        return translate("validation.required")
      }
    }
    return ""
  },
})

export const useSignUp = () => {
  return useSnapshot(signUpState)
}

export const setUsername = (value: string) => {
  signUpState.username = value.trim()
}

export const setPassword = (value: string) => {
  signUpState.password = value.trim()
}

export const setConfirmPassword = (value: string) => {
  signUpState.confirmPassword = value.trim()
}

export const setEmail = (value: string) => {
  signUpState.email = value.trim()
}

export const setPhone = (value: string) => {
  if (phoneRegex.test(value)) {
    signUpState.phone = value.trim()
  }
}

export const setFirstName = (value: string) => {
  signUpState.firstName = value.trim()
}

export const setLastName = (value: string) => {
  signUpState.lastName = value.trim()
}

export const setDob = (value: Date) => {
  signUpState.dob = value
}

export const validateCredentialForm = () => {
  signUpState.isValidated = true
  return signUpState.validateEmail === "" && signUpState.validatePhone === ""
}

export const validatePasswordForm = () => {
  signUpState.isValidated = true
  return (
    signUpState.validatePassword === "" &&
    signUpState.validateConfirmPassword === "" &&
    signUpState.password === signUpState.confirmPassword
  )
}

export const turnOffValidation = () => {
  signUpState.isValidated = false
}

export const validatePersonalForm = () => {
  signUpState.isValidated = true
  return (
    signUpState.validateFirstName === "" &&
    signUpState.validateUsername === "" &&
    signUpState.validateLastName === "" &&
    signUpState.dob !== undefined
  )
}

export const getSignUpData = (): TSignUpRequest => {
  return {
    username: signUpState.username,
    password: signUpState.password,
    email: signUpState.email,
    phone: signUpState.phone,
    first_name: signUpState.firstName,
    last_name: signUpState.lastName,
    dob: signUpState.dob?.toISOString() as string,
  }
}

export const resetSignUp = () => {
  signUpState.username = ""
  signUpState.password = ""
  signUpState.confirmPassword = ""
  signUpState.email = ""
  signUpState.phone = ""
  signUpState.firstName = ""
  signUpState.lastName = ""
  signUpState.dob = undefined
  signUpState.isValidated = false
}
