import { render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { AssessmentForm, SAMPLE_PATIENT } from './AssessmentForm';

describe('AssessmentForm integration tests', () => {
  it('loads sample patient, submits, and calls save handler with parsed values', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(<AssessmentForm onSave={handleSave} />);

    const loadSampleButton = screen.getByRole('button', { name: /load sample patient/i });
    await user.click(loadSampleButton);

    const submitButton = screen.getByRole('button', { name: /save assessment/i });
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(handleSave).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 }
    );

    expect(handleSave).toHaveBeenCalledWith(SAMPLE_PATIENT);

    expect(await screen.findByTestId('success-alert')).toBeInTheDocument();
    expect(screen.getByTestId('parsed-output')).toHaveTextContent('MRN-004821');
  });

  it('displays exactly 9 field errors when an empty form is submitted', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(<AssessmentForm onSave={handleSave} />);

    const submitButton = screen.getByRole('button', { name: /save assessment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Must look like MRN-004821')).toBeInTheDocument();
      expect(screen.getByText('Patient name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Date of birth is required')).toBeInTheDocument();
      expect(screen.getByText('Assessment date is required')).toBeInTheDocument();
      expect(screen.getByText('Select a mobility status')).toBeInTheDocument();
      expect(screen.getByText('Barthel Index score is required')).toBeInTheDocument();
      expect(screen.getByText('Enter the number of regular medications')).toBeInTheDocument();
      expect(screen.getByText('Next review date is required')).toBeInTheDocument();
      expect(
        screen.getByText('Consent must be obtained before the assessment can be saved')
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(
        'Five or more medications is polypharmacy: a pharmacist review is required'
      )
    ).not.toBeInTheDocument();

    expect(handleSave).not.toHaveBeenCalled();
  });

  it('does not silently clamp clinical scores and displays error on 105', async () => {
    const user = userEvent.setup();
    render(<AssessmentForm />);

    const loadSampleButton = screen.getByRole('button', { name: /load sample patient/i });
    await user.click(loadSampleButton);

    const barthelInput = screen.getByLabelText(/barthel index/i);
    await user.clear(barthelInput);
    await user.type(barthelInput, '105');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Barthel Index ranges from 0 to 100')).toBeInTheDocument();
    });
    expect(barthelInput).toHaveValue('105');
  });
});
