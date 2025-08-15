import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

export interface CommissionMember {
  fio: string
  military_rank: string
}

export const Signatures: FC<{
  commissionBoss: CommissionMember[]
  commissionMembers: CommissionMember[]
  commissionSecretary: CommissionMember[]
}> = ({ commissionBoss, commissionMembers, commissionSecretary }) => {
  const { t } = useTranslation()

  return (
    <View>
      <View style={styles.sectionWrapper}>
        <View style={styles.sectionLabelWrapper}>
          <Text>{t('commission_boss')}:</Text>
        </View>
        <View style={styles.membersListWrapper}>
          {commissionBoss.map((member, index) => (
            <View
              key={index}
              style={styles.memberWrapper}
            >
              <Text style={{ flex: 1, fontWeight: 'semibold' }}>{member.military_rank}</Text>
              <Text style={{ flex: 2 }}>{member.fio}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionWrapper}>
        <View style={styles.sectionLabelWrapper}>
          <Text>{t('commission_members')}:</Text>
        </View>
        <View style={styles.membersListWrapper}>
          {commissionMembers.map((member, index) => (
            <View
              key={index}
              style={styles.memberWrapper}
            >
              <Text style={{ flex: 1, fontWeight: 'semibold' }}>{member.military_rank}</Text>
              <Text style={{ flex: 2 }}>{member.fio}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionWrapper}>
        <View style={styles.sectionLabelWrapper}>
          <Text>{t('commission_secretary')}:</Text>
        </View>
        <View style={styles.membersListWrapper}>
          {commissionSecretary.map((member, index) => (
            <View
              key={index}
              style={styles.memberWrapper}
            >
              <Text style={{ flex: 1, fontWeight: 'semibold' }}>{member.military_rank}</Text>
              <Text style={{ flex: 2 }}>{member.fio}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionWrapper: {
    marginTop: 20,
    fontSize: 11,
    display: 'flex',
    flexDirection: 'row'
  },
  sectionLabelWrapper: {
    width: 200
  },
  sectionLabel: {},
  membersListWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 5
  },
  memberWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
})
