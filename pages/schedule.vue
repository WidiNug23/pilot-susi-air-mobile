<template>
  <div v-if="store.loading" class="loading-container">
    <p>Loading schedule...</p>
  </div>

  <div v-else class="schedule-page">
    <header class="page-header">
      <!-- Tombol Navigasi Kiri -->
      <button class="nav-btn" @click="changeMonth(-1)">←</button>
      
      <!-- Trigger Picker di Tengah -->
      <h2 class="current-date-text" @click="showPicker = true">
        {{ currentMonthName }}
      </h2>
      
      <!-- Tombol Navigasi Kanan -->
      <button class="nav-btn" @click="changeMonth(1)">→</button>
    </header>

    <!-- Overlay Picker -->
    <div v-if="showPicker" class="picker-overlay">
      <div class="picker-content">
        <div class="year-selector">
          <label>Select Year:</label>
          <select v-model="selectedYear" class="year-select">
            <option v-for="y in 101" :key="y" :value="1999 + y">{{ 1999 + y }}</option>
          </select>
        </div>
        <div class="month-grid">
          <button 
            v-for="(m, i) in months" 
            :key="i" 
            class="month-btn"
            @click="selectMonth(i)"
          >
            {{ m }}
          </button>
        </div>
        <button class="close-btn" @click="showPicker = false">Close</button>
      </div>
    </div>

    <!-- Kalender dengan Event Swipe -->
    <div @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <ScheduleCalendar :month="currentDate" />
    </div>

    <section class="legend-section">
      <h3 class="legend-title">Duty Legend</h3>
      <div class="legend-grid">
        <div v-for="item in store.legend" :key="item.code" class="legend-item">
          <span class="dot" :style="{ backgroundColor: item.color }"></span>
          <span class="label">{{ item.label }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const store = usePilotStore();
const currentDate = ref(new Date(2026, 4, 31));
const showPicker = ref(false);
const touchStartX = ref(0);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('en-US', { month: 'long', year: 'numeric' });
});

// Computed untuk sinkronisasi tahun di Picker
const selectedYear = computed({
  get: () => currentDate.value.getFullYear(),
  set: (val) => currentDate.value = new Date(val, currentDate.value.getMonth(), 1)
});

const selectMonth = (idx) => {
  currentDate.value = new Date(currentDate.value.getFullYear(), idx, 1);
  showPicker.value = false;
};

const changeMonth = (val) => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + val, 1);
};

// Logika Swipe
const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  const diff = e.changedTouches[0].screenX - touchStartX.value;
  // Threshold 50px untuk deteksi swipe
  if (Math.abs(diff) > 50) {
    changeMonth(diff > 0 ? -1 : 1);
  }
};

onMounted(async () => {
  await store.loadData();
});
</script>

<style lang="scss" scoped>
.schedule-page { padding: 24px 16px; max-width: 390px; margin: 0 auto; background: #F5F6F8; min-height: 100vh; box-sizing: border-box; }
.loading-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

.current-date-text { 
  cursor: pointer; 
  font-size: 18px; 
  font-weight: 700; 
  color: #0E2138; 
  margin: 0;
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.nav-btn { background: white; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 700; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

/* Overlay Style */
.picker-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 100; display: flex; align-items: center; justify-content: center; }
.picker-content { background: white; padding: 20px; border-radius: 16px; width: 85%; max-width: 320px; }
.year-selector { margin-bottom: 15px; }
.year-select { width: 100%; padding: 8px; border-radius: 8px; }
.month-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
.month-btn { padding: 10px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer; }
.month-btn:hover { background: #F5F6F8; }
.close-btn { margin-top: 20px; width: 100%; padding: 12px; background: #0E2138; color: white; border: none; border-radius: 8px; cursor: pointer; }

/* Legend Style */
.legend-section { margin-top: 32px; background: white; padding: 16px; border-radius: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
.legend-title { font-size: 14px; margin-bottom: 12px; color: #0E2138; font-weight: 700; }
.legend-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.legend-item { display: flex; align-items: center; font-size: 12px; color: #6B7280; }
.dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; flex-shrink: 0; }
</style>