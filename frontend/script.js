document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = "http://localhost:3000/api";
  let token = "";

  // Signup
  document.getElementById("signup-btn").addEventListener("click", async () => {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if(res.ok) handleLogin(data.token, data.isPremium);
    else alert(data.message || "Signup failed");
  });

  // Login
  document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(res.ok) handleLogin(data.token, data.isPremium);
    else alert(data.message || "Login failed");
  });

  // After login/signup
  function handleLogin(jwtToken, isPremium) {
    token = jwtToken;
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("expense-section").style.display = "block";

    document.getElementById("premium-badge").textContent = isPremium ? "You are a Premium User" : "";
    
    loadExpenses();
    loadLeaderboard();
  }

  // Add Expense
  document.getElementById("add-expense-btn").addEventListener("click", async () => {
    const amount = document.getElementById("expense-amount").value;
    const description = document.getElementById("expense-desc").value;
    const category = document.getElementById("expense-category").value;

    const res = await fetch(`${BASE_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ amount, description, category })
    });

    const data = await res.json();
    if(res.ok) {
      loadExpenses();
      loadLeaderboard();
    } else alert(data.message || "Failed to add expense");
  });

  // Buy Premium
  document.getElementById("buy-premium-btn").addEventListener("click", async () => {
    if(!token) return alert("Please login first!");

    const amount = 1000; // simulate payment
    try {
      const res = await fetch(`${BASE_URL}/premium/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      const data = await res.json();
      if(res.ok) {
        alert(data.message);
        document.getElementById("premium-badge").textContent = "You are a Premium User";
      } else {
        alert(data.message || "Failed to become premium");
      }

    } catch(err) {
      console.error(err);
      alert("Network error. Check backend is running.");
    }
  });

  // Load Expenses
  async function loadExpenses() {
    const res = await fetch(`${BASE_URL}/expenses`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const expenses = await res.json();

    const ul = document.getElementById("expenses-list");
    ul.innerHTML = "";
    expenses.forEach(exp => {
      const li = document.createElement("li");
      li.textContent = `${exp.description} - ${exp.amount} - ${exp.category}`;
      
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", async () => {
        await fetch(`${BASE_URL}/expenses/${exp.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        loadExpenses();
        loadLeaderboard();
      });

      li.appendChild(delBtn);
      ul.appendChild(li);
    });
  }

  // Load Leaderboard
  async function loadLeaderboard() {
    const res = await fetch(`${BASE_URL}/leaderboard`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const leaderboard = await res.json();

    const ul = document.getElementById("leaderboard-list");
    ul.innerHTML = "";
    leaderboard.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.User.name} - Total: ${user.totalAmount}`;
      ul.appendChild(li);
    });
  }

}); // DOMContentLoaded end