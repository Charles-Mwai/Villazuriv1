/**
 * compress-images.js
 * Compresses all new images added to the Villa Zuri project:
 *   - public/HERO/          (hero slideshow images)
 *   - public/Archive (3)/   (gallery category images: LIVING, BEDROOM, BATHROOM, KITCHEN, TERRACE, GREEN, DECOR)
 *
 * Uses `sharp` for high-quality JPEG compression.
 * Overwrites originals in-place after backing up file sizes.
 *
 * Usage: node scripts/compress-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// All folders containing the new images
const TARGET_FOLDERS = [
    path.join(PUBLIC_DIR, 'HERO'),
    path.join(PUBLIC_DIR, 'Archive (3)', 'LIVING'),
    path.join(PUBLIC_DIR, 'Archive (3)', 'BEDROOM'),
    path.join(PUBLIC_DIR, 'Archive (3)', 'BATHROOM'),
    path.join(PUBLIC_DIR, 'Archive (3)', 'KITCHEN'),
    path.join(PUBLIC_DIR, 'Archive (3)', 'TERRACE'),
    path.join(PUBLIC_DIR, 'Archive (3)', 'GREEN'),
    path.join(PUBLIC_DIR, 'Archive (3)', 'DECOR'),
];

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Compression settings
const JPEG_QUALITY = 75;     // 75 is an excellent quality/size balance
const PNG_QUALITY  = 80;
const MAX_WIDTH    = 2400;   // Cap max width to 2400px (more than enough for web)

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) return null;

    const originalSize = fs.statSync(filePath).size;

    // Write to a temp file first, then replace original
    const tempPath = filePath + '.tmp';

    try {
        let pipeline = sharp(filePath).resize({
            width: MAX_WIDTH,
            withoutEnlargement: true, // Never upscale
        });

        if (ext === '.jpg' || ext === '.jpeg') {
            pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
        } else if (ext === '.png') {
            pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: JPEG_QUALITY });
        }

        await pipeline.toFile(tempPath);

        const compressedSize = fs.statSync(tempPath).size;

        // Only replace if the compressed file is actually smaller
        if (compressedSize < originalSize) {
            fs.renameSync(tempPath, filePath);
            const saved = originalSize - compressedSize;
            const pct = ((saved / originalSize) * 100).toFixed(1);
            return { filePath, originalSize, compressedSize, saved, pct, skipped: false };
        } else {
            // Already optimised — discard temp file
            fs.unlinkSync(tempPath);
            return { filePath, originalSize, compressedSize: originalSize, saved: 0, pct: '0.0', skipped: true };
        }
    } catch (err) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.error(`  ✗ Error compressing ${path.basename(filePath)}: ${err.message}`);
        return null;
    }
}

async function processFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.warn(`  ⚠ Folder not found, skipping: ${folderPath}`);
        return [];
    }

    const files = fs.readdirSync(folderPath).filter(f =>
        SUPPORTED_EXTENSIONS.includes(path.extname(f).toLowerCase()) && !f.startsWith('.')
    );

    if (files.length === 0) {
        console.log(`  (no images found)`);
        return [];
    }

    const results = [];
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        process.stdout.write(`  • ${file} ... `);
        const result = await compressImage(filePath);
        if (result) {
            if (result.skipped) {
                console.log(`already optimised`);
            } else {
                console.log(`${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (saved ${formatBytes(result.saved)}, ${result.pct}%)`);
            }
            results.push(result);
        }
    }
    return results;
}

async function main() {
    console.log('\n🗜  Villa Zuri Image Compressor');
    console.log('================================\n');

    let totalOriginal = 0;
    let totalCompressed = 0;
    let totalFiles = 0;
    let totalSkipped = 0;

    for (const folder of TARGET_FOLDERS) {
        const label = path.relative(PUBLIC_DIR, folder);
        console.log(`📁 ${label}`);
        const results = await processFolder(folder);

        for (const r of results) {
            totalOriginal += r.originalSize;
            totalCompressed += r.compressedSize;
            totalFiles++;
            if (r.skipped) totalSkipped++;
        }

        console.log('');
    }

    // Summary
    const totalSaved = totalOriginal - totalCompressed;
    const totalPct = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : '0.0';

    console.log('================================');
    console.log(`✅ Done! Processed ${totalFiles} image(s)`);
    console.log(`   Before : ${formatBytes(totalOriginal)}`);
    console.log(`   After  : ${formatBytes(totalCompressed)}`);
    console.log(`   Saved  : ${formatBytes(totalSaved)} (${totalPct}%)`);
    if (totalSkipped > 0) console.log(`   Skipped: ${totalSkipped} (already optimised)`);
    console.log('');
}

main();
