type TBranchResponse = {
  data: TPublicBranch
  file: TFileResponse
}

type TBranchListResponse = {
  data: TBranchResponse[]
  total: number
}

type TRoomResponse = {
  data: TPublicRoom
  files: TFileResponse[]
}

type TRoomListResponse = {
  data: TRoomResponse[]
  total: number
}

type TRateBranchRequest = {
  rating: number
  booking_id: number
  room_id: number
  comment: string
}
