import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const Showcase = () => {
  const [lastActions, setLastActions] = React.useState([]);

  const addAction = action => {
    setLastActions(actions => {
      const date = new Date();
      const time = date.toLocaleTimeString();

      if (actions.length >= 3) {
        actions.pop();
      }
      return [action + ': ' + time, ...actions];
    });
  };

  const longPressGesture = Gesture.LongPress()
    .onStart(() => {
      addAction('long press');
    })
    .runOnJS(true);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      addAction('double tap');
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
            <Blue doubleTapGesture={doubleTapGesture} onAddAction={addAction} />
          </Animated.View>
        </GestureDetector>
        <View>
          {lastActions.map((action, index) => (
            <Text key={index}>
              {index} - {action}
            </Text>
          ))}
        </View>
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

const Blue = ({ doubleTapGesture, onAddAction }) => {
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      onAddAction('Blue: tap');
    })
    .runOnJS(true);

  const composedGesture = Gesture.Exclusive(doubleTapGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={styles.blue}>
        <Orange doubleTapGesture={doubleTapGesture} onAddAction={onAddAction} />
      </Animated.View>
    </GestureDetector>
  );
};

const Orange = ({ doubleTapGesture, onAddAction }) => {
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      onAddAction('Orange: tap');
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
