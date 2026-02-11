#  React Native Expo - Commandes importantes

## Installer Expo CLI et EAS CLI
npm install -g expo-cli
npm install -g eas-cli

## Créer un projet Expo avec TypeScript
npx create-expo-app Garage --template expo-template-blank-typescript
cd Garage

## Lancer le projet en développement
npx expo start

## Installer Firebase
npm install firebase

## Installer Expo Router pour la navigation
npm install expo-router

## Build Android APK / AAB avec EAS
eas login
eas build:configure
eas build --platform android --profile preview    # APK installable
eas build --platform android --profile production # AAB pour Play Store

## Nettoyage et réinstallation des dépendances (si problème)
rmdir /s /q node_modules
del package-lock.json
npm install

## Export
adb --version
npx expo prebuild

cd android
gradlew clean
gradlew assembleDebug

APK généré ici
android/app/build/outputs/apk/debug/app-debug.apk