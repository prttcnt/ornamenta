import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import images from '@/constants/images'
import { router } from 'expo-router'

const MainScreen = () => {

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='pb-16'>
        
        <View className='px-4 py-8'>

            <Image source={images.logoMain} className='size-10 mb-8'/>

            <Text className='text-xl uppercase font-unbounded text-black mb-8'>
              Библиотека
            </Text>
            <Text className='font-roboto text-base mb-4'>
              Загрузка библиотеки
            </Text>
            <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/upload")}
              className='bg-blue rounded-2xl w-full h-14 items-center justify-center mb-8'>
              <Text className='text-white text-base font-roboto'>Загрузить</Text>
            </TouchableOpacity>

            <Text className='font-roboto text-base mb-4'>
              Готовые решения
            </Text>
            
            <View className='relative mb-4'>
              <TouchableOpacity onPress={() => router.push("/settingsGeom")}>
                <Image source={images.suprematism} 
                  className='w-full h-32 rounded-2xl opacity-80 border' 
                  resizeMode='cover' />
                <Text className='font-roboto-bold text-base absolute top-24 left-5'>
                  Супрематизм
                </Text>
              </TouchableOpacity>
            </View>

            <View className='relative mb-4'>
              <TouchableOpacity 
                onPress={() => router.push({ pathname: "/settings", 
                params: { library: "rsu" } })}>
                <Image source={images.seamless_pattern} 
                  className='w-full h-32 rounded-2xl opacity-80 border' 
                  resizeMode='cover' />
                <Text className='font-roboto-bold text-base absolute top-24 left-5'>
                  РГУ им. А.Н.Косыгина
                </Text>
              </TouchableOpacity>
            </View>

            <View className='relative mb-4'>
              <TouchableOpacity 
                onPress={() => router.push({ pathname: "/settings", 
                params: { library: "flowers" } })}>
                <Image source={images.flowers} 
                  className='w-full h-32 rounded-2xl opacity-80 border' 
                  resizeMode='cover' />
                <Text className='font-roboto-bold text-base absolute top-24 left-5'>
                  Цветы
                </Text>
              </TouchableOpacity>
            </View>

            <View className='relative mb-4'>
              <TouchableOpacity 
              onPress={() => router.push({ pathname: "/settings", 
              params: { library: "honeycomb" } })}>
                <Image source={images.honeycomb} 
                  className='w-full h-32 rounded-2xl opacity-80 border' 
                  resizeMode='cover' />
                <Text className='font-roboto-bold text-base absolute top-24 left-5'>
                  Соты
                </Text>
              </TouchableOpacity>
            </View>

            <View className='relative mb-4'>
              <TouchableOpacity 
              onPress={() => router.push({ pathname: "/settings", 
              params: { library: "figs" } })}>
                <Image source={images.figs} 
                  className='w-full h-32 rounded-2xl opacity-80 border' 
                  resizeMode='cover' />
                <Text className='font-roboto-bold textbase absolute top-24 left-5'>
                  Фигуры
                </Text>
              </TouchableOpacity>
            </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MainScreen