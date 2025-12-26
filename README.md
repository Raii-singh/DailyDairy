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

---

## 💻 Source Code Files

### 1. `pom.xml` – Maven Build Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>diary-devops</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Daily Diary DevOps App</name>
    <description>Chat-style diary with Spring Boot and DevOps focus</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Spring Boot Web Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- H2 Database -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok (optional, for @Data @Getter @Setter) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

### 2. `src/main/java/com/example/DiaryApplication.java` – Entry Point

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DiaryApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiaryApplication.class, args);
    }
}
```

---

### 3. `src/main/java/com/example/ChatRoom.java` – JPA Entity

```java
package com.example;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String roomName;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
    
    // Constructors
    public ChatRoom() {}
    
    public ChatRoom(String roomName, String description) {
        this.roomName = roomName;
        this.description = description;
    }
    
    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }
}
```

---

### 4. `src/main/java/com/example/Message.java` – JPA Entity

```java
package com.example;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "messages")
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 2000)
    private String content;
    
    @Column(nullable = false)
    private String author = "Anonymous";
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    @JsonBackReference
    private ChatRoom chatRoom;
    
    // Constructors
    public Message() {}
    
    public Message(String content, String author, ChatRoom chatRoom) {
        this.content = content;
        this.author = author;
        this.chatRoom = chatRoom;
    }
    
    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public ChatRoom getChatRoom() { return chatRoom; }
    public void setChatRoom(ChatRoom chatRoom) { this.chatRoom = chatRoom; }
}
```

---

### 5. `src/main/java/com/example/ChatRoomRepository.java` – Data Access

```java
package com.example;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByRoomName(String roomName);
}
```

---

### 6. `src/main/java/com/example/MessageRepository.java` – Data Access

```java
package com.example;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomId(Long chatRoomId);
}
```

---

### 7. `src/main/java/com/example/DiaryController.java` – REST Endpoints

```java
package com.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DiaryController {
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    // ===== CHAT ROOM ENDPOINTS =====
    
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getAllRooms() {
        return ResponseEntity.ok(chatRoomRepository.findAll());
    }
    
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoom> createRoom(@RequestBody ChatRoom room) {
        ChatRoom saved = chatRoomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping("/rooms/{id}")
    public ResponseEntity<ChatRoom> getRoomById(@PathVariable Long id) {
        Optional<ChatRoom> room = chatRoomRepository.findById(id);
        return room.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/rooms/{id}")
    public ResponseEntity<ChatRoom> updateRoom(@PathVariable Long id, @RequestBody ChatRoom room) {
        Optional<ChatRoom> existing = chatRoomRepository.findById(id);
        if (existing.isPresent()) {
            ChatRoom updated = existing.get();
            updated.setRoomName(room.getRoomName());
            updated.setDescription(room.getDescription());
            return ResponseEntity.ok(chatRoomRepository.save(updated));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        if (chatRoomRepository.existsById(id)) {
            chatRoomRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // ===== MESSAGE ENDPOINTS =====
    
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessagesByRoom(@PathVariable Long roomId) {
        if (!chatRoomRepository.existsById(roomId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(messageRepository.findByChatRoomId(roomId));
    }
    
    @PostMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Message> createMessage(@PathVariable Long roomId, @RequestBody Message message) {
        Optional<ChatRoom> room = chatRoomRepository.findById(roomId);
        if (room.isPresent()) {
            message.setChatRoom(room.get());
            Message saved = messageRepository.save(message);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/messages/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id) {
        Optional<Message> message = messageRepository.findById(id);
        return message.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/messages/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable Long id, @RequestBody Message message) {
        Optional<Message> existing = messageRepository.findById(id);
        if (existing.isPresent()) {
            Message updated = existing.get();
            updated.setContent(message.getContent());
            updated.setAuthor(message.getAuthor());
            return ResponseEntity.ok(messageRepository.save(updated));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (messageRepository.existsById(id)) {
            messageRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // ===== HEALTH CHECK =====
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\": \"UP\"}");
    }
}
```

---

### 8. `src/main/resources/application.properties` – Configuration

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Spring Application Name
spring.application.name=diary-devops

# H2 Database Configuration
spring.datasource.url=jdbc:h2:file:./data/diary
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console (optional, for debugging)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.com.example=DEBUG

# JSON Pretty Print
spring.jackson.serialization.indent-output=true
```

---

### 9. `src/main/resources/static/index.html` – Frontend UI

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Diary – DevOps App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📓 Daily Diary</h1>
            <p class="subtitle">Chat-style Personal Diary powered by Spring Boot</p>
        </header>

        <main>
            <!-- Room Management Section -->
            <section class="section">
                <h2>Chat Rooms</h2>
                <div class="room-controls">
                    <input type="text" id="roomName" placeholder="Room name (e.g., My Thoughts)">
                    <input type="text" id="roomDescription" placeholder="Description (optional)">
                    <button class="btn btn-primary" onclick="createRoom()">Create Room</button>
                </div>
                <div id="roomsList" class="rooms-list"></div>
            </section>

            <!-- Message Section -->
            <section class="section" id="messagesSection" style="display: none;">
                <h2 id="selectedRoomTitle"></h2>
                <div id="messagesList" class="messages-list"></div>
                
                <div class="message-controls">
                    <input type="text" id="authorInput" placeholder="Your name (optional)" value="Anonymous">
                    <textarea id="messageInput" placeholder="Write your thought..."></textarea>
                    <button class="btn btn-primary" onclick="sendMessage()">Send</button>
                </div>
            </section>
        </main>

        <footer>
            <p>🐳 DevOps-First Application | Containerized with Docker | Powered by Spring Boot</p>
        </footer>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

---

### 10. `src/main/resources/static/styles.css` – Dark Theme Styling

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e0e0;
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: #0f3460;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

header {
    background: linear-gradient(135deg, #e94560 0%, #d63031 100%);
    padding: 40px 20px;
    text-align: center;
    color: #fff;
}

header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 1em;
    opacity: 0.9;
}

main {
    flex: 1;
    padding: 30px 20px;
}

.section {
    margin-bottom: 30px;
    background: #1a2a47;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #e94560;
}

.section h2 {
    color: #fff;
    margin-bottom: 15px;
    font-size: 1.5em;
}

/* Room Controls */
.room-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.room-controls input {
    flex: 1;
    min-width: 150px;
    padding: 10px 15px;
    background: #0f3460;
    border: 1px solid #533483;
    border-radius: 6px;
    color: #e0e0e0;
    font-size: 0.9em;
}

.room-controls input::placeholder {
    color: #888;
}

.room-controls input:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 8px rgba(233, 69, 96, 0.2);
}

/* Rooms List */
.rooms-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.room-card {
    background: #16213e;
    padding: 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.room-card:hover {
    background: #1e3a5f;
    border-color: #e94560;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(233, 69, 96, 0.2);
}

.room-card.active {
    background: #1e3a5f;
    border-color: #e94560;
}

.room-name {
    color: #fff;
    font-weight: bold;
    margin-bottom: 5px;
}

.room-desc {
    font-size: 0.85em;
    color: #aaa;
    margin-bottom: 10px;
}

.room-actions {
    display: flex;
    gap: 8px;
}

.btn-sm {
    padding: 5px 10px;
    font-size: 0.8em;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.btn-delete {
    background: #d63031;
    color: #fff;
}

.btn-delete:hover {
    background: #e84e4f;
}

/* Messages List */
.messages-list {
    background: #0f3460;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #533483;
}

.message {
    background: #16213e;
    padding: 12px 15px;
    margin-bottom: 10px;
    border-radius: 6px;
    border-left: 3px solid #e94560;
}

.message-author {
    color: #e94560;
    font-weight: bold;
    font-size: 0.9em;
}

.message-time {
    color: #888;
    font-size: 0.8em;
    margin-left: 10px;
}

.message-content {
    color: #e0e0e0;
    margin-top: 8px;
    line-height: 1.4;
    word-wrap: break-word;
}

.message-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.btn-sm-delete {
    padding: 4px 8px;
    font-size: 0.75em;
    background: #d63031;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-sm-delete:hover {
    background: #e84e4f;
}

/* Message Controls */
.message-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

#authorInput {
    padding: 10px 15px;
    background: #0f3460;
    border: 1px solid #533483;
    border-radius: 6px;
    color: #e0e0e0;
}

#authorInput:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 8px rgba(233, 69, 96, 0.2);
}

#messageInput {
    padding: 12px 15px;
    background: #0f3460;
    border: 1px solid #533483;
    border-radius: 6px;
    color: #e0e0e0;
    font-family: inherit;
    font-size: 0.95em;
    resize: vertical;
    min-height: 80px;
}

#messageInput:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 8px rgba(233, 69, 96, 0.2);
}

/* Buttons */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 0.95em;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.btn-primary {
    background: linear-gradient(135deg, #e94560 0%, #d63031 100%);
    color: #fff;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(233, 69, 96, 0.3);
}

.btn-primary:active {
    transform: translateY(0);
}

/* Footer */
footer {
    background: #1a2a47;
    padding: 20px;
    text-align: center;
    color: #888;
    font-size: 0.9em;
    border-top: 1px solid #533483;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #0f3460;
}

::-webkit-scrollbar-thumb {
    background: #533483;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #e94560;
}

/* Responsive Design */
@media (max-width: 768px) {
    header h1 {
        font-size: 1.8em;
    }

    .rooms-list {
        grid-template-columns: 1fr;
    }

    .room-controls {
        flex-direction: column;
    }

    .room-controls input {
        min-width: auto;
    }

    main {
        padding: 20px 15px;
    }
}
```

---

### 11. `src/main/resources/static/app.js` – Frontend Logic

```javascript
const API_BASE = '/api';
let selectedRoomId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadRooms();
});

// ===== ROOM FUNCTIONS =====

async function loadRooms() {
    try {
        const response = await fetch(`${API_BASE}/rooms`);
        const rooms = await response.json();
        displayRooms(rooms);
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Failed to load rooms');
    }
}

function displayRooms(rooms) {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = '';
    
    if (rooms.length === 0) {
        roomsList.innerHTML = '<p style="color: #aaa;">No rooms yet. Create one to start!</p>';
        return;
    }
    
    rooms.forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        if (room.id === selectedRoomId) roomCard.classList.add('active');
        
        roomCard.innerHTML = `
            <div class="room-name">${escapeHtml(room.roomName)}</div>
            <div class="room-desc">${escapeHtml(room.description || 'No description')}</div>
            <div class="room-actions">
                <button class="btn-sm btn-delete" onclick="deleteRoom(${room.id})">Delete</button>
            </div>
        `;
        
        roomCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-delete')) {
                selectRoom(room);
            }
        });
        
        roomsList.appendChild(roomCard);
    });
}

async function createRoom() {
    const roomName = document.getElementById('roomName').value.trim();
    const description = document.getElementById('roomDescription').value.trim();
    
    if (!roomName) {
        alert('Please enter a room name');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomName, description })
        });
        
        if (response.ok) {
            document.getElementById('roomName').value = '';
            document.getElementById('roomDescription').value = '';
            loadRooms();
        } else {
            alert('Failed to create room');
        }
    } catch (error) {
        console.error('Error creating room:', error);
        alert('Error creating room');
    }
}

async function deleteRoom(roomId) {
    if (!confirm('Delete this room and all messages?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/rooms/${roomId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            if (selectedRoomId === roomId) {
                selectedRoomId = null;
                document.getElementById('messagesSection').style.display = 'none';
            }
            loadRooms();
        } else {
            alert('Failed to delete room');
        }
    } catch (error) {
        console.error('Error deleting room:', error);
        alert('Error deleting room');
    }
}

// ===== MESSAGE FUNCTIONS =====

async function selectRoom(room) {
    selectedRoomId = room.id;
    document.getElementById('messagesSection').style.display = 'block';
    document.getElementById('selectedRoomTitle').textContent = `📝 ${escapeHtml(room.roomName)}`;
    loadRooms();
    loadMessages();
}

async function loadMessages() {
    if (!selectedRoomId) return;
    
    try {
        const response = await fetch(`${API_BASE}/rooms/${selectedRoomId}/messages`);
        const messages = await response.json();
        displayMessages(messages);
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p style="color: #aaa; text-align: center; padding: 20px;">No messages yet. Start writing!</p>';
        return;
    }
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message';
        
        const time = new Date(msg.createdAt).toLocaleString();
        
        msgDiv.innerHTML = `
            <div>
                <span class="message-author">${escapeHtml(msg.author)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${escapeHtml(msg.content)}</div>
            <div class="message-actions">
                <button class="btn-sm-delete" onclick="deleteMessage(${msg.id})">Delete</button>
            </div>
        `;
        
        messagesList.appendChild(msgDiv);
    });
    
    // Scroll to bottom
    messagesList.scrollTop = messagesList.scrollHeight;
}

async function sendMessage() {
    if (!selectedRoomId) {
        alert('Please select a room first');
        return;
    }
    
    const content = document.getElementById('messageInput').value.trim();
    const author = document.getElementById('authorInput').value.trim() || 'Anonymous';
    
    if (!content) {
        alert('Please write a message');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/rooms/${selectedRoomId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, author })
        });
        
        if (response.ok) {
            document.getElementById('messageInput').value = '';
            loadMessages();
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message');
    }
}

async function deleteMessage(messageId) {
    if (!confirm('Delete this message?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/messages/${messageId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadMessages();
        } else {
            alert('Failed to delete message');
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message');
    }
}

// ===== UTILITY FUNCTIONS =====

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

---

### 12. `Dockerfile` – Multi-Stage Docker Build

```dockerfile
# ===== STAGE 1: Build =====
FROM maven:3.9.0-eclipse-temurin-17 AS builder

WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src/ ./src/

RUN mvn clean package -DskipTests

# ===== STAGE 2: Runtime =====
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create data directory for H2 database
RUN mkdir -p /app/data

# Copy JAR from builder stage
COPY --from=builder /build/target/diary-devops-*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Run Spring Boot app
ENTRYPOINT ["java", "-Xmx256m", "-Xms128m", "-jar", "app.jar"]
```

---

### 13. `.dockerignore` – Optimize Build Context

```
target/
.git/
.gitignore
.classpath
.project
.settings/
*.class
*.log
.DS_Store
data/
```

---

### 14. `.gitignore` – Prevent Committing Build Artifacts

```
# Maven
target/
.m2/
pom.xml.tag
pom.xml.releaseBackup

# IDE
.vscode/
.idea/
*.iml
*.iws
*.ipr

# OS
.DS_Store
Thumbs.db

# Database
data/
*.h2.db

# Logs
*.log
```

---

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

## 🔁 CI/CD Pipeline (Ready for GitHub Actions)

### `.github/workflows/build-deploy.yml`

```yaml
name: Build & Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        run: mvn clean package

      - name: Build Docker image
        run: docker build -t diary-devops:${{ github.sha }} .

      # Optional: Push to Docker Hub or GHCR
      # - name: Push to Docker Hub
      #   run: |
      #     docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
      #     docker tag diary-devops:${{ github.sha }} your-docker-hub/diary-devops:latest
      #     docker push your-docker-hub/diary-devops:latest
```

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
