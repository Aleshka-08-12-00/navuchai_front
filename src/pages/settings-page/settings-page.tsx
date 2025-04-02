import * as React from 'react';
import { observer } from 'mobx-react-lite';
import ContentSettingsMenu from './componets';
import { Context } from '../..';
import GeneralInformationPage from './componets/page/general-information-page';
import YourTrialPage from './componets/page/your-trial-page';
import SubdomainPage from './componets/page/subdomain-page';
import { Box } from "@mui/material";
import { Grid } from "@mui/material";

const SettingsPage = observer(() => {
     const { settingsStore } = React.useContext(Context);

 

  React.useEffect(() => {

}, []);

  return (
   
       <Box sx={{ flexGrow: 1 }}>
        {/* <Grid item xs={12} sx={{ mb: 2 }}>
          
        </Grid> */}
        <Grid container spacing={2}>
            <Grid item xs={1} sm={1} md={1} lg={3}>
            <ContentSettingsMenu />
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={9}>
            {settingsStore.idSettingsNumber === '41' && <GeneralInformationPage/>}
        {settingsStore.idSettingsNumber === '42' && <YourTrialPage/>}
        {settingsStore.idSettingsNumber === '44' && <SubdomainPage/>}
            </Grid>
        </Grid>
      </Box>

  );
})

export default SettingsPage;

