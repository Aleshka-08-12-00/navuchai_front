


import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import React, { useState } from "react";
import ContentSettingsMainMenu from "./componets";
import { Context } from "../..";
import GeneralSettingsTestPage from "./sub-page/general-settings-test-page";
import RecordingComponent from "./sub-page/video-page";
import ConstructorPage from "./sub-page/constructor-page/constructor-page";
import TestStartPage from "./sub-page/test-start-page/test-start-page";
import GradingSummaryPage from "./sub-page/grading-summary-page/grading-summary-page";
import TimeSettingsPage from "./sub-page/time-settings-page/time-settings-page";
import TestSetsPage from "./sub-page/test-sets-page/test-sets-page";
import TestAccessPage from "./sub-page/test-access-page/test-access-page";


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
            {settingsStore.idSettingsNumber === '53' && <TestSetsPage/>}
            {settingsStore.idSettingsNumber === '54' && <TestAccessPage/>}
      
            </Grid>
        </Grid> 
    </>
  )
});
export default ContentPage;
