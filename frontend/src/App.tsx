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
  const [contacts, setContacts] = useState<Contact[] | undefined>(undefined);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [editContact, setEditContact] = useState<Contact | undefined>(undefined);
  const [deleteContact, setDeleteContact] = useState<Contact | undefined>(undefined);
  const [newContact, setNewContact] = useState<Contact | undefined>(undefined);

  useEffect(() => {
    if (currentAddressbook) {
      axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + currentAddressbook?.id + CONTACT_ENDPOINT
      ).then(response => {
        let sortedData = response.data.sort(function (a: Contact, b: Contact) {
          return (a.first_name.localeCompare(b.first_name) !== 0) ? a.first_name.localeCompare(b.first_name) : a.last_name?.localeCompare(b.last_name || "");
        });

        setAllContacts(sortedData);
      }).catch(err => {
        console.log(err);
      })
    }

  }, [currentAddressbook]);

  useEffect(() => {
    updateAddressbooks();
  }, []);

  function updateAddressbooks() {
    axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + sessionStorage.getItem('id') + "/get"
    ).then(response => {
      setAddressbooks(response.data)
    }).catch(err => {
      console.log(err);
    })
  }
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

  function filterContacts(inputString: string) {
    if (inputString.length === 0) {
      setContacts(undefined)
    }
    // const contacts: Contact[] = allContacts.fill((contact: Contact) =>
    //   contact.first_name.includes(inputString) || contact.last_name?.includes(inputString)
    // )

    let contacts = undefined
    for (let contact of allContacts) {
      if (contact.first_name.includes(inputString) || contact.last_name?.includes(inputString) || contact.phone_numbers?.find(number => number.includes(inputString))) {
        if (!contacts) {
          contacts = [contact];
        } else {
          contacts.push(contact);
        }
      }
    }
    setContacts(contacts)

  }

  return (
    <Layout>
      <Header
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
        <div style={{ width: '20%' }}></div>
        <Input
          onChange={(e) => filterContacts(e.target.value)}
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
          <Format addressbooks={addressbooks} callback={clickCallback} updateAddressBooks={updateAddressbooks}>
            <ContactList contacts={contacts || allContacts} editContactCallback={editContactCallback} deleteContactCallback={deleteContactCallback} />
          </Format>
          :
          <LoginModal />
      }
    </Layout >
  );
}
export default App;

