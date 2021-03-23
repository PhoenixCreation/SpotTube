import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import { Video } from "expo-av";
import { theme } from "../config";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

import * as MediaLibrary from "expo-media-library";

const AnimatedVideo = Animated.createAnimatedComponent(Video);

const { width, height } = Dimensions.get("window");

const BAR_HEIGHT = 60;

const BREAK_POINT = 100;

const Videos = () => {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [playbackControls, setPlaybackControls] = useState(true);

  const togglePlaybackControls = () => {
    setPlaybackControls((last) => setPlaybackControls(!last));
  };

  // useEffect(() => {
  //   getVideos();
  // }, []);

  // const getVideos = async () => {
  //   try {
  //     const { status } = await MediaLibrary.requestPermissionsAsync();
  //     if (status === "granted") {
  //       const userVideos = await MediaLibrary.getAssetsAsync({
  //         first: 999,
  //         mediaType: MediaLibrary.MediaType.video,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const translateY = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const state = useSharedValue("down");

  const onGestureEvent = useAnimatedGestureHandler({
    onActive: ({ translationY }) => {
      translateY.value = translationY + offsetY.value;
    },
    onEnd: ({ translationY, velocityY }) => {
      const point = translationY + 0.2 * velocityY;
      if (state.value === "down") {
        if (point > 0) {
          // Go down rather close the player
          translateY.value = withTiming(BAR_HEIGHT);
          offsetY.value = BAR_HEIGHT;
        } else {
          // Go up
          translateY.value = withTiming(-(height - BAR_HEIGHT));
          offsetY.value = -(height - BAR_HEIGHT);
          state.value = "up";
        }
      } else if (state.value === "up") {
        if (point > 0) {
          // Go down
          translateY.value = withTiming(0);
          offsetY.value = 0;
          state.value = "down";
        } else {
          // Go Full Screen
          translateY.value = withTiming(-(height - BAR_HEIGHT));
          offsetY.value = -(height - BAR_HEIGHT);

          // state.value = "full";
        }
      }
    },
  });

  const videoContStyle = useAnimatedStyle(() => {
    return {
      width,
      height,
      backgroundColor: "white",
      position: "absolute",
      zIndex: 2,
      top: 0,
      transform: [{ translateY: height - BAR_HEIGHT + translateY.value }],
    };
  });

  const playerContStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        translateY.value,
        [-(height - BAR_HEIGHT), 0],
        [225, BAR_HEIGHT]
      ),
      width: "100%",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "black",
    };
  });

  const videoPlaybackContStyle = useAnimatedStyle(() => {
    return {
      width:
        translateY.value < -BREAK_POINT
          ? "100%"
          : interpolate(
              translateY.value,
              [-BREAK_POINT, 0],
              [width, width / 2]
            ),
      height: "100%",
      position: "relative",
    };
  });

  const goUp = () => {
    translateY.value = withTiming(-(height - BAR_HEIGHT));
    offsetY.value = -(height - BAR_HEIGHT);
    state.value = "up";
  };

  const goDown = () => {
    translateY.value = withTiming(0);
    offsetY.value = 0;
    state.value = "down";
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainCont}>
        <Pressable
          onPress={() => {
            goUp();
          }}
        >
          <Text>Go full screen</Text>
        </Pressable>
      </View>
      <Animated.View style={videoContStyle}>
        <View style={styles.gestureCont}>
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={playerContStyle}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                  togglePlaybackControls();
                }}
              >
                <Animated.View style={videoPlaybackContStyle}>
                  <Video
                    ref={video}
                    style={styles.video}
                    source={{
                      uri: "file:///storage/emulated/0/Download/bannerg004.mp4",
                    }}
                    useNativeControls={false}
                    resizeMode="cover"
                    onPlaybackStatusUpdate={(newstatus) => setStatus(newstatus)}
                  />
                  {playbackControls && (
                    <Animated.View style={styles.playbackControlsCont}>
                      <View style={styles.controllerHeader}>
                        <Pressable
                          onPress={() => {
                            goDown();
                          }}
                        >
                          <AntDesign
                            style={styles.goDownButton}
                            name="down"
                            size={20}
                            color="white"
                          />
                        </Pressable>
                        <Text style={styles.controllerName} numberOfLines={1}>
                          {
                            "A video name will be shown here. It may be too long so be prepard for that"
                          }
                        </Text>
                        <View style={styles.controllerOption}>
                          <Entypo
                            style={styles.controllerOptionIcon}
                            name="dots-three-vertical"
                            size={16}
                            color="white"
                          />
                        </View>
                      </View>
                      <View style={styles.controllerMiddle}>
                        <Pressable
                          onPress={() => {
                            if (status.positionMillis < 5001) {
                              video?.current?.setPositionAsync(0);
                            } else {
                              video?.current?.setPositionAsync(
                                status.positionMillis - 5000
                              );
                            }
                          }}
                        >
                          <Entypo
                            name="controller-fast-backward"
                            size={28}
                            color="white"
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            if (status.isPlaying) {
                              video?.current?.pauseAsync();
                            } else {
                              video?.current?.playAsync();
                            }
                          }}
                        >
                          {status.isPlaying ? (
                            <Ionicons
                              name="ios-pause"
                              size={36}
                              color="white"
                            />
                          ) : (
                            <Entypo
                              name="controller-play"
                              size={36}
                              color="white"
                            />
                          )}
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            if (
                              status.positionMillis + 5000 >
                              status.durationMillis
                            ) {
                              video?.current?.setPositionAsync(
                                status.durationMillis
                              );
                            } else {
                              video?.current?.setPositionAsync(
                                status.positionMillis + 5000
                              );
                            }
                          }}
                        >
                          <Entypo
                            name="controller-fast-forward"
                            size={28}
                            color="white"
                          />
                        </Pressable>
                      </View>
                      <View style={styles.controllerProgress}></View>
                    </Animated.View>
                  )}
                </Animated.View>
              </Pressable>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Animated.View>
    </View>
  );
};

export default Videos;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.backgroundColor,
  },
  mainCont: {
    width,
    height,
  },
  videoCont: {
    width,
    height,
    backgroundColor: "lightblue",
    position: "absolute",
    zIndex: 2,
    top: 0,
    transform: [{ translateY: height - BAR_HEIGHT }],
  },
  playerCont: {
    height: BAR_HEIGHT,
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playbackControlsCont: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#0005",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  controllerHeader: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  controllerMiddle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  controllerProgress: {
    height: 30,
    width: "100%",
  },
  controllerName: {
    flex: 1,
    color: "white",
    marginHorizontal: 20,
  },
});
