import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react"
import { colors } from "app/theme"

interface IBottomSheetProps {
  animationType?: "none" | "slide" | "fade"
  height: number
  minClosingHeight?: number
  openDuration?: number
  closeDuration?: number
  closeOnDragDown?: boolean
  closeOnPressMask?: boolean
  dragFromTopOnly?: boolean
  closeOnPressBack?: boolean
  keyboardAvoidingViewEnabled?: boolean
  customStyles?: any
  onClose?: () => void
  onOpen?: () => void
  children?: React.ReactNode
}

export type TBottomSheet = {
  open: () => void
  close: () => void
}

const BottomSheet = forwardRef(function BottomSheet(props: IBottomSheetProps, ref: any) {
  const {
    animationType,
    closeOnDragDown,
    dragFromTopOnly,
    closeOnPressMask,
    closeOnPressBack,
    children,
    customStyles,
    keyboardAvoidingViewEnabled,
    height,
  } = props

  const animatedHeight = useMemo(() => new Animated.Value(0), [])
  const [modalVisible, setModalVisible] = useState(false)

  const pan = useMemo(() => new Animated.ValueXY(), [])
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => closeOnDragDown || false,
        onPanResponderMove: (e, gestureState) => {
          if (gestureState.dy > 0) {
            Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(e, gestureState)
          }
        },
        onPanResponderRelease: (e, gestureState) => {
          if (height / 4 - gestureState.dy < 0) {
            showModal(false, props)
          } else {
            Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
          }
        },
      }),
    [pan],
  )

  const showModal = useCallback(
    function (visible: boolean, props: IBottomSheetProps) {
      const { height, minClosingHeight, openDuration, closeDuration, onClose, onOpen } = props
      if (visible) {
        setModalVisible(visible)
        if (typeof onOpen === "function") onOpen()
        Animated.timing(animatedHeight, {
          useNativeDriver: false,
          toValue: height,
          duration: openDuration,
        }).start()
      } else {
        Animated.timing(animatedHeight, {
          useNativeDriver: false,
          toValue: minClosingHeight || 0,
          duration: closeDuration,
        }).start(() => {
          pan.setValue({ x: 0, y: 0 })
          setModalVisible(visible)
          if (typeof onClose === "function") onClose()
        })
      }
    },
    [props],
  )

  useImperativeHandle(ref, () => ({
    open() {
      showModal(true, props)
    },
    close() {
      showModal(false, props)
    },
  }))

  const panStyle = {
    transform: pan.getTranslateTransform(),
  }

  return (
    <Modal
      transparent
      animationType={animationType}
      visible={modalVisible}
      supportedOrientations={[
        "portrait",
        "portrait-upside-down",
        "landscape",
        "landscape-left",
        "landscape-right",
      ]}
      onRequestClose={() => {
        if (closeOnPressBack) showModal(false, props)
      }}
    >
      <KeyboardAvoidingView
        enabled={keyboardAvoidingViewEnabled}
        behavior="padding"
        style={[styles.wrapper, customStyles.wrapper]}
      >
        <TouchableOpacity
          style={styles.mask}
          activeOpacity={1}
          onPress={() => (closeOnPressMask ? showModal(false, props) : null)}
        />
        <Animated.View
          {...(!dragFromTopOnly && panResponder.panHandlers)}
          style={[panStyle, styles.container, { height: animatedHeight }, customStyles.container]}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  )
})

BottomSheet.defaultProps = {
  animationType: "none",
  height: 260,
  minClosingHeight: 0,
  openDuration: 300,
  closeDuration: 200,
  closeOnDragDown: false,
  dragFromTopOnly: false,
  closeOnPressMask: true,
  closeOnPressBack: true,
  keyboardAvoidingViewEnabled: Platform.OS === "ios",
  customStyles: {},
  onClose: undefined,
  onOpen: undefined,
  children: <View />,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.palette.light,
    height: 0,
    overflow: "hidden",
    width: "100%",
  },
  draggableContainer: {
    alignItems: "center",
    backgroundColor: colors.transparent,
    width: "100%",
  },
  draggableIcon: {
    backgroundColor: colors.palette.neutral400,
    borderRadius: 5,
    height: 5,
    margin: 10,
    width: 35,
  },
  mask: {
    backgroundColor: colors.transparent,
    flex: 1,
  },

  wrapper: {
    backgroundColor: colors.bgDarkWrapper,
    flex: 1,
  },
})

export default BottomSheet
