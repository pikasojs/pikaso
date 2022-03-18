

<div align="center">
  <img src="https://user-images.githubusercontent.com/334716/158897748-f5cd569b-64b6-4551-be30-2d020b9efbde.svg" />
  
  <h3>Pikaso</h3>
  <p>Seamless, Fully-typed and Fully-tested HTML5 Canvas Library</p>
  <a href="https://pikaso.app"><strong>Learn more »</strong></a>
  <br />
  <br />
  
  <a href="https://pikaso.app">Website</a> ·
  <a href="https://pikaso.app/api/classes/Pikaso.html">API Documentation</a> ·
  <a href="https://github.com/pikasojs/pikaso/issues">Issues</a> . 
  <a href="https://github.com/pikasojs/pikaso/discussions">Discussion</a>
  
  <br />
  <br />
  
  ![Language](https://badgen.net/badge/icon/typescript?icon=typescript&label=Language)
  ![Test, Build and Publish](https://github.com/pikasojs/pikaso/workflows/Test/Build/Publish/badge.svg)
  ![npm](https://badgen.net/npm/v/pikaso)
  ![bundle](https://badgen.net/bundlephobia/minzip/pikaso)
  [![quality](https://app.codacy.com/project/badge/Grade/f16b7c57dbbd4cdfa02b05f5ca04750a)](https://www.codacy.com/gh/pikasojs/pikaso/dashboard)
  [![coverage](https://app.codacy.com/project/badge/Coverage/f16b7c57dbbd4cdfa02b05f5ca04750a)](https://www.codacy.com/gh/pikasojs/pikaso/dashboard) 
  <br />
  <br />
</div>



![2](https://user-images.githubusercontent.com/334716/158895397-e23b5d01-fd63-4db4-8f5d-174d9ddcac33.gif)

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
- [Groups](https://pikaso.app/#/core/groups)
- [Interactive Text Editing](https://pikaso.app/#/core/label)
- [Customizable Shapes](https://pikaso.app/#/customization/create-custom-shapes)
- [Image and SVG](https://pikaso.app/#/core/image)
- [Background Image](https://pikaso.app/#/core/background)
- [Event Management](https://pikaso.app/#/core/events)
- [State Management (Undo/Redo)](https://pikaso.app/#/core/history)
- [Flipping  ](https://pikaso.app/#/core/flip)
- [Interactive Selection Management](https://pikaso.app/#/core/selection)
- [Snap to Grid](https://pikaso.app/#/core/snap-grid)
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

  
### Pikaso vs. Konva
[Konva](https://konvajs.org/docs/index.html) is a great HTML5 Canvas TypeScript framework that extends the 2d context by enabling canvas interactivity for desktop and mobile applications.  

Pikaso is built on top of Konva to provide a couple of advanced features that Konva doesn't support out of the box.

| Library |  |
| - | - |
| HTML5 Canvas | Provides low level APIs to draw graphics |
| Konva | Provides Shapes, Dragging, Styling, Events, Transformation and Filters features to HTML5 canvas  |
| Pikaso | Adds a lot of Simplicity and provides Free style and Shape Drawing, Advanced Shapes and Groups, State Management (Undo/Redo/Reset), JSON Import/Export, Text Editing, Cropping, Rotation, Transformation, Event Manager, Snap to Grid, Advanced Transformation and Selection, Flipping, Background Image and Background Overlay management, Filter Management to Konva |
  
## Supporters
[![Stargazers repo roster for @pikasojs/pikaso](https://reporoster.com/stars/pikasojs/pikaso)](https://github.com/pikasojs/pikaso/stargazers)
  
## Contributors
[![](https://opencollective.com/pikaso/contributors.svg?width=890&button=false)](https://github.com/pikasojs/pikaso/graphs/contributors)

