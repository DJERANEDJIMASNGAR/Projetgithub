# Incrementer la version de cache pour style.css dans index.html
# Usage: Exécuter depuis le dossier du projet (PowerShell)
#   .\scripts\bump_css_version.ps1

$path = Join-Path -Path $PSScriptRoot -ChildPath "..\index.html"
if (-not (Test-Path $path)) { $path = Join-Path -Path (Get-Location) -ChildPath "index.html" }

if (-not (Test-Path $path)) {
    Write-Error "index.html introuvable : $path"
    exit 1
}

$text = Get-Content $path -Raw

if ($text -match 'href="style\.css\?v=(\d+)"') {
    $v = [int]$matches[1] + 1
    $text = $text -replace 'href="style\.css\?v=\d+"', "href=\"style.css?v=$v\""
} elseif ($text -match 'href="style\.css"') {
    $v = 1
    $text = $text -replace 'href="style\.css"', 'href="style.css?v=1"'
} else {
    Write-Error "Aucun lien vers style.css trouvé dans $path"
    exit 1
}

Set-Content -Path $path -Value $text -Encoding UTF8
Write-Output "Mise à jour : style.css?v=$v dans index.html"
