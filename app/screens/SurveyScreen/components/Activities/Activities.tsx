import React from "react"
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { styled } from "nativewind"
import { setActivities, useSurveyState } from "app/hooks/useSurveyState"
import { colors } from "app/theme/colors"
import { getLocale } from "app/i18n"
import { indoors, outdoors, food_beverage, transportation_tours } from "../../activities"

const StyledTouchableOpacity = styled(TouchableOpacity)

const Activities = () => {
  const locale = getLocale()
  const isEn = locale === "en-US"

  const { locationTypes, activities } = useSurveyState()

  // Filter activities based on selected location types
  const filteredActivities = () => {
    let activities: TActivity[] = []
    if (!locationTypes.some((location) => [1, 2, 3, 4].includes(location.id))) {
      activities = activities.concat(indoors)
      activities = activities.concat(food_beverage)
    }

    // Add activities based on selected location types
    locationTypes.forEach((location) => {
      if (location.id === 1) {
        activities = activities.concat(indoors)
      }
      if (location.id === 2) {
        activities = activities.concat(outdoors)
      }
      if (location.id === 3) {
        activities = activities.concat(food_beverage)
      }
      if (location.id === 4) {
        activities = activities.concat(transportation_tours)
      }
    })

    return activities
  }

  // Function to handle activity selection
  const toggleActivitySelection = (activity: TSurveyItem) => {
    if (activities.map((act) => act.id).includes(activity.id)) {
      setActivities(activities.filter((item) => item.id !== activity.id))
    } else {
      if (activities.length < 5) {
        setActivities([...activities, { id: activity.id, en: activity.en, vi: activity.vi }])
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {filteredActivities().map((activity, index) => (
        <StyledTouchableOpacity
          key={index}
          style={[
            styles.activityItem,
            {
              backgroundColor: activities.map((act) => act.id).includes(activity.id)
                ? colors.palette.primaryDominant
                : colors.palette.textLight,
              borderColor: activities.map((act) => act.id).includes(activity.id)
                ? colors.palette.primaryDominant
                : colors.palette.grey,
            },
          ]}
          onPress={() => toggleActivitySelection(activity)}
        >
          <Text
            style={{
              color: activities.map((act) => act.id).includes(activity.id)
                ? colors.palette.textLight
                : colors.palette.grey,
            }}
          >
            {isEn ? activity.en : activity.vi}
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
    paddingBottom: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  activityItem: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
})

export default Activities
