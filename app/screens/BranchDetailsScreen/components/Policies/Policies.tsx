import { IconFill } from "@ant-design/icons-react-native"
import { Text } from "app/components/core"
import { styled } from "nativewind"
import { TouchableOpacity, View } from "react-native"
import { translate } from "app/i18n"
import { getCancellationTimeUnitLabel } from "app/services/branch/services"
import BottomSheet, { TBottomSheet } from "app/components/core/BottomSheet"
import { spacing } from "app/theme"
import { ScrollView } from "react-native-gesture-handler"
import { useRef } from "react"

const StyledView = styled(View)
const StyledIconFill = styled(IconFill)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface IPoliciesProps {
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

const Policies: React.FC<IPoliciesProps> = ({
  dataSourceCords,
  setDataSourceCords,
  branchDetails,
}) => {
  const bsRef = useRef<TBottomSheet>(null)

  return (
    <StyledView
      key={"Policies"}
      onLayout={(event) => {
        const layout = event.nativeEvent.layout
        dataSourceCords["Policies"] = layout.y + 232
        setDataSourceCords(dataSourceCords)
      }}
      className="px-6"
    >
      <StyledText className="text-lg font-bold mb-2">
        {translate("branchDetailsScreen.scrollToItems.Policies")}
      </StyledText>
      <StyledView className="w-full h-12 mb-4 px-3 flex flex-row items-center justify-center rounded-lg bg-primary-dominant-lighter">
        <StyledIconFill name="alert" className="text-primary-dominant mr-2" />
        <StyledText
          className="text-xs text-primary-dominant"
          tx="branchDetailsScreen.policy.attention"
        />
      </StyledView>
      <StyledView className="w-full flex flex-column items-start justify-start gap-4 pr-4">
        <StyledView className="w-full flex flex-row items-start justify-start gap-2">
          <StyledView className="w-full flex flex-col items-start justify-start pr-4">
            <StyledText
              className="text-sm font-bold"
              tx="branchDetailsScreen.policy.cancellationTime.title"
            />
            <StyledText className="text-sm">
              {`${translate("branchDetailsScreen.policy.cancellationTime.firstParagraph")} ${
                branchDetails?.cancellation_time_value
              } ${translate(
                getCancellationTimeUnitLabel(branchDetails?.cancellation_time_unit || ""),
              ).toLocaleLowerCase()} ${translate(
                "branchDetailsScreen.policy.cancellationTime.secondParagraph",
              )}`}
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledView className="w-full flex flex-row items-start justify-start gap-2">
          <StyledView className="w-full flex flex-col items-start justify-start pr-4">
            <StyledText
              className="text-sm font-bold"
              tx="branchDetailsScreen.policy.generalPolicy"
            />
            <StyledText className="text-sm" ellipsizeMode="tail" numberOfLines={8}>
              {branchDetails?.general_policy}
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledView className="w-full flex items-center justify-center">
          <StyledTouchableOpacity
            className="mt-2"
            onPress={() => {
              bsRef.current?.open()
            }}
          >
            <StyledText className="text-md text-primary-dominant font-bold">Read all</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
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
            <StyledText preset="subheading" tx="branchDetailsScreen.policy.generalPolicy" />
          </StyledView>
          <StyledScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: 552,
              paddingLeft: spacing.s4,
              paddingRight: spacing.s4,
            }}
          >
            <StyledText>{branchDetails?.general_policy}</StyledText>
          </StyledScrollView>
        </StyledView>
      </BottomSheet>
    </StyledView>
  )
}

export default Policies
