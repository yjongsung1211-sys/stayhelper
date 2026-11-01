import re

file_path = r'c:\Users\Administrator\Desktop\프로젝트\1인기업대표\app\stayhelper\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update <section id="sanctuary-stage"
old_section = '<section id="sanctuary-stage" className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black">'
new_section = '<section id="sanctuary-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="relative h-[100dvh] sm:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black select-none">'

content = content.replace(old_section, new_section)
print('Section updated:', new_section in content)

# 2. Make background image hidden on mobile, visible only on lg+
old_bg = '<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">'
new_bg = '<div className="hidden lg:block absolute inset-0 z-0 overflow-hidden pointer-events-none">'
content = content.replace(old_bg, new_bg)
print('Bg updated:', new_bg in content)

# 3. Add Sound button in header right side
old_header_btn = '''            <button
              type="button"
              onClick={() => handleBookingAction(currentStay.bookingUrl)}
              className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] hover:brightness-110 text-black text-xs font-luxury-sans font-semibold tracking-wider transition-all duration-300 shadow-xl shadow-black/60 flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>Book with VIP Perks ✨</span>
            </button>'''

new_header_btn = '''            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-[#E8D5B5] backdrop-blur-md flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#E8D5B5]" />}
              <span className="hidden sm:inline text-[11px] font-mono">{isMuted ? "Unmute" : "Sound"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleBookingAction(currentStay.bookingUrl)}
              className="px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A880] hover:brightness-110 text-black text-[11px] sm:text-xs font-luxury-sans font-semibold tracking-wider transition-all duration-300 shadow-xl shadow-black/60 flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>Book with VIP Perks ✨</span>
            </button>'''

content = content.replace(old_header_btn, new_header_btn)
print('Header btn updated:', 'onClick={toggleMute}' in content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
