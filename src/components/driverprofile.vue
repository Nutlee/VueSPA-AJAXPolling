<template>
    <div class="driverprofile">
        <span class="head-icon">
            <img :src="imgIcon" alt="" class="head-icon-img" />
        </span><span class="description">
            <p class="des-name">{{name}}</p>
            <small class='des-detail'>已代驾{{expire}}次</small>
        </span><a class="tel" :href="tel" ></a>
    </div>
</template>

<script>
export default {
    name: 'driverprofile',
    props:['driverProfile'],
    data () {
        return {
            imgIcon: this.driverProfile.imgIcon,
            name: this.driverProfile.name,
            expire: this.driverProfile.expire || 0,
            tel: 'tel:'+this.driverProfile.tel,
            telIcon: this.driverProfile.telIcon
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.driverprofile {
    width: 6.48rem;
    text-align: left;   
}
.head-icon {
    position: relative;
    display: inline-block;
    height: 1.25rem;
    width: 1.25rem;
    border-radius: 50%;
    border: 1px solid #dadada;
    background: #fff;
    vertical-align: middle;
}
.head-icon-img {
    position: absolute;
    top: .15rem;
    left: 0.195rem;
    height: 1.11rem;
}
.description {
    display: inline-block;
    margin-left: .3rem;
    /*margin-right: 2.56rem;*/
    width: 64%;
    vertical-align: middle;
}
.des-name {
    font-size: .32rem;
    color: #222;
}
.des-detail {
    font-size: .28rem;
    color: #666;
}
.tel {
    position: absolute;
    display: inline-block;
    margin-top: 0.22rem;
    /*margin-right: 0;*/
    height: .81rem;
    width: .81rem;
    background: url(../assets/phone.png) no-repeat left center;
    background-size: .79rem .79rem;
    vertical-align: middle;
}
</style>
