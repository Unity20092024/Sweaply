# Temporary photographic assets

Downloaded from Unsplash image CDN on 2026-11-11. These are temporary editorial/design assets, not photographs of Sweaply jobs or customer homes. They carry no watermark. Review final selections and retain licensing records before launch. Unsplash license: https://unsplash.com/license (permits download and commercial use; does not grant every possible third-party right).

| Local file      | Original image source                                        |
| --------------- | ------------------------------------------------------------ |
| living-room.jpg | https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 |
| kitchen.jpg     | https://images.unsplash.com/photo-1556912172-45b7abe8b7e1    |
| bathroom.jpg    | https://images.unsplash.com/photo-1620626011761-996317b8d101 |
| move-out.jpg    | https://images.unsplash.com/photo-1600585154340-be6161a56a0c |

## Official logo

`public/branding/sweaply-logo.png` is the exact, unmodified PNG supplied in `sweaply-logo-original.zip`. It is 2172 × 724 pixels (3:1) with existing RGBA transparency. No background removal, trimming, recoloring, or image editing has been applied. This original is also the fallback source.

SHA-256: `230306e0fbbbda1acececfd3853c0d19670a0dee256df824c67d813fc42933dc`.

`SweaplyLogo` in `src/components/branding/sweaply-logo.tsx` uses Next.js Image with optimization disabled to serve the original PNG bytes and is shared by the mobile/desktop header and footer. Future authentication screens should reuse it. Responsive widths are 150px on mobile and 180px on desktop, with automatic height and no cropping. The previous typeset logo, decorative star, and CSS swoosh have been removed.

No cleaner photographs, reviews, badges, job counts, or customer galleries are fabricated. Phase 1/2 demo profiles used generic icons. Phase 3 uses explicitly labeled development-only stock portraits, documented below.

## Phase 3 development-only stock portraits

Downloaded on 2026-11-23 for explicitly labeled development previews only. These people are stock models, not Sweaply cleaners, applicants, customers, or endorsements. No real profiles, ratings, reviews, jobs, availability, or before-and-after evidence are implied. The files are local assets; public production pages never use them as cleaner profiles.

| File                                         | Unsplash image source                                        |
| -------------------------------------------- | ------------------------------------------------------------ |
| `public/images/demo-cleaners/portrait-a.jpg` | https://images.unsplash.com/photo-1580489944761-15a19d654956 |
| `public/images/demo-cleaners/portrait-b.jpg` | https://images.unsplash.com/photo-1500648767791-00dcc994a43e |
| `public/images/demo-cleaners/portrait-c.jpg` | https://images.unsplash.com/photo-1534528741775-53994a69daeb |

The existing Unsplash license/reference notes above apply. Production portraits must come from real approved cleaners with appropriate usage permission. No stock portrait is used as evidence of a cleaner’s identity or work.
