(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,i){e.exports=i(20)},16:function(e,t,i){},18:function(e,t,i){},20:function(e,t,i){"use strict";i.r(t);var n=i(0),a=i.n(n),r=i(2),s=i.n(r),o=(i(16),i(18),i(7)),c=i(6),l=i(3),u=i(4),m=i(8),d=i(5),h=i(9),v=function(e){var t=parseInt(60*e%60);return(e=parseInt(~~e))+"h "+t+"m "},g=function(e){function t(e){var i;return Object(l.a)(this,t),(i=Object(m.a)(this,Object(d.a)(t).call(this,e))).deleteActivities=function(){window.confirm("Are you sure to delete activity?")&&i.setState(function(e){return{activities:[]}})},i.addActivity=function(){return 0===i.state.newActivityDescription.length?alert("Insert description first."):0===i.state.newActivityTime?alert("Insert time first in proper format."):i.getTimeAvailable()-i.state.newActivityTime<0?alert("You went over 24h time!"):void i.setState(function(e){return{activities:[].concat(Object(c.a)(e.activities),[{id:e.activities.length,description:e.newActivityDescription,isDone:!1,time:i.state.newActivityTime,timeString:v(i.state.newActivityTime)}]),newActivityTimeString:"0h 0m"}})},i.deleteActivity=function(e){window.confirm("Are you sure to delete activity?")&&i.setState(function(t){return{activities:t.activities.filter(function(t){return t.id!==e.id})}})},i.getActivitesTimeSum=function(){if(0===i.state.activities.length)return 0;var e=0;return i.state.activities.forEach(function(t){e+=t.time}),e},i.getTimeAvailable=function(){return 24-i.state.sleepHours-i.getActivitesTimeSum()},i.getTimeUsed=function(){return i.state.sleepHours+i.getActivitesTimeSum()},i.getProgressBarStatus=function(){return~~(i.getTimeUsed()/24*100)},i.handleNewActivityTime=function(e){i.setState({newActivityTimeString:e}),i.setState({newActivityTime:i.parseTimeStringToHourFloat(e)})},i.state={sleepHours:6,newActivityTime:"",newActivityTimeString:"0h 0m",newActivityDescription:"Your activity description...",happyNotes:localStorage.getItem("happyNotes")||"",sadNotes:localStorage.getItem("sadNotes")||"",activities:JSON.parse(localStorage.getItem("activities"))||[]},i}return Object(h.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this;setInterval(function(){localStorage.setItem("activities",JSON.stringify(e.state.activities))},1e3)}},{key:"getTimeFromStrings",value:function(e,t,i){return e&&((e=e.toLowerCase()).includes("h")&&(t=Number(e.split("h")[0])),e.includes("m")&&(i=Number(e.split("m")[0]))),{hours:t,minutes:i}}},{key:"parseTimeStringToHourFloat",value:function(e){var t=e.split(" "),i=Object(o.a)(t,2),n=i[0],a=i[1],r=0,s=0,c={hours:0,minutes:0};return r=(c=this.getTimeFromStrings(n,r,s)).hours,s=c.minutes,(r=(c=this.getTimeFromStrings(a,r,s)).hours)+(s=c.minutes)/60}},{key:"changeHappyNotes",value:function(e){this.setState({happyNotes:e}),localStorage.setItem("happyNotes",e)}},{key:"changeSadNotes",value:function(e){this.setState({sadNotes:e}),localStorage.setItem("sadNotes",e)}},{key:"render",value:function(){var e=this,t=this.getProgressBarStatus(),i=t<80?"light-blue":t<95?"progress-bar-warning":"progress-bar-danger";return a.a.createElement("div",{className:"container-fluid"},a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"col-md-8"},a.a.createElement("header",null,a.a.createElement("h1",null,"Manage your day")),a.a.createElement("label",null,"Your sleep hours"),a.a.createElement("input",{placeholder:"Sleep hours",className:"form-control input-sm",value:this.state.sleepHours,onChange:function(t){return e.setState({sleepHours:t.target.value})}}),a.a.createElement("label",null,"Add new activity"),a.a.createElement("div",{className:"flex-container"},a.a.createElement("input",{placeholder:"Time to spent (0h 0m)",type:"text",className:"form-control input-sm text-right",value:this.state.newActivityTimeString,style:{marginRight:5,width:"75px"},onChange:function(t){return e.handleNewActivityTime(t.target.value)}}),a.a.createElement("input",{placeholder:"Your activity description...",className:"form-control input-sm",style:{marginRight:5},value:this.state.newActivityDescription,onChange:function(t){return e.setState({newActivityDescription:t.target.value})},onKeyPress:function(t){"Enter"===t.key&&e.addActivity()}}),a.a.createElement("button",{className:"btn btn-sm dark-blue pull-right",onClick:this.addActivity,style:{marginLeft:5,marginBottom:10}},"Add activity")),a.a.createElement("p",null,"Available hours to use: ",v(this.getTimeAvailable())),a.a.createElement("div",{style:{width:"100%",marginTop:10},className:"progress"},a.a.createElement("div",{className:"progress-bar ".concat(i),"aria-valuenow":t,"aria-valuemin":"0","aria-valuemax":"100",style:{width:"".concat(t,"%")}},a.a.createElement("span",null,t,"% elapsed"))),a.a.createElement("div",{class:"col-md-12 col-xs-12 no-pm"},a.a.createElement("h3",{class:"activities-title"},"Activities (",this.state.activities.filter(function(e){return e.isDone}).length,"/",this.state.activities.length,")"),a.a.createElement("button",{className:"btn btn-sm btn-danger pull-right",onClick:this.deleteActivities,style:{marginLeft:5,marginBottom:10}},"Clear all activites")),a.a.createElement("ul",{className:"list-group"},this.state.activities.map(function(t,i){return a.a.createElement("li",{key:i,className:"list-group-item flex-container dark-bg"},a.a.createElement("input",{className:"activity-checkbox",type:"checkbox",checked:t.isDone,style:{marginRight:5},onChange:function(i){t.isDone=!t.isDone,e.setState({})}}),a.a.createElement("input",{placeholder:"Time",className:"form-control input-sm text-right",value:t.timeString,style:{marginRight:5,width:"75px"},onChange:function(i){t.timeString=i.target.value,t.time=e.parseTimeStringToHourFloat(i.target.value),e.setState({})}}),a.a.createElement("input",{placeholder:"Description",className:"form-control input-sm",defaultValue:t.description,style:{marginRight:5,width:"100%"},onChange:function(i){t.description=i.target.value,e.setState({})}}),a.a.createElement("button",{className:"btn btn-sm btn-danger pull-right",onClick:function(){return e.deleteActivity(t)}},a.a.createElement("i",{className:"fa fa-trash"})))}))),a.a.createElement("div",{className:"col-md-4"},a.a.createElement("h3",{class:"notes-title"},"Update these one at the end of your day to sum up your day"),a.a.createElement("div",null,a.a.createElement("label",null,"Happy notes ",a.a.createElement("span",{class:"fa fa-smile-beam"})," (describe here things that happened and made you happy)"),a.a.createElement("textarea",{placeholder:"Happy notes",className:"form-control input-sm",value:this.state.happyNotes,onChange:function(t){return e.changeHappyNotes(t.target.value)}})),a.a.createElement("div",null,a.a.createElement("label",null,"Sadness notes ",a.a.createElement("span",{class:"fa fa-frown"})," (describe here things that happened and made you sad/angry)"),a.a.createElement("textarea",{placeholder:"Sad notes",className:"form-control input-sm",value:this.state.sadNotes,onChange:function(t){return e.changeSadNotes(t.target.value)}}))))))}}]),t}(n.Component),p=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function f(e,t){navigator.serviceWorker.register(e).then(function(e){e.onupdatefound=function(){var i=e.installing;null!=i&&(i.onstatechange=function(){"installed"===i.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}}).catch(function(e){console.error("Error during service worker registration:",e)})}s.a.render(a.a.createElement(g,null),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/self-improver",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",function(){var t="".concat("/self-improver","/service-worker.js");p?(function(e,t){fetch(e).then(function(i){var n=i.headers.get("content-type");404===i.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then(function(e){e.unregister().then(function(){window.location.reload()})}):f(e,t)}).catch(function(){console.log("No internet connection found. App is running in offline mode.")})}(t,e),navigator.serviceWorker.ready.then(function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")})):f(t,e)})}}()}},[[10,2,1]]]);
//# sourceMappingURL=main.f714b457.chunk.js.map