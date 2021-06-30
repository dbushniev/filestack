import * as React from 'react';
import { Column, Columns } from 'bloomer';
import * as filestack from 'filestack-js';
import SuccessModal from '@app/components/SuccessModal';
import { useEffect, useState } from 'react';
import keyboardControl from '@app/util/keybordControl';
import getElementParents from '@app/util/getElementParents';
import { BUTTONS_CLASSNAMES } from '@app/config/buttons';
import audioSound from '@app/util/audioSound';
import scrollControl from '@app/util/scrollControl';
import Click from '@app/assets/click.mp3';

const FileDashboard = () => {
  const [client, setClient] = useState<filestack.Client | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const addVuplexListener = () => {
    (window as any).vuplex.addEventListener('message', () => {
      setShowModal(true);
    });
  };

  const handleButtonClick = (e: MouseEvent) => {
    const parents: HTMLElement[] =  getElementParents(e.target as HTMLElement);
    parents.forEach((element) => {
      if (BUTTONS_CLASSNAMES.some((className) => element.className.includes(className))) audioSound();
    })
  }

  const handleLogout = async () => {
    if (client) {
      // await client.logout();
      const params = new URLSearchParams();
      if ((window as any).vuplex) {
        (window as any).vuplex.postMessage({
          type: 'closeWebApp',
        });
      }
      params.set('close', 't');
      window.location.hash = params.toString();
      setShowModal(false);
    }
  };

  const handleCancel = () => setShowModal(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const apiKey = params.get('apiKey');
    if (apiKey) {
      setClient(filestack.init(apiKey, { sessionCache: true }));
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', scrollControl);
    document.addEventListener('keydown', keyboardControl);
    document.addEventListener('click', handleButtonClick);
    if ((window as any).vuplex) {
      addVuplexListener();
    } else {
      window.addEventListener('vuplexready', addVuplexListener);
    }
    return () => {
      document.removeEventListener('keydown', scrollControl);
      document.removeEventListener('keydown', keyboardControl);
      document.removeEventListener('click', handleButtonClick);
      window.removeEventListener('vuplexready', addVuplexListener);
    }
  }, []);

  useEffect(() => {
    if (client) {
      const picker = client.picker({
        accept: 'application/pdf',
        fromSources: ['googledrive'],
        displayMode: filestack.PickerDisplayMode.inline,
        container: '#filepicker',
        viewType: 'grid',
        onUploadDone: ({ filesUploaded }) => {
          if (filesUploaded.length) {
            const params = new URLSearchParams();
            params.set('handle', filesUploaded[0].handle);
            params.set('name', filesUploaded[0].filename);
            if ((window as any).vuplex) {
              (window as any).vuplex.postMessage({
                type: 'uploadSignal',
                handle: filesUploaded[0].handle,
                name: filesUploaded[0].filename,
              });
            }
            window.location.hash = params.toString();
            setShowModal(true);
          }
        },
      });

      picker.open()
    }
  }, [client]);

  return (
    <Columns className="file-dashboard">
      <Column isFullWidth className='p-unset'>
        <div id="filepicker"></div>
        <SuccessModal
          isActive={showModal}
          onAccept={handleCancel}
          onCancel={handleLogout}
          acceptText="Add Another File"
          cancelText="Done"
          message="Successfully added to My Files"
        />
        <audio><source src={Click} type="audio/mpeg" /></audio>
      </Column>
    </Columns>
  );
};

export default FileDashboard;
