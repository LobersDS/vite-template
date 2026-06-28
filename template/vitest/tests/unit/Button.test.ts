import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../../src/lib/Button.vue';

describe('Button', () => {
  it('renders label prop as text content', () => {
    const wrapper = mount(Button, { props: { label: 'Click me' } });
    expect(wrapper.text()).toBe('Click me');
  });

  it('renders slot content over label prop', () => {
    const wrapper = mount(Button, {
      props: { label: 'fallback' },
      slots: { default: '<span>slot text</span>' },
    });
    expect(wrapper.text()).toBe('slot text');
  });

  it('applies variant class to the button element', () => {
    const wrapper = mount(Button, { props: { variant: 'secondary' } });
    expect(wrapper.get('button').classes()).toContain('btn--secondary');
  });

  it('sets disabled attribute when disabled prop is true', () => {
    const wrapper = mount(Button, { props: { disabled: true } });
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });

  it('emits click event when enabled', async () => {
    const wrapper = mount(Button, { props: { label: 'Go' } });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, { props: { label: 'Go', disabled: true } });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
