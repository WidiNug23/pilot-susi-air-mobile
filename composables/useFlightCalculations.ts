export const useFlightCalculations = () => {
  const getRollingSum = (date: string, windowDays: number, flightHours: any[]) => {
    if (!flightHours || flightHours.length === 0) return 0;

    const targetDate = new Date(date);
    const startDate = new Date(targetDate);
    startDate.setDate(targetDate.getDate() - windowDays + 1);

    return flightHours
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= targetDate;
      })
      // Menambahkan fallback (|| 0) jika 'hours' bernilai undefined/null
      .reduce((acc, curr) => acc + (curr.hours || 0), 0);
  };

  return { getRollingSum };
};