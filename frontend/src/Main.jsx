import Format from './Format';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, CONTACT_ENDPOINT, BASE_URL } from './sharedTypes';
import ContactList from './components/ContactList/ContactList';
import ContactModal from './components/ContactModal/ContactModal';
import ConfirmationDeleteModal from './components/ConfirmationDeleteModal/ConfirmationDeleteModal';
import { Button, Input, Layout } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import AddressbookModal from './components/AddressbookModal/AddressbookModal';

function App() {

  const [addressbooks, setAddressbooks] = useState([]);
  const [currentAddressbook, setCurrentAddressbook] = useState(undefined);
  const [contacts, setContacts] = useState(undefined);
  const [allContacts, setAllContacts] = useState([]);
  const [editContact, setEditContact] = useState(undefined);
  const [editAddressbook, setEditAddressbook] = useState();
  const [deleteContact, setDeleteContact] = useState(undefined);
  const [newContact, setNewContact] = useState(undefined);

  useEffect(() => {
    console.log(currentAddressbook?.name)
    if (currentAddressbook) {
      axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + currentAddressbook?.id + CONTACT_ENDPOINT
      ).then(response => {
        let sortedData = response.data.sort((a, b) => {
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

  const updateAddressbooks = () => {
    axios.get(BASE_ENDPOINT + ADDRESSBOOK_ENDPOINT + sessionStorage.getItem('id') + "/get"
    ).then(response => {
      setAddressbooks(response.data);
    }).catch(err => {
      console.log(err);
    })
  }

  const clickCallback = (addressbook) => {
    setCurrentAddressbook(addressbook);
  }

  const editContactCallback = (contact) => {
    setEditContact(contact);
  }

  const deleteContactCallback = (contact) => {
    setDeleteContact(JSON.parse(JSON.stringify(contact)));
  }

  const updateContacts = () => {
    setCurrentAddressbook(JSON.parse(JSON.stringify(currentAddressbook)));
  }

  const filterContacts = (inputString) => {
    if (inputString.length === 0) {
      setContacts(undefined);
    }
    const contacts = allContacts.filter((contact) =>
      contact.first_name.includes(inputString) || contact.last_name?.includes(inputString) || contact.phone_numbers?.find(number => number.includes(inputString))
    )
    setContacts(contacts);

  }

  const logout = () => {
    sessionStorage.clear();
    window.location.href = BASE_URL;
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

        <Button
          icon={<LogoutOutlined />}
          onClick={logout}
        ></Button>
      </Header>
      {newContact && <ContactModal editContact={newContact} setEditContact={setNewContact} updateContacts={updateContacts} mode={'CREATE'} />}
      {editContact && <ContactModal editContact={editContact} setEditContact={setEditContact} updateContacts={updateContacts} mode={'EDIT'} />}
      {editAddressbook && <AddressbookModal addressbook={editAddressbook} setEditAddressbook={setEditAddressbook} updateAddressbooks={updateAddressbooks} deleteAddressbook={setCurrentAddressbook} />}
      {deleteContact && <ConfirmationDeleteModal deleteContact={deleteContact} setDeleteContact={setDeleteContact} updateContacts={updateContacts} />}
      {
        <Format addressbooks={addressbooks} callback={clickCallback} updateAddressBooks={updateAddressbooks}>
          <ContactList contacts={contacts || allContacts} editContactCallback={editContactCallback} deleteContactCallback={deleteContactCallback} />
        </Format>
      }
    </Layout>
  );
}
export default App;
