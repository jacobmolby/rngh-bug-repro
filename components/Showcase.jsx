import { ScrollView, StyleSheet, Text } from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { View, Button } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureType,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const Showcase = () => {
  const longPressGesture = Gesture.LongPress().onStart(() => {
    console.log('long press');
  });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      console.log('double tap');
    });

  const gesture = Gesture.Race(doubleTapGesture, longPressGesture);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 60,
      }}>
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={styles.outer}>
            <Blue gesture={doubleTapGesture} />
          </Animated.View>
        </GestureDetector>
        <View style={{ gap: 20 }}>
          <Text>
            <Bold>DoubleTap</Bold>: on all rectangles - should print "double
            tap" - no tap gesture should be recognized ✅
          </Text>
          <Text>
            <Bold>LongPress</Bold>: on all rectangles - should print "long
            press" - no tap gesture should be recognized ✅
          </Text>
          <Text>
            <Bold>Tap</Bold>: on red - should do nothing ✅
          </Text>
          <Text>
            <Bold>Tap</Bold>: on blue - should print "Blue: tap" ✅
          </Text>
          <Text>
            <Bold>Tap</Bold>: on orange - should print "Orange: tap" ⛔️ -
            Crashes on Android
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Showcase;

const Blue = ({ gesture }) => {
  const tapGesture = Gesture.Tap().onStart(() => {
    console.log('Blue: tap');
  });

  const composedGesture = Gesture.Exclusive(gesture, tapGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={styles.blue}>
        <Orange waitFor={gesture} />
      </Animated.View>
    </GestureDetector>
  );
};

const Orange = ({ waitFor }) => {
  const tapGesture = Gesture.Tap().onStart(() => {
    console.log('Orange: tap');
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(waitFor, tapGesture)}>
      <Animated.View style={styles.inner2}></Animated.View>
    </GestureDetector>
  );
};

const Bold = ({ children }) => {
  return <Text style={{ fontWeight: 'bold' }}>{children}</Text>;
};

const styles = StyleSheet.create({
  outer: {
    padding: 20,
    backgroundColor: 'red',
    width: 300,
    height: 200,
  },
  blue: {
    width: '80%',
    height: '50%',
    backgroundColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inner2: {
    margin: 5,
    width: 100,
    height: 40,
    backgroundColor: 'orange',
  },
});
