(function () {
'use strict';
var catalog=[{key:'youtube',name:'YouTube',match:/^youtube$/i,color:'#6b2429'},{key:'netflix',name:'Netflix',match:/^netflix$/i,color:'#552331'},{key:'apple',name:'Apple TV',match:/^apple\s*tv(?:\+)?$/i,color:'#34464c'},{key:'coupang',name:'Coupang Play',match:/^(coupang\s*play|쿠팡플레이)$/i,color:'#124a63'},{key:'disney',name:'Disney+',match:/^(disney\s*\+|disneyplus|디즈니\s*\+)$/i,color:'#143b60'}];
var cfg={theme:'valley',reduced:false,order:['youtube','netflix','apple','coupang','disney'],idle:true};
try{var saved=JSON.parse(localStorage.getItem('cleanm7-settings'));if(saved){cfg.theme='valley';cfg.reduced=saved.reduced===true;cfg.idle=saved.idle!==false;if(Array.isArray(saved.order)){var seen={};var order=saved.order.filter(function(k){if(!catalog.some(function(c){return c.key===k;})||seen[k])return false;seen[k]=true;return true;});if(order.length)cfg.order=order;}}}catch(e){}
var onTV=typeof tizen!=='undefined'&&tizen.application,installed=[],selected=0,modal=false,lastActivity=Date.now(),sleeping=false,lastDrift=0;
try{selected=Math.max(0,Math.min(cfg.order.length-1,Number(localStorage.getItem('selected'))||0));}catch(e){}
function save(){try{localStorage.setItem('cleanm7-settings',JSON.stringify(cfg));}catch(e){message('설정을 저장하지 못했습니다.');}}
function message(s){document.getElementById('status').textContent=s;}
function favourites(){return cfg.order.map(function(k){return catalog.filter(function(c){return c.key===k;})[0];});}
function findApp(f){return installed.filter(function(a){return a.show!==false&&!/dummy|preview|service/i.test(a.id)&&f.match.test(a.name);}).sort(function(a,b){return (a.id.indexOf('com.samsung.tv.cobalt-yt')===0?1:0)-(b.id.indexOf('com.samsung.tv.cobalt-yt')===0?1:0);})[0];}
function appearance(){cfg.theme='valley';document.body.setAttribute('data-theme','valley');document.body.classList.add('enhanced');document.body.classList.toggle('reduced',cfg.reduced);}
function focus(i){var b=document.querySelectorAll('#apps button');selected=Math.max(0,Math.min(b.length-1,i));if(b[selected])b[selected].focus();try{localStorage.setItem('selected',String(selected));}catch(e){}}
function launch(f){if(!onTV){message(f.name+'은 모니터에서 실행할 수 있습니다.');return;}var a=findApp(f);if(!a){message(f.name+'이 설치되지 않았습니다. 삼성 앱에서 설치해 주세요.');return;}message(f.name+' 실행 중…');try{tizen.application.launch(a.id,function(){document.dispatchEvent(new CustomEvent('cleanm7-launch',{detail:{key:f.key,name:f.name}}));message('');},function(e){message(f.name+' 실행 실패: '+e.message);});}catch(e){message(e.message);}}
function button(parent,label,fn){var b=document.createElement('button');b.textContent=label;b.onclick=function(){lastActivity=Date.now();fn();};parent.appendChild(b);return b;}
function render(){var nav=document.getElementById('apps');nav.textContent='';favourites().forEach(function(f,i){var b=button(nav,'',function(){focus(i);launch(f);});b.setAttribute('aria-label',f.name);var app=findApp(f);var logo=document.createElement('img');logo.className='app-logo';logo.alt='';var fallback='logos/'+f.key+(['youtube','netflix','apple'].indexOf(f.key)>=0?'.png':'.ico');logo.onerror=function(){if(logo.getAttribute('src')!==fallback){logo.src=fallback;}else{logo.hidden=true;}};logo.src=(f.key==='youtube'||f.key==='apple')?'logos/'+f.key+'.svg':fallback;b.appendChild(logo);var label=document.createElement('span');label.className='app-name';label.textContent=f.name;b.appendChild(label);var hint=document.createElement('small');hint.textContent=onTV?(findApp(f)?'실행 가능':'설치되지 않음'):'미리보기';b.appendChild(hint);b.onfocus=function(){selected=i;try{localStorage.setItem('selected',String(i));}catch(e){}};});var tools=document.getElementById('tools');tools.textContent='';button(tools,'🎨 테마 변경',function(){showPanel('look');});button(tools,'앱 관리',function(){showPanel('apps');});button(tools,'위젯 편집',function(){if(window.cleanM7Extras)window.cleanM7Extras.editWidgets();});appearance();focus(selected);document.dispatchEvent(new Event('cleanm7-render'));}
function closePanel(){modal=false;document.getElementById('overlay').hidden=true;focus(selected);}
function showPanel(type,focusKey){
 if(type==='look'&&window.cleanM7Extras&&window.cleanM7Extras.appearance){window.cleanM7Extras.appearance();return;}
 modal=true;var p=document.getElementById('overlay');p.hidden=false;p.textContent='';p.className='settings-dialog';
 var h=document.createElement('h2');h.textContent=type==='apps'?'앱 관리':'화면 꾸미기';p.appendChild(h);
 var note=document.createElement('p');note.className='settings-intro';note.textContent=type==='apps'?'리모컨으로 앱의 순서를 바꾸거나 홈에서 숨겨보세요. 앱을 삭제하지는 않습니다.':'홈 화면의 분위기를 선택하세요.';p.appendChild(note);
 var list=document.createElement('div');list.className='settings-list';p.appendChild(list);
 if(type==='apps'){
 favourites().forEach(function(f,i){var row=document.createElement('div');row.className='manage-row';var image=document.createElement('img');image.alt='';image.src='logos/'+f.key+(['youtube','apple'].indexOf(f.key)>=0?'.svg':['netflix'].indexOf(f.key)>=0?'.png':'.ico');row.appendChild(image);var label=document.createElement('div');label.className='manage-label';var n=document.createElement('strong');n.textContent=f.name;label.appendChild(n);var sub=document.createElement('span');sub.textContent=(i+1)+'번째 앱';label.appendChild(sub);row.appendChild(label);
 function action(label,key,fn,disabled){var b=button(row,label,fn);b.dataset.focus=key;b.setAttribute('aria-label',f.name+' '+(label==='←'?'왼쪽으로 이동':label==='→'?'오른쪽으로 이동':label));b.disabled=!!disabled;}
 action('←',f.key+'-left',function(){var x=cfg.order.splice(i,1)[0];cfg.order.splice(i-1,0,x);save();render();showPanel('apps',f.key+'-left');},i===0);
 action('→',f.key+'-right',function(){var x=cfg.order.splice(i,1)[0];cfg.order.splice(i+1,0,x);save();render();showPanel('apps',f.key+'-right');},i===cfg.order.length-1);
 action('숨기기',f.key+'-hide',function(){cfg.order.splice(i,1);selected=Math.min(selected,cfg.order.length-1);save();render();showPanel('apps');},cfg.order.length===1);list.appendChild(row);});
 var available=catalog.filter(function(f){return cfg.order.indexOf(f.key)<0&&(!onTV||findApp(f));});
 if(available.length){var sh=document.createElement('h3');sh.textContent='홈에 앱 추가';p.appendChild(sh);var adds=document.createElement('div');adds.className='settings-chips';p.appendChild(adds);available.forEach(function(f){button(adds,'＋ '+f.name,function(){if(cfg.order.length>=6){message('홈에는 앱을 최대 6개까지 놓을 수 있습니다.');return;}cfg.order.push(f.key);save();render();showPanel('apps',f.key+'-hide');});});}
 }else{['valley','aurora','sage','black'].forEach(function(t){button(list,t,function(){cfg.theme=t;save();appearance();showPanel(type);});});}
 var bottom=document.createElement('div');bottom.className='settings-bottom';p.appendChild(bottom);button(bottom,'완료',closePanel);
 var target=focusKey?p.querySelector('[data-focus="'+focusKey+'"]:not(:disabled)'):null;if(!target&&focusKey)target=p.querySelector('[data-focus^="'+focusKey.split('-')[0]+'-"]:not(:disabled)');(target||p.querySelector('button:not(:disabled)')).focus();
}
function discover(){if(!onTV){render();return;}try{tizen.application.getAppsInfo(function(a){installed=a;render();},function(e){render();message('설치 앱을 불러오지 못했습니다: '+e.message);});}catch(e){render();message(e.message);}}
function showSaver(){sleeping=true;document.getElementById('saver').hidden=false;clock();}
function wake(){sleeping=false;document.getElementById('saver').hidden=true;lastActivity=Date.now();focus(selected);}
function clock(){var now=new Date(),time=now.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}),date=now.toLocaleDateString('ko-KR',{weekday:'long',month:'long',day:'numeric'});document.getElementById('clock').textContent=time;document.getElementById('date').textContent=date;var wc=document.querySelector('.clock-card .widget-temperature');if(wc)wc.textContent=new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false});document.getElementById('saver-time').textContent=time;document.getElementById('saver-date').textContent=date;if(cfg.idle&&!modal&&!sleeping&&!document.hidden&&Date.now()-lastActivity>120000)showSaver();}
document.addEventListener('keydown',function(e){lastActivity=Date.now();if(sleeping){e.preventDefault();wake();return;}var k=e.keyCode;if([37,38,40,39,13,10009,27].indexOf(k)<0)return;e.preventDefault();if(k===10009||k===27){if(modal)closePanel();else if(document.body.classList.contains('cinema')){document.body.classList.remove('cinema');document.dispatchEvent(new Event('cleanm7-cinema-exit'));}else if(onTV){try{tizen.application.getCurrentApplication().exit();}catch(err){message(err.message);}}return;}if(k===13){if(document.activeElement&&document.activeElement.tagName==='BUTTON')document.activeElement.click();return;}if(!modal){var inWidgets=document.activeElement&&document.activeElement.closest('#widgets');var inTools=document.activeElement&&document.activeElement.parentNode&&document.activeElement.parentNode.id==='tools';var inApps=document.activeElement&&document.activeElement.parentNode&&document.activeElement.parentNode.id==='apps';if(k===38){if(inApps){var w=document.querySelector('#widgets button')||document.querySelector('#tools button');if(w)w.focus();return;}if(inWidgets){var tb=document.querySelector('#tools button');if(tb)tb.focus();return;}return;}if(k===40){if(inTools){var wb=document.querySelector('#widgets button');if(wb)wb.focus();else focus(selected);return;}if(inWidgets){focus(selected);return;}return;}var rowSel=inWidgets?'#widgets button':inTools?'#tools button':'#apps button';var rowList=Array.prototype.slice.call(document.querySelectorAll(rowSel));var rIdx=rowList.indexOf(document.activeElement);var nextIdx=Math.max(0,Math.min(rowList.length-1,rIdx+(k===37?-1:1)));if(rowList[nextIdx])rowList[nextIdx].focus();return;}var list=Array.prototype.slice.call(document.querySelectorAll('#overlay button:not(:disabled)'));var r=document.activeElement.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;var candidates=list.filter(function(el){return el!==document.activeElement;}).map(function(el){var q=el.getBoundingClientRect();return {el:el,dx:q.left+q.width/2-cx,dy:q.top+q.height/2-cy};}).filter(function(c){return k===37?c.dx<-4:k===39?c.dx>4:k===38?c.dy<-4:c.dy>4;});candidates.sort(function(a,b){function score(c){return (k===37||k===39)?Math.abs(c.dx)+Math.abs(c.dy)*5:Math.abs(c.dy)+Math.abs(c.dx)*3;}return score(a)-score(b);});if(candidates.length)candidates[0].el.focus();});
document.addEventListener('pointerdown',function(e){lastActivity=Date.now();if(sleeping){e.preventDefault();wake();}},true);document.getElementById('saver').onclick=function(){if(sleeping)wake();};
function launchDeepLink(k,contentUrl,deepLink,titleName){
 var f=catalog.filter(function(x){return x.key===k;})[0];
 var label=titleName?('《'+titleName+'》'):(f?f.name:k);
 if(!onTV){
  if(contentUrl){try{window.open(contentUrl,'_blank');}catch(e){}}
  message((f?f.name:k)+' · '+label+' 바로가기: '+(contentUrl||''));
  return;
 }
 var a=f?findApp(f):null;
 if(!a){
  if(contentUrl&&typeof tizen.ApplicationControl==='function'){
   try{
    var bCtrl=new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view',contentUrl,null,null,[]);
    tizen.application.launchAppControl(bCtrl,null,function(){message('');},function(){message((f?f.name:k)+'이 설치되지 않았습니다.');});
    return;
   }catch(e){}
  }
  message((f?f.name:k)+'이 설치되지 않았습니다.');
  return;
 }
 message(f.name+' · '+label+' 작품으로 이동 중…');
 var targetUri=deepLink||contentUrl||'';
 if(targetUri&&typeof tizen.ApplicationControl==='function'&&typeof tizen.ApplicationControlData==='function'){
  try{
   var dataArr=[
    new tizen.ApplicationControlData('PAYLOAD',[JSON.stringify({values:JSON.stringify({contentTarget:targetUri,url:contentUrl||targetUri,query:titleName||''})})]),
    new tizen.ApplicationControlData('url',[contentUrl||targetUri]),
    new tizen.ApplicationControlData('deeplink',[targetUri]),
    new tizen.ApplicationControlData('query',[titleName||''])
   ];
   var appCtrl=new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view',contentUrl||targetUri,null,null,dataArr);
   tizen.application.launchAppControl(appCtrl,a.id,function(){
    document.dispatchEvent(new CustomEvent('cleanm7-launch',{detail:{key:f.key,name:f.name,title:titleName}}));
    message('');
   },function(){
    try{
     var defCtrl=new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/default',targetUri,null,null,dataArr);
     tizen.application.launchAppControl(defCtrl,a.id,function(){
      document.dispatchEvent(new CustomEvent('cleanm7-launch',{detail:{key:f.key,name:f.name,title:titleName}}));
      message('');
     },function(){launch(f);});
    }catch(e2){launch(f);}
   });
   return;
  }catch(e){}
 }
 launch(f);
}
document.addEventListener('visibilitychange',function(){if(!document.hidden){wake();message('');if(!modal)discover();}});window.cleanM7={catalog:catalog,getConfig:function(){return JSON.parse(JSON.stringify(cfg));},applyConfig:function(c){if(c&&Array.isArray(c.order)&&c.order.length){cfg.order=c.order.filter(function(k){return catalog.some(function(f){return f.key===k;});}).slice(0,6);if(!cfg.order.length)cfg.order=['youtube'];}if(c&&['valley','aurora','sage','black'].indexOf(c.theme)>=0)cfg.theme=c.theme;if(c)cfg.reduced=c.reduced===true;if(c&&typeof c.idle==='boolean')cfg.idle=c.idle;selected=0;save();render();},launchKey:function(k){var f=catalog.filter(function(x){return x.key===k;})[0];if(f)launch(f);},launchDeepLink:launchDeepLink,panel:function(title,build){modal=true;var p=document.getElementById('overlay');p.hidden=false;p.textContent='';p.className='';var h=document.createElement('h2');h.textContent=title;p.appendChild(h);build(p,button);button(p,'닫기',closePanel);var b=p.querySelector('button');if(b)b.focus();},close:closePanel,clock:showSaver};document.getElementById('mode').textContent=onTV?'삼성 M7':'BROWSER 미리보기';clock();setInterval(clock,10000);discover();
}());
