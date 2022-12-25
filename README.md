# Image Reviewer GUI

![screenshot](screenshot.png)

When collecting data sets for training image classification models it's a real pain to manually sift through thousands of images to weed out the inaccurate, duplicate and broken ones. This app aims to make the process a lttle more tolerable by allowing you to use keyboard shortcuts to quicky cycle through all the images in a folder and delete the ones you don't want.

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

To run the app without building or to add more features (PRs welcome!), after installing dependecies run:

```
> yarn start or npm start
```

This will start the dev server and automatically open the app and will auto reload on file changes.

## Files

- Electron backend - `src/main/*`
- React frontend - `src/renderer/*`

## Usage

- <kbd>→</kbd> next image
- <kbd>←</kbd> prev image
- <kbd>Space</kbd> delete image
- <kbd>CMD</kbd> + <kbd>z</kbd> (mac) or <kbd>CTRL</kbd> + <kbd>z</kbd> (windows) undo delete
- &#x21bb; - click the reload icon on the top right of the screen to clear history (by default visited folders appear in a lower opacity to help track progress)

## Folder structure assumptions

These scripts assume that your folder structure is a single root folder with subfolders for each _class_ e.g.:

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

If your folder structure differs you'll need to modify the scripts accordingly.
