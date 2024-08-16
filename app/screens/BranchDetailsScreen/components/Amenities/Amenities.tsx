import React, { useRef } from "react"
import { Text } from "app/components/core"
import { styled } from "nativewind"
import { TouchableOpacity, View } from "react-native"
import { getLocale, translate } from "app/i18n"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"
import { spacing } from "app/theme"
import AllAmenitiesContent from "../AllAmenitiesContent"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface IAmenitiesProps {
  dataSourceCords: {
    [key: string]: number
  }
  setDataSourceCords: React.Dispatch<
    React.SetStateAction<{
      [key: string]: number
    }>
  >
  branchDetails: TBranchDetailsData | undefined
}

const Amenities: React.FC<IAmenitiesProps> = ({
  dataSourceCords,
  setDataSourceCords,
  branchDetails,
}) => {
  const locale = getLocale()
  const isEn = locale === "en-US"
  const allAmenitiesRef = useRef<TBottomSheet>(null)

  return (
    <StyledView
      key={"Amenities"}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout
        dataSourceCords["Amenities"] = layout.y + 233
        setDataSourceCords(dataSourceCords)
      }}
      className="px-6"
    >
      <StyledText className="text-lg font-bold mb-2">
        {translate("branchDetailsScreen.scrollToItems.Amenities")}
      </StyledText>
      <StyledView className="max-w-full flex flex-row items-start justify-start gap-4 flex-wrap">
        {branchDetails?.main_facilities.slice(0, 5).map((item: any) => (
          <StyledView
            key={item.id}
            className="p-1 bg-light border-2 border-primary-dominant rounded-md"
          >
            <StyledText className="text-sm text-primary-dominant">
              {isEn ? item.name_en : item.name_vi}
            </StyledText>
          </StyledView>
        ))}
        <StyledView className="w-full flex items-center justify-center">
          <StyledTouchableOpacity
            onPress={() => {
              allAmenitiesRef.current?.open()
            }}
          >
            <StyledText
              className="text-md text-primary-dominant font-bold"
              tx="branchDetailsScreen.viewAll"
            ></StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
      <BottomSheet
        height={800}
        ref={allAmenitiesRef}
        customStyles={{
          container: {
            borderTopLeftRadius: spacing.s6,
            borderTopRightRadius: spacing.s6,
          },
        }}
      >
        <AllAmenitiesContent branchDetails={branchDetails} />
      </BottomSheet>
    </StyledView>
  )
}

export default Amenities
