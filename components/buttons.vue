<template>
    <div class="buttons">
        <a @click="switchShow('create')" :class="show == 'create' ? 'active' : ''">CREATE</a>
        <a @click="switchShow('export')" :class="show == 'export' ? 'active' : ''">EXPORT</a>
        <div class="clear"></div>
    </div>
</template>

<script>
export default {
    name: 'buttons',

    computed: {
        show: function() {
            return this.$store.state.user.show
        }    
    },

    methods: {
        switchShow: function(type){

            // switch view in the sidebar
            this.$store.dispatch('user/changeShow', type)
        }        
    }
}
</script>

<style>

</style>