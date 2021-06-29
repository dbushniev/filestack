import * as React from 'react';
import {
  Modal,
  ModalBackground,
  ModalContent,
  Card,
  CardContent,
  Button,
  Columns,
  Column,
  Title,
  Media,
  MediaContent,
  Image,
} from 'bloomer';

import DriveLogo from '@app/assets/gdrive_logo.png';

interface ModalProps {
  isActive: boolean;
  onAccept?: () => void;
  onCancel?: () => void;
  message?: string;
  acceptText?: string;
  cancelText?: string;
}

const SuccessModal = (props: ModalProps) => {
  return (
    <Modal isActive={props.isActive} className="success-modal dolce-vita">
      <ModalBackground />
      <ModalContent>
        <Card>
          <CardContent>
            <Media>
              <MediaContent style={{ justifyContent: 'center', display: 'flex' }}>
                <img src={DriveLogo} className='success-modal-img' />
              </MediaContent>
            </Media>
            <Columns isMultiline>
              <Column className="is-full has-text-centered">
                <Title isSize={5}>{props.message}</Title>
              </Column>
              <Column
                isDisplay="flex"
                className="is-full button-container is-justify-content-center"
              >
                <Button
                  isSize="medium"
                  isColor="primary"
                  onClick={props.onAccept}
                >
                  {props.acceptText}
                </Button>
                <Button isSize="medium" onClick={props.onCancel}>
                  {props.cancelText}
                </Button>
              </Column>
            </Columns>
          </CardContent>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default SuccessModal;
