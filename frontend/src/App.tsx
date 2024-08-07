import { useEffect, useState } from 'react';
import './App.css'
import { User, MessageCircle, X, Heart, Send} from 'lucide-react'
import classNames from 'classnames';

enum Screen {
    ProfileSelector,
    MatchesList,
    Chat
}

enum SwipeDirection {
    Left,
    Right
}

interface Profile {
    id: string,
    firstName: string,
    lastName: string,
    bio: string,
    imageUrl: string,
    ethnicity: string,
    myersBriggsPersonalityType: string,
    gender: string,
    age: number
}

interface ProfileMatch {
    id: string,
    conversationId: string,
    profile: Profile
}

interface ChatMessage {
    messageText: string,
    authorId: string,
    messageTime: string,
}

interface Conversation {
    id: string,
    profileId: string,
    messages: ChatMessage[]
}


const fetchConversation = async(conversationId: string): Promise<Conversation> => {
    const conversation = await fetch(`http://localhost:8080/conversations/${conversationId}`);

    if(!conversation.ok) throw new Error(`Unable to fetch conversation for ${conversationId}`)

    return conversation.json()
}

const fetchMatches = async(): Promise<ProfileMatch[]> => {
    const matches = await fetch("http://localhost:8080/matches");

    if(!matches.ok) throw new Error("Unable to fetch profile")

    return matches.json()
}

const fetchRandomProfile = async(): Promise<Profile> => {
    const profile = await fetch("http://localhost:8080/profiles/random");

    if(!profile.ok) throw new Error("Unable to fetch profile")

    return profile.json()
}

const saveMatch = async(profileId: string) : Promise<void>  => {
    const resp = await fetch("http://localhost:8080/matches", {
        headers: {
            "Content-Type":"application/json"
        },
        method: 'POST',
        body: JSON.stringify({profileId})
    })

    if(!resp.ok) throw new Error("Unable to match with profile")
}


const sendMessage = async (conversationId: string , messageText: string):Promise<Conversation> => {

    const resp = await fetch(`http://localhost:8080/conversations/${conversationId}`, {
        headers: {
            "Content-Type":"application/json"
        },
        method: 'POST',
        body: JSON.stringify({messageText, authorId: 'user'})
    })

    if(!resp.ok) throw new Error("Unable to send a chat message");
    return resp.json()
}


const ChatView = ({
    profile,
    conversationId
    }:{
        profile?: Profile,
        conversationId: string
}) => {

    const [chatMessages , setChatMessages] = useState<ChatMessage[]>([]);
    const [input , setInput] = useState<string>('');

    const loadConversation = async() => {
        try{
            const conversation = await fetchConversation(conversationId)
            setChatMessages(conversation.messages);
        }catch(e){
            console.error(e)
        }
    }

    useEffect(() => {loadConversation()}, [])

    const handleSend = async () => {
        if(!input.trim()) return;
        setInput('');
        try{
            const newConversation = await sendMessage(conversationId, input)
            setChatMessages(newConversation.messages)
        }catch(e){
            console.error(e)
        }
    }


    return (
        profile?(
            <div className="rounded-lg shadow-lg p-4">
                <h2 className="text-2x1 font-bold mb-4">
                    Chat with {profile.firstName} {profile.lastName}
                </h2>
                <div className="border rounded overflow-y-auto mb-4 p-2 h-[60vh]">
                {chatMessages?.map((chat, idx) => (
                    <div key={idx}
                        className= {classNames(
                            "mb-4 p-4",
                            "rounded",
                            chat.authorId === "user" ? "bg-blue-100 text-right": "bg-gray-100 text-left"
                        )}
                    >
                        {chat.messageText}
                    </div>
                    )
                )}
                </div>

                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border flex-1 rounded p-2 mr-2"
                        placeholder="Type a message ..."
                    ></input>
                    <button
                        className="bg-blue-500 text-white rounded p-2"
                        onClick={handleSend}
                    ><Send/></button>

                </div>
            </div>
        ):
        <div>Loading...</div>
    );
}

const MatchesList = ({
    profile,
    onSelect
    } : {
        profile?: Profile,
        onSelect: (profile: Profile, conversationId: string) => void
    }
) => {
    const [matches, setMatches] = useState<ProfileMatch[]>()
    const loadMatches = async () => {
        try {
            setMatches(await fetchMatches());
        }catch(e){
            console.error(e);
        }
    }

    useEffect(() => {
        loadMatches()
    }, [])


    return (
        profile? (
            <div className="rounded-lg overflow-hidden bg-white shadow-lg p-4">
                <h2 className="text-2xl font-bold mb-4">Matches</h2>
                <ul>
                    {matches?.map((match) => {
                        return (
                            <li
                                key={match.id}
                                className="mb-2"
                            >
                                <button className="
                                    hover:bg-gray-100 w-full rounded flex item-center"
                                    onClick={() => onSelect(match.profile, match.conversationId)}
                                >
                                    <img
                                        className="w-16 h-16 rounded-full mr-3 object-cover"
                                        src={
                                            `http://localhost:8081/${match.profile.imageUrl}`}
                                    />
                                    <span>
                                        <h3 className="font-bold"
                                        >
                                            {match.profile.firstName} {match.profile.lastName}
                                        </h3>

                                    </span>
                                </button>
                            </li>
                        )
                    }) }
                </ul>
            </div>
        ): <div>Loding....</div>

    );
}

const ProfileSelector = ({profile, onSwipe}: {
        profile?: Profile,
        onSwipe: (profile: Profile, direction: SwipeDirection) => void
    }
) => {

    return(
        profile ?
        (
            <div className="rounded-lg overflow-hidden bg-white shadow-lg">
                <div className="relative">
                    <img src= {`http://127.0.0.1:8081/${profile.imageUrl}`}/>
                    <div className="
                        absolute
                        bottom-0 left-0 right-0 text-white p-4
                        bg-gradient-to-t from-black"
                    >
                        <h2 className="text-2x1 font-bold">{profile.firstName} {profile.lastName}, {profile.age}</h2>
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-gray-600 mb-4"> {profile.bio}</p>
                </div>
                <div className="p-4 flex justify-center space-x-4">
                    <button className="
                        bg-red-500 rounded-full p-4 text-white hover:bg-red-700"
                        onClick={() => onSwipe(profile, SwipeDirection.Left)}
                    >
                        <X size={24}/>
                    </button>
                    <button className="
                        bg-green-500 rounded-full p-4 text-white hover:bg-green-700"
                        onClick={() => onSwipe(profile, SwipeDirection.Right)}
                    >
                        <Heart size={24}/>
                    </button>
                </div>
            </div>
        )
        :
        <div>Loading...</div>
    )
}



const App = () => {
    const [currentScreen, setCurrentScreen] = useState(Screen.ProfileSelector);

    const [currentProfile, setCurrentProfile] = useState<Profile>();
    const [conversationId, setConversationId] = useState<string>('');

    const loadRandomProfile = async () => {
        try{
            const profile  = await fetchRandomProfile();
            setCurrentProfile(profile)
        } catch(e){
            console.error(e)
        }
    }

    const handleSwipe  = async (profile: Profile, direction: SwipeDirection) => {
        if(direction === SwipeDirection.Right) await saveMatch(profile.id);
        await loadRandomProfile()
    }

    const handleMatchSelected = (profile: Profile, conversationId: string) => {
        setCurrentScreen(Screen.Chat);
        setCurrentProfile(profile);
        setConversationId(conversationId);
    }

    useEffect(() => {
        loadRandomProfile()
    }, []);

    const renderScreen = () => {
        switch (currentScreen) {
            case Screen.ProfileSelector:
                return <ProfileSelector
                    profile={currentProfile}
                    onSwipe={handleSwipe}
                />
            case Screen.MatchesList:
                return <MatchesList
                    profile={currentProfile}
                    onSelect={ handleMatchSelected}
                />
            case Screen.Chat:
                return <ChatView
                    profile={currentProfile}
                    conversationId={conversationId}
                />
        }
    }
    return (
        <>
            <div className="max-w-md mx-auto p-4">
            <nav className="flex justify-between mb-4">
                <User onClick={() => setCurrentScreen(Screen.ProfileSelector)}/>
                <MessageCircle onClick={() => setCurrentScreen(Screen.MatchesList)}/>
            </nav>
            {
                renderScreen()
            }
            </div>
        </>
    )
};

export default App
