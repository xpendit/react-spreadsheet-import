import type XLSX from "xlsx-ugnis"
import { Box, Heading, ModalBody, Text, Button, useStyleConfig } from "@chakra-ui/react"
import { DropZone } from "./components/DropZone"
import { useRsi } from "../../hooks/useRsi"
import { ExampleTable } from "./components/ExampleTable"
import { useCallback, useState } from "react"
import { FadingOverlay } from "./components/FadingOverlay"
import type { themeOverrides } from "../../theme"

type UploadProps = {
  onContinue: (data: XLSX.WorkBook, file: File) => Promise<void>
}

export const UploadStep = ({ onContinue }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyleConfig("UploadStep") as (typeof themeOverrides)["components"]["UploadStep"]["baseStyle"];
  const { translations, fields } = useRsi();
  const handleOnContinue = useCallback(
    async (data: XLSX.WorkBook, file: File) => {
      setIsLoading(true);
      await onContinue(data, file);
      setIsLoading(false);
    },
    [onContinue],
  );

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      fields.map(field => field.label).join(',') + "\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", translations.uploadStep.csvFileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <ModalBody>
      <Heading sx={styles.heading}>{translations.uploadStep.title}</Heading>

      <Box display="flex" gap="16px" justifyContent="space-between">
        <Box>
          <Text sx={styles.title}>{translations.uploadStep.manifestTitle}</Text>
          <Text sx={styles.subtitle}>{translations.uploadStep.manifestDescription}</Text>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-end">
          <Button variant="outline" size="sm" onClick={downloadCSV}>
            {translations.uploadStep.downloadCSVButtonTitle}
          </Button>
        </Box>
      </Box>

      <Box sx={styles.tableWrapper}>
        <ExampleTable fields={fields} />
        <FadingOverlay />
      </Box>
      <DropZone onContinue={handleOnContinue} isLoading={isLoading} />
    </ModalBody>
  )
}
