import './styles/styles.css';

function App() {
    return (
        <div className="app">
            <header className="main-header">
                <div className="container header-container">
                    <div className="logo">
                        <img 
                            src="/img/CondoNotifyLogo.png" 
                            alt="Logo CondoNotify" 
                            className="logo-img" 
                        />
                        <span className="logo-text">CondoNotify</span>
                    </div>
                </div>
            </header>
            <main className="main-content">
                <div className="container">
                    <h1>🚀 CondoNotify migrando a React</h1>
                    <p>El CSS ya está aplicado. ¡Vamos paso a paso!</p>
                </div>
            </main>
        </div>
    );
}

export default App;