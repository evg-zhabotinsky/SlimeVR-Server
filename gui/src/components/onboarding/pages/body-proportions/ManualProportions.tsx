import { useForm } from 'react-hook-form';
import { RpcMessage, SkeletonResetAllRequestT } from 'solarxr-protocol';
import { useOnboarding } from '../../../../hooks/onboarding';
import { useWebsocketAPI } from '../../../../hooks/websocket-api';
import { Button } from '../../../commons/Button';
import { CheckBox } from '../../../commons/Checkbox';
import { PersonFrontIcon } from '../../../commons/PersonFrontIcon';
import { Typography } from '../../../commons/Typography';
import { BodyProportions } from './BodyProportions';
import { useLocalization } from '@fluent/react';
import { useEffect, useMemo, useState } from 'react';
import { SkipSetupWarningModal } from '../../SkipSetupWarningModal';
import { SkipSetupButton } from '../../SkipSetupButton';

export function ManualProportionsPage() {
  const { l10n } = useLocalization();
  const { applyProgress, skipSetup, state } = useOnboarding();
  const { sendRPCPacket } = useWebsocketAPI();
  const [skipWarning, setSkipWarning] = useState(false);

  applyProgress(0.9);

  const savedValue = useMemo(() => localStorage.getItem('ratioMode'), []);

  const { control, watch } = useForm<{ precise: boolean; ratio: boolean }>({
    defaultValues: { precise: false, ratio: savedValue !== 'false' },
  });
  const { precise, ratio } = watch();

  const resetAll = () => {
    sendRPCPacket(
      RpcMessage.SkeletonResetAllRequest,
      new SkeletonResetAllRequestT()
    );
  };

  useEffect(() => {
    localStorage.setItem('ratioMode', ratio.toString());
  }, [ratio]);

  return (
    <>
      <div className="flex flex-col gap-5 h-full items-center w-full justify-center relative">
        <SkipSetupButton
          visible={!state.alonePage}
          modalVisible={skipWarning}
          onClick={() => setSkipWarning(true)}
        ></SkipSetupButton>
        <div className="flex flex-col w-full h-full max-w-5xl justify-center">
          <div className="flex gap-8 justify-center">
            <div className="flex flex-col w-full max-w-2xl gap-3 items-center">
              <div className="flex flex-col">
                <Typography variant="main-title">
                  {l10n.getString('onboarding-manual_proportions-title')}
                </Typography>
                <CheckBox
                  control={control}
                  label={l10n.getString('onboarding-manual_proportions-ratio')}
                  name="ratio"
                  variant="toggle"
                ></CheckBox>
                <CheckBox
                  control={control}
                  label={l10n.getString(
                    'onboarding-manual_proportions-precision'
                  )}
                  name="precise"
                  variant="toggle"
                ></CheckBox>
              </div>
              <BodyProportions
                precise={precise}
                type={ratio ? 'ratio' : 'linear'}
                variant={state.alonePage ? 'alone' : 'onboarding'}
              ></BodyProportions>
            </div>
            <div className="flex-col flex-grow gap-3 rounded-xl fill-background-50 items-center hidden md:flex">
              <PersonFrontIcon width={200}></PersonFrontIcon>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button
              variant="secondary"
              state={{ alonePage: state.alonePage }}
              to="/onboarding/body-proportions/choose"
            >
              {l10n.getString('onboarding-previous_step')}
            </Button>
            <Button variant="secondary" onClick={resetAll}>
              {l10n.getString('reset-reset_all')}
            </Button>
            {!state.alonePage && (
              <Button
                variant="primary"
                className="ml-auto"
                to="/onboarding/done"
              >
                {l10n.getString('onboarding-continue')}
              </Button>
            )}
          </div>
        </div>
        <div className="w-full py-4 flex flex-row">
          <div className="flex flex-grow gap-3"></div>
          <div className="flex gap-3"></div>
        </div>
      </div>
      <SkipSetupWarningModal
        accept={skipSetup}
        onClose={() => setSkipWarning(false)}
        isOpen={skipWarning}
      ></SkipSetupWarningModal>
    </>
  );
}
