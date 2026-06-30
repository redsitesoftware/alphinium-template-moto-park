/**
 * MotoPark Home — Landing + filter bar + map
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useMotoStore } from '../store/motoStore';
import { colors, spacing, radius, typography } from '../theme';

// Lazy-load map on web only
let MotoMap = null;
if (Platform.OS === 'web') {
  MotoMap = require('../components/MotoMap.web').default;
}

const FILTERS = [
  { id: 'all', label: 'All Spots' },
  { id: 'footpath', label: '🛣️ Footpath' },
  { id: 'dedicated', label: '🏍️ Dedicated' },
  { id: 'covered', label: '🏢 Covered' },
];

const CITIES = ['all', 'Sydney', 'Melbourne', 'Brisbane', 'Adelaide'];

export default function HomeScreen() {
  const { filter, setFilter, city, setCity, selectSpot, selectedSpot, clearSelected, setPhase,
    getTypeIcon, getTypeLabel, filteredSpots, confirmSpot } = useMotoStore();
  const spots = filteredSpots();
  const selectedId = selectedSpot?.id;

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.logo}>🏍️ MotoPark</Text>
          <Text style={s.tagline}>{spots.length} free spots near you</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setPhase('about')}>
          <Text style={s.addBtnText}>+ Add Spot</Text>
        </TouchableOpacity>
      </View>

      {/* City filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.cityScroll}
        contentContainerStyle={s.cityRow}>
        {CITIES.map(c => (
          <TouchableOpacity key={c} style={[s.cityChip, city === c && s.cityChipActive]}
            onPress={() => setCity(c)}>
            <Text style={[s.cityChipText, city === c && s.cityChipTextActive]}>
              {c === 'all' ? '🌏 All Cities' : c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Type filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}
        contentContainerStyle={s.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f.id} style={[s.filterChip, filter === f.id && s.filterChipActive]}
            onPress={() => setFilter(f.id)}>
            <Text style={[s.filterChipText, filter === f.id && s.filterChipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map */}
      <View style={s.mapContainer}>
        {MotoMap ? (
          <MotoMap spots={spots} selectedId={selectedId} onSelectSpot={selectSpot} />
        ) : (
          <View style={s.mapPlaceholder}>
            <Text style={s.mapPlaceholderText}>🗺️ Map (native)</Text>
          </View>
        )}
      </View>

      {/* Selected spot card */}
      {selectedSpot && (
        <View style={s.spotCard}>
          <View style={s.spotCardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.spotName}>{selectedSpot.name}</Text>
              <Text style={s.spotMeta}>
                {getTypeIcon(selectedSpot.type)} {getTypeLabel(selectedSpot.type)} ·{' '}
                {selectedSpot.free ? '✅ Free' : '💰 Paid'} ·{' '}
                {selectedSpot.covered ? '🏢 Covered' : '☀️ Open'}
              </Text>
            </View>
            <TouchableOpacity onPress={clearSelected} style={s.closeBtn}>
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.tip}>💬 "{selectedSpot.tip}"</Text>

          <View style={s.spotStats}>
            <View style={s.stat}>
              <Text style={s.statVal}>⭐ {selectedSpot.rating}</Text>
              <Text style={s.statLabel}>Rating</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statVal}>{selectedSpot.confirmed}</Text>
              <Text style={s.statLabel}>Confirmed</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statVal}>{selectedSpot.bikes}</Text>
              <Text style={s.statLabel}>Bike capacity</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statVal}>{selectedSpot.restriction}</Text>
              <Text style={s.statLabel}>Time limit</Text>
            </View>
          </View>

          <View style={s.cardActions}>
            <TouchableOpacity style={s.confirmBtn} onPress={() => confirmSpot(selectedSpot.id)}>
              <Text style={s.confirmBtnText}>✓ Confirm It's Still Good</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.directionsBtn}
              onPress={() => { if (typeof window !== 'undefined')
                window.open(`https://maps.google.com/?q=${selectedSpot.lat},${selectedSpot.lng}`, '_blank'); }}>
              <Text style={s.directionsBtnText}>Navigate →</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.reserveBtn} onPress={() => setPhase('booking')}>
            <Text style={s.reserveBtnText}>🏍️ Reserve This Spot</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Spot list (when no spot selected) */}
      {!selectedSpot && (
        <ScrollView style={s.list} contentContainerStyle={s.listContent}>
          {spots.map(spot => (
            <TouchableOpacity key={spot.id} style={s.listItem} onPress={() => selectSpot(spot.id)}>
              <Text style={s.listIcon}>{getTypeIcon(spot.type)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.listName}>{spot.name}</Text>
                <Text style={s.listSub}>{spot.city} · {getTypeLabel(spot.type)} · {spot.restriction}</Text>
              </View>
              <View style={s.listRight}>
                <Text style={s.listRating}>⭐ {spot.rating}</Text>
                {spot.covered && <Text style={s.badge}>🏢</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: colors.bg },
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  logo:           { fontSize: 22, fontWeight: '900', color: colors.primary },
  tagline:        { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  addBtn:         { backgroundColor: colors.primary, borderRadius: radius.md,
                    paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  addBtnText:     { color: colors.black, fontWeight: '800', fontSize: 13 },

  cityScroll:     { maxHeight: 44 },
  cityRow:        { paddingHorizontal: spacing.md, gap: spacing.sm, alignItems: 'center', paddingVertical: spacing.sm },
  cityChip:       { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.round,
                    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  cityChipActive: { backgroundColor: colors.primary + '22', borderColor: colors.primary },
  cityChipText:   { fontSize: 13, color: colors.textSub },
  cityChipTextActive: { color: colors.primary, fontWeight: '700' },

  filterScroll:   { maxHeight: 44 },
  filterRow:      { paddingHorizontal: spacing.md, gap: spacing.sm, alignItems: 'center', paddingVertical: spacing.sm },
  filterChip:     { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.round,
                    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 13, color: colors.textSub },
  filterChipTextActive: { color: colors.black, fontWeight: '700' },

  mapContainer:   { height: 320, marginHorizontal: spacing.md, borderRadius: radius.lg,
                    overflow: 'hidden', borderWidth: 1, borderColor: colors.cardBorder, marginBottom: spacing.sm },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card },
  mapPlaceholderText: { color: colors.textMuted, fontSize: 16 },

  spotCard:       { backgroundColor: colors.card, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
                    borderTopWidth: 2, borderColor: colors.primary, padding: spacing.md,
                    marginTop: 'auto' },
  spotCardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.sm },
  spotName:       { fontSize: 16, fontWeight: '800', color: colors.text },
  spotMeta:       { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  closeBtn:       { padding: spacing.sm },
  closeBtnText:   { color: colors.textMuted, fontSize: 18 },
  tip:            { fontSize: 13, color: colors.textSub, fontStyle: 'italic', marginBottom: spacing.md,
                    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.sm },
  spotStats:      { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md },
  stat:           { alignItems: 'center' },
  statVal:        { fontSize: 16, fontWeight: '700', color: colors.text },
  statLabel:      { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  cardActions:    { flexDirection: 'row', gap: spacing.sm },
  confirmBtn:     { flex: 2, backgroundColor: colors.primary, borderRadius: radius.md,
                    padding: spacing.md, alignItems: 'center' },
  confirmBtnText: { color: colors.black, fontWeight: '800', fontSize: 14 },
  directionsBtn:  { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md,
                    borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md, alignItems: 'center' },
  directionsBtnText: { color: colors.text, fontWeight: '700', fontSize: 14 },
  reserveBtn:     { backgroundColor: '#F97316', borderRadius: radius.md, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  reserveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },

  list:           { flex: 1 },
  listContent:    { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  listItem:       { flexDirection: 'row', alignItems: 'center', gap: spacing.md,
                    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md,
                    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  listIcon:       { fontSize: 24 },
  listName:       { fontSize: 15, fontWeight: '700', color: colors.text },
  listSub:        { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  listRight:      { alignItems: 'flex-end', gap: 4 },
  listRating:     { fontSize: 13, color: colors.textSub },
  badge:          { fontSize: 16 },
});
