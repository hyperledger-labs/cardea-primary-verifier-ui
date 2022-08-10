import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import FormQR from './FormQR'
import PageHeader from './PageHeader'
import PageSection from './PageSection'

import { DataTable, DataRow, DataHeader, DataCell } from './CommonStylesTables'

import { ActionButton } from './CommonStylesForms'

import { CanUser } from './CanUser'

function Contacts(props) {
  const contactsState = useSelector((state) => state.contacts)
  const contacts = contactsState.contacts

  const [contactModalIsOpen, setContactModalIsOpen] = useState(false)

  const closeContactModal = () => setContactModalIsOpen(false)

  function openContact(history, id) {
    if (history !== undefined) {
      history.push('/contacts/' + id)
    }
  }

  const history = props.history

  const contactRows = contacts.map((contact) => {
    return (
      <DataRow
        key={contact.contact_id}
        onClick={() => {
          openContact(history, contact.contact_id, contact)
        }}
      >
        <DataCell>{contact.label}</DataCell>
        <DataCell>
          {contact.Demographic !== null && contact.Demographic !== undefined
            ? contact.Demographic.mpid || ''
            : ''}
        </DataCell>
        <DataCell>{contact.Connections[0].state}</DataCell>
        <DataCell>{new Date(contact.created_at).toLocaleString()}</DataCell>
      </DataRow>
    )
  })

  return (
    <>
      <div id="contacts">
        <PageHeader title={'Contacts'} />
        <PageSection>
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Contact Name</DataHeader>
                <DataHeader></DataHeader>
                <DataHeader>Connection Status</DataHeader>
                <DataHeader>Created At</DataHeader>
              </DataRow>
            </thead>
            <tbody>{contactRows}</tbody>
          </DataTable>
        </PageSection>
        <CanUser
          perform="contacts:create"
          yes={() => (
            <ActionButton
              title="Add a New Contact"
              onClick={() => {
                setContactModalIsOpen((o) => !o)
                props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
              }}
            >
              +
            </ActionButton>
          )}
        />
        <FormQR
          contactModalIsOpen={contactModalIsOpen}
          closeContactModal={closeContactModal}
          QRCodeURL={props.QRCodeURL}
        />
      </div>
    </>
  )
}

export default Contacts
