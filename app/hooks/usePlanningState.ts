import { proxy, useSnapshot } from "valtio"

export interface TPlanningState {
  destinationData: TDestination[]
}

const planningState = proxy<TPlanningState>({
  destinationData: [],
})

export const usePlanningState = () => {
  return useSnapshot(planningState)
}

export const setDestinationData = (value: TDestination[]) => {
  planningState.destinationData = value
}
