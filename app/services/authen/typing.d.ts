type TSignUpRequest = {
  dob: string
  email: string
  first_name: string
  last_name: string
  password: string
  phone: string
  username: string
}

type TTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

type TSignInRequest = {
  identity: string
  password: string
  remember?: boolean
}

type TChangeNotificationSettingRequest = {
  push_token: string
  is_active: boolean
}
