


import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import React, { useState } from "react";
import ContentSettingsMainMenu from "./componets";
import { Context } from "../..";
import GeneralSettingsTestPage from "./page/general-settings-test-page";
import RecordingComponent from "./page/video-page";
import ConstructorPage from "./page/constructor-page/constructor-page";
import TestStartPage from "./page/test-start-page/test-start-page";
import GradingSummaryPage from "./page/grading-summary-page/grading-summary-page";
import TimeSettingsPage from "./page/time-settings-page/time-settings-page";


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
            {settingsStore.idSettingsNumber === '56' && <GradingSummaryPage/>}
            {settingsStore.idSettingsNumber === '57' && <TimeSettingsPage/>}
      
            </Grid>
        </Grid> 
    </>
  )
});
export default ContentPage;
