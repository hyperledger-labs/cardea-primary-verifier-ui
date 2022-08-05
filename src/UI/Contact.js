import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setContactSelected } from '../redux/contactsReducer'
import { clearNotificationState } from '../redux/notificationsReducer'

import styled from 'styled-components'

import FormContacts from './FormContacts'
import FormTrustedTraveler from './FormTrustedTraveler'
import { useNotification } from './NotificationProvider'
import PageHeader from './PageHeader.js'
import PageSection from './PageSection.js'

import { CanUser } from './CanUser'

import {
  DataTable,
  DataRow,
  DataHeader,
  DataCell,
  AttributeTable,
  AttributeRow,
} from './CommonStylesTables'

const EditContact = styled.button`
  float: right;
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.primary_color};
`

const IssueCredential = styled.button`
  float: right;
  padding: 10px;
  color: ${(props) => props.theme.text_light};
  border: none;
  box-shadow: ${(props) => props.theme.drop_shadow};
  background: ${(props) => props.theme.primary_color};
  :hover {
    cursor: pointer;
  }
`

function Contact(props) {
  // const localUser = props.loggedInUserState
  const dispatch = useDispatch()
  const contactsState = useSelector((state) => state.contacts)
  const credentialsState = useSelector((state) => state.credentials)
  const notificationsState = useSelector((state) => state.notifications)

  const contacts = contactsState.contacts
  const credentials = credentialsState.credentials
  const contactSelected = contactsState.contactSelected
  const error = notificationsState.errorMessage
  const success = notificationsState.successMessage
  const warning = notificationsState.warningMessage

  // Accessing notification context
  const setNotification = useNotification()

  const history = props.history
  const contactId = props.contactId
  // const error = props.errorMessage
  // const success = props.successMessage
  const privileges = props.privileges
  // const credentials = props.credentials
  // const contacts = props.contacts

  let contactToSelect = ''

  // Modal state
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false)
  const [travelerModalIsOpen, setTravelerModalIsOpen] = useState(false)
  const [credentialModalIsOpen, setCredentialModalIsOpen] = useState(false)

  const closeContactModal = () => setContactModalIsOpen(false)
  const closeTravelerModal = () => setTravelerModalIsOpen(false)

  if (contacts) {
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].contact_id === Number(contactId)) {
        contactToSelect = contacts[i]
        break
      }
    }
  }

  useEffect(() => {
    if (success) {
      setNotification(success, 'notice')
      dispatch(clearNotificationState())
    } else if (error) {
      setNotification(error, 'error')
      dispatch(clearNotificationState())
    } else if (warning) {
      setNotification(warning, 'warning')
      dispatch(clearNotificationState())
    } else return
  }, [error, success, warning, setNotification, dispatch])

  // useEffect(() => {
  //   if (success) {
  //     setNotification(success, 'notice')
  //     props.clearResponseState()
  //   } else if (error) {
  //     setNotification(error, 'error')
  //     props.clearResponseState()
  //     setIndex(index + 1)
  //   }
  // }, [error, success])

  const isMounted = useRef(null)

  // const [index, setIndex] = useState(false)

  // useEffect(() => {
  //   for (let i = 0; i < props.contacts.length; i++) {
  //     if (props.contacts[i].contact_id == contactId) {
  //       setContactSelected(props.contacts[i])
  //       break
  //     }
  //   }
  // }, [contacts, credentials])

  // Get governance privileges
  useEffect(() => {
    isMounted.current = true
    props.sendRequest('GOVERNANCE', 'GET_PRIVILEGES', {})
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    dispatch(setContactSelected(contactToSelect))
  }, [contactToSelect, dispatch])

  // useEffect(() => {
  //   setContactSelected(contactToSelect)
  // }, [contactToSelect])

  function openCredential(history, id) {
    if (history !== undefined) {
      history.push('/credentials/' + id)
    }
  }

  // Contact form customization (no contact search dropdown)
  // const [contactSearch, setContactSearch] = useState(false)

  // const [contactSelected, setContactSelected] = useState(contactToSelect)

  let travelerData = ''
  let passportData = ''

  if (
    contactSelected.Passport !== null &&
    contactSelected.Passport !== undefined
  ) {
    let rawImage = contactSelected.Passport.photo

    // const handleImageSrc = (rawImage) => {
    //   let bytes = new Uint8Array(rawImage)
    //   bytes = Buffer.from(rawImage).toString('base64')
    //   let result = atob(bytes)
    //   return result
    // }

    // let test = handleImageSrc(rawImage)

    passportData = (
      <>
        <h2>Passport Information</h2>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Passport Number:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.passport_number || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Surname:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.surname || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Given Name(s):</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.given_names || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Sex:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.sex || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Date of Birth:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.date_of_birth.split('T')[0] || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Place of Birth:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.place_of_birth || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Nationality:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.nationality || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Date of Issue:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.date_of_issue.split('T')[0] || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Date of Expiration:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.date_of_expiration.split('T')[0] ||
                    ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Type:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.type || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Issuing Country:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.issuing_country || ''
                  : ''}
              </td>
            </AttributeRow>
            <AttributeRow>
              <th>Authority:</th>
              <td>
                {contactSelected.Passport !== null &&
                contactSelected.Passport !== undefined
                  ? contactSelected.Passport.authority || ''
                  : ''}
              </td>
            </AttributeRow>
            {/* <AttributeRow>
              <th>Photo:</th>
              <td></td>
            </AttributeRow> */}
          </tbody>
        </AttributeTable>
        {/* <img src={test} alt="Error" /> */}
      </>
    )
  }

  function updateDemographics(updatedDemographic, e) {
    e.preventDefault()
    const Demographic = {
      Demographic: { ...updatedDemographic },
    }

    props.sendRequest('DEMOGRAPHICS', 'UPDATE_OR_CREATE', updatedDemographic)

    setNotification('Demographic info was updated!', 'notice')

    dispatch(setContactSelected({ ...contactSelected, ...Demographic }))
  }

  function updatePasport(updatedPassport, e) {
    e.preventDefault()
    const Passport = {
      Passport: { ...updatedPassport },
    }

    props.sendRequest('PASSPORTS', 'UPDATE_OR_CREATE', updatedPassport)

    setNotification('Passport info was updated!', 'notice')

    dispatch(setContactSelected({ ...contactSelected, ...Passport }))
  }

  function beginIssuance(type) {
    props.sendRequest('PRESENTATIONS', 'REQUEST', {
      connectionID: contactSelected.Connections[0].connection_id,
      type: type,
    })
    // Does that sound right?
    setNotification('Credential offer was successfully sent!', 'notice')
  }

  // Submits the credential form and shows notification
  function submitNewCredential(newCredential, e) {
    e.preventDefault()
    props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)

    setNotification('Credential offer was successfully sent!', 'notice')
  }

  let credentialRows = null

  if (credentials && contactSelected) {
    credentialRows = credentials.map((credential_record) => {
      if (
        contactSelected.Connections[0].connection_id ===
        credential_record.connection_id
      ) {
        const credential_id = credential_record.credential_exchange_id
        const credentialState =
          credential_record.state.replaceAll('_', ' ') || ''
        const dateCreated =
          new Date(credential_record.created_at).toLocaleString() || ''

        let credentialName = ''
        if (
          credential_record.credential_proposal_dict !== null &&
          credential_record.credential_proposal_dict !== undefined
        ) {
          credentialName = credential_record.credential_proposal_dict.schema_name.replaceAll(
            '_',
            ' '
          )
        }
        return (
          <DataRow
            key={credential_id}
            onClick={() => {
              openCredential(history, credential_id)
            }}
          >
            <DataCell>{credentialName}</DataCell>
            <DataCell className="title-case">{credentialState}</DataCell>
            <DataCell>{dateCreated}</DataCell>
          </DataRow>
        )
      }
    })
  }

  return (
    <>
      <div id="contact">
        <PageHeader
          title={'Contact Details: ' + (contactSelected.label || '')}
        />
        <PageSection>
          <CanUser
            // user={localUser}
            perform="contacts:update"
            yes={() => (
              <EditContact onClick={() => setContactModalIsOpen((o) => !o)}>
                Edit
              </EditContact>
            )}
          />
          <h2>General Information</h2>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Contact ID:</th>
                <td>{contactSelected.contact_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Connection Status:</th>
                <td>
                  {contactSelected.Connections !== undefined
                    ? contactSelected.Connections[0].state || ''
                    : ''}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>

          <h2>Demographic Information</h2>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Name:</th>
                <td>{contactSelected.label || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Email:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.email || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Phone:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.phone || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Street Address:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.street_address || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>City:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.city || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>State/Province/Region:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.state_province_region || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Postal Code:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.postal_code || ''
                    : ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Country:</th>
                <td>
                  {contactSelected.Demographic !== null &&
                  contactSelected.Demographic !== undefined
                    ? contactSelected.Demographic.country || ''
                    : ''}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
          {passportData}
        </PageSection>
        <PageSection>
          <CanUser
            // user={localUser}
            perform="credentials:issue"
            yes={() => (
              <IssueCredential
                onClick={() =>
                  privileges && privileges.includes('issue_trusted_traveler')
                    ? beginIssuance('default')
                    : setNotification(
                        "Error: you don't have the right privileges",
                        'error'
                      )
                }
              >
                Issue Trusted Traveler
              </IssueCredential>
            )}
          />
          {/* <CanUser
            user={localUser}
            perform="credentials:issue"
            yes={() => (
              <IssueCredential
                onClick={() =>
                  privileges && privileges.includes('issue_trusted_traveler')
                    ? beginIssuance('Result')
                    : setNotification(
                        "Error: you don't have the right privileges",
                        'error'
                      )
                }
              >
                Issue Trusted Traveler - Lab Result
              </IssueCredential>
            )}
          />
          <CanUser
            user={localUser}
            perform="credentials:issue"
            yes={() => (
              <IssueCredential
                onClick={() =>
                  privileges && privileges.includes('issue_trusted_traveler')
                    ? beginIssuance('Exemption')
                    : setNotification(
                        "Error: you don't have the right privileges",
                        'error'
                      )
                }
              >
                Issue Trusted Traveler - Exemption
              </IssueCredential>
            )}
          />
          <CanUser
            user={localUser}
            perform="credentials:issue"
            yes={() => (
              <IssueCredential
                onClick={() =>
                  privileges && privileges.includes('issue_trusted_traveler')
                    ? beginIssuance('Vaccine')
                    : setNotification(
                        "Error: you don't have the right privileges",
                        'error'
                      )
                }
              >
                Issue Trusted Traveler - Vaccine
              </IssueCredential>
            )}
          /> */}
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Credential</DataHeader>
                <DataHeader>Status</DataHeader>
                <DataHeader>Date Issued</DataHeader>
              </DataRow>
            </thead>
            <tbody>{credentialRows}</tbody>
          </DataTable>
        </PageSection>
        <FormContacts
          // contactSelected={contactSelected}
          contactModalIsOpen={contactModalIsOpen}
          closeContactModal={closeContactModal}
          submitDemographics={updateDemographics}
          submitPassport={updatePasport}
        />
        <FormTrustedTraveler
          // contactSelected={contactSelected}
          travelerModalIsOpen={travelerModalIsOpen}
          closeCredentialModal={closeTravelerModal}
          submitCredential={submitNewCredential}
        />
      </div>
    </>
  )
}

export default Contact
