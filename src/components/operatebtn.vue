<template>
    <div class="container operatebtn">
        <button class="radius-small btn" type="button" 
        @click="btnclick" 
        :disabled="btnDisabled" 
        :class="{disabled: btnDisabled}">{{btnText}}</button>
    </div>
</template>

<script>
export default {
    name: 'operatebtn',
    props: ['btnText','btnDisabled'],
    methods: {
        btnclick: function() {
            this.$emit('btnClick',1);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* js 修正居中 */
.operatebtn {
    position: absolute;
    bottom: 0;
    margin-bottom: .26rem;
}
.btn {
    display: inline-block;
    width: 6.9rem;
    height: .8rem;
    border: none;
    text-align: center;
    font-size: .32rem;
    font-weight: bold;
    color: #fff;   
    background: #2072cf;
}
.disabled {
    color: #bbb;
    background: #ddd;
}
</style>       
