import './App.css'
import { User, MessageCircle, X, Heart} from 'lucide-react'


const MatchesList = () => {

    return (
        <div className="rounded-lg overflow-hidden bg-white shadow-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Matches</h2>
            <ul>
                {[
                    { id:1, firstName:"Foo", lastName: "Bar", imageUrl:"http://127.0.0.1:8081/0c9655b1-f944-4869-b974-0e1aaf29757e.jpg"},
                    { id:1, firstName:"Abc", lastName: "Buzz", imageUrl:"http://127.0.0.1:8081/06fe0dc9-0915-4ede-9674-db77e54540e8.jpg"}
                ].map((match) => {
                    return (
                        <li key={match.id} className="mb-2">
                            <button className="
                                hover:bg-gray-100 w-full rounded flex item-center"
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

const ProfileSelector = () => {

    return(
        <div className="rounded-lg overflow-hidden bg-white shadow-lg">
            <div className="relative">
                <img src= "http://127.0.0.1:8081/0c9655b1-f944-4869-b974-0e1aaf29757e.jpg"/>
                <div className="
                    absolute
                    bottom-0 left-0 right-0 text-white p-4
                    bg-gradient-to-t from-black"
                >
                    <h2 className="text-2x1 font-bold">Foo Bar, 30</h2>
                </div>
            </div>
            <div className="p-4">
                <p className="text-gray-600 mb-4"> adadad adadada ada</p>
            </div>
            <div className="p-4 flex justify-center space-x-4">
                <button className="
                    bg-red-500 rounded-full p-4 text-white hover:bg-red-700"
                    onClick={() => console.log('Swipe left')}
                >
                    <X size={24}/>
                </button>
                <button className="
                    bg-green-500 rounded-full p-4 text-white hover:bg-green-700"
                    onClick={() => console.log('Swipe right')}
                >
                    <Heart size={24}/>
                </button>
            </div>
        </div>
    )
}

function App() {

  return (
    <>
        <div className="max-w-md mx-auto">
        <nav className='flex justify-between'>
            <User/>
            <MessageCircle/>
        </nav>
        <ProfileSelector/>
        <MatchesList/>
        </div>
    </>
  )
}

export default App
