import Konva from 'konva'

import { Settings } from './types'

export const defaultTransformerSettings: Partial<Konva.TransformerConfig> = {
  borderDash: [15, 10],
  borderStroke: '#fff',
  borderStrokeWidth: 3,
  anchorSize: 15,
  anchorFill: '#fff',
  anchorStroke: '#fff',
  anchorStrokeWidth: 1,
  anchorCornerRadius: 30
}

export const defaultSettings: Omit<Settings, 'container' | 'width' | 'height'> =
  {
    disableCanvasContextMenu: true,
    containerClassName: 'pikaso',
    transformer: defaultTransformerSettings,
    snapToGrid: null,
    cropper: {
      transformer: defaultTransformerSettings,
      circular: false,
      fixed: false,
      keepRatio: true,
      aspectRatio: 1,
      minWidth: 100,
      minHeight: 100,
      marginRatio: 1.1,
      overlay: {
        color: '#262626',
        opacity: 0.5
      },
      guides: {
        show: true,
        count: 3,
        color: '#fff',
        width: 1,
        dash: [15, 10]
      }
    },
    drawing: {
      autoSelect: false,
      keyboard: {
        cancelOnEscape: true
      }
    },
    selection: {
      interactive: true,
      keyboard: {
        enabled: true,
        movingSpaces: 5,
        map: {
          delete: ['Backspace', 'Delete'],
          moveLeft: ['ArrowLeft'],
          moveRight: ['ArrowRight'],
          moveUp: ['ArrowUp'],
          moveDown: ['ArrowDown'],
          deselect: ['Escape']
        }
      },
      transformer: {
        ...defaultTransformerSettings,
        borderDash: [0, 0]
      },
      zone: {
        fill: 'rgba(105, 105, 105, 0.7)',
        stroke: '#dbdbdb'
      }
    },
    history: {
      keyboard: {
        enabled: true
      }
    }
  }
