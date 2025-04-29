<template>
  <div class="container">
    <h1>📝 Todo List</h1>

    <!-- Create New Todo Form -->
    <form @submit.prevent="createTodo" class="todo-form">
      <input v-model="newTodoTitle" placeholder="New Todo Title" required />
      <button type="submit" :disabled="loading">
        {{ loading ? "Adding..." : "Add Todo" }}
      </button>
    </form>

    <div v-if="loading" class="loading">Loading todos...</div>
    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>

    <ul class="todo-list" v-else>
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <input type="checkbox" v-model="todo.isDone" @change="updateTodo(todo)" />
        <span :class="{ done: todo.isDone }">{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)">🗑 Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import todoApi from "@/api/todoapi.js";

export default {
  data() {
    return {
      todos: [],
      newTodoTitle: "",
      loading: false,
      toastMessage: "",
      showToast: false
    };
  },
  async created() {
    await this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      this.loading = true;
      try {
        const response = await todoApi.getAll();
        this.todos = response.data;
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        this.loading = false;
      }
    },
    async createTodo() {
      if (!this.newTodoTitle.trim()) return;

      try {
        const response = await todoApi.create({ title: this.newTodoTitle, isDone: false });
        const newTodo = response.data;
        this.todos.push(newTodo); // ✅ Add directly!
        this.newTodoTitle = "";
        this.showToastMessage("✅ Todo created successfully!");
      } catch (error) {
        console.error("Failed to create todo:", error);
        this.showToastMessage("❌ Failed to create todo.");
      } finally {
        this.loading = false;
      }
    },

    async updateTodo(todo) {
      try {
        await todoApi.update(todo.id, todo);
        this.showToastMessage("✅ Todo updated!");
      } catch (error) {
        console.error("Failed to update todo:", error);
        this.showToastMessage("❌ Failed to update todo.");
      }
    },

    async deleteTodo(id) {
      try {
        await todoApi.delete(id);
        this.todos = this.todos.filter(todo => todo.id !== id); // ✅ Remove from list
        this.showToastMessage("🗑️ Todo deleted!");
      } catch (error) {
        console.error("Failed to delete todo:", error);
        this.showToastMessage("❌ Failed to delete todo.");
      } finally {
        this.loading = false;
      }
    },


    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000); // Toast disappears after 3 seconds
    },

  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 2rem;
  background: #2c2c2c;
  border-radius: 10px;
  box-shadow: 0 0 10px #000;
  color: #eee;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
}

.todo-form {
  display: flex;
  margin-bottom: 20px;
}

.todo-form input {
  flex: 1;
  padding: 0.5rem;
  margin-right: 10px;
  border-radius: 5px;
  border: none;
}

.todo-form button {
  padding: 0.5rem 1rem;
  border: none;
  background: #42b983;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.todo-form button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.todo-item span {
  flex: 1;
  margin-left: 10px;
}

.todo-item span.done {
  text-decoration: line-through;
  color: #aaa;
}

.todo-item button {
  background: transparent;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
}

.loading {
  text-align: center;
  margin-top: 20px;
}
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #42b983;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  box-shadow: 0 0 10px #000;
  z-index: 1000;
  animation: fadeInOut 3s forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}

</style>
