import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import VideoComp from "./VideoComp";

const VideosComp = ({ goUp, videos, setCurrentVideo }) => {
  return (
    <ScrollView scrollEventThrottle={16} bounces={false}>
      <View>
        {videos.map((video, i) => {
          return (
            <VideoComp
              setCurrentVideo={setCurrentVideo}
              key={i}
              video={video}
              index={i}
              goUp={goUp}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default VideosComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
