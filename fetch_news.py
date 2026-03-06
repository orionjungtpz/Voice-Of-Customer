import json
import feedparser
from datetime import datetime, timezone, timedelta

KST = timezone(timedelta(hours=9))

now_kst      = datetime.now(KST)
today_label  = now_kst.strftime("%m/%d")
yesterday    = (now_kst - timedelta(days=1)).strftime("%m/%d")

FEEDS = [
    {
        "id": "posco",
        "label": f"📌 포스코인터내셔널 ({yesterday} 기사)",
        "url": "https://www.google.com/alerts/feeds/11413010082229595622/8909484378913146132",
        "count": 3
    },
    {
        "id": "mk",
        "label": f"📰 매일경제 ({today_label})",
        "url": "https://www.mk.co.kr/rss/30000001/",
        "count": 3
    }
]

def fetch_feed(feed_info):
    try:
        d = feedparser.parse(feed_info["url"])
        items = []
        for entry in d.entries[:feed_info["count"]]:
            title = entry.get("title", "").strip()
            link  = entry.get("link", "#")
            # 날짜 파싱
            pub = ""
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).astimezone(KST)
                pub = dt.strftime("%m/%d %H:%M")
            items.append({"title": title, "link": link, "pub": pub})
        return items
    except Exception as e:
        print(f"[{feed_info['id']}] 오류: {e}")
        return []

result = {
    "updated": datetime.now(KST).strftime("%Y-%m-%d %H:%M KST"),
    "sections": []
}

for feed in FEEDS:
    items = fetch_feed(feed)
    print(f"[{feed['id']}] {len(items)}개 수집")
    result["sections"].append({
        "label": feed["label"],
        "items": items
    })

with open("news.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"news.json 저장 완료 ({result['updated']})")
