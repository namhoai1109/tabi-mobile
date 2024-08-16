type TSlide = {
  id: number
  title: string
  titleVi: string
  description: string
  descriptionVi: string
  image: ImageSourcePropType
  component?: React.ComponentType<any>
}

type TActivity = {
  id: number
  en: string
  vi: string
}
