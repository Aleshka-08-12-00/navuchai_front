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

const Example = ({ htmlContent }: { htmlContent: string }) => {
    return (
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
  };



const SingleChoiceCard = observer(({ obj }: any) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    let data = obj.answerConfiguration.answers
    console.log(data)
    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <MainCard contentSX={{ p: 2.25, pt: 3.3 }} onClick={() => navigate(`/main-page/test/${id}/question/1`)} >
                    <>
                        <div style={{ display: 'flex', margin: 'auto', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox />
                                <Typography variant="h5">
                                    № {obj.position}
                                </Typography>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    style={{ textTransform: 'none' }}
                                    size="small"
                                >
                                    {obj.subjects[0].name}
                                </Button>

                                <Typography variant="h6" color="textSecondary">
                                    Тип:
                                    {/* {item.createDate} */}
                                </Typography>
                                <Typography variant="h6">
                                    {obj.questionType}
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
                                    {obj.maxScore}
                                    {/* {item.createDate} */}
                                </Typography>

                                <IconButton aria-label="Example">
                                    <FontAwesomeSvgIcon icon={faEllipsisV} />
                                </IconButton>
                            </span>
                        </div>
                        <Stack sx={{ mt: 2, mb: 2, ml: 5 }}>
                            <Example htmlContent={obj.body} />

                            {data.map((item: any, index: number) => (
                               <div
                               key={index}
                               style={item.correct ? { backgroundColor: '#e5ffea', borderRadius: 10 } : { borderRadius: 10 }}
                             >
                               <div
                                 style={{
                                   display: "flex",
                                   alignItems: "flex-start", // Выровнять элементы по верхнему краю
                                 }}
                               >
                                 <Radio
                                   checked={false}
                                   disabled={true}
                                   name="single-choice-group"
                                   style={{
                                     outline: "none",
                                     boxShadow: "none",
                                     marginTop: 3
                                   }}
                                   sx={{
                                     "&:hover": {
                                       backgroundColor: "transparent",
                                     },
                                   }}
                                 />
                                 <Example htmlContent={item.body} />
                               </div>
                             </div>
                             
                            ))}
                        </Stack>
                    </>
                </MainCard>
            </div>
        </>
    )
});
export default SingleChoiceCard;
