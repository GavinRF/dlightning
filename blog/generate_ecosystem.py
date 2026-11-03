"""Keeps the essay count on ecosystem.html in step with the blog metadata.

The ecosystem map's Sparks card opens "Thirty-nine essays and an RSS feed." and
the page says its counts come from the blog metadata file, so the number is
rewritten here on every publish instead of being edited by hand.

The count is matched by its sentence rather than by a marker comment, so the
page markup stays as written. If the card is reworded and the sentence is no
longer found, this prints a warning and leaves the page alone: a stale number
on one page is not worth failing a blog publish over.
"""

import re

ECOSYSTEM_PATH = "ecosystem.html"

# A spelled-out number (or digits) followed by the fixed card wording.
COUNT_RE = re.compile(r">([A-Z][a-z]+(?:-[a-z]+)?|\d+) essays and an RSS feed\.")

ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
        "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
        "sixteen", "seventeen", "eighteen", "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy",
        "eighty", "ninety"]


def spell(n):
    """Capitalised English words for 0-99; digits from 100 up."""
    if n < 20:
        words = ONES[n]
    elif n < 100:
        tens, ones = divmod(n, 10)
        words = TENS[tens] + (f"-{ONES[ones]}" if ones else "")
    else:
        return str(n)
    return words[0].upper() + words[1:]


def write_ecosystem_count(metadata):
    """Returns (count, changed). changed is None when the sentence wasn't found."""
    count = len(metadata["posts"])
    with open(ECOSYSTEM_PATH, "r") as f:
        page = f.read()

    if not COUNT_RE.search(page):
        return count, None

    updated = COUNT_RE.sub(f">{spell(count)} essays and an RSS feed.", page, count=1)
    if updated == page:
        return count, False
    with open(ECOSYSTEM_PATH, "w") as f:
        f.write(updated)
    return count, True
