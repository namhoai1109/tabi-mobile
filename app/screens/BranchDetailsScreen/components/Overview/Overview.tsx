import { IconFill } from "@ant-design/icons-react-native"
import { Icon, Text } from "app/components/core"
import { styled } from "nativewind"
import { View } from "react-native"
import { colors } from "app/theme"
import { getLocale } from "app/i18n"

const StyledView = styled(View)
const StyledIcon = styled(Icon)
const StyledIconFill = styled(IconFill)
const StyledText = styled(Text)

interface IOverviewProps {
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

const Overview: React.FC<IOverviewProps> = ({
  dataSourceCords,
  setDataSourceCords,
  branchDetails,
}) => {
  const locale = getLocale()
  const isEn = locale === "en-US"
  const ratings = branchDetails?.ratings || []

  const stars = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length

  return (
    <StyledView
      key={"Overview"}
      onLayout={() => {
        dataSourceCords["Overview"] = 0
        setDataSourceCords(dataSourceCords)
      }}
      className="px-6"
    >
      <StyledText className="text-xl font-bold">{branchDetails?.branch_name}</StyledText>
      <StyledView className="flex-row items-center space-x-1">
        <StyledIconFill className="w-4 h-4 text-yellow-400" name="star"></StyledIconFill>
        <StyledText className="text-sm">
          <StyledText className="text-sm">{stars}</StyledText>
          <StyledText className="text-sm text-gray-700">
            {` (${ratings.length} review${ratings.length > 1 && "s"})`} ·{" "}
            <StyledText className="text-sm font-semibold">
              {isEn ? branchDetails?.type.label_en : branchDetails?.type.label_vi}
            </StyledText>
          </StyledText>
        </StyledText>
      </StyledView>
      <StyledView className="flex-row items-center space-x-1">
        <StyledIcon icon="location" size={16} color={colors.palette.grey} />
        <StyledText className="text-gray-700 text-sm">{branchDetails?.full_address}</StyledText>
      </StyledView>
    </StyledView>
  )
}

export default Overview
