import Skeleton from "app/components/core/Skeleton"
import { styled } from "nativewind"
import React from "react"
import { View } from "react-native"

const StyledView = styled(View)

const SkeletonDestinationList = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <StyledView
          key={`skeleton_destination_${index}`}
          className="w-full flex flex-row mt-2 p-2 rounded-xl"
        >
          <Skeleton width={100} height={100} borderRadius={5} />
          <StyledView className="w-[260px] pl-3 ml-3 flex flex-col gap-2">
            <Skeleton width="80%" height={25} borderRadius={5} />
            <Skeleton width="50%" height={20} borderRadius={5} />
            <Skeleton width="90%" height={20} borderRadius={5} />
          </StyledView>
        </StyledView>
      ))}
    </>
  )
}

export default SkeletonDestinationList
