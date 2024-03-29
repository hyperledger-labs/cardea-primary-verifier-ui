import Axios from 'axios'

import Cookies from 'universal-cookie'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import AccountSetup from './UI/AccountSetup'
import AppHeader from './UI/AppHeader'

import { check } from './UI/CanUser'
import Contact from './UI/Contact'
import Contacts from './UI/Contacts'
import Credential from './UI/Credential'
import Credentials from './UI/Credentials'
import ForgotPassword from './UI/ForgotPassword'
import FullPageSpinner from './UI/FullPageSpinner'
import Home from './UI/Home'
import Login from './UI/Login'
import Presentation from './UI/Presentation'
import Presentations from './UI/Presentations'
import {
  useNotification,
  NotificationProvider,
} from './UI/NotificationProvider'
import PasswordReset from './UI/PasswordReset'
import Settings from './UI/Settings'
import User from './UI/User'
import Users from './UI/Users'

import SessionProvider from './UI/SessionProvider'
import { handleImageSrc } from '../src/UI/util'

// Redux reducers imports
import store from './store'

import {
  setLoggedIn,
  setLoggedInUserId,
  setLoggedInUsername,
  setLoggedInRoles,
  setLoggedInUserState,
  logoutUser,
} from './redux/loginReducer'
import {
  setContacts,
  setContact,
  clearContactstate,
} from './redux/contactsReducer'
import {
  setCredentials,
  setCredential,
  clearCredentialsState,
} from './redux/credentialsReducer'
import {
  setLogo,
  setOrganizationName,
  setSiteTitle,
  setSmtp,
  setTheme,
  setSchemas,
  clearSettingsState,
} from './redux/settingsReducer'
import {
  setPresentationReports,
  clearPresentationsState,
} from './redux/presentationsReducer'
import {
  setErrorMessage,
  setSuccessMessage,
} from './redux/notificationsReducer'
import {
  setUsers,
  setUser,
  setRoles,
  clearUsersState,
} from './redux/usersReducer'

import './App.css'

const Frame = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`
const Main = styled.main`
  flex: 9;
  padding: 30px;
`

function App() {
  let currentState
  const loginState = useSelector((state) => state.login)
  const settingsState = useSelector((state) => state.settings)
  const theme = settingsState.theme
  const siteTitle = settingsState.siteTitle

  const dispatch = useDispatch()

  const updateState = () => {
    currentState = store.getState()
  }

  const cookies = new Cookies()

  // (AmmonBurgi) Keeps track of loading processes. The useMemo is necessary to preserve list across re-renders.
  let loadingList = useMemo(() => [], [])

  const setNotification = useNotification()

  // Websocket reference hook
  const controllerSocket = useRef()

  // Used for websocket auto reconnect
  const [websocket, setWebsocket] = useState(false)
  const [readyForMessages, setReadyForMessages] = useState(false)

  // State governs whether the app should be loaded. Depends on the loadingArray
  const [appIsLoaded, setAppIsLoaded] = useState(false)

  // Styles to change array
  const [stylesArray, setStylesArray] = useState([])

  const [privileges, setPrivileges] = useState([])

  // session states
  const [session, setSession] = useState('')
  const [sessionTimer] = useState(60)

  const [QRCodeURL, setQRCodeURL] = useState('')
  const [
    pendingEmployeeConnectionID,
    setPendingEmployeeConnectionID,
  ] = useState('')
  const [pendingVerificationNotice, setPendingVerificationNotice] = useState(
    false
  )
  const [
    pendingVaccinationConnectionID,
    setPendingVaccinationConnectionID,
  ] = useState('')

  // (JamesKEbert) Note: We may want to abstract the websockets out into a high-order component for better abstraction, especially potentially with authentication/authorization

  // Perform First Time Setup. Connect to Controller Server via Websockets

  // Fetch the logo for unauthorized routes
  const requestLogo = () => {
    Axios({
      method: 'GET',
      url: '/api/logo',
    }).then((res) => {
      if (res.data.error) {
        setNotification(res.data.error, 'error')
      } else {
        dispatch(setLogo(handleImageSrc(res.data[0].image.data)))
      }
    })
  }

  // TODO: Setting logged-in user and session states on app mount
  useEffect(() => {
    Axios({
      method: 'GET',
      url: '/api/renew-session',
    })
      .then((res) => {
        if (cookies.get('sessionId')) {
          // Update session expiration date
          setSession(cookies.get('sessionId'))
          dispatch(setLoggedIn(true))
          dispatch(setLoggedInUserState(res.data))
          dispatch(setLoggedInUserId(res.data.id))
          dispatch(setLoggedInUsername(res.data.username))
          dispatch(setLoggedInRoles(res.data.roles))
        } else setAppIsLoaded(true)
      })
      .catch((error) => {
        // Unauthorized
        requestLogo()
        setAppIsLoaded(true)
      })
  }, [loginState.loggedIn, dispatch])

  // Setting up websocket and controllerSocket
  useEffect(() => {
    if (session && loginState.loggedIn) {
      let url = new URL('/api/ws', window.location.href)
      url.protocol = url.protocol.replace('http', 'ws')
      controllerSocket.current = new WebSocket(url.href)

      controllerSocket.current.onopen = () => {
        setWebsocket(true)
      }

      controllerSocket.current.onclose = (event) => {
        // Auto Reopen websocket connection
        // (JamesKEbert) TODO: Converse on sessions, session timeout and associated UI

        setReadyForMessages(false)
        setWebsocket(false)
      }

      // Error Handler
      controllerSocket.current.onerror = (event) => {
        setNotification('Client Error - Websockets', 'error')
      }

      // Receive new message from Controller Server
      controllerSocket.current.onmessage = (message) => {
        const parsedMessage = JSON.parse(message.data)

        messageHandler(
          parsedMessage.context,
          parsedMessage.type,
          parsedMessage.data
        )
      }
    }
  }, [loginState.loggedIn, session])

  // (eldersonar) Set-up site title. What about SEO? Will robots be able to read it?
  useEffect(() => {
    document.title = siteTitle
  }, [siteTitle])

  useEffect(() => {
    // Perform operation on websocket open
    // Run web sockets only if authenticated
    if (
      session &&
      loginState.loggedIn &&
      websocket &&
      readyForMessages &&
      loginState.loggedInUserState &&
      loadingList.length === 0
    ) {
      sendMessage('SETTINGS', 'GET_THEME', {})
      addLoadingProcess('THEME')
      sendMessage('SETTINGS', 'GET_SCHEMAS', {})
      addLoadingProcess('SCHEMAS')
      sendMessage('GOVERNANCE', 'GET_PRIVILEGES', {})
      addLoadingProcess('GOVERNANCE')

      if (check('contacts:read', 'travelers:read')) {
        sendMessage('CONTACTS', 'GET_ALL', {
          additional_tables: ['Demographic', 'Passport'],
        })
        addLoadingProcess('CONTACTS')
      }

      if (check('credentials:read')) {
        sendMessage('CREDENTIALS', 'GET_ALL', {})
        addLoadingProcess('CREDENTIALS')
      }

      if (check('presentations:read')) {
        sendMessage('PRESENTATIONS', 'GET_ALL', {})
        addLoadingProcess('PRESENTATIONS')
      }

      if (check('roles:read')) {
        sendMessage('ROLES', 'GET_ALL', {})
        addLoadingProcess('ROLES')
      }

      sendMessage('SETTINGS', 'GET_ORGANIZATION', {})
      addLoadingProcess('ORGANIZATION')

      if (check('settings:update')) {
        sendMessage('SETTINGS', 'GET_SMTP', {})
        addLoadingProcess('SMTP')
      }

      sendMessage('IMAGES', 'GET_ALL', {})
      addLoadingProcess('LOGO')

      if (check('users:read')) {
        sendMessage('USERS', 'GET_ALL', {})
        addLoadingProcess('USERS')
      }
    }
  }, [
    session,
    loginState.loggedIn,
    websocket,
    readyForMessages,
    loginState.loggedInUserState,
  ])

  // (eldersonar) Shut down the websocket
  function closeWSConnection(code, reason) {
    controllerSocket.current.close(code, reason)
  }

  // Send a message to the Controller server
  function sendMessage(context, type, data = {}) {
    if (websocket) {
      controllerSocket.current.send(JSON.stringify({ context, type, data }))
    }
  }

  // Handle inbound messages
  const messageHandler = async (context, type, data = {}) => {
    //Update to current state
    updateState()

    try {
      console.log(
        `New Message with context: '${context}' and type: '${type}' with data:`,
        data
      )
      switch (context) {
        case 'ERROR':
          switch (type) {
            case 'SERVER_ERROR':
              setNotification(
                `Server Error - ${data.errorCode} \n Reason: '${data.errorReason}'`,
                'error'
              )
              break

            case 'WEBSOCKET_ERROR':
              clearLoadingProcess()
              dispatch(setErrorMessage(data.error))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'INVITATIONS':
          switch (type) {
            case 'INVITATION':
              setQRCodeURL(data.invitation_record.invitation_url)
              break

            case 'SINGLE_USE_USED':
              if (data.workflow === 'client_employee') {
                // (mikekebert) Reset the QR code URL (which also closes the QR code modal)
                setQRCodeURL('')
                // (mikekebert) Set the pending employee connection_id (which also opens the employee credential form)
                setPendingEmployeeConnectionID(data.connection_id)
              }
              if (data.workflow === 'client_immunization') {
                // (mikekebert) Reset the QR code URL (which also closes the QR code modal)
                setQRCodeURL('')
                // (mikekebert) Open the pending verification notice
                setPendingVerificationNotice(true)
              } else {
                // (mikekebert) Reset the QR code URL (which also closes the QR code modal)
                setQRCodeURL('')
              }
              break

            case 'INVITATIONS_ERROR':
              dispatch(setErrorMessage(data.error))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'CONTACTS':
          switch (type) {
            case 'CONTACTS':
              let newContacts = data.contacts
              let oldContacts = currentState.contacts.contacts
              let updContacts = []

              newContacts.forEach((newContact) => {
                oldContacts.forEach((oldContact, index) => {
                  if (
                    oldContact !== null &&
                    newContact !== null &&
                    oldContact.contact_id === newContact.contact_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldContacts.splice(index, 1)
                  }
                })
                updContacts.push(newContact)
              })

              if (oldContacts.length > 0) {
                // (mikekebert) Sort the array by data created, newest on top
                updContacts = [...updContacts, ...oldContacts]
              }
              updContacts.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))

              dispatch(setContacts(updContacts))
              dispatch(setContact(data.contacts[0]))
              removeLoadingProcess('CONTACTS')
              break

            case 'CONTACTS_ERROR':
              dispatch(setErrorMessage(data.error))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'DEMOGRAPHICS':
          switch (type) {
            case 'DEMOGRAPHICS_ERROR':
              dispatch(setErrorMessage(data.error))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'OUT_OF_BAND':
          switch (type) {
            case 'INVITATION':
              setQRCodeURL(data.invitation_record)

              break

            case 'INVITATIONS_ERROR':
              console.log(data.error)
              console.log('Invitations Error')
              dispatch(setErrorMessage(data.error))

              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'ROLES':
          switch (type) {
            case 'ROLES':
              let oldRoles = currentState.users.roles
              let newRoles = data.roles
              let updatedRoles = []
              // (mikekebert) Loop through the new roles and check them against the existing array
              newRoles.forEach((newRole) => {
                oldRoles.forEach((oldRole, index) => {
                  if (
                    oldRole !== null &&
                    newRole !== null &&
                    oldRole.role_id === newRole.role_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldRoles.splice(index, 1)
                  }
                })
                updatedRoles.push(newRole)
              })
              // (mikekebert) When you reach the end of the list of new roles, simply add any remaining old roles to the new array
              if (oldRoles.length > 0)
                updatedRoles = [...updatedRoles, ...oldRoles]

              dispatch(setRoles(updatedRoles))
              removeLoadingProcess('ROLES')

              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'USERS':
          switch (type) {
            case 'USERS':
              let oldUsers = currentState.users.users
              let newUsers = data.users
              let updatedUsers = []
              // (mikekebert) Loop through the new users and check them against the existing array
              newUsers.forEach((newUser) => {
                oldUsers.forEach((oldUser, index) => {
                  if (
                    oldUser !== null &&
                    newUser !== null &&
                    oldUser.user_id === newUser.user_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldUsers.splice(index, 1)
                  }
                })
                updatedUsers.push(newUser)
              })
              // (mikekebert) When you reach the end of the list of new users, simply add any remaining old users to the new array
              if (oldUsers.length > 0)
                updatedUsers = [...updatedUsers, ...oldUsers]
              // (mikekebert) Sort the array by data created, newest on top
              updatedUsers.sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )

              dispatch(setUsers(updatedUsers))
              removeLoadingProcess('USERS')

              break

            case 'USER':
              let user = data.user[0]
              dispatch(setUser(user))
              break

            case 'USER_UPDATED':
              const usersAfterUpdate = currentState.users.users.map((x) =>
                x.user_id === data.updatedUser.user_id ? data.updatedUser : x
              )
              dispatch(setUsers(usersAfterUpdate))
              dispatch(setUser(data.updatedUser))

              break

            case 'PASSWORD_UPDATED':
              // (eldersonar) Replace the user with the updated user based on password)
              const passwordUpdateUser = currentState.users.users.map((x) =>
                x.user_id === data.updatedUserPassword.user_id
                  ? data.updatedUserPassword
                  : x
              )
              dispatch(setUsers(passwordUpdateUser))
              break

            case 'USER_CREATED':
              let usersCreated = [...currentState.users.users, data.user[0]]
              usersCreated.sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )
              dispatch(setUsers(usersCreated))
              dispatch(setUser(data.user[0]))

              break

            case 'USER_DELETED':
              const index = currentState.users.users.findIndex(
                (v) => v.user_id === data
              )
              let alteredUsers = [...currentState.users.users]
              alteredUsers.splice(index, 1)
              dispatch(setUsers(alteredUsers))
              break

            case 'USER_ERROR':
              dispatch(setErrorMessage(data.error))
              break

            case 'USER_SUCCESS':
              dispatch(setSuccessMessage(data))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'CREDENTIALS':
          switch (type) {
            case 'CREDENTIALS':
              let oldCredentials = currentState.credentials.credentials
              let newCredentials = data.credential_records
              let updatedCredentials = []
              // (mikekebert) Loop through the new credentials and check them against the existing array
              newCredentials.forEach((newCredential) => {
                oldCredentials.forEach((oldCredential, index) => {
                  if (
                    oldCredential !== null &&
                    newCredential !== null &&
                    oldCredential.credential_exchange_id ===
                      newCredential.credential_exchange_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldCredentials.splice(index, 1)
                  }
                })
                updatedCredentials.push(newCredential)
                // (mikekebert) We also want to make sure to reset any pending connection IDs so the modal windows don't pop up automatically
                if (
                  newCredential.connection_id === pendingEmployeeConnectionID
                ) {
                  setPendingEmployeeConnectionID('')
                }
                if (
                  newCredential.connection_id === pendingVaccinationConnectionID
                ) {
                  setPendingVaccinationConnectionID('')
                }
              })
              // (mikekebert) When you reach the end of the list of new credentials, simply add any remaining old credentials to the new array
              if (oldCredentials.length > 0)
                updatedCredentials = [...updatedCredentials, ...oldCredentials]
              // (mikekebert) Sort the array by data created, newest on top
              updatedCredentials.sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )

              dispatch(setCredential(data.credential_records[0]))
              dispatch(setCredentials(updatedCredentials))
              removeLoadingProcess('CREDENTIALS')

              break

            case 'CREDENTIALS_ERROR':
              dispatch(setErrorMessage(data.error))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }

          break
        case 'PRESENTATIONS':
          switch (type) {
            case 'EMPLOYEE_VERIFIED':
              // (mikekebert) Turn off any pending verification notices
              setPendingVerificationNotice(false)

              // (mikekebert) Set the pending vaccination connection_id (which also opens the immunization credential form)
              setPendingVaccinationConnectionID(data.connection_id)

              break

            case 'PRESENTATION_REPORTS':
              let oldPresentations =
                currentState.presentations.presentationReports
              let newPresentations = data.presentation_reports
              let updatedPresentations = []

              // (mikekebert) Loop through the new presentation and check them against the existing array
              newPresentations.forEach((newPresentation) => {
                oldPresentations.forEach((oldPresentation, index) => {
                  if (
                    oldPresentation !== null &&
                    newPresentation !== null &&
                    oldPresentation.presentation_exchange_id ===
                      newPresentation.presentation_exchange_id
                  ) {
                    // (mikekebert) If you find a match, delete the old copy from the old array
                    oldPresentations.splice(index, 1)
                  }
                })
                updatedPresentations.push(newPresentation)
                // (mikekebert) We also want to make sure to reset any pending connection IDs so the modal windows don't pop up automatically
                if (
                  newPresentation.connection_id === pendingEmployeeConnectionID
                ) {
                  setPendingEmployeeConnectionID('')
                }
                if (
                  newPresentation.connection_id ===
                  pendingVaccinationConnectionID
                ) {
                  setPendingVaccinationConnectionID('')
                }
              })
              // (mikekebert) When you reach the end of the list of new presentations, simply add any remaining old presentations to the new array
              if (oldPresentations.length > 0)
                updatedPresentations = [
                  ...updatedPresentations,
                  ...oldPresentations,
                ]
              // (mikekebert) Sort the array by date created, newest on top
              updatedPresentations.sort((a, b) =>
                a.created_at < b.created_at ? 1 : -1
              )

              dispatch(setPresentationReports(updatedPresentations))
              removeLoadingProcess('PRESENTATIONS')

              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'SERVER':
          switch (type) {
            case 'WEBSOCKET_READY':
              setReadyForMessages(true)
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'SETTINGS':
          switch (type) {
            case 'SETTINGS_THEME':
              // Writing the recent theme to a local storage
              const stringMessageTheme = JSON.stringify(data.value)
              window.localStorage.setItem('recentTheme', stringMessageTheme)
              dispatch(setTheme(data.value))
              removeLoadingProcess('THEME')
              break

            case 'SETTINGS_SCHEMAS':
              dispatch(setSchemas(data))
              removeLoadingProcess('SCHEMAS')
              break

            case 'LOGO':
              dispatch(setLogo(handleImageSrc(data.image.data)))
              removeLoadingProcess('LOGO')
              break

            case 'SETTINGS_ORGANIZATION':
              dispatch(setOrganizationName(data.organizationName))
              dispatch(setSiteTitle(data.title))
              removeLoadingProcess('ORGANIZATION')
              break

            case 'SETTINGS_SMTP':
              dispatch(setSmtp(data.value))
              removeLoadingProcess('SMTP')
              break

            case 'SETTINGS_ERROR':
              dispatch(setErrorMessage(data.error))
              break

            case 'SETTINGS_SUCCESS':
              dispatch(setSuccessMessage(data))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'IMAGES':
          switch (type) {
            case 'IMAGE_LIST':
              dispatch(setLogo(data))

              removeLoadingProcess('IMAGES')
              break

            case 'IMAGES_ERROR':
              dispatch(setErrorMessage(data.error))
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }
          break

        case 'GOVERNANCE':
          switch (type) {
            case 'PRIVILEGES_ERROR':
              console.log(data)
              console.log('Privileges Error', data.error)
              dispatch(setErrorMessage(data.error))
              removeLoadingProcess('GOVERNANCE')
              break

            case 'PRIVILEGES_SUCCESS':
              console.log('PRIVILEGES SUCCESS')
              console.log('these are the privileges:')
              console.log(data.privileges)
              setPrivileges(data.privileges)
              removeLoadingProcess('GOVERNANCE')
              break

            default:
              setNotification(
                `Error - Unrecognized Websocket Message Type: ${type}`,
                'error'
              )
              break
          }

          break

        default:
          setNotification(
            `Error - Unrecognized Websocket Message Type: ${context}`,
            'error'
          )
          break
      }
    } catch (error) {
      console.log('Error caught:', error)
      setNotification('Client Error - Websockets', 'error')
    }
  }

  function addLoadingProcess(process) {
    loadingList.push(process)
  }

  function clearLoadingProcess() {
    loadingList = []
    setAppIsLoaded(true)
  }

  function removeLoadingProcess(process) {
    const index = loadingList.indexOf(process)
    if (index > -1) {
      loadingList.splice(index, 1)
    }

    if (loadingList.length === 0) {
      setAppIsLoaded(true)
    }
  }

  function setUpUser(id, username, roles) {
    setSession(cookies.get('sessionId'))
    dispatch(setLoggedInUserId(id))
    dispatch(setLoggedInUsername(username))
    dispatch(setLoggedInRoles(roles))
  }

  // Update theme state locally
  const updateTheme = (update) => {
    return dispatch(setTheme({ ...theme, ...update }))
  }

  // Update theme in the database
  const saveTheme = () => {
    sendMessage('SETTINGS', 'SET_THEME', theme)
  }

  //(RomanStepanyan) Removing all styles from an array of styles to desible undo button
  const clearStylesArray = () => {
    setStylesArray([])
  }

  const addStylesToArray = (key) => {
    let position = stylesArray.indexOf(key)
    // if cannot find indexOf style
    if (!~position) {
      setStylesArray((oldArray) => [...oldArray, `${key}`])
    }
  }

  const removeStylesFromArray = (undoKey) => {
    // Removing a style from an array of styles
    let index = stylesArray.indexOf(undoKey)
    if (index > -1) {
      stylesArray.splice(index, 1)
      setStylesArray(stylesArray)
    }
  }

  // Undo theme change
  const recentTheme = JSON.parse(localStorage.getItem('recentTheme'))
  const undoStyle = (undoKey) => {
    if (undoKey !== undefined) {
      for (let key in recentTheme)
        if ((key = undoKey)) {
          const undo = { [`${key}`]: recentTheme[key] }
          return dispatch(setTheme({ ...theme, ...undo }))
        }
    }
  }

  // Logout and redirect
  const handleLogout = (history) => {
    Axios({
      method: 'POST',
      url: '/api/user/log-out',
      withCredentals: true,
    }).then((res) => {
      setSession('')
      setWebsocket(false)
      dispatch(logoutUser())
      dispatch(clearUsersState())
      dispatch(clearSettingsState())
      dispatch(clearPresentationsState())
      dispatch(clearCredentialsState())
      dispatch(clearContactstate())

      // (eldersonar) Does this close the connection and remove the connection object?
      closeWSConnection(1000, 'Log out')
      if (history !== undefined) {
        history.push('/login')
      }
    })
  }

  if (
    (loginState.loggedIn && !appIsLoaded) ||
    (!loginState.loggedIn && !appIsLoaded)
  ) {
    // Show the spinner while the app is loading
    return (
      <ThemeProvider theme={theme}>
        <FullPageSpinner />
      </ThemeProvider>
    )
  } else if (!loginState.loggedIn && appIsLoaded) {
    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <Router>
            <Switch>
              <Route
                path="/forgot-password"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main>
                        <ForgotPassword
                          history={history}
                          sendRequest={sendMessage}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route
                path="/password-reset"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main>
                        <PasswordReset
                          history={history}
                          sendRequest={sendMessage}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route
                path="/account-setup"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main>
                        <AccountSetup
                          history={history}
                          sendRequest={sendMessage}
                          messageHandler={messageHandler}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route
                path="/login"
                render={({ match, history }) => {
                  return (
                    <Frame id="app-frame">
                      <Main>
                        <Login
                          history={history}
                          setUpUser={setUpUser}
                          sendRequest={sendMessage}
                        />
                      </Main>
                    </Frame>
                  )
                }}
              />
              <Route path="/">
                <Redirect to="/login" />
              </Route>
            </Switch>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    )
  } else {
    // loggedIn and appIsLoaded
    return (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <SessionProvider logout={handleLogout} sessionTimer={sessionTimer}>
            <Router>
              <Switch>
                <Route exact path="/forgot-password">
                  <Redirect to="/" />
                </Route>
                <Route exact path="/password-reset">
                  <Redirect to="/" />
                </Route>
                <Route exact path="/account-setup">
                  <Redirect to="/" />
                </Route>
                <Route exact path="/login">
                  <Redirect to="/" />
                </Route>
                <Route
                  path="/"
                  exact
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <Home
                            sendRequest={sendMessage}
                            privileges={privileges}
                            history={history}
                            QRCodeURL={QRCodeURL}
                          />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/invitations"
                  render={({ match, history }) => {
                    if (check('invitations:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <p>Invitations</p>
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path="/contacts"
                  exact
                  render={({ match, history }) => {
                    if (check('contacts:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Contacts
                              history={history}
                              sendRequest={sendMessage}
                              QRCodeURL={QRCodeURL}
                            />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path={`/contacts/:contactId`}
                  render={({ match, history }) => {
                    if (check('contacts:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Contact
                              history={history}
                              sendRequest={sendMessage}
                              privileges={privileges}
                              contactId={match.params.contactId}
                            />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path="/credentials"
                  exact
                  render={({ match, history }) => {
                    if (check('credentials:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Credentials history={history} />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path={`/credentials/:credentialId`}
                  render={({ match, history }) => {
                    if (check('credentials:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Credential
                              history={history}
                              credential={match.params.credentialId}
                            />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path="/verification"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <p>Verification</p>
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/messages"
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader
                          match={match}
                          history={history}
                          handleLogout={handleLogout}
                        />
                        <Main>
                          <p>Messages</p>
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/presentations"
                  exact
                  render={({ match, history }) => {
                    if (check('presentations:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Presentations history={history} />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path={`/presentations/:presentationId`}
                  render={({ match, history }) => {
                    if (check('presentations:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Presentation
                              history={history}
                              presentation={match.params.presentationId}
                            />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path="/users"
                  render={({ match, history }) => {
                    if (check('users:read')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Users sendRequest={sendMessage} />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route
                  path={`/users/:userId`}
                  render={({ match, history }) => {
                    return (
                      <Frame id="app-frame">
                        <AppHeader match={match} handleLogout={handleLogout} />
                        <Main>
                          <User history={history} />
                        </Main>
                      </Frame>
                    )
                  }}
                />
                <Route
                  path="/settings"
                  render={({ match, history }) => {
                    if (check('settings:update')) {
                      return (
                        <Frame id="app-frame">
                          <AppHeader
                            match={match}
                            history={history}
                            handleLogout={handleLogout}
                          />
                          <Main>
                            <Settings
                              updateTheme={updateTheme}
                              saveTheme={saveTheme}
                              undoStyle={undoStyle}
                              stylesArray={stylesArray}
                              clearStylesArray={clearStylesArray}
                              addStylesToArray={addStylesToArray}
                              removeStylesFromArray={removeStylesFromArray}
                              sendRequest={sendMessage}
                            />
                          </Main>
                        </Frame>
                      )
                    } else {
                      return <Route render={() => <Redirect to="/" />} />
                    }
                  }}
                />
                <Route render={() => <Redirect to="/" />} />
              </Switch>
            </Router>
          </SessionProvider>
        </NotificationProvider>
      </ThemeProvider>
    )
  }
}

export default App
