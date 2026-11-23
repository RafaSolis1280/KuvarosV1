"""DEV-28 · Resume el JS de cliente de una ruta a partir del analizador de Turbopack (sin dependencias).

Uso (desde la raíz del repo; en Git Bash anteponer MSYS_NO_PATHCONV=1 para que no convierta la "/"):
    npx next analyze --output --snapshot <nombre>
    npx next analyze export --snapshot <nombre> --route / > grafo.jsonl
    python Manuales/qa/scripts/bundle-inicial.py grafo.jsonl

Separa el JS que se descarga al cargar la página (inicial) del que se carga después con dynamic import
(grupos "async"). Tamaños en KB, sin comprimir y comprimidos (lo que viaja por la red).
"""
import collections
import json
import re
import sys

rows = [json.loads(line) for line in open(sys.argv[1], encoding="utf-8")]
client = lambda f: f.startswith("[client-fs]/") and f.endswith(".js")

# Archivos de cada grupo async (dynamic import); un archivo es inicial si no está solo en grupos async
async_files = set()
initial_files = set()
for r in rows:
    if r["type"] == "group":
        outs = [o for o in r["outputs"] if client(o)]
        (async_files if r["kind"] == "async" else initial_files).update(outs)
async_only = async_files - initial_files

parts = [r for r in rows if r["type"] == "part" and client(r["filename"])]
files = {p["filename"] for p in parts}
initial_files = files - async_only


def total(fs, key):
    return sum(p[key] for p in parts if p["filename"] in fs) / 1024


def package(path):
    m = re.search(r"node_modules/((?:@[^/]+/)?[^/]+)", path)
    return m.group(1) if m else ("src/" + path.split("/src/", 1)[1].split("/")[0] if "/src/" in path else path)


by_pkg = collections.Counter()
for p in parts:
    if p["filename"] in initial_files:
        by_pkg[package(p["source_path"])] += p["compressed_size"]

print(f"JS inicial: {len(initial_files)} archivos · {total(initial_files, 'size'):.1f} KB · {total(initial_files, 'compressed_size'):.1f} KB comprimido")
print(f"JS diferido (dynamic import): {len(async_only)} archivos · {total(async_only, 'size'):.1f} KB · {total(async_only, 'compressed_size'):.1f} KB comprimido")
print("Mayores paquetes del JS inicial (KB comprimidos):")
for name, size in by_pkg.most_common(12):
    print(f"  {size / 1024:7.1f}  {name}")
for r in rows:
    if r["type"] == "group" and r["kind"] == "async":
        print("  diferido por:", r["trigger_module_ident"].split(" [")[0].replace("[project]/", ""))
