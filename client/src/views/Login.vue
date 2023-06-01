<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn-login">Login</button>
    </form>
    <p class="text-center mt-4">
      Don't have an account?
      <router-link to="/registration" class="text-blue-500 hover:underline"
        >Register</router-link
      >
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      // Perform form validation
      if (!this.email || !this.password) {
        alert("Please fill in all fields");
        return;
      }

      // Prepare the login data to be sent to the server
      const loginData = {
        email: this.email,
        password: this.password,
      };

      // Send the login data to the server
      try {
        const response = await fetch("http://localhost:3000/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
          // Login successful
          console.log("Login successful:", data.data.token);
          // Save the token to localStorage
          localStorage.setItem("token", data.data.token);

          this.$router.push("/dashboard");
        } else {
          // Login failed, display error message to the user
          console.error("Failed to login:", data.error);
          alert(
            "Failed to login. Please check your credentials and try again."
          );
        }
      } catch (error) {
        // Handle network or server errors
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.login-page {
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

.login-form {
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

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 1rem;
  color: #333;
}

.btn-login {
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

.btn-login:hover {
  background-color: #0056b3;
}

.text-center {
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1.5rem;
  color: #555;
}

.text-blue-500 {
  color: #007bff;
}

.hover\:underline:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .login-form {
    width: 100%;
    padding: 1.5rem;
  }
}
</style>
