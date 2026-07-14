import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePilotStore = defineStore('pilot', () => {
  // Gabungkan keduanya
  const data = ref(null);         //  dashboard (flightHours, limits, dll)
  const documents = ref([]);      //  dokumen
  const schedules = ref([]);      //  kalender
  const legend = ref([]);         //  legenda kalender
  const loading = ref(false);

  const loadData = async () => {
    // pengecekan fleksibel
    if (loading.value) return;
    loading.value = true;
    
    try {
      const [hoursRes, docsRes, schedRes] = await Promise.all([
        $fetch('/mock-flight-hours.json'),
        $fetch('/mock-documents.json'),
        $fetch('/mock-schedules.json')
      ]);
      
      // update state
      data.value = hoursRes as any;
      documents.value = (docsRes as any).documents || [];
      schedules.value = (schedRes as any).schedules || [];
      legend.value = (schedRes as any).legend || [];
      
    } catch (e) {
      console.error("Gagal memuat data:", e);
    } finally {
      loading.value = false;
    }
  };

  return { 
    data, 
    documents, 
    schedules, 
    legend, 
    loading, 
    loadData 
  };
});