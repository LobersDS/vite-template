<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
  }>(),
  { variant: 'primary', disabled: false }
);

defineEmits<{ (e: 'click', event: MouseEvent): void }>();
</script>

<template>
  <button
    :class="['btn', `btn--${variant}`, { 'btn--disabled': disabled }]"
    :disabled="disabled"
    :aria-disabled="disabled"
    @click="disabled || $emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
