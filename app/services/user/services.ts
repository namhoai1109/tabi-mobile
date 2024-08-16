import { useQuery } from "react-query"
import { getMe } from "./callers"

export const keyUser = {
  ME: "ME",
}

export const useGetMe = () => {
  return useQuery({
    queryKey: keyUser.ME,
    queryFn: () => getMe(),
  })
}
