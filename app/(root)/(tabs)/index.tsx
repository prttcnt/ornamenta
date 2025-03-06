import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import Onboarding from "@/components/Onboarding";
import MainScreen from "../../../components/MainScreen"; // Импорт главного экрана
import { checkOnboardingStatus, setOnboardingShown } from "@/components/OnboardingFunc";

export default function Index() {
  const [isOnboardingShown, setIsOnboardingShown] = useState<boolean | null>(null);

  // Проверяем статус Onboarding
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      const hasShownOnboarding = await checkOnboardingStatus();
      setIsOnboardingShown(hasShownOnboarding);
    };

    loadOnboardingStatus();
  }, []);


  // Если статус загрузки, показываем индикатор загрузки
  if (isOnboardingShown === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Если Onboarding не был показан, показываем его
  if (!isOnboardingShown) {
    return (
      <Onboarding
        onComplete={async () => {
          await setOnboardingShown();
          setIsOnboardingShown(true);
        }}
      />
    );
  }

  // Главный экран 
  return (
      <View>
        <MainScreen />
      </View>
  );
  
}
