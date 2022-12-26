<h1 align="center">
  <img
    src="./assets/icon.svg"
    alt=""
    width="27"
    style="margin-right: 8px"
  />
  Image Classification Dataset Prepper
</h1>

https://user-images.githubusercontent.com/1139927/209484470-7ca2c62c-bf67-4cfa-be6f-5a9e014e33dd.mp4

<br />

<p>When preparing datasets for training image classification models it's a real pain to manually sift through thousands of images to weed out the inaccurate, duplicate and broken ones. This cross-platform app aims to make the process a little more tolerable by allowing you to use keyboard shortcuts to quickly cycle through all the images in a folder and delete the ones you don't want.</p>

## Installation

First install the dependencies:

```
> yarn install or npm install
```

then build the executable:

```
> yarn package or npm run package
```

The resultant launch file can be found in the `release/build/*` folder e.g. on a mac it's `release/build/mac/ImageReviewer.app`. You can move this anywhere like to your desktop and run it as a standalone app going forward.

## Development

```
> yarn start or npm start
```

This will spin up a dev server which auto-reloads on file changes.

## Files

- Electron backend - `src/main/*`
- React frontend - `src/renderer/*`

## Usage

- <kbd>→</kbd> - next image
- <kbd>←</kbd> - prev image
- <kbd>Space</kbd> - delete image
- <kbd>CMD</kbd> / <kbd>CTRL</kbd> + <kbd>Z</kbd> - undo delete
- <kbd>CMD</kbd> / <kbd>CTRL</kbd> + <kbd>R</kbd> - refresh the app
- click the "&#x21bb;" icon on the top right of the screen to reset history (visited folders appear at a lower opacity for tracking purposes)
- &#9835; pop noise sounds each time a full loop completes when cycling through a directory

## Folder structure

This is a common folder structure for image classification datasets:

```
dog-breeds/
- doberman/
  - a.jpg
  - b.png
- german-shepherd/
  - c.jpg
  - d.webp
- miniature-poodle/
  - e.png
  - f.jpg
```

In other words you have a root folder with sub-folders for each _class_, and inside those sub-folders are the images. You can browse such a root folder using this app, same for individual folders with images.

Just make sure that the selected folder contains either **only images** or **only sub-folders**. This app isn't a full fledged file explorer and can't handle anything else at the moment.

## Roadmap

- Automate deleting duplicate images
- Automate deleting broken images
- Crop and keep only part of an image
- Convert all images to a particular format
- Rename all images with numeric file names

## Credits

- [IOS Camera Icon](https://iconscout.com/icon/photos-30) by Giulio Smedile
- [Electron React Boilterplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [Chakra UI component library](https://github.com/chakra-ui/chakra-ui)
