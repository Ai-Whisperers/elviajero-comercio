import json
with open('content/es.json') as f:
    d = json.load(f)

main = d['home']['productCatalog']['products']
main_names = set(p['name'] for p in main)
print(f'Main catalog: {len(main)} products')

missing = [p for p in main if not p.get('imageUrl')]
if missing:
    print(f'Products WITHOUT image: {len(missing)}')
    for p in missing:
        print(f'  {p["name"]}')
else:
    print('All main products have imageUrl. Good.')

na = d['home'].get('newArrivals', {}).get('products', [])
bs = d['home'].get('bestSellers', {}).get('products', [])
fp = d['home'].get('featuredProducts', {}).get('products', [])

for label, arr in [('New arrivals', na), ('Best sellers', bs), ('Featured', fp)]:
    miss = [p for p in arr if not p.get('imageUrl')]
    if miss:
        print(f'\n{label} without image:')
        for p in miss:
            print(f'  {p["name"]}')
    else:
        print(f'{label}: all have images ✓')

bs_extra = [p for p in bs if p['name'] not in main_names]
fp_extra = [p for p in fp if p['name'] not in main_names]
if bs_extra:
    print(f'\nBestSellers extra (not in main catalog):')
    for p in bs_extra:
        print(f'  {p["name"]} → {p.get("imageUrl","NO IMAGE")}')
if fp_extra:
    print(f'\nFeatured extra (not in main catalog):')
    for p in fp_extra:
        print(f'  {p["name"]} → {p.get("imageUrl","NO IMAGE")}')

# Check bestSellers items without PNG
bs_extra_noimg = [p for p in bs_extra if not p.get('imageUrl')]
fp_extra_noimg = [p for p in fp_extra if not p.get('imageUrl')]
if bs_extra_noimg or fp_extra_noimg:
    print(f'\n!!! Extra products with NO IMAGE:')
    for p in bs_extra_noimg + fp_extra_noimg:
        print(f'  {p["name"]}')
else:
    print('\nExtra products all have images too ✓')
