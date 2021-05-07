import * as React from 'react';
import { Column, Columns } from 'bloomer';
import * as filestack from 'filestack-js';
import SuccessModal from '@app/components/SuccessModal';
import { useEffect } from 'react';
import keyboardControl from '@app/util/keybordControl';

const FileDashboard = () => {
  const [client, setClient] = React.useState<filestack.Client | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);


  React.useEffect(() => {
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

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (client) {
      const picker = client.picker({
        accept: 'application/pdf',
        fromSources: ['googledrive', 'box', 'onedrive'],
        displayMode: filestack.PickerDisplayMode.inline,
        container: '#filepicker',
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
          }
        },
      });

      picker.open()
    }
  }, [client]);

  const handleLogout = async () => {
    if (client) {
      await client.logout();
      const params = new URLSearchParams();
      if ((window as any).vuplex) {
        (window as any).vuplex.postMessage({
          type: 'closeWebApp',
        });
      }
      params.set('close', 't');
      window.location.hash = params.toString();
    }
  };

  return (
    <Columns className="file-dashboard">
      <Column isFullWidth>
        <div id="filepicker"></div>
        <SuccessModal
          isActive={showModal}
          onAccept={() => setShowModal(false)}
          onCancel={handleLogout}
          acceptText="Add Another File"
          cancelText="Done"
          message="Successfully added to My Files"
        />
      </Column>
    </Columns>
  );
};

export default FileDashboard;
