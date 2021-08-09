import React, { useState } from 'react'

import styled from 'styled-components'

import FormQR from './FormQR'
// import { useNotification } from './NotificationProvider'

import { CanUser } from './CanUser'

const HeaderHolder = styled.div`
  display: flex;
  justify-content: space-between;
`

const ContentFlexBox = styled.div`
  width: 32%;
  min-width: 240px;
  height: 150px;
  margin-bottom: 30px;
  padding: 0 25px;
  font-size: calc(12px + 1.5vw);
  line-height: 150px;
  vertical-align: center;
  text-transform: uppercase;
  background: ${(props) => props.theme.primary_color};
  color: ${(props) => props.theme.text_light};
  box-shadow: ${(props) => props.theme.drop_shadow};
  text-align: center;

  :hover {
    cursor: pointer;
    background: ${(props) => props.theme.background_primary};
    color: ${(props) => props.theme.text_color};
  }
`

function Home(props) {
  const localUser = props.loggedInUserState

  // Accessing notification context
  // const setNotification = useNotification()

  const [contactModalIsOpen, setContactModalIsOpen] = useState(false)
  const [credentialModalIsOpen, setCredentialModalIsOpen] = useState(false)

  const closeContactModal = () => setContactModalIsOpen(false)
  const closeCredentialModal = () => setCredentialModalIsOpen(false)

  const addContact = () => {
    setContactModalIsOpen((o) => !o)
    props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
  }

  return (
    <>
      <HeaderHolder>
        <CanUser
          user={localUser}
          perform="contacts:create"
          yes={() => (
            <ContentFlexBox onClick={addContact}>Add Contact</ContentFlexBox>
          )}
        />
      </HeaderHolder>
      <FormQR
        contactModalIsOpen={contactModalIsOpen}
        closeContactModal={closeContactModal}
        QRCodeURL={props.QRCodeURL}
      />
    </>
  )
}

export default Home
