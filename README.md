<div align="center">
  <img src="assets/logo.svg" width="150" />
</div>

# Pikaso
Seamless, headless and fully-tested HTML5 canvas library that provides a couple of high level APIs

![Language](https://badgen.net/badge/icon/typescript?icon=typescript&label=Language)
![Test, Build and Publish](https://github.com/pikasojs/pikaso/workflows/Test/Build/Publish/badge.svg)
![npm](https://badgen.net/npm/v/pikaso)
![bundle](https://badgen.net/bundlephobia/minzip/pikaso)
[![quality](https://app.codacy.com/project/badge/Grade/f16b7c57dbbd4cdfa02b05f5ca04750a)](https://www.codacy.com/gh/pikasojs/pikaso/dashboard)
[![coverage](https://app.codacy.com/project/badge/Coverage/f16b7c57dbbd4cdfa02b05f5ca04750a)](https://www.codacy.com/gh/pikasojs/pikaso/dashboard)


### Pikaso vs. Konva
[Konva](https://konvajs.org/docs/index.html) is a great HTML5 Canvas TypeScript framework that extends the 2d context by enabling canvas interactivity for desktop and mobile applications.  

Pikaso is built on top of Konva to provide a couple of advanced features that Konva doesn't support out of the box.

| Library |  |
| - | - |
| HTML5 Canvas | Provides low level APIs to draw graphics |
| Konva | Provides Shapes, Dragging, Styling, Events, Transformation and Filters features to HTML5 canvas  |
| Pikaso | Adds a lot of Simplicity and provides Free and Shape Drawing, State Management (Undo/Redo/Reset), JSON Import/Export, Text Editing, Cropping, Rotation, Transformation, Event Manager, Advanced Transformation and Selection, Flipping, Background Image and Background Overlay management, Filter Management to Konva |

## Install   

#### NPM

Pikaso provides both ES module and CommonJS bundles, which is easy to use with the popular bundlers

```js
npm install pikaso --save
```

#### Yarn
```js
yarn add pikaso
```


#### <script> tag

Pikaso also supports UMD loading

```js
<srcipt src="https://unpkg.com/pikaso@latest/umd/pikaso.min.js" type="text/javascript" />
```


## Getting Started

```js
import Pikaso from 'pikaso'

const editor = new Pikaso({
  container: document.getElementById('<YOUR_DIV_ID>'),
})
```

## React 
This is possible to directly import the library or reuse the official hook   
https://github.com/pikasojs/pikaso-react-hook


## Features

- [Fully Typed](https://github.com/pikasojs/pikaso/tree/master/src/types)
- [Global Configurations](https://pikaso.app/#/getting-started/configuration)
- [Fully Customizable Cropping](https://pikaso.app/#/core/cropper)
- [Rotation and Transformation](https://pikaso.app/#/core/rotation)
- [Shape and FreeStyle Drawing](https://pikaso.app/#/core/drawing)
- [Built-in Shapes](https://pikaso.app/#/core/shapes)
- [Interactive Text Editing](https://pikaso.app/#/core/label)
- [Customizable Shapes](https://pikaso.app/#/customization/create-custom-shapes)
- [Image and SVG](https://pikaso.app/#/core/image)
- [Background Image](https://pikaso.app/#/core/background)
- [Event Management](https://pikaso.app/#/core/events)
- [State Management (Undo/Redo)](https://pikaso.app/#/core/history)
- [Flipping  ](https://pikaso.app/#/core/flip)
- [Interactive Selection Management](https://pikaso.app/#/core/selection)
- [Export to PNG and JPEG](https://pikaso.app/#/core/import-export)
- [Import/Export JSON](https://pikaso.app/#/core/import-export)
- [Filters](https://pikaso.app/#/core/filters)
- [Custom Filters](https://pikaso.app/#/customization/create-custom-filters)

  
## Documentation
[Full Documentation](https://pikaso.app)
  
## API references
[Full API references](https://pikaso.app/api)
  
## Demos
[React Setup](https://codesandbox.io/s/pikaso-react-hook-example-i0uwg)   
[Vue 3 Setup](https://codesandbox.io/s/vue3-example-o3cig)   
[All Demos](https://pikaso.app)

## Contributors
[![](https://opencollective.com/pikaso/contributors.svg?width=890&button=false)](https://github.com/pikasojs/pikaso/graphs/contributors)

