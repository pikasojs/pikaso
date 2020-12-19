export declare type Filters =
  | {
      name: 'Blur'
      options?: Partial<{
        blurRadius: number
      }>
    }
  | {
      name: 'Contrast'
      options?: Partial<{
        contrast: number
      }>
    }
  | {
      name: 'Brighten'
      options?: Partial<{
        brightness: number
      }>
    }
  | {
      name: 'Solarize'
      options?: Partial<{
        threshold: number
      }>
    }
  | {
      name: 'Mask'
      options?: Partial<{
        threshold: number
      }>
    }
  | {
      name: 'Emboss'
      options?: Partial<{
        embossStrength: number
        embossWhiteLevel: number
        embossBlend: boolean
        embossDirection:
          | 'top-left'
          | 'top'
          | 'top-right'
          | 'right'
          | 'bottom-right'
          | 'bottom-left'
          | 'bottom'
          | 'left'
      }>
    }
  | {
      name: 'Enhance'
      options?: Partial<{
        enhance: number
      }>
    }
  | {
      name: 'HSL'
      options?: Partial<{
        luminance: number
      }>
    }
  | {
      name: 'HSV'
      options?: Partial<{
        value: number
      }>
    }
  | {
      name: 'Noise'
      options?: Partial<{
        noise: number
      }>
    }
  | {
      name: 'Pixelate'
      options?: Partial<{
        pixelSize: number
      }>
    }
  | {
      name: 'Posterize'
      options?: Partial<{
        levels: number
      }>
    }
  | {
      name: 'RGB'
      options?: Partial<{
        red: number
        green: number
        blue: number
      }>
    }
  | {
      name: 'RGBA'
      options?: Partial<{
        alpha: number
        red: number
        green: number
        blue: number
      }>
    }
  | {
      name: 'Kaleidoscope'
      options?: Partial<{
        kaleidoscopePower: number
        kaleidoscopeAngle: number
      }>
    }
  | {
      name: 'Grayscale'
      options?: {}
    }
  | {
      name: 'Invert'
      options?: {}
    }
  | {
      name: 'Sepia'
      options?: {}
    }
