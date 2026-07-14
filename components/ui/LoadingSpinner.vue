<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p>Loading</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  color: #6B7280;
  font-size: 14px;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #F5F6F8;
  border-top: 3px solid #E63757;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>