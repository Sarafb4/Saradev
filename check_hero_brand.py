import subprocess, os

# Let's inspect index.html around saradev
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
match = re.search(r'<div class="hero-brand-col">[\s\S]*?</div>\s*</div>', html)
if match:
    print("Found hero-brand-col:")
    print(match.group(0)[:400])
