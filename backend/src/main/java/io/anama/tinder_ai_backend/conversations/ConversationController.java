package io.anama.tinder_ai_backend.conversations;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.anama.tinder_ai_backend.profiles.ProfileRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class ConversationController {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @PostMapping("/Conversations")
    public Conversation createConversation(@RequestBody CreateConversationRequest request) {

        profileRepository.findById(request.profileId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Unable to find a profile " + request.profileId()));

        String id = UUID.randomUUID().toString();
        Conversation conversation = new Conversation(
                id,
                request.profileId(),
                new ArrayList<>());

        conversationRepository.save(conversation);

        return conversation;
    }

    @PostMapping("/Conversations/{conversationId}")
    public Conversation addMessageToConversation(
            @PathVariable String conversationId,
            @RequestBody ChatMessage message) {

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Unable to find a conversation " + conversationId));

        profileRepository.findById(message.authorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Unable to find a profile " + message.authorId()));

        // TODO: Validate if the authorId is intended recipeint of conversation.
        ChatMessage chatMessage = new ChatMessage(
                message.messageText(),
                message.authorId(),
                LocalDateTime.now());

        conversation.messages().add(chatMessage);
        conversationRepository.save(conversation);
        return conversation;

    }

    @GetMapping("/conversations/{conversationId}")
    public Conversation getConversation(@PathVariable String conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Unable to find a conversation " + conversationId));

        return conversation;
    }

}
