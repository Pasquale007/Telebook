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
import { SearchOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import AddressbookModal from './components/AddressbookModal/AddressbookModal';

function App(): ReactElement {

  const [addressbooks, setAddressbooks] = useState<Addressbook[]>([]);
  const [currentAddressbook, setCurrentAddressbook] = useState<Addressbook | undefined>(undefined);
  const [contacts, setContacts] = useState<Contact[] | undefined>(undefined);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [editContact, setEditContact] = useState<Contact | undefined>(undefined);
  const [editAddressbook, setEditAddressbook] = useState<Addressbook | undefined>();
  const [deleteContact, setDeleteContact] = useState<Contact | undefined>(undefined);
  const [newContact, setNewContact] = useState<Contact | undefined>(undefined);

  useEffect(() => {
    if (currentAddressbook) {
      axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + currentAddressbook?.id + CONTACT_ENDPOINT
      ).then(response => {
        //to arrrow function
        let sortedData = response.data.sort((a: Contact, b: Contact) => {
          return (a.first_name.localeCompare(b.first_name) !== 0) ? a.first_name.localeCompare(b.first_name) : a.last_name?.localeCompare(b.last_name || "");
        });

        setAllContacts(sortedData);
      }).catch(err => {
        console.log(err);
      })
    } else {
      setAllContacts([]);
    }

  }, [currentAddressbook]);

  useEffect(() => {
    updateAddressbooks();
  }, []);

  useEffect(() => {
    if (currentAddressbook) {
      updateContacts();
    }
  }, [addressbooks]);

  const updateAddressbooks = (): void => {
    axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + sessionStorage.getItem('id') + "/get"
    ).then(response => {
      setAddressbooks(response.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const isLoggedIn = (): boolean => {
    //convert to boolean with '!!'
    return !!sessionStorage.getItem('loggedIn');
  }

  const clickCallback = (addressbook: Addressbook): void => {
    setCurrentAddressbook(addressbook);
  }

  const editContactCallback = (contact: Contact): void => {
    setEditContact(contact);
  }
  const deleteContactCallback = (contact: Contact): void => {
    setDeleteContact(JSON.parse(JSON.stringify(contact)));
  }

  const updateContacts = (): void => {
    setCurrentAddressbook(JSON.parse(JSON.stringify(currentAddressbook)));
  }

  const filterContacts = (inputString: string) => {
    if (inputString.length === 0) {
      setContacts(undefined);
    }
    const contacts: Contact[] = allContacts.filter((contact: Contact) =>
      contact.first_name.includes(inputString) || contact.last_name?.includes(inputString) || contact.phone_numbers?.find(number => number.includes(inputString))
    )
    setContacts(contacts);

  }

  return (
    <Layout>
      <Header
        style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
        {currentAddressbook && <Button
          type="default"
          style={{ margin: "5px", width: '15%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          icon={<EditOutlined />}
          onClick={() => {
            setEditAddressbook(currentAddressbook)
          }}
        > {currentAddressbook.name}</Button>}
        <Input
          onChange={(e) => filterContacts(e.target.value)}
          style={{ padding: "10px", width: "50%" }}
          prefix={<SearchOutlined />
          }
        />
        {currentAddressbook && <Button
          type="default"
          style={{ margin: "5px", width: '15%' }}
          icon={<PlusOutlined />}
          onClick={() => {
            if (currentAddressbook) {
              setNewContact({
                address_book_id: currentAddressbook.id,
                first_name: ''
              })
            }
          }}
        > Kontakt</Button>}
      </Header>
      {newContact && <ContactModal editContact={newContact} setEditContact={setNewContact} updateContacts={updateContacts} mode={'CREATE'} />}
      {editContact && <ContactModal editContact={editContact} setEditContact={setEditContact} updateContacts={updateContacts} mode={'EDIT'} />}
      {editAddressbook && <AddressbookModal addressbook={editAddressbook} setEditAddressbook={setEditAddressbook} updateAddressbooks={updateAddressbooks} deleteAddressbook={setCurrentAddressbook} />}
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

