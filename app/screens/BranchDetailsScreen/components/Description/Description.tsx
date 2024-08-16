import { Text } from "app/components/core"
import { styled } from "nativewind"
import { View } from "react-native"
import { translate } from "app/i18n"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { useRef } from "react"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"
import { spacing } from "app/theme"

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)

interface IDescriptionProps {
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

const Description: React.FC<IDescriptionProps> = ({
  dataSourceCords,
  setDataSourceCords,
  branchDetails,
}) => {
  const bsRef = useRef<TBottomSheet>(null)

  return (
    <StyledView
      key={"Description"}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout
        dataSourceCords["Description"] = layout.y + 232
        setDataSourceCords(dataSourceCords)
      }}
      className="px-6"
    >
      <StyledText className="text-lg font-bold mb-2">
        {translate("branchDetailsScreen.scrollToItems.Description")}
      </StyledText>
      <StyledView className="max-h-20 overflow-visible">
        <StyledText className="text-sm text-neutral-500" ellipsizeMode="tail" numberOfLines={3}>
          {branchDetails?.description}
        </StyledText>
      </StyledView>
      <StyledView className="w-full flex flex-row items-center justify-center mt-3">
        <StyledTouchableOpacity
          onPress={() => {
            bsRef.current?.open()
          }}
        >
          <StyledText
            className="text-md text-primary-dominant font-bold"
            tx="branchDetailsScreen.viewAll"
          ></StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      <BottomSheet
        height={600}
        ref={bsRef}
        customStyles={{
          container: {
            borderTopLeftRadius: spacing.s6,
            borderTopRightRadius: spacing.s6,
          },
        }}
      >
        <StyledView>
          <StyledView className="flex flex-row items-center justify-start py-2 px-6 border-b border-neutral-300">
            <StyledText preset="subheading" tx="branchDetailsScreen.scrollToItems.Description" />
          </StyledView>
          <StyledScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: 552,
              paddingLeft: spacing.s4,
              paddingRight: spacing.s4,
            }}
          >
            <StyledText>{branchDetails?.description}</StyledText>
          </StyledScrollView>
        </StyledView>
      </BottomSheet>
    </StyledView>
  )
}

export default Description
