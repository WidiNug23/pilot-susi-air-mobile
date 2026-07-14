<template>
  <div class="calendar-card">
    <div class="weekdays">
      <span v-for="d in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="d">{{ d }}</span>
    </div>
    
    <div class="calendar-grid">
      <div v-for="n in startDayOffset" :key="'empty-'+n" class="day-cell empty"></div>
      
      <div 
        v-for="day in daysInMonth" 
        :key="day" 
        class="day-cell" 
        :style="getCellStyle(day)"
        @click="handleTap(day)"
      >
        <span class="day-num">{{ day }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['month']);
const store = usePilotStore();

const daysInMonth = computed(() => new Date(props.month.getFullYear(), props.month.getMonth() + 1, 0).getDate());

const startDayOffset = computed(() => {
  const d = new Date(props.month.getFullYear(), props.month.getMonth(), 1).getDay();
  return d === 0 ? 6 : d - 1;
});

const getDutyDetails = (day) => {
  if (!store.schedules) return null;
  const dateStr = `${props.month.getFullYear()}-${String(props.month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return store.schedules.find(s => s.duty_date === dateStr);
};

const getCellStyle = (day) => {
  const duty = getDutyDetails(day);
  return duty ? { backgroundColor: duty.base_color, color: 'white' } : {};
};

const handleTap = (day) => {
  alert("Detail page coming soon");
};
</script>

<style lang="scss" scoped>
.calendar-card { background: white; padding: 16px; border-radius: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
.weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 12px; }
.weekdays span { text-align: center; font-size: 12px; color: #6B7280; font-weight: 700; text-transform: uppercase; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.day-cell { 
  aspect-ratio: 1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.3s;
  &:hover { opacity: 0.8; }
  .day-num { font-size: 12px; font-weight: 600; }
}
</style>