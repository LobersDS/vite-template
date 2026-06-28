<script>
export const metadata = {
  title: 'Button',
  description: 'Basic accessible button component with primary, secondary, and ghost variants.',
  tags: ['component', 'interactive'],
  category: 'components',
};
</script>

<script setup>
import { ref } from 'vue';
import { Button } from '../lib/index.ts';

const clickCount = ref(0);
</script>

<template lang="md">
# Button

A basic accessible button component.

## Import

```ts
import { Button } from './lib/index.ts';
```

## Variants

<div>
  <Button variant="primary" label="Primary" />
  <Button variant="secondary" label="Secondary" />
  <Button variant="ghost" label="Ghost" />
</div>

## Disabled state

<div>
  <Button label="Disabled" disabled />
</div>

## Slot content

<div>
  <Button variant="primary" @click="clickCount++">Click me</Button>
</div>

Clicked {{ clickCount }} times.
</template>
