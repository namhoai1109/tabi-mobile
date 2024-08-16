import React from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { styled } from "nativewind"
import { useSurveyState, setPreferredSeasons } from "app/hooks/useSurveyState"
import { colors } from "app/theme/colors"
import { getLocale } from "app/i18n"
import { seasons } from "../../activities"

const StyledTouchableOpacity = styled(TouchableOpacity)

const PreferredSeasons = () => {
  const locale = getLocale()
  const isEn = locale === "en-US"

  const { preferredSeasons } = useSurveyState()

  // Function to handle preferred season selection
  const togglePreferredSeasonsSelection = (season: TSurveyItem) => {
    if (preferredSeasons.map((sea) => sea.id).includes(season.id)) {
      setPreferredSeasons(preferredSeasons.filter((item) => item.id !== season.id))
    } else {
      setPreferredSeasons([...preferredSeasons, { id: season.id, en: season.en, vi: season.vi }])
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {seasons.map((item, index) => (
        <StyledTouchableOpacity
          key={index}
          style={[
            styles.seasonItem,
            {
              backgroundColor: preferredSeasons.map((sea) => sea.id).includes(item.id)
                ? colors.palette.primaryDominant
                : colors.palette.textLight,
              borderColor: preferredSeasons.map((sea) => sea.id).includes(item.id)
                ? colors.palette.primaryDominant
                : colors.palette.grey,
            },
          ]}
          onPress={() => togglePreferredSeasonsSelection(item)}
        >
          <Text
            style={{
              color: preferredSeasons.map((sea) => sea.id).includes(item.id)
                ? colors.palette.textLight
                : colors.palette.grey,
            }}
          >
            {isEn ? item.en : item.vi}
          </Text>
        </StyledTouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  seasonItem: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
})

export default PreferredSeasons
