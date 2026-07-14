<template>
  <div class="dashboard-page">
    <!-- Header -->
    <header class="header">
      <div class="logo-container">
        <img src="/susiair-logo.png" alt="Susi Air Logo" class="brand-logo" />
      </div>

      <div class="user-profile">
        <p class="welcome-text">Welcome back,</p>
        <h1 v-if="store.data">{{ store.data.pilot.name }}</h1>
        <div v-else class="skeleton-text">Loading...</div>
        <p v-if="store.data" class="flight-stats">
          Total Hours: <strong>{{ store.data.pilot.totalFlightHours }}h</strong>
        </p>
      </div>

      <div class="header-actions">
        <button class="notification-bell" aria-label="Notifications">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="badge">3</span>
        </button>
        
        <div class="avatar">
          {{ store.data?.pilot.name.charAt(0) || 'P' }}
        </div>
      </div>
    </header>

    <!-- Upcoming Flight -->
    <section class="section">
      <h3 class="section-title">Upcoming Flight</h3>
      <div class="flight-card">
        <div class="flight-info">
          <span class="flight-date">20 July, 2026 • 08:30</span>
          <div class="flight-route">
            <div class="route-point">
              <span class="icao">HLP</span>
              <span class="city">Jakarta</span>
            </div>
            <div class="route-arrow">✈</div>
            <div class="route-point">
              <span class="icao">CJN</span>
              <span class="city">Pangandaran</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News -->
    <section class="section">
      <h3 class="section-title">Latest News</h3>
      <div class="news-container">
        <div class="news-card">
          <span class="news-tag">Safety</span>
          <p class="news-excerpt">New mandatory safety briefing protocols effective immediately.</p>
        </div>
        <div class="news-card">
          <span class="news-tag">Update</span>
          <p class="news-excerpt">Fleet expansion: New Cessna Grand Caravan units arriving Q3.</p>
        </div>
        <div class="news-card">
          <span class="news-tag">Internal</span>
          <p class="news-excerpt">Annual pilot medical check-up schedule now available.</p>
        </div>
      </div>
    </section>

    <!-- Hours to Limit -->
    <section class="section">
      <h3 class="section-title">Hours to Limit</h3>
      
      <div v-if="store.loading" class="loading-state">
        <UiLoadingSpinner />
      </div>

      <div class="limit-grid" v-else-if="store.data">
        <HomeLimitCard title="Daily" :current="dailySum" :limit="8" />
        <HomeLimitCard title="Weekly" :current="weeklySum" :limit="40" />
        <HomeLimitCard title="Monthly" :current="monthlySum" :limit="100" />
        <HomeLimitCard title="Annual" :current="annualSum" :limit="1050" />
      </div>

      <div class="chart-wrapper" v-if="store.data">
        <HomeFlightChart />
      </div>
    </section>

    <!-- My Documents -->
    <section class="section">
      <h3 class="section-title">My Documents</h3>
      <div v-if="store.loading" class="loading-state">Loading documents...</div>
      <div class="doc-list" v-else>
        <div v-for="doc in documentList" :key="doc.id" class="doc-item">
          <span class="doc-label">{{ doc.label }}</span>
          <span :class="['status-badge', getStatusClass(doc.expiryDate)]">
            {{ getDaysRemaining(doc.expiryDate) }} days
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const store = usePilotStore();
const { getRollingSum } = useFlightCalculations();
const today = '2026-05-31';

onMounted(async () => {
  if (!store.data || store.documents.length === 0) {
    await store.loadData();
  }
});

// perhitungan jam terbang
const hours = computed(() => store.data?.flightHours || []);
const dailySum = computed(() => getRollingSum(today, 1, hours.value));
const weeklySum = computed(() => getRollingSum(today, 7, hours.value));
const monthlySum = computed(() => getRollingSum(today, 30, hours.value));
const annualSum = computed(() => getRollingSum(today, 365, hours.value));

// dokumen yang dipanggil dari store
const documentList = computed(() => store.documents || []);

// fungsi untuk dokumen
const getDaysRemaining = (expiryDate) => {
  const diff = new Date(expiryDate) - new Date('2026-05-31');
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getStatusClass = (expiryDate) => {
  const days = getDaysRemaining(expiryDate);
  if (days <= 0) return 'red';      // expired
  if (days <= 30) return 'amber';   // warning
  return 'green';                   // safe
};
</script>

<style lang="scss" scoped>
/* default fallback
$navy: #0E2138; $red: #E63757; $text-sec: #6B7280; $white: #FFFFFF;
*/

.dashboard-page { 
  padding: 24px 16px 80px; 
  max-width: 390px; 
  margin: 0 auto; 
  background-color: #F5F6F8;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  margin-bottom: 24px;
}

.brand-logo { width: 40px; height: auto; }

.user-profile {
  flex: 1;
  .welcome-text { font-size: 12px; color: #6B7280; margin: 0; }
  h1 { font-size: 16px; margin: 0; color: #0E2138; font-weight: 700; }
  .flight-stats { font-size: 12px; color: #6B7280; margin: 0; }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-bell {
  position: relative;
  background: none;
  border: none;
  padding: 4px;
  color: #0E2138;
  cursor: pointer;
  display: flex;
  align-items: center;

  .badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #E63757;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 700;
    min-width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px; 
    border: 1px solid #FFFFFF; 
  }
}

.avatar {
  width: 36px;
  height: 36px;
  background: #0E2138;
  color: #FFFFFF;
  border-radius: 8px; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.section {
  margin-bottom: 24px;
}

.section-title { 
  font-size: 16px; 
  font-weight: 700; 
  color: #0E2138; 
  margin-bottom: 16px; 
}

/* Flight Card */
.flight-card {
  background: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #E5E7EB; 
}

.flight-date {
  font-size: 12px;
  color: #6B7280;
  display: block;
  margin-bottom: 12px;
}

.flight-route {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.route-point {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icao {
  font-size: 20px;
  font-weight: 700;
  color: #0E2138;
}

.city {
  font-size: 12px;
  color: #6B7280;
  text-transform: uppercase;
}

.route-arrow {
  color: #E63757;
  font-size: 16px;
  padding-bottom: 10px; 
}

/* News Scroll */
.news-container {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none; 
  &::-webkit-scrollbar { display: none; } 
}

.news-card {
  min-width: 200px;
  padding: 16px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-tag {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #E63757;
  letter-spacing: 0.5px;
}

.news-excerpt {
  font-size: 13px;
  line-height: 1.4;
  color: #0E2138;
  margin: 0;
  font-weight: 500;
}

/* Hours Limit Grid */
.limit-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 12px; 
  margin-bottom: 24px; 
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: #6B7280;
  font-size: 14px;
}

.chart-wrapper {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

/* Documents List */
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-item {
  background: #FFFFFF;
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doc-label {
  font-size: 13px;
  color: #0E2138;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px; 
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  
  &.green { background: #DCFCE7; color: #166534; }
  &.amber { background: #FEF3C7; color: #92400E; }
  &.red   { background: #FEE2E2; color: #991B1B; }
}
</style>