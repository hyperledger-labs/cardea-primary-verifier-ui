import React, { useState, useEffect, useRef } from 'react'

import styled from 'styled-components'

import { handleGovernance } from './util'

import FormQR from './FormQR'
import { useNotification } from './NotificationProvider'

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
  const error = props.errorMessage
  const success = props.successMessage
  const warning = props.warningMessage
  const localUser = props.loggedInUserState
  const privileges = props.privileges
  // const actions = props.actions
  // const participants = props.participants

  const [govGranted, setGovGranted] = useState(undefined)

  const [index, setIndex] = useState(false)
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false)
  const [credentialModalIsOpen, setCredentialModalIsOpen] = useState(false)

  const isMounted = useRef(null)

  // Accessing notification context
  const setNotification = useNotification()

  // Handle governance
  // useEffect(() => {
  //   setGovGranted(handleGovernance(privileges, actions, participants))
  // }, [privileges, actions, participants])

  console.log(privileges)

  useEffect(() => {
    if (success) {
      setNotification(success, 'notice')
      props.clearResponseState()
    } else if (error) {
      setNotification(error, 'error')
      props.clearResponseState()
      setIndex(index + 1)
    } else if (warning) {
      setNotification(warning, 'warning')
      props.clearResponseState()
      setIndex(index + 1)
    } else return
  }, [error, success, warning])

  // Get governance privileges
  useEffect(() => {
    isMounted.current = true
    props.sendRequest('GOVERNANCE', 'GET_PRIVILEGES', {})
    // props.sendRequest('GOVERNANCE', 'GET_PARTICIPANTS', {})
    // props.sendRequest('GOVERNANCE', 'GET_ACTIONS', {})
    return () => {
      isMounted.current = false
    }
  }, [])

  const closeContactModal = () => setContactModalIsOpen(false)
  const closeCredentialModal = () => setCredentialModalIsOpen(false)

  const addContact = () => {
    // // Simple use of governance
    if (privileges && privileges.includes('verify_identity')) {
      setContactModalIsOpen((o) => !o)
      props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
    } else
      setNotification("Error: you don't have the right privileges", 'error')
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
