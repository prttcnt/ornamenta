import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import images from '@/constants/images';
import icons from '@/constants/icons';

const SettingsGeom = () => {
  const [nRectangles, setNRectangles] = useState(1);
  const [kLines, setKLines] = useState(1);
  const [wCircles, setWCircles] = useState(1);
  const [gTriangles, setGTriangles] = useState(1);

  const handleGenerate = () => {
    router.push({
      pathname: '/patternGeom',
      params: { nRectangles, kLines, wCircles, gTriangles }
    });
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='pb-16'>
        <View className='px-4 py-8'>

          <View className='flex flex-row mb-8 justify-between'> 
            <Image source={images.logoMain} className='size-10'/>
            <TouchableOpacity 
              onPress={() => router.back()}>
              <Image source={icons.leftArrow} className='size-10'/>
            </TouchableOpacity>
          </View>

          <Text className='text-xl uppercase font-unbounded text-black mb-8'>
            Настройки паттерна
          </Text>

        <View className='mb-4'>
          <Text>Прямоугольники: {nRectangles}</Text>
          <Slider minimumValue={0} maximumValue={10} step={1} value={nRectangles} 
            onValueChange={setNRectangles} />

          <Text>Линии: {kLines}</Text>
          <Slider minimumValue={0} maximumValue={10} step={1} value={kLines} 
            onValueChange={setKLines} />

          <Text>Круги: {wCircles}</Text>
          <Slider minimumValue={0} maximumValue={10} step={1} value={wCircles} 
            onValueChange={setWCircles} />

          <Text>Треугольники: {gTriangles}</Text>
          <Slider minimumValue={0} maximumValue={10} step={1} value={gTriangles} 
            onValueChange={setGTriangles} />
        </View>
          
          <TouchableOpacity 
            onPress={handleGenerate} 
            className='bg-blue rounded-2xl w-full h-14 items-center 
              justify-center mb-8'>
            <Text className='text-white text-base font-roboto'>Сгенерировать</Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsGeom;
