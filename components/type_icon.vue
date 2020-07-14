<template>
  <div class="type_icon">
    <div v-if="iconString == 'car'">
      <img src="/poster/car.svg" />
    </div>
    <div v-if="iconString == 'airplane'">
      <img src="/poster/plane.svg" />
    </div>
    <div v-if="iconString == 'train'">
      <img src="/poster/train.svg" />
    </div>
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
  .type_icon {
    text-align: center;
    display: block;
    margin-bottom: .5em;
    img {
      width: 16%;
      min-width: 40px;
      height: auto;
    }
  }
</style>
