<template>
<div>
    <div class="container driverready">
        <p class="com-title">{{detail.driverStatus}}</p>
        <hr class="windowwidthhr border-mtop" />
        <driver-profile :driverProfile="driverProfile" class="driverprofile"></driver-profile> 

        <section class="radius-small statusdetail" >
            <template v-if="driveDetails.stage === 0" >
                距您 <span>{{distance}}</span>
            </template>
            <template v-if="driveDetails.stage === 1" >
                司机已等候：<span>{{driveDetails.wait.time|formatWaitTime}}</span>
            </template>
            <template v-if="driveDetails.stage === 2">
                <div class="status-left">
                    <div class="border-right">
                        <p class="left-time">行驶<span>{{driveDetails.mile.distance}}</span>公里</p>
                        <small class="left-tip">文字文字文字文字</small>
                    </div>
                </div><div class="status-right">共计<span>{{driveDetails.total}}</span>元</div>
            </template>
            <template v-if="driveDetails.stage === 3">
                <div class="status-left">
                    <div class="border-right">
                        <p class="left-time">等候<span>{{driveDetails.wait.time|formatWaitTimeToMin}}</span>分钟</p>
                        <small class="left-tip">文字文字文字文字</small>
                    </div>
                </div><div class="status-right">共计<span>{{driveDetails.total}}</span>元</div>
            </template>
        </section>
    </div>
    <operate-btn v-show="'取消'" @btnClick="cancelOrder" :btnText="'取消'" :btnDisabled="false"></operate-btn>
    <modal v-if="modal.isShowModal" 
        @cancel="closeModal" 
        @certain="certainModal" 
        :type="modal.type"
        :msg="modal.msg">
    </modal>
</div>
</template>

<script>
import driverProfile from './driverprofile';
import operateBtn from './operatebtn';
import modal from './modal';

let orderStatusDetail = [
    {
        driverStatus: '阶段一',
    },{
        driverStatus: '阶段二',
    },{
        driverStatus: '阶段三(1)',
    },{
        driverStatus: '阶段三(2)',

    },
]; 
export default {
    name: 'driverReady',
    props:['driveDetails','driverProfile','outerOrderId'],
    data () {
        return {
            detail: orderStatusDetail[this.driveDetails.stage],
            distance: '100公里',
            isWaitTimeOut: false,
            modal: {
                isShowModal: false,
                type: 5,
                msg: ''
            }
        };
    },
    computed: {
        detail() {
            return orderStatusDetail[this.driveDetails.stage];
        },
        isWaitTimeOut() {
            return this.driveDetails.wait.time>(30*60);
        },
    },
    components:{
        driverProfile,
        operateBtn,
        modal
    },
    filters: {
        formatWaitTime(value) {
            let hours = Number.parseInt(value/60/60);
            let minutes = Number.parseInt(value/60);
            let seconds = Number.parseInt(value - minutes*60 - hours*60*60);
            if (minutes<10) {
                minutes = '0' + minutes;
            }
            if (seconds<10) {
                seconds = '0' + seconds;
            }
            if (hours<10) {
                hours = '0' + hours;
            }
            return hours + ':' + minutes + ':' + seconds;
        },
        formatWaitTimeToMin(value) {
            let minutes = Number.parseInt(value/60);
            return minutes;
        }
    },
    mounted() {
        // this.waitTime = 0;
        if (this.driveDetails.stage === 0) {
            this.computeDistance();
        }
    },
    methods: {
        computeDistance() {
        },
        cancelOrder() {
            switch (this.driveDetails.stage) {
                case 0:
                    this.showModal(5);
                    break;
                case 1:
                case 2:
                case 3:
                    if (this.isWaitTimeOut) {
                        this.modal.msg = this.formatTime(this.driveDetails.wait.time);
                        this.showModal(7);
                    } else {
                        this.showModal(6);
                    }
                    break;
            }
        },
        showModal(type) {
            this.modal.type = type;
            this.modal.isShowModal = true;
        },
        certainModal() {
            this.$emit('cancelPollOrder');
            this.$emit('changeView',4);
            this.$emit('closeRootModal');
            this.closeModal();
        },
        closeModal() {
            this.modal.isShowModal = false;
        },
        formatTime(value) {
            let hours = Number.parseInt(value/60/60);
            let minutes = Number.parseInt(value/60);
            if (minutes>0) {
                minutes += '分钟';
            } else {
                minutes = '';
            }
            if (hours>0) {
                hours += '小时';
            } else {
                hours = '';
            }
            return hours+minutes;
        }
    }
}
</script>
    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.driverready {
    margin-left: .5rem;
    margin-right: .5rem;
}
.border-mtop {
    margin: .55rem -.5rem 0;
}
.driverprofile {
    padding-top: .6rem;
}
.statusdetail {
    margin-top: .6rem;
    height: 1.21rem;
    font-size: .32rem;
    line-height: 1.21rem;
    color: #222;
    background: #fff;
}
.statusdetail span {
    font-size: .38rem;
    color: #2072cf;
    vertical-align: middle;
}
.statusdetail.type2 span {
    color: #ff2244;
}

.status-left, .status-right {
    display: inline-block;
    height: 100%;
    width: 50%;
    color: #222;
    line-height: 1;
    vertical-align: top;
}
.border-right {
    border-right: 1px solid #efefef;
}
.left-time {
    margin-top: .24rem;
}
.left-tip {
    font-size: .24rem;
    color: #666;
}
.status-right {
    padding-top: .4rem;
}
.status-right * {
    line-height: 0;
    vertical-align: middle;
}
</style>
