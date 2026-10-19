"""Run with Vite serving: python tools/check_responsive.py [base-url].

Requires Python Playwright and Chromium. Screenshots go to artifacts/responsive.
"""
import json
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:5173/'
OUT = Path(__file__).resolve().parents[1] / 'artifacts' / 'responsive'
SIZES = [(320, 568), (375, 667), (390, 844), (430, 932), (768, 1024),
         (844, 390), (900, 900), (901, 900), (1024, 768), (1440, 900), (1920, 1080)]

def check_layout(page):
    problems = page.evaluate("""() => {
      const issues = [];
      const width = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > width + 1) issues.push('horizontal page overflow');
      for (const el of document.querySelectorAll('h1, h2, .flist, .btn, .nav, .security__img, .hero__img, .features__img, .legal')) {
        const r = el.getBoundingClientRect();
        if (r.left < -1 || r.right > width + 1) issues.push(el.className || el.tagName);
        if (el.scrollWidth > el.clientWidth + 1) issues.push('internal overflow: ' + (el.className || el.tagName));
      }
      return issues;
    }""")
    assert not problems, problems

with sync_playwright() as p:
    browser = p.chromium.launch(channel=os.environ.get('PLAYWRIGHT_CHANNEL') or None)
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    for width, height in SIZES:
        context = browser.new_context(viewport={'width': width, 'height': height},
                                      device_scale_factor=1, has_touch=width <= 900,
                                      reduced_motion='reduce')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE, wait_until='networkidle')
        page.wait_for_selector('.robot3d canvas')
        for lang in ['ru', 'en']:
            page.get_by_role('button', name=lang.upper(), exact=True).click()
            for theme in ['Light', 'Dark']:
                page.get_by_role('button', name=theme, exact=True).click()
                check_layout(page)
                for target in ['security', 'features', 'top']:
                    page.locator(f'.nav__row:not(.nav__row--blue) a[href="#{target}"]').click()
                    page.wait_for_timeout(120)
                    assert page.locator(f'.nav__row:not(.nav__row--blue) a[href="#{target}"]').get_attribute('aria-current') == 'page'
                    if target != 'top':
                        nav = page.locator('.nav').bounding_box()
                        title = page.locator(f'#{target} h2').bounding_box()
                        assert title['y'] >= nav['y'] + nav['height'], 'heading hidden behind navigation'
                if width in [320, 390, 768, 901, 1440] and lang == 'ru' and theme == 'Dark':
                    page.screenshot(path=str(OUT / f'{width}x{height}.png'), full_page=True)
            for label in ['Terms of Service', 'Privacy']:
                page.get_by_role('link', name=label, exact=True).click()
                page.wait_for_selector('.legal')
                check_layout(page)
                page.locator('.legal__back').click()
                page.wait_for_selector('.hero')
        assert not errors, errors
        results.append({'viewport': f'{width}x{height}', 'status': 'passed'})
        print(f'PASS {width}x{height}: RU/EN, light/dark, navigation, legal pages', flush=True)
        context.close()
    page = browser.new_page(viewport={'width': 320, 'height': 568})
    page.goto(BASE, wait_until='networkidle')
    positions = []
    for _ in range(16):
        positions.append(page.locator('.hero .btn').bounding_box()['y'])
        page.wait_for_timeout(500)
    assert max(positions) - min(positions) < 1, positions
    print('PASS animated heading keeps the download button stable', flush=True)
    browser.close()
    (OUT / 'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
