/**
 * Extremely comprehensive profanity filter utility
 * replaces profane words with asterisks
 */

const PROFANE_WORDS = [
    // --- English ---
    // Common & Core
    'badword', 'profanity', 'shit', 'fuck', 'bitch', 'ass', 'asshole', 'bastard',
    'crap', 'piss', 'dick', 'cock', 'pussy', 'cunt', 'nigger', 'faggot', 'sex', 'whore', 'slut',
    'sh!t', 'f*ck', 'bullshit', 'horseshit', 'dammit', 'goddamn', 'goddamnit', 'fucking', 'fucked',
    'fucker', 'bitches', 'assholes', 'nigga', 'niggaz', 'motherfucker', 'sonofabitch',

    // Anatomy / Sexual / Vulgar
    'anal', 'anus', 'arse', 'balls', 'ballsack', 'boner', 'boob', 'boobs', 'buttplug', 'clitoris',
    'clit', 'cum', 'dildo', 'ejaculate', 'erection', 'fellate', 'fellatio', 'foreskin',
    'horny', 'jizz', 'labia', 'masturbate', 'masturbation', 'nude', 'nudity', 'orgasm', 'penis',
    'porn', 'pornography', 'pubes', 'rotflmfao', 'scrotum', 'semen', 'smegma', 'testicles',
    'tit', 'tits', 'titties', 'vagina', 'vulva', 'wank', 'wanker', 'xxx', 'blowjob', 'handjob',
    'rimjob', 'toss', 'tosser', 'bugger', 'bollocks', 'beaver', 'muff', 'wang', 'dong', 'schlong',
    'knob', 'bellend', 'flange', 'fanny', 'prick', 'twat', 'snatch', 'queef', 'feltch', 'bukkake',
    'gangbang', 'creampie', 'deepthroat', 'paizuri', 'hentai', 'futanari', 'yaoi', 'yuri',
    'sodomy', 'sodomize', 'rapist', 'rape', 'pedophile', 'pedo', 'bestiality', 'zoophilia',
    'necrophilia', 'scat', 'golden shower', 'watersports', 'fisting', 'bondage', 'bdsm',

    // Slurs / Insults / Hate Speech / Offensive Types
    'chink', 'coon', 'dyke', 'fag', 'gook', 'heeb', 'kike', 'kyke', 'mick', 'negro', 'paki',
    'retard', 'spic', 'spick', 'tranny', 'wop', 'yid', 'douche', 'douchebag', 'imbecile', 'moron',
    'idiot', 'stupid', 'dumb', 'dumbass', 'dipshit', 'shithead', 'shitface', 'fuckface',
    'cocksucekr', 'cocksucker', 'bitchass', 'pussyass', 'jackass', 'fatass', 'lardass', 'skank',
    'hoe', 'slag', 'bimbo', 'bimbos', 'incel', 'simp', 'cuck', 'soyboy', 'snowflake', 'libtard',
    'neckbeard', 'weenie', 'wuss', 'pussycat', 'scumbag', 'scum', 'loser', 'degenerate',
    'mongoloid', 'gimp', 'cripple', 'spastic', 'homo', 'lesbo', 'trannie', 'shemale', 'shim',
    'sissy', 'pansy', 'queer', 'carpet muncher', 'fudge packer', 'pillow biter',

    // Compound / Creative (English)
    'asshat', 'assclown', 'asswipe', 'asskisser', 'bollock', 'bugger', 'butt', 'butthead', 'buttface',
    'clithead', 'cockbite', 'cockface', 'cockhead', 'cocksucker', 'cumguzzler', 'cumdumpster',
    'cuntface', 'dickhead', 'dickface', 'dickwad', 'dickweed', 'dillhole', 'fartknocker', 'fuckwad',
    'fuckwit', 'jerkoff', 'knobhead', 'meathead', 'nutjob', 'nutsack', 'pecker', 'peckerhead',
    'pisshead', 'shitbird', 'shitbreath', 'shitforbrains', 'shitstain', 'thundercunt', 'twatwaffle',

    // --- Tagalog ---
    // Core & Common
    'putangina', 'tangina', 'puta', 'pota', 'gago', 'tanga', 'bobo', 'inutil', 'tarantado',
    'ulol', 'leche', 'peste', 'bwisit', 'hindot', 'punyeta', 'kupal', 'salsal', 'jakol', 'burat',
    'etits', 'pokpok', 'malibog', 'iyot', 'supot', 'kantot', 'pekpek', 'tite', 'tembong', 'betlog',
    'bayag', 'bilat', 'kike', 'uki', 'monay', 'puke', 'puki',

    // Combinations / Variations / Slang
    'tanginamo', 'putanginam', 'putangina mo', 'gaga', 'shunga', 'engot', 'abno', 'siraulo',
    'buang', 'baliw', 'hayop', 'hayup', 'animal', 'demonyo', 'hudas', 'lintik', 'walanghiya',
    'hinayupak', 'hunghang', 'ungas', 'ugok', 'bruha', 'bruho', 'epal', 'plastik', 'higad',
    'haliparot', 'landi', 'malandi', 'prosti', 'walker', 'manyak', 'manyakis', 'bastos',
    'libog', 'kantutan', 'torjak', 'karat', 'kadyot', 'himas', 'chupa', 'dila', 'nganga',
    'utong', 'suso', 'dede', 'pwet', 'eng-eng', 'timang', 'loka-loka', 'luka-luka', 'tamod',
    'semilya', 'buraot', 'damuho', 'garapal', 'hudas', 'barumbado', 'suwail', 'tampalasan',
    'bwiset', 'syet', 'bida-bida', 'pabibo', 'epal', 'kupal', 'tanga-tanga', 'bobo-bobo',
    'putragis', 'anak ng tokwa', 'anak ng tinapa', 'leche flan', // Sometimes used as mild swear
    'walang kwenta', 'basura', 'talo', 'lugi', 'uto-uto', 'nagmarunong',

    // --- Bisaya / Cebuano ---
    // Core & Common
    'kayat', 'yawa', 'pisteng', 'inatai', 'inahan', 'ota', 'giatay', 'piste', 'oten',
    'ibigat', 'uwagan', 'linti', 'burikat', 'inday', 'isoy',

    // Vulgar / Sexual / Anatomy
    'bototo', 'butoto', 'lusi', 'lusot', 'iyotan', 'jerjer', 'habal', 'habal-habal', 'tilap',
    'tilapan', 'supsup', 'supsupan', 'totoy', 'dako', 'gamay', 'bahog', 'baho', 'itlog',
    'itlogon', 'lagay', 'bugan', 'igit', 'tae', 'tai', 'kaon', 'tilaw', 'bilat', 'monay',
    'bolbol', 'bol-bol', 'tudlo', 'kumot', 'paak', 'paakan', 'tila', 'tilaban',

    // Insults / Descriptions
    'amaw', 'amang', 'bungol', 'buta', 'piang', 'bakol', 'laag', 'laagan', 'kiat', 'kiatan',
    'libak', 'libakera', 'tabian', 'babaon', 'hilas', 'hilason', 'tikling', 'tikalan', 'atik',
    'atikon', 'bakakon', 'ilad', 'ilaron', 'mangingilad', 'kawatan', 'tulisan', 'snatcher',
    'adik', 'drugista', 'bata-bata', 'itoy-itoy', 'sunod-sunod', 'sipsip', 'upsat', 'kolokoy',
    'way buot', 'walay buot', 'way kaikog', 'baga ug nawong', 'bagag nawong', 'hugaw', 'huggaw',
    'bulingit', 'bulingon', 'bahog ilok', 'bahog baba', 'buaya', 'traidor', 'traydor',
    'bogo', 'bugo', 'tonto', 'tunto', 'inutil', 'hungog', 'hanggaw', 'danghag', 'danghug',
    'lami', 'biga', 'bigaon', 'uwagan', 'utog', 'utogan',

    // Deep Bisaya / Expressions
    'pastilan', 'pagkapait', 'kalami', 'ahak', 'atay', 'inabnormal', 'pagkabogo',
    'bogoa', 'bogoka', 'bogo-bogo', 'tontoha', 'kilator', 'kolera', 'lintian', 'linte',
    'kigwa', 'kigwaha', 'udong', 'okoy', 'animala', 'yawawa', 'pistia', 'atay', 'atayi',
    'bilata', 'monaya', 'otena', 'pisting yawa', 'giatay ka', 'buang ka', 'amaw ka',
    'samok', 'gubot', 'hasol', 'langas', 'saba', 'sabaan'
];

export const filterProfanity = (text) => {
    if (!text) return text;

    let filteredText = text;

    // Create a regex that matches any of the profane words
    // \b ensures we match whole words only (e.g., "class" won't match "ass")
    // 'gi' makes it global and case-insensitive
    const regex = new RegExp(`\\b(${PROFANE_WORDS.join('|')})\\b`, 'gi');

    filteredText = filteredText.replace(regex, (match) => {
        return '*'.repeat(match.length);
    });

    return filteredText;
};
