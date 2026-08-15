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
        "8-9": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "05:35", silber: "04:50", gold: "04:10", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false },
            "schwimmen_200m": { unit: "min:sec", bronze: "08:00", silber: "07:00", gold: "05:55", lowerIsBetter: true },
            "radfahren_5km": { unit: "min:sec", bronze: "27:00", silber: "24:00", gold: "21:00", lowerIsBetter: true },
          },
          kraft: {
            "schlagball_80g": { unit: "m", bronze: 9, silber: 12, gold: 15, lowerIsBetter: false },
            "medizinball_1kg": { unit: "m", bronze: 3.00, silber: 4.00, gold: 5.00, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.15, silber: 1.30, gold: 1.50, lowerIsBetter: false },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          },
          schnelligkeit: {
            "lauf_30m": { unit: "sec", bronze: 7.4, silber: 6.6, gold: 5.7, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 42.0, silber: 34.0, gold: 28.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 41.0, silber: 36.0, gold: 31.0, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          },
          koordination: {
            "zonenweitsprung": { unit: "Pkt", bronze: 24, silber: 27, gold: 30, lowerIsBetter: false },
            "drehwurf": { unit: "Pkt", bronze: 18, silber: 21, gold: 27, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 25, lowerIsBetter: false, note: "Grundsprung vorwärts ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          }
        },
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
            "geraetturnen": { type: "turnen", geraet: "Barren" },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 11.0, silber: 10.1, gold: 9.1, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 39.0, silber: 31.5, gold: 25.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 37.0, silber: 32.0, gold: 27.0, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.80, silber: 0.90, gold: 1.00, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 2.30, silber: 2.60, gold: 2.90, lowerIsBetter: false },
            "drehwurf": { unit: "Pkt", bronze: 27, silber: 30, gold: 36, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 20, silber: 30, gold: 40, lowerIsBetter: false, note: "Grundsprung vorwärts ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Ringe" },
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
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 10.6, silber: 9.6, gold: 8.5, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 35.0, silber: 29.0, gold: 23.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 31.0, silber: 27.0, gold: 23.5, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.90, silber: 1.00, gold: 1.10, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 2.80, silber: 3.10, gold: 3.40, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 17.0, silber: 19.5, gold: 22.0, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 20, gold: 30, lowerIsBetter: false, note: "Grundsprung rückwärts ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
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
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 18.6, silber: 17.0, gold: 15.5, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 33.0, silber: 27.5, gold: 21.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 27.0, silber: 24.5, gold: 21.5, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.95, silber: 1.05, gold: 1.15, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.20, silber: 3.50, gold: 3.80, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 19.5, silber: 22.5, gold: 25.5, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
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
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 17.6, silber: 16.3, gold: 15.0, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 30.5, silber: 25.5, gold: 20.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 25.0, silber: 22.5, gold: 20.0, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.05, silber: 1.15, gold: 1.25, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.40, silber: 3.70, gold: 4.00, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 22.0, silber: 25.0, gold: 28.0, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          }
        },
        "18-19": {
          ausdauer: {
            "lauf_3000m": { unit: "min:sec", bronze: "20:50", silber: "18:50", gold: "16:50", lowerIsBetter: true },
            "lauf_10km": { unit: "min:sec", bronze: "84:40", silber: "78:40", gold: "72:40", lowerIsBetter: true },
            "nordic_walking_7_5km": { unit: "min:sec", bronze: "69:30", silber: "66:00", gold: "62:00", lowerIsBetter: true },
            "schwimmen_800m": { unit: "min:sec", bronze: "24:00", silber: "21:10", gold: "18:25", lowerIsBetter: true },
            "radfahren_20km": { unit: "min:sec", bronze: "57:30", silber: "52:00", gold: "46:30", lowerIsBetter: true },
          },
          kraft: {
            "medizinball_2kg": { unit: "m", bronze: 8.00, silber: 9.00, gold: 10.00, lowerIsBetter: false },
            "kugel_4kg": { unit: "m", bronze: 6.50, silber: 7.00, gold: 7.50, lowerIsBetter: false },
            "steinstossen_5kg": { unit: "m", bronze: 10.65, silber: 11.25, gold: 11.85, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.65, silber: 1.85, gold: 2.05, lowerIsBetter: false },
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 18.2, silber: 16.5, gold: 15.3, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 29.5, silber: 24.0, gold: 18.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 24.0, silber: 22.0, gold: 19.5, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.10, silber: 1.20, gold: 1.30, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.40, silber: 3.70, gold: 4.00, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 23.50, silber: 26.50, gold: 29.00, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 5, silber: 10, gold: 15, lowerIsBetter: false, note: "Doppeldurchschlag mit oder ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          }
        }
      },
      maennlich: {
        "8-9": {
          ausdauer: {
            "800m_lauf": { unit: "min:sec", bronze: "05:25", silber: "04:40", gold: "03:55", lowerIsBetter: true },
            "dauer_gelaendelauf": { unit: "min", bronze: 12, silber: 17, gold: 23, lowerIsBetter: false },
            "schwimmen_200m": { unit: "min:sec", bronze: "08:00", silber: "06:45", gold: "05:40", lowerIsBetter: true },
            "radfahren_5km": { unit: "min:sec", bronze: "26:30", silber: "23:30", gold: "20:30", lowerIsBetter: true },
          },
          kraft: {
            "schlagball_80g": { unit: "m", bronze: 17, silber: 20, gold: 23, lowerIsBetter: false },
            "medizinball_1kg": { unit: "m", bronze: 3.00, silber: 4.00, gold: 5.00, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 1.30, silber: 1.50, gold: 1.65, lowerIsBetter: false },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          },
          schnelligkeit: {
            "lauf_30m": { unit: "sec", bronze: 7.2, silber: 6.4, gold: 5.7, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 41.0, silber: 33.0, gold: 26.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 38.0, silber: 33.0, gold: 28.0, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          },
          koordination: {
            "zonenweitsprung": { unit: "Pkt", bronze: 27, silber: 30, gold: 33, lowerIsBetter: false },
            "drehwurf": { unit: "Pkt", bronze: 21, silber: 27, gold: 33, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 25, lowerIsBetter: false, note: "Grundsprung vorwärts ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          }
        },
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
            "geraetturnen": { type: "turnen", geraet: "Barren" },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 10.3, silber: 9.3, gold: 8.4, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 36.0, silber: 29.0, gold: 22.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 35.0, silber: 30.5, gold: 26.0, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.85, silber: 0.95, gold: 1.05, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 2.60, silber: 2.90, gold: 3.20, lowerIsBetter: false },
            "drehwurf": { unit: "Pkt", bronze: 33, silber: 39, gold: 45, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 20, silber: 30, gold: 40, lowerIsBetter: false, note: "Grundsprung vorwärts ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Ringe" },
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
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          },
          schnelligkeit: {
            "lauf_50m": { unit: "sec", bronze: 9.7, silber: 8.9, gold: 8.1, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 33.0, silber: 27.0, gold: 21.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 29.5, silber: 26.0, gold: 22.5, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 0.95, silber: 1.05, gold: 1.15, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.20, silber: 3.50, gold: 3.80, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 19.5, silber: 24.0, gold: 27.5, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 20, gold: 30, lowerIsBetter: false, note: "Grundsprung rückwärts ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
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
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 17.0, silber: 15.4, gold: 14.1, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 31.0, silber: 25.5, gold: 20.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 24.0, silber: 21.5, gold: 19.0, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.10, silber: 1.20, gold: 1.30, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 3.80, silber: 4.10, gold: 4.40, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 23.5, silber: 28.0, gold: 32.0, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
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
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 16.3, silber: 14.8, gold: 13.5, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 29.5, silber: 24.5, gold: 19.0, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 22.0, silber: 19.5, gold: 17.0, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.20, silber: 1.30, gold: 1.40, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 4.30, silber: 4.60, gold: 4.90, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 27.5, silber: 32.0, gold: 36.5, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 10, silber: 15, gold: 20, lowerIsBetter: false, note: "Kreuzdurchschlag ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
          }
        },
        "18-19": {
          ausdauer: {
            "lauf_3000m": { unit: "min:sec", bronze: "17:50", silber: "15:50", gold: "13:50", lowerIsBetter: true },
            "lauf_10km": { unit: "min:sec", bronze: "63:20", silber: "57:20", gold: "51:20", lowerIsBetter: true },
            "nordic_walking_7_5km": { unit: "min:sec", bronze: "58:30", silber: "54:30", gold: "50:30", lowerIsBetter: true },
            "schwimmen_800m": { unit: "min:sec", bronze: "22:35", silber: "19:50", gold: "17:00", lowerIsBetter: true },
            "radfahren_20km": { unit: "min:sec", bronze: "47:00", silber: "42:30", gold: "38:30", lowerIsBetter: true },
          },
          kraft: {
            "medizinball_2kg": { unit: "m", bronze: 11.00, silber: 13.00, gold: 14.00, lowerIsBetter: false },
            "kugel_6kg": { unit: "m", bronze: 7.75, silber: 8.25, gold: 8.75, lowerIsBetter: false },
            "steinstossen_10kg": { unit: "m", bronze: 9.30, silber: 10.10, gold: 10.95, lowerIsBetter: false },
            "standweitsprung": { unit: "m", bronze: 2.10, silber: 2.30, gold: 2.50, lowerIsBetter: false },
            "geraetturnen": { type: "turnen", geraet: "Reck" },
          },
          schnelligkeit: {
            "lauf_100m": { unit: "sec", bronze: 16.0, silber: 14.6, gold: 13.2, lowerIsBetter: true },
            "schwimmen_25m": { unit: "sec", bronze: 28.0, silber: 23.0, gold: 17.5, lowerIsBetter: true },
            "radfahren_200m": { unit: "sec", bronze: 20.5, silber: 18.0, gold: 15.5, lowerIsBetter: true },
            "geraetturnen": { type: "turnen", geraet: "Sprung" },
          },
          koordination: {
            "hochsprung": { unit: "m", bronze: 1.30, silber: 1.40, gold: 1.50, lowerIsBetter: false },
            "weitsprung": { unit: "m", bronze: 4.50, silber: 4.80, gold: 5.10, lowerIsBetter: false },
            "schleuderball_1kg": { unit: "m", bronze: 31.50, silber: 36.00, gold: 40.50, lowerIsBetter: false },
            "seilspringen": { unit: "Anz", bronze: 5, silber: 10, gold: 15, lowerIsBetter: false, note: "Doppeldurchschlag mit oder ohne Zwischensprung" },
            "geraetturnen": { type: "turnen", geraet: "Boden" },
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
      "geraetturnen": "Gerätturnen",
      "radfahren_5km": "5km Radfahren",
      "lauf_30m": "30m Lauf",
      "zonenweitsprung": "Zonenweitsprung (Punkte)",
      "lauf_3000m": "3000m Lauf",
      "lauf_10km": "10km Lauf",
      "nordic_walking_7_5km": "7,5km Nordic Walking",
      "schwimmen_800m": "800m Schwimmen",
      "radfahren_20km": "20km Radfahren",
      "medizinball_2kg": "Medizinball (2kg)",
      "kugel_6kg": "Kugelstoßen (6kg)",
      "steinstossen_10kg": "Steinstoßen (10kg)",
      "steinstossen_5kg": "Steinstoßen (5kg)",

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
  
  // Schüler zwischen 8 und 19 Jahren
  for (let year = currentYear - 19; year <= currentYear - 8; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
  }
}

function populateClassNameDropdown() {
  const classNameInput = document.getElementById('classNameInput');

  if (currentUserRole === 'examiner') {
    // Examiner sehen/wählen nur ihre zugewiesenen Klassen (RLS erlaubt eh nichts anderes)
    if (currentUserClasses.length === 0) {
      classNameInput.innerHTML = '<option value="" disabled selected>Keine Klasse zugewiesen</option>';
    } else {
      classNameInput.innerHTML = currentUserClasses
        .map(c => `<option value="${c}">${c}</option>`)
        .join('');
    }
    return;
  }

  // Admin (oder vor dem Login): alle Klassen zur Auswahl
  classNameInput.innerHTML = '<option value="">Keine Klasse</option>';
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
      if (age >= 8 && age <= 9) return "8-9";
      if (age >= 10 && age <= 11) return "10-11";
      if (age >= 12 && age <= 13) return "12-13";
      if (age >= 14 && age <= 15) return "14-15";
      if (age >= 16 && age <= 17) return "16-17";
      if (age >= 18 && age <= 19) return "18-19";
      return null;
    }

    function calculatePoints(value, exercise) {
          // Gerätturnen: Wert ist direkt die Punktzahl (0-3)
  if (exercise.type === "turnen") {
    const pts = parseInt(value);
    return isNaN(pts) ? 0 : Math.min(3, Math.max(0, pts));
  }
  
      if (value === null || value === undefined || value === '') return 0;

      // Zeitangaben MÜSSEN einen Doppelpunkt enthalten. Ohne diese Sperre
      // machte parseFloat("3,47") daraus 3,47 SEKUNDEN - eine 800m-Zeit von
      // knapp vier Sekunden, die klaglos als Gold durchging. Lieber 0 Punkte:
      // dann fällt der Datensatz in der Liste und in der Prüf-Ansicht auf,
      // statt eine falsche Medaille zu erzeugen.
      if (exercise.unit === "min:sec" && !String(value).includes(':')) return 0;

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

    // ============================================
    // EINGABE-PRÜFUNG (Syntax + Plausibilität)
    // ============================================
    // Eine Quelle für drei Stellen: Live-Prüfung im Formular, die Prüf-Ansicht
    // (pruefung.js) und die Spalte "Hinweise" im Export. Der Grund dafür ist
    // der Aktionstag 2026: "3,47" statt "3:47" beim 800m-Lauf wurde von
    // calculatePoints() stillschweigend als gültig behandelt.
    //
    // status: 'ok'      – passt zur Einheit und liegt im erwartbaren Bereich
    //         'warnung' – formal gültig, aber weit weg von der Leistungstabelle
    //                     (Zahlendreher? falsche Einheit?) – speicherbar
    //         'fehler'  – falsche Syntax, die Punkte sind nicht verlässlich
    // vorschlag: automatisch korrigierbarer Wert oder null
    function pruefeLeistung(value, exercise) {
      const inOrdnung = { status: 'ok', meldung: '', vorschlag: null };
      if (!exercise) return inOrdnung;

      const roh = String(value ?? '').trim();
      if (roh === '') return inOrdnung;

      // Gerätturnen kommt aus einem Dropdown, kann per Import aber trotzdem
      // etwas anderes als 0–3 enthalten.
      if (exercise.type === 'turnen') {
        return /^[0-3]$/.test(roh)
          ? inOrdnung
          : { status: 'fehler', meldung: 'Beim Gerätturnen ist nur eine Bewertung von 0 bis 3 möglich.', vorschlag: null };
      }

      return exercise.unit === 'min:sec'
        ? pruefeZeitangabe(roh)
        : pruefeZahlangabe(roh, exercise);
    }

    // Erwartet MM:SS. Sekunden ab 60 gibt es nicht – das ist immer ein Tippfehler.
    function pruefeZeitangabe(roh) {
      const mitDoppelpunkt = roh.match(/^(\d{1,3}):(\d{1,2})$/);
      if (mitDoppelpunkt) {
        const [, min, sek] = mitDoppelpunkt;
        if (sek.length === 1) {
          return {
            status: 'fehler',
            meldung: 'Sekunden bitte zweistellig eintragen.',
            vorschlag: `${min}:0${sek}`
          };
        }
        if (parseInt(sek, 10) > 59) {
          return {
            status: 'fehler',
            meldung: `${sek} Sekunden gibt es nicht – bitte als MM:SS eintragen (z. B. 3:47).`,
            vorschlag: null
          };
        }
        return { status: 'ok', meldung: '', vorschlag: null };
      }

      // Der Klassiker vom Aktionstag: "3,47" oder "3.47" statt "3:47"
      const mitKomma = roh.match(/^(\d{1,3})[.,](\d{2})$/);
      if (mitKomma && parseInt(mitKomma[2], 10) <= 59) {
        return {
          status: 'fehler',
          meldung: 'Zeiten werden mit Doppelpunkt eingetragen (MM:SS), nicht mit Komma.',
          vorschlag: `${mitKomma[1]}:${mitKomma[2]}`
        };
      }

      // Doppelpunkt vergessen: "347" ist bei einer Laufzeit eindeutig 3:47
      const nurZiffern = roh.match(/^(\d{1,2})(\d{2})$/);
      if (nurZiffern && parseInt(nurZiffern[2], 10) <= 59) {
        return {
          status: 'fehler',
          meldung: 'Der Doppelpunkt fehlt – Zeiten werden als MM:SS eingetragen.',
          vorschlag: `${nurZiffern[1]}:${nurZiffern[2]}`
        };
      }

      // Alles andere ist zu mehrdeutig, um es automatisch zu raten
      // ("3,4" könnte 3:04 oder 3:40 sein) – das muss der Mensch entscheiden.
      return {
        status: 'fehler',
        meldung: `"${roh}" ist keine gültige Zeit. Bitte im Format MM:SS eintragen (z. B. 3:47).`,
        vorschlag: null
      };
    }

    function pruefeZahlangabe(roh, exercise) {
      if (roh.includes(':')) {
        return {
          status: 'fehler',
          meldung: `Hier wird kein Doppelpunkt erwartet, sondern eine Zahl in ${exercise.unit}.`,
          vorschlag: roh.replace(':', ',')
        };
      }
      if (!/^\d{1,4}([.,]\d{1,3})?$/.test(roh)) {
        return {
          status: 'fehler',
          meldung: `"${roh}" ist keine Zahl. Erwartet wird ein Wert in ${exercise.unit}.`,
          vorschlag: null
        };
      }

      const zahl = parseFloat(roh.replace(',', '.'));
      const bereich = plausiblerBereich(exercise);
      if (bereich && (zahl < bereich.min || zahl > bereich.max)) {
        return {
          status: 'warnung',
          meldung: `${roh} ${exercise.unit} liegt weit außerhalb des erwartbaren Bereichs `
                 + `(etwa ${formatiereZahl(bereich.min)}–${formatiereZahl(bereich.max)} ${exercise.unit}). `
                 + 'Zahlendreher oder falsche Einheit?',
          vorschlag: null
        };
      }
      return { status: 'ok', meldung: '', vorschlag: null };
    }

    // Bronze bis Gold deckt nur den mittleren Bereich ab – echte Leistungen
    // liegen darunter und darüber. Erst ein Vielfaches davon ist ein Hinweis
    // auf einen Eingabefehler (z. B. 345 statt 3,45 Meter beim Weitsprung).
    // Bewusst großzügig: eine Warnung, die zu oft kommt, wird ignoriert.
    function plausiblerBereich(exercise) {
      const werte = [exercise.bronze, exercise.silber, exercise.gold]
        .map(v => (typeof v === 'string' ? timeToSeconds(v) : v))
        .filter(v => typeof v === 'number' && !isNaN(v));
      if (werte.length === 0) return null;
      return { min: Math.min(...werte) / 4, max: Math.max(...werte) * 3 };
    }

    function formatiereZahl(n) {
      return (Math.round(n * 100) / 100).toString().replace('.', ',');
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

    // Übungsdefinition eines gespeicherten Ergebnisses (Alter + Geschlecht des
    // Teilnehmers bestimmen, welche Leistungstabelle gilt). Wird vom Export
    // und von der Prüf-Ansicht gebraucht.
    function uebungVon(participant, catKey) {
      const eintrag = participant.results?.[catKey];
      if (!eintrag?.exercise) return null;
      const ageGroup = getAgeGroup(calculateAgeForYear(participant.birth_year));
      return PERFORMANCE_DATA[participant.gender]?.[ageGroup]?.[catKey]?.[eintrag.exercise] || null;
    }

    // Alle Auffälligkeiten eines Teilnehmers – eine Liste von
    // { catKey, exerciseKey, value, status, meldung, vorschlag }.
    function pruefeTeilnehmer(participant) {
      const funde = [];
      Object.keys(CATEGORIES).forEach(catKey => {
        const eintrag = participant.results?.[catKey];
        if (!eintrag?.exercise || eintrag.value === undefined || eintrag.value === '') return;

        const exercise = uebungVon(participant, catKey);
        if (!exercise) {
          // Übung existiert in der Tabelle dieser Altersgruppe nicht (mehr) –
          // typisch nach einem Geburtsjahr-Wechsel, gibt immer 0 Punkte.
          funde.push({
            catKey,
            exerciseKey: eintrag.exercise,
            value: eintrag.value,
            status: 'fehler',
            meldung: `Übung "${EXERCISE_LABELS[eintrag.exercise] || eintrag.exercise}" gibt es in der Leistungstabelle dieser Altersgruppe nicht – die Leistung zählt nicht.`,
            vorschlag: null
          });
          return;
        }

        const ergebnis = pruefeLeistung(eintrag.value, exercise);
        if (ergebnis.status !== 'ok') {
          funde.push({ catKey, exerciseKey: eintrag.exercise, value: eintrag.value, ...ergebnis });
        }
      });
      return funde;
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
    // AUTH
    // ============================================
    function showLoginView() {
      document.getElementById('loginView').classList.remove('hidden');
      document.getElementById('setPasswordView').classList.add('hidden');
      document.getElementById('appContent').classList.add('hidden');
    }

    function showAppView() {
      document.getElementById('loginView').classList.add('hidden');
      document.getElementById('setPasswordView').classList.add('hidden');
      document.getElementById('appContent').classList.remove('hidden');
    }

    // Erkennt, ob die Seite über einen Einladungs- oder Passwort-Zurücksetzen-Link
    // aufgerufen wurde. Je nach Supabase-Konfiguration steht der Token im Hash
    // (#access_token=...&type=invite) oder als ?code=... in der Query – deshalb
    // werden beide Varianten geprüft.
    function erkenneAuthFlow() {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const query = new URLSearchParams(window.location.search);

      const fehler = hash.get('error_description') || query.get('error_description');
      if (fehler) return { typ: 'fehler', text: fehler };

      const typ = hash.get('type') || query.get('type');
      if (typ === 'invite') return { typ: 'invite' };
      if (typ === 'recovery') return { typ: 'recovery' };

      // Bei aktivem PKCE-Flow steht der Typ nicht in der URL. Die einzigen
      // Mail-Links, die diese App verschickt, sind Einladung und Zurücksetzen –
      // beide sollen zum Passwort-Setzen führen.
      if (query.get('code')) return { typ: 'invite' };

      return null;
    }

    let authFlow = erkenneAuthFlow();

    // URL bereinigen, damit ein Reload den Vorgang nicht erneut auslöst
    function urlBereinigen() {
      history.replaceState(null, '', window.location.pathname);
    }

    function showSetPasswordView(typ) {
      setPasswordIntro.textContent = typ === 'recovery'
        ? 'Vergib hier dein neues Passwort.'
        : 'Willkommen! Vergib bitte ein Passwort für deinen Zugang.';
      newPasswordInput.value = '';
      newPasswordRepeatInput.value = '';
      setPasswordError.classList.add('hidden');
      document.getElementById('loginView').classList.add('hidden');
      document.getElementById('appContent').classList.add('hidden');
      setPasswordView.classList.remove('hidden');
    }

    async function handleSetPassword() {
      const pw = newPasswordInput.value;
      const pw2 = newPasswordRepeatInput.value;
      setPasswordError.classList.add('hidden');

      if (pw.length < 8) {
        setPasswordError.textContent = 'Das Passwort muss mindestens 8 Zeichen lang sein.';
        setPasswordError.classList.remove('hidden');
        return;
      }
      if (pw !== pw2) {
        setPasswordError.textContent = 'Die beiden Passwörter stimmen nicht überein.';
        setPasswordError.classList.remove('hidden');
        return;
      }

      setPasswordBtn.disabled = true;
      const { error } = await db.auth.updateUser({ password: pw });
      setPasswordBtn.disabled = false;

      if (error) {
        setPasswordError.textContent = 'Speichern fehlgeschlagen: ' + error.message;
        setPasswordError.classList.remove('hidden');
        return;
      }

      authFlow = null;
      urlBereinigen();

      const { data } = await db.auth.getSession();
      if (data.session) {
        await loadCurrentUserProfile(data.session.user.id);
        applyRoleBasedUI();
        showAppView();
        loadParticipants();
      } else {
        showLoginView();
      }
    }

    async function handleForgotPassword(e) {
      e.preventDefault();
      const email = loginEmailInput.value.trim();
      loginError.classList.add('hidden');
      loginInfo.classList.add('hidden');

      if (!email) {
        loginError.textContent = 'Bitte zuerst die E-Mail-Adresse eintragen.';
        loginError.classList.remove('hidden');
        return;
      }

      await db.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });

      // Bewusst immer dieselbe Meldung, unabhängig davon, ob die Adresse
      // existiert – sonst ließe sich darüber herausfinden, wer einen Zugang hat.
      loginInfo.textContent = 'Falls ein Zugang zu dieser Adresse existiert, ist eine E-Mail mit einem Link unterwegs.';
      loginInfo.classList.remove('hidden');
    }

    async function handleLogin() {
      const email = loginEmailInput.value.trim();
      const password = loginPasswordInput.value;
      loginError.classList.add('hidden');
      if (!email || !password) return;

      loginBtn.disabled = true;
      const { error } = await db.auth.signInWithPassword({ email, password });
      loginBtn.disabled = false;

      if (error) {
        loginError.textContent = 'Anmeldung fehlgeschlagen: E-Mail oder Passwort falsch.';
        loginError.classList.remove('hidden');
      } else {
        loginPasswordInput.value = '';
      }
    }

    async function handleLogout() {
      await db.auth.signOut();
    }

    async function loadCurrentUserProfile(userId) {
      const { data, error } = await db
        .from('profiles')
        .select('role, classes')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Fehler beim Laden des eigenen Profils:', error);
        currentUserRole = 'examiner';
        currentUserClasses = [];
        return;
      }

      currentUserRole = data.role;
      currentUserClasses = data.classes || [];
    }

    function applyRoleBasedUI() {
      adminBtn.classList.toggle('hidden', currentUserRole !== 'admin');
      populateClassNameDropdown();
    }

    db.auth.onAuthStateChange(async (event, session) => {
      // Abgelaufener oder bereits benutzter Link
      if (authFlow?.typ === 'fehler') {
        const meldung = authFlow.text;
        authFlow = null;
        urlBereinigen();
        showLoginView();
        loginError.textContent = 'Der Link ist ungültig oder abgelaufen: ' + meldung;
        loginError.classList.remove('hidden');
        return;
      }

      // Supabase meldet das Zurücksetzen auch über dieses Event
      if (event === 'PASSWORD_RECOVERY') authFlow = { typ: 'recovery' };

      if (session && authFlow) {
        showSetPasswordView(authFlow.typ);
        return;
      }

      if (session) {
        await loadCurrentUserProfile(session.user.id);
        applyRoleBasedUI();
        showAppView();
        loadParticipants();
      } else {
        showLoginView();
      }
    });

    // ============================================
    // APP STATE
    // ============================================
    let participants = [];
    let editingId = null;
    let currentClassFilter = '';
    let currentPerformanceFilter = '';
    let importData = [];
    let currentUserRole = null;
    let currentUserClasses = [];
    let profiles = [];
    let editingProfileId = null;

    // DOM-Elemente
    const loginView = document.getElementById('loginView');
    const appContent = document.getElementById('appContent');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const loginInfo = document.getElementById('loginInfo');
    const loginBtn = document.getElementById('loginBtn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const setPasswordView = document.getElementById('setPasswordView');
    const setPasswordIntro = document.getElementById('setPasswordIntro');
    const newPasswordInput = document.getElementById('newPassword');
    const newPasswordRepeatInput = document.getElementById('newPasswordRepeat');
    const setPasswordError = document.getElementById('setPasswordError');
    const setPasswordBtn = document.getElementById('setPasswordBtn');
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

    // Export-Elemente
    const exportView = document.getElementById('exportView');
    const closeExportBtn = document.getElementById('closeExportBtn');
    const cancelExportBtn = document.getElementById('cancelExportBtn');
    const startExportBtn = document.getElementById('startExportBtn');
    const exportAllBtn = document.getElementById('exportAllBtn');
    const exportNoneBtn = document.getElementById('exportNoneBtn');
    const exportDefaultBtn = document.getElementById('exportDefaultBtn');

    // Admin-Elemente
    const adminBtn = document.getElementById('adminBtn');
    const adminView = document.getElementById('adminView');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const profilesList = document.getElementById('profilesList');
    const profileEditForm = document.getElementById('profileEditForm');
    const profileEditEmail = document.getElementById('profileEditEmail');
    const profileRoleInput = document.getElementById('profileRoleInput');
    const profileClassesCheckboxes = document.getElementById('profileClassesCheckboxes');
    const cancelProfileEditBtn = document.getElementById('cancelProfileEditBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

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
  
  const failed = [];

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
          const { error } = await db
            .from('participants')
            .update({
              first_name: p.first_name,
              last_name: p.last_name,
              birth_year: p.birth_year,
              class_name: p.class_name || null,
              gender: p.gender
            })
            .eq('id', existing.id);
          if (error) {
            failed.push({ name: `${p.first_name} ${p.last_name}`, message: error.message });
          } else {
            imported++;
          }
          continue;
        }
      }

      // INSERT neuer Teilnehmer
      const { error } = await db
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

      if (error) {
        failed.push({ name: `${p.first_name} ${p.last_name}`, message: error.message });
      } else {
        imported++;
      }
    }

    await loadParticipants();
    hideImport();

    if (failed.length > 0) {
      alert(
        `${failed.length} Teilnehmer konnten nicht importiert werden:\n\n` +
        failed.map(f => `- ${f.name}: ${f.message}`).join('\n')
      );
    }
  } catch (err) {
    console.error('Fehler beim Import:', err);
    alert('Fehler beim Import: ' + err.message);
  }
  hideLoading();
}

   // Wendet Klassen-, Leistungsstand- und Suchfilter an (gleiche Filter wie
   // in der Listenansicht) - wird von renderList() UND exportCSV() genutzt,
   // damit der Export immer zur aktuell sichtbaren/gefilterten Liste passt.
   function getFilteredParticipants() {
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
  return searchTerm
    ? filteredParticipants.filter(p =>
        p.first_name.toLowerCase().includes(searchTerm) ||
        p.last_name.toLowerCase().includes(searchTerm)
      )
    : filteredParticipants;
}

function renderList() {
  // Filter-Dropdown aktualisieren
  populateClassFilter();

  const searchFiltered = getFilteredParticipants();

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
            ${currentUserRole === 'admin' ? `<button class="btn btn-danger delete-btn" data-id="${p.id}">🗑️</button>` : ''}
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
  
  if (age < 8 || age > 19) {
    disciplinesForms.innerHTML = '<div class="form-section"><p style="color: #94a3b8; text-align: center;">Ungültiges Geburtsjahr (Alter muss 8-19 Jahre sein)</p></div>';
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
                // Bereits gespeicherte Fehleingaben sollen sofort auffallen,
                // nicht erst wenn jemand das Feld anfasst.
                pruefeEingabefeld(cat, false);
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
      
      // Gerätturnen: Dropdown 0-3 statt Texteingabe
if (exercise.type === "turnen") {
  detailsDiv.innerHTML = `
    <div class="result-input-group">
      <select class="value-input">
        <option value="">– Bewertung –</option>
        <option value="0">0 Punkte (nicht bestanden)</option>
        <option value="1">1 Punkt (Bronze)</option>
        <option value="2">2 Punkte (Silber)</option>
        <option value="3">3 Punkte (Gold)</option>
      </select>
      <div class="result-points result-points-0" id="points-${catKey}">0 Pkt</div>
    </div>
    <div class="exercise-note">🤸 Gerät: ${exercise.geraet}</div>
  `;
  const valueInput = section.querySelector('.value-input');
  valueInput.addEventListener('change', () => updatePointsDisplay(catKey));
  return;
}

const placeholder = exercise.unit === 'min:sec' ? 'MM:SS' : `Wert (${exercise.unit})`;

detailsDiv.innerHTML = `
  <div class="result-input-group">
    <input type="text" class="value-input" placeholder="${placeholder}" inputmode="${exercise.unit === 'min:sec' ? 'text' : 'decimal'}">
    <div class="result-points result-points-0" id="points-${catKey}">0 Pkt</div>
  </div>
  <div class="value-hint hidden" id="hint-${catKey}"></div>
  <div class="thresholds">
    <span>🥉 ${exercise.bronze}${exercise.unit === 'min:sec' ? '' : ' ' + exercise.unit}</span>
    <span>🥈 ${exercise.silber}${exercise.unit === 'min:sec' ? '' : ' ' + exercise.unit}</span>
    <span>🥇 ${exercise.gold}${exercise.unit === 'min:sec' ? '' : ' ' + exercise.unit}</span>
  </div>
  ${exercise.note ? `<div class="exercise-note">${exercise.note}</div>` : ''}
`;
      // Event-Listener für Wert-Eingabe
      const valueInput = section.querySelector('.value-input');
      valueInput.addEventListener('input', () => {
        updatePointsDisplay(catKey);
        pruefeEingabefeld(catKey, false);   // während des Tippens nur anzeigen
      });
      // Erst beim Verlassen des Feldes wird korrigiert – sonst würde die
      // Korrektur schon nach dem zweiten Zeichen zuschlagen.
      valueInput.addEventListener('blur', () => pruefeEingabefeld(catKey, true));
    }

    // Sucht die Übungsdefinition zu einer Formular-Sektion (Alter + Geschlecht
    // aus den Stammdaten, Übung aus dem Dropdown).
    function uebungImFormular(catKey) {
      const birthYear = parseInt(birthYearInput.value);
      if (!birthYear) return null;

      const ageGroup = getAgeGroup(calculateAgeForYear(birthYear));
      const data = PERFORMANCE_DATA[genderInput.value]?.[ageGroup]?.[catKey];

      const section = document.querySelector(`[data-category="${catKey}"]`);
      const select = section?.querySelector('.exercise-select');
      const valueInput = section?.querySelector('.value-input');
      if (!select || !valueInput) return null;

      const exercise = data?.[select.value];
      return exercise ? { exercise, exerciseKey: select.value, valueInput } : null;
    }

    // Prüft ein einzelnes Eingabefeld und zeigt das Ergebnis darunter an.
    // korrigieren=true übernimmt einen eindeutigen Korrekturvorschlag direkt –
    // sichtbar, damit niemandem eine stille Umdeutung untergeschoben wird.
    // Rückgabe: der Status ('ok' | 'warnung' | 'fehler') für handleSave().
    function pruefeEingabefeld(catKey, korrigieren) {
      const hintDiv = document.getElementById(`hint-${catKey}`);
      const ctx = uebungImFormular(catKey);
      if (!ctx || !hintDiv) return 'ok';

      const { exercise, valueInput } = ctx;
      let ergebnis = pruefeLeistung(valueInput.value, exercise);
      let korrigiertVon = null;

      if (korrigieren && ergebnis.vorschlag) {
        korrigiertVon = valueInput.value.trim();
        valueInput.value = ergebnis.vorschlag;
        ergebnis = pruefeLeistung(valueInput.value, exercise);
        updatePointsDisplay(catKey);
      }

      valueInput.classList.remove('eingabe-fehler', 'eingabe-warnung');

      if (korrigiertVon) {
        hintDiv.className = 'value-hint hint-korrektur';
        hintDiv.textContent = `✏️ „${korrigiertVon}“ wurde als ${valueInput.value} übernommen – bitte kurz prüfen.`;
        return ergebnis.status;
      }

      if (ergebnis.status === 'ok') {
        hintDiv.className = 'value-hint hidden';
        hintDiv.textContent = '';
        return 'ok';
      }

      valueInput.classList.add(ergebnis.status === 'fehler' ? 'eingabe-fehler' : 'eingabe-warnung');
      hintDiv.className = `value-hint hint-${ergebnis.status}`;
      hintDiv.textContent = `${ergebnis.status === 'fehler' ? '⛔' : '⚠️'} ${ergebnis.meldung}`;
      return ergebnis.status;
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
      document.getElementById('lastEditInfo').classList.add('hidden');
    }

    // Zeigt an, wer den Datensatz zuletzt gespeichert hat (Spalte updated_by,
    // wird per DB-Trigger gesetzt - siehe sql/007_updated_by.sql).
    // Bei Altdatensätzen, die seitdem nicht angefasst wurden, ist das leer.
    function zeigeLetzteAenderung(participant) {
      const info = document.getElementById('lastEditInfo');
      if (!participant.updated_by) {
        info.classList.add('hidden');
        return;
      }
      const zeit = participant.updated_at
        ? new Date(participant.updated_at).toLocaleString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : null;
      info.textContent = `✏️ Zuletzt gespeichert von ${participant.updated_by}${zeit ? ` am ${zeit}` : ''}`;
      info.classList.remove('hidden');
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
      zeigeLetzteAenderung(participant);

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
                  pruefeEingabefeld(cat, false);
                }
              }, 10);
            }
          }
        });
      }, 10);
    }

    async function handleSave() {
      // Reihenfolge ist wichtig: erst prüfen (dabei werden eindeutige
      // Tippfehler wie "3,47" -> "3:47" im Feld korrigiert), dann einsammeln.
      const probleme = { fehler: [], warnung: [] };
      Object.entries(CATEGORIES).forEach(([catKey, cat]) => {
        const status = pruefeEingabefeld(catKey, true);
        if (status === 'ok') return;
        const ctx = uebungImFormular(catKey);
        if (!ctx) return;
        const { meldung } = pruefeLeistung(ctx.valueInput.value, ctx.exercise);
        probleme[status].push(`${cat.icon} ${cat.label}: ${meldung}`);
      });

      if (probleme.fehler.length > 0) {
        alert('Bitte zuerst korrigieren:\n\n' + probleme.fehler.join('\n\n'));
        return;
      }

      const data = collectFormData();

      if (!data.first_name || !data.last_name) {
        alert('Bitte Vor- und Nachname eingeben');
        return;
    }

      // Unplausible Werte blockieren nicht – Ausnahmeleistungen gibt es.
      // Aber sie sollen bewusst bestätigt werden.
      if (probleme.warnung.length > 0) {
        const weiter = confirm(
          'Diese Werte wirken unplausibel:\n\n' + probleme.warnung.join('\n\n') +
          '\n\nTrotzdem so speichern?'
        );
        if (!weiter) return;
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

    // ============================================
    // ADMIN: NUTZERVERWALTUNG
    // ============================================
    function showAdmin() {
      listView.classList.add('hidden');
      adminView.classList.remove('hidden');
      headerActions.classList.add('hidden');
      profileEditForm.classList.add('hidden');
    }

    function hideAdmin() {
      adminView.classList.add('hidden');
      listView.classList.remove('hidden');
      headerActions.classList.remove('hidden');
    }

    async function loadProfiles() {
      const { data, error } = await db
        .from('profiles')
        .select('*')
        .order('email', { ascending: true });

      if (error) {
        console.error('Fehler beim Laden der Nutzer:', error);
        alert('Fehler beim Laden der Nutzer: ' + error.message);
        return;
      }

      profiles = data || [];
      renderProfilesList();
    }

    function renderProfilesList() {
      if (profiles.length === 0) {
        profilesList.innerHTML = '<p style="color: #94a3b8;">Keine Nutzer gefunden.</p>';
        return;
      }

      profilesList.innerHTML = profiles.map(p => `
        <div class="card" data-id="${p.id}">
          <div class="card-header">
            <div>
              <div class="card-name">${p.email || '(keine E-Mail)'}</div>
              <div class="card-meta">
                ${p.role === 'admin' ? 'Admin' : 'Examiner'}${p.classes && p.classes.length ? ' · ' + p.classes.join(', ') : ''}
              </div>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn btn-secondary edit-profile-btn" data-id="${p.id}">Bearbeiten</button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.edit-profile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const profile = profiles.find(p => p.id === btn.dataset.id);
          if (profile) loadProfileToForm(profile);
        });
      });
    }

    function loadProfileToForm(profile) {
      editingProfileId = profile.id;
      profileEditEmail.textContent = profile.email || '(keine E-Mail)';
      profileRoleInput.value = profile.role;

      profileClassesCheckboxes.innerHTML = AVAILABLE_CLASSES.map(className => `
        <label class="checkbox-item">
          <input type="checkbox" value="${className}" ${profile.classes?.includes(className) ? 'checked' : ''}>
          ${className}
        </label>
      `).join('');

      profileEditForm.classList.remove('hidden');
    }

    async function saveProfile() {
      const role = profileRoleInput.value;
      const classes = Array.from(
        profileClassesCheckboxes.querySelectorAll('input[type="checkbox"]:checked')
      ).map(cb => cb.value);

      const { error } = await db
        .from('profiles')
        .update({ role, classes })
        .eq('id', editingProfileId);

      if (error) {
        console.error('Fehler beim Speichern des Profils:', error);
        alert('Fehler beim Speichern: ' + error.message);
        return;
      }

      profileEditForm.classList.add('hidden');
      await loadProfiles();
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
    
    // Geburtsjahr validieren (für 8-19 Jährige)
    if (firstName && birthYear >= currentYear - 19 && birthYear <= currentYear - 8) {
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
    // Jede Spalte, die exportiert werden kann - inklusive der Rohwerte, mit
    // denen sich Eingabefehler überhaupt erst nachvollziehen lassen. Was
    // angehakt ist, entscheidet der Dialog (Auswahl wird im Browser gemerkt).
    //
    // wert(p, ctx) liefert den Zellinhalt; ctx enthält die einmal pro
    // Teilnehmer berechneten Werte (Punkte, Gesamtergebnis, Auffälligkeiten).
    const EXPORT_SPALTEN = [
      { key: 'external_id', gruppe: '👤 Stammdaten', label: 'External_ID',  standard: true,  wert: p => p.external_id || '' },
      { key: 'first_name',  gruppe: '👤 Stammdaten', label: 'Vorname',      standard: true,  wert: p => p.first_name || '' },
      { key: 'last_name',   gruppe: '👤 Stammdaten', label: 'Nachname',     standard: true,  wert: p => p.last_name || '' },
      { key: 'birth_year',  gruppe: '👤 Stammdaten', label: 'Geburtsjahr',  standard: true,  wert: p => p.birth_year },
      { key: 'alter',       gruppe: '👤 Stammdaten', label: 'Alter',        standard: false, wert: (p, ctx) => ctx.age },
      { key: 'class_name',  gruppe: '👤 Stammdaten', label: 'Klasse',       standard: true,  wert: p => p.class_name || '' },
      { key: 'gender',      gruppe: '👤 Stammdaten', label: 'Geschlecht',   standard: true,  wert: p => p.gender },
      { key: 'id',          gruppe: '👤 Stammdaten', label: 'Datenbank-ID', standard: false, wert: p => p.id },

      // Pro Disziplingruppe: gewählte Übung, eingetragene Rohleistung, Punkte
      ...Object.entries(CATEGORIES).flatMap(([catKey, cat]) => [
        {
          key: `${catKey}_uebung`, gruppe: `${cat.icon} ${cat.label}`, label: `${cat.label} Übung`, standard: true,
          wert: p => {
            const ex = p.results?.[catKey]?.exercise;
            return ex ? (EXERCISE_LABELS[ex] || ex) : '';
          }
        },
        {
          key: `${catKey}_wert`, gruppe: `${cat.icon} ${cat.label}`, label: `${cat.label} Leistung`, standard: true,
          wert: p => p.results?.[catKey]?.value ?? ''
        },
        {
          key: `${catKey}_punkte`, gruppe: `${cat.icon} ${cat.label}`, label: `${cat.label} Punkte`, standard: true,
          wert: (p, ctx) => ctx.points[catKey] || 0
        }
      ]),

      { key: 'total', gruppe: '🏅 Auswertung', label: 'Gesamt',   standard: true, wert: (p, ctx) => ctx.result.total },
      { key: 'medal', gruppe: '🏅 Auswertung', label: 'Ergebnis', standard: true,
        wert: (p, ctx) => ctx.result.medal
          ? ctx.result.medal.charAt(0).toUpperCase() + ctx.result.medal.slice(1)
          : 'Nicht bestanden' },
      { key: 'offen', gruppe: '🏅 Auswertung', label: 'Offene Disziplinen', standard: true,
        wert: (p, ctx) => Object.entries(CATEGORIES)
          .filter(([key]) => !ctx.points[key] || ctx.points[key] === 0)
          .map(([, cat]) => cat.label)
          .join(', ') },
      { key: 'hinweise', gruppe: '🏅 Auswertung', label: 'Auffälligkeiten', standard: false,
        wert: (p, ctx) => ctx.funde
          .map(f => `${CATEGORIES[f.catKey].label}: "${f.value}" – ${f.meldung}`)
          .join(' | ') },

      { key: 'updated_by', gruppe: '✏️ Bearbeitung', label: 'Zuletzt von', standard: false, wert: p => p.updated_by || '' },
      { key: 'updated_at', gruppe: '✏️ Bearbeitung', label: 'Zuletzt am',  standard: false,
        wert: p => p.updated_at ? new Date(p.updated_at).toLocaleString('de-DE') : '' },
      { key: 'created_at', gruppe: '✏️ Bearbeitung', label: 'Angelegt am', standard: false,
        wert: p => p.created_at ? new Date(p.created_at).toLocaleString('de-DE') : '' }
    ];

    const EXPORT_SPEICHER_KEY = 'dsa_export_spalten';

    function gemerkteExportSpalten() {
      try {
        const gespeichert = JSON.parse(localStorage.getItem(EXPORT_SPEICHER_KEY));
        if (Array.isArray(gespeichert) && gespeichert.length > 0) return gespeichert;
      } catch (e) {
        // Ein kaputter Eintrag im localStorage darf den Export nicht blockieren
      }
      return EXPORT_SPALTEN.filter(s => s.standard).map(s => s.key);
    }

    function renderExportSpalten(ausgewaehlt) {
      const container = document.getElementById('exportColumns');
      const gruppen = [...new Set(EXPORT_SPALTEN.map(s => s.gruppe))];

      container.innerHTML = gruppen.map(gruppe => `
        <div class="form-section">
          <h3>${gruppe}</h3>
          <div class="checkbox-group">
            ${EXPORT_SPALTEN.filter(s => s.gruppe === gruppe).map(s => `
              <label class="checkbox-item">
                <input type="checkbox" value="${s.key}" ${ausgewaehlt.includes(s.key) ? 'checked' : ''}>
                <span>${s.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    function gewaehlteExportSpalten() {
      return [...document.querySelectorAll('#exportColumns input:checked')].map(cb => cb.value);
    }

    function showExport() {
      listView.classList.add('hidden');
      exportView.classList.remove('hidden');
      headerActions.classList.add('hidden');

      renderExportSpalten(gemerkteExportSpalten());

      // Der Export bezieht sich immer auf die aktuell gefilterte Liste -
      // das sichtbar zu machen erspart falsche Annahmen über den Inhalt.
      const anzahl = getFilteredParticipants().length;
      document.getElementById('exportInfo').textContent =
        `Exportiert werden ${anzahl} Teilnehmer (die aktuell gefilterte Liste). `
        + 'Die Spaltenauswahl wird für den nächsten Export gemerkt.';
    }

    function hideExport() {
      exportView.classList.add('hidden');
      listView.classList.remove('hidden');
      headerActions.classList.remove('hidden');
    }

    // Semikolon, Anführungszeichen und Zeilenumbrüche würden die Spalten sonst
    // zerreißen - vor allem in der Spalte "Auffälligkeiten".
    function csvFeld(wert) {
      const text = String(wert ?? '');
      return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    }

    function exportCSV() {
      const keys = gewaehlteExportSpalten();
      if (keys.length === 0) {
        alert('Bitte mindestens eine Spalte auswählen.');
        return;
      }
      localStorage.setItem(EXPORT_SPEICHER_KEY, JSON.stringify(keys));

      // Reihenfolge der Spalten bleibt die aus EXPORT_SPALTEN, nicht die
      // Anklick-Reihenfolge - sonst sieht jeder Export anders aus.
      const spalten = EXPORT_SPALTEN.filter(s => keys.includes(s.key));

      // Exportiert die aktuell gefilterte Liste (z.B. "Unvollständig"), nicht
      // zwangsläufig alle Teilnehmer - so wird der Export zur "Übersicht
      // offener Leistungen", wenn man vorher entsprechend filtert.
      const rows = getFilteredParticipants().map(p => {
        const points = getParticipantPoints(p);
        const ctx = {
          age: calculateAgeForYear(p.birth_year),
          points,
          result: calculateOverallResult(points),
          funde: pruefeTeilnehmer(p)
        };
        return spalten.map(s => csvFeld(s.wert(p, ctx))).join(';');
      });

      const csv = [spalten.map(s => csvFeld(s.label)).join(';'), ...rows].join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sportabzeichen_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      hideExport();
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
exportBtn.addEventListener('click', showExport);
importBtn.addEventListener('click', showImport);

// Export-Dialog
closeExportBtn.addEventListener('click', hideExport);
cancelExportBtn.addEventListener('click', hideExport);
startExportBtn.addEventListener('click', exportCSV);
exportAllBtn.addEventListener('click', () => renderExportSpalten(EXPORT_SPALTEN.map(s => s.key)));
exportNoneBtn.addEventListener('click', () => renderExportSpalten([]));
exportDefaultBtn.addEventListener('click', () =>
  renderExportSpalten(EXPORT_SPALTEN.filter(s => s.standard).map(s => s.key)));

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

loginBtn.addEventListener('click', handleLogin);
loginPasswordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleLogin();
});
logoutBtn.addEventListener('click', handleLogout);

setPasswordBtn.addEventListener('click', handleSetPassword);
newPasswordRepeatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSetPassword();
});
forgotPasswordLink.addEventListener('click', handleForgotPassword);

adminBtn.addEventListener('click', () => {
  showAdmin();
  loadProfiles();
});
closeAdminBtn.addEventListener('click', hideAdmin);
cancelProfileEditBtn.addEventListener('click', () => {
  profileEditForm.classList.add('hidden');
});
saveProfileBtn.addEventListener('click', saveProfile);

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
    // loadParticipants() wird von onAuthStateChange getriggert, sobald eine Session besteht
