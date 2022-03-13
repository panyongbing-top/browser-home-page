<script setup lang="ts"></script>
<template>
  <router-view></router-view>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  unref,
  watch,
  watchEffect,
} from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "App",
  components: {},
  setup() {},
});
</script>
