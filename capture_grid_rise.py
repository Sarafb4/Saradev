import subprocess, os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
artifact_dir = r"C:\Users\SARA FAJARDO\.gemini\antigravity\brain\1453322d-39ce-4afd-92ac-fa3bcea7b574"

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

test_html = html.replace('<body class="boot">', '<body class="ready">')
test_html = test_html.replace('id="boot"', 'id="boot" style="display:none !important;"')

test_path = 'test_hero_grid_rise.html'
with open(test_path, 'w', encoding='utf-8') as f:
    f.write(test_html)

out_png = os.path.join(artifact_dir, 'preview_hero_grid_rise.png')
cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--virtual-time-budget=2000",
    "--window-size=1280,820",
    f"--screenshot={out_png}",
    f"file:///{os.path.abspath(test_path).replace(os.sep, '/')}"
]
subprocess.run(cmd, capture_output=True, text=True)
print("Preview hero grid rise created:", os.path.exists(out_png))
