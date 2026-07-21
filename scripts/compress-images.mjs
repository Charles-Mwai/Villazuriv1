/**
 * compress-images.mjs
 * Compresses oversized images used across the Villa Zuri website.
 * Targets: Archive (3)/, HERO/, Activities/, watamu/, and root-level images.
 * Safe to re-run — already-compressed files will still be processed but will stay small.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

// Images actively used by the site and their target max widths
const targets = [
    // ── Archive (3) gallery (new gallery used on /experience and /gallery) ──
    { file: 'Archive (3)/LIVING/IMG_9204.jpg',      maxW: 1800, quality: 82 },
    { file: 'Archive (3)/LIVING/IMG_9206.jpg',      maxW: 1800, quality: 82 },
    { file: 'Archive (3)/LIVING/IMG_9210.jpg',      maxW: 1800, quality: 82 },
    { file: 'Archive (3)/LIVING/IMG_9349.jpg',      maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BEDROOM/IMG_9244.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BEDROOM/IMG_9250.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BEDROOM/IMG_9340.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BEDROOM/IMG_9341.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BATHROOM/IMG_9239.jpg',    maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BATHROOM/IMG_9311.jpg',    maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BATHROOM/IMG_9334.jpg',    maxW: 1800, quality: 82 },
    { file: 'Archive (3)/BATHROOM/IMG_9336.jpg',    maxW: 1800, quality: 82 },
    { file: 'Archive (3)/KITCHEN/IMG_9211.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/KITCHEN/IMG_9292.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/KITCHEN/IMG_9300.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/KITCHEN/IMG_9301.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/TERRACE/IMG_5541-cmpr.jpg',maxW: 1800, quality: 82 },
    { file: 'Archive (3)/TERRACE/IMG_9383.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/TERRACE/IMG_9389.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/TERRACE/IMG_9399.jpg',     maxW: 1800, quality: 82 },
    { file: 'Archive (3)/GREEN/DJI_0671.jpg',       maxW: 1800, quality: 80 },
    { file: 'Archive (3)/GREEN/IMG_9226.jpg',       maxW: 1800, quality: 80 },
    { file: 'Archive (3)/GREEN/IMG_9359.jpg',       maxW: 1800, quality: 80 },
    { file: 'Archive (3)/GREEN/IMG_9362.jpg',       maxW: 1800, quality: 80 },
    { file: 'Archive (3)/DECOR/IMG_9231.jpg',       maxW: 1800, quality: 82 },
    { file: 'Archive (3)/DECOR/IMG_9235.jpg',       maxW: 1800, quality: 82 },
    { file: 'Archive (3)/DECOR/IMG_9295.jpg',       maxW: 1800, quality: 82 },
    { file: 'Archive (3)/DECOR/IMG_9408.jpg',       maxW: 1800, quality: 82 },

    // ── Pool section ──
    { file: 'Archive (3)/POOL/DJI_0673.jpg',        maxW: 1800, quality: 80 },
    { file: 'Archive (3)/POOL/DJI_0674.jpg',        maxW: 1800, quality: 80 },
    { file: 'Archive (3)/POOL/DJI_0689.jpg',        maxW: 1800, quality: 80 },
    { file: 'Archive (3)/POOL/IMG_9371.jpg',        maxW: 1800, quality: 82 },

    // ── Hero slideshow (background-image, full-bleed) ──
    { file: 'Archive (3)/HEROO/DJI_0674.jpg',   maxW: 1920, quality: 78 },
    { file: 'Archive (3)/HEROO/DJI_0689.jpg',   maxW: 1920, quality: 78 },
    { file: 'Archive (3)/HEROO/IMG_9215.jpg',   maxW: 1920, quality: 78 },
    { file: 'Archive (3)/HEROO/IMG_9217.jpg',   maxW: 1920, quality: 78 },
    { file: 'Archive (3)/HEROO/IMG_9224.jpg',   maxW: 1920, quality: 78 },
    { file: 'Archive (3)/HEROO/IMG_9229.jpg',   maxW: 1920, quality: 78 },
    { file: 'Archive (3)/HEROO/IMG_9282.jpg',   maxW: 1920, quality: 78 },

    // ── Homepage Living section ──
    { file: 'hliving/IMG_9216.jpg',             maxW: 1400, quality: 82 },
    { file: 'hliving/IMG_9239.jpg',             maxW: 1400, quality: 82 },
    { file: 'hliving/IMG_9340.jpg',             maxW: 1400, quality: 82 },

    // ── Homepage Play section ──
    { file: 'play/DJI_0689.jpg',                maxW: 1400, quality: 82 },
    { file: 'play/IMG_9359.jpg',                maxW: 1400, quality: 82 },
    { file: 'play/IMG_9371.jpg',                maxW: 1400, quality: 82 },

    // ── Homepage Relaxation section ──
    { file: 'relaxation/IMG_9359.jpg',          maxW: 1400, quality: 82 },
    { file: 'relaxation/IMG_9362.jpg',          maxW: 1400, quality: 82 },
    { file: 'relaxation/IMG_9418.jpg',          maxW: 1400, quality: 82 },

    // ── Activities section ──
    { file: 'Activities/activity-1.jpg', maxW: 1200, quality: 82 },
    { file: 'Activities/activity-2.jpg', maxW: 1200, quality: 82 },
    { file: 'Activities/activity-3.jpg', maxW: 1200, quality: 82 },
    { file: 'Activities/activity-4.jpg', maxW: 1200, quality: 82 },

    // ── Watamu / Stories section ──
    { file: 'watamu/dimitry-b-gO3uzl86USU-unsplash.jpg',                       maxW: 1400, quality: 78 },
    { file: 'watamu/john-mukiibi-elijah-dOaiQnOPO60-unsplash.jpg',              maxW: 1400, quality: 78 },
    { file: 'watamu/abner-abiu-castillo-diaz-N5ByCirHVqw-unsplash.jpg',         maxW: 1400, quality: 78 },
    { file: 'watamu/maximus-beaumont-v30ztCrmzQg-unsplash.jpg',                 maxW: 1400, quality: 78 },
    { file: 'watamu/abdul-noor-cGOVWwGKmwM-unsplash.jpg',                       maxW: 1400, quality: 78 },
    { file: 'watamu/timothy-k-5KBI2j3UDR0-unsplash.jpg',                        maxW: 1400, quality: 78 },
    { file: 'watamu/andrew-molo-hdzYmowUDJY-unsplash.jpg',                      maxW: 1400, quality: 80 },
    { file: 'watamu/wexor-tmg-L-2p8fapOA8-unsplash.jpg',                        maxW: 1400, quality: 80 },

    // ── Experience page service image ──
    { file: 'IMG_5515-cmpr.jpg', maxW: 1200, quality: 82 },

    // ── Experience hero (set via CSS background-image in ExperiencePage.css) ──
    { file: 'IMG_5552-cmpr.jpg', maxW: 1920, quality: 78 },
];

let totalSavedKB = 0;

async function compress(target) {
    const fullPath = path.join(publicDir, target.file);
    if (!fs.existsSync(fullPath)) {
        console.log(`  ⚠  MISSING: ${target.file}`);
        return;
    }

    const beforeBytes = fs.statSync(fullPath).size;
    const beforeKB = (beforeBytes / 1024).toFixed(1);

    // Read metadata to check current dimensions
    const meta = await sharp(fullPath).metadata();
    const needsResize = meta.width > target.maxW;

    const pipeline = sharp(fullPath);
    if (needsResize) {
        pipeline.resize({ width: target.maxW, withoutEnlargement: true });
    }

    const ext = path.extname(fullPath).toLowerCase();
    let buf;
    if (ext === '.jpg' || ext === '.jpeg') {
        buf = await pipeline.jpeg({ quality: target.quality, mozjpeg: true }).toBuffer();
    } else if (ext === '.png') {
        buf = await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
    } else if (ext === '.webp') {
        buf = await pipeline.webp({ quality: target.quality }).toBuffer();
    } else {
        console.log(`  ⏭  SKIPPED (unsupported ext): ${target.file}`);
        return;
    }

    const afterKB = (buf.length / 1024).toFixed(1);
    const savedKB = ((beforeBytes - buf.length) / 1024).toFixed(1);

    // Only write back if we saved space (never inflate already-compressed images)
    if (buf.length < beforeBytes) {
        // Write to a temp file first, then rename to avoid Windows lock issues with
        // paths containing spaces and parentheses (e.g., "Archive (3)")
        const tmpPath = fullPath + '.tmp';
        fs.writeFileSync(tmpPath, buf);
        fs.renameSync(tmpPath, fullPath);
        totalSavedKB += parseFloat(savedKB);
        const pct = Math.round((1 - buf.length / beforeBytes) * 100);
        const resizeNote = needsResize ? ` [resized ${meta.width}→${target.maxW}px]` : '';
        console.log(`  ✅ ${target.file.padEnd(60)} ${beforeKB.padStart(7)} KB → ${afterKB.padStart(7)} KB  (−${savedKB} KB, ${pct}%)${resizeNote}`);
    } else {
        console.log(`  ✔  ${target.file.padEnd(60)} already optimal at ${beforeKB} KB`);
    }
}

console.log('\n🔍 Villa Zuri — Image Compression Audit\n');
console.log('='.repeat(90));

for (const target of targets) {
    await compress(target);
}

console.log('='.repeat(90));
console.log(`\n🎉 Done! Total space saved: ${(totalSavedKB / 1024).toFixed(2)} MB\n`);
