interface TSchedule {
  booking_id: number
  start_time: string
  end_time: string
  destination_id: number
  destination_name: string
  destination_category: string
  destination_location: string
  destination_website: string
  destination_image: string
  destination_opening_hours: string
  destination_latitude: string
  destination_longitude: string
}

interface TPlan {
  schedules: TSchedule[]
}

type TPlanDetailsDataResponse = {
  data: TPlanDetailsData[]
}

type TPlanDetailsData = {
  destination_longitude: string
  destination_latitude: string
  id: number
  booking_id: number
  start_time: string
  end_time: string
  destination_id: number
  destination_name: string
  destination_category: string
  destination_location: string
  destination_website: string
  destination_image: string
  destination_opening_hours: string
}
