<script>
export default {
  name: 'Expand',
  functional: true,
  props: {
    render: {
      type: Function,
      required: true,
      default() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {}
      }
    },
    props: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  render(c, ctx) {
    return ctx.props.render(c, ctx.props.props)
  }
}
</script>
