$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Get-ShortSlug([string]$title) {
  $words = @($title.ToLower() -split '\s+' | Where-Object { $_ -and $_.Length -gt 1 })
  ($words | Select-Object -First 3) -join '-'
}

# Size -> metadata (unique per folder|size)
$bySize = @{
  "adda-classics|4113952" = @{ title = "Aaja Na Tere Bin"; id = "mmA9Wrp5UNs" }
  "adda-classics|3730793" = @{ title = "Aam Chhum Taam Chhum"; id = "J3czXkNA5_E" }
  "adda-classics|2784978" = @{ title = "Aane Se Uske"; id = "4qwFpKmYH4k" }
  "adda-classics|3032206" = @{ title = "Aap Mujhe Achchhe Lagne Lage"; id = "Zt0KVVVNxA4" }
  "adda-classics|5622912" = @{ title = "Ankhiyon Ke Jharokhon Se"; id = "KqpIIaCJggY" }
  "adda-classics|4726382" = @{ title = "Baar Baar Tohe Kya Samjhaye"; id = "trQjxqvp6SY" }
  "adda-classics|3394363" = @{ title = "Baharon Phool Barsao"; id = "McP9D114BfU" }
  "adda-classics|4067617" = @{ title = "Chitta"; id = "CJq1hGSO89A" }
  "adda-classics|6400670" = @{ title = "Ek Dilruba Hai"; id = "UgrS_B53Yc" }
  "adda-classics|2777735" = @{ title = "Ek Din Aap Yun Hum Se Mil Jaenge"; id = "2qjjKBaVHYE" }
  "adda-classics|4534991" = @{ title = "Jo Tu Na Mila"; id = "6DtPF9W3ejI" }
  "adda-classics|3604740" = @{ title = "Kabhi Tumhe"; id = "ByIZIKFmHOA" }
  "adda-classics|4111683" = @{ title = "Kya Loge Tum"; id = "cAMHx-m9oh8" }
  "adda-classics|3528195" = @{ title = "Pardesi Pardesi"; id = "ulgolPYH5EE" }
  "adda-classics|5427964" = @{ title = "Rabba Mehar Kari"; id = "7zEx0AJguSM" }
  "adda-classics|2911744" = @{ title = "Saudebaazi"; id = "DY_nQgYCegI" }
  "adda-classics|2416688" = @{ title = "Tune Jo Na Kaha"; id = "dTu5dTEzVM4" }
  "adda-classics|4611307" = @{ title = "Sarphira Sa Hai Dil"; id = "Sl3b-svF_V8" }
  "adda-classics|2964335" = @{ title = "Saaz E Dil Chhed De"; id = "yj5XEsVtOjE" }
  "adda-classics|2522532" = @{ title = "Sun Le Dastan Yun Na Sata"; id = "CzMAMit60h8" }
  "adda-classics|3366430" = @{ title = "Hungama Ho Gaya"; id = "CEs3AeV0di0" }
  "adda-classics|3791013" = @{ title = "Hue Hum Jinke Liye Barbad"; id = "IoFFQ_4gUu0" }
  "adda-classics|1230154" = @{ title = "Husn Hai Ya Koi Qayamat Hai"; id = "Spa9cc-QakI" }
  "adda-classics|3023402" = @{ title = "Goodbye"; id = "B2cNnvbu3Vc" }
  "adda-classics|2770252" = @{ title = "Hasi"; id = "oyaudgo5_8Y" }
  "adda-classics|5191121" = @{ title = "Tujhe Kitna Chahne Lage"; id = "A2IGDsD-dLF8" }
  "adda-classics|4755594" = @{ title = "Mar Jaayen"; id = "fVZuAgPJuW4" }
  "adda-classics|1501617" = @{ title = "Mere Paas Tum Ho"; id = "oyYL8bNJVh4" }
  "adda-classics|4816665" = @{ title = "Mere Sanam"; id = "y2HspfsTRWY" }
  "adda-classics|3700483" = @{ title = "Mujhe Peene Do"; id = "tOXMlseYc7E" }
  "adda-classics|5736426" = @{ title = "Noor E Khuda"; id = "JJ5r5Z6G2Zo" }
  "adda-classics|4794348" = @{ title = "Salamat"; id = "VYcnmCrp8ug" }
  "adda-classics|5720793" = @{ title = "Such Keh Raha Hai"; id = "3PQXtca7-24" }
  "adda-classics|3840125" = @{ title = "Long Time No See"; id = "fxwQ2FpF9ac" }
  "adda-classics|3836736" = @{ title = "Tu Chahiye"; id = "zuvla6ABKbs" }
  "adda-classics|4694300" = @{ title = "Tu Hai Kahan"; id = "AX6OrbgS8lI" }
  "adda-classics|5086778" = @{ title = "Tujhe Yaad Na Meri Ayee"; id = "zf-hzOlou9k" }
  "adda-classics|7966535" = @{ title = "Yeh Dil Deewana"; id = "KUjswKk5vuM" }
  "adda-classics|4049175" = @{ title = "Yeh Jism"; id = "xycd6Kgk27c" }
  "adda-classics|1591605" = @{ title = "Zakhm Dete Ho"; id = "KNYqXr3wvDs" }

  "chai-baatein|3448186" = @{ title = "Bhai Batur"; id = "RIXVQrS5s8" }
  "chai-baatein|6036400" = @{ title = "Bol Radha Bol"; id = "sGZfEqColpM" }
  "chai-baatein|2900774" = @{ title = "Chaman Mein Rakhe Veerana"; id = "ohdVO5AlEXI" }
  "chai-baatein|3714541" = @{ title = "Chanda Sitare Bindiya Tumhari"; id = "9VXk9lUYpd0" }
  "chai-baatein|3215225" = @{ title = "Dekha Na Haye Re"; id = "fF3q0_1hwLI" }
  "chai-baatein|2530837" = @{ title = "Dil Chahe Kisi Se Pyar Karoon"; id = "mFe097V0ouY" }
  "chai-baatein|2991981" = @{ title = "Ek Baat Poochhta Hoon"; id = "3wCxw9pDITo" }
  "chai-baatein|3445971" = @{ title = "Gori Tera Gaon Bada Pyara"; id = "vejr2_PXVQo" }
  "chai-baatein|3057854" = @{ title = "Hansta Hua Noorani Chehra"; id = "5KkkDRCj3l8" }
  "chai-baatein|3730297" = @{ title = "Head Ya Tail"; id = "oS7cIJvoLWk" }
  "chai-baatein|3742647" = @{ title = "Kabhi Jo Bhoolna Chahun"; id = "PK6EogtaalY" }
  "chai-baatein|3522291" = @{ title = "Kehna Hai"; id = "Ewj3fShfZow" }
  "chai-baatein|3281628" = @{ title = "Khush Rahe Tu Sada"; id = "ayGc5A6X9Go" }
  "chai-baatein|1580086" = @{ title = "Maar Dalega Dard E Jigar"; id = "f4y5rGB0NgE" }
  "chai-baatein|2684677" = @{ title = "Main Bhookha"; id = "VnvGGPolgu8" }
  "chai-baatein|3096036" = @{ title = "Main Chali Main Chali"; id = "szFxM9KBNMA" }
  "chai-baatein|4276873" = @{ title = "Main Hun Gaon Ki Gori"; id = "wDVmpv4thR4" }
  "chai-baatein|4674103" = @{ title = "Matwali Ankhowale"; id = "uEnNWjVFLv8" }
  "chai-baatein|2965778" = @{ title = "Meine Kaha Tumse"; id = "wPKCZrHkQdc" }
  "chai-baatein|3136233" = @{ title = "Meri Pyari Bindu"; id = "Zr_enRRcyuw" }
  "chai-baatein|3224666" = @{ title = "Dekh Liya Maine Kismat Ka Tamasha"; id = "lYcnZTPIxn4" }
  "chai-baatein|2686956" = @{ title = "Nazar Ka Jhuk Jana"; id = "obxDewuthro" }
  "chai-baatein|3241523" = @{ title = "Naseeb Dar Pe Tere"; id = "rnMtmpsaBqM" }
  "chai-baatein|1230282" = @{ title = "Phoolon Ki Sej"; id = "EGSL5Mhl3o0" }
  "chai-baatein|3148068" = @{ title = "Bachpan Ke Din Bhula Na Dena"; id = "M3mNpPbJeFc" }
  "chai-baatein|3652855" = @{ title = "Man Mera Udta Jaye"; id = "eUVCUg_SY98" }
  "chai-baatein|3158304" = @{ title = "Mohabbat Jisko Kehte Hain"; id = "6hdz1ddVhxU" }
  "chai-baatein|2452336" = @{ title = "Yaad Suhani Teri"; id = "2aWOWy9Fj-k" }
  "chai-baatein|2373296" = @{ title = "Lage Nahi Mora Jiya"; id = "_4ITncpWB9g" }
  "chai-baatein|3387239" = @{ title = "Leja Meri Duayen"; id = "mYD_P7g7qR8" }
  "chai-baatein|3458789" = @{ title = "Woh Jab Yaad Aaye"; id = "4bgdcTbb6uk" }

  "lucknow-shaam|3505873" = @{ title = "Nazar Na Phero Humse"; id = "ytzp9gpx3OI" }
  "lucknow-shaam|1701858" = @{ title = "O Maheki Maheki Thandi Hawa"; id = "cazcJ__xWKY" }
  "lucknow-shaam|4140431" = @{ title = "O Mummy Mummy"; id = "8yoiLf_O8I4" }
  "lucknow-shaam|1061072" = @{ title = "Savaiyaa Chhota Sa Saajan"; id = "bT6bYr6lQ9o" }
  "lucknow-shaam|4515642" = @{ title = "Sawan Ka Mahina"; id = "aSqwfhYAoxs" }
  "lucknow-shaam|3254566" = @{ title = "Tauba Tauba Ho Tauba"; id = "7OTFv--C-YM" }
  "lucknow-shaam|1937296" = @{ title = "Tere Bina Dil Lagta Nahi"; id = "LOcM2YEbUo4" }
  "lucknow-shaam|4058091" = @{ title = "Tere Mere Beech Mein"; id = "bSODb0x2plA" }
  "lucknow-shaam|4164762" = @{ title = "Tu Tu Tu Tara"; id = "BWBQ28FHrqU" }
  "lucknow-shaam|4334674" = @{ title = "Tumhi Ne Meri Zindagi Re"; id = "1ixXI80LiI8" }
  "lucknow-shaam|4024402" = @{ title = "Woh Kaunsi Mushkil Hai"; id = "9YHkf6sA-jU" }
  "lucknow-shaam|3180539" = @{ title = "Ye Gaya Wo Gaya"; id = "QR2ufDPheys" }
  "lucknow-shaam|2736527" = @{ title = "Ab Mohabbat Mein Jo Pahle"; id = "EfvxsPqhCgw" }
  "lucknow-shaam|2819821" = @{ title = "Chura Ke Dil Ban Rahe Ho Bhole"; id = "Pu4o37QAHIg" }
  "lucknow-shaam|4214135" = @{ title = "Chhan Chhan Payal Chhanke"; id = "ulxky6wuXa8" }
  "lucknow-shaam|2789301" = @{ title = "Jaa Raha Hai Kyon Deewane"; id = "PFEt4oAWl-0" }
  "lucknow-shaam|2742273" = @{ title = "Jaago Sone Walo"; id = "McWljApC79c" }
  "lucknow-shaam|2361645" = @{ title = "Jeenewale Muskura Ke Jee"; id = "_ZDkPxU3KA8" }
  "lucknow-shaam|2797588" = @{ title = "Titli Udi Ud Jo Chali"; id = "ob4vW-Il0tA" }
  "lucknow-shaam|2852474" = @{ title = "Tu Kon Hai Mera Kehde Balam"; id = "sM7wbm6lWLE" }
  "lucknow-shaam|3035800" = @{ title = "Dilbara Jab Tera Naam Liya"; id = "aZNA3e0MxiM" }
  "lucknow-shaam|4022636" = @{ title = "Deewana Dil Beqarar Tha"; id = "OeFXppUkV48" }

  "purani-yaadein|3684520" = @{ title = "Allah Jaane Main Hoon Kaun"; id = "V0cwfGazerc" }
  "purani-yaadein|5063501" = @{ title = "Aa Bhi Ja Rasiya"; id = "4NppgimXvrM" }
  "purani-yaadein|2077047" = @{ title = "Aaj Mausam Ki Masti Mein"; id = "2m4uonSYw58" }
  "purani-yaadein|3244221" = @{ title = "Aaj Hua Mera Dil Matwala"; id = "JRSwynOgN2c" }
  "purani-yaadein|3662946" = @{ title = "Itna Hai Tumse Pyar Mujhe"; id = "Eq5aJPA19tU" }
  "purani-yaadein|4786974" = @{ title = "Ilahi Tu Sun Le Hamari Dua"; id = "im-ViPIiA4o" }
  "purani-yaadein|4707095" = @{ title = "Ek Sawaal Hai Tumse"; id = "6tKQ4W5PwVI" }
  "purani-yaadein|2462462" = @{ title = "O Mere Pyar Aaja"; id = "_YgZAV8kRZg" }
  "purani-yaadein|2709986" = @{ title = "Kajre Badarwa Re"; id = "Gm0bYd5u024" }
  "purani-yaadein|3429712" = @{ title = "Kahin Se Chali Aa"; id = "ViY-lbX3yfo" }
  "purani-yaadein|5194764" = @{ title = "Koi Jab Raah Na Paye"; id = "PRoeFUnx5K0" }
  "purani-yaadein|3227299" = @{ title = "Khuli Khuli Zulfon Ko"; id = "S4Nb5CecDbM" }
  "purani-yaadein|3769819" = @{ title = "Khoobsurat Haseena"; id = "xNDE3w0KdBk" }
  "purani-yaadein|2710910" = @{ title = "Ghar Aaja Ghir Aaye Badra"; id = "6tcQcf1zlC0" }
  "purani-yaadein|3779523" = @{ title = "Chali Re Chali Re Gori"; id = "HOvTXM4TjtQ" }
}

$folders = @(
  @{ id = 'adda-classics'; name = 'Adda Classics' },
  @{ id = 'chai-baatein'; name = 'Chai & Baatein' },
  @{ id = 'lucknow-shaam'; name = 'Lucknow Shaam' },
  @{ id = 'purani-yaadein'; name = 'Purani Yaadein' }
)

$playlists = @{}
$seenSize = @{}

foreach ($folder in $folders) {
  $dir = (Resolve-Path (Join-Path $root "music\$($folder.id)")).Path
  $base = "\\?\" + $dir
  $songs = @()
  $usedSlugs = @{}

  Get-ChildItem -LiteralPath $base -Filter "*.opus" | ForEach-Object {
    $key = "$($folder.id)|$($_.Length)"
    if ($seenSize.ContainsKey($key)) {
      Remove-Item -LiteralPath "$base\$($_.Name)" -Force
      Write-Host "Removed duplicate: $($folder.id)/$($_.Name)"
      return
    }
    if (-not $bySize.ContainsKey($key)) {
      Write-Warning "Unknown file: $($folder.id)/$($_.Name) ($($_.Length))"
      return
    }
    $seenSize[$key] = $true
    $meta = $bySize[$key]
    $slug = Get-ShortSlug $meta.title
    if ($usedSlugs.ContainsKey($slug)) {
      $usedSlugs[$slug]++
      $slug = "$slug-$($usedSlugs[$slug])"
    } else { $usedSlugs[$slug] = 1 }

    $newName = "$slug.opus"
    $src = "$base\$($_.Name)"
    $tmp = "$base\__tmp__$newName"
    $dst = "$base\$newName"

    if ($_.Name -ne $newName) {
      if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Force }
      [System.IO.File]::Move($src, $tmp)
      if (Test-Path -LiteralPath $dst) { Remove-Item -LiteralPath $dst -Force }
      [System.IO.File]::Move($tmp, $dst)
      Write-Host "$($folder.id)/$newName"
    }

    $songs += [ordered]@{
      file = "music/$($folder.id)/$newName"
      id = $meta.id
      title = $meta.title
    }
  }

  $playlists[$folder.id] = @{ name = $folder.name; songs = ($songs | Sort-Object title) }
}

$js = "const PLAYLISTS = {`n"
foreach ($folder in $folders) {
  $pl = $playlists[$folder.id]
  $js += "  `"$($folder.id)`": {`n    name: `"$($pl.name)`",`n    songs: [`n"
  foreach ($s in $pl.songs) {
    $js += "      { file: `"$($s.file)`", id: `"$($s.id)`", title: `"$($s.title)`", artist: `"Classic Hindi`" },`n"
  }
  $js += "    ],`n  },`n"
}
$js += "};`n"
$js | Set-Content (Join-Path $root "js\playlists.js") -Encoding UTF8
$total = ($playlists.Values | ForEach-Object { $_.songs.Count } | Measure-Object -Sum).Sum
Write-Host "Done - $total songs with short names"
