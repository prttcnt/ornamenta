import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, ViewToken, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import slides, {Slide} from '@/constants/data'; 
import images from '@/constants/images';


const { width } = Dimensions.get('window');

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  

  const renderItem = ({ item }: {item: Slide}) => (
    <View style={{ width }} 
      className='px-4'>
      <Image source={item.image} 
        className='w-full h-96 rounded-3xl opacity-50' resizeMode='cover' />
    </View>
  );

  const onViewableItemsChanged = useRef((info: { viewableItems: ViewToken<Slide>[] }) => {
    if (info.viewableItems.length > 0) {
      const index = info.viewableItems[0].index;
      if (index !== null && index !== undefined) {
        setCurrentIndex(index);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <View className='py-8'>
          <View className='px-4'>
            <Image source={images.logoMain} className='size-10 mb-8' />
            <Text className='text-xl uppercase font-unbounded text-black mb-4'>
              Привет, пользователь!
            </Text>
            <Text className='font-roboto text-base mb-4'>
              Давай мы познакомим тебя с Ornamenta поближе
            </Text>
          </View>
          

          <View className='w-full'>
            <FlatList
              ref={flatListRef}
              data={slides} 
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              scrollEventThrottle={32}
            />
          </View>
          

          <View className='flex-row justify-center mt-4'>
            {slides.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex ? 'bg-black' : 'bg-gray-300'}`}
              />
            ))}
          </View>

          <TouchableOpacity onPress={onComplete}>
            <Text className='mt-8 text-center'>Пропустить</Text>  
          </TouchableOpacity>
    
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;