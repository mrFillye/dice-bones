import { PixiSpine } from '@sok/toolkit/pixi/components/Spine'
import { PIXI } from '@sok/toolkit/pixi/dependencies'

export const bone = {
  one: 'one',
  two: 'two',
  three: 'three',
  four: 'four',
  five: 'five',
  six: 'six',
  rib: 'rib',
} as const

export const slotType = {
  base: 'base',
  shadow: 'shadow',
  aside: 'aside',
} as const

export const rightSlot = {
  cube_5: 'cube_5',
  cube_6: 'cube_6',
  cube_7: 'cube_7',
  cube_2_shadow2: 'cube_2_shadow2',
  'Layer 2': 'Layer 2',
} as const

export const leftSlot = {
  cube_2: 'cube_2',
  cube_3: 'cube_3',
  cube_4: 'cube_4',
  cube_2_shadow: 'cube_2_shadow',
  'Layer 1': 'Layer 1',
} as const

export const leftSlotTypes: Record<LeftSlot, SlotType> = {
  [leftSlot.cube_2_shadow]: slotType.shadow,
  [leftSlot['Layer 1']]: slotType.shadow,
  [leftSlot.cube_3]: slotType.aside,
  [leftSlot.cube_2]: slotType.base,
  [leftSlot.cube_4]: slotType.base,
}

export const rightSlotTypes: Record<RightSlot, SlotType> = {
  [rightSlot.cube_2_shadow2]: slotType.shadow,
  [rightSlot['Layer 2']]: slotType.shadow,
  [rightSlot.cube_6]: slotType.aside,
  [rightSlot.cube_5]: slotType.base,
  [rightSlot.cube_7]: slotType.base,
}

export const defaultLeftChangedSlots = ['cube_3', 'cube_4']
export const defaultRightChangedSlots = ['cube_6', 'cube_7']

export type Bone = (typeof bone)[keyof typeof bone]
export type LeftSlot = (typeof leftSlot)[keyof typeof leftSlot]
export type RightSlot = (typeof rightSlot)[keyof typeof rightSlot]
export type SlotType = (typeof slotType)[keyof typeof slotType]

export function isKey<T extends {}>(
  object: T,
  key: PropertyKey | undefined | null,
): key is keyof T {
  return Boolean(key && key in object)
}

export function changeSlotTextures(
  boneType: 'left' | 'right',
  data: {
    key: string
    texture: PIXI.Texture<PIXI.Resource> | undefined
  },
  shadow: PIXI.Texture<PIXI.Resource> | undefined,
  asideTexture: PIXI.Texture<PIXI.Resource> | undefined,
  spine: PixiSpine,
) {
  const isRib = data.key === 'rib'
  const baseTexture = data.texture
  const defaultChangSlots =
    boneType === 'left' ? defaultLeftChangedSlots : defaultRightChangedSlots
  const slot = boneType === 'left' ? leftSlot : rightSlot
  const slotType = boneType === 'left' ? leftSlotTypes : rightSlotTypes

  if (!baseTexture || !shadow || !asideTexture) {
    return
  }

  if (!isRib) {
    Object.keys(slot).map((key) => {
      if (defaultChangSlots.includes(key)) {
        spine.hackTextureBySlotName(key, baseTexture)
      }
    })
  } else {
    Object.keys(slot).map((key) => {
      if (!isKey(slot, key)) {
        return
      }
      switch (slotType[key]) {
        case 'aside':
          spine.hackTextureBySlotName(key, asideTexture)
          break
        case 'base':
          spine.hackTextureBySlotName(key, baseTexture)
          break
        case 'shadow':
          spine.hackTextureBySlotName(key, shadow)
          break
        default:
          new Error(`Unknown slot type ${slotType[key]}`)
      }
    })
  }
}
