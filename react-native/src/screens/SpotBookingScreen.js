/**
 * SpotBookingScreen — reserve a parking spot (demo mode).
 * In production, connect alphinium-payments for real Stripe checkout.
 */
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useMotoStore } from '../store/motoStore';

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={[s.input, multiline && s.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted || '#94A3B8'}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
}

export default function SpotBookingScreen({ navigation }) {
  const { selectedSpot, addReservation } = useMotoStore();
  const spot = selectedSpot;

  const [form, setForm] = useState({ date: '', duration: '2', name: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  function handleSubmit() {
    if (!form.date.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const reservation = {
        id: `res-${Date.now()}`,
        spotId: spot?.id,
        spotName: spot?.name || 'Unknown Spot',
        date: form.date,
        duration: parseInt(form.duration, 10) || 2,
        name: form.name,
        note: form.note,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      addReservation?.(reservation);
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  }

  if (submitted) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.successContainer}>
          <Text style={s.successEmoji}>🏍️</Text>
          <Text style={s.successTitle}>Spot Reserved!</Text>
          <Text style={s.successText}>
            Your reservation request for{'\n'}
            <Text style={s.spotNameHighlight}>{spot?.name}</Text>
            {'\n'}has been sent. The owner will confirm within 2 hours.
          </Text>
          <View style={s.detailCard}>
            <Text style={s.detailRow}>📅 Date: <Text style={s.detailValue}>{form.date}</Text></Text>
            <Text style={s.detailRow}>⏱ Duration: <Text style={s.detailValue}>{form.duration} hours</Text></Text>
            <Text style={s.detailRow}>📍 Spot: <Text style={s.detailValue}>{spot?.city}</Text></Text>
          </View>
          <View style={s.callout}>
            <Text style={s.calloutTitle}>alphinium-payments</Text>
            <Text style={s.calloutText}>
              Wire real Stripe checkout here — collect payment upfront, release to owner on completion, automated refunds on cancellation.
            </Text>
          </View>
          <Pressable style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backBtnText}>← Back to map</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <Pressable style={s.backRow} onPress={() => navigation.goBack()}>
            <Text style={s.backRowText}>← Back</Text>
          </Pressable>

          <Text style={s.heading}>Reserve this spot</Text>

          {spot && (
            <View style={s.spotPreview}>
              <Text style={s.spotPreviewName}>{spot.name}</Text>
              <Text style={s.spotPreviewMeta}>{spot.city} · {spot.tip}</Text>
            </View>
          )}

          <View style={s.formCard}>
            <Field
              label="Date & Time"
              placeholder="e.g. Monday 7 July, 9am"
              value={form.date}
              onChangeText={(v) => update('date', v)}
            />
            <Field
              label="Duration (hours)"
              placeholder="2"
              keyboardType="numeric"
              value={form.duration}
              onChangeText={(v) => update('duration', v)}
            />
            <Field
              label="Your name (optional)"
              placeholder="Alex"
              value={form.name}
              onChangeText={(v) => update('name', v)}
            />
            <Field
              label="Note to owner (optional)"
              placeholder="What bike are you riding? Any questions for the owner…"
              multiline
              value={form.note}
              onChangeText={(v) => update('note', v)}
            />

            <Pressable
              style={[s.submitBtn, submitting && s.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={submitting || !form.date.trim()}
            >
              {submitting
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={s.submitBtnText}>Send Reservation Request 🏍️</Text>
              }
            </Pressable>
          </View>

          <View style={s.callout}>
            <Text style={s.calloutTitle}>alphinium-payments addon</Text>
            <Text style={s.calloutText}>
              Add real payment collection, spot-owner payouts, and refund handling in one install.
              Supports hourly and daily pricing with platform fee configuration.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  backRow: { alignSelf: 'flex-start', paddingVertical: 6 },
  backRowText: { color: '#F97316', fontWeight: '700' },
  heading: { fontSize: 26, fontWeight: '900', color: '#F8FAFC' },
  spotPreview: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 14, gap: 6 },
  spotPreviewName: { color: '#F8FAFC', fontWeight: '800', fontSize: 16 },
  spotPreviewMeta: { color: '#94A3B8', fontSize: 13, lineHeight: 20 },
  formCard: { backgroundColor: '#1E293B', borderRadius: 20, borderWidth: 1, borderColor: '#334155', padding: 18, gap: 14 },
  fieldWrap: { gap: 6 },
  fieldLabel: { color: '#CBD5E1', fontWeight: '700', fontSize: 14 },
  input: { backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 14, paddingVertical: 12, color: '#F8FAFC', fontSize: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#F97316', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  callout: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 14 },
  calloutTitle: { color: '#F97316', fontWeight: '800', fontSize: 13, marginBottom: 4 },
  calloutText: { color: '#94A3B8', fontSize: 12, lineHeight: 18 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  successEmoji: { fontSize: 52 },
  successTitle: { fontSize: 26, fontWeight: '900', color: '#F8FAFC' },
  successText: { color: '#94A3B8', textAlign: 'center', lineHeight: 22, fontSize: 15 },
  spotNameHighlight: { color: '#F97316', fontWeight: '800' },
  detailCard: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, borderColor: '#334155', padding: 16, width: '100%', gap: 6 },
  detailRow: { color: '#94A3B8', fontSize: 14 },
  detailValue: { color: '#F8FAFC', fontWeight: '700' },
  backBtn: { backgroundColor: '#1E293B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  backBtnText: { color: '#F97316', fontWeight: '700' },
});
