package io.anama.tinder_ai_backend;

import java.time.LocalDateTime;
import java.util.List;

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
    private ProfileRepository profileRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    public static void main(String[] args) {
        SpringApplication.run(TinderAiBackendApplication.class, args);
    }

    public void run(String... args) {
        System.out.println("Command Line Runner");

        profileRepository.deleteAll();
        conversationRepository.deleteAll();

        Profile profile = new Profile(
                "1",
                "Arvind",
                "Nama",
                "Software Engineer",
                "foo.jpeg",
                "Indian",
                "INTP",
                Gender.MALE,
                38);

        Profile profile2 = new Profile(
                "2",
                "foo",
                "bar",
                "Software Engineer",
                "foo.jpeg",
                "Indian",
                "INTP",
                Gender.MALE,
                38);

        profileRepository.save(profile);
        profileRepository.save(profile2);
        profileRepository.findAll().forEach(System.out::println);

        Conversation conversation = new Conversation(
                "1",
                profile.id(),
                List.of(
                        new ChatMessage(
                                "Hello",
                                profile.id(),
                                LocalDateTime.now())));

        conversationRepository.save(conversation);
        conversationRepository.findAll().forEach(System.out::println);
    }

}
