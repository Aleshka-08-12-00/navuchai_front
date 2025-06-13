import * as React from 'react';
import { observer } from 'mobx-react-lite';
import ContentSettingsMenu from './componets';
import { Context } from '../..';
import GeneralInformationPage from './componets/sub-page/general-information-page';
import YourTrialPage from './componets/sub-page/your-trial-page';
import SubdomainPage from './componets/sub-page/subdomain-page';
import { Box } from "@mui/material";
import { Grid } from "@mui/material";

const SettingsPage = observer(() => {
  const { settingsStore, authStore } = React.useContext(Context);
  



  React.useEffect(() => {
  authStore.authMe()
  }, []);

  return (

    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={1} sm={1} md={1} lg={3}>
          <ContentSettingsMenu />
        </Grid>
        <Grid item xs={11} sm={11} md={11} lg={9}>
          {settingsStore.idSettingsNumberNext === '41' && <GeneralInformationPage />}
          {settingsStore.idSettingsNumberNext === '42' && <YourTrialPage />}
          {settingsStore.idSettingsNumberNext === '44' && <SubdomainPage />}
        </Grid>
      </Grid>
    </Box>

  );
})

export default SettingsPage;

