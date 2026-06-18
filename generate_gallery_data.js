const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, 'assets', 'images', 'Product');
const outputFilePath = path.join(__dirname, 'assets', 'js', 'gallery-product-data.js');

try {
    if (!fs.existsSync(productDir)) {
        console.error(`Error: Directory not found: ${productDir}`);
        process.exit(1);
    }

    const files = fs.readdirSync(productDir);
    const data = [];

    let imageCount = 0;
    let videoCount = 0;

    // Sort files naturally so they maintain logical ordering (e.g. WhatsApp timestamp order)
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        let type = '';
        let title = '';

        if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
            type = 'image';
            imageCount++;
            title = `Topaz FRP Product Specimen ${imageCount}`;
        } else if (['.mp4', '.webm', '.ogg', '.mov'].includes(ext)) {
            type = 'video';
            videoCount++;
            title = `Topaz FRP Quality Test Video ${videoCount}`;
        } else {
            // Ignore other files
            return;
        }

        data.push({
            filename: file,
            title: title,
            type: type
        });
    });

    // Write to JS file
    const content = `/**
 * TOPAZ FRP - Dynamic Product Gallery Image Data
 * Automatically compiled from assets/images/Product
 */

const GALLERY_PRODUCT_DATA = ${JSON.stringify(data, null, 4)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GALLERY_PRODUCT_DATA;
}
`;

    fs.writeFileSync(outputFilePath, content, 'utf8');
    console.log(`Success: Generated ${data.length} gallery items (${imageCount} images, ${videoCount} videos) to ${outputFilePath}`);
} catch (error) {
    console.error('An error occurred during file generation:', error);
}
