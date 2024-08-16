import { proxy, useSnapshot } from "valtio"

export type TReservationState = {
  branch: TBranchDetailsData
  room: TRoomResponse
  roomImages: TFileResponse[]
  me: TMeResponse
  checkInDate: Date
  checkOutDate: Date
}
const reservationState = proxy<TReservationState>()

export const useReservation = () => {
  return useSnapshot(reservationState)
}

export const setReservation = (value: TReservationState) => {
  Object.assign(reservationState, value)
}

export const clearReservation = () => {
  reservationState.branch = {} as TBranchDetailsData
  reservationState.room.data = {} as TPublicRoom
  reservationState.roomImages = []
  reservationState.checkInDate = new Date()
  reservationState.checkOutDate = new Date()
}

const isValidRoom = () => {
  const validRoom = !!reservationState.room && Object.keys(reservationState.room).length > 0
  const validRoomType =
    !!reservationState.room.data.room_type &&
    Object.keys(reservationState.room.data.room_type).length > 0

  const validBedType =
    !!reservationState.room.data.bed_type &&
    Object.keys(reservationState.room.data.bed_type).length > 0

  return validRoom && validRoomType && validBedType
}

export const isValidInfoForRoomDetailScreen = () => {
  const validBranch = !!reservationState.branch && Object.keys(reservationState.branch).length > 0
  const validRoomImages = !!reservationState.roomImages && reservationState.roomImages.length > 0
  return validBranch && isValidRoom() && validRoomImages
}

export const isValidInfoForBookingReviewScreen = () => {
  const isValidMe = !!reservationState.me && Object.keys(reservationState.me).length > 0
  const isValidCheckInDate = !!reservationState.checkInDate
  const isValidCheckOutDate = !!reservationState.checkOutDate
  return isValidInfoForRoomDetailScreen() && isValidCheckInDate && isValidCheckOutDate && isValidMe
}
