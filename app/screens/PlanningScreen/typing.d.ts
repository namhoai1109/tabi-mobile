type TDestination = {
  category: string
  city: string
  duration: string
  id: number
  images: string[]
  location: string
  name: string
  opening_hours: string
  rankings: number
  reviews: number
  website: string
  lat: string
  lng: string
}

type TDestinationReadOnly = {
  readonly category: string
  readonly city: string
  readonly duration: string
  readonly id: number
  readonly images: readonly string[]
  readonly location: string
  readonly name: string
  readonly opening_hours: string
  readonly rankings: number
  readonly reviews: number
  readonly website: string
  readonly lat: string
  readonly lng: string
}

type TTimelineItem = {
  startDate: Date
  endDate: Date
  destination: TDestinationReadOnly | undefined
  timeDifference: number
}

type TPlanningScreenParams = {
  checkInDate: string
  checkOutDate: string
  user_id: number
  city: string
  booking_id: number
  booking: TBookingListResponse
  // dataPlanDetails: AxiosResponse<TPlanDetailsDataResponse, any>
  // refetchPlanDetails: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<AxiosResponse<TPlanDetailsDataResponse, any>, unknown>>
  ids: number[]
}

type TPlanningReviewScreenParams = {
  checkInDate: string
  checkOutDate: string
  datePlans: { [key: string]: TTimelineItem[] }
}

type TDestinationEditMode = {
  isEdit: boolean
  oldDestination: TDestination
  startDate: Date
  endDate: Date
}
