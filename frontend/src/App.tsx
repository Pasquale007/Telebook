import { Button } from 'antd';
import Format from './Format';
import LoginModal from './components/LoginModal/LoginModal';
import './App.css';
import { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { Addressbook } from './sharedTypes';

const BASE_URL = process.env.REACT_APP_BASE_ENDPOINT || "";
const ADDRESSBOOK_ENDPOINT = process.env.REACT_APP_ADDRESSBOOK_ENDPOINT || "";


function App(): ReactElement {

  const [addressbooks, setAddressbooks] = useState<Addressbook[]>([]);

  useEffect(() => {
    axios.get(BASE_URL + ADDRESSBOOK_ENDPOINT + sessionStorage.getItem('id') + "/get"
    ).then(response => {
      setAddressbooks(response.data)
    }).catch(err => {
      console.log(err);
    })

  }, []);

  function isLoggedIn(): boolean {
    //convert to boolean with '!!'
    return !!sessionStorage.getItem('loggedIn');
  }

  function clickCallback(element: Addressbook) {
    console.log(element);
  }

  return (
    <div>
      {isLoggedIn() ?
        <Format addressbooks={addressbooks} callback={clickCallback}>
          <Button type="default">Hi</Button>
        </Format>
        :
        <LoginModal />
      }
    </div>
  );
}
export default App;

