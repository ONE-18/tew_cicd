const startTime = Date.now();

// Verificar estado al cargar
globalThis.addEventListener("DOMContentLoaded", () => {
  checkHealth();
  updateUptime();
  setInterval(updateUptime, 1000);
});

async function checkHealth() {
  const statusBadge = document.getElementById("statusBadge");
  const statusText = document.getElementById("statusText");
  const serverStatus = document.getElementById("serverStatus");
  const lastCheck = document.getElementById("lastCheck");

  try {
    const response = await fetch("/health");
    const data = await response.json();

    if (data.status === "ok") {
      statusBadge.querySelector(".status-dot").classList.remove("error");
      statusText.textContent = "Online";
      serverStatus.textContent = "✅ Operativo";
      serverStatus.style.color = "var(--success)";
    }

    lastCheck.textContent = new Date().toLocaleTimeString();
    showResponse(data);
  } catch (error) {
    statusBadge.querySelector(".status-dot").classList.add("error");
    statusText.textContent = "Offline";
    serverStatus.textContent = "❌ Error";
    serverStatus.style.color = "var(--danger)";
    showResponse({ error: error.message });
  }
}

async function sendGreeting() {
  try {
    const response = await fetch("/api/greeting");
    const data = await response.json();
    showResponse({ greeting: data.message, status: response.status });
  } catch (error) {
    showResponse({ error: error.message });
  }
}

async function getStats() {
  try {
    const response = await fetch("/stats");
    const data = await response.json();
    showResponse(data);
  } catch (error) {
    showResponse({ error: error.message });
  }
}

async function customRequest() {
  const endpoint = document.getElementById("endpoint").value;
  const method = document.getElementById("method").value;

  try {
    const response = await fetch(endpoint, { method });
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    showResponse({
      status: response.status,
      statusText: response.statusText,
      data,
    });
  } catch (error) {
    showResponse({ error: error.message });
  }
}

function showResponse(data) {
  const responseBox = document.getElementById("response");
  responseBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

function updateUptime() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(uptime / 60);
  const seconds = uptime % 60;
  document.getElementById("uptime").textContent = `${minutes}m ${seconds}s`;
}

// Expose functions for DOM usage
globalThis.sendGreeting = sendGreeting;
globalThis.getStats = getStats;
globalThis.customRequest = customRequest;
