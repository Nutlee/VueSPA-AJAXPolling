<template>
  <div id="app">
    <component v-bind:is="currentView" 
    :address="address"
    :outerOrderId="outerOrderId"
    :driveDetails="driveDetails" 
    :driverProfile="driverProfile"
    :API="API"
    :btnDisabled="btn.disabled"
    @reload = "reload"
    @closeRootModal="closeModal"
    @takeOrderSuccess = "takeOrderSuccess"
    @cancelPollOrder = "cancelPollOrder"
    @changeView = "changeView">
    </component>
<!--     :settlementDetail="settlementDetail" -->

    <modal v-if="modal.isShowModal" 
            @cancel="certainModal" 
            @certain="closeModal" 
            :type="modal.type"
            :msg="modal.msg">
    </modal>
  </div>
</template>
<!-- <script src="/static/js/map.js"></script> -->
<script>
function autoSize() {
    var doc = document.documentElement;
    //设计稿使用750px宽度
    var docWidth = (doc.getBoundingClientRect().width > 750)?750:doc.getBoundingClientRect().width;
    var rem = Math.round(docWidth / 7.5);
    // 四舍五入 对齐 font-size 和 with 等
    doc.style.fontSize = rem +'px';
};
autoSize();
var timer=0;
window.addEventListener('resize',function(){
    clearTimeout(timer);
    timer = setTimeout(autoSize,300);
});

import home from './components/home';
import waitAnimate from './components/waitorderaccept';
import driverReady from './components/driverready';
import completeOrder from './components/completeorder';
import cancelEnd from './components/cancelend';
import operateBtn from './components/operatebtn';
import modal from './components/modal';

// 头像
import headIcon from './assets/headicon.png';
import telIcon from './assets/phone.png';


var appViews = ['home','waitAnimate','driverReady','completeOrder','cancelEnd'];
export default {
    name: 'app',
    data(){
        return {
            currentView: '',
            stage: 0,
            // 初始化标志位
            initStatus: true,
            outerOrderId: '',
            timer: '',
            isPolling: false,
            isWeiXin: (function(){
                return /micromessenger/.test(navigator.userAgent.toLowerCase());
            })(),
            btn: {
                text: '按钮',
                disabled: true,
            },
            modal: {
                type: 0,
                msg: '',
                isShowModal: false
            },
            address: {
                start:{
                    address: '',
                    x: '',
                    y: '',
                    city:''
                },
                end: {
                    address: '',
                    x: '',
                    y: '',
                    city:''
                }
            },
            driverProfile: {
                imgIcon: headIcon,
                name:'',
                expire: '',
                tel:'',
                telIcon: telIcon
            },
            // 传入 driverReady
            driveDetails: {
                doid:'',
                did: '',
                cid: '',
                stage: 0,
                total: '0.00',
                distance: '',
                wait: {
                    cost: 0,
                    time: 0,
                },
                mile: {
                    cost: 0,
                    distance: 0
                }
            }
        }
    },
    computed: {
        currentView() {
            return appViews[this.stage];
        }
    },
    components: {
        home,
        waitAnimate,
        driverReady,
        completeOrder,
        cancelEnd,
        operateBtn,
        modal,
    },
    methods: {
        changeView(stage) {
            if (typeof(stage) === 'number') {
                this.stage = stage;
            } else {
                this.stage ++;
            }
        },
        takeOrderSuccess() {
            // console.log('take order');
            let _self = this;
            this.isPolling = true;
            let data = {
                outerOrderId: _self.outerOrderId
            };
            let waitTime = 0;
            let orderData = {
                keypoint: {
                    'state': '待接单'
                },
                order: {
                    dtel: '13800000000',
                    dname: '张三',
                    dcount: 10,
                    price: '150',
                    distance: '20公里',
                    wait_time: '11',
                    wait_price: '110',
                    dis_price: '40'
                }
            };
            function pollingOrderDetail() {
                clearTimeout(this.timer);
                // 通过轮询跳转页
                this.timer = setTimeout(function() {
                    console.log(waitTime);
                    if (_self.isPolling) {
                        if (waitTime === 3) {
                            _self.viewRouter(orderData);
                        } else if (waitTime === 5) {
                            orderData.keypoint.state = '已接单';
                            _self.viewRouter(orderData);
                        } else if (waitTime === 8) {
                            orderData.keypoint.state = '已到达';
                            _self.viewRouter(orderData);
                        } else if (waitTime === 11) {
                            orderData.keypoint.state = '开始代驾';
                            _self.viewRouter(orderData);
                        } else if (waitTime === 14) {
                            orderData.keypoint.state = '中途等待';
                            _self.viewRouter(orderData);
                        } else if (waitTime === 17) {
                            orderData.keypoint.state = '已结束';
                            _self.viewRouter(orderData);
                        }

                        waitTime++;
                        this.timer=setTimeout(pollingOrderDetail, 1000);
                    } else if (waitTime>10) {

                        // _self.showModal(0);
                    }
                },1000);
            };
            this.timer=setTimeout(pollingOrderDetail, 1000);
        },
        viewRouter(pollData) {
            let keypoint = pollData.keypoint;
            let order = pollData.order;
            switch (keypoint.state) {
                case '待接单':
                    if (order.dname && this.stage !== 1) {
                        this.stage = 1;
                    }
                    break;
                case '已接单':
                    if (this.stage !== 2) {
                        this.stage = 2;
                    }
                    this.driverProfile.tel = order.dtel;
                    this.driverProfile.name = order.dname;
                    this.driverProfile.expire = order.dcount;
                    this.driveDetails.stage = 0;
                    break;
                case '已到达':
                    if (this.stage !== 2) {
                        this.stage = 2;
                    }
                    this.driverProfile.tel = order.dtel;
                    this.driverProfile.name = order.dname;
                    this.driverProfile.expire = order.dcount;
                    this.driveDetails.stage = 1;
                    this.driveDetails.wait.time = order.wait_time;
                    break;                 
                case '开始代驾':
                    if (this.stage !== 2) {
                        this.stage = 2;
                    }
                    this.driverProfile.tel = order.dtel;
                    this.driverProfile.name = order.dname;
                    this.driverProfile.expire = order.dcount;
                    this.driveDetails.mile.distance = order.distance || 0;
                    this.driveDetails.stage = 2;
                    this.driveDetails.wait.time = order.wait_time;
                    this.driveDetails.total = order.price || "0.00";
                    break;                 
                case '中途等待':
                    if (this.stage !== 2) {
                        this.stage = 2;
                    }
                    this.driverProfile.tel = order.dtel;
                    this.driverProfile.name = order.dname;
                    this.driverProfile.expire = order.dcount;
                    this.driveDetails.stage = 3;
                    this.driveDetails.wait.time = order.wait_time;
                    break;                 
                case '已结束':
                // debugger;
                    if (this.stage !== 3) {
                        this.stage = 3;
                    }
                    this.driverProfile.tel = order.dtel;
                    this.driverProfile.name = order.dname;
                    this.driverProfile.expire = order.dcount;
                    this.driveDetails.mile.distance = order.distance;
                    this.driveDetails.mile.cost = order.dis_price;
                    this.driveDetails.wait.time = order.wait_time;
                    this.driveDetails.wait.cost = order.wait_price;
                    this.driveDetails.total = order.price;
                    break; 
                case  '已完成': 
                    break;
                default :
                    if (this.stage !== 0) {
                        this.stage = 0;
                    }
            }
        },
        cancelPollOrder() {
            this.isPolling = false;
            this.timer = '';
            clearTimeout(this.timer);
        },

        getUrlParameter(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            return r?r[2]:null;
        },
        closeModal() {
            this.modal.isShowModal = false;
        },
        certainModal() {
            if (this.modal.type === 1) {
                this.closeModal();
                this.takeOrderSuccess();
            } else if (this.modal.type === 2) {
                this.cancelPollOrder();
                this.closeModal();
                this.reload();
            } else if (this.modal.type === 8) {
                this.reload();
            }
        },
        reload() {
            if (this.isWeiXin) {
                window.location.replace( window.location.href+'&r='+(Math.random()*10).toFixed(0));
            } else {
                window.location.reload();
            }
        },
        showModal(type) {
            this.modal.type = type;
            this.modal.isShowModal = true;
        }
    },
    mounted() {
        let _self = this;
        this.btn.disabled = false;

        //  轮询开始
        // this.takeOrderSuccess();
    }
}

</script>

<style>
body {
    padding: 0;
    margin: 0;
    font-size: .32rem;
    background: #f2f2f2;
}
ul,p {
    margin: 0;
    padding: 0;
}
*, *::before {
    box-sizing: border-box;
}
input, button {
    outline: none;
}
.container {
    padding-top: .4rem;
    margin: 0 .3rem;
}
.radius-small {
    border-radius: 6px;
    border: 2px solid #e8e8e8;
    overflow: hidden;
}
.radius-medium {
    border-radius: 12px;
    border: 2px solid #e8e8e8;
    overflow: hidden;
}
.radius-big {
    border-radius: .16rem;
    border: 2px solid #e8e8e8;
}
.com-title {
    font-size: .38rem;
        color: #222;
}
.com-tips {
    font-size: .22rem;
    color: #666;
} 
.windowwidthhr{
    margin: 0 -.3rem;
    border: 0;
    border-top: 1px solid #d7d7d7;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
