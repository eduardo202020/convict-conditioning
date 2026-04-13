import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppButton } from '../../components/AppButton';
import { AppHeader } from '../../components/AppHeader';
import { ExerciseCard } from '../../components/ExerciseCard';
import { Screen } from '../../components/Screen';
import { todayExercises } from '../../data/mockData';
import { colors, spacing, typography } from '../../theme';

export function TodayScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <AppHeader
        eyebrow="SEMANA 12 · SESION 04"
        title="PROGRAMA DE HOY"
        description="Operacion: Veterano. Tension constante, ejecucion limpia y nada de repeticiones regaladas."
        rightIcon="account-circle-outline"
        onRightPress={() => navigation.navigate('Profile')}
      />

      <View style={styles.grid}>
        {todayExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            figure={exercise.figure}
            sample={exercise.sample}
            subtitle={`${exercise.stepName} · ${exercise.prescription}`}
            title={exercise.movement}
            onPress={() =>
              navigation.navigate('BibliotecaStack', {
                screen: 'StepDetail',
                params: { slug: exercise.id === 'pullups' ? 'pullup' : 'bridge' },
              })
            }
          />
        ))}
      </View>

      <View style={styles.ctaBlock}>
        <Text style={styles.ready}>PREPARADO PARA EL DESPLIEGUE</Text>
        <AppButton label="INICIAR SESION" onPress={() => navigation.navigate('ActiveSession')} />
        <Text style={styles.quote}>"El dolor es temporal, el orgullo es para siempre."</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { marginTop: spacing.xl, backgroundColor: colors.outlineVariant, gap: 1 },
  ctaBlock: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, gap: spacing.lg, alignItems: 'center' },
  ready: { ...typography.label, color: colors.secondary },
  quote: { ...typography.caption, color: colors.onSurfaceVariant, fontFamily: 'Newsreader_400Regular_Italic' },
});
