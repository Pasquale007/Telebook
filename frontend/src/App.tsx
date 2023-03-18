import { Button } from 'antd';
import Format from './Format';
import LoginModal from './components/LoginModal/LoginModal';
import './App.css';
import { ReactElement } from 'react';

function App(): ReactElement {

  function isLoggedIn(): boolean {
    //convert to boolean with '!!'
    return !!sessionStorage.getItem('loggedIn');
  }


  return (
    <div>
      {isLoggedIn() ?
        <Format>
          <Button type="default">Hi</Button>
        </Format>
        :
        <LoginModal/>
      }
    </div>
  );
}
export default App;

