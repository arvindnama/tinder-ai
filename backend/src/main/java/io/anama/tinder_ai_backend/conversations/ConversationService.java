package io.anama.tinder_ai_backend.conversations;


import org.springframework.ai.chat.ChatResponse;
import org.springframework.ai.chat.messages.AbstractMessage;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import io.anama.tinder_ai_backend.profiles.Profile;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Service
public class ConversationService {

    @Autowired
    private OllamaChatClient chatClient;

    public Conversation generateProfileResponse(Conversation conversation, Profile profile,
            Profile user) {

        String systemMessage = STR."""
                You are a \{profile.age()} years old \{profile.ethnicity()} \{profile.gender()}
                called \{profile.firstName()} \{profile.lastName()}
                matched with a \{user.age()} years old \{user.ethnicity()} \{user.gender()}
                called \{user.firstName()} \{user.lastName()} on Tinder.
                This is a in-app text conversation between you two.
                Pretend to be the provided person and response to the conversation as if writing on Tinder.
                Your Bio is: \{profile.bio()} and your Myers Briggs personality type is \{profile.myersBriggsPersonalityType()} respond in the role of the this person only.
                Only respond with the user text, do not use any hashtags keep the responses brief.
                Do not expose your Myers Briggs personality in the response.
                """;
        // System Message
        SystemMessage sysMessage = new SystemMessage(systemMessage);

        // User Message & Assistant Message
        List<AbstractMessage> conversationMessages= conversation.messages().stream().map((chatMessage) -> {
            if(chatMessage.authorId().equals(profile.id())){
                return new AssistantMessage(chatMessage.messageText());
            }
            return new UserMessage(chatMessage.messageText());
        }).toList();


        List<Message> messages = new ArrayList<Message>();
        messages.add(sysMessage);
        messages.addAll(conversationMessages);

        Prompt prompt = new Prompt(messages);

        ChatResponse response = chatClient.call(prompt);

        String messageFromAi = response.getResult().getOutput().getContent();

        System.out.println(STR."""
            Message from Ai assistance \{messageFromAi}
            """);

        conversation.messages().add(new ChatMessage(messageFromAi, profile.id(), LocalDateTime.now()));
        return conversation;

    }
}
