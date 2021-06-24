import * as React from 'react';
import { Column, Columns } from 'bloomer';
import * as filestack from 'filestack-js';
import SuccessModal from '@app/components/SuccessModal';
import { useEffect, useState } from 'react';
import keyboardControl from '@app/util/keybordControl';
import getElementParents from '@app/util/getElementParents';
import { BUTTONS_CLASSNAMES } from '@app/config/buttons';
import audioSound from '@app/util/audioSound';

const FileDashboard = () => {
  const [client, setClient] = useState<filestack.Client | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const apiKey = params.get('apiKey');
    if (apiKey) {
      setClient(filestack.init(apiKey, { sessionCache: true }));
    }
  }, []);

  const addVuplexListener = () => {
    (window as any).vuplex.addEventListener('message', () => {
      setShowModal(true);
    });
  };

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const parents: HTMLElement[] =  getElementParents(e.target as HTMLElement);
      parents.forEach((element) => {
        if (BUTTONS_CLASSNAMES.some((className) => element.className.includes(className))) audioSound();
      })
    })
  }, [])

  useEffect(() => {
    if ((window as any).vuplex) {
      addVuplexListener();
    } else {
      window.addEventListener('vuplexready', addVuplexListener);
    }

    return () => {
      window.removeEventListener('vuplexready', addVuplexListener);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keyboardControl);
    return () => document.removeEventListener('keydown', keyboardControl);
  }, [])

  useEffect(() => {
    if (client) {
      const picker = client.picker({
        accept: 'application/pdf',
        fromSources: ['googledrive', 'box', 'onedrive'],
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
        <audio><source src="/public/click.mp3" type="audio/mpeg" /></audio>
      </Column>
    </Columns>
  );
};

export default FileDashboard;
