<template>
  <div class="chart-section">
    <div class="chart-header">
      <h4 class="chart-title">Flight Hours Trend</h4>
      <div class="active-range-info">
        <span class="accent">{{ activeBounds.limit }}h limit</span>
      </div>
    </div>

    <!-- SVG Chart Area -->
    <div class="svg-container">
      <svg viewBox="0 0 400 220" width="100%" height="100%" class="trend-chart-svg">
        <!-- Grid Lines (Horizontal) -->
        <line x1="40" y1="20" x2="380" y2="20" stroke="#E5E7EB" stroke-dasharray="4" />
        <line x1="40" y1="70" x2="380" y2="70" stroke="#E5E7EB" stroke-dasharray="4" />
        <line x1="40" y1="120" x2="380" y2="120" stroke="#E5E7EB" stroke-dasharray="4" />
        <line x1="40" y1="170" x2="380" y2="170" stroke="#E5E7EB" stroke-dasharray="4" />

        <!-- Y-Axis Labels -->
        <text x="30" y="24" class="axis-label" text-anchor="end">{{ activeBounds.max }}h</text>
        <text x="30" y="124" class="axis-label" text-anchor="end">{{ (activeBounds.max / 2).toFixed(0) }}h</text>
        <text x="30" y="174" class="axis-label" text-anchor="end">0h</text>

        <!-- Red Limit Line (Susi Air Accent) -->
        <line 
          x1="40" 
          :y1="limitYPosition" 
          x2="380" 
          :y2="limitYPosition" 
          stroke="#E63757" 
          stroke-width="2" 
          stroke-dasharray="2"
        />
        <text x="380" :y="limitYPosition - 6" class="limit-label" text-anchor="end">LIMIT ({{ activeBounds.limit }}h)</text>

        <!-- Today Visual Centered Anchor Line -->
        <line x1="210" y1="20" x2="210" y2="170" stroke="#0E2138" stroke-width="1" stroke-dasharray="2" opacity="0.3" />
        <text x="210" y="15" class="today-marker" text-anchor="middle">TODAY</text>

        <!-- Trend Line Path -->
        <path 
          :d="linePath" 
          fill="none" 
          stroke="#22C5E8" 
          stroke-width="3" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
        />

        <!-- Data Interaction Points (Dots) -->
        <circle 
          v-for="(pt, idx) in chartPoints" 
          :key="idx" 
          :cx="pt.x" 
          :cy="pt.y" 
          :r="pt.isToday ? 5 : 3" 
          :fill="pt.isToday ? '#E63757' : '#0E2138'"
          :stroke="pt.isToday ? '#FFFFFF' : 'none'"
          stroke-width="1.5"
          class="chart-dot"
          @click="selectPoint(pt)"
        />

        <!-- X-Axis Labels (Dates) -->
        <text 
          v-for="(pt, idx) in chartPoints" 
          :key="'x-'+idx" 
          :x="pt.x" 
          y="200" 
          class="axis-label x-label" 
          :class="{ 'bold-today': pt.isToday }"
          text-anchor="start"
          :transform="`rotate(-45, ${pt.x}, 200)`"
        >
          {{ pt.formattedDate }}
        </text>
      </svg>
    </div>

    <!-- Interaction Feedback Overlay Hint -->
    <div v-if="selectedPoint" class="chart-tooltip">
      <span class="tooltip-date">{{ selectedPoint.fullDate }}:</span>
      <span class="tooltip-val">{{ selectedPoint.value.toFixed(1) }} hrs flown</span>
    </div>

    <!-- Toggle Group Selection Options (Below Chart) -->
    <div class="toggle-group-container">
      <div class="toggle-group">
        <button 
          v-for="opt in toggles" 
          :key="opt.id" 
          :class="{ active: currentToggle === opt.id }"
          @click="currentToggle = opt.id"
          type="button"
          class="toggle-btn"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = usePilotStore();
const { getRollingSum } = useFlightCalculations();

// hari ini 31 Mei 2026
const todayStr = '2026-05-31';
const currentToggle = ref('1w');
const selectedPoint = ref(null);

const toggles = [
  { id: '1w', label: '1w', window: 7, limit: 40, max: 45 },
  { id: '1m', label: '1m', window: 30, limit: 100, max: 125 },
  { id: '3m', label: '3m', window: 90, limit: 300, max: 325 },
  { id: '6m', label: '6m', window: 180, limit: 600, max: 625 },
  { id: '1y', label: '1y', window: 365, limit: 1050, max: 1250 }
];

// konfigurasi batas Y aktif 
const activeBounds = computed(() => {
  return toggles.find(t => t.id === currentToggle.value);
});

// hitung posisi horizontal garis batas merah
const limitYPosition = computed(() => {
  const maxVal = activeBounds.value.max;
  const limitVal = activeBounds.value.limit;
  // Memetakan nilai ke dalam range tinggi koordinat SVG (20px ke 170px)
  return 170 - ((limitVal / maxVal) * 150);
});

// window sum 15 data (T-7 sampai T+7)
const displayDaysRange = computed(() => {
  const list = [];
  const baseDate = new Date(todayStr);

  for (let i = -7; i <= 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateString = d.toISOString().split('T')[0];
    const formattedDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    list.push({
      dateString,
      formattedDate,
      isToday: i === 0
    });
  }
  return list;
});

// titik-titik koordinat X dan Y untuk ditarik ke dalam grafik
const chartPoints = computed(() => {
  const flightHours = store.data?.flightHours || [];
  const maxVal = activeBounds.value.max;
  const windowDays = activeBounds.value.window;

  // ukuran lebar kolom per titik dalam area koordinat SVG 40px ke 380px (lebar sisa 340px)
  const xStart = 40;
  const xEnd = 380;
  const xSpacing = (xEnd - xStart) / 14; 

  return displayDaysRange.value.map((day, index) => {
    // run rumus kalkulasi rolling sum dari composable
    const rollingSumValue = getRollingSum(day.dateString, windowDays, flightHours);
    
    // konversi nilai sum menjadi posisi koordinat Y SVG
    const x = xStart + (index * xSpacing);
    const y = 170 - ((rollingSumValue / maxVal) * 150);

    return {
      x,
      y,
      value: rollingSumValue,
      isToday: day.isToday,
      formattedDate: day.formattedDate,
      fullDate: day.dateString
    };
  });
});

// membuat string jalur d-attribute SVG Path
const linePath = computed(() => {
  const points = chartPoints.value;
  if (points.length === 0) return '';
  return points.reduce((path, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
  }, '');
});

const selectPoint = (pt) => {
  selectedPoint.value = pt;
};
</script>

<style lang="scss" scoped>
.chart-section {
  background: #FFFFFF;
  padding: 20px 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  margin-top: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .chart-title {
    font-size: 15px;
    font-weight: 700;
    color: #0E2138;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .active-range-info {
    font-size: 12px;
    color: #6B7280;
    .accent {
      color: #E63757;
      font-weight: 600;
    }
  }
}

.svg-container {
  width: 100%;
  overflow: visible;
}

.trend-chart-svg {
  overflow: visible;
}

.axis-label {
  font-size: 12px;
  fill: #6B7280;
  font-weight: 500;
}

.x-label {
  font-size: 12px;
  
  @media (max-width: 390px) {
    &:nth-child(even) {
      display: none;
    }
  }
}

.bold-today {
  fill: #E63757;
  font-weight: 700;
  font-size: 12px;
  display: block !important;
}

.limit-label {
  font-size: 12px;
  fill: #E63757;
  font-weight: 700;
}

.today-marker {
  font-size: 12px;
  fill: #0E2138;
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0.6;
}

.chart-dot {
  cursor: pointer;
  transition: r 0.2s ease;
  &:hover {
    r: 6;
  }
}

.chart-tooltip {
  background: #0E2138;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
  margin: 12px 0 4px;
  
  .tooltip-date {
    color: #22C5E8;
    margin-right: 4px;
  }
  .tooltip-val {
    font-weight: 600;
  }
}

.toggle-group-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.toggle-group {
  display: flex;
  background: #F5F6F8;
  padding: 4px;
  border-radius: 24px;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
}

.toggle-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    color: #0E2138;
  }

  &.active {
    background: #0E2138;
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(14, 33, 56, 0.15);
  }
}
</style>