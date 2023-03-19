import Format from './Format';
import LoginModal from './components/LoginModal/LoginModal';
import './App.css';
import { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { Addressbook, Contact } from './sharedTypes';
import ContactList from './components/ContactList/ContactList';
import { Form, Input, Modal } from 'antd';

const BASE_URL = process.env.REACT_APP_BASE_ENDPOINT || "";
const ADDRESSBOOK_ENDPOINT = process.env.REACT_APP_ADDRESSBOOK_ENDPOINT || "";
const CONTACT_ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT || "";

function App(): ReactElement {

  const [addressbooks, setAddressbooks] = useState<Addressbook[]>([]);
  const [currentAddressbook, setCurrentAddressbook] = useState<Addressbook>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editContact, setEditContact] = useState<Contact | undefined>(undefined);


  useEffect(() => {
    axios.get(BASE_URL + ADDRESSBOOK_ENDPOINT + currentAddressbook?.id + CONTACT_ENDPOINT
    ).then(response => {
      setContacts(response.data);
    }).catch(err => {
      console.log(err);
    })
  }, [currentAddressbook]);

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

  function clickCallback(addressbook: Addressbook) {
    setCurrentAddressbook(addressbook);
  }

  function editContactCallback(contact: Contact) {
    console.log(contact);
    setEditContact(contact)

  }

  return (
    <div>
      <Modal
        open={editContact ? true : false}
      >
        <Form>

        </Form>
      </Modal>
      {
        isLoggedIn() ?
          <Format addressbooks={addressbooks} callback={clickCallback}>
            <ContactList contacts={contacts} editContactCallback={editContactCallback} />
          </Format>
          :
          <LoginModal />
      }
    </div >
  );
}
export default App;

