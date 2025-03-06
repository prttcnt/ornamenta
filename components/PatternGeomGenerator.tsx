import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import Svg, { Rect, Line, Circle, Polygon } from 'react-native-svg';

// Определяем возможные типы фигур
interface Shape {
  type: 'rect' | 'line' | 'circle' | 'triangle';
  color: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  points?: [number, number][];
}

// Функция для случайных чисел
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Доступные цвета
const COLORS = ['red', 'blue', 'green', 'yellow', 'pink', 'teal', 'orange'];

const PatternGenerator = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  const generatePattern = () => {
    const newShapes: Shape[] = [];

    // Генерация прямоугольников
    for (let i = 0; i < 3; i++) {
      newShapes.push({
        type: 'rect',
        x: getRandomInt(0, 250),
        y: getRandomInt(0, 250),
        width: getRandomInt(30, 50),
        height: getRandomInt(30, 50),
        color: COLORS[getRandomInt(0, COLORS.length - 1)],
      });
    }

    // Генерация кругов
    for (let i = 0; i < 2; i++) {
      newShapes.push({
        type: 'circle',
        cx: getRandomInt(20, 280),
        cy: getRandomInt(20, 280),
        r: getRandomInt(10, 20),
        color: COLORS[getRandomInt(0, COLORS.length - 1)],
      });
    }

    // Генерация линий
    for (let i = 0; i < 2; i++) {
      newShapes.push({
        type: 'line',
        x1: getRandomInt(0, 300),
        y1: getRandomInt(0, 300),
        x2: getRandomInt(0, 300),
        y2: getRandomInt(0, 300),
        color: COLORS[getRandomInt(0, COLORS.length - 1)],
      });
    }

    // Генерация треугольников
    for (let i = 0; i < 2; i++) {
      const points: [number, number][] = [
        [getRandomInt(0, 300), getRandomInt(0, 300)],
        [getRandomInt(0, 300), getRandomInt(0, 300)],
        [getRandomInt(0, 300), getRandomInt(0, 300)],
      ];
      newShapes.push({
        type: 'triangle',
        points,
        color: COLORS[getRandomInt(0, COLORS.length - 1)],
      });
    }

    setShapes(newShapes);
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Генератор Паттернов</Text>

      <Button title="Сгенерировать" onPress={generatePattern} />

      <Svg height="300" width="300" style={{ backgroundColor: '#fff', marginTop: 20 }}>
        <Rect x="0" y="0" width="300" height="300" fill="white" />
        {shapes.map((shape, index) => {
          if (shape.type === 'rect') {
            return (
              <Rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.color} />
            );
          } else if (shape.type === 'line') {
            return <Line key={index} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} stroke={shape.color} strokeWidth="2" />;
          } else if (shape.type === 'circle') {
            return <Circle key={index} cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.color} />;
          } else if (shape.type === 'triangle' && shape.points) {
            return <Polygon key={index} points={shape.points.map((p) => p.join(',')).join(' ')} fill={shape.color} />;
          }
          return null;
        })}
      </Svg>
    </ScrollView>
  );
};

export default PatternGenerator;
