<template>
  <div class="unauthorized">
    
  </div>
</template>

<script>

export default {
  name: 'Unauthorized',
  mounted() {
    this.$stiller.firebase.auth.logout()
  }
}
</script>
