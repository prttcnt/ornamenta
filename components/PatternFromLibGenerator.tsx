import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { launchImageLibrary, ImageLibraryOptions, Asset } from "react-native-image-picker";
import Svg, { Image as SvgImage } from "react-native-svg";

const PatternGenerator = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [patternElements, setPatternElements] = useState<{ uri: string; x: number; y: number; width: number; height: number }[]>([]);
  const patternSize = 300;

  // Функция выбора изображений из галереи
  const pickImages = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo" as const, // Указываем тип строго
      selectionLimit: 5, // Максимальное количество изображений
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert("Выбор отменен");
      } else if (response.errorMessage) {
        Alert.alert("Ошибка:", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const images = response.assets.map((asset: Asset) => asset.uri || "");
        setSelectedImages(images.filter(uri => uri !== ""));
      }
    });
  };

  // Генерация паттерна
  const generatePattern = (numElements: number) => {
    if (selectedImages.length === 0) {
      Alert.alert("Выберите изображения перед генерацией!");
      return;
    }

    let elements = [];
    for (let i = 0; i < numElements; i++) {
      const imgUri = selectedImages[Math.floor(Math.random() * selectedImages.length)];
      const randomScale = Math.random() * 1.5 + 0.5;
      const width = Math.floor(50 * randomScale);
      const height = Math.floor(50 * randomScale);
      const x = Math.floor(Math.random() * (patternSize - width));
      const y = Math.floor(Math.random() * (patternSize - height));

      elements.push({ uri: imgUri, x, y, width, height });
    }

    setPatternElements(elements);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
      <TouchableOpacity onPress={pickImages} style={{ backgroundColor: "blue", padding: 10, marginBottom: 10 }}>
        <Text style={{ color: "white" }}>Выбрать изображения</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => generatePattern(5)} style={{ backgroundColor: "green", padding: 10 }}>
        <Text style={{ color: "white" }}>Сгенерировать паттерн</Text>
      </TouchableOpacity>

      <Svg height={patternSize} width={patternSize} style={{ borderWidth: 1, marginTop: 20 }}>
        {patternElements.map((el, index) => (
          <SvgImage key={index} href={{ uri: el.uri }} x={el.x} y={el.y} width={el.width} height={el.height} />
        ))}
      </Svg>
    </View>
  );
};

export default PatternGenerator;
