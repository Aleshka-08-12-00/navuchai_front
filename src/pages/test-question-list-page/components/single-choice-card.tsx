import { Checkbox, IconButton, Radio, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';

import SvgIcon from '@mui/material/SvgIcon';
import React from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import MainCard from "../../../components/MainCard";
import { IQuestionInTest } from "../../../interface/interfaceStore";


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



const SingleChoiceCard = observer(({ index, ...obj }: IQuestionInTest & { index: number }) => {
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
                                <Typography variant="h5">
                                    {/* № {obj.position} */}
                                    № {index}
                                </Typography>
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <Typography variant="h6" color="textSecondary">
                                    Тип:
                                </Typography>
                                <Typography variant="h6">
                                    {obj.question.type}
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    |
                                </Typography>
                                <Typography variant="h6" color="textSecondary">
                                    Баллов:
                                </Typography>
                                <Typography variant="h6">
                                    {obj.max_score}
                                </Typography>
                                <IconButton aria-label="Example">
                                    <FontAwesomeSvgIcon icon={faEllipsisV} />
                                </IconButton>
                            </span>
                        </div>
                        <Stack sx={{ mt: 2, mb: 2, ml: 5 }}>
                            <Example htmlContent={obj.question.text} />
                            {obj.question.answers.allAnswer.map((item: string, index: number) => (
                                <div
                                    key={index}
                                    style={obj.question.answers.correctAnswer.includes(item) ? { backgroundColor: '#e5ffea', borderRadius: 10 } : { borderRadius: 10 }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start", // Выровнять элементы по верхнему краю
                                        }}
                                    >
                                        <Radio
                                            checked={obj.question.answers.correctAnswer.includes(item)}
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
                                        <div style={{ marginTop: 12 }}>
                                            <Example htmlContent={item} />
                                        </div>
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
