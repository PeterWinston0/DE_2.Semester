import { defineStore } from 'pinia';

export const useKanbanStore = defineStore('kanban', {
  state() {
    return {
      projectId: '',
      project: null,
      title: '',
      editableTitle: false,
      columns: [
        { id: 1, title: 'To Do', tasks: [] },
        { id: 2, title: 'In Progress', tasks: [] },
        { id: 3, title: 'Done', tasks: [] },
      ],
      successMessage: '',
      editableTitleValue: '',
    };
  },
  actions: {
    async fetchProject() {
      try {
        const projectId = this.$router.currentRoute.value.params.id;
        const response = await fetch(`http://localhost:3000/api/project/${projectId}`);
        const data = await response.json();
        this.project = data;
        this.title = this.project.title;
        this.mapTasksToColumns();
        this.initializeSortable();
      } catch (error) {
        console.error('Error fetching project:', error);
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
});
