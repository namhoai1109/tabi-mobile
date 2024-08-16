import { proxy, useSnapshot } from "valtio"

const today = new Date()
const tomorrow = new Date()

tomorrow.setDate(tomorrow.getDate() + 1)

const searchState = proxy({
  searchText: "",
  startDate: today,
  endDate: tomorrow,
  roomTotals: 1,
})

export const useGetSearchState = () => {
  return useSnapshot(searchState)
}

export const clearSearchState = () => {
  searchState.searchText = ""
  searchState.startDate = today
  searchState.endDate = tomorrow
  searchState.roomTotals = 1
}

export const setSearchText = (search: string) => {
  searchState.searchText = search
}

export const setStartDate = (startDate: Date) => {
  searchState.startDate = startDate
}

export const setEndDate = (endDate: Date) => {
  searchState.endDate = endDate
}

export const setRoomTotals = (roomTotals: number) => {
  searchState.roomTotals = roomTotals
}
