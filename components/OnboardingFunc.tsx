import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключ для хранения флага
const ONBOARDING_KEY = 'hasShownOnboarding';

// Проверка, был ли Onboarding показан
export const checkOnboardingStatus = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value !== null; // Если значение есть, Onboarding уже был показан
  } catch (error) {
    console.error('Ошибка при чтении из AsyncStorage:', error);
    return false;
  }
};

// Сохранение флага, что Onboarding был показан
export const setOnboardingShown = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Ошибка при записи в AsyncStorage:', error);
  }
};

