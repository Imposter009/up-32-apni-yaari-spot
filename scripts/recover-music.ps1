$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Recover correct filenames by unique file size (from original uploads)
$map = @{
  # adda-classics
  "adda-classics|4113952" = @{ slug = "aaja-na-tere-bin"; id = "mmA9Wrp5UNs"; title = "Aaja Na Tere Bin" }
  "adda-classics|3730793" = @{ slug = "aam-chhum-taam-chhum"; id = "J3czXkNA5_E"; title = "Aam Chhum Taam Chhum" }
  "adda-classics|2784978" = @{ slug = "aane-se-uske"; id = "4qwFpKmYH4k"; title = "Aane Se Uske" }
  "adda-classics|3032206" = @{ slug = "aap-mujhe-achchhe-lagne-lage"; id = "Zt0KVVVNxA4"; title = "Aap Mujhe Achchhe Lagne Lage" }
  "adda-classics|5622912" = @{ slug = "ankhiyon-ke-jharokhon-se"; id = "KqpIIaCJggY"; title = "Ankhiyon Ke Jharokhon Se" }
  "adda-classics|4726382" = @{ slug = "baar-baar-tohe-kya-samjhaye"; id = "trQjxqvp6SY"; title = "Baar Baar Tohe Kya Samjhaye" }
  "adda-classics|3394363" = @{ slug = "baharon-phool-barsao"; id = "McP9D114BfU"; title = "Baharon Phool Barsao" }
  "adda-classics|4067617" = @{ slug = "chitta"; id = "CJq1hGSO89A"; title = "Chitta" }
  "adda-classics|6400670" = @{ slug = "ek-dilruba-hai"; id = "UgrS_B53Yc"; title = "Ek Dilruba Hai" }
  "adda-classics|2777735" = @{ slug = "ek-din-aap-yun-hum-se-mil-jaenge"; id = "2qjjKBaVHYE"; title = "Ek Din Aap Yun Hum Se Mil Jaenge" }
  "adda-classics|4534991" = @{ slug = "jo-tu-na-mila"; id = "6DtPF9W3ejI"; title = "Jo Tu Na Mila" }
  "adda-classics|3604740" = @{ slug = "kabhi-tumhe"; id = "ByIZIKFmHOA"; title = "Kabhi Tumhe" }
  "adda-classics|4111683" = @{ slug = "kya-loge-tum"; id = "cAMHx-m9oh8"; title = "Kya Loge Tum" }
  "adda-classics|3528195" = @{ slug = "pardesi-pardesi"; id = "ulgolPYH5EE"; title = "Pardesi Pardesi" }
  "adda-classics|5427964" = @{ slug = "rabba-mehar-kari"; id = "7zEx0AJguSM"; title = "Rabba Mehar Kari" }
  "adda-classics|2911744" = @{ slug = "saudebaazi"; id = "DY_nQgYCegI"; title = "Saudebaazi" }
  "adda-classics|2416688" = @{ slug = "tune-jo-na-kaha"; id = "dTu5dTEzVM4"; title = "Tune Jo Na Kaha" }
  "adda-classics|4611307" = @{ slug = "sarphira-sa-hai-dil"; id = "Sl3b-svF_V8"; title = "Sarphira Sa Hai Dil" }
  "adda-classics|2964335" = @{ slug = "saaz-e-dil-chhed-de"; id = "yj5XEsVtOjE"; title = "Saaz E Dil Chhed De" }
  "adda-classics|2522532" = @{ slug = "sun-le-dastan-yun-na-sata"; id = "CzMAMit60h8"; title = "Sun Le Dastan Yun Na Sata" }
  "adda-classics|3366430" = @{ slug = "hungama-ho-gaya"; id = "CEs3AeV0di0"; title = "Hungama Ho Gaya" }
  "adda-classics|3791013" = @{ slug = "hue-hum-jinke-liye-barbad"; id = "IoFFQ_4gUu0"; title = "Hue Hum Jinke Liye Barbad" }
  "adda-classics|1230154" = @{ slug = "husn-hai-ya-koi-qayamat-hai"; id = "Spa9cc-QakI"; title = "Husn Hai Ya Koi Qayamat Hai" }

  # chai-baatein
  "chai-baatein|3448186" = @{ slug = "bhai-batur"; id = "RIXVQrS5s8"; title = "Bhai Batur" }
  "chai-baatein|6036400" = @{ slug = "bol-radha-bol"; id = "sGZfEqColpM"; title = "Bol Radha Bol" }
  "chai-baatein|2900774" = @{ slug = "chaman-mein-rakhe-veerana"; id = "ohdVO5AlEXI"; title = "Chaman Mein Rakhe Veerana" }
  "chai-baatein|3714541" = @{ slug = "chanda-sitare-bindiya-tumhari"; id = "9VXk9lUYpd0"; title = "Chanda Sitare Bindiya Tumhari" }
  "chai-baatein|3215225" = @{ slug = "dekha-na-haye-re"; id = "fF3q0_1hwLI"; title = "Dekha Na Haye Re" }
  "chai-baatein|2530837" = @{ slug = "dil-chahe-kisi-se-pyar-karoon"; id = "mFe097V0ouY"; title = "Dil Chahe Kisi Se Pyar Karoon" }
  "chai-baatein|2991981" = @{ slug = "ek-baat-poochhta-hoon"; id = "3wCxw9pDITo"; title = "Ek Baat Poochhta Hoon" }
  "chai-baatein|3445971" = @{ slug = "gori-tera-gaon-bada-pyara"; id = "vejr2_PXVQo"; title = "Gori Tera Gaon Bada Pyara" }
  "chai-baatein|3057854" = @{ slug = "hansta-hua-noorani-chehra"; id = "5KkkDRCj3l8"; title = "Hansta Hua Noorani Chehra" }
  "chai-baatein|3730297" = @{ slug = "head-ya-tail"; id = "oS7cIJvoLWk"; title = "Head Ya Tail" }
  "chai-baatein|3742647" = @{ slug = "kabhi-jo-bhoolna-chahun"; id = "PK6EogtaalY"; title = "Kabhi Jo Bhoolna Chahun" }
  "chai-baatein|3522291" = @{ slug = "kehna-hai"; id = "Ewj3fShfZow"; title = "Kehna Hai" }
  "chai-baatein|3281628" = @{ slug = "khush-rahe-tu-sada"; id = "ayGc5A6X9Go"; title = "Khush Rahe Tu Sada" }
  "chai-baatein|1580086" = @{ slug = "maar-dalega-dard-e-jigar"; id = "f4y5rGB0NgE"; title = "Maar Dalega Dard-E-Jigar" }
  "chai-baatein|2684677" = @{ slug = "main-bhookha"; id = "VnvGGPolgu8"; title = "Main Bhookha" }
  "chai-baatein|3096036" = @{ slug = "main-chali-main-chali"; id = "szFxM9KBNMA"; title = "Main Chali Main Chali" }
  "chai-baatein|4276873" = @{ slug = "main-hun-gaon-ki-gori"; id = "wDVmpv4thR4"; title = "Main Hun Gaon Ki Gori" }
  "chai-baatein|4674103" = @{ slug = "matwali-ankhowale"; id = "uEnNWjVFLv8"; title = "Matwali Ankhowale" }
  "chai-baatein|2965778" = @{ slug = "meine-kaha-tumse"; id = "wPKCZrHkQdc"; title = "Meine Kaha Tumse" }
  "chai-baatein|3136233" = @{ slug = "meri-pyari-bindu"; id = "Zr_enRRcyuw"; title = "Meri Pyari Bindu" }
  "chai-baatein|3224666" = @{ slug = "dekh-liya-maine-kismat-ka-tamasha"; id = "lYcnZTPIxn4"; title = "Dekh Liya Maine Kismat Ka Tamasha" }
  "chai-baatein|2686956" = @{ slug = "nazar-ka-jhuk-jana"; id = "obxDewuthro"; title = "Nazar Ka Jhuk Jana" }
  "chai-baatein|3241523" = @{ slug = "naseeb-dar-pe-tere"; id = "rnMtmpsaBqM"; title = "Naseeb Dar Pe Tere" }
  "chai-baatein|1230282" = @{ slug = "phoolon-ki-sej"; id = "EGSL5Mhl3o0"; title = "Phoolon Ki Sej" }
  "chai-baatein|3148068" = @{ slug = "bachpan-ke-din-bhula-na-dena"; id = "M3mNpPbJeFc"; title = "Bachpan Ke Din Bhula Na Dena" }
  "chai-baatein|3652855" = @{ slug = "man-mera-udta-jaye"; id = "eUVCUg_SY98"; title = "Man Mera Udta Jaye" }
  "chai-baatein|3158304" = @{ slug = "mohabbat-jisko-kehte-hain"; id = "6hdz1ddVhxU"; title = "Mohabbat Jisko Kehte Hain" }
  "chai-baatein|2452336" = @{ slug = "yaad-suhani-teri"; id = "2aWOWy9Fj-k"; title = "Yaad Suhani Teri" }
  "chai-baatein|2373296" = @{ slug = "lage-nahi-mora-jiya"; id = "_4ITncpWB9g"; title = "Lage Nahi Mora Jiya" }
  "chai-baatein|3387239" = @{ slug = "leja-meri-duayen"; id = "mYD_P7g7qR8"; title = "Leja Meri Duayen" }
  "chai-baatein|3458789" = @{ slug = "woh-jab-yaad-aaye"; id = "4bgdcTbb6uk"; title = "Woh Jab Yaad Aaye" }

  # lucknow-shaam
  "lucknow-shaam|3505873" = @{ slug = "nazar-na-phero-humse"; id = "ytzp9gpx3OI"; title = "Nazar Na Phero Humse" }
  "lucknow-shaam|1701858" = @{ slug = "o-maheki-maheki-thandi-hawa"; id = "cazcJ__xWKY"; title = "O Maheki Maheki Thandi Hawa" }
  "lucknow-shaam|4140431" = @{ slug = "o-mummy-mummy"; id = "8yoiLf_O8I4"; title = "O Mummy Mummy" }
  "lucknow-shaam|1061072" = @{ slug = "savaiyaa-chhota-sa-saajan"; id = "bT6bYr6lQ9o"; title = "Savaiyaa Chhota Sa Saajan" }
  "lucknow-shaam|4515642" = @{ slug = "sawan-ka-mahina"; id = "aSqwfhYAoxs"; title = "Sawan Ka Mahina" }
  "lucknow-shaam|3254566" = @{ slug = "tauba-tauba-ho-tauba"; id = "7OTFv--C-YM"; title = "Tauba Tauba Ho Tauba" }
  "lucknow-shaam|1937296" = @{ slug = "tere-bina-dil-lagta-nahi"; id = "LOcM2YEbUo4"; title = "Tere Bina Dil Lagta Nahi" }
  "lucknow-shaam|4058091" = @{ slug = "tere-mere-beech-mein"; id = "bSODb0x2plA"; title = "Tere Mere Beech Mein" }
  "lucknow-shaam|4164762" = @{ slug = "tu-tu-tu-tara"; id = "BWBQ28FHrqU"; title = "Tu Tu Tu Tara" }
  "lucknow-shaam|4334674" = @{ slug = "tumhi-ne-meri-zindagi-re"; id = "1ixXI80LiI8"; title = "Tumhi Ne Meri Zindagi Re" }
  "lucknow-shaam|4024402" = @{ slug = "woh-kaunsi-mushkil-hai"; id = "9YHkf6sA-jU"; title = "Woh Kaunsi Mushkil Hai" }
  "lucknow-shaam|3180539" = @{ slug = "ye-gaya-wo-gaya"; id = "QR2ufDPheys"; title = "Ye Gaya Wo Gaya" }
  "lucknow-shaam|2736527" = @{ slug = "ab-mohabbat-mein-jo-pahle"; id = "EfvxsPqhCgw"; title = "Ab Mohabbat Mein Jo Pahle" }
  "lucknow-shaam|2819821" = @{ slug = "chura-ke-dil-ban-rahe-ho-bhole"; id = "Pu4o37QAHIg"; title = "Chura Ke Dil Ban Rahe Ho Bhole" }
  "lucknow-shaam|4214135" = @{ slug = "chhan-chhan-payal-chhanke"; id = "ulxky6wuXa8"; title = "Chhan Chhan Payal Chhanke" }
  "lucknow-shaam|2789301" = @{ slug = "jaa-raha-hai-kyon-deewane"; id = "PFEt4oAWl-0"; title = "Jaa Raha Hai Kyon Deewane" }
  "lucknow-shaam|2742273" = @{ slug = "jaago-sone-walo"; id = "McWljApC79c"; title = "Jaago Sone Walo" }
  "lucknow-shaam|2361645" = @{ slug = "jeenewale-muskura-ke-jee"; id = "_ZDkPxU3KA8"; title = "Jeenewale Muskura Ke Jee" }
  "lucknow-shaam|2797588" = @{ slug = "titli-udi-ud-jo-chali"; id = "ob4vW-Il0tA"; title = "Titli Udi Ud Jo Chali" }
  "lucknow-shaam|2852474" = @{ slug = "tu-kon-hai-mera-kehde-balam"; id = "sM7wbm6lWLE"; title = "Tu Kon Hai Mera Kehde Balam" }
  "lucknow-shaam|3035800" = @{ slug = "dilbara-jab-tera-naam-liya"; id = "aZNA3e0MxiM"; title = "Dilbara Jab Tera Naam Liya" }
  "lucknow-shaam|4022636" = @{ slug = "deewana-dil-beqarar-tha"; id = "OeFXppUkV48"; title = "Deewana Dil Beqarar Tha" }

  # purani-yaadein
  "purani-yaadein|3684520" = @{ slug = "allah-jaane-main-hoon-kaun"; id = "V0cwfGazerc"; title = "Allah Jaane Main Hoon Kaun" }
  "purani-yaadein|5063501" = @{ slug = "aa-bhi-ja-rasiya"; id = "4NppgimXvrM"; title = "Aa Bhi Ja Rasiya" }
  "purani-yaadein|2077047" = @{ slug = "aaj-mausam-ki-masti-mein"; id = "2m4uonSYw58"; title = "Aaj Mausam Ki Masti Mein" }
  "purani-yaadein|3244221" = @{ slug = "aaj-hua-mera-dil-matwala"; id = "JRSwynOgN2c"; title = "Aaj Hua Mera Dil Matwala" }
  "purani-yaadein|3662946" = @{ slug = "itna-hai-tumse-pyar-mujhe"; id = "Eq5aJPA19tU"; title = "Itna Hai Tumse Pyar Mujhe" }
  "purani-yaadein|4786974" = @{ slug = "ilahi-tu-sun-le-hamari-dua"; id = "im-ViPIiA4o"; title = "Ilahi Tu Sun Le Hamari Dua" }
  "purani-yaadein|4707095" = @{ slug = "ek-sawaal-hai-tumse"; id = "6tKQ4W5PwVI"; title = "Ek Sawaal Hai Tumse" }
  "purani-yaadein|2462462" = @{ slug = "o-mere-pyar-aaja"; id = "_YgZAV8kRZg"; title = "O Mere Pyar Aaja" }
  "purani-yaadein|2709986" = @{ slug = "kajre-badarwa-re"; id = "Gm0bYd5u024"; title = "Kajre Badarwa Re" }
  "purani-yaadein|3429712" = @{ slug = "kahin-se-chali-aa"; id = "ViY-lbX3yfo"; title = "Kahin Se Chali Aa" }
  "purani-yaadein|5194764" = @{ slug = "koi-jab-raah-na-paye"; id = "PRoeFUnx5K0"; title = "Koi Jab Raah Na Paye" }
  "purani-yaadein|3227299" = @{ slug = "khuli-khuli-zulfon-ko"; id = "S4Nb5CecDbM"; title = "Khuli Khuli Zulfon Ko" }
  "purani-yaadein|3769819" = @{ slug = "khoobsurat-haseena"; id = "xNDE3w0KdBk"; title = "Khoobsurat Haseena" }
  "purani-yaadein|2710910" = @{ slug = "ghar-aaja-ghir-aaye-badra"; id = "6tcQcf1zlC0"; title = "Ghar Aaja Ghir Aaye Badra" }
  "purani-yaadein|3779523" = @{ slug = "chali-re-chali-re-gori"; id = "HOvTXM4TjtQ"; title = "Chali Re Chali Re Gori" }
}

$folders = @("adda-classics", "chai-baatein", "lucknow-shaam", "purani-yaadein")
$playlists = @{}

foreach ($folder in $folders) {
  $dir = (Resolve-Path (Join-Path $root "music\$folder")).Path
  $base = "\\?\" + $dir
  $playlists[$folder] = @()
  $temp = @{}

  Get-ChildItem -LiteralPath $base -Filter "*.opus" | ForEach-Object {
    $key = "$folder|$($_.Length)"
    if (-not $map.ContainsKey($key)) {
      Write-Warning "No mapping for $folder $($_.Name) ($($_.Length) bytes)"
      return
    }
    $info = $map[$key]
    $newName = "$($info.slug).opus"
    $temp[$info.slug] = $info
    $dst = "$base\__tmp__$newName"
    [System.IO.File]::Move("$base\$($_.Name)", $dst)
  }

  foreach ($entry in ($temp.GetEnumerator() | Sort-Object Name)) {
    $info = $entry.Value
    $newName = "$($info.slug).opus"
    $src = "$base\__tmp__$newName"
    $dst = "$base\$newName"
    if (Test-Path -LiteralPath $dst) { Remove-Item -LiteralPath $dst -Force }
    [System.IO.File]::Move($src, $dst)
    Write-Host "OK: $folder/$newName"
    $playlists[$folder] += $info
  }
}

$names = @{
  "adda-classics" = "Adda Classics"
  "chai-baatein" = "Chai & Baatein"
  "lucknow-shaam" = "Lucknow Shaam"
  "purani-yaadein" = "Purani Yaadein"
}

$js = "const PLAYLISTS = {`n"
foreach ($folder in $folders) {
  $js += "  `"$folder`": {`n    name: `"$($names[$folder])`",`n    songs: [`n"
  foreach ($s in $playlists[$folder]) {
    $js += "      { file: `"music/$folder/$($s.slug).opus`", id: `"$($s.id)`", title: `"$($s.title)`", artist: `"Classic Hindi`" },`n"
  }
  $js += "    ],`n  },`n"
}
$js += "};`n"
$js | Set-Content (Join-Path $root "js\playlists.js") -Encoding UTF8
Write-Host "playlists.js rebuilt"
