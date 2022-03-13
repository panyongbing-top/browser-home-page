<script setup lang="ts">
import { computed } from 'vue'
let props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
})

let iconName = computed(() => {
  return `#icon-${props.iconClass}`
})
let svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className
  } else {
    return 'svg-icon'
  }
})
</script>

<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 100%;
  height: 100%;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
