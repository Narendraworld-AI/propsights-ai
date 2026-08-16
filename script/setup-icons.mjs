import fs from 'fs';
import path from 'path';

const selectedIconPath = '/Users/admin/.gemini/antigravity/brain/1d076a6c-a303-4717-b683-81875e9a75e5/propsight_app_icon_1786893084991.jpg';

const publicDir = path.resolve('client/public');
const resourcesDir = path.resolve('resources');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(resourcesDir)) fs.mkdirSync(resourcesDir, { recursive: true });

if (fs.existsSync(selectedIconPath)) {
  const iconBuffer = fs.readFileSync(selectedIconPath);
  
  // Save into web assets
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), iconBuffer);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), iconBuffer);
  fs.writeFileSync(path.join(publicDir, 'app-icon.png'), iconBuffer);
  
  // Save into Capacitor resources
  fs.writeFileSync(path.join(resourcesDir, 'icon.png'), iconBuffer);
  fs.writeFileSync(path.join(resourcesDir, 'splash.png'), iconBuffer);
  
  console.log('✅ First icon set across client/public and resources folders.');
}
