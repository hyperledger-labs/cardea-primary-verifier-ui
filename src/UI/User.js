import React from 'react'

import PageHeader from './PageHeader'
import PageSection from './PageSection'

import { DataTable, DataRow, DataHeader } from './CommonStylesTables'

function User(props) {
  return (
    <>
      <div id="profile">
        <PageHeader title={'Profile'} />
        <PageSection>
          <DataTable>
            <thead>
              <DataRow>
                <DataHeader>Login</DataHeader>
                <DataHeader>Email</DataHeader>
                <DataHeader>Roles</DataHeader>
                <DataHeader>Password</DataHeader>
                <DataHeader>Reset ID</DataHeader>
                <DataHeader></DataHeader>
              </DataRow>
            </thead>
          </DataTable>
        </PageSection>
      </div>
    </>
  )
}

export default User
