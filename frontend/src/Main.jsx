import Format from './Format';
import './App.css';
import { useEffect, useState, createContext, useMemo } from 'react';
import axios from 'axios';
import { ADDRESSBOOK_ENDPOINT, BASE_ENDPOINT, CONTACT_ENDPOINT, BASE_URL } from './sharedValues';
import ContactList from './components/ContactList/ContactList';
import ContactModal from './components/ContactModal/ContactModal';
import ConfirmationDeleteModal from './components/ConfirmationDeleteModal/ConfirmationDeleteModal';
import { Button, Input, Layout, Popover, notification } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import AddressbookModal from './components/AddressbookModal/AddressbookModal';
import { useNavigate } from "react-router-dom";

const Context = createContext({});

function App() {
  let navigate = useNavigate();

  const [addressbooks, setAddressbooks] = useState([]);
  const [currentAddressbook, setCurrentAddressbook] = useState(undefined);
  const [contacts, setContacts] = useState(undefined);
  const [allContacts, setAllContacts] = useState([]);
  const [editContact, setEditContact] = useState(undefined);
  const [editAddressbook, setEditAddressbook] = useState();
  const [deleteContact, setDeleteContact] = useState(undefined);
  const [newContact, setNewContact] = useState(undefined);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message, type) => {
    if (type === "success") {
      api.success({
        message: "Erfolg",
        description: <Context.Consumer>{() => message}</Context.Consumer>,
        placement: "bottomLeft",
        type: "error",
        duration: 3
      });
    } else if (type === "error") {
      api.error({
        message: "Fehler",
        description: <Context.Consumer>{() => message}</Context.Consumer>,
        placement: "bottomLeft",
        type: "error",
        duration: 3
      });
    }

  };

  const contextValue = useMemo(
    () => ({
      name: '',
    }),
    [],
  );

  useEffect(() => {
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
    if (editContact) {
      navigate("/contactbook/" + currentAddressbook.id + "/contact/" + editContact.id + "/EDIT")
    }

  }, [editContact]);

  useEffect(() => {
    if (newContact) {
      console.log(newContact)
      navigate("/contactbook/" + currentAddressbook.id + "/contact/" + newContact.id + "/CREATE")
    }

  }, [newContact]);

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
      setCurrentAddressbook(response.data.find(addressbook => addressbook.id === currentAddressbook?.id))
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
    inputString = inputString.toLowerCase();
    const contacts = allContacts.filter((contact) =>
      contact.first_name.toLowerCase().includes(inputString) ||
      contact.last_name?.toLowerCase().includes(inputString) ||
      contact.first_name.toLowerCase().concat(' ' + contact.last_name?.toLowerCase()).includes(inputString) ||
      contact.phone_numbers?.find(number => number.includes(inputString))
    )
    setContacts(contacts);

  }

  const logout = () => {
    sessionStorage.clear();
    window.location.href = BASE_URL;
  }

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Layout>
        <Header
          style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", height: '70px' }}>
          {currentAddressbook && <Button
            type="default"
            style={{ margin: "5px", width: '15%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            icon={<EditOutlined />}
            onClick={() => {
              setEditAddressbook(currentAddressbook)
            }}>
            {currentAddressbook?.name}
          </Button>}
          <Input
            onChange={(e) => filterContacts(e.target.value)}
            style={{ padding: "10px", width: "50%" }}
            prefix={<SearchOutlined />
            }
          />
          {currentAddressbook && <Button
            type="default"
            style={{ margin: "5px", width: '15%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            icon={<PlusOutlined />}
            onClick={() => {
              if (currentAddressbook) {
                setNewContact({
                  address_book_id: currentAddressbook.id,
                  id: -1,
                  first_name: ''
                })
              }
            }}
          > Kontakt</Button>}
          <Popover content={"Logout"}>
            <Button
              icon={<LogoutOutlined />}
              onClick={logout}
            ></Button>
          </Popover>
        </Header>
        {newContact && <ContactModal editContact={newContact} setEditContact={setNewContact} updateContacts={updateContacts} mode={'CREATE'} openNotification={openNotification} />}
        {editAddressbook && <AddressbookModal addressbook={editAddressbook} setEditAddressbook={setEditAddressbook} updateAddressbooks={updateAddressbooks} deleteCurrentAddressbook={setCurrentAddressbook} openNotification={openNotification} />}
        {deleteContact && <ConfirmationDeleteModal deleteContact={deleteContact} setDeleteContact={setDeleteContact} updateContacts={updateContacts} openNotification={openNotification} />}
        {
          <Format addressbooks={addressbooks} callback={clickCallback} updateAddressBooks={updateAddressbooks} openNotification={openNotification}>
            <ContactList contacts={contacts || allContacts} editContactCallback={editContactCallback} deleteContactCallback={deleteContactCallback} />
          </Format>
        }
      </Layout>
    </Context.Provider>

  );
}
export default App;

