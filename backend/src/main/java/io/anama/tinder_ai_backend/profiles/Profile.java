package io.anama.tinder_ai_backend.profiles;

public record Profile(
        String id,
        String firstName,
        String lastName,
        String bio,
        String imageUrl,
        String ethnicity,
        String myersBriggsPersonalityType,
        Gender gender,
        int age) {
}
