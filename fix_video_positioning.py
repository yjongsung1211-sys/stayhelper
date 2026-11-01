import re

file_path = r'c:\Users\Administrator\Desktop\프로젝트\1인기업대표\app\stayhelper\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update line 1084 (container of body)
old_body_container = '<div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-14 flex-1 flex flex-col lg:flex-row items-end justify-between gap-8 py-8 sm:py-12 my-auto">'
new_body_container = '<div className="lg:relative max-w-[1440px] mx-auto w-full px-6 sm:px-14 flex-1 flex flex-col lg:flex-row items-end justify-between gap-8 py-8 sm:py-12 my-auto pointer-events-none lg:pointer-events-auto z-20">'

content = content.replace(old_body_container, new_body_container)
print('Body container replaced:', new_body_container in content)

# 2. Update line 1115 (right side wrapper)
old_right = '<div className="absolute inset-0 w-full h-full lg:static lg:w-auto lg:h-auto lg:shrink-0 flex flex-col items-center lg:items-end justify-center pointer-events-none lg:pointer-events-auto z-0 lg:z-20">'
new_right = '<div className="lg:shrink-0 flex flex-col items-center lg:items-end justify-center pointer-events-none lg:pointer-events-auto">'

content = content.replace(old_right, new_right)
print('Right wrapper replaced:', new_right in content)

# 3. Update line 1127 (group wrapper)
old_group = '<div className="relative group">'
new_group = '<div className="lg:relative group">'

content = content.replace(old_group, new_group)
print('Group wrapper replaced:', new_group in content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
