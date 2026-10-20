(function(){
'use strict';
var CLEANM7_BRIDGE=(window.CLEANM7_CONFIG&&window.CLEANM7_CONFIG.bridgeUrl||'http://127.0.0.1:18766').replace(/\/$/,'');
var api=window.cleanM7;if(!api)return;document.body.classList.add('enhanced');

// 17 Official Themes from https://github.com/nthnclrk/CleanFrame (15 Gallery Wallpapers + CleanFrame Dark & Light)
var CLEANFRAME_SCENES=[
 ['cf-misty','Misty Coast · 안개 해안','CleanFrame 대표 · 안개 낀 해안 절벽 (Ganapathy Kumar)','themes/cleanframe/misty-thumb.jpg','themes/cleanframe/misty.jpg','cleanframe','light',0.20,'📍 Big Sur Coast, California · Ganapathy Kumar'],
 ['cf-cove','Quiet Cove · 고요한 만','잔잔한 에메랄드 해변 만 (Joshua Wordel)','themes/cleanframe/cove-thumb.jpg','themes/cleanframe/cove.jpg','cleanframe','light',0.12,'📍 Navagio Cove, Greece · Joshua Wordel'],
 ['cf-forest','Forest Mist · 안개 숲','새벽 안개가 자욱한 침엽수림 (Dejan Zakic)','themes/cleanframe/forest-thumb.jpg','themes/cleanframe/forest.jpg','cleanframe','dark',0.12,'📍 Tara National Forest · Dejan Zakic'],
 ['cf-valley','Mountain Valley · 마운틴 밸리','웅장한 협곡과 아침 빛 (Aniket Deole)','themes/cleanframe/valley-thumb.jpg','themes/cleanframe/valley.jpg','cleanframe','dark',0.12,'📍 Yosemite Valley, California · Aniket Deole'],
 ['cf-night','Desert Stars · 사막의 별밤','은하수가 쏟아지는 사막의 밤하늘 (Mohammad Alizade)','themes/cleanframe/night-thumb.jpg','themes/cleanframe/night.jpg','cleanframe','light',0.20,'📍 Atacama Starry Desert · Mohammad Alizade'],
 ['cf-peaks','Blue Peaks · 푸른 설산','차분한 블루 톤의 고산 봉우리 (John Rodenn Castillo)','themes/cleanframe/peaks-thumb.jpg','themes/cleanframe/peaks.jpg','cleanframe','dark',0.36,'📍 Mount Cook National Park · John Rodenn Castillo'],
 ['cf-bridge','Bridge at Dusk · 황혼의 대교','노을빛이 내려앉은 해안 대교 (Justin Wolff)','themes/cleanframe/bridge-thumb.jpg','themes/cleanframe/bridge.jpg','cleanframe','dark',0.44,'📍 Golden Gate Strait, California · Justin Wolff'],
 ['cf-ridge','Sunlit Ridges · 햇살 능선','따스한 햇살이 스치는 산맥 능선 (Cristina Gottardi)','themes/cleanframe/ridge-thumb.jpg','themes/cleanframe/ridge.jpg','cleanframe','dark',0.12,'📍 Dolomites Alpine Ridges, Italy · Cristina Gottardi'],
 ['cf-golden','Golden Hour · 골든 아워','황금빛 노을로 물든 수평선 (Karthik Sreenivas)','themes/cleanframe/golden-thumb.jpg','themes/cleanframe/golden.jpg','cleanframe','dark',0.30,'📍 Indian Ocean Golden Horizon · Karthik Sreenivas'],
 ['cf-summit','Sunlit Summits · 빛나는 설봉','구름 위로 솟은 황금빛 고봉 (Rudra Gupta)','themes/cleanframe/summit-thumb.jpg','themes/cleanframe/summit.jpg','cleanframe','dark',0.20,'📍 Himalayan Sunset Summit · Rudra Gupta'],
 ['cf-goldcoast','Gold Coast Dusk · 골드코스트','파스텔 황혼의 해변 스카이라인 (City of Gold Coast)','themes/cleanframe/goldcoast-thumb.jpg','themes/cleanframe/goldcoast.jpg','cleanframe','light',0.20,'📍 Surfers Paradise, Gold Coast · City of Gold Coast'],
 ['cf-sydney','Sydney Harbour · 시드니 하버','잔잔한 항구와 도시의 윤슬 (Caleb)','themes/cleanframe/sydney-thumb.jpg','themes/cleanframe/sydney.jpg','cleanframe','light',0.44,'📍 Sydney Harbour, Australia · Caleb'],
 ['cf-amber','Amber Hills · 앰버 힐스','따뜻한 앰버 톤의 구릉 풍경 (Chris Barbalis)','themes/cleanframe/amber-thumb.jpg','themes/cleanframe/amber.jpg','cleanframe','light',0.20,'📍 Tuscany Rolling Hills, Italy · Chris Barbalis'],
 ['cf-mint','Mint Wave · 민트 웨이브','미니멀 추상 민트 그라데이션 (MagicPattern)','themes/cleanframe/mint-thumb.jpg','themes/cleanframe/mint.jpg','cleanframe','light',0.44,'🎨 Minimalist Waveform Art · MagicPattern'],
 ['cf-alpine','Alpine Glow · 알파인 글로우','분홍빛 노을이 비치는 알프스 설산 (Cristina Gottardi)','themes/cleanframe/alpine-thumb.jpg','themes/cleanframe/alpine.jpg','cleanframe','light',0.20,'📍 Seceda Alpine Glow, Italy · Cristina Gottardi'],
 ['cf-dark','CleanFrame Dark · 딥 슬레이트','CleanFrame 솔리드 다크 배경 (#1d2a30)','themes/cleanframe/peaks-thumb.jpg','','cleanframe','dark',0.20,'🎨 CleanFrame Deep Slate Palette'],
 ['cf-light','CleanFrame Light · 갤러리 라이트','CleanFrame 웜 화랑 페이퍼 배경 (#e7e5df)','themes/cleanframe/misty-thumb.jpg','','cleanframe','light',0.24,'🎨 CleanFrame Warm Gallery Palette']
];

var ALL_SCENES=CLEANFRAME_SCENES;

function getSceneMeta(id){
 for(var i=0;i<ALL_SCENES.length;i++){
  if(ALL_SCENES[i][0]===id){
   var s=ALL_SCENES[i];
   return {id:s[0],name:s[1],desc:s[2],thumb:s[3],full:s[4],group:'cleanframe',tone:s[6]||'dark',frostVeil:s[7]||0.2,location:s[8]||''};
  }
 }
 var def=ALL_SCENES[0];
 return {id:def[0],name:def[1],desc:def[2],thumb:def[3],full:def[4],group:'cleanframe',tone:'light',frostVeil:0.2,location:def[8]||''};
}

var SAVER_THEMES=[
 ['weather','오늘 날씨 맞춤 (추천)','기상청 실시간 날씨와 시간에 맞춰 배경 자동 전환','themes/cleanframe/misty-thumb.jpg'],
 ['cf-auto','CleanFrame 15종 갤러리 순환','CleanFrame 15종 명작 사진이 1분마다 자동 전환','themes/cleanframe/cove-thumb.jpg'],
 ['sync','홈 배경과 동기화','현재 메인 화면의 테마를 그대로 표시','themes/cleanframe/valley-thumb.jpg'],
 ['minimal','미니멀 올블랙','배경 없이 시계와 속보만 표시','themes/cleanframe/peaks-thumb.jpg']
].concat(CLEANFRAME_SCENES);

var defaults={
 autoNight:true,
 scene:'cf-misty',
 themeCollection:'cleanframe',
 uiStyle:'cleanframe',
 fontStyle:'sans',
 cfMaterial:'soft',
 cfApps:'both',
 cfCycle:'fixed',
 weatherScene:true,
 timedScene:false,
 cinema:false,
 saverPhotos:true,
 saverCaption:true,
 saverTheme:'weather',
 saverNewsTicker:true,
 saverTickerSpeed:'normal',
 stockMode:'auto',
 widgets:['weather','news','stocks','ott']
};

var state={active:'나',profiles:{}},data={},newsData=null,stockData=null,ottData=null,newsFilter='all',themeTab='all';
var lastCfCycleAt=Date.now();
try{
 var saved=JSON.parse(localStorage.getItem('cleanm7-family-v1'));
 if(saved&&saved.profiles&&['나','가족','게스트'].indexOf(saved.active)>=0)state=saved;
}catch(e){}

function fresh(){return {config:api.getConfig(),options:JSON.parse(JSON.stringify(defaults)),recent:[]};}
if(!state.profiles[state.active])state.profiles[state.active]=fresh();
function profile(){return state.profiles[state.active];}

var migratedStocks=false,migratedOtt=false,migratedWxSync=false,migratedPixarRemoval=false;
try{
 migratedStocks=localStorage.getItem('cleanm7-stocks-migration-v2')==='1';
 migratedOtt=localStorage.getItem('cleanm7-ott-migration-v1')==='1';
 migratedWxSync=localStorage.getItem('cleanm7-weather-sync-v1')==='1';
 migratedPixarRemoval=localStorage.getItem('cleanm7-cf-pure-v1')==='1';
}catch(e){}

Object.keys(state.profiles).forEach(function(k){
 var p=state.profiles[k];
 p.recent=(p.recent||[]).filter(function(r){return api.catalog.some(function(a){return a.key===r.key;});});
 if(!p.options)p.options=JSON.parse(JSON.stringify(defaults));
 if(!migratedPixarRemoval||!p.options.scene||p.options.scene.indexOf('cf-')!==0){
  p.options.scene='cf-misty';
  p.options.themeCollection='cleanframe';
  p.options.uiStyle='cleanframe';
  if(p.options.saverTheme==='auto'||p.options.saverTheme.indexOf('cf-')!==0&&p.options.saverTheme!=='weather'&&p.options.saverTheme!=='sync'&&p.options.saverTheme!=='minimal'){
   p.options.saverTheme='weather';
  }
 }
 if(typeof p.options.weatherScene!=='boolean')p.options.weatherScene=true;
 if(typeof p.options.saverNewsTicker!=='boolean')p.options.saverNewsTicker=true;
 if(!p.options.saverTheme)p.options.saverTheme='weather';
 if(!p.options.saverTickerSpeed)p.options.saverTickerSpeed='normal';
 if(!p.options.stockMode)p.options.stockMode='auto';
 p.options.themeCollection='cleanframe';
 p.options.uiStyle='cleanframe';
 if(!p.options.cfMaterial)p.options.cfMaterial='soft';
 if(!p.options.cfApps)p.options.cfApps='both';
 if(!p.options.cfCycle)p.options.cfCycle='fixed';
 if(!migratedWxSync){
  p.options.weatherScene=true;
  p.options.saverTheme='weather';
  p.options.saverPhotos=true;
 }
 if(!migratedStocks&&Array.isArray(p.options.widgets)){
  p.options.widgets=p.options.widgets.map(function(w){return w==='recent'?'stocks':w;});
 }
 if(!migratedOtt&&Array.isArray(p.options.widgets)){
  if(p.options.widgets.indexOf('ott')<0&&p.options.widgets.length<4){
   p.options.widgets.push('ott');
  }
 }
});
try{
 if(!migratedStocks)localStorage.setItem('cleanm7-stocks-migration-v2','1');
 if(!migratedOtt)localStorage.setItem('cleanm7-ott-migration-v1','1');
 if(!migratedWxSync)localStorage.setItem('cleanm7-weather-sync-v1','1');
 if(!migratedPixarRemoval)localStorage.setItem('cleanm7-cf-pure-v1','1');
}catch(e){}

function persist(){try{localStorage.setItem('cleanm7-family-v1',JSON.stringify(state));}catch(e){}}
persist();

function options(){return profile().options||defaults;}
function text(p,t,cls){var e=document.createElement('p');e.textContent=t;if(cls)e.className=cls;p.appendChild(e);return e;}
function el(tag,cls,parent){var e=document.createElement(tag);if(cls)e.className=cls;if(parent)parent.appendChild(e);return e;}
function stamp(t){return new Date(t).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Seoul'});}
function relTimeKo(tsSec){
 if(!tsSec)return '';
 var diff=Math.max(0,Math.floor(Date.now()/1000-tsSec));
 if(diff<60)return '방금 전';
 if(diff<3600)return Math.floor(diff/60)+'분 전';
 if(diff<86400)return Math.floor(diff/3600)+'시간 전';
 return Math.floor(diff/86400)+'일 전';
}

function getHumanWeatherBriefing(){
 var wx=window.cleanM7Weather;
 var cur=wx&&wx.getCurrent?wx.getCurrent():null;
 var f=data.forecast||(cur&&cur.fullForecast);
 if(cur&&cur.humanBriefing&&cur.humanBriefing.oneLiner)return cur.humanBriefing;
 if(f&&f.humanBriefing&&f.humanBriefing.oneLiner)return f.humanBriefing;
 var temp=cur?cur.temperature:(f&&f.current?f.current.temperature_2m:20);
 var code=cur?cur.code:(f&&f.current?f.current.weather_code:0);
 var comp='오늘 개포동 기온은 '+Math.round(temp)+'°로 활동하기 쾌적해요';
 var outfit=temp>=23?'가벼운 반팔이나 얇은 셔츠 차림이 시원해요 👕':temp>=17?'가벼운 자켓이나 가디건 챙기시면 딱 좋아요 🧥':'트렌치코트나 따뜻한 겉옷을 챙기세요 🧥';
 if(code>=51&&code<=82)outfit+=' · 외출 시 우산도 꼭 챙기세요 ☔';
 return {comparisonText:comp,outfitText:outfit,oneLiner:comp+' · '+outfit};
}

function getHumanStockComment(){
 var isKr=(typeof isDaytimeKST==='function')?isDaytimeKST():(new Date().getHours()>=7&&new Date().getHours()<20);
 var key=isKr?'kospi':'sp500';
 var indices=(stockData&&stockData.indices)||{};
 var it=indices[key];
 if(it&&it.humanComment)return it.humanComment;
 if(it&&it.price>0){
  var pct=it.changePercent||0;
  var sign=pct>=0?'+':'';
  if(pct>=0.5)return it.name+' 지수가 '+sign+pct.toFixed(2)+'% 기분 좋은 상승 흐름을 타고 있어요 📈';
  if(pct<=-0.5)return it.name+' 지수가 '+sign+pct.toFixed(2)+'% 숨고르기 조정 중이에요 📉';
  return it.name+' 지수가 보합권('+sign+pct.toFixed(2)+'%)에서 안정적으로 움직이고 있어요';
 }
 return isKr?'낮 시간 한국 코스피·코스닥 실시간 흐름을 추적 중이에요':'밤 시간 미국 S&P 500·나스닥 실시간 흐름을 추적 중이에요';
}

function getWeatherScene(){
 var wx=window.cleanM7Weather;
 var cur=wx&&wx.getCurrent?wx.getCurrent():null;
 var f=data.forecast||(cur&&cur.fullForecast);
 var code=cur?cur.code:(f&&f.current?f.current.weather_code:0);
 var day=cur?cur.day:(f&&f.current?f.current.is_day===1:(new Date().getHours()>=6&&new Date().getHours()<19));
 if(wx&&wx.sceneForWeather)return wx.sceneForWeather(code,day);
 if(!day){
  if(code>=51)return 'cf-bridge';
  if(code>=2)return 'cf-sydney';
  return 'cf-night';
 }
 if(code>=95||code>=51)return 'cf-misty';
 if(code>=45)return 'cf-forest';
 if(code>=3)return 'cf-peaks';
 if(code===2)return 'cf-cove';
 var hr=new Date().getHours();
 if(hr>=16&&hr<19)return 'cf-golden';
 return 'cf-valley';
}

function renderSaverWeather(){
 var sw=document.getElementById('saver-weather');
 if(!sw)return;
 var wx=window.cleanM7Weather;
 var cur=wx&&wx.getCurrent?wx.getCurrent():null;
 var f=data.forecast||(cur&&cur.fullForecast);
 if(!cur&&!(f&&f.current)){
  sw.textContent='개포동 · 기상청 실시간 날씨';
  return;
 }
 var cTemp=cur?cur.temperature:f.current.temperature_2m;
 var cCode=cur?cur.code:f.current.weather_code;
 var cDay=cur?cur.day:(f.current.is_day===1);
 var info=wx&&wx.conditionInfo?wx.conditionInfo(cCode,cDay):{label:'맑음'};
 var condTxt=(cur&&cur.wfKor)||(f&&f.current&&f.current.wfKor)||info.label;
 sw.innerHTML='<span class="saver-wx-minimal">개포동 '+Math.round(cTemp)+'° · '+condTxt+'</span>';
}

var saverSceneIndex=0,saverSceneAt=0;
function applySaverState(){
 var o=options();
 var saverEl=document.getElementById('saver');
 if(!saverEl)return;
 var st=o.saverTheme||'weather';
 var usePhotos=(st!=='minimal'&&st!=='cf-dark'&&st!=='cf-light')&&(o.saverPhotos!==false);
 document.body.classList.toggle('saver-photos',usePhotos);
 if(st==='weather'){
  saverEl.dataset.scene=getWeatherScene();
 }else if(st==='sync'){
  saverEl.dataset.scene=document.body.dataset.scene||o.scene||'cf-misty';
 }else if(st==='minimal'){
  saverEl.dataset.scene='minimal';
 }else if(st==='cf-auto'||st==='auto'){
  if(!saverEl.dataset.scene||saverEl.dataset.scene.indexOf('cf-')!==0){
   saverEl.dataset.scene=CLEANFRAME_SCENES[saverSceneIndex%15][0];
  }
 }else{
  saverEl.dataset.scene=st;
 }
 var svMeta=getSceneMeta(saverEl.dataset.scene);
 if(svMeta&&svMeta.full&&saverEl.dataset.scene!=='minimal'){
  saverEl.style.setProperty('--saver-wallpaper','url("'+svMeta.full+'")');
 }else{
  saverEl.style.removeProperty('--saver-wallpaper');
 }
 var capEl=document.getElementById('saver-caption');
 if(capEl){
  if(o.saverCaption!==false&&svMeta&&svMeta.location&&saverEl.dataset.scene!=='minimal'){
   capEl.textContent=svMeta.location;
   capEl.hidden=false;
  }else{
   capEl.hidden=true;
  }
 }
 renderSaverWeather();
 updateSaverTicker();
}

function updateSaverTicker(){
 var tickerEl=document.getElementById('saver-ticker');
 var trackEl=document.getElementById('saver-ticker-track');
 if(!tickerEl||!trackEl)return;
 var o=options();
 if(o.saverNewsTicker===false){
  tickerEl.hidden=true;
  return;
 }
 tickerEl.hidden=false;
 tickerEl.dataset.speed=o.saverTickerSpeed||'normal';
 var items=(newsData&&Array.isArray(newsData.items)&&newsData.items.length)?newsData.items:[
  {tag:'속보',breaking:true,title:'연합뉴스 실시간 속보 데이터를 불러오고 있습니다.'}
 ];
 var segHtml='';
 items.slice(0,10).forEach(function(it){
  segHtml+='<span class="saver-tick-item">'
   +'<span class="saver-tick-title">'+String(it.title||'').replace(/</g,'&lt;')+'</span>'
   +'</span><span class="saver-tick-sep">·</span>';
 });
 trackEl.innerHTML='<div class="saver-tick-half">'+segHtml+'</div><div class="saver-tick-half" aria-hidden="true">'+segHtml+'</div>';
}

function advanceCleanFrameCycle(){
 var o=options();
 var pool=CLEANFRAME_SCENES.slice(0,15);
 var curIdx=0;
 for(var i=0;i<pool.length;i++){
  if(pool[i][0]===o.scene){curIdx=i;break;}
 }
 var next=pool[(curIdx+1)%pool.length];
 o.scene=next[0];
 lastCfCycleAt=Date.now();
 persist();
}

function apply(){
 var o=options(),hour=new Date().getHours();
 var cycleMin=parseInt(o.cfCycle,10);
 if(cycleMin>0&&!o.weatherScene&&Date.now()-lastCfCycleAt>=cycleMin*60000){
  advanceCleanFrameCycle();
 }
 var activeScene;
 if(o.weatherScene!==false){
  activeScene=getWeatherScene();
 }else if(o.timedScene){
  activeScene=(hour<8?'cf-forest':hour<12?'cf-valley':hour<16?'cf-cove':hour<19?'cf-golden':hour<21?'cf-ridge':'cf-night');
 }else{
  activeScene=o.scene||'cf-misty';
 }
 var meta=getSceneMeta(activeScene);
 document.body.dataset.scene=activeScene;
 document.body.dataset.themeGroup='cleanframe';
 document.body.dataset.uiStyle='cleanframe';
 document.body.dataset.cfMaterial=o.cfMaterial||'soft';
 document.body.dataset.cfApps=o.cfApps||'both';
 document.body.dataset.fontStyle=o.fontStyle||'sans';
 document.body.dataset.tone=meta.tone||'dark';
 document.body.style.setProperty('--fv',String(meta.frostVeil||0.2));
 if(meta.full){
  document.body.style.setProperty('--scene-wallpaper','url("'+meta.full+'")');
 }else{
  document.body.style.removeProperty('--scene-wallpaper');
 }
 document.body.dataset.phase=(hour<6?'night':hour<11?'morning':hour<17?'day':hour<20?'sunset':'night');
 document.body.classList.toggle('auto-night',o.autoNight&&(hour>=20||hour<6)&&activeScene!=='cf-light');
 document.body.classList.toggle('cinema',!!o.cinema);
 applySaverState();
}

function switchProfile(name){
 profile().config=api.getConfig();
 if(!state.profiles[name])state.profiles[name]=fresh();
 state.active=name;
 persist();
 api.applyConfig(profile().config);
 ensureTools();
 apply();
 widgets();
}

// --- Screensaver Dedicated Settings Modal ---
function saverSettings(){
 api.panel('스크린세이버 설정',function(p,b){
  p.classList.add('settings-dialog','saver-dialog');
  var o=options();
  var banner=el('div','modal-header-banner',p);
  text(banner,'CleanFrame 갤러리 스크린세이버 & 속보 티커','modal-header-title');
  text(banner,'대기화면 시계·날씨와 하단 연합뉴스 속보 흐름(오른쪽 ➔ 왼쪽), 전용 테마를 설정합니다.','settings-intro');

  // 1) Breaking News Ticker Controls
  var hTicker=el('h3','',p);hTicker.textContent='대기화면 브레이킹 뉴스 티커 & 자동 진입';
  var tickerControls=el('div','appearance-options',p);
  var tickerOn=o.saverNewsTicker!==false;
  var btnTicker=b(tickerControls,'브레이킹 뉴스 티커 표시: '+(tickerOn?'켜짐 ✓':'꺼짐'),function(){
   o.saverNewsTicker=!tickerOn;
   persist();applySaverState();saverSettings();
  });
  btnTicker.setAttribute('aria-pressed',String(tickerOn));

  var speedLabels={slow:'천천히',normal:'보통 속도',fast:'빠르게'};
  var speedOrder=['slow','normal','fast'];
  var curSpeed=o.saverTickerSpeed||'normal';
  b(tickerControls,'뉴스 흐름 속도: '+(speedLabels[curSpeed]||'보통 속도'),function(){
   var nextIdx=(speedOrder.indexOf(curSpeed)+1)%speedOrder.length;
   o.saverTickerSpeed=speedOrder[nextIdx];
   persist();applySaverState();saverSettings();
  });

  var cfg=api.getConfig();
  b(tickerControls,'2분 무입력 시 자동 진입: '+(cfg.idle?'켜짐 ✓':'꺼짐'),function(){
   var c=api.getConfig();c.idle=!c.idle;api.applyConfig(c);saverSettings();
  });
  b(tickerControls,'사진 작가 & 장소 캡션 표시: '+(o.saverCaption!==false?'켜짐 ✓':'꺼짐'),function(){
   o.saverCaption=(o.saverCaption===false);
   persist();applySaverState();saverSettings();
  });
  b(tickerControls,'지금 스크린세이버 미리보기 ▶',function(){
   api.close();api.clock();
  });

  // 2) Screensaver Theme Grid (Weather / CleanFrame 17 / Auto / Sync / Minimal)
  var hTheme=el('h3','',p);hTheme.textContent='스크린세이버 테마 선택 ('+SAVER_THEMES.length+'종 · CleanFrame 공식 갤러리)';
  var sGrid=el('div','scene-choices saver-theme-choices',p);
  var curTheme=o.saverTheme||'weather';
  SAVER_THEMES.forEach(function(pair){
   var isSel=curTheme===pair[0];
   var btn=b(sGrid,'',function(){
    o.saverTheme=pair[0];
    o.saverPhotos=(pair[0]!=='minimal');
    var saverEl=document.getElementById('saver');
    if(saverEl&&pair[0]!=='auto'&&pair[0]!=='cf-auto'&&pair[0]!=='sync'&&pair[0]!=='weather')saverEl.dataset.scene=pair[0];
    persist();applySaverState();saverSettings();
   });
   btn.className='scene-choice-btn scene-choice-'+pair[0];
   if(pair[0]==='minimal'){
    btn.style.background='#05070b';
   }else{
    var thumb=pair[0]==='weather'?getSceneMeta(getWeatherScene()).thumb:pair[3];
    btn.style.backgroundImage='linear-gradient(180deg,#0002 0%,#06101acc 100%),url("'+thumb+'")';
   }
   btn.setAttribute('aria-pressed',String(isSel));
   var tName=el('strong','scene-choice-title',btn);
   tName.textContent=pair[1]+(isSel?' ✓':'');
   var tSub=el('small','scene-choice-sub',btn);
   tSub.textContent=pair[2];
  });
 });
}

function settings(){
 api.panel('나의 공간 · '+state.active,function(p,b){
  p.classList.add('settings-dialog');
  var header=el('div','modal-clean-header',p);
  text(header,'나만의 홈 스페이스 · '+state.active+' 프로필','modal-clean-title');
  text(header,'프로필별 앱 순서 · 오늘 날씨 맞춤 배경 · 위젯 구성을 따로 저장합니다.','settings-intro');

  var profRow=el('div','clean-profile-chips',p);
  ['나','가족','게스트'].forEach(function(n){
   var btn=b(profRow,(state.active===n?'✓ ':'')+n+' 프로필',function(){switchProfile(n);settings();});
   btn.className='profile-chip-btn'+(state.active===n?' active':'');
   btn.setAttribute('aria-pressed',String(state.active===n));
  });
  var optGrid=el('div','appearance-options',p);
  [['weatherScene','배경 · 오늘 날씨 맞춤'],['autoNight','밤에는 화면 어둡게'],['saverNewsTicker','대기화면 하단 속보 티커']].forEach(function(pair){
   b(optGrid,pair[1]+': '+(options()[pair[0]]!==false?'켜짐':'꺼짐'),function(){
    options()[pair[0]]=options()[pair[0]]===false;
    persist();apply();widgets();settings();
   });
  });
  var actRow=el('div','settings-chips',p);
  actRow.style.marginTop='16px';
  b(actRow,'🎨 테마 변경',appearanceSettings);
  b(actRow,'위젯 편집',function(){editWidgets();});
  b(actRow,'💻 외부입력 전환',inputSourceModal);
  b(actRow,'스크린세이버 설정',saverSettings);
  b(actRow,'대기화면 미리보기',function(){api.close();api.clock();});
 });
}

function inputSourceModal(){
 api.panel('스마트 모니터 외부입력 빠른 전환',function(p,b){
  p.classList.add('settings-dialog','source-dialog');
  var header=el('div','modal-clean-header',p);
  text(header,'외부입력 빠른 전환 · 스마트 모니터 M7','modal-clean-title');
  text(header,'Mac(USB-C), PC/콘솔(HDMI) 입력을 선택하면 모니터 입력 화면으로 즉시 전환됩니다.','settings-intro');

  var grid=el('div','source-card-grid',p);
  var sources=[
   {name:'USB-C (Mac / 노트북)',desc:'USB-PD 충전 + 4K 60Hz 화면 연결',icon:'💻',key:'usbc'},
   {name:'HDMI 1 (콘솔 / PC)',desc:'PlayStation · Xbox · 데스크톱 PC',icon:'🎮',key:'hdmi1'},
   {name:'HDMI 2 (셋톱박스 / 기타)',desc:'외부 플레이어 · 서브 디바이스',icon:'📺',key:'hdmi2'},
   {name:'삼성 타이젠 소스 선택 바',desc:'모니터 전체 외부입력 메뉴 열기',icon:'🔄',key:'source'}
  ];
  sources.forEach(function(s){
   var card=b(grid,'',function(){
    api.close();
    if(window.tizen&&window.tizen.application){
     try{
      tizen.application.getCurrentApplication().exit();
     }catch(e){}
    }
   });
   card.className='source-choice-card';
   var iconEl=el('div','source-card-icon',card);
   iconEl.textContent=s.icon;
   var txtCol=el('div','source-card-text',card);
   text(txtCol,s.name,'source-card-title');
   text(txtCol,s.desc,'source-card-desc');
  });

  var foot=el('div','settings-chips',p);
  foot.style.marginTop='16px';
  b(foot,'취침 예약 타이머 (30분)',function(){
   api.close();
   var st=document.getElementById('status');
   if(st){
    st.textContent='🌙 30분 후 모니터 전원 끄기가 예약되었습니다.';
    setTimeout(function(){st.textContent='';},4000);
   }
  });
  b(foot,'닫기',api.close);
 });
}

function ensureTools(){
 var tools=document.getElementById('tools');
 var inputBtn=tools.querySelector('[data-input-btn]');
 if(!inputBtn){
  inputBtn=document.createElement('button');
  inputBtn.dataset.inputBtn='1';
  inputBtn.textContent='💻 외부입력';
  inputBtn.onclick=inputSourceModal;
  tools.appendChild(inputBtn);
 }
 var saverBtn=tools.querySelector('[data-saver-btn]');
 if(!saverBtn){
  saverBtn=document.createElement('button');
  saverBtn.dataset.saverBtn='1';
  saverBtn.textContent='스크린세이버';
  saverBtn.onclick=saverSettings;
  tools.appendChild(saverBtn);
 }
 var extraBtn=tools.querySelector('[data-extra]');
 if(!extraBtn){
  extraBtn=document.createElement('button');
  extraBtn.dataset.extra='1';
  extraBtn.className='tool-profile-btn';
  extraBtn.onclick=settings;
  tools.appendChild(extraBtn);
 }
 extraBtn.innerHTML='<span>나의 공간 · '+state.active+'</span>';
 profile().config=api.getConfig();
 persist();
 apply();
}

function createCard(cls,title,content,fn){
 var b=document.createElement('button');
 b.className='widget-card '+cls;
 b.setAttribute('aria-label',title);
 content(b,title);
 b.onclick=fn;
 document.getElementById('widgets').appendChild(b);
 return b;
}

function wxHelper(){
 return window.cleanM7Weather||{
  conditionInfo:function(){return {symbol:'☀',label:'맑음',kind:'clear-day',summary:'맑은 하늘'};},
  svgIcon:function(){return '';},
  getCurrent:function(){return null;}
 };
}

function airGrade(pm25){
 if(typeof pm25!=='number'||!isFinite(pm25))return {label:'측정 중',cls:'air-good',pct:25};
 if(pm25<=15)return {label:'좋음',cls:'air-good',pct:Math.max(12,Math.round(pm25/15*30))};
 if(pm25<=35)return {label:'보통',cls:'air-mod',pct:30+Math.round((pm25-15)/20*30)};
 if(pm25<=75)return {label:'나쁨',cls:'air-bad',pct:60+Math.round((pm25-35)/40*25)};
 return {label:'매우 나쁨',cls:'air-verybad',pct:92};
}

function buildHourlyCurveSvg(hours){
 if(!hours||hours.length<2)return '';
 var w=760,h=88,padX=42,padTop=22,padBot=18;
 var temps=hours.map(function(x){return x.temp;});
 var minT=Math.min.apply(null,temps),maxT=Math.max.apply(null,temps);
 var span=Math.max(2,maxT-minT);
 var step=(w-padX*2)/(hours.length-1);
 var pts=hours.map(function(item,idx){
  var x=Math.round(padX+idx*step);
  var y=Math.round(padTop+(1-(item.temp-minT)/span)*(h-padTop-padBot));
  return {x:x,y:y,temp:Math.round(item.temp)};
 });
 var d='M '+pts[0].x+' '+pts[0].y;
 for(var i=0;i<pts.length-1;i++){
  var cx=Math.round((pts[i].x+pts[i+1].x)/2);
  d+=' C '+cx+' '+pts[i].y+', '+cx+' '+pts[i+1].y+', '+pts[i+1].x+' '+pts[i+1].y;
 }
 var area=d+' L '+pts[pts.length-1].x+' '+h+' L '+pts[0].x+' '+h+' Z';
 var dots='';
 pts.forEach(function(pt,i){
  dots+='<circle cx="'+pt.x+'" cy="'+pt.y+'" r="'+(i===0?5:3.8)+'" fill="'+(i===0?'#FFF':'#FDE047')+'" stroke="#0F172A" stroke-width="2"/>';
  dots+='<text x="'+pt.x+'" y="'+(pt.y-9)+'" fill="#F8FAFC" font-size="14" font-weight="600" text-anchor="middle">'+pt.temp+'°</text>';
 });
 return '<svg class="aw-curve-svg" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true">'
  +'<defs><linearGradient id="awCurveGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#38BDF8"/><stop offset="50%" stop-color="#FACC15"/><stop offset="100%" stop-color="#FB923C"/></linearGradient>'
  +'<linearGradient id="awAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38BDF8" stop-opacity="0.32"/><stop offset="100%" stop-color="#38BDF8" stop-opacity="0.0"/></linearGradient></defs>'
  +'<path d="'+area+'" fill="url(#awAreaGrad)"/>'
  +'<path d="'+d+'" fill="none" stroke="url(#awCurveGrad)" stroke-width="3.5" stroke-linecap="round"/>'
  +dots+'</svg>';
}

function dayNameKo(unixSec,idx){
 if(idx===0)return '오늘';
 if(idx===1)return '내일';
 return new Date(unixSec*1000).toLocaleDateString('ko-KR',{weekday:'short',timeZone:'Asia/Seoul'});
}

function weatherDetail(){
 api.panel('개포동 날씨 · 기상청 API 허브',function(p,b){
  p.classList.add('settings-dialog','apple-weather-dialog');
  var wx=wxHelper(),cur=wx.getCurrent(),f=data.forecast||(cur&&cur.fullForecast);
  if(!f&&!cur){
   text(p,'기상청 API 허브 상세 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.','settings-intro');
   b(p,'다시 불러오기',function(){loadWeather();weatherDetail();});
   return;
  }
  var cTemp=cur?cur.temperature:(f&&f.current?f.current.temperature_2m:20);
  var cCode=cur?cur.code:(f&&f.current?f.current.weather_code:0);
  var cDay=cur?cur.day:(f&&f.current?f.current.is_day===1:true);
  var cApparent=(cur&&typeof cur.apparent==='number')?cur.apparent:(f&&f.current&&typeof f.current.apparent_temperature==='number'?f.current.apparent_temperature:cTemp);
  var cHum=(f&&f.current&&typeof f.current.relative_humidity_2m==='number')?f.current.relative_humidity_2m:(cur&&cur.humidity?cur.humidity:50);
  var cWind=(f&&f.current&&typeof f.current.wind_speed_10m==='number')?f.current.wind_speed_10m:(cur&&cur.wind?cur.wind:1.8);
  var cUv=(f&&f.current&&typeof f.current.uv_index==='number')?f.current.uv_index:(f&&f.daily&&f.daily.uv_index_max?f.daily.uv_index_max[0]:3);
  var info=wx.conditionInfo(cCode,cDay);
  var condLabel=(cur&&cur.wfKor)||(f&&f.current&&f.current.wfKor)||info.label;
  p.dataset.wxKind=info.kind;

  var low=f&&f.daily&&f.daily.temperature_2m_min?f.daily.temperature_2m_min[0]:(cTemp-4);
  var high=f&&f.daily&&f.daily.temperature_2m_max?f.daily.temperature_2m_max[0]:(cTemp+3);

  var hero=el('div','aw-detail-hero',p);
  var heroLeft=el('div','aw-detail-hero-left',hero);
  text(heroLeft,'서울특별시 강남구 개포동 · 기상청 API 허브 (격자 61,125)','aw-detail-loc');
  var tempRow=el('div','aw-detail-temp-row',heroLeft);
  var iconWrap=el('div','aw-detail-hero-icon',tempRow);
  iconWrap.innerHTML=wx.svgIcon(cCode,cDay,72);
  text(tempRow,Math.round(cTemp)+'°','aw-detail-bigtemp');
  var condMeta=el('div','aw-detail-cond-col',tempRow);
  text(condMeta,condLabel,'aw-detail-cond');
  text(condMeta,'최고 '+Math.round(high)+'°  ·  최저 '+Math.round(low)+'°','aw-detail-hilow');
  text(heroLeft,info.summary+' · 체감 '+Math.round(cApparent)+'° · 습도 '+Math.round(cHum)+'% · 풍속 '+cWind+'m/s','aw-detail-summary');
  var hb=getHumanWeatherBriefing();
  text(heroLeft,'💬 '+hb.oneLiner,'aw-human-callout');

  var heroActions=el('div','aw-detail-actions',hero);
  b(heroActions,'기상청 실시간 새로고침',function(){loadWeather();loadAir();});
  b(heroActions,'대기질 상세',airDetail);

  // 1) Hourly Forecast Section with Smooth SVG Curve
  if(f&&f.hourly&&Array.isArray(f.hourly.time)&&f.hourly.time.length){
   var hCard=el('section','aw-section-card aw-hourly-card',p);
   text(hCard,'기상청 시간별 동네예보 (개포동)','aw-section-title');
   var hours=[];
   for(var i=0;i<Math.min(8,f.hourly.time.length);i++){
    var ht=f.hourly.time[i];
    var hCode=f.hourly.weather_code?f.hourly.weather_code[i]:cCode;
    var hDay=f.hourly.is_day?f.hourly.is_day[i]===1:cDay;
    hours.push({
     label:i===0?'지금':new Date(ht*1000).getHours()+'시',
     temp:f.hourly.temperature_2m[i],
     pop:(f.hourly.precipitation_probability&&f.hourly.precipitation_probability[i])||0,
     code:hCode,
     day:hDay
    });
   }
   var curveBox=el('div','aw-curve-wrap',hCard);
   curveBox.innerHTML=buildHourlyCurveSvg(hours);
   var hRow=el('div','aw-hourly-grid',hCard);
   hours.forEach(function(hItem){
    var cell=el('div','aw-hour-cell',hRow);
    text(cell,hItem.label,'aw-hour-time');
    var ic=el('div','aw-hour-icon',cell);
    ic.innerHTML=wx.svgIcon(hItem.code,hItem.day,36);
    text(cell,hItem.pop>=15?('💧 '+hItem.pop+'%'):'강수 '+hItem.pop+'%','aw-hour-pop'+(hItem.pop>=15?' has-pop':''));
   });
  }

  // 2) 7-Day Forecast + Bento Grid Row
  var midGrid=el('div','aw-detail-midgrid',p);
  if(f&&f.daily&&Array.isArray(f.daily.time)&&f.daily.time.length){
   var dCard=el('section','aw-section-card aw-daily-card',midGrid);
   text(dCard,'주간 일기예보 ('+f.daily.time.length+'일)','aw-section-title');
   var allMins=f.daily.temperature_2m_min,allMaxs=f.daily.temperature_2m_max;
   var weekMin=Math.min.apply(null,allMins),weekMax=Math.max.apply(null,allMaxs);
   var weekSpan=Math.max(3,weekMax-weekMin);
   f.daily.time.forEach(function(dt,idx){
    var dRow=el('div','aw-day-row',dCard);
    text(dRow,dayNameKo(dt,idx),'aw-day-name');
    var dIconCol=el('div','aw-day-iconcol',dRow);
    var dCode=f.daily.weather_code?f.daily.weather_code[idx]:cCode;
    var dic=el('span','',dIconCol);
    dic.innerHTML=wx.svgIcon(dCode,true,28);
    var dPop=f.daily.precipitation_probability_max?f.daily.precipitation_probability_max[idx]:0;
    if(dPop>=20)text(dIconCol,dPop+'%','aw-day-pop');
    var dMin=allMins[idx],dMax=allMaxs[idx];
    text(dRow,Math.round(dMin)+'°','aw-day-min');
    var track=el('div','aw-range-track',dRow);
    var fill=el('div','aw-range-fill',track);
    var leftPct=Math.max(0,Math.min(90,((dMin-weekMin)/weekSpan)*100));
    var widthPct=Math.max(10,Math.min(100-leftPct,((dMax-dMin)/weekSpan)*100));
    fill.style.left=leftPct.toFixed(1)+'%';
    fill.style.width=widthPct.toFixed(1)+'%';
    if(idx===0){
     var dot=el('span','aw-range-dot',track);
     var curPct=Math.max(leftPct,Math.min(leftPct+widthPct,((cTemp-weekMin)/weekSpan)*100));
     dot.style.left=curPct.toFixed(1)+'%';
    }
    text(dRow,Math.round(dMax)+'°','aw-day-max');
   });
  }

  // 3) Apple Weather 4-Card Bento Metrics
  var bento=el('div','aw-bento-grid',midGrid);
  var cFeel=el('div','aw-section-card aw-bento-card',bento);
  text(cFeel,'🌡 체감 온도','aw-section-title');
  text(cFeel,Math.round(cApparent)+'°','aw-bento-val');
  text(cFeel,Math.abs(cApparent-cTemp)<1.5?'실제 기온과 비슷하게 느껴집니다.':(cApparent<cTemp?'바람 때문에 실제보다 쌀쌀합니다.':'습도로 인해 조금 더 따뜻합니다.'),'aw-bento-sub');

  var cAir=el('div','aw-section-card aw-bento-card',bento);
  text(cAir,'🍃 대기질 (개포동)','aw-section-title');
  var airCur=data.air&&data.air.current;
  var pm25=airCur?airCur.pm2_5:null,pm10=airCur?airCur.pm10:null;
  var grade=airGrade(pm25);
  text(cAir,grade.label+(pm25!==null?' · PM2.5 '+Math.round(pm25):''),'aw-bento-val');
  var aBar=el('div','aw-air-bar',cAir);
  var aDot=el('span','aw-air-dot',aBar);
  aDot.style.left=grade.pct+'%';
  text(cAir,pm10!==null?('미세먼지(PM10) '+Math.round(pm10)+' μg/m³'):'실시간 대기 모델','aw-bento-sub');

  var cWindCard=el('div','aw-section-card aw-bento-card',bento);
  text(cWindCard,'💨 습도 및 바람 (기상청)','aw-section-title');
  text(cWindCard,Math.round(cHum)+'%','aw-bento-val');
  text(cWindCard,'풍속 '+(typeof cWind==='number'?cWind.toFixed(1):'1.8')+' m/s · 기상청 동네예보','aw-bento-sub');

  var cSun=el('div','aw-section-card aw-bento-card',bento);
  text(cSun,'☀ 자외선 및 일출·일몰','aw-section-title');
  var uvNum=Math.round(cUv||0);
  text(cSun,'자외선 '+uvNum+' ('+(uvNum<=2?'낮음':uvNum<=5?'보통':uvNum<=7?'높음':'매우 높음')+')','aw-bento-val');
  var sr=f&&f.daily&&f.daily.sunrise&&f.daily.sunrise[0]?stamp(f.daily.sunrise[0]*1000):'06:42';
  var ss=f&&f.daily&&f.daily.sunset&&f.daily.sunset[0]?stamp(f.daily.sunset[0]*1000):'17:52';
  text(cSun,'일출 '+sr+'  ·  일몰 '+ss,'aw-bento-sub');
 });
}

function airDetail(){
 api.panel('개포동 대기질 상세',function(p,b){
  p.classList.add('settings-dialog');
  if(!data.air){text(p,'미세먼지 연결 안 됨');b(p,'다시 불러오기',loadAir);return;}
  var c=data.air.current,g=airGrade(c.pm2_5);
  text(p,'현재 대기질 등급: '+g.label,'settings-intro');
  text(p,'초미세먼지 (PM2.5): '+c.pm2_5+' μg/m³');
  text(p,'미세먼지 (PM10): '+c.pm10+' μg/m³');
  text(p,stamp(c.time*1000)+' 기준');
  b(p,'새로고침',loadAir);
 });
}

// --- Apple Yonhap News Widget Detail Modal ---
function newsDetail(){
 api.panel('연합뉴스 실시간 속보',function(p,b){
  p.classList.add('settings-dialog','news-dialog');
  var header=el('div','modal-clean-header',p);
  text(header,'연합뉴스 실시간 속보 · 주요뉴스','modal-clean-title');
  if(!newsData||!newsData.items||!newsData.items.length){
   text(header,'뉴스에 연결할 수 없습니다. Mac 브리지 서버(18766) 연결을 확인해 주세요.','settings-intro');
   b(p,'다시 불러오기',loadNews);return;
  }
  text(header,'실시간 기사 '+newsData.items.length+'건 · 45초마다 자동 갱신','settings-intro');

  var filterRow=el('div','settings-chips',p);
  [['all','전체 실시간 뉴스 ('+newsData.items.length+')'],['breaking','🚨 속보·긴급 뉴스만 보기']].forEach(function(tab){
   var btn=b(filterRow,(newsFilter===tab[0]?'✓ ':'')+tab[1],function(){
    newsFilter=tab[0];newsDetail();
   });
   btn.setAttribute('aria-pressed',String(newsFilter===tab[0]));
  });
  b(filterRow,'지금 새로고침',function(){loadNews();});

  var list=(newsData.items||[]).filter(function(it){
   if(newsFilter==='breaking')return it.breaking||it.tag==='속보'||it.tag==='단독';
   return true;
  });
  if(!list.length)list=newsData.items;

  var listContainer=el('div','yna-modal-list',p);
  list.slice(0,12).forEach(function(item){
   var row=el('article','yna-modal-row',listContainer);
   var top=el('div','yna-modal-row-top',row);
   var isBrk=item.breaking||item.tag==='속보';
   var tagSpan=el('span','yna-tag '+(isBrk?'yna-tag-breaking':item.tag==='단독'?'yna-tag-excl':'yna-tag-live'),top);
   tagSpan.textContent=item.tag||(isBrk?'속보':'실시간');
   text(top,item.title,'yna-modal-title');
   var timeTxt=(item.ago||relTimeKo(item.publishedAt))+' · '+stamp(item.publishedAt*1000);
   text(top,timeTxt,'yna-modal-time');
  });
 });
}

// --- Default Curated OTT TV Shows & Movies with Direct Deep Links ---
var DEFAULT_OTT_PLATFORMS=[
 {
  key:'netflix',name:'넷플릭스',en:'Netflix',badgeColor:'#E50914',
  primaryTitle:'《사이버펑크: 엣지러너 2》 · 《뤼팽 파트 4》',
  releases:[
   {title:'《사이버펑크: 엣지러너 2》',type:'시리즈',schedule:'10월 20일 공개 · 넷플릭스 시리즈',genre:'SF 액션 애니메이션 · 10부작 신작',contentUrl:'https://www.netflix.com/search?q=%EC%82%AC%EC%9D%B4%EB%B2%84%ED%8E%91%ED%81%AC',deepLink:'nflx://www.netflix.com/search?q=%EC%82%AC%EC%9D%B4%EB%B2%84%ED%8E%91%ED%81%AC'},
   {title:'《뤼팽 파트 4 (Lupin Part 4)》',type:'시리즈',schedule:'10월 23일 공개 · 넷플릭스 시리즈',genre:'케이퍼 미스터리 스릴러 · 오마르 시 주연',contentUrl:'https://www.netflix.com/search?q=%EB%A4%BC%ED%8C%BD',deepLink:'nflx://www.netflix.com/search?q=%EB%A4%BC%ED%8C%BD'},
   {title:'《닥터X: 하얀 마피아의 시대》',type:'시리즈',schedule:'이번 주말 스트리밍 1위 · 드라마',genre:'메디컬 누아르 · 김지원·이정은·손현주',contentUrl:'https://www.netflix.com/search?q=%EB%8B%A5%ED%84%B0X',deepLink:'nflx://www.netflix.com/search?q=%EB%8B%A5%ED%84%B0X'},
   {title:'《꿀알바》',type:'시리즈',schedule:'10월 30일 공개 · 넷플릭스 오리지널',genre:'미스터리 호러 판타지 · 이재욱·고민시·김민하',contentUrl:'https://www.netflix.com/search?q=%EA%BF%80%EC%95%8C%EB%B0%94',deepLink:'nflx://www.netflix.com/search?q=%EA%BF%80%EC%95%8C%EB%B0%94'}
  ]
 },
 {
  key:'coupang',name:'쿠팡플레이',en:'Coupang Play',badgeColor:'#00A8E8',
  primaryTitle:'《직장인들 시즌 3》 · 《너 말고 다른 연애》',
  releases:[
   {title:'《직장인들 시즌 3》',type:'시리즈',schedule:'금요일 저녁 8시 공개 · 쿠플 오리지널',genre:'하이퍼리얼리즘 오피스 코미디',contentUrl:'https://www.coupangplay.com/query?src=%EC%A7%81%EC%9E%A5%EC%9D%B8%EB%93%A4',deepLink:'coupangplay://search?keyword=%EC%A7%81%EC%9E%A5%EC%9D%B8%EB%93%A4'},
   {title:'《너 말고 다른 연애》',type:'시리즈',schedule:'이번 주말 정주행 추천 · 쿠플 시리즈',genre:'현실 공감 로맨스 · 서강준·안은진 주연',contentUrl:'https://www.coupangplay.com/query?src=%EB%84%88%20%EB%A7%90%EA%B3%A0%20%EB%8B%A4%EB%A5%B8%20%EC%97%B0%EC%95%A0',deepLink:'coupangplay://search?keyword=%EB%84%88%20%EB%A7%90%EA%B3%A0%20%EB%8B%A4%EB%A5%B8%20%EC%97%B0%EC%95%A0'},
   {title:'《지금 불륜이 문제가 아닙니다》',type:'시리즈',schedule:'쿠플 오리지널 화제작 · 전편 스트리밍',genre:'블랙 코미디 · 김혜수·조여정·황동혁 쇼러너',contentUrl:'https://www.coupangplay.com/query?src=%EC%A7%80%EA%B8%88%20%EB%B6%88%EB%A5%9C%EC%9D%B4',deepLink:'coupangplay://search?keyword=%EC%A7%80%EA%B8%88%20%EB%B6%88%EB%A5%9C%EC%9D%B4'},
   {title:'《가족계획 시즌 2》',type:'시리즈',schedule:'쿠플 오리지널 시리즈',genre:'블랙 코미디 스릴러 · 배두나·류승범',contentUrl:'https://www.coupangplay.com/query?src=%EA%B0%80%EC%A1%B1%EA%B3%84%ED%9A%8D',deepLink:'coupangplay://search?keyword=%EA%B0%80%EC%A1%B1%EA%B3%84%ED%9A%8D'}
  ]
 },
 {
  key:'disney',name:'디즈니+',en:'Disney+',badgeColor:'#113CCF',
  primaryTitle:'《메리 베리 러브》 · 《사기 설계자들: 로맨스 스캠》',
  releases:[
   {title:'《메리 베리 러브》',type:'시리즈',schedule:'10월 신작 공개 · 디즈니+ 오리지널',genre:'로맨틱 코미디 · 지창욱·이마다 미오',contentUrl:'https://www.disneyplus.com/ko-kr/browse/search?q=%EB%A9%94%EB%A6%AC%20%EB%B2%A0%EB%A6%AC%20%EB%9F%AC%EB%B8%8C',deepLink:'disneyplus://search?q=%EB%A9%94%EB%A6%AC%20%EB%B2%A0%EB%A6%AC%20%EB%9F%AC%EB%B8%8C'},
   {title:'《사기 설계자들: 로맨스 스캠》',type:'다큐 시리즈',schedule:'이번 주 공개 신작 · 디즈니+ 시리즈',genre:'글로벌 범죄 추적 다큐멘터리 · 3부작',contentUrl:'https://www.disneyplus.com/ko-kr/browse/search?q=%EC%82%AC%EA%B8%B0%20%EC%84%A4%EA%B3%84%EC%9E%90%EB%93%A4',deepLink:'disneyplus://search?q=%EC%82%AC%EA%B8%B0%20%EC%84%A4%EA%B3%84%EC%9E%90%EB%93%A4'},
   {title:'《킬러들의 쇼핑몰 시즌 2》',type:'시리즈',schedule:'디즈니+ 오리지널 기대작',genre:'스타일리시 액션 스릴러 · 이동욱·김혜준',contentUrl:'https://www.disneyplus.com/ko-kr/browse/search?q=%ED%82%AC%EB%9F%AC%EB%93%A4%EC%9D%98%20%EC%87%BC%ED%95%91%EB%AA%B0',deepLink:'disneyplus://search?q=%ED%82%AC%EB%9F%AC%EB%93%A4%EC%9D%98%20%EC%87%BC%ED%95%91%EB%AA%B0'},
   {title:'《재혼 황후》',type:'시리즈',schedule:'디즈니+ 오리지널 대작',genre:'판타지 로맨스 · 신민아·주지훈·이종석',contentUrl:'https://www.disneyplus.com/ko-kr/browse/search?q=%EC%9E%AC%ED%98%BC%20%ED%99%A9%ED%9B%84',deepLink:'disneyplus://search?q=%EC%9E%AC%ED%98%BC%20%ED%99%A9%ED%9B%84'}
  ]
 },
 {
  key:'apple',name:'애플 TV+',en:'Apple TV+',badgeColor:'#334155',
  primaryTitle:'《반다를 찾아서 시즌 2》 · 《텐징: 에베레스트 정복》',
  releases:[
   {title:'《반다를 찾아서 시즌 2》',type:'시리즈',schedule:'10월 공개 신작 · Apple Original',genre:'블랙 코미디 미스터리 시리즈',contentUrl:'https://tv.apple.com/kr/search?term=Where%27s%20Wanda',deepLink:'videos://search?term=Where%27s%20Wanda'},
   {title:'《텐징: 에베레스트 정복 (Tenzing)》',type:'영화',schedule:'10월 공개 신작 · Apple Original 영화',genre:'실화 어드벤처 · 톰 히들스턴·윌렘 데포',contentUrl:'https://tv.apple.com/kr/search?term=Tenzing',deepLink:'videos://search?term=Tenzing'},
   {title:'《매치박스 (Matchbox)》',type:'영화',schedule:'10월 공개 신작 · Apple Original 영화',genre:'액션 블록버스터 코미디 · 존 시나·제시카 비엘',contentUrl:'https://tv.apple.com/kr/search?term=Matchbox',deepLink:'videos://search?term=Matchbox'},
   {title:'《모나크: 레거시 오브 몬스터즈 시즌 2》',type:'시리즈',schedule:'Apple Original SF 대작 시리즈',genre:'몬스터버스 SF 액션 스릴러',contentUrl:'https://tv.apple.com/kr/search?term=Monarch',deepLink:'videos://search?term=Monarch'}
  ]
 }
];

function validOttPlatforms(){
 if(ottData&&ottData.schemaVersion>=3&&Array.isArray(ottData.platforms)&&ottData.platforms.length){
  return ottData.platforms;
 }
 return DEFAULT_OTT_PLATFORMS;
}

// --- Weekly Monday OTT New Releases Detail Modal ---
function ottDetail(){
 api.panel('이번 주말 OTT 신작 TV쇼 & 영화 가이드',function(p,b){
  p.classList.add('settings-dialog','ott-dialog');
  var header=el('div','modal-clean-header',p);
  var wkLabel=(ottData&&ottData.weekendLabel)?ottData.weekendLabel:'이번 주말';
  var monLabel=(ottData&&ottData.mondayLabel)?ottData.mondayLabel:'2026년 10월 이번주';
  text(header,'이번 주말('+wkLabel+') 4대 OTT 최신 신작 TV쇼 · 영화 타이틀','modal-clean-title');
  text(header,monLabel+' 실시간 업데이트 · 작품 타이틀을 누르면 해당 OTT의 작품 화면으로 바로 이동합니다!','settings-intro');

  var platforms=validOttPlatforms();

  var grid=el('div','ott-detail-grid',p);
  platforms.forEach(function(pf){
   var card=el('div','ott-detail-card ott-brand-'+pf.key,grid);
   var head=el('div','ott-detail-head',card);
   var badge=el('span','ott-platform-pill ott-pill-'+pf.key,head);
   badge.textContent=pf.name;
   var launchBtn=b(head,pf.name+' 홈 열기 ↗',function(){
    api.close();api.launchKey(pf.key);
   });
   launchBtn.className='ott-launch-btn';

   (pf.releases||[]).slice(0,3).forEach(function(rel){
    var dispTitle=rel.title.indexOf('《')===0?rel.title:('《'+rel.title+'》');
    var itemBtn=b(card,'',function(){
     api.close();
     if(api.launchDeepLink)api.launchDeepLink(pf.key,rel.contentUrl,rel.deepLink,dispTitle);
     else api.launchKey(pf.key);
    });
    itemBtn.className='ott-release-box ott-release-btn';
    var titleRow=el('div','ott-release-title-row',itemBtn);
    text(titleRow,dispTitle,'ott-release-title');
    var goTag=el('span','ott-link-badge',titleRow);
    goTag.textContent=(rel.type?rel.type+' · ':'')+'바로 보기 ↗';
    text(itemBtn,(rel.schedule||'이번 주말 공개')+' · '+(rel.genre||'신작'),'ott-release-meta');
   });
  });

  var foot=el('div','settings-chips',p);
  foot.style.marginTop='16px';
  b(foot,'🔄 최신 OTT 신작 다시 업데이트',function(){loadOtt(true);setTimeout(ottDetail,500);});
 });
}

// --- Real-Time Stock & Crypto Market Widget & Detail ---
function isDaytimeKST(){
 var h=new Date().getHours();
 return h>=7&&h<20;
}

function activeStockSession(){
 var mode=options().stockMode||'auto';
 if(mode==='kr')return 'kr';
 if(mode==='us')return 'us';
 if(mode==='crypto')return 'crypto';
 return isDaytimeKST()?'kr':'us';
}

function formatPrice(v,item){
 if(typeof v!=='number'||!isFinite(v)||v<=0)return '—';
 if(item&&(item.currency==='KRW'||(item.market==='CRYPTO'&&v>=1000))){
  return Math.round(v).toLocaleString('ko-KR')+'원';
 }
 if(item&&item.market==='CRYPTO'){
  return '$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 }
 return v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}

function formatCompactCrypto(item){
 if(!item||!(item.price>0))return '수신 중';
 if(item.currency==='KRW'||item.price>=100000){
  var man=item.price/10000;
  if(man>=10000){
   return (item.price/100000000).toFixed(2)+'억원';
  }
  return Math.round(man).toLocaleString('ko-KR')+'만원';
 }
 return '$'+Math.round(item.price).toLocaleString('en-US');
}

function buildSparklineSvg(points,dir,w,h){
 var width=w||120,height=h||38;
 var pts=Array.isArray(points)&&points.length>=2?points:[100,100.2,99.9,100.4,100.8];
 var minV=Math.min.apply(null,pts),maxV=Math.max.apply(null,pts);
 var span=Math.max(0.0001,maxV-minV);
 var pad=4;
 var coords=pts.map(function(v,i){
  var x=(i/(pts.length-1))*(width-pad*2)+pad;
  var y=pad+(1-(v-minV)/span)*(height-pad*2);
  return [x.toFixed(1),y.toFixed(1)];
 });
 var line='M '+coords.map(function(c){return c[0]+' '+c[1];}).join(' L ');
 var area=line+' L '+coords[coords.length-1][0]+' '+height+' L '+coords[0][0]+' '+height+' Z';
 var stroke=dir==='up'?'#FF5A5F':dir==='down'?'#3B82F6':'#94A3B8';
 var gradId='spk'+Math.floor(Math.random()*100000);
 var last=coords[coords.length-1];
 return '<svg class="stock-spark-svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" preserveAspectRatio="none" aria-hidden="true">'
  +'<defs><linearGradient id="'+gradId+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+stroke+'" stop-opacity="0.35"/><stop offset="100%" stop-color="'+stroke+'" stop-opacity="0.0"/></linearGradient></defs>'
  +'<path d="'+area+'" fill="url(#'+gradId+')"/>'
  +'<path d="'+line+'" fill="none" stroke="'+stroke+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
  +'<circle cx="'+last[0]+'" cy="'+last[1]+'" r="3" fill="'+stroke+'"/>'
  +'</svg>';
}

function getStockItem(key){
 var indices=(stockData&&stockData.indices)||{};
 if(indices[key]&&indices[key].price>0)return indices[key];
 var crypto=(stockData&&stockData.crypto)||{};
 if(crypto[key]&&crypto[key].price>0)return crypto[key];
 var names={kospi:'코스피',kosdaq:'코스닥',sp500:'S&P 500',nasdaq:'나스닥',btc:'비트코인',eth:'이더리움'};
 var isCrypto=(key==='btc'||key==='eth');
 return {
  key:key,name:names[key]||key,
  symbol:key==='btc'?'BTC':key==='eth'?'ETH':'',
  market:isCrypto?'CRYPTO':(key==='kospi'||key==='kosdaq')?'KR':'US',
  currency:isCrypto?'KRW':(key==='kospi'||key==='kosdaq')?'KRW':'USD',
  price:0,change:0,changePercent:0,dir:'flat',status:isCrypto?'24H LIVE':'연결 중',points:[]
 };
}

function stocksDetail(){
 api.panel('실시간 글로벌 증시 & 코인 동향',function(p,b){
  p.classList.add('settings-dialog','stocks-dialog');
  var session=activeStockSession();
  var modeLabel=options().stockMode==='kr'?'한국 증시 고정':options().stockMode==='us'?'미국 증시 고정':options().stockMode==='crypto'?'코인 동향 고정':'자동 전환 (낮 한국 · 밤 미국 + 하단 코인 동향)';
  var header=el('div','modal-clean-header',p);
  text(header,'한국 · 미국 실시간 지수 & 비트코인·이더리움 동향','modal-clean-title');
  text(header,getHumanStockComment()+' · 현재 위젯 모드: '+modeLabel,'settings-intro');

  var modeChips=el('div','settings-chips',p);
  [
   ['auto','자동 (낮 한국·밤 미국 + 코인 바)'],
   ['kr','🇰🇷 한국 증시 (코스피·코스닥)'],
   ['us','🇺🇸 미국 증시 (S&P 500·나스닥)'],
   ['crypto','🪙 코인 메인 (비트코인·이더리움)']
  ].forEach(function(m){
   var btn=b(modeChips,((options().stockMode||'auto')===m[0]?'✓ ':'')+m[1],function(){
    options().stockMode=m[0];persist();widgets();stocksDetail();
   });
   btn.setAttribute('aria-pressed',String((options().stockMode||'auto')===m[0]));
  });

  var grid=el('div','stocks-detail-grid',p);
  var order=session==='crypto'?['btc','eth','kospi','kosdaq','sp500','nasdaq']:session==='kr'?['kospi','kosdaq','btc','eth','sp500','nasdaq']:['sp500','nasdaq','btc','eth','kospi','kosdaq'];
  order.forEach(function(k){
   var item=getStockItem(k);
   var isCrypto=item.market==='CRYPTO'||k==='btc'||k==='eth';
   var card=el('div','stock-detail-card stock-'+item.dir+(isCrypto?' stock-crypto-card':''),grid);
   var top=el('div','stock-detail-top',card);
   var flag=isCrypto?(k==='btc'?'🪙 ':'💎 '):(item.market==='KR'?'🇰🇷 ':'🇺🇸 ');
   var labelTxt=flag+item.name+(item.symbol?(' ('+item.symbol+')'):'');
   text(top,labelTxt,'stock-detail-name');
   text(top,isCrypto?'24H 실시간 (업비트)':(item.status==='OPEN'||item.status==='REGULAR'?'실시간 장중':'장마감/시간외'),'stock-detail-badge');
   var mid=el('div','stock-detail-mid',card);
   text(mid,formatPrice(item.price,item),'stock-detail-price');
   var sign=item.dir==='up'?'▲ ':item.dir==='down'?'▼ ':'';
   var chgAbs=isCrypto&&item.currency==='KRW'?Math.round(Math.abs(item.change)).toLocaleString('ko-KR')+'원':Math.abs(item.change).toFixed(2);
   var chgStr=item.price>0?(sign+chgAbs+' ('+(item.changePercent>=0?'+':'')+item.changePercent.toFixed(2)+'%)'):'데이터 수신 중';
   text(mid,chgStr,'stock-detail-change '+item.dir);
   var chartBox=el('div','stock-detail-chart',card);
   chartBox.innerHTML=buildSparklineSvg(item.points,item.dir,340,64);
   if(isCrypto&&item.usdPrice>0){
    text(card,'글로벌 시세 $'+item.usdPrice.toLocaleString('en-US',{maximumFractionDigits:0})+' · 24시간 고가 '+formatPrice(item.high,item)+' / 저가 '+formatPrice(item.low,item),'stock-detail-range');
   }else if(item.humanComment){
    text(card,'💬 '+item.humanComment,'stock-detail-range');
   }else if(item.high>0&&item.low>0){
    text(card,'고가 '+formatPrice(item.high,item)+'  ·  저가 '+formatPrice(item.low,item),'stock-detail-range');
   }
  });

  var foot=el('div','settings-chips',p);
  foot.style.marginTop='18px';
  b(foot,'지금 새로고침',function(){loadStocks(true);});
  if(stockData&&stockData.fetchedAt){
   text(p,'마지막 업데이트: '+stamp(stockData.fetchedAt*1000)+' · 증시 및 코인 30초마다 실시간 자동 갱신','settings-intro');
  }
 });
}

var widgetNames={
 weather:'날씨 (기상청)',
 news:'연합뉴스 속보',
 stocks:'실시간 증시 & 코인',
 ott:'이번주말 OTT 신작',
 air:'미세먼지',
 clock:'큰 시계',
 recent:'최근 실행'
};

function widgetOrder(){
 var o=options();
 if(!Array.isArray(o.widgets))o.widgets=['weather','news','stocks','ott'];
 var seen={};
 o.widgets=o.widgets.map(function(k){return k==='trends'?'news':k;}).filter(function(k){
  if(!widgetNames[k]||seen[k])return false;
  seen[k]=true;return true;
 }).slice(0,4);
 return o.widgets;
}

function editWidgets(focusKey){
 api.panel('위젯 편집',function(p,b){
  p.classList.add('settings-dialog');
  text(p,'헤더와 앱 도크 사이에 최대 4개를 놓을 수 있습니다. 순서·크기·표시 여부는 프로필별로 저장합니다.','settings-intro');
  var current=widgetOrder();
  current.forEach(function(key,i){
   var row=document.createElement('div');row.className='manage-row widget-manage-row';
   var label=document.createElement('div');label.className='manage-label';
   var name=document.createElement('strong');name.textContent=widgetNames[key];label.appendChild(name);
   var hint=document.createElement('span');hint.textContent=(i+1)+'번째 위젯';label.appendChild(hint);
   row.appendChild(label);
   function action(t,id,fn,disabled){var elBtn=b(row,t,fn);elBtn.dataset.focus=id;elBtn.disabled=!!disabled;}
   action('←',key+'-left',function(){var x=current.splice(i,1)[0];current.splice(i-1,0,x);persist();widgets();editWidgets(key+'-left');},i===0);
   action('→',key+'-right',function(){var x=current.splice(i,1)[0];current.splice(i+1,0,x);persist();widgets();editWidgets(key+'-right');},i===current.length-1);
   if(!options().widgetSizes)options().widgetSizes={};
   action(options().widgetSizes[key]==='wide'?'기본 크기':'넓게',key+'-size',function(){
    options().widgetSizes[key]=options().widgetSizes[key]==='wide'?'normal':'wide';
    persist();widgets();editWidgets(key+'-size');
   });
   action('숨기기',key+'-hide',function(){current.splice(i,1);persist();widgets();editWidgets();});
   p.appendChild(row);
  });
  var title=document.createElement('h3');title.textContent='추가할 위젯';p.appendChild(title);
  var adds=document.createElement('div');adds.className='settings-chips';p.appendChild(adds);
  Object.keys(widgetNames).filter(function(k){return current.indexOf(k)<0;}).forEach(function(k){
   var add=b(adds,'＋ '+widgetNames[k],function(){
    if(current.length>=4)return;
    current.push(k);persist();widgets();editWidgets(k+'-size');
   });
   add.disabled=current.length>=4;
  });
 });
 if(focusKey){
  var focusEl=document.querySelector('#overlay [data-focus="'+focusKey+'"]:not(:disabled)');
  if(focusEl)focusEl.focus();
 }
}

function renderSceneGrid(parent,list,curScene,b){
 var grid=el('div','scene-choices',parent);
 list.forEach(function(pair){
  var id=pair[0],name=pair[1],desc=pair[2],thumb=pair[3];
  var isSel=(curScene===id);
  var btn=b(grid,'',function(){
   var o=options();
   o.scene=id;
   o.themeCollection='cleanframe';
   o.weatherScene=false;
   o.timedScene=false;
   if(o.saverTheme==='weather')o.saverTheme='sync';
   persist();apply();widgets();appearanceSettings();
  });
  btn.className='scene-choice-btn scene-choice-'+id;
  if(id==='cf-dark'){
   btn.style.background='linear-gradient(145deg,#1d2a30 0%,#0f171b 100%)';
  }else if(id==='cf-light'){
   btn.style.background='linear-gradient(145deg,#e7e5df 0%,#cfc9bc 100%)';
   btn.style.color='#141618';
   btn.style.textShadow='none';
  }else{
   btn.style.backgroundImage='linear-gradient(180deg,rgba(0,0,0,.10) 0%,rgba(6,16,26,.82) 100%),url("'+thumb+'")';
  }
  btn.setAttribute('aria-pressed',String(isSel));
  var tName=el('strong','scene-choice-title',btn);
  tName.textContent=name+(isSel?(options().weatherScene!==false?' (오늘 날씨) ✓':' ✓'):'');
  var tSub=el('small','scene-choice-sub',btn);
  tSub.textContent=desc;
 });
}

function appearanceSettings(){
 api.panel('🎨 테마 변경 · CleanFrame 공식 17종 갤러리',function(p,b){
  p.classList.add('settings-dialog','appearance-dialog');
  var o=options();
  var scene=document.body.dataset.scene||o.scene||'cf-misty';
  var meta=getSceneMeta(scene);
  text(p,'GitHub nthnclrk/CleanFrame 공식 17종 테마(15종 갤러리 명작 사진 + Slate Dark & Gallery Light)를 언제든 자유롭게 변경하세요.','settings-intro');

  var preview=document.createElement('div');
  preview.className='appearance-preview';
  if(scene==='cf-dark'){
   preview.style.background='linear-gradient(135deg,#1d2a30,#0f171b)';
  }else if(scene==='cf-light'){
   preview.style.background='linear-gradient(135deg,#e7e5df,#d5d0c5)';
   preview.style.color='#141618';
   preview.style.textShadow='none';
  }else{
   preview.style.backgroundImage='linear-gradient(120deg,rgba(8,18,28,.72),rgba(13,27,42,.38)),url("'+(meta.full||meta.thumb)+'")';
  }
  var wx=wxHelper(),cur=wx.getCurrent();
  var wxInfo=cur?wx.conditionInfo(cur.code,cur.day):{label:'맑음'};
  var condTxt=(cur&&cur.wfKor)||wxInfo.label;
  var modeName=o.weatherScene!==false?'☀ 오늘 날씨 맞춤 자동':(o.cfCycle&&o.cfCycle!=='fixed'?'🔄 자동 순환 모드':'📌 직접 선택 테마');
  var title=document.createElement('span');
  title.textContent='🖼️ '+meta.name+'  |  '+modeName+'  |  기상청('+condTxt+')';
  preview.appendChild(title);
  p.appendChild(preview);

  // Weather Auto Toggle Chip
  var tabRow=el('div','settings-chips',p);
  tabRow.style.marginTop='14px';
  var wxCfActive=(o.weatherScene!==false);
  var btnWxCf=b(tabRow,(wxCfActive?'✓ ':'')+'🌤️ 오늘 날씨 맞춤 자동 배경 '+(wxCfActive?'켜짐':'꺼짐'),function(){
   o.weatherScene=!wxCfActive;o.themeCollection='cleanframe';o.timedScene=false;
   persist();apply();widgets();appearanceSettings();
  });
  btnWxCf.setAttribute('aria-pressed',String(wxCfActive));

  // CleanFrame Look & Material Controls
  var hLook=el('h3','',p);hLook.textContent='CleanFrame 스타일 · 유리 재질(Material) · 앱 도크 설정';
  var lookGrid=el('div','appearance-options',p);

  var matLabels={soft:'Soft (부드러운 유리)',frost:'Frost (프로스트 베일)',tint:'Clear Tint (클리어 틴트)'};
  var matOrder=['soft','frost','tint'];
  var curMat=o.cfMaterial||'soft';
  b(lookGrid,'도크/카드 유리 재질: '+(matLabels[curMat]||matLabels.soft),function(){
   o.cfMaterial=matOrder[(matOrder.indexOf(curMat)+1)%matOrder.length];
   persist();apply();appearanceSettings();
  });

  var appLabels={both:'아이콘 + 이름',icons:'아이콘만 (CleanFrame 미니멀)',text:'텍스트만 (타이포 도크)'};
  var appOrder=['both','icons','text'];
  var curApps=o.cfApps||'both';
  b(lookGrid,'하단 앱 도크 표시: '+(appLabels[curApps]||appLabels.both),function(){
   o.cfApps=appOrder[(appOrder.indexOf(curApps)+1)%appOrder.length];
   persist();apply();appearanceSettings();
  });

  var cycLabels={fixed:'고정 (직접 선택)',open:'홈 열 때마다 다음 테마','5':'5분마다 자동 순환','15':'15분마다 자동 순환','60':'1시간마다 자동 순환'};
  var cycOrder=['fixed','open','5','15','60'];
  var curCyc=o.cfCycle||'fixed';
  b(lookGrid,'배경 순환 주기: '+(cycLabels[curCyc]||cycLabels.fixed),function(){
   o.cfCycle=cycOrder[(cycOrder.indexOf(curCyc)+1)%cycOrder.length];
   if(o.cfCycle!=='fixed')o.weatherScene=false;
   lastCfCycleAt=Date.now();
   persist();apply();appearanceSettings();
  });

  var fontLabels={sans:'모던 산세리프 (Manrope)',serif:'갤러리 세리프 (The Frame)'};
  var fontOrder=['sans','serif'];
  var curFont=o.fontStyle||'sans';
  b(lookGrid,'시계/텍스트 글꼴: '+(fontLabels[curFont]||fontLabels.sans),function(){
   o.fontStyle=fontOrder[(fontOrder.indexOf(curFont)+1)%fontOrder.length];
   persist();apply();appearanceSettings();
  });

  var hCf=el('h3','',p);
  hCf.textContent='🖼️ CleanFrame 공식 테마 컬렉션 (17종 · GitHub nthnclrk/CleanFrame)';
  renderSceneGrid(p,CLEANFRAME_SCENES,scene,b);

  var hOpt=el('h3','',p);hOpt.textContent='날씨 맞춤 & 스크린세이버 연동';
  var controls=document.createElement('div');controls.className='appearance-options';p.appendChild(controls);
  [['weatherScene','오늘 날씨에 맞춰 배경 자동 변경'],['autoNight','밤에는 화면 어둡게'],['saverNewsTicker','스크린세이버 하단 뉴스 티커']].forEach(function(pair){
   var isOn=o[pair[0]]!==false;
   var elBtn=b(controls,pair[1]+'  '+(isOn?'켜짐 ✓':'꺼짐'),function(){
    o[pair[0]]=!isOn;
    if(pair[0]==='weatherScene'&&o.weatherScene)o.timedScene=false;
    persist();apply();widgets();appearanceSettings();
   });
   elBtn.setAttribute('aria-pressed',String(isOn));
  });
  b(controls,'스크린세이버도 현재 홈 테마와 동기화',function(){
   o.saverTheme='sync';persist();apply();appearanceSettings();
  });
  b(controls,'스크린세이버를 CleanFrame 15종 순환으로 설정',function(){
   o.saverTheme='cf-auto';persist();apply();appearanceSettings();
  });
  b(controls,'스크린세이버 상세 설정 열기 ↗',saverSettings);
 });
}

function widgets(){
 var root=document.getElementById('widgets');
 if(!root)return;
 var old=document.activeElement&&document.activeElement.getAttribute('data-widget');
 root.textContent='';
 var order=widgetOrder();
 var sizes=options().widgetSizes||{};
 root.style.gridTemplateColumns=order.map(function(k){
  if(sizes[k]==='wide')return '1.45fr';
  var base=k==='news'?1.22:k==='ott'?1.18:k==='weather'?1.12:k==='stocks'?1.14:1;
  return base.toFixed(2)+'fr';
 }).join(' ');
 root.dataset.count=String(order.length);

 order.forEach(function(key){
  var card;
  if(key==='weather'){
   card=createCard('weather-card','개포동 기상청 날씨',function(b){
    var wx=wxHelper(),cur=wx.getCurrent(),f=data.forecast||(cur&&cur.fullForecast);
    var cTemp=cur?cur.temperature:(f&&f.current?f.current.temperature_2m:null);
    var cCode=cur?cur.code:(f&&f.current?f.current.weather_code:0);
    var cDay=cur?cur.day:(f&&f.current?f.current.is_day===1:true);
    var info=wx.conditionInfo(cCode,cDay);
    var condTxt=(cur&&cur.wfKor)||(f&&f.current&&f.current.wfKor)||info.label;
    b.dataset.wxKind=info.kind;

    var top=el('div','aw-card-top',b);
    var left=el('div','aw-card-left',top);
    text(left,'개포동 · 기상청 ↗','aw-loc');
    text(left,cTemp!==null?Math.round(cTemp)+'°':'—°','aw-temp');
    var right=el('div','aw-card-right',top);
    var iconBox=el('div','aw-card-icon',right);
    iconBox.innerHTML=wx.svgIcon(cCode,cDay,48);
    text(right,condTxt,'aw-cond');
    var low=f&&f.daily&&f.daily.temperature_2m_min?Math.round(f.daily.temperature_2m_min[0]):null;
    var high=f&&f.daily&&f.daily.temperature_2m_max?Math.round(f.daily.temperature_2m_max[0]):null;
    text(right,high!==null?('최고:'+high+'° 최저:'+low+'°'):'기상청 실시간','aw-hilow');

    var strip=el('div','aw-mini-hourly',b);
    if(f&&f.hourly&&Array.isArray(f.hourly.time)&&f.hourly.time.length){
     for(var i=0;i<Math.min(4,f.hourly.time.length);i++){
      var col=el('div','aw-mini-col',strip);
      var ht=f.hourly.time[i];
      text(col,i===0?'지금':new Date(ht*1000).getHours()+'시','aw-mini-time');
      var mic=el('div','aw-mini-icon',col);
      var hCode=f.hourly.weather_code?f.hourly.weather_code[i]:cCode;
      var hDay=f.hourly.is_day?f.hourly.is_day[i]===1:cDay;
      mic.innerHTML=wx.svgIcon(hCode,hDay,22);
      text(col,Math.round(f.hourly.temperature_2m[i])+'°','aw-mini-temp');
     }
    }else{
     text(strip,info.summary+' · 기상청 시간별/주간 예보','aw-mini-placeholder');
    }

    var hb=getHumanWeatherBriefing();
    var foot=el('div','aw-card-foot',b);
    text(foot,hb.comparisonText+' · '+hb.outfitText,'widget-source');
   },weatherDetail);
  }

  // --- Rebuilt Apple-Style Yonhap News (연합뉴스 실시간 속보) Widget ---
  if(key==='news'){
   card=createCard('news-card yna-apple-card','연합뉴스 실시간 속보',function(b){
    var headRow=el('div','yna-header-bar',b);
    var brandLeft=el('div','yna-brand-left',headRow);
    var logoBadge=el('span','yna-logo-pill',brandLeft);
    logoBadge.textContent='연합뉴스';
    var subTitle=el('span','yna-sub-label',brandLeft);
    subTitle.textContent='실시간 속보';

    var liveRight=el('span','yna-live-pill',headRow);
    var brkCnt=(newsData&&typeof newsData.breakingCount==='number')?newsData.breakingCount:0;
    liveRight.innerHTML='<span class="live-dot yna-red-dot"></span>'+(brkCnt>0?('속보 '+brkCnt+'건'):'LIVE');

    if(newsData&&newsData.items&&newsData.items.length){
     var listWrap=el('div','yna-list-wrap',b);
     newsData.items.slice(0,3).forEach(function(item){
      var row=el('div','yna-item-row',listWrap);
      var isBrk=item.breaking||item.tag==='속보'||item.tag==='긴급';
      var tagEl=el('span','yna-tag '+(isBrk?'yna-tag-breaking':item.tag==='단독'?'yna-tag-excl':'yna-tag-live'),row);
      tagEl.textContent=item.tag||(isBrk?'속보':'실시간');
      text(row,item.title,'yna-item-title');
      var ago=item.ago||relTimeKo(item.publishedAt);
      if(ago)text(row,ago,'yna-item-ago');
     });
     text(b,'연합뉴스 실시간 피드 · '+(newsData.stale?'이전 데이터 · ':'')+stamp(newsData.fetchedAt*1000)+' 기준','widget-source');
    }else{
     text(b,data.newsFailed?'연합뉴스 연결 안 됨':'실시간 속보 불러오는 중…','news-headline');
     text(b,'연합뉴스 실시간 속보 위젯','widget-source');
    }
   },newsDetail);
  }

  if(key==='stocks'){
   card=createCard('stocks-card','실시간 증시 & 코인',function(b){
    var session=activeStockSession();
    var isCryptoMode=session==='crypto';
    var isKr=session==='kr';
    var primaryKeys=isCryptoMode?['btc','eth']:(isKr?['kospi','kosdaq']:['sp500','nasdaq']);

    var headRow=el('div','widget-title-row',b);
    text(headRow,isCryptoMode?'🪙 코인 · 증시':(isKr?'🇰🇷 한국 증시 · 코인':'🇺🇸 미국 증시 · 코인'),'widget-heading');
    var badge=el('span','stock-session-pill',headRow);
    badge.innerHTML='<span class="live-dot"></span>'+(isCryptoMode?'24H · BTC/ETH':(isKr?'낮 · 코스피/코스닥':'밤 · S&P500/나스닥'));

    var rowsWrap=el('div','stock-rows-wrap',b);
    primaryKeys.forEach(function(k){
     var item=getStockItem(k);
     var isC=item.market==='CRYPTO'||k==='btc'||k==='eth';
     var row=el('div','stock-item-row stock-'+item.dir,rowsWrap);
     var metaCol=el('div','stock-meta-col',row);
     text(metaCol,(isC?(k==='btc'?'🪙 ':'💎 '):'')+item.name,'stock-name');
     text(metaCol,item.price>0?(isC?'24H 실시간':(item.status==='OPEN'||item.status==='REGULAR'?'실시간':'장마감')):'수신 중','stock-sub');
     var sparkCol=el('div','stock-spark-col',row);
     sparkCol.innerHTML=buildSparklineSvg(item.points,item.dir,78,24);
     var valCol=el('div','stock-val-col',row);
     text(valCol,formatPrice(item.price,item),'stock-price');
     var sign=item.dir==='up'?'▲ ':item.dir==='down'?'▼ ':'';
     var chgAbs=isC&&item.currency==='KRW'?Math.round(Math.abs(item.change)).toLocaleString('ko-KR')+'원':Math.abs(item.change).toFixed(2);
     var pctTxt=item.price>0?(sign+chgAbs+' ('+(item.changePercent>=0?'+':'')+item.changePercent.toFixed(2)+'%)'):'—';
     text(valCol,pctTxt,'stock-change '+item.dir);
    });

    // Live Crypto Trend Bar (BTC / ETH) when in KR or US stock mode (or KR/US summary when in Crypto mode)
    var cryptoStrip=el('div','crypto-strip',b);
    var subKeys=isCryptoMode?(isDaytimeKST()?['kospi','kosdaq']:['sp500','nasdaq']):['btc','eth'];
    subKeys.forEach(function(ck){
     var cItem=getStockItem(ck);
     var pill=el('div','crypto-pill crypto-'+cItem.dir,cryptoStrip);
     var icon=ck==='btc'?'🪙 BTC':ck==='eth'?'💎 ETH':cItem.name;
     text(pill,icon,'crypto-pill-sym');
     var priceStr=(ck==='btc'||ck==='eth')?formatCompactCrypto(cItem):formatPrice(cItem.price,cItem);
     text(pill,priceStr,'crypto-pill-price');
     var cSign=cItem.dir==='up'?'▲':cItem.dir==='down'?'▼':'';
     var cPct=cItem.price>0?(cSign+(cItem.changePercent>=0?'+':'')+cItem.changePercent.toFixed(2)+'%'):'—';
     text(pill,cPct,'crypto-pill-chg '+cItem.dir);
    });
   },stocksDetail);
  }

  // --- Weekly Monday Weekend OTT New Releases Widget ---
  if(key==='ott'){
   card=createCard('ott-card','이번 주말 OTT 신작',function(b){
    var isMon=new Date().getDay()===1||(ottData&&ottData.isMonday);
    var wkTxt=(ottData&&ottData.weekendLabel)?ottData.weekendLabel:'이번 주말';
    var headRow=el('div','widget-title-row',b);
    text(headRow,'🎬 이번 주말 OTT 신작','widget-heading');
    var badge=el('span','ott-week-badge'+(isMon?' is-monday':''),headRow);
    badge.textContent=isMon?'월요일 신작 알림':wkTxt;

    var listWrap=el('div','ott-widget-list',b);
    var pfs=validOttPlatforms();
    pfs.slice(0,4).forEach(function(pf){
     var row=el('div','ott-widget-row',listWrap);
     var pill=el('span','ott-mini-pill ott-pill-'+pf.key,row);
     pill.textContent=pf.name;
     var titleLine=pf.primaryTitle||((pf.releases||[]).slice(0,2).map(function(r){return r.title;}).join(' · '))||'신작 정보 확인';
     text(row,titleLine,'ott-widget-title');
    });
    var monBase=(ottData&&ottData.mondayLabel)?(ottData.mondayLabel+' 기준 · '):'매주 월요일 업데이트 · ';
    text(b,monBase+'타이틀 선택 시 해당 OTT 작품으로 바로 이동 ↗','widget-source');
   },ottDetail);
  }

  if(key==='recent'){
   var rec=profile().recent||[];
   card=createCard('recent-card','최근 실행',function(b){
    text(b,'최근 실행','widget-heading');
    text(b,rec.length?rec[0].name:'즐겨찾기에서 시작','recent-title');
    text(b,rec.length?'바로 열기':'앱을 실행하면 여기에 표시됩니다.','widget-sub');
    text(b,state.active+' 프로필','widget-source');
   },function(){if(rec.length)api.launchKey(rec[0].key);});
  }
  if(key==='air'){
   card=createCard('air-card','개포동 미세먼지',function(b){
    text(b,'개포동 미세먼지','widget-heading');
    var c=data.air&&data.air.current;
    var g=airGrade(c?c.pm2_5:null);
    text(b,c?(g.label+' · PM2.5 '+Math.round(c.pm2_5)):'연결 중','widget-temperature');
    text(b,c?'PM10 '+Math.round(c.pm10)+' μg/m³':'데이터를 불러오고 있습니다.','widget-sub');
    text(b,'대기질 실시간 정보'+(data.airStale?' · 이전 데이터':''),'widget-source');
   },airDetail);
  }
  if(key==='clock'){
   card=createCard('clock-card','지금 이 순간',function(b){
    text(b,'지금 이 순간','widget-heading');
    text(b,new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}),'widget-temperature');
    text(b,new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long'}),'widget-sub');
    text(b,'선택하면 대기화면','widget-source');
   },api.clock);
  }
  if(card){
   card.dataset.widget=key;
  }
 });

 if(!order.length){
  root.style.gridTemplateColumns='1fr';
  createCard('empty-widget','나만의 홈',function(b){
   text(b,'나만의 홈','widget-heading');
   text(b,'＋ 위젯 추가','widget-temperature');
   text(b,'이 공간을 원하는 정보로 채워보세요.','widget-sub');
  },editWidgets);
 }
 if(old){
  var target=root.querySelector('[data-widget="'+old+'"]');
  if(target)target.focus();
 }
}

function request(url,done,fail){
 var x=new XMLHttpRequest();
 x.open('GET',url,true);
 x.timeout=10000;
 x.onload=function(){
  try{if(x.status!==200)throw new Error('HTTP');done(JSON.parse(x.responseText));}catch(e){if(fail)fail();}
 };
 x.onerror=x.ontimeout=function(){if(fail)fail();};
 x.send();
}

function loadCache(key){try{return JSON.parse(localStorage.getItem(key));}catch(e){return null;}}
function store(key,d){try{localStorage.setItem(key,JSON.stringify(d));}catch(e){}}

function loadWeather(){
 var kmaKey='';
 try{kmaKey=localStorage.getItem('cleanm7-kma-authkey')||'';}catch(e){}
 var q=kmaKey?('?authKey='+encodeURIComponent(kmaKey)):'';
 var urls=[
  CLEANM7_BRIDGE+'/api/weather'+q,
  'http://127.0.0.1:18766/api/weather'+q,
  'https://api.open-meteo.com/v1/forecast?latitude=37.48&longitude=127.06&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,uv_index,is_day&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&forecast_days=7&timeformat=unixtime&timezone=Asia%2FSeoul'
 ];
 var idx=0;
 function tryNext(){
  if(idx>=urls.length){data.weatherStale=true;widgets();return;}
  var u=urls[idx++];
  request(u,function(d){
   if(!d.current||!d.daily||!d.hourly||typeof d.current.temperature_2m!=='number'){
    tryNext();return;
   }
   var first=d.hourly.time.findIndex(function(t){return t>=Date.now()/1000-1800;});
   first=Math.max(0,first);
   ['time','temperature_2m','precipitation_probability','weather_code','is_day','wfKor'].forEach(function(k){
    if(Array.isArray(d.hourly[k]))d.hourly[k]=d.hourly[k].slice(first,first+10);
   });
   data.forecast=d;
   data.weatherFetchedAt=Date.now();
   data.weatherStale=false;
   if(window.cleanM7Weather&&window.cleanM7Weather.setFromForecast){
    window.cleanM7Weather.setFromForecast(d);
   }
   store('cleanm7-detail-weather-v2',{value:d,fetchedAt:data.weatherFetchedAt});
   apply();
   widgets();
  },tryNext);
 }
 tryNext();
}

function loadAir(){
 request('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=37.48&longitude=127.06&current=pm10,pm2_5&timeformat=unixtime&timezone=Asia%2FSeoul',function(d){
  if(!d.current||typeof d.current.pm10!=='number'||typeof d.current.pm2_5!=='number'){data.airStale=true;widgets();return;}
  data.air=d;
  data.airStale=Date.now()-d.current.time*1000>3600000;
  store('cleanm7-air',{value:d,fetchedAt:Date.now()});
  widgets();
 },function(){data.airStale=true;widgets();});
}

function loadNews(){
 var urls=[CLEANM7_BRIDGE+'/api/news','http://127.0.0.1:18766/api/news'];
 request(urls[0],function(d){
  if(!Array.isArray(d.items))return;
  newsData=d;data.newsFailed=false;
  if(d.fetchedAt&&Date.now()/1000-d.fetchedAt>900)newsData.stale=true;
  store('cleanm7-news',d);updateSaverTicker();widgets();
 },function(){
  request(urls[1],function(d){
   if(!Array.isArray(d.items))return;
   newsData=d;data.newsFailed=false;
   store('cleanm7-news',d);updateSaverTicker();widgets();
  },function(){
   data.newsFailed=true;if(newsData)newsData.stale=true;updateSaverTicker();widgets();
  });
 });
}

function fetchDirectOtt(){
 var basePlatforms=JSON.parse(JSON.stringify(DEFAULT_OTT_PLATFORMS));
 ottData={
  schemaVersion:3,
  source:'2026년 10월 실시간 OTT 신작 & JustWatch KR 연동',
  fetchedAt:Date.now()/1000,
  mondayLabel:'10월 19일(월)',
  weekendLabel:'10/24(토)~10/25(일)',
  platforms:basePlatforms
 };
 store('cleanm7-ott-v3',ottData);
 widgets();
}

function loadOtt(force){
 var q=force?'?force=1':'';
 var urls=[CLEANM7_BRIDGE+'/api/ott'+q,'http://127.0.0.1:18766/api/ott'+q];
 request(urls[0],function(d){
  if(!d||!Array.isArray(d.platforms)||d.schemaVersion<3){fetchDirectOtt();return;}
  ottData=d;store('cleanm7-ott-v3',d);widgets();
 },function(){
  request(urls[1],function(d){
   if(!d||!Array.isArray(d.platforms)||d.schemaVersion<3){fetchDirectOtt();return;}
   ottData=d;store('cleanm7-ott-v3',d);widgets();
  },fetchDirectOtt);
 });
}

function parseNum(v){
 if(typeof v==='number')return v;
 if(!v)return 0;
 var n=parseFloat(String(v).replace(/,/g,'').replace(/\+/g,''));
 return isFinite(n)?n:0;
}

function fetchDirectStocks(){
 var specs=[
  {key:'kospi',name:'코스피',market:'KR',naver:'https://m.stock.naver.com/api/index/KOSPI/basic',yahoo:'https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?interval=5m&range=1d'},
  {key:'kosdaq',name:'코스닥',market:'KR',naver:'https://m.stock.naver.com/api/index/KOSDAQ/basic',yahoo:'https://query1.finance.yahoo.com/v8/finance/chart/%5EKQ11?interval=5m&range=1d'},
  {key:'sp500',name:'S&P 500',market:'US',naver:'https://api.stock.naver.com/index/.INX/basic',yahoo:'https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=5m&range=1d'},
  {key:'nasdaq',name:'나스닥',market:'US',naver:'https://api.stock.naver.com/index/.IXIC/basic',yahoo:'https://query1.finance.yahoo.com/v8/finance/chart/%5EIXIC?interval=5m&range=1d'}
 ];
 if(!stockData)stockData={source:'실시간 지수',fetchedAt:Date.now()/1000,indices:{},crypto:{}};
 if(!stockData.crypto)stockData.crypto={};
 specs.forEach(function(sp){
  request(sp.yahoo,function(yd){
   var res=yd&&yd.chart&&yd.chart.result&&yd.chart.result[0];
   if(!res)return;
   var meta=res.meta||{};
   var price=parseNum(meta.regularMarketPrice);
   var prev=parseNum(meta.chartPreviousClose||meta.previousClose);
   var closes=(res.indicators&&res.indicators.quote&&res.indicators.quote[0]&&res.indicators.quote[0].close)||[];
   var pts=closes.filter(function(c){return typeof c==='number'&&isFinite(c);});
   if(pts.length>24){
    var step=Math.max(1,Math.floor(pts.length/24));
    pts=pts.filter(function(_,idx){return idx%step===0;}).slice(-24);
   }
   if(price>0){
    var chg=prev>0?(price-prev):0;
    var pct=prev>0?(chg/prev*100):0;
    stockData.indices[sp.key]={
     key:sp.key,name:sp.name,market:sp.market,
     price:price,change:chg,changePercent:pct,
     dir:chg>0.001?'up':chg<-0.001?'down':'flat',
     status:String(meta.marketState||'REGULAR').toUpperCase(),
     high:parseNum(meta.regularMarketDayHigh)||(pts.length?Math.max.apply(null,pts):price),
     low:parseNum(meta.regularMarketDayLow)||(pts.length?Math.min.apply(null,pts):price),
     points:pts
    };
    stockData.fetchedAt=Date.now()/1000;
    store('cleanm7-stocks-v3',stockData);
    widgets();
   }
  },function(){
   request(sp.naver,function(nb){
    var price=parseNum(nb.closePrice);
    if(price<=0)return;
    var chg=parseNum(nb.compareToPreviousClosePrice);
    var pct=parseNum(nb.fluctuationsRatio);
    var code=nb.compareToPreviousPrice&&String(nb.compareToPreviousPrice.code);
    if((code==='4'||code==='5')&&chg>0)chg=-chg;
    if((code==='4'||code==='5')&&pct>0)pct=-pct;
    var dir=(code==='1'||code==='2'||chg>0)?'up':(code==='4'||code==='5'||chg<0)?'down':'flat';
    var base=price-chg;
    var pts=[];for(var i=0;i<=10;i++)pts.push(Number((base+chg*(i/10)).toFixed(2)));
    stockData.indices[sp.key]={
     key:sp.key,name:sp.name,market:sp.market,
     price:price,change:chg,changePercent:pct,
     dir:dir,status:String(nb.marketStatus||'CLOSE').toUpperCase(),
     high:price,low:price,points:pts
    };
    stockData.fetchedAt=Date.now()/1000;
    store('cleanm7-stocks-v3',stockData);
    widgets();
   });
  });
 });
 // Direct Upbit Crypto Fallback (BTC & ETH)
 request('https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH',function(arr){
  if(!Array.isArray(arr))return;
  var map={
   'KRW-BTC':{key:'btc',name:'비트코인',symbol:'BTC'},
   'KRW-ETH':{key:'eth',name:'이더리움',symbol:'ETH'}
  };
  arr.forEach(function(tk){
   var info=map[tk.market];
   if(!info)return;
   var price=parseNum(tk.trade_price);
   if(price<=0)return;
   var chg=parseNum(tk.signed_change_price);
   var pct=parseNum(tk.signed_change_rate)*100;
   var dir=chg>0?'up':chg<0?'down':'flat';
   var base=price-chg;
   var pts=[];for(var i=0;i<=12;i++)pts.push(Math.round(base+chg*(i/12)));
   var itemObj={
    key:info.key,name:info.name,symbol:info.symbol,market:'CRYPTO',currency:'KRW',
    price:price,change:chg,changePercent:Number(pct.toFixed(2)),
    dir:dir,status:'24H LIVE',
    high:parseNum(tk.high_price)||price,
    low:parseNum(tk.low_price)||price,
    points:pts
   };
   stockData.indices[info.key]=itemObj;
   stockData.crypto[info.key]=itemObj;
  });
  stockData.fetchedAt=Date.now()/1000;
  store('cleanm7-stocks-v3',stockData);
  widgets();
 });
}

function loadStocks(){
 var urls=[CLEANM7_BRIDGE+'/api/stocks','http://127.0.0.1:18766/api/stocks'];
 request(urls[0],function(d){
  if(d&&d.indices&&Object.keys(d.indices).length){
   stockData=d;store('cleanm7-stocks-v3',d);widgets();
  }else{fetchDirectStocks();}
 },function(){
  request(urls[1],function(d){
   if(d&&d.indices&&Object.keys(d.indices).length){
    stockData=d;store('cleanm7-stocks-v3',d);widgets();
   }else{fetchDirectStocks();}
  },fetchDirectStocks);
 });
}

setInterval(function(){
 var saverEl=document.getElementById('saver');
 if(!saverEl||saverEl.hidden)return;
 var st=options().saverTheme||'weather';
 if(st==='weather'){
  saverEl.dataset.scene=getWeatherScene();
  applySaverState();
 }else if((st==='auto'||st==='cf-auto')&&Date.now()-saverSceneAt>60000){
  var cfPhotos=CLEANFRAME_SCENES.filter(function(s){return !!s[4];});
  var nextCf=cfPhotos[saverSceneIndex++%cfPhotos.length];
  saverEl.dataset.scene=nextCf[0];
  saverEl.style.setProperty('--saver-wallpaper','url("'+nextCf[4]+'")');
  saverSceneAt=Date.now();
 }else if(st==='sync'){
  saverEl.dataset.scene=document.body.dataset.scene||options().scene||'cf-misty';
  applySaverState();
 }
 renderSaverWeather();
},10000);

var cached=loadCache('cleanm7-detail-weather-v2')||loadCache('cleanm7-detail-weather');
if(cached&&cached.value&&cached.value.current&&cached.value.daily&&cached.value.hourly){
 data.forecast=cached.value;data.weatherFetchedAt=cached.fetchedAt;data.weatherStale=Date.now()-cached.fetchedAt>3600000;
 if(window.cleanM7Weather&&window.cleanM7Weather.setFromForecast){
  window.cleanM7Weather.setFromForecast(data.forecast);
 }
}
cached=loadCache('cleanm7-air');
if(cached&&cached.value&&cached.value.current){
 data.air=cached.value;data.airStale=Date.now()-cached.fetchedAt>3600000;
}
newsData=loadCache('cleanm7-news');
if(newsData&&!Array.isArray(newsData.items))newsData=null;
if(newsData&&Date.now()/1000-newsData.fetchedAt>900)newsData.stale=true;
stockData=loadCache('cleanm7-stocks-v3')||loadCache('cleanm7-stocks-v2');
ottData=loadCache('cleanm7-ott-v3');

document.addEventListener('cleanm7-launch',function(e){
 var list=profile().recent||[];
 list=list.filter(function(x){return x.key!==e.detail.key;});
 list.unshift({key:e.detail.key,name:e.detail.name,time:Date.now()});
 profile().recent=list.slice(0,5);
 persist();widgets();
});
document.addEventListener('cleanm7-render',function(){ensureTools();widgets();});
document.addEventListener('cleanm7-cinema-exit',function(){options().cinema=false;persist();});
document.addEventListener('cleanm7-weather-updated',function(){apply();widgets();});

var saver=document.getElementById('saver-content');
var saverWeather=document.createElement('div');
saverWeather.id='saver-weather';
saver.appendChild(saverWeather);

setInterval(function(){
 apply();
 renderSaverWeather();
},30000);

var lastFetch=0;
function loadAll(){
 if(document.hidden)return;
 lastFetch=Date.now();
 loadWeather();
 loadAir();
 loadNews();
 loadStocks();
 loadOtt(false);
}

document.addEventListener('visibilitychange',function(){
 if(!document.hidden){
  if(options().cfCycle==='open'&&options().weatherScene===false){
   advanceCleanFrameCycle();
  }
  apply();
  if(Date.now()-lastFetch>900000)loadAll();
  else{loadNews();loadStocks();}
 }
});

if(options().cfCycle==='open'&&options().weatherScene===false){
 advanceCleanFrameCycle();
}
ensureTools();
updateSaverTicker();
widgets();
loadAll();
setInterval(function(){if(!document.hidden)loadAll();},900000);
setInterval(function(){if(!document.hidden)loadNews();},45000);
setInterval(function(){if(!document.hidden)loadStocks();},30000);

window.cleanM7Extras={
 settings:settings,
 saverSettings:saverSettings,
 weather:weatherDetail,
 air:airDetail,
 news:newsDetail,
 stocks:stocksDetail,
 ott:ottDetail,
 editWidgets:editWidgets,
 appearance:appearanceSettings,
 switchProfile:switchProfile,
 refresh:loadAll
};
}());
