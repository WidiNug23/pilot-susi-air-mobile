<template>
  <div class="limit-card">
    <div class="header">
      <span class="title">{{ title }}</span>
      <span class="limit-info">{{ limit }}h</span>
    </div>
    <div class="value">{{ current?.toFixed(1) || '0.0' }}</div>
    <div class="progress-bar">
      <div class="fill" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['title', 'current', 'limit']);
const progress = computed(() => Math.min((props.current / props.limit) * 100, 100));
</script>

<style lang="scss" scoped>
.limit-card {
  background: #FFFFFF;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  .header { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .title { font-size: 12px; color: #6B7280; }
  .limit-info { font-size: 12px; font-weight: 600; color: #0E2138; }
  .value { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .progress-bar { height: 6px; background: #F5F6F8; border-radius: 3px; overflow: hidden; }
  .fill { height: 100%; background: #E63757; transition: width 0.3s ease; }
}
</style>