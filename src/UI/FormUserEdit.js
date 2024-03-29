import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  Actions,
  CancelBtn,
  Checkbox,
  CheckboxHolder,
  CloseBtn,
  InputBox,
  InputFieldModal,
  Modal,
  ModalContentWrapper,
  ModalContent,
  ModalHeader,
  ModalLabel,
  StyledPopup,
  SubmitBtnModal,
} from './CommonStylesForms'

import { useNotification } from './NotificationProvider'

function FormUserEdit(props) {
  const loginState = useSelector((state) => state.login)
  const usersState = useSelector((state) => state.users)

  const email = props.userEmail
  const roles = usersState.roles
  const users = usersState.users
  const loggedInUserState = loginState.loggedInUserState
  const error = props.error

  // Get the selected user
  useEffect(() => {
    if (users) {
      let selectedUser = users.find((x) => x.email === email)
      if (selectedUser) setListUser({ ...selectedUser })
    }
  }, [email, users])

  useEffect(() => {
    if (error && submitBtn.current) {
      submitBtn.current.removeAttribute('disabled')
    }
  }, [error])

  const setNotification = useNotification()
  const [options, setOptions] = useState([])
  const [listUser, setListUser] = useState()

  let selectedRoles = []

  const userForm = useRef()
  const submitBtn = useRef()

  let userEmail = ''
  let userName = ''

  // Check if user is selected
  if (listUser) {
    userEmail = listUser.email
    userName = listUser.username

    // Get the user selected roles
    listUser.Roles.forEach((element) =>
      selectedRoles.push(JSON.stringify(element.role_id))
    )
  }

  // Set the roles on modal initialization
  useEffect(() => {
    setOptions(selectedRoles)
  }, [listUser])

  // Disable button on submit
  const onBtnClick = (e) => {
    if (submitBtn.current) {
      submitBtn.current.setAttribute('disabled', 'disabled')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onBtnClick()

    const form = new FormData(userForm.current)
    const email = form.get('email')
    const username = form.get('username')

    listUser.username = username
    listUser.email = email
    listUser.roles = options

    if (listUser && loggedInUserState.id === listUser.user_id && !username)
      setNotification('You are not allowed to remove your username.', 'error')
    else props.sendRequest('USERS', 'UPDATE', listUser)
  }

  function closeModal() {
    props.closeUserEditModal()
  }

  const handleCheckboxChange = (event) => {
    let newArray = [...options, event.target.value]
    if (options.includes(event.target.value)) {
      newArray = newArray.filter((s) => s !== event.target.value)
    }
    setOptions(newArray)
  }

  const rolesOptions = roles.map((role) => {
    let checked = options.includes(JSON.stringify(role.role_id))
    return (
      <div key={role.role_id}>
        <label htmlFor={role.role_id}>{role.role_name}</label>
        <Checkbox
          type="checkbox"
          value={role.role_id}
          id={role.role_id}
          checked={checked}
          onChange={handleCheckboxChange}
          disabled={
            listUser && loggedInUserState.id === listUser.user_id ? true : false
          }
        />
      </div>
    )
  })

  return (
    <StyledPopup
      open={props.userEditModalIsOpen}
      closeOnDocumentClick
      onClose={closeModal}
    >
      <Modal className="modal">
        <ModalHeader>Update User</ModalHeader>
        <ModalContentWrapper>
          <ModalContent>
            <form id="form" onSubmit={handleSubmit} ref={userForm}>
              <InputBox>
                <ModalLabel htmlFor="email">Email</ModalLabel>
                <InputFieldModal
                  type="email"
                  name="email"
                  defaultValue={userEmail}
                  id="email"
                  placeholder="foo@bar.com"
                  required
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="Username">Username</ModalLabel>
                <InputFieldModal
                  type="username"
                  name="username"
                  defaultValue={userName}
                  id="username"
                />
              </InputBox>
              <InputBox>
                <ModalLabel htmlFor="roles">Roles</ModalLabel>
                <CheckboxHolder>{rolesOptions}</CheckboxHolder>
              </InputBox>
              <Actions>
                <CancelBtn type="button" onClick={closeModal}>
                  Cancel
                </CancelBtn>
                <SubmitBtnModal type="submit" ref={submitBtn}>
                  Submit
                </SubmitBtnModal>
              </Actions>
            </form>
          </ModalContent>
        </ModalContentWrapper>
        <CloseBtn onClick={closeModal}>&times;</CloseBtn>
      </Modal>
    </StyledPopup>
  )
}

export default FormUserEdit
