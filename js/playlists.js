function parseFilename(folder, filename) {
  const base = filename.replace(/\.opus$/, "").trim();

  const JUNK_WORDS = [
    "official music video", "official video", "official audio", "official lyrical video",
    "official lyric video", "official lyric visualiser", "official visualiser",
    "official lyrics video", "official visual", "lyrical video", "lyric video",
    "lyric visualiser", "lyrical", "full video song", "full video", "full song",
    "full audio", "full hd", "hd video", "video song", "audio song",
    "original song", "title track", "title song", "new hindi song", "new song 2022",
    "new song 2024", "new song 2026", "new song", "best of 90s songs", "90s love song",
    "romantic sad song", "romantic song", "love song", "travel song",
    "original soundtrack", "soundtrack", "theme song", "promo",
    "extended film version", "acoustic version", "unplugged", "duet", "male version",
    "female version", "film version", "studio version", "demo version", "remix",
    "(from", "feat", "ft.", "ft", "official", "music video", "new video",
    "from '", "from'", "vertical lyric video", "vertical video",
    "lyric video song", "audio", "video", "version", "with lyrics",
    "best of old song", "hindi song", "bollywood song", "songs",
    "मेरे संग संग आया तेरी यादों का मेला", "मौला मेरे मौला गाने के बोल",
    "गाने के बोल", "लिरिक्स", "लिरिक्स वीडियो",
    "evergreen song", "timeless classic", "timeless romantic songs",
    "old is gold", "old hindi song",
    "live from the voice notes concert",
    "in case we forget", "nasamajh", "marammat", "artist originals",
    "after hours", "parvana ep", "official one take video", "official performance video",
    "music by", "lyrics", "lyric", "text to", "new tamil movie video song",
    "too good to be true original soundtrack", "debut ur", "ur debut",
  ].map(s => s.toLowerCase());

  const ARTIST_INDICATORS = [
    "the local train", "the yellow diary", "kk", "ab", "pkb", "kk mohd",
    "lucky ali", "falguni pathak", "udit narayan", "anuradha paudwal",
    "kumar sanu", "alka yagnik", "aamir khan", "arijit", "pritam",
    "s.p. balasubrahmanyam", "k.s.chithra", "ks chithra", "a.r. rahman", "ar rahman",
    "shreya ghoshal", "sonu nigam", "mohd rafi", "mohammed rafi", "lata mangeshkar",
    "asha bhosle", "manna dey", "kishore kumar", "mukesh", "hemalata",
    "suhan", "swanand kirkire", "shalmali kholgade", "rajan batra", "prateek kuhad",
    "aur", "anuv jain", "dikshant", "jasleen royal", "ar kanungo", "mitraz",
    "kavita seth", "kanishk seth", "bombay the artist", "ankur tewari", "kaifi khalil",
    "iqlipse nova", "khatth", "justh", "suzonn", "saahel", "aditya a",
    "rahgir", "vilen", "manan bhardwaj", "amit trivedi", "sachet parampara",
    "sunidhi chauhan", "neha kakkar", "tony kakkar", "darshan raval",
    "kk singer", "shankar mahadevan", "arijit singh", "atif aslam",
    "papon", "arijit", "jonita", "shilpa rao", "lisa mishra", "jubin nautiyal",
    "asees kaur", "altamash faridi", "vishal dadlani", "shekhar ravjiani",
    "salim merchant", "sulaiman merchant", "sukhwinder singh", "kailash kher",
    "divya kumar", "benny dayal", "nakash aziz", "neeti mohan", "monali thakur",
    "amit mishra", "armaan malik", "palak muchhal", "shaan", "kk",
    "abida parveen", "nucleya", "ritviz", "lost stories", "seedhe maut",
    "prabh deep", "talha anjum", "talhah yunus", "young stunners",
    "raghav chaitanya", "santhosh narayanan", "yuvan shankar raja", "anirudh",
    "gulzar", "sameer", "jaan nisar akhtar", "swanand kirkire", "amitabh bhattacharya",
    "kausar munir", "irshad kamil", "manoj muntashir", "varun grover",
    "anvita dutt guptan", "neelesh misra",
    "abhey jaju", "parag tomar", "akhil sachdeva", "shubhayu sen", "alokananda dasgupta",
    "rohith ramachandran", "manish",
  ];

  const MOVIE_INDICATORS = [
    "roja", "mann (1999)", "meri pyaari bindu", "kai po che", "agneepath",
    "brahmastra", "brahmāstra", "shiddat", "raanjhanaa", "3 idiots", "ek villain",
    "anwar", "kati patang", "amar prem", "safar", "anand", "anurodh",
    "namak haram", "mere jeevan saathi (1972)", "mehboob ki mehndi", "aan milo sajna",
    "do raaste (1969)", "do raaste", "ajnabee", "haathi mere saathi", "aradhana",
    "andaz (1971)", "andaz", "souten", "roti (1974)", "roti", "aap ki kasam",
    "rampur ka lakshman", "woh kaun thi (1964)", "woh kaun thi", "abhimaan",
    "khel khel mein", "hum kisi se kum nahin", "kabhi kabhi", "baharon ke sapne",
    "sanam teri kasam", "taj mahal", "chirag (1969)", "chirag", "saudagar",
    "saraswatichandra", "yeh vaada raha", "teen deviyan", "julie", "jhuk gaya aasman",
    "jeevan mrityu", "shor", "dharmaatma", "ankhiyon ke jharokhon se", "kalaakaar",
    "muqaddar ka sikandar", "dilli ka thug", "aap to aise na the", "chitchor",
    "waaris", "chupa rustam", "kuch kuch hota hai", "kabhi khushi kabhie gham",
    "kal ho naa ho", "dabangg", "dabangg 2", "bodyguard", "ek tha tiger",
    "chennai express", "dhoom 3", "happy new year", "dilwale", "sultan",
    "ae dil hai mushkil", "dangal", "tiger zinda hai", "padmaavat",
    "sanju", "simmba", "uri", "bharat", "war", "chhapaak", "tanhaji",
    "street dancer 3d", "shubh mangal zyada saavdhan", "baaghi 3", "thappad",
    "gunjan saxena", "dil bechara", "ak vs ak", "the girl on the train",
    "saina", "mimi", "shershaah", "bell bottom", "sooryavanshi", "atrangi re",
    "gangubai kathiawadi", "bhool bhulaiyaa 2", "rrr", "jugjugg jeeyo",
    "shamshera", "laal singh chaddha", "brahmastra part one: shiva",
    "drishyam 2", "bhediya", "pathaan", "tu jhoothi main makkaar",
    "jawan", "pathaan", "ganapath", "leo", "tiger 3", "dunki", "fighter",
    "crew", "chhaava", "do aur do pyaar", "lost;found", "found;lost", "yaadein",
    "tere naam", "chalte chalte", "mohabbatein", "devdas", "hum tum", "fanaa",
    "namastey london", "jab we met", "love aaj kal", "anjaana anjaani",
    "zindagi na milegi dobara", "rockstar", "yeh jawaani hai deewani",
    "chennai express", "gunday", "haider", "heropanti", "ek villain",
    "kick", "happy new year", "pk", "badlapur", "abcd 2", "bajrangi bhaijaan",
    "dilwale", "baajirao mastani", "kapoor & sons", "sultan", "udta punjab",
    "rustom", "ae dil hai mushkil", "shivaay", "dear zindagi", "kaabil",
    "raeess", "badrinath ki dulhania", "raabta", "tubelight", "jab harry met sejal",
    "toilet: ek prem katha", "shubh mangal saavdhan", "bhoomi", "judwaa 2",
    "secret superstar", "golmaal again", "ittefaq", "tiger zinda hai",
    "padmaavat", "pad man", "sonu ke titu ki sweety", "hichki", "raazi",
    "parmanu", "veere di wedding", "sanju", "dhadak", "satyameva jayate",
    "stree", "paltan", "loveyatri", "badhaai ho", "thugs of hindustan",
    "k.g.f: chapter 1", "simmba", "uri: the surgical strike", "battle of saragarhi",
    "gully boy", "kalank", "de de pyaar de", "bharat", "kabir singh",
    "article 15", "super 30", "judgementall hai kya", "jabariya jodi",
    "mission mangal", "batla house", "saaho", "chhichhore", "dream girl",
    "the zoya factor", "war", "housefull 4", "made in china", "bala",
    "commando 3", "pati patni aur woh", "panipat", "dabangg 3", "mardaani 2",
    "good newwz", "chhapaak", "tanhaji: the unsung warrior", "street dancer 3d",
    "shubh mangal zyada saavdhan", "thappad", "baaghi 3", "angrezi medium",
    "gunjan saxena: the kargil girl", "dil bechara", "shakuntala devi",
    "gunjan saxena", "ak vs ak", "the girl on the train", "roohi", "saina",
    "mumbai saga", "sandeep aur pinky faraar", "bell bottom", "chehre",
    "shershaah", "bhuj: the pride of india", "dial 100", "shiddat",
    "hum do hamare do", "dybbuk", "satyameva jayate 2", "antim: the final truth",
    "salman khan", "atrangi re", "83", "the kashmir files", "bachchhan paandey",
    "gangubai kathiawadi", "jhund", "rrr", "attack", "dashmi", "k.g.f: chapter 2",
    "heropanti 2", "runway 34", "meri rasoi ke kahaani", "jayeshbhai jordaar",
    "bhool bhulaiyaa 2", "dhaakad", "samrat prithviraj", "jugjugg jeeyo",
    "rashtra kavach om", "shamshera", "laal singh chaddha", "raksha bandhan",
    "liger", "brahmastra: part one - shiva", "drishyam 2", "bhediya",
    "salaam venky", "govinda naam mera", "cirkus", "pathaan", "shehzada",
    "selfiee", "zara hatke zara bachke", "adipurush", "satyaprem ki katha",
    "rocky aur rani ki prem kahani", "omg 2", "gadar 2", "dream girl 2",
    "jawan", "the great indian family", "tiger 3", "12th fail", "salaar",
    "dunki", "fighter", "article 370", "shaitaan", "crew", "maidaan",
    "bade miyan chote miyan", "chhaava", "mr. and mrs. mahi",
    "do aur do pyaar", "faraaz", "pathaan", "lost", "found",
  ];

  function cleanStr(s) {
    return s
      .replace(/\u200b/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+\|/g, "｜")
      .replace(/\|\s+/g, "｜")
      .replace(/\s*：\s*/g, "：")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function stripJunk(s, aggressive=false) {
    if (!s) return "";
    let out = cleanStr(s);

    out = out.replace(/\s*[(［【]\s*from[^)\]】]*[)\]】]/gi, " ");
    out = out.replace(/\s*\([^)]*\)/g, " ");
    out = out.replace(/\s*[[［【][^\]］】]*[\]］】]/g, " ");
    out = out.replace(/\s*｛[^｝]*｝/g, " ");
    out = out.replace(/\s*[<《][^>》]*[>》]/g, " ");

    const parts = out.split(/[｜|]/).map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      out = parts[0];
    }

    out = cleanStr(out);

    if (aggressive) {
      for (let attempt = 0; attempt < 2; attempt++) {
        let changed = false;
        for (const junk of JUNK_WORDS) {
          const escaped = junk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = new RegExp("(^|\\s|[,:;\\-–—])" + escaped + "($|\\s|[,:;\\-–—。!?])", "gi");
          if (re.test(out)) {
            out = out.replace(re, " ");
            changed = true;
          }
        }
        if (!changed) break;
        out = cleanStr(out);
      }
    }

    out = out
      .replace(/\s*[｜|]\s*/g, " ")
      .replace(/\s*[：:][^｜|]*$/g, "")
      .replace(/\s+[-–—]\s+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    out = out.replace(/^[-–—:\s]+|[-–—:\s]+$/g, "").trim();
    return out;
  }

  const cleaned = cleanStr(base);
  const pipeParts = cleaned.split(/[｜|]/).map(p => p.trim()).filter(Boolean);

  let title = "";
  let artist = "";

  const firstDash = pipeParts[0] || "";
  const dashMatch = firstDash.match(/^(.+?)\s*[-–—]\s*(.+)$/);

  if (dashMatch) {
    const left = dashMatch[1].trim();
    const right = dashMatch[2].trim();
    const leftLower = left.toLowerCase();
    const rightLower = right.toLowerCase();

    const dashInner = right.match(/^(.+?)\s*[-–—]\s*(.+)$/);

    const leftLooksLikeArtist = (
      ARTIST_INDICATORS.some(a => leftLower === a || leftLower.startsWith(a + " ") || leftLower.endsWith(" " + a) || leftLower.includes(" " + a + " "))
      || (/\b(ft|feat)\.?\b/i.test(left) === false && /songs?$|mashup|mashup|cover/i.test(left) === false)
      && !/^[A-Z0-9']{2,}$/.test(left)
    );

    const rightLooksLikeArtist = (
      ARTIST_INDICATORS.some(a => rightLower === a || rightLower.startsWith(a + " ") || rightLower.endsWith(" " + a) || rightLower.includes(" " + a + " "))
    );

    const leftLooksLikeTitle = (
      leftLower.includes(" ") && !rightLooksLikeArtist === false
      && /^[A-Z]/.test(left) && /^[A-Z]/.test(right) === false
    );

    if (dashInner) {
      title = dashInner[1].trim();
      const more = dashInner[2].trim();
      const isArtist = ARTIST_INDICATORS.some(a => more.toLowerCase().includes(a));
      if (isArtist || /^[\w@\- ]+ \/ /.test(more) === false) {
        artist = left + (leftLooksLikeArtist ? "" : "");
      }
      if (!title) title = left;
    } else if (leftLooksLikeArtist && !/^lyrical|full|official/i.test(leftLower)) {
      artist = left;
      title = right;
    } else if (rightLooksLikeArtist && !/^lyrical|full|official/i.test(rightLower)) {
      artist = right;
      title = left;
    } else if (/^[a-z0-9'.@&, ]+$/i.test(left) && left.length < 45 && /[A-Z]/.test(left) && /\s/.test(left) === false) {
      artist = left;
      title = right;
    } else {
      title = firstDash;
    }
  } else {
    title = pipeParts[0] || cleaned;
  }

  if (pipeParts.length > 1) {
    const tail = pipeParts.slice(1).join(" ｜ ");
    const tailLower = tail.toLowerCase();

    if (!artist) {
      for (const a of ARTIST_INDICATORS) {
        if (tailLower.includes(a)) {
          artist = a.replace(/\b\w/g, c => c.toUpperCase());
          break;
        }
      }
    }

    if (!artist) {
      for (const part of pipeParts.slice(1)) {
        const pLower = part.toLowerCase();
        const isJunk = JUNK_WORDS.some(j => pLower.includes(j));
        const isMovie = MOVIE_INDICATORS.some(m => pLower.includes(m) || pLower.replace(/\s*\(\d{4}\)\s*/, "").includes(m));
        const hasYear = /\(\d{4}\)/.test(part);
        if (!isJunk && !isMovie && !hasYear && /[A-Za-z\u0900-\u097F]/.test(part) && part.length < 55) {
          const good = part
            .replace(/\s*[,(]\s*music\s*director.*$/i, "")
            .replace(/\s*[,(]\s*lyrics?\s*by.*$/i, "")
            .replace(/\s*[,(]\s*music\s*by.*$/i, "")
            .replace(/^@\w+\s*$/, "")
            .replace(/^[\W_]+|[\W_]+$/g, "")
            .trim();
          if (good && good.length > 2 && good.length < 50) {
            const isBad = JUNK_WORDS.some(j => good.toLowerCase().includes(j))
              || MOVIE_INDICATORS.some(m => good.toLowerCase().includes(m.replace(/\s*\(\d{4}\)\s*/, "")));
            if (!isBad) {
              artist = good;
              break;
            }
          }
        }
      }
    }
  }

  let finalTitle = stripJunk(title, true);

  if (finalTitle && /[a-z\u0900-\u097F]/i.test(finalTitle) === false) {
    finalTitle = stripJunk(title, false);
  }

  if (!finalTitle) {
    finalTitle = cleanStr(title).replace(/\s*\([^)]*\)/g, "").trim();
  }
  if (!finalTitle) {
    finalTitle = cleanStr(cleaned.split(/[｜|]/)[0] || cleaned);
  }
  if (!finalTitle) {
    finalTitle = "Untitled";
  }

  let finalArtist = artist ? stripJunk(artist, true) : "";
  if (finalArtist && /[a-z\u0900-\u097F]/i.test(finalArtist) === false) {
    finalArtist = stripJunk(artist, false);
  }
  if (!finalArtist) {
    finalArtist = "Various Artists";
  }
  if (finalArtist.toLowerCase() === finalTitle.toLowerCase()) {
    finalArtist = "Various Artists";
  }

  finalTitle = finalTitle
    .replace(/\s{2,}/g, " ")
    .replace(/^[-–—_.,:;!? ]+|[-–—_.,:;!? ]+$/g, "")
    .trim();

  finalArtist = finalArtist
    .replace(/\s{2,}/g, " ")
    .replace(/^[-–—_.,:;!? ]+|[-–—_.,:;!? ]+$/g, "")
    .trim();

  return {
    file: `music/${folder}/${encodeURIComponent(filename)}`,
    id: "",
    title: finalTitle || "Untitled",
    artist: finalArtist || "Various Artists",
  };
}

const PLAYLISTS = {
  "adda-classics": {
    name: "Adda Classics",
    songs: [
      parseFilename("adda-classics", "Yeh Haseen Vadiyan - Roja ｜A.R. Rahman ｜S.P. Balasubrahmanyam ｜K.S.Chithra ｜Madhoo ｜Arvind.opus"),
      parseFilename("adda-classics", "Lucky Ali - O Sanam - Sunoh ｜ Official Music Video.opus"),
      parseFilename("adda-classics", "चाहा है तुझको ｜ Mann (1999) ｜ Udit Narayan & Anuradha Paudwal ｜ Romantic Sad Song ｜Best of 90s Songs.opus"),
      parseFilename("adda-classics", "Falguni Pathak - Maine Payal Hai Chhankai.opus"),
      parseFilename("adda-classics", "Dil Kehta Hai ｜ Akele Hum Akele Tum ｜ Kumar Sanu, Alka Yagnik ｜ Aamir Khan ｜ 90s Love Song.opus"),
      parseFilename("adda-classics", "Naina (From 'Crew').opus"),
      parseFilename("adda-classics", "Chitta (Full Video) ｜ Shiddat ｜ Sunny Kaushal, Radhika Madan, Mohit R ,Diana P ｜ Manan Bhardwaj.opus"),
      parseFilename("adda-classics", "Manja - Full Video ｜ Kai Po Che ｜ Sushant Singh Rajput, Rajkummar Rao, Amit Sadh ｜ Amit Trivedi.opus"),
      parseFilename("adda-classics", "Mera Mann-Yahin Hoon Main.opus"),
      parseFilename("adda-classics", "Deva Deva - Extended Film Version｜Brahmāstra｜Amitabh B｜Ranbir ｜@aliabhatt｜@pritam7415 ｜Arijit｜Jonita.opus"),
      parseFilename("adda-classics", "Farq Hai - Suzonn (Official Music Video).opus"),
      parseFilename("adda-classics", "Vilen - Chidiya (Official  Video).opus"),
      parseFilename("adda-classics", "Maana Ke Hum Yaar Nahin ｜ Full Song ｜ Meri Pyaari Bindu ｜ Parineeti Chopra ｜ Sachin-Jigar, Kausar M.opus"),
      parseFilename("adda-classics", "The Local Train - Aaftaab (Official Audio).opus"),
      parseFilename("adda-classics", "Arjun Kanungo, Momina Mustehsan - Aaya Na Tu ｜ Kunaal Vermaa.opus"),
      parseFilename("adda-classics", "Sach Keh Raha Hai Deewana ｜ @Mayankmauryaaa  ｜ Rehna Hai Tere Dil Mein ｜ Maadhyam I TBSmusic I RHTDM.opus"),
      parseFilename("adda-classics", "Jo Tu Na Mila - Acoustic Version ｜ Asim Azhar.opus"),
      parseFilename("adda-classics", "Give Me Some Sunshine - 3 Idiots ｜ Aamir Khan, Madhavan, Sharman J ｜ Suraj Jagan ｜ Shantanu Moitra.opus"),
      parseFilename("adda-classics", "Zaroorat Full Video Song ｜ Ek Villain ｜ Mithoon ｜ Mustafa Zahid.opus"),
      parseFilename("adda-classics", "Jogi.opus"),
      parseFilename("adda-classics", "Challa.opus"),
      parseFilename("adda-classics", "Maula Mere Maula Lyrical ｜ मौला मेरे मौला गाने के बोल ｜ Anwar ｜ Siddharth Koirala ｜Roop Kumar Rathod.opus"),
      parseFilename("adda-classics", "Ajay-Atul - Abhi Mujh Mein Kahin Best Lyric｜Agneepath｜Priyanka Chopra,Hrithik｜Sonu Nigam.opus"),
      parseFilename("adda-classics", "Raanjhanaa - Title Track ｜ Dhanush, Sonam Kapoor ｜ A. R. Rahman ｜ Jaswinder S & Shiraz Uppal.opus"),
      parseFilename("adda-classics", "Road Trip Mashup ｜ SICKVED ｜ Ranbir Kapoor ｜ Deepika Padukone ｜ Lucky Ali ｜ Mohit Chauhan.opus"),
      parseFilename("adda-classics", "Saajna (Unplugged).opus"),
      parseFilename("adda-classics", "Tu Hi Hai (Ali Zafar Version) (From 'Dear Zindagi').opus"),
      parseFilename("adda-classics", "Teri Khair Mangdi.opus"),
      parseFilename("adda-classics", "Kabira.opus"),
      parseFilename("adda-classics", "Hoshwalon Ko Khabar Kya.opus"),
      parseFilename("adda-classics", "PYAR KIYA TO NIBHANA.opus"),
      parseFilename("adda-classics", "HUM TUMKO NIGAHON MEIN.opus"),
      parseFilename("adda-classics", "MONEY.opus"),
      parseFilename("adda-classics", "Tera Hi Bas Hona Chaahoon.opus"),
      parseFilename("adda-classics", "Golmaal (Duet).opus"),
      parseFilename("adda-classics", "Chiggy Wiggy.opus"),
      parseFilename("adda-classics", "TENNU LE.opus"),
      parseFilename("adda-classics", "Ek Bewafaa Hai.opus"),
      parseFilename("adda-classics", "Khwab Dekhe Sexy Lady.opus"),
      parseFilename("adda-classics", "JHALAK DIKHLA JA.opus"),
      parseFilename("adda-classics", "Dus Bahane.opus"),
      parseFilename("adda-classics", "Aap Ki Kashish.opus"),
      parseFilename("adda-classics", "YOU'RE MY LOVE.opus"),
      parseFilename("adda-classics", "Mujhse Shaadi Karogi.opus"),
      parseFilename("adda-classics", "MUJHKO YAAD SATAYE TERI.opus"),
      parseFilename("adda-classics", "TUMSE MILKE DIL KA.opus"),
      parseFilename("adda-classics", "Ucha Lamba Kad.opus"),
      parseFilename("adda-classics", "Bhool Bhulaiyaa.opus"),
      parseFilename("adda-classics", "Dard - E - Disco.opus"),
    ],
  },
  "chai-baatein": {
    name: "Chai & Baatein",
    songs: [
      parseFilename("chai-baatein", "Patang (Official Visualizer) ｜ Abeer Chopra ｜ New Hindi Song.opus"),
      parseFilename("chai-baatein", "Udja Bekhabar.opus"),
      parseFilename("chai-baatein", "Mehfooz Rakh - Rono & @swanandkirkire2762 (Official Visual).opus"),
      parseFilename("chai-baatein", "Shaam Official Lyric Visualiser - Akash Tripathi ｜ Karan Vaidya ｜ Timothy Thampy.opus"),
      parseFilename("chai-baatein", "The Yellow Diary - Dastoor (Official Lyric Visualiser) - In Case We Forget.opus"),
      parseFilename("chai-baatein", "Tarse Jiya - Aditya A ft. Samriddhi.opus"),
      parseFilename("chai-baatein", "Tu Hai.opus"),
      parseFilename("chai-baatein", "Mehka.opus"),
      parseFilename("chai-baatein", "Mohnish Gaikawad - Jaane Jaan ｜ Original Song ｜ Official Music Video.opus"),
      parseFilename("chai-baatein", "Riha.opus"),
      parseFilename("chai-baatein", "Saahel - Madham (Official Music Video).opus"),
      parseFilename("chai-baatein", "Mulaqaat.opus"),
      parseFilename("chai-baatein", "Suzonn - Kinaare (Official Music Video).opus"),
      parseFilename("chai-baatein", "Rukna Nahin Hai (Official Music Video) - Akash Kaushal.opus"),
      parseFilename("chai-baatein", "Mehfilein(Official Music Video) - Prateeksha Srivastava ｜ Priyanshu Soni ｜ ffs..opus"),
      parseFilename("chai-baatein", "O Meena - Inayat.opus"),
      parseFilename("chai-baatein", "Samjha Hi Nahi I Osho Jain.opus"),
      parseFilename("chai-baatein", "Resham Ki Dor.opus"),
      parseFilename("chai-baatein", "Saanvare (Too Good To Be True Original Soundtrack).opus"),
      parseFilename("chai-baatein", "Shravan Sridhar - Seh Loon ft. Raghav Kaushik [Official Music Video].opus"),
      parseFilename("chai-baatein", "Prateek Kuhad - Hum Dono (Official Lyric Video).opus"),
      parseFilename("chai-baatein", "Suzonn - Dil Qaabu Mein (Official Music Video).opus"),
      parseFilename("chai-baatein", "Suzonn - Adhure Hum (Official Music Video).opus"),
      parseFilename("chai-baatein", "Shakkar ｜ Shakkarpari Ft. Bela Fleck - Hindi ｜ Raghu Dixit ｜ Neeraj Rajawat ｜.opus"),
      parseFilename("chai-baatein", "Yawar Abdal - Intehaa.opus"),
      parseFilename("chai-baatein", "Sabar - Kamakshi Khanna (Official Music Video).opus"),
      parseFilename("chai-baatein", "Nazaare (Official Music Video) ｜ KhoslaRaghu ｜ 2024 ｜ Travel Song.opus"),
      parseFilename("chai-baatein", "Prateek Kuhad - Kuch Din (Official Lyric Video).opus"),
      parseFilename("chai-baatein", "The Yellow Diary ft. @lisamishramusic - Tere Siva Re (Official Music Video) - In Case We Forget.opus"),
      parseFilename("chai-baatein", "Tootay - Ankur Tewari ｜ Official Music Video ｜ Artist Originals.opus"),
      parseFilename("chai-baatein", "Saahel - Tujhi Mein (Official Music Video).opus"),
      parseFilename("chai-baatein", "Shor - Gul  (Lyrics Video )｜ Swanand Kirkire ｜ Ujjwal Kashyap ｜.opus"),
      parseFilename("chai-baatein", "Piya.opus"),
      parseFilename("chai-baatein", "Yawar Abdal - Dil Se (Official Music Video).opus"),
      parseFilename("chai-baatein", "Tu Jaane Hai Kahan.opus"),
      parseFilename("chai-baatein", "Tum Ho Toh - Official Music Video ｜ Iqlipse Nova ｜ Prakriti Kakar.opus"),
      parseFilename("chai-baatein", "The Yellow Diary ft. @ShilpaRaoLive - Saaye (Official Music Video) - In Case We Forget.opus"),
      parseFilename("chai-baatein", "Yeh Naazuk Se Rishtey (Official Music Video) ｜ Snehdeep Singh Kalsi.opus"),
      parseFilename("chai-baatein", "SAATH TERE ( OFFICIAL VIDEO) ｜ Sukriti Kakar ｜ Prakriti Kakar ｜ Abhijay Sharma ｜ SUPRA Originals.opus"),
      parseFilename("chai-baatein", "Salman Elahi - Mukhatib (Official Music Video).opus"),
      parseFilename("chai-baatein", "Tu Mila (Official Music Video) - Anubha Bajaj, Akshath.opus"),
      parseFilename("chai-baatein", "Meri Jaan..Swanand Kirkire, Hansika Pareek, Shrey Gupta, Bharath.opus"),
      parseFilename("chai-baatein", "MITRAZ - O Re Saavan (Official Video).opus"),
      parseFilename("chai-baatein", "Zaeden - Raaz (Official Music Video).opus"),
      parseFilename("chai-baatein", "Saza ｜ Lisa Mishra (Official Music Video).opus"),
      parseFilename("chai-baatein", "Naalayak - 3 AM Thoughts (From MARAMMAT) ｜ Official Music Video.opus"),
      parseFilename("chai-baatein", "Tera Naam - Anmol A @MITRAZ.opus"),
      parseFilename("chai-baatein", "OutStation - Homecoming (Official Music Video) ｜ New Song 2026.opus"),
      parseFilename("chai-baatein", "OutStation - Tum Se (Official Music Video).opus"),
      parseFilename("chai-baatein", "Tu Hai Kahan.opus"),
      parseFilename("chai-baatein", "TUM (Official Music Video) ｜ Raghav Kaushik ｜ Amrita Saluja ｜ feat. Kaveri Seth & Danesh Razvi.opus"),
      parseFilename("chai-baatein", "Sunday - Aditya A ｜ Naalayak ｜ Ronit Vinta.opus"),
      parseFilename("chai-baatein", "Roz Roz (Official) - The Yellow Diary ft. Shilpa Rao ｜ Isha Talwar ｜ Arjun Menon ｜Romantic Song 2021.opus"),
      parseFilename("chai-baatein", "Tu Hai Kahaan ｜ Do Aur Do Pyaar ｜ Vidya Balan, Pratik Gandhi ｜ The Local Train ft. Lucky Ali.opus"),
      parseFilename("chai-baatein", "Prateek Kuhad - Mulaqat (Official Music Video) ｜ Tara Sutaria.opus"),
      parseFilename("chai-baatein", "Safar.opus"),
      parseFilename("chai-baatein", "Tu Hai Kahan by AUR ｜ تو ہے کہاں feat. ZAYN (Official Music Video).opus"),
      parseFilename("chai-baatein", "Saahel - Baarish Mein Phir (Official Music Video).opus"),
      parseFilename("chai-baatein", "Sahiba (Official Music Video) ： Aditya Rikhari, Ankita Chhetri ｜ T-Series.opus"),
      parseFilename("chai-baatein", "Navjot Ahuja - Khat (Official Audio).opus"),
      parseFilename("chai-baatein", "Noor, Khan, Madhurxo - Aarzu (Official Music Video).opus"),
      parseFilename("chai-baatein", "Matcha (Promo) ｜ OAFF & Savera.opus"),
      parseFilename("chai-baatein", "The Yellow Diary - Yun Hi Kahin (Official Music Video).opus"),
      parseFilename("chai-baatein", "Places I Find You In - Frizzell D'Souza & Abdon Mech.opus"),
      parseFilename("chai-baatein", "Mary Ann Alexander - Better Than This (Official Video).opus"),
      parseFilename("chai-baatein", "Prateek Kuhad - If I Cannot Be Yours ｜ Official Music Video.opus"),
      parseFilename("chai-baatein", "Phool by AUR ｜ پھول  -  Official lyrical Video.opus"),
      parseFilename("chai-baatein", "Woh - Khatth ft. Sthiti (Official Music Video).opus"),
      parseFilename("chai-baatein", "Paresh Pahuja - Dooron Dooron (Live from The Voice Notes Concert).opus"),
      parseFilename("chai-baatein", "You Make It Easy - Prateek Kuhad (Official Music Video).opus"),
      parseFilename("chai-baatein", "Sarah Black - Maname Neeyae (Official Music Video).opus"),
    ],
  },
  "lucknow-shaam": {
    name: "Lucknow Shaam",
    songs: [
      parseFilename("lucknow-shaam", "khumaar.opus"),
      parseFilename("lucknow-shaam", "Manmarziyan (feat. Rishabh Panchal).opus"),
      parseFilename("lucknow-shaam", "Gaddariya.opus"),
      parseFilename("lucknow-shaam", "Ishq seekh lo.opus"),
      parseFilename("lucknow-shaam", "Harpreet - Bandhu (Official Lyrical Video).opus"),
      parseFilename("lucknow-shaam", "Kaahe Kaahe.opus"),
      parseFilename("lucknow-shaam", "Baaki ｜ Shalmali Kholgade & Rajan Batra ｜ Lyric Video.opus"),
      parseFilename("lucknow-shaam", "Ek Kahani.opus"),
      parseFilename("lucknow-shaam", "Baarish Ki Boondein.opus"),
      parseFilename("lucknow-shaam", "Kisse Kahein - Visualiser (ft. Aishwarya Ojha) ｜ Akash Tripathi ｜ Ramil Ganjoo.opus"),
      parseFilename("lucknow-shaam", "Dhoop.opus"),
      parseFilename("lucknow-shaam", "Anand Bhaskar Collective - Kuch Pal Yahin ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Aaye Re - Samad Khan ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Maati Baani - Kore Kaagaz ( Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Kahaan Aagaye Hum (Official Lyric Video) ｜ Raghav Kaushik ｜ Akanksha Sethi ｜ Karan Malhotra.opus"),
      parseFilename("lucknow-shaam", "Danga - Gunda ｜ Azadi Records (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Choti Si Kahaani.opus"),
      parseFilename("lucknow-shaam", "Dil Ki Nadani - Suzonn (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Hai Toh Hai ｜ Dil Safar ｜ Kavita Seth & Kanishk Seth ｜ Dipti Misra ｜ Official Lyric Visualizer.opus"),
      parseFilename("lucknow-shaam", "Aashiyan.opus"),
      parseFilename("lucknow-shaam", "Anumita Nadesan, Shams - Aas Paas (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Anumita Nadesan - Ahista (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Maine Muddat Se - Official Music Video ｜ Kavita Seth ｜ Kanishk Seth ｜ Waseem Bareilvi.opus"),
      parseFilename("lucknow-shaam", "Ankur Tewari - 1_15 AM (AFTER HOURS) ｜ Official Music Video (Shot on iPhone ).opus"),
      parseFilename("lucknow-shaam", "Keethan - Mann (ft. Pavitra Krishnan).opus"),
      parseFilename("lucknow-shaam", "Fizool ki baat.opus"),
      parseFilename("lucknow-shaam", "Keh Do Na Tum.opus"),
      parseFilename("lucknow-shaam", "Bombay Noor - Heer Minus (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Chaand Aawara - Swanand Kirkire, Shrey Gupta, Khwaab.opus"),
      parseFilename("lucknow-shaam", "Khamakha (Official Lyric Video) - Akash Kaushal, Bharath.opus"),
      parseFilename("lucknow-shaam", "Cold Showers.opus"),
      parseFilename("lucknow-shaam", "Dream Note - Sab Sahi (Official Music Video) ｜ Hindi Indie Travel Song.opus"),
      parseFilename("lucknow-shaam", "Dikshant x Arijit ｜ Karam ｜ Official Lyrical Video.opus"),
      parseFilename("lucknow-shaam", "Ankur Tewari - KASAM SE ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Ankur Tewari, Kausar Munir - Chand Takiye ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Bombay the Artist - Naina (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Khoya Khoya.opus"),
      parseFilename("lucknow-shaam", "Bharat Chauhan - Kareeb (Official Lyric Video).opus"),
      parseFilename("lucknow-shaam", "It's You.opus"),
      parseFilename("lucknow-shaam", "Gayenge Hum Tere Hi Liye.opus"),
      parseFilename("lucknow-shaam", "Behtar ｜ Hansika Pareek ｜ @AnuragMishramusic  ｜ @AdityaBishtMusicOfficial (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "‘PREMIKA’ (Official Music Video) ： AAYU.opus"),
      parseFilename("lucknow-shaam", "Bewaqt - Khatth (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Facts by Rahgir.opus"),
      parseFilename("lucknow-shaam", "Janisht Joshi & gini - Ab Na Laut Paayenge (Offical Music Video).opus"),
      parseFilename("lucknow-shaam", "Kohinoor.opus"),
      parseFilename("lucknow-shaam", "Janisht Joshi, Phosphenes - Parchhaiyan (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Akshath - Sitaara (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Aakhri Saans - Official One Take Video ｜ Iqlipse Nova, Aditya A.opus"),
      parseFilename("lucknow-shaam", "Lucky Ali - Dil Gaye Ja ｜ Official Music Video ｜ Music By Mikey McCleary.opus"),
      parseFilename("lucknow-shaam", "Ab Main Kya Karun ｜ Official Performance Video ｜ Last Minute India.opus"),
      parseFilename("lucknow-shaam", "Kahe Kahe - The Yellow Diary ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Jee Le.opus"),
      parseFilename("lucknow-shaam", "Lucky Ali ｜ sayyāh ｜ Official Music Video (Ft. Music by Mikey McCleary).opus"),
      parseFilename("lucknow-shaam", "Kya Ho Agar.opus"),
      parseFilename("lucknow-shaam", "Aadhey Adhoorey - Aashir Wajahat ｜ Gini (Official Video).opus"),
      parseFilename("lucknow-shaam", "Aas (Music Video) ｜ Divyam Sodhi ｜ Khwaab.opus"),
      parseFilename("lucknow-shaam", "Daira (Official Music Video) ： Sanjeeta Bhattacharya.opus"),
      parseFilename("lucknow-shaam", "Akshath - Rozaana (Official Visualizer).opus"),
      parseFilename("lucknow-shaam", "Baaton Baaton Main (Official Video) Shashwat Sachdev ft. Anumita Nadesan ｜ New Song 2022.opus"),
      parseFilename("lucknow-shaam", "Akshath - Tu Hai Kya (Official Video).opus"),
      parseFilename("lucknow-shaam", "Dil Besabar.opus"),
      parseFilename("lucknow-shaam", "Aditya Rikhari - Tinka (Official Music Video) ft. Mugdha Agarwal.opus"),
      parseFilename("lucknow-shaam", "Kabhi Mein Kabhi Tum by AUR ｜ کبھی میں کبھی تم (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Aasmani.opus"),
      parseFilename("lucknow-shaam", "[New Hindi Song] Taba Chake - Khud Ko Miloon (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Jaadugari - Maahi ｜ Official Music Video ｜ Saregama Originals.opus"),
      parseFilename("lucknow-shaam", "Dekha Hi Nahi.opus"),
      parseFilename("lucknow-shaam", "Iqlipse Nova, Anubha Bajaj - Savera (Lyrics).opus"),
      parseFilename("lucknow-shaam", "Akshath - Aadat Nahi Hai (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Adhoora (Official Video) - Aanchal Tyagi, Madhur Sharma ｜ IndieA Records.opus"),
      parseFilename("lucknow-shaam", "Anuv Jain - MAZAAK (Official Video).opus"),
      parseFilename("lucknow-shaam", "Chaar Diwaari ft. Indian Ocean, Gini - Aashiqana ｜ Parvana EP ｜ Def Jam India.opus"),
      parseFilename("lucknow-shaam", "Alfaazo.opus"),
      parseFilename("lucknow-shaam", "Baawra (Official Video) ： Kushagra ｜ Tanishka Bahl ｜ UR Debut ｜ New Songs.opus"),
      parseFilename("lucknow-shaam", "Justh - Unse Jaake Kehdo (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Khoya.opus"),
      parseFilename("lucknow-shaam", "Farak - Parwaaz ｜ Official Music Video ｜ Film by Krsh ｜.opus"),
      parseFilename("lucknow-shaam", "Kaifi Khalil - Jurmana [Official Music Video].opus"),
      parseFilename("lucknow-shaam", "Aditya Rikhari - Paro (UNPLG'd).opus"),
      parseFilename("lucknow-shaam", "Dikshant - Aankhon Se Batana (Official Video).opus"),
      parseFilename("lucknow-shaam", "Justh - Chor (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Anuv Jain - INAAM (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Chaand Baaliyan - Aditya A. (Official Video).opus"),
      parseFilename("lucknow-shaam", "Chalo Door Kahin (Official Video) - Samar Jafri.opus"),
      parseFilename("lucknow-shaam", "Aditya Rikhari - SAMJHO NA ( NASAMAJH ).opus"),
      parseFilename("lucknow-shaam", "Ishq (From 'Lost;Found').opus"),
      parseFilename("lucknow-shaam", "Anuv Jain - HUSN (Official Video).opus"),
      parseFilename("lucknow-shaam", "Akshath - Nadaaniyan (Official Video) Aisha Ahmed.opus"),
      parseFilename("lucknow-shaam", "Finding Her (Jana Mere Sawalon Ka Manzar Tu) ： Kushagra ｜ Vanshika ｜ Bharath ｜ Karan Maini ｜UR Debut.opus"),
      parseFilename("lucknow-shaam", "Anuv Jain X Lost Stories - Arz Kiya Hai (Official Video) ｜ Coke Studio Bharat.opus"),
      parseFilename("lucknow-shaam", "Anuv Jain - JO TUM MERE HO (Official Video).opus"),
      parseFilename("lucknow-shaam", "Jaane Bhi Do.opus"),
      parseFilename("lucknow-shaam", "gini - Feeka ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Farak - Taare ｜ Official Music Video ｜.opus"),
      parseFilename("lucknow-shaam", "Bharat Chauhan - Chann Chadheya (Official Video).opus"),
      parseFilename("lucknow-shaam", "Janisht Joshi & AtharvaMusic - Julie (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Janisht Joshi, Ramil Ganjoo - Khota (Visualiser).opus"),
      parseFilename("lucknow-shaam", "gini - Naadaani ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Aavenga Kade O Maahi？.opus"),
      parseFilename("lucknow-shaam", "Anmol A - Raabta.opus"),
      parseFilename("lucknow-shaam", "Last Love (From 'UR Debut').opus"),
      parseFilename("lucknow-shaam", "Gumshuda.opus"),
      parseFilename("lucknow-shaam", "BETWEEN FLOWERS.opus"),
      parseFilename("lucknow-shaam", "Abdon Mech Feat Keneisenuo Sorhie - I've Found My Dream (Official Music Video).opus"),
      parseFilename("lucknow-shaam", "Manjha.opus"),
      parseFilename("lucknow-shaam", "Bharat Chauhan - Bazaar ft. Seedhe Maut (Official Lyric Video).opus"),
      parseFilename("lucknow-shaam", "Blush - Prateek Kuhad ｜ Official Music Video.opus"),
      parseFilename("lucknow-shaam", "Finding Her (Female Version) (From 'UR Debut').opus"),
      parseFilename("lucknow-shaam", "Anuv Jain - AFSOS ft. AP Dhillon (Official Visualizer).opus"),
      parseFilename("lucknow-shaam", "Bin Tere.opus"),
    ],
  },
  "purani-yaadein": {
    name: "Purani Yaadein",
    songs: [
      parseFilename("purani-yaadein", "मेरे संग संग आया तेरी यादों का मेला (1) ｜ Rajput ｜ Kishore Kumar Songs ｜ Hema Malini.opus"),
      parseFilename("purani-yaadein", "Agar Tum Na Hote Male - Vertical Lyric Video｜Kishore Kumar｜R.D. Burman｜timeless classic.opus"),
      parseFilename("purani-yaadein", "Maine Tere Liye Lyrical Video Song ｜ मेने तेरे लिए  ｜ Mukesh ｜ Anand ｜ Rajesh Khanna ｜ Sunita Sanyal.opus"),
      parseFilename("purani-yaadein", "Nadiya Chale Chale Re Dhara ｜ Safar ｜ Hindi Film Song ｜ Manna Dey.opus"),
      parseFilename("purani-yaadein", "Main Shayar Badnaam with lyrics ｜ मैं शायर बदनाम गाने के बोल ｜ Namak Haraam ｜ Rajesh Khanna, Rekha.opus"),
      parseFilename("purani-yaadein", "Chingari Koi Bhadke with lyrics ｜ चिंगारी कोई भड़के के बोल ｜ Kishore Kumar.opus"),
      parseFilename("purani-yaadein", "रोना कभी नहीं रोना ｜ Apna Desh ｜ Kishore Kumar Songs ｜ Rajesh Khanna.opus"),
      parseFilename("purani-yaadein", "Nadiya Se Dariya with lyrics ｜ नदिया से दरिया गाने के बोल ｜ Namak Haraam ｜ Rajesh Khanna, Rekha.opus"),
      parseFilename("purani-yaadein", "Chala Jata Hoon ｜ Mere Jeevan Saathi (1972) ｜ Rajesh Khanna, Tanuja ｜ RD.Burman ｜ Kishore Kumar Hits.opus"),
      parseFilename("purani-yaadein", "Itna To Yaad Hai Mujhe with lyrics ｜ इतना तो याद है मुझे ｜ Mohd Rafi ｜ Lata ｜ Mehboob Ki Mehndi.opus"),
      parseFilename("purani-yaadein", "Ab Aan Milo Sajna with lyrics｜अब आन मिलो सजना गाने के बोल ｜Aan Milo Sajna｜ Rajesh Khanna⧸Asha Parekh.opus"),
      parseFilename("purani-yaadein", "Mere Dil Ne Tadap Ke with lyrics ｜ मेरे दिल ने तड़प के ｜ Kishore Kumar ｜ Anurodh.opus"),
      parseFilename("purani-yaadein", "Jis Gali Mein Tera Ghar Lyrical ｜ जिस गली में तेरा घर ｜ Mukesh ｜ R.D Burman ｜ Kati Patang ｜ Rajesh K.opus"),
      parseFilename("purani-yaadein", "Kuch To Log Kahenge with lyrics ｜ कुछ तो लोग कहेंगे गाने के बोल ｜ Amar Prem ｜ Rajesh Khanna⧸Sharmila.opus"),
      parseFilename("purani-yaadein", "Zindagi Kaisi Hai Paheli ｜ Manna Dey ｜ Anand ｜ Rajesh Khanna ｜ Classic Hindi Song.opus"),
      parseFilename("purani-yaadein", "Yeh Jo Mohabbat Hai with lyrics｜यह जो मोहब्बत है गाने के बोल｜Kati Patang｜ Rajesh Khanna, Asha Parekh.opus"),
      parseFilename("purani-yaadein", "Zindagi Ke Safar Mein Lyrical ｜ ज़िन्दगी के सफर में ｜ Aapki Kasam ｜ Kishore Kumar ｜ Rajesh Khanna.opus"),
      parseFilename("purani-yaadein", "Kheeza Ke Phool Pe Aati Kabhie ｜ मेरे नसीब में तेरा प्यार नहीं ｜ Rajesh Khanna ｜ Mumtaz Songs.opus"),
      parseFilename("purani-yaadein", "Anand ｜ Famous Dialogues & Song ｜ Amitabh Bachchan ｜ Rajesh Khanna ｜ Kahin Door Jab Din Dhal Jaye.opus"),
      parseFilename("purani-yaadein", "Mere Dil Mein Aaj Kya Hai ｜ Kishore Kumar ｜ Rajesh Khanna ｜ Daag ｜ Lyrical Video ｜ Old Hindi Song.opus"),
      parseFilename("purani-yaadein", "Yeh Jo Chilman Hai - Mohammed Rafi - Rajesh Khanna - Mehboob Ki Mehndi [1971].opus"),
      parseFilename("purani-yaadein", "KIshore Kumar Hits： Humein Tumse Pyar Kitana Lyrical ｜ हमें तुमसे प्यार कितना ｜ Kudrat ｜ Old Is Gold.opus"),
      parseFilename("purani-yaadein", "Lyrical： Duniya Me Logon ｜ दुनिया में लोगों ｜ Apna Desh (1972) ｜ Asha & RD Burman ｜ Timeless Melody.opus"),
      parseFilename("purani-yaadein", "Jawani O Diwani with lyrics ｜ जवानी ओ दीवानी गाने के बोल ｜Aan Milo Sajna｜ Rajesh Khanna⧸Asha Parekh.opus"),
      parseFilename("purani-yaadein", "Public Hai Sab Janti Hai ｜ Rajesh Khanna ｜ Mumtaz ｜ Roti ｜ Kishore Kumar ｜ Hindi Song.opus"),
      parseFilename("purani-yaadein", "Chal Chal Chal Mere Saathi ｜ Lyrical ｜ Haathi Mere Saathi ｜ Kishore Kumar.opus"),
      parseFilename("purani-yaadein", "Roop Tera Mastana With Lyrics ｜'रूप तेरा मस्ताना' गाने के बोल  ｜ Aradhana ｜ Rajesh Khanna ｜ Sharmila.opus"),
      parseFilename("purani-yaadein", "Chup Gaye Sare Nazare ｜ चुप गये सारे नज़ारे ｜ Do Raaste (1969) ｜ Mohammad Rafi Hit Songs.opus"),
      parseFilename("purani-yaadein", "Bheegi Bheegi Raaton Mein ｜ Lyrical ｜ Rajesh Khanna ｜ Zeenat Aman ｜ Kishore Kumar ｜ Lata Mangeshkar.opus"),
      parseFilename("purani-yaadein", "Yu Hee Tum Mujhase Baat Karatee Ho ｜ Mohd Rafi Hit Songs ｜ Lata Mangeshkar ｜ Rajesh Khanna ｜ Mumtaz.opus"),
      parseFilename("purani-yaadein", "प्यार दीवाना होता है ｜ Pyar Diwana Hota Hai Lyrical ｜ Kishore Kumar ｜ Rajesh Khanna ｜ Kati Patang 70.opus"),
      parseFilename("purani-yaadein", "Ek Ajnabee Haseena Se Lyrical ｜ Kishore Kumar ｜ Ajnabee ｜ Rajesh Khanna ｜ Zeenat Aman Old Hindi Song.opus"),
      parseFilename("purani-yaadein", "Karvaten Badalte Rahe with Lyrics ｜ Aap Ki Kasam ｜ Kishore Kuamr ｜ Lata Mangeshkar ｜ Rajesh Khanna.opus"),
      parseFilename("purani-yaadein", "Acha toh hum chalte with lyrics ｜ अच्छा तोह हम चलते ｜ Aan Milo Sajna ｜ Rajesh Khanna, Asha Parekh.opus"),
      parseFilename("purani-yaadein", "Hum Dono Do Premi Lyrical ｜ हम दोनो दो प्रेमी ｜ Ajnabee ｜ Rajesh Khanna ｜ Zeenat Aman.opus"),
      parseFilename("purani-yaadein", "ये शाम मस्तानी ｜ Kati Patang ｜ Kishore Kumar ｜ Rajesh Khanna ｜ Asha Parekh Songs ｜ Asha Parekh.opus"),
      parseFilename("purani-yaadein", "Gulabi Aankhen Jo Teri Dekhi ｜ The Train (1970) ｜ Rajesh Khanna, Nanda ｜ Mohd Rafi ｜ Love Song.opus"),
      parseFilename("purani-yaadein", "Bindiya Chamke Gi with lyrics ｜ बिंदिया चमकेगी गाने के बोल ｜ Do Raaste ｜ Rajesh Khanna, Mumtaz.opus"),
      parseFilename("purani-yaadein", "Bollywood Lyrical  Jai Jai Shiv Shankar ｜ जय जय शिव शंकर ｜ R D Burman ｜ Timeless Romantic Songs.opus"),
      parseFilename("purani-yaadein", "Eli ｜ Mere Sapno Ki Rani Full Song ｜ Vadivelu ｜ New Tamil Movie Video Song.opus"),
      parseFilename("purani-yaadein", "Zindagi Ek Safar Hai Suhana ｜ Rajesh Khanna, Hema Malini ｜ Andaz (1971) ｜ Kishore Kumar Hit Songs.opus"),
      parseFilename("purani-yaadein", "शायद मेरी शादी का ｜ Shayad Meri Shaadi Ka ｜ Souten ｜ Rajesh Khanna ｜ Kishore Kumar ｜ #evergreensong.opus"),
      parseFilename("purani-yaadein", "गोरे रंग पे ना इतना गुमान कर ｜ Gore Rang Pe Na ｜ Roti ｜ Rajesh Khanna ｜Mumtaz ｜ Laxmikant & Pyarelal.opus"),
      parseFilename("purani-yaadein", "Aate Jate Khoobsurat Awara with lyrics｜ आते जाते खूबसूरत आवारा गाने के बोल ｜ Anurodh ｜ Rajesh⧸Dimple.opus"),
      parseFilename("purani-yaadein", "Dushman Na Kare Dost Ne Wo Kaam Kiya Hai Full (Audio) Song ｜ Aakhir Kyon ｜Lata Mangeshkar,Amit Kumar.opus"),
      parseFilename("purani-yaadein", "Zindagi Pyar Ka Geet Hai ｜ Lata M ｜ Rajesh Khanna ｜ Souten - HD.opus"),
      parseFilename("purani-yaadein", "Yeh Reshmi Zulfein Yeh Sharbati Aankhein ｜ Do Raaste (1969) ｜ Rajesh Khanna ｜ Mumtaz ｜ Mohd.Rafi.opus"),
      parseFilename("purani-yaadein", "Kora Kagaz Tha Yeh Man Mera  ｜  Aradhana  ｜  Kishore Kumar  ｜  Lata Mangeshkar Songs.opus"),
      parseFilename("purani-yaadein", "O Mere Dil Ke Chain ｜ Kishore Kumar ｜ Rajesh Khanna ｜ R.D Burman ｜ Old Hindi Song ｜ Old Is Gold.opus"),
      parseFilename("purani-yaadein", "Ek Main Aur Ek Tu - Dance Cover by Punit-Bosky ｜ Asha Bhosle ｜ Kishore Kumar ｜ Impulse Studio.opus"),
      parseFilename("purani-yaadein", "More Gora Arg Laile ｜ Lata Mangeshkar ｜ मोर गोरा अर्ग लेइले ｜ Old Bhojpuri film song.opus"),
      parseFilename("purani-yaadein", "Ae Phoolon Ki Rani with lyrics ｜ ऐ फूलों की रानी ｜ Mohammed Rafi ｜ Arzoo.opus"),
      parseFilename("purani-yaadein", "Goom Hai Kisike Pyaar Mein with lyrics ｜ गूम है किसीके के प्यार में गाने ｜ Rampur ka Lakshman.opus"),
      parseFilename("purani-yaadein", "Yeh Kahan Aa Gaye Hum Lyrical ｜ Lata Mangeshkar ｜ Amitabh Bachchan ｜ Jaya Bhaduri ｜ 70s 80s 90s Song.opus"),
      parseFilename("purani-yaadein", "Lag Ja Gale Se Phir ｜  Lata Mangeshkar Hits ｜ Woh Kaun Thi？ (1964).opus"),
      parseFilename("purani-yaadein", "Tumne Mujhe Dekha Hokar Meherban ｜ Mohammed Rafi ｜ Teesri Manzil ｜ Shammi Kapoor ｜ Romantic Song.opus"),
      parseFilename("purani-yaadein", "Ab To Hai Tumse Har Khushi Apni with lyrics｜ अब तो है तुमसे हर ख़ुशी अपनी ｜ Lata Mangeshkar ｜Abhimaan.opus"),
      parseFilename("purani-yaadein", "Khoya Khoya Chand Khula Aasman with lyrics ｜ खोया खोया चांद, खुला आसमान  ｜.opus"),
      parseFilename("purani-yaadein", "Wada Karle Sajna with lyrics ｜ वादा करले साजना गाने के बोल ｜ Haath Ki Safai.opus"),
      parseFilename("purani-yaadein", "Naina Barse Rimjhim Rimjhim (Lyrical Video) ｜ Lata Mangeshkar ｜ Woh Kaun Thi 1964 ｜ Manoj Kumar Hits.opus"),
      parseFilename("purani-yaadein", "Aapki Ankhon Mein Kuch ｜ Lata Mangeshkar ｜ Kishore Kumar ｜ Ghar ｜ Lyrical Video ｜ Old Hindi Song.opus"),
      parseFilename("purani-yaadein", "Chal Kahin Door Nikal ｜ Lata ｜ Kishore ｜ Mohd. Rafi ｜ Rishi Kapoor ｜ Lyrical Video ｜ Old Hindi Song.opus"),
      parseFilename("purani-yaadein", "Salona Sa Sajan Hai Aur Main Hoon.opus"),
      parseFilename("purani-yaadein", "Meri Bheegi Bheegi Si ｜ Hindi Bollywood song By kishore kumar.opus"),
      parseFilename("purani-yaadein", "Hamne tumko dekha with lyrics ｜ हमने तुमको देखा ｜Khel Khel Mein｜ Rishi Kapoor ｜ Nitu Singh.opus"),
      parseFilename("purani-yaadein", "Chand Mera Dil Chandni Ho Tum with lyrics｜ Hum Kisi Se Kum Nahin ｜ Mohd Rafi ｜ Rishi Kapoor ｜ Kajal.opus"),
      parseFilename("purani-yaadein", "Kabhi Kabhi Lyrical ｜ कभी कभी ｜ Mukesh ｜ Lata Mangeshkar ｜Amitabh Bachchan ｜ Rakhee ｜ Best Old Song.opus"),
      parseFilename("purani-yaadein", "Aaja Piya Tohe with lyrics ｜ आजा पिया तोहे गाने के बोल ｜Baharon ke Sapne｜ Asha Parekh, Rajesh Khanna.opus"),
      parseFilename("purani-yaadein", "Kitne Bhi Tu Karle Sitam (Male) (Lyric Video) ｜ Kishore Kumar ｜ Kamal H,Reena Roy ｜ Sanam Teri Kasam.opus"),
      parseFilename("purani-yaadein", "Jo Wada Kiya Woh Nibhana Padega ｜ Mohd Rafi Hit Songs ｜ Pradeep Kumar, Bina Rai ｜ Taj Mahal Songs.opus"),
      parseFilename("purani-yaadein", "Teri Aankhon Ke Sivaa I तेरी आँखों के सिवा ｜ Chirag (1969) ｜ Mohd. Rafi ｜ Sunil Dutt ｜ Asha Parekh.opus"),
      parseFilename("purani-yaadein", "Tum Agar Saath Dene ｜ Mahendra Kapoor ｜ Sunil Dutt ｜ Mumtaz ｜ Hindi 90s Romantic song.opus"),
      parseFilename("purani-yaadein", "Teri Bindiya Re (HD) -  Abhimaan Song - Amitabh Bachchan - Jaya Bhaduri.opus"),
      parseFilename("purani-yaadein", "Tera Mera Saath Rahe  ｜  Saudagar  ｜  Lata Mangeshkar Songs  ｜  Amitabh Bachchan  ｜  Nutan.opus"),
      parseFilename("purani-yaadein", "Phool Tumhen Bheja Hai Khat Mein (HD) ｜ Saraswatichandra ｜ Nutan ｜ Manish  ｜ Evergreen Old Songs.opus"),
      parseFilename("purani-yaadein", "Tu Tu Hai Wahi ｜ Yeh Vaada Raha｜ Kishore Kumar, Asha Bhosle ｜ Rishi Kapoor, Tina Munim Romantic Hits.opus"),
      parseFilename("purani-yaadein", "Abhi Na Jao Chhod Kar.opus"),
      parseFilename("purani-yaadein", "Khwaab Ho Tum Ya Koi ｜ Teen Deviyan ｜ Dev Anand ｜ Romantic Old Hindi Songs ｜ Kishore Kumar.opus"),
      parseFilename("purani-yaadein", "Kya Yahi Pyar Hai (Lyrical Video) - Lata Mangeshkar, Kishore Kumar ｜ Revibe ｜ Hindi Songs.opus"),
      parseFilename("purani-yaadein", "Dil Kya Kare Jab Kisi Ko (Hindi Lyric Video) Julie ｜ Kishore Kumar ｜ Vikram Makandar ｜ Lakshmi.opus"),
      parseFilename("purani-yaadein", "Kaun Hai Jo Sapnon Mein Aaya ｜ Rajendra Kumar ｜ Saira Banu ｜ Jhuk Gaya Aasman Songs {HD}｜ Mohd. Rafi.opus"),
      parseFilename("purani-yaadein", "Roj Roj Aankhon Tale - Mandakini ｜ Sanjay Dutt ｜ Asha Bhosle ｜ R.D. Burman.opus"),
      parseFilename("purani-yaadein", "Ek Pyar Ka Naghma Hai - Lyrical Video ｜ Shor ｜ Lata Mangeshkar ｜ Manoj Kumar ｜ Jaya Bhaduri.opus"),
      parseFilename("purani-yaadein", "Kya Khoob Lagti Ho Lyrical ｜ क्या खूब लगती हो ｜ Mukesh ｜ Kanchan ｜ Dharmatma ｜ Hema Malini ｜ Feroz.opus"),
      parseFilename("purani-yaadein", "Ankhiyon Ke Jharokhon Se with lyrics ｜ अखियों के झरोखों से ｜ Hemlata ｜ Ankhiyon Ke Jharokhon Se.opus"),
      parseFilename("purani-yaadein", "Neele Neele Ambar Par - Male Version Lyric Video - Kalaakaar ｜ Sridevi ｜ Kishore Kumar.opus"),
      parseFilename("purani-yaadein", "O Saathi Re ｜ Amitabh Bachchan ｜ Muqaddar ka Sikandar ｜ Lyrical Video ｜ Old Hindi Song.opus"),
      parseFilename("purani-yaadein", "Yeh Ratein Yeh Mausam ｜ Dilli Ka Thug (1958) ｜ Nutan ｜ Asha Bhosle ｜ Kishore Kumar Hit Songs.opus"),
      parseFilename("purani-yaadein", "Tu Is Tarah Se Meri Zindagi Main - Lyrical ｜  Mohammed Rafi ｜ Aap To Aise Na The ｜ Raj Babbar.opus"),
      parseFilename("purani-yaadein", "Gori Tera Gaon Bada Pyara ｜ K J Yesudas ｜ Chitchor ｜ Lyrical Video ｜ Old Hindi Song.opus"),
      parseFilename("purani-yaadein", "'Mere Pyaar Ki Umar Ho Itni Sanam' Full Video ｜ Waaris ｜ Lata Mangeshkar ｜ Amrita Singh, Raj Babbar.opus"),
    ],
  },
  "garma-garam": {
    name: "Garma Garam",
    songs: [
      { listType: "playlist", list: "PLFgquLnL59alCl_2S6vbfIb9bT5-4L0Nb", playlistIndex: 0, title: "Bollywood Hot Hits (Auto-Updating)", artist: "YouTube Music India" },
      { listType: "playlist", list: "PLFgquLnL59akA2PflFpeQG9L01VFg90wS", playlistIndex: 0, title: "T-Series Top 10 Hindi Songs", artist: "T-Series" },
      { listType: "playlist", list: "PL9N3AE0Z5mk6M61i8S8Q-6TjIeYrH7Q9P", playlistIndex: 0, title: "New Hindi Songs 2026", artist: "Latest Hits" },
      { listType: "playlist", list: "PLcKXqLRBd7T0j0P7kS0S6hRqPwJ6fU8tQ", playlistIndex: 0, title: "Zee Music Top Charts (Auto-Updating)", artist: "Zee Music Co." },
      { listType: "playlist", list: "PLWz5rJ2EKKc_XOgcRukSoKKjewFJZrBVb", playlistIndex: 0, title: "Desi Hits Weekly", artist: "YouTube Trending" },
      { listType: "playlist", list: "PLFgquLnL59alcytaJqA0X1Qf05Y-4Q7Z7", playlistIndex: 1, title: "Bollywood Top 100 (Fresh)", artist: "T-Series" },
      { listType: "playlist", list: "PLJB2NQn5zQ5J0wT63fV8LpQm60N3h0V1W", playlistIndex: 2, title: "Hindi Viral Chartbusters", artist: "Desi Trending" },
      { listType: "playlist", list: "PLFgquLnL59anI-jy9oJUdYgT0H3bQfKq_", playlistIndex: 3, title: "Love Songs Latest", artist: "Best of Bollywood" },
      { listType: "playlist", list: "PLorRp83G9qEa8f6K7z5YvXzS8sP5H1R7U", playlistIndex: 0, title: "2025 Ka Superhit Gaana", artist: "Hindi Top 40" },
      { listType: "playlist", list: "PLFgquLnL59amk8x83h9KQJ0Rr9jM0hN7w", playlistIndex: 4, title: "Party Hits (Updated Weekly)", artist: "Non-Stop DJ Mix" },

      { id: "FfV8y-955h4", title: "Pehle Bhi Main (Animal)", artist: "Vishal Mishra" },
      { id: "kD1J0v5r5NQ", title: "Arjan Vailly", artist: "Manan Bhardwaj" },
      { id: "7Df4G_9SjF0", title: "Satranga (Animal)", artist: "Arijit Singh" },
      { id: "9lKjQw7Zvxs", title: "Sari Duniya Jala Denge", artist: "B Praak" },
      { id: "hY7m5jjJ9mM", title: "Tum Hi Ho Bandhu", artist: "Neeraj Shridhar, Kavita Seth" },
      { id: "0Vw6z4tLqXE", title: "Lutt Putt Gaya (Dunki)", artist: "Arijit Singh" },
      { id: "v3c8BzJjVts", title: "Ram Siya Ram", artist: "Sachet Tandon" },
      { id: "5qap5aO4i9A", title: "Chaleya (Jawan)", artist: "Arijit Singh, Shilpa Rao" },
      { id: "XfSzSdfa5wo", title: "Jhoome Jo Pathaan", artist: "Arijit Singh, Sukriti Kakar" },
      { id: "tVj0ZTS4WF4", title: "Zinda Banda (Jawan)", artist: "Anirudh" },
      { id: "Q7LiGjF1BkA", title: "Tere Hawaale (Laal Singh Chaddha)", artist: "Arijit Singh, Shilpa Rao" },
      { id: "B4KqT9fU9t8", title: "Main Nikla Gaddi Leke (Gadar 2)", artist: "Udit Narayan" },
      { id: "sJ9JjE-9Z3k", title: "What Jhumka?", artist: "Arijit Singh, Jonita Gandhi" },
      { id: "p_rl4lA9yn8", title: "Tere Vaaste (Zara Hatke Zara Bachke)", artist: "Varun Jain, Sachin-Jigar" },
      { id: "VjV42dA_21Q", title: "Phir Aur Kya Chahiye", artist: "Arijit Singh, Sachin-Jigar" },
      { id: "r1qKfA3b3Z8", title: "Oonchi Oonchi Deewarein", artist: "Manan Bhardwaj, Arijit Singh" },
      { id: "GIPw5c7vUqM", title: "Obsessed", artist: "Riar Saab, Abhijay Sharma" },
      { id: "8NcnF0qNpVo", title: "Naacho Naacho (RRR)", artist: "Vishal Mishra, Rahul Sipligunj" },
      { id: "3eJdRQH_dTc", title: "Dhindora Baaje Re", artist: "Amit Trivedi" },
      { id: "S9GLB2D7Gz0", title: "Dil Jhoom (Gadar 2)", artist: "Arijit Singh, Mithoon" },
      { id: "bWllFr4hTxE", title: "Kahani Suno 2.0", artist: "Kaifi Khalil" },
      { id: "BxtwUh51PzM", title: "Kya Loge Tum?", artist: "BPraak, Jaani" },
      { id: "2HPHhLc9l1U", title: "Malang Sajna", artist: "Sachet Tandon, Parampara Tandon" },
      { id: "5cdoXs48t7k", title: "Maan Meri Jaan", artist: "King, Champagne Talk" },
      { id: "fXa2E5mN6K8", title: "Humsafar", artist: "Akhil Sachdeva, Mansheel Gujral" },
      { id: "CZy0Fg7lQOg", title: "Pal (Jalebi)", artist: "Arijit Singh, Shreya Ghoshal" },
      { id: "1M8743G093A", title: "Laal Singh Chaddha - Kahani", artist: "Mohit Chauhan, Pritam" },
      { id: "xGqA3UeO47s", title: "Gali Gali (KGF Chapter 1)", artist: "Neha Kakkar" },
      { id: "Xh0V4oV1fOo", title: "Mehbooba (KGF Chapter 2)", artist: "Ananya Bhat" },
      { id: "zC2g4S5U6V8", title: "Tum Hi Aana", artist: "Jubin Nautiyal, Payal Dev" },
    ],
  },
  "railway-platform": {
    name: "Railway Platform",
    hidden: true,
    songs: [
      { id: "U9VxYg3z3W0", title: "Humsafar (Badrinath Ki Dulhania)", artist: "Akhil Sachdeva" },
      { id: "Lz6R1Jt1ZvQ", title: "Channa Mereya", artist: "Arijit Singh, Pritam" },
      { id: "n78A2VYb89U", title: "Tere Hi Humnasheen Hain", artist: "Arijit Singh" },
      { id: "HwR_qA2s-4c", title: "Hawayein", artist: "Arijit Singh, Pritam" },
      { id: "A2392rI76rM", title: "Tujhe Kitna Chahein Aur (Film Version)", artist: "Jubin Nautiyal" },
      { id: "b7eL7FZ25_4", title: "Phir Kabhi (M.S. Dhoni)", artist: "Arijit Singh" },
      { id: "z5cU8sG9D50", title: "O Saathi", artist: "Atif Aslam, Arko Pravo" },
      { id: "o4J2A_vC9Qo", title: "Sun Zara (Lucky: No Time for Love)", artist: "Sonu Nigam" },
      { id: "r8B2jFk3G58", title: "Jiyein Kyun (Piku)", artist: "Papon, Anupam Roy" },
      { id: "w9G3hT6kL6Q", title: "Tu Jaane Na", artist: "Atif Aslam, Pritam" },
      { id: "L5l4jV5nN5w", title: "Musafir Hoon Yaaron", artist: "Kishore Kumar, R. D. Burman" },
      { id: "K8c8R3v0F3A", title: "Chala Jaata Hoon (Mere Jeevan Saathi)", artist: "Kishore Kumar, R. D. Burman" },
      { id: "V2k5P8sM7Qx", title: "Musafir Jaane Wale (Gadar)", artist: "Udit Narayan, Preeti Uttam" },
      { id: "T9g2H7eK1a0", title: "Mere Rashke Qamar (Baadshaho)", artist: "Nusrat & Rahat Fateh Ali Khan" },
      { id: "Q0n3T9uP3v4", title: "Kaise Hua (Kabir Singh)", artist: "Vishal Mishra" },
      { id: "j2c4T7rY6b0", title: "Tera Ban Jaunga (Kabir Singh)", artist: "Akhil Sachdeva, Tulsi Kumar" },
      { id: "h6F0p6mE5cN", title: "Roke Na Ruke Naina (Badrinath Ki Dulhania)", artist: "Arijit Singh, Amaal Mallik" },
      { id: "R3y7W9pS3x8", title: "Thodi Der (Half Girlfriend)", artist: "Shreya Ghoshal, Farhan Saeed" },
      { id: "d1L0v6Y5q44", title: "Mile Ho Tum (Reprise)", artist: "Neha Kakkar, Tony Kakkar" },
      { id: "s0M8j2C4b7A", title: "Ik Vaari Aa (Raabta)", artist: "Arijit Singh, Pritam" },
      { id: "g5A9z4tT2P3", title: "Raabta (Title Song)", artist: "Arijit Singh, Pritam" },
      { id: "J4r7R2wE5V9", title: "Kabira (Encore)", artist: "Arijit Singh, Harshdeep Kaur" },
      { id: "x3W9n4D6a9a", title: "Maahi (Raaz 2)", artist: "K.K., Sharib-Toshi" },
      { id: "U1a6b4cX8pQ", title: "Mehrama (Love Aaj Kal 2)", artist: "Darshan Raval, Antara Mitra" },
      { id: "q0p9O7i2B2g", title: "Iktara (Wake Up Sid)", artist: "Kavita Seth, Amit Trivedi" },
      { id: "b8B5u1P8f2o", title: "Agar Tum Saath Ho (Tamasha)", artist: "Alka Yagnik, Arijit Singh" },
      { id: "g0O8h9K6l4B", title: "Kun Faya Kun (Rockstar)", artist: "A.R. Rahman, Mohit Chauhan, Javed Ali" },
      { id: "s7y3I8n1O7m", title: "Piya Milenge (Raanjhanaa)", artist: "Sukhwinder Singh, A.R. Rahman" },
      { id: "D8L5x7v3V1n", title: "Tere Bina (Guru)", artist: "A.R. Rahman, Chinmayi" },
      { id: "y5z9f0h1L8X", title: "Sadda Haq (Rockstar)", artist: "Mohit Chauhan, A.R. Rahman" },
    ],
  },
  "sangeet-nach": {
    name: "Sangeet Nacho",
    hidden: true,
    songs: [
      { id: "z8M4a2x6C0w", title: "Lungi Dance (Chennai Express)", artist: "Yo Yo Honey Singh" },
      { id: "k8T9v3T7h6Q", title: "London Thumakda", artist: "Neha Kakkar, Labh Janjua, Sonu Kakkar" },
      { id: "R5r3N7p8S9t", title: "Galliyan Returns (Ek Villain Returns)", artist: "Ankit Tiwari" },
      { id: "B3d1K9g4G6k", title: "Saat Samundar (Vishwatama)", artist: "Sadhana Sargam, Kalyanji-Anandji" },
      { id: "F2g5X9h8H7k", title: "Saki Saki (Batla House)", artist: "Neha Kakkar, Tulsi Kumar, B Praak" },
      { id: "u6l7v3G1R5P", title: "Ghungroo Toot Gaye", artist: "Sunidhi Chauhan" },
      { id: "n9M2C8e0F8y", title: "Dil Chori (Yo Yo Honey Singh)", artist: "Yo Yo Honey Singh" },
      { id: "h3j2K9a8B0p", title: "Chhote Chhote Peg (Sonu Ke Titu Ki Sweety)", artist: "Yo Yo Honey Singh" },
      { id: "v7G6a9C4d3K", title: "Aankh Marey (Simmba)", artist: "Neha Kakkar, Mika, Kumar Sanu" },
      { id: "t2w8X3p9L6T", title: "Yaad Piya Ki Aane Lagi", artist: "Neha Kakkar, Divya Khosla Kumar" },
      { id: "w8z5J8v1U6n", title: "First Class (Kalank)", artist: "Arijit Singh, Neeti Mohan, Pritam" },
      { id: "o7u1T2r5X9Y", title: "Badri Ki Dulhania", artist: "Dev Negi, Neha Kakkar, Monali Thakur, Ikka" },
      { id: "p6l9X1s5A3h", title: "Cheez Badi (Machine)", artist: "Udit Narayan, Neha Kakkar, Mehul Vyas" },
      { id: "G2f7c1K4n2Q", title: "Mungada (Total Dhamaal)", artist: "Jyotica Tangri, Shaan" },
      { id: "v3M5L9k1B2e", title: "Tamma Tamma Again (Badrinath Ki Dulhania)", artist: "Bappi Lahiri, Anuradha Paudwal, Tanishk Bagchi" },
      { id: "y2w4H3a8S9z", title: "Rang Barse (Silsila)", artist: "Amitabh Bachchan, Shiv-Hari" },
      { id: "r6L1g7T5d4Q", title: "Balma (Khiladi 786)", artist: "Sreerama Chandra, Shalmali Kholgade" },
      { id: "T8s5h9n2J1w", title: "Pyar Ki Pungi (Agent Vinod)", artist: "Mika Singh, Amit Trivedi" },
      { id: "s5N1e7A8l2h", title: "Pinky (Zanjeer)", artist: "Mamta Sharma, Meet Bros" },
      { id: "o8a6K3t1G0k", title: "Dance Basanti (Ungli)", artist: "Vishal Dadlani, Anushka Manchanda, Sachin-Jigar" },
      { id: "Z2a9J6n8l5V", title: "Dhinka Chika (Ready)", artist: "Mika Singh, Amrita Kak, Devi Sri Prasad" },
      { id: "d2n8V7q2Z5j", title: "Chinta Ta Ta Ta Ta Chita Chita (Rowdy Rathore)", artist: "Mika Singh, Sajid-Wajid" },
      { id: "x7r9f5h4D3b", title: "Apna Har Din (Golmaal 3)", artist: "Shreya Ghoshal, Anushka Manchanda" },
      { id: "e2t3F7w0s2N", title: "Ole Ole 2.0 (Jawaani Jaaneman)", artist: "Amit Mishra, Tanishk Bagchi" },
      { id: "k2w1g9k2M8x", title: "Halkat Jawani (Heroine)", artist: "Sunidhi Chauhan, Salim-Sulaiman" },
      { id: "Q2n7k9q4r6X", title: "Fevicol Se (Dabangg 2)", artist: "Mamta Sharma, Wajid, Sajid-Wajid" },
      { id: "A6g9y1d8s3R", title: "Munni Badnaam Hui (Dabangg)", artist: "Mamta Sharma, Sajid-Wajid" },
      { id: "V8j3z7p9w5R", title: "Sheila Ki Jawani (Tees Maar Khan)", artist: "Sunidhi Chauhan, Vishal-Shekhar" },
      { id: "p4M6j8r7k0L", title: "Kajra Re (Bunty Aur Babli)", artist: "Shankar-Ehsaan-Loy, Alisha Chinoy" },
      { id: "s6T4r2x1p9J", title: "Tenu Leke (Salaam-e-Ishq)", artist: "Sonu Nigam, Mahalaxmi Iyer, Shankar-Ehsaan-Loy" },
    ],
  },
};
