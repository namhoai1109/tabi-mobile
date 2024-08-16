import { ActivityIndicator, Button, Carousel } from "@ant-design/react-native"
import { Icon, Text } from "app/components/core"
import {
  TSignUpState,
  getSignUpData,
  turnOffValidation,
  useSignUp,
  validateCredentialForm,
  validatePasswordForm,
  validatePersonalForm,
} from "app/hooks/useSignUp"
import { colors, spacing } from "app/theme"
import { styled } from "nativewind"
import React, { useRef, useState } from "react"
import { TextInput, View, ViewStyle, Animated } from "react-native"
import CredentialForm from "./CredentialForm"
import PersonalForm from "./PersonalForm"
import { usePostSignUp } from "app/services/authen/services"
import PasswordForm from "./PasswordForm"
import { animCarouselHeight, animWidth } from "./animations"
import FadeView from "app/components/core/FadeView"

export interface IFormProps {
  changeForm?: () => void
  signUpState?: TSignUpState
  textInputRefs: React.MutableRefObject<TextInput[]>
}

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledButton = styled(Button)
const StyledAnimatedView = styled(Animated.View)

const renderButtonIcon = (step: number, isLoading: boolean) => {
  if (step !== 2) {
    return <Icon icon="caretRight" size={spacing.s6} color={colors.background} />
  }

  if (isLoading) {
    return <ActivityIndicator color={colors.background} />
  }

  return null
}

interface ISignUpFormProps {
  onSuccess: TCallback
}

function SignUpForm({ onSuccess }: ISignUpFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const carouselRef = useRef<Carousel>(null)
  const textInputRefs = useRef<TextInput[]>([])
  const signUpSnapshot = useSignUp()
  const { mutate, isLoading } = usePostSignUp(onSuccess)

  const heightCarousel = animCarouselHeight(currentStep, signUpSnapshot)

  const animatedWidth = animWidth(currentStep)

  const moveNextForm = () => {
    turnOffValidation()
    if (currentStep < 2) {
      carouselRef.current?.goTo(currentStep + 1)
      setCurrentStep(currentStep + 1)
    }
  }

  const movePrevForm = () => {
    turnOffValidation()
    if (currentStep > 0) {
      carouselRef.current?.goTo(currentStep - 1)
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <FadeView>
      <StyledView className="-mx-1">
        <StyledAnimatedView
          style={{
            height: heightCarousel,
          }}
        >
          <Carousel
            style={$carousel}
            dots={false}
            ref={carouselRef}
            scrollEnabled={false}
            selectedIndex={currentStep}
          >
            <CredentialForm
              changeForm={moveNextForm}
              textInputRefs={textInputRefs}
              signUpState={signUpSnapshot}
            />
            <PasswordForm
              changeForm={moveNextForm}
              textInputRefs={textInputRefs}
              signUpState={signUpSnapshot}
            />
            <PersonalForm textInputRefs={textInputRefs} signUpState={signUpSnapshot} />
          </Carousel>
        </StyledAnimatedView>
      </StyledView>

      <StyledView className="mt-3 mb-6 relative">
        <StyledButton
          type="primary"
          className="rounded-full h-11 w-11 border-0"
          onPress={() => {
            if (currentStep > 0) {
              movePrevForm()
            }
          }}
        >
          <Icon icon="caretLeft" size={spacing.s6} color={colors.background} />
        </StyledButton>
        <StyledAnimatedView
          style={{
            width: animatedWidth,
          }}
          className="rounded-full overflow-hidden absolute right-0 top-0 bottom-0 h-11"
        >
          <Button
            type="primary"
            onPress={() => {
              if (currentStep === 0 && validateCredentialForm()) {
                moveNextForm()
                textInputRefs.current[1]?.focus()
              }

              if (currentStep === 1 && validatePasswordForm()) {
                moveNextForm()
                textInputRefs.current[3]?.focus()
              }

              if (currentStep === 2 && validatePersonalForm()) {
                mutate(getSignUpData())
              }
            }}
          >
            <StyledView className="flex flex-row justify-center items-center">
              <StyledText
                tx={currentStep !== 2 ? "loginScreen.continue" : "loginScreen.signUp"}
                className="text-light ml-2 leading-5"
              />
              {renderButtonIcon(currentStep, isLoading)}
            </StyledView>
          </Button>
        </StyledAnimatedView>
      </StyledView>
    </FadeView>
  )
}

export default SignUpForm

const $carousel: ViewStyle = {
  height: "100%",
}
