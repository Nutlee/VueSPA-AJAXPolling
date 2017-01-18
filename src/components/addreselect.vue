<template>
    <div class="container address">
        <p class="com-title com-title-mbottom">请填写正确的信息</p>
        <div class="radius-medium radius-input">
            <div class="form-row separate greenpoint">
                <input class="address-input" id='startaddress' type="text" :placeholder="sPlaceholder" 
                @focus = "focusSLocation"
                @blur = "searchAddress(start)" 
                v-model="start.address" />
            </div>
            <div class="form-row redpoint">
                <input class="address-input" id="endaddress" 
                v-model="end.address" 
                @focus = "focusELocation"
                @blur="searchAddress(end)"
                type="text" placeholder="" />
            </div>
        </div>  
    </div>
</template>

<script>

export default {
    name: 'addreSelect',
    props:['address','addressBox'],
    data () {
        return {
            discription: '填写地址',
            start: this.address.start,
            end: this.address.end,
            sPlaceholder: '定位中...',
            isInitSAutoComplete: true,
            isInitEAutoComplete: true,
            autoCompleteSCountiner: '',
            autoCompleteECountiner: '',
        }
    },
    methods: {
        focusSLocation(event) {
            this.addressBox.isStartComplete = false;
            if (this.isInitSAutoComplete) {
                var address = this.start.address;
                this.startAutoComplete();
                this.isInitSAutoComplete = false;
                setTimeout(function(){
                    // console.log('address',address);
                    // console.log('target',event.target);
                    event.target.value = address;
                },0)
            }
        },        
        focusELocation(event) {
            this.addressBox.isEndComplete = false;
            if (this.isInitEAutoComplete) {
                var address = this.end.address;
                this.endAutoComplete();
                this.isInitEAutoComplete = false;
            }
        },
        getCurrentPositionH5() {
            let _self = this;
            function getCurrentLocationH5(){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(successCallback, errorCallback , 
                                {enableHighAccuracy:true , timeout: 2000,maximumAge:5000});
                 } else{
                     console.log("Geolocation is not supported by this browser.");
                }
            };
            function errorCallback(error){
                console.log("获取经纬度失败，原因："+error.message);
                //alert("获取经纬度失败，原因："+error.message);
            };
            function successCallback(position){
                let userLogtitude = position.coords.longitude;
                let userLatitude =position.coords.latitude;
                var point = new BMap.Point(userLogtitude,userLatitude);

                debugger;
                _self.start.x = userLogtitude;
                _self.start.y = userLatitude;
                console.log("经度:"+userLogtitude+",纬度："+userLatitude);
                _self.getAddressFromPointH5(point);
            };
            getCurrentLocationH5()
        },
        // 返回当前地点
        getCurrentPosition() {
            let _self = this;

            let geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    // console.log(r);
                    let addresc = _self.start.city = r.address.city;
                    let address = r.address.street;
                    let addresn = r.address.street_number;
                    _self.start.address  = addresc + address + addresn;
                    _self.start.x = r.point.lng;
                    _self.start.y = r.point.lat;
                    _self.start.point = r.point;
                    _self.start.point = r.point;

                    _self.sPlaceholder = '例：上海市东方路XXX号';
                } else {
                    _self.sPlaceholder = '定位失败请手动输入';
                    console.log('自动定位失败');
                    // $("addr").prop('placeholder', '定位失败，请手动输入地址');
                }
                _self.addressBox.isStartComplete = true;
            }, {
                enableHighAccuracy: true
            });
        },
        //创建自动补充控件
        startAutoComplete() {
            let _self = this;
            // let map = new BMap.Map("l-map");
            // map.centerAndZoom('上海', 12);
            this.autoCompleteSCountiner = new BMap.Autocomplete({
                "input": 'startaddress',
                "location": _self.start.city,
                // "location": map,
                "onSearchComplete": function(results) {
                    // console.log(arguments);
                    // console.log(results);
                },
            });
            this.autoCompleteSCountiner.addEventListener("onconfirm",function(e) {
                let item = e.item.value;
                // console.log(e);
                _self.start.address = item.province + item.city + item.district + item.street + item.streetNumber + item.business;
                _self.start.city = item.city;
            });
            console.log('set startAutoComplete',this.autoCompleteSCountiner);
        },      
        endAutoComplete() {
            let _self = this;
            this.autoCompleteSCountiner = new BMap.Autocomplete({
                "input": 'endaddress',
                "location": _self.start.city,
                "onSearchComplete": function(results) {
                    // console.log(arguments);
                    // console.log(results);
                },
            })
            this.autoCompleteSCountiner.addEventListener("onconfirm",function(e) {
                let item = e.item.value;
                _self.end.address = item.province + item.city + item.district + item.street + item.streetNumber + item.business;
                _self.end.city = item.city;
                _self.isEndComplete = true;
                console.log('_self.isEndComplete',_self.isEndComplete);
            });
        },
        //地址 ==> 坐标
        getPointFromAddress(addr,setObj) {
            // addresctem = addr.substr(0, 3);
            // if(addresc!=""&&(addresc.indexOf(addresctem)<0)){
            //     addr=addresc+addr;
            // }  
            var _self = this; 
            var geoc = new BMap.Geocoder();
            geoc.getPoint(addr, function(point) {
                if (point) {
                    // getAddressFromPoint(point);
                    setObj.point = point;
                    setObj.x = point.lng;
                    setObj.y = point.lat;
                    _self.getAddressFromPoint(point,setObj);
                } else {
                    setObj.x = 0;
                    setObj.y = 0;
                    if (setObj === _self.start) {
                        _self.addressBox.isStartComplete = true;
                    } else if (setObj === _self.end) {
                        _self.addressBox.isEndComplete = true;
                    }
                    return;
                }
            });
        },
        //坐标 ==> 地址
        getAddressFromPoint(point,obj) {
            var geoc = new BMap.Geocoder();
            let _self = this;
            geoc.getLocation(point, function(rs) {
                let addComp = rs.addressComponents;
                // let addr = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;  
                // let addresc = addComp.city;
                obj.city = addComp.city;
                if (obj === _self.start) {
                    _self.addressBox.isStartComplete = true;
                } else if (obj === _self.end) {
                    _self.addressBox.isEndComplete = true;
                }
            });
        },   
        // H5      
        getAddressFromPointH5(point,obj) {
            var _self = this;
            var geoc = new BMap.Geocoder();
            geoc.getLocation(point, function(rs) {
                let addComp = rs.addressComponents;
                console.log(addComp);
                _self.start.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;  
                // let addresc = addComp.city;
                _self.start.city = addComp.city;
            });
        },
        searchAddress(obj,event) {
            this.getPointFromAddress(obj.address,obj);
            // if (!isAutoComplete && obj.x) {
            //     let point = obj.point;
            //     this.getAddressFromPoint(point,obj);
            // }
            // console.log(obj.address,obj.x);
        }
    },
    mounted() {    
        this.getCurrentPosition();
    }
}
</script>

<style scoped>
.com-title-mbottom {
    margin-bottom: .4rem;
}
.radius-input {
    height: 2.42rem;
}
.form-row {
    position: relative;
    height: 50%;
}
.greenpoint::before, .redpoint::before {
    position: absolute;
    top: .49rem;
    left: .43rem;
    content: " ";
    height: .23rem; 
    width: .23rem;
    border-top-left-radius: 999px; /* 左上角 */
    border-top-right-radius: 999px; /* 右上角 */
    border-bottom-right-radius: 999px; /* 右下角 */
    border-bottom-left-radius: 999px; /* 左下角 */
    border-radius: 999px;
    border-radius: 50%;
}
.greenpoint::before {
    border: 2px solid #069e55;
}
.redpoint::before {
    border: 2px solid #ff2244;
}
.address-input {
    display: block;
    height: 100%;
    width: 100%; 
    padding: .45rem .4rem .44rem .8rem;
    border: none;
    border-radius: 0;
    font-size: .32rem;
    color: #333;
} 
.separate {
    border-bottom: 2px solid #e8e8e8;
    /*border-bottom: 10px solid red;*/
}
.tangram-suggestion-main {
    display: none !important;
}
</style>
