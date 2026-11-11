import os
import re
import json
import datetime
from pathlib import Path

VAULT_DIR = Path(r"C:\Users\Administrator\Desktop\1인기업_세컨브레인_Vault")
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
OUTPUT_INDEX_FILE = DATA_DIR / "vault_documents_index.json"

def build_vault_index():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    docs = []

    if not VAULT_DIR.exists():
        print(f"Vault dir does not exist: {VAULT_DIR}")
        return

    for root, dirs, files in os.walk(VAULT_DIR):
        rel_folder = os.path.relpath(root, VAULT_DIR)
        parts = rel_folder.split(os.sep)
        category = parts[0] if parts and parts[0] != "." else "Root"
        sub_category = parts[1] if len(parts) > 1 else ""

        for f in files:
            if not f.endswith(".md"):
                continue

            fpath = Path(root) / f
            try:
                stat = fpath.stat()
                mtime = stat.st_mtime
                date_str = datetime.datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M")
                
                content = fpath.read_text(encoding="utf-8", errors="replace")
                lines = content.splitlines()

                # Extract Title
                title = os.path.splitext(f)[0]
                for l in lines[:10]:
                    if l.startswith("# "):
                        title = l.replace("# ", "").strip()
                        break

                # Extract Tags (#tag)
                tags = list(set(re.findall(r'#([가-힣a-zA-Z0-9_\-]+)', content[:2000])))

                # Extract Executive Summary / Preview
                preview = ""
                content_clean = re.sub(r'#.*?\n', '', content)
                content_clean = re.sub(r'\[.*?\]\(.*?\)', '', content_clean)
                content_clean = re.sub(r'[\r\n]+', ' ', content_clean).strip()
                preview = content_clean[:220]

                rel_path = (Path(rel_folder) / f).as_posix() if rel_folder != "." else f

                docs.append({
                    "id": rel_path,
                    "filename": f,
                    "title": title,
                    "category": category,
                    "subCategory": sub_category,
                    "date": date_str,
                    "mtime": mtime,
                    "length": len(content),
                    "tags": tags[:6],
                    "preview": preview,
                    "content": content
                })
            except Exception as e:
                print(f"Error reading {f}: {e}")

    # Sort by recent mtime
    docs.sort(key=lambda x: x["mtime"], reverse=True)

    OUTPUT_INDEX_FILE.write_text(json.dumps(docs, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Successfully indexed {len(docs)} documents into {OUTPUT_INDEX_FILE}")

if __name__ == "__main__":
    build_vault_index()
