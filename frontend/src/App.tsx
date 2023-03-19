import Format from './Format';
import LoginModal from './components/LoginModal/LoginModal';
import './App.css';
import { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { Addressbook, ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, Contact, CONTACT_ENDPOINT } from './sharedTypes';
import ContactList from './components/ContactList/ContactList';
import EditUserModal from './components/EditUserModal/EditUserModal';

function App(): ReactElement {

  const [addressbooks, setAddressbooks] = useState<Addressbook[]>([]);
  const [currentAddressbook, setCurrentAddressbook] = useState<Addressbook>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editContact, setEditContact] = useState<Contact | undefined>(undefined);

  useEffect(() => {
    axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + currentAddressbook?.id + CONTACT_ENDPOINT
    ).then(response => {
      setContacts(response.data);
    }).catch(err => {
      console.log(err);
    })
  }, [currentAddressbook]);

  useEffect(() => {
    axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + sessionStorage.getItem('id') + "/get"
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
    setEditContact(contact);
  }

  function updateContacts() {

    setCurrentAddressbook(JSON.parse(JSON.stringify(currentAddressbook)));
  }

  return (
    <div>
      {editContact && <EditUserModal editContact={editContact} setEditContact={setEditContact} updateContacts={updateContacts} />}
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

