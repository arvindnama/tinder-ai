package io.anama.tinder_ai_backend.matches;

import io.anama.tinder_ai_backend.profiles.Profile;

public record Match(String id, Profile profile, String conversationId) {
}
