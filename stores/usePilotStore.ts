import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePilotStore = defineStore('pilot', () => {
  // Gabungkan keduanya
  const data = ref(null);         // Untuk dashboard (flightHours, limits, dll)
  const documents = ref([]);      // Untuk dokumen
  const schedules = ref([]);      // Untuk kalender
  const legend = ref([]);         // Untuk legenda kalender
  const loading = ref(false);

  const loadData = async () => {
    // Gunakan pengecekan yang lebih fleksibel
    if (loading.value) return;
    loading.value = true;
    
    try {
      const [hoursRes, docsRes, schedRes] = await Promise.all([
        $fetch('/mock-flight-hours.json'),
        $fetch('/mock-documents.json'),
        $fetch('/mock-schedules.json')
      ]);
      
      // Update state
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