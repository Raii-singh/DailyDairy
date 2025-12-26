# 📓 Daily Diary – DevOps First

Daily Diary is a **DevOps-focused** mini application: a chat-style personal diary built with Spring Boot and shipped as a Docker container. The UI is simple on purpose – the real hero is the DevOps pipeline. [file:209][file:210]

---

## ✨ Features

- 🧠 **Spring Boot REST API** (rooms + messages)
- 💾 **H2 file-persistent database** (no external DB required)
- 💻 **HTML / CSS / JavaScript** frontend with chat-like UI
- 🗑️ **Full CRUD** on diary entries (including delete)
- 🐳 **Dockerized** with a multi-stage Dockerfile
- 🚀 **One-command deployment** with `docker run`
- 🔁 **CI/CD ready** (GitHub Actions / GitLab CI pipeline design) [file:209][file:210]

---

## 🏗️ Architecture (DevOps View)

+-------------+ +-------------------------+ +------------------+
| Browser | <---> | Spring Boot REST API | <---> | H2 Database |
| (HTML/JS UI)| | (Docker container) | | (file on volume) |
+-------------+ +-------------------------+ +------------------+

text

- **Stateless REST API** for rooms and messages.
- **H2 DB** stores data in a file so containers can restart without losing entries.
- **Docker** wraps the whole app into a portable image. [file:209]

---

## 📁 Project Structure

devops-app/
├── src/main/java/com/example/
│ ├── DiaryController.java # REST endpoints (rooms + messages)
│ ├── ChatRoom.java # JPA entity: diary room
│ ├── Message.java # JPA entity: diary message
│ ├── ChatRoomRepository.java # Room CRUD + queries
│ └── MessageRepository.java # Message CRUD + queries
├── src/main/resources/
│ ├── application.properties # H2 & JPA config
│ └── static/
│ ├── index.html # Desktop chat-style UI
│ ├── styles.css # Dark theme layout
│ └── app.js # Fetch API calls + UX logic
├── pom.xml # Maven build + dependencies
└── Dockerfile # Multi-stage image build

text

Each file has a clear DevOps role: from build config (`pom.xml`) to runtime environment (`Dockerfile`). [file:209]

---

## 🧪 Run Locally (Dev Mode)

### 1. Using Maven

mvn spring-boot:run

text

Then open:

http://localhost:8080/

text

### 2. Using JAR

mvn clean package
java -jar target/diary-app.jar

text

---

## 🐳 Run with Docker

### 1. Build image

docker build -t diary-devops:1.0 .

text

### 2. Run container

docker run -d
-p 8080:8080
--name daily-diary
-v diary-data:/app/data
diary-devops:1.0

text

- `-p 8080:8080` → expose app on `http://localhost:8080`.
- `-v diary-data:/app/data` → H2 data persists across restarts. [file:209]

Stop & remove:

docker stop daily-diary
docker rm daily-diary

text

---

## 🔁 CI/CD (Designed)

The project is structured to plug into **GitHub Actions / GitLab CI** easily: [file:209][file:210]

1. **On every push**
   - Run `mvn test`
   - Build JAR with `mvn package`
   - Build Docker image
2. **Push image** to Docker Hub / GHCR
3. **Deploy** the same image to:
   - VM (EC2 / Linode) with `docker run`
   - Docker Compose stack
   - Mini Kubernetes cluster (optional)

---

## 📌 Why This Project Is DevOps-First

- Shows full path: **source → build → test → image → deploy**.
- Uses **Infrastructure as Code** via Dockerfile and config files.
- Keeps app **simple but real**: stateful DB, REST API, and UI.
- Ready to extend with monitoring (Prometheus/Grafana) and K8s. [file:209][file:210]

---

Happy shipping. 🐳💚
