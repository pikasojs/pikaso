import { Board } from '../Board'
import { Cropper } from '../Cropper'

import { ImageExport } from './Image'
import { JsonExport } from './Json'

import type { ExportImageConfig } from '../types'

export class Export {
  /**
   * Represents the [[Board]]
   */
  private readonly board: Board

  /**
   * Represents the [[Cropper]]
   */
  private readonly cropper: Cropper

  /**
   * Represents the [[ImageExport]]
   */
  private readonly image: ImageExport

  /**
   * Represents the [[JsonExport]]
   */
  private readonly json: JsonExport

  constructor(board: Board, cropper: Cropper) {
    this.board = board
    this.cropper = cropper

    this.image = new ImageExport(this.board)
    this.json = new JsonExport(this.board)
  }

  /**
   * Exports the current workspace to image
   *
   * @returns The exported image data url
   * @param config The export options
   */
  public toImage(config?: Partial<ExportImageConfig>) {
    this.cropper.stop()

    return this.image.export(config)
  }

  /**
   * Exports the current workspace to json string
   *
   * @returns The exported JSON object
   */
  public toJson() {
    return this.json.export()
  }
}
