import re

file_path = r'c:\Users\Administrator\Desktop\프로젝트\1인기업대표\app\stayhelper\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update onEnded in video to call handleNextStay()
old_on_ended = '''                  onEnded={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.pause();
                    }
                    setIsPlaying(false);
                    setIsEnded(true);
                  }}'''

new_on_ended = '''                  onEnded={() => {
                    // Option A: Seamless Auto-Advance to Next Luxury Stay Reel
                    handleNextStay();
                  }}'''

content = content.replace(old_on_ended, new_on_ended)
print('onEnded updated:', 'handleNextStay()' in content)

# 2. Update Right Side container to be full bleed on mobile, static on lg
old_right_container = '''          {/* Right Side: Floating 9:16 Haute-Couture Master Reel (Exact Inset Placement) */}
          <div className="shrink-0 flex flex-col items-center lg:items-end justify-center">'''

new_right_container = '''          {/* Right Side / Mobile Full-Bleed 9:16 Reel Stage */}
          <div className="absolute inset-0 w-full h-full lg:static lg:w-auto lg:h-auto lg:shrink-0 flex flex-col items-center lg:items-end justify-center pointer-events-none lg:pointer-events-auto z-0 lg:z-20">'''

content = content.replace(old_right_container, new_right_container)
print('Right container updated:', 'Mobile Full-Bleed 9:16 Reel Stage' in content)

# 3. Update Inset Header to hide on mobile
old_inset_header = '''            {/* Subtle Minimalist Architectural Inset Header */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] flex items-center justify-between text-[10px] font-mono text-[#E8D5B5]/80 tracking-[0.22em] uppercase px-2 mb-2.5 drop-shadow">'''

new_inset_header = '''            {/* Subtle Minimalist Architectural Inset Header (Desktop Only) */}
            <div className="hidden lg:flex w-full max-w-[340px] items-center justify-between text-[10px] font-mono text-[#E8D5B5]/80 tracking-[0.22em] uppercase px-2 mb-2.5 drop-shadow">'''

content = content.replace(old_inset_header, new_inset_header)
print('Inset header updated:', 'Desktop Only' in content)

# 4. Update Ambient light halo to hide on mobile
old_halo = '''              {/* Soft Ambient Light Halo (Blends naturally with background snow & chalets) */}
              <div className="absolute -inset-2.5 bg-gradient-to-tr from-[#D4AF37]/20 via-[#B89B72]/15 to-transparent rounded-[30px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />'''

new_halo = '''              {/* Soft Ambient Light Halo (Desktop Only) */}
              <div className="hidden lg:block absolute -inset-2.5 bg-gradient-to-tr from-[#D4AF37]/20 via-[#B89B72]/15 to-transparent rounded-[30px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />'''

content = content.replace(old_halo, new_halo)
print('Halo updated:', 'Soft Ambient Light Halo (Desktop Only)' in content)

# 5. Update relative video box to full bleed on mobile, inset card on desktop
old_video_box = '''              {/* Main Architectural Motion Frame (No phone chassis, seamless glass bevel) */}
              <div className="relative w-[280px] sm:w-[320px] lg:w-[340px] aspect-[9/16] rounded-[22px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-white/20 bg-black/40 backdrop-blur-xs transition-transform duration-500 group-hover:scale-[1.01]">'''

new_video_box = '''              {/* Main Architectural Motion Frame: Full-Bleed on Mobile, Inset Window on Desktop */}
              <div className="absolute inset-0 w-full h-full lg:relative lg:w-[340px] lg:aspect-[9/16] lg:rounded-[22px] overflow-hidden lg:shadow-[0_20px_60px_rgba(0,0,0,0.85)] lg:border lg:border-white/20 bg-black pointer-events-auto transition-transform duration-500 group-hover:scale-[1.01]">'''

content = content.replace(old_video_box, new_video_box)
print('Video box updated:', 'Full-Bleed on Mobile' in content)

# 6. Add swipe indicator to Lower-Left label on mobile
old_label_start = '''          {/* Lower-Left: Discreet Architectural Label */}
          <div className="space-y-3 max-w-xl text-left drop-shadow-lg">'''

new_label_start = '''          {/* Lower-Left: Discreet Architectural Label (Overlaid smoothly over full-bleed reel) */}
          <div className="relative z-20 space-y-2 sm:space-y-3 max-w-xl text-left drop-shadow-lg pointer-events-none pb-2 sm:pb-0">
            {/* Mobile Native Reel Swipe Cue */}
            <div className="lg:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#E8D5B5]/30 text-[#E8D5B5] text-[10px] font-mono tracking-widest uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Swipe up / down for next stay</span>
            </div>'''

content = content.replace(old_label_start, new_label_start)
print('Label start updated:', 'Mobile Native Reel Swipe Cue' in content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
