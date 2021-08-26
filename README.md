<div align="center">
  <img src="assets/logo.svg" width="150" />
</div>

# Pikaso
Seamless, headless and fully-tested HTML5 canvas library that provides a couple of high level APIs

![Language](https://badgen.net/badge/icon/typescript?icon=typescript&label=Language)
![Test, Build and Publish](https://github.com/pikasojs/pikaso/workflows/Test,%20Build%20and%20Publish/badge.svg)
![npm](https://badgen.net/npm/v/pikaso)
![bundle](https://badgen.net/bundlephobia/minzip/pikaso)
![coverage](https://img.shields.io/coveralls/github/pikasojs/pikaso)


### Pikaso vs. Konva
[Konva](https://konvajs.org/docs/index.html) is a great HTML5 Canvas JavaScript framework that extends the 2d context by enabling canvas interactivity for desktop and mobile applications.  

Pikaso is built on top of Konva to provide a couple of advanced features that Konva doesn't support out of the box.

| Library |  |
| - | - |
| HTML5 Canvas | Provides low level APIs to draw graphics |
| Konva | Provides Shapes, Dragging, Styling, Events, Transformation and Filters features to HTML5 canvas  |
| Pikaso | Adds a lot of Simplicity and provides Free and Shape Drawing, State Management (Undo/Redo/Reset), JSON Import/Export, Text Editing, Cropping, Rotation, Transformation, Event Manager, Advanced Transformation and Selection, Flipping, Background Image and Background Overlay management, Filter Management to Konva |

## Install   

#### NPM

Pikaso provides both ES module and CommonJS bundles, which is easy to use with the popular bundlers

`npm install pikaso --save` 

#### Yarn
`yarn add pikaso`


#### <script> tag

Pikaso also supports UMD loading

```
<srcipt src="https://unpkg.com/pikaso@latest/umd/pikaso.min.js" type="text/javascript" />
```


## Getting Started

```
import Pikaso from 'pikaso'

const editor = new Pikaso({
  container: document.getElementById('<YOUR_DIV_ID>'),
})
```

## React 
This is possible to directly import the library or reuse the official hook   
https://github.com/pikasojs/pikaso-react-hook


## Features

- Global Configurations
- Fully Customizable Cropping
- Rotation and Transformation
- Shape Drawing and Free Pencil Drawing
- Simple Geometric Shapes
- Interactive Text Editing
- Customizable Shapes
- Image and SVG
- Background Image
- Event Management
- State Management (Undo/Redo)
- Flipping  
- Interactive Selection Management
- Export to PNG and JPEG
- Import/Export JSON
- Filters

## Demos
[React Setup](https://codesandbox.io/s/pikaso-react-hook-example-i0uwg)   
[Vue 3 Setup](https://codesandbox.io/s/vue3-example-o3cig)   


TBD


## Documentation
TBD
