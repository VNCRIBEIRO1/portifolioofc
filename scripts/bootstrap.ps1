#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Bootstrap único do ambiente — instala ferramentas externas necessárias para o pipeline 3D imersivo.
.DESCRIPTION
  Idempotente: pula o que já existe. Executar com permissão de admin se for instalar via winget.
#>

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "==> Bootstrap PixelCode 3D pipeline" -ForegroundColor Cyan

# 1. Verificar Node + npm
Write-Host "[1/6] Verificando Node.js..." -ForegroundColor Yellow
$node = (Get-Command node -ErrorAction SilentlyContinue)
if (-not $node) { throw "Node.js nao encontrado. Instale Node 20+." }
Write-Host "    Node: $(node --version)"

# 2. NPM globals — playwright + lighthouse + msdf-bmfont
Write-Host "[2/6] Instalando ferramentas npm globais..." -ForegroundColor Yellow
$npmGlobals = @("playwright", "lighthouse", "msdf-bmfont-xml", "@vercel/cli", "gltf-pipeline", "gltfjsx")
foreach ($pkg in $npmGlobals) {
    $exists = npm ls -g --depth=0 $pkg 2>$null | Select-String $pkg
    if (-not $exists) {
        Write-Host "    instalando $pkg..."
        npm install -g $pkg 2>&1 | Out-Null
    } else {
        Write-Host "    $pkg ja instalado"
    }
}

# 3. Playwright chromium
Write-Host "[3/6] Playwright chromium..." -ForegroundColor Yellow
npx playwright install chromium 2>&1 | Out-Null

# 4. Real-ESRGAN binary
Write-Host "[4/6] Real-ESRGAN..." -ForegroundColor Yellow
$esrganDir = "C:\tools\realesrgan"
if (-not (Test-Path "$esrganDir\realesrgan-ncnn-vulkan.exe")) {
    $url = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesrgan-ncnn-vulkan-20220424-windows.zip"
    $zip = Join-Path $env:TEMP "esrgan.zip"
    Invoke-WebRequest $url -OutFile $zip -UseBasicParsing
    New-Item -ItemType Directory -Force -Path $esrganDir | Out-Null
    Expand-Archive $zip -DestinationPath $esrganDir -Force
    Remove-Item $zip
    Write-Host "    instalado em $esrganDir"
    if (-not ($env:PATH -split ';' -contains $esrganDir)) {
        [Environment]::SetEnvironmentVariable("PATH", "$env:PATH;$esrganDir", "User")
        Write-Host "    PATH atualizado (reinicie o terminal)"
    }
} else {
    Write-Host "    Real-ESRGAN ja instalado"
}

# 5. Verificar ComfyUI rodando
Write-Host "[5/6] ComfyUI health-check..." -ForegroundColor Yellow
$comfyUrl = if ($env:COMFY_URL) { $env:COMFY_URL } else { "http://127.0.0.1:8188" }
try {
    $r = Invoke-WebRequest "$comfyUrl/system_stats" -TimeoutSec 3 -UseBasicParsing
    if ($r.StatusCode -eq 200) { Write-Host "    ComfyUI OK em $comfyUrl" -ForegroundColor Green }
} catch {
    Write-Host "    AVISO: ComfyUI nao respondeu em $comfyUrl" -ForegroundColor DarkYellow
    Write-Host "    Inicie ComfyUI antes de rodar 'npm run assets:mockups'"
}

# 6. NPM deps locais
Write-Host "[6/6] Dependencias locais (npm install)..." -ForegroundColor Yellow
Push-Location $repoRoot
try {
    npm install --no-audit --no-fund 2>&1 | Out-Null
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "==> Bootstrap concluido" -ForegroundColor Green
Write-Host "Proximos passos:"
Write-Host "  npm run assets:hdri      # baixar HDRIs"
Write-Host "  npm run assets:pbr       # baixar PBR textures"
Write-Host "  npm run assets:mockups   # gerar 9 mockups via ComfyUI"
Write-Host "  npm run dev              # subir o site"
