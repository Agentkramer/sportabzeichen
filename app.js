    // ============================================
    // SUPABASE CONFIG
    // ============================================
    const SUPABASE_URL = 'https://uuawbivebnknxnegrolu.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1YXdiaXZlYm5rbnhuZWdyb2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTg5MTksImV4cCI6MjA4NTY3NDkxOX0.T5RCoPZSGuyRSxon-LNWAgefXf_WWN7VN4tBoIzwprQ';
    
    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // ============================================
    // KLASSENLISTE
    // ============================================

const AVAILABLE_CLASSES = [
    '5a', '5b', '5c',
    '6a', '6b', '6c',
    '7a', '7b', '7c',
    '8a', '8b', '8c',
    '9a', '9b', '9c',
    '10a', '10b', '10c'
];

    // ============================================
    // LEISTUNGSTABELLEN
    // ============================================
    const PERFORMANCE_DATA = {
      weiblich: {
        "10-11": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "05:20", silber: "04:40", gold: "04:00", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 15, silber: 20, gold: 30, lowerIsBetter: false },
            "schwimmen_200m": { unit: "min:sec", bronze: "07:20", silber: "06:25", gold: "05:30", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "50:30", silber: "43:00", gold: "35:30", lowerIsBetter: true },
          },
          kraft: {
            "schlagball_80g": { unit: "m", bronze: 11, silber: 15, gold: 18, lowerIsBetter: false },
            "medizinball_1kg": { unit: "m", bronze: 5.0, silber: 6.0, gold: 7.0, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.30, silber: 1.45, gold: 1.65, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 11.0, silber: 10.1, gold: 9.1, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 39.0, silber: 31.5, gold: 25.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 37.0, silber: 32.0, gold: 27.0, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.80, silber: 0.90, gold: 1.00, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 2.30, silber: 2.60, gold: 2.90, lowerIsBetter: false },
            "drehwurf": { unit: "Pkt", bronze: 27, silber: 30, gold: 36, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 20, silber: 30, gold: 40, lowerIsBetter: false, note: "Grundsprung vorwärts ohne Zwischensprung" },
          }
        },
        "12-13": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "05:10", silber: "04:25", gold: "03:45", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 20, silber: 30, gold: 40, lowerIsBetter: false },
            "schwimmen_400m": { unit: "min:sec", bronze: "14:50", silber: "12:55", gold: "11:00", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "45:00", silber: "39:30", gold: "33:30", lowerIsBetter: true },
          },
          kraft: {
            "schlagball_80g": { unit: "m", bronze: 15, silber: 18, gold: 22, lowerIsBetter: false },
            "kugel_3kg": { unit: "m", bronze: 4.75, silber: 5.25, gold: 5.75, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.40, silber: 1.60, gold: 1.80, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 10.6, silber: 9.6, gold: 8.5, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 35.0, silber: 29.0, gold: 23.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 31.0, silber: 27.0, gold: 23.5, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.90, silber: 1.00, gold: 1.10, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 2.80, silber: 3.10, gold: 3.40, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 17.0, silber: 19.5, gold: 22.0, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 20, gold: 30, lowerIsBetter: false, note: "Grundsprung rückwärts ohne Zwischensprung" },
          }
        },
        "14-15": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "05:00", silber: "04:20", gold: "03:35", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 30, silber: 40, gold: 50, lowerIsBetter: false },
            "schwimmen_400m": { unit: "min:sec", bronze: "13:05", silber: "11:40", gold: "10:00", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "38:00", silber: "32:30", gold: "28:30", lowerIsBetter: true },
          },
          kraft: {
            "wurfball_200g": { unit: "m", bronze: 20, silber: 24, gold: 27, lowerIsBetter: false },
            "kugel_3kg": { unit: "m", bronze: 5.50, silber: 6.00, gold: 6.50, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.55, silber: 1.70, gold: 1.90, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 18.6, silber: 17.0, gold: 15.5, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 33.0, silber: 27.5, gold: 21.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 27.0, silber: 24.5, gold: 21.5, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.95, silber: 1.05, gold: 1.15, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.20, silber: 3.50, gold: 3.80, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 19.5, silber: 22.5, gold: 25.5, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
          }
        },
        "16-17": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "04:50", silber: "04:05", gold: "03:25", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 45, silber: 60, gold: 75, lowerIsBetter: false },
            "schwimmen_400m": { unit: "min:sec", bronze: "11:50", silber: "10:30", gold: "09:05", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "32:30", silber: "28:30", gold: "25:00", lowerIsBetter: true },
          },
          kraft: {
            "wurfball_200g": { unit: "m", bronze: 24, silber: 27, gold: 31, lowerIsBetter: false },
            "kugel_3kg": { unit: "m", bronze: 5.75, silber: 6.25, gold: 6.75, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.65, silber: 1.80, gold: 2.00, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 17.6, silber: 16.3, gold: 15.0, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 30.5, silber: 25.5, gold: 20.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 25.0, silber: 22.5, gold: 20.0, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.05, silber: 1.15, gold: 1.25, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.40, silber: 3.70, gold: 4.00, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 22.0, silber: 25.0, gold: 28.0, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
          }
        }
      },
      maennlich: {
        "10-11": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "05:05", silber: "04:20", gold: "03:35", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 17, silber: 25, gold: 35, lowerIsBetter: false },
            "schwimmen_200m": { unit: "min:sec", bronze: "07:00", silber: "06:20", gold: "05:10", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "48:30", silber: "41:00", gold: "33:30", lowerIsBetter: true },
          },
          kraft: {
            "schlagball_80g": { unit: "m", bronze: 21, silber: 25, gold: 28, lowerIsBetter: false },
            "medizinball_1kg": { unit: "m", bronze: 5.5, silber: 6.5, gold: 7.5, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.50, silber: 1.70, gold: 1.85, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 10.3, silber: 9.3, gold: 8.4, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 36.0, silber: 29.0, gold: 22.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 35.0, silber: 30.5, gold: 26.0, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.85, silber: 0.95, gold: 1.05, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 2.60, silber: 2.90, gold: 3.20, lowerIsBetter: false },
            "drehwurf": { unit: "Pkt", bronze: 33, silber: 39, gold: 45, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 20, silber: 30, gold: 40, lowerIsBetter: false, note: "Grundsprung vorwärts ohne Zwischensprung" },
          }
        },
        "12-13": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "04:45", silber: "04:00", gold: "03:15", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 25, silber: 35, gold: 45, lowerIsBetter: false },
            "schwimmen_400m": { unit: "min:sec", bronze: "13:30", silber: "11:30", gold: "09:45", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "43:00", silber: "37:00", gold: "31:30", lowerIsBetter: true },
          },
          kraft: {
            "wurfball_200g": { unit: "m", bronze: 26, silber: 30, gold: 33, lowerIsBetter: false },
            "kugel_3kg": { unit: "m", bronze: 6.25, silber: 6.75, gold: 7.25, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.70, silber: 1.90, gold: 2.05, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 9.7, silber: 8.9, gold: 8.1, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 33.0, silber: 27.0, gold: 21.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 29.5, silber: 26.0, gold: 22.5, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.95, silber: 1.05, gold: 1.15, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.20, silber: 3.50, gold: 3.80, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 19.5, silber: 24.0, gold: 27.5, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 20, gold: 30, lowerIsBetter: false, note: "Grundsprung rückwärts ohne Zwischensprung" },
          }
        },
        "14-15": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "04:20", silber: "03:40", gold: "03:00", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 35, silber: 45, gold: 60, lowerIsBetter: false },
            "schwimmen_400m": { unit: "min:sec", bronze: "12:00", silber: "10:15", gold: "08:50", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "32:00", silber: "28:00", gold: "24:00", lowerIsBetter: true },
          },
          kraft: {
            "wurfball_200g": { unit: "m", bronze: 30, silber: 34, gold: 37, lowerIsBetter: false },
            "kugel_4kg": { unit: "m", bronze: 7.0, silber: 7.5, gold: 8.0, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.90, silber: 2.05, gold: 2.25, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 17.0, silber: 15.4, gold: 14.1, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 31.0, silber: 25.5, gold: 20.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 24.0, silber: 21.5, gold: 19.0, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.10, silber: 1.20, gold: 1.30, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.80, silber: 4.10, gold: 4.40, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 23.5, silber: 28.0, gold: 32.0, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
          }
        },
        "16-17": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "04:05", silber: "03:25", gold: "02:45", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 55, silber: 70, gold: 90, lowerIsBetter: false },
            "schwimmen_400m": { unit: "min:sec", bronze: "11:00", silber: "09:40", gold: "08:20", lowerIsBetter: true },
            "radfahren_10km": { unit: "min:sec", bronze: "27:00", silber: "23:30", gold: "20:30", lowerIsBetter: true },
          },
          kraft: {
            "wurfball_200g": { unit: "m", bronze: 34, silber: 38, gold: 42, lowerIsBetter: false },
            "kugel_5kg": { unit: "m", bronze: 7.5, silber: 8.0, gold: 8.5, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 2.05, silber: 2.20, gold: 2.40, lowerIsBetter: false },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 16.3, silber: 14.8, gold: 13.5, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 29.5, silber: 24.5, gold: 19.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 22.0, silber: 19.5, gold: 17.0, lowerIsBetter: true },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.20, silber: 1.30, gold: 1.40, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 4.30, silber: 4.60, gold: 4.90, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 27.5, silber: 32.0, gold: 36.5, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
          }
        }
      }
    };

    const EXERCISE_LABELS = {
      "800m_lauf": "800m Lauf",
      "dauer_gelaendelauf": "Dauer-/Geländelauf",
      "schwimmen_200m": "200m Schwimmen",
      "schwimmen_400m": "400m Schwimmen",
      "radfahren_10km": "10km Radfahren",
      "schlagball_80g": "Schlagball (80g)",
      "wurfball_200g": "Wurfball (200g)",
      "medizinball_1kg": "Medizinball (1kg)",
      "kugel_3kg": "Kugelstoßen (3kg)",
      "kugel_4kg": "Kugelstoßen (4kg)",
      "kugel_5kg": "Kugelstoßen (5kg)",
      "standweitsprung": "Standweitsprung",
      "lauf_50m": "50m Lauf",
      "lauf_100m": "100m Lauf",
      "schwimmen_25m": "25m Schwimmen",
      "radfahren_200m": "200m Radfahren",
      "hochsprung": "Hochsprung",
      "weitsprung": "Weitsprung",
      "drehwurf": "Drehwurf",
      "schleuderball_1kg": "Schleuderball (1kg)",
      "seilspringen": "Seilspringen",
    };

    const CATEGORIES = {
      ausdauer: { label: "Ausdauer", icon: "🏃" },
      kraft: { label: "Kraft", icon: "💪" },
      schnelligkeit: { label: "Schnelligkeit", icon: "⚡" },
      koordination: { label: "Koordination", icon: "🎯" }
    };

    // ============================================
    // HILFSFUNKTIONEN
    // ============================================
    
    function calculateAgeForYear(birthYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

function populateBirthYearDropdown() {
  const select = document.getElementById('birthYearInput');
  if (!select) return; // Falls noch nicht geladen
  
  const currentYear = new Date().getFullYear();
  
  // Leere erst vorhandene Optionen (außer der ersten)
  select.innerHTML = '<option value="">Geburtsjahr wählen</option>';
  
  // Schüler zwischen 10 und 17 Jahren
  for (let year = currentYear - 17; year <= currentYear - 10; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
  }
}

function populateClassNameDropdown() {
  const classNameInput = document.getElementById('classNameInput');
  
  // "Keine Klasse" Option ist bereits im HTML
  // Jetzt fügen wir die Klassen hinzu
  AVAILABLE_CLASSES.forEach(className => {
    const option = document.createElement('option');
    option.value = className;
    option.textContent = className;
    classNameInput.appendChild(option);
  });
}
 
function populateClassFilter() {
  const filterSelect = document.getElementById('classFilter');
  const currentValue = filterSelect.value; // 🔥 Aktuellen Wert merken
  
  // Sammle alle eindeutigen Klassen aus den Teilnehmern
  const usedClasses = [...new Set(
    participants
      .map(p => p.class_name)
      .filter(c => c)
  )].sort();
  
  // Leere Filter (außer "Alle Klassen")
filterSelect.innerHTML = '<option value="">Alle Klassen</option><option value="NO_CLASS">Ohne Klasse</option>';
  
  // Füge alle verwendeten Klassen hinzu
  usedClasses.forEach(className => {
    const option = document.createElement('option');
    option.value = className;
    option.textContent = className;
    filterSelect.appendChild(option);
  });
  
  // Stelle vorherige Auswahl wieder her
  filterSelect.value = currentValue; // 🔥 Wert wiederherstellen
}
    
    function timeToSeconds(timeStr) {
      if (typeof timeStr === 'number') return timeStr;
      const parts = timeStr.split(':');
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    function getAgeGroup(age) {
      if (age >= 10 && age <= 11) return "10-11";
      if (age >= 12 && age <= 13) return "12-13";
      if (age >= 14 && age <= 15) return "14-15";
      if (age >= 16 && age <= 17) return "16-17";
      return null;
    }

    function calculatePoints(value, exercise) {
      if (value === null || value === undefined || value === '') return 0;
      
      let numValue = parseFloat(String(value).replace(',', '.'));
      if (isNaN(numValue)) {
        if (String(value).includes(':')) {
          numValue = timeToSeconds(value);
        } else {
          return 0;
        }
      }
      
      let bronzeVal = exercise.bronze;
      let silberVal = exercise.silber;
      let goldVal = exercise.gold;
      
      if (exercise.unit === "min:sec") {
        bronzeVal = timeToSeconds(bronzeVal);
        silberVal = timeToSeconds(silberVal);
        goldVal = timeToSeconds(goldVal);
        if (String(value).includes(':')) {
          numValue = timeToSeconds(value);
        }
      }
      
      if (exercise.lowerIsBetter) {
        if (numValue <= goldVal) return 3;
        if (numValue <= silberVal) return 2;
        if (numValue <= bronzeVal) return 1;
        return 0;
      } else {
        if (numValue >= goldVal) return 3;
        if (numValue >= silberVal) return 2;
        if (numValue >= bronzeVal) return 1;
        return 0;
      }
    }

    function calculateOverallResult(points) {
      const categories = ['ausdauer', 'kraft', 'schnelligkeit', 'koordination'];
      const categoryPoints = categories.map(cat => points[cat] || 0);
      
      if (categoryPoints.some(p => p === 0)) {
        return { medal: null, total: categoryPoints.reduce((a, b) => a + b, 0) };
      }
      
      const total = categoryPoints.reduce((a, b) => a + b, 0);
      
      if (total >= 11) return { medal: 'gold', total };
      if (total >= 8) return { medal: 'silber', total };
      return { medal: 'bronze', total };
    }

    function getParticipantPoints(participant) {
  const age = calculateAgeForYear(participant.birth_year);  // ✅ Alter berechnen!
  const ageGroup = getAgeGroup(age);  // ✅ Mit berechnetem Alter
  const data = PERFORMANCE_DATA[participant.gender]?.[ageGroup];
  const points = {};
  
  if (data) {
    Object.keys(CATEGORIES).forEach(cat => {
      const catResults = participant.results?.[cat];
      if (catResults?.exercise && catResults?.value !== undefined && catResults?.value !== '') {
        const exercise = data[cat]?.[catResults.exercise];
        if (exercise) {
          points[cat] = calculatePoints(catResults.value, exercise);
        }
      }
    });
  }
  
  return points;
}

    function showLoading() {
      document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    function hideLoading() {
      document.getElementById('loadingOverlay').classList.add('hidden');
    }

    function setStatus(status, text) {
      const dot = document.getElementById('statusDot');
      const textEl = document.getElementById('statusText');
      dot.className = 'status-dot ' + status;
      textEl.textContent = text;
    }

    // ============================================
    // APP STATE
    // ============================================
    let participants = [];
    let editingId = null;
    let currentClassFilter = '';
    let currentPerformanceFilter = '';
    let importData = [];

    // DOM-Elemente
    const listView = document.getElementById('listView');
    const formView = document.getElementById('formView');
    const importView = document.getElementById('importView');
    const emptyState = document.getElementById('emptyState');
    const participantList = document.getElementById('participantList');
    const headerActions = document.getElementById('headerActions');
    const addBtn = document.getElementById('addBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const closeFormBtn = document.getElementById('closeFormBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveBtn = document.getElementById('saveBtn');
    const formTitle = document.getElementById('formTitle');
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const birthYearInput = document.getElementById('birthYearInput');
    const genderInput = document.getElementById('genderInput');
    const disciplinesForms = document.getElementById('disciplinesForms');

    // Import-Elemente
    const closeImportBtn = document.getElementById('closeImportBtn');
    const cancelImportBtn = document.getElementById('cancelImportBtn');
    const confirmImportBtn = document.getElementById('confirmImportBtn');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('fileInput');
    const importPreview = document.getElementById('importPreview');
    const previewContent = document.getElementById('previewContent');

    // ============================================
    // SUPABASE OPERATIONS
    // ============================================
  async function loadParticipants() {
  try {
    setStatus('loading', 'Lade Daten...');
    const { data, error } = await db
      .from('participants')
      .select('*')
      .order('last_name', { ascending: true });
    
    if (error) throw error;
    
    participants = data || [];
    setStatus('online', `${participants.length} Teilnehmer geladen`);
    renderList();
  } catch (err) {
    console.error('Fehler beim Laden:', err);
    setStatus('offline', 'Verbindung fehlgeschlagen');
  }
}
   async function saveParticipantToDb(participant) {
  showLoading();
  try {
    if (participant.id) {
      // UPDATE bestehender Teilnehmer
      const { error } = await db
        .from('participants')
        .update({
          first_name: participant.first_name,
          last_name: participant.last_name,
          birth_year: participant.birth_year,
          class_name: participant.class_name || null,
          gender: participant.gender,
          external_id: participant.external_id || null,
          results: participant.results
        })
        .eq('id', participant.id);
      if (error) throw error;
    } else {
      // INSERT neuer Teilnehmer
      const { error } = await db
        .from('participants')
        .insert({
          first_name: participant.first_name,
          last_name: participant.last_name,
          birth_year: participant.birth_year,
          class_name: participant.class_name || null,
          gender: participant.gender,
          external_id: participant.external_id || null,
          results: participant.results || {}
        });
      if (error) throw error;
    }
    await loadParticipants();
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    alert('Fehler beim Speichern: ' + err.message);
  }
  hideLoading();
}

    async function deleteParticipantFromDb(id) {
      if (!confirm('Teilnehmer wirklich löschen?')) return;
      
      showLoading();
      try {
        const { error } = await db
          .from('participants')
          .delete()
          .eq('id', id);
        if (error) throw error;
        await loadParticipants();
      } catch (err) {
        console.error('Fehler beim Löschen:', err);
        alert('Fehler beim Löschen: ' + err.message);
      }
      hideLoading();
    }

async function importParticipantsToDb(dataToImport) {
  showLoading();
  
  // Loading-Text-Element holen
  const loadingText = document.querySelector('.loading-text');
  
  try {
    let imported = 0;
    
    for (const p of dataToImport) {
      // Progress anzeigen
      loadingText.textContent = `Importiere ${imported + 1} / ${dataToImport.length}...`;
      
      // Check ob Teilnehmer mit external_id schon existiert
      if (p.external_id) {
        const { data: existing } = await db
          .from('participants')
          .select('id')
          .eq('external_id', p.external_id)
          .maybeSingle();
        
        if (existing) {
          // UPDATE bestehender Teilnehmer
          await db
            .from('participants')
            .update({
              first_name: p.first_name,
              last_name: p.last_name,
              birth_year: p.birth_year,
              class_name: p.class_name || null,
              gender: p.gender
            })
            .eq('id', existing.id);
          imported++;
          continue;
        }
      }
      
      // INSERT neuer Teilnehmer
      await db
        .from('participants')
        .insert({
          external_id: p.external_id || null,
          first_name: p.first_name,
          last_name: p.last_name,
          birth_year: p.birth_year,
          class_name: p.class_name || null,
          gender: p.gender,
          results: {}
        });
      
      imported++;
    }
    
    await loadParticipants();
    hideImport();
  } catch (err) {
    console.error('Fehler beim Import:', err);
    alert('Fehler beim Import: ' + err.message);
  }
  hideLoading();
}

   function renderList() {
  // Filter-Dropdown aktualisieren
  populateClassFilter();
  
  // Sortiere nach Nachname (alphabetisch)
  const sortedParticipants = [...participants].sort((a, b) => {
    return a.last_name.localeCompare(b.last_name);
  });
  
  // Filtere nach ausgewählter Klasse
const classFiltered = currentClassFilter 
  ? (currentClassFilter === 'NO_CLASS' 
      ? sortedParticipants.filter(p => !p.class_name)  // Ohne Klasse
      : sortedParticipants.filter(p => p.class_name === currentClassFilter))  // Spezifische Klasse
  : sortedParticipants;  // Alle
  
 // Filtere nach Leistungsstand
const filteredParticipants = currentPerformanceFilter
  ? classFiltered.filter(p => {
      const points = getParticipantPoints(p);
      
      if (currentPerformanceFilter === 'complete') {
        // Vollständig: ALLE 4 Disziplinen haben Punkte > 0
        return ['ausdauer', 'kraft', 'schnelligkeit', 'koordination'].every(
          d => points[d] && points[d] > 0
        );
      } else if (currentPerformanceFilter === 'incomplete') {
        // Unvollständig: MINDESTENS eine Disziplin fehlt oder hat 0 Punkte
        return ['ausdauer', 'kraft', 'schnelligkeit', 'koordination'].some(
          d => !points[d] || points[d] === 0
        );
      } else {
        // Spezifische Disziplin offen (fehlt oder ist 0)
        return !points[currentPerformanceFilter] || points[currentPerformanceFilter] === 0;
      }
    })
  : classFiltered;
  
// Filtere nach Suchbegriff
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const searchFiltered = searchTerm
    ? filteredParticipants.filter(p =>
        p.first_name.toLowerCase().includes(searchTerm) ||
        p.last_name.toLowerCase().includes(searchTerm)
      )
    : filteredParticipants;

  // Aktualisiere Teilnehmer-Zähler
const countDiv = document.getElementById('participantCount');
countDiv.textContent = `${searchFiltered.length} Teilnehmer`;
  
  // Prüfe, ob gefilterte Liste leer ist
if (searchFiltered.length === 0) {
  emptyState.classList.remove('hidden');
  participantList.innerHTML = '';
} else {
  emptyState.classList.add('hidden');
  
  participantList.innerHTML = searchFiltered.map(p => {
      
      const points = getParticipantPoints(p);
      const result = calculateOverallResult(points);
      const age = calculateAgeForYear(p.birth_year);
      let medalBadge = '';
      if (result.medal) {
        const medalEmoji = result.medal === 'gold' ? '🥇' : result.medal === 'silber' ? '🥈' : '🥉';
        const medalClass = `medal-${result.medal}`;
        medalBadge = `<span class="medal-badge ${medalClass}">${medalEmoji} ${result.medal.charAt(0).toUpperCase() + result.medal.slice(1)}</span>`;
      }
      
      return `
        <div class="card" data-id="${p.id}">
          <div class="card-header">
            <div>
              <div class="card-name">${p.first_name} ${p.last_name}${p.class_name ? ` (${p.class_name})` : ''}</div>
              <div class="card-meta">${age} Jahre, ${p.gender}</div>
            </div>
            ${medalBadge}
          </div>
          <div class="points-grid">
            ${Object.entries(CATEGORIES).map(([key, cat]) => `
              <div class="points-item">
                <div class="points-icon">${cat.icon}</div>
                <div class="points-value points-${points[key] || 0}">${points[key] || '-'}</div>
              </div>
            `).join('')}
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary edit-btn" data-id="${p.id}">Bearbeiten</button>
            <button class="btn btn-danger delete-btn" data-id="${p.id}">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
    
    // Event-Listener für Buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const participant = participants.find(p => p.id === id);
        if (participant) {
          loadParticipantToForm(participant);
          showForm(true);
        }
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteParticipantFromDb(btn.dataset.id);
      });
    });
  }
}

function renderDisciplineForms() {
  const birthYear = parseInt(birthYearInput.value);
  const gender = genderInput.value;
  
  if (!birthYear) {
    disciplinesForms.innerHTML = '<div class="form-section"><p style="color: #94a3b8; text-align: center;">Bitte Geburtsjahr wählen</p></div>';
    return;
  }
  
  const age = calculateAgeForYear(birthYear);
  
  if (age < 10 || age > 17) {
    disciplinesForms.innerHTML = '<div class="form-section"><p style="color: #94a3b8; text-align: center;">Ungültiges Geburtsjahr (Alter muss 10-17 Jahre sein)</p></div>';
    return;
  }
      
      const ageGroup = getAgeGroup(age);
      const data = PERFORMANCE_DATA[gender]?.[ageGroup];
      
      if (!data) {
        disciplinesForms.innerHTML = '<div class="form-section"><p style="color: #ef4444;">Keine Daten für diese Kombination</p></div>';
        return;
      }
      
      const currentResults = {};
      document.querySelectorAll('[data-category]').forEach(el => {
        const cat = el.dataset.category;
        const exerciseSelect = el.querySelector('.exercise-select');
        const valueInput = el.querySelector('.value-input');
        if (exerciseSelect && valueInput) {
          currentResults[cat] = {
            exercise: exerciseSelect.value,
            value: valueInput.value
          };
        }
      });
      
      disciplinesForms.innerHTML = Object.entries(CATEGORIES).map(([catKey, cat]) => {
        const exercises = data[catKey];
        const exerciseOptions = Object.keys(exercises).map(exKey => 
          `<option value="${exKey}">${EXERCISE_LABELS[exKey] || exKey}</option>`
        ).join('');
        
        return `
          <div class="form-section" data-category="${catKey}">
            <h3>${cat.icon} ${cat.label}</h3>
            <select class="exercise-select">
              <option value="">Übung wählen...</option>
              ${exerciseOptions}
            </select>
            <div class="exercise-details" id="details-${catKey}"></div>
          </div>
        `;
      }).join('');

      // Event-Listener für Übungsauswahl
      document.querySelectorAll('.exercise-select').forEach(select => {
        select.addEventListener('change', () => {
          const catKey = select.closest('[data-category]').dataset.category;
          updateExerciseInfo(catKey);
        });
      });
      
      Object.entries(currentResults).forEach(([cat, result]) => {
        const section = document.querySelector(`[data-category="${cat}"]`);
        if (section && result.exercise) {
          const select = section.querySelector('.exercise-select');
          if (select) {
            select.value = result.exercise;
            updateExerciseInfo(cat);
            setTimeout(() => {
              const valueInput = section.querySelector('.value-input');
              if (valueInput && result.value) {
                valueInput.value = result.value;
                updatePointsDisplay(cat);
              }
            }, 10);
          }
        }
      });
    }

    function updateExerciseInfo(catKey) {
  const birthYear = parseInt(birthYearInput.value);  // ✅ GEÄNDERT
  const gender = genderInput.value;
  
  if (!birthYear) return;  // ✅ NEU: Abbruch wenn kein Geburtsjahr
  
  const age = calculateAgeForYear(birthYear);  // ✅ NEU: Alter berechnen
  const ageGroup = getAgeGroup(age);
  const data = PERFORMANCE_DATA[gender]?.[ageGroup]?.[catKey];
  
  const section = document.querySelector(`[data-category="${catKey}"]`);
  const select = section.querySelector('.exercise-select');
  const detailsDiv = document.getElementById(`details-${catKey}`);
  
  const exerciseKey = select.value;
  if (!exerciseKey || !data?.[exerciseKey]) {
    detailsDiv.innerHTML = '';
    return;
  }
      
      const exercise = data[exerciseKey];
      const placeholder = exercise.unit === 'min:sec' ? 'MM:SS' : `Wert (${exercise.unit})`;
      
      detailsDiv.innerHTML = `
        <div class="result-input-group">
          <input type="text" class="value-input" placeholder="${placeholder}" inputmode="${exercise.unit === 'min:sec' ? 'text' : 'decimal'}">
          <div class="result-points result-points-0" id="points-${catKey}">0 Pkt</div>
        </div>
        <div class="thresholds">
          <span>🥉 ${exercise.bronze}${exercise.unit === 'min:sec' ? '' : ' ' + exercise.unit}</span>
          <span>🥈 ${exercise.silber}${exercise.unit === 'min:sec' ? '' : ' ' + exercise.unit}</span>
          <span>🥇 ${exercise.gold}${exercise.unit === 'min:sec' ? '' : ' ' + exercise.unit}</span>
        </div>
        ${exercise.note ? `<div class="exercise-note">${exercise.note}</div>` : ''}
      `;

      // Event-Listener für Wert-Eingabe
      const valueInput = section.querySelector('.value-input');
      valueInput.addEventListener('input', () => updatePointsDisplay(catKey));
    }

    function updatePointsDisplay(catKey) {
  const birthYear = parseInt(birthYearInput.value);  // ✅ GEÄNDERT
  const gender = genderInput.value;
  
  if (!birthYear) return;  // ✅ NEU: Abbruch wenn kein Geburtsjahr
  
  const age = calculateAgeForYear(birthYear);  // ✅ NEU: Alter berechnen
  const ageGroup = getAgeGroup(age);
  const data = PERFORMANCE_DATA[gender]?.[ageGroup]?.[catKey];
  
  const section = document.querySelector(`[data-category="${catKey}"]`);
  const select = section.querySelector('.exercise-select');
  const valueInput = section.querySelector('.value-input');
  const pointsDiv = document.getElementById(`points-${catKey}`);
  
  if (!select || !valueInput || !pointsDiv) return;
  
  const exerciseKey = select.value;
  const exercise = data?.[exerciseKey];
  
  if (!exercise) return;
  
  const points = calculatePoints(valueInput.value, exercise);
  pointsDiv.textContent = `${points} Pkt`;
  pointsDiv.className = `result-points result-points-${points}`;
}

    // ============================================
    // FORMULAR-AKTIONEN
    // ============================================
    function showForm(editing = false) {
      listView.classList.add('hidden');
      formView.classList.remove('hidden');
      headerActions.classList.add('hidden');
      formTitle.textContent = editing ? 'Teilnehmer bearbeiten' : 'Neuer Teilnehmer';
      if (!editing) {
        renderDisciplineForms();
      }
    }

    function hideForm() {
      formView.classList.add('hidden');
      listView.classList.remove('hidden');
      headerActions.classList.remove('hidden');
      resetForm();
    }

   function resetForm() {
      firstNameInput.value = '';
      lastNameInput.value = '';
      birthYearInput.value = ''; 
      document.getElementById('classNameInput').value = '';
      genderInput.value = 'weiblich';
      editingId = null;
      disciplinesForms.innerHTML = '';
    }

    function collectFormData() {
      const results = {};
      
      document.querySelectorAll('[data-category]').forEach(section => {
        const cat = section.dataset.category;
        const exerciseSelect = section.querySelector('.exercise-select');
        const valueInput = section.querySelector('.value-input');
        
        if (exerciseSelect?.value && valueInput?.value) {
          results[cat] = {
            exercise: exerciseSelect.value,
            value: valueInput.value
          };
        }
      });
      
        return {
            id: editingId,
            first_name: firstNameInput.value.trim(),
            last_name: lastNameInput.value.trim(),
            birth_year: parseInt(birthYearInput.value),
            class_name: document.getElementById('classNameInput').value || null,
            gender: genderInput.value,
            results
        };
    }

    function loadParticipantToForm(participant) {
      firstNameInput.value = participant.first_name || '';
      lastNameInput.value = participant.last_name || '';
      birthYearInput.value = participant.birth_year || '';
      document.getElementById('classNameInput').value = participant.class_name || '';
      genderInput.value = participant.gender;
      editingId = participant.id;
      
      renderDisciplineForms();
      
      setTimeout(() => {
        Object.entries(participant.results || {}).forEach(([cat, result]) => {
          const section = document.querySelector(`[data-category="${cat}"]`);
          if (section) {
            const select = section.querySelector('.exercise-select');
            if (select && result.exercise) {
              select.value = result.exercise;
              updateExerciseInfo(cat);
              
              setTimeout(() => {
                const valueInput = section.querySelector('.value-input');
                if (valueInput && result.value) {
                  valueInput.value = result.value;
                  updatePointsDisplay(cat);
                }
              }, 10);
            }
          }
        });
      }, 10);
    }

    async function handleSave() {
      const data = collectFormData();
      
      if (!data.first_name || !data.last_name) {
        alert('Bitte Vor- und Nachname eingeben');
        return;
    }
      
      await saveParticipantToDb(data);
      hideForm();
    }

    // ============================================
    // IMPORT
    // ============================================
function showImport() {

  listView.classList.add('hidden');
  importView.classList.remove('hidden');
  
  headerActions.classList.add('hidden');
  importData = [];
  importPreview.classList.add('hidden');
  confirmImportBtn.classList.add('hidden');
  fileInput.value = '';
  }
    function hideImport() {
      importView.classList.add('hidden');
      listView.classList.remove('hidden');
      headerActions.classList.remove('hidden');
      importData = [];
    }

function parseCSV(content) {
  const lines = content.split('\n').filter(l => l.trim());
  const results = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Versuche verschiedene Trennzeichen
    let parts = line.includes(';') ? line.split(';') : line.split(',');
    parts = parts.map(p => p.trim().replace(/^["']|["']$/g, ''));
    
    let firstName, lastName, birthYear, className, gender, externalId;
    
    if (parts.length >= 6 && !isNaN(parseInt(parts[3]))) {
      // Format: external_id;Vorname;Nachname;Geburtsjahr;Klasse;Geschlecht
      externalId = parts[0];
      firstName = parts[1];
      lastName = parts[2];
      birthYear = parseInt(parts[3]);
      className = parts[4] || null;
      gender = parts[5].toLowerCase();
    } else if (parts.length >= 5 && !isNaN(parseInt(parts[2]))) {
      // Format ohne external_id: Vorname;Nachname;Geburtsjahr;Klasse;Geschlecht
      firstName = parts[0];
      lastName = parts[1];
      birthYear = parseInt(parts[2]);
      className = parts[3] || null;
      gender = parts[4].toLowerCase();
      externalId = null;
    } else if (parts.length >= 4 && !isNaN(parseInt(parts[2]))) {
      // Altes Format ohne Klasse: Vorname;Nachname;Geburtsjahr;Geschlecht
      firstName = parts[0];
      lastName = parts[1];
      birthYear = parseInt(parts[2]);
      className = null;
      gender = parts[3].toLowerCase();
      externalId = null;
    } else if (parts.length >= 3) {
      // Sehr altes Format: Name;Geburtsjahr;Geschlecht (Name aufteilen)
      const nameParts = parts[0].split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
      birthYear = parseInt(parts[1]);
      className = null;
      gender = parts[2].toLowerCase();
      externalId = null;
    } else {
      continue; // Ungültige Zeile überspringen
    }
    
    // Geschlecht normalisieren
    if (gender === 'w' || gender === 'weiblich' || gender === 'f' || gender === 'female') {
      gender = 'weiblich';
    } else if (gender === 'm' || gender === 'männlich' || gender === 'maennlich' || gender === 'male') {
      gender = 'maennlich';
    } else {
      continue; // Ungültige Zeile überspringen
    }
    
    // Geburtsjahr validieren (zwischen 2009 und 2016 für 10-17 Jährige)
    if (firstName && birthYear >= currentYear - 17 && birthYear <= currentYear - 10) {
      results.push({ 
        external_id: externalId,
        first_name: firstName, 
        last_name: lastName, 
        birth_year: birthYear,
        class_name: className,
        gender 
      });
    }
  }
  
  return results;
}
    function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    importData = parseCSV(content);
    
    if (importData.length === 0) {
      previewContent.innerHTML = '<p style="color: #ef4444;">Keine gültigen Daten gefunden.<br>Format: Vorname;Nachname;Geburtsjahr;Klasse;Geschlecht</p>';
      importPreview.classList.remove('hidden');
      confirmImportBtn.classList.add('hidden');
      return;
    }
    
    previewContent.innerHTML = `
      <p style="color: #22c55e; margin-bottom: 0.5rem;">${importData.length} Teilnehmer erkannt:</p>
      <div style="max-height: 200px; overflow-y: auto;">
        ${importData.map(p => {
          const age = calculateAgeForYear(p.birth_year);  // ✅ Alter berechnen
          return `<div style="font-size: 0.85rem; padding: 0.25rem 0;">${p.first_name} ${p.last_name} (${age}J, ${p.gender})</div>`;
        }).join('')}
      </div>
    `;
    importPreview.classList.remove('hidden');
    confirmImportBtn.classList.remove('hidden');
  };
  reader.readAsText(file);
}

    // ============================================
    // CSV EXPORT
    // ============================================
    function exportCSV() {
      const headers = ['External_ID', 'Vorname', 'Nachname', 'Geburtsjahr', 'Klasse', 'Geschlecht', 'Ausdauer', 'Kraft', 'Schnelligkeit', 'Koordination', 'Gesamt', 'Ergebnis'];
      
      const rows = participants.map(p => {
        const age = calculateAgeForYear(p.birth_year);
        const points = getParticipantPoints(p);
        const result = calculateOverallResult(points);
        
        return [
  p.external_id || '',
  p.first_name,
  p.last_name,
  p.birth_year,
  p.class_name || '',
  p.gender,
  points.ausdauer || 0,
  points.kraft || 0,
  points.schnelligkeit || 0,
  points.koordination || 0,
  result.total,
  result.medal ? result.medal.charAt(0).toUpperCase() + result.medal.slice(1) : 'Nicht bestanden'
].join(';');
      });
      
      const csv = [headers.join(';'), ...rows].join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sportabzeichen_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

// ============================================
// EVENT LISTENERS
// ============================================
addBtn.addEventListener('click', () => {
  resetForm();
  showForm(false);
});

closeFormBtn.addEventListener('click', hideForm);
cancelBtn.addEventListener('click', hideForm);
saveBtn.addEventListener('click', handleSave);
exportBtn.addEventListener('click', exportCSV);
importBtn.addEventListener('click', showImport);

closeImportBtn.addEventListener('click', hideImport);
cancelImportBtn.addEventListener('click', hideImport);
selectFileBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
confirmImportBtn.addEventListener('click', () => importParticipantsToDb(importData));

birthYearInput.addEventListener('change', renderDisciplineForms);
genderInput.addEventListener('change', renderDisciplineForms);

document.getElementById('classFilter').addEventListener('change', (e) => {
   currentClassFilter = e.target.value;
  renderList();
 });

document.getElementById('performanceFilter').addEventListener('change', (e) => {
  currentPerformanceFilter = e.target.value;
  renderList();
});

document.getElementById('searchInput').addEventListener('input', renderList);

    // ============================================
    // SERVICE WORKER & INIT
    // ============================================
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registriert'))
        .catch(err => console.log('Service Worker Fehler:', err));
    }

    // App starten
    populateBirthYearDropdown();
    populateClassNameDropdown();
    loadParticipants();
