


import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import React, { useState } from "react";
import ContentSettingsMainMenu from "./componets";
import { Context } from "../..";
import GeneralSettingsTestPage from "./page/general-settings-test-page";
import RecordingComponent from "./page/video-page";
import ConstructorPage from "./page/constructor-page/constructor-page";
import TestStartPage from "./page/test-start-page";


const ContentPage = observer(({testId}: any) => {
     const { settingsStore } = React.useContext(Context);

  return (
    <>
        <Grid container spacing={2}>
            <Grid item xs={1} sm={1} md={1} lg={3}>
            <ContentSettingsMainMenu />
            </Grid>
            <Grid item xs={11} sm={11} md={11} lg={9}>
            {settingsStore.idSettingsNumber === '51' && <GeneralSettingsTestPage/>}
            {settingsStore.idSettingsNumber === '58' && <RecordingComponent/>}
            {settingsStore.idSettingsNumber === '52' && <ConstructorPage/>} 
            {settingsStore.idSettingsNumber === '55' && <TestStartPage/>}
      
            </Grid>
        </Grid> 
    </>
  )
});
export default ContentPage;
