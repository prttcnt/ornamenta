import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import { router } from 'expo-router'
import icons from '@/constants/icons'

const upload = () => {
  return (
    <SafeAreaView className='bg-white h-full'>
          <ScrollView contentContainerClassName='pb-16'>
            <View className='px-4 py-8'>

              <View className='mb-16'>


                <View className='flex flex-row mb-8 justify-between'> 
                  <Image source={images.logoMain} className='size-10'/>
                    <TouchableOpacity 
                      onPress={() => router.back()}>
                      <Image source={icons.leftArrow} className='size-10'/>
                    </TouchableOpacity>
                </View>
                
                <Text className='text-xl uppercase font-unbounded text-black mb-8'>
                  Загрузка библиотеки
                </Text>
                <Text className='font-roboto text-base mb-4'>
                  Загрузи свои элементы в PNG-формате
                </Text>
                <TouchableOpacity 
                  onPress={() => router.push("/(root)/(tabs)/patternFromLib")}
                  className='bg-blue rounded-2xl w-full h-14 items-center justify-center'>
                  <Text className='text-white text-base font-roboto'>Выбрать элементы</Text>
                </TouchableOpacity>
              </View>
              
              <View>
                <Text className='text-xl uppercase font-unbounded text-black mb-4'>
                  Можем помочь
                </Text>
                <Text className='font-roboto text-base'>
                  Если ты хочешь получить паттерн более высокого качества, мы поможем 
                  подготовить твои идеи для загрузки в Ornamenta. Напиши 
                  нам на почту:
                </Text>
                <Text className='font-roboto-bold text-base text-blue mb-4'>
                  ornamenta@gmail.com
                </Text>

                <View className='flex flex-row items-center justify-center mb-2'>
                  <Text className='font-roboto-bold text-5xl mr-4'>
                    100 ₽
                  </Text>
                  <Text className='font-roboto-bold text-3xl text-red line-through'>
                    200 ₽
                  </Text>
                </View>

                <Text className='font-roboto text-base mb-4 text-center'>
                  За обработку 1 элемента библиотеки
                </Text>
                
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
  )
}

export default upload