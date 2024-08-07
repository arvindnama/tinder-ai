import { useEffect, useState } from 'react';
import './App.css'
import { User, MessageCircle, X, Heart, Send} from 'lucide-react'

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

const getRandomProfile = async(): Promise<Profile> => {
    const profile = await fetch("http://localhost:8080/profiles/random");

    if(!profile.ok) throw new Error("Unable to fetch profile")

    return profile.json()
}



const ChatView = () => {

    const [input , setInput] = useState('');

    const handleSend = () => {
        if(!input.trim()) return;

        console.log(input);
        setInput('');
    }
    return (
        <div className="rounded-lg shadow-lg p-4">
            <h2 className="text-2x1 font-bold mb-4"> Chat with Foo bar</h2>
            <div className="border rounded overflow-y-auto mb-4 p-2 h-[60vh]">
            {[
                "hi",
                "how are you",
                "how are you",
                "how are you",
                "how are you",
                "how are you",
                "how are you",
                "how are you",
                "how are you",
            ].map((message, idx) => (
                <div key={idx} className="mb-4 p-2 rounded bg-gray-100"> {message}</div>
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
    );
}

const MatchesList = ({onSelect} : {onSelect: (matchId: string) => void}) => {

    return (
        <div className="rounded-lg overflow-hidden bg-white shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Matches</h2>
            <ul>
                {[
                    { id:"1", firstName:"Foo", lastName: "Bar", imageUrl:"http://127.0.0.1:8081/0c9655b1-f944-4869-b974-0e1aaf29757e.jpg"},
                    { id:"2", firstName:"Abc", lastName: "Buzz", imageUrl:"http://127.0.0.1:8081/06fe0dc9-0915-4ede-9674-db77e54540e8.jpg"}
                ].map((match) => {
                    return (
                        <li
                            key={match.id}
                            className="mb-2"
                        >
                            <button className="
                                hover:bg-gray-100 w-full rounded flex item-center"
                                onClick={() => onSelect(match.id)}
                            >
                                <img className="w-16 h-16 rounded-full mr-3 object-cover"
                                    src={match.imageUrl}
                                />
                                <span>
                                    <h3 className="font-bold">{match.firstName} {match.lastName}</h3>
                                </span>
                            </button>
                        </li>
                    )
                }) }
            </ul>
        </div>
    );
}

const ProfileSelector = ({profile, onSwipe}: {
        profile?: Profile,
        onSwipe: (direction: SwipeDirection) => void
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
                        onClick={() => onSwipe(SwipeDirection.Left)}
                    >
                        <X size={24}/>
                    </button>
                    <button className="
                        bg-green-500 rounded-full p-4 text-white hover:bg-green-700"
                        onClick={() => onSwipe(SwipeDirection.Right)}
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



function App() {

  const [currentScreen, setCurrentScreen] = useState(Screen.ProfileSelector);

  const [currentProfile, setCurrentProfile] = useState<Profile>();

  const loadRandomProfile = async () => {
    try{
        const profile  = await getRandomProfile();
        setCurrentProfile(profile)
    }catch(e){
        console.error(e)
    }
  }

    useEffect(() => {
        loadRandomProfile()
    }, []);

  const renderScreen = () => {
    switch (currentScreen) {
        case Screen.ProfileSelector:
            return <ProfileSelector
                profile={currentProfile}
                onSwipe={() => loadRandomProfile()}
            />
        case Screen.MatchesList:
            return <MatchesList onSelect={ () => setCurrentScreen(Screen.Chat)} />
        case Screen.Chat:
            return <ChatView/>
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
}

export default App
