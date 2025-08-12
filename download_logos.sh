#!/usr/bin/env bash
# download_logos.sh
# Script para descargar logos sugeridos y colocarlos en assets/imgs/
# Uso: bash download_logos.sh
set -euo pipefail

mkdir -p assets/imgs
echo "Directorio assets/imgs preparado."

# Lista de destino|URL - no sobreescribe archivos ya existentes
declare -a items=(
"assets/imgs/Logo_Merck_KGaA_2015.svg|https://upload.wikimedia.org/wikipedia/commons/e/e2/Logo_Merck_KGaA_2015.svg"
"assets/imgs/fermont-logo-inv.png|https://static.wixstatic.com/media/2e3831_a64f30502d08416ea901e752b6d0b643~mv2.png/v1/fill/w_124%2Ch_51%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/fermont-logo-inv.png"
"assets/imgs/avantor-logo.svg|https://www.avantorsciences.com/assets/images/avantor-icon/avantor-logo.svg"
)

for entry in "${items[@]}"; do
  target="${entry%%|*}"
  url="${entry##*|}"
  if [ -f "$target" ]; then
    echo "SKIP: $target (ya existe)"
    continue
  fi
  echo "Descargando $url -> $target ..."
  # intenta con curl; si falla, muestra mensaje pero continúa
  if curl -fsS -L "$url" -o "$target"; then
    echo "OK: $target descargado."
  else
    echo "FAIL: no se pudo descargar $url"
    # eliminar archivo incompleto si existe
    [ -f "$target" ] && rm -f "$target"
  fi
done

echo "Listo. Revisa assets/imgs/ y sustituye manualmente los logos que prefieras."
echo "Fuentes sugeridas (leer README_redesign.txt): paginas oficiales de Merck, Avantor, PQM/Fermont y repositorios de logos vectoriales."
