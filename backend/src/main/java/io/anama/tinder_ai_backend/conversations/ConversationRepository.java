package io.anama.tinder_ai_backend.conversations;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    List<Conversation> findByProfileId(String profileId);

}
