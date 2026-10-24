<script setup>
import { computed } from 'vue'
import { frameSize, frameToDataURL } from '@/pixel/render.js'
import { getSprite } from '@/pixel/sprites/index.js'

/**
 * A sprite tiled horizontally as a CSS background.
 *
 * The alternative — one <PixelSprite> per tile — needs ~40 canvas elements to
 * cover a ground strip on a wide screen. This is one element the compositor
 * repeats, so a decorative band costs essentially nothing.
 *
 * Only for sprites designed to tile seamlessly (tileGrass, tileDirt,
 * decorFence). Use PixelSprite for anything that should appear once.
 */
const props = defineProps({
  name: { type: String, required: true },
  scale: { type: Number, default: 3 },
  /** Visible height in CSS px. Defaults to the sprite's full scaled height. */
  height: { type: Number, default: 0 },
  /** 'top' crops from the sprite's top edge, 'bottom' from its bottom. */
  anchor: { type: String, default: 'top' }
})

const sprite = computed(() => getSprite(props.name))

const style = computed(() => {
  if (!sprite.value) return {}

  const { width, height } = frameSize(sprite.value, 0)
  const tileW = width * props.scale
  const tileH = height * props.scale

  return {
    backgroundImage: `url(${frameToDataURL(sprite.value, 0, props.scale, props.name)})`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: `${tileW}px ${tileH}px`,
    backgroundPosition: props.anchor === 'bottom' ? 'left bottom' : 'left top',
    height: `${props.height || tileH}px`,
    imageRendering: 'pixelated'
  }
})
</script>

<template>
  <div v-if="sprite" :style="style" aria-hidden="true" />
</template>
