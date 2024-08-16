import React from "react"
import { Text } from "app/components/core"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { colors } from "app/theme/colors"
import { styled } from "nativewind"
import { useSurveyState, setLocationTypes, clearActivities } from "app/hooks/useSurveyState"
import { getLocale } from "app/i18n"
import { locationTypesDatas } from "../../activities"

const StyledView = styled(View)
const StyledTouchableOpacity = styled(TouchableOpacity)

const LocationType = () => {
  const locale = getLocale()
  const isEn = locale === "en-US"

  const { locationTypes } = useSurveyState()

  const toggleSelection = (item: TSurveyItem) => {
    clearActivities()
    let newSelectedTypes

    if (locationTypes.map((type) => type.id).includes(item.id)) {
      newSelectedTypes = locationTypes.filter((selectedItem) => selectedItem.id !== item.id)
    } else {
      if (locationTypes.length < 2) {
        newSelectedTypes = [...locationTypes, item]
      } else {
        return
      }
    }
    setLocationTypes(newSelectedTypes)
  }

  return (
    <StyledView style={styles.container}>
      {locationTypesDatas.map((item, index) => {
        const isSelected = locationTypes.map((type) => type.id).includes(item.id)
        return (
          <StyledTouchableOpacity
            key={index}
            onPress={() => toggleSelection(item)}
            style={[
              styles.button,
              {
                backgroundColor: isSelected
                  ? colors.palette.primaryDominant
                  : colors.palette.textLight,
                borderColor: isSelected ? colors.palette.primaryDominant : colors.palette.grey,
              },
            ]}
          >
            <Text style={{ color: isSelected ? colors.palette.textLight : colors.palette.grey }}>
              {isEn ? item.en : item.vi}
            </Text>
          </StyledTouchableOpacity>
        )
      })}
    </StyledView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
})

export default LocationType
