<template>
    <div class="container modal">
        <div class="modal-mask"></div>
        <div class="radius-big modal-wrap">
        <p class="com-title" v-if="detail.title" :class="'title-type'+type">{{detail.title}}</p>
        <div class="content" :class="'content-type'+type">
            <template v-for="p in detail.content">
                <p v-html="p" v-if="type !== 7"></p>
                <p v-else>{{p | formateWaitTime(msg)}}</p>
            </template>
        </div>
        <!-- 左边是取消按钮 右边是确定 type4 的时候情况特殊 相反 -->
        <template v-if="detail.operation && detail.operation.length === 1">
            <div class="footer">
                <button class="btn" @click="cancel">{{detail.operation[0].text}}</button>
            </div>            
        </template>
        <template v-if="detail.operation && detail.operation.length === 2">
            <div class="footer" >
                <button class="btn btn-left" @click="cancel">{{detail.operation[0].text}}</button><button class="btn btn-right" @click="certain">{{detail.operation[1].text}}</button>
            </div>
        </template>
            
        </div>
    </div>
</template>

<script>
let modalDetail = {
    type0: {
        title: 'XXXX已失效',
        content: ['请从XXX重新下单','点左上角<span style="color:#2072cf">“返回”</span>即可退出']    
    },
    type1: {
        title: '将为您恢复订单',
        content: ['您有一个订单正在进行'],
        operation: [
            {text: '马上恢复'},
        ]
    },
    type2: {
        title: '没有司机接单哦',
        content: ['请至首页重新发单'],
        operation: [
            {text: '我知道了'},
        ]
    },
    type3: {
        title: '没有司机接单哦',
        content: ['您的地址已超出服务范围'],
        operation: [
            {text: '我知道了'},
        ]
    },    
    type4: {
        title: '',
        content: ['我们正在为您安排司机，确定不再等一会儿么？'],
        operation: [
            {text: '不等了'},
            {text: '再等一会儿'},
        ]
    },    
    type5: {
        title: '取消消息',
        content: ['如非特殊情况，请不要随意取消，若因您的原因频繁取消将会影响您的后续使用'],
        operation: [
            {text: '暂不取消'},
            {text: '继续操作 '},
        ]
    },     
    type6: {
        title: '取消消息',
        content: ['司机已到达，若您此时取消，仍会使用本次权益'],
        operation: [
            {text: '暂不取消'},
            {text: '继续操作 '},
        ]
    },
    type7 : {
        title: '',
        content: ['司机已等候您{{%msg%}}，本次取消需要支付等候费，您确认要取消吗？'],
        operation: [
            {text: '暂不取消'},
            {text: '继续操作 '},
        ]
    },
    type8 : {
        title: '很抱歉订单已被司机取消！',
        content: ['请至首页重新发单'],
        operation: [
            {text: '我知道了'},
        ]
    } 
};
export default {
    name: 'modal',
    props:['type','msg'],
    data () {
        return {
            detail: modalDetail['type'+this.type],
        }
    },
    filters: {
        formateWaitTime(value,msg) {
            return value.replace('{{%msg%}}',msg);
        }
    },
    methods: {
        cancel: function() {
            this.$emit('cancel');
        },
        certain: function() {
            this.$emit('certain');
        }
    }
}
</script>
    
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    z-index: 999;
}
.modal::after {
    content: "";
    display: inline-block;
    height: 100%;
    margin-left: -0.25em; /* To offset spacing. May vary by font */
    max-width: calc(100% - 0.25em); /* Only for IE9+  */
    vertical-align: middle;
}
.modal-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    opacity: .6;
    filter: alpha(Opacity=60);
}
.modal-wrap {
    position: relative;
    display: inline-block;
    padding-top: .38rem; 
    width: 5.66rem;
    margin: 0 auto;
    background: #fff;
    border: none;
    font-size: .32rem;
    color: #222;
    text-align: center;
    vertical-align: middle;
    z-index: 999;
    overflow: hidden;
}  
.com-title, .content {
    padding: 0 .57rem;
}
.com-title {
    padding: 0 .55rem;
    font-weight: bold;
    line-height: 1;
}

.title-type0, .title-type1, .title-type2, .title-type8 {
   padding-top: .4rem; 
   padding-bottom: .35rem; 
}
.title-type3, .title-type5, .title-type6{
    padding-bottom: .35rem; 
}
.content-type0 {
    padding-bottom: .78rem;
}
.content-type1, .content-type2, .content-type7, .content-type8  {
    padding-bottom: .35rem;
}
.content-type3, .content-type5, .content-type6{
    padding-bottom: .56rem;
}
.content-type4, .content-type7 {
    padding-top: .2rem;
    padding-bottom: .56rem;
}
.content-type5 {
    font-weight: bold;
}

.content {
   
}
.footer {
    width: 100%;
    height: 1.02rem;
    border-top: 1px solid #dedfe0;
}
.btn {
    width: 50%;
    height: 100%;
    border: none;
    font-size: inherit;
    color: #0272cf;
    background: #fff;
}
.btn-left {
    color: #999;
    border-right: 1px solid #dedfe0;
}
</style>
