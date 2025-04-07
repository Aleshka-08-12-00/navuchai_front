import { Box, Button, Checkbox, IconButton, Radio, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';

import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import MainCard from "../../../components/MainCard";


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




const MultipleChoiceCard = observer(({ obj }: any) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }} onClick={() => navigate(`/main-page/test/${id}/question/1`)} >
                    <>
                        <div style={{ display: 'flex', margin: 'auto', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox />
                                <Typography variant="h4">
                                    № 2
                                    {/* {item.testName} */}
                                </Typography>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    style={{ textTransform: 'none' }}
                                    size="small"
                                >
                                    product knowledje
                                    {/* {item.status} */}
                                </Button>

                                <Typography variant="h6" color="textSecondary">
                                    Тип:
                                    {/* {item.createDate} */}
                                </Typography>
                                <Typography variant="h6">
                                    Множественный выбор
                                    {/* {item.createDate} */}
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    |
                                    {/* {item.createDate} */}
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    Баллов:
                                    {/* {item.createDate} */}
                                </Typography>
                                <Typography variant="h6">
                                    1
                                    {/* {item.createDate} */}
                                </Typography>

                                <IconButton aria-label="Example">
                                    <FontAwesomeSvgIcon icon={faEllipsisV} />
                                </IconButton>
                            </span>
                        </div>
                        <Stack sx={{ mt: 2, mb: 2, ml: 5 }}>
                            <Typography variant="h6" color="textSecondary">
                                Строение черепа у черепахи
                                {/* {item.testName} */}
                            </Typography>
                            <div style={{ marginTop: 10 }}>
                                <img style={{ width: 200, borderRadius: 10 }} src="https://steamuserimages-a.akamaihd.net/ugc/1826772585305932646/CCB6B011FA2BF21D1CC5D4D8D4F945128425D146/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 5
                                }}
                            >
                                <Checkbox  disabled />
                                <Typography variant="h6" color="textSecondary">
                                    Сложное
                                    {/* {item.testName} */}
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: '#e5ffea',
                                    borderRadius: 10,
                                    marginBottom: 5
                                }}
                            >
                                <Checkbox disabled />
                                <Typography variant="h6" color="textSecondary">
                                    Простое
                                    {/* {item.testName} */}
                                </Typography>
                            </div>
                            <div style={{ backgroundColor: '#e5ffea', borderRadius: 10 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Checkbox disabled />
                                    <Typography variant="h6" color="textSecondary">
                                        Странное
                                        {/* {item.testName} */}
                                    </Typography>

                                </div>
                                <div style={{ marginLeft: 40, marginBottom: 10 }}>
                                    <img style={{ width: 200, borderRadius: 10 }} src="https://steamuserimages-a.akamaihd.net/ugc/1826772585305932646/CCB6B011FA2BF21D1CC5D4D8D4F945128425D146/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" />
                                </div>
                            </div>
                        </Stack>
                    </>
                </MainCard>
            </div>
        </>
    )
});
export default MultipleChoiceCard;
