const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const POPUP_DIST_DIR = path.resolve(__dirname, '../popup-dist');
const MANIFEST_PATH = path.resolve(__dirname, '../manifest.json');

function extractInlineScripts() {
    if (!fs.existsSync(POPUP_DIST_DIR)) {
        console.error('Popup dist directory not found:', POPUP_DIST_DIR);
        process.exit(1);
    }

    const files = fs.readdirSync(POPUP_DIST_DIR);
    let allScriptsContent = '';

    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(POPUP_DIST_DIR, file);
            let content = fs.readFileSync(filePath, 'utf-8');

            // Matches <script>...</script> (non-greedy)
            // Captures content in group 1
            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

            let modifiedContent = content.replace(scriptRegex, (match, scriptContent) => {
                if (scriptContent && scriptContent.trim()) {
                    allScriptsContent += `\n// Extracted from ${file}\n` + scriptContent + '\n';
                    return ''; // Remove the inline script tag
                }
                return match; // Keep empty script tags if any (though usually we'd want to remove them too) or src tags
            });

            // Add reference to the external script file just before </body> or at the end
            if (allScriptsContent) {
                if (modifiedContent.includes('</body>')) {
                    modifiedContent = modifiedContent.replace('</body>', '<script src="csp-patch.js"></script></body>');
                } else {
                    modifiedContent += '<script src="csp-patch.js"></script>';
                }
            }

            fs.writeFileSync(filePath, modifiedContent);
            console.log(`Processed ${file}: Extracted inline scripts.`);
        }
    });

    if (allScriptsContent) {
        fs.writeFileSync(path.join(POPUP_DIST_DIR, 'csp-patch.js'), allScriptsContent);
        console.log('Created csp-patch.js with extracted scripts.');
    } else {
        console.log('No inline scripts found to extract.');
    }
}

function updateManifest() {
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error('Manifest file not found:', MANIFEST_PATH);
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

    // Standard MV3 CSP - No hashes, no unsafe-inline
    const csp = "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'";

    manifest.content_security_policy = {
        extension_pages: csp
    };

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log('Manifest updated with standard MV3 CSP:', csp);
}

extractInlineScripts();
updateManifest();
