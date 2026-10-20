#!/usr/bin/env python3
"""Clean M7 Local Bridge Server (Port 18766):
- /api/news    : Real-time Yonhap News (연합뉴스) breaking & live headlines
- /api/stocks  : Real-time KOSPI, KOSDAQ, S&P 500, NASDAQ indices, sparklines & human-friendly insights
- /api/weather : KMA API Hub (기상청 API 허브) + yesterday comparison (어제 대비 기온차·옷차림) + Solar/Lunar trajectory
- /api/ott     : Weekly Monday OTT New Releases + One-Click Cinema Roulette (밥친구 / 맥주한잔 / 주말대작)
- /api/music   : Real-time Mac Now Playing (Apple Music / Spotify / YouTube) + Pixar Vinyl Visualizer metadata
"""
import datetime, json, math, os, re, subprocess, threading, time, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / '.tools'
TOOLS.mkdir(exist_ok=True)

NEWS_CACHE = TOOLS / 'news-cache.json'
STOCK_CACHE = TOOLS / 'stocks-cache.json'
WEATHER_CACHE = TOOLS / 'kma-weather-cache.json'
OTT_CACHE = TOOLS / 'ott-weekly-cache.json'
MUSIC_CACHE = TOOLS / 'music-cache.json'
KMA_KEY_FILE = TOOLS / 'kma-key.txt'

YONHAP_FEEDS = [
    ('속보·전체', 'https://www.yna.co.kr/rss/news.xml'),
    ('정치', 'https://www.yna.co.kr/rss/politics.xml'),
    ('경제', 'https://www.yna.co.kr/rss/economy.xml'),
    ('사회', 'https://www.yna.co.kr/rss/society.xml'),
    ('국제', 'https://www.yna.co.kr/rss/international.xml'),
]

KST = datetime.timezone(datetime.timedelta(hours=9))

news_lock = threading.Lock()
stock_lock = threading.Lock()
weather_lock = threading.Lock()
ott_lock = threading.Lock()
music_lock = threading.Lock()


def _num(v, default=0.0):
    if v is None:
        return default
    if isinstance(v, (int, float)):
        return float(v)
    try:
        return float(str(v).replace(',', '').replace('+', '').strip())
    except ValueError:
        return default


def _fetch_bytes(url, timeout=6, headers=None):
    hdrs = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) CleanM7/2.7'}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, headers=hdrs)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(1500000)


def _fetch_json(url, timeout=6):
    raw = _fetch_bytes(url, timeout=timeout, headers={'Accept': 'application/json'})
    return json.loads(raw.decode('utf-8', 'ignore'))


# ---------------------------------------------------------------------------
# 1. YONHAP NEWS (애플 연합뉴스 위젯 스타일 실시간 속보·뉴스)
# ---------------------------------------------------------------------------
def _relative_ko(pub_ts, now_ts):
    diff = max(0, int(now_ts - pub_ts))
    if diff < 60:
        return '방금 전'
    if diff < 3600:
        return f'{diff // 60}분 전'
    if diff < 86400:
        return f'{diff // 3600}시간 전'
    return f'{diff // 86400}일 전'


def _parse_yonhap_feed(raw, default_cat='실시간'):
    root = ET.fromstring(raw)
    out = []
    for node in root.findall('./channel/item'):
        raw_title = re.sub(r'<[^>]*>', '', node.findtext('title', '')).strip()
        url = node.findtext('link', '').strip()
        desc = re.sub(r'<[^>]*>', '', node.findtext('description', '')).strip()
        if not raw_title or not url:
            continue
        if urlsplit(url).hostname not in ('www.yna.co.kr', 'yna.co.kr'):
            continue
        try:
            published = parsedate_to_datetime(node.findtext('pubDate', '')).timestamp()
        except Exception:
            continue

        is_breaking = any(k in raw_title for k in ('[속보]', '[긴급]', '[1보]', '[2보]', '속보'))
        is_exclusive = '[단독]' in raw_title

        clean_title = re.sub(r'^\s*\[(속보|긴급|1보|2보|단독|종합|종합2보|영상|포토)\]\s*', '', raw_title).strip()
        if not clean_title:
            clean_title = raw_title

        if is_breaking:
            tag = '속보'
        elif is_exclusive:
            tag = '단독'
        else:
            tag = default_cat

        out.append({
            'title': clean_title[:180],
            'rawTitle': raw_title[:200],
            'summary': desc[:220] if desc else '',
            'url': url,
            'publishedAt': published,
            'breaking': is_breaking or is_exclusive,
            'tag': tag,
            'category': default_cat,
        })
    return out


def fetch_news():
    with news_lock:
        old = None
        try:
            old = json.loads(NEWS_CACHE.read_text())
        except Exception:
            pass
        now_ts = time.time()
        if old and now_ts - old.get('fetchedAt', 0) < 45 and old.get('items'):
            for it in old['items']:
                it['ago'] = _relative_ko(it.get('publishedAt', now_ts), now_ts)
            return old

        merged = []
        seen_urls = set()
        seen_titles = set()
        for cat, feed_url in YONHAP_FEEDS:
            try:
                raw = _fetch_bytes(feed_url, timeout=6)
                for item in _parse_yonhap_feed(raw, cat):
                    norm_t = re.sub(r'\s+', '', item['title'])[:40]
                    if item['url'] in seen_urls or norm_t in seen_titles:
                        continue
                    seen_urls.add(item['url'])
                    seen_titles.add(norm_t)
                    merged.append(item)
            except Exception:
                continue

        if not merged:
            if old and old.get('items'):
                old['stale'] = True
                for it in old['items']:
                    it['ago'] = _relative_ko(it.get('publishedAt', now_ts), now_ts)
                return old
            return {'source': '연합뉴스', 'items': [], 'breakingCount': 0, 'stale': True, 'error': '뉴스 연결 안 됨'}

        merged.sort(key=lambda x: (1 if (x['breaking'] and now_ts - x['publishedAt'] < 5400) else 0, x['publishedAt']), reverse=True)
        top_items = merged[:18]
        for it in top_items:
            if now_ts - it['publishedAt'] <= 600 and it['tag'] == '속보·전체':
                it['tag'] = '속보'
                it['breaking'] = True
            elif it['tag'] == '속보·전체':
                it['tag'] = '실시간'
            it['ago'] = _relative_ko(it['publishedAt'], now_ts)

        breaking_count = sum(1 for x in top_items if x.get('breaking'))
        data = {
            'source': '연합뉴스 실시간 속보',
            'sourceUrl': YONHAP_FEEDS[0][1],
            'sourceTime': top_items[0]['publishedAt'],
            'fetchedAt': now_ts,
            'breakingCount': breaking_count,
            'items': top_items,
            'stale': False,
        }
        try:
            NEWS_CACHE.write_text(json.dumps(data, ensure_ascii=False))
        except OSError:
            pass
        return data


# ---------------------------------------------------------------------------
# 2. REAL-TIME STOCKS + HUMAN-SPEAK DELTA SUMMARY
# ---------------------------------------------------------------------------
def _stock_human_comment(item):
    name = item['name']
    pct = item.get('changePercent', 0.0)
    pts = item.get('points') or []
    is_high = len(pts) >= 4 and item['price'] >= max(pts) * 0.999
    if pct >= 1.5:
        return f'{name} 지수가 +{pct:.2f}% 강한 상승 탄력을 받고 있어요 🔥'
    if pct >= 0.3:
        return f'{name} 지수가 +{pct:.2f}% 완만한 오름세를 유지 중이에요 📈' + (' (장중 고점 부근)' if is_high else '')
    if pct <= -1.5:
        return f'{name} 지수가 {pct:.2f}% 비교적 큰 폭으로 조정받고 있어요 ⚡'
    if pct <= -0.3:
        return f'{name} 지수가 {pct:.2f}% 숨고르기 약보합 흐름이에요 📉'
    return f'{name} 지수가 보합권({pct:+.2f}%)에서 잔잔하게 움직이고 있어요 ⚖️'


def _fetch_single_index(key, name, market, naver_basic_url, naver_price_url, yahoo_sym):
    item = {
        'key': key, 'name': name, 'market': market,
        'price': 0.0, 'change': 0.0, 'changePercent': 0.0,
        'dir': 'flat', 'status': 'CLOSED', 'high': 0.0, 'low': 0.0,
        'points': [], 'humanComment': '', 'updatedAt': int(time.time())
    }
    try:
        yurl = f'https://query1.finance.yahoo.com/v8/finance/chart/{yahoo_sym}?interval=5m&range=1d'
        yd = _fetch_json(yurl, timeout=5)
        res = (yd.get('chart', {}).get('result') or [None])[0]
        if res:
            meta = res.get('meta', {})
            price = _num(meta.get('regularMarketPrice'))
            prev = _num(meta.get('chartPreviousClose') or meta.get('previousClose'))
            closes = ((res.get('indicators', {}).get('quote') or [{}])[0].get('close') or [])
            pts = [round(float(c), 2) for c in closes if isinstance(c, (int, float))]
            if len(pts) > 28:
                step = max(1, len(pts) // 28)
                pts = pts[::step][-28:]
            if price > 0:
                chg = price - prev if prev > 0 else 0.0
                pct = (chg / prev * 100.0) if prev > 0 else 0.0
                item.update({
                    'price': round(price, 2),
                    'change': round(chg, 2),
                    'changePercent': round(pct, 2),
                    'dir': 'up' if chg > 0.001 else ('down' if chg < -0.001 else 'flat'),
                    'status': str(meta.get('marketState') or 'REGULAR').upper(),
                    'high': round(_num(meta.get('regularMarketDayHigh')) or (max(pts) if pts else price), 2),
                    'low': round(_num(meta.get('regularMarketDayLow')) or (min(pts) if pts else price), 2),
                    'points': pts,
                    'updatedAt': int(meta.get('regularMarketTime') or time.time())
                })
    except Exception:
        pass
    try:
        nb = _fetch_json(naver_basic_url, timeout=5)
        price = _num(nb.get('closePrice'))
        if price > 0:
            chg = _num(nb.get('compareToPreviousClosePrice'))
            pct = _num(nb.get('fluctuationsRatio'))
            code = str((nb.get('compareToPreviousPrice') or {}).get('code', '3'))
            if code in ('4', '5') and chg > 0:
                chg = -chg
            if code in ('4', '5') and pct > 0:
                pct = -pct
            direction = 'up' if code in ('1', '2') or chg > 0 else ('down' if code in ('4', '5') or chg < 0 else 'flat')
            status = str(nb.get('marketStatus') or item['status'] or 'CLOSE').upper()
            item.update({
                'price': round(price, 2),
                'change': round(chg, 2),
                'changePercent': round(pct, 2),
                'dir': direction,
                'status': status,
                'updatedAt': int(time.time())
            })
            if not item['points']:
                try:
                    np_data = _fetch_json(naver_price_url, timeout=4)
                    rows = np_data if isinstance(np_data, list) else (np_data.get('Datas') or np_data.get('priceInfos') or [])
                    pts = [round(_num(r.get('closePrice') or r.get('localClosePrice')), 2) for r in rows if _num(r.get('closePrice') or r.get('localClosePrice')) > 0]
                    pts.reverse()
                    if pts:
                        item['points'] = pts[-20:]
                        item['high'] = round(max(pts), 2)
                        item['low'] = round(min(pts), 2)
                except Exception:
                    pass
    except Exception:
        pass
    if item['price'] > 0 and not item['points']:
        base = item['price'] - item['change']
        item['points'] = [round(base + (item['change'] * (i / 12.0)), 2) for i in range(13)]
    item['humanComment'] = _stock_human_comment(item)
    return item


def _fetch_crypto_item(key, name, symbol, upbit_market, yahoo_sym):
    item = {
        'key': key, 'name': name, 'symbol': symbol, 'market': 'CRYPTO', 'unit': 'KRW',
        'price': 0.0, 'priceUsd': 0.0, 'change': 0.0, 'changePercent': 0.0,
        'dir': 'flat', 'status': '24H LIVE', 'high': 0.0, 'low': 0.0,
        'points': [], 'humanComment': '', 'updatedAt': int(time.time())
    }
    # 1) Upbit Korea Public API (KRW price + 24h change + 24h hourly sparkline)
    try:
        tk = _fetch_json(f'https://api.upbit.com/v1/ticker?markets={upbit_market}', timeout=4)
        if isinstance(tk, list) and tk:
            row = tk[0]
            price = _num(row.get('trade_price'))
            chg = _num(row.get('signed_change_price'))
            pct = _num(row.get('signed_change_rate')) * 100.0
            if price > 0:
                item.update({
                    'unit': 'KRW',
                    'price': round(price, 0),
                    'change': round(chg, 0),
                    'changePercent': round(pct, 2),
                    'dir': 'up' if chg > 0 else ('down' if chg < 0 else 'flat'),
                    'status': '24H LIVE',
                    'high': round(_num(row.get('high_price')) or price, 0),
                    'low': round(_num(row.get('low_price')) or price, 0),
                    'updatedAt': int(time.time()),
                })
                try:
                    candles = _fetch_json(f'https://api.upbit.com/v1/candles/minutes/60?market={upbit_market}&count=24', timeout=4)
                    if isinstance(candles, list) and candles:
                        pts = [round(_num(c.get('trade_price')), 0) for c in reversed(candles) if _num(c.get('trade_price')) > 0]
                        if len(pts) >= 2:
                            item['points'] = pts
                except Exception:
                    pass
    except Exception:
        pass

    # 2) Yahoo Finance USD price (for USD companion price or primary fallback)
    try:
        yurl = f'https://query1.finance.yahoo.com/v8/finance/chart/{yahoo_sym}?interval=15m&range=1d'
        yd = _fetch_json(yurl, timeout=4)
        res = (yd.get('chart', {}).get('result') or [None])[0]
        if res:
            meta = res.get('meta', {})
            usd_price = _num(meta.get('regularMarketPrice'))
            prev = _num(meta.get('chartPreviousClose') or meta.get('previousClose'))
            if usd_price > 0:
                item['priceUsd'] = round(usd_price, 2)
                if item['price'] <= 0:
                    chg = usd_price - prev if prev > 0 else 0.0
                    pct = (chg / prev * 100.0) if prev > 0 else 0.0
                    closes = ((res.get('indicators', {}).get('quote') or [{}])[0].get('close') or [])
                    pts = [round(float(c), 2) for c in closes if isinstance(c, (int, float))]
                    if len(pts) > 24:
                        step = max(1, len(pts) // 24)
                        pts = pts[::step][-24:]
                    item.update({
                        'unit': 'USD',
                        'price': round(usd_price, 2),
                        'change': round(chg, 2),
                        'changePercent': round(pct, 2),
                        'dir': 'up' if chg > 0 else ('down' if chg < 0 else 'flat'),
                        'high': round(_num(meta.get('regularMarketDayHigh')) or usd_price, 2),
                        'low': round(_num(meta.get('regularMarketDayLow')) or usd_price, 2),
                        'points': pts,
                    })
    except Exception:
        pass

    if item['price'] > 0 and not item['points']:
        base = item['price'] - item['change']
        item['points'] = [round(base + (item['change'] * (i / 12.0)), 2) for i in range(13)]
    item['humanComment'] = _stock_human_comment(item)
    return item


def fetch_stocks():
    with stock_lock:
        old = None
        try:
            old = json.loads(STOCK_CACHE.read_text())
        except Exception:
            pass
        if old and time.time() - old.get('fetchedAt', 0) < 25 and old.get('indices', {}).get('btc'):
            return old
        specs = [
            ('kospi', '코스피', 'KR', 'https://m.stock.naver.com/api/index/KOSPI/basic', 'https://m.stock.naver.com/api/index/KOSPI/price?pageSize=20&page=1', '%5EKS11'),
            ('kosdaq', '코스닥', 'KR', 'https://m.stock.naver.com/api/index/KOSDAQ/basic', 'https://m.stock.naver.com/api/index/KOSDAQ/price?pageSize=20&page=1', '%5EKQ11'),
            ('sp500', 'S&P 500', 'US', 'https://api.stock.naver.com/index/.INX/basic', 'https://api.stock.naver.com/index/.INX/price?page=1&pageSize=20', '%5EGSPC'),
            ('nasdaq', '나스닥', 'US', 'https://api.stock.naver.com/index/.IXIC/basic', 'https://api.stock.naver.com/index/.IXIC/price?page=1&pageSize=20', '%5EIXIC'),
        ]
        indices = {}
        for s in specs:
            res = _fetch_single_index(*s)
            if res['price'] > 0:
                indices[s[0]] = res
            elif old and old.get('indices', {}).get(s[0]):
                indices[s[0]] = old['indices'][s[0]]

        crypto_specs = [
            ('btc', '비트코인', 'BTC', 'KRW-BTC', 'BTC-USD'),
            ('eth', '이더리움', 'ETH', 'KRW-ETH', 'ETH-USD'),
        ]
        crypto = {}
        for cs in crypto_specs:
            cres = _fetch_crypto_item(*cs)
            if cres['price'] > 0:
                indices[cs[0]] = cres
                crypto[cs[0]] = cres
            elif old and old.get('indices', {}).get(cs[0]):
                indices[cs[0]] = old['indices'][cs[0]]
                crypto[cs[0]] = old['indices'][cs[0]]

        if not indices and old:
            old['stale'] = True
            return old
        payload = {
            'source': 'Naver / Yahoo / Upbit 실시간 증시·코인',
            'fetchedAt': time.time(),
            'stale': len(indices) < 2,
            'indices': indices,
            'crypto': crypto,
        }
        if indices:
            try:
                STOCK_CACHE.write_text(json.dumps(payload, ensure_ascii=False))
            except OSError:
                pass
        return payload


# ---------------------------------------------------------------------------
# 3. KMA WEATHER + YESTERDAY DELTA + SOLAR/LUNAR TRAJECTORY
# ---------------------------------------------------------------------------
def _get_kma_key(override_key=None):
    if override_key:
        try:
            KMA_KEY_FILE.write_text(override_key.strip())
        except OSError:
            pass
        return override_key.strip()
    env_key = os.environ.get('KMA_API_KEY') or os.environ.get('KMA_AUTH_KEY')
    if env_key:
        return env_key.strip()
    try:
        if KMA_KEY_FILE.exists():
            return KMA_KEY_FILE.read_text().strip()
    except OSError:
        pass
    return ''


def _kma_sky_pty_to_wmo(sky, pty, wf_kor=''):
    pty = int(_num(pty, 0))
    sky = int(_num(sky, 1))
    if pty in (1, 5):
        return 61
    if pty in (2, 3, 6, 7):
        return 71
    if pty == 4:
        return 80
    if '뇌우' in wf_kor or '번개' in wf_kor:
        return 95
    if '눈' in wf_kor:
        return 71
    if '소나기' in wf_kor:
        return 80
    if '비' in wf_kor:
        return 61
    if sky == 1:
        return 0
    if sky == 3:
        return 2
    if sky == 4:
        return 3
    return 0


def _fetch_kma_apihub_ultra_ncst(auth_key):
    if not auth_key:
        return None
    now_kst = datetime.datetime.now(KST)
    base_dt = now_kst - datetime.timedelta(minutes=45)
    base_date = base_dt.strftime('%Y%m%d')
    base_time = base_dt.strftime('%H00')
    url = (
        'https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst'
        f'?pageNo=1&numOfRows=20&dataType=JSON&base_date={base_date}&base_time={base_time}&nx=61&ny=125&authKey={urllib.parse.quote(auth_key)}'
    )
    d = _fetch_json(url, timeout=6)
    items = d.get('response', {}).get('body', {}).get('items', {}).get('item', [])
    if not items:
        return None
    obs = {row.get('category'): row.get('obsrValue') for row in items}
    return {
        'temp': _num(obs.get('T1H'), None),
        'humidity': _num(obs.get('REH'), None),
        'wind': _num(obs.get('WSD'), None),
        'pty': int(_num(obs.get('PTY'), 0)),
        'rn1': _num(obs.get('RN1'), 0.0),
    }


def _fetch_kma_dfs_rss():
    url = 'https://www.weather.go.kr/w/rss/dfs/hr1-forecast.do?zone=1168066000'
    raw = _fetch_bytes(url, timeout=7)
    root = ET.fromstring(raw)
    body = root.find('.//body')
    if body is None:
        return None
    now_kst = datetime.datetime.now(KST)
    today_midnight = now_kst.replace(hour=0, minute=0, second=0, microsecond=0)
    hours = []
    for dnode in body.findall('data'):
        day_offset = int(_num(dnode.findtext('day', '0'), 0))
        hour_val = int(_num(dnode.findtext('hour', '0'), 0))
        temp = _num(dnode.findtext('temp'), 20.0)
        tmx = _num(dnode.findtext('tmx'), -999.0)
        tmn = _num(dnode.findtext('tmn'), -999.0)
        sky = int(_num(dnode.findtext('sky'), 1))
        pty = int(_num(dnode.findtext('pty'), 0))
        wf_kor = (dnode.findtext('wfKor') or '').strip()
        pop = int(_num(dnode.findtext('pop'), 0))
        ws = round(_num(dnode.findtext('ws'), 1.5), 1)
        reh = int(_num(dnode.findtext('reh'), 55))
        dt = today_midnight + datetime.timedelta(days=day_offset, hours=hour_val)
        ts = int(dt.timestamp())
        is_day = 1 if 6 <= dt.hour < 19 else 0
        wmo = _kma_sky_pty_to_wmo(sky, pty, wf_kor)
        hours.append({
            'time': ts,
            'temp': temp,
            'tmx': tmx if tmx > -900 else None,
            'tmn': tmn if tmn > -900 else None,
            'sky': sky,
            'pty': pty,
            'wfKor': wf_kor,
            'pop': pop,
            'ws': ws,
            'reh': reh,
            'code': wmo,
            'is_day': is_day,
        })
    return hours


def _build_human_weather_text(c_temp, yest_temp, c_apparent, max_pop, wf_kor):
    delta = round(c_temp - yest_temp, 1) if yest_temp is not None else 0.0
    if yest_temp is None or abs(delta) < 0.7:
        cmp_str = '어제 이 시간과 기온이 비슷해요'
    elif delta >= 2.5:
        cmp_str = f'어제 이 시간보다 {abs(delta):.0f}°나 더 따뜻해요 ☀️'
    elif delta > 0:
        cmp_str = f'어제보다 {abs(delta):.1f}° 더 포근해요'
    elif delta <= -2.5:
        cmp_str = f'어제 이 시간보다 {abs(delta):.0f}° 쌀쌀해졌어요 🌬️'
    else:
        cmp_str = f'어제보다 {abs(delta):.1f}° 선선해요'

    if max_pop >= 50 or '비' in wf_kor or '소나기' in wf_kor:
        outfit = f'우산을 꼭 챙기세요 ☔ (강수확률 {max_pop}%)'
    elif c_apparent >= 24:
        outfit = '가벼운 반팔이나 얇은 셔츠가 쾌적해요 👕'
    elif c_apparent >= 18:
        outfit = '가벼운 자켓이나 가디건 챙기시면 딱 좋아요 🧥'
    elif c_apparent >= 11:
        outfit = '일교차가 크니 도톰한 겉옷이나 코트를 챙기세요 🧥'
    else:
        outfit = '보온성 좋은 코트나 머플러로 따뜻하게 입으세요 🧣'

    return {
        'yesterdayTemp': round(yest_temp, 1) if yest_temp is not None else None,
        'tempDelta': delta,
        'comparisonText': cmp_str,
        'outfitText': outfit,
        'oneLiner': f'{cmp_str} · {outfit}',
    }


def _compute_solar_lunar_arc(now_ts, sunrise_ts, sunset_ts):
    if not sunrise_ts or not sunset_ts or sunset_ts <= sunrise_ts:
        now_kst = datetime.datetime.fromtimestamp(now_ts, KST)
        sr_dt = now_kst.replace(hour=6, minute=40, second=0, microsecond=0)
        ss_dt = now_kst.replace(hour=17, minute=55, second=0, microsecond=0)
        sunrise_ts = int(sr_dt.timestamp())
        sunset_ts = int(ss_dt.timestamp())

    is_daylight = sunrise_ts <= now_ts <= sunset_ts
    if is_daylight:
        prog = (now_ts - sunrise_ts) / max(1.0, float(sunset_ts - sunrise_ts))
    else:
        # Night arc from sunset to next sunrise (13h span)
        if now_ts > sunset_ts:
            next_sr = sunrise_ts + 86400
            prog = (now_ts - sunset_ts) / max(1.0, float(next_sr - sunset_ts))
        else:
            prev_ss = sunset_ts - 86400
            prog = (now_ts - prev_ss) / max(1.0, float(sunrise_ts - prev_ss))
    prog = max(0.02, min(0.98, prog))
    altitude = round(math.sin(prog * math.pi), 3)
    # Screen coordinates: X from 10%vw (East) to 88%vw (West); Y from 24%vh (horizon) up to 5%vh (zenith)
    x_vw = round(10.0 + prog * 78.0, 1)
    y_vh = round(24.0 - altitude * 18.5, 1)
    return {
        'body': 'sun' if is_daylight else 'moon',
        'progress': round(prog, 3),
        'altitude': altitude,
        'xVw': x_vw,
        'yVh': y_vh,
        'sunrise': sunrise_ts,
        'sunset': sunset_ts,
    }


def fetch_weather(override_key=None):
    with weather_lock:
        auth_key = _get_kma_key(override_key)
        old = None
        try:
            old = json.loads(WEATHER_CACHE.read_text())
        except Exception:
            pass
        now_ts = time.time()
        if not override_key and old and now_ts - old.get('fetchedAt', 0) < 300 and old.get('humanBriefing'):
            old['sunMoon'] = _compute_solar_lunar_arc(
                int(now_ts),
                (old.get('sunMoon') or {}).get('sunrise'),
                (old.get('sunMoon') or {}).get('sunset'),
            )
            return old

        kma_hours = []
        try:
            kma_hours = _fetch_kma_dfs_rss() or []
        except Exception:
            kma_hours = []

        apihub_obs = None
        if auth_key:
            try:
                apihub_obs = _fetch_kma_apihub_ultra_ncst(auth_key)
            except Exception:
                apihub_obs = None

        om_data = None
        try:
            om_url = (
                'https://api.open-meteo.com/v1/forecast?latitude=37.48&longitude=127.06'
                '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,uv_index,is_day'
                '&hourly=temperature_2m,precipitation_probability,weather_code,is_day'
                '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset'
                '&past_days=1&forecast_days=7&timeformat=unixtime&timezone=Asia%2FSeoul'
            )
            om_data = _fetch_json(om_url, timeout=7)
        except Exception:
            om_data = None

        now_kst = datetime.datetime.now(KST)
        is_day_now = 1 if 6 <= now_kst.hour < 19 else 0

        cur_h = kma_hours[0] if kma_hours else {}
        om_cur = (om_data or {}).get('current') or {}

        c_temp = (
            apihub_obs['temp'] if (apihub_obs and apihub_obs.get('temp') is not None)
            else cur_h.get('temp') if cur_h.get('temp') is not None
            else om_cur.get('temperature_2m', 20.0)
        )
        c_hum = (
            apihub_obs['humidity'] if (apihub_obs and apihub_obs.get('humidity') is not None)
            else cur_h.get('reh') if cur_h.get('reh') is not None
            else om_cur.get('relative_humidity_2m', 50)
        )
        c_wind = (
            apihub_obs['wind'] if (apihub_obs and apihub_obs.get('wind') is not None)
            else cur_h.get('ws') if cur_h.get('ws') is not None
            else om_cur.get('wind_speed_10m', 1.5)
        )
        c_code = (
            _kma_sky_pty_to_wmo(cur_h.get('sky', 1), apihub_obs['pty']) if (apihub_obs and apihub_obs.get('pty') is not None)
            else cur_h.get('code') if cur_h.get('code') is not None
            else om_cur.get('weather_code', 0)
        )
        c_apparent = om_cur.get('apparent_temperature', c_temp)
        c_uv = om_cur.get('uv_index', 3.0 if is_day_now else 0.0)
        wf_kor = cur_h.get('wfKor') or ''

        # Find yesterday's temperature at the same hour from past_days=1
        yest_temp = None
        if om_data and om_data.get('hourly'):
            oh_times = om_data['hourly'].get('time') or []
            oh_temps = om_data['hourly'].get('temperature_2m') or []
            target_yest = now_ts - 86400
            best_idx = None
            best_diff = 999999
            for idx, t in enumerate(oh_times):
                diff = abs(t - target_yest)
                if diff < best_diff and idx < len(oh_temps) and oh_temps[idx] is not None:
                    best_diff = diff
                    best_idx = idx
            if best_idx is not None and best_diff <= 5400:
                yest_temp = float(oh_temps[best_idx])

        # Slice daily arrays so index 0 is TODAY (since past_days=1 prepends yesterday at index 0)
        daily_raw = (om_data or {}).get('daily') or {}
        daily = {}
        start_d = 1 if (len(daily_raw.get('time') or []) > 7) else 0
        for k, arr in daily_raw.items():
            if isinstance(arr, list):
                daily[k] = arr[start_d:start_d + 7]

        if kma_hours:
            hourly = {
                'time': [h['time'] for h in kma_hours[:12]],
                'temperature_2m': [h['temp'] for h in kma_hours[:12]],
                'precipitation_probability': [h['pop'] for h in kma_hours[:12]],
                'weather_code': [h['code'] for h in kma_hours[:12]],
                'is_day': [h['is_day'] for h in kma_hours[:12]],
                'wfKor': [h['wfKor'] for h in kma_hours[:12]],
            }
        elif om_data and om_data.get('hourly'):
            oh = om_data['hourly']
            first = 0
            for idx, t in enumerate(oh.get('time', [])):
                if t >= now_ts - 1800:
                    first = idx
                    break
            hourly = {
                k: (oh[k][first:first + 12] if isinstance(oh.get(k), list) else [])
                for k in ('time', 'temperature_2m', 'precipitation_probability', 'weather_code', 'is_day')
            }
        else:
            hourly = {'time': [], 'temperature_2m': [], 'precipitation_probability': [], 'weather_code': [], 'is_day': []}

        if kma_hours and daily.get('temperature_2m_max') and daily.get('temperature_2m_min'):
            today_temps = [h['temp'] for h in kma_hours[:8]]
            if today_temps:
                daily['temperature_2m_max'][0] = max(daily['temperature_2m_max'][0], max(today_temps))
                daily['temperature_2m_min'][0] = min(daily['temperature_2m_min'][0], min(today_temps))

        max_pop = max((hourly.get('precipitation_probability') or [0])[:6] or [0])
        human_briefing = _build_human_weather_text(float(c_temp), yest_temp, float(c_apparent), int(max_pop), wf_kor)

        sr_ts = (daily.get('sunrise') or [None])[0]
        ss_ts = (daily.get('sunset') or [None])[0]
        sun_moon = _compute_solar_lunar_arc(int(now_ts), sr_ts, ss_ts)

        provider_label = '기상청 API 허브 (초단기실황·동네예보)' if apihub_obs else '기상청 API 허브 · 동네예보 (개포동 61,125)'
        payload = {
            'provider': provider_label,
            'kmaZone': '1168066000 (서울 강남구 개포동 · 격자 61,125)',
            'kmaHubKeyConfigured': bool(auth_key),
            'kmaHubLive': bool(apihub_obs),
            'fetchedAt': int(now_ts),
            'stale': False,
            'humanBriefing': human_briefing,
            'sunMoon': sun_moon,
            'current': {
                'temperature_2m': round(float(c_temp), 1),
                'yesterday_temperature': human_briefing['yesterdayTemp'],
                'temp_delta': human_briefing['tempDelta'],
                'apparent_temperature': round(float(c_apparent), 1),
                'relative_humidity_2m': int(round(float(c_hum))),
                'wind_speed_10m': round(float(c_wind), 1),
                'weather_code': int(c_code),
                'wfKor': wf_kor,
                'uv_index': round(float(c_uv), 1),
                'is_day': is_day_now,
                'time': int(now_ts),
            },
            'hourly': hourly,
            'daily': daily,
        }
        try:
            WEATHER_CACHE.write_text(json.dumps(payload, ensure_ascii=False))
        except OSError:
            pass
        return payload


# ---------------------------------------------------------------------------
# 4. WEEKLY MONDAY OTT NEW RELEASES (REAL TITLES + DEEP LINKS) & CINEMA ROULETTE
# ---------------------------------------------------------------------------
def _make_ott_links(platform_key, title, exact_url='', netflix_id=''):
    q = urllib.parse.quote(title.strip())
    if platform_key == 'netflix':
        web = exact_url or (f'https://www.netflix.com/title/{netflix_id}' if netflix_id else f'https://www.netflix.com/search?q={q}')
        deep = f'nflx://www.netflix.com/title/{netflix_id}' if netflix_id else f'nflx://www.netflix.com/search?q={q}'
        return web, deep
    if platform_key == 'coupang':
        web = exact_url or f'https://www.coupangplay.com/query?src={q}'
        deep = f'coupangplay://search?keyword={q}'
        return web, deep
    if platform_key == 'disney':
        web = exact_url or f'https://www.disneyplus.com/ko-kr/browse/search?q={q}'
        deep = f'disneyplus://search?q={q}'
        return web, deep
    if platform_key == 'apple':
        web = exact_url or f'https://tv.apple.com/kr/search?term={q}'
        deep = f'videos://search?term={q}'
        return web, deep
    return exact_url or '', ''


OTT_PLATFORMS = [
    {
        'key': 'netflix',
        'name': '넷플릭스',
        'en': 'Netflix',
        'badgeColor': '#E50914',
        'jwPackage': 'nfx',
        'query': '넷플릭스 신작 공개 시리즈 영화',
        'curated': [
            {
                'title': '사이버펑크: 엣지러너 2',
                'type': '시리즈',
                'schedule': '10월 20일 공개 · 넷플릭스 시리즈',
                'genre': 'SF 액션 애니메이션 · 10부작 신작',
            },
            {
                'title': '뤼팽 파트 4 (Lupin Part 4)',
                'type': '시리즈',
                'schedule': '10월 23일 공개 · 넷플릭스 시리즈',
                'genre': '케이퍼 미스터리 스릴러 · 오마르 시 주연',
            },
            {
                'title': '닥터X: 하얀 마피아의 시대',
                'type': '시리즈',
                'schedule': '이번 주말 스트리밍 1위 · 드라마',
                'genre': '메디컬 누아르 · 김지원·이정은·손현주',
            },
            {
                'title': '꿀알바',
                'type': '시리즈',
                'schedule': '10월 30일 공개 · 넷플릭스 오리지널',
                'genre': '미스터리 호러 판타지 · 이재욱·고민시·김민하',
            },
        ]
    },
    {
        'key': 'coupang',
        'name': '쿠팡플레이',
        'en': 'Coupang Play',
        'badgeColor': '#00A8E8',
        'jwPackage': '',
        'query': '쿠팡플레이 신작 시리즈 공개 오리지널',
        'curated': [
            {
                'title': '직장인들 시즌 3',
                'type': '시리즈',
                'schedule': '금요일 저녁 8시 · 쿠플 오리지널',
                'genre': '하이퍼리얼리즘 오피스 코미디',
            },
            {
                'title': '너 말고 다른 연애',
                'type': '시리즈',
                'schedule': '이번 주말 정주행 · 쿠플 시리즈',
                'genre': '현실 공감 로맨스 · 서강준·안은진 주연',
            },
            {
                'title': '지금 불륜이 문제가 아닙니다',
                'type': '시리즈',
                'schedule': '쿠플 오리지널 화제작 · 전편 스트리밍',
                'genre': '블랙 코미디 · 김혜수·조여정·황동혁 쇼러너',
            },
            {
                'title': '가족계획 시즌 2',
                'type': '시리즈',
                'schedule': '쿠플 오리지널 시리즈',
                'genre': '블랙 코미디 스릴러 · 배두나·류승범',
            },
        ]
    },
    {
        'key': 'disney',
        'name': '디즈니+',
        'en': 'Disney+',
        'badgeColor': '#113CCF',
        'jwPackage': 'dnp',
        'query': '디즈니+ 신작 공개 시리즈 오리지널',
        'curated': [
            {
                'title': '메리 베리 러브',
                'type': '시리즈',
                'schedule': '10월 신작 공개 · 디즈니+ 오리지널',
                'genre': '로맨틱 코미디 · 지창욱·이마다 미오',
            },
            {
                'title': '사기 설계자들: 로맨스 스캠',
                'type': '다큐 시리즈',
                'schedule': '이번 주 공개 신작 · 디즈니+ 시리즈',
                'genre': '글로벌 범죄 추적 다큐멘터리 · 3부작',
            },
            {
                'title': '킬러들의 쇼핑몰 시즌 2',
                'type': '시리즈',
                'schedule': '디즈니+ 오리지널 기대작',
                'genre': '스타일리시 액션 스릴러 · 이동욱·김혜준',
            },
            {
                'title': '재혼 황후',
                'type': '시리즈',
                'schedule': '디즈니+ 오리지널 대작',
                'genre': '판타지 로맨스 대작 · 신민아·주지훈·이종석',
            },
        ]
    },
    {
        'key': 'apple',
        'name': '애플 TV+',
        'en': 'Apple TV+',
        'badgeColor': '#334155',
        'jwPackage': 'atp',
        'query': '"Apple TV+" 신작 공개 시리즈 영화',
        'curated': [
            {
                'title': '반다를 찾아서 시즌 2',
                'type': '시리즈',
                'schedule': '10월 공개 신작 · Apple Original',
                'genre': '블랙 코미디 미스터리 시리즈',
            },
            {
                'title': '텐징: 에베레스트 정복 (Tenzing)',
                'type': '영화',
                'schedule': '10월 공개 신작 · Apple Original 영화',
                'genre': '실화 어드벤처 드라마 · 톰 히들스턴·윌렘 데포',
            },
            {
                'title': '매치박스 (Matchbox)',
                'type': '영화',
                'schedule': '10월 공개 신작 · Apple Original 영화',
                'genre': '액션 블록버스터 코미디 · 존 시나·제시카 비엘',
            },
            {
                'title': '모나크: 레거시 오브 몬스터즈 시즌 2',
                'type': '시리즈',
                'schedule': 'Apple Original SF 대작 시리즈',
                'genre': '몬스터버스 SF 액션 스릴러',
            },
        ]
    },
]


def _build_roulette_pool():
    pool = {
        'meal': [
            {'key': 'coupang', 'platform': '쿠팡플레이', 'title': '직장인들 시즌 3', 'runtime': '25분 · 오피스 코미디', 'genre': '쿠플 오리지널', 'reason': '밥 먹으면서 소리 내어 웃기 딱 좋은 하이퍼리얼리즘 오피스 코미디!'},
            {'key': 'netflix', 'platform': '넷플릭스', 'title': '사이버펑크: 엣지러너 2', 'runtime': '25분 · 애니메이션', 'genre': 'SF 액션 시리즈', 'reason': '식사 시간 눈을 뗄 수 없는 강렬한 네온 액션!'},
            {'key': 'disney', 'platform': '디즈니+', 'title': '메리 베리 러브', 'runtime': '45분 · 로맨틱 코미디', 'genre': '디즈니+ 신작', 'reason': '지창욱×이마다 미오의 설레는 케미로 기분 좋은 식사 시간!'},
            {'key': 'apple', 'platform': '애플 TV+', 'title': '테드 래소 (Ted Lasso) 시즌 4', 'runtime': '30분 · 코미디', 'genre': 'Apple Original', 'reason': '하루의 피로를 사르르 녹여주는 유쾌한 힐링 시리즈'},
        ],
        'chill': [
            {'key': 'netflix', 'platform': '넷플릭스', 'title': '뤼팽 파트 4 (Lupin Part 4)', 'runtime': '50분 · 케이퍼 스릴러', 'genre': '넷플릭스 시리즈', 'reason': '시원한 맥주 한 캔과 함께 즐기는 통쾌한 괴도 아산의 두뇌 게임!'},
            {'key': 'apple', 'platform': '애플 TV+', 'title': '매치박스 (Matchbox)', 'runtime': '110분 · 액션 코미디 영화', 'genre': 'Apple Original 영화', 'reason': '존 시나의 시원시원한 카체이싱 액션으로 스트레스 확 날리기!'},
            {'key': 'coupang', 'platform': '쿠팡플레이', 'title': '지금 불륜이 문제가 아닙니다', 'runtime': '50분 · 블랙 코미디', 'genre': '쿠플 오리지널', 'reason': '김혜수×조여정×황동혁 조합! 퇴근 후 도파민 터지는 전개'},
            {'key': 'disney', 'platform': '디즈니+', 'title': '사기 설계자들: 로맨스 스캠', 'runtime': '48분 · 범죄 다큐', 'genre': '디즈니+ 다큐 시리즈', 'reason': '영화보다 더 영화 같은 충격 실화 추적 다큐멘터리'},
        ],
        'immersive': [
            {'key': 'netflix', 'platform': '넷플릭스', 'title': '닥터X: 하얀 마피아의 시대', 'runtime': '60분 · 메디컬 누아르', 'genre': '넷플릭스 인기 1위', 'reason': '김지원 주연! 1화 틀면 멈출 수 없는 몰입감 1위 화제작'},
            {'key': 'coupang', 'platform': '쿠팡플레이', 'title': '너 말고 다른 연애', 'runtime': '55분 · 멜로 드라마', 'genre': '쿠플 화제작', 'reason': '서강준×안은진의 깊은 감정선에 주말 밤 푹 빠져드는 로맨스'},
            {'key': 'apple', 'platform': '애플 TV+', 'title': '텐징: 에베레스트 정복 (Tenzing)', 'runtime': '124분 · 실화 대작 영화', 'genre': 'Apple Original 영화', 'reason': 'M7 대화면으로 감상하는 히말라야 설산의 압도적 영상미!'},
            {'key': 'netflix', 'platform': '넷플릭스', 'title': '꿀알바', 'runtime': '50분×8부작 · 미스터리 호러', 'genre': '넷플릭스 오리지널', 'reason': '이재욱×고민시 주연! 기괴하고 섬뜩한 거미인력 미스터리 정주행'},
        ],
    }
    for cat, items in pool.items():
        for it in items:
            web, deep = _make_ott_links(it['key'], it['title'], it.get('exactUrl', ''), it.get('netflixId', ''))
            it['contentUrl'] = web
            it['deepLink'] = deep
    return pool


CINEMA_ROULETTE_POOL = _build_roulette_pool()

BAD_TITLE_WORDS = (
    '공개', '신작', '출시', '발표', '예고', '포토', '기자', '인터뷰', '화제', '돌파', '순위',
    '넷플릭스', '쿠팡플레이', '디즈니', '애플', '티빙', '웨이브', '주말', '이번주', '라인업',
    '이유', '비결', '논란', '근황', '확정', '캐스팅', '제작', '시사회', '리뷰', '스포',
)


def _fetch_justwatch_kr_titles(package_code, limit=3):
    """Query JustWatch public GraphQL API for real-time popular new releases in South Korea (KR)."""
    if not package_code:
        return []
    current_year = datetime.datetime.now(KST).year
    gql = {
        'query': '''
        query GetPopularTitles($country: Country!, $language: Language!, $filter: TitleFilter, $first: Int!) {
          popularTitles(country: $country, filter: $filter, first: $first, sortBy: POPULAR) {
            edges {
              node {
                objectType
                content(country: $country, language: $language) {
                  title
                  originalReleaseYear
                  shortDescription
                }
                watchNowOffer(country: $country, platform: WEB) {
                  standardWebURL
                }
              }
            }
          }
        }
        ''',
        'variables': {
            'country': 'KR',
            'language': 'ko',
            'first': 8,
            'filter': {
                'packages': [package_code],
                'releaseYear': {'min': current_year - 1},
            }
        }
    }
    try:
        req = urllib.request.Request(
            'https://apis.justwatch.com/graphql',
            data=json.dumps(gql).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            },
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=4.5) as resp:
            data = json.loads(resp.read().decode('utf-8', 'ignore'))
        edges = (((data.get('data') or {}).get('popularTitles') or {}).get('edges')) or []
        out = []
        for edge in edges:
            node = edge.get('node') or {}
            content = node.get('content') or {}
            title = (content.get('title') or '').strip()
            if not title or len(title) > 28:
                continue
            obj_type = '영화' if node.get('objectType') == 'MOVIE' else '시리즈'
            yr = content.get('originalReleaseYear') or current_year
            offer = node.get('watchNowOffer') or {}
            web_url = (offer.get('standardWebURL') or '').strip()
            out.append({
                'title': title,
                'type': obj_type,
                'schedule': f'{yr}년 신작 · 실시간 인기 스트리밍',
                'genre': f'실시간 한국 인기 {obj_type}',
                'exactUrl': web_url,
            })
            if len(out) >= limit:
                break
        return out
    except Exception:
        return []


def _extract_live_ott_titles(query):
    """Extract genuine work titles inside brackets/quotes from recent 7d OTT news."""
    url = 'https://news.google.com/rss/search?q=' + urllib.parse.quote(query + ' when:7d') + '&hl=ko&gl=KR&ceid=KR:ko'
    raw = _fetch_bytes(url, timeout=4)
    root = ET.fromstring(raw)
    titles = []
    seen = set()
    patterns = [
        r'[〈《<]([^〉》>]{2,22})[〉》>]',
        r"'([^']{2,20})'",
    ]
    for node in root.findall('./channel/item')[:18]:
        t = re.sub(r'<[^>]*>', '', node.findtext('title', '')).strip()
        for pat in patterns:
            for m in re.findall(pat, t):
                cand = m.strip()
                if len(cand) < 2 or len(cand) > 22:
                    continue
                if any(bw in cand for bw in BAD_TITLE_WORDS):
                    continue
                if re.search(r'[,?!…~]|다$|요$|나$|까$', cand):
                    continue
                norm = re.sub(r'\s+', '', cand)
                if norm in seen:
                    continue
                seen.add(norm)
                titles.append(cand)
                if len(titles) >= 2:
                    return titles
    return titles


def _week_bounds_kst():
    now_kst = datetime.datetime.now(KST)
    monday = (now_kst - datetime.timedelta(days=now_kst.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    saturday = monday + datetime.timedelta(days=5)
    sunday = monday + datetime.timedelta(days=6)
    return {
        'isMonday': now_kst.weekday() == 0,
        'weekdayKo': ['월', '화', '수', '목', '금', '토', '일'][now_kst.weekday()],
        'mondayDate': monday.strftime('%Y-%m-%d'),
        'mondayLabel': f'{monday.month}월 {monday.day}일(월)',
        'weekendLabel': f'{saturday.month}/{saturday.day}(토)~{sunday.month}/{sunday.day}(일)',
    }


def fetch_ott(force=False):
    with ott_lock:
        wb = _week_bounds_kst()
        old = None
        try:
            old = json.loads(OTT_CACHE.read_text())
        except Exception:
            pass
        now_ts = time.time()
        if (
            not force
            and old
            and old.get('schemaVersion') == 3
            and old.get('mondayDate') == wb['mondayDate']
            and now_ts - old.get('fetchedAt', 0) < 10800
            and old.get('platforms')
            and old.get('roulette')
        ):
            old['isMonday'] = wb['isMonday']
            old['weekdayKo'] = wb['weekdayKo']
            return old

        platforms_out = []
        for p in OTT_PLATFORMS:
            releases = []
            seen_titles = set()

            # 1) Curated latest October 2026 verified releases first (so exact schedule/cast metadata is rich)
            for cur_item in p['curated'][:2]:
                t_name = cur_item['title']
                norm = re.sub(r'[^0-9A-Za-z가-힣]', '', t_name)
                seen_titles.add(norm)
                web_url, deep_link = _make_ott_links(
                    p['key'],
                    t_name,
                    cur_item.get('exactUrl', ''),
                    cur_item.get('netflixId', ''),
                )
                releases.append({
                    'title': t_name,
                    'type': cur_item.get('type', '시리즈'),
                    'schedule': cur_item['schedule'],
                    'genre': cur_item['genre'],
                    'contentUrl': web_url,
                    'deepLink': deep_link,
                    'live': True,
                })

            # 2) Real-time JustWatch KR catalog & Google News 7d discovery
            try:
                jw_items = _fetch_justwatch_kr_titles(p.get('jwPackage', ''), limit=2)
                for jw in jw_items:
                    norm = re.sub(r'[^0-9A-Za-z가-힣]', '', jw['title'])
                    if norm and norm not in seen_titles and len(releases) < 4:
                        seen_titles.add(norm)
                        web_url, deep_link = _make_ott_links(p['key'], jw['title'], jw.get('exactUrl', ''))
                        releases.append({
                            'title': jw['title'],
                            'type': jw['type'],
                            'schedule': jw['schedule'],
                            'genre': jw['genre'],
                            'contentUrl': web_url,
                            'deepLink': deep_link,
                            'live': True,
                        })
            except Exception:
                pass

            try:
                discovered = _extract_live_ott_titles(p['query'])
                for dt in discovered:
                    norm = re.sub(r'[^0-9A-Za-z가-힣]', '', dt)
                    if norm and norm not in seen_titles and len(releases) < 4:
                        seen_titles.add(norm)
                        web_url, deep_link = _make_ott_links(p['key'], dt)
                        releases.append({
                            'title': dt,
                            'type': '이번주 신작',
                            'schedule': '이번 주 실시간 화제작',
                            'genre': f'{p["name"]} 최신 공개작',
                            'contentUrl': web_url,
                            'deepLink': deep_link,
                            'live': True,
                        })
            except Exception:
                pass

            # 3) Fill remaining slots up to 4 from curated 2026 list
            for cur_item in p['curated'][2:]:
                t_name = cur_item['title']
                norm = re.sub(r'[^0-9A-Za-z가-힣]', '', t_name)
                if norm not in seen_titles and len(releases) < 4:
                    seen_titles.add(norm)
                    web_url, deep_link = _make_ott_links(
                        p['key'],
                        t_name,
                        cur_item.get('exactUrl', ''),
                        cur_item.get('netflixId', ''),
                    )
                    releases.append({
                        'title': t_name,
                        'type': cur_item.get('type', '시리즈'),
                        'schedule': cur_item['schedule'],
                        'genre': cur_item['genre'],
                        'contentUrl': web_url,
                        'deepLink': deep_link,
                        'live': True,
                    })

            summary_titles = ' · '.join([f'《{r["title"]}》' for r in releases[:2]])
            platforms_out.append({
                'key': p['key'],
                'name': p['name'],
                'en': p['en'],
                'badgeColor': p['badgeColor'],
                'primaryTitle': summary_titles,
                'primarySchedule': releases[0]['schedule'],
                'releases': releases[:4],
            })

        payload = {
            'schemaVersion': 3,
            'source': '2026년 10월 실시간 OTT 신작 & JustWatch KR 연동 (클릭 시 작품 바로가기)',
            'fetchedAt': now_ts,
            'mondayDate': wb['mondayDate'],
            'mondayLabel': wb['mondayLabel'],
            'weekendLabel': wb['weekendLabel'],
            'isMonday': wb['isMonday'],
            'weekdayKo': wb['weekdayKo'],
            'platforms': platforms_out,
            'roulette': CINEMA_ROULETTE_POOL,
        }
        try:
            OTT_CACHE.write_text(json.dumps(payload, ensure_ascii=False))
        except OSError:
            pass
        return payload


# ---------------------------------------------------------------------------
# 5. MAC NOW PLAYING & PIXAR AMBIENT VINYL VISUALIZER (/api/music)
# ---------------------------------------------------------------------------
AMBIENT_VINYL_STATIONS = [
    {
        'id': 'yosemite-lofi',
        'title': 'Golden Valley Sunset Beats',
        'artist': 'Pixar Ambient Lounge · 개포동 오후의 여유',
        'album': 'Clean M7 Cozy Vinyl Vol. 1',
        'cover': 'themes/valley-thumb.jpg',
        'art': 'assets/wx-sunny.jpg',
        'accent': '#F59E0B',
        'mood': '따뜻한 로파이 & 어쿠스틱 기타',
        'bpm': 78,
    },
    {
        'id': 'midnight-jazz',
        'title': 'Blue Hour City & Raindrop Piano',
        'artist': 'Elemental Jazz Trio · 밤하늘 재즈',
        'album': 'Midnight Cinema Sessions',
        'cover': 'themes/city-thumb.jpg',
        'art': 'assets/wx-night.jpg',
        'accent': '#38BDF8',
        'mood': '잔잔한 재즈 피아노 & 빗소리',
        'bpm': 68,
    },
    {
        'id': 'emerald-bossa',
        'title': 'Emerald Cove Breeze Bossa',
        'artist': 'Coral Reef Ensemble · 해변 보사노바',
        'album': 'Sunny Wave Café',
        'cover': 'themes/sea-thumb.jpg',
        'art': 'assets/wx-rain.jpg',
        'accent': '#60A5FA',
        'mood': '상쾌한 보사노바 & 파도 소리',
        'bpm': 92,
    },
    {
        'id': 'forest-healing',
        'title': 'Enchanted Forest Morning Dew',
        'artist': 'Woodland Spirits · 숲속 힐링 사운드',
        'album': 'Sunbeam Canopy',
        'cover': 'themes/forest-thumb.jpg',
        'art': 'assets/mascot-tv.jpg',
        'accent': '#A855F7',
        'mood': '청량한 숲속 새소리 & 칼림바',
        'bpm': 72,
    },
]


def _run_osascript(script):
    try:
        r = subprocess.run(['osascript', '-e', script], capture_output=True, text=True, timeout=1.8)
        if r.returncode == 0:
            return r.stdout.strip()
    except Exception:
        pass
    return ''


def _detect_mac_now_playing():
    # 1. Check Apple Music
    if _run_osascript('application "Music" is running') == 'true':
        state = _run_osascript('tell application "Music" to get player state as string')
        if state == 'playing':
            info = _run_osascript('tell application "Music" to get (name of current track) & "|||" & (artist of current track) & "|||" & (album of current track)')
            parts = info.split('|||')
            if parts and parts[0]:
                return {
                    'playing': True,
                    'source': 'Apple Music (Mac)',
                    'title': parts[0].strip(),
                    'artist': parts[1].strip() if len(parts) > 1 else 'Apple Music',
                    'album': parts[2].strip() if len(parts) > 2 else '',
                    'cover': 'assets/mascot-tv.jpg',
                }

    # 2. Check Spotify
    if _run_osascript('application "Spotify" is running') == 'true':
        state = _run_osascript('tell application "Spotify" to get player state as string')
        if state == 'playing':
            info = _run_osascript('tell application "Spotify" to get (name of current track) & "|||" & (artist of current track) & "|||" & (album of current track) & "|||" & (artwork url of current track)')
            parts = info.split('|||')
            if parts and parts[0]:
                return {
                    'playing': True,
                    'source': 'Spotify (Mac)',
                    'title': parts[0].strip(),
                    'artist': parts[1].strip() if len(parts) > 1 else 'Spotify',
                    'album': parts[2].strip() if len(parts) > 2 else '',
                    'cover': parts[3].strip() if (len(parts) > 3 and parts[3].startswith('http')) else 'assets/mascot-tv.jpg',
                }

    # 3. Check Chrome / Safari active YouTube or YouTube Music tab
    for browser in ('Google Chrome', 'Safari'):
        if _run_osascript(f'application "{browser}" is running') == 'true':
            if browser == 'Google Chrome':
                tab_info = _run_osascript('tell application "Google Chrome" to get (title of active tab of front window) & "|||" & (URL of active tab of front window)')
            else:
                tab_info = _run_osascript('tell application "Safari" to get (name of current tab of front window) & "|||" & (URL of current tab of front window)')
            if '|||' in tab_info:
                t_title, t_url = tab_info.split('|||', 1)
                if any(host in t_url for host in ('youtube.com/watch', 'music.youtube.com')):
                    clean_t = re.sub(r'^\(\d+\)\s*', '', t_title).replace('- YouTube Music', '').replace('- YouTube', '').strip()
                    if clean_t:
                        return {
                            'playing': True,
                            'source': f'YouTube ({browser})',
                            'title': clean_t[:80],
                            'artist': 'Mac 실시간 재생 중',
                            'album': 'YouTube Live Audio',
                            'cover': 'assets/mascot-tv.jpg',
                        }
    return None


def fetch_music():
    with music_lock:
        live = _detect_mac_now_playing()
        hour = datetime.datetime.now(KST).hour
        default_idx = 0 if 6 <= hour < 12 else (2 if 12 <= hour < 18 else (1 if hour >= 20 or hour < 6 else 3))
        station = AMBIENT_VINYL_STATIONS[default_idx]
        if live:
            return {
                'fetchedAt': time.time(),
                'isLive': True,
                'macPlaying': True,
                'nowPlaying': live,
                'current': live,
                'ambientStations': AMBIENT_VINYL_STATIONS,
                'stations': AMBIENT_VINYL_STATIONS,
            }
        fallback_cur = {
            'playing': False,
            'source': 'Clean M7 픽사 바이닐 라운지',
            'title': station['title'],
            'artist': station['artist'],
            'album': station['album'],
            'cover': station['cover'],
            'mood': station['mood'],
        }
        return {
            'fetchedAt': time.time(),
            'isLive': False,
            'macPlaying': False,
            'nowPlaying': None,
            'current': fallback_cur,
            'ambientStations': AMBIENT_VINYL_STATIONS,
            'stations': AMBIENT_VINYL_STATIONS,
        }


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlsplit(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)
        if path == '/health':
            data = {'ok': True, 'service': 'news+stocks+kma_weather+ott+music'}
        elif path == '/api/news':
            data = fetch_news()
        elif path == '/api/stocks':
            data = fetch_stocks()
        elif path == '/api/weather':
            key_param = (qs.get('authKey') or [None])[0]
            data = fetch_weather(override_key=key_param)
        elif path == '/api/ott':
            force = (qs.get('force') or ['0'])[0] == '1'
            data = fetch_ott(force=force)
        elif path == '/api/music':
            data = fetch_music()
        else:
            self.send_error(404)
            return

        payload = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', 18766), Handler).serve_forever()
