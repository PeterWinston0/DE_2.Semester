<template>
  <div class="wrapper">
  <header>
      <nav v-if="showNav" class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <RouterLink to="/dashboard" class="navbar-brand">Project Management</RouterLink>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/createproject" class="nav-link">Create Project</RouterLink>
            </li>
            <li class="nav-item">
              <Logout />
            </li>
          </ul>
        </div>
      </nav>
  </header>
  <RouterView />
</div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import Logout from "./components/Logout.vue";

export default {
  computed: {
    showNav() {
      return !['/login', '/registration'].includes(this.$route.path);
    },
  },
  components: {
    Logout,
    },
};
</script>

<style scoped>
  .wrapper {
    margin: auto auto;
    width: 90%;
  }
</style>
