import * as React from 'react';
import { observer } from 'mobx-react-lite';
import ContentSettingsMenu from './componets';
import { Context } from '../..';
import GeneralInformationPage from './componets/page/general-information-page';
import YourTrialPage from './componets/page/your-trial-page';
import SubdomainPage from './componets/page/subdomain-page';

const SettingsPage = observer(() => {
     const { settingsStore } = React.useContext(Context);

 

  React.useEffect(() => {

}, []);

  return (
    <div style={{display: 'flex'}}>
    <div style={{width: 250,  height: '100vw'}}>
    <ContentSettingsMenu />
    </div>
    <div style={{paddingLeft: 15}}>
        {settingsStore.idSettingsNumber === '41' && <GeneralInformationPage/>}
        {settingsStore.idSettingsNumber === '42' && <YourTrialPage/>}
        {settingsStore.idSettingsNumber === '44' && <SubdomainPage/>}
    </div>

   
   
    </div>
  );
})

export default SettingsPage;

