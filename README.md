# Image Reviewer GUI

![screenshot](screenshot.png)

When collecting data sets for training image classification models it's a real pain to manually sift through thousands of images to weed out the inaccurate, duplicate and broken ones. This app aims to make the process a lttle more tolerable by allowing you to use keyboard shortcuts to quicky cycle through all the images in a folder and delete the ones you don't want.

Also included are some notebooks/python scripts to automate deleting duplicates and corrupt files which leads to less overall images that need to be manually reviewed.

## Installation

```
> yarn install | npm install
```

## Build

```
> yarn package | npm run package
```

The resultant executable can be found in the `release/build/` folder e.g. on mac it's `release/build/mac/ImageReviewer.app`. You can move this anywhere like to your desktop and run it as a standalone app going forward.

## Development

To run the dev server:

```
> yarn start
```

## Files

- Electron backend - `src/main/*`
- React frontend - `src/renderer/*`

## Usage

- <kbd>→</kbd> next image
- <kbd>←</kbd> prev image
- <kbd>Space</kbd> delete image
- <kbd>CMD</kbd> + <kbd>z</kbd> (mac) or <kbd>CTRL</kbd> + <kbd>z</kbd> (windows) undo delete
- &#x21bb; - click the reload icon on the top right of the screen to clear history (by default visited folders appear in a lower opacity to help track progress)

## Jupyter Notebooks

- `notebooks/delete_duplicates.ipynb` - displays exact and possible duplicate images found by the awesome [difPy library](https://github.com/elisemercury/Duplicate-Image-Finder) and allows you to delete them after manual confirmation
- `notebooks/delete_corrupt.ipynb` - deletes files that are corrupt and can't be opened

These scripts assume that your folder structure is a single root folder with subfolders for each "class". For example:

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

If your folder structure differs you'll need to modify the scripts to suit your needs.
