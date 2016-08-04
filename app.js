"use strict";function Chart(t){var e,r,a,n=this;this.create=function(r,s){google.charts.setOnLoadCallback(function(){function i(t){for(var e="",r=0;r<t.length;r++){var a=t[r].toString().replace(/"/g,'""');a.search(/("|,|\n)/g)>=0&&(a='"'+a+'"'),e+=r>0?","+a:a}return e+"\n"}for(var o="",l=0,d=r.length,u=new Array(d+1);l<d;l++){var c=r[l],h=c[1]/total*100,g=[c[0],h],f=[c[0],h,c[1]];u[l+1]=g,o+=i(f)}n.csvStr=o,n.csvBlob=new Blob([o],{type:"text/csv;charset=utf-8;"}),u[0]=["","Tag %"],e=google.visualization.arrayToDataTable(u),t.style.height=28*d+"px",a||(a=new google.charts.Bar(t)),a.draw(e,{bars:"horizontal"}),$("#comment-chart").html("<small>Question: "+s.question+"<br>Total answers: "+s.total+"</small><br><br>")})},this.update=function(){clearTimeout(r),r=setTimeout(function(){a&&a.draw(e,{bars:"horizontal"})},100)}}function SimpleTable(t){this.create=function(e){for(var r="",a=0,n=e.length;a<n;a++){var s=e[a];r+="<tr><td>"+s[0]+"</td><td>"+(100*s[1]/total).toFixed(2)+"%</td><td>"+s[1]+"</td></tr>"}t.innerHTML='<table class="table table-striped table-bordered table-hover"><thead class="thead-default"><tr><th>Tag</th><th>%</th><th>Answers</th></tr></thead><tbody>'+r+"</tbody></table>"}}function Table(t){function e(t){return(100*t/total).toFixed(2)}function r(t){for(var r="",a=0,n=t.length;a<n;a++){var s,i,l=t[a];if(c&&(s=l[2])){o||(s=s.split(","),l[2]=s,l[3]=l[3].split(",")),i="<ul>";for(var d=0,u=s.length;d<u;d++)i+="<li draggable=true>"+s[d]+"</li>";i+="</ul>"}else i="";r+='<tr ondragover="return false"><td draggable=true><input type=checkbox></td><td><span draggable=true>'+l[0]+"</span>"+i+"</td><td draggable=true>"+e(l[1])+"%</td><td draggable=true>"+l[1]+"</td><td></td></tr>"}return r}function a(){l=t.querySelector("thead input"),l.onchange=function(){for(var t=o.children,e=this.checked,r=0,a=t.length;r<a;r++)visibleTerms[r]&&(t[r].children[0].children[0].checked=e)}}function n(){function e(t,e){var r=e?$(t).closest("tr")[0]:t,a=Array.prototype.slice.call(o.children);return a.indexOf(r)}var r,a,n=t.children[0];o.addEventListener("dragstart",function(t){window.getSelection?window.getSelection().removeAllRanges():document.selection&&document.selection.empty();var r=t.target,a=t.dataTransfer;return!!(r instanceof HTMLElement&&r.draggable)&&(a.setData("index",e(r,!0)),"LI"===r.tagName&&a.setData("html",r.innerHTML),a.setData("isSynonym","LI"===r.tagName?"1":""),a.setData("isTagsTable",c?"1":""),$(o).find("input:checked").css("outline","4px solid rgba(0, 0, 255, 0.2)"),void(Table.startElem=$(r).closest("[ondragover]")[0]))}),n.addEventListener("dragenter",function(t){var e=t.target;a&&a.contains(e)||(a&&(r.style.background="",r.style.outline="",a=void 0),Table.startElem.contains(e)||(e=$(e).closest("[ondragover]")[0],e&&(a=e,r="THEAD"===e.tagName?e.parentNode:c?e:e.parentNode.parentNode,r.style.background="rgba(0, 0, 255, 0.1)",r.style.outline="2px solid blue"))),l.checked=!1,t.stopPropagation()}),document.addEventListener("dragenter",function(){a&&(r.style.background="",r.style.outline="",a=void 0)}),n.addEventListener("drop",function(t){var n=$(t.target).closest("[ondragover]")[0],s=t.dataTransfer,i={index:+s.getData("index"),html:s.getData("html"),isSynonym:s.getData("isSynonym"),isTagsTable:s.getData("isTagsTable")},o={index:"TR"===n.tagName&&e(n),isRow:"TR"===n.tagName,isTagsTable:c};a&&(r.style.background="",r.style.outline=""),$(n).closest("thead").length&&(o.target="THEAD"),angular.element(u).scope().ctrl.dragTag(i,o)})}function s(){o.addEventListener("click",function(e){var r=e.target;if("SPAN"===r.tagName||"LI"===r.tagName){var a=r.innerHTML;r.innerHTML='<input value="'+a+'">';var n=r.children[0];n.focus(),n.onblur=function(){if(n.value&&a!==n.value){var e=Array.prototype.slice.call(o.children),s=e.indexOf($(r).closest("tr")[0]);angular.element(u).scope().ctrl.updateTag(t.id,s,r.tagName,n.value,a)}r.innerHTML=n.value},n.onkeyup=function(t){13!=t.keyCode&&27!=t.keyCode||this.blur()}}})}function i(){t.children[0].addEventListener("click",function(t){var e=t.target.parentNode;if("TR"===e.tagName&&e.children[4]===t.target){var r=Array.prototype.slice.call(o.children),a=r.indexOf(e);angular.element(u).scope().ctrl.deleteLine(a,c)}})}var o,l,d=!0,u=document.getElementById("logged-in"),c="tags-table"===t.id;this.create=function(e,l){return o&&!l?void this.update(e):(o=null,t.innerHTML='<table class="table table-striped table-bordered table-hover"><thead class="thead-default" ondragover="return false"><tr><th colspan=5><b>'+(c?"Used tags and synonyms":"Unused stuff")+"</b></th></tr><tr><th><input type=checkbox></th><th>"+(c?"Tag":"Term")+"</th><th colspan=3>Answers</th></tr><tr><th colspan=5>"+(c?"Drop on header to create a tag, drop on tag to create synonym":"Drag here to exclude. You can drag multiple by selecting the checkboxes")+"</th></tr></thead><tbody>"+r(e)+"</tbody></table>",o=t.getElementsByTagName("tbody")[0],a(),n(),s(),void i())},this.selectedIndexes=function(){for(var t=[],e=o.children,r=0,a=e.length;r<a;r++)visibleTerms[r]&&e[r].children[0].children[0].checked&&t.push(r);return t},this.filter=function(t,e){var r,a,n=o.children;if(e.length>1){for(var s=0,i=t.length;s<i;s++)a=t[s][0].indexOf(e)!==-1,r=n[s],a!=visibleTerms[s]&&(r.style.display=a?"table-row":"none"),visibleTerms[s]=a,d&&(r.children[0].children[0].checked=!1);l.checked=!1,d=!1}else{for(s=0,i=t.length;s<i;s++)visibleTerms[s]||(n[s].style.display="table-row");visibleTerms=new Array(total).fill(!0),d=!0}},this.updatePerc=function(t){for(var r=o.children,a=0,n=r.length;a<n;a++)r[a].children[2].innerHTML=e(t[a][1])+"%"},this.update=function(t){o.innerHTML="",this.addRows(t)},this.addRow=function(t){$(o).prepend(r([t]))},this.addRows=function(t){$(o).prepend(r(t))},this.addSubTerm=function(t,r,a){var n=o.children[t],s=$(n),i=s.find("ul"),l="<li draggable=true>"+r+"</li>";i.length?i.append(l):s.find("span").after("<ul>"+l+"</ul>"),n.children[2].innerHTML=e(a)+"%",n.children[3].innerHTML=a},this.addSubTerms=function(t,e){var r=$(o.children[t]).find("ul"),a=e.join("</li><li draggable=true>");r.append("<li draggable=true>"+a+"</li>")},this.deleteSubTerm=function(t,r,a){var n=o.children[t],s=n.children[1].children[1];s.removeChild(s.children[r]),n.children[2].innerHTML=e(a)+"%",n.children[3].innerHTML=a},this.deleteRow=function(t){o.removeChild(o.children[t])}}function alreadyLoggedIn(){$("#logged-out").hide();var t=$("#logged-in").show();angular.bootstrap(t[0],["app"])}var app=angular.module("app",[]).config(["$httpProvider",function(t){function e(t){!document.hidden&&r&&(bootstrapAlert(t),r=!1,setTimeout(function(){r=!0},2e4))}var r=!0,a=navigator.userAgent,n=a.indexOf("MSIE ");n!==-1?n=parseInt(a.split("MSIE ")[1]):a.match(/trident.*rv\:11\./)&&(n=11),n!==-1&&(document.documentElement.className="ie"+n,n<10&&bootstrapAlert("You are using Internet Explorer "+n+". Sorry, but we are only supporting Internet Explorer 10 and above. Chrome, Firefox and Safari are also supported.")),window.onbeforeunload=function(){r=!1},t.defaults.headers.common.Authorization=xsrfToken,t.interceptors.push(["$q","$injector",function(t,a){function n(n,i){if(s<16){s++;var o=a.get("$timeout");return o(function(){var t=a.get("$http");return t(n)},600*s)}if(r){e(i===-1?"Oops, it seems you have lost internet connection":"Wow, the server is experiencing overload. Could you please try in a minute?"),s=0;var l=t.defer();return l.reject(),l.promise}}var s=0;return{response:function(e){return e||t.when(e)},responseError:function(e){switch(e.status){case 401:case 403:bootstrapAlert(e.data);break;case-1:if(e.status===-1&&e.config.timeout)break;return n(e.config,e.status)}return t.reject(e)}}}])}]);app.directive("customOnChange",function(){return{restrict:"A",link:function(t,e,r){var a=t.$eval(r.customOnChange);e.bind("change",a)}}}),window.google.charts.load("44",{packages:["bar"]}),app.controller("dashboard",["model","surveys","$rootScope","$q",function(t,e,r,a){function n(t){return document.getElementById(t)}function s(t){u.navigate("tags"),u.filterTerm="",u.filterMax(!0),$("#tags-question").html(t)}function i(e,r){var a;if(e.isTagsTable)if(r.isTagsTable){if(e.index===r.index)return!1;if(r.isRow)e.isSynonym?(a=t.deleteSubTerm(e.index,e.html),t.addSubTerm(r.index,a[0],a[1])):(t.addSubTerms(e.index,r.index),t.deleteTag(e.index));else{if(!e.isSynonym)return!1;a=t.deleteSubTerm(e.index,e.html),t.addTag(a)}}else e.isSynonym?a=t.deleteSubTerm(e.index,e.html):(a=t.tagsArr[e.index],a[2]&&t.addTerms(a),t.deleteTag(e.index)),t.addTerm(a);else{if(!r.isTagsTable)return!1;a=t.termsArr[e.index],t.deleteTerm(e.index),r.isRow?t.addSubTerm(r.index,a[0],a[1]):t.addTag(a)}o()}function o(){clearTimeout(g),g=setTimeout(function(){l&&!c?(u.surveys[l].total=total,t.overwriteSurvey(l)):(c=!1,t.saveNewSurvey().then(function(r){l=r,e.add(t.surveyId,t.surveyData)}))},600)}var l,d,u=this,c=!1,h=new Chart(n("tags-chart"));t.tagsTable=new Table(n("tags-table")),t.termsTable=new Table(n("terms-table")),this.maxTags=10,e.load().success(function(){$("#loading").remove(),u.navigate("surveys"),u.surveys=e.surveys}),window.addEventListener("resize",function(){"chart"===d&&h.update()},100),this.navigate=function(r){if("surveys"!==r&&!t.tagsArr&&!l)return void alert("Nothing to display, survey not loaded yet");if(d&&(n("btn-"+d).classList.remove("active"),n(d).style.display="none"),n("btn-"+r).classList.add("active"),n(r).style.display="block",d=r,"chart"===r){h.create(t.tagsArr,e.surveys[l]);var a=new SimpleTable(n("chart-table"));a.create(t.tagsArr)}},this.filterMax=function(e){this.minRepeat=t.splitMax(this.maxTags,e),o()},this.filterMin=function(){this.maxTags=t.splitMin(this.minRepeat),o()},this.loadSurvey=function(r){l=r,this.filterTerm="",this.navigate("tags"),$("#tags-question").html(e.surveys[l].question),total=+e.surveys[r].total,t.getTagsBySurveyId(r).success(function(){t.tagsTable.create(t.tagsArr,!0),u.maxTags=t.tagsArr.length,u.minRepeat=t.tagsArr[u.maxTags-1][1]}),t.getTermsBySurveyId(r).success(function(){t.termsTable.create(t.termsArr,!0)})},this.duplicateSurvey=function(r){this.loadSurvey(r),t.surveyData=e.surveys[r],c=!0},this.uploadFile=function(r){var a=r.target.files[0];if(a&&!a.$error){var n=new FileReader;n.onload=function(r){var a=XLS.read(r.target.result,{type:"binary"}),n=a.Sheets.Overview,i=e.findByGoogleId(n.A2.w),o="Survey with this id has already been uploaded. Do you want to overwrite existing one or add as a new survey?";i!==-1?bootstrapConfirm(o,"Add as new","Overwrite",function(e){l=2===e?i:void 0,s(t.initByExcel(a))}):(l=void 0,s(t.initByExcel(a)))},n.readAsBinaryString(a)}},this.addTags=function(){var e=[];this.bulkAdd.toLowerCase().split(",").forEach(function(t){var r=t.trim();r.length&&e.push([r,0])}),this.bulkAdd="",t.addTags(e),t.tagsTable.update(t.tagsArr),o()},this.updateTag=function(){t.updateTag.apply(t,arguments),o()},this.deleteLine=function(e,r){r?(total-=t.tagsArr[e][1],t.deleteTag(e)):(total-=t.termsArr[e][1],t.deleteTerm(e)),t.tagsTable.updatePerc(t.tagsArr),t.termsTable.updatePerc(t.termsArr),o()},this.dragTag=function(e,r){var a=e.isTagsTable?t.tagsTable:t.termsTable,n=a.selectedIndexes(),s=n.length;if(s)for(var o={isTagsTable:e.isTagsTable,isSynonym:!1};s--;)o.index=n[s],i(o,r);else i(e,r)},this.sort=function(){t.sort(t.termsArr),setTimeout(function(){t.termsTable.update(t.termsArr)},0)},this.filterTerms=function(){t.filterTerms(this.filterTerm)};var g;this.downloadCsv=function(){var t="tags_"+e.surveys[l].survey_google_id+".csv";if(navigator.msSaveBlob)navigator.msSaveBlob(h.csvBlob,t);else{var r=document.createElement("a");if(void 0!==r.download){var a=URL.createObjectURL(h.csvBlob);r.setAttribute("href",a),r.setAttribute("download",t),r.style.visibility="hidden",document.body.appendChild(r),r.click(),setTimeout(function(){document.body.removeChild(r)},1e4)}else{var n=window.open("","","");n.document.write('<meta name=content-type content=text/csv><meta name=content-disposition content="attachment;  filename='+t+'">  '),n.document.write(h.csvStr)}}},this.deleteSurveyById=function(t){confirm("Do you really want to delete this survey and all its data?")&&(e["delete"](t),t===l&&($("tr[ondragover]").remove(),$("#tags-chart").html("")))},this.logOut=function(){a.all([t.logOut(),gapi.auth2.getAuthInstance().signOut()]).then(function(){location.reload()})}}]);var total,visibleTerms;app.service("model",["$http",function(t){function e(){for(var t=0,e=n.tagsArr,r=e.length,a=new Array(r);t<r;t++){var s=e[t];a[t]=s.slice(0,2),s[2]&&(a[t].push(s[2].join(",")),a[t].push(s[3].join(",")))}return a}function r(t){var e=[];for(var r in t)e.push([r,t[r]]);return n.sort(e)}function a(){for(var t=n.termsArr,e=0,r=t.length;e<r;e++)if(t[e][2]){for(var a=t[e],s=a[2],i=a[3],o=0,l=s.length;o<l;o++)n.termsArr.push([s[o],i[o]]);a.splice(2,2)}}var n=this,s="api/tags.php";this.initByExcel=function(t){try{for(var e,a=t.Sheets["Complete responses"],n=t.Sheets.Overview,s={},i=2;e=a["K"+i];){for(var o=e.w.trim().toLowerCase().split(/ and | or | - | but |\.|,|;|:|\?|!|&+/),l=0,d=o.length;l<d;l++){var u=o[l].trim();u.length&&(s[u]?s[u]++:s[u]=1)}i++}this.tagsArr=r(s),this.termsArr=[];var c=n.C2.w,h=+n.E2.w;this.surveyData={survey_google_id:n.A2.w,question:c,total:h},total=h,visibleTerms=new Array(total).fill(!0)}catch(g){bootstrapAlert("Could not parse answers from Excel file")}return c},this.getTagsBySurveyId=function(e){return t.get(s+"?tags&surveyId="+e).success(function(t){n.tagsArr=t})},this.getTermsBySurveyId=function(e){return t.get(s+"?terms&surveyId="+e).success(function(t){n.termsArr=t,visibleTerms=new Array(total).fill(!0)})},this.saveNewSurvey=function(){return t.post(s,{survey_google_id:this.surveyData.survey_google_id,question:this.surveyData.question,tagsArr:e(this.tagsArr),termsArr:this.termsArr,total:total}).then(function(t){return n.surveyId=t.data})},this.overwriteSurvey=function(r){return t.put(s,{surveyId:r,tagsArr:e(n.tagsArr),termsArr:this.termsArr,total:total})},this.addTag=function(t){this.tagsArr.unshift(t),this.tagsTable.addRow(t)},this.addTags=function(t){total+=t.length,this.tagsArr=t.concat(this.tagsArr),this.tagsTable.addRows(t)},this.addSubTerm=function(t,e,r){var a=this.tagsArr[t];a[2]?(a[2].push(e),a[3].push(r)):(a.push([e]),a.push([r])),a[1]+=+r,this.tagsTable.addSubTerm(t,e,a[1])},this.addSubTerms=function(t,e){var r=this.tagsArr[t],a=this.tagsArr[e],n=r[2];this.addSubTerm(e,r[0],r[1]),n&&(a[2]=a[2].concat(n),a[3]=a[3].concat(r[3]),this.tagsTable.addSubTerms(e,n))},this.addTerm=function(t){this.termsArr.unshift(t),this.termsTable.addRow(t)},this.addTerms=function(t){for(var e=[],r=0,a=t[2],n=t[3],s=0,i=a.length;s<i;s++)r+=+n[s],e.push([a[s],n[s]]);t[1]-=r,this.termsArr=e.concat(this.termsArr),this.termsTable.addRows(e)},this.deleteTag=function(t){this.tagsArr.splice(t,1),this.tagsTable.deleteRow(t)},this.deleteSubTerm=function(t,e){var r=this.tagsArr[t],a=r[2],n=a.indexOf(e),s=[e,r[3][n]];return a.splice(n,1),r[1]-=r[3][n],r[3].splice(n,1),this.tagsTable.deleteSubTerm(t,n,r[1]),s},this.deleteTerm=function(t){this.termsArr.splice(t,1),this.termsTable.deleteRow(t)},this.updateTag=function(t,e,r,a,n){if("tags-table"===t)if("SPAN"===r)this.tagsArr[e][0]=a;else{var s=this.tagsArr[e][2];s[s.indexOf(n)]=a}else this.termsArr[e][0]=a},this.sort=function(t){function e(t,e){return t[1]>e[1]?-1:t[1]<e[1]?1:0}return t.sort(e)},this.splitMax=function(t,e){var r=this.tagsArr.concat(this.termsArr);return t=Math.min(t,r.length),this.sort(r),this.tagsArr=r.slice(0,t),this.termsArr=r.slice(t),a(),this.tagsTable.create(this.tagsArr,e),this.termsTable.create(this.termsArr,e),this.tagsArr[t-1][1]},this.splitMin=function(t){var e=this.tagsArr.concat(this.termsArr),r=0,n=e.length;for(this.sort(e);r<n&&e[r][1]>=t;)r++;return this.tagsArr=e.slice(0,r),this.termsArr=e.slice(r),a(),this.tagsTable.create(this.tagsArr),this.termsTable.create(this.termsArr),r},this.filterTerms=function(t){this.termsTable.filter(this.termsArr,t)},this.logOut=function(){return t.post("api/login.php",{logout:xsrfToken})}}]),app.service("surveys",["$http",function(t){var e=this,r="api/surveys.php";this.load=function(){return t.get(r).success(function(t){e.surveys=t})},this.add=function(t,e){this.surveys[t]=e},this["delete"]=function(a){return t["delete"](r+"?surveyId="+a).success(function(){delete e.surveys[a]})},this.findByGoogleId=function(t){for(var e in this.surveys)if(this.surveys[e].survey_google_id===t)return e;return-1}}]),function(){function t(t){t.addClass("in").show(),t.find("button").on("click",function(){t.removeClass("in"),setTimeout(function(){t.remove()},300)})}var e='<div class="modal fade"><div class=modal-dialog><div class=modal-content><div class=modal-body><button class=close data-dismiss=modal>&times;</button><br>',r="</div></div></div></div>";window.bootstrapAlert=function(a){$("#modal-placeholder").append(e+a+'<br><button class="btn btn-sm btn-primary center-block m-t-1 p-x-3" data-dismiss=modal>Ok</button>'+r);var n=$(".modal");t(n),n.find(".btn-primary").focus()},window.bootstrapConfirm=function(a,n,s,i){$("#modal-placeholder").append(e+a+'<br><button class="btn btn-sm btn-primary pull-xs-right m-l-2 m-y-1" data-dismiss=modal>&nbsp; '+n+' &nbsp;</button><button class="btn btn-sm btn-secondary pull-xs-right m-y-1" data-dismiss=modal>&nbsp; '+s+' &nbsp;</button><br class="clearfix"><br><br>'+r);var o=$(".modal");t(o),o.find(".btn-primary").on("click",function(){i(1)}).focus(),o.find(".btn-secondary").on("click",function(){i(2)})}}(),window.googleUser&&logIn(googleUser),window.xsrfToken&&alreadyLoggedIn();