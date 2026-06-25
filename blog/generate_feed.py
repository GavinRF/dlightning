import json
from datetime import datetime, timezone
from xml.sax.saxutils import escape

SITE = "https://dlightning.org"
FEED_URL = f"{SITE}/blog/feed.xml"
BLOG_URL = f"{SITE}/blog/"

# Month tokens used in the metadata "date" field, normalized to numbers.
# Handles both full names and abbreviations (including the non-standard "Sept").
MONTHS = {
    "jan": 1, "january": 1,
    "feb": 2, "february": 2,
    "mar": 3, "march": 3,
    "apr": 4, "april": 4,
    "may": 5,
    "jun": 6, "june": 6,
    "jul": 7, "july": 7,
    "aug": 8, "august": 8,
    "sep": 9, "sept": 9, "september": 9,
    "oct": 10, "october": 10,
    "nov": 11, "november": 11,
    "dec": 12, "december": 12,
}


def parse_date(s):
    # e.g. "June 21, 2026", "Sept 29, 2025", "Mar 4, 2024"
    month_str, day, year = s.replace(",", "").split()
    month = MONTHS[month_str.lower()]
    return datetime(int(year), month, int(day), tzinfo=timezone.utc)


def rfc822(dt):
    return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")


def load_metadata():
    with open("blog/blog-posts-metadata.json", "r") as f:
        return json.load(f)


def build_feed(metadata):
    posts = sorted(metadata["posts"], key=lambda p: parse_date(p["date"]), reverse=True)
    now = rfc822(datetime.now(timezone.utc))

    items = []
    for post in posts:
        url = f"{SITE}/blog-posts/{post['id']}.html"
        pub = rfc822(parse_date(post["date"]))
        image = f"{SITE}/blog/{post['image']}"
        categories = "".join(
            f"      <category>{escape(t)}</category>\n" for t in post.get("tags", [])
        )
        items.append(f"""    <item>
      <title>{escape(post['title'])}</title>
      <link>{url}</link>
      <guid isPermaLink="true">{url}</guid>
      <pubDate>{pub}</pubDate>
      <dc:creator>{escape(post['author'])}</dc:creator>
      <description><![CDATA[{post['excerpt']}]]></description>
      <enclosure url="{escape(image)}" type="image/jpeg" />
{categories}    </item>""")

    items_xml = "\n".join(items)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Sparks &#8212; Dlightning</title>
    <link>{BLOG_URL}</link>
    <atom:link href="{FEED_URL}" rel="self" type="application/rss+xml" />
    <description>Insights on experience design, customer psychology, and building products that connect.</description>
    <language>en-us</language>
    <lastBuildDate>{now}</lastBuildDate>
{items_xml}
  </channel>
</rss>
"""


def write_feed(metadata=None):
    if metadata is None:
        metadata = load_metadata()
    feed = build_feed(metadata)
    with open("blog/feed.xml", "w") as f:
        f.write(feed)
    return len(metadata["posts"])


if __name__ == "__main__":
    count = write_feed()
    print(f"Done. Wrote blog/feed.xml with {count} items.")


# RUN COMMAND to Generate the RSS feed from MetaData
# python3 blog/generate_feed.py
