#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vercel Read-Only API Traffic & Referrer Collector
- Target: StayHelper, StylingHelper, RoomHelper, etc.
- Metrics: Total Visits, Pageviews, Referrers (Instagram, Pinterest, Google), Top Countries, Top Paths
"""

import os
import sys
import json
import urllib.request
import urllib.parse
from datetime import datetime, timedelta

def load_env():
    env_paths = ['.env.local', '.env']
    for p in env_paths:
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k not in os.environ:
                            os.environ[k] = v

def vercel_api_get(endpoint, token, params=None):
    url = f"https://api.vercel.com{endpoint}"
    if params:
        query_str = urllib.parse.urlencode(params)
        url = f"{url}?{query_str}"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "User-Agent": "Hana-AI-Assistant/1.0"
    }
    
    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            if res.status == 200:
                data = res.read().decode('utf-8')
                return json.loads(data)
            return {"error": f"HTTP {res.status}"}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        return {"error": f"HTTP {e.code}: {e.reason}", "detail": err_body}
    except Exception as e:
        return {"error": str(e)}

def collect_vercel_traffic():
    load_env()
    token = os.environ.get("VERCEL_TOKEN") or os.environ.get("VERCEL_API_TOKEN")
    
    if not token or token.startswith("YOUR_"):
        print("\n[VERCEL_TOKEN_NOT_FOUND]")
        print("Vercel Read-Only Token is not configured in .env or .env.local yet.")
        print("Please set VERCEL_TOKEN=<token> in .env or .env.local\n")
        return None

    print(f"[*] Authenticating with Vercel API using provided token...")
    projects_res = vercel_api_get("/v9/projects", token)
    
    if "error" in projects_res:
        print(f"[-] Failed to fetch projects: {projects_res}")
        return {"error": projects_res}
    
    projects = projects_res.get("projects", [])
    print(f"[+] Successfully fetched {len(projects)} projects from Vercel.")

    now = datetime.utcnow()
    yesterday = now - timedelta(days=1)
    since_str = yesterday.strftime("%Y-%m-%dT00:00:00.000Z")
    until_str = now.strftime("%Y-%m-%dT%H:%M:%S.000Z")

    summary_results = []

    for prj in projects:
        prj_id = prj.get("id")
        prj_name = prj.get("name")
        targets = prj.get("targets", {})
        prod_target = targets.get("production", {})
        prod_alias = prod_target.get("alias", [f"{prj_name}.vercel.app"])

        print(f"[*] Analyzing project: {prj_name} ({prj_id})")

        # 1. Total Visits / Count
        visits_res = vercel_api_get(
            "/v1/query/web-analytics/visits/count",
            token,
            {"projectId": prj_id, "since": since_str, "until": until_str}
        )

        # 2. Referrers Aggregate
        ref_res = vercel_api_get(
            "/v1/query/web-analytics/visits/aggregate",
            token,
            {"projectId": prj_id, "since": since_str, "until": until_str, "by": "referrerHostname", "limit": 10}
        )

        # 3. Countries Aggregate
        country_res = vercel_api_get(
            "/v1/query/web-analytics/visits/aggregate",
            token,
            {"projectId": prj_id, "since": since_str, "until": until_str, "by": "country", "limit": 5}
        )

        # 4. Top Paths
        paths_res = vercel_api_get(
            "/v1/query/web-analytics/visits/aggregate",
            token,
            {"projectId": prj_id, "since": since_str, "until": until_str, "by": "requestPath", "limit": 5}
        )

        summary_results.append({
            "projectId": prj_id,
            "projectName": prj_name,
            "domains": prod_alias,
            "visits": visits_res,
            "referrers": ref_res,
            "countries": country_res,
            "paths": paths_res
        })

    # Save to reports
    os.makedirs("reports", exist_ok=True)
    report_json_path = os.path.join("reports", "traffic_daily_report.json")
    with open(report_json_path, "w", encoding="utf-8") as f:
        json.dump({"timestamp": datetime.now().isoformat(), "projects": summary_results}, f, ensure_ascii=False, indent=2)

    # Generate Markdown Report
    report_md_path = os.path.join("reports", "traffic_daily_report.md")
    with open(report_md_path, "w", encoding="utf-8") as f:
        f.write(f"# 📊 Vercel Daily Traffic & SNS Inflow Report\n\n")
        f.write(f"- **Report Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"- **Data Range**: Past 24 Hours ({yesterday.strftime('%Y-%m-%d')} ~ {now.strftime('%Y-%m-%d')})\n\n")
        
        for item in summary_results:
            p_name = item["projectName"]
            domains = ", ".join(item["domains"][:2]) if item["domains"] else "N/A"
            f.write(f"## 🌐 {p_name} ({domains})\n\n")
            
            # Visits
            visits = item["visits"]
            if isinstance(visits, dict) and "error" in visits:
                f.write(f"> ⚠️ Web Analytics status: {visits.get('error')} (Ensure Web Analytics is enabled in project settings)\n\n")
            else:
                total_val = visits.get("value", 0) if isinstance(visits, dict) else visits
                f.write(f"* **Total Visitors / Views**: `{total_val}`\n\n")

            # Referrers (Instagram, Pinterest, etc.)
            refs = item.get("referrers", {})
            f.write(f"### 📱 Inflow Sources (Referrers):\n")
            if isinstance(refs, dict) and "data" in refs and refs["data"]:
                f.write("| Inflow Channel | Visitors / Hits |\n| :--- | :---: |\n")
                for r in refs["data"]:
                    ref_host = r.get("referrerHostname") or "Direct / None"
                    count = r.get("value", 0)
                    icon = "📸 " if "instagram" in ref_host.lower() else ("📌 " if "pinterest" in ref_host.lower() else ("🔍 " if "google" in ref_host.lower() else "🌐 "))
                    f.write(f"| {icon}{ref_host} | **{count}** |\n")
                f.write("\n")
            else:
                f.write(f"* No specific external referrer recorded or Web Analytics enabled.\n\n")

            # Countries
            cnts = item.get("countries", {})
            if isinstance(cnts, dict) and "data" in cnts and cnts["data"]:
                f.write(f"### 🌍 Top Countries:\n")
                for c in cnts["data"]:
                    c_code = c.get("country", "Unknown")
                    c_val = c.get("value", 0)
                    f.write(f"- `{c_code}`: {c_val} visits\n")
                f.write("\n")

            f.write("---\n\n")

    print(f"\n[+] Successfully saved daily traffic report to:")
    print(f"    - {report_md_path}")
    print(f"    - {report_json_path}")
    return summary_results

if __name__ == "__main__":
    collect_vercel_traffic()
