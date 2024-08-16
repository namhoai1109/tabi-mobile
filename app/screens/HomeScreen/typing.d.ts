type TRecommendedHotel = {
  id: number
  name: string
  image: ImageSourcePropType
  rating: number
  price: number
}

type TPopulationDestination = {
  id: number
  name: string
  image: ImageSourcePropType
  quantity: number
}

type TFeature = {
  key: number
  type: string
  id: number
  title: string
  description: string
  featureItems: TPopulationDestination[]
}
