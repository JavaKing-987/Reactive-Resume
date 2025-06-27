# Chinese Template System

This document describes the bilingual template system in Reactive Resume, which provides both English and Chinese versions of all templates.

## Features

### 1. 🌐 Language-Based Template Filtering

The template system automatically filters templates based on the user's language preference:

- **Chinese users** (`zh-CN`, `zh-TW`): See Chinese templates by default
- **English users** (`en-US`, `en-*`): See English templates by default  
- **Other language users**: See both versions with English prioritized

### 2. 📝 Complete Content Translation

Chinese templates (`-zh` suffix) include:
- ✅ Translated personal information (张三 for John Doe)
- ✅ Translated section headers (个人简介, 工作经历, 教育背景, etc.)
- ✅ Translated job descriptions and project details
- ✅ Translated skills and certifications
- ✅ Proper Chinese formatting and terminology

### 3. 🎨 Template Preview Images

Each template has corresponding preview images:
- English: `template-name.jpg`
- Chinese: `template-name-zh.jpg`

## Available Chinese Templates

All 12 templates have Chinese versions:

| Template | English | Chinese |
|----------|---------|---------|
| Azurill | `azurill.json` | `azurill-zh.json` |
| Bronzor | `bronzor.json` | `bronzor-zh.json` |
| Chikorita | `chikorita.json` | `chikorita-zh.json` |
| Ditto | `ditto.json` | `ditto-zh.json` |
| Gengar | `gengar.json` | `gengar-zh.json` |
| Glalie | `glalie.json` | `glalie-zh.json` |
| Kakuna | `kakuna.json` | `kakuna-zh.json` |
| Leafish | `leafish.json` | `leafish-zh.json` |
| Nosepass | `nosepass.json` | `nosepass-zh.json` |
| Onyx | `onyx.json` | `onyx-zh.json` |
| Pikachu | `pikachu.json` | `pikachu-zh.json` |
| Rhyhorn | `rhyhorn.json` | `rhyhorn-zh.json` |

## How to Use

### For Users

1. **Set your language preference** in Settings → Profile → Language
2. **Choose Chinese** (`zh-CN` for Simplified or `zh-TW` for Traditional)
3. **Navigate to the Builder** and go to the Templates section
4. **Click on any template** to apply Chinese content automatically

### For Developers

#### Generating Chinese Preview Images

The system includes a script to generate proper Chinese preview images:

```bash
# 1. Install dependencies
npm install puppeteer

# 2. Start the artboard server (in a separate terminal)
pnpm --filter artboard dev
# OR
cd apps/artboard && pnpm dev

# 3. Run the preview generation script
node scripts/generate-chinese-previews.js
```

#### Adding New Translations

To add a new Chinese template:

1. **Create the JSON file**: `apps/client/public/templates/json/template-name-zh.json`
2. **Translate all content** while maintaining the same structure
3. **Add to template list**: Update `libs/utils/src/namespaces/template.ts`
4. **Generate preview**: Run the preview generation script

## Technical Implementation

### Template Loading

The system uses smart template loading that:
- Detects user language from auth store
- Filters available templates based on preference
- Loads complete template content (not just styling)
- Applies translated content to all resume sections

### Layout Validation

Chinese templates include layout validation to ensure:
- Proper two-column structure
- Compatible section arrangements
- Consistent metadata format

### Content Translation Strategy

Chinese templates use:
- **Professional terminology** for job titles and industries
- **Standard Chinese formatting** for dates and locations
- **Culturally appropriate examples** for skills and projects
- **Consistent naming conventions** (张三 as the standard placeholder name)

## Troubleshooting

### Preview Images Show English Content

If Chinese template previews still show English content:

1. Verify the artboard server is running on port 6173
2. Run the preview generation script
3. Check that Chinese JSON files exist and have proper content
4. Clear browser cache and reload

### Templates Not Filtering by Language

1. Check user language setting in Profile settings
2. Verify locale is properly set (`zh-CN` or `zh-TW`)
3. Reload the application after changing language

### Missing Chinese Templates

1. Verify all Chinese JSON files exist in `apps/client/public/templates/json/`
2. Check that template names are added to `templatesList` in `libs/utils/src/namespaces/template.ts`
3. Restart the development server

## Future Enhancements

- 🎨 **Automatic preview generation** during build process
- 🌏 **Additional language support** (Japanese, Korean, etc.)
- 📱 **Mobile-optimized template previews**
- 🎯 **Industry-specific Chinese templates**
- 🔧 **Template customization tools** for different regions

## Contributing

To contribute to the Chinese template system:

1. Ensure translations are professional and culturally appropriate
2. Maintain consistent formatting and structure
3. Test with actual Chinese users for feedback
4. Generate proper preview images
5. Update documentation for new features

---

For questions or support, please refer to the main documentation or open an issue on GitHub. 
 

This document describes the bilingual template system in Reactive Resume, which provides both English and Chinese versions of all templates.

## Features

### 1. 🌐 Language-Based Template Filtering

The template system automatically filters templates based on the user's language preference:

- **Chinese users** (`zh-CN`, `zh-TW`): See Chinese templates by default
- **English users** (`en-US`, `en-*`): See English templates by default  
- **Other language users**: See both versions with English prioritized

### 2. 📝 Complete Content Translation

Chinese templates (`-zh` suffix) include:
- ✅ Translated personal information (张三 for John Doe)
- ✅ Translated section headers (个人简介, 工作经历, 教育背景, etc.)
- ✅ Translated job descriptions and project details
- ✅ Translated skills and certifications
- ✅ Proper Chinese formatting and terminology

### 3. 🎨 Template Preview Images

Each template has corresponding preview images:
- English: `template-name.jpg`
- Chinese: `template-name-zh.jpg`

## Available Chinese Templates

All 12 templates have Chinese versions:

| Template | English | Chinese |
|----------|---------|---------|
| Azurill | `azurill.json` | `azurill-zh.json` |
| Bronzor | `bronzor.json` | `bronzor-zh.json` |
| Chikorita | `chikorita.json` | `chikorita-zh.json` |
| Ditto | `ditto.json` | `ditto-zh.json` |
| Gengar | `gengar.json` | `gengar-zh.json` |
| Glalie | `glalie.json` | `glalie-zh.json` |
| Kakuna | `kakuna.json` | `kakuna-zh.json` |
| Leafish | `leafish.json` | `leafish-zh.json` |
| Nosepass | `nosepass.json` | `nosepass-zh.json` |
| Onyx | `onyx.json` | `onyx-zh.json` |
| Pikachu | `pikachu.json` | `pikachu-zh.json` |
| Rhyhorn | `rhyhorn.json` | `rhyhorn-zh.json` |

## How to Use

### For Users

1. **Set your language preference** in Settings → Profile → Language
2. **Choose Chinese** (`zh-CN` for Simplified or `zh-TW` for Traditional)
3. **Navigate to the Builder** and go to the Templates section
4. **Click on any template** to apply Chinese content automatically

### For Developers

#### Generating Chinese Preview Images

The system includes a script to generate proper Chinese preview images:

```bash
# 1. Install dependencies
npm install puppeteer

# 2. Start the artboard server (in a separate terminal)
pnpm --filter artboard dev
# OR
cd apps/artboard && pnpm dev

# 3. Run the preview generation script
node scripts/generate-chinese-previews.js
```

#### Adding New Translations

To add a new Chinese template:

1. **Create the JSON file**: `apps/client/public/templates/json/template-name-zh.json`
2. **Translate all content** while maintaining the same structure
3. **Add to template list**: Update `libs/utils/src/namespaces/template.ts`
4. **Generate preview**: Run the preview generation script

## Technical Implementation

### Template Loading

The system uses smart template loading that:
- Detects user language from auth store
- Filters available templates based on preference
- Loads complete template content (not just styling)
- Applies translated content to all resume sections

### Layout Validation

Chinese templates include layout validation to ensure:
- Proper two-column structure
- Compatible section arrangements
- Consistent metadata format

### Content Translation Strategy

Chinese templates use:
- **Professional terminology** for job titles and industries
- **Standard Chinese formatting** for dates and locations
- **Culturally appropriate examples** for skills and projects
- **Consistent naming conventions** (张三 as the standard placeholder name)

## Troubleshooting

### Preview Images Show English Content

If Chinese template previews still show English content:

1. Verify the artboard server is running on port 6173
2. Run the preview generation script
3. Check that Chinese JSON files exist and have proper content
4. Clear browser cache and reload

### Templates Not Filtering by Language

1. Check user language setting in Profile settings
2. Verify locale is properly set (`zh-CN` or `zh-TW`)
3. Reload the application after changing language

### Missing Chinese Templates

1. Verify all Chinese JSON files exist in `apps/client/public/templates/json/`
2. Check that template names are added to `templatesList` in `libs/utils/src/namespaces/template.ts`
3. Restart the development server

## Future Enhancements

- 🎨 **Automatic preview generation** during build process
- 🌏 **Additional language support** (Japanese, Korean, etc.)
- 📱 **Mobile-optimized template previews**
- 🎯 **Industry-specific Chinese templates**
- 🔧 **Template customization tools** for different regions

## Contributing

To contribute to the Chinese template system:

1. Ensure translations are professional and culturally appropriate
2. Maintain consistent formatting and structure
3. Test with actual Chinese users for feedback
4. Generate proper preview images
5. Update documentation for new features

---

For questions or support, please refer to the main documentation or open an issue on GitHub. 
 
 