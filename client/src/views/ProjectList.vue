<template>
  <div class="container">
    <h2>Projects:</h2>
    <ul class="list-group">
      <li v-for="project in projects" :key="project._id" class="list-group-item">
        <div class="row align-items-center">
          <div class="col-sm-5">
            <router-link :to="`/${project._id}`" class="text-decoration-none">{{ project.title }}</router-link>
          </div>
          <div class="col-sm-3">
            <p class="mb-0">End Date: {{ project.end_date }}</p>
          </div>
          <div class="col-sm-2">
            <p class="mb-0">Status: {{ getProjectStatus(project.end_date) }}</p>
          </div>
          <div class="col-sm-2 d-flex justify-content-end">
            <button @click="deleteProject(project._id)" class="btn btn-danger text-white rounded">
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      projects: [],
    };
  },
  created() {
    // Retrieve the user's name from the token or your authentication mechanism
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userName = payload.name;
      this.fetchProjects(payload.id); // Fetch projects using the user's ID
    }
  },
  methods: {
    async fetchProjects(userId) {
      try {
        const response = await fetch(`http://localhost:3000/api/project/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Projects retrieved successfully
          this.projects = data;
        } else {
          // Failed to retrieve projects, display error message
          console.error('Failed to retrieve projects:', data.error);
        }
      } catch (error) {
        // Handle network or server errors
        console.error('Error retrieving projects:', error);
      }
    },
    deleteProject(projectId) {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      fetch(`http://localhost:3000/api/project/${projectId}`, {
        method: "DELETE",
        headers: headers,
      })
        .then((response) => {
          if (response.ok) {
            console.log("Project deleted successfully!");
            this.projects = this.projects.filter(
              (project) => project._id !== projectId
            );
          } else {
            console.error("Failed to delete project.");
          }
        })
        .catch((error) => {
          console.error("Error deleting project:", error);
        });
    },

    getProjectStatus(endDate) {
      const today = new Date();
      const projectEndDate = new Date(endDate);

      if (projectEndDate < today) {
        return "Overdue";
      } else {
        return "Ongoing";
      }
    },
  },
};
</script>