package io.anama.tinder_ai_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.anama.tinder_ai_backend.profiles.Gender;
import io.anama.tinder_ai_backend.profiles.Profile;
import io.anama.tinder_ai_backend.profiles.ProfileRepository;

@SpringBootApplication
public class TinderAiBackendApplication implements CommandLineRunner {

    @Autowired
    private ProfileRepository profileRepository;

    public static void main(String[] args) {
        SpringApplication.run(TinderAiBackendApplication.class, args);
    }

    public void run(String... args) {
        System.out.println("Command Line Runner");
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

        profileRepository.save(profile);
        profileRepository.findAll().forEach(System.out::println);
    }

}
