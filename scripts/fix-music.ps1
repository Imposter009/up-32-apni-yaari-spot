$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$stopWords = @(
  'song', 'full', 'video', 'classic', 'superhit', 'romantic', 'love', 'hd', 'hits',
  'movie', 'bollywood', 'old', 'hindi', 'songs', 'mohammed', 'lata', 'govinda',
  'mehmood', 'jeetendra', 'amitabh', 'kishore', 'alka', 'udit', 'cutest', 'funny',
  'peppy', 'horror', 'comedy', 'female', 'version', 'title', 'duet', 'evergreen',
  'rajendra', 'vyjayanthimala', 'rishi', 'juhi', 'chawla', 'kapoor', 'manoj', 'kumar',
  'nargis', 'dilip', 'tanuja', 'helen', 'saira', 'banu', 'sunil', 'dutt', 'nutan',
  'pradeep', 'madhubala', 'sachin', 'ranjeeta', 'mukesh', 'asha', 'bhosle', 'kavita',
  'krishnamurthy', 'vinod', 'rathod', 'babul', 'supriyo', 'mamta', 'kulkarni', 'anil',
  'kamal', 'hassan', 'rati', 'agnihotri', 'manna', 'dey', 'hemant', 'kuma', 'raf',
  'romanti', 'deewan', 'kalak', 'kalakaa', 'naw', 'mehmoo', 'pasport', 'pahle', 'kum',
  'jyantim', 'trug', 'shatrug', 'naray', 'mang', 'walo', 'vi', 'mo', 'so', 'clas', 'pa',
  'bhole', 'balam', 'roma', 't', 'w', 'jee', 'j', 's', 'c', 'a'
)

function Get-YouTubeId([string]$stem) {
  foreach ($m in [regex]::Matches($stem, '[A-Za-z0-9_-]{11}')) {
    $id = $m.Value
    if ($id -match '[A-Z]' -and $id -match '[0-9]') { return $id }
    if ($id -match '[a-z]' -and $id -match '[A-Z]') { return $id }
  }
  $m = [regex]::Match($stem, '[A-Za-z0-9_-]{11}')
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Get-ShortSlug([string]$stem) {
  $lower = $stem.ToLower() -replace '[a-z0-9_-]{11}', ''
  $lower = $lower -replace '[^a-z0-9-]+', '-' -replace '-+', '-' -replace '^-|-$', ''

  if ($lower -match '^[a-z0-9-]{2,30}$' -and ($lower -split '-').Count -le 6) {
    return $lower
  }

  $keep = @()
  foreach ($p in ($lower -split '-')) {
    if (-not $p) { continue }
    if ($stopWords -contains $p) { break }
    if ($p.Length -le 1) { continue }
    $keep += $p
    if ($keep.Count -ge 5) { break }
  }

  $slug = ($keep -join '-').Trim('-')
  if ($slug.Length -lt 2) {
    $slug = (($lower -split '-') | Where-Object { $_ -and $_.Length -gt 1 } | Select-Object -First 4) -join '-'
  }
  return $slug
}

function Get-DisplayTitle([string]$slug) {
  (Get-Culture).TextInfo.ToTitleCase(($slug -replace '-', ' '))
}

$folders = @(
  @{ id = 'adda-classics'; name = 'Adda Classics' },
  @{ id = 'chai-baatein'; name = 'Chai & Baatein' },
  @{ id = 'lucknow-shaam'; name = 'Lucknow Shaam' },
  @{ id = 'purani-yaadein'; name = 'Purani Yaadein' }
)

$playlistJs = "const PLAYLISTS = {`n"
$usedSlugs = @{}
$total = 0

foreach ($folder in $folders) {
  $dir = (Resolve-Path (Join-Path $root "music\$($folder.id)")).Path
  $base = "\\?\" + $dir
  $songs = @()

  Get-ChildItem -LiteralPath $base -Filter "*.opus" | Sort-Object Name | ForEach-Object {
    $name = $_.Name
    $stem = $name -replace '\.opus$', ''
    $ytId = Get-YouTubeId $stem
    $slug = Get-ShortSlug $stem
    $key = "$($folder.id)/$slug"
    if ($usedSlugs.ContainsKey($key)) {
      $usedSlugs[$key]++
      $slug = "$slug-$($usedSlugs[$key])"
    } else {
      $usedSlugs[$key] = 1
    }

    $newName = "$slug.opus"
    $src = "$base\$name"
    $dst = "$base\$newName"

    if ($name -ne $newName) {
      if (Test-Path -LiteralPath $dst) { Remove-Item -LiteralPath $dst -Force }
      [System.IO.File]::Move($src, $dst)
      Write-Host "Fixed: $($folder.id)/$newName"
    }

    $songs += [ordered]@{
      file = "music/$($folder.id)/$newName"
      id = if ($ytId) { $ytId } else { "dQw4w9WgXcQ" }
      title = Get-DisplayTitle $slug
      artist = "Classic Hindi"
    }
    $total++
  }

  $playlistJs += "  `"$($folder.id)`": {`n"
  $playlistJs += "    name: `"$($folder.name)`",`n"
  $playlistJs += "    songs: [`n"

  foreach ($s in $songs) {
    $playlistJs += "      {`n"
    $playlistJs += "        file: `"$($s.file)`",`n"
    $playlistJs += "        id: `"$($s.id)`",`n"
    $playlistJs += "        title: `"$($s.title)`",`n"
    $playlistJs += "        artist: `"$($s.artist)`",`n"
    $playlistJs += "      },`n"
  }

  $playlistJs += "    ],`n"
  $playlistJs += "  },`n"
}

$playlistJs += "};`n"
$playlistJs | Set-Content (Join-Path $root "js\playlists.js") -Encoding UTF8
Write-Host "Updated playlists.js - $total songs total"
