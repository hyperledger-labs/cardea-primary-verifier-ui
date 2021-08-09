import React, { useState, useRef } from 'react'

import styled from 'styled-components'
import Popup from 'reactjs-popup'

const StyledPopup = styled(Popup)`
  &-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
`

const InputBox = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`

const Modal = styled.div`
  font-size: 12px;
  margin: auto;
  background: ${(props) => props.theme.background_primary};
  width: 500px;
  padding: 5px;
  border: 1px solid #d7d7d7;
`

const ModalHeader = styled.div`
  width: 100%;
  border-bottom: 1px solid gray;
  font-size: 1.8em;
  text-align: center;
  padding: 5px;
`

const ModalContentWrapper = styled.div`
  overflow: hidden;
  height: 700px;
  width: 100%;
`

const ModalContent = styled.div`
  height: 99%;
  width: 100%;
  padding: 10px 5px;
  overflow-y: scroll;
  padding-right: 17px;
  box-sizing: content-box;
`

const CloseBtn = styled.button`
  cursor: pointer;
  outline: inherit;
  position: absolute;
  display: block;
  padding: 2px 5px;
  line-height: 20px;
  right: -10px;
  top: -10px;
  font-size: 24px;
  background: ${(props) => props.theme.negative_color};
  border-radius: 18px;
  border: 1px solid ${(props) => props.theme.negative_color};

  &:focus {
    box-shadow: 0 0 1pt 1pt #000;
  }
`

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 5px;
  margin: auto;
  text-align: center;
`

const CancelBtn = styled.button`
  border: none;
  color: ${(props) => props.theme.text_light};
  background: ${(props) => props.theme.negative_color};
  padding: 5px;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.3);
  padding: 10px;
  width: 25%;
  font-size: 1.3em;
`

const SubmitBtn = styled.button`
  border: none;
  color: ${(props) => props.theme.text_light};
  background: ${(props) => props.theme.positive_color};
  padding: 5px;
  box-shadow: ${(props) => props.theme.drop_shadow};
  padding: 10px;
  width: 25%;
  font-size: 1.3em;
`

const ModalLabel = styled.label`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  width: 30%;
  margin-right: 10px;
`

const InputField = styled.input`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  height: 30px;
  width: 50%;

  :after {
    content: '*';
    color: ${(props) => props.theme.negative_color};
  }
`

const Select = styled.select`
  color: ${(props) => props.theme.text_color};
  font-size: 1.5em;
  height: 30px;
  width: 50%;
`

function FormTrustedTraveler(props) {
  // Assigning contact values from props
  const trusted_traveler_id = ''
  const first_name =
    props.contactSelected && props.contactSelected.Passport
      ? JSON.parse(JSON.stringify(props.contactSelected.Passport.given_names))
      : ''
  const last_name =
    props.contactSelected && props.contactSelected.Passport
      ? JSON.parse(JSON.stringify(props.contactSelected.Passport.surname))
      : ''
  const date_of_birth =
    props.contactSelected && props.contactSelected.Passport
      ? JSON.parse(JSON.stringify(props.contactSelected.Passport.date_of_birth))
      : ''
  const trusted_date_time = ''

  const travelerForm = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(travelerForm.current)

    let attributes = {}
    if (props.contactSelected) {
      // const demographics = props.contactSelected.Demographic
      // const passport = props.contactSelected.Passport

      attributes = [
        {
          name: 'trusted_traveler_id',
          value: form.get('trusted_traveler_id') || '',
        },
        {
          name: 'traveler_first_name',
          value: form.get('first_name') || '',
        },
        {
          name: 'traveler_last_name',
          value: form.get('last_name') || '',
        },
        {
          name: 'traveler_date_of_birth',
          value: form.get('date_of_birth') || '',
        },
        {
          name: 'trusted_date_time',
          value: form.get('trusted_date_time') || '',
        },
      ]
    }
    let newCredential = {
      connectionID: props.contactSelected.Connections[0].connection_id,
      schemaID: 'X2JpGAqC7ZFY4hwKG6kLw9:2:Trusted_Traveler:1.0',
      schemaVersion: '1.0',
      schemaName: 'Trusted_Traveler',
      schemaIssuerDID: 'X2JpGAqC7ZFY4hwKG6kLw9',
      comment: '',
      attributes: attributes,
    }

    props.submitCredential(newCredential, e)
    props.closeTravelerModal()
    window.location.reload()
  }

  function closeModal() {
    props.closeTravelerModal()
  }

  return (
    <StyledPopup
      open={props.travelerModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="modal">
        <ModalHeader>Add Trusted Traveler</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={travelerForm}>
              <InputBox>
                <ModalLabel htmlFor="trusted_traveler_id">
                  Trusted Traveler ID
                </ModalLabel>
                <InputField
                  type="text"
                  name="trusted_traveler_id"
                  defaultValue={trusted_traveler_id}
                ></InputField>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="first_name">First Name</ModalLabel>
                <InputField
                  type="text"
                  name="first_name"
                  defaultValue={first_name}
                ></InputField>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="last_name">Last Name</ModalLabel>
                <InputField
                  type="text"
                  name="last_name"
                  defaultValue={last_name}
                ></InputField>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="date_of_birth">Date Of Birth</ModalLabel>
                <InputField
                  type="date"
                  name="date_of_birth"
                  defaultValue={date_of_birth}
                ></InputField>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="trusted_date_time">
                  Trusted Date Time
                </ModalLabel>
                <InputField
                  type="date"
                  name="trusted_date_time"
                  defaultValue={trusted_date_time}
                  placeholder="YYYY-MM-DD"
                ></InputField>
              </InputBox>
              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtn type="submit">Submit</SubmitBtn>
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  )
}

export default FormTrustedTraveler
