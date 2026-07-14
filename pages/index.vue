<template>
  <div class="login-page">
    <div class="login-header">
      <img src="/susiair-logo.png" alt="Susi Air Logo" class="logo" />
      <h2>Pilot Portal</h2>
      <p>Enter your credentials to access operations.</p>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="input-group">
        <label>Username</label>
        <input v-model="username" type="text" placeholder="Enter pilot ID" required />
      </div>
      
      <div class="input-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" required />
      </div>

      <button type="submit" class="btn-primary">Sign In</button>
    </form>

    <a href="#" class="help-link">Need help? Contact CRD</a>
  </div>
</template>

<script setup>
const username = ref('');
const password = ref('');
const handleLogin = () => navigateTo('/home');
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  min-height: 100vh;
  max-width: 390px;
  margin: 0 auto;
}

.login-header {
  margin-bottom: 40px;
  text-align: left;
  .logo { width: 120px; margin-bottom: 16px; }
  h2 { font-size: 24px; color: #0E2138; margin: 0; }
  p { color: #6B7280; font-size: 14px; }
}

.input-group {
  margin-bottom: 20px;
  label { display: block; font-size: 12px; font-weight: 600; color: #0E2138; margin-bottom: 8px; }
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    box-sizing: border-box;
    font-size: 14px;
  }
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background-color: #E63757;
  color: white;
  border: none;
  border-radius: 24px; /* Pill shape */
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}

.help-link {
  display: block;
  text-align: center;
  margin-top: 24px;
  color: #6B7280;
  font-size: 13px;
  text-decoration: underline;
}
</style>