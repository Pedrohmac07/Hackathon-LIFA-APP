import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing, StyleSheet, Image } from 'react-native';
import icon from '../../assets/icon.png';

export const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
 const scaleAnim = useRef(new Animated.Value(0)).current;
 const moveAnim = useRef(new Animated.Value(0)).current;

 useEffect(() => {
  Animated.sequence([
   Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
   Animated.delay(400),
   Animated.sequence([
    Animated.timing(moveAnim, { toValue: -30, duration: 250, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    Animated.spring(moveAnim, { toValue: 0, friction: 4, useNativeDriver: true })
   ]),
   Animated.delay(600)
  ]).start(onFinish);
 }, []);

 return (
  <View style={styles.container}>
   <Animated.View style={{ transform: [{ scale: scaleAnim }, { translateY: moveAnim }], alignItems: 'center' }}>
    <View style={styles.logo}>
     <Image
      source={icon}
      style={{ width: 50, height: 50 }}
      resizeMode="contain"
     />
    </View>
    <Text style={styles.text}>LIFA</Text>
   </Animated.View>
  </View>
 );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },
 logo: { width: 90, height: 90, backgroundColor: '#fff', borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 10 },
 text: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 4 },
});
