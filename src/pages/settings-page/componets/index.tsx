


import Navigation from './Navigation';
import SimpleBarSettings from './third-party/SimpleBarSettings';

// ==============================|| DRAWER CONTENT ||============================== //

export default function ContentSettingsMenu() {
  return (
    <>
      <SimpleBarSettings sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <Navigation />
      </SimpleBarSettings>
    </>
  );
}
