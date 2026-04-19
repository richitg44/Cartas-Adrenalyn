import { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus, Minus, Download, Search, X, Check,
  AlertCircle, Copy, Trash2, RotateCcw, Edit2, ChevronDown
} from "lucide-react";

// ============================================================
// DATOS DE CARTAS (478 total)
// ============================================================
const CARDS = [
  // D. Alavés (1-18)
  [1, "Escudo"], [2, "Sivera"], [3, "Raúl Fernández"], [4, "Jonny"],
  [5, "Tenaglia"], [6, "Pacheco"], [7, "Parada"], [8, "Moussa Diarra"],
  [9, "Blanco"], [10, "Guevara"], [11, "Guridi"], [12, "Aleñá"],
  [13, "Pablo Ibáñez"], [14, "Denis Suárez"], [15, "Carlos Vicente"],
  [16, "Toni Martínez"], [17, "Boyé"], [18, "Mariano"],
  // Athletic Club (19-36)
  [19, "Escudo"], [20, "Unai Simón"], [21, "Padilla"], [22, "Areso"],
  [23, "Vivian"], [24, "Paredes"], [25, "Laporte"], [26, "Yuri"],
  [27, "Ruiz de Galarreta"], [28, "Jauregizar"], [29, "Vesga"],
  [30, "Unai Gómez"], [31, "Sancet"], [32, "Berenguer"], [33, "Williams"],
  [34, "Maroan"], [35, "Guruzeta"], [36, "Nico Williams"],
  // Atlético de Madrid (37-54)
  [37, "Escudo"], [38, "Oblak"], [39, "Musso"], [40, "Marcos Llorente"],
  [41, "Le Normand"], [42, "Lenglet"], [43, "Hancko"], [44, "Ruggeri"],
  [45, "Koke"], [46, "Barrios"], [47, "Gallagher"], [48, "Álex Baena"],
  [49, "Almada"], [50, "Nico González"], [51, "Giuliano"],
  [52, "Julián Álvarez"], [53, "Sorloth"], [54, "Griezmann"],
  // FC Barcelona (55-72)
  [55, "Escudo"], [56, "Joan García"], [57, "Szczesny"], [58, "Koundé"],
  [59, "Cubarsí"], [60, "Eric García"], [61, "Araújo"], [62, "Balde"],
  [63, "De Jong"], [64, "Gavi"], [65, "Pedri"], [66, "Fermín"],
  [67, "Dani Olmo"], [68, "Raphinha"], [69, "Lamine Yamal"],
  [70, "Ferran Torres"], [71, "Lewandowski"], [72, "Rashford"],
  // Real Betis (73-90)
  [73, "Escudo"], [74, "Pau López"], [75, "Valles"], [76, "Bellerín"],
  [77, "Bartra"], [78, "Diego Llorente"], [79, "Natan"], [80, "Valentín Gómez"],
  [81, "Junior"], [82, "Altimira"], [83, "Amrabat"], [84, "Pablo Fornals"],
  [85, "Lo Celso"], [86, "Isco"], [87, "Antony"], [88, "Cucho Hernández"],
  [89, "Riquelme"], [90, "Abde"],
  // RC Celta (91-108)
  [91, "Escudo"], [92, "Radu"], [93, "Iván Villar"], [94, "Javi Rueda"],
  [95, "Javi Rodríguez"], [96, "Starfelt"], [97, "Marcos Alonso"],
  [98, "Mingueza"], [99, "Carreira"], [100, "Ilaix Moriba"],
  [101, "Fran Beltrán"], [102, "Sotelo"], [103, "Hugo Álvarez"],
  [104, "Swedberg"], [105, "Bryan Zaragoza"], [106, "Iago Aspas"],
  [107, "Borja Iglesias"], [108, "Jutglà"],
  // Elche CF (109-126)
  [109, "Escudo"], [110, "Iñaki Peña"], [111, "Dituro"], [112, "Álvaro Núñez"],
  [113, "Chust"], [114, "Bigas"], [115, "Affengruber"], [116, "Pedrosa"],
  [117, "Fede Redondo"], [118, "Germán Valera"], [119, "Martim Neto"],
  [120, "Febas"], [121, "Marc Aguado"], [122, "Rodri Mendoza"],
  [123, "Josan"], [124, "Álvaro Rodríguez"], [125, "André Silva"],
  [126, "Rafa Mir"],
  // RCD Espanyol (127-144)
  [127, "Escudo"], [128, "Dmitrovic"], [129, "Fortuño"], [130, "El Hilali"],
  [131, "Calero"], [132, "Riedel"], [133, "Cabrera"], [134, "Carlos Romero"],
  [135, "Pol Lozano"], [136, "Urko"], [137, "Edu Expósito"], [138, "Terrats"],
  [139, "Antoniu Roca"], [140, "Dolan"], [141, "Roberto Fernández"],
  [142, "Kike García"], [143, "Puado"], [144, "Pere Milla"],
  // Getafe CF (145-162)
  [145, "Escudo"], [146, "David Soria"], [147, "Letacek"], [148, "Iglesias"],
  [149, "Kiko Femenía"], [150, "Djené"], [151, "Domingos Duarte"],
  [152, "Abqar"], [153, "Diego Rico"], [154, "Davinchi"], [155, "Mario Martín"],
  [156, "Arambarri"], [157, "Milla"], [158, "Neyou"], [159, "Javi Muñoz"],
  [160, "Borja Mayoral"], [161, "Liso"], [162, "Coba"],
  // Girona FC (163-180)
  [163, "Escudo"], [164, "Gazzaniga"], [165, "Livakovic"], [166, "Arnau"],
  [167, "Hugo Rincón"], [168, "Vitor Reis"], [169, "Blind"], [170, "Francés"],
  [171, "Álex Moreno"], [172, "Witsel"], [173, "Ounahi"], [174, "Iván Martín"],
  [175, "Yáser Asprilla"], [176, "Joel Roca"], [177, "Tsygankov"],
  [178, "Vanat"], [179, "Stuani"], [180, "Bryan Gil"],
  // Levante UD (181-198)
  [181, "Escudo"], [182, "Ryan"], [183, "Pablo Campos"], [184, "Toljan"],
  [185, "Dela"], [186, "Elgezabal"], [187, "Matías Moreno"], [188, "Manu Sánchez"],
  [189, "Pampín"], [190, "Oriol Rey"], [191, "Pablo Martínez"],
  [192, "Olasagasti"], [193, "Vencedor"], [194, "Carlos Álvarez"],
  [195, "Morales"], [196, "Brugué"], [197, "Iván Romero"], [198, "Etta Eyong"],
  // Real Madrid (199-216)
  [199, "Escudo"], [200, "Courtois"], [201, "Lunin"], [202, "Carvajal"],
  [203, "Trent"], [204, "Militao"], [205, "Huijsen"], [206, "Rüdiger"],
  [207, "Carreras"], [208, "Tchouaméni"], [209, "Fede Valverde"],
  [210, "Bellingham"], [211, "Güler"], [212, "Mastantuono"], [213, "Rodrygo"],
  [214, "Mbappé"], [215, "Gonzalo"], [216, "Vinícius"],
  // RCD Mallorca (217-234)
  [217, "Escudo"], [218, "Leo Román"], [219, "Bergström"], [220, "Morey"],
  [221, "Maffeo"], [222, "Valjent"], [223, "Raíllo"], [224, "Kumbulla"],
  [225, "Mojica"], [226, "Samú Costa"], [227, "Antonio Sánchez"],
  [228, "Darder"], [229, "Morlanes"], [230, "Pablo Torre"], [231, "Asano"],
  [232, "Muriqi"], [233, "Mateo Joseph"], [234, "Jan Virgili"],
  // CA Osasuna (235-252)
  [235, "Escudo"], [236, "Sergio Herrera"], [237, "Aitor Fernández"],
  [238, "Rosier"], [239, "Boyomo"], [240, "Catena"], [241, "Herrando"],
  [242, "Juan Cruz"], [243, "Abel Bretones"], [244, "Torró"], [245, "Moncayola"],
  [246, "Moi Gómez"], [247, "Rubén García"], [248, "Aimar Oroz"],
  [249, "Víctor Muñoz"], [250, "Raúl García"], [251, "Budimir"], [252, "Becker"],
  // Real Oviedo (253-270)
  [253, "Escudo"], [254, "Aarón Escandell"], [255, "Moldovan"],
  [256, "Nacho Vidal"], [257, "Eric Bailly"], [258, "David Carmo"],
  [259, "Dani Calvo"], [260, "Rahim Alhassane"], [261, "Colombatto"],
  [262, "Reina"], [263, "Dendoncker"], [264, "Cazorla"], [265, "Ilic"],
  [266, "Hassan"], [267, "Brekalo"], [268, "Ilyas Chaira"], [269, "Fede Viñas"],
  [270, "Rondón"],
  // Rayo Vallecano (271-288)
  [271, "Escudo"], [272, "Batalla"], [273, "Cárdenas"], [274, "Ratiu"],
  [275, "Balliu"], [276, "Lejeune"], [277, "Luiz Felipe"], [278, "Pep Chavarría"],
  [279, "Pathé Ciss"], [280, "Unai López"], [281, "Óscar Valentín"],
  [282, "Isi"], [283, "Pedro Díaz"], [284, "Álvaro García"], [285, "Fran Pérez"],
  [286, "Camello"], [287, "De Frutos"], [288, "Alemao"],
  // Real Sociedad (289-306)
  [289, "Escudo"], [290, "Remiro"], [291, "Marrero"], [292, "Aramburu"],
  [293, "Aritz Elustondo"], [294, "Zubeldia"], [295, "Caleta-Car"],
  [296, "Sergio Gómez"], [297, "Gorrotxategi"], [298, "Turrientes"],
  [299, "Pablo Marín"], [300, "Carlos Soler"], [301, "Brais Méndez"],
  [302, "Kubo"], [303, "Barrenetxea"], [304, "Oyarzabal"], [305, "Óskarsson"],
  [306, "Guedes"],
  // Sevilla FC (307-324)
  [307, "Escudo"], [308, "Vlachodimos"], [309, "Nyland"], [310, "Carmona"],
  [311, "Juanlu"], [312, "Azpilicueta"], [313, "Kike Salas"], [314, "Marcao"],
  [315, "Suazo"], [316, "Gudelj"], [317, "Agoumé"], [318, "Sow"],
  [319, "Batista Mendy"], [320, "Vargas"], [321, "Ejuke"], [322, "Isaac Romero"],
  [323, "Akor Adams"], [324, "Alexis Sánchez"],
  // Valencia CF (325-342)
  [325, "Escudo"], [326, "Agirrezabala"], [327, "Dimitrievski"],
  [328, "Foulquier"], [329, "Correia"], [330, "Tárrega"], [331, "Copete"],
  [332, "Diakhaby"], [333, "Gayà"], [334, "Pepelu"], [335, "Santamaria"],
  [336, "Javi Guerra"], [337, "André Almeida"], [338, "Luis Rioja"],
  [339, "Diego López"], [340, "Ramazani"], [341, "Danjuma"], [342, "Hugo Duro"],
  // Villarreal CF (343-360)
  [343, "Escudo"], [344, "Luiz Júnior"], [345, "Arnau Tenas"], [346, "Mouriño"],
  [347, "Foyth"], [348, "Rafa Marín"], [349, "Renato Veiga"],
  [350, "Sergi Cardona"], [351, "Santi Comesaña"], [352, "Pape Gueye"],
  [353, "Parejo"], [354, "Thomas"], [355, "Moleiro"], [356, "Buchanan"],
  [357, "Mikautadze"], [358, "Pépé"], [359, "Oluwaseyi"], [360, "Ayoze"],
  // ¡Vamos! (361-380)
  [361, "D. Alavés"], [362, "Athletic Club"], [363, "Atlético de Madrid"],
  [364, "FC Barcelona"], [365, "Real Betis"], [366, "RC Celta"],
  [367, "Elche CF"], [368, "RCD Espanyol"], [369, "Getafe CF"],
  [370, "Girona FC"], [371, "Levante UD"], [372, "Real Madrid"],
  [373, "RCD Mallorca"], [374, "CA Osasuna"], [375, "Real Oviedo"],
  [376, "Rayo Vallecano"], [377, "Real Sociedad"], [378, "Sevilla FC"],
  [379, "Valencia CF"], [380, "Villarreal CF"],
  // Guantes de Oro (381-387)
  [381, "Sivera"], [382, "Joan García"], [383, "David Soria"],
  [384, "Sergio Herrera"], [385, "Batalla"], [386, "Remiro"],
  [387, "Agirrezabala"],
  // Kryptonita (388-396)
  [388, "Laporte"], [389, "Vivian"], [390, "Le Normand"], [391, "Affengruber"],
  [392, "Cabrera"], [393, "Militao"], [394, "Lejeune"], [395, "Tárrega"],
  [396, "Mouriño"],
  // Diamantes (397-414)
  [397, "Rego"], [398, "Dro"], [399, "Valentín Gómez"], [400, "Pablo García"],
  [401, "Rodri Mendoza"], [402, "Riedel"], [403, "Davinchi"], [404, "Liso"],
  [405, "Vitor Reis"], [406, "Joel Roca"], [407, "Carlos Álvarez"],
  [408, "Etta Eyong"], [409, "Fran González"], [410, "Gonzalo"],
  [411, "Jan Virgili"], [412, "Mateo Joseph"], [413, "Víctor Muñoz"],
  [414, "Renato Veiga"],
  // Influencers (415-423)
  [415, "Barrios"], [416, "Sotelo"], [417, "Febas"], [418, "Edu Expósito"],
  [419, "Milla"], [420, "Darder"], [421, "Aimar Oroz"], [422, "Cazorla"],
  [423, "Unai López"],
  // Protas (424-441)
  [424, "Tenaglia"], [425, "Carlos Vicente"], [426, "Eric García"],
  [427, "Cucho Hernández"], [428, "Borja Iglesias"], [429, "Dolan"],
  [430, "Vanat"], [431, "Manu Sánchez"], [432, "Tchouaméni"], [433, "Leo Román"],
  [434, "Aarón Escandell"], [435, "Hassan"], [436, "Carlos Soler"],
  [437, "Gorrotxategi"], [438, "Batista Mendy"], [439, "Alexis Sánchez"],
  [440, "Danjuma"], [441, "Buchanan"],
  // Super Cracks (442-467)
  [442, "Unai Simón"], [443, "Jauregizar"], [444, "Oblak"],
  [445, "Marcos Llorente"], [446, "Álex Baena"], [447, "Almada"],
  [448, "Griezmann"], [449, "Koundé"], [450, "Balde"], [451, "Raphinha"],
  [452, "Lewandowski"], [453, "Rashford"], [454, "Isco"], [455, "Lo Celso"],
  [456, "Antony"], [457, "Courtois"], [458, "Carreras"], [459, "Fede Valverde"],
  [460, "Mastantuono"], [461, "Budimir"], [462, "Isi"], [463, "Kubo"],
  [464, "Vargas"], [465, "Javi Guerra"], [466, "Moleiro"], [467, "Pépé"],
  // Especiales (468-478)
  [468, "Card Champions"], [469, "Nico Williams"], [470, "Julián Álvarez"],
  [471, "Pedri"], [472, "Lamine Yamal"], [473, "Vinícius"], [474, "Mbappé"],
  [475, "Balón de Oro Excellence"], [476, "Card Atómica"],
  [477, "Card Invencible"], [478, "Campeón Card"],
];

// Grupos: rangos y colores
const GROUPS = [
  { id: "alaves", name: "D. Alavés", start: 1, end: 18, color: "#1E3A8A" },
  { id: "athletic", name: "Athletic Club", start: 19, end: 36, color: "#DC2626" },
  { id: "atletico", name: "Atlético de Madrid", start: 37, end: 54, color: "#B91C1C" },
  { id: "barcelona", name: "FC Barcelona", start: 55, end: 72, color: "#7C2D12" },
  { id: "betis", name: "Real Betis", start: 73, end: 90, color: "#15803D" },
  { id: "celta", name: "RC Celta", start: 91, end: 108, color: "#0891B2" },
  { id: "elche", name: "Elche CF", start: 109, end: 126, color: "#047857" },
  { id: "espanyol", name: "RCD Espanyol", start: 127, end: 144, color: "#1D4ED8" },
  { id: "getafe", name: "Getafe CF", start: 145, end: 162, color: "#1E40AF" },
  { id: "girona", name: "Girona FC", start: 163, end: 180, color: "#B91C1C" },
  { id: "levante", name: "Levante UD", start: 181, end: 198, color: "#1E3A8A" },
  { id: "madrid", name: "Real Madrid", start: 199, end: 216, color: "#7C3AED" },
  { id: "mallorca", name: "RCD Mallorca", start: 217, end: 234, color: "#991B1B" },
  { id: "osasuna", name: "CA Osasuna", start: 235, end: 252, color: "#DC2626" },
  { id: "oviedo", name: "Real Oviedo", start: 253, end: 270, color: "#1E40AF" },
  { id: "rayo", name: "Rayo Vallecano", start: 271, end: 288, color: "#DC2626" },
  { id: "sociedad", name: "Real Sociedad", start: 289, end: 306, color: "#1E40AF" },
  { id: "sevilla", name: "Sevilla FC", start: 307, end: 324, color: "#B91C1C" },
  { id: "valencia", name: "Valencia CF", start: 325, end: 342, color: "#F59E0B" },
  { id: "villarreal", name: "Villarreal CF", start: 343, end: 360, color: "#EAB308" },
  { id: "vamos", name: "¡Vamos!", start: 361, end: 380, color: "#8B5CF6" },
  { id: "guantes", name: "Guantes de Oro", start: 381, end: 387, color: "#F59E0B" },
  { id: "kryptonita", name: "Kryptonita", start: 388, end: 396, color: "#10B981" },
  { id: "diamantes", name: "Diamantes", start: 397, end: 414, color: "#06B6D4" },
  { id: "influencers", name: "Influencers", start: 415, end: 423, color: "#EC4899" },
  { id: "protas", name: "Protas", start: 424, end: 441, color: "#F97316" },
  { id: "supercracks", name: "Super Cracks", start: 442, end: 467, color: "#EAB308" },
  { id: "especiales", name: "Especiales", start: 468, end: 478, color: "#DC2626" },
];

// Cartas precargadas del checklist analizado
const INITIAL_OWNED = [
  1, 3, 11, 15,
  19, 20, 21, 24, 27, 35, 36,
  37, 40, 41, 43, 45, 48, 49, 50, 52, 54,
  60, 64, 70, 72,
  74, 80, 84, 85, 88,
  93, 101, 102, 104, 106,
  112, 119, 126,
  127, 128, 133, 134, 135, 143,
  147, 151, 156, 159, 160,
  165, 166, 171, 172, 176, 178, 179,
  181, 182, 184, 187, 190, 197, 198,
  199, 208, 215, 216,
  221, 224, 229, 230, 233,
  235, 236, 243, 247,
  255, 257, 261,
  276, 283, 285, 288,
  297, 300,
  310, 311, 322,
  331, 332, 338, 342,
  343, 344, 350, 352, 359,
  361, 364, 365, 372, 375, 379,
  382, 386,
  390, 393,
  401, 402, 403, 413, 414,
  416, 418,
  426, 437,
  446, 448, 455, 456, 459,
  468, 470, 473, 474,
];

const STORAGE_KEY = "adrenalyn_tracker_v2";
const LEGACY_STORAGE_KEY = "adrenalyn_tracker_v1";

// Util: obtener grupo de una carta
const getGroup = (n) => GROUPS.find(g => n >= g.start && n <= g.end);

// Util: descargar texto como archivo
const downloadText = (text, filename) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function App() {
  const [counts, setCounts] = useState({});
  const [bisCounts, setBisCounts] = useState({});
  const [view, setView] = useState("coleccion");
  const [quickInput, setQuickInput] = useState("");
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const inputRef = useRef(null);

  // Carga inicial desde storage (con migración desde v1)
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result && result.value) {
          const data = JSON.parse(result.value);
          setCounts(data.counts || {});
          setBisCounts(data.bisCounts || {});
        } else {
          // Intentar migrar desde v1
          let legacy = null;
          try {
            legacy = await window.storage.get(LEGACY_STORAGE_KEY);
          } catch {}
          let initCounts;
          if (legacy && legacy.value) {
            initCounts = JSON.parse(legacy.value);
          } else {
            initCounts = {};
            INITIAL_OWNED.forEach(n => { initCounts[n] = 1; });
          }
          setCounts(initCounts);
          setBisCounts({});
          await window.storage.set(
            STORAGE_KEY,
            JSON.stringify({ counts: initCounts, bisCounts: {} })
          );
        }
      } catch (e) {
        const init = {};
        INITIAL_OWNED.forEach(n => { init[n] = 1; });
        setCounts(init);
        setBisCounts({});
      }
      setLoaded(true);
    })();
  }, []);

  // Guardar: siempre persiste counts + bisCounts juntos
  const saveAll = async (nextCounts, nextBis) => {
    try {
      await window.storage.set(
        STORAGE_KEY,
        JSON.stringify({ counts: nextCounts, bisCounts: nextBis })
      );
    } catch (e) {
      console.error(e);
    }
  };

  const persist = async (newCounts) => {
    setCounts(newCounts);
    await saveAll(newCounts, bisCounts);
  };

  const persistBis = async (newBis) => {
    setBisCounts(newBis);
    await saveAll(counts, newBis);
  };

  // Toast
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Quick add: procesa input separado por espacios/comas.
  // Acepta también sufijo "b" o "bis" para la cara reversa (ej. "47b", "47bis").
  const handleQuickAdd = () => {
    const raw = quickInput.trim();
    if (!raw) return;
    const tokens = raw.split(/[\s,.;]+/).filter(Boolean);
    const parsed = tokens.map(t => {
      const m = t.match(/^(\d+)(b|bis)?$/i);
      if (!m) return null;
      const n = parseInt(m[1], 10);
      if (isNaN(n) || n < 1 || n > 478) return null;
      return { n, bis: !!m[2] };
    }).filter(Boolean);
    if (parsed.length === 0) {
      showToast("Número no válido (1-478, opcional sufijo 'b' o 'bis')", "error");
      return;
    }
    const newCounts = { ...counts };
    const newBis = { ...bisCounts };
    let added = 0, duplicated = 0;
    const details = [];
    parsed.forEach(({ n, bis }) => {
      const target = bis ? newBis : newCounts;
      const current = target[n] || 0;
      target[n] = current + 1;
      const card = CARDS.find(c => c[0] === n);
      const label = card ? card[1] : "";
      const tag = bis ? " BIS" : "";
      if (current === 0) {
        added++;
        details.push(`✓ #${n}${tag} ${label}`);
      } else {
        duplicated++;
        details.push(`⚠ #${n}${tag} repetida (x${current + 1})`);
      }
    });
    setCounts(newCounts);
    setBisCounts(newBis);
    saveAll(newCounts, newBis);
    setQuickInput("");
    let summary = "";
    if (parsed.length === 1) {
      summary = details[0];
    } else {
      summary = `${added} nueva${added !== 1 ? "s" : ""} · ${duplicated} repe${duplicated !== 1 ? "s" : ""}`;
    }
    showToast(summary, duplicated > added ? "warn" : "success");
    inputRef.current?.focus();
  };

  const incCard = (n) => {
    const newCounts = { ...counts };
    newCounts[n] = (newCounts[n] || 0) + 1;
    persist(newCounts);
  };

  const decCard = (n) => {
    const newCounts = { ...counts };
    const current = newCounts[n] || 0;
    if (current <= 1) {
      delete newCounts[n];
    } else {
      newCounts[n] = current - 1;
    }
    persist(newCounts);
  };

  const setCardCount = (n, count) => {
    const newCounts = { ...counts };
    if (count <= 0) {
      delete newCounts[n];
    } else {
      newCounts[n] = count;
    }
    persist(newCounts);
  };

  const incBis = (n) => {
    const next = { ...bisCounts };
    next[n] = (next[n] || 0) + 1;
    persistBis(next);
  };

  const decBis = (n) => {
    const next = { ...bisCounts };
    const current = next[n] || 0;
    if (current <= 1) {
      delete next[n];
    } else {
      next[n] = current - 1;
    }
    persistBis(next);
  };

  const setBisCardCount = (n, count) => {
    const next = { ...bisCounts };
    if (count <= 0) {
      delete next[n];
    } else {
      next[n] = count;
    }
    persistBis(next);
  };

  // Estadísticas
  const stats = useMemo(() => {
    const total = 478;
    const owned = Object.values(counts).filter(c => c > 0).length;
    const duplicates = Object.entries(counts)
      .filter(([, c]) => c > 1)
      .reduce((sum, [, c]) => sum + (c - 1), 0);
    const bisOwned = Object.values(bisCounts).filter(c => c > 0).length;
    const bisDuplicates = Object.entries(bisCounts)
      .filter(([, c]) => c > 1)
      .reduce((sum, [, c]) => sum + (c - 1), 0);
    return {
      total,
      owned,
      missing: total - owned,
      duplicates: duplicates + bisDuplicates,
      bisOwned,
      bisDuplicates,
    };
  }, [counts, bisCounts]);

  // Descargar faltantes
  const downloadMissing = () => {
    let text = "CARTAS QUE ME FALTAN — Adrenalyn XL LaLiga 2025-26\n";
    text += "=".repeat(55) + "\n";
    text += `Total faltantes: ${stats.missing} de ${stats.total}\n\n`;
    GROUPS.forEach(g => {
      const missing = [];
      for (let n = g.start; n <= g.end; n++) {
        if (!counts[n] || counts[n] === 0) {
          const card = CARDS.find(c => c[0] === n);
          missing.push(`  ${n} ${card ? card[1] : ""}`);
        }
      }
      if (missing.length > 0) {
        text += `\n${g.name} (${missing.length})\n`;
        text += "-".repeat(g.name.length + 10) + "\n";
        text += missing.join("\n") + "\n";
      }
    });
    const date = new Date().toISOString().slice(0, 10);
    downloadText(text, `faltantes_adrenalyn_${date}.txt`);
    showToast("Lista de faltantes descargada");
  };

  // Descargar repetidas
  const downloadDupes = () => {
    const dupes = Object.entries(counts)
      .filter(([, c]) => c > 1)
      .map(([n, c]) => ({ n: parseInt(n), count: c, bis: false }))
      .sort((a, b) => a.n - b.n);
    const bisDupes = Object.entries(bisCounts)
      .filter(([, c]) => c > 1)
      .map(([n, c]) => ({ n: parseInt(n), count: c, bis: true }))
      .sort((a, b) => a.n - b.n);
    let text = "CARTAS REPETIDAS PARA INTERCAMBIO — Adrenalyn XL LaLiga 2025-26\n";
    text += "=".repeat(65) + "\n";
    text += `Total de cartas repetidas: ${stats.duplicates}\n\n`;
    const allDupes = [...dupes, ...bisDupes];
    if (allDupes.length === 0) {
      text += "No tengo cartas repetidas actualmente.\n";
    } else {
      GROUPS.forEach(g => {
        const groupDupes = dupes.filter(d => d.n >= g.start && d.n <= g.end);
        const groupBis = bisDupes.filter(d => d.n >= g.start && d.n <= g.end);
        if (groupDupes.length === 0 && groupBis.length === 0) return;
        text += `\n${g.name}\n`;
        text += "-".repeat(g.name.length + 5) + "\n";
        groupDupes.forEach(d => {
          const card = CARDS.find(c => c[0] === d.n);
          const extras = d.count - 1;
          text += `  ${d.n} ${card ? card[1] : ""}  (tengo ${d.count}, ${extras} para cambiar)\n`;
        });
        groupBis.forEach(d => {
          const card = CARDS.find(c => c[0] === d.n);
          const extras = d.count - 1;
          text += `  ${d.n}bis ${card ? card[1] : ""}  (tengo ${d.count}, ${extras} para cambiar)\n`;
        });
      });
    }
    const date = new Date().toISOString().slice(0, 10);
    downloadText(text, `repetidas_adrenalyn_${date}.txt`);
    showToast("Lista de repetidas descargada");
  };

  // Copiar al portapapeles
  const copyMissing = async () => {
    const nums = [];
    for (let n = 1; n <= 478; n++) {
      if (!counts[n] || counts[n] === 0) nums.push(n);
    }
    try {
      await navigator.clipboard.writeText(nums.join(", "));
      showToast(`${nums.length} números copiados`);
    } catch {
      showToast("No se pudo copiar", "error");
    }
  };

  const copyDupes = async () => {
    const parts = [];
    Object.entries(counts)
      .filter(([, c]) => c > 1)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .forEach(([n, c]) => {
        parts.push(`${n} (x${c - 1})`);
      });
    Object.entries(bisCounts)
      .filter(([, c]) => c > 1)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .forEach(([n, c]) => {
        parts.push(`${n}bis (x${c - 1})`);
      });
    try {
      await navigator.clipboard.writeText(parts.join(", "));
      showToast(`${parts.length} repetidas copiadas`);
    } catch {
      showToast("No se pudo copiar", "error");
    }
  };

  const resetAll = async () => {
    setCounts({});
    setBisCounts({});
    await saveAll({}, {});
    setConfirmReset(false);
    showToast("Colección reiniciada");
  };

  // Cartas filtradas según búsqueda y grupo
  const filteredCards = useMemo(() => {
    let list = CARDS;
    if (groupFilter !== "all") {
      const g = GROUPS.find(x => x.id === groupFilter);
      if (g) list = list.filter(c => c[0] >= g.start && c[0] <= g.end);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(c =>
        c[1].toLowerCase().includes(q) || c[0].toString() === q
      );
    }
    return list;
  }, [searchTerm, groupFilter]);

  const missingCards = useMemo(() => {
    return CARDS.filter(c => !counts[c[0]] || counts[c[0]] === 0);
  }, [counts]);

  const dupeCards = useMemo(() => {
    return CARDS.filter(c =>
      (counts[c[0]] || 0) > 1 || (bisCounts[c[0]] || 0) > 1
    );
  }, [counts, bisCounts]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-semibold">Cargando colección...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-slate-900 to-slate-900/95 backdrop-blur border-b border-orange-500/20 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">
                <span className="text-orange-500">ADRENALYN</span>
                <span className="text-slate-100"> XL</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                LaLiga 2025-26 · Mi colección
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-orange-500 leading-none">
                {stats.owned}<span className="text-slate-600 text-lg">/{stats.total}</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">
                {Math.round((stats.owned / stats.total) * 100)}% completo
              </div>
              {stats.bisOwned > 0 && (
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider mt-0.5 font-semibold">
                  +{stats.bisOwned} bis
                </div>
              )}
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all"
              style={{ width: `${(stats.owned / stats.total) * 100}%` }}
            />
          </div>

          {/* Quick add input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
                placeholder="Número(s) de carta..."
                className="w-full bg-slate-800 border border-slate-700 focus:border-orange-500 rounded-lg px-3 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {quickInput && (
                <button
                  onClick={() => setQuickInput("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={handleQuickAdd}
              className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold px-4 rounded-lg flex items-center gap-1 shadow-md shadow-orange-500/20 transition-colors"
            >
              <Plus size={18} />
              <span className="text-sm">Añadir</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5 px-1">
            Separa con espacios o comas. Añade <span className="text-cyan-400">b</span> o <span className="text-cyan-400">bis</span> para la reversa: <span className="text-slate-400">12, 47b, 130bis</span>
          </p>
        </div>
      </header>

      {/* Tabs */}
      <nav className="sticky top-[152px] z-10 bg-slate-950 border-b border-slate-800">
        <div className="flex">
          {[
            { id: "coleccion", label: "Colección", count: stats.owned, color: "text-emerald-400" },
            { id: "faltantes", label: "Faltantes", count: stats.missing, color: "text-red-400" },
            { id: "repetidas", label: "Repetidas", count: stats.duplicates, color: "text-amber-400" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex-1 py-3 px-2 text-center border-b-2 transition-all ${
                view === tab.id
                  ? "border-orange-500 bg-slate-900/50"
                  : "border-transparent"
              }`}
            >
              <div className={`text-xs font-bold uppercase tracking-wider ${view === tab.id ? "text-slate-100" : "text-slate-500"}`}>
                {tab.label}
              </div>
              <div className={`text-lg font-black ${view === tab.id ? tab.color : "text-slate-600"}`}>
                {tab.count}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido */}
      <main className="px-4 py-4">
        {view === "coleccion" && (
          <ColeccionView
            cards={filteredCards}
            counts={counts}
            bisCounts={bisCounts}
            onInc={incCard}
            onDec={decCard}
            onSetCount={setCardCount}
            onBisInc={incBis}
            onBisDec={decBis}
            onBisSetCount={setBisCardCount}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            groupFilter={groupFilter}
            setGroupFilter={setGroupFilter}
            onReset={() => setConfirmReset(true)}
          />
        )}

        {view === "faltantes" && (
          <FaltantesView
            missingCards={missingCards}
            onInc={incCard}
            onDownload={downloadMissing}
            onCopy={copyMissing}
          />
        )}

        {view === "repetidas" && (
          <RepetidasView
            dupeCards={dupeCards}
            counts={counts}
            bisCounts={bisCounts}
            onInc={incCard}
            onDec={decCard}
            onSetCount={setCardCount}
            onBisInc={incBis}
            onBisDec={decBis}
            onBisSetCount={setBisCardCount}
            onDownload={downloadDupes}
            onCopy={copyDupes}
          />
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-sm px-4 py-3 rounded-xl shadow-2xl font-medium text-sm flex items-start gap-2 animate-fadeIn ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : toast.type === "warn"
              ? "bg-amber-500 text-slate-900"
              : "bg-emerald-500 text-white"
          }`}
        >
          {toast.type === "error" ? <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> : <Check size={18} className="flex-shrink-0 mt-0.5" />}
          <span className="whitespace-pre-line">{toast.msg}</span>
        </div>
      )}

      {/* Reset confirm */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 mb-2">¿Reiniciar colección?</h3>
            <p className="text-sm text-slate-400 mb-5">
              Vas a borrar todos los datos guardados. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={resetAll}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold"
              >
                Sí, borrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}

// ========== VISTA COLECCIÓN ==========
function ColeccionView({ cards, counts, bisCounts, onInc, onDec, onSetCount, onBisInc, onBisDec, onBisSetCount, searchTerm, setSearchTerm, groupFilter, setGroupFilter, onReset }) {
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const currentGroup = groupFilter === "all"
    ? { name: "Todos los equipos" }
    : GROUPS.find(g => g.id === groupFilter);

  return (
    <div>
      {/* Filtros */}
      <div className="mb-3 space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o número..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-9 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setGroupMenuOpen(!groupMenuOpen)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm flex items-center justify-between hover:border-slate-700"
          >
            <span className="text-slate-300">{currentGroup.name}</span>
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${groupMenuOpen ? "rotate-180" : ""}`} />
          </button>
          {groupMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-10 max-h-80 overflow-y-auto">
              <button
                onClick={() => { setGroupFilter("all"); setGroupMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 ${groupFilter === "all" ? "bg-slate-800 text-orange-400" : "text-slate-300"}`}
              >
                Todos los equipos
              </button>
              {GROUPS.map(g => (
                <button
                  key={g.id}
                  onClick={() => { setGroupFilter(g.id); setGroupMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 border-l-4 ${groupFilter === g.id ? "bg-slate-800 text-orange-400" : "text-slate-300"}`}
                  style={{ borderLeftColor: g.color }}
                >
                  {g.name}
                  <span className="text-slate-600 text-xs ml-2">{g.start}-{g.end}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-1">
        {cards.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No hay cartas que coincidan
          </div>
        ) : (
          cards.map(c => (
            <CardRow
              key={c[0]}
              number={c[0]}
              name={c[1]}
              count={counts[c[0]] || 0}
              bisCount={bisCounts[c[0]] || 0}
              onInc={() => onInc(c[0])}
              onDec={() => onDec(c[0])}
              onSetCount={(n) => onSetCount(c[0], n)}
              onBisInc={() => onBisInc(c[0])}
              onBisDec={() => onBisDec(c[0])}
              onBisSetCount={(n) => onBisSetCount(c[0], n)}
            />
          ))
        )}
      </div>

      {/* Reset */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={onReset}
          className="w-full py-2.5 text-xs text-slate-500 hover:text-red-400 flex items-center justify-center gap-1"
        >
          <RotateCcw size={14} />
          Reiniciar toda la colección
        </button>
      </div>
    </div>
  );
}

// ========== VISTA FALTANTES ==========
function FaltantesView({ missingCards, onInc, onDownload, onCopy }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={onDownload}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg py-2.5 px-3 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Download size={16} className="text-orange-400" />
          Descargar .txt
        </button>
        <button
          onClick={onCopy}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg py-2.5 px-3 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Copy size={16} className="text-orange-400" />
          Copiar números
        </button>
      </div>

      {missingCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-3">🏆</div>
          <p className="text-emerald-400 font-bold text-lg">¡Colección completa!</p>
          <p className="text-slate-500 text-sm mt-1">Ya tienes las 478 cartas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {GROUPS.map(g => {
            const missing = missingCards.filter(c => c[0] >= g.start && c[0] <= g.end);
            if (missing.length === 0) return null;
            return (
              <div key={g.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: g.color }} />
                  <h3 className="font-bold text-sm text-slate-200">{g.name}</h3>
                  <span className="text-xs text-slate-500">({missing.length} faltantes)</span>
                </div>
                <div className="space-y-1">
                  {missing.map(c => (
                    <div key={c[0]} className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2">
                      <div className="text-xs font-mono text-slate-500 w-10">#{c[0]}</div>
                      <div className="flex-1 text-sm text-slate-300">{c[1]}</div>
                      <button
                        onClick={() => onInc(c[0])}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md p-1.5"
                        title="Ya la tengo"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ========== VISTA REPETIDAS ==========
function RepetidasView({ dupeCards, counts, bisCounts, onInc, onDec, onSetCount, onBisInc, onBisDec, onBisSetCount, onDownload, onCopy }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={onDownload}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg py-2.5 px-3 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Download size={16} className="text-amber-400" />
          Descargar .txt
        </button>
        <button
          onClick={onCopy}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg py-2.5 px-3 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Copy size={16} className="text-amber-400" />
          Copiar resumen
        </button>
      </div>

      {dupeCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🎯</div>
          <p className="text-slate-300 font-bold">Sin repetidas</p>
          <p className="text-slate-500 text-sm mt-1">
            Cuando añadas una carta que ya tienes, aparecerá aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {GROUPS.map(g => {
            const dupes = dupeCards.filter(c => c[0] >= g.start && c[0] <= g.end);
            if (dupes.length === 0) return null;
            return (
              <div key={g.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: g.color }} />
                  <h3 className="font-bold text-sm text-slate-200">{g.name}</h3>
                </div>
                <div className="space-y-1">
                  {dupes.map(c => (
                    <CardRow
                      key={c[0]}
                      number={c[0]}
                      name={c[1]}
                      count={counts[c[0]] || 0}
                      bisCount={bisCounts[c[0]] || 0}
                      onInc={() => onInc(c[0])}
                      onDec={() => onDec(c[0])}
                      onSetCount={(n) => onSetCount(c[0], n)}
                      onBisInc={() => onBisInc(c[0])}
                      onBisDec={() => onBisDec(c[0])}
                      onBisSetCount={(n) => onBisSetCount(c[0], n)}
                      showExtras
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ========== FILA DE CARTA ==========
function CardRow({
  number, name, count, bisCount = 0,
  onInc, onDec, onSetCount,
  onBisInc, onBisDec, onBisSetCount,
  showExtras,
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(count.toString());
  const [editingBis, setEditingBis] = useState(false);
  const [editBisValue, setEditBisValue] = useState(bisCount.toString());
  const group = getGroup(number);
  const owned = count > 0;
  const hasDupes = count > 1;
  const bisOwned = bisCount > 0;
  const bisHasDupes = bisCount > 1;
  const anyOwned = owned || bisOwned;
  const anyDupes = hasDupes || bisHasDupes;

  const handleSaveEdit = () => {
    const n = parseInt(editValue, 10);
    if (!isNaN(n) && n >= 0) {
      onSetCount(n);
    }
    setEditing(false);
  };

  const handleSaveBisEdit = () => {
    const n = parseInt(editBisValue, 10);
    if (!isNaN(n) && n >= 0 && onBisSetCount) {
      onBisSetCount(n);
    }
    setEditingBis(false);
  };

  const bisAvailable = typeof onBisInc === "function";

  return (
    <div
      className={`flex rounded-lg border transition-colors ${
        anyDupes
          ? "bg-amber-500/10 border-amber-500/30"
          : anyOwned
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-slate-900/50 border-slate-800"
      }`}
    >
      <div
        className="w-1 self-stretch rounded-l-lg flex-shrink-0"
        style={{ backgroundColor: group?.color || "#334155" }}
      />
      <div className="flex-1 min-w-0 py-2 pr-2 pl-2">
        {/* Fila principal: carta normal */}
        <div className="flex items-center gap-2 min-w-0">
          <div className={`text-xs font-mono w-10 flex-shrink-0 ${owned ? "text-slate-300" : "text-slate-600"}`}>
            #{number}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-sm truncate ${owned ? "text-slate-100 font-medium" : "text-slate-500"}`}>
              {name}
            </div>
            {showExtras && hasDupes && (
              <div className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold">
                {count - 1} para intercambiar · tengo {count}
              </div>
            )}
          </div>

          {editing ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                autoFocus
                className="w-14 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-center"
              />
              <button
                onClick={handleSaveEdit}
                className="bg-emerald-500 text-white p-1 rounded"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={onDec}
                disabled={count === 0}
                className={`p-1.5 rounded-md transition-colors ${
                  count === 0
                    ? "text-slate-700 cursor-not-allowed"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => { setEditValue(count.toString()); setEditing(true); }}
                className={`min-w-[36px] px-2 py-1 rounded-md text-sm font-bold ${
                  hasDupes
                    ? "bg-amber-500 text-slate-900"
                    : owned
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-800 text-slate-500"
                }`}
                title="Tocar para editar"
              >
                {count}
              </button>
              <button
                onClick={onInc}
                className="p-1.5 rounded-md bg-orange-500/20 hover:bg-orange-500/30 text-orange-300"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Sub-fila: versión BIS (reversa) */}
        {bisAvailable && (
          <div className="flex items-center gap-2 min-w-0 mt-1.5 pt-1.5 border-t border-slate-800/70">
            <div className="w-10 flex-shrink-0" />
            <div className="flex-1 min-w-0 flex items-center gap-2">
              <span
                className={`text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded ${
                  bisHasDupes
                    ? "bg-amber-500 text-slate-900"
                    : bisOwned
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                BIS
              </span>
              {showExtras && bisHasDupes && (
                <span className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold">
                  {bisCount - 1} para intercambiar · tengo {bisCount}
                </span>
              )}
            </div>

            {editingBis ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  value={editBisValue}
                  onChange={(e) => setEditBisValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveBisEdit()}
                  autoFocus
                  className="w-14 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-center"
                />
                <button
                  onClick={handleSaveBisEdit}
                  className="bg-emerald-500 text-white p-1 rounded"
                >
                  <Check size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={onBisDec}
                  disabled={bisCount === 0}
                  className={`p-1 rounded-md transition-colors ${
                    bisCount === 0
                      ? "text-slate-700 cursor-not-allowed"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <Minus size={12} />
                </button>
                <button
                  onClick={() => { setEditBisValue(bisCount.toString()); setEditingBis(true); }}
                  className={`min-w-[30px] px-1.5 py-0.5 rounded-md text-xs font-bold ${
                    bisHasDupes
                      ? "bg-amber-500 text-slate-900"
                      : bisOwned
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-slate-800 text-slate-600"
                  }`}
                  title="Tocar para editar"
                >
                  {bisCount}
                </button>
                <button
                  onClick={onBisInc}
                  className="p-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
