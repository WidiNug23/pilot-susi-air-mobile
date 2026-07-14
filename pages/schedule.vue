<template>
  <div v-if="store.loading" class="loading-container">
    <p>Loading schedule...</p>
  </div>

  <div v-else class="schedule-page">
    <header class="page-header">
      <button class="nav-btn" @click="changeMonth(-1)">←</button>
      <h2>{{ currentMonthName }}</h2>
      <button class="nav-btn" @click="changeMonth(1)">→</button>
    </header>

    <ScheduleCalendar :month="currentDate" />

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
const currentDate = ref(new Date(2026, 3, 1)); // Default ke April 2026 agar langsung ada data mock

onMounted(async () => {
  await store.loadData();
});

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('en-US', { month: 'long', year: 'numeric' });
});

const changeMonth = (val) => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + val, 1);
};
</script>

<style lang="scss" scoped>
.schedule-page { padding: 24px 16px; max-width: 390px; margin: 0 auto; background: #F5F6F8; min-height: 100vh; box-sizing: border-box; }
.loading-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.nav-btn { background: white; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 700; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.legend-section { margin-top: 32px; background: white; padding: 16px; border-radius: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
.legend-title { font-size: 14px; margin-bottom: 12px; color: #0E2138; font-weight: 700; }
.legend-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.legend-item { display: flex; align-items: center; font-size: 11px; color: #6B7280; }
.dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; flex-shrink: 0; }
</style>