// ආවර්තිතා වගු දත්ත
// ආකෘතිය: z|sym|සිංහල නම|English|ස්කන්ධය|වින්‍යාසය|block|වර්ගය|EN|IE1|mp(K)|r(pm)|group|period
// EN / IE / mp / r — null යනු මෙම පරාසයට දත්ත ඇතුළත් නොකළ බවයි (ප්‍රස්තාරයෙන් ඉවත් වේ).

const RAW = `
1|H|හයිඩ්‍රජන්|Hydrogen|1.008|1s¹|s|nonmetal|2.20|1312|14.01|37|1|1
2|He|හීලියම්|Helium|4.0026|1s²|s|noble||2372|0.95|31|18|1
3|Li|ලිතියම්|Lithium|6.94|[He]2s¹|s|alkali|0.98|520|453.7|152|1|2
4|Be|බෙරිලියම්|Beryllium|9.0122|[He]2s²|s|alkaline|1.57|899|1560|112|2|2
5|B|බෝරෝන්|Boron|10.81|[He]2s²2p¹|p|metalloid|2.04|801|2349|85|13|2
6|C|කාබන්|Carbon|12.011|[He]2s²2p²|p|nonmetal|2.55|1086|3823|77|14|2
7|N|නයිට්‍රජන්|Nitrogen|14.007|[He]2s²2p³|p|nonmetal|3.04|1402|63.15|75|15|2
8|O|ඔක්සිජන්|Oxygen|15.999|[He]2s²2p⁴|p|nonmetal|3.44|1314|54.36|73|16|2
9|F|ෆ්ලෝරීන්|Fluorine|18.998|[He]2s²2p⁵|p|halogen|3.98|1681|53.48|71|17|2
10|Ne|නියෝන්|Neon|20.180|[He]2s²2p⁶|p|noble||2081|24.56|69|18|2
11|Na|සෝඩියම්|Sodium|22.990|[Ne]3s¹|s|alkali|0.93|496|370.9|186|1|3
12|Mg|මැග්නීසියම්|Magnesium|24.305|[Ne]3s²|s|alkaline|1.31|738|923|160|2|3
13|Al|ඇලුමිනියම්|Aluminium|26.982|[Ne]3s²3p¹|p|post|1.61|578|933.5|143|13|3
14|Si|සිලිකන්|Silicon|28.085|[Ne]3s²3p²|p|metalloid|1.90|786|1687|117|14|3
15|P|පොස්ෆරස්|Phosphorus|30.974|[Ne]3s²3p³|p|nonmetal|2.19|1012|317.3|110|15|3
16|S|සල්ෆර්|Sulfur|32.06|[Ne]3s²3p⁴|p|nonmetal|2.58|1000|388.4|104|16|3
17|Cl|ක්ලෝරීන්|Chlorine|35.45|[Ne]3s²3p⁵|p|halogen|3.16|1251|171.7|99|17|3
18|Ar|ආගන්|Argon|39.948|[Ne]3s²3p⁶|p|noble||1521|83.8|97|18|3
19|K|පොටෑසියම්|Potassium|39.098|[Ar]4s¹|s|alkali|0.82|419|336.5|227|1|4
20|Ca|කැල්සියම්|Calcium|40.078|[Ar]4s²|s|alkaline|1.00|590|1115|197|2|4
21|Sc|ස්කැන්ඩියම්|Scandium|44.956|[Ar]3d¹4s²|d|transition|1.36|633|1814|162|3|4
22|Ti|ටයිටේනියම්|Titanium|47.867|[Ar]3d²4s²|d|transition|1.54|659|1941|147|4|4
23|V|වැනේඩියම්|Vanadium|50.942|[Ar]3d³4s²|d|transition|1.63|651|2183|134|5|4
24|Cr|ක්‍රෝමියම්|Chromium|51.996|[Ar]3d⁵4s¹|d|transition|1.66|653|2180|128|6|4
25|Mn|මැංගනීස්|Manganese|54.938|[Ar]3d⁵4s²|d|transition|1.55|717|1519|127|7|4
26|Fe|යකඩ|Iron|55.845|[Ar]3d⁶4s²|d|transition|1.83|762|1811|126|8|4
27|Co|කොබෝල්ට්|Cobalt|58.933|[Ar]3d⁷4s²|d|transition|1.88|760|1768|125|9|4
28|Ni|නිකල්|Nickel|58.693|[Ar]3d⁸4s²|d|transition|1.91|737|1728|124|10|4
29|Cu|තඹ|Copper|63.546|[Ar]3d¹⁰4s¹|d|transition|1.90|745|1358|128|11|4
30|Zn|සින්ක්|Zinc|65.38|[Ar]3d¹⁰4s²|d|transition|1.65|906|692.7|134|12|4
31|Ga|ගැලියම්|Gallium|69.723|[Ar]3d¹⁰4s²4p¹|p|post|1.81|579|302.9|135|13|4
32|Ge|ජර්මේනියම්|Germanium|72.630|[Ar]3d¹⁰4s²4p²|p|metalloid|2.01|762|1211|122|14|4
33|As|ආසනික්|Arsenic|74.922|[Ar]3d¹⁰4s²4p³|p|metalloid|2.18|947|1090|120|15|4
34|Se|සෙලේනියම්|Selenium|78.971|[Ar]3d¹⁰4s²4p⁴|p|nonmetal|2.55|941|494|119|16|4
35|Br|බ්‍රෝමීන්|Bromine|79.904|[Ar]3d¹⁰4s²4p⁵|p|halogen|2.96|1140|265.8|114|17|4
36|Kr|ක්‍රිප්ටෝන්|Krypton|83.798|[Ar]3d¹⁰4s²4p⁶|p|noble||1351|115.8|88|18|4
37|Rb|රුබිඩියම්|Rubidium|85.468|[Kr]5s¹|s|alkali|0.82|403|312.5|248|1|5
38|Sr|ස්ට්‍රොන්ටියම්|Strontium|87.62|[Kr]5s²|s|alkaline|0.95|550|1050|215|2|5
39|Y|ඉට්‍රියම්|Yttrium|88.906|[Kr]4d¹5s²|d|transition|1.22|600|1799|180|3|5
40|Zr|සර්කෝනියම්|Zirconium|91.224|[Kr]4d²5s²|d|transition|1.33|640|2128|160|4|5
41|Nb|නයෝබියම්|Niobium|92.906|[Kr]4d⁴5s¹|d|transition|1.60|652|2750|146|5|5
42|Mo|මොලිබ්ඩිනම්|Molybdenum|95.95|[Kr]4d⁵5s¹|d|transition|2.16|684|2896|139|6|5
43|Tc|ටෙක්නීෂියම්|Technetium|98|[Kr]4d⁵5s²|d|transition|1.90|702|2430|136|7|5
44|Ru|රුතේනියම්|Ruthenium|101.07|[Kr]4d⁷5s¹|d|transition|2.20|710|2607|134|8|5
45|Rh|රෝඩියම්|Rhodium|102.91|[Kr]4d⁸5s¹|d|transition|2.28|720|2237|134|9|5
46|Pd|පැලේඩියම්|Palladium|106.42|[Kr]4d¹⁰|d|transition|2.20|804|1828|137|10|5
47|Ag|රිදී|Silver|107.87|[Kr]4d¹⁰5s¹|d|transition|1.93|731|1234.9|144|11|5
48|Cd|කැඩ්මියම්|Cadmium|112.41|[Kr]4d¹⁰5s²|d|transition|1.69|868|594.2|151|12|5
49|In|ඉන්ඩියම්|Indium|114.82|[Kr]4d¹⁰5s²5p¹|p|post|1.78|558|429.8|167|13|5
50|Sn|ටින්|Tin|118.71|[Kr]4d¹⁰5s²5p²|p|post|1.96|709|505.1|140|14|5
51|Sb|ඇන්ටිමනි|Antimony|121.76|[Kr]4d¹⁰5s²5p³|p|metalloid|2.05|834|903.8|140|15|5
52|Te|ටෙලුරියම්|Tellurium|127.60|[Kr]4d¹⁰5s²5p⁴|p|metalloid|2.10|869|722.7|142|16|5
53|I|අයඩීන්|Iodine|126.90|[Kr]4d¹⁰5s²5p⁵|p|halogen|2.66|1008|457.4|133|17|5
54|Xe|සෙනෝන්|Xenon|131.29|[Kr]4d¹⁰5s²5p⁶|p|noble||1170|161.4|108|18|5
55|Cs|සීසියම්|Caesium|132.91|[Xe]6s¹|s|alkali|0.79|376|301.6|265|1|6
56|Ba|බේරියම්|Barium|137.33|[Xe]6s²|s|alkaline|0.89|503|1000|217|2|6
57|La|ලැන්තනම්|Lanthanum|138.91|[Xe]5d¹6s²|f|lanthanide|1.10|538|1193|187|0|6
58|Ce|සීරියම්|Cerium|140.12|[Xe]4f¹5d¹6s²|f|lanthanide|1.12|534|1068|182|0|6
59|Pr|ප්‍රේසියෝඩිමියම්|Praseodymium|140.91|[Xe]4f³6s²|f|lanthanide|1.13|527|1208|182|0|6
60|Nd|නියෝඩිමියම්|Neodymium|144.24|[Xe]4f⁴6s²|f|lanthanide|1.14|533|1297|181|0|6
61|Pm|ප්‍රොමීතියම්|Promethium|145|[Xe]4f⁵6s²|f|lanthanide|1.13|540|1315|183|0|6
62|Sm|සමේරියම්|Samarium|150.36|[Xe]4f⁶6s²|f|lanthanide|1.17|545|1345|180|0|6
63|Eu|යුරෝපියම්|Europium|151.96|[Xe]4f⁷6s²|f|lanthanide|1.20|547|1099|199|0|6
64|Gd|ගැඩෝලිනියම්|Gadolinium|157.25|[Xe]4f⁷5d¹6s²|f|lanthanide|1.20|593|1585|180|0|6
65|Tb|ටර්බියම්|Terbium|158.93|[Xe]4f⁹6s²|f|lanthanide|1.20|566|1629|177|0|6
66|Dy|ඩිස්ප්‍රෝසියම්|Dysprosium|162.50|[Xe]4f¹⁰6s²|f|lanthanide|1.22|573|1680|178|0|6
67|Ho|හෝල්මියම්|Holmium|164.93|[Xe]4f¹¹6s²|f|lanthanide|1.23|581|1734|176|0|6
68|Er|අර්බියම්|Erbium|167.26|[Xe]4f¹²6s²|f|lanthanide|1.24|589|1802|175|0|6
69|Tm|තූලියම්|Thulium|168.93|[Xe]4f¹³6s²|f|lanthanide|1.25|597|1818|173|0|6
70|Yb|ඉටර්බියම්|Ytterbium|173.05|[Xe]4f¹⁴6s²|f|lanthanide|1.10|603|1097|193|0|6
71|Lu|ලුටේෂියම්|Lutetium|174.97|[Xe]4f¹⁴5d¹6s²|f|lanthanide|1.27|524|1925|172|0|6
72|Hf|හැෆ්නියම්|Hafnium|178.49|[Xe]4f¹⁴5d²6s²|d|transition|1.30|659|2506|159|4|6
73|Ta|ටැන්ටලම්|Tantalum|180.95|[Xe]4f¹⁴5d³6s²|d|transition|1.50|761|3290|146|5|6
74|W|ටංස්ටන්|Tungsten|183.84|[Xe]4f¹⁴5d⁴6s²|d|transition|2.36|770|3695|139|6|6
75|Re|රීනියම්|Rhenium|186.21|[Xe]4f¹⁴5d⁵6s²|d|transition|1.90|760|3459|137|7|6
76|Os|ඔස්මියම්|Osmium|190.23|[Xe]4f¹⁴5d⁶6s²|d|transition|2.20|840|3306|135|8|6
77|Ir|ඉරිඩියම්|Iridium|192.22|[Xe]4f¹⁴5d⁷6s²|d|transition|2.20|880|2719|136|9|6
78|Pt|ප්ලැටිනම්|Platinum|195.08|[Xe]4f¹⁴5d⁹6s¹|d|transition|2.28|870|2041|139|10|6
79|Au|රන්|Gold|196.97|[Xe]4f¹⁴5d¹⁰6s¹|d|transition|2.54|890|1337|144|11|6
80|Hg|රසදිය|Mercury|200.59|[Xe]4f¹⁴5d¹⁰6s²|d|transition|2.00|1007|234.3|151|12|6
81|Tl|තැලියම්|Thallium|204.38|[Xe]4f¹⁴5d¹⁰6s²6p¹|p|post|1.62|589|577|170|13|6
82|Pb|ඊයම්|Lead|207.2|[Xe]4f¹⁴5d¹⁰6s²6p²|p|post|2.33|716|600.6|175|14|6
83|Bi|බිස්මත්|Bismuth|208.98|[Xe]4f¹⁴5d¹⁰6s²6p³|p|post|2.02|703|544.6|155|15|6
84|Po|පොලෝනියම්|Polonium|209|[Xe]4f¹⁴5d¹⁰6s²6p⁴|p|metalloid|2.00|812|527|190|16|6
85|At|ඇස්ටටීන්|Astatine|210|[Xe]4f¹⁴5d¹⁰6s²6p⁵|p|halogen|2.20|899|||17|6
86|Rn|රේඩෝන්|Radon|222|[Xe]4f¹⁴5d¹⁰6s²6p⁶|p|noble||1037|202|120|18|6
87|Fr|ෆ්‍රෑන්සියම්|Francium|223|[Rn]7s¹|s|alkali|0.70|380|300|260|1|7
88|Ra|රේඩියම්|Radium|226|[Rn]7s²|s|alkaline|0.90|509|973|221|2|7
89|Ac|ඇක්ටිනියම්|Actinium|227|[Rn]6d¹7s²|f|actinide|1.10|490|1323|203|0|7
90|Th|තෝරියම්|Thorium|232.04|[Rn]6d²7s²|f|actinide|1.30|587|2023|180|0|7
91|Pa|ප්‍රොටැක්ටිනියම්|Protactinium|231.04|[Rn]5f²6d¹7s²|f|actinide|1.50|568|1841|161|0|7
92|U|යුරේනියම්|Uranium|238.03|[Rn]5f³6d¹7s²|f|actinide|1.38|598|1405|156|0|7
93|Np|නෙප්චූනියම්|Neptunium|237|[Rn]5f⁴6d¹7s²|f|actinide|1.36|605|917|155|0|7
94|Pu|ප්ලූටෝනියම්|Plutonium|244|[Rn]5f⁶7s²|f|actinide|1.28|585|913|159|0|7
95|Am|ඇමෙරිසියම්|Americium|243|[Rn]5f⁷7s²|f|actinide|1.13|578|1449|173|0|7
96|Cm|කියුරියම්|Curium|247|[Rn]5f⁷6d¹7s²|f|actinide|1.28|581|1613|174|0|7
97|Bk|බර්කීලියම්|Berkelium|247|[Rn]5f⁹7s²|f|actinide|1.30|601|1259|170|0|7
98|Cf|කැලිෆෝර්නියම්|Californium|251|[Rn]5f¹⁰7s²|f|actinide|1.30|608|1173|186|0|7
99|Es|අයින්ස්ටයිනියම්|Einsteinium|252|[Rn]5f¹¹7s²|f|actinide|1.30|619|1133|186|0|7
100|Fm|ෆර්මියම්|Fermium|257|[Rn]5f¹²7s²|f|actinide|1.30|627|1800|186|0|7
101|Md|මෙන්ඩලීවියම්|Mendelevium|258|[Rn]5f¹³7s²|f|actinide|1.30|635|1100|186|0|7
102|No|නොබේලියම්|Nobelium|259|[Rn]5f¹⁴7s²|f|actinide|1.30|642|1100|186|0|7
103|Lr|ලෝරන්සියම්|Lawrencium|266|[Rn]5f¹⁴6d¹7s²|f|actinide|1.30|470|1900|186|0|7
104|Rf|රදර්ෆෝඩියම්|Rutherfordium|267|[Rn]5f¹⁴6d²7s²|d|transition|||||4|7
105|Db|ඩබ්නියම්|Dubnium|268|[Rn]5f¹⁴6d³7s²|d|transition|||||5|7
106|Sg|සීබෝර්ගියම්|Seaborgium|269|[Rn]5f¹⁴6d⁴7s²|d|transition|||||6|7
107|Bh|බෝරියම්|Bohrium|270|[Rn]5f¹⁴6d⁵7s²|d|transition|||||7|7
108|Hs|හැසියම්|Hassium|269|[Rn]5f¹⁴6d⁶7s²|d|transition|||||8|7
109|Mt|මයිට්නේරියම්|Meitnerium|278|[Rn]5f¹⁴6d⁷7s²|d|transition|||||9|7
110|Ds|ඩාම්ස්ටැඩ්ටියම්|Darmstadtium|281|[Rn]5f¹⁴6d⁸7s²|d|transition|||||10|7
111|Rg|රෝන්ට්ජීනියම්|Roentgenium|282|[Rn]5f¹⁴6d⁹7s²|d|transition|||||11|7
112|Cn|කොපර්නීසියම්|Copernicium|285|[Rn]5f¹⁴6d¹⁰7s²|d|transition|||||12|7
113|Nh|නිහෝනියම්|Nihonium|286|[Rn]5f¹⁴6d¹⁰7s²7p¹|p|post|||||13|7
114|Fl|ෆ්ලෙරෝවියම්|Flerovium|289|[Rn]5f¹⁴6d¹⁰7s²7p²|p|post|||||14|7
115|Mc|මොස්කෝවියම්|Moscovium|290|[Rn]5f¹⁴6d¹⁰7s²7p³|p|post|||||15|7
116|Lv|ලිවර්මෝරියම්|Livermorium|293|[Rn]5f¹⁴6d¹⁰7s²7p⁴|p|post|||||16|7
117|Ts|ටෙනසීන්|Tennessine|294|[Rn]5f¹⁴6d¹⁰7s²7p⁵|p|halogen|||||17|7
118|Og|ඔගනෙසෝන්|Oganesson|294|[Rn]5f¹⁴6d¹⁰7s²7p⁶|p|noble|||||18|7
`

const num = (v) => (v === '' || v === undefined ? null : Number(v))

export const ELEMENTS = RAW.trim()
  .split('\n')
  .map((line) => {
    const p = line.split('|')
    return {
      z: Number(p[0]),
      sym: p[1],
      si: p[2],
      en: p[3],
      mass: Number(p[4]),
      config: p[5],
      block: p[6],
      category: p[7],
      enValue: num(p[8]),
      ie: num(p[9]),
      mp: num(p[10]),
      radius: num(p[11]),
      group: Number(p[12]),
      period: Number(p[13]),
    }
  })

export const elementBySym = (sym) => ELEMENTS.find((e) => e.sym === sym)

export const CATEGORY_META = {
  alkali: { si: 'ක්ෂාර ලෝහ', en: 'Alkali metal', color: '#fb7185', bg: 'rgba(251,113,133,0.16)' },
  alkaline: { si: 'ක්ෂාරීය පාංශු ලෝහ', en: 'Alkaline earth metal', color: '#fb923c', bg: 'rgba(251,146,60,0.15)' },
  transition: { si: 'සංක්‍රාන්ති ලෝහ', en: 'Transition metal', color: '#facc15', bg: 'rgba(250,204,21,0.14)' },
  post: { si: 'පශ්චාත්-සංක්‍රාන්ති ලෝහ', en: 'Post-transition metal', color: '#38bdf8', bg: 'rgba(56,189,248,0.14)' },
  metalloid: { si: 'අර්ධ ලෝහ', en: 'Metalloid', color: '#22d3ee', bg: 'rgba(34,211,238,0.14)' },
  nonmetal: { si: 'වායු-ලෝහ නොවන', en: 'Non-metal', color: '#5eead4', bg: 'rgba(94,234,212,0.15)' },
  halogen: { si: 'හැලජන', en: 'Halogen', color: '#a78bfa', bg: 'rgba(167,139,250,0.16)' },
  noble: { si: 'උත්කෘෂ්ට වායු', en: 'Noble gas', color: '#c084fc', bg: 'rgba(192,132,252,0.16)' },
  lanthanide: { si: 'ලැන්තනයිඩ', en: 'Lanthanide', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  actinide: { si: 'ඇක්ටිනයිඩ', en: 'Actinide', color: '#cbd5e1', bg: 'rgba(203,213,225,0.10)' },
}

// ආවර්තිතා ප්‍රවණතා ප්‍රස්තාර සඳහා කුලක
export const TREND_SETS = [
  { id: 'p3', si: 'ආවර්තය 3', en: 'Period 3', syms: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'] },
  { id: 'p2', si: 'ආවර්තය 2', en: 'Period 2', syms: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'] },
  { id: 'g1', si: 'කාණ්ඩය 1', en: 'Group 1', syms: ['Li', 'Na', 'K', 'Rb', 'Cs'] },
  { id: 'g2', si: 'කාණ්ඩය 2', en: 'Group 2', syms: ['Be', 'Mg', 'Ca', 'Sr', 'Ba'] },
  { id: 'g17', si: 'කාණ්ඩය 17', en: 'Group 17', syms: ['F', 'Cl', 'Br', 'I'] },
]

// ආවර්තය 3 ඔක්සයිඩ — ජලය / අම්ල / භෂ්ම සමඟ හැසිරීම
export const PERIOD3_OXIDES = [
  {
    id: 'na2o',
    formula: 'Na₂O',
    si: 'සෝඩියම් ඔක්සයිඩ්',
    element: 'Na',
    typeSi: 'මූලික ඔක්සයිඩ්',
    typeEn: 'Basic oxide',
    ph: 13,
    water: 'Na₂O + H₂O → 2NaOH (ප්‍රබල භෂ්මීය ද්‍රාවණය)',
    acid: 'Na₂O + 2HCl → 2NaCl + H₂O (උදාසීනීකරණය)',
    base: 'ප්‍රතික්‍රියා නොකරයි',
    note: 'ලෝහ ඔක්සයිඩයක් — ජලය සමඟ ප්‍රතික්‍රියා කර භෂ්මයක් සාදයි.',
  },
  {
    id: 'mgo',
    formula: 'MgO',
    si: 'මැග්නීසියම් ඔක්සයිඩ්',
    element: 'Mg',
    typeSi: 'මූලික ඔක්සයිඩ්',
    typeEn: 'Basic oxide',
    ph: 10.5,
    water: 'MgO + H₂O → Mg(OH)₂ (මන්දගාමී; දුර්වල ද්‍රාව්‍යතාව)',
    acid: 'MgO + 2HCl → MgCl₂ + H₂O',
    base: 'ප්‍රතික්‍රියා නොකරයි',
    note: 'අධි උෂ්ණත්වයේ දී Mg පුළුස්සා MgO සාදයි — දහනයේදී දීප්තිමත් සුදු ආලෝකයක් නිකුත් වේ.',
  },
  {
    id: 'al2o3',
    formula: 'Al₂O₃',
    si: 'ඇලුමිනියම් ඔක්සයිඩ්',
    element: 'Al',
    typeSi: 'ඇම්ෆොටරික ඔක්සයිඩ්',
    typeEn: 'Amphoteric oxide',
    ph: 7,
    water: 'ප්‍රතික්‍රියා නොකරයි (අක්‍රීය)',
    acid: 'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O',
    base: 'Al₂O₃ + 2NaOH + 3H₂O → 2Na[Al(OH)₄]',
    note: 'ඇම්ෆොටරික — අම්ල හා භෂ්ම දෙක සමඟම ප්‍රතික්‍රියා කරයි.',
  },
  {
    id: 'sio2',
    formula: 'SiO₂',
    si: 'සිලිකන් ඩයොක්සයිඩ්',
    element: 'Si',
    typeSi: 'අම්ලීය ඔක්සයිඩ් (දුර්වල)',
    typeEn: 'Acidic oxide',
    ph: 5,
    water: 'ප්‍රතික්‍රියා නොකරයි',
    acid: 'HF හැර අනෙක් අම්ල සමඟ ප්‍රතික්‍රියා නොකරයි',
    base: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O (උණුසුම්, සාන්ද්‍ර)',
    note: 'යෝගී ස්වභාවයේ අම්ලීය ඔක්සයිඩයක්; උණු කළ NaOH සමඟ පමණක් ප්‍රතික්‍රියා කරයි.',
  },
  {
    id: 'p4o10',
    formula: 'P₄O₁₀',
    si: 'පොස්ෆරස් (V) ඔක්සයිඩ්',
    element: 'P',
    typeSi: 'අම්ලීය ඔක්සයිඩ්',
    typeEn: 'Acidic oxide',
    ph: 2,
    water: 'P₄O₁₀ + 6H₂O → 4H₃PO₄ (බලවත් තෙතමනා අවශෝෂකයකි)',
    acid: 'අම්ල සමඟ ප්‍රතික්‍රියා නොකරයි',
    base: 'P₄O₁₀ + 12NaOH → 4Na₃PO₄ + 6H₂O',
    note: 'ඉතා ප්‍රබල විජලන කාරකයකි; තෙතමනය අවශෝෂණය කරයි.',
  },
  {
    id: 'so3',
    formula: 'SO₃',
    si: 'සල්ෆර් (VI) ඔක්සයිඩ්',
    element: 'S',
    typeSi: 'අම්ලීය ඔක්සයිඩ්',
    typeEn: 'Acidic oxide',
    ph: 1,
    water: 'SO₃ + H₂O → H₂SO₄ (ඉතා ප්‍රචණ්ඩ)',
    acid: 'අම්ල සමඟ ප්‍රතික්‍රියා නොකරයි',
    base: 'SO₃ + 2NaOH → Na₂SO₄ + H₂O',
    note: 'සම්බන්ධතා ක්‍රියාවලියේ (contact process) අතරමැදිය; අම්ල වැසි සෑදීමට දායක වේ.',
  },
  {
    id: 'cl2o7',
    formula: 'Cl₂O₇',
    si: 'ඩයික්ලෝරීන් හෙප්ටොක්සයිඩ්',
    element: 'Cl',
    typeSi: 'අම්ලීය ඔක්සයිඩ් (ඉතා ප්‍රබල)',
    typeEn: 'Acidic oxide',
    ph: 1,
    water: 'Cl₂O₇ + H₂O → 2HClO₄',
    acid: 'අම්ල සමඟ ප්‍රතික්‍රියා නොකරයි',
    base: 'Cl₂O₇ + 2NaOH → 2NaClO₄ + H₂O',
    note: 'ක්ලෝරීන්හි ඉහළම ඔක්සිකරණ අවස්ථාව (+7) සහිත ඔක්සයිඩය.',
  },
]
