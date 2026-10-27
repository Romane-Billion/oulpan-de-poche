// Contenu du parcours. Chaque mot : he (avec voyelles), p (orthographe sans voyelles si
// elle diffère du simple retrait des voyelles), tr (prononciation à la française), fr.

export const WORDS = {
  // Leçon 1 : les voyelles (syllabes sur la lettre מ, puis premiers mots)
  'v-ma': { he: 'מַ', tr: 'ma', fr: 'patah : a' },
  'v-ma2': { he: 'מָ', tr: 'ma', fr: 'kamats : a' },
  'v-me': { he: 'מֶ', tr: 'mé', fr: 'segol : é' },
  'v-me2': { he: 'מֵ', tr: 'mé', fr: 'tsere : é' },
  'v-mi': { he: 'מִ', tr: 'mi', fr: 'hirik : i' },
  'v-mo': { he: 'מוֹ', tr: 'mo', fr: 'holam : o' },
  'v-mou': { he: 'מוּ', tr: 'mou', fr: 'shuruk : ou' },
  'v-mou2': { he: 'מֻ', tr: 'mou', fr: 'kubuts : ou' },
  'v-me3': { he: 'מְ', tr: 'me (ou rien)', fr: 'shva : e muet' },
  'mah': { he: 'מָה', tr: 'ma', fr: 'quoi ?' },
  'mi': { he: 'מִי', tr: 'mi', fr: 'qui ?' },
  'lo': { he: 'לֹא', tr: 'lo', fr: 'non' },
  'ken': { he: 'כֵּן', tr: 'ken', fr: 'oui' },
  'ima': { he: 'אִמָּא', tr: 'ima', fr: 'maman' },
  'aba': { he: 'אַבָּא', tr: 'aba', fr: 'papa' },
  'shalom': { he: 'שָׁלוֹם', tr: 'shalom', fr: 'bonjour, salut, au revoir' },
  'toda': { he: 'תּוֹדָה', tr: 'toda', fr: 'merci' },
  'tov': { he: 'טוֹב', tr: 'tov', fr: 'bien, bon' },
  'yom': { he: 'יוֹם', tr: 'yom', fr: 'jour' },

  // Leçon 2 : lettres à deux sons, shin/sin, lettres finales
  'bayit': { he: 'בַּיִת', tr: 'bayit', fr: 'maison' },
  'ohevet': { he: 'אוֹהֶבֶת', tr: 'ohevet', fr: "j'aime, tu aimes (au féminin)" },
  'kelev': { he: 'כֶּלֶב', tr: 'kélev', fr: 'chien' },
  'shlomkha': { he: 'שְׁלוֹמְךָ', tr: 'shlomkha', fr: 'ta santé (à un homme)' },
  'po': { he: 'פֹּה', tr: 'po', fr: 'ici' },
  'yafe': { he: 'יָפֶה', tr: 'yafé', fr: 'beau, joli' },
  'sof': { he: 'סוֹף', tr: 'sof', fr: 'fin' },
  'sameakh': { he: 'שָׂמֵחַ', tr: 'saméakh', fr: 'content' },
  'melekh': { he: 'מֶלֶךְ', tr: 'mélekh', fr: 'roi' },
  'erets': { he: 'אֶרֶץ', tr: 'érets', fr: 'pays' },
  'etkhem': { he: 'אֶתְכֶם', tr: 'etkhem', fr: 'vous (complément)' },

  // Leçon 3 : lettres jumelles
  'l-bet': { he: 'ב', tr: 'b / v', fr: 'bet' },
  'l-kaf': { he: 'כ', tr: 'k / kh', fr: 'kaf' },
  'l-dalet': { he: 'ד', tr: 'd', fr: 'dalet' },
  'l-resh': { he: 'ר', tr: 'r', fr: 'resh' },
  'l-he': { he: 'ה', tr: 'h', fr: 'hé' },
  'l-het': { he: 'ח', tr: 'kh', fr: 'het' },
  'l-tav': { he: 'ת', tr: 't', fr: 'tav' },
  'l-vav': { he: 'ו', tr: 'v / o / ou', fr: 'vav' },
  'l-zayin': { he: 'ז', tr: 'z', fr: 'zayin' },
  'l-nunf': { he: 'ן', tr: 'n (fin de mot)', fr: 'noun final' },
  'l-samekh': { he: 'ס', tr: 's', fr: 'samekh' },
  'l-memf': { he: 'ם', tr: 'm (fin de mot)', fr: 'mem final' },

  // Leçon 4 : pronoms
  'ani': { he: 'אֲנִי', tr: 'ani', fr: 'je, moi' },
  'ata': { he: 'אַתָּה', tr: 'ata', fr: 'tu (à un homme)' },
  'at': { he: 'אַתְּ', tr: 'at', fr: 'tu (à une femme)' },
  'hu': { he: 'הוּא', tr: 'hou', fr: 'il, lui' },
  'hi': { he: 'הִיא', tr: 'hi', fr: 'elle' },
  'anakhnu': { he: 'אֲנַחְנוּ', tr: 'anakhnou', fr: 'nous' },
  'atem': { he: 'אַתֶּם', tr: 'atem', fr: 'vous (hommes ou mixte)' },
  'aten': { he: 'אַתֶּן', tr: 'aten', fr: 'vous (femmes)' },
  'hem': { he: 'הֵם', tr: 'hem', fr: 'ils' },
  'hen': { he: 'הֵן', tr: 'hen', fr: 'elles' },

  // Leçon 5 : saluer et prendre des nouvelles
  'boker-tov': { he: 'בֹּקֶר טוֹב', p: 'בוקר טוב', tr: 'boker tov', fr: 'bonjour (le matin)' },
  'erev-tov': { he: 'עֶרֶב טוֹב', tr: 'érev tov', fr: 'bonsoir' },
  'laila-tov': { he: 'לַיְלָה טוֹב', tr: 'laïla tov', fr: 'bonne nuit' },
  'ma-nishma': { he: 'מָה נִשְׁמָע?', tr: 'ma nishma ?', fr: 'quoi de neuf ? (familier)' },
  'ma-shlomkha': { he: 'מָה שְׁלוֹמְךָ?', tr: 'ma shlomkha ?', fr: 'comment vas-tu ? (à un homme)' },
  'ma-shlomekh': { he: 'מָה שְׁלוֹמֵךְ?', tr: 'ma shlomekh ?', fr: 'comment vas-tu ? (à une femme)' },
  'ma-shlomkhem': { he: 'מָה שְׁלוֹמְכֶם?', tr: 'ma shlomkhem ?', fr: 'comment allez-vous ? (à plusieurs)' },
  'beseder': { he: 'בְּסֵדֶר', tr: 'besséder', fr: "ça va, d'accord" },
  'metsuyan': { he: 'מְצֻיָּן', p: 'מצוין', tr: 'metsouyan', fr: 'excellent' },
  'bevakasha': { he: 'בְּבַקָּשָׁה', tr: 'bevakasha', fr: "s'il te plaît, de rien" },
  'lehitraot': { he: 'לְהִתְרָאוֹת', tr: 'lehitraot', fr: 'au revoir, à plus tard' },
  've-ata': { he: 'וְאַתָּה?', tr: 've-ata ?', fr: 'et toi ? (à un homme)' },
  've-at': { he: 'וְאַתְּ?', tr: 've-at ?', fr: 'et toi ? (à une femme)' },
  'yofi': { he: 'יוֹפִי', tr: 'yofi', fr: 'super !' },

  // Leçon 6 : la famille
  'horim': { he: 'הוֹרִים', tr: 'horim', fr: 'parents' },
  'akh': { he: 'אָח', tr: 'akh', fr: 'frère' },
  'akhot': { he: 'אָחוֹת', tr: 'akhot', fr: 'sœur' },
  'saba': { he: 'סַבָּא', tr: 'saba', fr: 'grand-père' },
  'savta': { he: 'סַבְתָּא', tr: 'savta', fr: 'grand-mère' },
  'mishpakha': { he: 'מִשְׁפָּחָה', tr: 'mishpakha', fr: 'famille' },
  'ben': { he: 'בֵּן', tr: 'ben', fr: 'fils' },
  'bat': { he: 'בַּת', tr: 'bat', fr: 'fille' },
  'dod': { he: 'דּוֹד', tr: 'dod', fr: 'oncle' },
  'doda': { he: 'דּוֹדָה', tr: 'doda', fr: 'tante' },
  'habayta': { he: 'הַבַּיְתָה', tr: 'habayta', fr: 'à la maison (en y allant)' },
  'sheli': { he: 'שֶׁלִּי', tr: 'shéli', fr: 'à moi, mon, ma' },
  'ze': { he: 'זֶה', tr: 'zé', fr: "c'est, ce (masculin)" },
  'zot': { he: 'זֹאת', tr: 'zot', fr: "c'est, cette (féminin)" },

  // Leçon 7 : comment je me sens
  'ayefa': { he: 'עֲיֵפָה', p: 'עייפה', tr: 'ayéfa', fr: 'fatiguée' },
  'ayef': { he: 'עָיֵף', p: 'עייף', tr: 'ayef', fr: 'fatigué' },
  'smekha': { he: 'שְׂמֵחָה', tr: 'smékha', fr: 'contente' },
  're-eva': { he: 'רְעֵבָה', tr: "ré'éva", fr: 'affamée, j\'ai faim' },
  're-ev': { he: 'רָעֵב', tr: "ra'év", fr: 'affamé, il a faim' },
  'khola': { he: 'חוֹלָה', tr: 'khola', fr: 'malade (femme)' },
  'khole': { he: 'חוֹלֶה', tr: 'kholé', fr: 'malade (homme)' },
  'asuka': { he: 'עֲסוּקָה', tr: 'assouka', fr: 'occupée' },
  'asuk': { he: 'עָסוּק', tr: 'assouk', fr: 'occupé' },
  'lekhutsa': { he: 'לְחוּצָה', tr: 'lekhoutsa', fr: 'stressée' },
  'ktsat': { he: 'קְצָת', tr: 'ktsat', fr: 'un peu' },
  'meod': { he: 'מְאוֹד', tr: "me'od", fr: 'très' },
};

export const STAGES = [
  {
    id: 'e1',
    title: 'Étape 1 · Bien lire et saluer',
    goal: '« Salut papa, ça va ? Moi ça va, je suis fatiguée. »',
    lessons: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'],
  },
];

export const LESSONS = {
  l1: {
    title: 'Les voyelles (nikoud)',
    summary: 'À quoi correspond chaque petit point.',
    kind: 'lecture',
    fiche: [
      { t: 'p', text: "En hébreu, les voyelles sont de petits signes sous, dans ou au-dessus des lettres. On les appelle le nikoud. Voici chaque signe, posé sur la lettre מ (m)." },
      { t: 'table', head: ['Signe', 'Nom', 'Son'], rows: [
        ['מַ  מָ', 'patah, kamats', 'a'],
        ['מֶ  מֵ', 'segol, tsere', 'é'],
        ['מִ  מִי', 'hirik', 'i'],
        ['מוֹ  מֹ', 'holam', 'o'],
        ['מוּ  מֻ', 'shuruk, kubuts', 'ou'],
        ['מְ', 'shva', 'e muet, ou rien'],
        ['אֲ  אֱ  אֳ', 'hataf (voyelles brèves)', 'a, é, o'],
      ] },
      { t: 'tip', text: "À retenir : les signes en dessous font a, é, i. Le point en haut à gauche fait o. Le point dans le ו fait ou. Deux signes différents peuvent faire le même son : c'est normal en hébreu moderne." },
      { t: 'tip', text: "Le shva (deux points verticaux) se prononce « e » en début de mot (בְּסֵדֶר = besséder), et ne se prononce pas ailleurs." },
    ],
    examples: ['mah', 'mi', 'lo', 'ken', 'ima', 'aba', 'shalom', 'toda', 'tov', 'yom'],
    reading: [
      { he: 'מָה? מִי? לֹא! כֵּן!', tr: 'ma ? mi ? lo ! ken !', fr: 'Quoi ? Qui ? Non ! Oui !' },
      { he: 'שָׁלוֹם אִמָּא, שָׁלוֹם אַבָּא!', tr: 'shalom ima, shalom aba !', fr: 'Bonjour maman, bonjour papa !' },
      { he: 'יוֹם טוֹב! תּוֹדָה!', tr: 'yom tov ! toda !', fr: 'Bonne journée ! Merci !' },
    ],
    items: ['v-ma', 'v-me', 'v-me2', 'v-mi', 'v-mo', 'v-mou', 'v-mou2', 'v-me3', 'mah', 'mi', 'lo', 'ken', 'ima', 'aba', 'shalom', 'toda', 'tov', 'yom'],
  },

  l2: {
    title: 'Les lettres à deux sons',
    summary: 'b/v, k/kh, p/f, sh/s et les lettres finales.',
    kind: 'lecture',
    fiche: [
      { t: 'p', text: "Trois lettres changent de son selon qu'elles ont un point dedans (le dagesh) ou pas." },
      { t: 'table', head: ['Avec point', 'Sans point', 'Exemples'], rows: [
        ['בּ = b', 'ב = v', 'בַּיִת (bayit) · אוֹהֶבֶת (ohevet)'],
        ['כּ = k', 'כ = kh', 'כֶּלֶב (kélev) · שְׁלוֹמְךָ (shlomkha)'],
        ['פּ = p', 'פ = f', 'פֹּה (po) · יָפֶה (yafé)'],
      ] },
      { t: 'p', text: "La lettre ש a aussi deux sons, selon la place de son point :" },
      { t: 'table', head: ['Lettre', 'Son', 'Exemple'], rows: [
        ['שׁ (point à droite)', 'sh', 'שָׁלוֹם (shalom)'],
        ['שׂ (point à gauche)', 's', 'שָׂמֵחַ (saméakh)'],
      ] },
      { t: 'p', text: "Cinq lettres changent de forme à la fin d'un mot :" },
      { t: 'table', head: ['Normale', 'Finale', 'Exemple'], rows: [
        ['כ', 'ך', 'מֶלֶךְ (mélekh)'],
        ['מ', 'ם', 'שָׁלוֹם (shalom)'],
        ['נ', 'ן', 'כֵּן (ken)'],
        ['פ', 'ף', 'סוֹף (sof)'],
        ['צ', 'ץ', 'אֶרֶץ (érets)'],
      ] },
      { t: 'tip', text: "Mêmes sons, lettres différentes : ח et כ font tous les deux « kh » ; ק et כּ font « k » ; ט et ת font « t » ; ס et שׂ font « s » ; א et ע sont presque muettes." },
    ],
    examples: ['bayit', 'ohevet', 'kelev', 'shlomkha', 'po', 'yafe', 'sof', 'sameakh', 'melekh', 'erets', 'etkhem'],
    reading: [
      { he: 'אֲנִי אוֹהֶבֶת אֶתְכֶם', tr: 'ani ohevet etkhem', fr: 'Je vous aime' },
      { he: 'מָה שְׁלוֹמְךָ, אַבָּא?', tr: 'ma shlomkha, aba ?', fr: 'Comment vas-tu, papa ?' },
      { he: 'הַבַּיִת יָפֶה', tr: 'habayit yafé', fr: 'La maison est belle' },
    ],
    items: ['bayit', 'ohevet', 'kelev', 'shlomkha', 'po', 'yafe', 'sof', 'sameakh', 'melekh', 'erets', 'etkhem'],
  },

  l3: {
    title: 'Les lettres jumelles',
    summary: 'Les lettres faciles à confondre.',
    kind: 'lettres',
    fiche: [
      { t: 'p', text: "Certaines lettres se ressemblent beaucoup. Le détail qui les distingue est toujours petit : regarde bien les coins et les jambes." },
      { t: 'table', head: ['Lettres', 'La différence'], rows: [
        ['ב  /  כ', 'ב (b, v) a un petit coin qui dépasse en bas à droite. כ (k, kh) est arrondi.'],
        ['ד  /  ר', 'ד (d) a un coin pointu en haut à droite. ר (r) est arrondi.'],
        ['ה  /  ח  /  ת', 'ה (h) a la jambe gauche détachée. ח (kh) l\'a collée. ת (t) a un petit pied à gauche.'],
        ['ו  /  ז  /  ן', 'ו (v, o, ou) est un simple trait. ז (z) a un petit chapeau. ן (n final) descend sous la ligne.'],
        ['ס  /  ם', 'ס (s) est rond. ם (m final) est carré.'],
      ] },
      { t: 'tip', text: "Astuce : agrandis le texte dans les Réglages si les lettres sont trop petites." },
    ],
    examples: ['l-bet', 'l-kaf', 'l-dalet', 'l-resh', 'l-he', 'l-het', 'l-tav', 'l-vav', 'l-zayin', 'l-nunf', 'l-samekh', 'l-memf'],
    reading: [
      { he: 'דּוֹד · רַק', tr: 'dod · rak', fr: 'oncle · seulement' },
      { he: 'הוּא · חוֹלֶה · תּוֹדָה', tr: 'hou · kholé · toda', fr: 'il · malade · merci' },
      { he: 'בַּיִת · כֵּן', tr: 'bayit · ken', fr: 'maison · oui' },
    ],
    items: ['l-bet', 'l-kaf', 'l-dalet', 'l-resh', 'l-he', 'l-het', 'l-tav', 'l-vav', 'l-zayin', 'l-nunf', 'l-samekh', 'l-memf'],
  },

  l4: {
    title: 'Les pronoms',
    summary: 'Je, tu, il, elle… et à qui je parle.',
    kind: 'vocab',
    fiche: [
      { t: 'p', text: "En hébreu, « tu » et « vous » changent selon qu'on parle à un homme, à une femme ou à plusieurs personnes." },
      { t: 'table', head: ['Hébreu', 'Prononciation', 'Français'], rows: [
        ['אֲנִי', 'ani', 'je, moi'],
        ['אַתָּה', 'ata', 'tu (à un homme)'],
        ['אַתְּ', 'at', 'tu (à une femme)'],
        ['הוּא', 'hou', 'il'],
        ['הִיא', 'hi', 'elle'],
        ['אֲנַחְנוּ', 'anakhnou', 'nous'],
        ['אַתֶּם', 'atem', 'vous (hommes ou mixte)'],
        ['אַתֶּן', 'aten', 'vous (femmes)'],
        ['הֵם', 'hem', 'ils'],
        ['הֵן', 'hen', 'elles'],
      ] },
      { t: 'tip', text: "Pour toi : à papa tu dis אַתָּה (ata), à maman אַתְּ (at), et aux deux ensemble אַתֶּם (atem)." },
    ],
    examples: ['ani', 'ata', 'at', 'hu', 'hi', 'anakhnu', 'atem', 'aten', 'hem', 'hen'],
    reading: [
      { he: 'אֲנִי וְאַבָּא', tr: 'ani ve-aba', fr: 'Moi et papa' },
      { he: 'אַתְּ אִמָּא, אַתָּה אַבָּא', tr: 'at ima, ata aba', fr: 'Toi (tu es) maman, toi (tu es) papa' },
      { he: 'אֲנַחְנוּ מִשְׁפָּחָה', tr: 'anakhnou mishpakha', fr: 'Nous sommes une famille' },
    ],
    items: ['ani', 'ata', 'at', 'hu', 'hi', 'anakhnu', 'atem', 'aten', 'hem', 'hen'],
  },

  l5: {
    title: 'Saluer et prendre des nouvelles',
    summary: 'Le début de chaque appel avec papa.',
    kind: 'vocab',
    fiche: [
      { t: 'words', ids: ['shalom', 'boker-tov', 'erev-tov', 'laila-tov', 'ma-nishma', 'ma-shlomkha', 'ma-shlomekh', 'ma-shlomkhem', 'beseder', 'tov', 'metsuyan', 've-ata', 've-at', 'toda', 'bevakasha', 'yofi', 'lehitraot'] },
      { t: 'tip', text: "« Comment vas-tu » s'accorde avec la personne : מָה שְׁלוֹמְךָ (ma shlomkha) à papa, מָה שְׁלוֹמֵךְ (ma shlomekh) à maman, מָה שְׁלוֹמְכֶם (ma shlomkhem) aux deux. מָה נִשְׁמָע (ma nishma) marche pour tout le monde." },
      { t: 'tip', text: "בְּסֵדֶר (besséder) est le mot magique : « ça va », « d'accord », « pas de souci »." },
    ],
    examples: ['shalom', 'ma-nishma', 'ma-shlomkha', 'ma-shlomekh', 'beseder', 'toda', 'lehitraot'],
    reading: [
      { he: 'שָׁלוֹם אַבָּא! מָה שְׁלוֹמְךָ?', tr: 'shalom aba ! ma shlomkha ?', fr: 'Salut papa ! Comment vas-tu ?', who: 'Toi' },
      { he: 'טוֹב, תּוֹדָה. וְאַתְּ?', tr: 'tov, toda. ve-at ?', fr: 'Bien, merci. Et toi ?', who: 'Papa' },
      { he: 'אֲנִי בְּסֵדֶר.', tr: 'ani besséder.', fr: 'Moi, ça va.', who: 'Toi' },
      { he: 'יוֹפִי! לְהִתְרָאוֹת!', tr: 'yofi ! lehitraot !', fr: 'Super ! À plus tard !', who: 'Papa' },
    ],
    items: ['shalom', 'boker-tov', 'erev-tov', 'laila-tov', 'ma-nishma', 'ma-shlomkha', 'ma-shlomekh', 'ma-shlomkhem', 'beseder', 'metsuyan', 've-ata', 've-at', 'bevakasha', 'yofi', 'lehitraot'],
  },

  l6: {
    title: 'La famille',
    summary: 'Maman, papa, les parents et toute la famille.',
    kind: 'vocab',
    fiche: [
      { t: 'words', ids: ['ima', 'aba', 'horim', 'akh', 'akhot', 'saba', 'savta', 'mishpakha', 'ben', 'bat', 'dod', 'doda', 'bayit', 'habayta'] },
      { t: 'p', text: "Pour présenter quelqu'un : זֶה (zé) pour un homme, זֹאת (zot) pour une femme, et שֶׁלִּי (shéli) après le mot pour dire « mon, ma »." },
      { t: 'table', head: ['Hébreu', 'Prononciation', 'Français'], rows: [
        ['זֶה אַבָּא שֶׁלִּי', 'zé aba shéli', "C'est mon papa"],
        ['זֹאת אִמָּא שֶׁלִּי', 'zot ima shéli', "C'est ma maman"],
        ['הַמִּשְׁפָּחָה שֶׁלִּי', 'hamishpakha shéli', 'Ma famille'],
      ] },
      { t: 'tip', text: "הַ (ha) collé devant un mot veut dire « le, la, les » : בַּיִת (bayit) = une maison, הַבַּיִת (habayit) = la maison." },
    ],
    examples: ['horim', 'akh', 'akhot', 'saba', 'savta', 'mishpakha', 'sheli', 'ze', 'zot', 'habayta'],
    reading: [
      { he: 'זֹאת אִמָּא שֶׁלִּי וְזֶה אַבָּא שֶׁלִּי.', tr: 'zot ima shéli ve-zé aba shéli.', fr: "C'est ma maman et c'est mon papa." },
      { he: 'הֵם הַהוֹרִים שֶׁלִּי.', tr: 'hem hahorim shéli.', fr: 'Ce sont mes parents.' },
      { he: 'אֲנִי בָּאָה הַבַּיְתָה.', tr: 'ani ba\'a habayta.', fr: "J'arrive à la maison." },
    ],
    items: ['horim', 'akh', 'akhot', 'saba', 'savta', 'mishpakha', 'ben', 'bat', 'dod', 'doda', 'bayit', 'habayta', 'sheli', 'ze', 'zot'],
  },

  l7: {
    title: 'Comment je me sens',
    summary: 'Fatiguée, contente, occupée… au féminin.',
    kind: 'vocab',
    fiche: [
      { t: 'p', text: "Au présent, l'hébreu n'utilise pas le verbe « être » : on dit simplement « moi fatiguée ». L'adjectif s'accorde : au féminin, il finit souvent par ־ָה (a)." },
      { t: 'table', head: ['Moi (féminin)', 'Papa (masculin)', 'Français'], rows: [
        ['עֲיֵפָה (ayéfa)', 'עָיֵף (ayef)', 'fatigué(e)'],
        ['שְׂמֵחָה (smékha)', 'שָׂמֵחַ (saméakh)', 'content(e)'],
        ['רְעֵבָה (ré\'éva)', 'רָעֵב (ra\'év)', 'qui a faim'],
        ['חוֹלָה (khola)', 'חוֹלֶה (kholé)', 'malade'],
        ['עֲסוּקָה (assouka)', 'עָסוּק (assouk)', 'occupé(e)'],
      ] },
      { t: 'words', ids: ['ktsat', 'meod'] },
      { t: 'tip', text: "Pour nuancer : אֲנִי קְצָת עֲיֵפָה (ani ktsat ayéfa) = je suis un peu fatiguée ; אֲנִי מְאוֹד שְׂמֵחָה (ani me'od smékha) = je suis très contente." },
    ],
    examples: ['ayefa', 'ayef', 'smekha', 're-eva', 'khola', 'asuka', 'lekhutsa', 'ktsat', 'meod'],
    reading: [
      { he: 'מָה שְׁלוֹמֵךְ?', tr: 'ma shlomekh ?', fr: 'Comment vas-tu ?', who: 'Maman' },
      { he: 'אֲנִי קְצָת עֲיֵפָה. וְאַתְּ?', tr: 'ani ktsat ayéfa. ve-at ?', fr: 'Je suis un peu fatiguée. Et toi ?', who: 'Toi' },
      { he: 'אֲנִי עֲסוּקָה, אֲבָל שְׂמֵחָה.', tr: 'ani assouka, aval smékha.', fr: 'Je suis occupée, mais contente.', who: 'Maman' },
      { he: 'אַבָּא, אַתָּה רָעֵב?', tr: "aba, ata ra'év ?", fr: 'Papa, tu as faim ?', who: 'Toi' },
    ],
    items: ['ayefa', 'ayef', 'smekha', 're-eva', 're-ev', 'khola', 'khole', 'asuka', 'asuk', 'lekhutsa', 'ktsat', 'meod'],
  },
};
