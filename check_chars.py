#!/usr/bin/env python3
with open('src/landing-supplement-translations.js', encoding='utf-8') as f:
    lines = f.readlines()

line = lines[1253]
print(f"Line length: {len(line)}")
print(f"Chars around Arabic positions:")
for i in range(170, 195):
    c = line[i]
    script = "Arabic" if 0x0600 <= ord(c) <= 0x06FF else "Deva" if 0x0900 <= ord(c) <= 0x097F else "ASCII" if ord(c) < 128 else "Other"
    print(f"  [{i}] U+{ord(c):04X} '{c}' ({script})")

# Try to replace using exact positions
prefix = line[:175]  # before the Arabic section
suffix = line[187:]  # after "خود आता है।"
print(f"\nPrefix end (last 20): {repr(prefix[-20:])}")
print(f"Suffix start (first 20): {repr(suffix[:20])}")
print(f"Middle (175-187): {repr(line[175:187])}")
