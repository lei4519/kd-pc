<template>
  <div class="edit-wrapper">
    <EditLayout
      :project="project"
      :editor="true"
      @editPage="editPage"
    ></EditLayout>
  </div>
</template>

<script>
import EditLayout from '@/kd/components/EditLayout'
import { Project } from '@/kd/modules/Project'
export default {
  name: 'Edit',
  components: {
    EditLayout
  },
  data() {
    return {
      project: new Project({ name: '' })
    }
  },
  methods: {
    editPage() {
      //
    }
  }
}
</script>

<style lang="scss" scoped></style>
