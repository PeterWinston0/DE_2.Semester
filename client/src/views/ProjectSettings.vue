<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Project Settings</h2>

    <label for="title" class="block mb-2">Title:</label>
    <input type="text" id="title" v-model="title" class="form-control mb-4" />

    <label for="description" class="block mb-2">Description:</label>
    <textarea id="description" v-model="description" class="form-control mb-4"></textarea>

    <label for="dropbox" class="block mb-2">Dropbox:</label>
    <input type="text" id="dropbox" v-model="dropbox" class="form-control mb-4" />

    <label for="github" class="block mb-2">GitHub:</label>
    <input type="text" id="github" v-model="github" class="form-control mb-4" />

    <h3 class="text-lg font-semibold mb-2">Technologies:</h3>
    <ul class="list-group mb-4">
      <li v-for="(tech, index) in techs" :key="index" class="list-group-item d-flex align-items-center">
        <span class="mr-2">{{ tech.name }}</span>
        <button type="button" @click="removeTech(index)" class="btn btn-danger btn-sm">Remove</button>
      </li>
    </ul>

    <div class="d-flex align-items-center mb-4">
      <input type="text" v-model="newTechnology" placeholder="Add new technology" class="form-control mr-2" />
      <button type="button" @click="addTech" class="btn btn-primary">Add</button>
    </div>

    <button @click="saveProjectSettings" class="btn btn-success mr-2">Save</button>
    <button @click="cancelProjectSettings" class="btn btn-secondary">Cancel</button>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        title: "",
        description: "",
        dropbox: "",
        github: "",
        techs: [],
        newTechnology: "",
      };
    },
    async mounted() {
      try {
        const projectId = this.$route.params.id;
        const response = await fetch(
          `http://localhost:3000/api/project/${projectId}`
        );
        const data = await response.json();
        this.title = data.title;
        this.description = data.description;
        this.dropbox = data.dropbox;
        this.github = data.github;
        this.techs = data.techs;
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    },
  
    methods: {
      addTech() {
        if (this.newTechnology.trim() !== "") {
          this.techs.push({ name: this.newTechnology.trim() });
          this.newTechnology = ""; // Clear the input field
        }
      },
  
      removeTech(index) {
        this.techs.splice(index, 1);
      },
  
      async saveProjectSettings() {
        try {
          const projectId = this.$route.params.id;
          const payload = {
            title: this.title,
            description: this.description,
            dropbox: this.dropbox,
            github: this.github,
            techs: this.techs,
          };
          await fetch(`http://localhost:3000/api/project/${projectId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          console.log('Project settings saved successfully.');
        } catch (error) {
          console.error('Error saving project settings:', error);
        }
      },
  
      cancelProjectSettings() {
        this.$router.go(-1); // Navigates back to the previous page
        console.log("Project settings editing cancelled.");
      },
    },
  };
  </script>
  