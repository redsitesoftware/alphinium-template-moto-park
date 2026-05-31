import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useMotoStore } from '../store/motoStore';
import { colors, spacing, radius, typography } from '../theme';

export default function AboutScreen() {
  const setPhase = useMotoStore(s => s.setPhase);
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.content}>
        <TouchableOpacity onPress={() => setPhase('map')} style={s.back}>
          <Text style={s.backText}>← Back to Map</Text>
        </TouchableOpacity>
        <Text style={s.emoji}>🏍️</Text>
        <Text style={s.title}>MotoPark</Text>
        <Text style={s.sub}>Free motorcycle parking — community sourced</Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>How it works</Text>
          <Text style={s.cardText}>MotoPark is a community map of free motorcycle parking spots. Riders add spots, confirm they're still good, and share tips with fellow riders.</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>🇦🇺 Australian footpath parking</Text>
          <Text style={s.cardText}>In VIC, NSW, QLD and SA, motorcycles can legally park on footpaths where they don't obstruct pedestrians. We map the best spots.</Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Want to add a spot?</Text>
          <Text style={s.cardText}>Feature coming soon — join the waitlist to be notified when community contributions open.</Text>
          <TouchableOpacity style={s.waitlistBtn}>
            <Text style={s.waitlistBtnText}>Join Waitlist →</Text>
          </TouchableOpacity>
        </View>

        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statNum}>47</Text>
            <Text style={s.statLbl}>Spots mapped</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>4</Text>
            <Text style={s.statLbl}>Cities</Text>
          </View>
          <View style={s.statBox}>
            <Text style={s.statNum}>312</Text>
            <Text style={s.statLbl}>Confirmations</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: colors.bg },
  content:      { padding: spacing.lg, alignItems: 'center' },
  back:         { alignSelf: 'flex-start', marginBottom: spacing.lg },
  backText:     { color: colors.primary, fontSize: 15, fontWeight: '600' },
  emoji:        { fontSize: 64, marginBottom: spacing.md },
  title:        { ...typography.hero, color: colors.primary, textAlign: 'center' },
  sub:          { ...typography.body, color: colors.textSub, textAlign: 'center', marginBottom: spacing.xl },
  card:         { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg,
                  width: '100%', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.cardBorder },
  cardTitle:    { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  cardText:     { fontSize: 14, color: colors.textSub, lineHeight: 22 },
  waitlistBtn:  { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md,
                  alignItems: 'center', marginTop: spacing.md },
  waitlistBtnText: { color: colors.black, fontWeight: '800', fontSize: 14 },
  statsRow:     { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  statBox:      { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
                  alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  statNum:      { fontSize: 28, fontWeight: '900', color: colors.primary },
  statLbl:      { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 4 },
});
