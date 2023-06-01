<template>
  <div class="container p-4">
    <h4 class="text-lg font-semibold mb-2">Welcome {{ userName }}</h4>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <ProjectList />
  </div>
</template>

<script>
import ProjectList from "../views/ProjectList.vue";

export default {
  data() {
    return {
      userName: "", // Initialize the userName data property
    };
  },
  created() {
    // Retrieve the user's name from the token or your authentication mechanism
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      this.userName = payload.name;
    }
  },
  components: {
    ProjectList,
  },
};
</script>

<style lang="scss" scoped></style>
