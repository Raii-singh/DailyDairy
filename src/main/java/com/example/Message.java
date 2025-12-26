package com.example;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long roomId;          // which ChatRoom this belongs to
    private String sender;        // we'll just use "me" for now
    @Column(columnDefinition = "TEXT")
    private String content;       // diary text
    private LocalDateTime createdAt;

    public Message() {}

    public Message(Long roomId, String sender, String content, LocalDateTime createdAt) {
        this.roomId = roomId;
        this.sender = sender;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getRoomId() { return roomId; }
    public String getSender() { return sender; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public void setSender(String sender) { this.sender = sender; }
    public void setContent(String content) { this.content = content; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
