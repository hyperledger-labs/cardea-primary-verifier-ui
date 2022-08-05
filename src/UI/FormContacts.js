import React, { useRef } from 'react'
import { useSelector } from 'react-redux'

import {
  StyledPopup,
  InputBox,
  Modal,
  ModalHeader,
  ModalSubHeader,
  ModalContentWrapper,
  ModalContent,
  CloseBtn,
  Actions,
  CancelBtn,
  SubmitBtnModal,
  ModalLabel,
  InputFieldModal,
} from './CommonStylesForms'

function FormContacts(props) {
  const contactsState = useSelector((state) => state.contacts)
  const contactSelected = contactsState.contactSelected

  // Assigning contact values from props
  const contact_id = contactSelected
    ? JSON.parse(JSON.stringify(contactSelected.contact_id))
    : ''
  const email =
    contactSelected && contactSelected.Demographic
      ? JSON.parse(JSON.stringify(contactSelected.Demographic.email))
      : ''
  const phone =
    contactSelected && contactSelected.Demographic
      ? JSON.parse(JSON.stringify(contactSelected.Demographic.phone))
      : ''
  const street_address =
    contactSelected && contactSelected.Demographic
      ? JSON.parse(JSON.stringify(contactSelected.Demographic.street_address))
      : ''
  const city =
    contactSelected && contactSelected.Demographic
      ? JSON.parse(JSON.stringify(contactSelected.Demographic.city))
      : ''
  const state_province_region =
    contactSelected && contactSelected.Demographic
      ? JSON.parse(
          JSON.stringify(contactSelected.Demographic.state_province_region)
        )
      : ''
  const postal_code =
    contactSelected && contactSelected.Demographic
      ? JSON.parse(JSON.stringify(contactSelected.Demographic.postal_code))
      : ''
  const country =
    contactSelected && contactSelected.Demographic
      ? JSON.parse(JSON.stringify(contactSelected.Demographic.country))
      : ''
  // const country =
  //   props.contactSelected &&
  //   props.contactSelected.Demographic &&
  //   props.contactSelected.Demographic.address
  //     ? JSON.parse(
  //         JSON.stringify(props.contactSelected.Demographic.address.country)
  //       )
  //     : ''
  const passport_number =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.passport_number))
      : ''
  const surname =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.surname))
      : ''
  const given_names =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.given_names))
      : ''
  const sex =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.sex))
      : ''
  const date_of_birth =
    contactSelected && contactSelected.Passport
      ? JSON.parse(
          JSON.stringify(contactSelected.Passport.date_of_birth.split('T')[0])
        )
      : ''
  const place_of_birth =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.place_of_birth))
      : ''
  const nationality =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.nationality))
      : ''
  const date_of_issue =
    contactSelected && contactSelected.Passport
      ? JSON.parse(
          JSON.stringify(contactSelected.Passport.date_of_issue.split('T')[0])
        )
      : ''
  const date_of_expiration =
    contactSelected && contactSelected.Passport
      ? JSON.parse(
          JSON.stringify(
            contactSelected.Passport.date_of_expiration.split('T')[0]
          )
        )
      : ''
  const type =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.type))
      : ''
  const issuing_country =
    contactSelected && contactSelected.Passport
      ? contactSelected.Passport.issuing_country
      : ''
  const authority =
    contactSelected && contactSelected.Passport
      ? JSON.parse(JSON.stringify(contactSelected.Passport.authority))
      : ''

  const contactForm = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(contactForm.current)

    // Assembling demographics JSON
    const demographics = {}
    demographics.contact_id = contactSelected.contact_id
    demographics.email = form.get('email')
    demographics.phone = form.get('phone')
    // demographics.address = {}
    demographics.street_address = form.get('street_address')
    demographics.city = form.get('city')
    demographics.state_province_region = form.get('state_province_region')
    demographics.postal_code = form.get('postal_code')
    // demographics.zip_code = form.get('zip_code')
    demographics.country = form.get('country')

    props.submitDemographics(demographics, e)

    const passport = {}
    passport.contact_id = contactSelected.contact_id
    passport.passport_number = form.get('passport_number')
    passport.surname = form.get('surname')
    passport.given_names = form.get('given_names')
    passport.sex = form.get('sex')
    passport.date_of_birth = form.get('date_of_birth')
    passport.place_of_birth = form.get('place_of_birth')
    passport.nationality = form.get('nationality')
    passport.date_of_issue = form.get('date_of_issue')
    passport.date_of_expiration = form.get('date_of_expiration')
    passport.type = form.get('type')
    passport.issuing_country = form.get('issuing_country')
    passport.authority = form.get('authority')
    passport.photo = contactSelected.Passport
      ? contactSelected.Passport.photo
        ? contactSelected.Passport.photo.data
        : ''
      : ''

    props.submitPassport(passport, e)

    props.closeContactModal()
    window.location.reload()
  }

  function closeModal() {
    props.closeContactModal()
  }

  return (
    <StyledPopup
      open={props.contactModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="modal">
        <ModalHeader>Edit Contact</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={contactForm}>
              <ModalSubHeader>Demographics</ModalSubHeader>
              <InputBox>
                <ModalLabel htmlFor="email">Email</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="email"
                  defaultValue={email}
                  placeholder="name@email.com"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="phone">Phone</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="phone"
                  defaultValue={phone}
                  placeholder="123-456-7890"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="street_address">Street Address</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="street_address"
                  defaultValue={street_address}
                  placeholder="123 Main St apt. 15"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="city">City</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="city"
                  defaultValue={city}
                  placeholder="Austin"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="state_province_region">
                  State/Province
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="state_province_region"
                  defaultValue={state_province_region}
                  maxLength="2"
                  placeholder="TX"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="postal_code">Postal Code</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="postal_code"
                  defaultValue={postal_code}
                  placeholder="12345"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="country">Country</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="country"
                  defaultValue={country}
                  placeholder="USA"
                ></InputFieldModal>
              </InputBox>
              {/* <InputBox>
                <ModalLabel htmlFor="country">Country</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="country"
                  defaultValue={country}
                ></InputFieldModal>
              </InputBox> */}
              <InputBox>
                <ModalLabel htmlFor="contact_id"></ModalLabel>
                <InputFieldModal
                  type="hidden"
                  name="contact_id"
                  defaultValue={contact_id}
                ></InputFieldModal>
              </InputBox>
              <ModalSubHeader>Passport</ModalSubHeader>
              <InputBox>
                <ModalLabel htmlFor="passport_number">
                  Passport Number
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="passport_number"
                  defaultValue={passport_number}
                  placeholder="444561807"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="surname">Surname</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="surname"
                  defaultValue={surname}
                  placeholder="Doe"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="given_names">Given Names</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="given_names"
                  defaultValue={given_names}
                  placeholder="Jon"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="sex">Official Gender</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="sex"
                  defaultValue={sex}
                  placeholder="Female"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="date_of_birth">Date of Birth</ModalLabel>
                <InputFieldModal
                  type="date"
                  name="date_of_birth"
                  defaultValue={date_of_birth}
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="place_of_birth">Place of Birth</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="place_of_birth"
                  defaultValue={place_of_birth}
                  placeholder="San Diego"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="nationality">Nationality</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="nationality"
                  defaultValue={nationality}
                  placeholder="United States of America"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="date_of_issue">Date of Issue</ModalLabel>
                <InputFieldModal
                  type="date"
                  name="date_of_issue"
                  defaultValue={date_of_issue}
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="date_of_expiration">
                  Date of Expiration
                </ModalLabel>
                <InputFieldModal
                  type="date"
                  name="date_of_expiration"
                  defaultValue={date_of_expiration}
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="type">Type</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="type"
                  defaultValue={type}
                  placeholder="P"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="issuing_country">
                  Issuing Country
                </ModalLabel>
                <InputFieldModal
                  type="text"
                  name="issuing_country"
                  defaultValue={issuing_country}
                  placeholder="USA"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="authority">Authority</ModalLabel>
                <InputFieldModal
                  type="text"
                  name="authority"
                  defaultValue={authority}
                  placeholder="United States Department of State"
                ></InputFieldModal>
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="contact_id"></ModalLabel>
                <InputFieldModal
                  type="hidden"
                  name="contact_id"
                  defaultValue={contact_id}
                ></InputFieldModal>
              </InputBox>

              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtnModal type="submit">Submit</SubmitBtnModal>
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  )
}

export default FormContacts
