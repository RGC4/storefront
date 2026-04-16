# Store Asset Management

All store media and content lives in **Vercel Blob**, not in git.
Use `upload-asset.ts` to push changes. No redeploy needed.

## Blob structure

```
stores/
  s1/
    config.json          ← store config (seed-store.ts)
    videos/
      hero-1.mp4
      hero-2.mp4
      hero-3.mp4
    images/
      hero-1.jpg
      hero-2.jpg
      hero-3.jpg
    logo/
      logo-header.png
      logo-header-mobile.png
      logo-footer.png
      logo-footer-mobile.png
    policies/
      privacy_policy.html
      refund_policy.html
      shipping_policy.html
      terms_conditions.html
      about.html
    .hashes/             ← internal, used for change detection
  s2/
    ...
```

## Commands

### Upload a single file
```powershell
npx tsx scripts/upload-asset.ts --store=s1 --file=hero-1.mp4
npx tsx scripts/upload-asset.ts --store=s1 --file=privacy_policy.html
npx tsx scripts/upload-asset.ts --store=s1 --file=logo-header.png
```

### Upload all files of one type
```powershell
npx tsx scripts/upload-asset.ts --store=s1 --type=videos
npx tsx scripts/upload-asset.ts --store=s1 --type=policies
npx tsx scripts/upload-asset.ts --store=s1 --type=logo
npx tsx scripts/upload-asset.ts --store=s1 --type=images
```

### Upload everything for one store (only changed files)
```powershell
npx tsx scripts/upload-asset.ts --store=s1 --all
```

### Upload everything for ALL stores (only changed files)
```powershell
npx tsx scripts/upload-asset.ts --all-stores --all
```

### Force re-upload even if unchanged
```powershell
npx tsx scripts/upload-asset.ts --store=s1 --all --force
```

### List what's currently in Blob for a store
```powershell
npx tsx scripts/upload-asset.ts --store=s1 --list
npx tsx scripts/upload-asset.ts --all-stores --list
```

## How change detection works

When a file is uploaded, its MD5 hash is stored in Blob at
`stores/{storeId}/.hashes/{type}/{filename}.md5`.

On the next run, the local file's hash is compared to the stored hash.
If they match, the upload is skipped. If different, the file is uploaded
and the stored hash is updated.

This means you can safely run `--all-stores --all` at any time and
only genuinely changed files will be uploaded.

## Local file locations

Keep your working copies here (already in .gitignore):
```
public/assets/stores/s1/videos/
public/assets/stores/s1/images/
public/assets/stores/s1/logo/
public/assets/stores/s1/policies/
```

## Adding a new store

1. Create the local folder: `public/assets/stores/s5/`
2. Add subfolders: `videos/`, `images/`, `logo/`, `policies/`
3. Add your files
4. Run: `npx tsx scripts/upload-asset.ts --store=s5 --all`
5. Seed the store config: update and run `scripts/seed-store.ts`
