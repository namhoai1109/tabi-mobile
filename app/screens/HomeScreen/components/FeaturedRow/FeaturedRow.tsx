import { styled } from "nativewind"
import React from "react"
import { View, ScrollView } from "react-native"
import { Text } from "app/components/core"
// import PopularDestination from "../PopularDestination"
import RecommendedHotel from "../RecommendedHotel"
// import { translate } from "app/i18n"

// const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledView = styled(View)
const StyledScrollView = styled(ScrollView)
const StyledText = styled(Text)

// function isPopulationDestination(item: any): item is TPopulationDestination {
//   return (item as TPopulationDestination).quantity !== undefined
// }

function FeaturedRow({ featureItems }: { featureItems: TBranchResponse[] | undefined }) {
  if (!featureItems || featureItems.length === 0) return null

  return (
    <StyledView className="pt-4 mt-4">
      <StyledView className="flex flex-row justify-between items-center px-4">
        <StyledView>
          <StyledText
            className="font-bold text-lg"
            tx="homeScreen.featuredRow.featuredBranches.title"
          />
          <StyledText
            className="max-w-[400] text-gray-500 text-xs"
            ellipsizeMode="tail"
            numberOfLines={1}
            tx="homeScreen.featuredRow.featuredBranches.description"
          />
        </StyledView>
      </StyledView>
      <StyledScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="overflow-visible pl-4 mt-2"
      >
        {featureItems?.map((item) => {
          const hotelItem = item as TBranchResponse
          return (
            <RecommendedHotel
              key={hotelItem.data.id}
              branch={hotelItem.data}
              image={hotelItem.file}
            />
          )
        })}
      </StyledScrollView>
    </StyledView>
  )
}

export default FeaturedRow
