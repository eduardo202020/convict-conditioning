import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { getStepDetail, type StepMedia } from '../../db/library';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'MediaViewer'>;

export function MediaViewerScreen({ route }: Props) {
  const [media, setMedia] = useState<StepMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getStepDetail(route.params.slug, route.params.stepNumber)
      .then((detail) => {
        if (mounted) {
          setMedia(detail?.media ?? []);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [route.params.slug, route.params.stepNumber]);

  return (
    <Screen>
      <AppHeader
        eyebrow="VISOR MULTIMEDIA"
        title={route.params.title.toUpperCase()}
        description="Espacio limpio para inspeccionar imagenes y referencias de video del ejercicio."
      />

      <View style={styles.viewer}>
        {loading ? (
          <>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.copy}>Cargando medios del paso...</Text>
          </>
        ) : media.length ? (
          media.map((item) => (
            <Pressable key={item.id} onPress={() => Linking.openURL(item.uri)} style={styles.mediaRow}>
              <MaterialCommunityIcons
                color={item.kind === 'video_guide' ? colors.primary : colors.tertiary}
                name={item.kind === 'video_guide' ? 'play-box-outline' : 'image-outline'}
                size={24}
              />
              <View style={{ flex: 1, gap: spacing.xxs }}>
                <Text style={styles.mediaKind}>{item.kind}</Text>
                <Text numberOfLines={2} style={styles.mediaUri}>
                  {item.uri}
                </Text>
                {item.credit ? <Text style={styles.mediaCredit}>{item.credit}</Text> : null}
              </View>
            </Pressable>
          ))
        ) : (
          <>
            <MaterialCommunityIcons color={colors.primary} name="image-filter-center-focus" size={42} />
            <Text style={styles.copy}>No hay medios asociados a este paso.</Text>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  viewer: { marginHorizontal: spacing.lg, marginTop: spacing.xl, minHeight: 320, backgroundColor: colors.surfaceContainer, gap: spacing.md, padding: spacing.lg },
  copy: { ...typography.body, color: colors.onSurfaceVariant, textAlign: 'center' },
  mediaRow: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.surfaceContainerHigh, padding: spacing.md, alignItems: 'flex-start' },
  mediaKind: { ...typography.label, color: colors.onSurface },
  mediaUri: { ...typography.caption, color: colors.tertiary },
  mediaCredit: { ...typography.caption, color: colors.onSurfaceVariant },
});
