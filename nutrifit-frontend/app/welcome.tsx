// app/welcome.tsx
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
   {
      key: '1',
      subtitle: "Ready for some wins?\nStart tracking, it's easy!",
      image: require('@/assets/images/onboard-1.png'),
   },
   {
      key: '2',
      subtitle: 'And make mindful eating\na habit for life',
      image: require('@/assets/images/onboard-2.png'),
   },
];

export default function WelcomeScreen() {
   const [index, setIndex] = useState(0);
   const router = useRouter();
   const flatListRef = useRef<FlatList>(null);

   const handleScroll = (e: any) => {
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
      setIndex(newIndex);
   };

   return (
      <View style={styles.container}>
         <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
               Welcome to{' '}
               <Text style={styles.brandText}>NutriFit</Text>
            </Text>
         </View>

         {/* CAROUSEL */}
         <View style={styles.carouselContainer}>
            <FlatList
               ref={flatListRef}
               data={slides}
               keyExtractor={item => item.key}
               horizontal
               pagingEnabled
               showsHorizontalScrollIndicator={false}
               onScroll={handleScroll}
               scrollEventThrottle={16}
               renderItem={({ item }) => (
                  <View style={[styles.slide, { width }]}>
                     <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="cover"
                     />
                     <Text style={styles.subtitle}>{item.subtitle}</Text>
                  </View>
               )}
            />

            {/* DOTS */}
            <View style={styles.dotsContainer}>
               {slides.map((_, i) => (
               <View
               key={i}
               style={[styles.dot, index === i && styles.dotActive]}
               />
               ))}
            </View>
         </View>

         {/* ACTIONS */}
         <View style={styles.actionsContainer}>
            <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push('/register')}
            >
               <Text style={styles.signupButtonText}>Sign Up For Free</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/login')}>
               <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#fff' },

   headerContainer: {
      paddingTop: 60,
      paddingBottom: 20,
      alignItems: 'center',
   },
   headerText: {
      fontSize: 20,
   },
   brandText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'green',
   },

   carouselContainer: { flex: 1 },
   slide: {
      alignItems: 'center',
      paddingHorizontal: 20,
   },
   image: {
      width: width * 0.8,
      height: 300,
      borderRadius: 16,
      marginVertical: 20,
   },
   subtitle: {
      fontSize: 16,
      textAlign: 'center',
      color: '#333',
   },

   dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 12,
   },
   dot: {
      width: 8,
      height: 8,
      backgroundColor: '#ccc',
      borderRadius: 4,
      marginHorizontal: 4,
   },
   dotActive: {
      backgroundColor: '#6c63ff',
   },

   actionsContainer: {
      paddingVertical: 24,
      alignItems: 'center',
   },
   signupButton: {
      backgroundColor: '#38C933',
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 60,
      marginBottom: 12,
   },
   signupButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
   },
   loginText: {
      fontSize: 16,
      color: '#38C933',
      fontWeight: '500',
   },
});
