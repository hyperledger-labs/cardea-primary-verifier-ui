import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import PageHeader from './PageHeader.js'
import PageSection from './PageSection.js'

import { AttributeTable, AttributeRow } from './CommonStylesTables'

import { DateTime } from 'luxon'

function Presentation(props) {
  const contactsState = useSelector((state) => state.contacts)
  const presentationsState = useSelector((state) => state.presentations)

  const contacts = contactsState.contacts
  const presentationReports = presentationsState.presentationReports

  // const contacts = props.contacts
  const presentationId = props.presentation
  // const presentationReports = props.presentationReports

  let presentationSelected = ''

  for (let i = 0; i < presentationReports.length; i++) {
    if (presentationReports[i].presentation_exchange_id === presentationId) {
      presentationSelected = presentationReports[i]
      break
    }
  }

  // (AmmonBurgi) Find connection and give the selected presentation a contact_label.
  for (let i = 0; i < contacts.length; i++) {
    if (
      contacts[i].Connections[0].connection_id ===
      presentationSelected.connection_id
    ) {
      presentationSelected.contact_label = contacts[i].label
      break
    }
  }

  if (presentationSelected !== '') {
    let displayAttributes = ''
    let attributes = {}
    const requestName = JSON.parse(presentationSelected.presentation_request)
      .name

    if (presentationSelected.presentation) {
      const presentationRequestedProof = JSON.parse(
        presentationSelected.presentation
      ).requested_proof

      if (
        presentationRequestedProof.self_attested_attrs ||
        presentationRequestedProof.revealed_attrs
      ) {
        attributes = {
          ...presentationRequestedProof.self_attested_attrs,
          ...presentationRequestedProof.revealed_attrs,
        }
      }
    }

    if (
      attributes[Object.keys(attributes)[0]] &&
      attributes[Object.keys(attributes)[0]].raw !== null &&
      attributes[Object.keys(attributes)[0]].raw !== undefined
    ) {
      for (const attribute in attributes) {
        attributes[attribute] = attributes[attribute].raw
      }
    }

    if (presentationSelected.presentation && requestName === 'Vaccination') {
      displayAttributes = (
        <>
          <h2>Presentation Attributes</h2>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Certificate Original Identifier:</th>
                <td>{attributes.certificate_original_identifier || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Certificate Original Issuer:</th>
                <td>{attributes.certificate_original_issuer || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Credential Issue Date:</th>
                <td>{attributes.credential_issue_date || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Credential Issuer Name:</th>
                <td>{attributes.credential_issuer_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>MPID:</th>
                <td>{attributes.mpid || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient City:</th>
                <td>{attributes.patient_city || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Country:</th>
                <td>{attributes.patient_country || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Date Of Birth:</th>
                <td>{attributes.patient_date_of_birth || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Email:</th>
                <td>{attributes.patient_email || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Gender Legal:</th>
                <td>{attributes.patient_gender_legal || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Given Names:</th>
                <td>{attributes.patient_given_names || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Local ID:</th>
                <td>{attributes.patient_local_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Phone:</th>
                <td>{attributes.patient_phone || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Postalcode:</th>
                <td>{attributes.patient_postalcode || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient State/Province/Region:</th>
                <td>{attributes.patient_state_province_region || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Street Address:</th>
                <td>{attributes.patient_street_address || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Surnames:</th>
                <td>{attributes.patient_surnames || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Sending Facility:</th>
                <td>{attributes.sending_facility || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Country:</th>
                <td>{attributes.vaccine_administration_country || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Facility ID:</th>
                <td>{attributes.vaccine_administration_facility_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Facility ID Qualifier:</th>
                <td>
                  {attributes.vaccine_administration_facility_id_qualifier ||
                    ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Facility Name:</th>
                <td>{attributes.vaccine_administration_facility_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Postalcode:</th>
                <td>{attributes.vaccine_administration_postalcode || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Provider Fullname:</th>
                <td>
                  {attributes.vaccine_administration_provider_fullname || ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Provider ID:</th>
                <td>{attributes.vaccine_administration_provider_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration Provider ID Qualifier:</th>
                <td>
                  {attributes.vaccine_administration_provider_id_qualifier ||
                    ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Administration State/Province/Region:</th>
                <td>
                  {attributes.vaccine_administration_state_province_region ||
                    ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Code:</th>
                <td>{attributes.vaccine_code || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Code Name:</th>
                <td>{attributes.vaccine_code_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Code Qualifier:</th>
                <td>{attributes.vaccine_code_qualifier || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Disease Target Code:</th>
                <td>{attributes.vaccine_disease_target_code || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Disease Target Code Qualifier:</th>
                <td>
                  {attributes.vaccine_disease_target_code_qualifier || ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Disease Target Name:</th>
                <td>{attributes.vaccine_disease_target_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Dose Number:</th>
                <td>{attributes.vaccine_dose_number || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Education Reference Material:</th>
                <td>{attributes.vaccine_education_reference_material || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Lot Number:</th>
                <td>{attributes.vaccine_lot_number || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Manufacturer Code:</th>
                <td>{attributes.vaccine_manufacturer_code || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Manufacturer Code Name:</th>
                <td>{attributes.vaccine_manufacturer_code_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Manufacturer Code Qualifier:</th>
                <td>{attributes.vaccine_manufacturer_code_qualifier || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Record ID:</th>
                <td>{attributes.vaccine_record_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Vaccine Series Complete:</th>
                <td>{attributes.vaccine_series_complete || ''}</td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
        </>
      )
    }
    if (presentationSelected.presentation && requestName === 'Lab_Result') {
      displayAttributes = (
        <>
          <h2>Presentation Attributes</h2>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Credential Issue Date:</th>
                <td>{attributes.credential_issue_date || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Credential Issuer Name:</th>
                <td>{attributes.credential_issuer_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Code</th>
                <td>{attributes.lab_code || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Coding Qualifier:</th>
                <td>{attributes.lab_coding_qualifier || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Comment:</th>
                <td>{attributes.lab_comment || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Description:</th>
                <td>{attributes.lab_description || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Normality:</th>
                <td>{attributes.lab_normality || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Observation Date/Time:</th>
                <td>{attributes.lab_observation_date_time || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Order ID:</th>
                <td>{attributes.lab_order_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Performed By:</th>
                <td>{attributes.lab_performed_by || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Result:</th>
                <td>{attributes.lab_result || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Result Status:</th>
                <td>{attributes.lab_result_status || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Lab Specimen Type:</th>
                <td>{attributes.lab_specimen_type || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>MPID:</th>
                <td>{attributes.mpid || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Ordering Facility Country:</th>
                <td>{attributes.ordering_facility_country || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Ordering Facility ID:</th>
                <td>{attributes.ordering_facility_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Ordering Facility ID Qualifier:</th>
                <td>{attributes.ordering_facility_id_qualifier || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Ordering Facility Name:</th>
                <td>{attributes.ordering_facility_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Ordering Facility Postalcode:</th>
                <td>{attributes.ordering_facility_postalcode || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Ordering Facility State/Province/Region:</th>
                <td>
                  {attributes.ordering_facility_state_province_region || ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient City:</th>
                <td>{attributes.patient_city || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Country:</th>
                <td>{attributes.patient_country || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Date Of Birth:</th>
                <td>{attributes.patient_date_of_birth || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Email:</th>
                <td>{attributes.patient_email || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Gender Legal:</th>
                <td>{attributes.patient_gender_legal || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Given Names:</th>
                <td>{attributes.patient_given_names || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Local ID:</th>
                <td>{attributes.patient_local_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Phone:</th>
                <td>{attributes.patient_phone || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Postalcode:</th>
                <td>{attributes.patient_postalcode || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient State/Province/Region:</th>
                <td>{attributes.patient_state_province_region || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Street Address:</th>
                <td>{attributes.patient_street_address || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Patient Surnames:</th>
                <td>{attributes.patient_surnames || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Performing Laboratory Country:</th>
                <td>{attributes.performing_laboratory_country || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Performing Laboratory ID:</th>
                <td>{attributes.performing_laboratory_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Performing Laboratory ID Qualifier:</th>
                <td>{attributes.performing_laboratory_id_qualifier || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Performing Laboratory Name:</th>
                <td>{attributes.performing_laboratory_name || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Performing Laboratory Postalcode:</th>
                <td>{attributes.performing_laboratory_postalcode || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Performing Laboratory State/Province/Region</th>
                <td>
                  {attributes.performing_laboratory_state_province_region || ''}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
        </>
      )
    }

    return (
      <div id="contact">
        <PageHeader
          title={
            'Presentation request from ' + presentationSelected.contact_label ||
            ''
          }
        />
        <PageSection>
          <h2>Presentation Information</h2>
          <AttributeTable>
            <tbody>
              <AttributeRow>
                <th>Contact Label:</th>
                <td>{presentationSelected.contact_label || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Connection ID:</th>
                <td>{presentationSelected.connection_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Initiator:</th>
                <td>{presentationSelected.initiator || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Presentation Exchange ID:</th>
                <td>{presentationSelected.presentation_exchange_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Request Name:</th>
                <td>{requestName}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Role:</th>
                <td>{presentationSelected.role || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>State:</th>
                <td>{presentationSelected.state.replaceAll('_', ' ') || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Thread ID:</th>
                <td>{presentationSelected.thread_id || ''}</td>
              </AttributeRow>
              <AttributeRow>
                <th>Date Updated:</th>
                <td>
                  {new DateTime.fromISO(
                    presentationSelected.presentation_updated_at
                  ).toLocaleString(DateTime.DATETIME_MED) || ''}
                </td>
              </AttributeRow>
              <AttributeRow>
                <th>Date Created:</th>
                <td>
                  {new DateTime.fromISO(
                    presentationSelected.presentation_created_at
                  ).toLocaleString(DateTime.DATETIME_MED) || ''}
                </td>
              </AttributeRow>
            </tbody>
          </AttributeTable>
          {displayAttributes}
        </PageSection>
      </div>
    )
  } else {
    return (
      <div id="contact">
        <PageHeader title={'Presentation request'} />
        <PageSection>
          <h2>Presentation Information</h2>
        </PageSection>
      </div>
    )
  }
}

export default Presentation
