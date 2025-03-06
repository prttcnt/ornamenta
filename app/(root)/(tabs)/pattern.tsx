import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from "react-native";
import Svg, { G, Rect } from "react-native-svg";
import { router, useLocalSearchParams } from "expo-router"; 
import svgRsu from "@/constants/svgRsu";
import svgHoneycomb from "@/constants/svgHoneycomb";
import svgFigs from "@/constants/svgFigs";
import svgFlowers from "@/constants/svgFlowers";
import images from '@/constants/images';
import icons from '@/constants/icons';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

const PatternGenerator = () => {
  const params = useLocalSearchParams(); 
  const numElements = Number(params.numElements) || 5; 

  const availableLibraries = ["rsu", "honeycomb", "figs", "flowers"] as const;
  type LibraryType = (typeof availableLibraries)[number];
  const library = (params.library as LibraryType) || "flowers"; // По умолчанию flowers
  

  const svgLibraries = {
    rsu: svgRsu,
    honeycomb: svgHoneycomb,
    figs: svgFigs,
    flowers: svgFlowers,
  };

  const svgArray = Object.values(svgLibraries[library]);
  //const svgArray = Object.values(svgLibraries[library as keyof typeof svgLibraries] || svgHoneycomb);

  const patternSize = 300;
  const svgRef = useRef(null); // Реф для SVG-компонента

  const [patternElements, setPatternElements] = useState<
    { Component: React.FC<any>; x: number; y: number; width: number; height: number; rotation: number }[]
  >([]);
  const [overlayMode, setOverlayMode] = useState(false);
  const [randomRotationEnabled, setRandomRotationEnabled] = useState(false);

  // Функция для проверки на наложение
  const checkOverlap = (
    newElement: { x: number; y: number; width: number; height: number },
    existingElements: { x: number; y: number; width: number; height: number }[]
  ) => {
    for (let el of existingElements) {
      const noOverlap =
        newElement.x + newElement.width <= el.x ||
        newElement.x >= el.x + el.width ||
        newElement.y + newElement.height <= el.y ||
        newElement.y >= el.y + el.height;
  
      if (!noOverlap) return true; // Если есть наложение
    }
    return false; // Если наложения нет
  };

  // Функция для генерации паттерна
  const generatePattern = () => {
    if (svgArray.length === 0) {
      console.warn("Нет доступных SVG!");
      return;
    }
  
    let elements = [];
    let attempts = 0;
    const maxAttempts = 1000;
    let failedPlacements = 0; // Счетчик неудачных размещений
  
    for (let i = 0; i < numElements; i++) {
      const Component = svgArray[Math.floor(Math.random() * svgArray.length)];
      const baseSize = 30;
      const scaleMultiplier = numElements < 15 ? 2 : 1;
      const randomScale = (Math.random() * 1.5 + 0.5) * scaleMultiplier;
      
      const width = Math.floor(baseSize * randomScale);
      const height = Math.floor(baseSize * randomScale);
      const rotation = randomRotationEnabled ? Math.random() * 360 : 0;
  
      let x = 0, y = 0;
      let overlap = true;
      let tryAttempts = 0;
  
      if (!overlayMode) {
        while (overlap && tryAttempts < maxAttempts) {
          x = Math.floor(Math.random() * (patternSize - width));
          y = Math.floor(Math.random() * (patternSize - height));
          overlap = checkOverlap({ x, y, width, height }, elements);
          tryAttempts++;
        }
  
        if (tryAttempts === maxAttempts) {
          failedPlacements++; // Увеличиваем счетчик неудач
          continue;
        }
      } else {
        x = Math.floor(Math.random() * (patternSize - width));
        y = Math.floor(Math.random() * (patternSize - height));
      }
  
      elements.push({ Component, x, y, width, height, rotation });
    }
  
    setPatternElements(elements);
  
    // Если есть неудачные размещения, показываем Alert
    if (failedPlacements > 0) {
      Alert.alert(
        "Внимание",
        `Не удалось разместить ${failedPlacements} элемент(ов) без наложений.`,
        [{ text: "OK" }]
      );
    }
  };
  

  const saveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Необходимо разрешение на доступ к хранилищу.");
        return;
      }

      const uri = await captureRef(svgRef, {
        format: "png",
        quality: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Patterns", asset, false);

      Alert.alert("Успешно", "Изображение сохранено в галерею!");
    } catch (error) {
      console.error("Ошибка сохранения изображения:", error);
      Alert.alert("Ошибка", "Не удалось сохранить изображение.");
    }
  };

  
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='pb-16'>
        <View className='px-4 py-8'>

          <View className='flex flex-row mb-8 justify-between'>
            <Image source={images.logoMain} className='size-10'/>
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.leftArrow} className='size-10'/>
            </TouchableOpacity>
          </View>

          <Text className='text-xl uppercase font-unbounded text-black mb-8'>
            Ваш паттерн
          </Text>

          <View className="items-center justify-center mb-10">
            <Text className='font-roboto text-base mb-4'>Количество элементов: {numElements}</Text>

            <View ref={svgRef} collapsable={false}>
            <Svg height={patternSize} width={patternSize}>
              <Rect x="0" y="0" width={patternSize} height={patternSize} fill="white" />
              {patternElements.map((el, index) => {
                const { Component, x, y, width, height, rotation } = el;
                return (
                  <G
                    key={index}
                    transform={`translate(${x}, ${y}) rotate(${rotation}, ${width / 2}, ${height / 2})`}
                  >
                    <Component width={width} height={height} />
                  </G>
                );
              })}
            </Svg>
            </View>
          </View>

          <View className='flex flex-row mb-2 justify-between'>
            <TouchableOpacity onPress={generatePattern} 
              className='bg-blue rounded-2xl w-4/5 h-14 items-center justify-center mb-8'>
              <Text className='text-white text-base font-roboto'>Сгенерировать</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={saveImage}>
              <Image source={icons.download} className='size-10 pt-2'/>
            </TouchableOpacity>
          </View>

          {/* Кнопка "Наложение элементов" */}
          <View className="mb-8 items-center">
            <Text className='font-roboto text-base mb-4'>Дополнительные настройки:</Text>

            <TouchableOpacity
              onPress={() => setOverlayMode(!overlayMode)}
              className={`p-2 rounded items-center justify-center w-4/5 mb-2
                 ${overlayMode ? 'bg-black' : 'bg-yellow'}`} // Условные стили
            >
              <Text
              className={`text-base
                ${overlayMode ? 'text-white' : 'text-black'}`} // Условные стили
              > 
                {overlayMode ? "Отключить наложение" : "Включить наложение"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRandomRotationEnabled(!randomRotationEnabled)}
              className={`p-2 rounded items-center justify-center w-4/5 mb-2
                 ${randomRotationEnabled ? 'bg-black' : 'bg-yellow'}`} // Условные стили
            >
              <Text 
                className={`text-base
                ${randomRotationEnabled ? 'text-white' : 'text-black'}`} // Условные стили
              > 
                {randomRotationEnabled ? "Отключить вращение" : "Включить вращение"}
              </Text>
            </TouchableOpacity>

          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatternGenerator;
