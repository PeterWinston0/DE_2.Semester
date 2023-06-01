<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
    <div v-if="successMessage" class="success-message alert alert-success mt-4">
      {{ successMessage }}
    </div>
    <div class="mt-4">
      <button
        class="btn btn-dark"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#projectSettings"
        aria-expanded="false"
        aria-controls="projectSettings"
      >
        Project Settings
      </button>
      <div class="collapse" id="projectSettings">
        <div class="card card-body">
          <project-settings :projectId="projectId" />
        </div>
      </div>
    </div>
    <div class="kanban-board">
      <div class="column" v-for="column in columns" :key="column.id">
        <h3>{{ column.title }}</h3>
        <div :id="`column-${column.id}`" class="task-list" ref="taskLists">
          <div v-for="task in column.tasks" :key="task.id" class="task">
            <div v-if="!task.editableTitle">
              <span @click="task.editableTitle = true">{{ task.title }}</span>
            </div>
            <div v-else>
              <input
                type="text"
                v-model="task.editableTaskTitle"
                :disabled="!task.editableTitle"
                class="form-control"
                @input="updateTaskTitle(column.id, task.id, task.editableTaskTitle)"
                @blur="task.editableTitle = false"
              />
            </div>
            <div v-if="!task.editableDescription">
              <span @click="task.editableDescription = true">{{ task.description }}</span>
            </div>
            <div v-else>
              <textarea
                v-model="task.editableTaskDescription"
                :disabled="!task.editableDescription"
                class="form-control"
                @input="updateTaskDescription(column.id, task.id, task.editableTaskDescription)"
                @blur="task.editableDescription = false"
              ></textarea>
            </div>
            <button v-if="column.id > 1" @click="moveTask(task.id, column.id - 1)" class="btn btn-sm btn-secondary">
              ←
            </button>
            <button v-if="column.id < columns.length" @click="moveTask(task.id, column.id + 1)" class="btn btn-sm btn-secondary">
              →
            </button>

            <button @click="deleteTask(column.id, task.id)" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <button @click="addTask" class="btn btn-primary">Add Task</button>
    <button @click="saveKanbanBoard" class="btn btn-success">Save</button>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import Sortable from "sortablejs";
import ProjectSettings from "./ProjectSettings.vue";

export default {
  components: {
    ProjectSettings,
  },
  data() {
    return {
      projectId: "", // Initialize with the project ID
      project: null,
      title: "",
      editableTitle: false,
      columns: [
        { id: 1, title: "To Do", tasks: [] },
        { id: 2, title: "In Progress", tasks: [] },
        { id: 3, title: "Done", tasks: [] },
      ],
      successMessage: "",
      editableTitleValue: "", // New data property for the editable title input field
    };
  },
  async mounted() {
    try {
      // Fetch the project ID from the route or from your data source
      this.projectId = this.$route.params.id;
    } catch (error) {
      console.error("Error fetching project ID:", error);
    }
  },
  mounted() {
    this.fetchProject();
  },
  methods: {
    async fetchProject() {
      try {
        const projectId = this.$route.params.id;
        const response = await fetch(
          `http://localhost:3000/api/project/${projectId}`
        );
        const data = await response.json();
        this.project = data;
        this.title = this.project.title;
        this.mapTasksToColumns();
        this.initializeSortable();
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    },
    mapTasksToColumns() {
      if (this.project && this.project.tasks) {
        this.columns.forEach((column) => {
          const tasks = this.project.tasks[column.title.toLowerCase()] || [];
          column.tasks = tasks.map((task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            editableTitle: false,
            editableTaskTitle: task.title,
            editableDescription: false,
            editableTaskDescription: task.description,
          }));
        });
      }
    },
    initializeSortable() {
      nextTick(() => {
        const taskLists = Array.from(this.$refs.taskLists);

        taskLists.forEach((taskList) => {
          const sortable = Sortable.create(taskList, {
            group: "kanban-board",
            onEnd: (evt) => {
              const movedTask = this.columns
                .find((column) => column.id === +evt.from.id.split("-")[1])
                .tasks.splice(evt.oldIndex, 1)[0];
              const targetColumn = this.columns.find(
                (column) => column.id === +evt.to.id.split("-")[1]
              );
              targetColumn.tasks.splice(evt.newIndex, 0, movedTask);
            },
          });
          sortable.option("onMove", (evt) => {
            return evt.related.className.indexOf("task") > -1;
          });
        });
      });
    },
    addTask() {
      const newTaskId = Date.now().toString(); // Generate unique ID based on current timestamp
      const newTask = {
        id: newTaskId,
        title: `Title`,
        description: `Description`,
        editableTitle: false,
        editableTaskTitle: "",
        editableDescription: false,
        editableTaskDescription: "",
      };
      this.columns[0].tasks.push(newTask);
    },
    deleteTask(columnId, taskId) {
      const column = this.columns.find((column) => column.id === columnId);
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
      column.tasks.splice(taskIndex, 1);
    },
    updateTaskTitle(columnId, taskId, newTitle) {
      const column = this.columns.find((column) => column.id === columnId);
      const task = column.tasks.find((task) => task.id === taskId);
      task.title = newTitle;
    },
    updateTaskDescription(columnId, taskId, newDescription) {
      const column = this.columns.find((column) => column.id === columnId);
      const task = column.tasks.find((task) => task.id === taskId);
      task.description = newDescription;
    },
    saveKanbanBoard() {
      // Get the project ID
      const projectId = this.$route.params.id;

      // Create a new object to store the updated tasks
      const updatedTasks = {};

      // Map the tasks to their respective columns
      this.columns.forEach((column) => {
        updatedTasks[column.title.toLowerCase()] = column.tasks.map((task) => ({
          _id: task.id,
          title: task.title,
          description: task.description,
        }));
      });

      // Create the request payload
      const payload = {
        tasks: updatedTasks,
      };

      // Send the request to update the project
      fetch(`http://localhost:3000/api/project/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Kanban board saved successfully");
            this.successMessage = "Kanban board saved successfully";
          } else {
            throw new Error("Failed to save kanban board");
          }
        })
        .catch((error) => {
          console.error("Error saving kanban board:", error);
        });
    },
    moveTask(taskId, targetColumnId) {
      const sourceColumnIndex = this.columns.findIndex((column) =>
        column.tasks.some((task) => task.id === taskId)
      );
      const targetColumnIndex = this.columns.findIndex(
        (column) => column.id === targetColumnId
      );
      const taskIndex = this.columns[sourceColumnIndex].tasks.findIndex(
        (task) => task.id === taskId
      );
      const movedTask = this.columns[sourceColumnIndex].tasks.splice(
        taskIndex,
        1
      )[0];
      this.columns[targetColumnIndex].tasks.push(movedTask);
    },
  },
};
</script> 

<style scoped>
.kanban-board {
  display: flex;
}

.column {
  flex: 1;
  margin: 0 10px;
}

.task-list {
  min-height: 200px;
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 20px;
}

.task {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.task textarea {
  width: 100%;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.kanban-board {
  display: flex;
  flex-wrap: wrap;
}

.column {
  flex: 1;
  padding: 16px;
  background-color: #f5f5f5;
  width: calc(50% - 32px);
  margin: 0 16px 16px 0;
}

.task-list {
  min-height: 100px;
  background-color: #fff;
  margin-bottom: 16px;
}

.task {
  border: 1px solid #ccc;
  padding: 8px;
  margin-bottom: 8px;
  cursor: grab;
}

@media screen and (max-width: 767px) {
  .column {
    width: 100%;
    margin-right: 0;
  }
}
</style>
