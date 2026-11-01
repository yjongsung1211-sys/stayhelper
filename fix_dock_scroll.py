with open(r'c:\Users\Administrator\Desktop\프로젝트\1인기업대표\app\stayhelper\page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

pattern = r'  // Auto-scroll active item into view in the dock\r?\n\s*useEffect\(\(\) => \{\r?\n\s*if \(dockScrollRef\.current\) \{\r?\n\s*const activeEl = dockScrollRef\.current\.querySelector\(`\[data-dock-id="\$\{selectedStayId\}"\]`\) as HTMLElement;\r?\n\s*if \(activeEl\) \{\r?\n\s*activeEl\.scrollIntoView\(\{ behavior: "smooth", block: "nearest", inline: "center" \}\);\r?\n\s*\}\r?\n\s*\}\r?\n\s*\}, \[selectedStayId\]\);'

replacement = '''  // Auto-scroll active item horizontally into view in the dock without scrolling window
  useEffect(() => {
    if (dockScrollRef.current) {
      const activeEl = dockScrollRef.current.querySelector(`[data-dock-id="${selectedStayId}"]`) as HTMLElement;
      if (activeEl) {
        const container = dockScrollRef.current;
        const scrollTarget = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
        container.scrollTo({ left: scrollTarget, behavior: "smooth" });
      }
    }
  }, [selectedStayId]);'''

new_text, count = re.subn(pattern, replacement, text)
print("Sub count:", count)
if count > 0:
    with open(r'c:\Users\Administrator\Desktop\프로젝트\1인기업대표\app\stayhelper\page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully replaced!")
else:
    print("Pattern not matched!")
