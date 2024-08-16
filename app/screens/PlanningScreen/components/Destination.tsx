import { Text } from "app/components/core"
import { styled } from "nativewind"
import { useState } from "react"
import { Image, Pressable, View } from "react-native"

interface IDestinationProps {
  destination: TDestinationReadOnly
  onPress?: () => void
}

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledPressable = styled(Pressable)
const StyledImage = styled(Image)

const isValidUrl = (urlString: string) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ) // validate fragment locator
  return !!urlPattern.test(urlString)
}

function Destination({ onPress, destination }: IDestinationProps) {
  const mutableImages = destination?.images?.slice()
  const [currentImage, setCurrentImage] = useState<string>(mutableImages[0])

  const handleError = () => {
    const images = destination?.images?.slice() || []
    const currentIndex = images.indexOf(currentImage)

    if (currentIndex !== -1 && currentIndex < images.length - 1) {
      setCurrentImage(images[currentIndex + 1])
    } else {
      setCurrentImage("")
    }
  }

  return (
    <StyledPressable
      className="w-full flex flex-row mt-2 p-2 rounded-xl overflow-hidden"
      onPress={onPress}
    >
      <StyledImage
        source={
          currentImage !== ""
            ? { uri: currentImage }
            : require("../../../../assets/images/no_image.jpg")
        }
        onError={handleError}
        className="w-[100px] aspect-square rounded-lg"
      />
      <StyledView className="max-w-[260px] ml-3">
        <StyledText preset="bold" numberOfLines={1} className="text-lg line-clamp-1">
          {destination.name}
        </StyledText>
        <StyledText size="xs" numberOfLines={3} className="w-full">
          {destination.location}
        </StyledText>
        {destination.opening_hours !== "" && (
          <StyledView className="flex flex-row">
            <StyledText size="xs" className="mr-2" tx="planningScreen.openingHours" />
            <StyledText size="xs" numberOfLines={2}>
              {destination.opening_hours.split(", ")[0]}
            </StyledText>
          </StyledView>
        )}
      </StyledView>
    </StyledPressable>
  )
}

export default Destination
