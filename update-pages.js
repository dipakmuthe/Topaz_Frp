const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const productsDir = path.join(rootDir, 'products');

const rootLoaderHTML = `
    <!-- --- Page Loader --- -->
    <div id="web-loader" class="web-loader">
        <div class="loader-inner">
            <div class="loader-logo-container">
                <svg class="loader-svg" viewBox="0 0 100 100">
                    <circle class="loader-circle-bg" cx="50" cy="50" r="45"></circle>
                    <circle class="loader-circle-progress" cx="50" cy="50" r="45"></circle>
                </svg>
                <div class="loader-logo-wrap">
                    <img src="assets/images/logo.png" alt="TOPAZ Logo" class="loader-logo">
                </div>
            </div>
            <div class="loader-percentage">0%</div>
            <div class="loader-status">TOPAZ FRP</div>
        </div>
    </div>
    `;

const subLoaderHTML = `
    <!-- --- Page Loader --- -->
    <div id="web-loader" class="web-loader">
        <div class="loader-inner">
            <div class="loader-logo-container">
                <svg class="loader-svg" viewBox="0 0 100 100">
                    <circle class="loader-circle-bg" cx="50" cy="50" r="45"></circle>
                    <circle class="loader-circle-progress" cx="50" cy="50" r="45"></circle>
                </svg>
                <div class="loader-logo-wrap">
                    <img src="../assets/images/logo.png" alt="TOPAZ Logo" class="loader-logo">
                </div>
            </div>
            <div class="loader-percentage">0%</div>
            <div class="loader-status">TOPAZ FRP</div>
        </div>
    </div>
    `;

function processHTMLFile(filePath, loaderHTML) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Remove existing web-loader block by matching from loader comment to top-bar comment
    if (content.includes('<!-- --- Page Loader --- -->')) {
        content = content.replace(/<!-- --- Page Loader --- -->[\s\S]*?(?=<!-- --- Top bar --- -->)/g, '');
    }
    
    // 2. Add loading class to body tag
    const bodyRegex = /<body([^>]*)>/i;
    const match = content.match(bodyRegex);
    
    if (match) {
        let bodyAttributes = match[1];
        if (bodyAttributes.includes('class=')) {
            if (!bodyAttributes.includes('loading')) {
                bodyAttributes = bodyAttributes.replace(/class=["']([^"']*)["']/, (m, g1) => {
                    return `class="${g1} loading"`;
                });
            }
        } else {
            bodyAttributes = ` class="loading"${bodyAttributes}`;
        }
        
        const newBodyTag = `<body${bodyAttributes}>`;
        content = content.replace(bodyRegex, newBodyTag);
    }
    
    // 3. Inject loader HTML right after <body> tag
    const bodyTagMatch = content.match(/<body[^>]*>/i);
    if (bodyTagMatch) {
        const bodyTag = bodyTagMatch[0];
        const insertIndex = content.indexOf(bodyTag) + bodyTag.length;
        content = content.slice(0, insertIndex) + loaderHTML + content.slice(insertIndex);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated preloader in: ${filePath}`);
}

// Process root directory HTML files
const rootFiles = fs.readdirSync(rootDir);
rootFiles.forEach(file => {
    if (path.extname(file).toLowerCase() === '.html') {
        processHTMLFile(path.join(rootDir, file), rootLoaderHTML);
    }
});

// Process products directory HTML files
if (fs.existsSync(productsDir)) {
    const productFiles = fs.readdirSync(productsDir);
    productFiles.forEach(file => {
        if (path.extname(file).toLowerCase() === '.html') {
            processHTMLFile(path.join(productsDir, file), subLoaderHTML);
        }
    });
}
