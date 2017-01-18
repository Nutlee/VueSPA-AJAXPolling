<template>
    <div class="container cancelend">
        <driver-profile :driverProfile="driverProfile" class=""></driver-profile>
        <div class="tip">
            <hr/><small>取消行程</small>
        </div> 
        <div class="canceldes">
            <img :src="imgSrc" alt="">
            <small>双方协商一致，取消用车</small>
        </div>
    </div>
</template>

<script>
import driverProfile from './driverprofile';
import msgIcon from '../assets/msg_des.png';
export default {
    name: 'cancelend',
    props: ['driverProfile'],
    data () {
        return {
            imgSrc: msgIcon,
        }
    },
    components: {
        driverProfile
    },
    mounted() {
        this.$emit('closeRootModal');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cancelend {
    margin-top: .2rem;
}
.tip {
    position: relative;
    margin-top: .62rem;
    text-align: center;
}
.tip hr {
    margin: 0 -.3rem;
    border: none;
    border-top: 1px solid #d7d7d7;
}
.tip small {
    position: absolute;
    width: 1.28rem;
    height: .3rem;
    margin-top: -.5em;
    margin-left: -2.5em;
    font-size: .24rem;
    line-height: 1;
    color: #666;
    text-align: center;
    background: #f2f2f2;
}
.canceldes {
    margin-top: .7rem;
}
.canceldes img {
    height: .82rem;
}
.canceldes small {
    display: block;
    margin-top: .28rem;
    font-size: .24rem;
    color: #ccc;
}

</style>       
