package io.anama.tinder_ai_backend.conversations;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import io.anama.tinder_ai_backend.profiles.Profile;
import io.anama.tinder_ai_backend.profiles.ProfileRepository;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class ConversationController {

        @Autowired
        private ConversationRepository conversationRepository;

        @Autowired
        private ProfileRepository profileRepository;

        @Autowired
        private ConversationService conversationService;


        @PostMapping("/conversations/{conversationId}")
        public Conversation addMessageToConversation(@PathVariable String conversationId,
                        @RequestBody ChatMessage message) {

                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        STR."""
                                          Unable to find a conversation \{conversationId}
                                        """
                ));

                Profile matchedProfile = profileRepository.findById(
                        conversation.profileId()).orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        STR."""
                                        Unable to find a profile \{conversation.profileId()}
                                        """
                ));
                Profile user = profileRepository.findById(message.authorId()).orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        STR."""
                                        Unable to find a profile \{message.authorId()}
                                        """
                ));



                ChatMessage chatMessage = new ChatMessage(message.messageText(),message.authorId(),LocalDateTime.now());

                conversation.messages().add(chatMessage);

                conversationService.generateProfileResponse(conversation, matchedProfile, user);
                conversationRepository.save(conversation);
                return conversation;

        }

        @GetMapping("/conversations/{conversationId}")
        public Conversation getConversation(@PathVariable String conversationId) {

                return conversationRepository.findById(conversationId)
                                .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        STR."""
                                          Unable to find a conversation \{conversationId}
                                        """
                ));
        }

        @DeleteMapping("/conversations/{conversationId}")
        public void deleteConversation(@PathVariable String conversationId) {
                conversationRepository.deleteById(conversationId);
        }

}
