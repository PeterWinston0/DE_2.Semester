<template>
  <div class="registration-page">
    <h1>Registration</h1>
    <form @submit.prevent="register" class="registration-form">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn-register">Register</button>
    </form>
    <p class="text-center mt-4">
      Already have an account?
      <router-link to="/login" class="text-blue-500 hover:underline"
        >Login</router-link
      >
    </p>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async register(event) {
      event.preventDefault();

      // Perform form validation
      if (
        this.name.length < 6 ||
        this.email.length < 6 ||
        this.password.length < 6
      ) {
        this.errorMessage = "Please enter at least 6 characters for all fields";
        return;
      }

      // Send registration request to server
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: this.name,
              email: this.email,
              password: this.password,
            }),
          }
        );

        const data = await response.json();

        // Check for successful registration
        if (response.ok) {
          this.successMessage = "Registration successful";
          // Redirect to a different page or perform additional actions
          // For example, you can use Vue Router to navigate to the login page
          this.$router.push("/login");
        } else {
          // Display error message if registration failed
          this.errorMessage = data.error;
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = "An error occurred while registering";
      }
    },
  },
};
</script>

<style scoped>
.registration-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.registration-form {
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-size: 1rem;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 1rem;
  color: #333;
}

.btn-register {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #0056b3;
}

.error-message,
.success-message {
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1.5rem;
  color: #555;
}

.error-message {
  color: #dc3545;
}

.success-message {
  color: #28a745;
}
</style>
