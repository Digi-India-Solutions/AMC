Write-Host "🧹 Cleaning React Native Android build..."

cd "$PSScriptRoot/../android"

# Stop Gradle daemons & unlock files
./gradlew --stop | Out-Null
taskkill /IM java.exe /F /T | Out-Null
taskkill /IM gradle.exe /F /T | Out-Null

# Remove only build artifacts, keep node_modules
Remove-Item -Recurse -Force "app\build","app\.cxx","build",".gradle" -ErrorAction SilentlyContinue

Write-Host "⚙️  Reinstalling & regenerating codegen..."
cd "$PSScriptRoot/.."
npm install
npx react-native codegen

Write-Host "🏗️  Building release APK..."
cd "android"
./gradlew assembleRelease -x lintVitalRelease

Write-Host "✅ Build complete!"
Start-Process "explorer.exe" "app\build\outputs\apk\release"
