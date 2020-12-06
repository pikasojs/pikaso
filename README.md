![Language](https://badgen.net/badge/icon/typescript?icon=typescript&label=Language)
![Test, Build and Publish](https://github.com/pikasojs/pikaso/workflows/Test,%20Build%20and%20Publish/badge.svg)
![license](https://badgen.net/github/license/pikasojs/pikaso)
![npm](https://badgen.net/npm/v/pikaso)
![bundle](https://badgen.net/bundlephobia/minzip/pikaso)
![hits](https://badgen.net/npm/dw/pikaso)
![types](https://badgen.net/npm/types/pikaso)
![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/pikaso)
![issues](https://badgen.net/github/open-issues/pikasojs/pikaso)
![last-commit](https://badgen.net/github/last-commit/pikasojs/pikaso)


Pikaso is a seamless, headless and fully-tested canvas library that provides a couple of high level APIs like image cropping, rotation, flipping, undo/redo state management, import/export json, shape drawing (circle, ellipse, rectangle, triangle, polygon, line, arrow), free drawing (pencil) and preset filters

### Important Note  
 
This project is under heavy development and most of the APIs might change in the next versions, so don't use that in Production.

### Install   

#### NPM

Pikaso provides only ES module bundle, which is easy to use with the popular bundlers

`npm install pikaso --save` 


#### <script> tag

Pikaso also supports UMD loading

```
<srcipt src="https://unpkg.com/pikaso@latest/umd/pikaso.min.js" type="text/javascript" />
```


### Setup

This is super easy to setup the Pikaso image editor

#### ES module
```
import Pikaso from 'pikaso'

const editor = new Pikaso({
  container: document.getElementById('<YOUR_DIV_ID>'),
})
```

#### <script> tag

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  
  <body>
    <div id="container" style="height: 50vh;"></div>
    <srcipt src="https://unpkg.com/pikaso@latest/umd/pikaso.min.js" type="text/javascript" />

    <script>
      var editor = new Pikaso({
        container: document.getElementById('container')
      })
    </script>
  </body>
</html>
```