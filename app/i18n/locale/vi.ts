import { roomDetailScreen } from "./vi/roomDetailScreen"
import { bookingReviewScreen } from "./vi/bookingReviewScreen"
import { homeScreen } from "./vi/homeScreen"
import { TTranslations } from "./en"
import { branchListScreen } from "./vi/branchListScreen"
import { branchDetailsScreen } from "./vi/branchDetailsScreen"
import { bookingScreen } from "./vi/bookingScreen"
import { bookingDetailsScreen } from "./vi/bookingDetailsScreen"
import { planningScreen } from "./vi/planningScreen"
import { accountScreen } from "./vi/accountScreen"

const vi: TTranslations = {
  common: {
    ok: "Đồng ý",
    cancel: "Hủy",
    pending: "Đang chờ",
    approved: "Đã chấp nhận",
    rejected: "Bị từ chối",
    inReview: "chờ đánh giá",
    completed: "Hoàn thành",
    back: "Quay lại",
    logOut: "Đăng xuất",
    dismiss: "Bỏ qua",
    hour: "Giờ",
    day: "Ngày",
    week: "Tuần",
    month: "Tháng",
    year: "Năm",
    checkInAt: "Nhận phòng lúc",
    checkOutAt: "Trả phòng lúc",
  },
  rating: {
    bad: "Tệ",
    unsatisfied: "Không hài lòng",
    average: "Trung bình",
    good: "Tốt",
    excellent: "Tuyệt vời",
  },
  errorScreen: {
    title: "Có lỗi xảy ra!",
    friendlySubtitle:
      "Đây là màn hình mà người dùng của bạn sẽ thấy khi có lỗi xảy ra trong sản phẩm. Bạn nên tùy chỉnh thông báo này (nằm trong `app/i18n/vi.ts`) và có thể cả bố cục (`app/screens/ErrorScreen`). Nếu bạn muốn loại bỏ hoàn toàn màn hình này, kiểm tra `app/app.tsx` để tìm <ErrorBoundary> component.",
    reset: "ĐẶT LẠI ỨNG DỤNG",
    traceTitle: "Lỗi từ ngăn xếp của %{name}",
  },
  emptyStateComponent: {
    generic: {
      heading: "Thật trống rỗng... thật buồn",
      content: "Chưa tìm thấy dữ liệu. Hãy thử nhấn nút để làm mới hoặc tải lại ứng dụng.",
      button: "Hãy thử lại đi",
    },
  },
  datePickerLabel: "Nhấn để chọn ngày",
  errors: {
    invalidEmail: "Địa chỉ email không hợp lệ.",
    tokenExpired: "Đã hết phiên đăng nhập. Vui lòng đăng nhập lại.",
  },
  loginScreen: {
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    continue: "Tiếp tục",
    enterDetails:
      "Nhập thông tin của bạn bên dưới để mở khóa thông tin siêu bí mật. Bạn sẽ không bao giờ đoán được những gì chúng tôi đã chuẩn bị. Hoặc có thể bạn sẽ; ở đây không phải là khoa học tên lửa.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Mật khẩu",
    confirmPasswordFieldLabel: "Xác nhận mật khẩu",
    phoneNumberFieldLabel: "Số điện thoại",
    firstNameFieldLabel: "Họ",
    lastNameFieldLabel: "Tên",
    usernameFieldLabel: "Tên đăng nhập",
    dobFieldLabel: "Ngày sinh",
    dobFieldPlaceholder: "Chọn ngày sinh của bạn",
    firstNameFieldPlaceholder: "Họ",
    lastNameFieldPlaceholder: "Tên",
    usernameFieldPlaceholder: "Nhập tên đăng nhập của bạn",
    emailFieldPlaceholder: "Nhập địa chỉ email của bạn",
    passwordFieldPlaceholder: "Nhập mật khẩu của bạn",
    confirmPasswordFieldPlaceholder: "Xác nhận mật khẩu của bạn",
    phoneNumberFieldPlaceholder: "Nhập số điện thoại của bạn",
    tapToSignIn: "Chạm để đăng nhập!",
    hint: "Gợi ý: bạn có thể sử dụng bất kỳ địa chỉ email nào và mật khẩu yêu thích của bạn :)",
    noAccount: "Bạn chưa có tài khoản?",
    haveAccount: "Bạn đã có tài khoản?",
    rememberMe: "Nhớ tài khoản",
  },
  validation: {
    required: "Trường bắt buộc",
    atLeast6Char: "Phải có ít nhất 6 ký tự",
    isEmailOrPhone: "Phải là email hoặc số điện thoại",
    isEmail: "Phải là địa chỉ email hợp lệ",
    isPhone: "Phải là số điện thoại hợp lệ",
    atLeast1Uppercase: "Phải chứa ít nhất 1 chữ hoa",
    atLeast1Lowercase: "Phải chứa ít nhất 1 chữ thường",
    atLeast1Number: "Phải chứa ít nhất 1 số",
    notContainSpace: "Không chứa khoảng trắng",
    mustMatchPassword: "Phải khớp với trường mật khẩu",
    atLeast2Char: "Phải có ít nhất 2 ký tự",
  },
  navigator: {
    bookingTab: "Đặt chỗ",
    accountTab: "Tài khoản",
    homeTab: "Trang chủ",
  },
  roomDetailScreen,
  bookingReviewScreen,
  homeScreen,
  branchListScreen,
  branchDetailsScreen,
  bookingScreen,
  bookingDetailsScreen,
  planningScreen,
  accountScreen,
}

export default vi
