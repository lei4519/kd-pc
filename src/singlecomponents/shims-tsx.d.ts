import 'vue-tsx-support/enable-check'

import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {}
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    zhName?: string
    minSpan?: number
    editorProps?: EditorProps
  }
}
