# 📓 Daily Diary – DevOps-First Application

A **chat-style personal diary** built with **Spring Boot**, containerized with **Docker**, and designed around **DevOps best practices**. This project demonstrates the complete lifecycle: *source code → build → containerization → deployment*.

---

## 🎯 Goal

Showcase **build, packaging, persistence, and deployment** — not flashy frontend.

---

## ✨ Key Features

- ✅ Spring Boot REST API (chat rooms + diary messages)
- ✅ H2 file-based persistent database (no external DB required)
- ✅ Lightweight HTML/CSS/JS chat-style frontend
- ✅ Full CRUD operations on diary messages
- ✅ Dockerized using **multi-stage build**
- ✅ One-command deployment with `docker run`
- ✅ CI/CD-ready design (GitHub Actions / GitLab CI)

---

## 🏗️ Architecture (DevOps Perspective)

```
+-------------+              +-------------------------+              +------------------+
| Browser     |   <---->     | Spring Boot REST API    |   <---->     | H2 Database      |
| (HTML/JS)   |              | (Docker Container)      |              | (File on Volume) |
+-------------+              +-------------------------+              +------------------+
```

### Highlights
- **Stateless REST API** – scale horizontally
- **Stateful persistence** via file-based H2
- **Docker volume** ensures data survives container restarts
- **Entire system** runs as one portable container

---

## 📁 Project Structure

```
devops-diary-app/
├── src/main/java/com/example/
│   ├── DiaryApplication.java          # Spring Boot entry point
│   ├── DiaryController.java           # REST endpoints
│   ├── ChatRoom.java                  # JPA entity (rooms)
│   ├── Message.java                   # JPA entity (messages)
│   ├── ChatRoomRepository.java        # Room CRUD repository
│   └── MessageRepository.java         # Message CRUD repository
│
├── src/main/resources/
│   ├── application.properties         # H2 + JPA configuration
│   └── static/
│       ├── index.html                 # Chat-style UI
│       ├── styles.css                 # Dark theme styling
│       └── app.js                     # Fetch API + UX logic
│
├── pom.xml                            # Maven build configuration
└── Dockerfile                         # Multi-stage Docker build
```

## 🧪 Run Locally (Development Mode)

### Prerequisites
- **Java 17+**
- **Maven 3.9+**
- **Docker** (for containerization)

### Using Maven

```bash
# Clone project
git clone <your-repo> && cd devops-diary-app

# Build
mvn clean package

# Run
mvn spring-boot:run

# Access
http://localhost:8080/
```

### Using JAR

```bash
mvn clean package
java -jar target/diary-devops-1.0.0.jar
```

---

## 🐳 Run with Docker

### Build Docker Image

```bash
docker build -t diary-devops:1.0 .
```

### Run Container

```bash
docker run -d \
  -p 8080:8080 \
  --name daily-diary \
  -v diary-data:/app/data \
  diary-devops:1.0
```

### Access Application

```
http://localhost:8080/
```

### View Logs

```bash
docker logs -f daily-diary
```

### Stop & Clean Up

```bash
docker stop daily-diary
docker rm daily-diary
docker volume rm diary-data
```

---



---

## 📌 Why This Is DevOps-First

✅ **Demonstrates Full DevOps Lifecycle**
- Code → Build → Test → Image → Deploy

✅ **Infrastructure as Code**
- Dockerfile defines environment
- `application.properties` centralizes config

✅ **Simple but Real Application**
- REST API with persistence
- Database integration (H2)
- Stateless design for scalability

✅ **Easy to Extend**
- Monitoring (Prometheus)
- Reverse proxy (Nginx)
- Orchestration (Kubernetes)
- Logging (ELK stack)

---

## 🚀 Next Steps

1. **Clone & Run Locally** – Understand the app flow
2. **Build Docker Image** – Practice containerization
3. **Push to Docker Registry** – AWS ECR, Docker Hub, GHCR
4. **Set Up CI/CD** – GitHub Actions auto-builds & tests
5. **Deploy** – VM (EC2), Docker Compose, or Kubernetes
6. **Monitor** – Add health checks, logging, metrics

---

## 🐳 Final Note

This project is **intentionally minimal in UI** but **rich in DevOps concepts**.

**Perfect for:**
- College DevOps assignments
- GitHub portfolio projects
- CI/CD demonstrations
- Docker & deployment practice
- Job interview projects

---

**Happy shipping! 🐳💚**
