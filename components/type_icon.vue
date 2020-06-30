<template>
  <div class="type_icon">
    <div v-if="iconString == 'car'">CAR</div>
    <div v-if="iconString == 'airplane'">AIRPLANE</div>
  </div>
</template>

<script>
export default {
    name: 'typeIcon',

    props: {
      iconString: String
    }

}
</script>

<style scoped lang="scss">

</style>
