package io.anama.tinder_ai_backend;

import java.time.LocalDateTime;
import java.util.List;

import io.anama.tinder_ai_backend.profiles.ProfileCreationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.anama.tinder_ai_backend.conversations.ChatMessage;
import io.anama.tinder_ai_backend.conversations.Conversation;
import io.anama.tinder_ai_backend.conversations.ConversationRepository;
import io.anama.tinder_ai_backend.profiles.Gender;
import io.anama.tinder_ai_backend.profiles.Profile;
import io.anama.tinder_ai_backend.profiles.ProfileRepository;

@SpringBootApplication
public class TinderAiBackendApplication implements CommandLineRunner {


    @Autowired
    private ProfileCreationService profileCreationService;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    public static void main(String[] args) {
        SpringApplication.run(TinderAiBackendApplication.class, args);
    }

    public void run(String... args) {
        profileCreationService.createProfiles(0);
        profileCreationService.saveProfilesToDB();
    }

}
