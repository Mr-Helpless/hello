// ==UserScript==
// @name         New Userscript_test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zwyy.qdexam.com/www/index.html?_r=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qdexam.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head > ul:nth-child(2)").style="height: 3rem;"
var my_html=`
					<li class="col v-t" style="width:auto; padding-left: 5px;">
						<!--只能预约座位-->
						<a class="btn btn-opatiy btn-conner has-icon c-b" style="width: 100%;text-align: center" ng-show="buildingReservationType!=1" onclick="window.myCheckIn();" href="javaScript:void(0);"><img align="absmiddle" src="img/port.png">签到</a>
						<!--能预约座位，也能预约入馆办事-->
						<a class="btn btn-opatiy btn-conner has-icon c-b ng-hide" style="width: 100%;text-align: center" ng-click="reservationShow();" href="javaScript:void(0);"><img align="absmiddle" src="img/ion-clock.png">我要预约</a>
					</li>
					<li class="col t-r v-t" style="padding-left: 5px;">
						<a class="btn btn-opatiy btn-conner has-icon c-b" style="width: 100%;text-align: center" onclick="window.extendDay();" href="javaScript:void(0);"><img align="absmiddle" src="img/edit.png">续约</a>
					</li>
				`
var dom=document.createElement('ul');
dom.className="row"
dom.style="height: 3rem;"
dom.innerHTML=my_html
document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head").appendChild(dom)

//删除原有标签
document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head > ul:nth-child(2)").remove()



//签到模块
var myCheckIn=function (){

    var Reservation=window.Api.selectReservationByUser()
    if(Reservation.list.length==0){
       console.log("没有预约请先预约再签到")
    }else{

        var frist_reseveation=Reservation.list[0]

        if(frist_reseveation.notArrive==1){
            var Reservation_seatId=frist_reseveation.seatId

            var result_json=window.Api.checkInSeat(Reservation_seatId)

            var OUT_TEXT=JSON.stringify(result_json.success)+"\t"+
                    JSON.stringify(result_json.message)
            var tag=1
            if(result_json.message=='0') {
                OUT_TEXT+="\t签到时间未到"
            }else if(result_json.message=='3') {
                OUT_TEXT+="\t重复签到"
            }
        }else{
            console.log("已经签到不用签到")
        }
    }
}


//续约模块
var extendDay =function () {

    var tomain = function () {
        var Reservation=window.Api.selectReservationByUser()
        //var last_reseveation=Reservation.list[Reservation.list.length-1]
        //var Reservation_ID=last_reseveation.reservationId
        var Reservation_ID=window.Api.selectReservation(0,1,10).lists[0].id

        var day_num=2
        var date_day=new Date(new Date().getTime()+day_num*24*60*60*1000).Format("yyyy-MM-dd")
        var Frist_time=date_day+' 09:00:00'
        var End_time=date_day+' 22:00:00'
        var go=true
        var target_time=Frist_time.slice(0,-3)+" - "+End_time.slice(0,-3)
        var Reservation_time_list=document.querySelectorAll("body li > p.item-time.ng-scope ")
        var tmp_time_timeDay=""
        for (let index = 0; index < Reservation.list.length; index++) {
            tmp_time_timeDay=Reservation.list[index].timeDay
            if(tmp_time_timeDay==target_time){go=false}
        }
        if(go){
        	var result_json=window.Api.extendSeatTimeDay(Reservation_ID,End_time,Frist_time)
        	// confirm(Reservation_ID+" "+Frist_time+" "+End_time)
        	confirm(JSON.stringify(result_json.success)+"\t"+
                JSON.stringify(result_json.message)
               )
        }else{
            confirm("预约已成功")
        }
        //刷新
        location.reload();
    }
    if (typeof window.myuse === "undefined") {
        console.log("window.myuse is undefined");
        window.myuse=true
       // alert(window.myuse)
        tomain()
    }else {
        console.log(window.myuse);
        // window.use=true
    }
}



})();
