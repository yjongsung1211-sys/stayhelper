with open('app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('const CARD_ASSET_VER = "?v=20261107_v11";', 'const CARD_ASSET_VER = "?v=20261107_v12";')

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Bumped CARD_ASSET_VER to v12 successfully!")
