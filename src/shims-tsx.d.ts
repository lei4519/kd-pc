import 'vue-tsx-support/enable-check'
import { EditorProps } from '@/kd/types/editor-props'
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
