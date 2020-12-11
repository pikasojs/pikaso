import { createEditor } from '../../../jest/utils/create-editor'
import { FixedRectangleCropper } from '../../../src/Cropper/FixedRectangleCropper'

describe('Crop', () => {
  it('should start and crop the flexible rectangular cropper', async () => {
    const editor = createEditor()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 1280,
      height: 720
    })

    editor.cropper.start({})
    await editor.cropper.crop()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 720,
      height: 720,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      rotation: 0
    })
  })

  it('should start and crop the flexible circular cropper', async () => {
    const editor = createEditor()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 1280,
      height: 720
    })

    editor.cropper.start({
      circular: true
    })

    await editor.cropper.crop()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 720,
      height: 720,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      rotation: 0
    })
  })

  it('should start and crop the fixed rectangular cropper', async () => {
    const editor = createEditor()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 1280,
      height: 720
    })

    editor.cropper.start({
      fixed: true
    })

    await editor.cropper.crop()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 720,
      height: 720,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      rotation: 0
    })
  })

  it('should start and crop the fixed circular cropper', async () => {
    const editor = createEditor()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 1280,
      height: 720
    })

    editor.cropper.start({
      fixed: true,
      circular: true
    })
    await editor.cropper.crop()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 720,
      height: 720,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      rotation: 0
    })
  })

  it('should crop the rotated board', async () => {
    const editor = createEditor()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 1280,
      height: 720
    })

    editor.rotation.transform(30)

    editor.cropper.start({})
    await editor.cropper.crop()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 720,
      height: 720,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      rotation: 0
    })
  })

  it('should stop the cropper and isActive should reperesent the state', () => {
    const editor = createEditor()

    editor.cropper.start({})

    expect(editor.cropper.isActive).toBe(true)

    editor.cropper.start({})
    expect(editor.cropper.isActive).toBe(true)

    editor.cropper.stop()
    expect(editor.cropper.isActive).toBe(false)
  })

  it('should not zoom on flexible croppers', () => {
    const editor = createEditor()

    expect(editor.board.layer.scale()).toStrictEqual({
      x: 1,
      y: 1
    })

    editor.cropper.start({})
    editor.cropper.zoom(2)

    expect(editor.board.layer.scale()).toStrictEqual({
      x: 1,
      y: 1
    })
  })

  it('should zoom on fixed croppers', () => {
    const editor = createEditor()

    expect(editor.board.layer.scale()).toStrictEqual({
      x: 1,
      y: 1
    })

    editor.cropper.start({
      fixed: true
    })

    const scale = 2
    editor.cropper.zoom(scale)

    expect(editor.board.layer.scale()).toStrictEqual({
      x: scale,
      y: scale
    })

    const instance = <FixedRectangleCropper>editor.cropper.getInstance()

    expect(instance.draggable.width()).toBe(1280 * scale) // actual width x 2
    expect(instance.draggable.height()).toBe(720 * scale) // actual height x 2
  })

  it('should change position of flexible croppers', () => {
    const editor = createEditor()

    editor.cropper.start({})

    expect(editor.cropper.getRect()).toStrictEqual({
      x: 294,
      y: 14,
      width: 692,
      height: 692
    })

    editor.cropper.setPosition({ x: 0, y: 0 })

    expect(editor.cropper.getRect()).toStrictEqual({
      x: 2,
      y: 2,
      width: 692,
      height: 692
    })
  })

  it('should change position of fixed croppers', () => {
    const editor = createEditor()

    editor.cropper.start({
      fixed: true
    })

    const instance = <FixedRectangleCropper>editor.cropper.getInstance()

    expect(editor.cropper.getRect()).toStrictEqual({
      x: 283,
      y: 3,
      width: 714,
      height: 714
    })

    expect(instance.draggable.attrs).toMatchObject({
      x: 0,
      y: 0
    })

    editor.cropper.setPosition({ x: 10, y: 10 })

    expect(editor.cropper.getRect()).toStrictEqual({
      x: 273,
      y: 0,
      width: 714,
      height: 714
    })

    expect(instance.draggable.attrs).toMatchObject({
      x: 10,
      y: 3
    })
  })

  it('should not getRect when cropper is not active', () => {
    const editor = createEditor()

    expect(editor.cropper.getRect()).toBe(null)
  })

  it('should not crop when cropper is not active', async () => {
    const editor = createEditor()

    const data = await editor.cropper.crop()

    expect(data).toBe(null)
  })

  it('should crop with background and shapes', async () => {
    const editor = createEditor()

    expect(editor.board.stage.attrs).toMatchObject({
      width: 1280,
      height: 720
    })

    editor.board.background.setImageFromUrl('1280x720')
    const shape = editor.shapes.rect.insert({
      width: 200,
      height: 100,
      x: 100,
      y: 100
    })

    editor.cropper.start({})
    await editor.cropper.crop()

    expect(shape.node.attrs).toMatchObject({
      x: -201.84971098265896,
      y: 89.47976878612715,
      scaleX: 1.0404624277456647,
      scaleY: 1.0404624277456647
    })
  })
})
