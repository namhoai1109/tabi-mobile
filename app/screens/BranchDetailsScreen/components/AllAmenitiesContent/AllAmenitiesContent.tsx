import { Text } from "app/components/core"
import { styled } from "nativewind"
import { colors } from "app/theme/colors"
import { ScrollView, View, ViewStyle } from "react-native"
import { getLocale } from "app/i18n"

const StyledView = styled(View)
const StyledText = styled(Text)

interface IAllAmenitiesContentProps {
  branchDetails: TBranchDetailsData | undefined
}

const renderFacilities = (facilities: TFacilityModel[], isVN: boolean) => {
  const dist: { [x: string]: string[] } = {}
  facilities?.forEach((facility) => {
    const classFacility = isVN ? facility.class_vi : facility.class_en
    if (!dist[classFacility]) {
      dist[classFacility] = []
    }
    dist[classFacility].push(isVN ? facility.name_vi : facility.name_en)
  })
  return (
    <StyledView className="flex flex-col">
      {Object.keys(dist).map((key) => {
        const facility = dist[key]
        return (
          <StyledView key={key} className="my-2">
            <StyledText preset="semibold">{key}</StyledText>
            <StyledView className="list-disc pl-3">
              {facility?.map((f) => (
                <StyledView key={f} className="flex flex-row items-center">
                  <StyledView className="w-1 h-1 rounded-full bg-neutral-700 mr-2" />
                  <StyledText>{f}</StyledText>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>
        )
      })}
    </StyledView>
  )
}

const AllAmenitiesContent: React.FC<IAllAmenitiesContentProps> = ({ branchDetails }) => {
  const locale = getLocale()
  const isEn = locale === "en-US"

  return (
    <StyledView className="bg-white">
      <StyledView className="border-b border-neutral-300 px-6">
        <StyledText
          className="text-lg font-bold mb-2 mt-2 text-dark"
          tx="branchDetailsScreen.scrollToItems.Amenities"
        ></StyledText>
      </StyledView>
      <ScrollView
        contentContainerStyle={$scrollViewContentContainerStyle}
        style={{
          height: 752,
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderFacilities(branchDetails?.main_facilities || [], !isEn)}
      </ScrollView>
    </StyledView>
  )
}

const $scrollViewContentContainerStyle: ViewStyle = {
  paddingHorizontal: 24,
  backgroundColor: colors.palette.neutral100,
}

export default AllAmenitiesContent
