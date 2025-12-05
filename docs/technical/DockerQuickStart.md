# ⚡ Docker Quick Start

Run your app in **3 simple steps**.

### 1. Start the App
Run this in your terminal:
```bash
docker-compose up --build -d
```
*(Wait for it to finish building)*

### 2. Open in Browser
Click here: **[http://localhost:8080](http://localhost:8080)**

### 3. Stop the App
When you are done:
```bash
docker-compose down
```

---

### ❓ Common Questions

**I changed my code, why isn't it updating?**
Docker takes a "snapshot" of your code. If you change code, run **Step 1** again to rebuild.

**How do I use Swarm?**
Only for advanced users. Run: `docker stack deploy -c docker-stack.yml my_app`
