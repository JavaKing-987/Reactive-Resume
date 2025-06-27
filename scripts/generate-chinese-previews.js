#!/usr/bin/env node

/**
 * Script to generate Chinese template preview images
 * This script uses the artboard component to render Chinese templates and capture them as images
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTBOARD_URL = 'http://localhost:6173/artboard/preview';
const OUTPUT_DIR = path.join(__dirname, '../apps/client/public/templates/jpg');
const TEMPLATES_DIR = path.join(__dirname, '../apps/client/public/templates/json');

// Chinese template names
const CHINESE_TEMPLATES = [
  'azurill-zh',
  'bronzor-zh', 
  'chikorita-zh',
  'ditto-zh',
  'gengar-zh',
  'glalie-zh',
  'kakuna-zh',
  'leafish-zh',
  'nosepass-zh',
  'onyx-zh',
  'pikachu-zh',
  'rhyhorn-zh'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generatePreview(templateName) {
  const browser = await puppeteer.launch({ 
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // 使用系统Chrome
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  
  try {
    const page = await browser.newPage();
    
    // Load template data
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.json`);
    if (!fs.existsSync(templatePath)) {
      console.error(`Template file not found: ${templatePath}`);
      return false;
    }
    
    const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    
    // Set viewport first
    await page.setViewport({ 
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2 
    });
    
    // Set local storage before navigating
    await page.evaluateOnNewDocument((data) => {
      localStorage.setItem('resume', JSON.stringify(data));
    }, templateData);
    
    // Navigate to artboard
    await page.goto(ARTBOARD_URL, { waitUntil: 'networkidle0' });
    
    // Wait for the store to be initialized and set the resume data
    await page.evaluate((data) => {
      // Wait for artboard store to be available
      if (window.useArtboardStore) {
        const store = window.useArtboardStore.getState();
        if (store.setResume) {
          store.setResume(data);
        }
      }
    }, templateData);
    
    // Wait for content to render
    await sleep(5000);
    
    // Wait for page element to be rendered
    await page.waitForSelector('[data-page="1"]', { timeout: 20000 });
    
    // Wait a bit more for fonts and styles to load
    await sleep(3000);
    
    // Take screenshot of the first page
    const element = await page.$('[data-page="1"]');
    if (!element) {
      console.error(`Could not find page element for ${templateName}`);
      return false;
    }
    
    const outputPath = path.join(OUTPUT_DIR, `${templateName}.jpg`);
    await element.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 85
    });
    
    console.log(`✅ Generated preview for ${templateName}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating preview for ${templateName}:`, error.message);
    return false;
  } finally {
    await browser.close();
  }
}

async function checkArtboardServer() {
  try {
    const response = await fetch(ARTBOARD_URL);
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🎨 Chinese Template Preview Generator');
  console.log('=====================================\n');
  
  // Check if artboard server is running
  console.log('Checking artboard server...');
  const serverRunning = await checkArtboardServer();
  
  if (!serverRunning) {
    console.error('❌ Artboard server is not running!');
    console.log('Please start the artboard server first:');
    console.log('  cd apps/artboard && pnpm dev');
    console.log('  OR');
    console.log('  pnpm --filter artboard dev');
    process.exit(1);
  }
  
  console.log('✅ Artboard server is running\n');
  
  // Generate previews for all Chinese templates
  let successCount = 0;
  let failureCount = 0;
  
  for (const templateName of CHINESE_TEMPLATES) {
    console.log(`🔄 Processing ${templateName}...`);
    const success = await generatePreview(templateName);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay between generations
    await sleep(2000);
  }
  
  console.log('\n📊 Generation Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  
  if (failureCount === 0) {
    console.log('\n🎉 All Chinese template previews generated successfully!');
  } else {
    console.log('\n⚠️  Some previews failed to generate. Check the errors above.');
    process.exit(1);
  }
}

// Install required dependencies if missing
const requiredPackages = ['puppeteer'];
const missingPackages = [];

for (const pkg of requiredPackages) {
  try {
    require.resolve(pkg);
  } catch {
    missingPackages.push(pkg);
  }
}

if (missingPackages.length > 0) {
  console.error('❌ Missing required packages:', missingPackages.join(', '));
  console.log('Please install them first:');
  console.log(`  npm install ${missingPackages.join(' ')}`);
  process.exit(1);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generatePreview, CHINESE_TEMPLATES };