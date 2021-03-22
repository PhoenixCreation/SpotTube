import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import { Video } from "expo-av";
import Animated from "react-native-reanimated";

const AnimatedVideo = Animated.createAnimatedComponent(Video);

const { width, height } = Dimensions.get("window");

const Test = () => {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "file:///storage/emulated/0/Download/bannerg004.mp4",
        }}
        useNativeControls={true}
        resizeMode="cover"
        // onPlaybackStatusUpdate={(newstatus) => setStatus(newstatus)}
      />
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  video: {
    width,
    height: 200,
  },
});
