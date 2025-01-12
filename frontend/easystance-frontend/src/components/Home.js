import { useAuth } from '../services/AuthContext';

function Home() {
    const { logout } = useAuth();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    };    

    return (
        <div>
            <p>HOME</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;