#!/usr/bin/env bash
# Compila los CV en LaTeX (EN/ES) a PDF y los copia a public/ para la web.
# Uso: npm run resume
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/src/mainresume"
OUT="$ROOT/public/mainresume"

if command -v tectonic >/dev/null 2>&1; then
  TECTONIC="tectonic"
elif [ -x "$HOME/tectonic/tectonic" ]; then
  TECTONIC="$HOME/tectonic/tectonic"
else
  echo "No se encontró Tectonic. Bajalo con:" >&2
  echo "  mkdir -p ~/tectonic && cd ~/tectonic && curl --proto '=https' --tlsv1.2 -fsSL https://drop-sh.fullyjustified.net | sh" >&2
  exit 1
fi

for name in mainresume mainresume_es; do
  echo "Compilando $name.tex..."
  "$TECTONIC" --outdir "$SRC" "$SRC/$name.tex"
  cp "$SRC/$name.pdf" "$OUT/$name.pdf"
done

echo "Listo: PDFs actualizados en public/mainresume/"
