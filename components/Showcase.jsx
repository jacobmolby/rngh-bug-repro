import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const Showcase = () => {
  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      console.log('long press');
    })
    .runOnJS(true);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      console.log('double tap');
    })
    .runOnJS(true);

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
            <Blue doubleTapGesture={doubleTapGesture} />
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

const Blue = ({ doubleTapGesture }) => {
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      console.log('Blue: tap');
    })
    .runOnJS(true);

  const composedGesture = Gesture.Exclusive(doubleTapGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={styles.blue}>
        <Orange doubleTapGesture={doubleTapGesture} />
      </Animated.View>
    </GestureDetector>
  );
};

const Orange = ({ doubleTapGesture }) => {
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      console.log('Orange: tap');
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={Gesture.Exclusive(doubleTapGesture, tapGesture)}>
      <Animated.View style={styles.orange}></Animated.View>
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
    height: '80%',
    backgroundColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  orange: {
    margin: 5,
    width: '50%',
    height: '50%',
    backgroundColor: 'orange',
  },
});
