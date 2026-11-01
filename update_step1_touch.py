import re

file_path = r'c:\Users\Administrator\Desktop\프로젝트\1인기업대표\app\stayhelper\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add touch refs and touch handlers before return
touch_logic = '''  // Touch swipe detection for mobile reels
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaTime = Date.now() - (touchStartTime.current || 0);

    // If swipe was deliberate (within 600ms and threshold > 45px)
    if (deltaTime < 600) {
      if (deltaY < -45 || deltaX < -50) {
        // Swiped UP or LEFT -> Next Stay!
        handleNextStay();
      } else if (deltaY > 45 || deltaX > 50) {
        // Swiped DOWN or RIGHT -> Previous Stay!
        handlePrevStay();
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };
'''

if 'const touchStartY' not in content:
    content = content.replace('  const FORA_VIP_INTAKE_URL =', touch_logic + '\n  const FORA_VIP_INTAKE_URL =')

print('Touch logic inserted:', 'const touchStartY' in content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
