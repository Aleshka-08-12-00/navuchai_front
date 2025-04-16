

import newTestSettingsMenu from './menu-items';
import Navigation from './Navigation';
import SimpleBarSettings from './third-party/SimpleBarSettings';
// import menuItemsSettings from '../menu-items';

// ==============================|| DRAWER CONTENT ||============================== //

export default function ContentSettingsMainMenu() {
  return (
    <>
      <SimpleBarSettings sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <Navigation  menuItemsSettings={newTestSettingsMenu} />
      </SimpleBarSettings>
    </>
  );
}
