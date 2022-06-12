import { createEditor } from '../../../jest/utils/create-editor'
import fixture from '../../../jest/fixtures/json-exported.json'

describe('Import', () => {
  it('should import json file', async () => {
    const editor = createEditor()

    await editor.load(JSON.stringify(fixture) as any)

    expect(editor.board.activeShapes.length).toBe(14)
  })
})
