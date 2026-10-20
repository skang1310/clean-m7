(function(){
'use strict';
var cache=null,cacheKey='cleanm7-weather-gaepo-v2';
try{
 var stored=JSON.parse(localStorage.getItem(cacheKey)||localStorage.getItem('cleanm7-weather-gaepo-v1'));
 if(stored&&typeof stored.temperature==='number')cache=stored;
}catch(e){}

function conditionInfo(code,day){
 var isDay=day!==false;
 if(code===0){
  return isDay
   ? {symbol:'☀',label:'맑음',kind:'clear-day',summary:'화창하고 맑은 하늘'}
   : {symbol:'☾',label:'맑음',kind:'clear-night',summary:'별이 보이는 맑은 밤하늘'};
 }
 if(code===1||code===2){
  return isDay
   ? {symbol:'⛅',label:code===1?'대체로 맑음':'구름 조금',kind:'partly-cloudy-day',summary:'구름 사이로 햇살이 비침'}
   : {symbol:'☁',label:code===1?'대체로 맑음':'구름 조금',kind:'partly-cloudy-night',summary:'구름이 조금 낀 밤하늘'};
 }
 if(code===3){
  return {symbol:'☁',label:'흐림',kind:'cloudy',summary:'하늘 전체에 구름이 많음'};
 }
 if(code===45||code===48){
  return {symbol:'≋',label:'안개',kind:'fog',summary:'시야가 흐린 안개 끼는 날씨'};
 }
 if((code>=71&&code<=77)||code===85||code===86){
  return {symbol:'❄',label:'눈',kind:'snow',summary:'눈이 내리는 겨울 날씨'};
 }
 if(code>=95){
  return {symbol:'ϟ',label:'뇌우',kind:'storm',summary:'천둥·번개를 동반한 강한 비'};
 }
 if((code>=51&&code<=67)||(code>=80&&code<=82)){
  return {symbol:'☂',label:code<=57?'이슬비':code>=80?'소나기':'비',kind:'rain',summary:'우산이 필요한 비 내리는 날씨'};
 }
 return {symbol:'☁',label:'흐림',kind:'cloudy',summary:'구름 많은 날씨'};
}

var uidCounter=0;
function svgIcon(code,day,size){
 var s=size||44,info=conditionInfo(code,day),k=info.kind,id='wx'+(++uidCounter);
 var defs='<defs>'
  +'<linearGradient id="'+id+'-sun" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFE875"/><stop offset="55%" stop-color="#FFAE19"/><stop offset="100%" stop-color="#FF7B00"/></linearGradient>'
  +'<linearGradient id="'+id+'-moon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F8FAFC"/><stop offset="60%" stop-color="#BAE6FD"/><stop offset="100%" stop-color="#60A5FA"/></linearGradient>'
  +'<linearGradient id="'+id+'-cloud" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#CBD5E1"/></linearGradient>'
  +'<linearGradient id="'+id+'-darkcloud" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#94A3B8"/><stop offset="100%" stop-color="#475569"/></linearGradient>'
  +'<linearGradient id="'+id+'-rain" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#7DD3FC"/><stop offset="100%" stop-color="#0284C7"/></linearGradient>'
  +'</defs>';
 var body='';
 if(k==='clear-day'){
  body='<circle cx="32" cy="32" r="15" fill="url(#'+id+'-sun)"/>'
   +'<g stroke="#FFD43B" stroke-width="2.6" stroke-linecap="round">'
   +'<line x1="32" y1="6" x2="32" y2="11"/><line x1="32" y1="53" x2="32" y2="58"/>'
   +'<line x1="6" y1="32" x2="11" y2="32"/><line x1="53" y1="32" x2="58" y2="32"/>'
   +'<line x1="13.6" y1="13.6" x2="17.2" y2="17.2"/><line x1="46.8" y1="46.8" x2="50.4" y2="50.4"/>'
   +'<line x1="50.4" y1="13.6" x2="46.8" y2="17.2"/><line x1="17.2" y1="46.8" x2="13.6" y2="50.4"/>'
   +'</g>';
 }else if(k==='clear-night'){
  body='<path d="M39.5 13.5A16.5 16.5 0 1 0 51 39.5 13.5 13.5 0 0 1 39.5 13.5Z" fill="url(#'+id+'-moon)"/>';
 }else if(k==='partly-cloudy-day'){
  body='<circle cx="23" cy="23" r="11.5" fill="url(#'+id+'-sun)"/>'
   +'<path d="M22 48h23a10 10 0 0 0 1.2-19.9A13.5 13.5 0 0 0 20.5 24 11 11 0 0 0 22 48Z" fill="url(#'+id+'-cloud)"/>';
 }else if(k==='partly-cloudy-night'){
  body='<path d="M27 11A11.5 11.5 0 1 0 36 28.5 9.5 9.5 0 0 1 27 11Z" fill="url(#'+id+'-moon)"/>'
   +'<path d="M20 49h24a10 10 0 0 0 1.2-19.9A13.5 13.5 0 0 0 18.5 25 11 11 0 0 0 20 49Z" fill="url(#'+id+'-cloud)"/>';
 }else if(k==='cloudy'||k==='fog'){
  body='<path d="M25 38h21a8.5 8.5 0 0 0 1-16.9A11.5 11.5 0 0 0 24.5 17 9.5 9.5 0 0 0 25 38Z" fill="url(#'+id+'-darkcloud)"/>'
   +'<path d="M17 49h26a10.5 10.5 0 0 0 1.3-20.9A14 14 0 0 0 16.5 24 11.5 11.5 0 0 0 17 49Z" fill="url(#'+id+'-cloud)"/>';
 }else if(k==='rain'){
  body='<path d="M17 43h26a10 10 0 0 0 1.2-19.9A13.5 13.5 0 0 0 16.5 19 11 11 0 0 0 17 43Z" fill="url(#'+id+'-cloud)"/>'
   +'<g stroke="url(#'+id+'-rain)" stroke-width="3" stroke-linecap="round">'
   +'<line x1="22" y1="47" x2="18.5" y2="56"/><line x1="32" y1="47" x2="28.5" y2="56"/><line x1="42" y1="47" x2="38.5" y2="56"/>'
   +'</g>';
 }else if(k==='snow'){
  body='<path d="M17 42h26a10 10 0 0 0 1.2-19.9A13.5 13.5 0 0 0 16.5 18 11 11 0 0 0 17 42Z" fill="url(#'+id+'-cloud)"/>'
   +'<g fill="#E0F2FE"><circle cx="22" cy="50" r="2.6"/><circle cx="32" cy="54" r="2.6"/><circle cx="42" cy="50" r="2.6"/></g>';
 }else{
  body='<path d="M17 41h26a10 10 0 0 0 1.2-19.9A13.5 13.5 0 0 0 16.5 17 11 11 0 0 0 17 41Z" fill="url(#'+id+'-darkcloud)"/>'
   +'<polygon points="33,38 24,50 31,50 28,60 41,46 33.5,46" fill="#FACC15"/>';
 }
 return '<svg class="wx-svg" width="'+s+'" height="'+s+'" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+defs+body+'</svg>';
}

function sceneForWeather(code,day){
 var info=conditionInfo(code,day),k=info.kind,h=new Date().getHours();
 if(k==='clear-day'){
  if(h>=6&&h<11)return 'cf-valley';
  if(h>=16&&h<19)return 'cf-golden';
  return 'cf-cove';
 }
 if(k==='partly-cloudy-day')return 'cf-cove';
 if(k==='cloudy')return 'cf-peaks';
 if(k==='fog')return 'cf-forest';
 if(k==='rain')return 'cf-misty';
 if(k==='storm')return 'cf-bridge';
 if(k==='snow')return 'cf-summit';
 if(k==='clear-night')return 'cf-night';
 if(k==='partly-cloudy-night')return 'cf-sydney';
 return 'cf-misty';
}

function setFromForecast(raw){
 var d=raw&&raw.current?raw.current:raw;
 if(!d||typeof d.temperature_2m!=='number')return;
 cache={
  temperature:d.temperature_2m,
  apparent:typeof d.apparent_temperature==='number'?d.apparent_temperature:d.temperature_2m,
  humidity:typeof d.relative_humidity_2m==='number'?d.relative_humidity_2m:null,
  wind:typeof d.wind_speed_10m==='number'?d.wind_speed_10m:null,
  code:d.weather_code||0,
  wfKor:d.wfKor||'',
  day:d.is_day===1,
  time:d.time||Math.floor(Date.now()/1000),
  fetchedAt:Date.now(),
  humanBriefing:raw.humanBriefing||null,
  fullForecast:(raw.hourly&&raw.daily)?raw:null
 };
 try{localStorage.setItem(cacheKey,JSON.stringify(cache));}catch(e){}
}

window.cleanM7Weather={
 conditionInfo:conditionInfo,
 sceneForWeather:sceneForWeather,
 svgIcon:svgIcon,
 setFromForecast:setFromForecast,
 getCurrent:function(){return cache;}
};
}());
