import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Rect, Line, Circle, Polygon } from 'react-native-svg';
import images from '@/constants/images';
import icons from '@/constants/icons';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

const generateShapes = (nRectangles: number, kLines: number, wCircles: number, gTriangles: number) => {
  const colors = ['red', 'blue', 'green', 'yellow', 'pink', 'teal'];
  let shapes = [];

  // Прямоугольники
  for (let i = 0; i < nRectangles; i++) {
    const width = 50;
    const height = 50;
    const x = Math.random() * (300 - width);
    const y = Math.random() * (300 - height);

    shapes.push({ type: 'rect', x, y, width, height, color: colors[Math.floor(Math.random() * colors.length)] });
  }

  // Линии
  for (let i = 0; i < kLines; i++) {
    const x1 = Math.random() * 300;
    const y1 = Math.random() * 300;
    const x2 = Math.random() * 300;
    const y2 = Math.random() * 300;

    shapes.push({ type: 'line', x1, y1, x2, y2, color: colors[Math.floor(Math.random() * colors.length)] });
  }

  // Круги
  for (let i = 0; i < wCircles; i++) {
    const r = 20;
    const cx = Math.random() * (300 - 2 * r) + r;
    const cy = Math.random() * (300 - 2 * r) + r;

    shapes.push({ type: 'circle', cx, cy, r, color: colors[Math.floor(Math.random() * colors.length)] });
  }

  // Треугольники
  for (let i = 0; i < gTriangles; i++) {
    const points = [
      [Math.random() * 300, Math.random() * 300],
      [Math.random() * 300, Math.random() * 300],
      [Math.random() * 300, Math.random() * 300],
    ];

    shapes.push({ type: 'triangle', points, color: colors[Math.floor(Math.random() * colors.length)] });
  }

  return shapes;
};



const PatternGeom = () => {
  const params = useLocalSearchParams();
  const svgRef = useRef<View>(null); // Правильный тип для useRef

  // Явное приведение типов к числам
  const nRectangles = Number(params.nRectangles) || 0;
  const kLines = Number(params.kLines) || 0;
  const wCircles = Number(params.wCircles) || 0;
  const gTriangles = Number(params.gTriangles) || 0;

  const [shapes, setShapes] = useState(generateShapes(nRectangles, kLines, wCircles, gTriangles));

  const saveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Ошибка", "Разрешите доступ к галерее, чтобы сохранить изображение.");
        return;
      }

      if (svgRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Даем время для рендера

        const uri = await captureRef(svgRef, {
          format: 'png',
          quality: 1,
          
        });

        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Download', asset, false);

        Alert.alert("Успешно!", "Изображение сохранено в галерее.");
      } else {
        Alert.alert("Ошибка", "SVG не найден!");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      Alert.alert("Ошибка", "Не удалось сохранить изображение.");
    }
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
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

          <View ref={svgRef} collapsable={false} className='mb-8 items-center'> 
            <Svg height="300" width="300">
            <Rect x="0" y="0" width="300" height="300" fill="white" />
              {shapes.map((shape, index) => {
                switch (shape.type) {
                  case 'rect':
                    return <Rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.color} />;
                  case 'line':
                    return <Line key={index} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} stroke={shape.color} strokeWidth="2" />;
                  case 'circle':
                    return <Circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.color} />;
                  case 'triangle':
                      if (shape.points) { // Добавляем проверку на существование points
                        return (
                          <Polygon key={index} points={shape.points.map(p => p.join(',')).join(' ')} fill={shape.color} />
                        );
                      }
                      return null;
                    default:
                      return null;
                }
              })}
            </Svg>
          </View>        
        
          <View className='flex flex-row mb-8 justify-between'>
            <TouchableOpacity 
              onPress={() => setShapes(generateShapes(nRectangles, kLines, wCircles, gTriangles))} 
              className='bg-blue rounded-2xl w-4/5 h-14 items-center justify-center mb-8'>
              <Text className='text-white text-base font-roboto'>Перегенерировать</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveImage}>
              <Image source={icons.download} className='size-10 pt-2'/>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatternGeom;
