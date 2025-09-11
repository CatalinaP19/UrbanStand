import React from 'react';
import GlobalStylesProvider from './GlobalStylesProvider';

// Importa tus componentes refactorizados
import UrbanStand from './Componentes/UrbanStand';
import Chat from './Componentes/ChatTemplate';
import Login from './Login/Login';
// import Register from './Login/Register';

function App() {

  return(
    <Chat />
  )

  // Aquí puedes controlar qué componente renderizar
  // const [currentView, setCurrentView] = React.useState('urbanstand');

  // const renderCurrentView = () => {
  //   switch (currentView) {
  //     case 'urbanstand':
  //       return <UrbanStand />;
  //     case 'chat':
  //       return <ChatTemplate />;
  //     case 'login':
  //       return <Login />;
  //     case 'register':
  //       return <Register />;
  //     default:
  //       return <UrbanStand />;
  //   }
  // };

  // return (
  //   <GlobalStylesProvider>
  //     <div className="app">
  //       {/* Botones de navegación para probar los componentes */}
  //       <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
  //         <button 
  //           onClick={() => setCurrentView('urbanstand')}
  //           className={`btn ${currentView === 'urbanstand' ? 'btn-primary' : 'btn-secondary'}`}
  //           style={{ marginRight: '5px', fontSize: '12px', padding: '5px 10px' }}
  //         >
  //           UrbanStand
  //         </button>
  //         <button 
  //           onClick={() => setCurrentView('chat')}
  //           className={`btn ${currentView === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
  //           style={{ marginRight: '5px', fontSize: '12px', padding: '5px 10px' }}
  //         >
  //           Chat
  //         </button>
  //         <button 
  //           onClick={() => setCurrentView('login')}
  //           className={`btn ${currentView === 'login' ? 'btn-primary' : 'btn-secondary'}`}
  //           style={{ fontSize: '12px', padding: '5px 10px' }}
  //         >
  //           Login
  //         </button>
  //         <button 
  //           onClick={() => setCurrentView('register')}
  //           className={`btn ${currentView === 'register' ? 'btn-primary' : 'btn-secondary'}`}
  //           style={{ fontSize: '12px', padding: '5px 10px' }}
  //         >
  //           Registro
  //         </button>
  //       </div>

  //       {/* Renderizar el componente actual */}
  //       {renderCurrentView()}
  //     </div>
  //   </GlobalStylesProvider>
  //);
}

export default App;