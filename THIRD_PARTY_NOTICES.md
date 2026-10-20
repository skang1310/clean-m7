# Third-party notices

Clean M7 is independent of Samsung, Apple, streaming services and upstream authors. Brand names identify compatible services and do not imply endorsement.

## Code and design references

- [CleanFrame](https://github.com/nthnclrk/CleanFrame): MIT. The current gallery metadata, wallpapers and styling reference this project. Retained [license](docs/CleanFrame-LICENSE.txt) and [upstream notices](docs/CleanFrame-THIRD_PARTY_NOTICES.md) describe upstream material; upstream-relative paths in that archived notice do not refer to this repository.
- [CleanYourTV](https://github.com/Gathin23/cleanyourtv): Android interaction reference, not a Tizen-compatible installer. Retained [MIT license](docs/cleanyourtv-LICENSE.txt).

## Photographs

The 15 active gallery photographs retain their own terms. Photographer names and original Unsplash pages are listed in [SOURCES.json](app/themes/cleanframe/SOURCES.json). See the [Unsplash License](https://unsplash.com/license). Screenshot images contain derivatives of these photographs. Metadata locations shown by the UI have not independently been verified.

Legacy assets remain for source continuity: Yosemite [Pexels photo](https://www.pexels.com/photo/yosemite-tunnel-view-19374168/) under the [Pexels License](https://www.pexels.com/license/); sea `photo-1507525428034-b723cf961d3e`, city `photo-1519501025264-65ba15a82390`, forest `photo-1448375240586-882707db888b`, desert `photo-1509316785289-025f5b846b35`, lake `photo-1470770841072-f978cf4d019e` from Unsplash. They are not the active 17-theme selection. Removed unused `app/assets/` illustrative bitmap files from this public copy because their creation/provenance record was unavailable; the current runtime does not reference them.

## Fonts

Inter is bundled under SIL OFL 1.1: [license](app/fonts/LICENSE.txt). Manrope is bundled under SIL OFL 1.1: [license](app/fonts/Manrope-OFL.txt). Apple's San Francisco is not distributed; local system font names in CSS do not bundle Apple font binaries. Current CleanFrame styling prefers Manrope.

Playfair Display is requested at runtime from [Google Fonts](https://fonts.google.com/specimen/Playfair+Display) and is not bundled. Its font terms remain with its authors; the serif setting requires external access or uses system fallbacks.

## Logos

YouTube and Apple TV SVGs originate from Simple Icons (CC0). Other service favicons originate from the corresponding official websites. Logo/trademark rights remain with their owners. Retained files identify services and are not covered by the project's original-code MIT grant. Only the five supported apps' icons are included.

## Data

Weather, news, market and OTT responses retain provider terms. No cached articles, private keys, user listening history or external datasets are committed. See [data sources](docs/data-sources.md).
