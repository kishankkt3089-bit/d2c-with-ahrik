/**
 * Safely add favicon.ico <link> tag to all HTML files
 * Replaces: <link rel="icon" type="image/png" href="favicon.svg" sizes="any">
 * With:     <link rel="icon" type="image/x-icon" href="favicon.ico">
 *           <link rel="icon" type="image/png" href="favicon.svg" sizes="any">
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const OLD_TAG = '<link rel="icon" type="image/png" href="favicon.svg" sizes="any">';
const NEW_TAGS = '<link rel="icon" type="image/x-icon" href="favicon.ico">\n    <link rel="icon" type="image/png" href="favicon.svg" sizes="any">';

// For files that don't have the png tag, find the SVG tag instead
const SVG_TAG = '<link rel="icon" type="image/svg+xml" href="favicon.svg">';
const ICO_BEFORE_SVG = '<link rel="icon" type="image/x-icon" href="favicon.ico">\n    <link rel="icon" type="image/svg+xml" href="favicon.svg">';

let updated = 0;

for (const file of files) {
    const fp = path.join(dir, file);
    let content;
    try {
        content = fs.readFileSync(fp, 'utf8');
    } catch (e) {
        console.log('❌ Cannot read:', file);
        continue;
    }

    // Skip if already has ico
    if (content.includes('favicon.ico')) {
        console.log('⏭️  Already has ico:', file);
        continue;
    }

    let newContent = content;
    if (content.includes(OLD_TAG)) {
        newContent = content.replace(OLD_TAG, NEW_TAGS);
    } else if (content.includes(SVG_TAG)) {
        newContent = content.replace(SVG_TAG, ICO_BEFORE_SVG);
    } else {
        console.log('⚠️  No favicon tag found:', file);
        continue;
    }

    // Validate — make sure file is not empty
    if (newContent.length < 100) {
        console.log('❌ Safety check failed, skipping:', file);
        continue;
    }

    fs.writeFileSync(fp, newContent, 'utf8');
    console.log('✅ Updated:', file);
    updated++;
}

console.log(`\n🎉 Done! ${updated} files updated with favicon.ico`);
