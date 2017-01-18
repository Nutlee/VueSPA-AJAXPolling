<template>
    <div>
        <addre-select :address="address" :addressBox='addressBox'></addre-select>
        <div class="container billrules">
            <p class="com-title2"><i class="line-left"></i>计费规则<i class="line-right"></i></p>
            <ul class="rules">
                <li class="rule" v-for="rule in rules">
                    {{rule}}
                </li>
            </ul> 
        </div>
        <operate-btn v-show="btn.text" 
        @btnClick="btnClick" 
        :btnText="btn.text" 
        :btnDisabled="btnDisabled"></operate-btn>   
        <modal v-if="modal.isShowModal" 
                @cancel="certainModal" 
                @certain="certainModal" 
                :type="modal.type"
                :msg="modal.msg">
        </modal>
    </div>
</template>

<script>
import addreSelect from './addreselect';
import operateBtn from './operatebtn';
import modal from './modal';

export default {
    name: 'home',
    props:['address','outerOrderId','API','btnDisabled'],
    components: {
        addreSelect,
        operateBtn,
        modal
    },
    data () {
        return {
            describtion: '文字文字',
            btn: {
                text: '按钮',
                disabled: false
            },
            rules: [
                '------------------------------------------------------------',
                '------------------------------------------------------------',
                '------------------------------------------------------------',
                '------------------------------------------------------------'
            ],
            modal: {
                isShowModal: false,
                type: 0,
                msg: ''
            },
            addressBox: {
                isStartComplete: false,
                isEndComplete: false,
            }
        }
    },
    methods: {
        getNowFormatDate() {
            let date = new Date();
            let seperator1 = "-";
            let seperator2 = ":";
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            let currentdate = year + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes()
                    + seperator2 + date.getSeconds();
            return currentdate;
        },
        btnClick() {
            let start = this.address.start;
            let end = this.address.end;

            let _self = this;
            _self.$emit('changeView');
            _self.$emit('takeOrderSuccess');
        },
        showModal(type) {
            this.modal.type = type;
            this.modal.isShowModal = true;
        },
        certainModal() {
           // 判断情况取消
           // 只有一种情况有确定按钮
            this.modal.isShowModal = false;
        },

    },
    mounted() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rules {
    margin-top: .3rem;
}
.rule {
    margin-left: .4rem;
    margin-bottom: .22rem;
    text-indent: -.09rem;
    font-size: .27rem;
    text-align: left;
}
.line-left, .line-right {
    display: inline-block;
    height: 2px;
    width: 2.41rem;
    vertical-align: middle;
}
.line-left {
    margin-right: .3rem;
    background: url(../assets/lineleft.png) no-repeat right center;
}
.line-right {
    margin-left: .3rem;
    background: url(../assets/lineright.png) no-repeat left center;
}
</style>
