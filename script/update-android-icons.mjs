import fs from 'fs';
import path from 'path';

const androidResDir = path.resolve('android/app/src/main/res');
const sourceIconPath = path.resolve('resources/icon.png');

if (fs.existsSync(androidResDir) && fs.existsSync(sourceIconPath)) {
  console.log('🔄 Setting app icon to the selected PropSight dock icon...');
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

    // Overwrite standard and round launcher icons with the chosen icon
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), iconBuffer);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), iconBuffer);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), iconBuffer);
  }

  // Also update drawable splash & launcher
  const drawableDirs = ['drawable', 'drawable-v24', 'drawable-land-mdpi', 'drawable-land-hdpi', 'drawable-port-mdpi', 'drawable-port-hdpi'];
  for (const dDir of drawableDirs) {
    const targetDir = path.join(androidResDir, dDir);
    if (fs.existsSync(targetDir)) {
      fs.writeFileSync(path.join(targetDir, 'splash.png'), iconBuffer);
    }
  }

  // Update App Display Name in strings.xml
  const stringsPath = path.join(androidResDir, 'values/strings.xml');
  if (fs.existsSync(stringsPath)) {
    let strings = fs.readFileSync(stringsPath, 'utf-8');
    strings = strings.replace(/<string name="app_name">.*?<\/string>/, '<string name="app_name">PropSight.in</string>');
    strings = strings.replace(/<string name="title_activity_main">.*?<\/string>/, '<string name="title_activity_main">PropSight.in</string>');
    fs.writeFileSync(stringsPath, strings);
  }

  console.log('✅ Android Launcher Icons successfully replaced with selected icon!');
}
