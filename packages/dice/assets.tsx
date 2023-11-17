const ui = {
  table: '/assets/kit/ui/table.webp',
  modal: '/assets/kit/ui/modal.webp',
  modal_mobile: '/assets/kit/ui/modal_mobile.webp',
}

export const assets = {
  textures: {
    one: '/assets/dice-online/result/one.png',
    two: '/assets/dice-online/result/two.png',
    three: '/assets/dice-online/result/three.png',
    four: '/assets/dice-online/result/four.png',
    five: '/assets/dice-online/result/five.png',
    six: '/assets/dice-online/result/six.png',
    rib: '/assets/dice-online/result/rib.png',
    rib_shadow: '/assets/dice-online/result/rib_shadow.png',
    default_shadow: '/assets/dice-online/result/default_shadow.png',
    ...ui,
  },
  spines: {
    cat: '/assets/dice-online/tavern/cat_tavern.json',
    table: '/assets/dice-online/table/cat_tavern_2.json',
    hand: '/assets/dice-online/hand/cat_hand.json',
  },
} as const
