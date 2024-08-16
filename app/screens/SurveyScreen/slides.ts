import LocationType from "./components/LocationType"
import Activities from "./components/Activities"
import PreferredSeasons from "./components/PreferredSeasons"

const slide1 = require("../../../assets/images/slides/slide1.png")
const slide2 = require("../../../assets/images/slides/slide2.png")
const slide3 = require("../../../assets/images/slides/slide3.png")

export const slides = [
  {
    id: 0,
    title: "Type of tourism activity",
    titleVi: "Loại hoạt động du lịch",
    description:
      "What kind of activities would you like to include in your dream vacation? (Select up to 2)",
    descriptionVi:
      "Bạn muốn bao gồm loại hoạt động nào trong kỳ nghỉ mơ ước của bạn? (Chọn tối đa 2)",
    image: slide1,
    component: LocationType,
  },
  {
    id: 1,
    title: "Activities",
    titleVi: "Các hoạt động",
    description:
      "Based on your chosen type of tourism activity, which of these experiences would you most enjoy? (Select up to 5)",
    descriptionVi:
      "Dựa trên loại hoạt động du lịch bạn chọn, bạn sẽ thích trải nghiệm nào nhất trong số này? (Chọn tối đa 5)",
    image: slide2,
    component: Activities,
  },
  {
    id: 2,
    title: "Preferred season",
    titleVi: "Mùa ưa thích",
    description: "Which season do you prefer for your vacation?",
    descriptionVi: "Bạn thích mùa nào cho kỳ nghỉ của mình?",
    image: slide3,
    component: PreferredSeasons,
  },
]
