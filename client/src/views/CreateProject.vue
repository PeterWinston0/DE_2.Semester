<template>
  <div class="container">
    <h1 class="mb-4">Create Project</h1>
    <form @submit.prevent="createProject">
      <!-- Step 1 -->
      <div v-if="currentStep === 1">
        <div class="mb-4">
          <label for="title" class="text-lg font-medium">Title:</label>
          <input
            type="text"
            id="title"
            v-model="newProject.title"
            required
            class="form-control mt-2"
          />
        </div>
        <div class="mb-4">
          <label for="description" class="text-lg font-medium">Description:</label>
          <textarea
            id="description"
            v-model="newProject.description"
            required
            class="form-control mt-2"
          ></textarea>
        </div>
        <div class="mb-4">
          <label for="start_date" class="text-lg font-medium">Start Date:</label>
          <datepicker
            v-model="newProject.start_date"
            required
            class="form-control mt-2"
          ></datepicker>
        </div>
        <div class="mb-4">
          <label for="end_date" class="text-lg font-medium">End Date:</label>
          <datepicker
            v-model="newProject.end_date"
            required
            class="form-control mt-2"
          ></datepicker>
        </div>
        <button
          type="button"
          @click="nextStep"
          class="btn btn-primary mt-4"
        >
          Next
        </button>
      </div>
      <!-- Step 2 -->
      <div v-else-if="currentStep === 2">
        <div class="mb-4">
          <label for="dropbox" class="text-lg font-medium">Dropbox:</label>
          <input
            type="text"
            id="dropbox"
            v-model="newProject.dropbox"
            required
            class="form-control mt-2"
          />
        </div>
        <div class="mb-4">
          <label for="github" class="text-lg font-medium">Github:</label>
          <input
            type="text"
            id="github"
            v-model="newProject.github"
            required
            class="form-control mt-2"
          />
        </div>
        <div class="mb-4">
          <label for="tech" class="text-lg font-medium">Tech:</label>
          <input
            type="text"
            id="tech"
            v-model="newTech"
            class="form-control mt-2"
          />
          <button
            type="button"
            @click="addTech"
            class="btn btn-primary mt-2"
          >
            Add
          </button>
        </div>
        <ul class="mb-4">
          <li
            v-for="(tech, index) in newProject.techs"
            :key="index"
            class="d-flex justify-content-between"
          >
            <span>{{ tech.name }}</span>
            <button
              type="button"
              @click="removeTech(index)"
              class="btn btn-danger"
            >
              Remove
            </button>
          </li>
        </ul>
        <div class="d-flex justify-content-between">
          <button
            type="button"
            @click="prevStep"
            class="btn btn-secondary"
          >
            Previous
          </button>
          <button
            type="submit"
            class="btn btn-primary"
          >
            Create
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Datepicker from "vue3-datepicker";
export default {
  components: {
    Datepicker,
  },
  data() {
    return {
      currentStep: 1,
      newProject: {
        title: "",
        description: "",
        start_date: null,
        end_date: null,
        dropbox: "",
        github: "",
        techs: [],
      },
      newTech: "",
      successMessage: "",
    };
  },
  methods: {
    nextStep() {
      this.currentStep += 1;
    },
    prevStep() {
      this.currentStep -= 1;
    },
    addTech() {
      if (this.newTech) {
        this.newProject.techs.push({ name: this.newTech });
        this.newTech = "";
      }
    },
    removeTech(index) {
      this.newProject.techs.splice(index, 1);
    },
    async createProject() {
      const formattedStartDate = this.formatDate(this.newProject.start_date);
      const formattedEndDate = this.formatDate(this.newProject.end_date);

      // Perform form validation
      // if (!this.title || !this.description) {
      //   alert("Please fill in all fields");
      //   return;
      // }

      // Get the logged-in user ID from the token or your authentication mechanism
      const userId = this.getLoggedInUserId(); // Replace this with your implementation

        const projectData = {
          ...this.newProject,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          userId: userId,
        };

      // Send the project data to the server to create a new project
      try {
        const response = await fetch("http://localhost:3000/api/project", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(projectData),
        });

        const data = await response.json();

        if (response.ok) {
          // Project creation successful
          console.log("Project created successfully:", data);
          // Redirect to a different page or perform additional actions
          // For example, you can use Vue Router to navigate to the project details page
          this.$router.push(`/${data._id}`);
        } else {
          // Project creation failed, display error message to the user
          console.error("Failed to create project:", data.error);
          alert("Failed to create project. Please try again.");
        }
      } catch (error) {
        // Handle network or server errors
        console.error("Error:", error);
        alert(
          "An error occurred while creating the project. Please try again."
        );
      }
    },
    clearForm() {
      this.newProject.title = "";
      this.newProject.description = "";
      this.newProject.start_date = null;
      this.newProject.end_date = null;
      this.newProject.dropbox = "";
      this.newProject.github = "";
      this.newProject.techs = [];
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    getLoggedInUserId() {
      // from the token or your authentication mechanism
      const token = localStorage.getItem("token");
      if (!token) {
        // Handle the case when the token is not available
        return null;
      }

      // Split the token by '.' to extract the payload
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        // Handle the case when the token is invalid
        console.error("Invalid token format");
        return null;
      }

      // Decode the payload from base64
      const payload = atob(tokenParts[1]);

      try {
        // Parse the payload as JSON to access the user ID
        const { userId } = JSON.parse(payload);
        return userId;
      } catch (error) {
        console.error("Failed to parse token payload:", error);
        // Handle the case when the payload cannot be parsed
        return null;
      }
    },
  },
};
</script>