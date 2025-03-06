import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from '@/constants/images';
import icons from '@/constants/icons';
import { useLocalSearchParams } from "expo-router";

const Settings = () => {
  const params = useLocalSearchParams();
  const library = params.library || "flowers"; // По умолчанию flowers
  const [numElements, setNumElements] = useState("5");

  const handleGenerate = () => {
    // Преобразуем строку в число перед отправкой
    const numElementsParsed = parseInt(numElements, 10);

    // Проверяем, является ли введенное значение числом
    if (isNaN(numElementsParsed) || numElementsParsed <= 0) {
      alert("Пожалуйста, введите корректное количество элементов.");
      return;
    }

    // Передаем библиотеку и количество элементов на страницу pattern
    router.push({
      pathname: "/pattern",
      params: { numElements: numElementsParsed, library  }
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

          <Text className='text-xl uppercase font-unbounded text-black mb-10'>
            Настройки паттерна
          </Text>

          <View className="items-center justify-center mb-10">
            <Text className='font-roboto text-base mb-4'>Введите количество элементов:</Text>

            <TextInput
              value={numElements}
              onChangeText={setNumElements}
              keyboardType="numeric"
              className="border border-gray-700 p-3 rounded-md text-center mb-2 w-2/4"
            />
          </View>
          

          <TouchableOpacity onPress={handleGenerate} 
            className='bg-blue rounded-2xl w-full h-14 items-center 
            justify-center mb-8'>
            <Text className='text-white text-base font-roboto'>
              Сохранить и продолжить
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
