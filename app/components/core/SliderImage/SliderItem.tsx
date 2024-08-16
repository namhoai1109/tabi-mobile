import { StyleSheet, View, Dimensions, Image } from "react-native"
import React from "react"
import { DEFAULT_HEIGHT } from "./constant"

interface ISlideItemProps {
  source: TFileResponse
  height?: number
}

const { width } = Dimensions.get("screen")

const SlideItem = ({ source, height }: ISlideItemProps) => {
  const $styleContainers = {
    ...styles.container,
    height: height || DEFAULT_HEIGHT,
  }

  return (
    <View style={$styleContainers}>
      <Image
        source={{ uri: source?.get_url }}
        resizeMode="cover"
        height={height || DEFAULT_HEIGHT}
        style={styles.image}
      />
    </View>
  )
}

export default SlideItem

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: DEFAULT_HEIGHT,
    objectFit: "cover",
    width,
  },
  image: {
    flex: 1,
    width: "100%",
  },
})
