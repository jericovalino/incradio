import ModalCard, { type ModalCardProps } from './ModalCard';

import { DialogActions } from '../input_controls';

type DialogCardProps = {
  yesLabel?: string;
  noLabel?: string;
  onYes: () => void;
  onNo: () => void;
  message?: string;
  question?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
} & Pick<
  ModalCardProps,
  'onClose' | 'size' | 'theme' | 'title' | 'roundedSize'
>;

const DialogCard = ({
  onNo,
  onYes,
  onClose,
  roundedSize,
  title,
  message,
  question,
  size = 'sm',
  noLabel = 'No',
  yesLabel = 'Yes',
  theme = 'primary',
  children = null,
  isLoading = false,
}: DialogCardProps) => {
  return (
    <ModalCard
      size={size}
      theme={theme}
      title={title}
      onClose={onClose}
      roundedSize={roundedSize}
    >
      <div className="mb-6 space-y-3 text-gray-600">
        {!!message && <p className="text-sm">{message}</p>}
        {!!question && (
          <h6 className="text-sm font-semibold leading-4">{question}</h6>
        )}
        {children}
      </div>
      <DialogActions
        noTheme="default"
        onNo={onNo}
        noLabel={noLabel}
        yesTheme={theme === 'float' ? 'default' : theme}
        onYes={onYes}
        yesLabel={yesLabel}
        isLoading={isLoading}
      />
    </ModalCard>
  );
};

export default DialogCard;
