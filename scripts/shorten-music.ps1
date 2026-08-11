$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Get-YouTubeId([string]$text) {
  foreach ($m in [regex]::Matches($text, '[A-Za-z0-9_-]{11}')) {
    $id = $m.Value
    if ($id -match '[A-Za-z]' -and $id -match '[0-9]') { return $id }
  }
  $m = [regex]::Match($text, '[A-Za-z0-9_-]{11}')
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Get-TitleFromName([string]$name) {
  $stem = $name -replace '\.opus$', ''
  if ($stem -match '\|') {
    $t = ($stem -split '\|')[0].Trim()
    $t = $t -replace '(?i)^[''"]|[''"]$', ''
    $t = $t -replace '(?i)\s*(song|full video|official video|official music video|lyrical video|music video|full song|hd|4k|lofi mix|extended version|bollywood cover song|unplugged cover songs|viral reel songs \d+).*$', ''
    return $t.Trim()
  }
  if ($stem -match '^[a-z0-9-]+$') {
    return (Get-Culture).TextInfo.ToTitleCase(($stem -replace '-', ' '))
  }
  $id = Get-YouTubeId $stem
  if ($id) {
    $idx = $stem.IndexOf($id, [StringComparison]::OrdinalIgnoreCase)
    if ($idx -gt 0) {
      $before = $stem.Substring(0, $idx).Trim(' -|')
      if ($before.Length -gt 2) { return $before }
    }
  }
  return $stem
}

function Get-ShortSlug([string]$title) {
  $t = $title.ToLower()
  $t = $t -replace '(?i)\s*(song|full|video|official|music|lyrical|hd|lofi|mix|extended|version|cover).*$', ''
  $t = $t -replace '[^a-z0-9\s]', ' '
  $words = @($t -split '\s+' | Where-Object { $_ -and $_.Length -gt 1 })
  $skip = @('the', 'by', 'ft', 'feat', 'from', 'with', 'and', 'a', 'an')
  $words = @($words | Where-Object { $_ -notin $skip })
  if ($words.Count -eq 0) { return 'track' }
  $short = ($words | Select-Object -First 3) -join '-'
  return $short.Trim('-')
}

$folders = @(
  @{ id = 'adda-classics'; name = 'Adda Classics' },
  @{ id = 'chai-baatein'; name = 'Chai & Baatein' },
  @{ id = 'lucknow-shaam'; name = 'Lucknow Shaam' },
  @{ id = 'purani-yaadein'; name = 'Purani Yaadein' }
)

$allPlaylists = @{}

foreach ($folder in $folders) {
  $dir = (Resolve-Path (Join-Path $root "music\$($folder.id)")).Path
  $base = "\\?\" + $dir
  $entries = @()

  Get-ChildItem -LiteralPath $base -Filter "*.opus" | ForEach-Object {
    $title = Get-TitleFromName $_.Name
    $id = Get-YouTubeId $_.Name
    $entries += [pscustomobject]@{
      Name = $_.Name
      Path = "$base\$($_.Name)"
      Size = $_.Length
      Title = $title
      Id = $id
      Slug = Get-ShortSlug $title
      IsLong = $_.Name.Length -gt 45
    }
  }

  # Drop duplicate YouTube IDs - keep shorter filename
  $byId = @{}
  $keep = @()
  foreach ($e in ($entries | Sort-Object { $_.Name.Length })) {
    if ($e.Id) {
      if ($byId.ContainsKey($e.Id)) {
        Write-Host "Dedup: $($folder.id) - removing $($e.Name)"
        Remove-Item -LiteralPath $e.Path -Force
        continue
      }
      $byId[$e.Id] = $true
    }
    $keep += $e
  }

  $usedSlugs = @{}
  $songs = @()

  foreach ($e in ($keep | Sort-Object Title)) {
    $slug = $e.Slug
    if ($usedSlugs.ContainsKey($slug)) {
      $usedSlugs[$slug]++
      $slug = "$slug-$($usedSlugs[$slug])"
    } else {
      $usedSlugs[$slug] = 1
    }

    $newName = "$slug.opus"
    $tmp = "$base\__renaming__$newName"
    $final = "$base\$newName"

    if ($e.Name -ne $newName) {
      if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force }
      [System.IO.File]::Move($e.Path, $tmp)
      $e | Add-Member -NotePropertyName TempPath -NotePropertyValue $tmp -Force
    } else {
      $e | Add-Member -NotePropertyName TempPath -NotePropertyValue $e.Path -Force
    }

    $displayTitle = (Get-Culture).TextInfo.ToTitleCase(($slug -replace '-', ' '))
    $songs += [ordered]@{
      slug = $slug
      file = "music/$($folder.id)/$newName"
      id = if ($e.Id) { $e.Id } else { "dQw4w9WgXcQ" }
      title = $displayTitle
      temp = $e.TempPath
      final = $final
    }
  }

  foreach ($s in $songs) {
    if ($s.temp -ne $s.final) {
      if (Test-Path -LiteralPath $s.final) { Remove-Item -LiteralPath $s.final -Force }
      [System.IO.File]::Move($s.temp, $s.final)
      Write-Host "Short: $($folder.id)/$($s.slug).opus"
    }
  }

  $allPlaylists[$folder.id] = @{ name = $folder.name; songs = $songs }
}

$js = "const PLAYLISTS = {`n"
foreach ($folder in $folders) {
  $pl = $allPlaylists[$folder.id]
  $js += "  `"$($folder.id)`": {`n    name: `"$($pl.name)`",`n    songs: [`n"
  foreach ($s in $pl.songs) {
    $js += "      { file: `"$($s.file)`", id: `"$($s.id)`", title: `"$($s.title)`", artist: `"Classic Hindi`" },`n"
  }
  $js += "    ],`n  },`n"
}
$js += "};`n"
$js | Set-Content (Join-Path $root "js\playlists.js") -Encoding UTF8

$total = ($allPlaylists.Values | ForEach-Object { $_.songs.Count } | Measure-Object -Sum).Sum
Write-Host "Done - $total songs, short filenames applied"
