import React from 'react';
import { Button } from 'antd';
import Layout from './Layout';
import LoginModal from './components/LoginModal/LoginModal';
import './App.css';

function App() {
  function isLoggedIn(): boolean {
    if (sessionStorage.getItem('loggedIn')) {
      return true
    }
    return false
  }


  return (
    <div>
      {isLoggedIn() ?
        <Layout>
          <Button type="dashed">Hi</Button>
        </Layout>
        :
        <LoginModal />
      }
    </div>
  );
}
export default App;

