import React, { FC, useState } from "react"
import { Icon, Text } from "app/components/core"
import { TouchableOpacity, View, Animated, StyleSheet } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { colors } from "app/theme/colors"
import { styled } from "nativewind"
import { setSearchText } from "app/hooks/useSearch"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { TAppStackScreenProps } from "app/navigators/AppNavigator"
import provincesAndCities from "app/constants/provincesAndCities"
import { spacing } from "app/theme"
import { translate, getLocale } from "app/i18n"

const StyledSafeAreaView = styled(SafeAreaView)
const StyledAnimatedView = styled(Animated.View)
const StyledText = styled(Text)
const StyledIcon = styled(Icon)
const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface ICityPickerScreenProps extends TAppStackScreenProps<"CityPickerScreen"> {}

const CityPickerScreen: FC<ICityPickerScreenProps> = function CityPickerScreen({ navigation }) {
  const [value, setValue] = useState<any>(null)
  const [isFocus, setIsFocus] = useState(false)
  const { top } = useSafeAreaInsets()
  const locale = getLocale()
  const isEn = locale === "en-US"

  const StickyHeader = () => {
    return (
      <StyledAnimatedView
        style={{
          paddingTop: top + spacing.s4,
        }}
        className="px-4 pb-3 bg-primary-dominant flex flex-row items-center justify-between"
      >
        <StyledTouchableOpacity
          onPress={() => navigation.goBack()}
          className="rounded-full flex items-center justify-start"
        >
          <StyledIcon icon="back" size={20} color={colors.palette.textLight} />
        </StyledTouchableOpacity>
        <StyledView className="flex flex-col items-start justify-start">
          <StyledText size="md" className="font-bold text-light">
            {translate("homeScreen.cityPickerScreen.title")}
          </StyledText>
        </StyledView>
        <View />
      </StyledAnimatedView>
    )
  }
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: colors.palette.primaryDominant }]}>
          {translate("homeScreen.cityPickerScreen.label")}
        </Text>
      )
    }
    return null
  }

  return (
    <StyledSafeAreaView
      edges={["bottom"]}
      className="w-full h-full flex flex-column items-center justify-between bg-white"
    >
      <StyledView className="w-full h-full">
        <StickyHeader />
        <StyledView style={styles.container}>
          {renderLabel()}
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: colors.palette.primaryDominant }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={provincesAndCities}
            search
            maxHeight={300}
            searchField={isEn ? "label_en" : "label"}
            labelField={isEn ? "label_en" : "label"}
            valueField="value"
            placeholder={
              !isFocus
                ? translate("homeScreen.cityPickerScreen.placeholder")
                : translate("homeScreen.cityPickerScreen.label")
            }
            searchPlaceholder={translate("homeScreen.cityPickerScreen.searchPlaceholder")}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setSearchText(item.label)
              setValue(item.value)
              setIsFocus(false)
            }}
            renderLeftIcon={() => (
              <StyledIcon
                style={styles.icon}
                color={isFocus ? colors.palette.primaryDominant : "black"}
                icon="crosshair"
                size={16}
              />
            )}
          />
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
  },
  dropdown: {
    height: 60,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginLeft: 2,
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 16,
    height: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
})

export default CityPickerScreen
