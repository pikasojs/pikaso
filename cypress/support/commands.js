import { draw } from './utils/draw'
import { getEditor } from './utils/get-editor'
import { loadAsset } from './utils/load-asset'
import { loadImage } from './utils/load-image'
import { mouseTrigger } from './utils/mouse-trigger'

Cypress.Commands.add('draw', draw)
Cypress.Commands.add('getEditor', getEditor)
Cypress.Commands.add('loadAsset', loadAsset)
Cypress.Commands.add('loadImage', loadImage)
Cypress.Commands.add('mouseTrigger', mouseTrigger)
