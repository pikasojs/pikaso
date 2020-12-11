import { createEditor } from '../../../jest/utils/create-editor'
import fixture from '../../../jest/fixtures/json-exported.json'

describe('Import', () => {
  it('should import json file', async () => {
    const editor = createEditor()

    await editor.load(fixture as any)

    expect(editor.board.getShapes().length).toBe(12)
  })
})
