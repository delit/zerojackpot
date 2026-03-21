/* One-off generator: reads i18n/sv.json, writes en/de/es. Run: node scripts/build-i18n-en-de-es.js */
const fs = require('fs');
const path = require('path');
const svPath = path.join(__dirname, '../i18n/sv.json');
const sv = JSON.parse(fs.readFileSync(svPath, 'utf8'));

const en = JSON.parse(JSON.stringify(sv));
en.meta = { locale: 'en', htmlLang: 'en', intlLocale: 'en-GB', currency: 'EUR', ticketPrice: 2.5, ogLocale: 'en_GB' };
Object.assign(en.common, {
    langNameSv: 'Swedish',
    langNameEn: 'English',
    langNameDe: 'German',
    langNameEs: 'Spanish',
    langLabel: 'Language',
    headerLogoAria: 'ZeroJackpot – home',
    footerJakten: 'The Jackpot Chase',
    footerAbout: 'About ZeroJackpot',
    footerTagline: 'A simulator showing Eurojackpot odds'
});
en.index.page = {
    title: 'ZeroJackpot – Eurojackpot Simulator',
    description:
        'Free Eurojackpot simulator showing real odds. Run millions of draws in seconds and see why the lottery rarely pays off.',
    ogTitle: 'ZeroJackpot – Eurojackpot Simulator',
    ogDescription: 'Simulate millions of Eurojackpot draws in seconds. See the real odds and how unlikely a win is.',
    twitterTitle: 'ZeroJackpot – Eurojackpot Simulator',
    twitterDescription: 'Simulate millions of draws and see the real odds',
    jsonldDescription:
        'Eurojackpot simulator to show lottery odds in the real world. Simulate millions of draws and see how unlikely winning is.'
};
en.about.page = {
    title: 'About ZeroJackpot – Eurojackpot odds',
    description:
        'Understand Eurojackpot odds. Jackpot chance is 1 in 139,838,160. See the maths and why investing often beats the lottery.',
    ogTitle: 'About ZeroJackpot – Eurojackpot odds',
    ogDescription:
        'Playing once a week, it would take on average almost 2.7 million years to hit the jackpot. Understand the maths.',
    twitterTitle: 'About ZeroJackpot – Eurojackpot odds',
    twitterDescription: 'Eurojackpot jackpot odds are 1 in 139,838,160. Understand the maths.',
    jsonldDescription: 'About ZeroJackpot and Eurojackpot odds.'
};
en.jakten.page = {
    title: 'The Jackpot Chase – live Eurojackpot simulation',
    description:
        'Live Eurojackpot simulation – one draw every second, synced for all visitors. Watch time pass without a jackpot.',
    ogTitle: 'The Jackpot Chase – live Eurojackpot simulation',
    ogDescription:
        'One draw every second. Watch the days go by with no jackpot. Synchronised live simulation.',
    twitterTitle: 'The Jackpot Chase – live simulation',
    twitterDescription: 'One draw every second. Watch the days go by with no jackpot.',
    jsonldDescription: 'Live Eurojackpot simulation.'
};
Object.assign(en.about, {
    backLink: '← Back to simulator',
    h2: 'About ZeroJackpot',
    intro1:
        'ZeroJackpot shows the hard truth about Eurojackpot: your chance of winning is almost zero. Many play every week without grasping how low the odds are. This simulator shows thousands or even millions of draws in seconds.',
    intro2:
        'After 10,000 draws you may still have won only small amounts. After 1,000,000 draws (roughly 2,740 years of weekly play) you may still not have hit the jackpot – that is how unlikely a win really is.',
    quote: 'If you played once a week, it would take on average almost 2.7 million years to win the jackpot.',
    purposeH: 'Purpose of the simulator',
    purposeP:
        'We are not here to kill the dream of winning, but to give a realistic picture of probability. We want you to:',
    purposeLi1: 'Understand the real odds before you play',
    purposeLi2: 'See the lottery as entertainment, not an investment',
    purposeLi3: 'See what happens if you put the same money into long-term investing instead',
    purposeLi4: 'Make informed choices about how you spend your money',
    investH: 'Investment comparison',
    investP1:
        'The simulator shows what happens if you invest the same €2.50 per week in a global index fund with 7% annual return instead. For most people the gap is shocking – even a small weekly sum grows fast thanks to compound interest.',
    investP2:
        'A line costs about €2.50. Playing every week for 10 years means spending roughly €1,300, often winning only small amounts. Investing that money instead could leave you with over €1,600. After 30 years the gap is even bigger.',
    ejH: 'About Eurojackpot',
    ejP:
        'Eurojackpot is a European lottery: pick 5 numbers from 1–50 and 2 star numbers from 1–12. There are 12 prize tiers, from the jackpot (5+2) down to the smallest win (2+1).',
    oddsH: 'The real odds',
    oddsIntro: 'Here is the probability for each Eurojackpot prize tier:',
    thRight: 'Match',
    thPrizeApprox: 'Prize (approx.)',
    thOdds: 'Odds',
    thProb: 'Probability',
    oddsSummary:
        'The probability of winning the jackpot is 1 in 139,838,160.\n\nThe chance of winning anything at all in a single draw is about 1 in 32, or 3.1%. So 96.9% of all lines win nothing.',
    perspH: 'Putting the odds in perspective:',
    persp1: 'You are more likely to be struck by lightning (about 1 in 500,000) than to win the jackpot',
    persp2: 'You are more likely to die in a plane crash (about 1 in 11 million) than to win the jackpot',
    persp3: 'If you played once every day, it would take over 380,000 years on average to win the jackpot',
    persp4:
        'If all 10.5 million Swedes played one line, statistically only about 0.075 people would win the jackpot',
    mathH: 'The maths behind it',
    mathP1: 'The number of combinations in Eurojackpot comes from main numbers and star numbers:',
    mathLi1: '5 numbers from 50: 2,118,760 combinations',
    mathLi2: '2 star numbers from 12: 66 combinations',
    mathLi3: 'Total: 2,118,760 × 66 = 139,838,160 possible combinations',
    mathP2:
        'That is why jackpot odds are exactly 1 in 139,838,160. No strategy or system changes this. Each draw is independent.',
    truthH: 'The maths do not lie',
    truthP1:
        'As the simulator shows: long term you lose money on the lottery. That is by design. Only about 50% of stakes return to players as prizes; the rest goes to the state, good causes and costs.',
    truthP2:
        'Expected value per line is only about €1.20 even though the line costs €2.50 – so on average you lose about €1.30 per line.',
    gambleH: 'Problem gambling and help',
    gambleP:
        'For some people, gambling becomes a serious problem. If you or someone you know struggles to control play, help is available.',
    helpH: 'Sweden: Stödlinjen (gambling support)',
    helpPhone: 'Phone:',
    helpWeb: 'Web:',
    helpP2:
        'Stödlinjen offers free, anonymous advice for people affected by gambling and their families. It is never too late to seek help.'
});
Object.assign(en.jakten, {
    title: 'The Jackpot Chase',
    myRow: 'Your line',
    draw: 'Draw',
    statsHeading: 'Statistics',
    statDaysNoJp: 'Days without jackpot',
    statDraws: 'Draws',
    statTotalCost: 'Total cost',
    statTotalWin: 'Total winnings',
    statBestWin: 'Best win',
    statNet: 'Net result',
    recentWins: 'Recent wins',
    topWins: 'Top wins',
    matchLine: '{{main}} main + {{stars}} star numbers',
    noWinThisDraw: 'No win',
    historyEmptyRecent: 'No wins in history yet.',
    historyEmptyTop: 'No wins recorded yet.'
});
Object.assign(en.home, {
    pickRow: 'Choose your line',
    instrDesktop: 'Pick 5 numbers from 1–50 and 2 star numbers from 1–12',
    instrMobileLine1: 'Pick 5 numbers from 1–50',
    instrMobileLine2: 'Pick 2 star numbers from 1–12',
    btnRandom: 'Random numbers',
    btnClear: 'Clear',
    pickerDefaultTitle: 'Pick a number',
    btnClose: 'Close',
    simHeading: 'Number of draws to simulate',
    resultsHeading: 'Results',
    labelTotalDraws: 'Number of draws',
    labelTotalCost: 'Total cost',
    labelTotalWin: 'Total winnings',
    labelNet: 'Net result',
    winDistHeading: 'Win distribution',
    thMatch: 'Match',
    thCount: 'Count',
    thPrizePer: 'Prize per line',
    thTotalWin: 'Total winnings',
    bestDrawHeading: 'Best draw',
    investHeading: 'If you had invested instead',
    labelInvested: 'Amount invested',
    labelValueAfter: 'Value after growth',
    labelInvestProfit: 'Investment gain',
    labelDiff: 'Difference',
    promoTitle: 'The Jackpot Chase',
    promoText: 'One draw every second. Watch time pass without a jackpot.',
    promoBtn: 'Open live simulation',
    backToSim: '← Back to simulator',
    sim100: '100 draws',
    sim1000: '1,000 draws',
    sim10000: '10,000 draws',
    sim100000: '100,000 draws',
    sim1000000: '1,000,000 draws',
    sim10000000: '10,000,000 draws'
});
Object.assign(en.picker, {
    titleMain: 'Pick main numbers (1–50)',
    titleStar: 'Pick star numbers (1–12)'
});
Object.assign(en.sim, {
    noWin: 'No win',
    bestDrawTitle: 'Best draw #{{n}}',
    oddsLabel: 'Odds:',
    winLabel: 'Win:',
    investDesc:
        'If you had invested {{amount}} per day for {{years}} years in a global index fund with 7% annual return:',
    diffVsLotto: 'Difference vs lottery'
});
en.faq = {
    q1: {
        question: 'What are the odds of winning Eurojackpot?',
        answer:
            'The jackpot odds are 1 in 139,838,160. Playing once a week, it would take on average almost 2.7 million years to win the jackpot.'
    },
    q2: {
        question: 'What is the chance of winning anything in Eurojackpot?',
        answer: 'The chance of any win in one draw is about 1 in 32, or 3.1%. So 96.9% of lines win nothing.'
    },
    q3: {
        question: 'How much does a Eurojackpot line cost?',
        answer:
            'A line costs about €2.50 in many countries. On average you get back only about €1.20 per line, so you lose about €1.30 per line played.'
    },
    q4: {
        question: 'What if I invest instead of playing?',
        answer:
            'Playing weekly for 10 years costs roughly €1,300 with usually only small wins. Investing the same in a global index fund at 7% could give over €1,600. After 30 years the gap is much larger.'
    }
};
en.oddsProb = {
    '5+2': '0.0000007%',
    '5+1': '0.000014%',
    '5+0': '0.000032%',
    '4+2': '0.00016%',
    '4+1': '0.0032%',
    '3+2': '0.0071%',
    '4+0': '0.0072%',
    '2+2': '0.10%',
    '3+1': '0.14%',
    '3+0': '0.32%',
    '1+2': '0.53%',
    '2+1': '2.04%'
};

const de = JSON.parse(JSON.stringify(en));
de.meta = { locale: 'de', htmlLang: 'de', intlLocale: 'de-DE', currency: 'EUR', ticketPrice: 2.5, ogLocale: 'de_DE' };
Object.assign(de.common, {
    langNameSv: 'Schwedisch',
    langNameEn: 'Englisch',
    langNameDe: 'Deutsch',
    langNameEs: 'Spanisch',
    langLabel: 'Sprache',
    headerLogoAria: 'ZeroJackpot – zur Startseite',
    footerJakten: 'Die Jagd nach dem Jackpot',
    footerAbout: 'Über ZeroJackpot',
    footerTagline: 'Ein Simulator für Eurojackpot-Chancen'
});
de.index.page = {
    title: 'ZeroJackpot – Eurojackpot-Simulator',
    description:
        'Kostenloser Eurojackpot-Simulator: echte Chancen, Millionen Ziehungen in Sekunden. Sieh, warum Lotto fast nie rechnet.',
    ogTitle: 'ZeroJackpot – Eurojackpot-Simulator',
    ogDescription:
        'Simuliere Millionen Eurojackpot-Ziehungen in Sekunden. Sieh die realen Chancen und wie unwahrscheinlich ein Gewinn ist.',
    twitterTitle: 'ZeroJackpot – Eurojackpot-Simulator',
    twitterDescription: 'Millionen Ziehungen simulieren und echte Chancen sehen',
    jsonldDescription:
        'Eurojackpot-Simulator, der Lotto-Chancen verdeutlicht. Simuliere Millionen Ziehungen und sieh, wie unwahrscheinlich Gewinne sind.'
};
de.about.page = {
    title: 'Über ZeroJackpot – Eurojackpot-Chancen',
    description:
        'Eurojackpot-Chancen verstehen. Jackpot: 1 zu 139 838 160. Mathematik und warum Investieren oft schlägt.',
    ogTitle: 'Über ZeroJackpot – Eurojackpot-Chancen',
    ogDescription:
        'Einmal pro Woche spielen: durchschnittlich fast 2,7 Millionen Jahre bis zum Jackpot. Die Mathematik dahinter.',
    twitterTitle: 'Über ZeroJackpot – Eurojackpot-Chancen',
    twitterDescription: 'Eurojackpot-Jackpot: 1 zu 139 838 160. Mathematik verstehen.',
    jsonldDescription: 'Über ZeroJackpot und Eurojackpot-Chancen.'
};
de.jakten.page = {
    title: 'Die Jagd nach dem Jackpot – Live-Simulation',
    description:
        'Live Eurojackpot-Simulation – eine Ziehung pro Sekunde, für alle Besucher synchron. Sieh die Zeit ohne Jackpot vergehen.',
    ogTitle: 'Die Jagd nach dem Jackpot – Live-Simulation',
    ogDescription:
        'Eine Ziehung pro Sekunde. Die Tage vergehen ohne Jackpot. Synchronisierte Live-Simulation.',
    twitterTitle: 'Die Jagd nach dem Jackpot – Live',
    twitterDescription: 'Eine Ziehung pro Sekunde. Zeit vergeht ohne Jackpot.',
    jsonldDescription: 'Live Eurojackpot-Simulation.'
};
Object.assign(de.about, {
    backLink: '← Zurück zum Simulator',
    h2: 'Über ZeroJackpot',
    intro1:
        'ZeroJackpot zeigt die harte Wahrheit über Eurojackpot: die Gewinnchance ist fast null. Viele spielen jede Woche ohne die extrem niedrigen Chancen zu begreifen. Dieser Simulator zeigt Tausende oder Millionen Ziehungen in Sekunden.',
    intro2:
        'Nach 10 000 Ziehungen hast du vielleicht nur Kleingewinne. Nach 1 000 000 Ziehungen (rund 2 740 Jahre wöchentliches Spiel) vielleicht immer noch keinen Jackpot – so unwahrscheinlich ist ein Treffer.',
    quote: 'Einmal pro Woche spielen: durchschnittlich fast 2,7 Millionen Jahre bis zum Jackpot.',
    purposeH: 'Zweck des Simulators',
    purposeP:
        'Wir wollen den Traum vom Gewinn nicht zerstören, sondern eine realistische Sicht auf Wahrscheinlichkeiten geben. Wir möchten, dass du:',
    purposeLi1: 'die echten Chancen verstehst, bevor du spielst',
    purposeLi2: 'Lotto als Unterhaltung siehst, nicht als Investition',
    purposeLi3: 'siehst, was passiert, wenn du dasselbe Geld langfristig anlegst',
    purposeLi4: 'informiert entscheidest, wie du dein Geld ausgibst',
    investH: 'Investitionsvergleich',
    investP1:
        'Der Simulator zeigt, was passiert, wenn du dieselben 2,50 € pro Woche stattdessen in einen globalen Indexfonds mit 7 % Rendite anlegst. Für die meisten ist der Unterschied schockierend – schon kleine Beträge wachsen durch Zinseszins.',
    investP2:
        'Ein Tipp kostet etwa 2,50 €. Jede Woche 10 Jahre lang sind das rund 1 300 €, oft nur Kleingewinne. Investiert hättest du über 1 600 €. Nach 30 Jahren ist die Lücke noch größer.',
    ejH: 'Über Eurojackpot',
    ejP:
        'Eurojackpot ist eine europäische Lotterie: 5 Zahlen aus 1–50 und 2 Eurozahlen aus 1–12. Es gibt 12 Gewinnklassen, vom Jackpot (5+2) bis zum kleinsten Gewinn (2+1).',
    oddsH: 'Die echten Chancen',
    oddsIntro: 'Wahrscheinlichkeit je Gewinnklasse bei Eurojackpot:',
    thRight: 'Richtig',
    thPrizeApprox: 'Gewinn (ca.)',
    thOdds: 'Chance',
    thProb: 'Wahrscheinlichkeit',
    oddsSummary:
        'Die Chance auf den Jackpot beträgt 1 zu 139 838 160.\n\nDie Chance, in einer Ziehung überhaupt etwas zu gewinnen, liegt bei etwa 1 zu 32, also 3,1 %. 96,9 % aller Tipps gewinnen nichts.',
    perspH: 'Zum Einordnen:',
    persp1: 'Eher vom Blitz getroffen (ca. 1 zu 500 000) als Jackpot gewonnen',
    persp2: 'Eher bei einem Flugzeugabsturz sterben (ca. 1 zu 11 Mio.) als Jackpot gewonnen',
    persp3: 'Einmal täglich spielen: über 380 000 Jahre im Durchschnitt bis zum Jackpot',
    persp4:
        'Spielten alle 10,5 Mio. Schweden eine Reihe, gewännen statistisch etwa 0,075 Personen den Jackpot',
    mathH: 'Die Mathematik',
    mathP1: 'Mögliche Kombinationen aus Haupt- und Eurozahlen:',
    mathLi1: '5 aus 50: 2 118 760 Kombinationen',
    mathLi2: '2 Eurozahlen aus 12: 66 Kombinationen',
    mathLi3: 'Gesamt: 2 118 760 × 66 = 139 838 160 Kombinationen',
    mathP2:
        'Deshalb genau 1 zu 139 838 160 für den Jackpot. Kein System ändert das. Jede Ziehung ist unabhängig.',
    truthH: 'Die Mathematik lügt nicht',
    truthP1:
        'Langfristig verlierst du beim Lotto Geld – so ist es konstruiert. Nur etwa 50 % der Einsätze fließen als Gewinne zurück.',
    truthP2:
        'Der Erwartungswert pro Tipp liegt bei nur etwa 1,20 € bei Kosten von 2,50 € – im Schnitt verlierst du etwa 1,30 € pro Tipp.',
    gambleH: 'Spielsucht und Hilfe',
    gambleP:
        'Glücksspiel kann zur Sucht werden. Wenn du oder jemand in deinem Umfeld Probleme hat, Hilfe zu suchen lohnt sich.',
    helpH: 'Schweden: Stödlinjen',
    helpPhone: 'Telefon:',
    helpWeb: 'Web:',
    helpP2:
        'Stödlinjen bietet kostenlose, anonyme Beratung. Es ist nie zu spät, Hilfe zu suchen.'
});
Object.assign(de.jakten, {
    title: 'Die Jagd nach dem Jackpot',
    myRow: 'Dein Tipp',
    draw: 'Ziehung',
    statsHeading: 'Statistik',
    statDaysNoJp: 'Tage ohne Jackpot',
    statDraws: 'Ziehungen',
    statTotalCost: 'Gesamtkosten',
    statTotalWin: 'Gesamtgewinn',
    statBestWin: 'Bester Gewinn',
    statNet: 'Netto',
    recentWins: 'Letzte Gewinne',
    topWins: 'Höchste Gewinne',
    matchLine: '{{main}} richtige Hauptzahlen + {{stars}} Eurozahlen',
    noWinThisDraw: 'Kein Gewinn',
    historyEmptyRecent: 'Noch keine Gewinne in der Historie.',
    historyEmptyTop: 'Noch kein Gewinn erfasst.'
});
Object.assign(de.home, {
    pickRow: 'Tipp wählen',
    instrDesktop: 'Wähle 5 Zahlen von 1–50 und 2 Eurozahlen von 1–12',
    instrMobileLine1: 'Wähle 5 Zahlen von 1–50',
    instrMobileLine2: 'Wähle 2 Eurozahlen von 1–12',
    btnRandom: 'Zufallstipp',
    btnClear: 'Zurücksetzen',
    pickerDefaultTitle: 'Zahl wählen',
    btnClose: 'Schließen',
    simHeading: 'Anzahl Ziehungen simulieren',
    resultsHeading: 'Ergebnis',
    labelTotalDraws: 'Ziehungen',
    labelTotalCost: 'Gesamtkosten',
    labelTotalWin: 'Gesamtgewinn',
    labelNet: 'Netto',
    winDistHeading: 'Gewinnverteilung',
    thMatch: 'Richtig',
    thCount: 'Anzahl',
    thPrizePer: 'Gewinn pro Tipp',
    thTotalWin: 'Gesamtgewinn',
    bestDrawHeading: 'Beste Ziehung',
    investHeading: 'Stattdessen investiert',
    labelInvested: 'Investierter Betrag',
    labelValueAfter: 'Wert nach Zins',
    labelInvestProfit: 'Gewinn aus Anlage',
    labelDiff: 'Differenz',
    promoTitle: 'Die Jagd nach dem Jackpot',
    promoText: 'Eine Ziehung pro Sekunde. Zeit ohne Jackpot.',
    promoBtn: 'Live-Simulation öffnen',
    backToSim: '← Zurück zum Simulator',
    sim100: '100 Ziehungen',
    sim1000: '1.000 Ziehungen',
    sim10000: '10.000 Ziehungen',
    sim100000: '100.000 Ziehungen',
    sim1000000: '1.000.000 Ziehungen',
    sim10000000: '10.000.000 Ziehungen'
});
Object.assign(de.picker, {
    titleMain: 'Hauptzahlen wählen (1–50)',
    titleStar: 'Eurozahlen wählen (1–12)'
});
Object.assign(de.sim, {
    noWin: 'Kein Gewinn',
    bestDrawTitle: 'Beste Ziehung Nr. {{n}}',
    oddsLabel: 'Chance:',
    winLabel: 'Gewinn:',
    investDesc:
        'Wenn du {{amount}} pro Tag {{years}} Jahre lang in einen globalen Indexfonds mit 7 % Rendite investiert hättest:',
    diffVsLotto: 'Differenz zum Lotto'
});
de.faq = {
    q1: {
        question: 'Wie hoch sind die Eurojackpot-Gewinnchancen?',
        answer:
            'Jackpot-Chance: 1 zu 139 838 160. Einmal pro Woche: durchschnittlich fast 2,7 Millionen Jahre bis zum Jackpot.'
    },
    q2: {
        question: 'Wie groß ist die Chance auf irgendeinen Gewinn?',
        answer: 'In einer Ziehung etwa 1 zu 32, also 3,1 %. 96,9 % aller Tipps gewinnen nichts.'
    },
    q3: {
        question: 'Was kostet ein Eurojackpot-Tipp?',
        answer:
            'Ein Tipp kostet in vielen Ländern etwa 2,50 €. Im Schnitt bekommst du nur etwa 1,20 € zurück – Verlust etwa 1,30 € pro Tipp.'
    },
    q4: {
        question: 'Was, wenn ich stattdessen investiere?',
        answer:
            '10 Jahre wöchentlich spielen: rund 1 300 € mit meist Kleingewinnen. Investiert über 1 600 € möglich bei 7 %. Nach 30 Jahren viel mehr.'
    }
};

const es = JSON.parse(JSON.stringify(en));
es.meta = { locale: 'es', htmlLang: 'es', intlLocale: 'es-ES', currency: 'EUR', ticketPrice: 2.5, ogLocale: 'es_ES' };
Object.assign(es.common, {
    langNameSv: 'Sueco',
    langNameEn: 'Inglés',
    langNameDe: 'Alemán',
    langNameEs: 'Español',
    langLabel: 'Idioma',
    headerLogoAria: 'ZeroJackpot – inicio',
    footerJakten: 'La caza del bote',
    footerAbout: 'Sobre ZeroJackpot',
    footerTagline: 'Un simulador de probabilidades de Eurojackpot'
});
es.index.page = {
    title: 'ZeroJackpot – Simulador de Eurojackpot',
    description:
        'Simulador gratuito de Eurojackpot: probabilidades reales, millones de sorteos en segundos. Comprueba por qué casi nunca compensa.',
    ogTitle: 'ZeroJackpot – Simulador de Eurojackpot',
    ogDescription:
        'Simula millones de sorteos de Eurojackpot en segundos. Ve las probabilidades reales y lo improbable que es ganar.',
    twitterTitle: 'ZeroJackpot – Simulador de Eurojackpot',
    twitterDescription: 'Simula millones de sorteos y ve las probabilidades reales',
    jsonldDescription:
        'Simulador de Eurojackpot que muestra las probabilidades reales. Simula millones de sorteos y ve lo difícil que es ganar.'
};
es.about.page = {
    title: 'Sobre ZeroJackpot – probabilidades de Eurojackpot',
    description:
        'Entiende las probabilidades de Eurojackpot. Bote: 1 entre 139 838 160. Matemáticas e inversión frente a lotería.',
    ogTitle: 'Sobre ZeroJackpot – probabilidades de Eurojackpot',
    ogDescription:
        'Jugando una vez por semana, de media casi 2,7 millones de años para ganar el bote. Entiende las matemáticas.',
    twitterTitle: 'Sobre ZeroJackpot – probabilidades de Eurojackpot',
    twitterDescription: 'Bote Eurojackpot: 1 entre 139 838 160. Entiende las matemáticas.',
    jsonldDescription: 'Sobre ZeroJackpot y probabilidades de Eurojackpot.'
};
es.jakten.page = {
    title: 'La caza del bote – simulación en vivo',
    description:
        'Simulación en vivo de Eurojackpot: un sorteo por segundo, sincronizado para todos. Ve pasar el tiempo sin bote.',
    ogTitle: 'La caza del bote – simulación en vivo',
    ogDescription:
        'Un sorteo por segundo. Los días pasan sin bote. Simulación en vivo sincronizada.',
    twitterTitle: 'La caza del bote – en vivo',
    twitterDescription: 'Un sorteo por segundo. El tiempo pasa sin bote.',
    jsonldDescription: 'Simulación en vivo de Eurojackpot.'
};
Object.assign(es.about, {
    backLink: '← Volver al simulador',
    h2: 'Sobre ZeroJackpot',
    intro1:
        'ZeroJackpot muestra la verdad dura sobre Eurojackpot: la probabilidad de ganar es casi nula. Muchos juegan cada semana sin entender lo bajas que son las probabilidades. Este simulador muestra miles o millones de sorteos en segundos.',
    intro2:
        'Tras 10 000 sorteos quizá solo hayas ganado poco. Tras 1 000 000 (unos 2 740 años jugando una vez por semana) quizá aún no hayas ganado el bote: así de improbable es.',
    quote: 'Si juegas una vez por semana, de media tardarías casi 2,7 millones de años en ganar el bote.',
    purposeH: 'Objetivo del simulador',
    purposeP:
        'No queremos acabar con el sueño de ganar, sino dar una imagen realista de la probabilidad. Queremos que:',
    purposeLi1: 'Entiendas las probabilidades reales antes de jugar',
    purposeLi2: 'Veas la lotería como entretenimiento, no como inversión',
    purposeLi3: 'Vea qué pasa si pones el mismo dinero a largo plazo en inversión',
    purposeLi4: 'Tomes decisiones informadas sobre cómo gastas tu dinero',
    investH: 'Comparación con inversión',
    investP1:
        'El simulador muestra qué pasa si inviertes los mismos 2,50 € por semana en un fondo indexado global al 7 % anual. Para muchos el salto es brutal: incluso poco dinero crece con el interés compuesto.',
    investP2:
        'Una apuesta cuesta unos 2,50 €. Jugando cada semana 10 años gastas unos 1 300 €, a menudo con premios pequeños. Invirtiendo podrías tener más de 1 600 €. A 30 años la diferencia es enorme.',
    ejH: 'Sobre Eurojackpot',
    ejP:
        'Eurojackpot es una lotería europea: 5 números del 1 al 50 y 2 estrellas del 1 al 12. Hay 12 categorías de premio, del bote (5+2) al premio más bajo (2+1).',
    oddsH: 'Las probabilidades reales',
    oddsIntro: 'Probabilidad por categoría de premio en Eurojackpot:',
    thRight: 'Aciertos',
    thPrizeApprox: 'Premio (aprox.)',
    thOdds: 'Probabilidad',
    thProb: 'Porcentaje',
    oddsSummary:
        'La probabilidad de ganar el bote es 1 entre 139 838 160.\n\nLa de ganar algo en un solo sorteo es de unas 1 entre 32, o 3,1 %. El 96,9 % de las apuestas no ganan nada.',
    perspH: 'Para ponerlo en perspectiva:',
    persp1: 'Es más probable que te caiga un rayo (unas 1 entre 500 000) que ganar el bote',
    persp2: 'Es más probable morir en un accidente aéreo (unas 1 entre 11 millones) que ganar el bote',
    persp3: 'Si juegas una vez al día, de media tardarías más de 380 000 años en ganar el bote',
    persp4:
        'Si los 10,5 millones de suecos jugaran una línea, estadísticamente unas 0,075 personas ganarían el bote',
    mathH: 'Las matemáticas',
    mathP1: 'Las combinaciones posibles vienen de los números principales y las estrellas:',
    mathLi1: '5 números de 50: 2 118 760 combinaciones',
    mathLi2: '2 estrellas de 12: 66 combinaciones',
    mathLi3: 'Total: 2 118 760 × 66 = 139 838 160 combinaciones',
    mathP2:
        'Por eso la probabilidad del bote es exactamente 1 entre 139 838 160. Ningún sistema lo cambia. Cada sorteo es independiente.',
    truthH: 'Las matemáticas no mienten',
    truthP1:
        'A largo plazo pierdes dinero en la lotería: así está diseñado. Solo unos 50 % de lo apostado vuelve en premios.',
    truthP2:
        'El valor esperado por apuesta es solo unos 1,20 € aunque cueste 2,50 €: de media pierdes unos 1,30 € por apuesta.',
    gambleH: 'Juego problemático y ayuda',
    gambleP:
        'El juego puede convertirse en un problema grave. Si tú o alguien cercano no controla el juego, hay ayuda.',
    helpH: 'Suecia: Stödlinjen',
    helpPhone: 'Teléfono:',
    helpWeb: 'Web:',
    helpP2:
        'Stödlinjen ofrece asesoramiento gratuito y anónimo. Nunca es tarde para pedir ayuda.'
});
Object.assign(es.jakten, {
    title: 'La caza del bote',
    myRow: 'Tu apuesta',
    draw: 'Sorteo',
    statsHeading: 'Estadísticas',
    statDaysNoJp: 'Días sin bote',
    statDraws: 'Sorteos',
    statTotalCost: 'Coste total',
    statTotalWin: 'Premios totales',
    statBestWin: 'Mejor premio',
    statNet: 'Resultado neto',
    recentWins: 'Últimos premios',
    topWins: 'Mayores premios',
    matchLine: '{{main}} aciertos principales + {{stars}} estrellas',
    noWinThisDraw: 'Sin premio',
    historyEmptyRecent: 'Aún no hay premios en el historial.',
    historyEmptyTop: 'Aún no hay premios registrados.'
});
Object.assign(es.home, {
    pickRow: 'Elige tu apuesta',
    instrDesktop: 'Elige 5 números del 1 al 50 y 2 estrellas del 1 al 12',
    instrMobileLine1: 'Elige 5 números del 1 al 50',
    instrMobileLine2: 'Elige 2 estrellas del 1 al 12',
    btnRandom: 'Aleatorio',
    btnClear: 'Borrar',
    pickerDefaultTitle: 'Elige un número',
    btnClose: 'Cerrar',
    simHeading: 'Número de sorteos a simular',
    resultsHeading: 'Resultados',
    labelTotalDraws: 'Sorteos',
    labelTotalCost: 'Coste total',
    labelTotalWin: 'Premios totales',
    labelNet: 'Resultado neto',
    winDistHeading: 'Distribución de premios',
    thMatch: 'Aciertos',
    thCount: 'Cantidad',
    thPrizePer: 'Premio por apuesta',
    thTotalWin: 'Premios totales',
    bestDrawHeading: 'Mejor sorteo',
    investHeading: 'Si hubieras invertido',
    labelInvested: 'Dinero invertido',
    labelValueAfter: 'Valor tras interés',
    labelInvestProfit: 'Ganancia de la inversión',
    labelDiff: 'Diferencia',
    promoTitle: 'La caza del bote',
    promoText: 'Un sorteo por segundo. El tiempo pasa sin bote.',
    promoBtn: 'Ver simulación en vivo',
    backToSim: '← Volver al simulador',
    sim100: '100 sorteos',
    sim1000: '1.000 sorteos',
    sim10000: '10.000 sorteos',
    sim100000: '100.000 sorteos',
    sim1000000: '1.000.000 sorteos',
    sim10000000: '10.000.000 sorteos'
});
Object.assign(es.picker, {
    titleMain: 'Elige números principales (1–50)',
    titleStar: 'Elige estrellas (1–12)'
});
Object.assign(es.sim, {
    noWin: 'Sin premio',
    bestDrawTitle: 'Mejor sorteo n.º {{n}}',
    oddsLabel: 'Probabilidad:',
    winLabel: 'Premio:',
    investDesc:
        'Si hubieras invertido {{amount}} al día durante {{years}} años en un fondo indexado global al 7 % anual:',
    diffVsLotto: 'Diferencia frente a lotería'
});
es.faq = {
    q1: {
        question: '¿Cuáles son las probabilidades de ganar Eurojackpot?',
        answer:
            'El bote: 1 entre 139 838 160. Jugando una vez por semana, de media casi 2,7 millones de años para ganarlo.'
    },
    q2: {
        question: '¿Qué probabilidad hay de ganar algo?',
        answer: 'En un sorteo, unas 1 entre 32, o 3,1 %. El 96,9 % de las apuestas no ganan nada.'
    },
    q3: {
        question: '¿Cuánto cuesta una apuesta de Eurojackpot?',
        answer:
            'Una apuesta cuesta unos 2,50 € en muchos países. De media recuperas unos 1,20 €, pierdes unos 1,30 € por apuesta.'
    },
    q4: {
        question: '¿Y si invierto en lugar de jugar?',
        answer:
            'Jugar cada semana 10 años: unos 1 300 € con premios pequeños. Invirtiendo al 7 % podrías superar 1 600 €. A 30 años la brecha es enorme.'
    }
};

const out = path.join(__dirname, '../i18n');
fs.writeFileSync(path.join(out, 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(out, 'de.json'), JSON.stringify(de, null, 2));
fs.writeFileSync(path.join(out, 'es.json'), JSON.stringify(es, null, 2));
console.log('Wrote en.json, de.json, es.json');
