import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router } from "expo-router";

const PatternGenerator = () => {
  const patternSize = 300;
  const svgRef = useRef(null);

  const [userImages, setUserImages] = useState<string[]>([]); // Хранение URI PNG-файлов
  const [patternElements, setPatternElements] = useState<
    { uri: string; x: number; y: number; width: number; height: number; rotation: number }[]
  >([]);
  const [numElements, setNumElements] = useState(5); // Количество элементов по умолчанию
  const [inputVisible, setInputVisible] = useState(false); // Состояние для показа инпута
  const [overlayMode, setOverlayMode] = useState(false); // Состояние для наложения элементов
  const [randomRotationEnabled, setRandomRotationEnabled] = useState(false); // Состояние для случайного вращения

  // Функция для выбора изображений из галереи
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Ошибка", "Необходимо разрешение на доступ к галерее.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUris = result.assets.map((asset) => asset.uri);
      setUserImages(imageUris);
      setInputVisible(true);
      Alert.alert("Успешно", "Изображения загружены из галереи!");
    } else {
      Alert.alert("Ошибка", "Выбор изображений был отменен.");
    }
  };

  // Функция для получения размеров изображения
  const getImageSize = (uri: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        (error) => reject(error)
      );
    });
  };

  // Функция для проверки наложения
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
  const generatePattern = async () => {
    if (userImages.length === 0) {
      Alert.alert("Ошибка", "Сначала выберите изображения.");
      return;
    }

    let elements = [];
    const maxElementSize = patternSize * 0.5; // Максимальный размер элемента (50% от patternSize)

    for (let i = 0; i < numElements; i++) {
      const uri = userImages[Math.floor(Math.random() * userImages.length)]; // Выбираем случайное изображение

      // Получаем исходные размеры изображения
      const { width: originalWidth, height: originalHeight } = await getImageSize(uri);

      // Рассчитываем соотношение сторон
      const aspectRatio = originalWidth / originalHeight;

      // Задаем базовый размер (например, 50)
      const baseSize = 50;
      const randomScale = Math.random() * 1.5 + 0.5;

      // Рассчитываем ширину и высоту с учетом соотношения сторон
      let width = Math.min(baseSize * randomScale, maxElementSize);
      let height = width / aspectRatio;

      // Если высота превышает maxElementSize, корректируем размеры
      if (height > maxElementSize) {
        height = maxElementSize;
        width = height * aspectRatio;
      }

      // Генерируем координаты
      let x = 0, y = 0;
      let overlap = true;
      let attempts = 0;
      const maxAttempts = 100;

      if (!overlayMode) {
        while (overlap && attempts < maxAttempts) {
          x = Math.floor(Math.random() * (patternSize - width));
          y = Math.floor(Math.random() * (patternSize - height));
          overlap = checkOverlap({ x, y, width, height }, elements);
          attempts++;
        }

        if (attempts === maxAttempts) {
          console.warn("Не удалось разместить элемент без наложения.");
          continue;
        }
      } else {
        x = Math.floor(Math.random() * (patternSize - width));
        y = Math.floor(Math.random() * (patternSize - height));
      }

      // Добавляем вращение, если включено
      const rotation = randomRotationEnabled ? Math.random() * 360 : 0;

      elements.push({ uri, x, y, width, height, rotation });
    }

    setPatternElements(elements);
  };

  // Функция для сохранения изображения
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
      Alert.alert("Ошибка", "Не удалось сохранить изображение.");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="pb-16">
        <View className="px-4 py-8">
          <View className="flex flex-row mb-8 justify-between">
            <Image source={images.logoMain} className="size-10" />
            <TouchableOpacity onPress={() => router.back()}>
              <Image source={icons.leftArrow} className="size-10" />
            </TouchableOpacity>
          </View>

          <Text className="text-xl uppercase font-unbounded text-black mb-8">
            Ваш паттерн
          </Text>

          <View className="items-center">
            <TouchableOpacity
              onPress={pickImages}
              className="bg-yellow rounded-2xl w-3/5 h-14 items-center justify-center mb-8"
            >
              <Text className="text-black text-base font-roboto">
                Выбрать PNG
              </Text>
            </TouchableOpacity>
          </View>

          {inputVisible && (
            <View className="items-center justify-center mb-10">
              <Text className="font-roboto text-base mb-4">
                Введите количество элементов:
              </Text>
              <TextInput
                keyboardType="numeric"
                className="border border-gray-700 p-3 rounded-md text-center mb-2 w-2/4"
                placeholder="Введите число"
                value={numElements.toString()}
                onChangeText={(text) => {
                  const parsed = parseInt(text, 10);
                  if (!isNaN(parsed)) {
                    setNumElements(parsed);
                  } else if (text === "") {
                    setNumElements(0);
                  }
                }}
                onBlur={() => {
                  if (numElements <= 0) {
                    setNumElements(1);
                  }
                }}
              />
            </View>
          )}

          <View className="items-center justify-center mb-10">
            <Text className="font-roboto text-base mb-4">
              Количество элементов: {numElements}
            </Text>

            <View ref={svgRef} collapsable={false}>
              <View style={{ width: patternSize, height: patternSize, backgroundColor: "white" }}>
                {patternElements.map((el, index) => (
                  <Image
                    key={index}
                    source={{ uri: el.uri }}
                    style={{
                      position: "absolute",
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                      transform: [{ rotate: `${el.rotation}deg` }], // Применяем вращение
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          <View className="flex flex-row mb-2 justify-between">
            <TouchableOpacity
              onPress={generatePattern}
              className="bg-blue rounded-2xl w-4/5 h-14 items-center justify-center mb-8"
            >
              <Text className="text-white text-base font-roboto">
                Сгенерировать
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={saveImage}>
              <Image source={icons.download} className="size-10 pt-2" />
            </TouchableOpacity>
          </View>

          {/* Кнопки для управления наложением и вращением */}
          <View className="mb-8 items-center">
            <Text className="font-roboto text-base mb-4">Дополнительные настройки:</Text>

            <TouchableOpacity
              onPress={() => setOverlayMode(!overlayMode)}
              className={`p-2 rounded items-center justify-center w-4/5 mb-2
                 ${overlayMode ? 'bg-black' : 'bg-yellow'}`}
            >
              <Text className={`text-base ${overlayMode ? 'text-white' : 'text-black'}`}>
                {overlayMode ? "Отключить наложение" : "Включить наложение"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRandomRotationEnabled(!randomRotationEnabled)}
              className={`p-2 rounded items-center justify-center w-4/5 mb-2
                 ${randomRotationEnabled ? 'bg-black' : 'bg-yellow'}`}
            >
              <Text className={`text-base ${randomRotationEnabled ? 'text-white' : 'text-black'}`}>
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