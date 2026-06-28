<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<template lang="md">
# Smoke Test

This page verifies that `vite-plugin-vue-template-lang-markdown` is working in a consumer context.

## Markdown rendering

Standard markdown: **bold**, _italic_, `inline code`.

- List item one
- List item two

## Vue reactivity

<button @click="count++">Count: {{ count }}</button>
</template>
