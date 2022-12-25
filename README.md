<h1 align="center">Image Classification Dataset Prepper</h1>

<div align="center">
  <img src="./assets/icon.svg" alt="Preview" />
</div>

https://user-images.githubusercontent.com/1139927/209462763-17b58b7d-3e14-424d-b431-7ba33a2a0df6.mp4

When prepping data sets for training image classification models it's a real pain to manually sift through thousands of images to weed out the inaccurate, duplicate and broken ones. This app aims to make the process a lttle more tolerable by allowing you to use keyboard shortcuts to quicky cycle through all the images in a folder and delete the ones you don't want.

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
- &#9835; pop noise sounds each time a full loop occurs when cycling a directory

## Folder structure

<div align="center">
  <img src="./assets/screenshot.png" alt="" width="50%" />
</div>

1. Click the first button if your folder structure looks like this:

```
dog-images/
- doberman/
  - a.jpg
  - b.png
- german-shepherd/
  - c.jpg
  - d.webp
- minature-poodle/
  - e.png
  - f.jpg
- etc...
```

In other words if you have a root folder with subfolders for each _class_, and inside those folders are your images.

2. Click the second button if you just want to browse a single folder full of images

## Credits

- [IOS Camera Icon](https://iconscout.com/icon/photos-30) by Giulio Smedile
- [Electron React Boilterplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
