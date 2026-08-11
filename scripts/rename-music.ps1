$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Get-Slug([string]$title) {
  $t = $title.Trim()
  $t = $t -replace '\s*(Song|Full Song|Video Song|HD Video Song|Classic Song|Superhit Song|4K Video Song|90''s Hit Song|90s Sad Song|Romantic Song|Love Song|HD)\s*$', ''
  $t = $t.Trim().ToLower()
  $t = $t -replace '[^a-z0-9]+', '-'
  $t = $t -replace '-+', '-'
  $t = $t.Trim('-')
  if ($t.Length -lt 2) { $t = "track" }
  return $t
}

function Get-YouTubeId([string]$stem, [string]$firstPart) {
  $escaped = [regex]::Escape($firstPart)
  if ($stem -match "${escaped}([A-Za-z0-9_-]{11})${escaped}") {
    return $Matches[1]
  }
  $m = [regex]::Matches($stem, '[A-Za-z0-9_-]{11}')
  if ($m.Count -gt 0) { return $m[$m.Count - 1].Value }
  return $null
}

function Get-CleanTitle([string]$firstPart) {
  $t = $firstPart.Trim()
  $t = $t -replace '\s*(Song|Full Song|Video Song|HD Video Song|Classic Song|Superhit Song|4K Video Song|90''s Hit Song|90s Sad Song|Romantic Song|Love Song|HD)\s*$', ''
  return $t.Trim()
}

$folders = @("adda-classics", "chai-baatein", "lucknow-shaam", "purani-yaadein")
$manifest = @{}
$usedSlugs = @{}

foreach ($folder in $folders) {
  $dir = (Resolve-Path (Join-Path $root "music\$folder")).Path
  $base = "\\?\" + $dir
  $manifest[$folder] = @()

  Get-ChildItem -LiteralPath $base -Filter "*.opus" | ForEach-Object {
    $name = $_.Name
    if ($name -match '^[a-z0-9-]+\.opus$') {
      $slug = $name -replace '\.opus$', ''
      $manifest[$folder] += [ordered]@{
        file = "music/$folder/$name"
        slug = $slug
        title = ($slug -replace '-', ' ') -replace '\b(\w)', { $_.Groups[1].Value.ToUpper() }
        id = $null
        skipped = $true
      }
      return
    }

    $stem = $name -replace '\.opus$', ''
    $firstPart = ($stem -split '\|')[0].Trim()
    $id = Get-YouTubeId $stem $firstPart
    $title = Get-CleanTitle $firstPart
    $slug = Get-Slug $firstPart

    $key = "$folder/$slug"
    if ($usedSlugs.ContainsKey($key)) {
      $usedSlugs[$key]++
      $slug = "$slug-$($usedSlugs[$key])"
    } else {
      $usedSlugs[$key] = 1
    }

    $newName = "$slug.opus"
    $src = "$base\$name"
    $dst = "$base\$newName"

    if (-not (Test-Path -LiteralPath $dst) -or $src -eq $dst) {
      if ($src -ne $dst) {
        [System.IO.File]::Move($src, $dst)
        Write-Host "Renamed: $folder/$newName"
      }
    } else {
      Write-Warning "Skip rename (exists): $folder/$newName"
      $newName = $name
    }

    $manifest[$folder] += [ordered]@{
      file = "music/$folder/$newName"
      slug = $slug
      title = $title
      id = $id
    }
  }
}

$manifest | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $root "scripts\music-manifest.json") -Encoding UTF8
Write-Host "Done. Manifest: scripts/music-manifest.json"
