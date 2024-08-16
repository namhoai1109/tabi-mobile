import { Icon, TIconTypes, Text } from "app/components/core"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { colors } from "app/theme"
import { styled } from "nativewind"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { CompositeNavigationProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { TAppStackParamList } from "app/navigators"
import { TTabiTabParamList } from "app/navigators/TabiNavigator"
// import { useLocaleState } from "app/hooks/useLocale"
import { getLocale } from "app/i18n"

interface ExpandableItemProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TTabiTabParamList, "Account", undefined>,
    NativeStackNavigationProp<TAppStackParamList, keyof TAppStackParamList, undefined>
  >
  label: string
  labelVi: string
  isExpanded: boolean
  icon: TIconTypes
  subItem: React.JSX.Element
  onClickFunction: () => void
}

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledIcon = styled(Icon)

export default ({
  label,
  labelVi,
  isExpanded,
  icon,
  subItem,
  onClickFunction,
}: ExpandableItemProps) => {
  const locale = getLocale()
  const isEn = locale === "en-US"

  return (
    <StyledView className="w-full flex flex-col items-start justify-start">
      <StyledTouchableOpacity className="w-full" style={styles.item} onPress={onClickFunction}>
        <StyledView className="flex flex-row items-center justify-between py-2 gap-4">
          <StyledIcon icon={icon} size={20} />
          <StyledText size="sm">{isEn ? label : labelVi}</StyledText>
        </StyledView>
        {isExpanded ? (
          <StyledIcon icon="chevronDown" size={14} color={colors.palette.neutral600} />
        ) : (
          <StyledIcon icon="chevronLeft" size={14} color={colors.palette.neutral600} />
        )}
      </StyledTouchableOpacity>
      {isExpanded && <StyledView className="w-full">{subItem}</StyledView>}
    </StyledView>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.palette.baseBgLight,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  seperator: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#c8c8c8",
  },
})
