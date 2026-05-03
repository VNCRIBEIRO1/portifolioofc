# scripts/generate-real-crystals.ps1
#
# Regenera os GLBs fotorrealistas em public/models/crystals-real/ a partir
# das referencias SD em public/images/crystal-refs/<slug>.png usando
# TripoSR (VAST-AI-Research/TripoSR).
#
# Pre-requisitos:
#   - TripoSR clonado em D:\tmp\TripoSR com venv .venv (Python 3.10) ja
#     configurado: torch+cu121, transformers, trimesh, PyMCubes (substitui
#     torchmcubes), demais deps de requirements.txt.
#   - tsr/models/isosurface.py com shim PyMCubes (sem build CUDA toolkit).
#   - GPU NVIDIA com >=4GB VRAM.
#
# Uso:
#   pwsh -File scripts/generate-real-crystals.ps1
#
# Saidas:
#   public/models/crystals-real/{andresa,apex,atelier,forge,kira,lumen,
#                               northwind,onda,pulse,scholae}.glb
#
# OBS: cerbelera.glb usa Hunyuan3D-2 (PBR + WebP) e NAO e regenerado aqui.

$ErrorActionPreference = "Stop"

$repo  = Split-Path -Parent $PSScriptRoot
$refs  = Join-Path $repo "public\images\crystal-refs"
$dest  = Join-Path $repo "public\models\crystals-real"
$tripo = "D:\tmp\TripoSR"
$venv  = Join-Path $tripo ".venv\Scripts\python.exe"
$tmp   = Join-Path $tripo "out"

if (-not (Test-Path $venv)) {
  throw "TripoSR venv nao encontrada em $venv. Veja README de setup."
}

# Slugs (cerbelera fica de fora — usa Hunyuan3D-2)
$slugs = @("andresa","apex","atelier","forge","kira","lumen","northwind","onda","pulse","scholae")
$inputs = $slugs | ForEach-Object { Join-Path $refs "$_.png" }

if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Path $dest -Force | Out-Null

Push-Location $tripo
try {
  & $venv run.py @inputs `
    --output-dir $tmp `
    --model-save-format glb `
    --chunk-size 4096 `
    --mc-resolution 192
} finally {
  Pop-Location
}

# TripoSR salva em out/0/mesh.glb, out/1/mesh.glb, ... na ordem dos inputs
for ($i = 0; $i -lt $slugs.Count; $i++) {
  $src = Join-Path $tmp "$i\mesh.glb"
  $dst = Join-Path $dest "$($slugs[$i]).glb"
  if (-not (Test-Path $src)) { throw "Saida ausente: $src" }
  Copy-Item $src $dst -Force
  $kb = "{0:N1}" -f ((Get-Item $dst).Length / 1024)
  Write-Host "  $($slugs[$i].PadRight(12)) -> $($dst) ($kb KB)"
}

Write-Host "`n[real-crystals] DONE. 10 GLBs gerados em $dest"
