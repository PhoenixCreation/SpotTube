import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

function Test() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      x.value = withSpring(width / 2 - 50, { damping: 2 });
      y.value = withSpring(height / 2 - 50, { damping: 2 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: 100,
      height: 100,
      borderRadius: 100,
      backgroundColor: "red",
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[animatedStyle]} />
      </PanGestureHandler>
    </View>
  );
}

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
