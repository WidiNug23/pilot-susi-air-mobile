<template>
  <nav class="bottom-nav">
    <NuxtLink to="/home" class="nav-item">
      <span class="icon"></span>
      <span class="label">Home</span>
    </NuxtLink>
    <NuxtLink to="/schedule" class="nav-item">
      <span class="icon"></span>
      <span class="label">Schedule</span>
    </NuxtLink>
    <NuxtLink to="/#" class="nav-item">
      <span class="icon"></span>
      <span class="label">Logbook</span>
    </NuxtLink>
    <NuxtLink to="/#" class="nav-item">
      <span class="label">More</span>
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
@use "~/assets/scss/_variables.scss" as *;
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px; /* Tinggi standar untuk mobile */
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: $white;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
  z-index: 100;
  border-top: 1px solid #E5E7EB;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: $text-sec;
  font-size: 12px; 
  font-weight: 600;
  transition: color 0.2s ease;
  width: 100%;
  height: 100%;

  .icon {
    font-size: 22px;
    margin-bottom: 2px;
  }

  &.router-link-active {
    color: $navy;
    
    .icon {
      transform: scale(1.05);
    }
  }
}
</style>