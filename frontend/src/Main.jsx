import Format from './Format';
import './App.css';
import { useEffect, useState, createContext, useMemo } from 'react';
import { axiosInstance } from './axios';
import { ADDRESSBOOK_ENDPOINT, CONTACT_ENDPOINT, BASE_URL, LOGOUT_ENDPOINT, CONTACT_URL } from './sharedValues';
import ContactList from './components/ContactList/ContactList';
import ContactModal from './components/ContactModal/ContactModal';
import ConfirmationDeleteModal from './components/ConfirmationDeleteModal/ConfirmationDeleteModal';
import { Button, Input, Layout, Popover, notification } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import AddressbookModal from './components/AddressbookModal/AddressbookModal';
import { useNavigate } from "react-router-dom";
import SearchBar from './components/Searchbar/Searchbar';

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

  //Dieser React-Hook soll nur beim initialen Laden ausgeführt werden und nicht auf die funktion hören. Deshalb wird hier der linter disabled
  useEffect(() => {
    updateAddressbooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      axiosInstance.get(CONTACT_URL + currentAddressbook?.id + CONTACT_ENDPOINT
      ).then(response => {
        console.log(response)
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
      navigate(`/contactbook/${currentAddressbook.id}/contact/${editContact.id}/EDIT`)
    }
  }, [currentAddressbook?.id, editContact, navigate]);

  useEffect(() => {
    if (newContact) {
      navigate(`/contactbook/${currentAddressbook.id}/contact/${newContact.id}/CREATE`)
    }

  }, [currentAddressbook?.id, navigate, newContact]);

  useEffect(() => {
    if (currentAddressbook) {
      updateContacts();
    }
    /*
    currentAddressbook und updateContact darf nicht in den dependencies sein, da sonst eine Dauerschleife auftritt.
    In diesem Spezialfall müssen die Abhängigkeiten ignoriert werden
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressbooks]);

  const updateAddressbooks = () => {
    axiosInstance.get(ADDRESSBOOK_ENDPOINT + sessionStorage.getItem('id') + "/get"
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

  const logout = () => {
    sessionStorage.clear();
    axiosInstance.post(LOGOUT_ENDPOINT
    ).then(response => {
      let sortedData = response.data.sort((a, b) => {
        return (a.first_name.localeCompare(b.first_name) !== 0) ? a.first_name.localeCompare(b.first_name) : a.last_name?.localeCompare(b.last_name || "");
      });
      setAllContacts(sortedData);
    }).catch(err => {
      console.log(err);
    })
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
          <SearchBar allContacts={allContacts} setContacts={setContacts} />
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

