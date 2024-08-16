type TError = {
  code: number
  type: string
  message: string
}

type TErrorResponse = {
  response: {
    data: {
      error: TError
    }
  }
}

type TCallback = () => void

type TOnErrorCallback = (error: TErrorResponse) => void
type TOnSuccessCallback<T> = (data: T) => void

type TListResponse<T> = {
  data: T[]
  total: number
}

type TGeneralTypeModel = {
  id: number
  class: string
  label_en: string
  label_vi: string
  desc_en: string
  desc_vi: string
  order: number
}

type TFacilityModel = {
  id: number
  type: string
  class_en: string
  class_vi: string
  name_en: string
  name_vi: string
}

type TRoomTypeModel = {
  id: number
  type_name: string
  check_in_time: string
  check_out_time: string
  include_breakfast: boolean
  facilities: TFacilityModel[]
}

type TPublicRoom = {
  image: ImageSourcePropType
  images: any[]
  id: number
  room_name: string
  max_occupancy: number
  width: number
  length: number
  max_price: number
  current_price: number
  online_method_reduction: number
  on_cash_method_reduction: number
  room_type: TRoomTypeModel
  bed_type: TGeneralTypeModel
  branch?: TBranchDetailsData
}

type TPublicBranch = {
  id: number
  name: string
  district: string
  province_city: string
  min_price: number
  max_price: number
  star_level?: number
  review_quantity?: number
}

type TPublicBranchListParams = {
  searchText: string
  startDate: Date
  endDate: Date
  roomTotals: number
  occupants: number
  l: BRANCH_PAGE_LIMIT
}

type TPublicBranchRoomListParams = {
  branch_id: number
  l: BRANCH_PAGE_LIMIT
}

type TPublicBranchDetailsScreenProps = {
  name: string
  image: ImageSourcePropType
  rating: number
  price: number
}

type TListResponse<T> = {
  data: T[]
  total: number
}

type TFileResponse = {
  id: string
  created_at: string
  path_name: string
  file_name: string
  field: string
  attachment_id: number
  attachment_type: string
  get_url: string
  upload_url: string
  sort_order: string
}

type TErrorResponse = {
  response: {
    data: {
      error: TError
    }
  }
}

interface TBranchType {
  class: string
  created_at: string
  deleted_at: string | null
  desc_en: string
  desc_vi: string
  id: number
  label_en: string
  label_vi: string
  order: number
  updated_at: string
}

interface TBranchDetailsData {
  address: string
  branch_name: string
  description: string
  district: string
  full_address: string
  id: number
  latitude: string
  longitude: string
  main_facilities: TFacilityModel[]
  province_city: string
  reception_area: boolean
  type: TBranchType
  ward: string
  min_price: number
  max_price: number
  image: string | null
  cancellation_time_unit: string
  cancellation_time_value: number
  general_policy: string
  ratings: TRatingResponse[]
  has_paypal: boolean
}

// Now, combine all interfaces into a single one representing the entire data structure
interface TBranchDetailsResponse {
  data: TBranchDetailsData
}

type TBookingModel = {
  id: number
  user_id: number
  room_id: number
  check_in_date: string
  check_out_date: string
  payment_method: string
  total_price: number
  status: string
  note: string
  quantity: number
  reason: string
  room: TPublicRoom
}

type TSurveyItem = {
  id: number
  en: string
  vi: string
}

type TRatingResponse = {
  id: number
  username: string
  rating: number
  comment: string
  created_at: string
}

type TFeaturedBranch = {
  district: string
  id: number
  max_price: number
  min_price: number
  name: string
  province_city: string
  star_level: number
  review_quantity: number
}

type TDeviceModel = {
  id: number
  user_id: number
  brand: string
  model: string
  os: string
  os_version: string
  push_token: string
  is_active: boolean
}
