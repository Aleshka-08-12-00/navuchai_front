


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
import { useParams } from "react-router-dom";



const ContentPage = observer(({ testId }: any) => {
  const { settingsStore } = React.useContext(Context);
  const { setIdSettingsNumber, idSettingsNumber  } = settingsStore;
   const { id } = useParams<{ id: string }>();
   const { questionId } = useParams<{ questionId: string }>();

  React.useEffect(() => {
    if(id && questionId){
      setIdSettingsNumber('52');
    }
  }, [id, questionId ]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2} sm={2} md={2} lg={3}>
          <ContentSettingsMainMenu />
        </Grid>
        <Grid item xs={10} sm={10} md={10} lg={9}>
          {idSettingsNumber === '51' && <GeneralSettingsTestPage />}
          {idSettingsNumber === '52' && <ConstructorPage />}
          {idSettingsNumber === '53' && <TestSetsPage />}
          {idSettingsNumber === '54' && <TestAccessPage />}
          {idSettingsNumber === '55' && <TestStartPage />}
          {idSettingsNumber === '56' && <GradingSummaryPage />}
          {idSettingsNumber === '57' && <TimeSettingsPage />}
          {idSettingsNumber === '58' && <RecordingComponent />}

        </Grid>
      </Grid>
    </>
  )
});
export default ContentPage;
