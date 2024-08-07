package io.anama.tinder_ai_backend.matches;


import io.anama.tinder_ai_backend.conversations.Conversation;
import io.anama.tinder_ai_backend.conversations.ConversationRepository;
import io.anama.tinder_ai_backend.profiles.Profile;
import io.anama.tinder_ai_backend.profiles.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@RestController
public class MatchController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @PostMapping("/matches")
    public Match createMatch(@RequestBody CreateMatchRequest createMatchRequest) {
        Profile profile = profileRepository.findById(createMatchRequest.profileId())
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    STR."Profile Id not found \{createMatchRequest.profileId()}"
                )
            );

        List<Conversation> conversations = conversationRepository.findByProfileId(profile.id());
        if(conversations != null && !conversations.isEmpty()) {
            // Conversation already exist for this match, do not create a new one.
            throw  new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                STR."You already have an conversation with the profile \{profile.id()}"
            );
        }

        String conversationId = UUID.randomUUID().toString();

        Conversation conversation = new Conversation(
            conversationId, profile.id(), new ArrayList<>()
        );

        conversationRepository.save(conversation);

        String matchId = UUID.randomUUID().toString();
        Match match = new Match(matchId, profile, conversationId);
        matchRepository.save(match);

        return match;
    }

    @GetMapping("/matches")
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }
}
