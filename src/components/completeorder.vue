<template>
<div>
    <div class="container completeorder">
        <driver-profile :driverProfile="driverProfile" class="driverprofile"></driver-profile>
        <div class="tip" v-show="!suggestion.isShow">
            <hr/><small>支付费用</small>
        </div> 
        <div class="detail" v-show="!suggestion.isShow || evaluation===-1">
            <p class="total">{{total}}<span>元</span></p>
            <section>
                <div class="detail-list">
                    <span class="detail-left">等候费用（{{wait.time|waitChargeFilter}}）</span><span class="detail-right">{{wait.cost}}元</span>
                </div>
                <div class="detail-list">
                    <span class="detail-left">里程费用（{{mile.distance}}公里）</span><span class="detail-right">{{mile.cost}}元</span>
                </div>
            </section>
        </div>
        <template v-if="!driveDetails.isHideEval">
            <div class="tip">
                <hr/><small>评价</small>
            </div>   
            <div class="evaluation" @click="evaluateStar">
                <span class="star-five"></span><span class="star-five"></span><span class="star-five"></span><span class="star-five"></span><span class="star-five"></span>
                <small class="eva-tip" v-show="!suggestion.isShow">{{evaTip}}</small>
            </div>
        </template>
        <textarea class="radius-small sustext" 
        v-show="suggestion.isShow" 
        v-model="suggestion.text" 
        placeholder="说说你的建议吧"></textarea>
    </div>
    <operate-btn v-show="suggestion.isShow" @btnClick="evalOrder" :btnText="btn.text" :btnDisabled="btn.disabled"></operate-btn>
</div>
</template>

<script>
import driverProfile from './driverprofile';  
import operateBtn from './operatebtn';

export default {
    name: 'completeorder',
    props: ['driverProfile','driveDetails'],
    data () {
        return {
            total: this.driveDetails.total,
            wait: this.driveDetails.wait,
            mile: this.driveDetails.mile,
            evaluation: -1,
            isEvaluation: true,
            evaTip: '服务如何？给个评价吧！',
            btn: {
                text: '提交',
                disabled: false
            },
            suggestion: {
                isShow: false,
                text: ''
            }
        }
    },
    watch: {
        "evaluation": function(val) {
            this.suggestion.isShow = this.evaluation > -1;
        }
    },
    filters: {
        waitChargeFilter(value) {
            let minutes = Number.parseInt(value/60);
            let seconds = Number.parseInt(value - minutes*60);
            if (minutes>0) {
                minutes += '分钟';
            } else {
                minutes = '';
            }
            if (seconds>0) {
                seconds += '秒';
            } else {
                seconds = '';
            }
            return minutes+seconds;
        }
    },
    components: {
        driverProfile,
        operateBtn
    },
    methods: {
        ishasClass(elem,className) {
            var reg = new RegExp('(^|\\s+)' + className + '($|\\s+)');
            return reg.test(elem.className);
        },
        evaluateStar(event) {
            if (this.isEvaluation) {
                let wrap = event.currentTarget;
                let _self = event.target;
                let options = wrap.getElementsByTagName('span');

                let index = -1;
                if (this.ishasClass(_self,'star-five')) {
                    for (let i = 0,len=options.length; i < len; i++) {
                        let option = options[i];
                        if (option === _self ) {
                            index = i;
                            option.className = 'star-five star-five-focus';
                        } else {
                            if (index<0) {
                                option.className = 'star-five star-five-focus';
                            } else {
                                option.className = 'star-five';
                            }
                        }
                    };
                    this.evaluation = index;
                }
            }
        },
        evalOrder() {
            let data = {
                grade: this.evaluation + 1,
                content: this.suggestion.text,
                doid: this.driveDetails.doid,
                cid: this.driveDetails.cid,
                did: this.driveDetails.did,
            };

            this.suggestion = false;
            this.isEvaluation = false;
            this.evaTip = '感谢您的评价，帮助我们做的更好';

        },
    },
    mounted() {
        this.$emit('cancelPollOrder');
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.completeorder {
    padding-top: 0;
}
.driverprofile {
    margin-top: 0;
    padding-top: .65rem;
    width: 6.86rem;
}
.total {
    /*默认行高大概.25rem*/
    margin-top: .45rem;
    margin-bottom: .5rem;
    font-size: 1rem;
}
.total span {
    font-size: .28rem;
    color: #666;
}
.detail-list {
    padding: .15rem .4rem;
    font-size: .31rem;
    color: #656565;
    text-align: left;
}
.detail-left {
    display: inline-block;
    width: 70%;
}
.detail-right {
    display: inline-block;
    text-align: right;
    width: 30%;
    color: #ff2244;
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
.evaluation {
    margin-top: .59rem;
}
.star-five {
    display: inline-block;
    height: .57rem;
    width: .57rem;
    margin: 0 .2rem;
    background: url(../assets/star_five.png) no-repeat center center;
    background-size: .57rem .57rem;
}
.star-five-focus {
    background: url(../assets/star_five_focus.png) no-repeat center center;
    background-size: .57rem .57rem;
}
.eva-tip {
    display: block;
    margin-top: .27rem;
    font-size: .24rem;
    color: #2072cf;
}
.sustext {
    width: 6.1rem;
    height: 2rem;
    margin-top: .6rem;
    font-size: .28rem;
    outline: none;
}

</style>       
