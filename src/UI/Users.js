import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { clearNotificationState } from '../redux/notificationsReducer'

import { CanUser } from './CanUser'

import FormUsers from './FormUsers'
import FormUsersDelete from './FormUserDelete'
import FormUserEdit from './FormUserEdit'
import { useNotification } from './NotificationProvider'
import PageHeader from './PageHeader'
import PageSection from './PageSection'

import { TextAlignCenter } from './CommonStyles'

import {
  DataTable,
  DataRow,
  DataHeader,
  DataCell,
  IconCell,
  IconRemove,
  IconEdit,
  IconEmail,
} from './CommonStylesTables'

import { ActionButton } from './CommonStylesForms'

function Users(props) {
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.login)
  const usersState = useSelector((state) => state.users)
  const notificationsState = useSelector((state) => state.notifications)

  const error = notificationsState.errorMessage
  const success = notificationsState.successMessage
  const warning = notificationsState.warningMessage
  const users = usersState.users
  const loggedInUserState = loginState.loggedInUserState

  const [userModalIsOpen, setUserModalIsOpen] = useState(false)
  const [userEditModalIsOpen, setUserEditModalIsOpen] = useState(false)
  const [deleteUserModalIsOpen, setDeleteUserModalIsOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')

  const [buttonDisabled, setButtonDisabled] = useState(false)

  const [index, setIndex] = useState(false)

  // Accessing notification context
  const setNotification = useNotification()

  useEffect(() => {
    if (success) {
      setNotification(success, 'notice')
      dispatch(clearNotificationState())

      // (Simon): Temporary solution. Closing all/any modals on success
      closeUserModal()
      closeUserEditModal()
      closeDeleteModal()
    } else if (error) {
      setNotification(error, 'error')
      dispatch(clearNotificationState())
      setIndex(index + 1)
    } else if (warning) {
      setNotification(warning, 'warning')
      dispatch(clearNotificationState())
    } else return
  }, [error, success, dispatch, warning])

  const closeUserModal = () => setUserModalIsOpen(false)
  const closeUserEditModal = () => setUserEditModalIsOpen(false)
  const closeDeleteModal = () => setDeleteUserModalIsOpen(false)

  const addUser = () => {
    setUserModalIsOpen(true)
  }

  const editUser = () => {
    setUserEditModalIsOpen(true)
  }

  const deleteUser = () => {
    setDeleteUserModalIsOpen(true)
  }

  const resendEmail = (email) => {
    props.sendRequest('USERS', 'RESEND_CONFIRMATION', email)
    setButtonDisabled(true)
  }

  let userRows = ''

  if (users) {
    userRows = users.map((user) => {
      let userId = ''
      let userName = ''
      let userEmail = ''
      let userRoles = ' | '

      if (user) {
        if (user.user_id) {
          userId = user.user_id
        }
        if (user.username) {
          userName = user.username
        }
        if (user.email) {
          userEmail = user.email
        }

        for (var key in user.Roles) {
          userRoles += user.Roles[key].role_name + ' | '
        }
      }

      return (
        <DataRow key={user.user_id} onClick={() => {}}>
          <DataCell>{userName}</DataCell>
          <DataCell>{userEmail}</DataCell>
          <DataCell>{userRoles}</DataCell>

          <CanUser
            perform="users:update, users:updateRoles"
            yes={() => (
              <IconCell
                onClick={() => {
                  editUser()
                  setUserEmail(userEmail)
                }}
              >
                <IconEdit alt="Edit" />
              </IconCell>
            )}
          />
          {loggedInUserState && loggedInUserState.id !== userId ? (
            <CanUser
              perform="users:delete"
              yes={() => (
                <IconCell
                  onClick={() => {
                    deleteUser()
                    setUserId(userId)
                  }}
                >
                  <IconRemove alt="Remove" />
                </IconCell>
              )}
            />
          ) : (
            <IconCell></IconCell>
          )}
          {!userName ? (
            <CanUser
              perform="users:create"
              yes={() =>
                !buttonDisabled ? (
                  <IconCell
                    onClick={() => {
                      resendEmail(userEmail)
                    }}
                  >
                    <IconEmail
                      disabled={buttonDisabled}
                      alt="Re-send confirmation email"
                    />
                  </IconCell>
                ) : (
                  <IconCell>
                    <IconEmail
                      disabled={buttonDisabled}
                      alt="Re-send confirmation email"
                    />
                  </IconCell>
                )
              }
            />
          ) : (
            <IconCell></IconCell>
          )}
        </DataRow>
      )
    })
  }

  return (
    <>
      <div id="users">
        <PageHeader title={'Users'} />
        <PageSection>
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Username</DataHeader>
                <DataHeader>Email</DataHeader>
                <DataHeader>Roles</DataHeader>
                <CanUser
                  perform="users:update"
                  yes={() => (
                    <DataHeader>
                      <TextAlignCenter>Edit</TextAlignCenter>
                    </DataHeader>
                  )}
                />
                <CanUser
                  perform="users:delete"
                  yes={() => (
                    <DataHeader>
                      <TextAlignCenter>Remove</TextAlignCenter>
                    </DataHeader>
                  )}
                />
                <CanUser
                  perform="users:create"
                  yes={() => (
                    <DataHeader>
                      <TextAlignCenter>Resend</TextAlignCenter>
                    </DataHeader>
                  )}
                />
              </DataRow>
            </thead>
            <tbody>{userRows ? userRows : ''}</tbody>
          </DataTable>
        </PageSection>
        <ActionButton title="Add a New User" onClick={addUser}>
          +
        </ActionButton>
        <FormUsers
          sendRequest={props.sendRequest}
          error={index}
          userModalIsOpen={userModalIsOpen}
          closeUserModal={closeUserModal}
        />
        <FormUserEdit
          sendRequest={props.sendRequest}
          error={index}
          userEmail={userEmail}
          userEditModalIsOpen={userEditModalIsOpen}
          closeUserEditModal={closeUserEditModal}
        />
        <FormUsersDelete
          sendRequest={props.sendRequest}
          error={index}
          userId={userId}
          deleteUserModalIsOpen={deleteUserModalIsOpen}
          closeDeleteModal={closeDeleteModal}
        />
      </div>
    </>
  )
}

export default Users
