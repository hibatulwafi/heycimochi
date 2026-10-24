import { C } from '../palette.js'

/** Fish — 12x8, worth the most points. Bobbing is a tween, not extra frames. */
export const itemFish = {
  palette: [null, '#f7cdbb', '#e8906f', C.ink],
  frames: [
    [
      '.....2222...',
      '.2..222222..',
      '.2221111312.',
      '22221111112.',
      '22221111112.',
      '.2221111112.',
      '.2..222222..',
      '.....2222...'
    ]
  ]
}

/**
 * Coin — 10x10, three drawn frames played as 0-1-2-1 for a full spin.
 * Defining the narrow pass once and replaying it halves the art.
 */
export const itemCoin = {
  palette: [null, C.goldLight, C.gold, C.goldDeep],
  frames: [
    [
      '...3333...',
      '.33222233.',
      '3321111233',
      '3211221123',
      '3211221123',
      '3211221123',
      '3211221123',
      '3321111233',
      '.33222233.',
      '...3333...'
    ],
    [
      '....33....',
      '...3223...',
      '...3113...',
      '...3113...',
      '...3113...',
      '...3113...',
      '...3113...',
      '...3113...',
      '...3223...',
      '....33....'
    ],
    [
      '..........',
      '....33....',
      '....33....',
      '....33....',
      '....33....',
      '....33....',
      '....33....',
      '....33....',
      '....33....',
      '..........'
    ]
  ]
}

/** Level goal — Mochi's basket, with a heart floating above it. */
export const itemBasket = {
  palette: [null, C.woodLight, C.wood, C.woodDeep, '#f5d9b0', C.rose],
  frames: [
    [
      '.....55..55.....',
      '....55555555....',
      '....55555555....',
      '.....555555.....',
      '......5555......',
      '.......55.......',
      '..333333333333..',
      '.34444444444443.',
      '.34444444444443.',
      '.31221122112213.',
      '.32112211221123.',
      '.31221122112213.',
      '.32112211221123.',
      '.31221122112213.',
      '.32112211221123.',
      '.33333333333333.'
    ]
  ]
}

export default { itemFish, itemCoin, itemBasket }
