import Format from './Format';
import LoginModal from './components/LoginModal/LoginModal';
import './App.css';
import { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import { Addressbook, ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, Contact, CONTACT_ENDPOINT } from './sharedTypes';
import ContactList from './components/ContactList/ContactList';
import ContactModal from './components/ContactModal/ContactModal';
import ConfirmationDeleteModal from './components/ConfirmationDeleteModal/ConfirmationDeleteModal';
import { Button, Input, Layout } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';

function App(): ReactElement {

  const [addressbooks, setAddressbooks] = useState<Addressbook[]>([]);
  const [currentAddressbook, setCurrentAddressbook] = useState<Addressbook>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editContact, setEditContact] = useState<Contact | undefined>(undefined);
  const [deleteContact, setDeleteContact] = useState<Contact | undefined>(undefined);
  const [newContact, setNewContact] = useState<Contact | undefined>(undefined);

  useEffect(() => {
    if (currentAddressbook) {
      axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + currentAddressbook?.id + CONTACT_ENDPOINT
      ).then(response => {
        setContacts(response.data);
      }).catch(err => {
        console.log(err);
      })
    }

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
  function deleteContactCallback(contact: Contact) {
    setDeleteContact(JSON.parse(JSON.stringify(contact)));
  }

  function updateContacts() {
    setCurrentAddressbook(JSON.parse(JSON.stringify(currentAddressbook)));
  }

  return (
    <Layout>
      <Header
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
        <div style={{ width: '20%' }}></div>
        <Input
          style={{ padding: "10px", width: "50%" }}
          prefix={<SearchOutlined />
          }
        />
        <Button
          type="default"
          style={{ margin: "5px" }}
          icon={<PlusOutlined />}
          onClick={() => {
            if (currentAddressbook) {
              setNewContact({
                address_book_id: currentAddressbook.id,
                first_name: ''
              })
            }
          }}
        > Neuen Kontakt</Button>
      </Header>
      {newContact && <ContactModal editContact={newContact} setEditContact={setNewContact} updateContacts={updateContacts} mode={'CREATE'} />}
      {editContact && <ContactModal editContact={editContact} setEditContact={setEditContact} updateContacts={updateContacts} mode={'EDIT'} />}
      {deleteContact && <ConfirmationDeleteModal deleteContact={deleteContact} setDeleteContact={setDeleteContact} updateContacts={updateContacts} />}
      {
        isLoggedIn() ?
          <Format addressbooks={addressbooks} callback={clickCallback}>
            <ContactList contacts={contacts} editContactCallback={editContactCallback} deleteContactCallback={deleteContactCallback} />
          </Format>
          :
          <LoginModal />
      }
    </Layout >
  );
}
export default App;

