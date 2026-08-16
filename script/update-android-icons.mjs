import fs from 'fs';
import path from 'path';

const androidResDir = path.resolve('android/app/src/main/res');
const sourceIconPath = path.resolve('resources/icon.png');

console.log('🔄 Configuring Android 15 (API Level 35) Compatibility & Icons...');

// 1. Configure variables.gradle for Android 15
const variablesPath = path.resolve('android/variables.gradle');
if (fs.existsSync(variablesPath)) {
  let variablesContent = `ext {
    minSdkVersion = 24
    compileSdkVersion = 35
    targetSdkVersion = 35
    androidxActivityVersion = '1.9.2'
    androidxAppCompatVersion = '1.7.0'
    androidxCoordinatorLayoutVersion = '1.2.0'
    androidxCoreVersion = '1.13.1'
    androidxFragmentVersion = '1.8.3'
    coreSplashScreenVersion = '1.0.1'
    androidxWebkitVersion = '1.12.0'
    junitVersion = '4.13.2'
    androidxJunitVersion = '1.2.1'
    androidxEspressoCoreVersion = '3.6.1'
    cordovaAndroidVersion = '10.1.1'
}
`;
  fs.writeFileSync(variablesPath, variablesContent);
  console.log('✅ Configured variables.gradle (targetSdkVersion 35 for Android 15)');
}

// 2. Configure app/build.gradle for signing & ABIs
const buildGradlePath = path.resolve('android/app/build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf-8');
  buildGradle = buildGradle.replace(/compileSdk\s+\d+/, 'compileSdk 35');
  buildGradle = buildGradle.replace(/targetSdk\s+\d+/, 'targetSdk 35');
  buildGradle = buildGradle.replace(/minSdk\s+\d+/, 'minSdk 24');

  if (!buildGradle.includes('v2SigningEnabled')) {
    buildGradle = buildGradle.replace(
      /buildTypes\s*{/,
      `signingConfigs {
        debug {
            v1SigningEnabled true
            v2SigningEnabled true
        }
    }
    buildTypes {`
    );
  }
  fs.writeFileSync(buildGradlePath, buildGradle);
  console.log('✅ Configured app/build.gradle with V1/V2 signatures and SDK 35');
}

// 3. Update AndroidManifest.xml for Android 15 requirements
const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, 'utf-8');
  if (!manifest.includes('android:exported="true"')) {
    manifest = manifest.replace(/<activity\s+android:name="\.MainActivity"/, '<activity android:name=".MainActivity" android:exported="true"');
  }
  fs.writeFileSync(manifestPath, manifest);
  console.log('✅ AndroidManifest.xml updated for Android 15');
}

// 4. Update Launcher & Dock Icons
if (fs.existsSync(androidResDir) && fs.existsSync(sourceIconPath)) {
  const iconBuffer = fs.readFileSync(sourceIconPath);

  const mipmapDirs = [
    'mipmap-mdpi',
    'mipmap-hdpi',
    'mipmap-xhdpi',
    'mipmap-xxhdpi',
    'mipmap-xxxhdpi'
  ];

  for (const mDir of mipmapDirs) {
    const targetDir = path.join(androidResDir, mDir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), iconBuffer);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), iconBuffer);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), iconBuffer);
  }

  // Update App Display Name in strings.xml
  const stringsPath = path.join(androidResDir, 'values/strings.xml');
  if (fs.existsSync(stringsPath)) {
    let strings = fs.readFileSync(stringsPath, 'utf-8');
    strings = strings.replace(/<string name="app_name">.*?<\/string>/, '<string name="app_name">PropSight.in</string>');
    strings = strings.replace(/<string name="title_activity_main">.*?<\/string>/, '<string name="title_activity_main">PropSight.in</string>');
    fs.writeFileSync(stringsPath, strings);
  }

  console.log('✅ App Launcher Icons and Titles updated!');
}
