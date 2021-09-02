import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

import PageHeader from './PageHeader.js'
import PageSection from './PageSection.js'

import { AttributeTable, AttributeRow } from './CommonStylesTables'

function Credential(props) {
  const history = props.history
  const credential = props.credential
  const credentials = props.credentials

  let credentialSelected = ''

  for (let i = 0; i < credentials.length; i++) {
    if (credentials[i].credential_exchange_id == credential) {
      credentialSelected = credentials[i]
      break
    }
  }

  // Initialize variables to blank (to prevent errors during loading)
  let showCredential = {
    name: '',
    credential_exchange_id: '',
    state: '',
    date_created: '',
  }

  // Attributes of this kind of credential
  let showAttributes = {
    trusted_traveler_id: '',
    traveler_first_name: '',
    traveler_last_name: '',
    traveler_date_of_birth: '',
    traveler_date_time: '',
    // result: '',
    // normality: '',
    // result_status: '',
    // comment: '',
    // date_time_of_message: '',
    // sending_facility: '',
    // ordering_facility_name: '',
    // ordering_facility_address: '',
    // performing_lab: '',
    // visit_location: '',
    // lab_order_id: '',
    // lab_code: '',
    // lab_coding_qualifer: '',
    // lab_description: '',
    // lab_specimen_collected_date: '',
    // observation_date_time: '',

    // mpid: '',
    // patient_local_id: '',
    // patient_name: '',
    // patient_first_name: '',
    // patient_last_name: '',
    // patient_date_of_birth: '',
    // patient_gender_legal: '',
    // patient_phone: '',
    // patient_street_address: '',
    // patient_city: '',
    // patient_state: '',
    // patient_postalcode: '',
    // patient_country: '',
  }

  // Now set the values if we have a credential
  if (credentialSelected !== '') {
    showCredential.name =
      credentialSelected.credential_proposal_dict.schema_name.replaceAll(
        '_',
        ' '
      ) || ''
    showCredential.credential_exchange_id =
      credentialSelected.credential_exchange_id || ''
    showCredential.state = credentialSelected.state || ''
    showCredential.created_at =
      new Date(credentialSelected.created_at).toISOString().substring(0, 10) ||
      ''

    // Values that depend on the credential being issued
    if (
      credentialSelected.credential !== null &&
      credentialSelected.credential !== undefined &&
      credentialSelected.credential.values !== null &&
      credentialSelected.credential.values !== undefined
    ) {
      const values = credentialSelected.credential.values
      console.log(credentialSelected.credential.values, 'creds')

      showAttributes.traveler_surnames = values.traveler_surnames.raw || ''
      showAttributes.traveler_given_names =
        values.traveler_given_names.raw || ''
      showAttributes.traveler_date_of_birth =
        new DateTime.fromSeconds(
          parseInt(values.traveler_date_of_birth.raw)
        ).toLocaleString(DateTime.DATE_MED) || ''
      showAttributes.traveler_gender_legal =
        values.traveler_gender_legal.raw || ''
      showAttributes.traveler_country = values.traveler_country.raw || ''
      showAttributes.traveler_origin_country =
        values.traveler_origin_country.raw || ''
      showAttributes.traveler_email = values.traveler_email.raw || ''

      showAttributes.trusted_traveler_id = values.trusted_traveler_id.raw || ''
      showAttributes.trusted_traveler_issue_date_time =
        new DateTime.fromSeconds(
          parseInt(values.trusted_traveler_issue_date_time.raw)
        ).toLocaleString(DateTime.DATETIME_MED) || ''
      showAttributes.trusted_traveler_expiration_date_time =
        new DateTime.fromSeconds(
          parseInt(values.trusted_traveler_expiration_date_time.raw)
        ).toLocaleString(DateTime.DATETIME_MED) || ''
      showAttributes.governance_applied = values.governance_applied.raw || ''

      showAttributes.credential_issuer_name =
        values.credential_issuer_name.raw || ''
      showAttributes.credential_issue_date =
        new DateTime.fromSeconds(
          parseInt(values.credential_issue_date.raw)
        ).toLocaleString(DateTime.DATE_MED) || ''
    }
  }

  return (
    <div id="contact">
      <PageHeader
        title={
          showCredential.name +
          ' for ' +
          showAttributes.traveler_given_names +
          ' ' +
          showAttributes.traveler_surnames
        }
      />
      <PageSection>
        <h2>General Information</h2>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Credential Name:</th>
              <td>{showCredential.name}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Credential ID:</th>
              <td>{showCredential.credential_exchange_id}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Credential State:</th>
              <td>{showCredential.state}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Date Created:</th>
              <td>{showCredential.created_at}</td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
        <h2>Traveler Information</h2>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Traveler Surnames:</th>
              <td>{showAttributes.traveler_surnames}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Traveler Given Names:</th>
              <td>{showAttributes.traveler_given_names}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Traveler Date of Birth:</th>
              <td>{showAttributes.traveler_date_of_birth}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Traveler Gender Legal:</th>
              <td>{showAttributes.traveler_gender_legal}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Traveler Country:</th>
              <td>{showAttributes.traveler_country}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Traveler Origin Country:</th>
              <td>{showAttributes.traveler_origin_country}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Traveler Email:</th>
              <td>{showAttributes.traveler_email}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Trusted Traveler ID:</th>
              <td>{showAttributes.trusted_traveler_id}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Trusted Traveler Issue Date Time:</th>
              <td>{showAttributes.trusted_traveler_issue_date_time}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Trusted Traveler Expiration Date Time:</th>
              <td>{showAttributes.trusted_traveler_expiration_date_time}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Governance Applied:</th>
              <td>{showAttributes.governance_applied}</td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
        <h2>Credential Information</h2>
        <AttributeTable>
          <tbody>
            <AttributeRow>
              <th>Credential Issuer Name:</th>
              <td>{showAttributes.credential_issuer_name}</td>
            </AttributeRow>
            <AttributeRow>
              <th>Credential Issue Date:</th>
              <td>{showAttributes.credential_issue_date}</td>
            </AttributeRow>
          </tbody>
        </AttributeTable>
      </PageSection>
    </div>
  )
}

export default Credential
