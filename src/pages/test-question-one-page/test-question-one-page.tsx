
import { Context } from "../..";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import GeneralSettingsTestPage from "../main-page/page/general-settings-test-page";
import ContentSettingsMainMenu from "../main-page/componets";
import RecordingComponent from "../main-page/page/video-page";
import ConstructorPage from "../main-page/page/constructor-page/constructor-page";






const TestQuestionOnePage = observer(() => {
    const { settingsStore } = React.useContext(Context);
    const { id } = useParams<{ id: string }>();
    const { questionId } = useParams<{ questionId: string }>();
    // path: '/main-page/test/:id/question/:questionId',
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={1} sm={1} md={1} lg={3}>
                        <ContentSettingsMainMenu />
                    </Grid>
                    <Grid item xs={11} sm={11} md={11} lg={9}>
                        <ConstructorPage />
                        {/* {settingsStore.idSettingsNumber === '51' && <GeneralSettingsTestPage />}
                        {settingsStore.idSettingsNumber === '58' && <RecordingComponent />} */}
                        {/* {settingsStore.idSettingsNumber === '52' && <ConstructorPage />} */}

                    </Grid>
                </Grid>
            </Box>

        </>
    )
});
export default TestQuestionOnePage;
