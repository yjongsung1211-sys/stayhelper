import urllib.request
import urllib.parse
import json
from datetime import datetime, timedelta, timezone

import os
token = os.environ.get('VERCEL_TOKEN', '')
headers = {'Authorization': 'Bearer ' + token}

projects = [
    {'name': 'thestayhelper (통합 멀티테넌트)', 'id': 'prj_CEwRD2ZD2WUmBWUYSwrWteuKnXDS'},
    {'name': 'roomhelper', 'id': 'prj_wF5Q5BBYguCZTKErMYMdII91QZsR'},
    {'name': 'stylinghelper', 'id': 'prj_oDfRo6oHRrSi0BSoKT4iZgfR9o4C'},
    {'name': 'secondbrain-note', 'id': 'prj_h0f9EADhDnM58YZjFADyB3boe05O'},
]

now_utc = datetime.now(timezone.utc)
since = (now_utc - timedelta(days=7)).strftime('%Y-%m-%dT00:00:00.000Z')
until = now_utc.strftime('%Y-%m-%dT23:59:59.000Z')

print(f"=== 최근 1주일 웹 트래픽 분석 기간: {since[:10]} ~ {until[:10]} ===")

for p in projects:
    prj_id = p['id']
    prj_name = p['name']
    
    # 1. Total counts for this week
    params = urllib.parse.urlencode({'projectId': prj_id, 'since': since, 'until': until})
    url = f"https://api.vercel.com/v1/query/web-analytics/visits/count?{params}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            cnt = data.get('data', {})
            print(f"\n[{prj_name}] 총 방문자수(Visitors): {cnt.get('visitors', 0)}명 / 페이지뷰(Pageviews): {cnt.get('pageviews', 0)}회")
    except Exception as e:
        print(f"\n[{prj_name}] Count Error: {e}")
        continue

    # 2. Dimensions analysis
    dims = ['path', 'country', 'referrer', 'deviceType', 'browserName', 'os']
    for dim in dims:
        d_params = urllib.parse.urlencode({'projectId': prj_id, 'since': since, 'until': until, 'by': dim})
        d_url = f"https://api.vercel.com/v1/query/web-analytics/visits/aggregate?{d_params}"
        d_req = urllib.request.Request(d_url, headers=headers)
        try:
            with urllib.request.urlopen(d_req) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                items = res.get('data', [])
                if items:
                    print(f"  ▶ 기준 [{dim}]: 총 {len(items)}개 항목")
                    for item in items[:10]:
                        key = item.get(dim) or item.get('key') or '(none/direct)'
                        v = item.get('visitors', 0)
                        pv = item.get('pageviews', 0)
                        print(f"     - {key}: 방문자 {v}명 | PV {pv}회")
        except Exception as e:
            # print error
            pass
