/// <reference types="cypress" />

import { loadAsset } from './load-asset'

export function loadImage(fileName: string, mimeType: string = 'image/jpg') {
  return loadAsset(fileName, 'base64').then(image => {
    return `data:${mimeType};base64,${image}`
  })
}
