# 📓 Daily Diary – DevOps-First Application
#
# Daily Diary is a DevOps-focused mini application that demonstrates the complete
# lifecycle of a modern service — from source code to containerized deployment.
#
# It is a chat-style personal diary built with Spring Boot, packaged with Docker,
# and designed around DevOps best practices rather than UI complexity.
#
# Goal:
# Showcase build, packaging, persistence, and deployment — not flashy frontend.
#
# ------------------------------------------------------------
# ✨ Key Features
# ------------------------------------------------------------
# - Spring Boot REST API (chat rooms + diary messages)
# - H2 file-based persistent database (no external DB required)
# - Lightweight HTML/CSS/JS chat-style frontend
# - Full CRUD operations on diary messages
# - Dockerized using multi-stage build
# - One-command deployment with docker run
# - CI/CD-ready design (GitHub Actions / GitLab CI)
#
# ------------------------------------------------------------
# 🏗️ Architecture (DevOps Perspective)
# ------------------------------------------------------------
#
# +-------------+       +-------------------------+       +------------------+
# |   Browser   | <---> | Spring Boot REST API    | <---> |   H2 Database    |
# | (HTML/JS)   |       | (Docker Container)      |       | (File on Volume) |
# +-------------+       +-------------------------+       +------------------+
#
# Highlights:
# - Stateless REST API
# - Stateful persistence via file-based H2
# - Docker volume ensures data survives restarts
# - Entire system runs as one portable container
#
# ------------------------------------------------------------
# 📁 Project Structure
# ------------------------------------------------------------
#
# devops-app/
# ├── src/main/java/com/example/
# │   ├── DiaryController.java        # REST endpoints
# │   ├── ChatRoom.java               # JPA entity (rooms)
# │   ├── Message.java                # JPA entity (messages)
# │   ├── ChatRoomRepository.java     # Room CRUD repository
# │   └── MessageRepository.java      # Message CRUD repository
# │
# ├── src/main/resources/
# │   ├── application.properties      # H2 + JPA configuration
# │   └── static/
# │       ├── index.html              # Chat-style UI
# │       ├── styles.css              # Dark theme styling
# │       └── app.js                  # Fetch API + UX logic
# │
# ├── pom.xml                          # Maven build configuration
# └── Dockerfile                       # Multi-stage Docker build
#
# ------------------------------------------------------------
# 🧪 Run Locally (Development Mode)
# ------------------------------------------------------------
#
# Using Maven:
# mvn spring-boot:run
#
# App URL:
# http://localhost:8080/
#
# Using JAR:
# mvn clean package
# java -jar target/diary-app.jar
#
# ------------------------------------------------------------
# 🐳 Run with Docker
# ------------------------------------------------------------
#
# Build Docker image:
# docker build -t diary-devops:1.0 .
#
# Run container:
# docker run -d \
#   -p 8080:8080 \
#   --name daily-diary \
#   -v diary-data:/app/data \
#   diary-devops:1.0
#
# Explanation:
# - Port 8080 exposed to host
# - Docker volume persists H2 database data
#
# Stop & remove container:
# docker stop daily-diary
# docker rm daily-diary
#
# ------------------------------------------------------------
# 🔁 CI/CD Pipeline (Design-Ready)
# ------------------------------------------------------------
#
# Typical pipeline flow:
# 1. On every push:
#    - mvn test
#    - mvn package
# 2. Build Docker image
# 3. Push image to Docker Hub / GHCR
# 4. Deploy to:
#    - VM (EC2 / Linode)
#    - Docker Compose
#    - Kubernetes (optional)
#
# ------------------------------------------------------------
# 📌 Why This Is DevOps-First
# ------------------------------------------------------------
#
# - Demonstrates full DevOps lifecycle:
#   Code → Build → Test → Image → Deploy
# - Uses Infrastructure as Code (Dockerfile, configs)
# - Simple but real application (API + DB + UI)
# - Easy to extend with monitoring, reverse proxy, Kubernetes
#
# ------------------------------------------------------------
# 🚢 Final Note
# ------------------------------------------------------------
#
# This project is intentionally minimal in UI and rich in DevOps concepts.
#
# Ideal for:
# - College DevOps assignments
# - GitHub portfolio
# - CI/CD demonstrations
# - Docker & deployment practice
#
# Happy shipping 🐳💚
