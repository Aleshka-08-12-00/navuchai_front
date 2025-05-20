import { Context } from "../..";
import { Box, Button, Checkbox, IconButton, Radio, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MainCard from "../../components/MainCard";

import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import SingleChoiceCard from "./components/single-choice-card";
import MultipleChoiceCard from "./components/multiple-choice-card";
import { IQuestionInTest } from "../../interface/interfaceStore";


type FontAwesomeSvgIconProps = {
    icon: any;
};

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
    (props, ref) => {
        const { icon } = props;

        const {
            icon: [width, height, , , svgPathData],
        } = icon;

        return (
            <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
                {typeof svgPathData === 'string' ? (
                    <path d={svgPathData} />
                ) : (
                    svgPathData.map((d: string, i: number) => (
                        <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
                    ))
                )}
            </SvgIcon>
        );
    },
);




const TestQuestionListPage = observer(() => {
    console.log('TestQuestionListPage rendered');
    const { settingsStore, testQuestionListPageStore } = React.useContext(Context);
    const { getQuestionListByTestId, questionArray } = testQuestionListPageStore
    // const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    React.useEffect(() => {
        console.log('useEffect triggered with id:', id);
        getQuestionListByTestId(Number(id))
    }, [id]);
    

    // path: '/main-page/test/:id/question/:questionId',

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ cursor: 'pointer' }} >
                        {questionArray.length && questionArray.map((item: IQuestionInTest, index: number) => {
                            if (item.question.type === "single_choice" || item.question.type === "SINGLE_CHOICE") {
                                return <SingleChoiceCard key={`single-${index}`} {...item} index={index} />;
                            }

                            if (item.question.type === "multiple_choice" || item.question.type === "MULTIPLE_CHOICE") {
                                return <MultipleChoiceCard key={`multi-${index}`} {...item} index={index} />;
                            }

                            return null; // Если ни один из типов не совпадает, ничего не рендерим
                        })}


                    </Grid>

                </Grid>
            </Box>

        </>
    )
});
export default TestQuestionListPage;
