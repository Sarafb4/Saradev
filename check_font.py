import subprocess, os

test_html = """<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap" rel="stylesheet">
<style>
body { background: #14050a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Pixelify Sans', monospace; }
.hero-brand { display: flex; flex-direction: column; align-items: flex-start; line-height: 0.9; }
.row-sara { font-size: 8rem; color: #ffffff; letter-spacing: -0.04em; }
.row-dev { font-size: 8rem; color: #ff9fb4; letter-spacing: -0.04em; margin-left: 2rem; }
.ghost { color: rgba(255, 159, 180, 0.4); }
.cursor { color: #f43f5e; animation: blink 1s infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
</head>
<body>
  <div class="hero-brand">
    <div class="row-sara">sara</div>
    <div class="row-dev">dev<span class="cursor">|</span><span class="ghost">eloper</span></div>
  </div>
</body>
</html>
"""

with open('test_pixel_font.html', 'w', encoding='utf-8') as f:
    f.write(test_html)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
artifact_dir = r"C:\Users\SARA FAJARDO\.gemini\antigravity\brain\1453322d-39ce-4afd-92ac-fa3bcea7b574"
out_png = os.path.join(artifact_dir, 'preview_pixel_font.png')

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1200,800",
    f"--screenshot={out_png}",
    f"file:///{os.path.abspath('test_pixel_font.html').replace(os.sep, '/')}"
]
subprocess.run(cmd, capture_output=True, text=True)
print("Preview pixel font created:", os.path.exists(out_png))
