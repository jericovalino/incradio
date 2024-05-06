import Button from './Button';

type DialogActionsProps = {
  yesLabel?: string;
  noLabel?: string;
  onYes: () => void;
  onNo: () => void;
  yesTheme?: React.ComponentPropsWithRef<typeof Button>['theme'];
  noTheme?: React.ComponentPropsWithRef<typeof Button>['theme'];
  isLoading?: boolean;
};

const DialogActions = ({
  onNo,
  onYes,
  noTheme = 'default',
  yesTheme = 'primary',
  noLabel = 'No',
  yesLabel = 'Yes',
  isLoading = false,
}: DialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button theme={noTheme} onClick={onNo} disabled={isLoading}>
        {noLabel}
      </Button>
      <Button theme={yesTheme} onClick={onYes} disabled={isLoading}>
        {yesLabel}
      </Button>
    </div>
  );
};

export default DialogActions;
