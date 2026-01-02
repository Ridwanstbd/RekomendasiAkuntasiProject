import React from "react";
import { View, StyleSheet } from "react-native";
import { Wallet, ArrowRight } from "lucide-react-native";
import { HeroFormTemplate } from "../organisms/HeroFormTemplate";
import { FormField } from "../molecules/FormField";
import { Button } from "../atoms/Button";
import { Typography } from "../atoms/Typography";
import { SelectField } from "../organisms/SelectField";
import { SetupProgress } from "../organisms/SetupProgress";

interface SetupTemplateProps {
  currentStep: number;
  loading: boolean;
  statusMessage: string;
  formState: {
    name: string;
    description: string;
    businessStatus: string;
    initialCapital: string;
  };
  handlers: {
    setName: (val: string) => void;
    setDescription: (val: string) => void;
    setBusinessStatus: (val: any) => void;
    setInitialCapital: (val: string) => void;
    handleSetup: () => void;
    handleSaveInitialCapital: () => void;
    onSkip: () => void;
  };
}

export const SetupTemplate: React.FC<SetupTemplateProps> = ({
  currentStep,
  loading,
  statusMessage,
  formState,
  handlers,
}) => {
  return (
    <HeroFormTemplate
      title={
        currentStep === 1
          ? "Siapkan Bisnis"
          : currentStep === 2
          ? "Mohon Tunggu"
          : "Modal Awal"
      }
      subtitle={
        currentStep === 1
          ? "Langkah awal menuju manajemen keuangan profesional."
          : currentStep === 2
          ? "Kami sedang menyiapkan lingkungan akuntansi Anda."
          : "Masukkan saldo kas awal untuk memulai pembukuan."
      }
      showTab={false}
    >
      {currentStep === 1 && (
        <View>
          <FormField
            label="Nama Bisnis"
            placeholder="Contoh: PT. Berkah Jaya Abadi"
            value={formState.name}
            onChangeText={handlers.setName}
          />

          <SelectField
            label="Status Usaha"
            placeholder="Pilih Status"
            options={[
              { id: "NEW", label: "Usaha Baru (Mulai dari Nol)" },
              { id: "EXISTING", label: "Usaha Sudah Berjalan" },
            ]}
            value={formState.businessStatus}
            onSelect={(opt) => handlers.setBusinessStatus(opt)}
            icon={Wallet}
          />

          <FormField
            label="Deskripsi"
            placeholder="Jelaskan bidang usaha Anda..."
            type="textarea"
            value={formState.description}
            onChangeText={handlers.setDescription}
            style={styles.textArea}
          />

          <Button
            title="Lanjutkan"
            onPress={handlers.handleSetup}
            isLoading={loading}
            style={styles.mt20}
          />
        </View>
      )}

      {currentStep === 2 && <SetupProgress statusMessage={statusMessage} />}

      {currentStep === 3 && (
        <View>
          <Typography variant="body" style={styles.mb20}>
            Berapa saldo kas tunai yang Anda miliki saat ini untuk memulai
            usaha?
          </Typography>

          <FormField
            label="Jumlah Modal (Kas)"
            placeholder="Contoh: 5000000"
            type="number"
            value={formState.initialCapital}
            onChangeText={handlers.setInitialCapital}
          />

          <Button
            title="Simpan & Selesai"
            icon={ArrowRight}
            onPress={handlers.handleSaveInitialCapital}
            isLoading={loading}
            style={styles.mt12}
          />

          <Button
            title="Lewati, Atur Nanti"
            variant="outline"
            onPress={handlers.onSkip}
            disabled={loading}
          />
        </View>
      )}
    </HeroFormTemplate>
  );
};

const styles = StyleSheet.create({
  textArea: { height: 80 },
  mt20: { marginTop: 20 },
  mt12: { marginTop: 12 },
  mb20: { marginBottom: 20 },
});
