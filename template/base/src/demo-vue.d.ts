// Type shim for *.demo.vue files. vue-tsc excludes these from compilation
// (they contain <template lang="md"> which only the Volar plugin understands),
// so this declaration covers their import types.
declare module '*.demo.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
