import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { Assessment, assessmentSchema, MOBILITY } from './schema';

export type AssessmentFormValues = {
  [K in keyof Assessment]: Assessment[K] extends boolean
    ? boolean
    : Assessment[K] extends number
      ? number | ''
      : Assessment[K] | '';
};

export const SAMPLE_PATIENT: Assessment = {
  mrn: 'MRN-004821',
  patientName: 'Sushila Deshpande',
  dateOfBirth: '1949-03-12',
  assessmentDate: '2026-08-07',
  mobility: 'cane',
  barthelIndex: 80,
  medicationCount: 3,
  pharmacistReviewRequested: false,
  followUpDate: '2026-09-04',
  consentObtained: true,
};

const initialValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: '',
  assessmentDate: '',
  mobility: '',
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: '',
  consentObtained: false as unknown as true,
};

const mobilityOptions = MOBILITY.map((value) => ({
  value,
  label: value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' '),
}));

interface AssessmentFormProps {
  onSave?: (savedAssessment: Assessment) => void;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [submittedData, setSubmittedData] = useState<Assessment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssessmentFormValues>({
    mode: 'uncontrolled',
    validateInputOnBlur: true,
    validate: schemaResolver(assessmentSchema),
    initialValues,
  });

  const handleSubmit = async (values: AssessmentFormValues) => {
    setIsSubmitting(true);
    setSubmittedData(null);
    try {
      const parsed = assessmentSchema.parse(values);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedData(parsed);
      onSave?.(parsed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadSample = () => {
    form.setValues({
      ...SAMPLE_PATIENT,
    });
    form.clearErrors();
  };

  return (
    <Container size="sm" my="xl">
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Title order={2} mb="lg">
          Geriatric Care Assessment
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              key={form.key('mrn')}
              {...form.getInputProps('mrn')}
            />

            <TextInput
              label="Patient name"
              key={form.key('patientName')}
              {...form.getInputProps('patientName')}
            />

            <DateInput
              label="Date of birth"
              valueFormat="YYYY-MM-DD"
              key={form.key('dateOfBirth')}
              {...form.getInputProps('dateOfBirth')}
            />

            <DateInput
              label="Assessment date"
              valueFormat="YYYY-MM-DD"
              maxDate="2026-10-12"
              key={form.key('assessmentDate')}
              {...form.getInputProps('assessmentDate')}
            />

            <Select
              label="Mobility"
              placeholder="Select mobility status"
              data={mobilityOptions}
              key={form.key('mobility')}
              {...form.getInputProps('mobility')}
            />

            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              clampBehavior="none"
              key={form.key('barthelIndex')}
              {...form.getInputProps('barthelIndex')}
            />

            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              clampBehavior="none"
              key={form.key('medicationCount')}
              {...form.getInputProps('medicationCount')}
            />

            <Checkbox
              label="Pharmacist review requested"
              key={form.key('pharmacistReviewRequested')}
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />

            <DateInput
              label="Next review date"
              valueFormat="YYYY-MM-DD"
              key={form.key('followUpDate')}
              {...form.getInputProps('followUpDate')}
            />

            <Checkbox
              label="Patient or representative has given consent"
              key={form.key('consentObtained')}
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Group justify="space-between" mt="md">
              <Button
                type="button"
                variant="light"
                onClick={handleLoadSample}
                disabled={isSubmitting}
              >
                Load sample patient
              </Button>
              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                Save Assessment
              </Button>
            </Group>

            {submittedData && (
              <Alert
                title="Assessment Saved Successfully"
                color="green"
                mt="md"
                data-testid="success-alert"
              >
                <Code block mt="xs" data-testid="parsed-output">
                  {JSON.stringify(submittedData, null, 2)}
                </Code>
              </Alert>
            )}
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
