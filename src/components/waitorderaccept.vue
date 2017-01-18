<template>
    <div>
        <div class="container">
            <p class="com-title">{{title}}</p>
            <small class="com-tips">{{tips}}</small>
            <div class="wrap">
                <div class="circle c-animation1"></div>
                <div class="circle c-animation2"></div>
                <!-- <div class="circle c-animation3"></div> -->
                <div class="fixedcirle">
                    <p class="wait-des">已等候</p>
                    <p class="wait-time">{{waitTime | formateTime}}</p>
                </div>
            </div>
        </div>
        <operate-btn v-show="btn.text" @btnClick="btnClick" :btnText="btn.text" :btnDisabled="btn.disabled"></operate-btn>  
        <modal v-if="modal.isShowModal" 
                @cancel="certainModal" 
                @certain="closeModal" 
                :type="modal.type"
                :msg="modal.msg">
        </modal>
    </div>
</template>

<script>
import operateBtn from './operatebtn';
import modal from './modal';

export default {
    name: 'waitanimate',
    props: ['outerOrderId'],
    data () {
        return {
            title: '收到，正在为您XXXXXXXX',
            tips: '',
            startTime: 0,
            now: 0,
            waitTime: 0,
            maxWaitTime: 5*60*1000,
            btn: {
                text: '取消',
                disabled: false
            },
            modal: {
                isShowModal: false,
                msg: '',
                type: 4
            }
        }
    },
    watch: {
        waitTime( value ) {
            if (value > this.maxWaitTime) {
                this.showModal(2);
                this.$emit('cancelPollOrder');
            }
        }
    },
    filters: {
        formateTime(waitTime) {
            let minutes = Number.parseInt(waitTime/1000/60);
            let seconds = Number.parseInt(waitTime/1000 - minutes*60);
            if (minutes<10) {
                minutes = '0' + minutes;
            }
            if (seconds<10) {
                seconds = '0' + seconds;
            }
            return minutes + ':' + seconds;
        }
    },
    mounted() {
        let self = this;
        let start = this.startTime = new Date().getTime();
        this.timer = setInterval(function(){
            self.waitTime = new Date().getTime() - start;
        }, 1000);

    },
    components: {
        operateBtn,
        modal
    },
    methods: {
        btnClick() {
            // this.$emit('changeView');
            this.showModal(4);
        },
        showModal(type) {
            this.modal.type = type;
            this.modal.isShowModal = true;
        },
        // 此处 UI 设计是反的 
        certainModal() {
           // 判断情况取消           
            let type = this.modal.type;
            if (type === 4) {
                let _self = this;
                _self.$emit('cancelPollOrder');
                _self.$emit('reload');
            } else {
                this.modal.isShowModal = false;
                this.$emit('reload');
            }
        },
        // 确认
        closeModal() {
            // console.log('继续等');
            this.modal.isShowModal = false;
        }
    }
}
</script>

<style scoped>
.wait-des, .wait-time {
    color: #fff;
}
.wait-des {
    margin-top: .4rem;
    font-size: .24rem;
}
.wait-time {
    font-size: .4rem;
}
.wrap {
    position: relative;
    width: 100%;
    height: 5rem;
    overflow: hidden;
}
.circle {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 1.56rem;
    height: 1.56rem;
    border-radius: 50%;
    margin: auto;
    /*background: radial-gradient(rgba(0, 0, 0, 255), #2072cf);*/
    background: #69a1e2;
    -webkit-animation: c-animation 2s linear infinite normal;
    -moz-animation: c-animation 2s linear infinite normal;
    -o-animation: c-animation 2s linear infinite normal;
    animation: c-animation 2s linear infinite normal;
}

@-webkit-keyframes c-animation {
    from {
        -webkit-transform: scale(1);
    }
    to {
        -webkit-transform: scale(2.7);
        opacity: 0;
    }   
}
@-moz-keyframes c-animation {
    from {
        -moz-transform: scale(1);
    }
    to {
        -moz-transform: scale(2.7);
        opacity: 0;
    }   
}
@-o-keyframes c-animation {
    from {
        -o-transform: scale(1);
    }
    to {
        -o-transform: scale(2.7);
        opacity: 0;
    }   
}
@keyframes c-animation {
    from {
        transform: scale(1);
        /*opacity: 1;*/
    }
    to {
        transform: scale(2.7);
        opacity: 0;
    }   
}
.c-animation1 {
    -webkit-animation-delay: 1s;
    -moz-animation-delay: 1s;
    -o-animation-delay: 1s;
    animation-delay: 1s;
}   
.c-animation2 {
    -webkit-animation-delay: 2s;
    -moz-animation-delay: 2s;
    -o-animation-delay: 2s;
    animation-delay: 2s;
}
.c-animation3 {
    -webkit-animation-delay: 3s;
    -moz-animation-delay: 3s;
    -o-animation-delay: 3s;
    animation-delay: 3s;
}
/* 圆形在外部nowebpack.css 未用webpack处理*/
.fixedcirle {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 1.56rem;
    height: 1.56rem;
    margin: auto;
    border-radius: 50%;
    /*background: radial-gradient(rgba(255, 0, 0, 0), #076d7d);*/
    /*background: #076d7d;*/
    background: #2072cf;
}
</style>       
