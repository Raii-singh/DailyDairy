package com.example;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DiaryController {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;

    public DiaryController(ChatRoomRepository chatRoomRepository,
                           MessageRepository messageRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
    }

    @GetMapping("/ping")
    public String ping() {
        return "Pong! Spring Boot diary is alive.";
    }

    // ---------- ROOMS ----------

    @PostMapping("/rooms")
    public ChatRoom createRoom(@RequestBody ChatRoom room) {
        return chatRoomRepository.save(room);
    }

    @GetMapping("/rooms")
    public List<ChatRoom> getRooms() {
        return chatRoomRepository.findAll();
    }

    // ---------- MESSAGES ----------

    @PostMapping("/rooms/{roomId}/messages")
    public Message createMessage(@PathVariable Long roomId,
                                 @RequestBody Message body) {
        // simple check room exists
        chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Message msg = new Message(
                roomId,
                body.getSender() != null ? body.getSender() : "me",
                body.getContent(),
                LocalDateTime.now()
        );
        return messageRepository.save(msg);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public List<Message> getMessages(@PathVariable Long roomId) {
        return messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId);
    }
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
    if (!messageRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }
    messageRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}

}
